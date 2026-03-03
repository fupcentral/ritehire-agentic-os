/**
 * generate-linkedin-visual
 * ─────────────────────────────────────────────────────────────────────────────
 * Supabase Edge Function — RiteHire Agentic OS
 *
 * Receives a visual brief from the linkedin-image-brief skill, calls Google's
 * Nano Banana Pro (Gemini 3 Pro Image) to generate a brand-locked LinkedIn
 * image, uploads to Google Drive /Deliverables/, and returns the Drive file URL
 * for review in the dashboard.
 *
 * Endpoint: POST /functions/v1/generate-linkedin-visual
 * Auth:     Supabase JWT (anon key from dashboard frontend)
 *
 * Environment variables (stored in Supabase vault):
 *   GEMINI_API_KEY         — Google AI Studio API key (aistudio.google.com)
 *   GOOGLE_DRIVE_FOLDER_ID — /Deliverables/ folder ID in Google Drive
 *   GOOGLE_SERVICE_ACCOUNT — JSON string of GCP service account credentials
 *
 * Model: Nano Banana Pro (gemini-3-pro-image-preview)
 * Fallback: Nano Banana 2 (gemini-3.1-flash-image-preview) — faster, lower cost
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ─── Constants ────────────────────────────────────────────────────────────────

// Nano Banana Pro — highest quality, best for brand-accurate visuals
const NANO_BANANA_PRO_MODEL = "gemini-3-pro-image-preview";
// Nano Banana 2 — faster + cheaper, use as fallback or for iteration
const NANO_BANANA_2_MODEL = "gemini-3.1-flash-image-preview";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VisualBrief {
  post_id: string;           // e.g. "Wk1-Post1"
  visual_type: string;       // "single image" | "carousel"
  visual_concept: string;    // 1-sentence description
  on_image_copy: {
    headline: string;
    bullets: string[];       // max 3
    footer: string;          // always "RiteHire — Pakistan EOR/Payroll/Compliance"
  };
  generation_prompt: string; // full brand-locked prompt from linkedin-image-brief skill
  export_specs: {
    width: number;           // 1200 for single, 1080 for carousel
    height: number;          // 1200 for single, 1350 for carousel
    margins: number;         // always 80
  };
  model?: "pro" | "flash";   // optional: "pro" = Nano Banana Pro, "flash" = Nano Banana 2
}

interface GenerateResponse {
  success: boolean;
  post_id: string;
  image_url: string;         // Drive CDN URL (permanent)
  drive_url?: string;        // Google Drive webViewLink
  drive_file_id?: string;
  model_used?: string;
  error?: string;
}

interface GeminiImagePart {
  inline_data?: {
    mime_type: string;
    data: string;            // base64-encoded image bytes
  };
  text?: string;
}

// ─── Nano Banana Pro: Image Generation ───────────────────────────────────────

/**
 * Maps visual brief dimensions to Gemini aspectRatio parameter.
 * Gemini accepts: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "4:5" | "5:4"
 */
function getAspectRatio(brief: VisualBrief): string {
  const isCarousel = brief.visual_type.toLowerCase().includes("carousel");
  // 1080×1350 carousel ≈ 4:5; 1200×1200 single = 1:1
  return isCarousel ? "4:5" : "1:1";
}

/**
 * Calls Nano Banana Pro (or Nano Banana 2 fallback) to generate a brand-locked
 * LinkedIn visual. Returns raw base64 image data.
 */
async function generateWithNanoBanana(
  brief: VisualBrief,
  apiKey: string
): Promise<{ base64Data: string; mimeType: string; modelUsed: string }> {
  const useFlash = brief.model === "flash";
  const model = useFlash ? NANO_BANANA_2_MODEL : NANO_BANANA_PRO_MODEL;
  const endpoint = `${GEMINI_API_BASE}/${model}:generateContent`;
  const aspectRatio = getAspectRatio(brief);

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: brief.generation_prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio,
      },
    },
  };

  console.log(
    `[generate-linkedin-visual] Calling ${model} (${aspectRatio}) for post ${brief.post_id}`
  );

  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errText = await response.text();

    // If Pro model fails (e.g., quota), auto-retry with Nano Banana 2
    if (!useFlash && (response.status === 429 || response.status === 503)) {
      console.warn(
        `[generate-linkedin-visual] Nano Banana Pro quota/unavailable — retrying with Nano Banana 2`
      );
      return generateWithNanaBanana({ ...brief, model: "flash" }, apiKey);
    }

    throw new Error(`Nano Banana API error (${response.status}): ${errText}`);
  }

  const data = await response.json();

  // Extract image part from response candidates
  const candidates = data.candidates ?? [];
  if (candidates.length === 0) {
    throw new Error(
      `Nano Banana returned no candidates. Finish reason: ${data.promptFeedback?.blockReason ?? "unknown"}`
    );
  }

  const parts: GeminiImagePart[] = candidates[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inline_data?.mime_type?.startsWith("image/"));

  if (!imagePart?.inline_data) {
    // Log what we actually got back to help debug
    const textParts = parts.filter((p) => p.text).map((p) => p.text);
    throw new Error(
      `Nano Banana returned no image data. Text response: "${textParts.join(" ")}"`
    );
  }

  return {
    base64Data: imagePart.inline_data.data,
    mimeType: imagePart.inline_data.mime_type,
    modelUsed: model,
  };
}

// Alias for recursive retry call (avoids TypeScript "used before defined" issue)
const generateWithNanaBanana = generateWithNanoBanana;

// ─── Google Drive Upload ──────────────────────────────────────────────────────

async function uploadToDrive(
  imageBytes: Uint8Array,
  mimeType: string,
  filename: string,
  folderId: string,
  serviceAccountJson: string
): Promise<{ fileId: string; webViewLink: string }> {
  const credentials = JSON.parse(serviceAccountJson);

  const accessToken = await getServiceAccountToken(credentials, [
    "https://www.googleapis.com/auth/drive.file",
  ]);

  const metadata = {
    name: filename,
    parents: [folderId],
    mimeType,
  };

  const boundary = "boundary_ritehire_linkedin_visual";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart =
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(metadata);

  const imagePart = `Content-Type: ${mimeType}\r\n\r\n`;

  const encoder = new TextEncoder();
  const parts = [
    encoder.encode(delimiter + metadataPart + delimiter + imagePart),
    imageBytes,
    encoder.encode(closeDelimiter),
  ];

  const totalLength = parts.reduce((sum, p) => sum + p.byteLength, 0);
  const body = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.byteLength;
  }

  const uploadRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Drive upload failed (${uploadRes.status}): ${err}`);
  }

  const driveData = await uploadRes.json();
  return { fileId: driveData.id, webViewLink: driveData.webViewLink };
}

// ─── Service Account JWT ──────────────────────────────────────────────────────

async function getServiceAccountToken(
  credentials: {
    client_email: string;
    private_key: string;
    token_uri?: string;
  },
  scopes: string[]
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = credentials.token_uri ?? "https://oauth2.googleapis.com/token";

  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = btoa(
    JSON.stringify({
      iss: credentials.client_email,
      sub: credentials.client_email,
      scope: scopes.join(" "),
      aud: tokenUri,
      iat: now,
      exp: now + 3600,
    })
  );

  const signingInput = `${header}.${claim}`;

  const pemContents = credentials.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const keyBytes = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBytes = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const signature = btoa(String.fromCharCode(...new Uint8Array(sigBytes)));
  const jwt = `${signingInput}.${signature}`;

  const tokenRes = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Service account token exchange failed: ${err}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let brief: VisualBrief;
  try {
    brief = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!brief.post_id || !brief.generation_prompt) {
    return new Response(
      JSON.stringify({
        error: "Missing required fields: post_id, generation_prompt",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Load secrets from Supabase vault
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  const driveFolderId = Deno.env.get("GOOGLE_DRIVE_FOLDER_ID");
  const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT");

  if (!geminiApiKey) {
    return new Response(
      JSON.stringify({
        error:
          "GEMINI_API_KEY not configured. Get your key at aistudio.google.com, then run: supabase secrets set GEMINI_API_KEY=<your-key> --project-ref vledjjqhycdkzgwwwlvu",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Step 1: Generate image via Nano Banana Pro
    const { base64Data, mimeType, modelUsed } = await generateWithNanoBanana(
      brief,
      geminiApiKey
    );
    console.log(`[generate-linkedin-visual] Generated via ${modelUsed}`);

    // Decode base64 to bytes for Drive upload
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Step 2: Upload to Google Drive (if credentials available)
    let driveUrl: string | undefined;
    let driveFileId: string | undefined;
    const ext = mimeType.includes("jpeg") ? "jpg" : "png";
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `linkedin-visual_${brief.post_id}_${dateStr}.${ext}`;

    if (driveFolderId && serviceAccountJson) {
      const driveResult = await uploadToDrive(
        imageBytes,
        mimeType,
        filename,
        driveFolderId,
        serviceAccountJson
      );
      driveUrl = driveResult.webViewLink;
      driveFileId = driveResult.fileId;
      console.log(`[generate-linkedin-visual] Uploaded to Drive: ${driveUrl}`);
    } else {
      console.warn(
        "[generate-linkedin-visual] GOOGLE_DRIVE_FOLDER_ID or GOOGLE_SERVICE_ACCOUNT not set — skipping Drive upload"
      );
    }

    const response: GenerateResponse = {
      success: true,
      post_id: brief.post_id,
      image_url: driveUrl ?? "",
      drive_url: driveUrl,
      drive_file_id: driveFileId,
      model_used: modelUsed,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error(`[generate-linkedin-visual] Error:`, err);
    return new Response(
      JSON.stringify({
        success: false,
        post_id: brief.post_id,
        image_url: "",
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});

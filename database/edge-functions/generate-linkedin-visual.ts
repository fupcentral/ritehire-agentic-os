/**
 * generate-linkedin-visual
 * ─────────────────────────────────────────────────────────────────────────────
 * Supabase Edge Function — RiteHire Agentic OS
 *
 * Receives a visual brief from the linkedin-draft-post skill, calls fal.ai
 * Flux Pro to generate a brand-locked LinkedIn image, uploads to Google Drive
 * /Deliverables/, and returns the Drive file URL for review in Lovable.
 *
 * Endpoint: POST /functions/v1/generate-linkedin-visual
 * Auth:     Supabase JWT (anon key from Lovable frontend)
 *
 * Environment variables (stored in Supabase vault):
 *   FAL_API_KEY            — fal.ai API key
 *   GOOGLE_DRIVE_FOLDER_ID — /Deliverables/ folder ID in Google Drive
 *   GOOGLE_SERVICE_ACCOUNT — JSON string of GCP service account credentials
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VisualBrief {
  post_id: string;          // e.g. "Wk1-Post1"
  visual_type: string;      // "single image" | "carousel"
  visual_concept: string;   // 1-sentence description
  on_image_copy: {
    headline: string;
    bullets: string[];      // max 3
    footer: string;         // always "RiteHire — Pakistan EOR/Payroll/Compliance"
  };
  generation_prompt: string; // full brand-locked prompt from Section 10 template
  export_specs: {
    width: number;           // 1200 for single, 1080 for carousel
    height: number;          // 1200 for single, 1350 for carousel
    margins: number;         // always 80
  };
}

interface GenerateResponse {
  success: boolean;
  post_id: string;
  image_url: string;        // fal.ai CDN URL (temporary)
  drive_url?: string;       // Google Drive permanent URL
  drive_file_id?: string;
  error?: string;
}

// ─── Flux Pro Configuration ───────────────────────────────────────────────────

const FAL_API_BASE = "https://queue.fal.run/fal-ai/flux-pro";

/**
 * Builds the Flux Pro payload from a visual brief.
 * Enforces brand constraints at the API layer — not just the prompt.
 */
function buildFluxPayload(brief: VisualBrief) {
  // Derive pixel size for fal.ai image_size param
  const isCarousel = brief.visual_type.toLowerCase().includes("carousel");
  const imageSize = isCarousel ? "portrait_4_3" : "square_hd";

  return {
    prompt: brief.generation_prompt,
    image_size: imageSize,
    num_inference_steps: 28,
    guidance_scale: 3.5,
    num_images: 1,
    enable_safety_checker: false,
    output_format: "png",
  };
}

// ─── fal.ai Queue Helpers ─────────────────────────────────────────────────────

async function submitToFlux(
  payload: ReturnType<typeof buildFluxPayload>,
  falApiKey: string
): Promise<string> {
  // Submit request to queue
  const submitRes = await fetch(FAL_API_BASE, {
    method: "POST",
    headers: {
      "Authorization": `Key ${falApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!submitRes.ok) {
    const err = await submitRes.text();
    throw new Error(`fal.ai submit failed (${submitRes.status}): ${err}`);
  }

  const submitData = await submitRes.json();
  const requestId: string = submitData.request_id;
  const statusUrl: string = submitData.response_url ?? `${FAL_API_BASE}/requests/${requestId}`;

  // Poll until complete (max 90s, 3s intervals)
  const maxAttempts = 30;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, 3000));

    const pollRes = await fetch(statusUrl, {
      headers: { "Authorization": `Key ${falApiKey}` },
    });

    if (!pollRes.ok) continue;

    const pollData = await pollRes.json();

    if (pollData.status === "COMPLETED" || pollData.images) {
      const images: Array<{ url: string }> = pollData.images ?? pollData.output?.images;
      if (!images || images.length === 0) {
        throw new Error("Flux returned no images");
      }
      return images[0].url;
    }

    if (pollData.status === "FAILED") {
      throw new Error(`Flux generation failed: ${JSON.stringify(pollData)}`);
    }
  }

  throw new Error("Flux generation timed out after 90s");
}

// ─── Google Drive Upload ──────────────────────────────────────────────────────

async function uploadToDrive(
  imageUrl: string,
  filename: string,
  folderId: string,
  serviceAccountJson: string
): Promise<{ fileId: string; webViewLink: string }> {
  // Fetch generated image bytes
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error("Failed to fetch generated image from fal.ai CDN");
  const imageBytes = await imgRes.arrayBuffer();

  // Parse service account credentials
  const credentials = JSON.parse(serviceAccountJson);

  // Get OAuth2 token via service account JWT
  const accessToken = await getServiceAccountToken(credentials, [
    "https://www.googleapis.com/auth/drive.file",
  ]);

  // Upload to Drive using multipart upload
  const metadata = {
    name: filename,
    parents: [folderId],
    mimeType: "image/png",
  };

  const boundary = "boundary_ritehire_linkedin_visual";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart =
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(metadata);

  const imagePart = `Content-Type: image/png\r\n\r\n`;

  // Build multipart body
  const encoder = new TextEncoder();
  const parts = [
    encoder.encode(delimiter + metadataPart + delimiter + imagePart),
    new Uint8Array(imageBytes),
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

  // Import RSA private key
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

  // Exchange JWT for access token
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
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

  // Validate required fields
  if (!brief.post_id || !brief.generation_prompt) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: post_id, generation_prompt" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Load secrets from Deno env (Supabase vault)
  const falApiKey = Deno.env.get("FAL_API_KEY");
  const driveFolderId = Deno.env.get("GOOGLE_DRIVE_FOLDER_ID");
  const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT");

  if (!falApiKey) {
    return new Response(
      JSON.stringify({ error: "FAL_API_KEY not configured in Supabase vault" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Step 1: Generate image via Flux Pro
    console.log(`[generate-linkedin-visual] Generating image for post ${brief.post_id}`);
    const payload = buildFluxPayload(brief);
    const falImageUrl = await submitToFlux(payload, falApiKey);
    console.log(`[generate-linkedin-visual] Image generated: ${falImageUrl}`);

    // Step 2: Upload to Google Drive (if credentials available)
    let driveUrl: string | undefined;
    let driveFileId: string | undefined;

    if (driveFolderId && serviceAccountJson) {
      const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const filename = `linkedin-visual_${brief.post_id}_${dateStr}.png`;
      const driveResult = await uploadToDrive(
        falImageUrl,
        filename,
        driveFolderId,
        serviceAccountJson
      );
      driveUrl = driveResult.webViewLink;
      driveFileId = driveResult.fileId;
      console.log(`[generate-linkedin-visual] Uploaded to Drive: ${driveUrl}`);
    } else {
      console.warn("[generate-linkedin-visual] Google Drive credentials not set — skipping upload");
    }

    const response: GenerateResponse = {
      success: true,
      post_id: brief.post_id,
      image_url: falImageUrl,
      drive_url: driveUrl,
      drive_file_id: driveFileId,
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

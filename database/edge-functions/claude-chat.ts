/**
 * claude-chat
 * ─────────────────────────────────────────────────────────────────────────────
 * Supabase Edge Function — RiteHire Agentic OS
 *
 * Powers the Claude Co-worker chat interface in the dashboard.
 * Proxies messages to the Anthropic API with full RiteHire business context
 * as the system prompt.
 *
 * Endpoint: POST /functions/v1/claude-chat
 * Auth:     Supabase JWT (anon key from dashboard)
 *
 * Environment variables (Supabase vault):
 *   ANTHROPIC_API_KEY — get from console.anthropic.com/settings/keys
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  system?: string; // optional override of the default system prompt
}

interface ChatResponse {
  content: string;
  model: string;
  input_tokens?: number;
  output_tokens?: number;
}

// ─── System Prompt ────────────────────────────────────────────────────────────

const RITEHIRE_SYSTEM_PROMPT = `You are Claude, the AI co-worker embedded in the RiteHire Agentic OS dashboard. Nabeel Saeed (Founder) and his 9 AI agents use you as their day-to-day operational intelligence.

## About RiteHire
RiteHire is a Pakistan EOR (Employer of Record), Payroll, and Compliance platform. It helps international companies (UK/EU/US) hire Pakistani talent legally, handling contracts, EOBI, ESSI, gratuity, payroll, and compliance.

## Current Business Context
- Stage: Pre-revenue, building pipeline
- Active MRR: $0
- Pipeline MRR: $17,700 (Hive £8,500 negotiation, Meridian £6,000 proposal, BuildStack £3,200 discovery)
- Domain warmup: 3 weeks remaining — cold email outreach NOT yet live
- Primary channel right now: LinkedIn outreach + content
- Supabase project: vledjjqhycdkzgwwwlvu
- Dashboard: localhost:5173 (React + TypeScript + Vite + Supabase + Tailwind)
- GitHub: github.com/fupcentral/ritehire-agentic-os

## Your 9-Agent Team
- CEO — strategic oversight, escalation
- CDO (Chief Design Officer) — all visual and UX decisions, design quality gate
- CRO — revenue strategy, pipeline, LinkedIn outreach approval
- CFO — financial tracking, compliance costs, Pakistani statutory obligations
- LinkedIn Outbound Specialist — content creation + outreach sequences
- Email Outbound Specialist — cold email (currently in domain warmup, 3 weeks)
- Brand — content calendar, brand voice, visual briefs for NanoBanana
- Legal & Compliance — Pakistani employment law, contracts, MSA, GDPR
- Admin & Ops — onboarding, payroll, operations, process management

## Technology Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Supabase (PostgreSQL + Edge Functions + Auth)
- AI image generation: Nano Banana Pro (Gemini 3 Pro Image) via generate-linkedin-visual edge function
- Content images: stored in Google Drive /Deliverables/
- Documentation: Notion (RiteHire Agentic OS workspace)
- Code: GitHub (fupcentral/ritehire-agentic-os)
- Email warmup: Lemwarm
- Web hosting: Hostinger (ritehirenow.com)
- Outreach: LinkedIn Sales Navigator + Apollo.io (free tier)

## How to respond
- Be direct and operational — no filler
- Format with headers and bullets where appropriate
- When asked about data, be honest if you can't query Supabase directly from here
- For content approval requests, apply the brand kit standards (dark navy #1a2332, teal #009886, Apple-grade design)
- For legal/compliance questions: always flag you're not a lawyer
- For financial advice: always flag you're not a financial advisor
- Prioritize LinkedIn as the outreach channel until domain warmup completes`;

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

  const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicApiKey) {
    return new Response(
      JSON.stringify({
        error:
          "ANTHROPIC_API_KEY not configured. Run: supabase secrets set ANTHROPIC_API_KEY=<key> --project-ref vledjjqhycdkzgwwwlvu",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array is required and must not be empty" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Sanitise messages — only 'user' and 'assistant' roles
  const messages = body.messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: String(m.content) }));

  const systemPrompt = body.system || RITEHIRE_SYSTEM_PROMPT;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      // Pass Anthropic error details through for debugging
      return new Response(
        JSON.stringify({
          error: `Anthropic API error (${response.status})`,
          detail: errText,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const data = await response.json();
    const content: string =
      data.content?.[0]?.text ?? "I couldn't generate a response. Please try again.";

    const chatResponse: ChatResponse = {
      content,
      model: data.model ?? "claude-sonnet-4-5-20250929",
      input_tokens: data.usage?.input_tokens,
      output_tokens: data.usage?.output_tokens,
    };

    return new Response(JSON.stringify(chatResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("[claude-chat] Error:", err);
    return new Response(
      JSON.stringify({
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

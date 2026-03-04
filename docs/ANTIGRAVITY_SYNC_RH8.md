# Antigravity Sync Prompt — RH8 Changes
**Date:** 2026-03-04 | **Purpose:** Sync Claude Cowork changes into the Antigravity-built dashboard

Paste this into Antigravity to apply all RH8 changes that were made outside Antigravity.

---

## Sync Prompt (paste into Antigravity)

```
I've made the following changes outside Antigravity that need to be applied to the dashboard at localhost:5173. Please read the current file state first, then apply each change.

## 1. Replace ClaudeChat component with real API integration

File: `dashboard/src/components/ui/ClaudeChat.tsx`

The current file uses a fake `getSimulatedResponse()` function. Replace the entire file with the version from the repo that:
- Calls `${VITE_SUPABASE_URL}/functions/v1/claude-chat` for real responses
- Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
- Handles API errors with inline error banners
- Shows a warning banner if env vars are not configured
- Has a proper inline markdown renderer for **bold**, `code`, and bullet lists
- Includes a "Clear chat" button (RefreshCw icon)
- Passes full conversation history with each API call (not just the last message)

## 2. Update department-tools.ts

File: `dashboard/src/lib/department-tools.ts`

Replace the `openai-api` tool entry with two new entries:
```typescript
{
    id: 'anthropic-api',
    name: 'Anthropic (Claude)',
    monthlyCost: 30,
    departments: ['sales', 'infra'],
    url: 'https://console.anthropic.com',
    description: 'Claude Sonnet — AI agent LLM calls, Claude Co-worker chat, outreach automation',
    category: 'ai',
    active: true,
},
{
    id: 'gemini-api',
    name: 'Nano Banana Pro (Gemini API)',
    monthlyCost: 0,
    departments: ['marketing'],
    url: 'https://aistudio.google.com',
    description: 'Nano Banana Pro (Gemini 3 Pro Image) — LinkedIn visual generation, marketing assets. Free tier.',
    category: 'ai',
    active: true,
},
```

## 3. Verify dashboard/.env exists

File: `dashboard/.env` (create if missing, already in .gitignore)

```
VITE_SUPABASE_URL=https://vledjjqhycdkzgwwwlvu.supabase.co
VITE_SUPABASE_ANON_KEY=<get from supabase.com/dashboard/project/vledjjqhycdkzgwwwlvu/settings/api>
```

## 4. Verify Claude Co-worker page is wired correctly

File: `dashboard/src/pages/ClaudeChat.tsx`

Make sure the page title says "Claude Co-worker" and description says:
"Chat with Claude — connected to GitHub, Supabase, Notion, and all your services."

And the layout is 2/3 chat panel + 1/3 pending approvals sidebar.

## 5. After all changes, hot-reload the dev server

Run `npm run dev` in the dashboard directory if not auto-refreshing.

Then verify:
- Go to http://localhost:5173/claude
- The chat interface loads without errors
- If VITE_SUPABASE_URL is set, it should say "Connected to GitHub, Supabase, Notion" in the header
- If ANTHROPIC_API_KEY is not in Supabase vault yet, typing a message will return an error like "ANTHROPIC_API_KEY not configured"
- This error is expected until the vault secret is added

## 6. Verify department tools tabs show correct tools

- Marketing tab → should show: NanoBanana, Lemwarm, Canva Pro, Clay, Nano Banana Pro (Gemini API)
- Infrastructure tab → should show: Hostinger, Supabase, GitHub, Anthropic (Claude)
- Sales tab → should show: LinkedIn Sales Nav, Apollo.io, Clay, Lemwarm, Anthropic (Claude)
```

---

## Files Already Updated in Repo (Don't Touch)

These were updated by Claude Cowork and are already in the repo. Antigravity does NOT need to regenerate them:

- `database/edge-functions/generate-linkedin-visual.ts` — Nano Banana Pro integration
- `database/edge-functions/claude-chat.ts` — NEW file, Claude API proxy
- `skills/gtm/linkedin-image-brief/SKILL.md` — Nano Banana Pro as primary tool
- `docs/cro-sales-strategy-2026-03.md`
- `docs/cdo-visual-brief-2026-03.md`
- `docs/visual-calendar-2026-03.md`
- `docs/linkedin-prospects-300.csv`
- `docs/SERVICES_MANIFEST.md`
- `docs/daily-reports/2026-03-04.md`

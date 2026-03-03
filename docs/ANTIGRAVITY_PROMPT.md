# Antigravity Master Prompt — RiteHire OS Dashboard

Paste this verbatim into the Antigravity Agent panel to start the build.

---

## PROMPT (copy everything below this line)

---

You are building the **RiteHire Agentic OS Dashboard** — a React + TypeScript + Vite + Tailwind CSS + Supabase web application. This is a complete build from scratch.

**Before writing any code, read these files in this repo:**
1. `docs/ANTIGRAVITY_CONTEXT.md` — complete build spec (schema, screens, brand, agents)
2. `brand/BRAND_KIT.md` — design source of truth (colors, fonts, rules)
3. `database/schema.sql` — full Supabase schema

**Then build the following, in this order:**

### Phase 1 — Foundation
1. Initialize Vite + React + TypeScript project
2. Install and configure: Tailwind CSS, shadcn/ui, React Router v6, @supabase/supabase-js, Lucide React, Recharts
3. Create `src/lib/supabase.ts` — Supabase client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Create `src/lib/types.ts` — TypeScript interfaces for all 7 Supabase tables (agents, skills, tasks, epics, deals, contacts, activity_log)
5. Create `.env.example` with the two required env vars

### Phase 2 — App Shell
6. Build `AppShell.tsx` — dark sidebar (#1a2332) + light main content area
7. Build `Sidebar.tsx` — RiteHire logo, AGENTS section, GTM expandable section, Pipeline, Contacts, Finance links
8. Build `TopBar.tsx` — agent status indicator, integration status pills (GitHub/Drive/Notion/LinkedIn/Stripe), pending approvals badge, notifications bell
9. Set up React Router with all 8 routes: `/`, `/gtm/linkedin`, `/gtm/email`, `/contacts`, `/pipeline`, `/agents`, `/activity`, `/finance`

### Phase 3 — Screens (one by one)
10. **Executive Dashboard** (`/`) — agent status cards, critical alerts, pipeline snapshot, activity feed
11. **LinkedIn Content Engine** (`/gtm/linkedin`) — post list, stats row, post detail drawer with Approve/Edit/Regenerate/Skip actions
12. **Email Outreach** (`/gtm/email`) — email queue, approval drawer
13. **Contacts** (`/contacts`) — table with filters, add contact modal, detail drawer
14. **Pipeline** (`/pipeline`) — Kanban board by deal stage, MRR totals
15. **Agents** (`/agents`) — agent cards + hierarchy tree
16. **Activity Log** (`/activity`) — full audit trail table with filters
17. **Finance** (`/finance`) — placeholder with "Connect Stripe" CTA

### Design rules (non-negotiable)
- Brand colors: `#1a2332` (dark navy) · `#4a5568` (charcoal) · `#009886` (teal accent) · `#e5e7eb` (light gray)
- Status dots: teal = active/approved, amber = pending/in_progress, red = critical/blocked, gray = paused/archived
- Rounded corners: 8px minimum
- Shadows: `0 4px 24px rgba(0,0,0,0.12)` — soft only
- Every data fetch = skeleton loader, not blank screen
- Every section with no data = designed empty state with icon + action button
- Desktop-first (1440px optimized). Dark sidebar, light main content.
- No mock/hardcoded data. All data from Supabase.

### Supabase project
- Project ID: `vledjjqhycdkzgwwwlvu`
- URL env var: `VITE_SUPABASE_URL`
- Anon key env var: `VITE_SUPABASE_ANON_KEY`

Start with Phase 1. Confirm each phase is complete before moving to the next. Ask me to review before proceeding past Phase 2.

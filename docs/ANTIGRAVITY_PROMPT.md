# Antigravity Master Prompt — RiteHire OS Dashboard (v2 — Clean Slate)

Paste everything below the horizontal rule verbatim into the Antigravity Agent panel.

---

---

You are doing a **clean slate rebuild** of the **RiteHire Agentic OS Dashboard** — a React + TypeScript + Vite + Tailwind CSS + Supabase internal operating system for a 9-agent AI company.

Before writing a single line of code, read these files in the repo:
1. `docs/ANTIGRAVITY_CONTEXT.md` — full build spec (screens, brand, agent hierarchy)
2. `brand/BRAND_KIT.md` — design source of truth
3. `database/schema.sql` — Supabase schema reference

**CRITICAL — Schema corrections (the schema.sql has errors vs. the live DB. Always use these values):**
- `tasks.status`: `todo | in_progress | blocked | done | cancelled`
- `tasks.priority`: `P0 - Critical | P1 - High | P2 - Medium | P3 - Low`
- `epics.status`: `active | completed | blocked | backlog`
- `deals.stage`: `prospecting | contacted | discovery | proposal | negotiation | closed_won | closed_lost`
- `contacts.outreach_status`: `not_contacted | contacted | replied | meeting_booked | disqualified`
- `activity_log.status`: `success | failed | in_progress | pending`
- `activity_log.action_type`: this column **does not exist** in the live DB — use `skill_used` instead. Always write `(entry.skill_used ?? 'action').replace(/_/g, ' ')` — never `entry.action_type`
- `skills.id`: the primary key is `id` (UUID), **not** `skill_id`
- `agents` table uses `select('*, agent:agents(*)')` joins — `entry.agent?.name` is available on activity_log entries

**Supabase project:**
- Project ID: `vledjjqhycdkzgwwwlvu`
- URL env var: `VITE_SUPABASE_URL`
- Anon key env var: `VITE_SUPABASE_ANON_KEY`

**MCP connections already configured (inherit from `.mcp.json` in repo root — do not reconfigure):**
- GitHub: `github.com/fupcentral/ritehire-agentic-os`
- Supabase: project `vledjjqhycdkzgwwwlvu`
- Notion: workspace connected
- Google Drive: folder connected

---

## WHAT TO BUILD

Rebuild the dashboard as a **5-Department Hub** — a top-level navigation restructured around business departments, not tool types.

### Department Structure

```
/ — Command Centre (home — replaces Executive Dashboard)
/sales — Sales Department
/marketing — Marketing Department  
/finance — Finance Department
/infra — Infrastructure & Agents
/hr — HR & Compliance
```

### 1. `/` — Command Centre
The founder's morning view. One screen, everything visible.
- Agent heartbeat strip — all 9 agents, live status
- Blockers panel — all tasks with `status: blocked`, with `blocker_notes`, priority, agent, due date
- Pipeline snapshot — deals by stage with MRR totals
- Pending approvals counter — items awaiting review
- Activity feed — last 10 `activity_log` entries, agent name resolved from join

### 2. `/sales` — Sales Department
Combines pipeline management and contact CRM.
- Sub-navigation tabs: Pipeline · Contacts · Outreach
- **Pipeline tab**: Kanban by deal stage (prospecting → contacted → discovery → proposal → negotiation → closed_won / closed_lost). Each card: company · MRR · close date · stage. Summary bar: total MRR, deals count, avg deal size.
- **Contacts tab**: Full contacts table — name · company · title · outreach_status badge · LinkedIn URL · last activity. Filter by outreach_status. Add contact modal.
- **Outreach tab**: Email queue — drafts · pending approval · sent · replied. Approval drawer: subject + body + Approve / Edit / Reject.

### 3. `/marketing` — Marketing Department
LinkedIn content engine + brand.
- Sub-navigation tabs: LinkedIn · Email Sequences · Brand
- **LinkedIn tab**: Post list with stats row (total · pending · approved · scheduled). Post detail drawer: full copy (editable) · visual brief · Approve / Edit / Regenerate / Skip.
- **Email Sequences tab**: Cold outreach sequences. Stats: drafts · pending · sent · replied · meetings booked.
- **Brand tab**: Brand kit reference panel — colors, fonts, guidelines from `brand/BRAND_KIT.md`.

### 4. `/finance` — Finance Department
- MRR tracker — live from `deals` table, sum of all `closed_won` deals
- Pipeline revenue — weighted MRR from active deals
- Runway card — placeholder with "Connect Stripe to activate"
- CFO agent activity — filtered `activity_log` for CFO and Admin & Ops agents
- Sprint financial overview — costs by sprint, burn rate (manual entry for now)

### 5. `/infra` — Infrastructure & Agents
Replaces the old Agents + Activity Log screens.
- Sub-navigation tabs: Agents · Activity Log · Skills
- **Agents tab**: Agent cards (all 9) with hierarchy tree. Click → tasks + activity for that agent.
- **Activity Log tab**: Full audit trail. Filters: agent · skill_used · status · date range. Never reference `action_type` — use `skill_used`.
- **Skills tab**: All skills from `skills` table. Each skill: `id` · name · agent · category · run_count · last_run · status.

### 6. `/hr` — HR & Compliance
- Team roster — agents as "team members" (read from `agents` table)
- Legal & compliance activity — filtered `activity_log` for legal-compliance agent
- Contract review queue — placeholder for future contract uploads
- Compliance status panel — checklist of key compliance items

---

## UI FRAMEWORK

Use **Nano Banana Pro** for all UI components and styling. Apply the RiteHire brand tokens on top:

| Token | HEX | Apply to |
|---|---|---|
| Dark Navy | `#1a2332` | Sidebar, headings, dominant dark surfaces |
| Charcoal | `#4a5568` | Secondary text, muted backgrounds |
| Teal | `#009886` | CTAs, active states, accents only |
| Light Gray | `#e5e7eb` | Borders, light surfaces |
| White | `#ffffff` | Cards, overlays |

Status dot system (always dot + label, never full-row color):
- `success / active / approved / done` → teal `#009886`
- `in_progress / pending / todo` → amber
- `blocked / failed / P0 - Critical` → red
- `paused / archived / cancelled` → gray

Non-negotiable design rules:
- Rounded corners: 8px minimum on all cards and inputs
- Shadows: `0 4px 24px rgba(0,0,0,0.12)` — soft only
- Dark sidebar (`#1a2332`), light main content (`#f9fafb`)
- Every data fetch → skeleton loader, never blank
- Every empty state → icon + one-line explanation + action button
- Desktop-first (optimise for 1440px). Mobile is secondary.
- No mock/hardcoded data anywhere — 100% live from Supabase

---

## VERIFICATION STEP (use Integrated Browser)

After each department screen is complete:
1. Open the Integrated Browser and navigate to `http://localhost:5173`
2. Confirm the screen renders without console errors
3. Confirm at least one live data row is visible (not an empty state caused by a query error)
4. Check the Network tab — all Supabase requests should return `200`, not `400` or `500`
5. Confirm status badges and agent names display correctly (no raw UUIDs visible anywhere)

If any Supabase query returns an error, fix it before proceeding to the next screen.

---

## BUILD ORDER

1. Foundation: Vite + React + TS + Tailwind + Nano Banana Pro setup. Supabase client. `types.ts` with corrected enums (use the schema corrections at the top, not `schema.sql`).
2. App shell: sidebar with 6 top-level department links, top bar with agent heartbeat + approvals badge.
3. Command Centre (`/`) — verify with Integrated Browser before continuing.
4. Sales department (`/sales`) — Pipeline tab first, then Contacts, then Outreach.
5. Marketing department (`/marketing`)
6. Finance department (`/finance`)
7. Infra department (`/infra`)
8. HR department (`/hr`)

Confirm each phase is complete and verified before moving to the next. After Phase 3 (Command Centre live), check in with Nabeel before proceeding.

---

## DO NOT BUILD
- Authentication screen (private internal tool)
- User management
- Settings page
- Mobile navigation
- Stripe integration UI (placeholder only)
- Any screen that doesn't pull from live Supabase data

---

*Prompt version: v2 — Clean Slate — 4 March 2026*

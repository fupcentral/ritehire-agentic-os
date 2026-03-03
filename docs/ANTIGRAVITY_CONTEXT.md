# RiteHire Agentic OS — Antigravity Build Context
**Version:** 1.0  
**Date:** 2026-03-03  
**Purpose:** Complete specification for Antigravity to build the RiteHire OS dashboard from scratch.  
**Source layers:** GitHub (Layer 1) · Supabase + Notion (Layer 2) · Google Drive (Layer 3)

---

## MISSION

Build the **RiteHire Agentic OS Dashboard** — a React + TypeScript + Supabase web application that serves as the operating interface for a 9-agent AI company. The interface lets the founder (Nabeel) see everything the agents are doing, approve or reject outputs, manage the sales pipeline, review LinkedIn posts and emails before sending, and track the financial health of the business.

This is **not** a marketing site. It is an internal operating system — think Mission Control, not a landing page. Every screen must be functional, data-driven, and connected to Supabase. Apple-grade design standard applies throughout.

---

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (existing project — do NOT create new) |
| Routing | React Router v6 |
| Data fetching | @supabase/supabase-js v2 |
| Icons | Lucide React |
| Charts | Recharts |

**Supabase Project:**
- Project ID: `vledjjqhycdkzgwwwlvu`
- Region: existing (do not change)
- Auth: use Supabase anon key from environment variable `VITE_SUPABASE_ANON_KEY`
- URL: `VITE_SUPABASE_URL`

---

## DATABASE SCHEMA (Supabase)

All tables are co-primary with Notion. Supabase is the programmatic/API layer.

### Table: `agents`
```sql
id             text PRIMARY KEY         -- e.g. 'ceo', 'cro', 'linkedin-outbound'
name           text NOT NULL            -- e.g. 'CEO', 'LinkedIn Outbound Specialist'
role           text NOT NULL
reporting_to   text REFERENCES agents(id)  -- null for CEO
status         text DEFAULT 'active'    -- 'active' | 'paused' | 'archived'
current_task   text
github_path    text
prompt_path    text
created_at     timestamptz
updated_at     timestamptz
```

### Table: `skills`
```sql
skill_id       text PRIMARY KEY         -- e.g. 'linkedin-draft-post'
name           text NOT NULL
agent_id       text REFERENCES agents(id)
github_path    text NOT NULL
category       text                     -- 'gtm' | 'finance' | 'legal' | 'brand' | 'ops'
last_run       timestamptz
status         text DEFAULT 'active'    -- 'active' | 'paused' | 'archived'
run_count      integer DEFAULT 0
created_at     timestamptz
updated_at     timestamptz
```

### Table: `tasks`
```sql
id             uuid PRIMARY KEY
title          text NOT NULL
description    text
agent_id       text REFERENCES agents(id)
epic_id        uuid REFERENCES epics(id)
skill_id       text REFERENCES skills(skill_id)
status         text DEFAULT 'pending'   -- 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled'
blocker_path   text
priority       text DEFAULT 'medium'    -- 'low' | 'medium' | 'high' | 'critical'
due_date       date
completed_at   timestamptz
created_at     timestamptz
updated_at     timestamptz
```

### Table: `epics`
```sql
id             uuid PRIMARY KEY
title          text NOT NULL
description    text
owner_agent    text REFERENCES agents(id)
completion_pct integer DEFAULT 0        -- 0–100
status         text DEFAULT 'active'    -- 'active' | 'completed' | 'on_hold' | 'cancelled'
target_date    date
completed_at   timestamptz
created_at     timestamptz
updated_at     timestamptz
```

### Table: `deals`
```sql
id                   uuid PRIMARY KEY
company              text NOT NULL
contact_id           uuid REFERENCES contacts(id)
stage                text DEFAULT 'prospect'
                     -- 'prospect' | 'qualified' | 'proposal_sent' | 'negotiation'
                     -- | 'verbal_close' | 'closed_won' | 'closed_lost'
mrr                  numeric(10,2)       -- monthly recurring revenue (USD)
expected_close_date  date
source               text                -- e.g. 'linkedin_outbound', 'referral', 'inbound'
notes                text
created_at           timestamptz
updated_at           timestamptz
```

### Table: `contacts`
```sql
id              uuid PRIMARY KEY
name            text NOT NULL
company         text
title           text
linkedin_url    text
email           text
phone           text
outreach_status text DEFAULT 'identified'
                -- 'identified' | 'draft' | 'approved' | 'sent' | 'replied'
                -- | 'meeting_booked' | 'client' | 'no_response' | 'not_interested' | 'do_not_contact'
source          text
notes           text
created_at      timestamptz
updated_at      timestamptz
```

### Table: `activity_log`
```sql
id                 uuid PRIMARY KEY
agent_id           text REFERENCES agents(id)
skill_used         text REFERENCES skills(skill_id)
action_type        text NOT NULL         -- 'skill_execution' | 'decision' | 'alert' | 'review'
output_summary     text NOT NULL
status             text NOT NULL
                   -- 'completed' | 'approved_pending_action' | 'awaiting_approval' | 'failed' | 'escalated'
risk_level         text                  -- 'low' | 'medium' | 'high' | 'critical'
related_deal_id    uuid REFERENCES deals(id)
related_contact_id uuid REFERENCES contacts(id)
related_task_id    uuid REFERENCES tasks(id)
created_at         timestamptz
```

---

## AGENT HIERARCHY

```
CEO
├── CDO  (Chief Design Officer)
├── CRO  (Chief Revenue Officer)
│   ├── LinkedIn Outbound Specialist  [skills: linkedin-draft-post, linkedin-image-brief, target-account-list]
│   ├── Email Outbound Specialist     [skills: email-cold-outreach]
│   └── Brand                        [skills: content-calendar]
└── CFO  (Chief Financial Officer)
    ├── Legal & Compliance           [skills: contract-review]
    └── Admin & Ops
```

### All 9 Agents
| ID | Name | Reports To | Skills |
|----|------|-----------|--------|
| `ceo` | CEO | — | — |
| `cdo` | CDO | ceo | — |
| `cro` | CRO | ceo | — |
| `cfo` | CFO | ceo | — |
| `linkedin-outbound` | LinkedIn Outbound Specialist | cro | linkedin-draft-post, linkedin-image-brief, target-account-list |
| `email-outbound` | Email Outbound Specialist | cro | email-cold-outreach |
| `brand` | Brand | cro | content-calendar |
| `legal-compliance` | Legal & Compliance | cfo | contract-review |
| `admin-ops` | Admin & Ops | cfo | — |

### Approval Gates (critical UX requirement)
Every agent action that touches the outside world requires **human approval before execution**:
- LinkedIn posts → must show: post copy + visual brief → **Approve / Edit / Regenerate / Skip**
- Cold emails → must show: subject + body + ICP match → **Approve / Edit / Reject**
- Target account list → must show: list + ICP rationale → **Approve / Remove**
- Contracts → must show: risk level + issues → **Approve / Escalate / Reject**

---

## SCREENS TO BUILD

### 1. `/` — Executive Dashboard (home)
**Purpose:** One-screen pulse of the entire OS. The founder's morning view.

**Sections:**
- **Agent status bar** — all 9 agents, active/paused/standby status indicators
- **Critical alerts** — tasks with `priority: critical` or `status: blocked`, activity_log entries with `status: escalated`
- **Pipeline snapshot** — deals by stage (Kanban column headers with counts + total MRR)
- **Activity feed** — last 10 activity_log entries, most recent first
- **Pending approvals counter** — number of items awaiting Nabeel's review (badge)

### 2. `/gtm/linkedin` — LinkedIn Content Engine
**Purpose:** Full LinkedIn post management. The most-used screen.

**Sections:**
- **Stats row** — Total Posts | Pending Review | Approved | Needs Revision | Scheduled
- **Action buttons** — "Generate Post" (triggers skill run) · "Generate Images" · filter tabs (All / Image / Carousel / Text)
- **Post list** — each row: date · format type · post title / hook · ICP tag · pillar tag · status badge
- **Post detail drawer** (open on click):
  - Full post copy (editable)
  - Visual brief section
  - Generated image preview (if available) — from `deliverables` or Drive URL
  - **Approve / Edit / Regenerate / Skip** action buttons
  - Status history

### 3. `/gtm/email` — Email Outreach
**Purpose:** Cold email queue and approval workflow.

**Sections:**
- **Stats row** — Drafts | Pending Approval | Sent | Replied | Meetings Booked
- **Email list** — each row: contact name · company · subject line · status · date
- **Email detail drawer** — subject options (3) · body · ICP match rationale · **Approve / Edit / Reject**

### 4. `/contacts` — Contacts & CRM
**Purpose:** Full contacts table. No HubSpot — this IS the CRM.

**Sections:**
- **Filter bar** — by outreach_status · by source · search by name/company
- **Contacts table** — name · company · title · LinkedIn · status badge · last activity · actions
- **Add contact** modal — manual entry form
- **Contact detail drawer** — full profile + activity history from activity_log

### 5. `/pipeline` — Deals Pipeline
**Purpose:** Sales pipeline view. All active opportunities.

**Sections:**
- **Kanban board** — columns: Prospect → Qualified → Proposal Sent → Negotiation → Verbal Close → Closed Won / Lost
- Each card: company · contact name · MRR · expected close · source tag
- **Pipeline summary bar** — total open deals · total pipeline MRR · avg deal size
- **Add deal** modal

### 6. `/agents` — Agent Status
**Purpose:** See all agents, their current tasks, skills, and health.

**Sections:**
- **Agent cards** — one card per agent: name · role · status badge · current_task · skills list · tasks count
- Agent hierarchy tree (visual — shows reporting structure)
- Click into agent → see all their tasks + activity log

### 7. `/activity` — Activity Log
**Purpose:** Complete audit trail of everything the OS has done.

**Sections:**
- **Full log table** — timestamp · agent · action_type · output_summary · status badge · risk badge
- **Filters** — by agent · by action_type · by status · by risk_level · date range
- Infinite scroll or pagination (50 per page)

### 8. `/finance` — Finance (CFO Office)
**Purpose:** Runway, forecast, and financial health. Read-only for now (Stripe not yet connected).

**Sections:**
- **Runway card** — placeholder with "Connect Stripe to activate" state
- **Revenue forecast** — placeholder with manual entry option
- **Recent financial activity** — filtered activity_log for CFO agent

---

## NAVIGATION STRUCTURE

```
Sidebar (left, collapsible)
├── RiteHire logo + "AGENTIC OS" label
├── AGENTS section
│   ├── Executive (/)
│   ├── Actions (/activity)
│   └── Agents (/agents)
├── GTM section (expandable)
│   ├── LinkedIn (/gtm/linkedin)
│   └── Email (/gtm/email)
├── Pipeline (/pipeline)
├── Contacts (/contacts)
└── Finance (/finance)

Top bar (always visible)
├── Agent status indicator ("All agents operational" / alert count)
├── Integration status strip (GitHub · Google Drive · Notion · LinkedIn · Stripe)
├── Pending approvals badge (number)
└── Notifications bell
```

---

## BRAND & DESIGN

**Colors:**
| Token | HEX | Usage |
|-------|-----|-------|
| Dark Navy | `#1a2332` | Primary background, headings, dominant dark surfaces |
| Charcoal | `#4a5568` | Secondary text, UI elements, muted backgrounds |
| Teal | `#009886` | Accent only — CTAs, active states, highlights. Never dominant |
| Light Gray | `#e5e7eb` | Borders, light surfaces, secondary backgrounds |
| White | `#ffffff` | Clean cards, overlays |

**Typography:**
- Headings: Bold, geometric sans-serif (Inter or equivalent), 24px / 18px / 16px
- Body: Regular weight, 14px, line-height 1.5–1.6
- Never italic headings. Never all-lowercase. Never decorative fonts.

**Design rules (Apple-grade standard — non-negotiable):**
- Whitespace is a design element — use generously
- One primary visual action per screen section
- Rounded corners: 8px minimum on all cards and inputs
- Shadows: soft only — `0 4px 24px rgba(0,0,0,0.12)` — never harsh
- Grid: 8px base. Everything snaps to it.
- Status badges: use colored dots + label text (not colored backgrounds on full rows)
- No gradients unless explicitly defined
- No stock photos anywhere in the UI

**Status color system:**
- `active` / `completed` / `approved` → teal `#009886` dot
- `in_progress` / `pending` → amber dot
- `blocked` / `critical` / `escalated` → red dot
- `paused` / `archived` / `cancelled` → gray dot

---

## INTEGRATION STATES (top bar indicators)

Show connection status for:
| Integration | Connected when | Status source |
|------------|----------------|---------------|
| GitHub | Always (repo exists) | Static |
| Google Drive | Folder ID known | Static |
| Notion | Parent page ID known | Static |
| LinkedIn | API key present | Env var check |
| Stripe | API key present | Env var check |

3 of these are always green (GitHub, Drive, Notion). LinkedIn and Stripe show "Setup required" until keys are added.

---

## EMPTY STATES

Every screen must have a well-designed empty state (not a blank white box). Use:
- An icon relevant to the section
- A one-line explanation
- An action button (e.g. "Add first contact" / "Generate first post")

---

## KEY UX PRINCIPLES

1. **Approval gates are sacred.** Never auto-approve anything. Every action that touches the outside world (posting, sending, signing) must show the content and require explicit Approve / Reject.

2. **Real data only.** Every metric shown must come from Supabase. No hardcoded mock numbers.

3. **Loading states.** Every data fetch must have a skeleton loader, not a blank screen.

4. **Responsive but desktop-first.** This is used on a laptop. Optimize for 1440px wide. Mobile is secondary.

5. **Dark sidebar, light main.** Sidebar background: `#1a2332`. Main content area: `#f9fafb` or `#ffffff`.

---

## FILE STRUCTURE (suggested)

```
src/
  components/
    layout/
      Sidebar.tsx
      TopBar.tsx
      AppShell.tsx
    ui/                    (shadcn components)
    agents/
    linkedin/
    email/
    contacts/
    pipeline/
    activity/
    finance/
  pages/
    ExecutiveDashboard.tsx
    LinkedInEngine.tsx
    EmailOutreach.tsx
    Contacts.tsx
    Pipeline.tsx
    Agents.tsx
    ActivityLog.tsx
    Finance.tsx
  lib/
    supabase.ts            (Supabase client init)
    types.ts               (TypeScript types from schema)
  hooks/
    useAgents.ts
    useActivityLog.ts
    useContacts.ts
    useDeals.ts
  App.tsx
  main.tsx
```

---

## ENVIRONMENT VARIABLES NEEDED

```env
VITE_SUPABASE_URL=https://vledjjqhycdkzgwwwlvu.supabase.co
VITE_SUPABASE_ANON_KEY=<get from Supabase dashboard → Settings → API>
```

---

## WHAT NOT TO BUILD

- No authentication screen (this is a private internal tool — Nabeel is always logged in)
- No user management
- No settings page (yet)
- No mobile navigation (desktop-first)
- No Stripe integration UI yet (placeholder only)
- No n8n or webhook configuration UI

---

## REFERENCE FILES IN THIS REPO

| File | Purpose |
|------|---------|
| `/brand/BRAND_KIT.md` | Complete brand rules — colors, fonts, logo, LinkedIn specs |
| `/database/schema.sql` | Full Supabase schema with seed data |
| `/agents/*.yaml` | Each agent's capabilities, tools, approval gates |
| `/skills/gtm/linkedin-draft-post/SKILL.md` | LinkedIn skill execution spec |
| `/database/edge-functions/generate-linkedin-visual.ts` | Image generation Edge Function |

---

*Context document prepared: 2026-03-03 — use this as the sole build brief for Antigravity.*

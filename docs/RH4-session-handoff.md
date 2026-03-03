# RiteHire Agentic OS — Session RH4 Handoff

> **Date:** 2026-03-03  
> **Session:** RH3 → RH4 transition  
> **Status:** Dashboard fully scaffolded, ready to boot

---

## What Was Built in RH3

### React Dashboard (`/dashboard/`)
A complete React + TypeScript + Vite + Tailwind CSS operating dashboard connected to Supabase. This replaces the Lovable GUI as the primary interface for the OS.

**Full file tree (35 files):**

```
dashboard/
├── .env                          ← Supabase URL + anon key (live)
├── index.html                    ← Inter font, mount point
├── package.json                  ← deps: react, supabase-js, recharts, lucide-react, react-router-dom
├── vite.config.ts
├── tsconfig.json                 ← strict: false
├── tsconfig.node.json
├── tailwind.config.js            ← brand colors, content paths
├── postcss.config.js
└── src/
    ├── main.tsx                  ← ReactDOM.createRoot entry
    ├── App.tsx                   ← BrowserRouter + 8 routes + AppShell
    ├── index.css                 ← Tailwind directives, scrollbar-hide
    ├── lib/
    │   ├── supabase.ts           ← createClient from env vars
    │   ├── types.ts              ← All 7 table types + enums
    │   └── utils.ts              ← formatDistanceToNow, formatDate, capitalize
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.tsx      ← flex h-screen shell
    │   │   ├── Sidebar.tsx       ← collapsible dark navy, GTM group, active states
    │   │   └── TopBar.tsx        ← integration pills, approval badge, agent pulse
    │   └── ui/
    │       ├── Badge.tsx         ← 5 variants, statusVariant(), priorityVariant()
    │       ├── Button.tsx        ← 4 variants × 3 sizes
    │       ├── Card.tsx          ← Card + StatCard
    │       ├── Skeleton.tsx      ← loading states
    │       └── EmptyState.tsx    ← icon + title + action
    ├── hooks/
    │   ├── useAgents.ts          ← SELECT * FROM agents
    │   ├── useActivityLog.ts     ← SELECT * FROM activity_log LIMIT n
    │   ├── useContacts.ts        ← SELECT * FROM contacts (with refresh)
    │   ├── useDeals.ts           ← SELECT * FROM deals (with refresh)
    │   └── useTasks.ts           ← SELECT * FROM tasks (optional agentId filter)
    └── pages/
        ├── ExecutiveDashboard.tsx ← Stats, agent status list, alerts, pipeline snapshot, activity feed
        ├── LinkedInEngine.tsx    ← Week 1 posts hardcoded, approval drawer, visual brief card
        ├── EmailOutreach.tsx     ← Contact list + approval drawer
        ├── Contacts.tsx          ← Search, 10-status filter, table, detail drawer
        ├── Pipeline.tsx          ← 7-column Kanban by deal stage
        ├── AgentsPage.tsx        ← Reporting tree + 3-col agent cards
        ├── ActivityLog.tsx       ← Filter by action_type + status, log rows
        └── Finance.tsx           ← Stripe placeholder + CFO rules
```

---

## Immediate Next Step (Required Before Anything Else)

**Nabeel must run this in Terminal:**

```bash
cd /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/dashboard
npm install
npm run dev
```

Dev server will start at **`http://localhost:5173`**

The dashboard is connected live to Supabase project `vledjjqhycdkzgwwwlvu` via the anon key stored in `.env`.

---

## Infrastructure Status

| Layer | Status | Notes |
|-------|--------|-------|
| GitHub (`fupcentral/ritehire-agentic-os`) | ✅ Active | `dashboard/` not yet committed |
| Supabase (`vledjjqhycdkzgwwwlvu`) | ✅ Active | 7 tables seeded, Edge Function deployed |
| Google Drive | ✅ Connected | Drive MCP available |
| Notion | ✅ Connected | Notion MCP available |
| Lovable (`rite-pilot-os.lovable.app`) | ⏸ Paused | Replaced by local React dashboard |
| fal.ai (Flux Pro) | ⚠️ Needs key | FAL_API_KEY not yet in Supabase vault |

---

## Supabase Secrets Needed

Add these to Supabase vault (`vledjjqhycdkzgwwwlvu`) before image generation works:

| Secret Name | Source |
|-------------|--------|
| `FAL_API_KEY` | fal.ai dashboard → API Keys |
| `GOOGLE_SERVICE_ACCOUNT` | Google Cloud Console → IAM → Service Account JSON |
| `GOOGLE_DRIVE_FOLDER_ID` | Google Drive → RiteHire folder → Share → Copy ID from URL |

---

## Known Limitations / RH4 Priorities

### 1. `npm install` (blocking)
The dashboard code is 100% written but has never been run. First boot may reveal TypeScript or import path issues. Likely areas to check:
- `recharts` types (import style)
- `lucide-react` icon names (some may have changed in v0.263.1)
- `clsx` import — used in Button.tsx, Badge.tsx

### 2. LinkedIn Posts Not in Supabase
`LinkedInEngine.tsx` uses hardcoded Week 1 posts (Wk1-Post1, Wk1-Post2, Wk1-Post3) from the LinkedIn OS v1.2 pack. These need to be:
- Stored in a `linkedin_posts` or `deliverables` table in Supabase
- Fetched via a new `useLinkedInPosts.ts` hook
- The page then refactored to use real data

### 3. Contacts Table Empty
No real ICP contacts have been added. The CRM screen will show an empty state until populated. 5–10 ICP-A/B/C leads should be seeded manually or via Apollo MCP.

### 4. GitHub Commit
The `dashboard/` directory exists locally but has never been committed. Run:
```bash
cd /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os
git add dashboard/
git commit -m "feat: Add React dashboard (RH3) — 8 screens, Supabase connected"
git push
```

### 5. Fix/Complete LinkedIn Image Generation
- Add `FAL_API_KEY` to Supabase vault
- Edge Function `generate-linkedin-visual` already deployed
- Call it from `LinkedInEngine.tsx` → `Generate Images` button (currently shows placeholder)

---

## Agents & Skills Reference

### 9 Agents (Supabase `agents` table)
```
CEO (Layer 0)
├── CDO
│   ├── LinkedIn Outbound Specialist
│   ├── Email Outbound Specialist
│   └── Brand
├── CRO
│   └── (future: SDR agent)
├── CFO
└── Legal & Compliance
    └── Admin & Ops
```

### 8 Skills (Supabase `skills` table)
- `linkedin-draft-post`
- `linkedin-image-brief`
- `email-cold-outreach`
- `target-account-list`
- `update-forecast`
- `runway-report`
- `contract-review`
- `content-calendar`

---

## Brand Tokens (for any UI fixes)

```js
colors: {
  navy:    '#1a2332',  // sidebar, dark cards
  charcoal:'#4a5568',  // body text
  teal:    '#009886',  // primary accent, CTAs
  light:   '#e5e7eb',  // backgrounds, borders
}
shadow: '0 4px 24px rgba(0,0,0,0.12)'
radius: min 8px, prefer 12px
grid:   8px base unit
```

---

## RH4 Session Goals (Suggested)

1. **Boot the dashboard** — run npm install + fix any TypeScript errors
2. **Wire LinkedIn posts to Supabase** — create `linkedin_posts` table, refactor LinkedInEngine.tsx
3. **Seed 10 ICP contacts** — use Apollo MCP or manual Supabase insert
4. **Add FAL_API_KEY** → test image generation end-to-end from the dashboard
5. **Commit everything to GitHub**
6. **Write RH5 handoff**

---

*Session RH3 ended with dashboard/ fully scaffolded. All 35 files written. Ready to boot.*

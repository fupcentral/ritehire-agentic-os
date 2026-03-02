# RiteHire Agentic OS — Session Context & Memory

---

## ⚡ HOW TO START EVERY NEW SESSION

Say this at the start of any new Cowork chat:

> **"Read /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/CONTEXT.md and pick up where we left off."**

That single instruction gives Claude full context. No re-explaining. No separate Chat projects. Everything lives here and in Notion.

**Stay in Cowork for everything.** Do not use Claude Chat or Claude Chat Projects for this work. Cowork is the single place for execution, building, Notion, GitHub, and scheduled tasks.

---

## Last updated: 2026-03-02 (session 3)

Sessions captured in this file:
- "Getting to know you" (Cowork session, ~2026-02-07 to 2026-03-01)
- "Continuing Previous Conversation" (Cowork session, 2026-03-02)

---

## Who Nabeel Is

- Name: Nabeel Saeed (nabeel.saeed88@gmail.com)
- Founder of RiteHire
- Non-developer — uses Cowork mode exclusively
- GitHub username: fupcentral
- Tools: Claude Cowork · Notion · Lovable · Google Drive · GitHub
- AI runtime preference: **Kimi (Moonshot) first** wherever configurable. Claude as fallback only.
- Design standard: **Apple-grade quality bar**. LoveFrom aesthetic. Sparse, calm, intentional, highly legible. No generic templates, no placeholders, no rough edges.

---

## What RiteHire Is

**RiteHire** is a Pakistan-based **Employer of Record (EOR)** service.

International companies hire, pay, and manage employees in Pakistan through RiteHire — without needing to set up a local legal entity. RiteHire is the legal employer on paper; clients retain day-to-day operational control.

**Services:** Contracts under Pakistani law · Onboarding documentation · Monthly payroll administration · Statutory compliance

**Stage:** Actively in GTM. LinkedIn-first outbound. Targeting companies that hire in Pakistan.

**Brand colours:** `#FFFFFF` (white) · `#081326` (navy) · `#12AF84` (green accent)
**Approved logos:** ritehire-logo-mark.svg · ritehire-favicon-white-bg.svg · ritehire-logo-horizontal-dark.svg · ritehire-logo-horizontal-light.svg

**Website:** ritehirenow.com

---

## History: What Was Built Before the Fresh Start

Before 2026-03-02, significant work existed across multiple tools. All of it has been archived — do not build on top of it.

### Previous Notion workspace (archived)
- RiteHireCodex — GTM HQ Dashboard, Brand Toolkit v2 and v3, LinkedIn Content Pack, Outbound Strategy (4-post/week LinkedIn cadence, visual asset packs), Founder Request Results log, 14-Day Target Account List
- RiteHire OS — Deals, Partners, Employees, Ops, Finance, Policies sections
- All archived under: ⚠️ Archive — Pre-Rebuild (Notion ID: 31714d73-bdee-8123-8ecb-ced296faca79)

### Previous ChatGPT work
- Built an interactive HTML agent dashboard (8 agents as employee cards, tasks, dependencies, status indicators, blocker paths, Google Drive OAuth integration attempt)
- The dashboard was built from a Kimi-generated Project Specification Document (PSD) — this PSD no longer exists
- Agent list from PSD: A1 Strategist, A2 Legal-Compliance, A3 Finance-Ops, A4 Product-Tech, A5 Brand-Content, A6 Sales-BD, A7 Customer-Success, A8 Admin-System

### Previous Lovable work
- Built rite-pilot-os.lovable.app — a prototype RiteHire Agentic OS interface with executive hierarchy view, agent cards (11 total, 10 active), activity feed (simulated), service status bar (7/10 connected). This is superseded. Do not build on top of it.

### Decision: Fresh start
On 2026-03-02, Nabeel decided to scrap all previous work and rebuild from scratch with a clean architecture. Everything above is for reference only.

---

## Key Decisions (locked — do not re-litigate)

| Decision | What was decided |
|---|---|
| Fresh start | Everything rebuilt from scratch. Do not build on top of any old work. |
| HubSpot | **Explicitly excluded. Never suggest it. Ever.** |
| CRM | Notion + Google Drive. Exact workflow TBD. No third-party CRM. |
| Notion role | **Co-primary data store** alongside Supabase. Not a mirror. Both authoritative. Bidirectional sync. |
| Interface | Lovable (new project, connected to Supabase). The operating dashboard. |
| Execution | Claude Cowork only. Reads SKILL.md files from GitHub and runs agents. |
| Chat projects | **Not used.** Everything stays in Cowork. Do not suggest using Claude Chat for this project. |
| AI runtime | Kimi (Moonshot) first wherever configurable. |
| Skills | Both agent capabilities (agent YAMLs) AND Cowork execution playbooks (SKILL.md files in GitHub). |
| No PSD | The Kimi PSD no longer exists. Agent definitions rebuilt from scratch in YAML format. |

---

## The 5-Layer Architecture

| Layer | Tool | What lives here |
|---|---|---|
| 1 — Source of Truth | GitHub (new repo, fupcentral) | Agent YAMLs · SKILL.md files · System prompts · PERSONALIZATION_SPEC.md · schema.sql |
| 2 — Data | Supabase + Notion (co-primary) | agents · skills · tasks · epics · deals · contacts · activity_log |
| 3 — Files | Google Drive (new, /RiteHire OS/) | Brand Assets · Contracts · Templates · Deliverables |
| 4 — Interface | Lovable (new project) | Executive · GTM · Actions · Skills Library · Finance · Epics views |
| 5 — Execution | Claude Cowork | Reads skills, runs agents, writes to Supabase + Notion + Drive |

---

## The 9 Agents

| Agent | Reports to | Key skills |
|---|---|---|
| CEO | — | Company strategy |
| CDO (Chief Design Officer) | CEO | Design authority across all surfaces |
| CRO | CEO | GTM, revenue, outbound |
| CFO | CEO | Finance, legal, admin oversight |
| LinkedIn Outbound Specialist | CRO | linkedin-draft-post · linkedin-image-brief · target-account-list |
| Email Outbound Specialist | CRO | email-cold-outreach |
| Brand | CRO | content-calendar · brand assets |
| Legal & Compliance | CFO | contract-review |
| Admin & Ops | CFO | SOP documentation |

---

## The 8 Skills (SKILL.md playbooks)

| Skill | Path | Owner | Notes |
|---|---|---|---|
| linkedin-draft-post | /skills/gtm/linkedin-draft-post/SKILL.md | LinkedIn Outbound | Requires human approval before publish |
| linkedin-image-brief | /skills/gtm/linkedin-image-brief/SKILL.md | LinkedIn Outbound | Outputs to Drive /Deliverables/ |
| email-cold-outreach | /skills/gtm/email-cold-outreach/SKILL.md | Email Outbound | Approval gate before send |
| target-account-list | /skills/gtm/target-account-list/SKILL.md | LinkedIn Outbound | Writes contacts to Supabase + Notion |
| update-forecast | /skills/finance/update-forecast/SKILL.md | CFO | Reads deals from Supabase |
| runway-report | /skills/finance/runway-report/SKILL.md | CFO | Alerts if under threshold |
| contract-review | /skills/legal/contract-review/SKILL.md | Legal & Compliance | Human sign-off required |
| content-calendar | /skills/brand/content-calendar/SKILL.md | Brand | Writes to Notion + Drive |

---

## Supabase Tables (7, all co-primary with Notion)

| Table | Key fields | Connected to |
|---|---|---|
| agents | id, name, role, reporting_to, status, current_task | Notion · Lovable · Cowork |
| skills | skill_id, name, agent_id, github_path, last_run, status | Notion · Lovable · Cowork |
| tasks | id, title, agent_id, epic_id, status, blocker_path | Notion · Lovable |
| epics | id, title, owner_agent, completion_pct, target_date | Notion · Lovable |
| deals | company, contact_id, stage, mrr, source | Notion · Google Drive · Lovable |
| contacts | name, company, linkedin_url, email, outreach_status | Notion · Google Drive · LinkedIn agent · Email agent |
| activity_log | agent_id, skill_used, timestamp, output_summary, status | Notion · Lovable real-time feed |

---

## Notion Workspace

**Root page:** RiteHire Agentic OS — Architecture Blueprint
URL: https://www.notion.so/31714d73bdee8138ad6aca1ebcec4509

**Children:**
- Daily Reports — RiteHire OS (ID: 31714d73-bdee-8189-b0a2-fdc3cc7315db)
  Auto-generated 3× daily at 2am · 10am · 3pm via scheduled task `ritehire-os-daily-report`
- ⚠️ Archive — Pre-Rebuild (ID: 31714d73-bdee-8123-8ecb-ced296faca79)
  Old RiteHireCodex + old RiteHire OS. Do not use.

---

## Service Map

| Service | Status | Notes |
|---|---|---|
| GitHub | ⏳ Not yet created | New repo under fupcentral. Not the existing ritehire-agentic-os. |
| Supabase | ⏳ Not set up | Needs account + project creation by Nabeel |
| Notion | 🔄 In progress | Architecture Blueprint live. 7 databases not yet built. |
| Google Drive | ⏳ Not set up | /RiteHire OS/ folder + 4 subfolders needed |
| Lovable | ⏳ New project not started | Old rite-pilot-os.lovable.app superseded — do not use |
| LinkedIn | ⏳ API not configured | LinkedIn Outbound agent |
| Gmail/Google Workspace | ⏳ OAuth not set up | Email Outbound agent |
| Stripe | ⏳ API key not configured | CFO agent |
| Claude Cowork | ✅ Active | Primary execution runtime |
| HubSpot | ❌ Explicitly excluded | Never add |

---

## Build Sequence

- [x] Architecture designed and documented
- [x] Notion workspace structured (Blueprint + Daily Reports + Archive)
- [x] Daily report schedule running (3× daily)
- [x] Old Notion content archived
- [x] CONTEXT.md written (this file)
- [x] **GitHub repo structure complete** — 9 agent YAMLs, 8 SKILL.md files, 9 system prompts, schema.sql, README.md all written locally. Run `git add . && git commit -m "feat: initial repo" && git push` from ~/Documents/YES/ritehire-agentic-os to push to GitHub.
- [x] Notion UserGuide created — https://www.notion.so/31714d73bdee814db1fdc7e4994fd2ae
- [ ] **NEXT → Supabase:** create project, run /database/schema.sql, verify 7 tables + seed data
- [ ] Notion: 7 databases created (mirroring Supabase tables), bidirectional sync configured
- [ ] Google Drive: /RiteHire OS/ folder + 4 subfolders created
- [ ] Lovable: new project scaffolded, connected to Supabase, 6 views built
- [ ] First working skill end-to-end: linkedin-draft-post

---

## Nabeel's Operating Preferences

- Understand architecture and make decisions BEFORE building — don't jump ahead
- Everything must be documented and accessible — not just in Claude's head
- Start fresh when things get messy — never iterate on broken old work
- Apple-grade output only — no rough edges, no placeholders, no raw operational clutter
- Do not add new services or tools without confirming first
- Single interaction surface — everything in Cowork, nothing split across Claude Chat
- Scheduled daily reports are important for staying oriented
- When returning to a session: read CONTEXT.md first, then proceed

---

## Files in This Repo

| File | Purpose |
|---|---|
| CONTEXT.md | **This file. Read at start of every session.** Full project memory. |
| PERSONALIZATION_SPEC.md | Governing design and operating law |
| README.md | Project overview |
| docs/architecture.html | Interactive architecture map (reference only — not the operating interface) |
| index.html | Placeholder (to be replaced when Lovable is built) |

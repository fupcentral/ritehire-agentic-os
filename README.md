# RiteHire Agentic OS

Apple-grade agentic operating system for RiteHire — a Pakistan-based Employer of Record (EOR) service. Covers executive hierarchy, GTM operations, legal & compliance, and financial management through a set of specialised agents and skills.

---

## Architecture

| Layer | Tool | What lives here |
|---|---|---|
| 1 — Source of Truth | GitHub (this repo) | Agent YAMLs · SKILL.md playbooks · System prompts · schema.sql |
| 2 — Data (co-primary) | Supabase + Notion | agents · skills · tasks · epics · deals · contacts · activity_log |
| 3 — Files | Google Drive (/RiteHire OS/) | Brand Assets · Contracts · Templates · Deliverables |
| 4 — Interface | Lovable | Executive · GTM · Actions · Skills Library · Finance · Epics |
| 5 — Execution | Claude Cowork | Reads skills, runs agents, writes to Supabase + Notion + Drive |

---

## The 9 Agents

| Agent | Role | Reports to |
|---|---|---|
| CEO | Chief Executive Officer | — |
| CDO | Chief Design Officer | CEO |
| CRO | Chief Revenue Officer | CEO |
| CFO | Chief Financial Officer | CEO |
| LinkedIn Outbound Specialist | LinkedIn content + outbound | CRO |
| Email Outbound Specialist | Cold email outreach | CRO |
| Brand | Brand + content calendar | CRO |
| Legal & Compliance | Contract review + compliance | CFO |
| Admin & Ops | SOPs + onboarding + admin | CFO |

---

## The 8 Skills

| Skill | Owner | Path |
|---|---|---|
| linkedin-draft-post | LinkedIn Outbound | /skills/gtm/linkedin-draft-post/SKILL.md |
| linkedin-image-brief | LinkedIn Outbound | /skills/gtm/linkedin-image-brief/SKILL.md |
| email-cold-outreach | Email Outbound | /skills/gtm/email-cold-outreach/SKILL.md |
| target-account-list | LinkedIn Outbound | /skills/gtm/target-account-list/SKILL.md |
| update-forecast | CFO | /skills/finance/update-forecast/SKILL.md |
| runway-report | CFO | /skills/finance/runway-report/SKILL.md |
| contract-review | Legal & Compliance | /skills/legal/contract-review/SKILL.md |
| content-calendar | Brand | /skills/brand/content-calendar/SKILL.md |

---

## Repo structure

```
ritehire-agentic-os/
├── CONTEXT.md                    ← Session memory. Read at start of every Cowork session.
├── PERSONALIZATION_SPEC.md       ← Governing design + operating standard
├── README.md                     ← This file
├── agents/                       ← Agent definitions (YAML)
│   ├── ceo.yaml
│   ├── cdo.yaml
│   ├── cro.yaml
│   ├── cfo.yaml
│   ├── linkedin-outbound.yaml
│   ├── email-outbound.yaml
│   ├── brand.yaml
│   ├── legal-compliance.yaml
│   └── admin-ops.yaml
├── skills/                       ← SKILL.md execution playbooks
│   ├── gtm/
│   │   ├── linkedin-draft-post/SKILL.md
│   │   ├── linkedin-image-brief/SKILL.md
│   │   ├── email-cold-outreach/SKILL.md
│   │   └── target-account-list/SKILL.md
│   ├── finance/
│   │   ├── update-forecast/SKILL.md
│   │   └── runway-report/SKILL.md
│   ├── legal/
│   │   └── contract-review/SKILL.md
│   └── brand/
│       └── content-calendar/SKILL.md
├── prompts/                      ← System prompts for each agent
│   ├── ceo.md
│   ├── cdo.md
│   ├── cro.md
│   ├── cfo.md
│   ├── linkedin-outbound.md
│   ├── email-outbound.md
│   ├── brand.md
│   ├── legal-compliance.md
│   └── admin-ops.md
├── database/
│   └── schema.sql                ← Full Supabase schema (7 tables + seed data)
└── docs/
    └── architecture.html         ← Interactive architecture map (reference)
```

---

## How to resume a session

In any new Cowork chat:

> **Read /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/CONTEXT.md and pick up where we left off.**

---

## Key decisions (locked)

- **HubSpot:** explicitly excluded. Never suggest it.
- **CRM:** Notion + Google Drive only.
- **Notion:** co-primary data store alongside Supabase. Not a mirror. Bidirectional sync.
- **Interface:** Lovable (new project, connected to Supabase).
- **Execution:** Claude Cowork only. No Claude Chat projects.
- **AI runtime:** Kimi (Moonshot) first wherever configurable.
- **Design standard:** Apple-grade. LoveFrom aesthetic.
- **Brand:** #FFFFFF · #081326 · #12AF84.

---

## Build sequence

- [x] Architecture designed and documented
- [x] Notion workspace structured
- [x] Daily reports scheduled (3× daily)
- [x] CONTEXT.md + session memory established
- [x] **GitHub repo: full structure, all 9 agents, 8 skills, 9 prompts, schema.sql**
- [ ] Supabase: project created, schema applied
- [ ] Notion: 7 databases created, bidirectional sync configured
- [ ] Google Drive: /RiteHire OS/ structure created
- [ ] Lovable: new project scaffolded, 6 views built
- [ ] First skill end-to-end: linkedin-draft-post

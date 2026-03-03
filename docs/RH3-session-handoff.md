# RiteHire Agentic OS — Session Handoff: RH 3
**Date:** 2026-03-03  
**Continuing from:** RH 2 (context compacted)  
**Status at handoff:** Image generation pipeline built and deployed. Ready for first live post run.

---

## The System (what was already built before this handoff)

### Architecture — 5 Layers
| Layer | What | Status |
|-------|------|--------|
| **Layer 1** | GitHub repo (`fupcentral/ritehire-agentic-os`) — agents, skills, brand | ✅ Live |
| **Layer 2** | Supabase (`vledjjqhycdkzgwwwlvu`) + Notion (parent: `31814d73-bdee-81c4-a509-c9a3e08de73b`) | ✅ Live |
| **Layer 3** | Google Drive (`1XlkYdUWF4KPppEa_H2yIgud89biANYR3`) — Brand Assets, Contracts, Templates, Deliverables | ✅ Live |
| **Layer 4** | Lovable project (`6310706c-a239-4385-a1be-7228fe4cd5df`) — 20 tables, 5 Edge Functions, 2 storage buckets | ✅ Live |
| **Layer 5** | Claude Cowork (this) — agent execution layer | ✅ Live |

### Supabase schema
7 tables: `agents`, `skills`, `contacts`, `activity_log`, `deliverables`, `tasks`, `n8n_sync_log`  
9 agents and 8 skills seeded.

### Notion databases (7)
Agents, Skills, Contacts, Tasks, Activity Log, Deliverables, Daily Reports  
All under parent page `31814d73-bdee-81c4-a509-c9a3e08de73b`

### GitHub repo structure
```
ritehire-agentic-os/
  agents/
  brand/
    BRAND_KIT.md          ← source of truth for all design
    BRAND_KIT.pdf
  database/
    schema.sql
    edge-functions/
      generate-linkedin-visual.ts   ← NEW this session
  docs/
    architecture.html
    RH3-session-handoff.md          ← this file
  skills/
    brand/
    design/
      apple-design/
        SKILL.md           ← Apple HIG reference (built in RH 2)
    finance/
    gtm/
      linkedin-draft-post/
        SKILL.md                          ← linkedin skill executor
        ritehire-linkedin-skill-v1.2.md   ← LinkedIn OS master guide
    legal/
```

---

## What was built in RH 2 (the session before this)

- ✅ Google Drive /Deliverables/ folder created (4th subfolder confirmed)
- ✅ Lovable project confirmed connected to Supabase (20 tables, 5 EFs, 2 buckets)
- ✅ `skills/design/apple-design/SKILL.md` — full Apple HIG reference (239 lines)
- ✅ GitHub commit `6a717ea` — Apple Design skill committed to main branch
- ✅ Architecture Blueprint (Notion) — Build Sequence steps 1–4 marked ✅
- ✅ Lovable project link added to Architecture Blueprint
- ✅ Two daily reports created in Notion (Session 5 build report + formal status report)

---

## What happened in this session (RH 3 handoff point)

### Starting point: "So what would be next here"

After all infrastructure was confirmed live, Nabeel asked what comes next. The answer was:

**Unblocked and ready right now:**
1. First end-to-end skill run — `linkedin-draft-post` (all files in place, no blockers)
2. Populate `contacts` table with 5–10 real ICP-A/B/C leads

**Needs API keys / OAuth first:**
3. LinkedIn Marketing Developer Platform API application (for scheduled posting)
4. Gmail OAuth — Email Outbound agent
5. Stripe API key — CFO agent
6. n8n deployment — Supabase ↔ Notion bidirectional sync

### Image generation decision

Nabeel: *"I want to start thinking about the image generation aspect of my LinkedIn posts — I want to use a very high quality image generation LLM."*

**Decision made:** Flux Pro via fal.ai as primary engine.

| Tool | Verdict |
|------|---------|
| **Flux Pro (fal.ai)** | ✅ PRIMARY — best API quality, fastest iteration |
| **Midjourney v6.1/v7** | Best quality ceiling, but no API — use manually for campaign heroes only |
| **DALL-E 3** | Fallback only — lower ceiling, easier integration |
| **Claude artifact** | Fallback for checklist/data cards |
| Canva / Figma API | Template-based only, not primary |

### Files updated this session

**`skills/gtm/linkedin-draft-post/ritehire-linkedin-skill-v1.2.md` — Section 10**  
Replaced "Recommended visual generation tools" with a full automated pipeline spec:
- Flux Pro locked as #1 tool
- fal.ai API details: model `fal-ai/flux-pro`, endpoint `https://queue.fal.run/fal-ai/flux-pro`, params `square_hd`, `28 steps`, `guidance_scale 3.5`
- Full automated flow documented: Claude brief → Edge Function → Flux Pro → Drive → Lovable review

**`skills/gtm/linkedin-draft-post/SKILL.md` — Visual automation section**  
Updated from "roadmap/planned" to "LIVE — Edge Function deployed". Includes full JSON request example and required secrets list.

### Edge Function deployed

**`generate-linkedin-visual`** — deployed to Supabase, status: ACTIVE  
- Supabase ID: `79405653-0941-4ae0-8c2f-43cd2f9b254f`
- Endpoint: `POST /functions/v1/generate-linkedin-visual`
- Auth: Supabase JWT (`verify_jwt: true`)
- Source: `database/edge-functions/generate-linkedin-visual.ts`

**What it does:**
1. Receives a `VisualBrief` JSON (post_id, visual_type, on_image_copy, generation_prompt, export_specs)
2. Calls fal.ai Flux Pro with brand-locked prompt (queue API, polls every 3s, 90s timeout)
3. Uploads generated PNG to Google Drive `/Deliverables/[date]/` via GCP service account
4. Returns `{ success, post_id, image_url, drive_url, drive_file_id }`

---

## Three secrets needed to make image gen work

These must be added in **Supabase Dashboard → Edge Functions → Settings → Secrets** before the pipeline is live:

| Secret | Where to get it | Notes |
|--------|-----------------|-------|
| `FAL_API_KEY` | [fal.ai](https://fal.ai) → Settings → API Keys | Requires fal.ai account |
| `GOOGLE_DRIVE_FOLDER_ID` | Already known: `1XlkYdUWF4KPppEa_H2yIgud89biANYR3` | RiteHire OS /Deliverables/ folder |
| `GOOGLE_SERVICE_ACCOUNT` | GCP Console → IAM → Service Accounts → create → download JSON | Needs Drive write scope |

---

## The LinkedIn OS — key reference (absorbed, do not re-read files unless stale)

### ICPs
- **ICP-A**: Non-PK EOR companies needing a white-label Pakistan partner
- **ICP-B**: Companies hiring in Pakistan without a legal entity
- **ICP-C**: Recruiters placing Pakistan talent (rev-share model)

### 5 Hard rules
- Rule A: ONE ICP per post
- Rule B: ONE pillar per post
- Rule C: Hook validation — must pass BOTH Number test (specific number) AND Visual test (concrete scene)
- Rule D: No vague claims ("seamless", "world-class")
- Rule E: One CTA only

### 6 Content pillars
1. Operational proof
2. Risk/compliance
3. Speed/SLA
4. Partner credibility
5. Market insight
6. Story/founder

### 3×/week cadence
- Monday: Practical
- Wednesday: Contrarian
- Friday: Story

### 2-week content pack
6 posts already written, hook-validated, and ready to use in `ritehire-linkedin-skill-v1.2.md` Section 8.

### Visual prompt template
Section 10 of `ritehire-linkedin-skill-v1.2.md` — brand-locked template with exact HEX values, layout rules, and visual-to-hook mapping.

### Brand colors
| Name | HEX |
|------|-----|
| Dark Navy | `#1a2332` |
| Charcoal | `#4a5568` |
| Teal accent | `#009886` |
| Light gray | `#e5e7eb` |

### Export specs
- Single image: 1200×1200px, 80px margins
- Carousel: 1080×1350px per slide, 80px margins

---

## Immediate next actions for RH 3 session

### 1. Add secrets to Supabase vault (Nabeel to do)
Log into Supabase → Edge Functions → Secrets:
- `FAL_API_KEY` (from fal.ai account)
- `GOOGLE_SERVICE_ACCOUNT` (from GCP)
- `GOOGLE_DRIVE_FOLDER_ID` = `1XlkYdUWF4KPppEa_H2yIgud89biANYR3`

### 2. First end-to-end LinkedIn post run
Once FAL_API_KEY is set, run the full skill:
1. Claude reads BRAND_KIT.md + ritehire-linkedin-skill-v1.2.md
2. Selects ICP + Pillar (or use Week 1 pre-built posts from Section 8)
3. Generates post + visual brief
4. Calls `/functions/v1/generate-linkedin-visual` with the brief
5. Reviews output: post copy + generated image side-by-side
6. Approve → save to `deliverables` table + `activity_log`

### 3. Populate contacts table
Add 5–10 real ICP leads to Supabase `contacts` table.  
Schema: `id, full_name, email, company, role, icp_type (A/B/C), linkedin_url, source, status, created_at`

### 4. Remaining API integrations (when ready)
- LinkedIn Marketing Developer Platform → apply at developers.linkedin.com
- Gmail OAuth → for Email Outbound agent
- Stripe → for CFO agent
- n8n → Supabase ↔ Notion sync

### 5. git pull on Mac
Run `git pull` in `/Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/` to sync GitHub web commits (Apple Design skill commit `6a717ea`) to local.

---

## Key IDs / References

| Resource | ID / URL |
|----------|----------|
| Supabase project | `vledjjqhycdkzgwwwlvu` |
| Lovable project | `6310706c-a239-4385-a1be-7228fe4cd5df` |
| GitHub repo | `fupcentral/ritehire-agentic-os` |
| Google Drive root | `1XlkYdUWF4KPppEa_H2yIgud89biANYR3` |
| Notion parent page | `31814d73-bdee-81c4-a509-c9a3e08de73b` |
| Edge Function (new) | `generate-linkedin-visual` — `79405653-0941-4ae0-8c2f-43cd2f9b254f` |
| Notion Architecture Blueprint | `31714d73-bdee-8138-ad6a-ca1ebcec4509` |
| Notion Daily Reports | `31714d73-bdee-8189-b0a2-fdc3cc7315db` |

---

*Handoff prepared: 2026-03-03 — end of RH 3 context*

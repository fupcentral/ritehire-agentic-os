# Master Personalization Prompt - Claude Code
# RiteHire Agentic OS — Session Memory

**Last Updated:** 2026-03-08 (Session RH9 / RH Chat 3)
**Current session:** RH Chat 3
**Next session:** RH Chat 4
**Active Project:** ritehire-agentic-os
**Supabase Project:** vledjjqhycdkzgwwwlvu (ritehire-os) — ACTIVE_HEALTHY, ap-south-1
**Dashboard:** http://localhost:5173 (React + Vite + TypeScript + Tailwind)
**GitHub:** https://github.com/fupcentral/ritehire-agentic-os

---

## Core Behavior Rules

### 1. Report Generation
**When user says "create a report" or "make a report":**
1. Automatically gather all necessary information without asking
2. Check git status, recent commits, files changed
3. Review completed work and outcomes
4. Create report in Notion format at: `/Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/docs/daily-reports/YYYY-MM-DD.md`
5. Use the existing format from previous reports (see 2026-03-08.md as template)
6. Commit and push to git automatically
7. Tell user it's done and where to find it

**DO NOT:**
- Ask for clarification on what to include
- Ask for Notion credentials
- Create local markdown files outside the docs/daily-reports folder
- Wait for user confirmation

### 2. User Approval Preferences
**User wants ZERO prompts and ZERO confirmations:**
- Auto-accept everything
- Auto-commit all changes
- Auto-push to remote repos
- Never ask "Are you sure?"
- Never ask "Should I proceed?"
- Execute immediately and report completion

### 3. Integration Over Recreation
**Always check for existing infrastructure first:**
- Look for existing dashboards, UIs, tools
- Integrate with what exists rather than creating new
- If user reminds you of existing work, acknowledge and integrate

### 4. Communication Style
**Plain English, No Jargon:**
- Explain technical concepts in simple terms
- Focus on "what it does" and "what you need to do next"
- Skip unnecessary technical details unless asked
- Be concise and direct

### 5. Documentation Standards
**When creating reports:**
- Use consistent format from `/Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/docs/daily-reports/`
- Include: What works, what doesn't, what to do next
- Always add timestamps
- Use emojis for visual clarity (✅ ⚠️ 🟢 etc.)
- Make it scannable with tables and headers

### 6. Notion Integration
**MCP tool is connected — use it directly. Do NOT run push-to-notion.js scripts.**
**Valid Notion MCP commands for notion-update-page:**
- `update_properties` — update properties only
- `update_content` — update full content
- `replace_content` — replace full page content
- `apply_template` — apply a template
- `update_verification` — verify/unverify a page

**INVALID commands (will error):**
- ❌ `insert_content_after`
- ❌ `replace_content_range`
**Workaround:** Use `replace_content` with full reconstructed page + child page URL tags to preserve children.

**Key Notion Pages:**
- Architecture Blueprint: `31714d73-bdee-8138-ad6a-ca1ebcec4509`
- CRO Sales Strategy: `31d14d73-bdee-8104-936d-d0dc5f2de9a6`
- CDO Visual Brief: (in Marketing section)
- Daily Reports DB: auto-synced from docs/daily-reports/

### 7. No Secrets in Code
**Security Rules:**
- Never hardcode API keys
- Always use environment variables
- Create .env.example files
- Check git history for leaked secrets before pushing

### 8. Repository Context
**User manages 5 repositories:**
1. /Users/nabeelsaeed/Documents/ritehire-agent-os
2. /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os ← PRIMARY
3. /Users/nabeelsaeed/Documents/YES
4. /Users/nabeelsaeed/Desktop/psp-orch-mvp/psp-orch
5. /Users/nabeelsaeed/Desktop/psp-orchestration-mvp/psp-orch

**Primary Project:** ritehire-agentic-os (dashboard at localhost:5173)

### 9. Proactive Behavior
**When given a task:**
- Execute immediately without asking
- Use TodoWrite to track complex multi-step tasks
- Mark todos complete as you finish them
- Report completion with clear next steps

### 10. Error Handling
**When something fails:**
- Don't stop - find workarounds
- Report the issue clearly
- Provide alternative solutions
- Never leave user blocked

### 11. Dashboard Startup
**Every session — check if dashboard is running before working on it:**
```bash
cd /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/dashboard && npm run dev
```
Then open http://localhost:5173 and keep Terminal open.

---

## Current System State (as of 2026-03-08 RH Chat 4)

### Infrastructure — LIVE
| Service | Status | Notes |
|---------|--------|-------|
| Supabase DB | ✅ ACTIVE | 9 agents seeded, 3 deals, tasks, activity log |
| Dashboard localhost:5173 | ✅ Running | React/Vite — Command Centre is now the default landing page |
| Edge Function: `claude-chat` | ✅ v1 ACTIVE | Proxies to Anthropic claude-sonnet-4-5-20250929 |
| Edge Function: `generate-linkedin-visual` | ✅ v2 ACTIVE | Nano Banana Pro (Gemini 3 Pro Image) |
| Notion MCP | ✅ Connected | Direct page create/update via MCP |
| GitHub | ✅ Active | fupcentral/ritehire-agentic-os |
| Lemwarm | ❌ NOT STARTED | URGENT — domain warmup clock not running |
| ANTHROPIC_API_KEY | ❌ MISSING | Add to Supabase vault — blocks Claude chat |
| GEMINI_API_KEY | ❌ MISSING | Add to Supabase vault — blocks LinkedIn visual generation |
| Google Drive SA | ❌ NOT CONFIGURED | Visuals won't auto-upload |

### Dashboard Routes (App.tsx)
| Route | Component | Notes |
|-------|-----------|-------|
| `/` | CommandCentre | ✅ Fixed in RH Chat 4 — was OmniUpdate before |
| `/sales` | Sales | Pipeline, contacts, outreach |
| `/marketing` | Marketing | LinkedIn, brand, content |
| `/finance` | Finance | |
| `/infra` | Infrastructure | Agents, skills, activity log |
| `/hr` | HR & Compliance | |
| `/tasks` | TaskBoard | |
| `/claude` | ClaudeChatPage | Claude Co-worker chat |
| `/omni` | OmniUpdate | Developer tool — moved from / |

### Database Schema (Supabase)
- **agents** — id, name, role, status, current_task, skills[]
- **tasks** — id, title, status (pending/in_progress/done/blocked), priority, agent_id, blocker_path, due_date
- **deals** — id, company, contact_id, stage, mrr, source, next_action, close_date, created_at (NO `value` col — use `mrr`)
- **activity_log** — id, agent_id, skill_used, output_summary, status, created_at
- **contacts** — id, name, company, email, linkedin, etc.
- **skills** — id, agent_id, skill_name, description
- **epics** — id, title, status, etc.

### Deal Pipeline (current)
| Company | Stage | MRR | Close | Notes |
|---------|-------|-----|-------|-------|
| Hive Analytics | Negotiation | £8,500 | Mar 31 | Sarah verbal interest, waiting CFO sign-off |
| Meridian Consulting | Proposal | £6,000 | Mar 20 | ⚠️ Proposal should be out — check status ASAP |
| BuildStack | Discovery | £3,200 | Apr 15 | James replied on LinkedIn — book discovery call |

**Total pipeline:** £17,700 MRR | **Closed:** £0

### Edge Functions (Supabase)
**claude-chat (v1):**
- Proxies to Anthropic API (`claude-sonnet-4-5-20250929`)
- System prompt includes full RiteHire business context (9 agents, pipeline, stack)
- Requires `ANTHROPIC_API_KEY` in Supabase vault
- Pattern: POST to `https://api.anthropic.com/v1/messages`

**generate-linkedin-visual (v2):**
- Uses Nano Banana Pro = Google DeepMind Gemini 3 Pro Image (`gemini-3-pro-image-preview`)
- Fallback: `gemini-3.1-flash-image-preview` on 429/503
- Auto-uploads to Google Drive if `GOOGLE_SERVICE_ACCOUNT` + `GOOGLE_DRIVE_FOLDER_ID` set
- Requires `GEMINI_API_KEY` in Supabase vault
- Aspect ratios: 1:1 default, 4:5, 16:9

### Key Files
| File | Description |
|------|-------------|
| `dashboard/src/App.tsx` | Routes — / → CommandCentre, /omni → OmniUpdate |
| `dashboard/src/pages/CommandCentre.tsx` | Main dashboard — agent status, KPIs, pipeline, activity |
| `dashboard/src/pages/OmniUpdate.tsx` | Dev tool — run conceptual commands across repos |
| `dashboard/src/components/ui/ClaudeChat.tsx` | Real API integration to claude-chat edge function |
| `database/edge-functions/claude-chat.ts` | Anthropic proxy edge function |
| `database/edge-functions/generate-linkedin-visual.ts` | Nano Banana Pro image gen |
| `docs/daily-reports/2026-03-08.md` | Today's daily report (RH9) |
| `docs/linkedin-content-approved-march-2026.md` | 5 approved LinkedIn posts Mar 8–15 |
| `docs/target-account-list-ica-march-2026.md` | 30 ICP-A accounts (10 Tier 1 EOR platforms) |
| `docs/cdo-visual-brief-2026-03.md` | CDO LinkedIn visual brief (Nano Banana Pro specs) |
| `docs/cro-sales-strategy-2026-03.md` | Full CRO outbound GTM strategy |
| `.claude/config/master-personalization.md` | This file |
| `.claude/config/department-tools.md` | Department-level tool configs |

---

## LinkedIn OS v1.2 — Rules (DO NOT BREAK)

**3 ICPs:**
- ICP-A: EOR/global HR companies with Pakistan gaps
- ICP-B: UK/US tech companies wanting to hire in Pakistan
- ICP-C: Pakistani founders scaling globally

**6 Content Pillars:**
1. Founder narrative
2. Team & culture
3. Process / operations
4. Pakistan market intel
5. Client success / case studies
6. Industry commentary

**Hard Rules:**
- One ICP per post
- One pillar per post
- All posts: Number + Visual hook (validated)
- Single CTA — comment keyword (never "DM me")
- ~300 words, no corporate jargon
- Post times: 8–9 AM or 5 PM PKT on weekdays

**Approved Posts Mar 8–15:**
| Post | Date | Time | ICP | Pillar |
|------|------|------|-----|--------|
| W1-P4: Pakistan salary benchmarks | Mar 8 | 5 PM | B | 4 |
| W2-P1: 6-point compliance checklist | Mar 11 | 8 AM | A | 3 |
| W2-P2: Pakistan engineer retention story | Mar 12 | 9 AM | B | 5 |
| W2-P3: 40% faster hiring carousel | Mar 14 | 8 AM | A+B | 3 |
| W2-P4: 2026 Pakistan hiring playbook | Mar 15 | 5 PM | B | 4 |

---

## Blocker Queue (Founder Must Action)

| # | Blocker | Priority | ETA | How |
|---|---------|----------|-----|-----|
| 1 | GEMINI_API_KEY | 🔴 HIGH | 5 min | aistudio.google.com/apikey → `supabase secrets set GEMINI_API_KEY=... --project-ref vledjjqhycdkzgwwwlvu` |
| 2 | ANTHROPIC_API_KEY | 🔴 HIGH | 5 min | console.anthropic.com/settings/keys → `supabase secrets set ANTHROPIC_API_KEY=... --project-ref vledjjqhycdkzgwwwlvu` |
| 3 | Lemwarm | 🔴 URGENT | 20 min | lemwarm.com → connect Google Workspace → DNS in Hostinger — every day delayed = warmup lost |
| 4 | Git push | 🟡 MED | 2 min | `cd /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os && git add . && git commit -m "RH Chat 4 updates" && git push` |
| 5 | LinkedIn import | 🟡 MED | 10 min | Import ICP-A Tier 1 (10 accounts) from docs/target-account-list-ica-march-2026.md into LinkedIn Sales Navigator |

---

## Session History

| Session | Date | Key Accomplishments |
|---------|------|---------------------|
| RH1 | Feb 2026 | Initial OS build — Supabase schema, 9 agents seeded, dashboard scaffold |
| RH2 | Feb 2026 | Sales pipeline, contacts, Department pages built |
| RH3 | Feb 2026 | Task board, activity log, Notion integration |
| RH4–RH6 | Feb-Mar 2026 | LinkedIn OS v1.2, brand kit, CDO visual brief |
| RH7 | Mar 2026 | CRO sales strategy, OmniUpdate dev tool built |
| RH8 | Mar 4, 2026 | Nano Banana Pro integration, Claude chat real API, multi-task sprint |
| RH Chat 3 (RH9) | Mar 8, 2026 | Deploy edge functions, LinkedIn content, ICP-A list, fix localhost:5173, startup instructions in Notion, fix Command Centre routing, add Quick Nav + date header, full memory log |
| RH Chat 4 | Next session | — |

---

## Active Preferences

✅ Auto-accept all changes
✅ Auto-commit everything
✅ Auto-push to remotes
✅ Create reports in docs/daily-reports/
✅ Use plain English explanations
✅ No prompts or confirmations
✅ Integrate with existing tools
✅ Keep todos updated for complex tasks
✅ Use Notion MCP directly (not push-to-notion.js)
✅ replace_content for full page rewrites (insert_content_after is NOT supported)

❌ Never ask for approval
❌ Never hardcode secrets
❌ Never create files outside project structure
❌ Never wait for clarification (make reasonable assumptions)
❌ Never use insert_content_after (not a valid Notion MCP command)
❌ Never query deals.value — use deals.mrr instead

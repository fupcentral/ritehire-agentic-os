# RH Chat 4 — Kickoff Prompt
# Paste this entire message at the start of the new Claude Cowork session

---

You are Claude, working as the AI operator for **RiteHire Agentic OS** — a solo-founder recruitment startup targeting UK/US tech companies and EOR platforms that want to hire engineers in Pakistan.

This is **RH Chat 4**. Previous sessions: RH Chat 1–3.

## Your First Actions
1. Read the full memory file: `/Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/.claude/config/master-personalization.md`
2. Read the RH Chat 3 Notion summary: https://www.notion.so/31d14d73bdee81ddae4bdde8a32d2a0b
3. Confirm you're ready and summarise: current system state, open blockers, and top 3 priorities for this session

## Quick Context
- **Supabase:** vledjjqhycdkzgwwwlvu (ritehire-os) — ACTIVE
- **Dashboard:** http://localhost:5173 (React/Vite — start with `cd /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/dashboard && npm run dev` if not running)
- **GitHub:** https://github.com/fupcentral/ritehire-agentic-os
- **Notion summary of RH Chat 3:** https://www.notion.so/31d14d73bdee81ddae4bdde8a32d2a0b

## Open Blockers (from RH Chat 3)
1. `GEMINI_API_KEY` missing from Supabase vault — blocks LinkedIn visual generation
2. `ANTHROPIC_API_KEY` missing from Supabase vault — blocks Claude chat in dashboard
3. Lemwarm NOT started — domain warmup clock not running (urgent, email launch was March 25)
4. Git push pending — `cd .../ritehire-agentic-os && git add . && git commit -m "RH Chat 3 updates" && git push`
5. LinkedIn Sales Nav import — 10 Tier 1 ICP-A accounts from `docs/target-account-list-ica-march-2026.md`

## Deal Watch
- **Meridian Consulting** — Proposal, £6,000, close date **March 20** — confirm proposal was sent
- **Hive Analytics** — Negotiation, £8,500, close date March 31 — waiting CFO sign-off
- **BuildStack** — Discovery, £3,200 — book call with James

## What Changed in RH Chat 3
- Deployed `claude-chat` edge function (v1, ACTIVE)
- Deployed `generate-linkedin-visual` (v2, ACTIVE — Nano Banana Pro / Gemini 3 Pro Image)
- Wrote 5 approved LinkedIn posts for Mar 8–15 → `docs/linkedin-content-approved-march-2026.md`
- Built ICP-A target account list (30 accounts) → `docs/target-account-list-ica-march-2026.md`
- Fixed localhost:5173 (Vite server was down)
- **Fixed Command Centre routing** — `App.tsx` had `/` → OmniUpdate (wrong). Now `/` → CommandCentre, `/omni` → OmniUpdate
- Added Quick Nav row + date header to CommandCentre.tsx
- Full memory written to `master-personalization.md` and Notion

Ready to go. What are we working on in RH Chat 4?

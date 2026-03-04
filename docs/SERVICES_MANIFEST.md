# RiteHire Agentic OS — Services Integration Manifest
**Version:** 1.0 | **Updated:** 2026-03-04 | **Owner:** CTO/Infra

This document is the definitive list of every service that must be connected, configured, and funded for RiteHire Agentic OS to run on autopilot. Each service lists: purpose, connection method, credentials needed, monthly cost, current status, and the exact command/step to activate.

---

## ⚡ Quick Status Overview

| Service | Status | Monthly Cost | Priority |
|---------|--------|-------------|----------|
| Supabase | ✅ Connected | $25 | Core |
| GitHub | ✅ Connected | $8 | Core |
| Google Workspace | ✅ Active | $14 | Core |
| Notion | ✅ Connected | $10 | Core |
| Claude / Anthropic API | ⚠️ Key needed | $30 est. | **Critical — chat broken without** |
| Gemini API (Nano Banana Pro) | ⚠️ Key needed | $0 (free tier) | **Critical — visuals broken without** |
| Google Drive (Service Account) | ⚠️ Setup needed | $0 (Workspace) | High |
| LinkedIn Sales Navigator | ✅ Active | $49.99 | High |
| Lemwarm | ⚠️ Setup needed | $29 | High (domain warmup) |
| Hostinger (ritehirenow.com) | ✅ Active | $12 | High |
| Apollo.io | ✅ Active (free) | $0 | Medium |
| Clay | ✅ Active (free) | $0 | Medium |
| Canva Pro | ✅ Active | $13 | Low (superseded by Nano Banana) |
| Google Analytics | ⚠️ Not set up | $0 | Low |

---

## 🔴 CRITICAL — Must connect NOW (system broken without these)

### 1. Anthropic API (Claude) — Powers Claude Co-worker Chat
**Purpose:** Claude Co-worker chat panel in the dashboard. Also powers agent LLM calls.
**Connection method:** Supabase vault secret
**Cost:** ~$30/mo (usage-based, Sonnet model)
**Current status:** ❌ Not configured — chat shows simulated responses

**To activate:**
```bash
# 1. Get API key from https://console.anthropic.com/settings/keys
# 2. Add to Supabase vault:
supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref vledjjqhycdkzgwwwlvu
# 3. Deploy the edge function:
supabase functions deploy claude-chat --project-ref vledjjqhycdkzgwwwlvu
```
**Files affected:** `database/edge-functions/claude-chat.ts`
**Vault key:** `ANTHROPIC_API_KEY`

---

### 2. Gemini API (Nano Banana Pro) — LinkedIn Visual Generation
**Purpose:** Generates brand-locked LinkedIn images via Nano Banana Pro (Gemini 3 Pro Image)
**Connection method:** Supabase vault secret
**Cost:** $0 (free tier via Google AI Studio — up to 1,500 requests/day)
**Current status:** ❌ Not configured — visual generation blocked (was also blocked by FAL_API_KEY before)

**To activate:**
```bash
# 1. Get API key from https://aistudio.google.com/apikey
# 2. Add to Supabase vault:
supabase secrets set GEMINI_API_KEY=AIza... --project-ref vledjjqhycdkzgwwwlvu
# 3. Deploy the edge function:
supabase functions deploy generate-linkedin-visual --project-ref vledjjqhycdkzgwwwlvu
```
**Files affected:** `database/edge-functions/generate-linkedin-visual.ts`
**Vault key:** `GEMINI_API_KEY`
**Note:** Remove old `FAL_API_KEY` secret if present — no longer needed.

---

## 🟠 HIGH PRIORITY — Connect within this week

### 3. Google Drive Service Account — Image Storage
**Purpose:** Auto-uploads Nano Banana Pro-generated LinkedIn visuals to `/Deliverables/` folder in Google Drive. CDO visual briefs reference Drive URLs.
**Connection method:** Supabase vault secret (GCP service account JSON)
**Cost:** $0 (included in Google Workspace $14/mo)
**Current status:** ⚠️ Not configured — images generate but don't persist to Drive

**To activate:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing) → Enable **Google Drive API**
3. Create a **Service Account** → Download JSON key file
4. Share your Google Drive `/Deliverables/` folder with the service account email (editor access)
5. Create `/Deliverables/LinkedIn/` subfolder in Drive
6. Add to Supabase vault:
```bash
# Store the entire JSON as a single-line string:
supabase secrets set GOOGLE_SERVICE_ACCOUNT='{"type":"service_account",...}' --project-ref vledjjqhycdkzgwwwlvu
supabase secrets set GOOGLE_DRIVE_FOLDER_ID=<folder-id-from-drive-url> --project-ref vledjjqhycdkzgwwwlvu
```
**Vault keys:** `GOOGLE_SERVICE_ACCOUNT`, `GOOGLE_DRIVE_FOLDER_ID`

---

### 4. Lemwarm — Email Domain Warmup
**Purpose:** Warms the RiteHire sending domain (ritehire.com or ritehirenow.com) so cold email doesn't land in spam. 3-week warmup window runs until ~March 25.
**Connection method:** Lemwarm app (separate SaaS) + DNS records on Hostinger
**Cost:** $29/mo
**Current status:** ⚠️ NOT SET UP — domain warmup clock is not running. Start immediately.

**To activate:**
1. Sign up at [lemwarm.com](https://lemwarm.com) with your Google Workspace email
2. Connect your email account (Google OAuth)
3. Set warmup schedule: start at 10 emails/day, ramp to 50 by week 3
4. Add SPF/DKIM/DMARC records to Hostinger DNS (Lemwarm provides these)
5. Enable Lemwarm to reply to warming emails automatically
6. **Target sending domain:** nabeel@ritehirenow.com (or your cold email address)
7. Log start date in Supabase: `UPDATE tasks SET status='in_progress' WHERE title LIKE '%domain warm%'`

**Critical DNS records to add in Hostinger:**
```
SPF:  v=spf1 include:_spf.google.com include:spf.lemwarm.com ~all
DKIM: [Generated by Google Workspace — download from admin.google.com]
DMARC: v=DMARC1; p=none; rua=mailto:dmarc@ritehirenow.com
```
**Note:** If Lemwarm is already started, verify DNS records are set and warmup score is increasing in the dashboard.

---

### 5. Dashboard .env — Frontend Supabase Connection
**Purpose:** Connects the React dashboard to Supabase for live data
**Current status:** ⚠️ Unknown — app may be running with empty states if .env not set

**To activate:**
```bash
# Create dashboard/.env (already in .gitignore)
cat > /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/dashboard/.env << 'EOF'
VITE_SUPABASE_URL=https://vledjjqhycdkzgwwwlvu.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-project-settings>
EOF
```
Get the anon key from: [Supabase Dashboard → Project Settings → API](https://supabase.com/dashboard/project/vledjjqhycdkzgwwwlvu/settings/api)
Then restart the dev server: `cd dashboard && npm run dev`

---

## 🟡 MEDIUM PRIORITY — Connect within 2 weeks

### 6. LinkedIn Sales Navigator — Outreach CRM Integration
**Purpose:** Lead list management, InMail outreach, saved prospect tracking
**Connection method:** Manual (no API — used directly in LinkedIn.com)
**Cost:** $49.99/mo
**Current status:** ✅ Active subscription
**Action needed:** Import `docs/linkedin-prospects-300.csv` as a Lead List in Sales Navigator
1. Go to LinkedIn Sales Navigator → Lists → Create New Lead List
2. Import the 300 prospect CSV or manually add by LinkedIn URL
3. Tag by ICP type using Sales Navigator tags
4. Start outreach with Tier 1 priorities (ICP-A and ICP-E first)

---

### 7. Apollo.io — Email Sequences + Contact DB
**Purpose:** Cold email sequences (for post-domain-warmup), contact data enrichment
**Connection method:** Apollo account connected to email (Google OAuth)
**Cost:** $0 (free tier)
**Current status:** ✅ Account exists — activation status unknown
**Action needed:**
1. Connect your Google Workspace email to Apollo
2. Verify email connection is healthy
3. Import prospect CSV from `docs/linkedin-prospects-300.csv`
4. Create 5-step email sequence (per CRO strategy doc — activate March 25)
5. **Do NOT start email sequences until domain warmup completes March 25**

---

### 8. Hostinger — Web Hosting + DNS
**Purpose:** ritehirenow.com hosting, email hosting, DNS records
**Connection method:** Hostinger control panel + DNS settings
**Cost:** $12/mo
**Current status:** ✅ Active
**Action needed:**
1. Add DMARC/SPF/DKIM records (see Lemwarm section above)
2. Ensure SSL certificate is active
3. Consider adding Google Analytics tracking code to ritehirenow.com
4. Update website content to match current brand kit (`/brand/BRAND_KIT.md`)

---

### 9. Notion — Documentation + Task Management
**Purpose:** CRO strategy, content calendars, LinkedIn prospect lists, daily reports, architecture docs
**Connection method:** Notion MCP (already in `.mcp.json`)
**Cost:** $10/mo
**Current status:** ✅ Connected via MCP
**Action needed:**
1. Create Notion database for LinkedIn prospect tracking (300 profiles)
2. Save CRO strategy, visual calendar as Notion pages
3. Set up recurring daily report page (auto-created each morning)
4. Link dashboard activity log → Notion weekly summary

---

## ⚪ LOWER PRIORITY — Connect within 30 days

### 10. Clay — Data Enrichment
**Purpose:** Enrich LinkedIn prospect data with email addresses, phone numbers, company signals
**Connection method:** Clay.com account (free tier)
**Cost:** $0
**Status:** ✅ Account exists
**Action needed:** Upload `linkedin-prospects-300.csv` to Clay for enrichment waterfall (LinkedIn → Apollo → Hunter.io)

---

### 11. Google Analytics — Website Tracking
**Purpose:** Track ritehirenow.com visitor sources, conversion, and LinkedIn-driven traffic
**Connection method:** Add GA4 tracking script to Hostinger-hosted site
**Cost:** $0
**Status:** ❌ Not set up
**Action needed:** Create GA4 property → add script to ritehirenow.com HTML → set up LinkedIn UTM tracking

---

### 12. Canva Pro — Design Assets (Lower Priority Now)
**Purpose:** Template-based marketing assets, presentations
**Connection method:** Canva.com account
**Cost:** $13/mo
**Status:** ✅ Active
**Note:** Nano Banana Pro now handles LinkedIn image generation. Canva is useful for presentations, PDF reports, and anything requiring precise text layout that Nano Banana doesn't handle well.

---

## 🏗️ Configuration Checklist — Run This Order

```
Priority 1 (Today):
[ ] Get Anthropic API key → supabase secrets set ANTHROPIC_API_KEY
[ ] Get Gemini API key → supabase secrets set GEMINI_API_KEY
[ ] Deploy both edge functions (claude-chat, generate-linkedin-visual)
[ ] Create/verify dashboard/.env with VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY

Priority 2 (This Week):
[ ] Start Lemwarm — connect email + add DNS records in Hostinger
[ ] Set up Google Drive Service Account + add secrets to vault
[ ] Import 300 prospects into LinkedIn Sales Navigator as Lead List
[ ] Connect Apollo.io to Google Workspace email

Priority 3 (Week 2):
[ ] Upload prospects CSV to Clay for enrichment
[ ] Set up Google Analytics on ritehirenow.com
[ ] Create Apollo email sequences (ready but paused until March 25)
[ ] Update ritehirenow.com visuals with CDO brief recommendations
```

---

## 💰 Total Monthly Cost Summary

| Category | Services | Monthly Cost |
|----------|---------|-------------|
| **AI** | Claude API + Gemini (free) | ~$30 |
| **Sales tools** | LinkedIn Sales Nav + Apollo (free) + Clay (free) | $49.99 |
| **Marketing** | Lemwarm + Canva Pro + NanoBanana (free) | $42 |
| **Infrastructure** | Supabase + GitHub + Hostinger | $45 |
| **Productivity** | Notion + Google Workspace | $24 |
| **Total** | | **~$191/mo** |

Within $200/mo budget. Lemwarm + Claude API puts us slightly over original estimate — recommend pausing Canva Pro ($13) once Nano Banana Pro is generating all visuals.

---

## 🔄 Autopilot Operating Model (Once All Connected)

When fully configured, this is what runs without human intervention:

1. **Daily**: Brand agent reads content calendar → LinkedIn Outbound creates post draft → Auto-queued in Marketing tab for approval
2. **Daily**: Email Outbound checks Apollo reply queue → drafts responses → queued for CRO approval
3. **Weekly**: CEO reviews activity log → generates weekly summary → pushes to Notion
4. **On trigger**: Legal agent flags compliance risks in contracts → routes to CFO + CEO
5. **On trigger**: Admin & Ops marks onboarding complete → signals CFO for payroll activation
6. **Continuous**: Lemwarm runs in background (no human input needed after setup)
7. **On demand**: Claude Co-worker responds to Nabeel's questions in real-time via dashboard chat

**Human approval required for:**
- All LinkedIn post publishing
- All cold email sending
- Contract execution
- Payroll runs
- Budget overruns

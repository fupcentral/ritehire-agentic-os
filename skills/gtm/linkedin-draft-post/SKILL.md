# Skill: linkedin-draft-post

**Owner agent:** LinkedIn Outbound Specialist  
**Category:** GTM  
**Approval gate:** Human review required before publishing  
**Last updated:** 2026-03-03  
**System version:** v1.2 (Nabeel's LinkedIn OS)

---

## MANDATORY: Read these files first
Before executing this skill, read:
1. `/brand/BRAND_KIT.md` — colors, fonts, logo rules, visual specs
2. `/skills/gtm/linkedin-draft-post/ritehire-linkedin-skill-v1.2.md` — ICP definitions, hard rules, pillar system, 2-week content pack, visual generation rules

These files are the source of truth. Never generate posts or visuals without reading them.

---

## What this skill does

Drafts a high-signal LinkedIn post for RiteHire using the v1.2 LinkedIn OS system. Targets one of three ICPs (A/B/C), maps to one of 6 content pillars, validates hook (Number + Visual), generates a brand-locked visual brief, and presents for approval before publishing. Never publishes autonomously.

---

## Inputs required

Before running, collect:

| Input | Required | Notes |
|---|---|---|
| Topic or idea | Yes | Can be a sentence, bullet points, or just "generate Week X" |
| ICP | No | Default: infer from topic. Options: A (EOR partner) / B (end client) / C (recruiter) |
| Pillar | No | Default: infer from topic. Options: 1–6 (see ritehire-linkedin-skill-v1.2.md) |
| Day/style | No | Default: infer from cadence. Mon=practical / Wed=contrarian / Fri=story |
| Visual required | No | Default: Yes. Generate visual brief for every post. |

---

## Execution steps

### Step 1: Load system files
```
READ /brand/BRAND_KIT.md
READ /skills/gtm/linkedin-draft-post/ritehire-linkedin-skill-v1.2.md
```
Confirm: colors, ICP definitions, hard rules, pillar list, post template format.

### Step 2: Select ICP + Pillar
- If not specified: infer from topic
- Apply Rule A (one ICP) + Rule B (one pillar)
- State which ICP and pillar before writing

### Step 3: Write hook
- Construct hook with Number + Visual test per Rule C
- Validate before proceeding

### Step 4: Draft post using v1.2 template
Output format (mandatory):
```
- Post ID: [Wk#-Post#]
- Day/Style: [Mon practical / Wed contrarian / Fri story]
- ICP: [A/B/C]
- Pillar: [1–6]
- Buying signal: [one sentence]
- Offer angle: [what RiteHire does here]
- Hook: [hook line]
- Hook validation:
  - Number: [the specific number used]
  - Visual: [the concrete scene]
- Post copy: [full post]
- CTA: [one CTA line]
- Notes: [what to personalize if needed]
```

**Post formatting rules:**
- First line: hook only. Max 12 words.
- Blank line after hook.
- Body: 3–5 short paragraphs. Max 3 sentences each.
- Micro-framework: 3 steps or 5 checks if applicable.
- Total length: 150–300 words. Never exceed 400.
- End with one CTA (rotate: question / offer / proof / challenge)

### Step 5: Apply quality gate
Run the 7-point quality gate from Section 7 of ritehire-linkedin-skill-v1.2.md.
If any check fails — revise before presenting.

### Step 6: Generate visual brief
Read BRAND_KIT.md Section 5 (LinkedIn Visual Specs) and generate:
```
- Visual type: [single image / carousel / checklist card / etc.]
- Visual concept: [1 sentence]
- On-image copy: [headline + max 3 bullets + footer]
- Brand constraints: [list exact HEX colors + font rules used]
- Generation prompt: [full prompt for designer/AI tool]
- Export specs: [1200×1200px or 1080×1350px, 80px margins]
```

Visual prompt must use visual template from Section 10 of ritehire-linkedin-skill-v1.2.md.

### Step 7: Present for review
Show post + visual brief to Nabeel.  
State recommendation if generating multiple versions.  
Wait for explicit **Approve / Edit / Regenerate / Skip**.

### Step 8: Log to activity_log (after approval)
```
agent_id: linkedin-outbound
skill_used: linkedin-draft-post
action_type: skill_execution
output_summary: [ICP-X / Pillar-Y] post approved: "[first 10 words]..."
status: approved_pending_publish
```

---

## Output format (final)

```
=== LINKEDIN POST ===

Post ID: [ID]
Day/Style: [type]
ICP: [A/B/C] — [name]
Pillar: [#] — [name]

Hook validation: ✓ Number: [X] | ✓ Visual: [scene]

--- POST ---
[Full post text ready to paste into LinkedIn]

--- VISUAL BRIEF ---
Type: [type]
Concept: [sentence]
Copy: [headline / bullets / footer]
Brand: #1a2332 bg / #009886 accent / Bold 24px heading
Prompt: [full generation prompt]
Size: 1200×1200px | Margins: 80px

---
QUALITY GATE: ✓ All 7 checks passed
RECOMMENDATION: [one sentence if needed]
```

---

## Quality checklist

Before presenting to Nabeel, verify:
- [ ] ICP selected and stated (A, B, or C)
- [ ] Pillar selected and stated (1–6)
- [ ] Hook passes Number test
- [ ] Hook passes Visual test
- [ ] At least one operational mechanism (SLA/checklist/approval/audit trail)
- [ ] No empty adjectives (seamless, world-class, end-to-end)
- [ ] One CTA only — relevant to ICP
- [ ] Post reads under 35 seconds / 300 words max
- [ ] Visual brief generated and brand-locked to BRAND_KIT.md
- [ ] Apple-design standard applied to visual (see BRAND_KIT.md Section 7)

---

## Visual automation pipeline

**Current state:** LIVE — Edge Function deployed, fal.ai Flux Pro integrated.

**Flow:**
```
Claude (visual brief) → generate-linkedin-visual (Edge Function)
  → fal.ai Flux Pro API (image generation)
  → Google Drive /Deliverables/[date]/ (storage)
  → Lovable (review UI, copy + image side-by-side)
  → Nabeel: Approve / Edit / Regenerate
```

**Calling the Edge Function (from Lovable or Claude):**
```json
POST /functions/v1/generate-linkedin-visual
{
  "post_id": "Wk1-Post1",
  "visual_type": "single image",
  "visual_concept": "Inbox-style dark card showing 3 waiting approvals",
  "on_image_copy": {
    "headline": "72-hour approval window. Missed.",
    "bullets": [
      "• Offer sent: Day 1",
      "• Approval gate: Day 3",
      "• Candidate withdrew: Day 5"
    ],
    "footer": "RiteHire — Pakistan EOR/Payroll/Compliance"
  },
  "generation_prompt": "[full prompt from Section 10 template]",
  "export_specs": { "width": 1200, "height": 1200, "margins": 80 }
}
```

**Returns:** `{ image_url, drive_url, drive_file_id }`

**Required secrets (Supabase vault):**
- `FAL_API_KEY` — from fal.ai dashboard → Settings → API Keys
- `GOOGLE_DRIVE_FOLDER_ID` — RiteHire OS /Deliverables/ folder ID: `1XlkYdUWF4KPppEa_H2yIgud89biANYR3`
- `GOOGLE_SERVICE_ACCOUNT` — GCP service account JSON with Drive write access

See full Edge Function source at `/database/edge-functions/generate-linkedin-visual.ts`.

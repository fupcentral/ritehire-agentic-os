# Skill: linkedin-image-brief

**Owner agent:** LinkedIn Outbound Specialist / Brand  
**Category:** GTM  
**Approval gate:** Human review required before sending to designer  
**Last updated:** 2026-03-03

---

## MANDATORY: Read brand files first
Before executing:
1. `/brand/BRAND_KIT.md` — ALL visual specs, colors, fonts, logo rules, Apple-design standard
2. `/skills/gtm/linkedin-draft-post/ritehire-linkedin-skill-v1.2.md` — Visual section (Section 10)

---

## What this skill does

Takes an approved LinkedIn post and generates a complete, brand-locked visual brief for the accompanying image. The brief is production-ready for a designer or AI image tool to execute directly.

---

## Inputs required

| Input | Required | Notes |
|---|---|---|
| Approved post text | Yes | The final approved LinkedIn post |
| Hook visual from post | Yes | The visual scene referenced in the hook (inbox, SLA sheet, checklist, etc.) |
| Visual type | No | Default: single image. Options: single_image / carousel / checklist_card |

---

## Execution steps

### Step 1: Load brand kit
Read `/brand/BRAND_KIT.md` completely. Confirm:
- Primary colors: `#1a2332`, `#009886`, `#4a5568`, `#e5e7eb`
- Typography: Bold geometric sans-serif (24px heading, 14px body)
- Logo: white version on dark, 1x clear space, min 48px
- LinkedIn specs: 1200×1200px single, 1080×1350px carousel, 80px margins
- Apple-design standard: clarity, deference, depth — every pixel intentional

### Step 2: Map hook to visual type
| Hook visual | Visual treatment |
|-------------|-----------------|
| Inbox | Inbox-style card mock, dark bg, truncated subject lines, brand avatar |
| SLA spreadsheet | Spreadsheet mock, 3–5 rows, teal checkmarks, column headers |
| Offer letter clause | Contract card with highlighted clause, fake clause text |
| Payroll run | Checklist card, teal ✓ for completed, #4a5568 for pending |
| Onboarding checklist | Checklist card, numbered steps, brand colors |
| Quarterly payout ledger | Ledger table, 4 rows, Client A/B/C/D, teal PAID badge |

### Step 3: Generate visual brief
Output using this exact format:

```
=== VISUAL BRIEF ===

Post ID: [matching post ID]
Visual type: [single image / carousel / card]
Concept: [1 sentence describing the visual]

--- ON-IMAGE COPY ---
Headline: [max 6 words, bold]
Body/Bullets:
  • [line 1]
  • [line 2]  
  • [line 3 — max 3 bullets]
Footer: RiteHire — Pakistan EOR/Payroll/Compliance

--- BRAND CONSTRAINTS ---
Background: #1a2332
Accent: #009886
Text: #ffffff (on dark) / #1a2332 (on light)
Font: Bold 24px heading / Regular 14px body — geometric sans-serif
Logo: White version, top-left, 1x clear space, min 48px width
Grid: 8px base grid
Corners: 8px+ radius on cards
Shadows: 0 4px 24px rgba(0,0,0,0.12)

--- GENERATION PROMPT (paste to designer / AI tool) ---
Create a LinkedIn single image for RiteHire.

Size: 1200×1200px
Safe margins: 80px all sides
Background: #1a2332 (dark navy)
Accent color: #009886 (teal) — used for highlights, icons, badges only
Text color: #ffffff on dark backgrounds
Typography: Bold geometric sans-serif. Heading 24px bold. Body 14px regular.
Logo: RiteHire logo (white version). Top-left corner. 1x clear space. Min 48px wide.
Layout: 8px grid. Rounded card corners (8px min). Soft shadow on cards.

[Visual type description: e.g., "Show a spreadsheet-style mock with 5 rows..."]

On-image copy:
  Headline: "[headline]"
  Bullets:
    • [bullet 1]
    • [bullet 2]
    • [bullet 3]
  Footer: "RiteHire — Pakistan EOR/Payroll/Compliance"

Style requirements:
- Apple-grade minimal design — every element has a purpose
- No stock photo faces, no real names, no real client data
- Use placeholder names: "Client A", "EOR Partner", "Hiring Manager"
- Flat UI mock style — not photorealistic
- Crisp text rendering, no artifacts
- Export: PNG, 1200×1200px

--- EXPORT SPECS ---
Format: PNG
Size: 1200×1200px (or 1080×1350px for carousel)
Margins: 80px all sides
Color profile: sRGB

--- VISUAL AUTOMATION NOTE ---
Recommended tools (priority order):
1. Canva API/MCP — template-based, fastest for brand consistency
2. DALL-E 3 / Midjourney — for custom UI mock illustration
3. Claude artifact (HTML/CSS card render) — fallback for rapid iteration
```

### Step 4: Apple-design quality check
Before finalising brief:
- [ ] Would this look at home in an Apple product showcase?
- [ ] Can a viewer understand hierarchy in under 3 seconds?
- [ ] Is every element intentional? Nothing decorative for its own sake.
- [ ] Brand colors only — no invented palette
- [ ] Logo correctly placed with clear space
- [ ] Text is readable at thumbnail size (60×60px)

### Step 5: Save brief
Save brief to Google Drive: `/RiteHire OS/Content/LinkedIn/[YYYY-MM-DD]-[post-id]-visual-brief.md`  
Log to activity_log.

---

## Output
Present the complete visual brief and await designer confirmation or revision request.

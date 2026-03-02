# Skill: linkedin-image-brief

**Owner agent:** LinkedIn Outbound Specialist / Brand  
**Category:** GTM  
**Approval gate:** CDO review recommended before handoff to designer  
**Output destination:** Google Drive /RiteHire OS/Deliverables/  
**Last updated:** 2026-03-02

---

## What this skill does

Creates a structured creative brief for a LinkedIn post image or visual asset. The brief
is handed off to a designer (human or AI image generator) to produce the final asset.
This skill does not generate images — it writes the brief.

---

## Inputs required

| Input | Required | Notes |
|---|---|---|
| Post text | Yes | The approved LinkedIn post this image will accompany |
| Visual concept (optional) | No | Any existing idea for the visual |
| Format | No | Default: 1200×628px LinkedIn link image. Options: square (1080×1080), story (1080×1920) |
| Deadline | No | When is this needed? |

---

## Execution steps

1. **Read the post** — Understand the core message, tone, and audience. The image must
   amplify the post — not illustrate it literally.

2. **Define the visual concept** — Write one sentence: what should a viewer feel or
   understand in 3 seconds of looking at this image?

3. **Write the brief** using the output format below.

4. **Brand check** — Confirm all brief elements comply with:
   - Colours: #FFFFFF (white) · #081326 (navy) · #12AF84 (green accent)
   - No stock photos. Prefer clean illustration, typography-led, or abstract geometric.
   - Apple-grade: sparse, calm, intentional. Never busy.

5. **Save brief to Google Drive** — File at:
   `/RiteHire OS/Deliverables/[YYYY-MM-DD]-linkedin-image-brief-[short-slug].md`

6. **Log to activity_log**:
   ```
   agent_id: linkedin-outbound
   skill_used: linkedin-image-brief
   output_summary: Image brief written for [post slug]. Saved to Drive /Deliverables/.
   status: completed
   ```

---

## Output format

```
# LinkedIn Image Brief
Date: [YYYY-MM-DD]
Post: [first 10 words of associated post...]
Format: [dimensions]

## CORE MESSAGE
One sentence: what should the viewer feel in 3 seconds?

## VISUAL DIRECTION
[2–3 sentences describing the visual concept. Be specific. Don't say "clean and minimal" — 
describe what is actually in the frame.]

## COPY ON IMAGE
Headline: [if any — max 6 words]
Subtext: [if any — max 12 words]
Logo: Bottom right. Use ritehire-logo-mark.svg

## COLOUR PALETTE
Primary: [which brand colour dominates?]
Secondary: [supporting colour]
Text: [white or navy]

## THINGS TO AVOID
- [List 2–3 visual approaches that would be off-brand for this brief]

## REFERENCE DIRECTION
[Optional: describe 1–2 examples of visual styles that match the intent, 
even from other brands]
```

---

## Quality checklist

- [ ] Brief is specific enough for a designer to execute without back-and-forth
- [ ] Brand colours specified correctly
- [ ] No stock photo direction
- [ ] Saved to Google Drive /Deliverables/ with correct filename format
- [ ] Logged to activity_log

# Skill: linkedin-draft-post

**Owner agent:** LinkedIn Outbound Specialist  
**Category:** GTM  
**Approval gate:** Human review required before publishing  
**Last updated:** 2026-03-02

---

## What this skill does

Drafts a LinkedIn post from a topic, idea, or source brief. Outputs a publish-ready post
formatted for maximum engagement. Never publishes autonomously — always surfaces to Nabeel
for review and approval first.

---

## Inputs required

Before running, collect:

| Input | Required | Notes |
|---|---|---|
| Topic or idea | Yes | What is the post about? Can be a sentence, bullet points, or raw notes. |
| Post type | Yes | Options: thought_leadership · eor_education · social_proof · market_insight |
| Tone | No | Default: direct and confident. Alternatives: conversational, formal |
| Target audience | No | Default: HR leaders and founders at companies with remote Pakistani teams |
| Attachments | No | Any data, quotes, or source material to draw from |

---

## Execution steps

1. **Load brand voice** — Read PERSONALIZATION_SPEC.md before writing. Confirm:
   - Direct, confident, minimal. Never corporate or fluffy.
   - White space is a design element. Short paragraphs.
   - First line is the hook. Must stop the scroll.

2. **Draft 2 versions** — Write two distinct post angles on the same topic:
   - Version A: opens with a bold statement or counterintuitive claim
   - Version B: opens with a specific, concrete observation or data point

3. **Format each post** — Apply LinkedIn formatting rules:
   - First line: hook only. No more than 12 words.
   - Blank line after hook.
   - Body: 3–5 short paragraphs. Max 3 sentences per paragraph.
   - No bullet lists unless the content is genuinely list-shaped.
   - CTA or closing reflection on final line.
   - Total length: 150–300 words optimal. Never exceed 400.

4. **Tag check** — Identify 1–2 people or companies worth tagging if relevant.
   Do not over-tag. Only tag if it adds genuine context.

5. **Hashtag line** — End with 2–4 hashtags max:
   - Always include: #EOR or #EmployerofRecord
   - Add 1–2 topic-specific hashtags
   - No vanity hashtags

6. **Present for review** — Show both versions to Nabeel. State which version you recommend
   and briefly explain why (one sentence).

7. **Await approval** — Do not publish, schedule, or copy to LinkedIn until Nabeel
   explicitly approves a version. He may edit or reject.

8. **Log to activity_log** — After approval, write:
   ```
   agent_id: linkedin-outbound
   skill_used: linkedin-draft-post
   output_summary: [post type] post drafted and approved. [first 10 words of post...]
   status: approved_pending_publish
   ```

---

## Output format

```
--- VERSION A ---
[Full post text]

--- VERSION B ---
[Full post text]

---
RECOMMENDATION: Version [A/B] — [one sentence reason]
```

---

## Quality checklist

Before presenting to Nabeel, verify:
- [ ] Hook line is under 12 words and stops the scroll
- [ ] No corporate buzzwords (leverage, synergy, solutions, empower, etc.)
- [ ] Brand voice: direct, not fluffy
- [ ] Correct hashtags at end
- [ ] Post reads naturally on mobile (short lines, white space)
- [ ] CTA or closing line is clear and human

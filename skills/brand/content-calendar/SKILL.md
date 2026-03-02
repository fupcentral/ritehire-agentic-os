# Skill: content-calendar

**Owner agent:** Brand  
**Category:** Brand  
**Approval gate:** Human review before calendar is finalised  
**Output destination:** Notion (primary) + Google Drive /RiteHire OS/Brand Assets/  
**Last updated:** 2026-03-02

---

## What this skill does

Plans and populates a content calendar for RiteHire's LinkedIn presence. Produces a
2–4 week forward-looking calendar with post topics, post types, and production
assignments. Writes the calendar into Notion and saves a copy to Google Drive.

---

## Inputs required

| Input | Required | Notes |
|---|---|---|
| Planning period | No | Default: next 2 weeks (14 days) |
| Upcoming themes or events | No | Any product launches, milestones, seasonal hooks |
| Post cadence | No | Default: 4 posts per week (Mon/Tue/Thu/Fri) |
| Posts already scheduled | No | To avoid duplication |

---

## RiteHire content pillars

All content must map to one of these pillars:

| Pillar | Description | Frequency |
|---|---|---|
| EOR Education | What is EOR? Why does it matter? Pakistani employment law explainer | 1×/week |
| Thought Leadership | Nabeel's POV on remote work, Pakistan talent, global hiring | 1×/week |
| Social Proof | Client results, employee stories, milestones | 1×/week |
| Market Insight | Pakistan tech talent data, global hiring trends, salary benchmarks | 1×/week |

---

## Execution steps

1. **Review what's been posted** — Check activity_log for recent linkedin-draft-post
   outputs. Avoid repeating topics or similar angles.

2. **Map themes to pillar schedule** — For each day in the planning period where a post
   is due, assign:
   - Pillar
   - Topic / angle
   - Key message (one sentence: what should the reader take away?)
   - Visual needed? (Yes/No — if yes, flag for linkedin-image-brief)
   - Production status: planned / in_draft / approved / published

3. **Write post briefs** — For each planned post, write a short brief (3–5 bullet points)
   that the LinkedIn Outbound Specialist can use when running linkedin-draft-post.

4. **Write to Notion** — Create or update the content calendar in the Architecture
   Blueprint section of Notion. Use a table with columns:
   Date · Pillar · Topic · Status · Notes

5. **Save to Google Drive** — Export calendar as a markdown file:
   `/RiteHire OS/Brand Assets/[YYYY-MM]-content-calendar.md`

6. **Present for review** — Surface the calendar to Nabeel for approval before
   any drafting begins.

7. **Log to activity_log**:
   ```
   agent_id: brand
   skill_used: content-calendar
   output_summary: [N]-post content calendar planned for [start date]–[end date].
   Saved to Notion + Drive.
   status: awaiting_approval
   ```

---

## Output format

```
## Content Calendar — [Start Date] to [End Date]

| Date | Day | Pillar | Topic / Angle | Key Message | Visual? | Status |
|---|---|---|---|---|---|---|
| [date] | Mon | EOR Education | [topic] | [one sentence] | No | planned |
| [date] | Tue | Thought Leadership | [topic] | [one sentence] | Yes | planned |
...

---
## Post Briefs

### [Date] — [Pillar]: [Topic]
- Audience: [who is this for?]
- Hook idea: [suggested opening line]
- Core argument: [main point in 2 sentences]
- CTA: [what do we want them to do or think?]
- Visual direction: [if needed — brief description or link to image-brief task]

[Repeat for each post]
```

---

## Quality checklist

- [ ] All 4 pillars represented in the 2-week window
- [ ] No topic duplication from previous 4 weeks
- [ ] Post briefs written for each planned post
- [ ] Calendar written to Notion
- [ ] Calendar saved to Google Drive /Brand Assets/
- [ ] Approval gate before any posts go to drafting stage
- [ ] Logged to activity_log

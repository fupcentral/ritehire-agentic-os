# Skill: email-cold-outreach

**Owner agent:** Email Outbound Specialist  
**Category:** GTM  
**Approval gate:** Human review required before sending  
**Last updated:** 2026-03-02

---

## What this skill does

Researches a target prospect and writes a personalised cold email. Produces the email
ready to send — with 3 subject line options. Never sends autonomously. Always surfaces
to Nabeel for review and approval first.

---

## Inputs required

| Input | Required | Notes |
|---|---|---|
| Prospect name | Yes | First and last name |
| Prospect company | Yes | Company name |
| Prospect LinkedIn URL | Recommended | For research |
| Prospect email | Yes | Verified email address |
| Outreach angle | No | Default: EOR value prop. Options: pain-point · warm-intro · event-triggered |

---

## Execution steps

1. **Research the prospect** (if LinkedIn URL or company provided):
   - What does their company do?
   - Do they have Pakistani-based employees or contractors?
   - Any recent news, funding, or hiring activity relevant to EOR?
   - What is the prospect's role — do they own HR, people ops, or founder?

2. **Identify the hook** — One specific, personalised observation that makes this email
   feel handwritten, not templated. Examples:
   - A recent LinkedIn post they wrote
   - A hiring announcement in Pakistan
   - A market expansion announcement relevant to EOR

3. **Write the email** — Apply these rules:
   - **Length:** Max 4 sentences in the body. Brevity signals respect.
   - **Structure:** Opening hook (personalised) → Problem they likely have → How RiteHire
     solves it (1 sentence) → Single clear CTA
   - **CTA:** One ask only. Default: "Worth a 20-minute call?"
   - **Tone:** Direct and warm. Never salesy. Never desperate.
   - **Signature:** Nabeel Saeed · Founder, RiteHire · ritehirenow.com

4. **Write 3 subject lines** — Each taking a different angle:
   - Option 1: Curiosity / pattern interrupt
   - Option 2: Direct benefit
   - Option 3: Reference to their specific context

5. **Populate contacts table** — Ensure prospect exists in:
   - Supabase contacts: name, company, email, linkedin_url, outreach_status = 'draft'
   - Notion contacts database: same fields

6. **Present for review** — Show email + 3 subject lines to Nabeel. Flag the recommended
   subject line and explain why in one sentence.

7. **Await approval** — Do not send, queue, or draft in Gmail until explicit approval.
   After approval, update outreach_status = 'approved'.

8. **Log to activity_log**:
   ```
   agent_id: email-outbound
   skill_used: email-cold-outreach
   output_summary: Cold email drafted for [name] at [company]. Subject: [approved subject].
   status: approved_pending_send
   ```

---

## Output format

```
TO: [email]
SUBJECT OPTIONS:
  A: [option 1]
  B: [option 2]
  C: [option 3]
RECOMMENDED: [A/B/C] — [one sentence reason]

---
[Email body]

---
RESEARCH NOTES:
[2–3 bullet points of relevant context found during research]
```

---

## Follow-up rules

If no reply after first email:
- Follow-up 1: Day 5 — one sentence bump. "Wanted to make sure this didn't get buried."
- Follow-up 2: Day 12 — new angle or value add. Different from the original.
- Follow-up 3: Day 20 — graceful exit. "Closing the loop — no worries if timing is off."
- After 3 touches with no response: update outreach_status = 'no_response'. Do not follow up further.

---

## Quality checklist

- [ ] Email body is 4 sentences or fewer
- [ ] Opening line is personalised — not generic
- [ ] Single CTA only
- [ ] 3 subject line options provided
- [ ] Prospect logged in Supabase + Notion contacts
- [ ] No send action taken without explicit approval

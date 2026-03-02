# Skill: target-account-list

**Owner agent:** LinkedIn Outbound Specialist  
**Category:** GTM  
**Approval gate:** Human review before any outreach begins  
**Last updated:** 2026-03-02

---

## What this skill does

Builds a researched list of target companies for RiteHire outbound. Identifies companies
that are likely to hire in Pakistan, researches their profile, identifies the right
contact, and loads them into the contacts and deals tables in Supabase + Notion.

---

## Inputs required

| Input | Required | Notes |
|---|---|---|
| Industry filter | No | Default: tech, fintech, e-commerce, professional services |
| Geography filter | No | Default: companies based in USA, UK, EU, UAE, Australia |
| Company size | No | Default: 20–500 employees (Series A to Series C) |
| Batch size | No | Default: 10 companies per run |
| Existing list | No | CSV or list of companies to research |

---

## Ideal Customer Profile (ICP)

Before running, understand who RiteHire is targeting:

**Target company:** International companies (USA, UK, EU, UAE, Australia) that employ or
are likely to employ Pakistani talent — engineers, designers, marketers, finance staff.

**Signs they're a fit:**
- Remote-first or distributed team
- LinkedIn jobs posted for Pakistan-based roles
- Have contractors in Pakistan (looking to convert to full-time)
- Recently expanded into APAC or South Asia
- Hiring Pakistani engineers / tech talent specifically

**Right contact at each company:**
- First choice: Head of People, VP HR, Chief People Officer
- Second choice: COO, Founder, CEO (at smaller companies)
- Avoid: Procurement, IT, individual contributors

---

## Execution steps

1. **Generate company list** — Based on filters, identify 10–20 candidate companies.
   For each, note:
   - Company name
   - Industry
   - Headcount
   - HQ location
   - Signal of Pakistan-relevance (why do they potentially hire in Pakistan?)

2. **Research each company** — For the strongest 10 (highest fit), find:
   - Company website
   - LinkedIn company page URL
   - Key contact (name, title, LinkedIn URL, email if findable)
   - Most relevant Pakistan signal (recent hire, job post, news item)

3. **Score each account** — Rate 1–3:
   - 3: Strong signal, right ICP, contact identified ✅
   - 2: Good fit, contact needs verification
   - 1: Weaker fit, lower priority

4. **Write account entries** — For each company, create a structured entry (see output
   format below).

5. **Load into data stores**:
   - **Supabase contacts table:** one row per contact
     - name, company, linkedin_url, email (if known), outreach_status = 'identified'
   - **Notion contacts database:** same fields, bidirectional with Supabase
   - **Supabase deals table:** one row per company at stage = 'prospect'
   - **Notion deals database:** same

6. **Present for review** — Surface the full list to Nabeel. Include score, summary of
   signal, and recommended outreach order.

7. **Await approval before outreach** — List is loaded but no email or LinkedIn message
   sent until Nabeel explicitly approves the outreach.

8. **Log to activity_log**:
   ```
   agent_id: linkedin-outbound
   skill_used: target-account-list
   output_summary: [N] accounts identified and loaded. Top account: [company name].
   status: completed_awaiting_outreach_approval
   ```

---

## Output format

```
## Target Account List — [Date]
Batch: [N] companies · ICP filters: [summary]

---
### [Company Name]
Score: [1/2/3]
Industry: [industry]
HQ: [location]
Size: [headcount]
Pakistan signal: [why they're a fit — 1–2 sentences]
Key contact: [Name · Title · LinkedIn URL]
Email: [if known]
Recommended first touch: [LinkedIn connect / cold email / LinkedIn message]

---
[Repeat for each company]

---
SUMMARY: [N] accounts ready for outreach. Recommended start: [top 3 companies].
```

---

## Quality checklist

- [ ] ICP criteria applied correctly
- [ ] Pakistan relevance signal is specific (not generic)
- [ ] Contacts loaded in Supabase + Notion
- [ ] Deals loaded at 'prospect' stage
- [ ] No outreach initiated without approval
- [ ] Logged to activity_log

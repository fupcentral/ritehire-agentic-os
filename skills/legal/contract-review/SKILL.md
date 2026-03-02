# Skill: contract-review

**Owner agent:** Legal & Compliance  
**Category:** Legal  
**Approval gate:** Human sign-off required on all outputs. This skill assists — it does not replace legal counsel.  
**Last updated:** 2026-03-02

---

## What this skill does

Reviews a contract or agreement against RiteHire's standard risk framework. Flags
clauses that pose risk to RiteHire, identifies missing protections, and produces a
structured review document. All output requires human sign-off before any contract
is executed.

**Important:** This skill assists with legal review. It is not a substitute for qualified
legal counsel. Flag anything ambiguous as requiring professional legal advice.

---

## Inputs required

| Input | Required | Notes |
|---|---|---|
| Contract document | Yes | PDF, DOCX, or pasted text |
| Contract type | Yes | Options: client_service_agreement · employment_contract · nda · vendor_agreement · partnership |
| Counterparty name | Yes | Who is RiteHire contracting with? |
| Key terms to check | No | Any specific clauses Nabeel wants reviewed |

---

## RiteHire standard risk framework

Review every contract against these categories:

**1. Liability**
- Is RiteHire's liability capped? What is the cap?
- Are there indemnification clauses that expose RiteHire?
- Any unlimited liability exposure?

**2. Payment terms**
- When does RiteHire get paid? Net 30? Net 60?
- Are there penalty clauses for late payment by the client?
- What happens to employees on the payroll if client doesn't pay?

**3. Termination**
- What notice period is required for termination?
- Can the client terminate immediately? Under what conditions?
- What happens to employees RiteHire has hired if contract terminates?

**4. Employment obligations**
- Is it clear that RiteHire is the legal employer in Pakistan?
- Are client's day-to-day management obligations vs. RiteHire's legal obligations clearly separated?
- Who is responsible for statutory benefits, gratuity, EOBI?

**5. IP and confidentiality**
- Who owns the IP of work produced by employees?
- Is RiteHire protected from IP disputes between client and employee?
- Is confidentiality obligation mutual?

**6. Jurisdiction and governing law**
- Which country's law governs?
- Where is dispute resolution (arbitration/court)?
- Is Pakistani law recognised for employment matters?

**7. Data and compliance**
- Any data protection clauses (GDPR if EU client)?
- Who is data controller vs. data processor for employee data?

---

## Execution steps

1. **Read the full contract** — Don't skim. Read every clause.

2. **Map against risk framework** — For each of the 7 categories above, identify:
   - What the contract says (or if it's silent)
   - Risk level: Low / Medium / High
   - Recommended action: Accept / Negotiate / Reject / Requires legal advice

3. **Flag missing clauses** — List any standard protections that are absent.

4. **Write review document** — See output format.

5. **Save to Google Drive** — File at:
   `/RiteHire OS/Contracts/[YYYY-MM-DD]-contract-review-[counterparty-slug].md`

6. **Present for sign-off** — Surface to Nabeel with the risk summary. Highlight the
   highest-risk items at the top.

7. **Await human sign-off** — No contract is approved by this agent. Human decision only.

8. **Log to activity_log**:
   ```
   agent_id: legal-compliance
   skill_used: contract-review
   output_summary: [Contract type] reviewed for [counterparty]. Risk level: [overall]. 
   [N] high-risk clauses flagged.
   status: completed_awaiting_signoff
   ```

---

## Output format

```
## Contract Review — [Date]
Contract type: [type]
Counterparty: [name]
Reviewed by: Legal & Compliance agent + [human reviewer name]
Overall risk: [Low / Medium / High]

---
### Executive Summary
[3–5 sentences: what this contract is, what the overall risk picture is, 
and the 1–2 most important decisions Nabeel needs to make.]

---
### Risk Assessment by Category

#### 1. Liability
Status: [Accept / Negotiate / Reject / Requires legal advice]
Risk: [Low / Medium / High]
Finding: [What the contract says]
Recommendation: [What to do]

[Repeat for each category]

---
### Missing Clauses
- [List any standard protections not present in this contract]

---
### Recommended Redlines
[For each negotiation point: quote the current clause and suggest replacement language]

---
### Sign-off Required
☐ Nabeel Saeed — Date: ___________
☐ Legal counsel (if High risk items present): ___________
```

---

## Quality checklist

- [ ] All 7 risk categories reviewed
- [ ] Missing clauses identified
- [ ] Risk level assigned to each category and overall
- [ ] Redlines written for all negotiate items
- [ ] Saved to Google Drive /Contracts/
- [ ] Human sign-off explicitly noted as required
- [ ] Logged to activity_log

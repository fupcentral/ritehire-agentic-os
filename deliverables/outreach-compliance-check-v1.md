# RiteHire Outreach Compliance Check v1.0
> **Document type:** Legal Deliverable  
> **Agent:** Legal & Compliance  
> **Session:** RH5  
> **Date:** 2026-03-03  
> **Status:** Approved (with conditions)  
> **Google Drive:** Upload to /RiteHire OS/Deliverables/

---

## Scope

Pre-launch compliance review of RiteHire's planned GTM outreach strategy:
1. LinkedIn direct messaging (DMs) to ICP-A, B, and C
2. Cold email sequences (5-touch) to ICP-A prospects

---

## LinkedIn Outreach — Compliance Assessment

### Applicable Frameworks
- GDPR (UK GDPR post-Brexit, Article 6)
- LinkedIn Terms of Service (User Agreement §8)
- ICO guidance on B2B direct marketing

### Finding: Compliant (with conditions)

**Legal basis:** GDPR Article 6(1)(f) — Legitimate Interest applies to B2B prospecting where:
- The contact is publicly identifiable on LinkedIn
- The message is relevant to their professional role
- The contact has not opted out

**Conditions for compliance:**
1. Every outreach message must include a clear opt-out: "If you'd prefer not to hear from me, just let me know."
2. Do not contact anyone who has previously declined engagement
3. Messages must be sent manually or via LinkedIn-approved automation (no scraping or bulk send)
4. Maximum frequency: 1 connection request + 2 follow-up DMs per contact per quarter

### ICP-Specific Notes
- ICP-A (Head of Talent / VP People): Clear professional relevance. Hiring = core remit.
- ICP-B (Founder/CEO): Compliant. Founders expect commercial outreach.
- ICP-C (HR Manager): Compliant. Ensure message addresses their context (quality over volume).

---

## Email Outreach — Compliance Assessment

### Applicable Frameworks
- GDPR (UK GDPR, Article 6)
- PECR (Privacy and Electronic Communications Regulations 2003)
- CAN-SPAM Act (US)
- CASL (Canada, if targeting Canadian companies)

### Finding: Approved — Mandatory Conditions Required

**PECR §22** applies to individual/sole trader email addresses. For B2B companies with generic business emails, legitimate interest applies. For personal emails or sole traders, explicit consent is required.

**Mandatory conditions before email activation:**
1. Unsubscribe link required — every email must include a one-click unsubscribe
2. Physical address required (CAN-SPAM) — add company address to email footer
3. "Sent on behalf of" disclosure — must be clear who is sending and why
4. Suppression list — maintain a running do-not-contact list; honour immediately
5. Verify email source — only email contacts obtained through legitimate means. No purchased lists.

### Recommended Email Footer
```
RiteHire | The UK's Embedded Hiring Partner
[Address TBC] | nabeel@ritehire.co.uk
You received this because you're a [Head of Talent / Founder / HR Manager] at [Company].
Not relevant? Reply "unsubscribe" — I'll remove you immediately, no hard feelings.
```

---

## Status Summary

| Channel | Compliance Status | Can Activate? |
|---------|------------------|---------------|
| LinkedIn DMs | Compliant | Yes, once opt-out added to templates |
| Cold Email | Conditional | No — add unsubscribe + footer first |
| LinkedIn Posts | Fully compliant | Yes |

---

## Recommended Next Steps

1. Add opt-out line to all LinkedIn DM templates before sending (Email Outbound agent)
2. Build unsubscribe mechanism for email sequence (Admin & Ops agent)
3. Add company footer to email templates (Admin & Ops agent)
4. Maintain suppression list in Supabase — contacts table, outreach_status = 'disqualified'
5. Review quarterly — GDPR legitimate interest must be reassessed if outreach volume scales

---

*Prepared by Legal & Compliance agent (RiteHire Agentic OS)*
*Session RH5 | 2026-03-03 | Not legal advice — review with qualified solicitor before scaling*

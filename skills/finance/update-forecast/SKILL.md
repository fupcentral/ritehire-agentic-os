# Skill: update-forecast

**Owner agent:** CFO  
**Category:** Finance  
**Approval gate:** CFO review before presenting to CEO  
**Last updated:** 2026-03-02

---

## What this skill does

Reads the current deals pipeline from Supabase + Notion and produces an updated revenue
forecast with best/likely/worst case scenarios. Updates the forecast in Notion and logs
the revision to activity_log.

---

## Inputs required

| Input | Required | Notes |
|---|---|---|
| Forecast period | No | Default: current month + next 3 months |
| Include probability override | No | Default: use deal stage probability table below |
| Notes or context | No | Any deals that need special treatment (e.g. "Company X is about to close") |

---

## Deal stage probability table (defaults)

| Stage | Probability |
|---|---|
| prospect | 10% |
| qualified | 25% |
| proposal_sent | 50% |
| negotiation | 75% |
| verbal_close | 90% |
| closed_won | 100% |
| closed_lost | 0% |

---

## Execution steps

1. **Pull deals data** — Query Supabase deals table. For each active deal, collect:
   - company name
   - contact_id (and resolve to contact name)
   - stage
   - mrr (monthly recurring revenue in USD)
   - expected_close_date
   - source

2. **Calculate scenarios** — For each forecast month:
   - **Worst case:** Only deals at 75%+ probability × their MRR
   - **Likely case:** All deals weighted by probability × MRR
   - **Best case:** All deals at 50%+ probability at their full MRR value

3. **Sum current MRR** — Total MRR from closed_won deals (100% probability).

4. **Write forecast table** — See output format.

5. **Update Notion** — Write forecast to the Notion Epics database or a dedicated
   forecast page under the Architecture Blueprint.

6. **Highlight variances** — Compare to previous forecast (if exists). Flag:
   - Deals that moved forward (good signal)
   - Deals that stalled or regressed (risk)
   - New deals added since last forecast

7. **Log to activity_log**:
   ```
   agent_id: cfo
   skill_used: update-forecast
   output_summary: Forecast updated. Current MRR: $X. Likely Q[N]: $X. [N] active deals.
   status: completed
   ```

---

## Output format

```
## Revenue Forecast — Updated [Date]

### Current State
Active MRR (closed_won): $[X]
Active deals in pipeline: [N]
Total pipeline value: $[X]

### Forecast by Month
| Month | Worst Case | Likely | Best Case |
|---|---|---|---|
| [Month 1] | $X | $X | $X |
| [Month 2] | $X | $X | $X |
| [Month 3] | $X | $X | $X |

### Deal Summary
| Company | Stage | MRR | Close Date | Probability |
|---|---|---|---|---|
| [Company] | [stage] | $X | [date] | [%] |

### Variances from Last Forecast
- Moved forward: [list]
- Stalled / at risk: [list]
- New this period: [list]

### Notes
[Any deal-specific context or flags]
```

---

## Quality checklist

- [ ] All deals from Supabase pulled and accounted for
- [ ] Probability table applied correctly
- [ ] Three scenarios calculated (worst/likely/best)
- [ ] Variances from last forecast noted
- [ ] Notion updated
- [ ] Logged to activity_log

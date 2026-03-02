# Skill: runway-report

**Owner agent:** CFO  
**Category:** Finance  
**Approval gate:** CFO review; alert CEO immediately if under threshold  
**Last updated:** 2026-03-02

---

## What this skill does

Calculates RiteHire's current cash runway and produces a concise report for the CEO.
Triggers an alert if runway falls below 6 months. Runs as part of the daily OS report
or on-demand.

---

## Inputs required

| Input | Required | Notes |
|---|---|---|
| Current cash balance | Yes | Total cash in bank (PKR and/or USD) |
| Monthly burn rate | Yes | Average monthly cash outflow |
| Expected new MRR | No | From update-forecast skill. Used for adjusted runway. |
| Notes | No | Any one-time expenses or expected cash events |

---

## Runway thresholds

| Runway | Status | Action |
|---|---|---|
| > 12 months | 🟢 Healthy | No action needed |
| 6–12 months | 🟡 Monitor | Note in report, flag in daily OS report |
| 3–6 months | 🔴 Alert | Notify CEO in report and via Notion comment |
| < 3 months | 🚨 Critical | Escalate immediately. CEO must act. |

---

## Execution steps

1. **Collect inputs** — Ask for current cash balance and monthly burn if not provided.
   Pull expected MRR from latest update-forecast output (Notion or Supabase).

2. **Calculate base runway**:
   ```
   Base runway (months) = Current cash balance / Monthly burn rate
   ```

3. **Calculate adjusted runway** (with expected new revenue):
   ```
   Net burn = Monthly burn rate - Current MRR - (Expected new MRR × 0.5 probability discount)
   Adjusted runway = Current cash balance / Net burn
   ```
   Use 50% probability discount on expected new MRR to be conservative.

4. **Determine status** — Apply threshold table above.

5. **Write report** — See output format.

6. **If under 6 months:**
   - Add a comment to the Notion Architecture Blueprint page tagging this as urgent
   - Flag in the daily OS report section

7. **Log to activity_log**:
   ```
   agent_id: cfo
   skill_used: runway-report
   output_summary: Runway [N] months. Status: [Green/Yellow/Red/Critical]. Burn: $X/mo.
   status: completed
   ```

---

## Output format

```
## Runway Report — [Date]

### Status: [🟢 Healthy / 🟡 Monitor / 🔴 Alert / 🚨 Critical]

Current cash: $[X] ([currency])
Monthly burn: $[X]
Current MRR: $[X]
Expected new MRR (pipeline, 50% disc.): $[X]

Base runway: [N] months (cash only)
Adjusted runway: [N] months (with pipeline revenue)

### Breakdown of Monthly Burn
| Category | Monthly Cost |
|---|---|
| [Item] | $X |
| Total | $X |

### Actions Required
[If healthy: None at this time.]
[If monitoring: Watch the following deals for close: ...]
[If alert/critical: List specific immediate actions]

### Next Review
[Date of next scheduled runway check]
```

---

## Quality checklist

- [ ] Cash balance and burn rate confirmed with Nabeel before calculation
- [ ] Both base and adjusted runway calculated
- [ ] Correct status threshold applied
- [ ] CEO alert triggered if under 6 months
- [ ] Logged to activity_log

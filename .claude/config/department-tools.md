# RiteHire Department Tools & Budget Configuration

> **For Claude**: This file is the authoritative config for RiteHire's department tool stack.
> When you read this file, apply any changes to: GitHub repo, Notion pages, Google Drive docs, and Supabase tables as needed.

## Company Overview
- **Company**: RiteHire — Pakistan-based Employer of Record (EOR)
- **Dashboard**: RiteHire Agentic OS (React + TypeScript + Vite + Supabase)
- **Source Config**: `dashboard/src/lib/department-tools.ts`

---

## Budget Allocation ($200/mo total)

| Department      | Monthly Budget | Purpose                    |
|-----------------|---------------|----------------------------|
| Sales           | $80           | Outreach, prospecting      |
| Marketing       | $60           | Content, brand, social     |
| Infrastructure  | $60           | Hosting, dev tools, AI ops |
| **Total**       | **$200**      |                            |

---

## Tool Registry

### Sales Department Tools

| Tool | Monthly Cost | Shared With | Dept Cost | Category | URL |
|------|-------------|-------------|-----------|----------|-----|
| LinkedIn Sales Navigator | $49.99 | — | $49.99 | Outreach | https://business.linkedin.com/sales-solutions |
| Apollo.io | $0 (Free) | — | $0 | Outreach | https://apollo.io |
| Clay | $0 (Free) | Marketing | $0 | Outreach | https://clay.com |
| Lemwarm | $29 | Marketing | $14.50 | Email | https://lemwarm.com |
| Notion | $10 | Marketing, Infra | $3.33 | Productivity | https://notion.so |
| Google Workspace | $14 | Marketing, Infra | $4.67 | Communication | https://workspace.google.com |
| OpenAI API | $30 | Infra | $15 | AI | https://platform.openai.com |

**Sales Total: ~$87.49/mo** (Budget: $80)

---

### Marketing Department Tools

| Tool | Monthly Cost | Shared With | Dept Cost | Category | URL |
|------|-------------|-------------|-----------|----------|-----|
| NanoBanana | $0 (Free) | — | $0 | Design | https://nanobanana.com |
| Canva Pro | $13 | — | $13 | Design | https://canva.com |
| Buffer | $15 | — | $15 | Social | https://buffer.com |
| Clay | $0 (Free) | Sales | $0 | Outreach | https://clay.com |
| Lemwarm | $29 | Sales | $14.50 | Email | https://lemwarm.com |
| Notion | $10 | Sales, Infra | $3.33 | Productivity | https://notion.so |
| Google Workspace | $14 | Sales, Infra | $4.67 | Communication | https://workspace.google.com |

**Marketing Total: ~$50.50/mo** (Budget: $60)

---

### Infrastructure Department Tools

| Tool | Monthly Cost | Shared With | Dept Cost | Category | URL |
|------|-------------|-------------|-----------|----------|-----|
| Hostinger | $12 | — | $12 | Hosting | https://hostinger.com |
| Supabase | $25 | — | $25 | Hosting | https://supabase.com |
| GitHub Team | $8 | — | $8 | Dev | https://github.com |
| Notion | $10 | Sales, Marketing | $3.33 | Productivity | https://notion.so |
| Google Workspace | $14 | Sales, Marketing | $4.67 | Communication | https://workspace.google.com |
| OpenAI API | $30 | Sales | $15 | AI | https://platform.openai.com |

**Infrastructure Total: ~$68.00/mo** (Budget: $60)

---

## Shared Tool Cost Splits

When a tool is used by multiple departments, the cost is split **evenly** (e.g., 50/50 for 2 depts, 33/33/33 for 3 depts).

| Tool | Full Cost | Departments | Per-Dept Cost |
|------|-----------|-------------|---------------|
| Clay | $0 | Sales, Marketing | $0 each |
| Lemwarm | $29 | Sales, Marketing | $14.50 each |
| Notion | $10 | Sales, Marketing, Infra | $3.33 each |
| Google Workspace | $14 | Sales, Marketing, Infra | $4.67 each |
| OpenAI API | $30 | Sales, Infra | $15 each |

---

## Claude Action Items

When you read this file, check and update the following:

### GitHub
- [ ] Ensure `dashboard/src/lib/department-tools.ts` matches this spec
- [ ] Verify all department pages have "Tools" tab
- [ ] Confirm Finance P&L pulls tool costs from central config

### Notion
- [ ] Update "Company Tools" database with current tool list
- [ ] Update department pages with tool allocations
- [ ] Log any budget overages in the Finance section

### Google Drive
- [ ] Update vendor contracts list with active tool subscriptions
- [ ] Ensure billing schedule reflects monthly tool costs

### Supabase
- [ ] Consider creating a `department_tools` table to store tool data if needed
- [ ] Track tool usage metrics if available

---

## How to Modify

1. **Add a tool**: Add entry to `TOOLS` array in `dashboard/src/lib/department-tools.ts`
2. **Change budget**: Update `DEPARTMENT_BUDGETS` in the same file
3. **Share a tool**: Add department IDs to the tool's `departments` array — cost auto-splits
4. **Remove a tool**: Set `active: false` in the tool entry

After changes, commit to GitHub and instruct Claude to sync Notion/Drive/Supabase.

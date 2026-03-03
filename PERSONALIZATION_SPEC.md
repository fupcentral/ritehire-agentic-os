# RiteHire Personalization Spec

Governing instructions for every Claude session on this project. Read this before acting.

---

## Execution Model

- **Do the work yourself.** Whenever something needs writing, editing, running, or executing — in terminal, VS Code, files, Supabase, Notion, GitHub, or anywhere — just do it. Do not write instructions for Nabeel to follow.
- **Use tools directly.** Write the files via filesystem MCP, run SQL via Supabase MCP, write commits via Bash, edit code via filesystem MCP. Never hand off a task with "here's what you'd need to do."
- **Approvals** are only needed for irreversible or sensitive actions (deploys to prod, destructive DB ops, sending emails). For everything else, just act.
- **Terminal commands** must always be combined into one chained `&&` command. Never present a sequence of separate commands. If a command fails, read the error, fix it, and re-run — no permission needed to retry. Treat it as a feedback loop until it works.
- **Daily reports** on context limit: auto-approve all intermediate steps, write and post to Notion, present final result. Never pause mid-report to ask for confirmations.

---

## Design Standard

- Every surface — internal or external — must meet an Apple-grade quality bar.
- Aesthetic reference: Apple product restraint + LoveFrom softness + precision material craft.
- Interfaces should feel premium, sparse, calm, intentional, and highly legible.
- Generic templates, low-fidelity placeholders, and raw operational clutter are not acceptable final output.
- The Chief Design Officer has real sign-off authority. Design is an approval layer across website, contracts, product, content, outbound, and executive surfaces.

---

## Interface Rules

- Prefer human-readable names over internal IDs everywhere (agents, epics, tasks, contacts).
- The portal should feel like an operating system, not a database dump.
- Every meaningful record should be linkable to every other relevant record — ownership, blockers, dependencies, reporting lines, and context must be interlinked.
- Dashboards exist where they materially improve decision-making: action portal, sprint, epic, GTM, finance, agent hierarchy.

---

## Operating Structure

- **Executive layer:** CEO → Chief Design Officer, CRO, CFO
- **Reporting:** Product → CEO; Brand, Customer Success, Email Outbound, LinkedIn Outbound → CRO; Legal, Admin → CFO
- Design authority prevails across all surfaces.

---

## Financial Model

- CFO owns the master financial model.
- Revenue assumptions must be explicit: monthly sales plan, pricing tier, deal type.
- GTM timing, warmup, onboarding readiness, and launch gates must constrain the model.
- The model must be realistic and operationally linked.

---

## AI Runtime Preference

- Prefer **Moonshot Kimi** wherever a configurable model exists in surrounding tooling.
- Use the Anthropic-compatible base URL with Kimi as default when the client supports explicit model choice.
- Only fall back to other providers when Kimi is unavailable or a task requires a provider-specific capability.

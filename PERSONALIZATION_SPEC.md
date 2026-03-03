# RiteHire Personalization Spec

This file is the governing project spec for the RiteHire Agentic OS.

## Design Standard

- Every public-facing and operator-facing surface must meet an Apple-grade quality bar.
- The aesthetic standard is defined by:
  - Apple Product restraint
  - LoveFrom softness and intimacy
  - precision material craft
- Interfaces should feel premium, sparse, calm, intentional, and highly legible.
- Generic templates, low-fidelity placeholders, and raw operational clutter are not acceptable final output.

## Design Authority

- The Chief Design Officer has real sign-off authority.
- Design is not downstream decoration; it is an approval layer across website, contracts, product, content, outbound, and executive surfaces.
- Final portal changes should be able to pass a "designer sign-off" review.

## Interface Rules

- Avoid exposing internal implementation codes as the primary visible interface language.
- Prefer human-readable names over internal IDs for agents, epics, tasks, and related records wherever possible.
- The portal should feel like an operating system, not a database dump.

## Relationship Model

- Every meaningful record should be linkable to every other relevant record.
- Reporting lines, approval lines, blockers, dependencies, motions, context, and ownership should be interlinked.
- Each major business layer should have a dashboard view where it materially improves decision-making.

## Operating Structure

- Executive structure:
  - CEO
  - Chief Design Officer
  - CRO
  - CFO
- Reporting structure:
  - Product reports to CEO
  - Brand, Customer Success, Email Outbound, and LinkedIn Outbound report to CRO
  - Legal and Admin report to CFO
- Design authority should prevail across the system.

## Financial Model

- The CFO owns the master financial model.
- The model must be realistic, operationally linked, and sensitive to GTM timing.
- Revenue assumptions must be explicit by monthly sales plan, pricing tier, and deal type.
- GTM timing, warmup, onboarding readiness, and launch gates must constrain the model.

## Product Standard

- The system should feel holistic, relational, elegant, and commercially useful.
- Dashboards should exist where they materially improve execution:
  - action portal
  - sprint
  - epic
  - GTM
  - finance
  - hierarchy and agent operating views

## Manual Instructions Standard

- Whenever Claude asks Nabeel to do anything manually, always include detailed step-by-step instructions.
- Every step must include: where to go (URL or app), what to click, what to type, and what the screen should look like after the action.
- Never assume Nabeel knows where a button is or what a menu looks like. Describe it.
- Include screenshots descriptions where helpful (e.g. "you should see a green button labelled X at the top right").
- If there are multiple steps, number them clearly.

## Daily Report on Limit Reached

- Whenever a Claude usage limit is reached mid-session, immediately generate a daily update report in Notion (under Daily Reports — RiteHire OS) before pausing.
- The report should cover everything accomplished in the session up to that point, what is still pending, and what the next steps are when the session resumes.
- This ensures Nabeel always has a written record of progress even when a session is interrupted.

## Daily Report Auto-Approvals

- When generating a daily report, auto-approve any intermediate steps or confirmations required to complete it — do not ask Nabeel to approve individual actions mid-report.
- Just run it, write it, post it to Notion, and present the final result.

## AI Runtime Preference

- Wherever a configurable reasoning/default model exists in the surrounding tooling, prefer Moonshot Kimi first.
- Anthropic-compatible integrations should target Moonshot using the Anthropic-compatible base URL, with Kimi selected as the default model whenever the client supports explicit model choice.
- Fallbacks should only be used when a given surface does not support Moonshot/Kimi or when a task requires a provider-specific capability not available through Kimi.

# Master Personalization Prompt - Claude Code

## Core Behavior Rules

### 1. Report Generation
**When user says "create a report" or "make a report":**
1. Automatically gather all necessary information without asking
2. Check git status, recent commits, files changed
3. Review completed work and outcomes
4. Create report in Notion format at: `/Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/docs/daily-reports/YYYY-MM-DD.md`
5. Use the existing format from previous reports (see 2026-03-04.md as template)
6. Commit and push to git automatically
7. Tell user it's done and where to find it

**DO NOT:**
- Ask for clarification on what to include
- Ask for Notion credentials
- Create local markdown files outside the docs/daily-reports folder
- Wait for user confirmation

### 2. User Approval Preferences
**User wants ZERO prompts and ZERO confirmations:**
- Auto-accept everything
- Auto-commit all changes
- Auto-push to remote repos
- Never ask "Are you sure?"
- Never ask "Should I proceed?"
- Execute immediately and report completion

### 3. Integration Over Recreation
**Always check for existing infrastructure first:**
- Look for existing dashboards, UIs, tools
- Integrate with what exists rather than creating new
- If user reminds you of existing work, acknowledge and integrate

### 4. Communication Style
**Plain English, No Jargon:**
- Explain technical concepts in simple terms
- Focus on "what it does" and "what you need to do next"
- Skip unnecessary technical details unless asked
- Be concise and direct

### 5. Documentation Standards
**When creating reports:**
- Use consistent format from `/Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/docs/daily-reports/`
- Include: What works, what doesn't, what to do next
- Always add timestamps
- Use emojis for visual clarity (✅ ⚠️ 🟢 etc.)
- Make it scannable with tables and headers

### 6. Notion Integration
**Report Location:** `/Users/nabeelsaeed/Documents/YES/ritehire-agentic-os/docs/daily-reports/`
**Format:** Follow existing template structure
**Commit:** Always commit and push to git after creating

### 7. No Secrets in Code
**Security Rules:**
- Never hardcode API keys
- Always use environment variables
- Create .env.example files
- Check git history for leaked secrets before pushing

### 8. Repository Context
**User manages 5 repositories:**
1. /Users/nabeelsaeed/Documents/ritehire-agent-os
2. /Users/nabeelsaeed/Documents/YES/ritehire-agentic-os
3. /Users/nabeelsaeed/Documents/YES
4. /Users/nabeelsaeed/Desktop/psp-orch-mvp/psp-orch
5. /Users/nabeelsaeed/Desktop/psp-orchestration-mvp/psp-orch

**Primary Project:** ritehire-agentic-os (dashboard at localhost:5173)

### 9. Proactive Behavior
**When given a task:**
- Execute immediately without asking
- Use TodoWrite to track complex multi-step tasks
- Mark todos complete as you finish them
- Report completion with clear next steps

### 10. Error Handling
**When something fails:**
- Don't stop - find workarounds
- Report the issue clearly
- Provide alternative solutions
- Never leave user blocked

---

## Active Preferences (Updated 2026-03-05)

✅ Auto-accept all changes
✅ Auto-commit everything
✅ Auto-push to remotes
✅ Create reports in docs/daily-reports/
✅ Use plain English explanations
✅ No prompts or confirmations
✅ Integrate with existing tools
✅ Keep todos updated for complex tasks

❌ Never ask for approval
❌ Never hardcode secrets
❌ Never create files outside project structure
❌ Never wait for clarification (make reasonable assumptions)

---

**Last Updated:** 2026-03-05 05:45 AM PKT
**Session:** Omni-Update Build Complete

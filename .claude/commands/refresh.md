---
description: Refresh AI assistant context on project status and conventions with git awareness
argument-hint: Optional specific area to refresh (status, agents, practices)
allowed-tools: Read, Bash(git)
model: haiku
---

Refresh AI assistant context on project by:

1. **Project Status**: Read current STATUS.md and CHANGELOG.md for project state
   1. Read the last two git commits to understand recent changes
   2. Check any active issue tracking or project management system status
   3. Read any uncommitted, changed files to understand current work
2. **AI Framework**: Read .claude/agents/INDEX.md for agent capabilities
3. **Project Conventions**: Read CLAUDE.md for project-specific guidelines
4. **Script Index**: Read scripts/README.md for overview of current helper scripts
5. **Technical Details**: Read docs/technical.md or similar architecture documents
6. **Development Practices**: Review current standards and patterns

Process:

- Check recent git history to understand latest development activity
- Read core project documentation files
- Review any uncommitted changes that indicate work in progress
- Summarize current project status and priorities
- Identify any important changes or updates
- Provide quick context summary for continued work
- Highlight any blocking issues or urgent priorities

Arguments: $ARGUMENTS (optional specific context area to focus on)
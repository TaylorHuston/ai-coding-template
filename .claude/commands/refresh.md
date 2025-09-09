---
command: "/refresh"
description: Refresh AI assistant context on project status and conventions
category: "Project Management"
purpose: "Quick context refresh for AI assistants on project state and conventions"
wave-enabled: false
performance-profile: "optimization"
argument-hint: Optional specific area to refresh (status, agents, practices)
allowed-tools: Read
model: haiku
---

Refresh AI assistant context on project by:

1. **Project Status**: Read current STATUS.md for project state
2. **AI Framework**: Read .claude/agents/INDEX.md for agent capabilities
3. **Project Conventions**: Read CLAUDE.md for project-specific guidelines
4. **Script Index**: Read scripts/README.md for overview of current helper scripts
5. **Technical Details**: Read docs/technical.md or similar architecture documents
6. **Development Practices**: Review current standards and patterns

Process:

- Read core project documentation files
- Summarize current project status and priorities
- Identify any important changes or updates
- Provide quick context summary for continued work
- Highlight any blocking issues or urgent priorities

Arguments: $ARGUMENTS (optional specific context area to focus on)
---
description: Intelligent project context refresh using structured documentation and git awareness
argument-hint: Optional specific area to refresh (status, agents, workflow, technical)
allowed-tools: ["Read", "Bash(git)", "Task"]
model: sonnet
---

Intelligent project context refresh using our structured documentation system:

## Core Context Gathering

1. **Project Overview**:
   - Read README.md for project introduction and goals
   - Read START-HERE.md if it exists for guided introduction
   - Read CLAUDE.md for AI instructions and project context

2. **Current State Analysis**:
   - Read STATUS.md for current project state and AI context
   - Check git status and recent commits (last 3-5) for development activity
   - Read CHANGELOG.md for recent changes and updates
   - Review any uncommitted changes indicating work in progress

3. **AI Framework Context**:
   - Read .claude/references/documentation-tree.md for comprehensive documentation index
   - Read .claude/agents/README.md for agent capabilities and coordination
   - Check .claude/working/ for active development context and plans

4. **Development Context**:
   - Read docs/ai-tools/system-context.md for system-wide integration patterns
   - Read docs/development/guidelines/quality-standards.md for requirements
   - Read scripts/README.md for automation capabilities

## Intelligent Analysis

Use the Task tool with context-analyzer agent to:
- Synthesize all gathered information into coherent project understanding
- Identify current development phase and priorities
- Highlight any blocking issues, incomplete work, or urgent tasks
- Assess project health and documentation currency
- Recommend next actions based on current state

## Output Format

Provide structured context summary:
- **Project Phase**: Current development stage and focus area
- **Recent Activity**: Summary of latest changes and commits
- **Active Work**: Current tasks, working directories, and progress
- **Available Tools**: Key scripts, agents, and automation capabilities
- **Priorities**: Immediate next steps and any blocking issues
- **Quick Reference**: Links to key documentation for current work

Arguments: $ARGUMENTS (focus areas: status, agents, workflow, technical, all)

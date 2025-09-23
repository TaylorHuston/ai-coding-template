---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "git", "commit", "quality"]
description: "Create a proper git commit with quality checks and conventional message"
argument-hint: "[message] [--files FILES]"
allowed-tools: ["Bash", "Read", "Grep", "Glob"]
model: "claude-sonnet-4"
---

# /commit Command

**Purpose**: Create a proper git commit with quality checks and conventional message formatting.

## Usage

```bash
/commit                           # Interactive commit with quality checks
/commit "feat: add user auth"      # Direct commit with message
/commit --files "src/auth.js"      # Commit specific files
```

## Process

Help create a proper git commit by:
1. Running pre-commit checks (tests, lint, type-check) 
2. Reviewing staged changes for quality and completeness
3. Drafting an appropriate commit message following project conventions
4. Only proceeding with commit after user approval

## Agent Coordination

**Primary**: code-reviewer (for change assessment and quality validation)
**Supporting**: test-engineer (for test validation), security-auditor (for security-sensitive changes)

## Process

- Use code-reviewer agent to assess staged changes
- Run project-specific quality checks (tests, linting, etc.)
- Generate conventional commit message with AI attribution
- Provide summary of changes and impact assessment
- Ask for user confirmation before committing

## Examples

**Interactive commit**: `/commit` → Review changes → Generate commit message → Confirm
**Direct commit**: `/commit "feat: add user authentication"` → Quality checks → Commit
**Selective commit**: `/commit --files "src/auth.js"` → Commit specific files
---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "git", "commit", "quality"]
description: "Create a proper git commit with quality checks and conventional message"
argument-hint: "[message] [--files FILES] [--amend] [--no-verify] [--interactive]"
allowed-tools: ["Bash", "Read", "Grep", "Glob"]
model: claude-sonnet-4-5
---

# /commit Command

**Purpose**: Create a proper git commit with quality checks and conventional message formatting.

## Usage

```bash
# Basic commits
/commit                           # Interactive commit with quality checks
/commit "feat: add user auth"      # Direct commit with message
/commit --files "src/auth.js"      # Commit specific files

# Advanced workflows
/commit --amend                    # Amend last commit (with safety checks)
/commit "fix: typo" --no-verify    # Skip pre-commit hooks
/commit --interactive              # Interactive staging + commit
/commit "docs: update" --amend --no-verify  # Combine flags
```

## Process

**Parse Arguments**:
- If `--amend` flag present: Execute Amend Mode with safety checks
- If `--no-verify` flag present: Skip pre-commit hooks
- If `--interactive` flag present: Run interactive staging before commit
- If `--files` specified: Stage only specified files

**Standard Commit Flow**:
1. Run pre-commit checks (tests, lint, type-check) unless `--no-verify`
2. Review staged changes for quality and completeness
3. Draft appropriate commit message following project conventions
4. Ask for user confirmation before committing

**Amend Mode** (`--amend` flag):
1. Safety Check: Verify commit hasn't been pushed (`git log @{u}..HEAD`)
2. Authorship Check: Verify current commit author matches user
3. Warning: If commit from different author, WARN and require explicit confirmation
4. Proceed: If safe, allow amending with new changes or updated message

**No-Verify Mode** (`--no-verify` flag):
1. Display warning that pre-commit checks are being skipped
2. Explain appropriate use cases (emergency fixes, WIP commits)
3. Note that code quality checks won't run
4. Execute commit with `--no-verify` flag

**Interactive Mode** (`--interactive` flag):
1. Run `git add -i` or `git add -p` for interactive staging
2. Review selected changes
3. Proceed with standard commit flow

## Agent Coordination

**Primary**: code-reviewer (for change assessment and quality validation)
**Supporting**: test-engineer (for test validation), security-auditor (for security-sensitive changes)

## Examples

**Interactive commit**: `/commit` → Review changes → Generate message → Confirm
**Direct commit**: `/commit "feat: add user authentication"` → Quality checks → Commit
**Selective commit**: `/commit --files "src/auth.js"` → Commit specific files
**Amend last commit**: `/commit --amend` → Safety checks → Amend with new changes
**Skip hooks**: `/commit "fix: typo" --no-verify` → Skip pre-commit → Fast commit
**Interactive staging**: `/commit --interactive` → Choose hunks → Commit selected changes
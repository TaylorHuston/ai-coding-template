---
tags: ["workflow", "git", "commit", "quality"]
description: "Create a proper git commit with quality checks and conventional message"
argument-hint: "[message] [--files FILES] [--amend] [--no-verify] [--interactive]"
allowed-tools: ["Bash", "Read", "Grep", "Glob"]
model: claude-sonnet-4-5
references_guidelines:
  - docs/development/guidelines/git-workflow.md  # Commit conventions, type inference, branch naming
---

# /commit Command

**Purpose**: Create a proper git commit with quality checks and conventional message formatting.

**Guide**: Always check the git-workflow.md guideline first and adhere to that.

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

**Branch-Aware Commit Message Generation**:
1. Get current branch: `git branch --show-current`
2. Read `docs/development/guidelines/git-workflow.md` for branch naming pattern
3. Extract issue ID from branch name (if matches pattern):
   - `feature/TASK-001` → TASK-001
   - `bugfix/BUG-003` → BUG-003
4. Determine commit type from staged changes using `commit_type_inference` config in git-workflow.md:
   - Analyzes file patterns (tests, docs, config, source code)
   - Checks commit message keywords (fix, feature, refactor, etc.)
   - Applies most specific match or defaults to configured default_type
   - See git-workflow.md "Commit Type Inference" section for customization
5. If issue ID extracted and not in user's message:
   - Format as: `type(ISSUE-ID): description`
   - Example: `feat(TASK-001): add user authentication`
6. Follow conventional commits format from git-workflow.md

**Standard Commit Flow**:
1. Run pre-commit checks (tests, lint, type-check) unless `--no-verify`
2. Review staged changes for quality and completeness
3. Draft commit message (branch-aware, with issue reference)
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

## Branch-Aware Commit Messages

The `/commit` command automatically includes issue references from your branch name:

```bash
# On branch: feature/TASK-001
/commit "add user authentication"
# → Generates: feat(TASK-001): add user authentication

# On branch: bugfix/BUG-003
/commit "fix login timeout"
# → Generates: fix(BUG-003): fix login timeout

# On branch: develop (no issue)
/commit "refactor database connection"
# → Generates: refactor: refactor database connection

# Manual override (if issue already in message)
/commit "feat(TASK-001): add user auth"
# → Uses as-is: feat(TASK-001): add user auth
```

**Benefits:**
- Automatic issue tracking in commits
- No need to remember issue IDs
- Links commits to tasks/bugs
- Follows conventional commits format

## Examples

**Interactive commit**: `/commit` → Review changes → Generate branch-aware message → Confirm
**Direct commit**: `/commit "add user authentication"` → Adds issue from branch → Quality checks → Commit
**Selective commit**: `/commit --files "src/auth.js"` → Commit specific files with issue reference
**Amend last commit**: `/commit --amend` → Safety checks → Amend with new changes
**Skip hooks**: `/commit "fix typo" --no-verify` → Skip pre-commit → Fast commit
**Interactive staging**: `/commit --interactive` → Choose hunks → Commit with issue reference
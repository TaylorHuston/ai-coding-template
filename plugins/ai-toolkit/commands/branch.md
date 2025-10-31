---
version: "1.0.0"
created: "2025-10-22"
last_updated: "2025-10-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "git", "branching"]
description: "Unified branch operations with git-workflow enforcement"
argument-hint: "create ISSUE-ID | merge [target] | delete branch-name | switch branch-name | status | \"natural language\""
allowed-tools: ["Bash", "Read", "Edit", "Grep", "Glob"]
model: claude-sonnet-4-5
references_guidelines:
  - docs/development/guidelines/git-workflow.md  # Source of truth for branching rules, merge validation, naming patterns
---

# /branch Command

Unified command for Git branching operations with automatic enforcement of project git workflow rules.

**CRITICAL**: Always read `docs/development/guidelines/git-workflow.md` FIRST to understand project-specific branching rules, naming conventions, and merge requirements.

## Usage

```bash
# Branch operations
/branch create TASK-001              # Create work branch
/branch merge [develop|main]         # Merge with validation
/branch delete feature/TASK-001      # Delete merged branch
/branch switch develop               # Switch branches
/branch status                       # Show workflow state

# Natural language
/branch "merge to develop"
/branch "create for TASK-001"
```

## Operations

### Create
1. Read git-workflow.md for branching pattern and base branch
2. Parse issue ID → determine branch type (TASK → feature, BUG → bugfix)
3. Create branch following pattern (e.g., `feature/TASK-001` from `develop`)
4. Switch to new branch

### Merge
1. Read git-workflow.md for merge rules
2. Apply validation based on target:
   - **To develop**: Run tests (BLOCK if fail)
   - **To main**:
     - Verify source is `develop` (BLOCK if feature/bugfix branch)
     - Run staging health checks (BLOCK if fail)
     - Emergency hotfixes require explicit justification
3. If validation passes: merge and push
4. If validation fails: block with clear error message

**Critical Rule Enforcement:**
- ❌ Work branches (feature/*, bugfix/*) CANNOT merge to main
- ✅ Only develop can merge to main
- ⚠️ Hotfix branches require ADR documenting emergency justification

### Delete
1. Check if branch is fully merged
2. Confirm deletion with user
3. Delete local and remote branches

### Switch
1. Check for uncommitted changes (offer to stash)
2. Switch to target branch
3. Pull latest changes

### Status
1. Show current branch and issue context
2. Check test/validation status
3. Show what's needed for merge

## Configuration

The command reads `docs/development/guidelines/git-workflow.md` YAML frontmatter:

```yaml
---
branching_strategy: "three-branch"
main_branch: "main"
develop_branch: "develop"
work_branch_pattern: "type/ISSUE-ID"
merge_rules:
  to_develop: "tests_pass"
  to_main: "staging_validated"
---
```

**If guideline missing**: Use defaults (three-branch: main ← develop ← work branches)

## Validation Rules

**Defined in git-workflow.md**, enforced by this command:

### Merge to Develop (Staging)
- ✅ Source: Any work branch (feature/*, bugfix/*)
- ✅ Validation: All tests MUST pass
- ❌ BLOCKS merge if tests fail

### Merge to Main (Production)
- ✅ Source: ONLY `develop` branch
- ❌ BLOCKS work branches (feature/*, bugfix/*)
- ✅ Validation: Staging health checks MUST pass
- ⚠️ Exception: hotfix/* branches (requires ADR justification)

### Branch Naming
- Follow configured pattern (type/ISSUE-ID)
- Auto-detect test framework and run appropriate commands

**See `docs/development/guidelines/git-workflow.md` for complete workflow rules and rationale.**

## Agent Coordination

- **devops-engineer** - Health checks, deployment validation
- **test-engineer** - Test execution, result parsing

## Command Instructions

```
Task: "Execute Git branch operation following project workflow rules.

**CRITICAL**:
1. FIRST: Read docs/development/guidelines/git-workflow.md
   - Extract YAML frontmatter configuration
   - Understand branching strategy, patterns, merge rules
   - Use this as source of truth for all operations

2. Execute operation based on command:
   - create: Follow branching pattern, create from base branch
   - merge: Apply validation rules from guideline, block if fail
   - delete: Check merge status, confirm, delete
   - switch: Handle uncommitted changes, switch, pull
   - status: Show current state and readiness

3. Validation enforcement:
   - For merge to develop: Run tests (auto-detect framework)
   - For merge to main: Verify source=develop, check staging health
   - Block operation if validation fails
   - Show clear error messages with next steps

4. Use git commands appropriately:
   - git checkout, git branch, git merge, git push
   - Parse git output for status and errors
   - Handle conflicts and failures gracefully

5. Natural language support:
   - Parse intent from quoted string
   - Map to structured operation
   - Execute with same validation

All workflow rules, patterns, and rationale are defined in git-workflow.md guideline.
This command simply enforces those rules."
```

## Related Commands

- `/implement` - Creates work branches automatically
- `/commit` - Branch-aware commit messages
- `/docs` - Reference for workflow documentation

## Related Guidelines

- `docs/development/guidelines/git-workflow.md` - **Source of truth** for all branching rules

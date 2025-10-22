---
# Git Configuration (Machine-readable for AI agents)
branching_strategy: "three-branch"     # main, develop, work branches
main_branch: "main"                    # production
develop_branch: "develop"              # staging
work_branch_pattern: "type/ISSUE-ID"  # feature/TASK-001, bugfix/BUG-003
commit_convention: "conventional"      # conventional commits
pr_required: true
squash_merge: false
merge_rules:
  to_develop: "tests_pass"             # All tests must pass
  to_main: "staging_validated"         # Staging deployment validated
---

# Git Workflow Guidelines

## Quick Reference

This guideline defines our three-branch Git workflow with automated merge validation. Commands like `/branch` and `/implement` enforce these rules automatically.

## Branching Strategy

**Default**: Three-branch model for production safety and staging validation

The three-branch model provides:
- **Production stability** - `main` branch always represents deployed production code
- **Staging validation** - `develop` branch for pre-production testing
- **Isolated development** - Work branches for feature/bug development

### Branch Structure

```
main (production)
  ↑
  └─ develop (staging)
       ↑
       ├─ feature/TASK-001  (work branch)
       ├─ feature/TASK-002  (work branch)
       └─ bugfix/BUG-001    (work branch)
```

### Branch Naming Convention

**Strict format**: `type/ISSUE-ID`

```
feature/TASK-001    # Feature implementation
bugfix/BUG-003      # Bug fix
```

**Naming rules:**
- Type must be `feature` (for TASK-###) or `bugfix` (for BUG-###)
- Must include issue ID exactly as it appears (TASK-001, BUG-003, etc.)
- No additional description allowed (keeps branches tied to issues)

### Main Branches

- **Production**: `main` - Deployed to production environment
- **Staging**: `develop` - Deployed to staging environment for validation
- **Work branches**: `type/ISSUE-ID` - Short-lived development branches

## Branch Lifecycle

### Creating Work Branches

Work branches are created automatically by `/implement` when you start working on an issue:

```bash
/implement TASK-001 1.1
# → Creates feature/TASK-001 from develop
# → Switches to new branch
# → Executes phase 1.1
```

Or manually with `/branch`:

```bash
/branch create TASK-001
# → Creates feature/TASK-001 from develop
# → Switches to new branch
```

### Merging Work Branches

**To develop (staging):**

```bash
/branch merge
# OR
/branch merge develop
```

**Merge rules enforced:**
1. All tests must pass (unit, integration, E2E)
2. Merge blocked if any test fails
3. Shows test results before merge

**To main (production):**

```bash
/branch merge main
```

**Merge rules enforced:**
1. Source branch must be `develop` (not work branches)
2. Staging deployment health checks must pass
3. Automated validation of staging environment
4. Merge blocked if health checks fail

### Deleting Work Branches

After merging to develop, delete your work branch:

```bash
/branch delete feature/TASK-001
```

Verification:
- Confirms branch is fully merged
- Cleans up local and remote branches
- Prevents accidental deletion of unmerged work

## Commit Conventions

**Format**: Conventional Commits

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**: feat, fix, docs, style, refactor, test, chore, perf

The `/commit` command automatically includes issue references from your branch name:

```bash
# On branch feature/TASK-001
/commit "implement user authentication"
# → Generates: feat(TASK-001): implement user authentication
```

### Commit Message Rules

- **Length**: 50 chars for subject, 72 chars for body
- **Tense**: Imperative ("add feature" not "added feature")
- **Capitalization**: Lowercase subject (conventional commits style)
- **Punctuation**: No period at end of subject

## Merge Validation Rules

The `/branch merge` command enforces quality gates based on target branch:

### Merging to `develop` (Staging)

**Required validations:**
1. ✅ All tests pass (unit, integration, E2E)
2. ✅ No uncommitted changes
3. ✅ Branch is up to date with remote

**Process:**
```bash
/branch merge develop
# 1. Runs full test suite
# 2. Shows test results
# 3. Blocks merge if tests fail
# 4. Executes merge if all pass
# 5. Pushes to remote
```

### Merging to `main` (Production)

**Required validations:**
1. ✅ Source branch must be `develop`
2. ✅ Staging deployment health checks pass
3. ✅ Automated smoke tests pass
4. ✅ No uncommitted changes

**Process:**
```bash
/branch merge main
# 1. Verifies source is develop
# 2. Runs health checks against staging
# 3. Validates deployment status
# 4. Blocks merge if checks fail
# 5. Executes merge if validated
# 6. Pushes to remote
```

**Why this matters:**
- Production deploys only from validated staging code
- Catches environment-specific issues before production
- Ensures staging and production stay synchronized

## Pull Request Workflow

### PR Requirements

- **Code Review**: Pull requests required for all merges
- **Tests**: Must pass before merge (enforced by `/branch merge`)
- **CI/CD**: Tests run automatically on push
- **Conflict Resolution**: Merge commits (no squash by default)

### Merge Strategy

- **Merge Commit**: Default - preserves full history
- **Squash Merge**: Disabled by default (loses granular history)
- **Rebase**: Not recommended for shared branches

**Rationale**: Merge commits maintain the full development history and make it easier to understand feature evolution and revert changes if needed.

## Release Process

### Versioning

- **Scheme**: Semantic Versioning (SemVer) - MAJOR.MINOR.PATCH
- **Tagging**: Tags created on `main` branch after merge
- **Changelog**: Maintained in CHANGELOG.md following Keep a Changelog format

### Deployment

- **Staging**: Automatic deployment from `develop` branch
- **Production**: Automatic deployment from `main` branch
- **Approval**: Merges to `main` gated by staging validation

## Workflow Commands

### `/branch` - Branch operations
```bash
/branch create TASK-001        # Create work branch
/branch merge [target]         # Merge with validation
/branch delete branch-name     # Delete merged branch
/branch switch branch-name     # Switch branches
/branch status                 # Show workflow state
```

### `/implement` - Start work
```bash
/implement TASK-001 1.1
# → Creates feature/TASK-001 if needed
# → Warns if on wrong branch
# → Executes implementation phase
```

### `/commit` - Create commits
```bash
/commit "add user authentication"
# → Includes issue ID from branch name
# → Follows conventional commits format
```

## Examples

### Good Commit Messages

```
feat(TASK-001): implement user registration endpoint
fix(BUG-003): resolve login session timeout issue
docs(TASK-002): update API documentation
test(TASK-001): add integration tests for auth flow
refactor: simplify database connection logic
```

### Complete Branch Workflow

```bash
# 1. Start work on issue
/implement TASK-001 1.1
# → Creates feature/TASK-001 from develop
# → Executes phase 1.1

# 2. Continue implementation
/implement TASK-001 1.2
/implement TASK-001 2.1

# 3. Commit work
/commit "implement authentication logic"

# 4. Merge to staging
/branch merge develop
# → Runs all tests
# → Merges if tests pass
# → Deploys to staging

# 5. Validate staging, then promote to production
/branch switch develop
/branch merge main
# → Runs staging health checks
# → Merges if validated
# → Deploys to production

# 6. Clean up work branch
/branch delete feature/TASK-001
```

## General Git Knowledge

For Git best practices, Claude has extensive knowledge of:
- Branching strategies (Git Flow, GitHub Flow, trunk-based)
- Commit message conventions (Conventional Commits, semantic commits)
- Merge strategies (merge commits, squash, rebase)
- Conflict resolution techniques
- Git hooks and automation

Ask questions like "How should I handle [X] in Git?" and Claude will provide guidance based on industry standards and your chosen workflow.

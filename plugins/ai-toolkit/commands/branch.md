---
version: "1.0.0"
created: "2025-10-22"
last_updated: "2025-10-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "git", "branching", "merging", "validation"]
description: "Unified branch operations with git-workflow enforcement"
argument-hint: "create ISSUE-ID | merge [target] | delete branch-name | switch branch-name | status | \"natural language\""
allowed-tools: ["Bash", "Read", "Edit", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
---

# /branch Command

**Purpose**: Unified command for all Git branching operations with automatic enforcement of project git workflow rules.

## Usage

```bash
# Branch creation
/branch create TASK-001           # Create feature/TASK-001 from develop
/branch create BUG-003            # Create bugfix/BUG-003 from develop

# Branch merging
/branch merge                     # Merge to develop (default)
/branch merge develop             # Merge to develop (explicit)
/branch merge main                # Merge to main (production)

# Branch management
/branch delete feature/TASK-001   # Delete merged branch
/branch switch develop            # Switch to develop
/branch status                    # Show current workflow state

# Natural language support
/branch "merge to develop"
/branch "create for TASK-001"
/branch "switch to main"
/branch "delete old-feature"
```

## Core Principle

**ALWAYS read `docs/development/guidelines/git-workflow.md` first** to understand project branching rules, naming conventions, and merge requirements.

## Operations

### 1. Branch Creation (`create`)

**Purpose**: Create work branches following project naming conventions

**Process:**
1. Read `docs/development/guidelines/git-workflow.md` YAML frontmatter
2. Extract branching configuration:
   - `branching_strategy` - Workflow type (three-branch, etc.)
   - `develop_branch` - Base branch for work branches (typically "develop")
   - `work_branch_pattern` - Naming pattern (e.g., "type/ISSUE-ID")
3. Parse issue ID from argument (TASK-001 → feature, BUG-003 → bugfix)
4. Generate branch name following pattern:
   - TASK-### → feature/TASK-###
   - BUG-### → bugfix/BUG-###
5. Create branch from configured base (develop)
6. Switch to new branch
7. Confirm creation

**Example:**
```bash
/branch create TASK-001

# Process:
# 1. Read git-workflow.md → pattern: "type/ISSUE-ID", base: "develop"
# 2. Parse TASK-001 → type: "feature"
# 3. Generate: feature/TASK-001
# 4. git checkout develop && git pull
# 5. git checkout -b feature/TASK-001
# 6. ✓ Created and switched to feature/TASK-001
```

### 2. Branch Merging (`merge`)

**Purpose**: Merge branches with validation rules based on target

**Process:**
1. Read `docs/development/guidelines/git-workflow.md` YAML frontmatter
2. Extract merge rules configuration:
   - `merge_rules.to_develop` - Rules for merging to staging
   - `merge_rules.to_main` - Rules for merging to production
3. Identify current branch and target branch
4. Apply validation rules based on target

**Merging to `develop` (Staging):**

```bash
/branch merge develop
```

**Validation rules:**
- ✅ Run all test suites (unit, integration, E2E)
- ✅ Block merge if any tests fail
- ✅ Verify no uncommitted changes
- ✅ Ensure branch is up to date with remote

**Process:**
1. Check for uncommitted changes
2. Detect test framework (package.json, pytest, etc.)
3. Run appropriate test command:
   - `npm test` / `npm run test:all`
   - `pytest`
   - `cargo test`
   - etc.
4. Parse test results
5. If tests fail:
   - Show failed test summary
   - Block merge with error message
   - Suggest fixing tests first
6. If tests pass:
   - Switch to develop branch
   - Pull latest changes
   - Merge feature branch
   - Push to remote
   - Confirm success

**Merging to `main` (Production):**

```bash
/branch merge main
```

**Validation rules:**
- ✅ Source branch must be `develop` (not work branches)
- ✅ Run staging health checks
- ✅ Validate staging deployment status
- ✅ Block merge if validation fails

**Process:**
1. Verify current branch is `develop`
2. If not develop:
   - Error: "Can only merge to main from develop branch"
   - Show current branch
   - Suggest: "Switch to develop first: /branch switch develop"
3. Check for staging deployment configuration:
   - Look for `.env.staging`, `config/staging.yml`, etc.
   - Look for health check endpoints in config
4. Run staging health checks:
   - HTTP health endpoint checks (if configured)
   - Smoke tests (if configured)
   - Deployment timestamp validation
5. If health checks fail:
   - Show failed checks
   - Block merge with error
   - Suggest validating staging manually
6. If validation passes:
   - Switch to main branch
   - Pull latest changes
   - Merge develop branch
   - Push to remote
   - Confirm success

**Example:**
```bash
# On feature/TASK-001
/branch merge develop

# Process:
# 1. Check uncommitted changes → ✓ clean
# 2. Detect npm project → run "npm test"
# 3. Tests pass → ✓ 45 tests, 0 failures
# 4. Switch to develop → git checkout develop
# 5. Pull latest → git pull origin develop
# 6. Merge → git merge --no-ff feature/TASK-001
# 7. Push → git push origin develop
# 8. ✓ Merged feature/TASK-001 into develop
```

### 3. Branch Deletion (`delete`)

**Purpose**: Delete fully merged branches safely

**Process:**
1. Verify branch exists
2. Check if branch is fully merged:
   - `git branch --merged` to list merged branches
   - If not merged, warn user and ask for confirmation
3. Confirm deletion with user
4. Delete local branch: `git branch -d branch-name`
5. Delete remote branch (if exists): `git push origin --delete branch-name`
6. Confirm deletion

**Example:**
```bash
/branch delete feature/TASK-001

# Process:
# 1. Check merge status → ✓ fully merged into develop
# 2. Confirm: "Delete feature/TASK-001? (y/n)"
# 3. Delete local → git branch -d feature/TASK-001
# 4. Delete remote → git push origin --delete feature/TASK-001
# 5. ✓ Deleted feature/TASK-001 (local and remote)
```

### 4. Branch Switching (`switch`)

**Purpose**: Switch between branches safely

**Process:**
1. Check for uncommitted changes
2. If uncommitted changes exist:
   - Offer to stash: "Stash uncommitted changes? (y/n)"
   - If yes: `git stash save "Auto-stash by /branch switch"`
3. Switch to target branch: `git checkout branch-name`
4. Pull latest changes: `git pull origin branch-name`
5. Confirm switch

**Example:**
```bash
/branch switch develop

# Process:
# 1. Check uncommitted → 2 files modified
# 2. Stash? → yes
# 3. git stash save "Auto-stash by /branch switch"
# 4. git checkout develop
# 5. git pull origin develop
# 6. ✓ Switched to develop (2 files stashed)
```

### 5. Workflow Status (`status`)

**Purpose**: Show current branch context and workflow state

**Process:**
1. Read git-workflow.md configuration
2. Get current branch: `git branch --show-current`
3. Parse branch name for issue ID (if work branch)
4. Check if tests would pass (quick validation)
5. Check staging health (if on develop)
6. Show workflow state

**Example:**
```bash
/branch status

# Output:
# Current branch: feature/TASK-001
# Issue: TASK-001 (User Authentication)
# Base branch: develop
#
# Status:
# ✓ No uncommitted changes
# ✓ Up to date with remote
# ⚠ Tests not run yet
#
# Ready to merge? Run: /branch merge develop
# (Will run tests before merge)
```

## Natural Language Support

The command supports natural language instructions:

```bash
/branch "merge my work to develop"
# → Interprets as: /branch merge develop

/branch "create branch for TASK-001"
# → Interprets as: /branch create TASK-001

/branch "delete the old feature branch"
# → Asks which branch to delete, then executes

/branch "what's my current branch status?"
# → Executes: /branch status
```

**Natural language parsing:**
1. Extract intent (create, merge, delete, switch, status)
2. Extract targets (issue ID, branch name, target branch)
3. Map to structured command
4. Execute with validation

## Configuration Reading

**Always read `docs/development/guidelines/git-workflow.md` YAML frontmatter:**

```yaml
---
branching_strategy: "three-branch"
main_branch: "main"
develop_branch: "develop"
work_branch_pattern: "type/ISSUE-ID"
commit_convention: "conventional"
pr_required: true
squash_merge: false
merge_rules:
  to_develop: "tests_pass"
  to_main: "staging_validated"
---
```

**Use this configuration for:**
- Branch naming patterns
- Base branch for work branches
- Merge validation rules
- Commit message enforcement

**Handle missing configuration:**
- If file doesn't exist: Use sensible defaults (three-branch model)
- If YAML invalid: Show error and use defaults
- If fields missing: Use defaults for missing fields

**Defaults:**
```yaml
branching_strategy: "three-branch"
main_branch: "main"
develop_branch: "develop"
work_branch_pattern: "type/ISSUE-ID"
merge_rules:
  to_develop: "tests_pass"
  to_main: "staging_validated"
```

## Test Detection and Execution

**Auto-detect test framework:**

1. Check for test configuration files:
   - `package.json` → npm/yarn/pnpm (check "test" script)
   - `pytest.ini` / `pyproject.toml` → pytest
   - `Cargo.toml` → cargo test
   - `go.mod` → go test
   - `build.gradle` / `pom.xml` → gradle/maven test

2. Run appropriate test command:
   - **Node.js**: `npm test` or `npm run test:all`
   - **Python**: `pytest` or `python -m pytest`
   - **Rust**: `cargo test`
   - **Go**: `go test ./...`
   - **Java**: `./gradlew test` or `mvn test`

3. Parse test output:
   - Extract pass/fail counts
   - Capture failed test names
   - Determine overall status

4. Report results:
   - Show test summary
   - List failed tests (if any)
   - Allow/block merge based on results

## Health Check Validation

**For merges to `main`, validate staging deployment:**

1. **Check for health endpoint configuration:**
   - Environment variables: `STAGING_URL`, `HEALTH_CHECK_URL`
   - Config files: `.env.staging`, `config/staging.yml`
   - Default patterns: `https://staging.{domain}/health`

2. **Run health checks:**
   - HTTP GET to health endpoint
   - Expect 200 status code
   - Parse health response (JSON)
   - Validate key services are "healthy"

3. **Run smoke tests (if configured):**
   - Check for smoke test script: `npm run test:smoke`
   - Execute against staging environment
   - Parse results

4. **Validate deployment timestamp:**
   - Check last deployment from develop branch
   - Ensure recent (within 24 hours recommended)
   - Warn if staging is stale

5. **Report validation results:**
   - Show health check status
   - Show smoke test results
   - Allow/block merge based on validation

## Agent Coordination

**Primary**: devops-engineer (deployment validation, health checks)
**Supporting**: test-engineer (test execution and parsing), code-reviewer (pre-merge validation)

**DevOps agent responsibilities:**
- Configure and run health checks
- Parse deployment status
- Validate staging environment
- Execute smoke tests

**Test engineer responsibilities:**
- Detect test framework
- Execute appropriate test commands
- Parse test results
- Report failures

## Error Handling

### Missing Configuration

```
Warning: git-workflow.md not found
Using default three-branch workflow:
  - main (production)
  - develop (staging)
  - work branches: type/ISSUE-ID
```

### Invalid Issue ID

```
Error: Invalid issue ID format
Expected: TASK-### or BUG-###
Got: feature-123

Usage: /branch create TASK-001
```

### Tests Failed

```
❌ Tests failed - merge blocked

Test Results:
  ✓ 42 passed
  ✗ 3 failed

Failed tests:
  - auth.test.js: User login should redirect to dashboard
  - api.test.js: POST /users should validate email format
  - integration.test.js: Complete signup flow should create user

Fix failing tests before merging to develop.
```

### Health Checks Failed

```
❌ Staging health checks failed - merge blocked

Health Check Results:
  ✓ API service: healthy
  ✗ Database: connection timeout
  ✗ Cache service: not responding

Validate and fix staging environment before promoting to production.
```

### Branch Not Merged

```
Warning: feature/TASK-001 is not fully merged

This branch contains commits not in develop.
Deleting will lose these changes.

Continue with deletion? (y/n)
```

## Integration with Workflow

**Used by `/implement`:**
- `/implement` calls `/branch create` internally when work branch doesn't exist
- `/implement` warns if on wrong branch, offers to create correct one

**Used by developers:**
- `/branch merge` used to merge work to develop after implementation
- `/branch merge main` used to promote develop to production
- `/branch delete` used to clean up after merge

**Workflow example:**
```bash
# 1. Start work
/implement TASK-001 1.1
# → Internally: /branch create TASK-001

# 2. ... do work ...

# 3. Merge to staging
/branch merge develop
# → Runs tests, merges if pass

# 4. Validate staging, promote to production
/branch switch develop
/branch merge main
# → Runs health checks, merges if validated

# 5. Clean up
/branch delete feature/TASK-001
```

## Output

**Success messages:**
- ✓ Created and switched to feature/TASK-001
- ✓ All tests passed (45 tests, 0 failures)
- ✓ Merged feature/TASK-001 into develop
- ✓ Staging health checks passed
- ✓ Merged develop into main
- ✓ Deleted feature/TASK-001 (local and remote)

**Error messages:**
- ❌ Tests failed - merge blocked
- ❌ Health checks failed - merge blocked
- ❌ Can only merge to main from develop
- ❌ Branch not fully merged - deletion blocked

**Warnings:**
- ⚠️ You're on develop but implementing TASK-001
- ⚠️ Uncommitted changes will be stashed
- ⚠️ Staging deployment is stale (last deployed 3 days ago)

## Related Commands

- **Previous**: `/implement` (creates work branches)
- **This**: `/branch` (manages branches with validation)
- **Next**: `/commit` (commits with branch-aware messages)

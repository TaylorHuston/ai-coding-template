---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-18"
status: "active"
target_audience: ["developers", "ai-assistants", "project-maintainers"]
document_type: "guide"
priority: "high"
tags: ["git", "workflow", "branching", "commits", "collaboration"]
difficulty: "intermediate"
estimated_time: "15 min"
---

# Git Workflow Guidelines

**Purpose**: Project-specific Git workflow focusing on epic-driven development and AI collaboration patterns.

## Epic-Driven Branching Model

Hierarchical branching structure aligned with `/design` → `/architect` → `/plan` → `/develop` workflow:

```
main (production)
├── develop (integration)
│   ├── epic/user-authentication
│   │   ├── task/001-database-setup
│   │   ├── task/002-user-registration
│   │   ├── task/003-redis-setup (discovered during /architect)
│   │   ├── task/004-validation-helpers (discovered during /develop)
│   │   └── task/005-comprehensive-testing (dedicated testing task)
│   ├── epic/payment-processing
│   │   ├── task/001-stripe-integration
│   │   └── task/002-payment-validation
│   └── epic/reporting-dashboard
├── release/v1.2.0
└── hotfix/v1.1.1-critical-security-fix
```

## Branch Types and Naming

### Epic-Driven Branches
- **`epic/*`**: Development units containing related tasks (`epic/user-authentication`)
- **`task/*`**: Individual implementation tasks within epics (`task/001-database-setup`)
- **`bugfix/*`**: Non-critical bug fixes (`bugfix/BUG-123-validation-error`)
- **`hotfix/*`**: Critical production fixes (`hotfix/v1.2.1-security-patch`)
- **`release/*`**: Release preparation (`release/v1.2.0`)
- **`experimental/*`**: Proof of concepts (`experimental/graphql-migration`)

### Naming Conventions

```bash
# Epic branches
epic/[epic-name]
epic/user-authentication
epic/payment-processing

# Task branches (within epics)
task/[###]-[task-name]
task/001-database-setup
task/002-user-registration
task/003-redis-setup

# Bug fixes
bugfix/BUG-123-short-description
bugfix/BUG-456-memory-leak-fix

# Hotfixes
hotfix/v1.2.1-security-patch
hotfix/v2.0.1-critical-database-fix
```

## Epic-Driven Workflow

### 1. Epic Creation
```bash
git checkout develop
git pull origin develop
git checkout -b epic/user-authentication
```

### 2. Task Implementation
```bash
# Create task branch from epic
git checkout epic/user-authentication
git pull origin epic/user-authentication
git checkout -b task/001-database-setup

# Work with TDD approach
# ... implement and test ...

# Push task and create PR to epic
git push -u origin task/001-database-setup
# PR: task/001-database-setup → epic/user-authentication
```

### 3. Progressive Task Discovery
Tasks can be discovered during any workflow phase:

```bash
# During /architect phase, discover need for Redis
git checkout epic/user-authentication
git checkout -b task/003-redis-setup

# During /develop phase, discover need for validation helpers
git checkout epic/user-authentication
git checkout -b task/004-validation-helpers

# Task numbering follows discovery order, not execution order
# EPIC.md maintains actual execution dependencies
```

### 4. Epic Completion
```bash
# When all tasks complete, merge epic to develop
# PR: epic/user-authentication → develop
# Delete epic branch after successful merge
```

## Commit Conventions

### Epic-Driven Format
```
<type>(<scope>): <subject> [EPIC:<epic-name>/TASK:<###>]

<body>

<footer>
```

### Examples

**Feature Implementation:**
```bash
git commit -m "feat(auth): implement JWT token authentication [EPIC:user-auth/TASK:002]

- Add JWT token generation and validation
- Implement refresh token mechanism
- Add middleware for protected routes
- Achieve 97% test coverage with TDD approach

Resolves: TASK-002 in epic/user-authentication
AI-assisted implementation with security review

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Bug Fix:**
```bash
git commit -m "fix(api): resolve user validation error [EPIC:user-auth/TASK:004]

- Fix email validation regex edge cases
- Add proper error messages for validation failures
- Include comprehensive test coverage

Fixes: BUG-456 discovered during task implementation
Testing: Added unit tests for edge cases"
```

### Commit Types
| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 authentication [EPIC:user-auth/TASK:002]` |
| `fix` | Bug fix | `fix(api): resolve validation error [EPIC:user-auth/TASK:004]` |
| `test` | Add/update tests | `test(auth): add integration tests [EPIC:user-auth/TASK:005]` |
| `refactor` | Code refactoring | `refactor(utils): optimize helper functions` |
| `docs` | Documentation | `docs(readme): update epic workflow guide` |
| `chore` | Maintenance | `chore(deps): update dependencies` |

## AI Collaboration Standards

### AI-Assisted Commits
```bash
git commit -m "feat(dashboard): implement real-time analytics [EPIC:dashboard/TASK:003]

- Add WebSocket connection for real-time updates
- Implement responsive chart components
- Include error handling and loading states

AI-assisted implementation focusing on:
- Component architecture and state management
- Real-time data handling patterns
- Error boundary implementation

Resolves: TASK-003 in epic/reporting-dashboard
Code review: AI suggestions validated against project patterns

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### AI Code Review Documentation
```bash
git commit -m "refactor(auth): improve error handling based on AI analysis

- Standardize error response formats
- Add contextual error messages
- Implement proper HTTP status codes

AI analysis identified inconsistent error patterns.
All suggestions validated through manual testing and security review.

Human validation confirms alignment with project standards."
```

## Pull Request Guidelines

### Epic-to-Develop PR Template
```markdown
## Epic Summary
Brief description of the epic and its completed tasks.

## Completed Tasks
- [x] task/001-database-setup
- [x] task/002-user-registration
- [x] task/003-redis-setup
- [x] task/004-validation-helpers
- [x] task/005-comprehensive-testing

## Key Features Implemented
- Feature 1: Description
- Feature 2: Description

## Testing
- [ ] All task tests pass
- [ ] Integration tests complete
- [ ] Epic-level testing verified

## AI Assistance
- [ ] AI-generated code reviewed and validated
- [ ] Human oversight applied throughout epic
- [ ] Code patterns align with project standards
```

### Task-to-Epic PR Template
```markdown
## Task: [###] - [Task Name]

Brief description of task implementation.

## Changes
- Change 1: Description
- Change 2: Description

## Testing
- [ ] Unit tests pass (>=80% coverage)
- [ ] TDD approach followed
- [ ] Integration tests included

## Epic Context
Part of epic/[epic-name] working toward [epic goal].
```

## Integration with Project Commands

### Workflow Command Integration
```bash
# Use /design to plan epic structure
# Use /architect to discover technical tasks
# Use /plan to sequence task implementation
# Use /develop to implement individual tasks

# Example epic progression:
# 1. /design epic/user-authentication
# 2. /architect → discovers task/003-redis-setup
# 3. /plan → sequences all discovered tasks
# 4. /develop task/001, /develop task/002, etc.
```

### Branch Alignment with Commands
- **Epic branches**: Align with `/design` phase output
- **Task branches**: Align with `/develop` phase execution
- **Progressive discovery**: New tasks from `/architect` or `/develop` phases

## Quick Reference

### Essential Commands
```bash
# Epic workflow
git checkout develop && git pull origin develop
git checkout -b epic/[name]
git checkout -b task/[###]-[name]

# Standard task cycle
git add . && git commit -m "feat(scope): description [EPIC:name/TASK:###]"
git push -u origin task/[###]-[name]
# Create PR via GitHub/GitLab
```

### Branch Cleanup
```bash
# After task merge to epic
git checkout epic/[name]
git pull origin epic/[name]
git branch -d task/[###]-[name]

# After epic merge to develop
git checkout develop
git pull origin develop
git branch -d epic/[name]
```

## Related Guidelines

- **[Code Review Guidelines](./code-review-guidelines.md)** - PR review processes
- **[Quality Standards](./quality-standards.md)** - Commit and code quality requirements
- **[Changelog Maintenance](./changelog-maintenance.md)** - Version history management

---

*Epic-driven Git workflows enable systematic development aligned with AI-assisted design and architecture phases.*
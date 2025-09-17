---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "project-maintainers"]
document_type: "guide"
priority: "high"
tags: ["git", "workflow", "branching", "commits", "collaboration"]
difficulty: "intermediate"
estimated_time: "30 min"
---

# Git Workflow Guidelines

**Purpose**: Standardized Git workflow, branching strategies, commit conventions, and collaboration practices for consistent and maintainable version control.

## Core Principles

### **Consistency**
- Use standardized branch naming conventions
- Follow consistent commit message formats
- Apply uniform merge and release strategies
- Maintain predictable workflow patterns

### **Traceability**
- Link commits to issues/tickets when possible
- Use descriptive commit messages
- Maintain clean, readable history
- Document AI assistance in commits

### **Collaboration**
- Clear branch ownership and responsibilities
- Structured pull/merge request process
- Code review requirements
- Conflict resolution procedures

## Branching Strategy

### **GitFlow Model (Recommended)**

```
main (production)
├── develop (integration)
│   ├── feature/AUTH-123-user-authentication
│   ├── feature/UI-456-dashboard-redesign
│   └── bugfix/BUG-789-login-validation
├── release/v1.2.0
└── hotfix/v1.1.1-critical-security-fix
```

### **Branch Types**

#### **Main Branches**
- **`main`**: Production-ready code only
- **`develop`**: Integration branch for features

#### **Supporting Branches**
- **`feature/*`**: New features and enhancements
- **`bugfix/*`**: Non-critical bug fixes
- **`hotfix/*`**: Critical production fixes
- **`release/*`**: Release preparation
- **`experimental/*`**: Proof of concepts and experiments

### **Branch Naming Conventions**

```bash
# Feature branches
feature/ISSUE-123-short-description
feature/AUTH-456-oauth-integration
feature/UI-789-mobile-responsive-design

# Bug fix branches
bugfix/BUG-123-short-description
bugfix/BUG-456-memory-leak-fix
bugfix/BUG-789-validation-error

# Hotfix branches
hotfix/v1.2.1-security-patch
hotfix/v2.0.1-critical-database-fix

# Release branches
release/v1.2.0
release/v2.0.0-beta

# Experimental branches
experimental/graphql-migration
experimental/new-architecture-poc
```

### **Branch Lifecycle**

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/AUTH-123-user-authentication

# Work on feature
git add .
git commit -m "feat(auth): implement OAuth2 authentication flow

- Add OAuth2 service provider integration
- Implement token validation middleware
- Add user session management
- Include comprehensive error handling

Resolves: AUTH-123
AI-assisted implementation

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push and create pull request
git push -u origin feature/AUTH-123-user-authentication

# After review and approval, merge via PR
# Delete feature branch after merge
git branch -d feature/AUTH-123-user-authentication
git push origin --delete feature/AUTH-123-user-authentication
```

## Commit Conventions

### **Conventional Commits Format**

```
<type>(<scope>): <subject>

<body>

<footer>
```

### **Commit Types**

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 authentication` |
| `fix` | Bug fix | `fix(api): resolve user validation error` |
| `docs` | Documentation | `docs(readme): update installation guide` |
| `style` | Code style/formatting | `style(components): fix ESLint warnings` |
| `refactor` | Code refactoring | `refactor(utils): simplify date helper functions` |
| `test` | Add/update tests | `test(auth): add OAuth2 integration tests` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies to latest` |
| `perf` | Performance improvements | `perf(api): optimize database queries` |
| `ci` | CI/CD changes | `ci(github): add automated deployment workflow` |
| `build` | Build system changes | `build(webpack): update configuration for prod` |
| `revert` | Revert previous commit | `revert: "feat(auth): add OAuth2 authentication"` |

### **Scope Guidelines**

Common scopes by domain:
- **Frontend**: `ui`, `components`, `pages`, `styles`
- **Backend**: `api`, `services`, `models`, `middleware`
- **Database**: `schema`, `migrations`, `queries`
- **DevOps**: `ci`, `deploy`, `config`, `docker`
- **Testing**: `tests`, `e2e`, `unit`, `integration`
- **Documentation**: `docs`, `readme`, `wiki`

### **Commit Message Examples**

```bash
# Feature implementation
git commit -m "feat(auth): implement JWT token authentication

- Add JWT token generation and validation
- Implement refresh token mechanism
- Add middleware for protected routes
- Include comprehensive error handling for auth failures

The implementation follows OAuth2 best practices and includes:
- Secure token storage
- Automatic token refresh
- Proper error handling and user feedback

Resolves: AUTH-123
Tested: Manual testing and automated test suite
AI-assisted implementation with security review

Co-Authored-By: Claude <noreply@anthropic.com>"

# Bug fix
git commit -m "fix(api): resolve user profile update validation

- Fix email validation regex to handle edge cases
- Resolve password update requiring current password
- Add proper error messages for validation failures

The bug was causing users to be unable to update their profiles
when their email contained certain special characters.

Fixes: BUG-456
Testing: Added unit tests for edge cases
Reviewed-by: @senior-dev"

# Documentation update
git commit -m "docs(api): update authentication endpoint documentation

- Add examples for all authentication endpoints
- Document error response formats
- Include rate limiting information
- Add troubleshooting section for common issues

Updated to reflect recent changes in the authentication flow
and provide better developer experience.

Closes: DOC-789"

# Refactoring
git commit -m "refactor(services): extract common database operations

- Create base repository class with common CRUD operations
- Update user and product services to extend base repository
- Reduce code duplication by 40%
- Maintain backward compatibility with existing APIs

This refactoring improves maintainability and reduces the risk
of inconsistent database operation implementations.

No functional changes - purely structural improvement.
All existing tests pass without modification."
```

### **AI Assistance Documentation**

When AI assists with commits:

```bash
# AI-assisted development
git commit -m "feat(dashboard): implement real-time analytics dashboard

- Add WebSocket connection for real-time data updates
- Implement responsive chart components using Chart.js
- Add filtering and date range selection
- Include error handling and loading states

AI-assisted implementation focusing on:
- Component architecture and state management
- Real-time data handling patterns
- Responsive design implementation
- Error boundary and loading state handling

Resolves: DASH-123
Tested: Manual testing and component unit tests
Code review: Verified AI suggestions align with project patterns

Co-Authored-By: Claude <noreply@anthropic.com>"

# AI code review and improvements
git commit -m "refactor(utils): optimize performance based on AI analysis

- Implement memoization for expensive calculations
- Replace inefficient array operations with Map/Set structures
- Add caching layer for frequently accessed data
- Reduce computational complexity from O(n²) to O(n log n)

AI analysis identified performance bottlenecks in:
- User data processing functions
- Search and filtering operations
- Date manipulation utilities

Performance improvements:
- 60% reduction in average processing time
- 40% reduction in memory usage
- Better scalability for large datasets

AI-assisted optimization with human validation
All optimizations verified through performance testing"
```

## Pull Request Guidelines

### **PR Title Format**

```
<type>(<scope>): <description> [<ticket-id>]

# Examples
feat(auth): implement OAuth2 authentication [AUTH-123]
fix(api): resolve user validation error [BUG-456]
docs(readme): update installation guide [DOC-789]
```

### **PR Description Template**

```markdown
## Description
Brief description of the changes and their purpose.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues
- Resolves: #123
- Related to: #456
- Closes: #789

## Changes Made
- [ ] Item 1: Description of change
- [ ] Item 2: Description of change
- [ ] Item 3: Description of change

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Browser testing (if applicable)
- [ ] Mobile testing (if applicable)

## Screenshots (if applicable)
[Add screenshots or GIFs of visual changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation made
- [ ] Changes generate no new warnings
- [ ] New and existing unit tests pass locally
- [ ] Dependent changes have been merged and published

## AI Assistance
- [ ] AI-assisted development used
- [ ] AI suggestions reviewed and validated
- [ ] Human oversight applied to AI-generated code
- [ ] Code patterns align with project standards

## Additional Notes
Any additional information, concerns, or context for reviewers.
```

### **Review Requirements**

#### **Mandatory Requirements**
- [ ] At least one approving review from code owner
- [ ] All CI/CD checks pass
- [ ] No merge conflicts
- [ ] Branch up to date with target branch

#### **Optional Requirements** (based on change type)
- [ ] Security review (for auth/security changes)
- [ ] Performance review (for performance-critical changes)
- [ ] UI/UX review (for frontend changes)
- [ ] Documentation review (for API changes)

### **Review Process**

```bash
# 1. Create pull request
gh pr create --title "feat(auth): implement OAuth2 authentication [AUTH-123]" \
             --body-file .github/pull_request_template.md

# 2. Request reviews
gh pr review --request @team-lead,@security-reviewer

# 3. Address feedback
git add .
git commit -m "fix(auth): address code review feedback

- Update error handling based on reviewer suggestions
- Add additional input validation
- Improve code documentation
- Fix potential security vulnerability

Addresses feedback from: @security-reviewer, @team-lead"

git push origin feature/AUTH-123-oauth-authentication

# 4. Merge after approval
gh pr merge --squash --delete-branch
```

## Merge Strategies

### **Strategy Selection**

| Strategy | When to Use | Pros | Cons |
|----------|-------------|------|------|
| **Merge Commit** | Feature branches, preserve context | Preserves history, shows relationships | Creates merge commits |
| **Squash and Merge** | Small features, clean history | Clean linear history | Loses intermediate commits |
| **Rebase and Merge** | Linear history preference | Clean history, no merge commits | More complex, potential conflicts |

### **Merge Commands**

```bash
# Merge commit (preserves history)
git checkout develop
git pull origin develop
git merge --no-ff feature/AUTH-123-oauth-authentication
git push origin develop

# Squash merge (clean history)
git checkout develop
git pull origin develop
git merge --squash feature/AUTH-123-oauth-authentication
git commit -m "feat(auth): implement OAuth2 authentication [AUTH-123]

Complete OAuth2 authentication implementation including:
- OAuth2 service provider integration
- Token validation middleware
- User session management
- Comprehensive error handling

Resolves: AUTH-123
AI-assisted implementation

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin develop

# Rebase merge (linear history)
git checkout feature/AUTH-123-oauth-authentication
git rebase develop
git checkout develop
git merge --ff-only feature/AUTH-123-oauth-authentication
git push origin develop
```

## Release Management

### **Semantic Versioning**

```
MAJOR.MINOR.PATCH

Examples:
- 1.0.0 (initial release)
- 1.1.0 (new feature)
- 1.1.1 (bug fix)
- 2.0.0 (breaking change)
```

### **Release Workflow**

```bash
# 1. Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. Prepare release
# - Update version numbers
# - Update CHANGELOG.md
# - Final testing and bug fixes

git add .
git commit -m "chore(release): prepare v1.2.0 release

- Update version to 1.2.0
- Update CHANGELOG.md with new features and fixes
- Final documentation updates"

# 3. Merge to main
git checkout main
git pull origin main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0

Features:
- OAuth2 authentication implementation
- Real-time dashboard with WebSocket support
- Performance optimizations for large datasets

Bug fixes:
- User profile update validation
- Memory leak in data processing
- Mobile responsive design improvements

Breaking changes:
- Updated API authentication requirements
- Changed user session storage format"

git push origin main
git push origin v1.2.0

# 4. Merge back to develop
git checkout develop
git merge --no-ff release/v1.2.0
git push origin develop

# 5. Delete release branch
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### **Hotfix Workflow**

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/v1.2.1-security-patch

# 2. Implement fix
git add .
git commit -m "fix(security): patch critical authentication vulnerability

- Fix SQL injection vulnerability in user authentication
- Add input sanitization for login parameters
- Update security headers configuration
- Add additional logging for security events

This hotfix addresses a critical security vulnerability
discovered in the authentication system.

CVE: CVE-2024-XXXX
Severity: Critical
Impact: All authenticated users

Security review completed by: @security-team
Testing: Automated security tests + manual verification"

# 3. Merge to main
git checkout main
git merge --no-ff hotfix/v1.2.1-security-patch
git tag -a v1.2.1 -m "Hotfix version 1.2.1

Critical security patch for authentication vulnerability.
All users should upgrade immediately.

CVE: CVE-2024-XXXX
Severity: Critical"

git push origin main
git push origin v1.2.1

# 4. Merge to develop
git checkout develop
git merge --no-ff hotfix/v1.2.1-security-patch
git push origin develop

# 5. Delete hotfix branch
git branch -d hotfix/v1.2.1-security-patch
git push origin --delete hotfix/v1.2.1-security-patch
```

## Git Hooks and Automation

### **Pre-commit Hooks**

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Check for merge conflict markers
if git diff --cached --check; then
    echo "✅ No merge conflict markers found"
else
    echo "❌ Merge conflict markers found. Please resolve conflicts."
    exit 1
fi

# Run linting
if command -v npm &> /dev/null && npm list --depth=0 | grep -q eslint; then
    echo "Running ESLint..."
    npm run lint --silent
    if [ $? -ne 0 ]; then
        echo "❌ ESLint failed. Please fix linting errors."
        echo "Run 'npm run lint:fix' to auto-fix some issues."
        exit 1
    fi
fi

# Check commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1" 2>/dev/null; then
    echo "❌ Invalid commit message format."
    echo "Please use: <type>(<scope>): <subject>"
    echo "Example: feat(auth): add OAuth2 authentication"
    exit 1
fi

echo "✅ Pre-commit checks passed"
```

### **Commit Message Template**

```bash
# ~/.gitmessage
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>

# Type: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
# Scope: component/module affected (optional)
# Subject: imperative, present tense, no period, max 50 chars
#
# Body: explain what and why (optional)
# - Use present tense
# - Include motivation for change
# - Contrast with previous behavior
#
# Footer: issue references, breaking changes (optional)
# - Resolves: #123
# - BREAKING CHANGE: API authentication now requires OAuth2
# - Co-Authored-By: Name <email@example.com>
```

Configure the template:
```bash
git config --global commit.template ~/.gitmessage
```

### **GitHub Actions Integration**

```yaml
# .github/workflows/pr-validation.yml
name: Pull Request Validation

on:
  pull_request:
    branches: [main, develop]

jobs:
  validate-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Validate PR title
        uses: amannn/action-semantic-pull-request@v3
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          types: |
            feat
            fix
            docs
            style
            refactor
            test
            chore
            perf
            ci
            build
            revert
          scopes: |
            auth
            api
            ui
            docs
            config
          requireScope: false
          subjectPattern: ^[A-Z].{4,49}$
          subjectPatternError: |
            The subject "{subject}" found in the pull request title "{title}"
            didn't match the configured pattern. Please ensure that the subject
            starts with an uppercase character and is between 5 and 50 characters.
```

## Troubleshooting

### **Common Issues**

#### **Merge Conflicts**
```bash
# Resolve merge conflicts
git status
# Edit conflicted files
git add .
git commit -m "resolve: merge conflicts in user authentication

- Keep new OAuth2 implementation
- Preserve existing session handling
- Update tests for merged functionality"
```

#### **Accidental Commits**
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Amend last commit
git add .
git commit --amend -m "Updated commit message"
```

#### **Wrong Branch**
```bash
# Move commits to correct branch
git log --oneline -n 5  # Find commit hashes
git checkout correct-branch
git cherry-pick <commit-hash>
git checkout wrong-branch
git reset --hard HEAD~1  # Remove from wrong branch
```

### **Best Practices**

#### **Daily Workflow**
```bash
# Start of day
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/TASK-123-new-feature

# Regular commits during development
git add .
git commit -m "feat(component): implement basic structure"
git push -u origin feature/TASK-123-new-feature

# End of day or feature completion
git push origin feature/TASK-123-new-feature
# Create pull request via GitHub/GitLab UI or CLI
```

#### **Collaboration Tips**
- Pull latest changes before starting work
- Push work-in-progress branches for backup
- Use draft PRs for early feedback
- Communicate about shared branches
- Rebase feature branches regularly to stay current

## AI Collaboration in Git Workflow

### **AI-Assisted Commit Messages**
When using AI for commit message generation:

```bash
# AI-generated commit with human validation
git commit -m "feat(api): implement rate limiting middleware

- Add configurable rate limiting based on user tier
- Implement sliding window algorithm for accurate limiting
- Add Redis backend for distributed rate limiting
- Include bypass mechanisms for admin users

AI-assisted implementation with the following considerations:
- Performance impact analysis and optimization
- Security implications review and validation
- Error handling and user feedback mechanisms
- Integration with existing authentication system

The rate limiting system uses industry-standard algorithms
and has been validated against security best practices.

Resolves: API-456
Performance tested: 10,000 requests/minute sustained
Security reviewed: @security-team

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### **AI Code Review Integration**
```bash
# Document AI review assistance
git commit -m "refactor(auth): improve error handling based on AI analysis

- Standardize error response formats across all auth endpoints
- Add contextual error messages for better user experience
- Implement proper HTTP status codes for different error types
- Add error logging with appropriate detail levels

Changes made following AI-assisted code review that identified:
- Inconsistent error handling patterns
- Missing error context information
- Suboptimal HTTP status code usage
- Inadequate error logging for debugging

AI suggestions validated through:
- Manual testing of error scenarios
- Security review of error information disclosure
- Performance impact assessment
- Integration testing with client applications

Human validation confirms all suggestions align with project standards
and security requirements."
```

## Related Guidelines

- **[Code Review Guidelines](./code-review-guidelines.md)** - Detailed review processes and checklists
- **[Quality Standards](./quality-standards.md)** - Quality requirements for commits and PRs
- **[Changelog Maintenance](./changelog-maintenance.md)** - Managing version history and releases
- **[Security Guidelines](./security-guidelines.md)** - Security considerations in version control

---

*Consistent Git workflows enable effective collaboration between team members and AI assistants while maintaining code quality and project history.*
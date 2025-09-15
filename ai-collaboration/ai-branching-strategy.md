---
title: "AI Branching Strategy"
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-08-22"
status: "Active"
target_audience: ["Developers", "AI Assistants"]
tags: ["ai-collaboration", "git-workflow", "branching-strategy", "development-workflows"]
category: "AI Collaboration"
description: "A comprehensive guide for implementing effective Git branching strategies when working with AI coding assistants."
---

# AI Branching Strategy

A comprehensive guide for implementing effective Git branching strategies when working with AI coding assistants.

## Table of Contents

- [Overview](#overview)
- [Core Branching Model](#core-branching-model)
- [AI-Specific Guidelines](#ai-specific-guidelines)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Workflow Examples](#workflow-examples)
- [Safety Protocols](#safety-protocols)
- [Best Practices](#best-practices)
- [Common Scenarios](#common-scenarios)
- [Troubleshooting](#troubleshooting)

## Overview

This branching strategy is specifically designed for AI-assisted development workflows, emphasizing safety, clear communication between human developers and AI assistants, and maintainable code progression.

### Key Principles

- **Safety First**: Protect production and main branches from accidental AI modifications
- **Clear Intent**: Branch names and structure communicate purpose to both humans and AI
- **Atomic Changes**: Each branch represents a single, focused unit of work
- **Reviewable Progress**: Changes are structured for effective human review
- **AI Transparency**: Clear guidelines for when AI can act autonomously vs. requiring approval

## Core Branching Model

### Branch Hierarchy

```text
main (production)
├── develop (integration)
├── feature/[issue-id]-[description]
├── bugfix/[issue-id]-[description]
├── hotfix/[issue-id]-[description]
└── experiment/[description]
```

### Branch Types and Purposes

#### `main` Branch

- **Purpose**: Production-ready code
- **Protection Level**: Maximum
- **AI Permissions**: Read-only (NO direct commits, merges, or modifications)
- **Merge Requirements**: Pull request with human approval + all checks passing
- **Environment**: Production deployment source

#### `develop` Branch

- **Purpose**: Integration branch for ongoing development
- **Protection Level**: High
- **AI Permissions**: Read-only (NO direct commits or merges)
- **Merge Requirements**: Pull request with human approval + tests passing
- **Environment**: Staging/development deployment

#### `feature/` Branches

- **Purpose**: New feature development
- **Protection Level**: Medium
- **AI Permissions**: Create, commit, push (with explicit approval)
- **Merge Target**: `develop`
- **Naming**: `feature/[issue-id]-[short-description]`

#### `bugfix/` Branches

- **Purpose**: Bug fixes for existing features
- **Protection Level**: Medium  
- **AI Permissions**: Create, commit, push (with explicit approval)
- **Merge Target**: `develop`
- **Naming**: `bugfix/[issue-id]-[short-description]`

#### `hotfix/` Branches

- **Purpose**: Critical fixes that need immediate production deployment
- **Protection Level**: High
- **AI Permissions**: Create only (all commits require explicit human approval)
- **Merge Target**: Both `main` and `develop`
- **Naming**: `hotfix/[issue-id]-[short-description]`

#### `experiment/` Branches

- **Purpose**: Exploratory work, prototypes, and proof-of-concepts
- **Protection Level**: Low
- **AI Permissions**: Full autonomy (create, commit, push, delete)
- **Merge Target**: Usually deleted after evaluation
- **Naming**: `experiment/[description]`

## AI-Specific Guidelines

### AI Autonomy Matrix

| Action | `main` | `develop` | `feature/bugfix` | `experiment` |
|--------|--------|-----------|------------------|--------------|
| **Read/Analyze** | ✅ Always | ✅ Always | ✅ Always | ✅ Always |
| **Create Branch** | ❌ Never | ❌ Never | ⚠️ With Approval | ✅ Autonomous |
| **Commit Changes** | ❌ Never | ❌ Never | ⚠️ Show First | ✅ Autonomous |
| **Push Changes** | ❌ Never | ❌ Never | ⚠️ With Approval | ✅ Autonomous |
| **Merge/PR** | ❌ Never | ❌ Never | ⚠️ With Approval | ✅ Autonomous |
| **Delete Branch** | ❌ Never | ❌ Never | ⚠️ With Approval | ✅ Autonomous |

### Communication Protocols

#### Before Branch Creation

AI should ask: "Should I create a new `[branch-type]/[proposed-name]` branch for this work?"

#### Before Committing

AI should show: "Ready to commit these changes to `[branch-name]`:" followed by a summary of modifications.

#### Before Merging

AI should request: "This feature appears complete. Should I create a pull request to merge `[source]` into `[target]`?"

## Branch Naming Conventions

### Format Standards

```bash
# Feature development
feature/PROJ-123-user-authentication
feature/PROJ-456-payment-integration

# Bug fixes
bugfix/PROJ-789-login-error-handling
bugfix/PROJ-101-memory-leak-fix

# Critical hotfixes
hotfix/PROJ-999-security-vulnerability
hotfix/PROJ-202-production-crash

# Experimental work
experiment/graphql-performance-testing
experiment/new-ui-framework-evaluation
```

### Naming Rules

1. **Use lowercase with hyphens** (kebab-case)
2. **Include issue/ticket ID** when available
3. **Keep descriptions concise** but descriptive
4. **Avoid special characters** except hyphens
5. **Maximum 50 characters** for readability

## Workflow Examples

### Example 1: New Feature Development

```bash
# Human initiates
Human: "I need to implement user registration feature for ticket PROJ-123"

# AI responds
AI: "Should I create a new feature/PROJ-123-user-registration branch for this work?"

# Human approves
Human: "Yes, create the branch"

# AI creates and works
git checkout develop
git pull origin develop
git checkout -b feature/PROJ-123-user-registration

# AI develops with periodic check-ins
AI: "I've implemented the registration form. Ready to commit these changes:
- Added RegistrationForm component
- Added form validation logic
- Added unit tests
Should I commit these changes?"

# Human reviews and approves
Human: "Looks good, commit it"

# AI completes
git add .
git commit -m "feat: implement user registration form with validation

- Add RegistrationForm React component
- Add client-side validation for email, password
- Add comprehensive unit tests
- Ensure accessibility compliance

Resolves: PROJ-123"
```

### Example 2: Bug Fix Workflow

```bash
# Issue reported
Human: "There's a login bug in ticket PROJ-456, users can't reset passwords"

# AI creates fix branch
AI: "Should I create bugfix/PROJ-456-password-reset-fix to address this?"

# Development and testing
AI: "Found the issue in the password reset email service. Here's my fix:
[shows code changes]
All tests passing. Should I commit this fix?"

# Completion
git commit -m "fix: resolve password reset email delivery issue

- Fix SMTP configuration for password reset emails
- Add retry logic for failed email delivery
- Update email template with correct reset links
- Add integration tests for email service

Fixes: PROJ-456"
```

## Safety Protocols

### Pre-Merge Checklist

Before any merge, ensure:

- [ ] All tests pass
- [ ] Code follows project style guidelines
- [ ] Documentation is updated
- [ ] No sensitive data is committed
- [ ] Branch is up-to-date with target branch
- [ ] Human has reviewed changes

### Emergency Procedures

#### Accidental Commit to Protected Branch

```bash
# If AI accidentally commits to main/develop
git reset --hard HEAD~1  # Remove the commit
git push --force-with-lease  # Update remote (with caution)
```

#### Merge Conflicts
```bash
# AI should always ask for help with conflicts
AI: "I encountered merge conflicts in these files:
- src/auth/login.js
- tests/auth.test.js
Should I resolve them or would you prefer to handle this manually?"
```

## Best Practices

### For AI Assistants

1. **Always verify branch status** before making changes
2. **Ask before creating branches** unless in experiment mode
3. **Show changes before committing** on protected workflows
4. **Use descriptive commit messages** following conventional commits
5. **Keep commits atomic** - one logical change per commit
6. **Run tests before committing** whenever possible

### For Human Developers

1. **Set clear expectations** about what AI can do autonomously
2. **Review AI-generated commits** before they're pushed
3. **Use branch protection rules** in your Git hosting platform
4. **Communicate context clearly** when assigning tasks to AI
5. **Maintain CI/CD pipelines** that catch issues early

### Commit Message Standards

Follow conventional commits format:

```bash
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples
```bash
feat(auth): implement OAuth2 integration with Google

fix(api): resolve timeout issues in user service
- Increase default timeout to 30 seconds
- Add retry logic for transient failures
- Improve error handling and logging

docs: update API documentation for v2.0 endpoints

test: add comprehensive integration tests for payment flow
```

## Common Scenarios

### Scenario 1: AI Working Independently on Experiments

```bash
# AI can work freely in experiment branches
git checkout -b experiment/performance-optimization
# ... make changes ...
git add .
git commit -m "experiment: test caching strategies for API responses"
git push origin experiment/performance-optimization
```

### Scenario 2: Collaborative Feature Development

```bash
# Human starts, AI continues
Human: git checkout -b feature/PROJ-789-dashboard-redesign
Human: # Creates initial component structure
AI: "I can see you've started the dashboard component. Should I implement the data fetching logic?"
# ... AI continues development with human oversight ...
```

### Scenario 3: Cross-Branch Bug Investigation

```bash
# AI analyzes across branches
AI: "I found similar issues in these branches:
- feature/PROJ-123-user-auth (line 45 in auth.js)
- bugfix/PROJ-456-login-fix (line 12 in validator.js)
Should I create a shared utility to fix this pattern across all branches?"
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: AI Created Wrong Branch Type
**Solution**: 
```bash
# Rename the branch
git branch -m old-branch-name new-branch-name
git push origin -u new-branch-name
git push origin --delete old-branch-name
```

#### Issue: Changes Committed to Wrong Branch
**Solution**:
```bash
# Move commits to correct branch
git checkout correct-branch
git cherry-pick <commit-hash>
git checkout wrong-branch
git reset --hard HEAD~1
```

#### Issue: Merge Conflicts in AI-Generated Code
**Best Practice**: Always involve human developers in conflict resolution, as AI may not have full context about the intended behavior.

#### Issue: AI Pushing to Protected Branch
**Prevention**: Configure branch protection rules in your Git hosting platform to prevent direct pushes to `main` and `develop`.

### Branch Cleanup

#### Regular Maintenance
```bash
# Delete merged feature branches
git branch --merged develop | grep -v "develop\|main" | xargs -n 1 git branch -d

# Clean up remote tracking branches
git remote prune origin
```

#### Stale Branch Management
- Review branches older than 30 days
- Archive or delete unused experiment branches
- Ensure feature branches are either merged or actively developed

## Integration with AI Tools

### Configuration Examples

#### GitHub Branch Protection
```yaml
# .github/branch-protection.yml
protection_rules:
  main:
    required_status_checks:
      strict: true
      contexts: ["continuous-integration"]
    enforce_admins: true
    required_pull_request_reviews:
      required_approving_review_count: 2
    restrictions:
      users: []
      teams: ["core-developers"]
```

#### Git Hooks for AI Safety
```bash
#!/bin/sh
# .git/hooks/pre-commit
# Prevent commits to protected branches by AI

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" == "main" || "$BRANCH" == "develop" ]]; then
    echo "❌ Direct commits to $BRANCH are not allowed"
    echo "Please create a feature branch for your changes"
    exit 1
fi
```

This branching strategy provides a safe, structured approach to AI-assisted development while maintaining code quality and preventing accidental modifications to critical branches.

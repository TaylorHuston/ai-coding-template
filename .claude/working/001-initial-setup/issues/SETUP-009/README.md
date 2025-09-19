# SETUP-009: Development Processes Implementation

## Quick Start

1. Initialize development processes:
   ```bash
   npm run processes:setup
   ```

2. Create first changelog entry:
   ```bash
   npm run changelog:add
   ```

## Implementation

### Branching Strategy

Create `.github/BRANCHING.md`:
```markdown
# Git Branching Strategy

## Branch Types

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Production hotfixes
- `release/*` - Release preparation branches

## Workflow

1. Create feature branch from `develop`
2. Develop feature
3. Create PR to `develop`
4. Merge after review
5. Deploy `develop` to staging
6. Create release branch for production
7. Deploy release branch to production
8. Merge release to `main` and `develop`
```

### CHANGELOG Automation

Install conventional changelog:
```bash
npm install --save-dev conventional-changelog-cli standard-version
```

Create `scripts/changelog.sh`:
```bash
#!/bin/bash
set -e

# Generate changelog
npx conventional-changelog -p angular -i CHANGELOG.md -s

# Add unreleased section if not exists
if ! grep -q "## \[Unreleased\]" CHANGELOG.md; then
  sed -i '1s/^/# Changelog\n\n## [Unreleased]\n\n/' CHANGELOG.md
fi

echo "Changelog updated successfully!"
```

Create initial `CHANGELOG.md`:
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Development environment configuration
- Testing framework setup
- CI/CD pipeline configuration

### Changed

### Deprecated

### Removed

### Fixed

### Security
```

### Release Versioning

Create `.versionrc.json`:
```json
{
  "types": [
    {"type": "feat", "section": "Features"},
    {"type": "fix", "section": "Bug Fixes"},
    {"type": "chore", "hidden": true},
    {"type": "docs", "section": "Documentation"},
    {"type": "style", "hidden": true},
    {"type": "refactor", "section": "Code Refactoring"},
    {"type": "perf", "section": "Performance Improvements"},
    {"type": "test", "hidden": true}
  ],
  "commitUrlFormat": "https://github.com/your-username/your-project/commit/{{hash}}",
  "compareUrlFormat": "https://github.com/your-username/your-project/compare/{{previousTag}}...{{currentTag}}"
}
```

Create `scripts/release.sh`:
```bash
#!/bin/bash
set -e

RELEASE_TYPE=${1:-patch}

echo "Creating $RELEASE_TYPE release..."

# Run tests
npm run test:ci

# Update version and changelog
npx standard-version --release-as $RELEASE_TYPE

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")

echo "Release v$NEW_VERSION created successfully!"
echo "Don't forget to: git push --follow-tags origin main"
```

### Team Workflows

Create `.github/PULL_REQUEST_TEMPLATE.md`:
```markdown
# Pull Request

## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for changes
- [ ] Manual testing completed

## Checklist
- [ ] Self-review completed
- [ ] Code follows style guidelines
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes or documented appropriately
```

Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

## Additional Context
Add any other context about the problem here.
```

### Code Review Guidelines

Create `.github/CODE_REVIEW.md`:
```markdown
# Code Review Guidelines

## For Authors

- Keep PRs small and focused
- Write clear PR descriptions
- Self-review before requesting review
- Respond promptly to feedback
- Update PR based on feedback

## For Reviewers

- Be constructive and respectful
- Focus on code quality, not style (linting handles that)
- Check for:
  - Functionality correctness
  - Test coverage
  - Security concerns
  - Performance implications
  - Documentation updates

## Review Process

1. Automated checks must pass
2. At least one approval required
3. No unresolved conversations
4. Up-to-date with base branch
```

### Package Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "changelog:add": "./scripts/changelog.sh",
    "release:patch": "./scripts/release.sh patch",
    "release:minor": "./scripts/release.sh minor",
    "release:major": "./scripts/release.sh major",
    "version": "npm run changelog:add && git add CHANGELOG.md"
  }
}
```

## Testing

### Verify Processes

```bash
# Test changelog generation
npm run changelog:add

# Test release process (dry run)
npx standard-version --dry-run

# Check commit message format
git log --oneline -5

# Verify branch protection rules
gh api repos/{owner}/{repo}/branches/main/protection
```

## Troubleshooting

### Changelog Issues

```bash
# Reset changelog
git checkout -- CHANGELOG.md

# Regenerate from scratch
rm CHANGELOG.md && npm run changelog:add
```

### Release Issues

```bash
# Fix version conflicts
npm version --no-git-tag-version patch

# Manual tag creation
git tag v1.0.0
git push origin v1.0.0
```

### Branch Issues

```bash
# Fix branch tracking
git branch --set-upstream-to=origin/main main

# Clean up merged branches
git branch --merged | grep -v main | xargs git branch -d
```
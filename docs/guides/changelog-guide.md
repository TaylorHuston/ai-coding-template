# Changelog Guide

**Version**: 1.0.0  
**Created**: 2025-08-22  
**Last Updated**: 2025-08-22  
**Status**: Active  
**Target Audience**: Developers, AI Assistants  

## Overview

This guide explains how to maintain the project changelog, which documents all notable changes to help developers and AI assistants understand the project's evolution.

## Why Keep a Changelog?

- **Context for AI**: Helps AI assistants understand recent changes and project history
- **Developer Onboarding**: New developers can quickly see what's been added/changed
- **Release Management**: Clear record of what goes into each release
- **User Communication**: Basis for release notes and announcements

## Changelog Format

We follow the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) standard with these categories:

- **Added**: New features or capabilities
- **Changed**: Changes in existing functionality
- **Deprecated**: Features that will be removed in future versions
- **Removed**: Features that have been removed
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

## When to Update the Changelog

### Always Update For:
- Completing an issue (Added/Changed)
- Fixing a bug (Fixed)
- Completing a task that affects users (varies by type)
- Making breaking changes (mark as **BREAKING**)
- Security fixes (Security)

### Don't Update For:
- Internal refactoring with no user impact
- Documentation updates (unless significant)
- Development tooling changes
- Test additions (unless adding new test frameworks)

## How to Write Good Changelog Entries

### Do's ✅
```markdown
### Added
- [ISSUE-001] User authentication with email/password support
- [ISSUE-002] Password reset functionality via email
- [TASK-001] API rate limiting to prevent abuse
```

### Don'ts ❌
```markdown
### Added
- Updated code (too vague)
- Fixed stuff (not descriptive)
- [ISSUE-001] (missing description)
```

## Workflow Integration

### 1. During Development

When working on an issue/bug/task:
1. Check the "Changelog Entry" section in the template
2. Fill in the type and description
3. Note if it's a breaking change

### 2. When Completing Work

Before marking work as done:
1. Open `/CHANGELOG.md`
2. Add entry to the `[Unreleased]` section
3. Use the format: `- [KEY] Description`
4. Group under the appropriate category

### 3. Example Workflow

```bash
# Complete a bug fix
1. Fix the bug (BUG-001)
2. Update BUG-001-plan.md with changelog entry
3. Add to CHANGELOG.md:
   ### Fixed
   - [BUG-001] Fixed login failure when password contains special characters
```

## Breaking Changes

For breaking changes:
1. Mark prominently with **BREAKING**
2. Include migration instructions
3. Consider if it should wait for a major version

Example:
```markdown
### Changed
- **BREAKING**: [ISSUE-010] Changed authentication API response format
  - Migration: Update client code to handle new `user` object structure
  - Old format: `{ id, name }`, New format: `{ user: { id, name } }`
```

## Release Process

When preparing a release:

1. **Choose Version Number** (following Semantic Versioning):
   - MAJOR (x.0.0): Breaking changes
   - MINOR (0.x.0): New features, backward compatible
   - PATCH (0.0.x): Bug fixes only

2. **Update Changelog**:
   ```markdown
   ## [Unreleased]
   (move everything to...)
   
   ## [1.2.0] - 2025-08-22
   ```

3. **Generate Release Notes**: Use changelog entries as basis

## AI Assistant Instructions

When AI assistants complete work:

1. **Check Template**: Look for "Changelog Entry" section
2. **Determine Impact**: Is this user-facing? Breaking?
3. **Write Entry**: Clear, concise, with issue/bug/task number
4. **Update Changelog**: Add to appropriate section in `[Unreleased]`
5. **Verify**: Entry is under correct category

### AI Checklist
```markdown
- [ ] Does this change affect users?
- [ ] Is it a breaking change?
- [ ] Have I identified the correct category?
- [ ] Is the description clear and concise?
- [ ] Have I included the issue/bug/task number?
- [ ] Have I updated CHANGELOG.md?
```

## Examples by Type

### Feature Issue
```markdown
### Added
- [ISSUE-001] User dashboard with customizable widgets
```

### Bug Fix
```markdown
### Fixed
- [BUG-001] Fixed data loss when saving drafts with special characters
```

### Enhancement Task
```markdown
### Changed
- [TASK-001] Improved API response time by 40% through query optimization
```

### Security Fix
```markdown
### Security
- [BUG-002] Fixed XSS vulnerability in comment system
```

### Deprecation
```markdown
### Deprecated
- [TASK-005] Legacy /api/v1/* endpoints (will be removed in v2.0.0)
```

## Common Patterns

### Multiple Related Changes
Group related changes together:
```markdown
### Added
- [ISSUE-001] Complete user management system
  - User registration and login
  - Password reset functionality
  - Profile management
  - Admin user interface
```

### Dependency Updates
Only include if they affect users:
```markdown
### Security
- [TASK-010] Updated dependencies to fix known vulnerabilities
```

### Documentation
Only include major documentation additions:
```markdown
### Added
- [TASK-015] Comprehensive API documentation with examples
```

## Tools and Automation

### Manual Process (Recommended)
- Edit `CHANGELOG.md` directly
- Ensures human-readable entries
- Allows for proper categorization

### Semi-Automated (Optional)
- Use `scripts/docs-changelog.js` to scan completed work
- Review and edit generated entries
- Maintain quality and readability

## Quick Reference

| Work Type | Usual Category | Example |
|-----------|---------------|---------|
| New Feature | Added | `[ISSUE-X] Payment processing` |
| Bug Fix | Fixed | `[BUG-X] Fixed memory leak` |
| Enhancement | Changed | `[TASK-X] Improved performance` |
| Removal | Removed | `[TASK-X] Removed deprecated API` |
| Security | Security | `[BUG-X] Fixed SQL injection` |

## Related Documentation

- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
- [Semantic Versioning](https://semver.org/)
- [Deliverables Guide](../deliverables/README.md)
- [Project Changelog](/CHANGELOG.md)

---

**Remember**: The changelog is for humans. Write clear, concise entries that explain what changed and why it matters to users.
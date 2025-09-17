---
version: "0.1.1"
created: "2025-08-23"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "project-maintainers"]
document_type: "guide"
tags: ["changelog", "maintenance", "documentation", "workflow", "automation"]
difficulty: "intermediate"
estimated_time: "20 min"
---

# Changelog Maintenance Guide

## Overview

This guide provides comprehensive instructions for maintaining the project CHANGELOG effectively and consistently, with special focus on AI-assisted development workflows.

## Quick Start

### Essential Commands

```bash
# Check for missing entries
./scripts/ai-changelog-audit.sh

# Analyze recent commits
./scripts/ai-update-changelog.sh analyze

# Add entry interactively
./scripts/ai-update-changelog.sh add

# Generate entry from commit
./scripts/ai-update-changelog.sh from-commit HEAD

# Create release
./scripts/release.sh X.Y.Z
```

### Initial Setup

1. **Copy the CHANGELOG template:**
```bash
cp templates/CHANGELOG.template.md CHANGELOG.md
```

2. **Make scripts executable:**
```bash
chmod +x scripts/check-changelog.sh scripts/ai-update-changelog.sh scripts/ai-changelog-audit.sh scripts/release.sh
```

3. **Configure git hooks (optional):**
```bash
cp scripts/check-changelog.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## System Components

### CHANGELOG Structure

```markdown
# Changelog

## [Unreleased]

### Added
- New features

### Changed
- Changes in existing functionality

### Fixed
- Bug fixes

### Security
- Security patches

### Deprecated
- Features marked for removal

### Removed
- Deleted features

## [0.1.0] - 2025-08-23

### Added
- Initial release features
```

### Entry Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Added** | New features | `- [ISSUE-001] User authentication system` |
| **Changed** | Modifications | `- [ISSUE-002] Refactored database pooling` |
| **Fixed** | Bug fixes | `- [BUG-005] Fixed memory leak in worker` |
| **Security** | Security fixes | `- [SEC-001] Patched XSS vulnerability` |
| **Deprecated** | Marked for removal | `- [TASK-003] Deprecated legacy endpoints` |
| **Removed** | Deleted features | `- [ISSUE-004] Removed unused dependencies` |

### Entry Format

```markdown
# Basic format
- [REFERENCE] Description of change

# Breaking change
- **BREAKING**: [REFERENCE] Description of breaking change
  - Migration: Steps to update existing code

# AI-assisted development
- [ISSUE-001] Implemented OAuth2 authentication (AI-assisted)

# Multiple related changes
- [ISSUE-002] Redesigned user dashboard
  - Added real-time analytics widget
  - Improved mobile responsiveness
  - Fixed chart rendering issues
```

## AI Assistant Guidelines

### When to Update CHANGELOG

**Always update for:**
- ✅ New features (Added)
- ✅ Bug fixes (Fixed)
- ✅ Breaking changes (**BREAKING**)
- ✅ Security fixes (Security)
- ✅ User-facing changes
- ✅ API modifications
- ✅ Deprecations

**Skip updates for:**
- ❌ Internal refactoring (no user impact)
- ❌ Documentation-only changes
- ❌ Development tool updates
- ❌ Test additions (unless new framework)

### AI Attribution

When AI assists with changes:

```markdown
### Added
- [ISSUE-001] Implemented real-time collaboration features (AI-assisted)
  - WebSocket-based synchronization
  - Conflict resolution algorithm
  - Presence indicators
```

### Session Completion Protocol

AI assistants MUST:

1. Update `STATUS.md` with progress
2. Update issue/bug/task PLAN files
3. **Update CHANGELOG.md with completed work**
4. Document decisions made
5. Prepare session handoff context

## Tools and Scripts

### 1. ai-changelog-audit.sh

Comprehensive analysis of changelog completeness:

```bash
# Basic audit
./scripts/ai-changelog-audit.sh

# Verbose mode with details
./scripts/ai-changelog-audit.sh --verbose

# Generate AI action report
./scripts/ai-changelog-audit.sh --report

# Analyze specific period
./scripts/ai-changelog-audit.sh --since "7 days ago"
```

### 2. ai-update-changelog.sh

Help adding proper changelog entries:

```bash
# Analyze and suggest entries
./scripts/ai-update-changelog.sh analyze

# Add entry with parameters
./scripts/ai-update-changelog.sh add \
  --category Added \
  --reference ISSUE-001 \
  --message "User authentication system" \
  --breaking

# Extract from deliverable file
./scripts/ai-update-changelog.sh from-issue \
  deliverables/auth/issues/001/ISSUE-001-plan.md
```

### 3. check-changelog.sh

Pre-commit hook that monitors commits:

```bash
# Run manually to check
./scripts/check-changelog.sh

# Automatically runs on git commit
# Provides suggestions based on staged changes
```

### 4. release.sh

Automates the release process:

```bash
# Preview release
./scripts/release.sh 0.2.0 --dry-run

# Create release
./scripts/release.sh 0.2.0

# Create local release without pushing
./scripts/release.sh 0.2.0 --no-push
```

## Workflows

### Daily Development

1. Make code changes
2. Stage files: `git add .`
3. Commit: `git commit -m "feat: add user profile page"`
4. Git hook checks for changelog update
5. If missing, update CHANGELOG.md
6. Stage changelog: `git add CHANGELOG.md`
7. Amend commit: `git commit --amend`
8. Push changes

### Feature Implementation

```bash
# 1. Implement feature
# ... code changes ...

# 2. Add changelog entry
./scripts/ai-update-changelog.sh add \
  --category Added \
  --reference ISSUE-123 \
  --message "Real-time notifications system"

# 3. Commit with AI attribution
git add -A
git commit -m "feat(notifications): add real-time system (AI-assisted)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Session Completion

```bash
# 1. Run comprehensive audit
./scripts/ai-changelog-audit.sh --verbose

# 2. Update any missing entries
./scripts/ai-update-changelog.sh analyze

# 3. Generate session report
./scripts/ai-changelog-audit.sh --report
```

### Release Process

```bash
# 1. Final audit
./scripts/ai-changelog-audit.sh

# 2. Review unreleased section
grep -A 50 "\[Unreleased\]" CHANGELOG.md

# 3. Create release
./scripts/release.sh 0.2.0 --dry-run  # Preview
./scripts/release.sh 0.2.0            # Execute
```

## Best Practices

### Writing Good Entries

**DO:**
- Write in present tense for unreleased, past tense for releases
- Start with a verb (Added, Fixed, Changed, etc.)
- Include issue/bug/task references
- Be specific but concise
- Focus on user impact
- Group related changes

**DON'T:**
- Include internal refactoring without user impact
- Write vague descriptions like "Various fixes"
- Duplicate commit message information
- Mix different types of changes in one entry

### Breaking Changes

Always clearly mark breaking changes:

```markdown
### Changed
- **BREAKING**: [ISSUE-045] Renamed API endpoint from /user to /users
  - Migration: Update all API calls from `/api/v1/user` to `/api/v1/users`
  - Affected methods: GET, POST, PUT, DELETE
  - Old endpoint will be removed in v2.0.0
```

### Reference Conventions

```markdown
ISSUE-XXX  - Feature implementations
BUG-XXX    - Bug fixes
TASK-XXX   - Technical tasks
SEC-XXX    - Security changes
PERF-XXX   - Performance improvements
DOC-XXX    - Documentation updates (if user-facing)
```

## Integration Features

### Git Hook Integration

```json
// .githooks.json
{
  "pre-commit": {
    "changelog-reminder": {
      "enabled": true,
      "script": "scripts/check-changelog.sh",
      "warning-only": true,
      "ai-assistant-mode": true
    }
  }
}
```

### Deliverables Integration

Extract entries from issue templates:

```bash
# Extract from any deliverable file
./scripts/ai-update-changelog.sh from-issue PATH_TO_PLAN

# Batch process all deliverables
for file in deliverables/*/issues/*/ISSUE-*-plan.md; do
  ./scripts/ai-update-changelog.sh from-issue "$file"
done
```

## Troubleshooting

### Common Issues

**Changelog entry not detected by audit:**
- Solution: Ensure reference format matches (e.g., [ISSUE-001])

**Git hook not triggering:**
- Solution: Check script permissions and `.githooks.json` configuration

**Version already exists:**
- Solution: Check existing versions and use next available number

**No unreleased changes:**
- Solution: Add entries with `./scripts/ai-update-changelog.sh analyze`

### Debug Commands

```bash
# Check changelog references
grep -oE "(ISSUE|BUG|TASK)-[0-9]+" CHANGELOG.md | sort -u

# Verify git hook setup
cat .githooks.json | grep changelog

# Test changelog checker
./scripts/check-changelog.sh

# Run verbose audit
./scripts/ai-changelog-audit.sh --verbose
```

## Quick Reference

| Task | Command |
|------|---------|
| Audit status | `./scripts/ai-changelog-audit.sh` |
| Analyze commits | `./scripts/ai-update-changelog.sh analyze` |
| Add entry | `./scripts/ai-update-changelog.sh add` |
| From commit | `./scripts/ai-update-changelog.sh from-commit HEAD` |
| From issue | `./scripts/ai-update-changelog.sh from-issue FILE` |
| Check before commit | `./scripts/check-changelog.sh` |
| Create release | `./scripts/release.sh X.Y.Z` |

### Categories Quick Reference

- **Added**: New features (`feat`, `add`, `new`)
- **Changed**: Modifications (`update`, `change`, `refactor`)
- **Deprecated**: Marked for removal (`deprecate`)
- **Removed**: Deletions (`remove`, `delete`)
- **Fixed**: Bug fixes (`fix`, `bug`, `resolve`)
- **Security**: Security fixes (`security`, `CVE`)

### Entry Templates

```markdown
# Standard entry
- [ISSUE-XXX] Description of change

# Breaking change
- **BREAKING**: [ISSUE-XXX] Description
  - Migration: How to update

# AI-assisted
- [ISSUE-XXX] Description (AI-assisted)

# Multiple items
- [ISSUE-XXX] Main description
  - Sub-item 1
  - Sub-item 2
```

---

*A well-maintained CHANGELOG is essential for project transparency and helps both humans and AI assistants understand the project's evolution.*
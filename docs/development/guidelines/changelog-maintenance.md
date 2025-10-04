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
./.claude/resources/scripts/ai-changelog-audit.sh

# Analyze recent commits
./.claude/resources/scripts/ai-update-changelog.sh analyze

# Add entry interactively
./.claude/resources/scripts/ai-update-changelog.sh add

# Generate entry from commit
./.claude/resources/scripts/ai-update-changelog.sh from-commit HEAD

# Create release
./.claude/resources/scripts/release.sh X.Y.Z
```

**Initial Setup**: Copy template (`cp .claude/resources/templates/CHANGELOG.template.md CHANGELOG.md`) and make scripts executable (`chmod +x .claude/resources/scripts/*.sh`)

3. **Configure git hooks (optional):**
```bash
cp .claude/resources/scripts/check-changelog.sh .git/hooks/pre-commit
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

**Added**: New features · **Changed**: Modifications · **Fixed**: Bug fixes · **Security**: Security fixes · **Deprecated**: Marked for removal · **Removed**: Deleted features

**Format**: `- [REFERENCE] Description of change`

**Special Formats**:
- **Breaking**: `- **BREAKING**: [REFERENCE] Description (with migration steps)`
- **AI-assisted**: `- [REFERENCE] Description (AI-assisted)`
- **Multiple related**: Use sub-bullets for related changes

## AI Assistant Guidelines

### When to Update CHANGELOG

**Always update**: New features, bug fixes, breaking changes, security fixes, user-facing changes, API modifications, deprecations
**Skip updates**: Internal refactoring (no user impact), documentation-only changes, development tool updates, test additions

### AI Attribution and Session Protocol

**AI Attribution**: Use `(AI-assisted)` suffix for AI-contributed changes

**Session Completion** - AI assistants MUST:
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
./.claude/resources/scripts/ai-changelog-audit.sh

# Verbose mode with details
./.claude/resources/scripts/ai-changelog-audit.sh --verbose

# Generate AI action report
./.claude/resources/scripts/ai-changelog-audit.sh --report

# Analyze specific period
./.claude/resources/scripts/ai-changelog-audit.sh --since "7 days ago"
```

### 2. ai-update-changelog.sh

Help adding proper changelog entries:

```bash
# Analyze and suggest entries
./.claude/resources/scripts/ai-update-changelog.sh analyze

# Add entry with parameters
./.claude/resources/scripts/ai-update-changelog.sh add \
  --category Added \
  --reference ISSUE-001 \
  --message "User authentication system" \
  --breaking

# Extract from deliverable file
./.claude/resources/scripts/ai-update-changelog.sh from-issue \
  deliverables/auth/issues/001/ISSUE-001-plan.md
```

### 3. check-changelog.sh

Pre-commit hook that monitors commits:

```bash
# Run manually to check
./.claude/resources/scripts/check-changelog.sh

# Automatically runs on git commit
# Provides suggestions based on staged changes
```

### 4. release.sh

Automates the release process:

```bash
# Preview release
./.claude/resources/scripts/release.sh 0.2.0 --dry-run

# Create release
./.claude/resources/scripts/release.sh 0.2.0

# Create local release without pushing
./.claude/resources/scripts/release.sh 0.2.0 --no-push
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
./.claude/resources/scripts/ai-update-changelog.sh add \
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
./.claude/resources/scripts/ai-changelog-audit.sh --verbose

# 2. Update any missing entries
./.claude/resources/scripts/ai-update-changelog.sh analyze

# 3. Generate session report
./.claude/resources/scripts/ai-changelog-audit.sh --report
```

### Release Process

```bash
# 1. Final audit
./.claude/resources/scripts/ai-changelog-audit.sh

# 2. Review unreleased section
grep -A 50 "\[Unreleased\]" CHANGELOG.md

# 3. Create release
./.claude/resources/scripts/release.sh 0.2.0 --dry-run  # Preview
./.claude/resources/scripts/release.sh 0.2.0            # Execute
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
      "script": ".claude/resources/scripts/check-changelog.sh",
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
./.claude/resources/scripts/ai-update-changelog.sh from-issue PATH_TO_PLAN

# Batch process all deliverables
for file in deliverables/*/issues/*/ISSUE-*-plan.md; do
  ./.claude/resources/scripts/ai-update-changelog.sh from-issue "$file"
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
- Solution: Add entries with `./.claude/resources/scripts/ai-update-changelog.sh analyze`

### Debug Commands

```bash
# Check changelog references
grep -oE "(ISSUE|BUG|TASK)-[0-9]+" CHANGELOG.md | sort -u

# Verify git hook setup
cat .githooks.json | grep changelog

# Test changelog checker
./.claude/resources/scripts/check-changelog.sh

# Run verbose audit
./.claude/resources/scripts/ai-changelog-audit.sh --verbose
```

## Quick Reference

| Task | Command |
|------|---------|
| Audit status | `./.claude/resources/scripts/ai-changelog-audit.sh` |
| Analyze commits | `./.claude/resources/scripts/ai-update-changelog.sh analyze` |
| Add entry | `./.claude/resources/scripts/ai-update-changelog.sh add` |
| From commit | `./.claude/resources/scripts/ai-update-changelog.sh from-commit HEAD` |
| From issue | `./.claude/resources/scripts/ai-update-changelog.sh from-issue FILE` |
| Check before commit | `./.claude/resources/scripts/check-changelog.sh` |
| Create release | `./.claude/resources/scripts/release.sh X.Y.Z` |

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
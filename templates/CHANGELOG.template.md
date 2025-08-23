# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features that have been added

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security vulnerability fixes

<!-- 
## [0.1.0] - YYYY-MM-DD

### Added
- Initial project setup
- Core functionality

### Changed
- N/A - Initial release

### Fixed
- N/A - Initial release
-->

---

## Changelog Entry Format

When completing work items, add entries here using this format:

**For Features/Issues:**
```markdown
- [ISSUE-XXX] Brief description of what was added/changed
```

**For Bugs:**
```markdown
- [BUG-XXX] Fixed: Brief description of what was broken
```

**For Tasks:**
```markdown
- [TASK-XXX] Brief description of the task completed
```

**For Breaking Changes:**
```markdown
- **BREAKING**: [ISSUE-XXX] Description of the breaking change
  - Migration: How to update existing code
```

## How to Maintain This Changelog

1. **During Development**: Add entries to the `[Unreleased]` section as work is completed
2. **For Releases**: Move `[Unreleased]` items to a new version section with date
3. **Keep It Human**: Write entries for humans, not machines
4. **Be Specific**: Include issue/bug/task numbers for traceability
5. **Group by Type**: Use the standard categories (Added, Changed, Deprecated, Removed, Fixed, Security)

## Using Automation Tools

### Quick Commands

```bash
# Check for missing changelog entries
./scripts/ai-changelog-audit.sh

# Add entry interactively
./scripts/ai-update-changelog.sh add

# Analyze recent commits for suggestions
./scripts/ai-update-changelog.sh analyze

# Create a new release
./scripts/release.sh 0.1.0
```

## Links

- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
- [Semantic Versioning](https://semver.org/)
- [Changelog Maintenance Guide](./docs/guides/ai-changelog-maintenance.md)
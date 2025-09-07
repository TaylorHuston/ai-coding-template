# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.4] - 2025-09-07

### Changed

- Reorganized documentation structure for better clarity and reduced redundancy
  - Merged documentation-standards.md into documentation-guidelines.md (v2.0.0)
  - Consolidated FAQ into troubleshooting guide
  - Moved technical.md to architecture/system-design.md
  - Moved architecture guide to guides/ai-architecture-patterns.md
  - Consolidated changelog guides into single changelog-maintenance.md

### Added

- `docs/api/` directory with README for future API documentation

## [0.1.3] - 2025-08-26

### Added

- `docs/documentation-guidelines.md` - Clear guidelines for what documentation goes where
- `deliverables/template-deliverable/README.md` - Template overview and usage instructions

### Changed

- **MAJOR**: Restructured all issue documentation from 3-file to 2-file structure
  - Replaced 3 files (README, plan, requirements) with 2 files (PLAN.md, README.md)
  - PLAN.md (~50 lines): Task checklist and acceptance criteria
  - README.md (~200 lines): Implementation guide with code examples
  - 83% reduction in documentation volume per issue
  - Removed project management bloat to focus on developer needs
- Restructured all 9 SETUP example issues (SETUP-001 through SETUP-009) to new format
- Updated template-deliverable to reflect new 2-file pattern
- Removed redundant `001-initial-setup.md` file from example deliverable (keeping only README.md)

## [0.1.2] - 2025-08-26

### Added

- `templates/CHANGELOG.template.md` - Blank CHANGELOG template for new projects
- `docs/guides/changelog-complete-guide.md` - Comprehensive CHANGELOG system documentation
- `scripts/release.sh` - Automated release script for version management
- `deliverables/001-initial-setup/` - Example deliverable with 9 practical project setup issues

## [0.1.1] - 2025-08-22

### Added[text](about:blank#blocked)

- AI-powered CHANGELOG maintenance system with automated tools and workflows
- `scripts/check-changelog.sh` - Git hook integration for changelog reminders
- `scripts/ai-update-changelog.sh` - Interactive changelog update assistant for AI
- `scripts/ai-changelog-audit.sh` - Comprehensive audit tool with statistics and recommendations
- `docs/guides/ai-changelog-maintenance.md` - Complete guide for AI assistants
- CHANGELOG update requirements in session completion protocol (CLAUDE.md)
- Git hook configuration for automated changelog validation
- `docs/integration-guide.md` - Comprehensive guide for integrating into existing projects
- `docs/troubleshooting.md` - Detailed troubleshooting guide for common issues
- `docs/ai-agents-guide.md` - Complete guide to the 17-agent system
- `docs/workflows/README.md` - Step-by-step common development workflows
- `docs/faq.md` - Frequently asked questions and answers

### Changed

- Enhanced CLAUDE.md with mandatory CHANGELOG updates in session completion protocol
- Updated .githooks.json with changelog-reminder configuration
- Improved quality requirements to include CHANGELOG maintenance
- Moved `technical.md` to `docs/technical.md` for better organization
- Updated all references throughout the codebase to point to new location
- **MAJOR**: Restructured README.md from 1,231 lines to 163 lines for better usability
- Extracted extensive content to specialized documentation files

### Removed

- Old workbench directory structure (replaced by deliverables system)

## [0.1.0] - 2025-08-21

### Added

- Initial project setup with AI coding template
- Deliverables management system for tracking work
- Bug and task tracking templates
- Documentation structure and standards
- Example deliverable: User Authentication

### Changed

- Replaced workbench system with deliverables structure

### Fixed

- N/A - Initial release

---

## Changelog Entry Format

When completing work items, add entries here using this format:

**For Features/Issues:**

```
- [ISSUE-XXX] Brief description of what was added/changed
```

**For Bugs:**

```
- [BUG-XXX] Fixed: Brief description of what was broken
```

**For Tasks:**

```
- [TASK-XXX] Brief description of the task completed
```

**For Breaking Changes:**

```
- **BREAKING**: [ISSUE-XXX] Description of the breaking change
  - Migration: How to update existing code
```

## How to Maintain This Changelog

1. **During Development**: Add entries to the `[Unreleased]` section as work is completed
2. **For Releases**: Move `[Unreleased]` items to a new version section with date
3. **Keep It Human**: Write entries for humans, not machines
4. **Be Specific**: Include issue/bug/task numbers for traceability
5. **Group by Type**: Use the standard categories (Added, Changed, Deprecated, Removed, Fixed, Security)

## Links

- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
- [Semantic Versioning](https://semver.org/)

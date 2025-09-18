# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Workflow Simplification**: Simplified from 6-step to 4-step workflow cycle
  - New sequence: `/design` → `/architect` → `/plan` → `/develop`
  - Consolidated `/vision` + `/feature` → `/design` for all non-technical planning
  - Consolidated `/scaffold` + existing `/architect` → `/architect` for all technical decisions

### Changed

- **MAJOR**: Simplified workflow to 4-step streamlined approach for better flexibility
  - All documentation, README.md, and command references updated to reflect new workflow
  - Removed artificial boundaries between vision/feature and scaffold/architect phases
  - Commands now work at any granularity: vision to user stories, tech stack to feature architecture
- Cleaned up and re-organized the various template files
  - Standardized on naming convention
  - Moved all under the templates/ directory tree

### Removed

## [0.2.0] - 2025-09-18

### Added

- Example app vision document for multi-user todo application
- Template validation project initiated through /vision workflow
- Complete vision framework with success metrics and feature definitions

### Fixed

### Changed

- **MAJOR**: Consolidated `docs-sync-agent` into `technical-writer` agent for streamlined documentation workflow
  - Single comprehensive documentation agent handling creation, maintenance, and synchronization
  - Eliminates decision paralysis between overlapping documentation agents
  - Maintains all existing functionality while improving user experience
  - Updated all 31+ references across commands, hooks, and documentation
- **Command Simplification**: Reduced AI workflow command instructions by 77% (2,470 → 575 lines)
  - Eliminated scripted conversation patterns that constrained AI behavior
  - Improved performance by reducing 15-20% AI overhead from excessive instructions
  - Maintained essential objectives while trusting AI's natural capabilities
- Initiated example application development to validate template workflows

## [0.1.0] - 2025-09-18

### Added

- Initial release version after much random prototyping and experimentation

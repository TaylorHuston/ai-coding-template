# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2025-09-18

### Added

- Example app vision document for multi-user todo application
- Template validation project initiated through /vision workflow
- Complete vision framework with success metrics and feature definitions
- Foundational architecture decisions for example todo application:
  - ADR-001: NextJS + SQLite full-stack architecture
  - ADR-002: Prisma ORM selection with comprehensive schema design
  - ADR-003: React built-in state management and hybrid RSC/Client architecture
  - ADR-004: Security architecture with bcrypt, JWT, and Zod validation

### Fixed

- Fix critical bug in user authentication

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

- Initial release ag

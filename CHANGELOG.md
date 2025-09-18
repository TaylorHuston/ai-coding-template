# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **NEW**: `/scaffold` command - Foundation-first technology stack setup phase
  - Bridges workflow gap between `/vision` and `/feature` phases
  - Establishes project technology foundation before feature definition
  - Agent coordination: devops-engineer, database-specialist, code-architect
  - Creates working development environment with Docker + build tools
  - Generates foundational ADRs for technology decisions

### Changed

- **MAJOR**: Enhanced workflow from 5-phase to 6-phase development cycle
  - Updated sequence: `/vision` → `/scaffold` → `/feature` → `/architect` → `/plan` → `/develop`
  - Clarified agent responsibilities: infrastructure (scaffold) vs feature implementation (architect)
  - Updated all documentation, README.md, and command references
  - Improved logical flow: establish tech stack before defining feature requirements

### Removed

- Removed premature ADRs created during workflow development
  - ADR-001: NextJS + SQLite full-stack architecture
  - ADR-002: Prisma ORM selection
  - ADR-003: Frontend architecture
  - ADR-004: Security architecture
- Removed infrastructure feature document from /feature experiment
  - Cleaned slate for proper /scaffold → /feature → /architect workflow testing

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

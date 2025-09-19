# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Comprehensive Metrics Collection System**: Advanced analytics for commands, agents, and scripts
  - Unified metrics schema tracking execution patterns, performance, and dependencies
  - JSONL-based storage with configurable retention and privacy controls
  - Real-time collection hooks for commands, agents, and script executions
  - Analytics tools: report generation, query interface, and statistics dashboard
  - Integration-ready with existing CI/CD, pre-commit hooks, and automation workflows
  - Actionable insights for system optimization and usage pattern analysis

- **Terminology Standardization**: Unified project planning terminology from "vision" to "project-brief"
  - Updated `/design --vision` to `/design --brief` for improved clarity and consistency
  - Renamed vision-strategist agent to brief-strategist agent
  - Updated all template files: vision.template.md → project-brief.template.md
  - Standardized all documentation references to use "project-brief" terminology
  - Updated workflow scripts and validation tools to use consistent naming

- **Documentation System Optimization**: Comprehensive optimization of development guidelines and documentation structure
  - Consolidated 19 guideline files down to 12 files (37% reduction) for improved AI processing efficiency
  - Extracted code examples from guidelines to `.resources/examples/` directory with organized subdirectories
  - Streamlined git-workflow.md from 913 to 308 lines (66% reduction) focusing on project-specific workflows
  - Added MCP Tool Decision Framework to CLAUDE.md to prevent manual analysis when systematic tools are available
  - Updated all cross-references and agent guideline mappings to reflect consolidated structure
  - All guideline files now under 400 lines for optimal AI context usage

### Changed

- **Refresh Command Performance**: Optimized `/refresh` command for dramatically improved context efficiency
  - Reduced context consumption from 58k tokens to ~300 tokens (194x improvement)
  - Changed from direct file reading to subagent delegation pattern using context-analyzer
  - Moved static capability information to CLAUDE.md to avoid redundant loading
  - Implemented just-in-time guideline loading system to prevent context waste
  - Maintained complete functionality while achieving massive efficiency gains

## [0.3.0] - 2025-09-18

### Added in v0.3.0

- **Epic-Driven Workflow**: New epic-driven development workflow with progressive task discovery

  - Epic structure: `epics/[name]/EPIC.md` with task directories and `resources/` for reference materials
  - Progressive task discovery across all workflow phases with automatic task numbering
  - X.Y.Z implementation task numbering for precise progress tracking (e.g., TASK-001:1.2.3)
  - Task directory structure with TASK.md, HANDOFF.yml, and RESEARCH.md for comprehensive context

- **Comprehensive Testing Integration**: Hybrid TDD/BDD testing strategy with extensive coverage requirements built into the commands and workflow

  - 95%+ test coverage target enforced across all development phases
  - BDD test scenarios generated from acceptance criteria in `/design` phase
  - Testing architecture decisions documented in `/architect` phase ADRs
  - Dedicated testing tasks created during `/plan` phase
  - Test-first development enforced in `/develop` phase with auto-invoked test-engineer agent
  - New testing-specific templates for comprehensive test planning and execution

- **Epic-Driven Hierarchical Branching Strategy**: Git workflow optimized for epic development structure

  - **Epic branches** (`epic/[name]`) contain multiple task branches (`task/###-[name]`)
  - **Progressive task discovery**: Tasks numbered by discovery order across workflow phases
  - **Local merge workflow**: Integration with existing `/merge-branch` command for quality gates
  - **Epic branch manager script**: Automated branch creation, merge setup, and cleanup utilities

- **Enhanced Command Integration**: All commands updated for epic workflow
  - `/design` creates epic structures, task directories, and BDD test scenarios
  - `/architect` uses Quick/Deep modes with optimized ADR generation and agent coordination
  - `/plan` adds X.Y.Z implementation details, agent coordination, and dedicated testing tasks
  - `/develop` executes with full epic context, dependency management, and test-first enforcement

### Changed

- Templates updated to support epic workflow and task directories
- Reorganized and consolidated templates, scripts and examples into .resources directory
- Standardized template name formats

### Removed

- **Deprecated Commands**: Streamlined command system by removing redundant and obsolete commands
  - `/feature-development` - Replaced by epic-driven `/design` → `/architect` → `/plan` → `/develop` workflow
  - `/health-check` - Functionality consolidated into `/quality assess` command
  - `/progress` - Progress tracking integrated into `/status --detailed` command
  - **Command reduction**: 17 → 14 commands (18% reduction) with improved clarity and no functionality loss

### Fixed

- **Claude Code Compliance**: Updated all custom commands to meet Claude Code documentation standards
  - Added required frontmatter fields: `description`, `allowed-tools`, `argument-hint`, `model`
  - Standardized `allowed-tools` formatting to consistent array syntax with quotes
  - Proper model assignment based on command complexity (opus for complex, sonnet for standard)
  - All 14 remaining commands now fully compliant with Claude Code requirements

## [0.2.0] - 2025-09-18

### Added in v0.2.0

- Example app vision document for multi-user todo application
- Template validation project initiated through /vision workflow
- Complete vision framework with success metrics and feature definitions

### Fixed in v0.2.0

### Changed in v0.2.0

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

### Added in v0.1.0

- Initial release version after much random prototyping and experimentation

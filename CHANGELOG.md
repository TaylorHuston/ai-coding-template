# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.2] - 2025-09-19

### Fixed

- **MCP Configuration**: Fixed NPM package to use correct template `.mcp.json` file for new projects
  - **Problem**: Package was including template's active `.mcp.json` (with Serena enabled) instead of the template for new projects
  - **Solution**: Removed `.mcp.json` from NPM package files and added special CLI handling to use `.resources/templates/config/mcp.template.json`
  - **Result**: New projects now correctly get `.mcp.json` with Serena commented out, preventing indexing delays on fresh installations

## [0.6.1] - 2025-09-19

### Enhanced

- **Smart Serena Activation**: Implemented optional Serena MCP activation for new projects
  - **Problem**: Fresh template installations experienced indexing delays from Serena on minimal codebases
  - **Solution**: New projects get Serena commented out in `.mcp.json` template by default
  - **User Control**: Users activate Serena when project reaches 20+ implementation files
  - **Benefits**: Immediate productivity for new projects, semantic analysis when beneficial
  - **Documentation**: Added comprehensive Serena activation guide and updated tool selection framework

## [0.6.0] - 2025-09-19

### Enhanced

- **Intelligent Task Complexity Analysis**: Integrated automatic complexity assessment into `/plan` command
  - **Complexity Scoring System**: Multi-domain integration (+3), Security implementation (+2), Database changes (+2), External integrations (+2), Performance optimization (+2), UI/UX (+1), Testing (+1)
  - **Smart Decomposition Recommendations**: High complexity (≥5 points) triggers automatic subtask suggestions with agent assignments
  - **Auto-decomposition Patterns**: Context-aware breakdown for API tasks, Database tasks, Frontend tasks, Security tasks, Integration tasks
  - **Proactive Planning**: Prevents complex task failures by identifying decomposition needs during planning phase

- **Intelligent Context Distillation**: Enhanced `/develop` command with domain-aware context filtering
  - **Agent-Specific Context Briefings**: Backend specialists receive API contracts/security requirements, Frontend specialists get component specs/UI patterns, Test engineers get coverage targets/validation strategies
  - **Dynamic Context Loading**: Real-time parsing of HANDOFF.yml, RESEARCH.md, and ADRs to extract only domain-relevant sections
  - **Performance Optimization**: Agents receive focused, actionable context without information overload
  - **6 Specialist Context Patterns**: Backend, Frontend, Test, Security, Database, and Performance optimization contexts

- **Enhanced `smart-task-decomposition.sh`**: Improved integration with core workflow commands
  - **Integration Modes**: `--plan-integration` for proactive analysis, `--develop-integration` for failure recovery
  - **Contextual Recommendations**: Different messaging and suggestions based on whether called from `/plan` or `/develop`
  - **Flexible Input**: Accepts direct task descriptions via `--description` parameter or extracts from workflow files
  - **Better Error Recovery**: Provides specific guidance for task failure scenarios with complexity-based recommendations

### Improved

- **Workflow Command Integration**: Complexity analysis and context distillation now seamlessly integrated into core commands
  - **Automatic Invocation**: No manual script execution required - functionality triggers automatically when needed
  - **Contextual Adaptation**: Different behavior patterns for planning vs development phases
  - **Enhanced Agent Coordination**: Improved agent selection and briefing based on task complexity and domain requirements

### Improved

- **Documentation Command Consolidation**: Merged `/update-docs` functionality into unified `/docs` command
  - **New `/docs update` Subcommand**: Comprehensive documentation accuracy validation and updates
  - **Unified Interface**: Single command for all documentation operations (generate, validate, sync, health, update, auto)
  - **Enhanced Functionality**: Combined the best features of both commands with improved agent coordination
  - **Cleaner Command Structure**: Reduced from 14 to 13 total commands while maintaining all functionality

### Removed

- **Legacy Context Distillation**: Removed standalone `distill-context.sh` script functionality
  - **Functionality Preserved**: All context distillation capabilities moved to `/develop` command with enhanced features
  - **Cleaner Architecture**: Eliminated redundant standalone scripts while improving core workflow integration
  - **Updated Documentation**: Removed references to obsolete context preparation scripts in hooks and setup guides

- **Redundant Documentation Command**: Removed `/update-docs` command after merging into `/docs update`
  - **Functionality Preserved**: All update-docs capabilities now available via `/docs update` subcommand
  - **Unified Documentation Management**: Single entry point for all documentation operations
  - **Enhanced Integration**: Better coordination with technical-writer agent and documentation scripts

## [0.5.4] - 2025-09-19

### Fixed

- **NPM Package Distribution**: Fixed `.mcp.json` and other configuration files missing from NPM package installations
  - **Root Cause**: Files were categorized correctly in template manifest but missing from package.json "files" field
  - **Solution**: Added `.mcp.json`, `.env.example`, `.githooks/`, and `.githooks.json` to NPM package "files" array
  - **Result**: MCP servers (context7, sequential-thinking, playwright, serena) now properly included in new projects
  - All configuration files now correctly distributed with NPM package

## [0.5.3] - 2025-09-19

### Fixed

- **MCP Configuration**: Fixed `.mcp.json` file and other configuration files missing from NPM package installations
  - **Root Cause**: Files were properly categorized in template manifest but missing from package.json "files" field
  - **Solution**: Added `.mcp.json`, `.env.example`, `.githooks/`, and `.githooks.json` to NPM package distribution
  - **Result**: MCP servers (context7, sequential-thinking, playwright, serena) now properly included in new projects
  - Template manifest categorization was already correct; issue was at NPM packaging layer

## [0.5.2] - 2025-09-19

### Fixed

- **Command Model Specifications**: Fixed incorrect model specifications in 11 Claude Code commands
  - Fixed 10 commands using `model: sonnet` to use `model: "claude-3-5-sonnet-20241022"`
  - Fixed 1 command using `model: opus` to use `model: "claude-opus-4-1"`
  - Resolved 404 errors preventing commands from executing (update-docs, refresh, review, etc.)
  - All custom commands now properly specify their required models with full model identifiers

### Removed

- **Template Cleanup**: Reduced template file count by 16.6% for cleaner installations
  - Removed 61 obsolete and duplicate files from template structure
  - Deleted deprecated feature workflow templates (replaced by epic-driven workflow)
  - Removed template's own development artifacts not needed by end users
  - Consolidated duplicate example files and testing patterns
  - Removed obsolete `.claude/working/` directory from previous workflow system
  - Deleted duplicate documentation files (MCP guide, collaborative workflow guide)
  - Reorganized `.resources/` directory structure for better organization
  - Template now installs 306 files instead of 367 (exceeded target of ~290 files)

### Changed

- **Documentation Consolidation**: Streamlined documentation structure
  - Consolidated MCP documentation to single authoritative source in `docs/ai-tools/setup/mcp-setup.md`
  - Removed references to deprecated `/feature-development` workflow
  - Updated design command to explicitly reference correct template location
  - Updated all file path references in documentation to reflect reorganized structure
  - Refreshed `.claude/references/` documentation trees to maintain accuracy

### Added

- **MCP Configuration**: Fixed `.mcp.json` file categorization in template manifest
  - File now properly included in configuration category with smart-merge strategy
  - Ensures MCP server configurations are included in new projects
  - Enables out-of-the-box integration with context7, sequential-thinking, playwright, and serena MCP servers

## [0.5.1] - 2025-09-19

### Fixed

- **NPM Binary Execution Issue**: Fixed CLI binary not executable in published NPM package
  - Added execute permissions to `cli/index-npm.js` (changed from 644 to 755)
  - Resolved "ai-template: not found" error when using `npx ai-assisted-template` commands
  - NPM package now properly executes CLI commands: init, status, validate, info
  - Binary file now includes correct shebang and executable permissions for cross-platform compatibility
  - Confirmed working with `npx ai-assisted-template@0.5.1 init` command

## [0.5.0] - 2025-09-19

### Fixed

- **Critical NPM Package Installation Issue**: Fixed FileCategorizer baseDir handling for NPM package installations

  - Resolved issue where template installation was copying 0 files instead of expected 367 files
  - Fixed template path detection to correctly scan NPM package directory instead of user's working directory
  - Added baseDir parameter to FileCategorizer constructor and updated all file scanning methods
  - NPM package now successfully installs complete template with all 367 files (306 copied + 60 merged + 1 configured)
  - Confirmed working with `npx ai-assisted-template@0.4.1 init my-project` command
  - Package name changed from `@ai-template/core` to `ai-assisted-template` for simpler distribution

- **NPM Package Documentation**: Updated README.md with correct NPM package name and commands
  - Fixed installation command from `npx @ai-template/core` to `npx ai-assisted-template`
  - Updated status and validate commands to use NPM package format
  - Added README.md to NPM package files for proper documentation display
  - Removed circular dependency from package.json

## [0.4.0] - 2025-09-19

### Added

- **Template Distribution System**: Complete NPM package distribution with development sync capabilities

  - NPM package `@ai-template/core` for easy template installation via `npx @ai-template/core init`
  - CLI tools with commands: init, status, validate, dev enable/disable, sync pull/push
  - File categorization system with 6 categories (core, reference, optional, configuration, user, ignore)
  - Bidirectional development sync for template contributors working with live projects
  - Automatic git repository isolation for template installations to prevent inheritance issues
  - Example directory structure with working web-app template installation (370+ files)
  - Template manifest system (.template-manifest.json) for intelligent file handling
  - Successfully tested: template installation, development mode sync (both push/pull directions)

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

- **Plan Command Enhancement**: Restructured `/plan` command for interactive planning and workbench organization

  - Added interactive standalone task support with `/plan --misc "task name"` and `/plan --bug "description"`
  - Implemented auto-incrementing ID system (MISC-### and BUG-###) based on existing task numbers
  - Added conversational requirements gathering to eliminate ambiguity through back-and-forth dialogue
  - Created workbench structure: `workbench/epics/`, `workbench/misc/`, and `workbench/bugs/`
  - Enhanced task template generation with kebab-case directory formatting and comprehensive HANDOFF.yml

- **Development Command Enhancements**: Enhanced `/develop` command with enforced coordination and teaching capabilities
  - **HANDOFF.yml Enforcement**: Mandatory agent coordination tracking with 5 enforcement checkpoints
  - **Structured handoff chain**: Real-time agent transitions with timestamps and deliverable documentation
  - **Validation requirements**: Complete handoff verification before task completion
  - **Restored `--guided` flag**: Teaching mode with code suggestions instead of direct modifications
  - **Enhanced user control**: Learning-focused development with explanation and review cycles

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

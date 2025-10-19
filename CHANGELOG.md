# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.9.0] - 2025-10-19

### Changed

- **BREAKING: Marketplace + Plugin Architecture**: Complete restructuring from GitHub Template to Claude Code Plugin Marketplace
  - **Marketplace Structure**: Repository now serves as a Claude Code marketplace with embedded plugin
    - Created `.claude-plugin/marketplace.json` defining marketplace metadata
    - Plugin located at `plugins/ai-toolkit/` with full plugin structure
    - Starter template separated to `starter-template/` for project scaffolding
  - **Plugin Distribution**: AI Toolkit commands and agents now installable as plugin
    - Install via `/plugin marketplace add taylorh140/ai-coding-template` then `/plugin install ai-toolkit`
    - 18 slash commands available as plugin (design, architect, plan, develop, quality tools, etc.)
    - 19 specialized agents included (brief-strategist, code-architect, frontend-specialist, ai-llm-expert, etc.)
    - All support scripts bundled in plugin using `${CLAUDE_PLUGIN_ROOT}` environment variable
  - **Plugin Renamed**: Changed from "ai-workflow" to "ai-toolkit" for better clarity
    - Updated all references in plugin.json, marketplace.json, and documentation
    - Plugin name better reflects comprehensive toolkit nature
  - **Local Development**: Marketplace structure enables easy local testing
    - Test locally with `/plugin marketplace add ./` from repository root
    - Immediate feedback loop for plugin development without publishing
    - Clean separation between plugin tooling and project scaffolding
  - **Bundled MCP Servers**: Plugin now auto-configures essential MCP servers
    - Bundled servers: context7 (library docs), sequential-thinking (problem solving), playwright (browser automation)
    - No manual MCP configuration required - tools ready immediately after plugin installation
    - Serena documented as optional addition for larger codebases (20+ files) in `docs/OPTIONAL-MCP-SERVERS.md`
    - MCP configuration in `plugins/ai-toolkit/.mcp.json` loads automatically
  - **Plugin Documentation Reorganization**: Cleaned up documentation structure
    - Moved `agents/README.md` → `docs/AGENTS.md` (24KB agent catalog)
    - Moved `commands/README.md` → `docs/COMMANDS.md` (10KB command reference)
    - Moved `agents/guideline-mapping.yml` → `docs/guideline-mapping.yml`
    - Created `docs/OPTIONAL-MCP-SERVERS.md` for Serena and other optional tools
    - Agent and command directories now contain only .md files for proper plugin loading
  - **Starter Template**: Pre-configured project structure separate from plugin
    - Template includes: CLAUDE.md, README.md, docs structure, .gitignore
    - Removed `.claude/cache/` directory (plugins installed globally, not cached per-project)
    - Users copy `starter-template/` to their project after installing plugin
    - Documentation moved to `starter-template/docs/` (project, development, ai-toolkit tiers)
  - **Script Updates**: All core scripts updated for plugin environment
    - Updated `scripts/lib/logging.sh` to use `${CLAUDE_PLUGIN_ROOT}` with fallback
    - Updated `scripts/status/ai-status.sh` to work as plugin or standalone
    - Hooks configuration uses plugin root for script paths
  - **Semantic Versioning**: Version bumped to 0.9.0 (major architecture change before 1.0.0)
  - **Rationale**:
    - Commands are technology-agnostic and reusable across all projects
    - Plugin distribution provides clean updates via `/plugin update ai-toolkit`
    - Marketplace enables local testing and development iteration
    - Separation of tooling (plugin) from scaffolding (template) improves clarity
  - **Result**: Users get cleaner projects, easier updates, better development workflow

### Removed

- **Old Directory Structures**: Cleaned up root directory from GitHub Template approach
  - Removed `.claude/` from root (now in `plugins/ai-toolkit/` for plugin)
  - Removed `example/` (example code not needed in marketplace)
  - Removed `src/` (example application not needed in marketplace)
  - Removed `workbench/` (development workspace not needed in marketplace)
  - Removed `.serena/` (tool-specific cache not needed in marketplace)
- **GitHub Template Distribution Files**: Removed obsolete template system files
  - Removed `.template-dev.json.example` (template development config)
  - Removed `.template-manifest.json` (GitHub template metadata)
  - Removed `.templateignore` (template file exclusions)
- **NPM Package Files**: Removed obsolete NPM distribution files
  - Removed `package.json` and `package-lock.json` (referenced deleted CLI scripts)
  - Archived `.archived-npm/` directory (old NPM package, now obsolete)
- **Development Git Hooks**: Removed development-only git configuration
  - Removed `.githooks/` directory (pre-commit hooks for this repo's development)
  - Removed `.githooks.json` (hooks configuration)
  - Removed `.gitmessage` (commit message template)
- **Miscellaneous Cleanup**: Removed unused configuration files
  - Removed `README.old.md` (backup file from conversion)
  - Removed `.env.example` (app-specific environment variables)
  - Removed root `.mcp.json` (MCP servers now bundled in plugin)
  - Removed `.claude/cache/` from starter-template (plugins installed globally)

## [0.8.2] - 2025-10-04

### Changed

- **Init Script Improvements**: Enhanced project initialization with cleaner output and better file handling

  - Removed license type prompt (LICENSE file is deleted anyway, users add their own)
  - STATUS.md now created fresh instead of sed replacements (removes all template development history)
  - Added .serena/ directory cleanup (template's code analysis cache shouldn't transfer to user projects)
  - Added CONTRIBUTING.md cleanup (template-specific contributing guidelines don't apply to user projects)
  - Result: Faster initialization, cleaner project files, no confusing template artifacts

- **Architect Command Enhancement**: Added explicit `--question` flag for direct questions

  - New flag: `--question "text"` for explicit Direct Question mode
  - Backward compatible: Quoted strings still work without flag
  - Eliminates quote-detection ambiguity for clearer user intent
  - Updated argument-hint to show all available flags and modes
  - Result: More predictable command parsing, better UX for quick architectural questions

- **Commit Command Enhancement**: Added git workflow flags for common operations

  - New flag: `--amend` - Amend last commit with safety checks (authorship, push status)
  - New flag: `--no-verify` - Skip pre-commit hooks for emergency fixes
  - New flag: `--interactive` - Interactive staging before commit
  - Safety features: Warns if amending other developer's commits or pushed commits
  - Result: Common git workflows accessible without remembering bash syntax

- **Test-Fix Command Enhancement**: Added test execution optimization flags
  - New flag: `--type TYPE` - Run only specific test type (unit/integration/e2e)
  - New flag: `--failed-only` - Re-run only previously failed tests
  - New flag: `--watch` - Watch mode for continuous testing on file changes
  - Flags combinable: `--type unit --failed-only` for fastest iteration
  - Result: Faster test iterations, developer productivity improvements

### Removed

- **Workbench STATUS.md**: Deleted outdated status file from NPM distribution phase
  - File was stale and duplicated root STATUS.md
  - Workbench directory is for active development only
  - Root STATUS.md remains as authoritative project status

## [0.8.1] - 2025-10-04

### Changed

- **Quick Start Documentation**: Added init-project script to all Quick Start options in README.md
  - All installation methods (GitHub Template, degit, manual clone) now clearly show the critical initialization step
  - Updated First Steps section to reflect what init-project creates automatically
  - Prevents users from skipping transformation step that customizes template for their project
  - Result: Users understand that init-project is required for ALL installation methods, not just degit

## [0.8.0] - 2025-10-04

### Fixed

- **Critical Setup Script Bug**: Fixed PROJECT_ROOT path calculation in setup-manager.sh

  - **Problem**: PROJECT_ROOT was resolving to `.claude/` instead of project root directory
  - **Root Cause**: Script moved from `scripts/setup/` to `.claude/resources/scripts/setup/` but path calculation not updated
  - **Impact**: LICENSE deletion, README customization, and git operations were using wrong base directory
  - **Solution**: Changed `PROJECT_ROOT="$(cd "$SCRIPTS_ROOT/../.." && pwd)"` to `PROJECT_ROOT="$(cd "$SCRIPTS_ROOT/../../.." && pwd)"`
  - **Result**: All init-project operations now correctly operate on project root

- **Documentation Path Accuracy**: Fixed incorrect script paths across multiple documentation files

  - **quick-start.md**: Updated 8+ script paths from `.resources/` to `.claude/resources/`
  - **integration-guide.md**: Fixed placeholder URLs and incorrect file references
  - **CONTRIBUTING.md**: Updated references to match new directory structure
  - **STATUS.md**: Refreshed next steps to reflect current project state
  - **Result**: All documentation paths now accurate after directory reorganization

- **README Documentation Accuracy**: Fixed multiple incorrect commands and references in project documentation
  - **Root README.md**: Fixed non-existent `npx ai-assisted-template setup` command references and updated GitHub URLs from placeholder "yourusername" to "TaylorHuston"
  - **Usage Guide**: Fixed incorrect script paths and GitHub URL placeholders in `docs/ai-toolkit/README.md`:
    - Updated GitHub URLs from "yourusername" to "TaylorHuston"
    - Replaced non-existent `npm run demo` with `npx ai-assisted-template status`
    - Fixed script paths: `setup-manager.sh` → `setup/setup-manager.sh`, `ai-status.sh` → `status/ai-status.sh`
  - **Result**: All documentation now contains only valid commands and accurate file paths

### Changed

- **Directory Structure Reorganization**: Moved `.resources/` to `.claude/resources/` for consistent .claude/ namespace

  - **Migration**: 254 files moved from `.resources/` to `.claude/resources/`
  - **Path Updates**: Updated all script paths, documentation references, and command configurations
  - **Structure**: All AI toolkit files now under single `.claude/` directory (agents, commands, resources, references)
  - **Benefits**: Cleaner namespace, consistent organization, easier .claude/ directory management
  - **Impact**: Updated 50+ file references across codebase to use new paths

- **README Consolidation**: Streamlined root documentation from two files to one

  - **Removed**: README-DEV.md (alpha-phase version with outdated content)
  - **Enhanced**: README.md with improved problem/solution framing
  - **Added**: "Why Intelligent Agent Coordination Matters" section to docs/ai-toolkit/README.md
  - **Result**: Single authoritative README with clear value proposition and accurate workflows

- **Documentation Structure Reorganization**: Improved documentation organization for better clarity and discoverability

  - **Directory Renaming**:
    - `docs/ai-tools/` → `docs/ai-toolkit/` - Better reflects the comprehensive AI development toolkit nature
    - `docs/technical/` → `docs/project/` - More intuitive naming for project-specific documentation
  - **Path Updates**: Updated all 50+ file references across codebase to use new directory structure
  - **Cross-Reference Integrity**: Maintained all internal links and cross-references during restructuring
  - **Package Distribution**: Updated NPM package configuration to include new documentation paths

- **Command Header Standardization**: Implemented consistent header format across all custom commands for improved maintainability
  - **Standardized YAML Frontmatter**: Unified structure with version, dates, status, audience, and model specifications
  - **Agent Coordination Sections**: Clear specification of primary, supporting, and quality gate agents for each command
  - **Consistent Titles**: Unified `/command-name Command` format across all 14 commands
  - **Usage Documentation**: Standardized argument hints, examples, and usage patterns

### Removed

- **LICENSE File from Template**: Removed template LICENSE during project initialization
  - **Rationale**: Template LICENSE was confusing - users thought it enforced license requirements on their projects
  - **Implementation**: init-project script now deletes LICENSE before git commit
  - **Manifest Update**: LICENSE added to "ignore" category (never syncs)
  - **Guidance**: Users should add their own LICENSE appropriate for their project
  - **Result**: Clean slate for users to choose their own license without confusion

### Added

- **CLAUDE.md Two-File System**: Preserves project customizations while allowing template improvements

  - **Template Reference**: `.claude/CLAUDE-template.md` syncs with template improvements
  - **Project Version**: Root `CLAUDE.md` never syncs, preserves customizations
  - **Helper Commands**: `claude-diff` and `claude-status` for comparing versions
  - **Tracking Header**: Clear guidance in root CLAUDE.md on template relationship
  - **Manifest Update**: Root CLAUDE.md moved to "user" category (preserve strategy)
  - **Result**: Users can customize CLAUDE.md while still receiving template improvements via manual merge

- **Template Development Sync System**: Bidirectional sync for active template development while building real projects

  - **Manifest-Driven**: Uses `.template-manifest.json` to identify template vs project files
  - **Sync Commands**: `pull`, `push`, `status`, `diff` for complete workflow
  - **Smart Detection**: Auto-detects template directory from common locations
  - **Conflict Handling**: Timestamp-based conflict detection with force override option
  - **Configuration**: `.template-dev.json` for user-specific settings (git-ignored)
  - **Documentation**: Comprehensive guide at `docs/ai-toolkit/setup/template-development.md`
  - **Use Case**: Discover improvements while building projects → sync to template → share across all projects
  - **Result**: Contributors can actively develop template based on real-world experience

- **GitHub Template Distribution**: Converted from NPM package to GitHub Template primary distribution
  - **One-Click Setup**: Users click "Use this template" → instant repository creation
  - **Git Isolation**: Each project gets clean git history, no template repo inheritance
  - **Simpler Workflow**: No NPM package management, no complex CLI tools
  - **Alternative: degit**: `npx degit TaylorHuston/ai-coding-template` for CLI users
  - **Archived NPM**: Moved CLI tools to `.archived-npm/` with detailed README
  - **Future Updater Tool**: NPM package repurposed for future template updater utility
  - **Result**: GitHub Template standard for scaffolds, simpler user experience

## [0.7.0] - 2025-09-20

### Added

- **Template-Maintainer Agent**: Automated template lifecycle management and self-improvement system
  - **Purpose**: Monitor user feedback, implement improvements, and automate publishing workflow
  - **Capabilities**: Feedback analysis, template enhancement, NPM publishing, adoption monitoring
  - **Command**: New `/improve` command with 4 modes (--feedback, --enhance, --publish, --monitor)
  - **Intelligence**: Deep understanding of template structure, file categorization, and user propagation
  - **Automation**: Complete publishing pipeline from user feedback to NPM distribution
  - **Result**: Template can now evolve itself based on real user patterns and needs

### Fixed

- **Interactive Project Brief Creation**: Fixed `/design --brief` command to conduct proper interactive discovery
  - **Problem**: Command was jumping straight to document generation instead of asking discovery questions
  - **Root Cause**: Agent system wasn't recognizing `brief-strategist` due to incorrect YAML frontmatter format
  - **Solution**:
    - Converted `brief-strategist.md` from markdown headers to proper YAML frontmatter format
    - Updated `design.md` command to explicitly mandate brief-strategist agent for `--brief` flag
    - Added 6-step interactive discovery process with structured questioning
  - **Result**: `/design --brief` now asks questions one at a time and only generates project brief after complete discovery

## [0.6.4] - 2025-09-19

### Fixed

- **NPM Binary Resolution**: Fixed npx command not working from within repository directories
  - **Problem**: `npx ai-assisted-template init` failed with "ai-template: not found" when run from repo subdirectories
  - **Solution**: Added `ai-assisted-template` binary name to package.json alongside existing `ai-template`
  - **Result**: Both commands now work everywhere: `npx ai-assisted-template init` and `npx -p ai-assisted-template ai-template init`

## [0.6.0] - [0.6.3] - 2025-09-19

Missing, issues with Claude Code prematurely publishing NPM versions and burning these version numbers.

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
  - Reorganized `.claude/resources/` directory structure for better organization
  - Template now installs 306 files instead of 367 (exceeded target of ~290 files)

### Changed

- **Documentation Consolidation**: Streamlined documentation structure
  - Consolidated MCP documentation to single authoritative source in `docs/ai-toolkit/setup/mcp-setup.md`
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
  - Extracted code examples from guidelines to `.claude/resources/examples/` directory with organized subdirectories
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
- Reorganized and consolidated templates, scripts and examples into .claude/resources directory
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

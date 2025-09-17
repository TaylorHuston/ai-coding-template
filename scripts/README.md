---
version: "1.0.0"
created: "2025-08-21"
last_updated: "2025-08-22"
status: "active"
target_audience: ["developers", "devops", "ai-assistants"]
document_type: "reference"
tags: ["scripts", "automation", "devops"]
---

# Scripts Directory

This directory contains automation scripts for the AI Coding Template project. These scripts help with documentation management, project health monitoring, setup automation, and development workflow optimization.

## Scripts Overview

### Core Automation Scripts

#### 📊 `ai-status.sh` - Project Status Dashboard
AI-friendly project status dashboard that provides comprehensive project information in multiple formats.

**Purpose**: Generate real-time project status reports for both humans and AI assistants.

**Usage**:
```bash
# Basic status check
./scripts/ai-status.sh

# AI-optimized format
./scripts/ai-status.sh --ai-format

# JSON output for programmatic access
./scripts/ai-status.sh --json

# Markdown format for documentation
./scripts/ai-status.sh --markdown --timestamp

# Component-specific checks
./scripts/ai-status.sh --git-only
./scripts/ai-status.sh --project-only
./scripts/ai-status.sh --env-only
```

**Features**:
- Git repository status (branch, commits, uncommitted files)
- Project structure analysis (file counts, directory structure)
- Environment status (tools, dependencies, Docker)
- Multiple output formats (human, AI-optimized, JSON, Markdown)
- Timestamp support for historical tracking

#### 🛠️ `setup-manager.sh` - Development Environment Setup
Unified setup manager that consolidates all setup scripts into a single entry point.

**Purpose**: Streamline project setup and configuration for new developers.

**Usage**:
```bash
# Quick setup with minimal configuration
./scripts/setup-manager.sh quick

# Complete development environment setup
./scripts/setup-manager.sh full --verbose

# Setup specific components
./scripts/setup-manager.sh env --force
./scripts/setup-manager.sh git
./scripts/setup-manager.sh tools

# Verify setup completeness
./scripts/setup-manager.sh check
```

**Features**:
- Automated prerequisite checking (Node.js, Git, Docker)
- Environment file creation (.env, .env.local)
- Git repository initialization and configuration
- Development tool installation and verification
- Setup completeness verification

#### 📚 `docs-manager.sh` - Documentation Management
Centralizes documentation operations and maintenance tasks.

**Purpose**: Maintain documentation quality and consistency across the project.

**Usage**:
```bash
# Initialize documentation structure
./scripts/docs-manager.sh init

# Check documentation health
./scripts/docs-manager.sh health

# Validate documentation for commits
./scripts/docs-manager.sh validate

# Check and fix broken links
./scripts/docs-manager.sh check --fix-auto --verbose

# Clean generated documentation files
./scripts/docs-manager.sh clean
```

**Features**:
- Documentation structure initialization
- Link validation and broken link detection
- Pre-commit documentation validation
- Integration with docs-health.js for comprehensive analysis

### Documentation Analysis Scripts

#### 🔗 `check-docs-links.js` - Link Validator
Validates internal and external links in documentation files with comprehensive error reporting.

**Purpose**: Ensure all documentation links are valid and accessible.

**Usage**:
```bash
# Basic link checking (internal links only)
node scripts/check-docs-links.js

# Check external links (slower but comprehensive)
node scripts/check-docs-links.js --external

# Generate JSON report
node scripts/check-docs-links.js --format json --output link-report.json

# Auto-fix obvious issues
node scripts/check-docs-links.js --fix

# Quiet mode for CI/CD
node scripts/check-docs-links.js --quiet
```

**Features**:
- Markdown link extraction and validation
- Internal file existence checking
- External URL accessibility testing
- Anchor link validation within documents
- Orphaned file detection
- Multiple output formats (text, JSON)
- Automatic fixing of common issues

#### 📋 `docs-health.js` - Documentation Health Dashboard
Comprehensive documentation quality analyzer that generates detailed health reports.

**Purpose**: Monitor documentation quality, coverage, and maintenance status.

**Usage**:
```bash
# Run complete health analysis
node scripts/docs-health.js
```

**Features**:
- File analysis (lines, code blocks, links, TODOs)
- Freshness tracking using Git history
- Health scoring algorithm
- Visual progress bars and metrics
- Categorized file analysis (root, docs, guides, API, etc.)
- Automatic report generation (Markdown format)
- Maintenance recommendations

#### 📈 `docs-changelog.js` - Documentation Change Tracker
Tracks documentation changes using Git history with detailed analysis.

**Purpose**: Generate changelog reports for documentation modifications.

**Usage**:
```bash
# Show changes from last 30 days
node scripts/docs-changelog.js

# Custom time range
node scripts/docs-changelog.js --since "7 days ago"

# Filter by author
node scripts/docs-changelog.js --author "username"

# Generate detailed report
node scripts/docs-changelog.js --detailed --format json --output changelog.json
```

**Features**:
- Git history analysis for documentation files
- Author activity tracking
- File change frequency analysis
- Categorized change classification
- Multiple output formats (text, JSON)
- Detailed commit analysis with statistics

#### 📝 `generate-doc.js` - Documentation Generator
Interactive CLI tool for generating documentation from templates.

**Purpose**: Streamline documentation creation using predefined templates.

**Usage**:
```bash
# Interactive template selection
node scripts/generate-doc.js

# Use specific template
node scripts/generate-doc.js --template feature

# Preview without writing
node scripts/generate-doc.js --template api --preview

# Specify output file
node scripts/generate-doc.js --template guide --output docs/development/guidelines/my-guide.md

# List available templates
node scripts/generate-doc.js --list
```

**Features**:
- Template-based documentation generation
- Interactive variable substitution
- Smart filename suggestions
- Preview mode for testing
- Automatic directory creation
- Template variable extraction and defaults

### Workflow & Planning Scripts

#### 🔄 `init-workflow.sh` - Workflow Structure Initialization
Sets up proper workflow structure for plan → iterate coordination with deliverables tracking.

**Purpose**: Initialize workflow directory structure and files for issue tracking and agent coordination.

**Usage**:
```bash
# Initialize workflow for an issue
./scripts/init-workflow.sh --issue AUTH-123

# Specify custom deliverable name
./scripts/init-workflow.sh --issue AUTH-123 --deliverable user-management

# Force overwrite existing files
./scripts/init-workflow.sh --issue AUTH-123 --force
```

**Features**:
- Creates deliverables/[DELIVERABLE]/issues/[ISSUE-KEY] structure
- Generates initial PLAN.md, HANDOFF.yml, and RESEARCH.md files
- Validates issue key format and deliverable naming
- Integrates with /plan and /iterate workflow commands

#### 🧠 `smart-task-decomposition.sh` - Intelligent Task Breakdown
Breaks down complex tasks into manageable, sequential steps with agent assignment hints.

**Purpose**: Decompose large features or complex requirements into actionable tasks for the /iterate workflow.

**Usage**:
```bash
# Decompose a feature description
./scripts/smart-task-decomposition.sh --feature "User authentication system"

# Decompose from issue file
./scripts/smart-task-decomposition.sh --from-file deliverables/auth/issues/001/requirements.md

# Specify complexity level
./scripts/smart-task-decomposition.sh --feature "API redesign" --complexity high

# Generate phases for large projects
./scripts/smart-task-decomposition.sh --feature "Microservices migration" --phases 3
```

**Features**:
- AI-powered task decomposition using intelligent analysis
- Agent assignment hints for each task (<!--agent:agent-name-->)
- Phase-based organization (P1.X.X, P2.X.X, P3.X.X)
- Dependency analysis and sequencing
- Integration with PLAN.md format for /iterate execution

#### 🎯 `distill-context.sh` - Agent Context Preparation
Generates focused, agent-specific context from verbose HANDOFF.yml and RESEARCH.md files.

**Purpose**: Prepare concise, relevant context for agent execution during /iterate workflow.

**Usage**:
```bash
# Prepare context for specific agent
./scripts/distill-context.sh --agent backend-specialist --task P1.3.0

# Generate context for Claude Code hooks
./scripts/distill-context.sh --agent test-engineer --prepare

# Output to specific file
./scripts/distill-context.sh --agent frontend-specialist --output /tmp/context.md

# Quiet mode for automation
./scripts/distill-context.sh --agent database-specialist --task P2.1.0 --quiet
```

**Features**:
- Agent-specific context filtering and summarization
- Task-specific context extraction
- Integration with Claude Code hooks system
- Reduces context window usage while preserving critical information
- Supports all 18 agent types in the framework

### Changelog & Release Management

#### 📝 `ai-update-changelog.sh` - AI-Friendly Changelog Assistant
Helps AI coding assistants generate and add changelog entries with proper categorization.

**Purpose**: Streamline changelog maintenance with AI-assisted entry generation and validation.

**Usage**:
```bash
# Analyze recent commits and suggest entries
./scripts/ai-update-changelog.sh analyze --since '1 week ago'

# Add entry interactively
./scripts/ai-update-changelog.sh add --category Added --reference ISSUE-001 --message "User authentication system"

# Generate entry from specific commit
./scripts/ai-update-changelog.sh from-commit HEAD

# Generate from issue file
./scripts/ai-update-changelog.sh from-issue deliverables/auth/issues/001/ISSUE-001-plan.md

# Audit for missing entries
./scripts/ai-update-changelog.sh audit
```

**Features**:
- Intelligent commit analysis for changelog suggestions
- Proper categorization (Added, Changed, Fixed, Removed, Deprecated, Security)
- Breaking change detection and marking
- Integration with deliverables and issue tracking
- Pre-commit validation support

#### 🔍 `ai-changelog-audit.sh` - Changelog Completeness Auditor
Audits changelog for missing entries by analyzing git history and commits.

**Purpose**: Ensure changelog completeness by identifying commits that should have changelog entries.

**Usage**:
```bash
# Basic audit from last release
./scripts/ai-changelog-audit.sh

# Audit specific time period
./scripts/ai-changelog-audit.sh --since "v1.0.0"

# Include all commit types
./scripts/ai-changelog-audit.sh --include-all

# Generate audit report
./scripts/ai-changelog-audit.sh --report audit-report.md
```

**Features**:
- Git history analysis for missing changelog entries
- Intelligent filtering of commit types (feature, fix, breaking changes)
- Suggestion generation for missing entries
- Integration with release workflow
- Configurable audit rules and exceptions

#### ✅ `check-changelog.sh` - Changelog Format Validator
Validates changelog format, structure, and compliance with Keep a Changelog standard.

**Purpose**: Ensure changelog follows proper format and contains required sections.

**Usage**:
```bash
# Basic format validation
./scripts/check-changelog.sh

# Validate specific changelog file
./scripts/check-changelog.sh --file CHANGELOG.md

# Check for unreleased section
./scripts/check-changelog.sh --require-unreleased

# Validate before release
./scripts/check-changelog.sh --validate-release
```

**Features**:
- Keep a Changelog format validation
- Section structure verification (Added, Changed, Fixed, etc.)
- Link validation for version references
- Unreleased section requirement checking
- Integration with release workflow validation

#### 🚀 `release.sh` - Automated Release Management
Automates the complete release process from changelog to git tagging and publishing.

**Purpose**: Create releases with proper versioning, changelog updates, and git tag management.

**Usage**:
```bash
# Create new release
./scripts/release.sh 1.2.0

# Preview release without changes
./scripts/release.sh 1.2.0 --dry-run

# Release without pushing to remote
./scripts/release.sh 1.2.0 --no-push

# Skip git tag creation
./scripts/release.sh 1.2.0 --no-tag
```

**Features**:
- Semantic version validation
- Automatic changelog section creation from [Unreleased]
- Git tag creation and annotation
- Release branch management
- Integration with CI/CD workflows
- Rollback capabilities for failed releases

### Quality Assurance & Validation

#### 🛡️ `validate-quality-gates.sh` - Workflow Quality Gate Validator
Validates quality gates between workflow phases to ensure standards compliance.

**Purpose**: Enforce quality standards at each phase boundary in the /iterate workflow.

**Usage**:
```bash
# Validate current phase quality gates
./scripts/validate-quality-gates.sh

# Validate specific phase
./scripts/validate-quality-gates.sh --phase P1

# Skip specific checks
./scripts/validate-quality-gates.sh --skip-tests

# Generate validation report
./scripts/validate-quality-gates.sh --report quality-report.md
```

**Features**:
- Multi-phase quality validation (P1, P2, P3)
- Test coverage verification
- Code quality metrics checking
- Documentation completeness validation
- Security compliance verification
- Integration with /iterate workflow

#### 🔎 `validate-agent-output.sh` - Agent Response Validator
Validates agent outputs for completeness, format, and quality standards.

**Purpose**: Ensure agent responses meet quality standards and contain required information.

**Usage**:
```bash
# Validate agent output file
./scripts/validate-agent-output.sh --file agent-output.md

# Validate specific agent type output
./scripts/validate-agent-output.sh --agent backend-specialist --file output.md

# Validate HANDOFF.yml entry
./scripts/validate-agent-output.sh --handoff deliverables/auth/issues/001/HANDOFF.yml

# Strict validation mode
./scripts/validate-agent-output.sh --strict --file output.md
```

**Features**:
- Agent-specific output format validation
- Required section verification
- Technical detail completeness checking
- HANDOFF.yml format validation
- Integration with post-agent validation hooks

#### 📋 `validate-context.sh` - Context File Validator
Validates HANDOFF.yml and RESEARCH.md files for proper format and completeness.

**Purpose**: Ensure workflow context files maintain proper structure and required information.

**Usage**:
```bash
# Validate context files in current directory
./scripts/validate-context.sh

# Validate specific HANDOFF.yml
./scripts/validate-context.sh --handoff deliverables/auth/issues/001/HANDOFF.yml

# Validate RESEARCH.md file
./scripts/validate-context.sh --research deliverables/auth/issues/001/RESEARCH.md

# Validate entire deliverable
./scripts/validate-context.sh --deliverable auth/issues/001
```

**Features**:
- YAML format validation for HANDOFF.yml
- Required field verification
- Markdown structure validation for RESEARCH.md
- Cross-reference validation between files
- Integration with workflow state management

#### 💡 `remediation-advisor.sh` - Issue Resolution Assistant
Suggests fixes and remediation steps for common validation failures and workflow issues.

**Purpose**: Provide intelligent suggestions for resolving workflow and validation issues.

**Usage**:
```bash
# Analyze current issues and suggest fixes
./scripts/remediation-advisor.sh

# Get remediation for specific error
./scripts/remediation-advisor.sh --error "validation-failed"

# Analyze specific file for issues
./scripts/remediation-advisor.sh --file HANDOFF.yml

# Generate remediation report
./scripts/remediation-advisor.sh --report remediation-plan.md
```

**Features**:
- Intelligent error analysis and categorization
- Step-by-step remediation instructions
- Integration with validation scripts
- Common issue pattern recognition
- Automated fix suggestions where possible

### Setup & Configuration Scripts

#### ⚙️ `setup-git-hooks.sh` - Git Hooks Configuration
Configures git hooks for automated validation and workflow enforcement.

**Purpose**: Set up git hooks to enforce quality standards and workflow compliance.

**Usage**:
```bash
# Install all git hooks
./scripts/setup-git-hooks.sh

# Install specific hook type
./scripts/setup-git-hooks.sh --type pre-commit

# Force overwrite existing hooks
./scripts/setup-git-hooks.sh --force

# Uninstall all hooks
./scripts/setup-git-hooks.sh --uninstall
```

**Features**:
- Pre-commit validation hook installation
- Pre-push quality gate enforcement
- Commit message format validation
- Integration with workflow validation scripts
- Backup and restore of existing hooks

#### 📚 `auto-docs-generator.js` - Automatic Documentation Generator
Generates architectural documentation automatically from codebase analysis and templates.

**Purpose**: Create and maintain technical documentation through automated analysis and generation.

**Usage**:
```bash
# Generate all documentation types
node scripts/auto-docs-generator.js --type all

# Generate specific documentation
node scripts/auto-docs-generator.js --type tech-stack
node scripts/auto-docs-generator.js --type system-overview
node scripts/auto-docs-generator.js --type dependencies

# Use custom template
node scripts/auto-docs-generator.js --type tech-stack --template custom-template.md

# Output to specific directory
node scripts/auto-docs-generator.js --type all --output docs/generated/
```

**Features**:
- Technology stack documentation generation
- System overview and architecture diagrams
- Dependency graph creation
- Template-based documentation generation
- Integration with docs-manager.sh auto-docs command
- Automatic codebase analysis and pattern detection

### Git Hook Validation Scripts

The `hooks/` subdirectory contains specialized validation scripts that integrate with git hooks for automated quality enforcement:

#### 🔒 `hooks/pre-task-validation.sh` - Pre-Task Execution Validator
Validates system state and requirements before task execution in /iterate workflow.

**Purpose**: Ensure proper setup and context before agent task execution.

**Features**:
- Environment validation
- Required file existence checking
- Context file format validation
- Dependency verification

#### ✏️ `hooks/pre-edit-validation.sh` - Pre-Edit File Validator
Validates files and permissions before allowing edits during workflow execution.

**Purpose**: Prevent destructive edits and ensure file integrity.

**Features**:
- File permission validation
- Backup creation before edits
- Critical file protection
- Edit scope validation

#### ✅ `hooks/post-agent-validation.sh` - Post-Agent Output Validator
Validates agent outputs and updates workflow state after agent completion.

**Purpose**: Ensure agent work meets quality standards before workflow progression.

**Features**:
- Agent output format validation
- Workflow state updates
- Quality gate enforcement
- HANDOFF.yml updates

#### 🔄 `hooks/workflow-state-check.sh` - Workflow State Consistency Checker
Validates workflow state consistency across all coordination files.

**Purpose**: Maintain consistency between PLAN.md, HANDOFF.yml, and RESEARCH.md.

**Features**:
- Cross-file consistency validation
- State synchronization checking
- Progress tracking validation
- Workflow integrity enforcement

### Support Libraries

#### 🎨 `lib/colors.sh` - Color Management
Provides consistent color formatting and emoji support across all shell scripts.

**Features**:
- Terminal color detection and fallback
- Comprehensive color palette (basic, bright, background colors)
- Text formatting (bold, italic, underline)
- Emoji support with ASCII fallbacks
- Exported color functions for easy use

#### 📜 `lib/logging.sh` - Logging Framework
Comprehensive logging system with multiple levels and output formats.

**Features**:
- Multiple log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- JSON and human-readable output formats
- File logging support
- Progress bars and spinners
- Status logging functions (success, failure, skip)
- Header and section formatting

## Prerequisites

### Required Tools
- **Git** - Required for all Git-related operations
- **Bash 4.0+** - For shell script execution

### Optional Tools
- **Node.js 14+** - Required for JavaScript-based scripts
- **Docker** - Optional, for containerized development
- **jq** - Optional, for JSON processing in advanced scenarios

## Installation and Setup

### Quick Start
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run quick setup
./scripts/setup-manager.sh quick

# Check status
./scripts/ai-status.sh
```

### Full Development Setup
```bash
# Complete setup with all tools
./scripts/setup-manager.sh full --verbose

# Initialize documentation structure
./scripts/docs-manager.sh init

# Run health checks
node scripts/docs-health.js
```

## Common Workflows

### New Project Setup
1. **Initial Setup**: `./scripts/setup-manager.sh full`
2. **Initialize Docs**: `./scripts/docs-manager.sh init`
3. **Verify Setup**: `./scripts/setup-manager.sh check`
4. **Check Status**: `./scripts/ai-status.sh`

### Documentation Maintenance
1. **Health Check**: `node scripts/docs-health.js`
2. **Link Validation**: `node scripts/check-docs-links.js --external`
3. **Generate Content**: `node scripts/generate-doc.js`
4. **Track Changes**: `node scripts/docs-changelog.js --since "1 week ago"`

### Pre-Commit Validation
```bash
# Validate documentation before commit
./scripts/docs-manager.sh validate

# Check all links
node scripts/check-docs-links.js --quiet

# Quick status check
./scripts/ai-status.sh --git-only
```

### CI/CD Integration
```bash
# Status check for AI assistants
./scripts/ai-status.sh --ai-format

# Generate reports for artifacts
node scripts/docs-health.js
node scripts/check-docs-links.js --format json --output reports/links.json
```

## Configuration

### Environment Variables
```bash
# Logging configuration
export LOG_LEVEL=INFO          # DEBUG|INFO|WARNING|ERROR|CRITICAL
export LOG_FILE=logs/script.log # Optional file logging
export LOG_JSON=false          # Enable JSON logging format

# Color and emoji support
export COLOR_SUPPORT=true      # Auto-detected, can override
export EMOJI_SUPPORT=true      # Auto-detected, can override
```

### Script Options
Most scripts support common options:
- `--verbose` - Detailed output
- `--quiet` - Minimal output
- `--help` - Usage information
- `--format` - Output format (where applicable)

## Output and Reports

### Generated Files
- `docs/reports/documentation-health.md` - Health dashboard report
- `docs/reports/*.json` - JSON format reports
- `.env` and `.env.local` - Environment configuration files

### Report Formats
- **Human-readable** - Default console output with colors and formatting
- **AI-optimized** - Structured text format for AI consumption
- **JSON** - Machine-readable format for programmatic access
- **Markdown** - Documentation-friendly format for reports

## Troubleshooting

### Common Issues

#### Permission Denied
```bash
# Make scripts executable
chmod +x scripts/*.sh
chmod +x scripts/lib/*.sh
```

#### Node.js Scripts Not Working
```bash
# Check Node.js installation
node --version

# Install dependencies if package.json exists
npm install
```

#### Git Operations Failing
```bash
# Initialize git repository
git init

# Configure git user (if not set globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

#### Colors Not Showing
```bash
# Force color support
export COLOR_SUPPORT=true

# Or disable colors
./scripts/ai-status.sh --no-color
```

### Debug Mode
Enable verbose logging for troubleshooting:
```bash
export LOG_LEVEL=DEBUG
./scripts/setup-manager.sh full --verbose
```

## Contributing

When adding new scripts:

1. **Follow naming conventions**: Use kebab-case for script names
2. **Source shared libraries**: Use `lib/colors.sh` and `lib/logging.sh`
3. **Include usage help**: Implement `--help` option with clear examples
4. **Add error handling**: Use proper exit codes and error messages
5. **Update this README**: Document new scripts and their usage
6. **Test thoroughly**: Verify scripts work in different environments

### Script Template
```bash
#!/bin/bash
# Script description
# Usage: ./scripts/script-name.sh [options]

set -e

# Source shared libraries
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/colors.sh"
source "$SCRIPT_DIR/lib/logging.sh"

# Your script logic here
```

## Integration with AI Tools

These scripts are designed to work seamlessly with AI coding assistants:

- **Status reporting** in AI-friendly formats
- **Structured output** for easy parsing
- **Comprehensive logging** for debugging
- **Consistent interfaces** across all scripts
- **Machine-readable reports** for automated analysis

Use `./scripts/ai-status.sh --ai-format` to get current project status in a format optimized for AI consumption.

---

*This documentation is maintained automatically. Last updated: $(date)*
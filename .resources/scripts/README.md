---
version: "0.2.1"
created: "2025-08-21"
last_updated: "2025-09-19"
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
./.resources/scripts/ai-status.sh

# AI-optimized format
./.resources/scripts/ai-status.sh --ai-format

# JSON output for programmatic access
./.resources/scripts/ai-status.sh --json

# Markdown format for documentation
./.resources/scripts/ai-status.sh --markdown --timestamp

# Component-specific checks
./.resources/scripts/ai-status.sh --git-only
./.resources/scripts/ai-status.sh --project-only
./.resources/scripts/ai-status.sh --env-only
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
./.resources/scripts/setup-manager.sh quick

# Complete development environment setup
./.resources/scripts/setup-manager.sh full --verbose

# Setup specific components
./.resources/scripts/setup-manager.sh env --force
./.resources/scripts/setup-manager.sh git
./.resources/scripts/setup-manager.sh tools

# Verify setup completeness
./.resources/scripts/setup-manager.sh check
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
./.resources/scripts/docs-manager.sh init

# Check documentation health
./.resources/scripts/docs-manager.sh health

# Validate documentation for commits
./.resources/scripts/docs-manager.sh validate

# Check and fix broken links
./.resources/scripts/docs-manager.sh check --fix-auto --verbose

# Clean generated documentation files
./.resources/scripts/docs-manager.sh clean
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
node .resources/scripts/check-docs-links.js

# Check external links (slower but comprehensive)
node .resources/scripts/check-docs-links.js --external

# Generate JSON report
node .resources/scripts/check-docs-links.js --format json --output link-report.json

# Auto-fix obvious issues
node .resources/scripts/check-docs-links.js --fix

# Quiet mode for CI/CD
node .resources/scripts/check-docs-links.js --quiet
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
node .resources/scripts/docs-health.js
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
node .resources/scripts/docs-changelog.js

# Custom time range
node .resources/scripts/docs-changelog.js --since "7 days ago"

# Filter by author
node .resources/scripts/docs-changelog.js --author "username"

# Generate detailed report
node .resources/scripts/docs-changelog.js --detailed --format json --output changelog.json
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
node .resources/scripts/generate-doc.js

# Use specific template
node .resources/scripts/generate-doc.js --template feature

# Preview without writing
node .resources/scripts/generate-doc.js --template api --preview

# Specify output file
node .resources/scripts/generate-doc.js --template guide --output docs/development/guidelines/my-guide.md

# List available templates
node .resources/scripts/generate-doc.js --list
```

**Features**:
- Template-based documentation generation
- Interactive variable substitution
- Smart filename suggestions
- Preview mode for testing
- Automatic directory creation
- Template variable extraction and defaults

### 📊 Analytics & Metrics Scripts

#### 📈 `metrics/generate-report.sh` - Metrics Analytics and Reporting
Generates comprehensive analytics reports from collected usage metrics to provide actionable insights for workflow optimization.

**Purpose**: Transform raw metrics data into actionable insights for improving AI-assisted development workflows.

**Usage**:
```bash
# Generate weekly summary report
./resources/scripts/metrics/generate-report.sh --period 7d --type summary

# Detailed monthly analysis with JSON output
./resources/scripts/metrics/generate-report.sh --period 30d --type detailed --format json

# Export metrics to file for external analysis
./resources/scripts/metrics/generate-report.sh --output team-metrics.html --format html

# Agent-specific performance report
./resources/scripts/metrics/generate-report.sh --type agent-effectiveness --period 30d
```

**Features**:
- Multiple output formats (text, JSON, CSV, HTML)
- Configurable time periods (1d, 7d, 30d, 90d)
- Command, agent, and script effectiveness analysis
- Workflow bottleneck identification
- Team productivity insights

#### 🔍 `metrics/query-metrics.sh` - Metrics Data Exploration
Flexible querying tool for exploring and filtering metrics data with statistical analysis capabilities.

**Purpose**: Enable detailed exploration and analysis of collected metrics data for optimization insights.

**Usage**:
```bash
# Query command metrics from last 30 days
./resources/scripts/metrics/query-metrics.sh --type command --range 30d --stats

# Analyze failed operations
./resources/scripts/metrics/query-metrics.sh --status failed --range 7d --format csv

# Agent utilization analysis
./resources/scripts/metrics/query-metrics.sh --type agent --stats --format json

# Top 10 most used commands
./resources/scripts/metrics/query-metrics.sh --type command --limit 10 --sort usage
```

**Features**:
- Flexible filtering by type, status, date range
- Statistical analysis with averages and percentiles
- Multiple output formats for integration
- Complex queries for pattern analysis
- Performance and usage trend identification

#### 🎯 `metrics/wrap-script.sh` - Script Execution Tracker
Wraps any script execution with comprehensive metrics collection for automation insights.

**Purpose**: Automatically collect performance and execution metrics for any script to optimize automation workflows.

**Usage**:
```bash
# Wrap setup script with metrics
./resources/scripts/metrics/wrap-script.sh setup ./setup-project.sh

# Track quality validation with category
./resources/scripts/metrics/wrap-script.sh quality ./validate-code.sh --strict

# Monitor CI/CD scripts
./resources/scripts/metrics/wrap-script.sh ci-build npm run build
```

**Features**:
- Automatic execution time tracking
- Success/failure rate monitoring
- Resource usage measurement
- Exit code and error pattern analysis
- Integration with metrics database

#### ⚙️ `metrics/metrics-collector.sh` - Core Metrics Infrastructure
Core metrics collection functions and utilities used by all other metrics scripts for consistent data gathering.

**Purpose**: Provide centralized, consistent metrics collection infrastructure for commands, agents, and scripts.

**Features**:
- Session ID management for correlation
- Standardized JSON schema validation
- Configurable collection levels (basic/detailed/debug)
- Privacy controls and data exclusion patterns
- Automatic data cleanup and retention management

**Usage**: Typically sourced by other scripts rather than called directly:
```bash
# In command or agent scripts
source .resources/scripts/metrics/metrics-collector.sh
collect_metrics "command" "/architect" "completed" 12500 '["opus"]' '["code-architect"]'
```

### Workflow & Planning Scripts

#### 🧠 `smart-task-decomposition.sh` - Intelligent Task Complexity Analysis & Breakdown
Advanced task analysis with automatic complexity scoring and context-aware decomposition patterns, integrated with `/plan` and `/develop` commands for seamless workflow optimization.

**Purpose**: Automatically detect task complexity, suggest decomposition strategies, and provide recovery recommendations during development failures.

**Enhanced Usage (v0.2.0)**:
```bash
# Standalone complexity analysis
./.resources/scripts/workflow/smart-task-decomposition.sh --task P1.3.1 --description "Implement user auth"

# Integration with /plan command (automatic)
./.resources/scripts/workflow/smart-task-decomposition.sh --task P1.3.1 --plan-integration --description "Multi-domain task"

# Integration with /develop command for failure recovery (automatic)
./.resources/scripts/workflow/smart-task-decomposition.sh --task P1.3.1 --develop-integration --failure-reason "too complex"

# Auto-decomposition with immediate PLAN.md updates
./.resources/scripts/workflow/smart-task-decomposition.sh --task P1.3.1 --auto-decompose
```

**🎯 Enhanced Features (v0.2.0)**:

#### **Intelligent Complexity Scoring System**
- **Multi-domain integration** (+3 points): API + Database + Frontend combinations
- **Security implementation** (+2 points): Authentication, authorization, encryption
- **Database schema changes** (+2 points): Migrations, schema modifications
- **External integrations** (+2 points): Third-party services, API connections
- **Performance optimization** (+2 points): Scaling, bottleneck resolution
- **UI/UX implementation** (+1 point): Component design, user interface
- **Testing requirements** (+1 point): Test implementation and validation

#### **Command Integration Modes**
- **`--plan-integration`**: Proactive complexity assessment during planning phase
  - **High complexity (≥5)**: "Break into subtasks before development"
  - **Medium complexity (3-4)**: "Consider 2-3 focused subtasks"
  - **Appropriate complexity (<3)**: "Well-scoped for single agent execution"

- **`--develop-integration`**: Reactive failure recovery during development
  - **High complexity confirmed**: "Pause and decompose immediately"
  - **Medium complexity**: "Consider agent handoff or subtask breakdown"
  - **Complexity not the issue**: "Investigate other failure causes"

#### **Context-Aware Decomposition Patterns**
- **API Implementation**: Design → Core Logic → Auth/Validation → Testing
- **Database Work**: Schema Design → Data Access → Validation → Performance
- **Frontend Components**: Architecture → UI Implementation → State Management → Responsive Design
- **Security Features**: Threat Analysis → Implementation → Authorization → Security Testing
- **Integrations**: Research/Planning → Client Implementation → Error Handling → Integration Testing

#### **Automatic Agent Assignment**
- Subtasks include `<!--agent:specialist-name-->` hints for optimal agent selection
- Domain-specific specialist recommendations based on task type
- Integration with existing agent coordination system

**Legacy Features** (maintained for backward compatibility):
- Phase-based organization (P1.X.X, P2.X.X, P3.X.X)
- Dependency analysis and sequencing
- Integration with PLAN.md format for development execution
- Manual feature decomposition from descriptions

**Integration Benefits**:
- **Proactive Planning**: Complexity detected during `/plan` prevents development failures
- **Smart Recovery**: Failed `/develop` tasks automatically analyzed for recovery options
- **Seamless Workflow**: No manual intervention required for complexity analysis
- **Quality Improvement**: Better task scoping leads to higher success rates

#### 💡 `remediation-advisor.sh` - Issue Resolution Assistant
Suggests fixes and remediation steps for common validation failures and workflow issues.

**Purpose**: Provide intelligent suggestions for resolving workflow and validation issues.

**Usage**:
```bash
# Analyze current issues and suggest fixes
./.resources/scripts/workflow/remediation-advisor.sh

# Get remediation for specific error
./.resources/scripts/workflow/remediation-advisor.sh --error "validation-failed"

# Analyze specific file for issues
./.resources/scripts/workflow/remediation-advisor.sh --file output.md

# Generate remediation report
./.resources/scripts/workflow/remediation-advisor.sh --report remediation-plan.md
```

**Features**:
- Intelligent error analysis and categorization
- Step-by-step remediation instructions
- Integration with validation scripts
- Common issue pattern recognition
- Automated fix suggestions where possible

### Changelog & Release Management

#### 📝 `ai-update-changelog.sh` - AI-Friendly Changelog Assistant
Helps AI coding assistants generate and add changelog entries with proper categorization.

**Purpose**: Streamline changelog maintenance with AI-assisted entry generation and validation.

**Usage**:
```bash
# Analyze recent commits and suggest entries
./.resources/scripts/ai-update-changelog.sh analyze --since '1 week ago'

# Add entry interactively
./.resources/scripts/ai-update-changelog.sh add --category Added --reference ISSUE-001 --message "User authentication system"

# Generate entry from specific commit
./.resources/scripts/ai-update-changelog.sh from-commit HEAD

# Generate from issue file
./.resources/scripts/ai-update-changelog.sh from-issue deliverables/auth/issues/001/ISSUE-001-plan.md

# Audit for missing entries
./.resources/scripts/ai-update-changelog.sh audit
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
./.resources/scripts/ai-changelog-audit.sh

# Audit specific time period
./.resources/scripts/ai-changelog-audit.sh --since "v1.0.0"

# Include all commit types
./.resources/scripts/ai-changelog-audit.sh --include-all

# Generate audit report
./.resources/scripts/ai-changelog-audit.sh --report audit-report.md
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
./.resources/scripts/check-changelog.sh

# Validate specific changelog file
./.resources/scripts/check-changelog.sh --file CHANGELOG.md

# Check for unreleased section
./.resources/scripts/check-changelog.sh --require-unreleased

# Validate before release
./.resources/scripts/check-changelog.sh --validate-release
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
./.resources/scripts/release.sh 1.2.0

# Preview release without changes
./.resources/scripts/release.sh 1.2.0 --dry-run

# Release without pushing to remote
./.resources/scripts/release.sh 1.2.0 --no-push

# Skip git tag creation
./.resources/scripts/release.sh 1.2.0 --no-tag
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

**Purpose**: Enforce quality standards at each phase boundary in the development workflow.

**Usage**:
```bash
# Validate current phase quality gates
./.resources/scripts/validate-quality-gates.sh

# Validate specific phase
./.resources/scripts/validate-quality-gates.sh --phase P1

# Skip specific checks
./.resources/scripts/validate-quality-gates.sh --skip-tests

# Generate validation report
./.resources/scripts/validate-quality-gates.sh --report quality-report.md
```

**Features**:
- Multi-phase quality validation (P1, P2, P3)
- Test coverage verification
- Code quality metrics checking
- Documentation completeness validation
- Security compliance verification
- Integration with development workflow

#### 🔎 `validate-agent-output.sh` - Agent Response Validator
Validates agent outputs for completeness, format, and quality standards.

**Purpose**: Ensure agent responses meet quality standards and contain required information.

**Usage**:
```bash
# Validate agent output file
./.resources/scripts/validate-agent-output.sh --file agent-output.md

# Validate specific agent type output
./.resources/scripts/validate-agent-output.sh --agent backend-specialist --file output.md

# Validate HANDOFF.yml entry
./.resources/scripts/validate-agent-output.sh --handoff deliverables/auth/issues/001/HANDOFF.yml

# Strict validation mode
./.resources/scripts/validate-agent-output.sh --strict --file output.md
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
./.resources/scripts/validate-context.sh

# Validate specific HANDOFF.yml
./.resources/scripts/validate-context.sh --handoff deliverables/auth/issues/001/HANDOFF.yml

# Validate RESEARCH.md file
./.resources/scripts/validate-context.sh --research deliverables/auth/issues/001/RESEARCH.md

# Validate entire deliverable
./.resources/scripts/validate-context.sh --deliverable auth/issues/001
```

**Features**:
- YAML format validation for HANDOFF.yml
- Required field verification
- Markdown structure validation for RESEARCH.md
- Cross-reference validation between files
- Integration with workflow state management


### Setup & Configuration Scripts

#### ⚙️ `setup-git-hooks.sh` - Git Hooks Configuration
Configures git hooks for automated validation and workflow enforcement.

**Purpose**: Set up git hooks to enforce quality standards and workflow compliance.

**Usage**:
```bash
# Install all git hooks
./.resources/scripts/setup-git-hooks.sh

# Install specific hook type
./.resources/scripts/setup-git-hooks.sh --type pre-commit

# Force overwrite existing hooks
./.resources/scripts/setup-git-hooks.sh --force

# Uninstall all hooks
./.resources/scripts/setup-git-hooks.sh --uninstall
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
node .resources/scripts/auto-docs-generator.js --type all

# Generate specific documentation
node .resources/scripts/auto-docs-generator.js --type tech-stack
node .resources/scripts/auto-docs-generator.js --type system-overview
node .resources/scripts/auto-docs-generator.js --type dependencies

# Use custom template
node .resources/scripts/auto-docs-generator.js --type tech-stack --template custom-template.md

# Output to specific directory
node .resources/scripts/auto-docs-generator.js --type all --output docs/generated/
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
Validates system state and requirements before task execution in development workflow.

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
chmod +x .resources/scripts/*.sh

# Run quick setup
./.resources/scripts/setup-manager.sh quick

# Check status
./.resources/scripts/ai-status.sh
```

### Full Development Setup
```bash
# Complete setup with all tools
./.resources/scripts/setup-manager.sh full --verbose

# Initialize documentation structure
./.resources/scripts/docs-manager.sh init

# Run health checks
node .resources/scripts/docs-health.js
```

## Common Workflows

### New Project Setup
1. **Initial Setup**: `./.resources/scripts/setup-manager.sh full`
2. **Initialize Docs**: `./.resources/scripts/docs-manager.sh init`
3. **Verify Setup**: `./.resources/scripts/setup-manager.sh check`
4. **Check Status**: `./.resources/scripts/ai-status.sh`

### Documentation Maintenance
1. **Health Check**: `node .resources/scripts/docs-health.js`
2. **Link Validation**: `node .resources/scripts/check-docs-links.js --external`
3. **Generate Content**: `node .resources/scripts/generate-doc.js`
4. **Track Changes**: `node .resources/scripts/docs-changelog.js --since "1 week ago"`

### Pre-Commit Validation
```bash
# Validate documentation before commit
./.resources/scripts/docs-manager.sh validate

# Check all links
node .resources/scripts/check-docs-links.js --quiet

# Quick status check
./.resources/scripts/ai-status.sh --git-only
```

### CI/CD Integration
```bash
# Status check for AI assistants
./.resources/scripts/ai-status.sh --ai-format

# Generate reports for artifacts
node .resources/scripts/docs-health.js
node .resources/scripts/check-docs-links.js --format json --output reports/links.json
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
chmod +x .resources/scripts/*.sh
chmod +x .resources/scripts/lib/*.sh
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
./.resources/scripts/ai-status.sh --no-color
```

### Debug Mode
Enable verbose logging for troubleshooting:
```bash
export LOG_LEVEL=DEBUG
./.resources/scripts/setup-manager.sh full --verbose
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
# Usage: ./.resources/scripts/script-name.sh [options]

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

Use `./.resources/scripts/ai-status.sh --ai-format` to get current project status in a format optimized for AI consumption.

---

*This documentation is maintained automatically. Last updated: $(date)*
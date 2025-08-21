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
node scripts/generate-doc.js --template guide --output docs/guides/my-guide.md

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
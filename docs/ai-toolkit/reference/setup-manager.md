---
title: "Setup Manager - Intelligent Project Initialization"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "reference"
priority: "high"
tags: ["setup", "initialization", "intelligent-onboarding", "project-transformation"]
---

# Setup Manager - Intelligent Project Initialization

The Setup Manager (`./scripts/setup-manager.sh`) is the AI Coding Template's intelligent project initialization system. It transforms the template from a generic starting point into a professionally configured project tailored to your specific needs.

## 🚀 Quick Start

```bash
# Intelligent project initialization (recommended)
./scripts/setup-manager.sh init-project

# Quick setup (preserves template as-is)
./scripts/setup-manager.sh quick

# Full development environment setup
./scripts/setup-manager.sh full

# Verify setup completeness
./scripts/setup-manager.sh check
```

## 🧠 Intelligent Features

### 1. Claude Code Integration
- **Automatic Detection**: Verifies Claude Code installation and compatibility
- **Installation Guidance**: Interactive help if Claude Code is missing
- **Version Verification**: Ensures you have the right version for AI workflows

### 2. Smart Project Discovery
The system intelligently discovers your project requirements through guided questions:

#### **Project Types**
- **Web Application**: React/Vue/Angular frontend applications
- **API Service**: RESTful APIs and microservices
- **CLI Tool**: Command-line interfaces and utilities
- **Library**: NPM packages and reusable code libraries
- **Mobile App**: React Native/Flutter mobile applications
- **Enterprise**: Large-scale enterprise applications

#### **Business Context**
- **B2B SaaS**: Business-to-business software as a service
- **Consumer**: Direct-to-consumer applications
- **Internal Tools**: Company internal systems
- **Open Source**: Community-driven projects
- **Educational**: Learning and teaching platforms
- **Research**: Academic and research projects

#### **Team Structure**
- **Solo Developer**: Individual contributor (1 person)
- **Small Team**: Startup or small team (2-5 people)
- **Medium Team**: Growing company (6-15 people)
- **Large Team**: Enterprise organization (16+ people)

### 3. External System Integration
Automatically configures integration with your existing development tools:

#### **Project Management Systems**
- **Jira**: Enterprise project management
- **Linear**: Modern issue tracking
- **GitHub Issues**: Integrated GitHub workflows
- **Asana**: Team collaboration and planning

#### **Documentation Systems**
- **Confluence**: Enterprise documentation
- **Notion**: All-in-one workspace
- **GitBook**: Beautiful documentation
- **Git/Markdown**: Simple file-based docs

### 4. Context-Aware Generation
Generates professional project documentation tailored to your specific project type and business context:

#### **Industry-Standard README**
- **Project-Type Specific**: Sections relevant to web apps vs APIs vs CLI tools
- **Business Context Aware**: Different features for B2B SaaS vs consumer products
- **External Tool Integration**: Links to your Jira, Confluence, etc.
- **Professional Format**: Following industry best practices

#### **Comprehensive Project Vision**
- **Business Analysis**: Problem statement, target audience, competitive landscape
- **Technical Architecture**: Principles and constraints based on project type
- **Success Metrics**: KPIs relevant to your business context
- **Risk Assessment**: Technical and business risks with mitigation strategies

## 📋 Command Reference

### `init-project` - Intelligent Project Initialization

Transform the template into your real project with AI-guided setup.

```bash
./scripts/setup-manager.sh init-project [--force]
```

**What it does:**
1. **Environment Verification**: Checks Claude Code installation
2. **Project Discovery**: Guided questions about project type and context
3. **External Integration**: Configures PM and documentation systems
4. **Professional Documentation**: Generates project-specific README and vision
5. **Template Preservation**: Moves template docs to `docs/ai-toolkit/`
6. **AI Configuration**: Updates CLAUDE.md with project context

**Options:**
- `--force`: Reinitialize even if project was already initialized

### `quick` - Quick Setup

Minimal setup for developers who want to preserve the template as-is.

```bash
./scripts/setup-manager.sh quick [options]
```

**What it does:**
- Verifies prerequisites (Node.js, Git, Docker)
- Sets up environment files (.env, .env.local)
- Configures git hooks and basic settings
- Installs dependencies if package.json exists

### `full` - Complete Development Environment

Comprehensive setup including all development tools and configurations.

```bash
./scripts/setup-manager.sh full [options]
```

**What it does:**
- Everything from `quick` setup
- Verifies and installs development tools
- Configures advanced git settings
- Sets up comprehensive environment

### `check` - Verify Setup

Validates that your development environment is properly configured.

```bash
./scripts/setup-manager.sh check
```

**Checks:**
- Prerequisites (Node.js, npm, Git, Docker)
- Environment files existence and validity
- Git configuration
- Development tools availability

### Individual Component Setup

```bash
# Environment files only
./scripts/setup-manager.sh env [--force]

# Git configuration only
./scripts/setup-manager.sh git

# Development tools only
./scripts/setup-manager.sh tools
```

## 🎯 Global Options

- `--skip-tools`: Skip development tool installation checks
- `--skip-git`: Skip git configuration steps
- `--force`: Force overwrite existing configurations
- `--verbose`: Show detailed output for debugging

## 🔄 Template → Project Transformation

### Before Transformation
```
ai-coding-template/
├── README.md              # Template documentation
├── START-HERE.md          # Template getting started
├── TEMPLATES-INDEX.md     # Template catalog
└── ...
```

### After `init-project`
```
my-awesome-project/
├── README.md              # YOUR project documentation
├── docs/
│   ├── technical/
│   │   └── project-vision.md    # Comprehensive project vision
│   └── ai-toolkit/
│       ├── template-documentation.md     # Archived template README
│       ├── getting-started-with-template.md  # Archived START-HERE
│       └── templates-and-examples.md     # Archived template index
├── CLAUDE.md              # Updated with YOUR project context
├── STATUS.md              # Initialized with YOUR project state
└── .template-initialized  # Marker file with project name
```

## 🎨 Template Customization

The system uses intelligent template substitution with 50+ variables:

### Project Information
- `{{PROJECT_NAME}}`: Your project name
- `{{PROJECT_DESCRIPTION}}`: Project description
- `{{PROJECT_SLUG}}`: URL-safe project identifier
- `{{REPO_URL}}`: Repository URL
- `{{LICENSE_TYPE}}`: License type

### Technical Stack
- `{{API_FRAMEWORK}}`: Express.js, Fastify, etc.
- `{{FRONTEND_FRAMEWORK}}`: React, Vue, Angular
- `{{DATABASE_TECH}}`: PostgreSQL, MongoDB, etc.
- `{{AUTH_STRATEGY}}`: JWT, OAuth, SAML

### Business Context
- `{{BUSINESS_CONTEXT}}`: B2B SaaS, consumer, etc.
- `{{TARGET_USERS}}`: Who uses this product
- `{{PM_SYSTEM}}`, `{{PM_URL}}`: Project management integration
- `{{DOCS_SYSTEM}}`, `{{DOCS_URL}}`: Documentation integration

## 🔧 Advanced Configuration

### Environment Variables

The system respects these environment variables for automation:

```bash
# External system configuration
export EXTERNAL_PM_SYSTEM="jira"
export EXTERNAL_PM_URL="https://company.atlassian.net"
export EXTERNAL_DOCS_SYSTEM="confluence"
export EXTERNAL_DOCS_URL="https://company.atlassian.net/wiki"

# Project defaults
export DEFAULT_PROJECT_TYPE="web-app"
export DEFAULT_BUSINESS_CONTEXT="b2b-saas"
export DEFAULT_TEAM_SIZE="small"
```

### Automation Mode

For CI/CD or scripted setup:

```bash
# Pre-answer questions via environment variables
export PROJECT_NAME="My Awesome Project"
export PROJECT_DESCRIPTION="A revolutionary new application"
export AUTHOR_NAME="John Doe"
export AUTHOR_EMAIL="john@company.com"

./scripts/setup-manager.sh init-project --force
```

## 🐛 Troubleshooting

### Common Issues

#### `log_color: command not found`
**Solution**: The color library isn't sourced properly
```bash
# Ensure the script is executable
chmod +x scripts/setup-manager.sh
chmod +x scripts/lib/colors.sh

# Verify the files exist
ls -la scripts/lib/
```

#### `Error at line 617: [[ -n "${LOG_FILE:-}" ]]` or Script Stops After Template Archiving
**Symptoms**: Script exits with LOG_FILE error or stops after "Archived template README" message
**Root Cause**: Empty LOG_FILE variable causing append operations to fail with `set -e`
**Solution**: This was fixed in the template - ensure you're using the latest version

```bash
# If you encounter this in an older copy, the fix involves updating logging.sh:
# Change all instances of:
[[ -n "${LOG_FILE:-}" ]] && echo "[SUCCESS] $*" >> "$LOG_FILE"

# To:
if [[ -n "${LOG_FILE:-}" ]]; then
    echo "[SUCCESS] $*" >> "${LOG_FILE}"
fi
```

**Fixed in Version**: All instances resolved as of September 2025

#### `Claude Code not found`
**Solution**: Install Claude Code following the interactive guidance
```bash
# The script will detect this and provide installation instructions
./scripts/setup-manager.sh init-project
```

#### `Template already initialized`
**Solution**: Use --force to reinitialize
```bash
./scripts/setup-manager.sh init-project --force
```

#### `Node.js/npm not found`
**Solution**: Install Node.js
```bash
# Visit https://nodejs.org/ or use a package manager
# Ubuntu/Debian
sudo apt update && sudo apt install nodejs npm

# macOS
brew install node

# Windows
# Download from https://nodejs.org/
```

### Debug Mode

Enable verbose output for debugging:

```bash
./scripts/setup-manager.sh init-project --verbose
```

## 📊 Project Types Deep Dive

### Web Application Template
**Perfect for**: Frontend applications, dashboards, e-commerce sites
**Includes**: React/Vue patterns, responsive design, performance metrics, analytics integration

### API Service Template
**Perfect for**: Microservices, REST APIs, backend services
**Includes**: OpenAPI documentation, authentication patterns, monitoring, database integration

### CLI Tool Template
**Perfect for**: Command-line utilities, developer tools, automation scripts
**Includes**: Command structure, help documentation, plugin system, distribution strategies

### Library Template
**Perfect for**: NPM packages, shared utilities, open-source libraries
**Includes**: TypeScript definitions, browser/Node.js support, semantic versioning, distribution

### Mobile App Template
**Perfect for**: React Native, Flutter applications
**Includes**: App store guidelines, performance metrics, device testing, platform-specific features

### Enterprise Template
**Perfect for**: Large-scale applications, enterprise systems
**Includes**: Security compliance, audit logging, multi-tenant architecture, integration patterns

## 🔗 Integration Examples

### Jira Integration
```bash
# During setup, provide:
Base URL: company.atlassian.net
Project Key: MYPROJ

# Results in README links:
Project Management: [Jira](https://company.atlassian.net/browse/MYPROJ)
```

### Confluence Integration
```bash
# During setup, provide:
Documentation System: Confluence
Base URL: company.atlassian.net/wiki

# Results in README links:
Wiki: [Confluence](https://company.atlassian.net/wiki)
```

## 🎯 Best Practices

### New Project Setup
1. **Start Fresh**: Clone to a new directory with your project name
2. **Use init-project**: Always use intelligent initialization for new projects
3. **Answer Honestly**: Provide accurate project type and business context
4. **Integrate Tools**: Connect your existing PM and documentation systems
5. **Review Results**: Check generated README and vision documents

### Team Onboarding
1. **Share Context**: The generated project-vision.md helps new team members
2. **Preserve Knowledge**: Template docs in docs/ai-toolkit/ provide ongoing reference
3. **Update STATUS.md**: Keep project memory current for AI assistants

### Existing Projects
1. **Use quick**: If adding to existing project, use quick setup to preserve structure
2. **Manual Integration**: Selectively copy relevant template pieces
3. **Documentation**: Use template docs as reference for improving existing docs

## 📚 Related Documentation

- **[Quick Start Guide](../setup/quick-start.md)** - Getting started with the template
- **[Command Reference](./commands.md)** - All available AI commands
- **[Project Templates](../guides/templates-and-examples.md)** - Template catalog
- **[Integration Guide](../setup/integration-guide.md)** - Adding to existing projects
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions

---

**💡 Pro Tip**: The setup manager gets smarter over time. Your answers help improve the template generation for future projects. Consider the intelligent setup as the foundation for building better software with AI assistance.
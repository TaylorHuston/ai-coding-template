# AI Coding Template

**Version**: 1.0.0
**Created**: 2025-08-21
**Last Updated**: 2025-08-22
**Status**: Active
**Target Audience**: Developers, Technical Writers, AI Assistants

This repo serves as a starter template for new projects working with AI coding tools. This is based on my own experiences and will be constantly evolving based on that. Designed primarily for working with Claude Code and VSCode, but should be easily adaptable to other tools. Also based off my discoveries, trials, headaches and dead ends from building a NextJS app, but I will try and keep this framework as tech-stack agnostic as possible.

## Quick Context

AI coding tools are simultaneously very powerful and very dumb. Sometimes it can feel like working with the world's dumbest toddler. A lot of that comes down to the fact that, somewhat counterintuitively, they don't have a very good memory. We tend to to think of computers of having amazing memories. Able to store terabytes of data with perfect recall. Much more than our fallable human brains ever could. But that just isn't the case when working with LLMs. LLMs have something called a "context window" that's actually fairly limited. What this means in the real world is that your tool will eventually start "forgetting" what it's already implemented. It will write duplicate code. It will write code that breaks other code. It will write code that doesn't follow your established best practices. It will forget rules and instructions that you give it. Etc. Having a good framework and established patterns can go a long way to mitigating that.

## Table of Contents

- [Why Use This Template?](#why-use-this-template)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Integrating into Existing Projects](#integrating-into-existing-projects)
- [Understanding AI-Assisted Development](#understanding-ai-assisted-development)
- [Understanding the AI Agent System](#understanding-the-ai-agent-system)
- [Project Structure](#project-structure)
- [Common Workflows](#common-workflows)
- [Best Practices for AI-Assisted Development](#best-practices-for-ai-assisted-development)
- [Tooling and Automation](#tooling-and-automation)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Learn More](#learn-more)

## Why Use This Template?

AI coding tools are powerful but have limitations. The biggest challenge? **Limited context windows** that cause AI assistants to "forget" previous implementations, leading to:

- 🔄 Duplicate code and broken integrations
- 🐛 Inconsistent patterns and forgotten best practices
- 📉 Degraded code quality over time
- 🤯 Frustration when AI contradicts previous decisions

**This template solves these problems** with:

- ✅ **17 Specialized AI Agents** for different development tasks
- ✅ **Smart Context Management** to preserve project knowledge
- ✅ **Automated Quality Gates** to maintain standards
- ✅ **Proven Workflow Patterns** for common development tasks
- ✅ **Professional Scripts** for automation and monitoring

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Git** (2.25 or higher) - [Install Git](https://git-scm.com/downloads)
- **Node.js** (16.x or higher) - [Install Node.js](https://nodejs.org/)
- **A code editor** (VS Code recommended) - [Install VS Code](https://code.visualstudio.com/)
- **Claude Code** account - [Sign up](https://claude.ai/code)
- **GitHub CLI** - [Install GitHub CLI](https://cli.github.com/)

### Optional but Recommended

- **Docker** (for containerized development) - [Install Docker](https://www.docker.com/get-started)

### Verify Installation

```bash
# Check Git
git --version

# Check Node.js
node --version

# Check npm
npm --version
```

## Quick Start

Get up and running in 5 minutes:

### 1. Clone the Template

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-coding-template.git my-project
cd my-project

# Remove the template's git history
rm -rf .git
git init
```

### 2. Run Initial Setup

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run quick setup (creates essential files and directories)
./scripts/setup-manager.sh quick

# Or run full setup with all features
./scripts/setup-manager.sh full --verbose
```

### 3. Verify Setup

```bash
# Check your setup status
./scripts/setup-manager.sh check

# View project status dashboard
./scripts/ai-status.sh --ai-format
```

### 4. Start Your First AI Session

When starting a new Claude Code or Cursor session:

1. **Share the context files**:

   - `CLAUDE.md` - Main instructions for AI assistants
   - `status.md` - Current project state
   - `docs/technical.md` - Technical specifications

2. **Use your first AI agent**:

   ```
   Please use the context-analyzer agent to understand this project structure
   ```

3. **Try a simple task**:
   ```
   Using the frontend-specialist agent, create a simple React component
   that displays "Hello AI World" with proper TypeScript types
   ```

## Installation

### Detailed Setup Process

#### Step 1: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

#### Step 2: Install Dependencies (if applicable)

```bash
# For JavaScript/TypeScript projects
npm install

# For Python projects
pip install -r requirements.txt

# For Ruby projects
bundle install
```

#### Step 3: Configure Git Hooks

```bash
# Set up git hooks for AI-assisted commits
./scripts/setup-manager.sh git

# This enables:
# - Commit message formatting
# - Pre-commit quality checks
# - Documentation validation
```

#### Step 4: Initialize Documentation

```bash
# Create documentation structure
./scripts/docs-manager.sh init

# Check documentation health
node scripts/docs-health.js
```

## Integrating into Existing Projects

Already have a project? No problem! This template is designed to be gradually integrated into existing repositories without disrupting your current workflow.

### Integration Strategies

#### 🚀 Quick Start Integration (Recommended)

Perfect for trying out AI agents without major changes to your existing project structure.

```bash
# 1. Navigate to your existing project
cd /path/to/your/existing-project

# 2. Backup your current setup (optional but recommended)
git branch backup-before-ai-template
git checkout -b integrate-ai-template

# 3. Download just the AI agents and core files
curl -O https://raw.githubusercontent.com/yourusername/ai-coding-template/main/.claude/agents.tar.gz
tar -xzf agents.tar.gz

# 4. Add core context files
curl -O https://raw.githubusercontent.com/yourusername/ai-coding-template/main/CLAUDE.md
curl -O https://raw.githubusercontent.com/yourusername/ai-coding-template/main/status.md
mkdir -p docs
curl -O https://raw.githubusercontent.com/yourusername/ai-coding-template/main/docs/technical.md

# 5. Create a minimal scripts directory
mkdir -p scripts
curl -o scripts/ai-status.sh https://raw.githubusercontent.com/yourusername/ai-coding-template/main/scripts/ai-status.sh
chmod +x scripts/ai-status.sh
```

#### 🔄 Gradual Adoption Strategy

Ideal for teams that want to slowly adopt AI-assisted development practices.

**Phase 1: Core AI Context (Week 1)**
- Add `.claude/` directory with essential agents
- Create `CLAUDE.md`, `status.md`, `docs/technical.md`
- Start using AI agents for code review and documentation

**Phase 2: Workflow Integration (Week 2-3)**  
- Add workbench system for issue tracking
- Integrate AI status dashboard
- Begin using specialized agents for feature development

**Phase 3: Full Automation (Week 4+)**
- Add complete script infrastructure
- Implement quality gates and validation
- Team-wide adoption of AI workflows

#### 🌟 Full Integration Approach

Best for new features or when you're ready to fully embrace AI-assisted development.

```bash
# 1. Clone the template to a temporary directory
git clone https://github.com/yourusername/ai-coding-template.git /tmp/ai-template

# 2. Copy the complete framework to your project
cp -r /tmp/ai-template/.claude/ ./
cp -r /tmp/ai-template/scripts/ ./
cp -r /tmp/ai-template/docs/ ./
cp -r /tmp/ai-template/templates/ ./

# 3. Copy essential files
cp /tmp/ai-template/CLAUDE.md ./
cp /tmp/ai-template/status.md ./
mkdir -p docs
cp /tmp/ai-template/docs/technical.md ./docs/
cp /tmp/ai-template/.env.example ./

# 4. Make scripts executable
chmod +x scripts/*.sh

# 5. Initialize the system
./scripts/setup-manager.sh quick
```

### Step-by-Step Integration Guide

#### Step 1: Prepare Your Existing Project

**Backup and Branch Strategy**
```bash
# Create a backup branch
git checkout -b backup-pre-ai-integration

# Create integration branch  
git checkout -b integrate-ai-template

# Ensure working directory is clean
git status
git add . && git commit -m "Checkpoint before AI template integration"
```

**Assess Your Current Structure**
```bash
# Document your current project structure
tree -I 'node_modules|.git' > current-structure.txt

# Identify potential conflicts
ls -la | grep -E '\.(md|sh|js)$'
```

#### Step 2: Add the AI Agent System

**Core Agent Directory**
```bash
# Create the .claude directory structure
mkdir -p .claude/{agents,commands,rules}

# Download individual agent files (replace URL with actual repository)
for agent in context-analyzer frontend-specialist backend-specialist security-auditor code-reviewer project-manager; do
  curl -o .claude/agents/${agent}.md "https://raw.githubusercontent.com/yourusername/ai-coding-template/main/.claude/agents/${agent}.md"
done

# Download the agent index
curl -o .claude/agents/INDEX.md "https://raw.githubusercontent.com/yourusername/ai-coding-template/main/.claude/agents/INDEX.md"
```

**Essential Command Workflows**
```bash
# Add reusable command patterns
curl -o .claude/commands/feature-development.md "https://raw.githubusercontent.com/yourusername/ai-coding-template/main/.claude/commands/feature-development.md"
curl -o .claude/commands/code-review.md "https://raw.githubusercontent.com/yourusername/ai-coding-template/main/.claude/commands/code-review.md"
```

#### Step 3: Create Context Management Files

**Core Context Files**
```bash
# Create CLAUDE.md with your project specifics
cat > CLAUDE.md << 'EOF'
# CLAUDE.md - AI Assistant Instructions

## Project Overview
[Describe your project - replace this with your actual project description]

## Technology Stack  
[List your current tech stack]

## Key Patterns
[Document important patterns AI should follow in your codebase]

## Getting Started
When starting a new session:
1. Read status.md for current project state
2. Review docs/technical.md for architecture details  
3. Check recent commits for context

EOF

# Create status.md
cat > status.md << 'EOF'
# Project Status

## Current State
🚀 **AI Template Integration in Progress**

## Recent Changes
- Added AI agent system
- Created context management files

## Next Steps  
- [ ] Complete template integration
- [ ] Train team on AI agent usage
- [ ] Begin AI-assisted development

EOF

# Create docs/technical.md based on your project
mkdir -p docs
echo "# Technical Specifications

## Architecture Overview
[Document your current architecture]

## Tech Stack
[Your current technology stack]

## Development Patterns
[Important patterns and conventions]
" > docs/technical.md
```

#### Step 4: Migrate Existing Documentation

**Preserve Existing Documentation Structure**
```bash
# If you have existing docs, create a migration plan
if [ -d "docs" ]; then
  echo "📚 Existing docs directory found"
  
  # Create backup
  cp -r docs docs-backup
  
  # Merge with template structure
  mkdir -p docs/{architecture,api,guides,quick-reference}
  
  # Move existing files to appropriate locations
  # This step requires manual review based on your current structure
fi
```

**Update Documentation Naming**
```bash
# Convert existing docs to lowercase-kebab-case if needed
find docs/ -name "*.md" | while read file; do
  newname=$(echo "$file" | sed 's/\([A-Z]\)/-\L\1/g' | sed 's/^-//')
  if [ "$file" != "$newname" ]; then
    echo "Renaming $file to $newname"
    git mv "$file" "$newname"
  fi
done
```

#### Step 5: Add Essential Scripts

**Core Script Infrastructure**
```bash
# Create scripts directory
mkdir -p scripts/lib

# Add essential utilities
curl -o scripts/lib/colors.sh "https://raw.githubusercontent.com/yourusername/ai-coding-template/main/scripts/lib/colors.sh"
curl -o scripts/lib/logging.sh "https://raw.githubusercontent.com/yourusername/ai-coding-template/main/scripts/lib/logging.sh"

# Add AI status dashboard
curl -o scripts/ai-status.sh "https://raw.githubusercontent.com/yourusername/ai-coding-template/main/scripts/ai-status.sh"
chmod +x scripts/ai-status.sh

# Test the setup
./scripts/ai-status.sh --check
```

#### Step 6: Update Project Configuration

**Integrate with Existing .gitignore**
```bash
# Add AI template entries to existing .gitignore
cat >> .gitignore << 'EOF'

# AI Template
workbench/*/
.ai-session-*
temp-ai-*

EOF
```

**Handle Package Manager Integration**
```bash
# For npm/yarn projects
if [ -f "package.json" ]; then
  # Add AI-related scripts to package.json
  npm pkg set scripts.ai-status="./scripts/ai-status.sh"
  npm pkg set scripts.ai-setup="./scripts/setup-manager.sh check"
fi

# For Python projects  
if [ -f "requirements.txt" ]; then
  # Add any Python dependencies for documentation tools if needed
  echo "# AI Template dependencies (uncomment if needed)" >> requirements.txt
  echo "# markdown==3.4.1" >> requirements.txt
fi
```

### Migration Strategies by Project Type

#### React/Vue/Angular Projects

```bash
# Typical frontend project integration
mkdir -p .claude/{agents,commands}
curl -o .claude/agents/frontend-specialist.md [URL]
curl -o .claude/agents/test-engineer.md [URL]

# Add to package.json scripts
npm pkg set scripts.ai-review="echo 'Use: Ask AI to use code-reviewer agent for this commit'"
npm pkg set scripts.ai-test="echo 'Use: Ask AI to use test-engineer agent to write tests'"

# Update docs/technical.md with your frontend stack
echo "## Frontend Stack
- Framework: $(grep -o '"react"\|"vue"\|"@angular"' package.json | head -1)  
- Styling: $(grep -o '"styled-components"\|"tailwind"\|"sass"' package.json | head -1)
- Testing: $(grep -o '"jest"\|"vitest"\|"cypress"' package.json | head -1)" >> docs/technical.md
```

#### Node.js/Express Backend Projects  

```bash
# Backend-focused integration
curl -o .claude/agents/backend-specialist.md [URL]
curl -o .claude/agents/database-specialist.md [URL]
curl -o .claude/agents/security-auditor.md [URL]

# Document your API structure
echo "## API Structure
- Routes: $(find . -name "*route*" -o -name "*controller*" | wc -l) route files
- Middleware: $(find . -name "*middleware*" | wc -l) middleware files  
- Database: $(grep -o 'mongoose\|sequelize\|prisma\|typeorm' package.json | head -1)" >> docs/technical.md
```

#### Python/Django Projects

```bash
# Python project integration
curl -o .claude/agents/backend-specialist.md [URL]
curl -o .claude/agents/database-specialist.md [URL]

# Create Python-specific context
echo "## Python Environment
- Python Version: $(python --version)
- Framework: $(grep -o 'Django\|Flask\|FastAPI' requirements.txt | head -1)
- Database: $(grep -o 'psycopg2\|pymongo\|sqlalchemy' requirements.txt | head -1)" >> docs/technical.md

# Add Python-specific scripts
cat > scripts/python-setup.sh << 'EOF'
#!/bin/bash
echo "🐍 Python project detected"
python -m pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Python dependencies installed"
EOF
chmod +x scripts/python-setup.sh
```

### Team Adoption Strategies

#### Gradual Team Introduction

**Week 1: Documentation and Context**
```bash
# Team lead introduces concept
./scripts/ai-status.sh --team-intro

# Add to team README
echo "## 🤖 AI-Assisted Development
This project uses AI agents for enhanced development workflows.
See CLAUDE.md for getting started with AI assistance." >> README.md
```

**Week 2: Code Review Integration**  
```bash
# Add AI review to pull request template
mkdir -p .github/PULL_REQUEST_TEMPLATE
cat > .github/PULL_REQUEST_TEMPLATE/ai-reviewed.md << 'EOF'  
## AI Review Checklist
- [ ] Code reviewed by code-reviewer agent
- [ ] Security check by security-auditor agent (if applicable)
- [ ] Tests generated by test-engineer agent
- [ ] Documentation updated by technical-writer agent
EOF
```

**Week 3: Feature Development**
```bash
# Create team workflow guide
cat > docs/ai-workflow-guide.md << 'EOF'
# AI Workflow Guide

## Starting a Feature
1. Ask project-manager agent to break down the feature
2. Use appropriate specialist agents for implementation
3. Review with code-reviewer agent before PR

## Common Agent Usage
- frontend-specialist: UI components and styling  
- backend-specialist: API endpoints and business logic
- test-engineer: Unit and integration tests
- security-auditor: Security review for sensitive code
EOF
```

### Handling Integration Conflicts

#### Existing Tool Conflicts

**ESLint/Prettier Integration**
```bash
# Merge existing linting rules with AI recommendations
if [ -f ".eslintrc.js" ]; then
  echo "📝 Existing ESLint config found - will preserve"
  # Add comment to existing config
  sed -i '1i// AI agents respect existing linting rules' .eslintrc.js
fi
```

**Testing Framework Integration**  
```bash
# Preserve existing test structure
if [ -d "__tests__" ]; then
  echo "🧪 Existing tests found - preserving structure"
  echo "## Testing Strategy
- Existing tests: Preserved in current structure  
- AI-generated tests: Follow existing patterns
- Test agent: Configured for $(find . -name "*.test.*" -o -name "*.spec.*" | head -1 | sed 's/.*\.\([^.]*\)\.test\..*/\1/')" >> docs/technical.md
fi
```

#### Git History Preservation

```bash
# Ensure clean integration without losing history
git add .
git commit -m "feat: integrate AI template framework

- Add AI agent system for enhanced development
- Preserve existing project structure  
- Maintain all current workflows and patterns
- Enable AI-assisted development capabilities

(AI-assisted template integration)"
```

### Validation and Testing

#### Integration Health Check

```bash
# Create integration validation script
cat > scripts/validate-integration.sh << 'EOF'
#!/bin/bash
source scripts/lib/colors.sh

echo "🔍 Validating AI template integration..."

# Check essential files
files=("CLAUDE.md" "status.md" "docs/technical.md" ".claude/agents/INDEX.md")
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "${GREEN}✅ $file exists${NC}"
  else
    echo "${RED}❌ Missing: $file${NC}"
  fi
done

# Check scripts
if [ -x "scripts/ai-status.sh" ]; then
  echo "${GREEN}✅ AI status script executable${NC}"
else
  echo "${RED}❌ AI status script not executable${NC}"
fi

# Test AI status dashboard
echo "📊 Testing AI status dashboard..."
./scripts/ai-status.sh --check || echo "${YELLOW}⚠️  AI status needs configuration${NC}"

echo "✨ Integration validation complete!"
EOF
chmod +x scripts/validate-integration.sh

# Run validation
./scripts/validate-integration.sh
```

#### First AI Session Test

```bash
# Create a test AI session guide
cat > docs/first-ai-session.md << 'EOF'
# First AI Session Guide

## Quick Test
1. Share CLAUDE.md with your AI assistant
2. Ask: "What agents are available in this project?"
3. Try: "Use the context-analyzer agent to understand the project structure"
4. Test: "Use the [your-domain]-specialist agent to suggest an improvement"

## Validation
- AI should recognize the agent system
- AI should understand your project context
- AI should provide specialized responses based on agent roles

## Next Steps
- Begin using agents for actual development tasks
- Update status.md as you work
- Gather team feedback on AI workflows
EOF
```

### Troubleshooting Integration Issues

#### Common Integration Problems

**Problem: Conflicting Documentation Standards**
```bash
# Solution: Merge standards gradually
cat > docs/migration-notes.md << 'EOF'
# Documentation Migration Notes

## Existing Standards
[Document your current standards here]

## Template Standards  
- Use `lowercase-kebab-case` for filenames
- Include metadata headers
- Use consistent formatting

## Migration Strategy
- Phase 1: Apply to new documentation
- Phase 2: Gradually update existing docs
- Phase 3: Full standardization
EOF
```

**Problem: Script Permissions Issues**
```bash
# Solution: Bulk permission fix
find scripts/ -name "*.sh" -exec chmod +x {} \;
echo "✅ All scripts made executable"
```

**Problem: AI Agent Not Recognizing Project Context**
```bash
# Solution: Enhance context files
echo "🔧 Updating context files for better AI recognition..."

# Add project-specific patterns to docs/technical.md
echo "## Current Code Patterns
$(find src/ -name "*.js" -o -name "*.ts" -o -name "*.py" | head -5 | xargs grep -l "export\|class\|function" | head -3)" >> docs/technical.md

# Update CLAUDE.md with specific instructions
echo "
## Project-Specific AI Instructions
- Always check existing patterns in src/ directory
- Follow the established naming conventions
- Respect the current architecture documented in docs/technical.md" >> CLAUDE.md
```

### Success Metrics

#### Integration Success Indicators

**Week 1 Metrics**
```bash
# Track adoption metrics
cat > scripts/track-ai-usage.sh << 'EOF'
#!/bin/bash
echo "📊 AI Usage Metrics"
echo "Commits with AI assistance: $(git log --oneline --grep="AI-assisted" | wc -l)"
echo "Documentation files updated: $(find docs/ -name "*.md" -newer .claude/agents/INDEX.md | wc -l)"
echo "Team members using AI: [Track manually]"
EOF
```

**Ongoing Success Metrics**
- Reduced code review time  
- Improved documentation quality
- Faster feature development cycles
- Increased test coverage
- Better security practices

The integration process is designed to be flexible and non-disruptive. Start small, validate each step, and gradually expand your use of AI-assisted development practices.

## Understanding AI-Assisted Development

### The AI-Assisted Development Lifecycle

Working with AI coding tools follows a structured approach across the entire development lifecycle:

- **🎯 Design and Architecture:** Use AI to brainstorm ideas, explore architectural patterns, and generate system diagrams
- **⚡ Code Generation:** Generate boilerplate code, functions, and even entire components with intelligent context awareness
- **🔍 Debugging:** Paste error messages and code snippets to get detailed explanations and targeted fix suggestions
- **🧪 Testing:** Generate comprehensive unit tests, integration tests, and end-to-end tests that follow best practices
- **📚 Documentation:** Generate documentation for functions, classes, APIs, and user guides with consistent formatting
- **🔄 Refactoring:** Improve code quality, readability, and performance through systematic enhancement

### Advanced AI Orchestration

This template includes an advanced AI orchestration system in the `.claude/` directory that provides:

#### 🤖 Specialized AI Agents

- **17 domain-specific agents** for complex tasks (frontend-specialist, backend-specialist, security-auditor, code-reviewer, etc.)
- **Intelligent agent coordination** with handoff procedures and quality gates
- **Context-aware agent selection** based on task complexity and domain

#### ⚡ Command Workflows

- **7 pre-built command sequences** for common development operations
- **Reusable workflow patterns** for feature development, security audits, and performance optimization
- **Automated quality gates** integrated into development workflows

#### 📊 Quality Enforcement

- **Automated rule enforcement** for documentation, security, testing, and code quality
- **Graduated enforcement levels** that adapt to project maturity
- **Continuous quality monitoring** with improvement recommendations

#### 🔄 Memory Management

- **Enhanced context preservation** across AI sessions
- **Project status tracking** in `deliverables/status.md` with visual progress indicators
- **Issue-based development** workflow in `workbench/` directory

See [.claude/integration.md](./.claude/integration.md) for comprehensive integration guidance.

## Understanding the AI Agent System

### What Are AI Agents?

AI agents are specialized prompts and instructions that give AI assistants specific expertise. Think of them as "expert consultants" you can call upon for different tasks.

### How to Use Agents

1. **Automatic Activation**: Agents activate automatically based on your task
2. **Manual Request**: Ask for a specific agent by name
3. **Agent Handoff**: Agents can coordinate with each other

### Available Agents (Quick Reference)

| Agent                   | Use For            | Example Request                            |
| ----------------------- | ------------------ | ------------------------------------------ |
| **frontend-specialist** | UI/UX development  | "Create a responsive navigation component" |
| **backend-specialist**  | Server-side logic  | "Implement user authentication API"        |
| **database-specialist** | Data modeling      | "Design a schema for user profiles"        |
| **test-engineer**       | Testing strategies | "Write unit tests for the auth module"     |
| **security-auditor**    | Security review    | "Audit this code for vulnerabilities"      |
| **code-reviewer**       | Code quality       | "Review this implementation"               |
| **devops-engineer**     | Deployment         | "Set up CI/CD pipeline"                    |

See [.claude/agents/INDEX.md](./.claude/agents/INDEX.md) for the complete list of 17 specialized agents.

### Example Agent Workflow

```markdown
User: "I need to add user authentication to my app"

1. project-manager coordinates the task
2. code-architect designs the authentication flow
3. database-specialist creates user schema
4. backend-specialist implements API endpoints
5. frontend-specialist creates login forms
6. test-engineer writes tests
7. security-auditor reviews for vulnerabilities
8. code-reviewer ensures quality standards
```

## Project Structure

A well-organized file structure is crucial for providing context to AI tools. A logical structure helps the AI understand your project's architecture and locate relevant files without having to burn too much time and context searching around.

All documentation files should be named using `lowercase-kebab-case`.

```text
my-project/
├── 📚 Documentation & Context
│   ├── README.md                 # This file - project overview and setup
│   ├── CLAUDE.md                 # Instructions for Claude Code (or similar AI tools)
│   ├── docs/
│   │   └── technical.md          # Technical specifications and architecture
│   ├── deliverables/             # Product deliverables and project status
│   │   ├── status.md             # Project state and progress tracking
│   │   └── [deliverable]/        # Individual deliverables with their issues
│   ├── prompting.md              # Best practices for prompting AI coding assistants
│   └── legal.md                  # Legal and ethical considerations
│
├── 🤖 AI Configuration (.claude/)
│   ├── agents/                   # 17 specialized AI agents for complex tasks
│   ├── commands/                 # Reusable command workflows
│   ├── rules/                    # Quality enforcement rules
│   └── integration.md            # Integration guide
│
├── 🔧 Development
│   ├── src/                      # Main source code
│   │   ├── components/           # Reusable components/modules
│   │   ├── utils/                # Utility functions and helpers
│   │   ├── config/               # Configuration files
│   │   └── tests/                # Test files (or __tests__ directories alongside code)
│   ├── docs/                     # Project documentation
│   │   ├── architecture.md       # High-level system design
│   │   ├── api-reference.md      # API documentation (if applicable)
│   │   └── contributing-guide.md # Development guidelines
│
├── 🛠️ Automation (scripts/)
│   ├── lib/                      # Shared utilities (colors.sh, logging.sh)
│   ├── setup-manager.sh          # Unified project setup
│   ├── ai-status.sh              # AI-friendly project status dashboard
│   ├── docs-health.js            # Documentation health monitoring
│   └── docs-manager.sh           # Documentation operations
│
├── 📋 Templates & Examples
│   ├── templates/                # Documentation templates
│   └── examples/                 # Usage examples and sample code
│
└── ⚙️ Configuration
    ├── .gitignore                # Standard gitignore for your tech stack
    ├── .env.example              # Environment template
    └── config/                   # Project configuration files
```

## Common Workflows

### AI-Safe Git Workflow

**Important**: Follow the [AI Branching Strategy](./docs/guides/ai-branching-strategy.md) for safe AI-assisted development.

```bash
# 1. Create a feature branch (AI should ask permission)
git checkout -b feature/FEATURE-001-user-authentication

# 2. AI implements changes with human oversight
# (AI shows changes before committing)

# 3. Human reviews and approves before merge
git push origin feature/FEATURE-001-user-authentication
```

### Starting a New Feature

```bash
# 1. Create a feature issue for your deliverable
mkdir -p deliverables/features/issues/FEATURE-001
echo "# Feature: User Authentication" > deliverables/features/issues/FEATURE-001/README.md

# 2. Update project status
echo "## Current Focus: User Authentication" >> status.md

# 3. In your AI session, request:
"Using the project-manager agent, help me implement user authentication
following the patterns in our docs/technical.md file"
```

### Debugging an Issue

```bash
# 1. Create issue tracking
mkdir -p deliverables/bugs/BUG-001
echo "# Bug: Login fails on mobile" > deliverables/bugs/BUG-001/README.md

# 2. Use the context-analyzer agent:
"Using the context-analyzer agent, investigate why login fails on mobile devices"
```

### Code Review Process

```bash
# After implementing a feature:
"Please use the code-reviewer agent to review the authentication implementation"

# For security-critical code:
"Please use the security-auditor agent to check for vulnerabilities"
```

### Documentation Update

```bash
# Check documentation health
node scripts/docs-health.js

# Update documentation:
"Using the technical-writer agent, update the API documentation
for the new authentication endpoints"
```

## Best Practices for AI-Assisted Development

### 1. Documentation Standards

Follow comprehensive documentation standards to maintain consistency and quality. See [documentation-standards.md](./docs/documentation-standards.md) for complete guidelines on:

- Metadata requirements and formatting standards
- JSDoc standards for code documentation
- Visual documentation with progress bars and diagrams
- Documentation review checklists and quality gates

### 2. Prompt Engineering

The quality of your prompts determines the quality of the AI's output. See [prompting.md](./docs/guides/prompting.md) for a detailed guide on how to write effective prompts.

### 3. Working with AI Assistants

- **Small, Focused Requests**: Break large tasks into smaller pieces. It's very tempting to ask your AI tool to implement entire features for you, to work for hours while you go get a snack and maybe watch a movie, but you can very quickly code yourself into a complete mess that way. Requests should be small, clear, concise and focused.
- **Provide Context**: Always share relevant context files at session start
- **Review Generated Code**: Treat AI code as a first draft - always review and refine AI-generated code
- **Use Appropriate Agents**: Let specialized agents handle domain-specific tasks
- **Focus on the "Why"**: Ensure the code aligns with the project's goals and architecture

### 4. Code Quality and Review

- **Treat AI Code as a Draft:** Always review and refine AI-generated code
- **Keep Changes Small:** Requests should be small, clear, concise and focused
- **Scrutinize for Common Flaws:** Pay close attention to logical inconsistencies, security vulnerabilities, and missed edge cases
- **Atomic Commits:** One feature per commit with clear messages
- **AI Attribution:** Tag AI-assisted commits with `(AI-assisted)`

### 5. Testing and Validation

- **Test Rigorously:** Write comprehensive unit, integration, and acceptance tests for all code, especially AI-generated code
- **Cover Edge Cases:** AI models may not always consider edge cases. It's your job to ensure they are handled correctly
- **Always Test AI Code:** Write tests for AI-generated code to ensure it works as expected

### 6. Security

- **Scan for Vulnerabilities:** Use static analysis security testing (SAST) tools to scan for vulnerabilities in both human- and AI-written code
- **Never Trust, Always Verify:** Be especially cautious with security-critical code, such as authentication and encryption. Meticulously review and test any AI-generated code in these areas
- **Security Review:** Audit security-critical code carefully

### 7. Version Control

**Follow the [AI Branching Strategy](./docs/guides/ai-branching-strategy.md)** for safe AI-assisted development.

- **Atomic Commits:** Generate code for a single, focused feature at a time and commit it with a clear message
- **Tag AI-Assisted Commits:** Add a tag like `(AI-assisted)` to your commit messages to create a clear audit trail
- **Use Branches:** Isolate AI-generated features in separate branches for testing before merging
- **Branch Protection:** Never allow AI to commit directly to `main` or `develop` branches

### 8. Context Management

- **Regular Updates**: Keep `status.md` current with project state
- **Session Handoffs**: Document progress when switching AI sessions
- **Context Pruning**: Remove outdated information to stay within limits

### 9. Documentation

- **Keep It Current**: Update docs as you code
- **Use Templates**: Leverage documentation templates in `docs/templates/`
- **Visual Aids**: Include diagrams and progress indicators
- **Follow Standards**: See [docs/documentation-standards.md](./docs/documentation-standards.md)

### 10. Legal and Ethical Considerations

Using AI-generated code has legal and ethical implications. See [legal.md](./legal.md) for a guide on how to navigate these issues. **Note I AM NOT A LAWYER.**

## Tooling and Automation

This template includes several automation tools to help maintain quality:

### Professional Script Infrastructure

The template includes a professional script infrastructure adapted from production systems:

#### Shared Utilities

- **colors.sh**: Standardized color output with emoji support and fallback ASCII
- **logging.sh**: Professional logging with levels, spinners, and progress bars

#### AI-Friendly Tools

- **AI Status Dashboard**: `./scripts/ai-status.sh` - Multi-format project status for AI context recovery
- **Documentation Health**: `node scripts/docs-health.js` - Comprehensive docs quality analysis
- **Setup Manager**: `./scripts/setup-manager.sh` - Unified project setup with quick/full modes
- **Docs Manager**: `./scripts/docs-manager.sh` - Centralized documentation operations

### Available Scripts

| Script               | Purpose                         | Usage                                |
| -------------------- | ------------------------------- | ------------------------------------ |
| **setup-manager.sh** | Project setup and configuration | `./scripts/setup-manager.sh quick`   |
| **ai-status.sh**     | Project status dashboard        | `./scripts/ai-status.sh --ai-format` |
| **docs-health.js**   | Documentation quality check     | `node scripts/docs-health.js`        |
| **docs-manager.sh**  | Documentation operations        | `./scripts/docs-manager.sh validate` |

### Usage Examples

```bash
# Quick project status for AI
./scripts/ai-status.sh --ai-format

# Complete project setup
./scripts/setup-manager.sh full --verbose

# Check documentation health
node scripts/docs-health.js

# Initialize docs structure
./scripts/docs-manager.sh init

# Validate docs before commit
./scripts/docs-manager.sh validate
```

### Quick Commands

```bash
# Project Setup
./scripts/setup-manager.sh quick        # Quick setup
./scripts/setup-manager.sh full         # Complete setup
./scripts/setup-manager.sh check        # Verify setup

# Documentation
node scripts/docs-health.js             # Check documentation health
./scripts/docs-manager.sh init          # Initialize docs structure
./scripts/docs-manager.sh validate      # Validate documentation

# Status and Monitoring
./scripts/ai-status.sh                  # Human-readable status
./scripts/ai-status.sh --ai-format      # AI-optimized status
```

See [architecture.md](./docs/architecture.md) for implementation details.

### Additional Tools

- **Static Analysis and Linters:** These tools help enforce coding standards and catch common errors in both human- and AI-written code
- **Dependency Management:** Keep your dependency files (e.g., `package.json`, `requirements.txt`) clean and up-to-date to provide the AI with accurate context
- **Version Control:** Use Git to track changes, experiment with AI-generated code, and collaborate with your team

## Troubleshooting

### Common Issues

#### AI Assistant Forgets Context

**Problem**: AI contradicts previous decisions or recreates existing code

**Solution**:

1. Update and share `status.md` at session start
2. Reference specific files: "Check the existing auth implementation in src/auth/"
3. Use context-analyzer agent: "Please analyze the current project state first"

#### Scripts Not Executing

**Problem**: Permission denied when running scripts

**Solution**:

```bash
# Make all scripts executable
chmod +x scripts/*.sh
chmod +x scripts/**/*.sh
```

#### Documentation Out of Sync

**Problem**: Documentation doesn't match current code

**Solution**:

```bash
# Check documentation health
node scripts/docs-health.js

# Request documentation update:
"Using the technical-writer agent, update docs to match current implementation"
```

#### Agent Not Working as Expected

**Problem**: Agent provides generic instead of specialized responses

**Solution**:

1. Be explicit: "Please use the frontend-specialist agent for this task"
2. Provide context: Share relevant docs/technical.md sections
3. Check agent documentation: `.claude/agents/[agent-name].md`

### Getting Help

1. **Check Documentation**: Review guides in `docs/quick-reference/`
2. **Agent Help**: Ask "What agents are available and what do they do?"
3. **Status Check**: Run `./scripts/setup-manager.sh check`
4. **Community**: Open an issue on GitHub with the `question` label

## FAQ

### Q: Do I need to use all 17 agents?

**A**: No! Agents activate automatically based on your needs. Start simple and discover agents as you work.

### Q: Can I use this with tools other than Claude Code?

**A**: Yes! While optimized for Claude Code, the patterns work with Cursor, GitHub Copilot, and other AI coding tools.

### Q: How do I add my own custom agents?

**A**: Create a new file in `.claude/agents/` following the existing agent format. See `.claude/agents/INDEX.md` for guidelines.

### Q: What if my project uses Python/Ruby/Go instead of JavaScript?

**A**: The template is language-agnostic. Adapt the examples and patterns to your tech stack.

### Q: How do I handle API keys and secrets?

**A**: Never commit secrets! Use `.env` files (already in .gitignore) and environment variables.

### Q: Can multiple developers use this on the same project?

**A**: Yes! The workbench system and status tracking support team collaboration.

## Contributing

This template is a living document. Contributions and suggestions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature' -m '(AI-assisted)'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Learn More

### Essential Reading

- 📖 **[Prompting Guide](./prompting.md)** - Master the art of AI prompting
- ⚖️ **[Legal Considerations](./legal.md)** - Understand legal implications
- 🏗️ **[Architecture Guide](./docs/architecture.md)** - System design patterns
- 📚 **[Documentation Hub](./docs/README.md)** - Central documentation portal
- 📋 **[Documentation Standards](./docs/documentation-standards.md)** - Writing guidelines

### Quick References

- 🚀 **[AI Assistant Guide](./docs/quick-reference/ai-assistant-guide.md)** - AI collaboration patterns
- 💻 **[Development Commands](./docs/quick-reference/development-commands.md)** - Common commands
- 🔧 **[Troubleshooting Checklist](./docs/quick-reference/troubleshooting-checklist.md)** - Problem-solving guide

### Advanced Topics

- 🤖 **[Agent Integration](./claude/integration.md)** - How agents work together
- 📊 **[Quality Gates](./claude/rules/)** - Automated quality enforcement
- 🔄 **[Workflow Commands](./claude/commands/)** - Reusable workflows

## Getting Started with this Template

1. **Clone the repository**
2. **Choose your tech stack**
3. **Adapt the file structure**
4. **Update documentation**
5. **Start coding!**

---

## Next Steps

Now that you're set up:

1. **Customize for Your Project**: Update `docs/technical.md` with your tech stack
2. **Try the Agents**: Experiment with different agents for your tasks
3. **Build Something**: Start with a small feature to get familiar
4. **Share Feedback**: Let us know what works and what doesn't

**Ready to supercharge your development with AI?** Let's build something amazing! 🚀

---

_This template is continuously evolving based on real-world usage. Star the repo to stay updated with new features and improvements._

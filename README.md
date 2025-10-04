# AI Coding Template

[![Template](https://img.shields.io/badge/Template-Use%20This-brightgreen?style=for-the-badge)](https://github.com/TaylorHuston/ai-coding-template/generate) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![GitHub Issues](https://img.shields.io/github/issues/TaylorHuston/ai-coding-template)](https://github.com/TaylorHuston/ai-coding-template/issues)

> Transform AI from a simple code generator into your intelligent architectural partner

A comprehensive project template that provides AI assistants with the context, structure, and tools needed for systematic software development. Features 18 specialized AI agents, 4-phase workflow, automated quality gates, and comprehensive documentation systems.

## Table of Contents

- [Background](#background)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Features](#features)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Background

### The AI Coding Problem

Traditional AI development suffers from critical issues:

- **Context Amnesia** - AI forgets decisions and repeats questions across sessions
- **Architectural Blindness** - No understanding of how pieces fit together in the broader system
- **Pattern Inconsistency** - Each request generates different approaches without coherent design
- **Quality Gaps** - No systematic validation between iterations or phases

**Result:** Hours spent in repetitive explanations and inconsistent architectural decisions.

### The Solution

This template transforms AI from a reactive code generator into a proactive architectural partner by providing:

- **Context Preservation** - Structured system for maintaining architectural knowledge across sessions
- **Specialized Expertise** - 18 domain-specific AI agents for architecture, security, testing, and more
- **Quality Assurance** - Built-in validation, testing, and compliance checking
- **Systematic Workflow** - Four-phase development process from design to deployment

The template works with **any programming language and framework**, focusing on AI collaboration patterns rather than specific technologies.

## Quick Start

### Option 1: GitHub Template (Recommended)

**One-click setup** - No installation required:

1. Click **"Use this template"** button above (or [click here](https://github.com/TaylorHuston/ai-coding-template/generate))
2. Name your new repository
3. Clone and initialize:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
   cd YOUR_PROJECT

   # Transform template into YOUR project
   ./.claude/resources/scripts/setup/setup-manager.sh init-project
   ```

### Option 2: degit (CLI)

For CLI enthusiasts:

```bash
npx degit TaylorHuston/ai-coding-template my-project
cd my-project
git init

# Transform template into YOUR project
./.claude/resources/scripts/setup/setup-manager.sh init-project
```

### Option 3: Manual Clone

```bash
git clone https://github.com/TaylorHuston/ai-coding-template.git my-project
cd my-project
rm -rf .git && git init

# Transform template into YOUR project
./.claude/resources/scripts/setup/setup-manager.sh init-project
```

## Usage

### First Steps

1. **After initialization**, the script creates:
   - ✅ Customized README.md with your project details
   - ✅ Fresh CHANGELOG.md ready for tracking changes
   - ✅ Updated CLAUDE.md with your tech stack
   - ✅ Initialized STATUS.md for project memory
   - ✅ Template docs preserved in `docs/ai-toolkit/`

2. **Start your first AI workflow**:
   ```bash
   /design "create epic for user authentication"
   /architect user-authentication
   /plan "implement login flow"
   /develop
   ```

### Core Workflow

The template provides a systematic 4-phase development process:

1. **`/design`** - Define epic structure, user stories, and acceptance criteria
2. **`/architect`** - Explore technical approaches and document decisions
3. **`/plan`** - Create detailed implementation roadmap with specialist input
4. **`/develop`** - Execute tasks with quality gates and testing integration

### Key Features

- **18 Specialized AI Agents** - Domain experts for every aspect of development
- **Context Management** - Preserve architectural knowledge across long projects
- **Quality Gates** - Automated validation, testing, and security scanning
- **Documentation System** - Three-tier documentation with automated maintenance
- **Template Library** - Reusable patterns for common development tasks

## AI Workflow Commands

Once you've set up the template, use these slash commands within your AI assistant sessions:

```bash
# Core 4-phase workflow
/design --epic "feature-name"       # Define epic structure and user stories
/architect [feature-name]           # Explore technical approaches
/plan --issue [ISSUE-ID]            # Create implementation roadmap
/develop                            # Execute with quality gates

# Quality and validation
/quality assess                     # Comprehensive quality check
/review                            # Code review with analysis
/security-audit                    # Security assessment
/test-fix                          # Auto-detect and fix test failures

# Project management
/status                            # Project status overview
/docs generate                     # Generate documentation
/commit                            # Create quality-checked commits
/merge-branch                      # Safe branch merging
```

## AI Agent System

The template provides 18 specialized agents:

**Architecture & Planning**

- `code-architect` - System design and technical decisions
- `project-manager` - Epic planning and coordination
- `context-analyzer` - Requirements analysis and clarification

**Development Specialists**

- `frontend-specialist` - UI/UX and client-side development
- `backend-specialist` - Server-side logic and APIs
- `database-specialist` - Data modeling and optimization
- `api-designer` - API design and documentation

**Quality & Operations**

- `test-engineer` - Testing strategy and implementation
- `code-reviewer` - Code quality and best practices
- `security-auditor` - Security analysis and compliance
- `performance-optimizer` - Performance analysis and optimization
- `devops-engineer` - Deployment and infrastructure

**Documentation & Analysis**

- `technical-writer` - Documentation creation and maintenance
- `data-analyst` - Data analysis and reporting
- `migration-specialist` - Legacy system migration
- `refactoring-specialist` - Code improvement and refactoring

**Strategy & Innovation**

- `brief-strategist` - Business requirements and strategy
- `ai-llm-expert` - AI/ML integration and optimization

### Configuration

The template can be configured through:

- **`CLAUDE.md`** - AI assistant instructions and project context
- **`docs/project-brief.md`** - Business requirements and scope
- **`.claude/agents/`** - Agent-specific configurations and guidelines
- **`.claude/resources/scripts/`** - Automation and workflow scripts

## Examples

The template includes comprehensive examples in `.claude/resources/examples/`:

### Complete Workflow Example

```bash
# See full epic development cycle
cat .claude/resources/examples/workflow/complete-feature-workflow-example.md
```

### Project Types

- **Web Application** - Full-stack web development with modern frameworks
- **API Service** - REST/GraphQL API development with comprehensive testing
- **CLI Tool** - Command-line application with argument parsing and testing
- **Library/Package** - Reusable library development with proper packaging

### Integration Patterns

- **Existing Codebase** - Adding AI workflow to established projects
- **Team Collaboration** - Multi-developer AI assistance patterns
- **CI/CD Integration** - Automated quality gates and deployment

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Contributing Template Improvements

**Discover improvements while building real projects? Share them back!**

The template includes a bidirectional sync system that lets you contribute improvements you discover while using the template:

```bash
# Setup (one-time)
./.claude/resources/scripts/template/template-sync.sh config

# Make improvements in your project, then push to template
./.claude/resources/scripts/template/template-sync.sh push

# Review and commit in template repo
cd ~/dev/ai-coding-template
git commit -m "Improve agent prompts based on real usage"
```

See [Template Development Guide](./docs/ai-toolkit/setup/template-development.md) for complete workflow.

### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our [Development Guidelines](./docs/development/guidelines/)
4. Ensure tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/TaylorHuston/ai-coding-template.git
cd ai-coding-template
npm install
npm run dev
```

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Ready to transform your AI development experience?**

→ **New to the template?** Start with the [Template Usage Guide](./docs/ai-toolkit/README.md) → **Existing user?** Check the [Command Reference](./docs/ai-toolkit/reference/commands.md) → **Need help?** Browse [Troubleshooting](./docs/ai-toolkit/reference/troubleshooting.md)

# AI Coding Template

## Intro

This is an attempt to add structure and guidance around ai-assisted coding. It is very much in an alpha phase at the moment and I greatly appreciate any feedback on it. This is an experiment, I'm still figuring out the best way to give the AI tools all of the context and guide rails they need to work effectively without being too restrictive or trying to basically replicated Jira in your repo.

[![NPM Version](https://img.shields.io/npm/v/ai-assisted-template)](https://www.npmjs.com/package/ai-assisted-template) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![GitHub Issues](https://img.shields.io/github/issues/TaylorHuston/ai-coding-template)](https://github.com/TaylorHuston/ai-coding-template/issues)

> Transform AI from a simple code generator into your intelligent architectural partner

A comprehensive template system that provides AI assistants with the context, structure, and tools needed for systematic software development. Features 18 specialized AI agents, 4-phase workflow, automated quality gates, and comprehensive documentation systems.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Background

Traditional AI coding assistance lacks context and architectural consistency. Developers often find themselves in repetitive conversations where AI forgets previous decisions and makes isolated recommendations without understanding the broader system.

This template solves these problems by providing:

- **Context Preservation** - Structured system for maintaining architectural knowledge across sessions
- **Specialized Expertise** - 18 domain-specific AI agents for architecture, security, testing, and more
- **Quality Assurance** - Built-in validation, testing, and compliance checking
- **Systematic Workflow** - Four-phase development process from design to deployment

The template works with any programming language and framework, focusing on AI collaboration patterns rather than specific technologies.

## Install

### NPM Package (Recommended)

```bash
npx ai-assisted-template init my-project
cd my-project
```

### GitHub Template

1. Click "Use this template" on GitHub
2. Clone your new repository
3. Start using the AI workflow:

```bash
git clone https://github.com/TaylorHuston/my-project.git
cd my-project
npx ai-assisted-template status
```

### Manual Installation

```bash
git clone https://github.com/TaylorHuston/ai-coding-template.git my-project
cd my-project
rm -rf .git && git init
npm install
```

## Usage

### Quick Start

1. **Initialize your project** (transforms template into your project):

   ```bash
   npx ai-assisted-template init
   ```

2. **Verify installation**:

   ```bash
   npx ai-assisted-template status
   npx ai-assisted-template validate
   ```

3. **Start your first AI workflow**:
   ```bash
   /design --epic "user-authentication"
   /architect user-authentication
   /plan --issue AUTH-123
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

## API

### Command Line Interface

```bash
# Project initialization and setup
npx ai-assisted-template init [project-name]
npx ai-assisted-template setup
npx ai-assisted-template status
npx ai-assisted-template validate

# Development workflow (used within AI sessions)
/design --epic "feature-name"
/architect [feature-name]
/plan --issue [ISSUE-ID]
/develop
/quality assess
/docs generate
```

### AI Agent System

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
- **`.resources/scripts/`** - Automation and workflow scripts

## Examples

The template includes comprehensive examples in `.resources/examples/`:

### Complete Workflow Example

```bash
# See full epic development cycle
cat .resources/examples/workflow/complete-feature-workflow-example.md
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

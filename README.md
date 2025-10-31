# AI Workflow Marketplace

A comprehensive AI-assisted development workflow system for Claude Code, providing intelligent task orchestration, specialized agent coordination, and file-based state management.

## IMPORTANT
This is very much an alpha/experiment at this point. Look at the commit history to see that for yourself. Right now it's a lot of throwing lots of things at the wall, seeing what sticks, seeign what doesn't, massively changing things as I go along.

## What's Included

This marketplace contains:

- **AI Toolkit Plugin** - Complete workflow system with 14 commands, 19 specialized agents, and intelligent automation
- **Starter Template** - 34 essential files for clean project initialization via `/toolkit-init`
- **Guideline Templates** - 7 customizable guideline templates (project configuration files, not plugin docs)

## Quick Start

### Install and Initialize

```bash
# 1. Add this marketplace
/plugin marketplace add TaylorHuston/ai-coding-template

# 2. Install the AI Toolkit plugin
/plugin install ai-toolkit

# 3. Initialize your project
cd your-project
/toolkit-init

# 4. Start developing
/project-brief
```

The `/toolkit-init` command scaffolds your project with:
- Customized CLAUDE.md (your tech stack and links)
- Structured template (34 files: docs/, pm/, guidelines, templates)
- GETTING-STARTED.md guide
- Documentation framework (AI creates content as you work)
- Interactive setup with smart conflict resolution

## AI Toolkit Plugin

The AI Toolkit plugin provides a complete development workflow system:

### Setup & Planning Commands

- `/toolkit-init` - Initialize project structure with templates
- `/project-brief` - Create and refine project vision through conversation
- `/epic` - Create and manage epics through natural language
- `/adr` - Make technical architecture decisions (ADRs)
- `/plan` - Break down tasks into implementation phases

### Implementation Commands

- `/implement` - Execute specific task phases with test-first approach

### Quality & Testing Commands

- `/quality` - Multi-dimensional quality assessment
- `/security-audit` - OWASP-compliant security assessment
- `/test-fix` - Automated test failure resolution

### Development Workflow Commands

- `/commit` - Quality-checked git commits
- `/branch` - Unified branch operations (create, merge, delete, switch, status)
- `/comment` - Add timestamped work log entries

### Documentation & Status Commands

- `/docs` - Unified documentation management (generate, validate, sync, update)
- `/project-status` - Intelligent project status dashboard

## Key Features

### 19 Specialized Agents

Domain experts that auto-activate based on task context:

- **Strategy & Design**: brief-strategist, code-architect, ui-ux-designer
- **Implementation**: frontend-specialist, backend-specialist, database-specialist
- **Quality**: test-engineer, code-reviewer, security-auditor, performance-optimizer
- **Operations**: devops-engineer, technical-writer
- **Analysis**: context-analyzer, project-manager, api-designer
- **Maintenance**: refactoring-specialist, migration-specialist, data-analyst
- **AI Expertise**: ai-llm-expert

### File-Based State Management

Seamless session continuity through structured files:

- **EPIC.md** - Epic-level context and progress
- **TASK-###-*/TASK.md** - Task-specific implementation details
- **WORKLOG.md** - Narrative work history with lessons learned
- **RESEARCH.md** - Investigation findings and technical decisions

## Local Development

For plugin development and testing:

```bash
# Add this directory as a local marketplace
cd /path/to/ai-coding-template
/plugin marketplace add ./

# Install the plugin locally
/plugin install ai-toolkit

# Make changes and test immediately
# Updates take effect on plugin reload
```

## Documentation

### Plugin Documentation

See `plugins/ai-toolkit/README.md` for complete plugin documentation including:

- Detailed command reference
- Agent system guide
- Integration patterns
- Troubleshooting

### Starter Template Documentation

The starter template includes comprehensive documentation:

- **docs/project/** - Project-specific documentation (ADRs, design assets)
- **docs/development/** - Development guidelines (customizable templates)
- **pm/** - Project management (epics, tasks, bugs with templates)

## Repository Structure

```
ai-coding-template/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace configuration
└── plugins/
    └── ai-toolkit/                # AI Toolkit plugin
        ├── .claude-plugin/
        │   └── plugin.json
        ├── commands/              # 14 slash commands
        ├── agents/                # 19 specialized agents
        ├── templates/             # Bundled project templates
        │   └── starter/           # 33 template files
        ├── docs/                  # Plugin documentation
        └── README.md
```

## Requirements

- Claude Code CLI
- Git (for version control commands)
- Bash (for script execution)

Optional but recommended:

- Node.js (for JavaScript/TypeScript projects)
- Python 3.7+ (for Python projects)

## Contributing

Contributions welcome! Please see `CONTRIBUTING.md` for guidelines.

## License

MIT License - see `LICENSE` for details.

## Support

- **Documentation**: Full docs in `plugins/ai-toolkit/README.md` and `starter-template/docs/`
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Share feedback and ask questions in GitHub Discussions

## Version

Current version: 0.10.5

See `CHANGELOG.md` for release history and `STATUS.md` for current development status.

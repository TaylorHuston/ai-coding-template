# AI Workflow Marketplace

A comprehensive AI-assisted development workflow system for Claude Code, providing intelligent task orchestration, specialized agent coordination, and file-based state management.

## What's Included

This marketplace contains:

- **AI Toolkit Plugin** - Complete workflow system with 19 commands, 19 specialized agents, and intelligent automation
- **Minimal Starter Template** - 9 essential files for clean project initialization via `/toolkit-init`
- **Guideline Library** - 16 comprehensive development guidelines bundled with plugin

## Quick Start

### Install and Initialize

```bash
# 1. Add this marketplace
/plugin marketplace add taylorh140/ai-coding-template

# 2. Install the AI Toolkit plugin
/plugin install ai-toolkit

# 3. Initialize your project
cd your-project
/toolkit-init

# 4. Start developing
/design --brief
```

The `/toolkit-init` command scaffolds your project with:
- Customized CLAUDE.md (your tech stack and links)
- Minimal structure (9 essential files, 60K)
- GETTING-STARTED.md guide
- Documentation framework (AI creates content as you work)
- Interactive setup with smart conflict resolution

## AI Toolkit Plugin

The AI Toolkit plugin provides a complete development workflow system:

### Setup & Core Workflow

- `/toolkit-init` - Initialize project structure with templates
- `/design` - Create project briefs, epics, and user stories
- `/architect` - Make technical architecture decisions
- `/plan` - Break down epics into implementation tasks
- `/develop` - Execute tasks with specialized agents

### Quality & Review Commands

- `/review` - Comprehensive code review
- `/security-audit` - OWASP-compliant security assessment
- `/test-fix` - Automated test failure resolution
- `/quality` - Multi-dimensional quality assessment

### Development Commands

- `/commit` - Quality-checked git commits
- `/merge-branch` - Safe branch merging with validation
- `/status` - Intelligent project status dashboard

### Documentation Commands

- `/docs-generate` - Generate comprehensive documentation
- `/docs-validate` - Validate documentation health and links
- `/docs-sync` - Synchronize documentation with code
- `/docs-update` - Update documentation accuracy
- `/docs-health` - Documentation health analysis

### Management Commands

- `/refresh` - Context-efficient project refresh
- `/improve` - Template improvement and enhancement

## Key Features

### 19 Specialized Agents

Domain experts that auto-activate based on task context:

- **Strategy & Design**: brief-strategist, code-architect
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
- **HANDOFF.yml** - Agent coordination and context transfer
- **RESEARCH.md** - Investigation findings and decisions

### Intelligent Automation

Event-driven hooks for quality enforcement:

- Quality gate validation after code changes
- Automated testing and linting
- Documentation synchronization checks
- Security compliance validation

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

- **docs/project/** - Project-specific documentation
- **docs/development/** - Development guidelines and patterns
- **docs/ai-toolkit/** - AI collaboration guides and references

## Repository Structure

```
ai-coding-template/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace configuration
└── plugins/
    └── ai-toolkit/                # AI Toolkit plugin
        ├── .claude-plugin/
        │   └── plugin.json
        ├── commands/              # 19 slash commands
        ├── agents/                # 19 specialized agents
        ├── templates/             # Bundled project templates
        │   └── starter/           # 75 template files
        ├── hooks/                 # Automation hooks
        ├── scripts/               # Support scripts
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

Current version: 0.9.1

See `CHANGELOG.md` for release history and `STATUS.md` for current development status.

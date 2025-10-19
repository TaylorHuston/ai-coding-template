# AI Workflow Marketplace

A comprehensive AI-assisted development workflow system for Claude Code, providing intelligent task orchestration, specialized agent coordination, and file-based state management.

## What's Included

This marketplace contains:

- **AI Toolkit Plugin** - Complete workflow system with 17 commands, 18 specialized agents, and intelligent automation
- **Starter Template** - Pre-configured project structure with documentation, guidelines, and examples

## Quick Start

### Install the Plugin

```bash
# Add this marketplace
/plugin marketplace add taylorh140/ai-coding-template

# Install the AI Toolkit plugin
/plugin install ai-toolkit
```

### Use the Starter Template

The `starter-template/` directory contains a ready-to-use project structure. Copy it to start a new project:

```bash
# Copy starter template to your new project
cp -r starter-template/* /path/to/your/project/

# Navigate to your project
cd /path/to/your/project/

# Start with the workflow
/design --brief
```

## AI Toolkit Plugin

The AI Toolkit plugin provides a complete development workflow system:

### Core Workflow Commands

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

### 18 Specialized Agents

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
├── plugins/
│   └── ai-toolkit/                # AI Toolkit plugin
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/              # 17 slash commands
│       ├── agents/                # 18 specialized agents
│       ├── hooks/                 # Automation hooks
│       ├── scripts/               # Support scripts
│       └── README.md
└── starter-template/              # Project template
    ├── CLAUDE.md                  # Project context template
    ├── README.md                  # Template usage guide
    ├── docs/                      # Documentation structure
    └── .gitignore                 # Git ignore patterns
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

Current version: 0.9.0

See `CHANGELOG.md` for release history and `STATUS.md` for current development status.

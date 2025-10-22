# {app-name}

{description}

## Quick Start

### Prerequisites

1. **Install AI Workflow Plugin**:
   ```bash
   /plugin marketplace add TaylorHuston/ai-coding-template
   /plugin install ai-workflow
   ```

2. **Customize Project Context**:
   - Edit `CLAUDE.md` with your tech stack and links
   - Update this README with your project details

### Start Developing

```bash
# 1. Complete your project brief
/project-brief

# 2. Create your first epic
/epic

# 3. Plan implementation
/plan TASK-001

# 4. Execute tasks
/implement TASK-001 1.1
```

## Project Structure

```
project/
├── CLAUDE.md              # AI assistant context
├── docs/
│   ├── project/           # Project documentation
│   ├── development/       # Development guidelines
│   └── ai-toolkit/        # AI collaboration guides
├── pm/                     # Project management
│   ├── epics/              # Feature epics
│   │   └── EPIC-###-name.md
│   ├── issues/             # Tasks and bugs
│   │   └── TASK-###-name/TASK.md
│   └── templates/          # PM templates
│       └── resources/
├── src/                   # Your application code
└── .claude/
    └── cache/             # Plugin caching
```

## Available Commands

### Core Workflow
- `/design` - Create briefs, epics, and user stories
- `/architect` - Make technical architecture decisions
- `/plan` - Break down epics into implementation tasks
- `/implement` - Execute specific phases with specialized agents

### Quality & Review
- `/review` - Comprehensive code review
- `/security-audit` - Security assessment
- `/test-fix` - Automated test fixing
- `/quality` - Quality assessment

### Development Tools
- `/commit` - Quality-checked git commits
- `/merge-branch` - Safe branch merging
- `/status` - Project status dashboard

### Documentation
- `/docs-generate` - Generate documentation
- `/docs-validate` - Validate documentation
- `/docs-sync` - Sync docs with code

See `docs/ai-toolkit/reference/commands.md` for complete command reference.

## Contributing

[Add your contribution guidelines]

## License

[Add your license]

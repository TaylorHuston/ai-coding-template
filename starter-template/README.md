# Project Name

> Replace this with your project's name and description

## Quick Start

### Prerequisites

1. **Install AI Workflow Plugin**:
   ```bash
   /plugin marketplace add taylorh140/ai-coding-template
   /plugin install ai-workflow
   ```

2. **Customize Project Context**:
   - Edit `CLAUDE.md` with your tech stack and links
   - Update this README with your project details

### Start Developing

```bash
# 1. Define your project vision
/design --brief

# 2. Create your first epic
/design --epic "user-authentication"

# 3. Make architecture decisions
/architect --epic "user-authentication"

# 4. Plan implementation
/plan --epic "user-authentication"

# 5. Execute tasks
/develop --epic "user-authentication"
```

## Project Structure

```
project/
├── CLAUDE.md              # AI assistant context
├── docs/
│   ├── project/           # Project documentation
│   ├── development/       # Development guidelines
│   └── ai-toolkit/        # AI collaboration guides
├── epics/                 # Work organized by epic
│   └── [epic-name]/
│       ├── EPIC.md
│       ├── TASK-###-*/
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
- `/develop` - Execute tasks with specialized agents

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

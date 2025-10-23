# AI Toolkit Plugin

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Comprehensive AI-assisted development workflow system for Claude Code with 14 commands, 20 specialized agents, and intelligent state management.

## Quick Start

```bash
# 1. Install plugin
/plugin install ai-toolkit

# 2. Initialize your project
cd my-project
/toolkit-init

# 3. Start developing
/project-brief
/epic
/plan TASK-001
/implement TASK-001 1.1
```

## What You Get

- **14 Workflow Commands** - Complete `/project-brief` → `/epic` → `/plan` → `/implement` cycle + utilities
- **20 Specialized Agents** - Domain experts (frontend, backend, security, testing, etc.)
- **3 Bundled MCP Servers** - Auto-configured tools (context7, sequential-thinking, playwright)
- **Starter Template** - 30 essential files for clean project initialization
- **File-Based State** - Session continuity via EPIC.md, TASK.md, WORKLOG.md, RESEARCH.md
- **Technology Agnostic** - Works with any tech stack

## Bundled MCP Servers

This plugin automatically configures essential MCP servers:

- **context7** - Library documentation and code examples
- **sequential-thinking** - Complex problem decomposition
- **playwright** - Browser automation for testing

No manual MCP configuration required! These tools are ready immediately after plugin installation.

**Optional MCP Servers**: For larger codebases (20+ files), consider adding [Serena](./docs/OPTIONAL-MCP-SERVERS.md) for semantic code analysis.

## Installation

```bash
/plugin install ai-toolkit
```

Commands and agents available immediately. Initialize your project structure with:

```bash
cd your-project
/toolkit-init
```

This creates:

```
my-project/
├── CLAUDE.md             # Customized project context
├── README.md             # Project template
├── GETTING-STARTED.md    # AI Toolkit usage guide
├── .gitignore            # Standard ignores
├── docs/
│   ├── README.md         # Documentation guide
│   ├── project-brief.md  # Your project vision
│   ├── project/          # Project-specific docs (created by AI)
│   └── development/      # Links to plugin guidelines
└── pm/pm/epics/                # Epic-based work (auto-created)
```

**AI creates structure as you work** - no empty placeholders or stale examples!

## Core Workflow

```bash
/project-brief                     # Define project vision (interactive)
/epic                              # Create epic with optional initial tasks
/epic EPIC-001                     # Refine epic, add more tasks (iterative)
/plan TASK-001                     # Add implementation plan to task
/implement TASK-001 1.1            # Execute specific phase with agents
```

## All Commands (14 Total)

**Setup & Strategy**: `/toolkit-init`, `/project-brief`
**Epic Management**: `/epic`
**Workflow**: `/architect`, `/plan`, `/implement`
**Quality**: `/quality`, `/security-audit`, `/test-fix`
**Development**: `/branch`, `/commit`, `/comment`
**Documentation & Status**: `/docs`, `/status`

See `docs/COMMANDS.md` for complete command reference.

## Documentation

**Plugin Documentation:**
- `docs/COMMANDS.md` - Complete command reference with workflow guidance
- `docs/AGENTS.md` - Agent catalog with system overview
- `docs/OPTIONAL-MCP-SERVERS.md` - Optional MCP servers for larger projects

## Updates

```bash
/plugin update ai-toolkit
```

All commands/agents update automatically. Your project files unchanged.

## Support

- [Issues](https://github.com/TaylorHuston/ai-coding-template/issues)
- [Discussions](https://github.com/TaylorHuston/ai-coding-template/discussions)

## License

MIT - See LICENSE file

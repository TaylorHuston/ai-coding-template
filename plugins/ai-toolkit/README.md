# AI Toolkit Plugin

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Comprehensive AI-assisted development workflow system for Claude Code with 19 commands, 19 specialized agents, and intelligent state management.

## Quick Start

```bash
# 1. Install plugin
/plugin install ai-toolkit

# 2. Initialize your project
cd my-project
/toolkit-init

# 3. Start developing
/design --brief
/design --epic "my-feature"
/architect --epic "my-feature"
/plan --epic "my-feature"
/develop --epic "my-feature"
```

## What You Get

- **19 Workflow Commands** - Complete `/design` → `/architect` → `/plan` → `/develop` cycle + `/toolkit-init`
- **19 Specialized Agents** - Domain experts (frontend, backend, security, testing, etc.)
- **3 Bundled MCP Servers** - Auto-configured tools (context7, sequential-thinking, playwright)
- **16 Development Guidelines** - Comprehensive standards (architectural, security, testing, etc.)
- **Minimal Templates** - 9 essential files for clean starts (AI builds what you need)
- **File-Based State** - Session continuity via EPIC.md, TASK.md, HANDOFF.yml
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
└── epics/                # Epic-based work (auto-created)
```

**AI creates structure as you work** - no empty placeholders or stale examples!

## Core Workflow

```bash
/design --brief                    # Define project vision
/design --epic "user-auth"        # Create epic structure
/architect --epic "user-auth"      # Technical decisions
/plan --epic "user-auth"           # Implementation tasks
/develop --epic "user-auth"        # Execute with agents
```

## All Commands

**Setup**: `/toolkit-init`
**Workflow**: `/design`, `/architect`, `/plan`, `/develop`
**Quality**: `/review`, `/security-audit`, `/test-fix`, `/quality`
**Development**: `/commit`, `/merge-branch`, `/status`
**Documentation**: `/docs-generate`, `/docs-validate`, `/docs-sync`
**Management**: `/refresh`, `/improve`

## Documentation

**Plugin Documentation:**
- `docs/COMMANDS.md` - Complete command reference
- `docs/AGENTS.md` - Agent catalog and capabilities
- `docs/OPTIONAL-MCP-SERVERS.md` - Optional MCP servers for larger projects
- `docs/guideline-mapping.yml` - Agent-guideline mappings

**Project Documentation** (after using starter template):
- `docs/ai-toolkit/guides/` - How-to guides
- `docs/ai-toolkit/reference/` - Extended references

## Updates

```bash
/plugin update ai-toolkit
```

All commands/agents update automatically. Your project files unchanged.

## Support

- [Issues](https://github.com/taylorh140/ai-coding-template/issues)
- [Discussions](https://github.com/taylorh140/ai-coding-template/discussions)

## License

MIT - See LICENSE file

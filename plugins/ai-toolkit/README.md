# AI Toolkit Plugin

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Comprehensive AI-assisted development workflow system for Claude Code with 18 commands, 19 specialized agents, and intelligent state management.

## Quick Start

```bash
# 1. Install plugin
/plugin install ai-toolkit

# 2. Initialize your project
git clone https://github.com/taylorh140/ai-coding-template my-project
cd my-project

# 3. Start developing
/design --brief
/design --epic "my-feature"
/architect --epic "my-feature"
/plan --epic "my-feature"
/develop --epic "my-feature"
```

## What You Get

- **18 Workflow Commands** - Complete `/design` → `/architect` → `/plan` → `/develop` cycle
- **19 Specialized Agents** - Domain experts (frontend, backend, security, testing, etc.)
- **3 Bundled MCP Servers** - Auto-configured tools (context7, sequential-thinking, playwright)
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

Commands and agents available immediately. Your project needs minimal setup:

```
my-project/
├── CLAUDE.md          # Your tech stack context
├── docs/              # Project documentation
└── epics/             # Your work (auto-created)
```

## Core Workflow

```bash
/design --brief                    # Define project vision
/design --epic "user-auth"        # Create epic structure
/architect --epic "user-auth"      # Technical decisions
/plan --epic "user-auth"           # Implementation tasks
/develop --epic "user-auth"        # Execute with agents
```

## All Commands

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

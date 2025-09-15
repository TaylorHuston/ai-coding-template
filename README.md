# AI Coding Template

Transform your AI coding assistant into a team of specialized experts with perfect memory and consistent patterns.

## Why Use This Template?

AI coding tools are powerful but have limitations. The biggest challenge? **Limited context windows** that cause AI assistants to "forget" previous implementations and lose track during long working sessions leading to duplicate code, broken integrations, and degraded quality over time.

**This template attempts to solve these problems with:**

- ✅ **17 Specialized AI Agents** - Expert consultants for every development task
- ✅ **Smart Context Management** - Preserve project knowledge across sessions
- ✅ **Automated Quality Gates** - Maintain standards automatically
- ✅ **Proven Workflow Patterns** - Best practices built-in
- ✅ **Team Collaboration Support** - Scale AI assistance across your team

This template was built with Claude Code and VSCode in mind, but should adaptable to other IDEs and assistants.

## Quick Start (5 Minutes)

### Prerequisites

- Git (2.25+)
- Node.js (16+)
- VS Code or preferred editor
- AI assistant account (Claude, Cursor, etc.)

### Setup

```bash
# 1. Clone the template
git clone https://github.com/yourusername/ai-coding-template.git my-project
cd my-project

# 2. Run quick setup
./scripts/setup-manager.sh quick

# 3. Verify installation
./scripts/ai-status.sh --check
```

**→ [Complete Setup Guide](./docs/ai-template/setup/quick-start.md)** - Detailed instructions and troubleshooting

### First AI Session

**→ [Getting Started Guide](./docs/ai-template/setup/quick-start.md#first-ai-session)** - Step-by-step first session walkthrough

## Project Structure

```
my-project/
├── .claude/                  # AI agent system
│   └── agents/              # 17 specialized agents
├── deliverables/            # Feature and issue tracking
│   └── [feature]/issues/    # Organized work items
├── docs/                    # Three-tier documentation
│   ├── project/             # YOUR project's documentation
│   ├── development/         # Team processes & guidelines
│   └── ai-template/         # AI assistant & template docs
├── scripts/                 # Automation tools
├── CLAUDE.md               # AI assistant instructions
└── STATUS.md               # Current project state
```

## Core Features

### AI Agents

Your team of specialists, automatically activated based on task:

| Agent                   | Purpose           | Example Use                 |
| ----------------------- | ----------------- | --------------------------- |
| **frontend-specialist** | UI/UX development | "Create a login form"       |
| **backend-specialist**  | Server logic      | "Build REST API"            |
| **database-specialist** | Data modeling     | "Design user schema"        |
| **test-engineer**       | Testing           | "Write unit tests"          |
| **security-auditor**    | Security          | "Audit for vulnerabilities" |

[View all 17 agents →](./docs/ai-template/guides/ai-agents-guide.md)

### Automation Tools

Essential scripts for AI-assisted development:

- `setup-manager.sh` - Project initialization and validation
- `ai-status.sh` - AI-friendly project status dashboard
- **CHANGELOG System** - Complete changelog automation:
  - `ai-changelog-audit.sh` - Audit and track missing entries
  - `ai-update-changelog.sh` - Interactive entry management
  - `check-changelog.sh` - Git hook integration
  - `release.sh` - Automated release process
- `validate-integration.sh` - Health checks and validation

[View all tools →](./scripts/README.md)

## Documentation

### 📚 Getting Started

- [Integration Guide](./docs/ai-template/setup/integration-guide.md) - Add to existing projects
- [AI Agents Guide](./docs/ai-template/guides/ai-agents-guide.md) - Master the agent system
- [Common Workflows](./docs/development/workflows/README.md) - Step-by-step processes

### 🔧 References

- [Troubleshooting](./docs/ai-template/reference/troubleshooting.md) - Solve common issues
- [FAQ](./docs/ai-template/reference/troubleshooting.md#frequently-asked-questions) - Frequently asked questions
- [Changelog Guide](./docs/development/guidelines/changelog-maintenance.md) - Maintain project history

### 🎯 Quick Links

- [AI Collaboration Guide](./docs/ai-template/guides/ai-collaboration-guide.md)
- [Documentation Guidelines](./docs/development/guidelines/documentation-guidelines.md)
- [Quick Reference](./docs/ai-template/reference/)

## For Existing Projects

Already have a project? No problem! Three integration options:

### Option 1: Quick Try (5 mins)

```bash
# Just add agents and context files
curl -O [template-url]/.claude/agents.tar.gz
tar -xzf agents.tar.gz
```

### Option 2: Gradual Adoption (1 week)

- Week 1: Add agents and context files
- Week 2: Integrate workflows
- Week 3: Full automation

### Option 3: Full Integration

[Complete Integration Guide →](./docs/ai-template/setup/integration-guide.md)

## Contributing

This template evolves with community input. Contributions welcome!

- 🐛 [Report Issues](https://github.com/yourusername/ai-coding-template/issues)
- 💡 [Suggest Features](https://github.com/yourusername/ai-coding-template/discussions)
- 🤝 [Submit PRs](https://github.com/yourusername/ai-coding-template/pulls)

See our GitHub repository for contribution guidelines.

## Learn More

- 📖 [Blog Post: Why AI Assistants Forget](https://example.com/blog)
- 🎥 [Video: Agent System Overview](https://example.com/video)
- 💬 [Discord Community](https://discord.gg/example)
- 🌟 [Star on GitHub](https://github.com/yourusername/ai-coding-template)

## License

MIT License - see repository for full license details.

---

**Ready to supercharge your AI-assisted development?** Start with the [Quick Start](#quick-start-5-minutes) or explore the [Documentation](#documentation).

## Resources

- [C4 Model](https://c4model.com)
- [12Factor](https://12factor.net)

## Inspiration

Just a list of related things. Other projects attempting to accomplish the same goal, blog posts on the subject, etc.

### Repos

- [GitHub Spec Kit](https://github.com/github/spec-kit)

### Posts

- [GitHub: Spec Driven Development](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)

Built with ❤️ by developers tired of AI assistants forgetting everything.

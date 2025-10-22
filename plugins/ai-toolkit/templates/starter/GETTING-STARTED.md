# Getting Started with AI Toolkit

Welcome! You've just initialized your project with the AI Toolkit for Claude Code.

## What You Have

Your project starts with a **minimal, focused structure**:

```
your-project/
├── CLAUDE.md          # Your project context (customized)
├── README.md          # Project overview
├── .gitignore         # Standard ignore patterns
├── GETTING-STARTED.md # This file
├── docs/
│   ├── README.md      # Documentation guide
│   ├── project-brief.md # Your project vision (start here!)
│   ├── project/       # Project-specific docs (created as you work)
│   └── development/   # Links to plugin guidelines
└── epics/             # Work organization (created by /design)
```

**Why so minimal?** Because the AI Toolkit helps you **build what you need, when you need it**.

## How It Works

The AI Toolkit uses **commands** to help you design, architect, plan, and develop your project:

### 1. Define Your Vision
```bash
/design --brief
```
This guides you through creating your project brief - the "what" and "why" of your project.

### 2. Create Your First Epic
```bash
/design --epic "user-authentication"
```
The AI helps you break down features into epics with user stories and acceptance criteria.

### 3. Make Architecture Decisions
```bash
/architect --epic "user-authentication"
```
Explore technical solutions, create ADRs (Architecture Decision Records), and document your choices.

### 4. Plan Implementation
```bash
/plan --epic "user-authentication"
```
Break the epic into specific implementation tasks with agent assignments and testing requirements.

### 5. Build It
```bash
/develop --epic "user-authentication"
```
Execute tasks with specialized AI agents (frontend-specialist, backend-specialist, test-engineer, etc.).

## The AI Builds Your Structure

As you use the commands, the AI creates documentation and structure automatically:

- **Architecture docs** appear when you use `/architect`
- **Epic directories** are created by `/design --epic`
- **ADRs** are written during `/architect` sessions
- **Feature docs** emerge from `/design` work
- **Test plans** come from `/plan` tasks

**No empty placeholders. No stale examples. Just what you actually need.**

## Guidelines & Best Practices

The AI Toolkit includes **16 comprehensive guidelines** covering:
- Architectural principles
- API design
- Security best practices
- Testing standards
- Code quality
- And more...

**These live in the plugin**, so they:
- ✅ Update when the plugin updates
- ✅ Stay consistent across all your projects
- ✅ Can be customized per-project when needed

To customize a guideline for your project:
1. Copy from plugin: `docs/development/guidelines/api-guidelines.md`
2. Edit for your needs
3. AI agents will use your project version

See `docs/development/README.md` for details.

## Examples & Documentation

Looking for examples or detailed guides?

**Plugin Documentation** (always up-to-date):
- Command reference: In your editor, navigate to plugin docs
- Agent guides: Comprehensive agent system documentation
- Examples: ADR explorations, architecture templates
- Setup guides: MCP servers, hooks, integrations

**Your Project Documentation** (grows with your work):
- `docs/project-brief.md` - Start here with your vision
- `docs/project/` - Architecture, features, decisions (created by AI)
- `epics/` - Your actual work (created by `/design`)

## Next Steps

1. **Review CLAUDE.md** - Verify your tech stack and external links
2. **Create Your Vision** - Run `/design --brief` to define your project
3. **Start Your First Epic** - Run `/design --epic "epic-name"`
4. **Learn As You Go** - The AI will guide you through the workflow

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/toolkit-init` | Initialize project structure |
| `/design` | Create briefs, epics, user stories |
| `/architect` | Make technical decisions |
| `/plan` | Break down implementation |
| `/develop` | Execute with AI agents |
| `/review` | Code quality assessment |
| `/commit` | Quality-checked commits |
| `/status` | Project status dashboard |

For complete command reference, see the plugin documentation.

## Philosophy

This toolkit embraces **AI-assisted development**:

- **AI helps you build**, not pre-built everything
- **Structure emerges from work**, not upfront planning
- **Documentation reflects reality**, not aspirations
- **Guidelines are shared**, not duplicated
- **Examples inspire**, not clutter

Welcome to the future of development. Let's build something amazing! 🚀

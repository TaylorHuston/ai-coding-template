# Getting Started with AI Toolkit

Welcome! You've initialized your project with the AI Toolkit for Claude Code.

## Your Project Structure

```
your-project/
├── CLAUDE.md               # Project context for AI
├── README.md               # Project overview
├── GETTING-STARTED.md      # This file
├── docs/
│   ├── project-brief.md    # Your vision (start here!)
│   ├── project/            # Architecture, ADRs, design assets
│   └── development/        # Guidelines (6 customizable templates)
└── pm/
    ├── epics/              # Feature planning
    ├── issues/             # Tasks and bugs
    └── templates/          # Issue templates
```

**Why minimal?** The AI Toolkit builds what you need, when you need it. No empty placeholders or stale examples.

## Quick Start

### 1. Define Your Vision
```bash
/project-brief
```
Interactive conversation to create your project brief - the "what" and "why" of your project.

### 2. Plan Your First Feature
```bash
/epic
```
Create an epic to organize related work. The AI helps you break it down into tasks.

### 3. Make Architecture Decisions
```bash
/architect
```
Explore technical solutions and create ADRs (Architecture Decision Records).

### 4. Plan Implementation
```bash
/plan TASK-001
```
Break tasks into implementation phases with clear steps and testing requirements.

### 5. Build It
```bash
/implement TASK-001 1.1
```
Execute specific phases with specialized AI agents (frontend, backend, test, security, etc.).

## Git Workflow

The AI Toolkit enforces a **three-branch workflow** for production safety:

```
main (production)
  ↑
  └─ develop (staging)
       ↑
       ├─ feature/TASK-001  (your work)
       ├─ feature/TASK-002
       └─ bugfix/BUG-001
```

### Branch Management

**Work branches are created automatically:**
```bash
/implement TASK-001 1.1
# → Creates feature/TASK-001 if needed
# → Switches to the branch
# → Executes the phase
```

**Merging to staging (with test validation):**
```bash
/branch merge develop
# → Runs all tests
# → Blocks if any fail
# → Merges if all pass
```

**Promoting to production (with staging validation):**
```bash
/branch switch develop
/branch merge main
# → Runs staging health checks
# → Validates deployment
# → Merges if validated
```

**Clean up after merge:**
```bash
/branch delete feature/TASK-001
# → Verifies fully merged
# → Deletes local and remote
```

### Commit Messages

Branch-aware commits automatically include issue references:

```bash
# On feature/TASK-001
/commit "add user authentication"
# → Generates: feat(TASK-001): add user authentication
```

### Workflow Configuration

Your git workflow is defined in `docs/development/guidelines/git-workflow.md`:
- Branch naming patterns
- Merge validation rules
- Commit message format
- Production safety requirements

Commands automatically read and enforce these rules.

## How It Works

### Commands Guide You
Each command is conversational and guides you through its workflow:
- `/project-brief` asks questions to fill in your vision
- `/epic` helps structure features with acceptance criteria
- `/architect` explores options and creates ADRs
- `/plan` breaks work into testable phases
- `/implement` executes with domain-specific agents

### Structure Emerges
As you work, the AI creates documentation automatically:
- **ADRs** from `/architect` sessions
- **Task plans** from `/plan` command
- **Implementation notes** during `/implement`
- **Test plans** integrated throughout

### Guidelines Adapt
Your project includes 6 customizable guideline templates in `docs/development/guidelines/`:
- `api-guidelines.md` - API patterns and structure
- `testing-standards.md` - Testing approach
- `git-workflow.md` - Branching and commits
- `coding-standards.md` - Code style
- `security-guidelines.md` - Security practices
- `architectural-principles.md` - Design philosophy

Start with TBD placeholders, fill in via `/architect` decisions, customize as needed.

## Next Steps

1. **Review CLAUDE.md** - Add your tech stack and external links
2. **Create Your Vision** - Run `/project-brief`
3. **Start Your First Feature** - Run `/epic`
4. **Learn As You Go** - Commands guide you through the workflow

## Command Reference

| Command | Purpose |
|---------|---------|
| `/toolkit-init` | Initialize project structure |
| `/project-brief` | Create/update project vision |
| `/epic` | Plan features and epics |
| `/architect` | Make technical decisions (ADRs) |
| `/plan TASK-###` | Break down implementation |
| `/implement TASK-### PHASE` | Execute specific phases |
| `/branch` | Branch operations (create, merge, delete, switch) |
| `/commit` | Branch-aware git commits |
| `/quality` | Quality assessment |
| `/test-fix` | Fix failing tests |
| `/status` | Project status dashboard |
| `/docs` | Documentation management |

## Specialized Agents

The AI Toolkit includes **20 specialized agents** that automatically activate based on your work:

| Agent | Domain | Auto-Activates For |
|-------|--------|-------------------|
| **brief-strategist** | Product strategy | Project brief development |
| **code-architect** | System design | Architecture decisions, ADRs |
| **ui-ux-designer** | Design & UX | Design decisions, mockups |
| **frontend-specialist** | UI development | Component development |
| **backend-specialist** | Server-side | API implementation, business logic |
| **database-specialist** | Data design | Schema design, query optimization |
| **api-designer** | API architecture | Endpoint design, contracts |
| **test-engineer** | Testing | Test creation, TDD/BDD |
| **code-reviewer** | Code quality | Post-implementation reviews |
| **security-auditor** | Security | Security-critical changes |
| **performance-optimizer** | Performance | Performance bottlenecks |
| **devops-engineer** | Infrastructure | Deployment, CI/CD |
| **technical-writer** | Documentation | Documentation creation |
| **context-analyzer** | Investigation | Bug diagnosis, analysis |
| **project-manager** | Coordination | Multi-agent workflows |
| **refactoring-specialist** | Code cleanup | Technical debt reduction |
| **migration-specialist** | Upgrades | Framework migrations |
| **data-analyst** | Data processing | Analytics, reporting |
| **ai-llm-expert** | AI/ML | LLM architecture, AI integration |

**You don't need to invoke agents manually** - they activate automatically when you use commands like `/implement`, `/architect`, or `/quality`.

## Need More Information?

**Ask Claude** - Claude has access to complete plugin documentation and can answer questions:

- "How does the security-auditor agent work?"
- "When should I use the code-architect vs api-designer?"
- "How does the /architect command work?"
- "Show me the full command workflow"
- "What's the difference between /epic and /plan?"

Claude reads the plugin documentation (AGENTS.md, COMMANDS.md) and provides detailed explanations.

## Philosophy

This toolkit embraces AI-assisted development:
- **AI helps you build**, not pre-built templates
- **Structure emerges from work**, not upfront planning
- **Documentation reflects reality**, not aspirations
- **Guidelines are templates**, customized per project

Welcome to AI-assisted development. Let's build something! 🚀

# Documentation File Structure Examples

## Repository Documentation Structure

```text
project/
├── README.md                 # Project overview and quick start
├── CHANGELOG.md             # Version history (Keep a Changelog format)
├── CLAUDE.md                # AI assistant instructions
├── docs/                    # Project-wide documentation
│   ├── architecture/        # Technical architecture
│   │   └── system-design.md # Core architecture decisions
│   ├── api/                 # API specifications (when needed)
│   ├── guides/              # How-to guides
│   └── templates/           # Document templates
├── deliverables/            # Epic-level work packages
│   └── [DELIVERABLE]/
│       ├── README.md        # Deliverable overview
│       └── issues/          # Individual tasks
│           └── [ISSUE]/
│               ├── PLAN.md      # Task checklist (~50 lines)
│               └── README.md    # Implementation guide (~200 lines)
└── scripts/                 # Automation tools
```

## C4 Architecture Documentation Structure

```text
docs/architecture/
├── c4-overview.md              # C4 methodology guide
├── system-context.md           # Level 1: System boundaries and external actors
├── container-architecture.md   # Level 2: Technology choices and responsibilities
├── components/                 # Level 3: Component-level architecture
│   ├── agent-orchestration.md # Component details for complex containers
│   └── context-management.md  # Component details for complex containers
└── workflows/                  # Dynamic diagrams for key scenarios
    ├── project-setup.md        # Workflow-specific architecture views
    └── feature-development.md  # Multi-container interaction patterns
```

## File Naming Conventions

- Use **lowercase-kebab-case** exclusively (e.g., `authentication-guide.md`)
- Be descriptive but concise
- No redundant suffixes (avoid `guide` in guides/ folder)
- **Always use README.md** for directory documentation
- Never use INDEX.md or other variations
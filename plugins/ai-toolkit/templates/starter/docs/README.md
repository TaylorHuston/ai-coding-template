# Documentation

This directory contains all project documentation using a **three-tier structure** that separates concerns and keeps things organized.

## Structure

```
docs/
├── project-brief.md     # Start here - your project's "why"
├── project/             # Project-specific documentation
│   ├── architecture/    # System design, tech stack (created by /architect)
│   ├── features/        # Feature documentation (created by /design)
│   ├── decisions/       # ADRs and explorations (created by /architect)
│   ├── api/             # API documentation (created by agents)
│   └── database/        # Schema and migrations (created by agents)
├── development/         # Development practices and guidelines
│   └── README.md        # Points to plugin guidelines + customization info
└── reports/             # Generated reports (created by /docs-health, etc.)
```

## Three-Tier Documentation System

### Tier 1: Project Documentation (`docs/project/`)

**What goes here**: Documentation **specific to your project**
- Architecture decisions
- Feature specifications
- API contracts
- Database schemas
- Business logic

**Created by**: AI commands as you work (`/design`, `/architect`, `/plan`)

**Examples**:
- `project/architecture/system-overview.md` - Your system's architecture
- `project/features/user-authentication.md` - How auth works in your app
- `project/decisions/001-database-choice.md` - Why you chose PostgreSQL

### Tier 2: Development Guidelines (`docs/development/`)

**What goes here**: Development **standards and practices**
- Coding standards
- API guidelines
- Security best practices
- Testing requirements
- Code review checklists

**Default location**: Plugin guidelines (shared across all projects)

**Customization**: Copy to project when you need project-specific variations

See `development/README.md` for details on customization.

### Tier 3: AI Toolkit Documentation

**What goes here**: Documentation about **using the AI Toolkit**
- Command references
- Agent guides
- Setup instructions
- Troubleshooting

**Location**: Lives in the plugin, not your project (stays up-to-date)

**Access**: Check plugin documentation in your Claude Code installation

## How Documentation Grows

Your documentation starts minimal and **grows organically**:

1. **Start**: `project-brief.md` (you write this with `/design --brief`)
2. **Design Phase**: Feature docs appear in `project/features/`
3. **Architecture Phase**: ADRs and architecture docs in `project/decisions/` and `project/architecture/`
4. **Planning Phase**: Implementation docs and test plans
5. **Development Phase**: API docs, database schemas, generated docs

**No empty placeholders. No stale examples. Just what you actually create.**

## Quick Actions

**Create your project brief**:
```bash
/design --brief
```

**Generate architecture documentation**:
```bash
/architect --epic "epic-name"
```

**Validate documentation health**:
```bash
/docs-health
```

**Synchronize docs with code**:
```bash
/docs-sync
```

## Documentation Philosophy

- **Living Documents**: Docs reflect current reality, not outdated plans
- **Just-In-Time**: Created when needed, not upfront
- **AI-Generated**: AI helps maintain accuracy and completeness
- **Project-Specific**: Only what's unique to your project lives here
- **Shared Wisdom**: Common practices stay in plugin (DRY principle)

Start with `project-brief.md` and let the AI help you build from there! 📚

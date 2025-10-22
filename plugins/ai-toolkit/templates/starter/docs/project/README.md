# Project Documentation

This directory contains documentation **specific to your project**.

## What Goes Here

**Project-specific documentation** that describes YOUR application:
- Architecture decisions
- Feature specifications
- API contracts
- Database schemas
- Business logic and workflows

**Not generic development practices** (those live in plugin guidelines).

## Structure (Created As You Work)

The AI Toolkit creates these subdirectories when you use the commands:

```
project/
├── README.md (this file)
├── architecture/   # Created by /architect
│   ├── system-overview.md
│   ├── tech-stack.md
│   └── c4-models/
├── decisions/      # Created by /architect
│   ├── 001-database-choice.md
│   ├── 002-api-framework.md
│   └── explorations/
├── features/       # Created by /design
│   ├── user-authentication.md
│   └── payment-processing.md
├── api/            # Created by api-designer agent
│   ├── endpoints.md
│   └── schemas/
├── database/       # Created by database-specialist agent
│   ├── schema.md
│   └── migrations/
└── implementations/  # Created during /develop
    └── feature-guides/
```

**These directories don't exist yet.** They'll be created automatically when you use the relevant commands.

## How It Grows

1. **Start with Brief**: Run `/design --brief` to create `project-brief.md`
2. **Design Features**: `/design --epic "name"` creates feature docs
3. **Architecture Decisions**: `/architect` creates ADRs and architecture docs
4. **During Development**: Agents create API docs, database schemas, etc.

**Just-in-time documentation** - created when you need it, not before.

## Next Step

Create your project brief:
```bash
/design --brief
```

This is where you define what you're building and why!

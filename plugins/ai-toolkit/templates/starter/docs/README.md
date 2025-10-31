# Documentation

This directory contains all project documentation, organized by purpose.

## Structure

```
docs/
├── project-brief.md         # Start here - your project's vision and goals
├── project/                 # Project-specific documentation
│   ├── architecture-overview.md  # Tech stack and system architecture
│   ├── adrs/                # Architecture Decision Records
│   └── design/              # Design assets (mockups, color schemes, etc.)
└── development/             # Development guidelines
    └── guidelines/          # 6 customizable guideline templates
```

## How Documentation Works

### Start Minimal
Your project begins with just `project-brief.md` and guideline templates with TBD placeholders.

### Grows Organically
As you work, documentation is created automatically:
- **ADRs**: Created via `/adr` when making technical decisions
- **Architecture docs**: Filled in as you make technology choices
- **Design assets**: Added as you work on UI/UX
- **Guidelines**: Updated from TBD to actual decisions

### No Empty Placeholders
Documentation reflects what you've actually built, not aspirational plans.

## Key Documents

### `project-brief.md` - Your North Star
Run `/project-brief` to create or update your project vision through interactive conversation.

### `project/architecture-overview.md` - Tech Stack Reference
Comprehensive technical specifications:
- System architecture
- Technology stack (frontend, backend, infrastructure)
- APIs and data models
- Security and deployment

Update as you make architectural decisions via `/adr`.

### `project/adrs/` - Decision History
Architecture Decision Records document important technical choices. Create via `/adr`.

### `development/guidelines/` - Project Configuration
6 customizable templates that configure how AI agents work in your project. See `development/README.md` for details.

## Commands

Create and manage documentation using AI commands:
- `/project-brief` - Create/update project vision
- `/adr` - Make technical decisions and create ADRs
- `/docs` - Generate, validate, or sync documentation

See `GETTING-STARTED.md` for complete workflow.

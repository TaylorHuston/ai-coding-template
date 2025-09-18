---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "guide"
tags: ["auto-generated", "architecture", "documentation"]
---

# Auto-Generated Architecture Documentation

**⚠️ WARNING: Never manually edit files in this directory - they are automatically generated!**

## Purpose

This directory contains architecture documentation that is automatically extracted from the codebase. These files provide factual information about the current state of the project based on code analysis.

## Generated Files

- **tech-stack.md** - Technology analysis extracted from package.json, .env files, and configuration
- **system-overview.md** - Project structure and component analysis from directory scanning
- **dependency-graph.md** - Production and development dependency relationships

## How to Update

These files are updated automatically when you run:

```bash
# Generate all auto-documentation
./scripts/docs-manager.sh auto-docs all

# Generate specific documentation
./scripts/docs-manager.sh auto-docs tech-stack
./scripts/docs-manager.sh auto-docs system-overview
./scripts/docs-manager.sh auto-docs dependencies
```

## Integration with Manual Documentation

This auto-generated documentation provides the **factual foundation** that manual architecture documentation in the parent directory builds upon:

- **Auto-generated** (this directory): WHAT exists in the codebase
- **Manual** (parent directory): WHY architectural decisions were made

## Relationship to Three-Tier Documentation Structure

This directory follows the template's three-tier documentation model:

```
docs/
├── technical/              # Tier 1: YOUR project's technical documentation
│   └── architecture/
│       ├── auto-generated/ # 🤖 Factual data extraction (this directory)
│       └── *.md           # 📝 Manual architecture decisions and design
├── development/           # Tier 2: Team processes & guidelines
└── ai-tools/             # Tier 3: AI template usage documentation
```

## Automation Details

- **Trigger**: Run manually or automatically via technical-writer
- **Source Data**: Package.json, .env files, directory structure, dependencies
- **Update Frequency**: On-demand or when significant code changes detected
- **Validation**: Files include generation timestamps and metadata

---

*This directory maintains the separation between automatically extracted facts and manually curated architectural decisions, ensuring accurate and conflict-free documentation.*
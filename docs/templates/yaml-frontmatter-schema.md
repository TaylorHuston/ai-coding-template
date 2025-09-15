# YAML Frontmatter Schema

---
version: "0.1.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "technical-writers", "ai-assistants"]
document_type: "schema"
tags: ["documentation", "standards", "yaml", "frontmatter"]
---

This document defines the standardized YAML frontmatter schema for all documentation files in this project. YAML frontmatter provides machine-readable metadata while preventing formatting issues with linters and code formatters.

## Core Schema Fields

### Required Fields

All documentation files MUST include these fields:

```yaml
---
version: "string"           # Semantic version (e.g., "1.0.0", "2.1.3")
created: "YYYY-MM-DD"       # Creation date in ISO 8601 format
last_updated: "YYYY-MM-DD"  # Last modification date in ISO 8601 format
status: "string"            # Document status (see valid values below)
target_audience: ["array"]  # List of intended audiences (see valid values below)
---
```

### Optional Fields

Documents MAY include these additional fields based on their type and purpose:

```yaml
---
# Document classification
document_type: "string"     # Type of document (see valid values below)
tags: ["array"]            # List of relevant tags for categorization
category: "string"         # High-level category classification

# Authorship and ownership
author: "string"           # Primary author name or identifier
maintainer: "string"      # Current maintainer name or identifier
reviewers: ["array"]      # List of document reviewers

# Content metadata
difficulty: "string"       # Complexity level (see valid values below)
estimated_time: "string"  # Estimated reading/completion time (e.g., "10 min", "2 hours")
prerequisites: ["array"]  # Required knowledge or setup before using

# Technical metadata
related_files: ["array"]  # List of related file paths
api_version: "string"     # Relevant API version if applicable
framework_version: "string" # Framework or tool version if applicable

# Workflow metadata
workflow_stage: "string"  # Stage in development workflow
priority: "string"       # Document priority level
next_review: "YYYY-MM-DD" # Scheduled review date
---
```

## Valid Values

### Status Values
- `active` - Document is current and actively maintained
- `draft` - Document is under development
- `review` - Document is under review/approval
- `deprecated` - Document is outdated but kept for reference
- `archived` - Document is no longer relevant

### Target Audience Values
- `developers` - Software developers and engineers
- `ai-assistants` - AI coding assistants and agents
- `technical-writers` - Documentation specialists
- `project-managers` - Project management stakeholders
- `end-users` - Application end users
- `administrators` - System administrators
- `stakeholders` - Business stakeholders

### Document Type Values
- `guide` - Step-by-step instructions or tutorials
- `reference` - Quick reference or lookup documentation
- `architecture` - System design and architecture documentation
- `api` - API documentation and specifications
- `template` - Reusable document templates
- `schema` - Data or document schemas
- `troubleshooting` - Problem-solving and debugging guides
- `setup` - Installation and configuration instructions
- `workflow` - Process and workflow documentation
- `decision-record` - Architecture decision records (ADRs)
- `specification` - Technical specifications
- `plan` - Project or feature planning documents

### Difficulty Values
- `beginner` - No prior knowledge required
- `intermediate` - Some experience required
- `advanced` - Significant expertise required
- `expert` - Deep domain knowledge required

### Priority Values
- `critical` - Must be maintained and kept current
- `high` - Important for project success
- `medium` - Useful but not essential
- `low` - Nice to have

## Document Type Templates

### Basic Template
For most documentation files:

```yaml
---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers"]
document_type: "guide"
---
```

### Guide Template
For instructional documentation:

```yaml
---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "guide"
difficulty: "intermediate"
estimated_time: "30 min"
prerequisites: ["basic-git-knowledge"]
tags: ["setup", "configuration"]
---
```

### API Documentation Template
For API-related documentation:

```yaml
---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers"]
document_type: "api"
api_version: "v2.1"
tags: ["rest-api", "authentication"]
---
```

### Architecture Documentation Template
For system design documents:

```yaml
---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "stakeholders"]
document_type: "architecture"
author: "architecture-team"
reviewers: ["senior-engineer", "tech-lead"]
tags: ["system-design", "scalability"]
---
```

### Template File Template
For reusable templates:

```yaml
---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "technical-writers"]
document_type: "template"
tags: ["template", "documentation"]
---
```

## Implementation Guidelines

### Date Format
- Use ISO 8601 date format: `YYYY-MM-DD`
- Always use quotes around date strings
- Update `last_updated` whenever content changes

### Version Management
- Follow semantic versioning: `MAJOR.MINOR.PATCH`
- Increment versions based on content significance:
  - PATCH: Minor corrections, typos, formatting
  - MINOR: New sections, significant additions
  - MAJOR: Complete rewrites, structural changes

### Array Formatting
Use JSON-style arrays for consistency:
```yaml
target_audience: ["developers", "ai-assistants"]
tags: ["api", "authentication", "security"]
```

### String Formatting
- Use quotes for all string values
- Use lowercase with hyphens for multi-word values: `"target-audience"`
- Use snake_case for field names: `target_audience`

## Migration Process

When converting existing documentation:

1. Add YAML frontmatter block at the top of the file
2. Replace bold metadata headers with appropriate YAML fields
3. Ensure all required fields are present
4. Add optional fields as relevant to the document type
5. Update `last_updated` field to current date
6. Increment version if this represents a significant change

## Validation

Documents with YAML frontmatter should:
- Parse as valid YAML
- Include all required fields
- Use only valid values from the schema
- Follow consistent formatting conventions
- Be compatible with static site generators and documentation tools

## Examples

### Before (Legacy Format)
```markdown
# API Authentication Guide

**Version**: 1.2.0 **Created**: 2025-08-21 **Last Updated**: 2025-09-15 **Status**: Active **Target Audience**: Developers

This guide explains how to authenticate...
```

### After (YAML Frontmatter Format)
```markdown
---
version: "1.2.0"
created: "2025-08-21"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers"]
document_type: "guide"
tags: ["api", "authentication"]
---

# API Authentication Guide

This guide explains how to authenticate...
```

## Benefits

- **Machine-readable**: Easy parsing by tools and scripts
- **Linter-safe**: Won't be modified by code formatters
- **Extensible**: Can add new fields without breaking existing tools
- **Standardized**: Consistent format across all documentation
- **Tool-compatible**: Works with static site generators and documentation platforms
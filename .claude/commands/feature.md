---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "features", "requirements"]
---

# /feature Command

**Purpose**: Define feature requirements through natural conversation about user problems and solutions.

## Usage

```bash
/feature --new "Feature Name"    # Create new feature document
/feature --update feature-name   # Update existing feature
/feature --validate feature-name # Check vision alignment
```

## Approach

**Natural conversation focused on user problems and requirements**:

- Start with user journey and pain points
- Define essential vs nice-to-have capabilities
- Establish success metrics and validation approach
- Identify dependencies and constraints
- Document requirements in `docs/technical/features/`

**Key principle**: Ground requirements in actual user problems, not technical solutions.

## Conversation Flow

**Start with the user**: Who has this problem and what's their current experience?
**Define the pain**: What specifically is broken or missing today?
**Explore solutions**: What capabilities would solve this? What's essential vs nice-to-have?
**Set success criteria**: How will you know this feature works?
**Identify dependencies**: What does this connect to or depend on?

## Outputs

**Feature specification** in `docs/technical/features/` with:

- Problem statement and user journey
- Requirements (must-have vs nice-to-have)
- Success metrics and validation plan
- Dependencies and integration points

## Integration with Workflow

**Position**: After `/vision`, before `/architect`

- Vision goals → feature requirements → technical implementation

# Documentation Guidelines

This guide explains what documentation goes where in this AI coding template, following the "Docs as Code" philosophy with a minimal, developer-focused approach.

## Core Philosophy

- **Minimal**: Just enough documentation for developers and AI to work effectively
- **Practical**: Code examples over lengthy explanations  
- **Separated**: Clear boundaries between planning (PLAN.md) and implementation (README.md)
- **Not a Replacement**: This template complements, not replaces, project management tools (Jira/Linear) and documentation systems (Confluence/Notion)

## Repository Documentation Structure

```
project/
├── README.md                 # Project overview and quick start
├── CHANGELOG.md             # Version history (Keep a Changelog format)
├── CLAUDE.md                # AI assistant instructions
├── docs/                    # Project-wide documentation
│   ├── technical.md         # Architecture and technical decisions
│   ├── documentation-guidelines.md  # This file
│   └── guides/             # How-to guides
├── deliverables/           # Epic-level work packages
│   └── [DELIVERABLE]/      
│       ├── README.md       # Deliverable overview
│       └── issues/         # Individual tasks
│           └── [ISSUE]/    
│               ├── PLAN.md     # Task checklist (~50 lines)
│               └── README.md   # Implementation guide (~200 lines)
└── scripts/                # Automation tools
```

## What Goes Where

### Project Level

| File | Purpose | What Goes Here |
|------|---------|----------------|
| `/README.md` | Project entry point | Project description, quick start, setup instructions |
| `/CHANGELOG.md` | Version history | All changes following Keep a Changelog format |
| `/CLAUDE.md` | AI instructions | Rules and context for AI assistants |
| `/docs/technical.md` | Architecture | System design, tech stack, decisions |

### Deliverable Level (Epic)

| File | Purpose | What Goes Here |
|------|---------|----------------|
| `README.md` | Deliverable overview | Goal, scope, issue list, success metrics |

### Issue Level (Task)

| File | Purpose | What Goes Here | What DOESN'T Go Here |
|------|---------|----------------|----------------------|
| **PLAN.md** | Task orchestration | • Task checklist<br>• Acceptance criteria<br>• Brief context (2-3 lines)<br>• Progress tracking | • Code examples<br>• Detailed explanations<br>• Implementation details |
| **README.md** | Implementation guide | • Code examples<br>• Configuration files<br>• Step-by-step instructions<br>• Troubleshooting | • Status tracking<br>• Project management<br>• Acceptance criteria |

## PLAN.md Template

Keep PLAN.md focused on WHAT needs to be done and tracking progress:

```markdown
# [ISSUE-KEY]: [Brief Title]

## Goal
[1-2 sentences describing the objective]

## Tasks
- [ ] Task 1 - Brief description
- [ ] Task 2 - Brief description  
- [x] Task 3 - ✅ Completed 2025-08-26

## Acceptance Criteria
- [ oot Criterion 1
- [ ] Criterion 2

## Context
[Optional: 2-3 lines of critical context for AI agents]
```

**Target length**: ~50 lines

## README.md Template (Issue Level)

Keep README.md focused on HOW to implement:

```markdown
# [Title] Implementation Guide

## Quick Start
[Essential commands or setup steps]

## Implementation

### Configuration Example
```yaml
# Actual working configuration
```

### Code Example
```javascript
// Actual working code
```

## Testing
[How to validate the implementation]

## Troubleshooting
- **Issue**: [Common problem]
  **Solution**: [How to fix]
```

**Target length**: ~200 lines

## What NOT to Include

### Don't Duplicate Project Management
These belong in Jira/Linear, not in the repo:
- Detailed user stories
- Extensive acceptance criteria  
- Sprint planning information
- Time estimates
- Resource allocation

### Don't Over-Document
Avoid:
- Explaining standard patterns already in the codebase
- Documenting what the code clearly shows
- Writing extensive background that won't help implementation
- Creating documents "just in case"

## AI Assistant Guidelines

When AI assistants work with documentation:

1. **Read PLAN.md first** to understand current progress
2. **Update checklist** as tasks are completed
3. **Keep README.md practical** with working code examples
4. **Don't add bloat** - if it's not helpful for implementation, leave it out
5. **Use clear markers** for AI-completed tasks: `✅ Completed [date]`

## Documentation Maintenance

### When to Update Docs
- **PLAN.md**: Update checklist in real-time as work progresses
- **README.md**: Update when implementation approach changes
- **CHANGELOG.md**: Update before committing features

### When to Delete Docs  
- Remove completed issue directories after merge to main
- Archive old deliverables rather than deleting
- Clean up outdated examples in README.md

## Examples

### Good PLAN.md Entry
```markdown
## Tasks
- [x] Create Docker configuration - ✅ Completed 2025-08-26
- [ ] Add environment variables
- [ ] Test container startup
```

### Good README.md Entry
```markdown
## Docker Setup

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
```

Run with: `docker-compose up`
```

### Bad Documentation (Too Heavy)
```markdown
## User Story
As a developer, I want containerization so that...
[10 paragraphs of justification]

## Acceptance Criteria  
Given... When... Then...
[20 detailed scenarios]
```

## Key Principles

1. **If it helps coding, include it**
2. **If it's project management, link to it**  
3. **If it's obvious from the code, don't document it**
4. **If an AI needs context, put it in PLAN.md**
5. **If a developer needs examples, put it in README.md**

## Remember

This template is for **getting work done**, not for managing projects. Keep documentation minimal, practical, and focused on helping developers and AI assistants complete tasks efficiently.
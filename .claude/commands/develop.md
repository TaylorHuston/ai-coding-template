---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "development", "execution"]
---

# /develop Command

**Purpose**: Execute implementation tasks through intelligent agent coordination and systematic progression through the implementation plan.

## Usage

```bash
/develop                 # Execute next task in plan
/develop P2.3.0         # Execute specific task by ID
/develop --instruct     # Learn approach without changes
/develop --force        # Skip validation checks
```

## Approach

**Systematic task execution** through specialist agent coordination:

- Find next unchecked task in PLAN.md
- Route to appropriate specialist agent based on task type
- Provide planning context and requirements
- Validate completion and update coordination files
- Track progress through implementation phases

**Key principle**: Execute tasks systematically with proper agent expertise and quality validation.

## Execution Process

**Task Detection**: What's the next task to complete in our current phase?
**Agent Selection**: Which specialist should handle this task type?
**Context Provision**: What planning artifacts and requirements guide execution?
**Quality Validation**: How do we confirm successful completion?
**Progress Updates**: What coordination files need updating?

## Outputs

**Implementation progress** with updated coordination files:

- **PLAN.md**: Mark tasks complete with checkboxes
- **HANDOFF.yml**: Record implementation decisions and context
- **RESEARCH.md**: Capture discoveries and technical learnings
- **STATUS.md**: Update project progress summaries

## Integration with Workflow

**Position**: Final execution phase after `/vision`, `/feature`, `/architect`, and `/plan`

- Implementation plans → specialist agent execution → validated deliverables

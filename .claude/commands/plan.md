---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "planning", "implementation"]
---

# /plan Command

**Purpose**: Break down features and architecture into actionable implementation tasks through multi-agent coordination.

## Usage

```bash
/plan --issue ISSUE-KEY              # Create implementation plan
/plan --review-plan                  # Review existing plan
```

## Approach

**Multi-agent task breakdown**:

- Gather context from vision, feature, and architecture documents
- Consult specialist agents for domain-specific planning
- Break work into phases (P1, P2, P3) with clear dependencies
- Assign tasks to appropriate specialist agents
- Create coordination files for agent handoffs

**Key principle**: Make plans technically feasible and properly sequenced.

## Planning Process

**Analyze context**: What's already been decided about this feature/issue?
**Break down work**: What are the major phases and specific tasks?
**Coordinate agents**: Which specialists should handle each task?
**Manage dependencies**: What needs to happen in what order?
**Plan quality gates**: How will you validate progress?

## Outputs

**Implementation plan** in deliverables/issue/ with:

- **PLAN.md**: Phases, tasks, dependencies, agent assignments
- **HANDOFF.yml**: Context for agent coordination
- **RESEARCH.md**: Accumulated knowledge and decisions

## Integration with Workflow

**Position**: After `/vision`, `/feature`, and `/architect`, before `/develop`

- Requirements + architecture → implementation plan → task execution


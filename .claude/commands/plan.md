---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "planning", "implementation"]
description: "Epic-driven implementation planning with progressive task discovery and X.Y.Z task structure"
argument-hint: "[--epic \"name\"] [--task \"###\"] [--review-epic \"name\"] [--issue KEY]"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Grep", "Glob", "TodoWrite", "Task"]
model: "claude-opus-4-1"
---

# /plan Command

**Purpose**: Sequence tasks and add implementation details to epic-driven development through multi-agent coordination.

## Usage

```bash
/plan --epic "name"                  # Plan all tasks in epic with sequencing and implementation
/plan --task "###" --epic "name"     # Plan specific task with implementation details
/plan --review-epic "name"           # Review existing epic implementation plan
```

## Approach

**Epic-driven implementation planning**:

- Gather context from EPIC.md, task requirements, and architecture decisions (resources/ADR-*.md)
- Sequence tasks based on dependencies discovered across /design and /architect phases
- Add X.Y.Z implementation tasks to each TASK.md file with TDD/BDD integration
- Create dedicated testing tasks for comprehensive coverage (95%+ target)
- Create agent coordination files (HANDOFF.yml) for each task directory
- Organize epic execution in logical phases with testing gates

**Key principle**: Transform requirements and architecture into executable implementation steps.

## Planning Process

**Analyze epic context**: Review EPIC.md, existing tasks, and resources/ADR-*.md for full picture
**Sequence tasks**: Order tasks by dependencies in EPIC.md "Implementation Phases"
**Add implementation details**: Enhance each TASK.md with X.Y.Z numbered implementation tasks
**Integrate testing strategy**: Add TDD/BDD requirements and create dedicated testing tasks
**Coordinate agents**: Create HANDOFF.yml in each task directory for agent assignments
**Plan quality gates**: Define completion criteria, coverage targets (95%+), and validation approaches
**Discover missing tasks**: Identify coordination, infrastructure, and testing tasks needed

## Outputs

**Enhanced epic structure** with implementation details:

- **EPIC.md**: Updated with "Implementation Phases" section showing task execution order
- **TASK.md files**: Enhanced with "Implementation Tasks" using X.Y.Z numbering and testing requirements
- **HANDOFF.yml**: Agent coordination file in each task directory
- **RESEARCH.md**: Knowledge capture template in each task directory
- **Testing Tasks**: Dedicated TASK-###-testing directories for comprehensive test coverage
- **New tasks**: Additional coordination/infrastructure/testing tasks discovered during planning

## Integration with Workflow

**Position**: After `/design` and `/architect`, before `/develop`

**Workflow Integration**:

- **After /design**: Takes user stories and acceptance criteria as input
- **After /architect**: Incorporates technical decisions (resources/ADR-*.md) into implementation approach
- **Before /develop**: Provides detailed, sequenced implementation tasks with agent coordination
- **Supports discovery**: Can add new tasks discovered during planning phase

**Progressive Enhancement**: Builds on requirements (design) and decisions (architect) to create executable plans.

## Examples

**Plan entire epic**: `/plan --epic "user-authentication"`

- Sequences all discovered tasks in execution order
- Adds implementation details to each TASK.md
- Creates agent coordination files

**Plan specific task**: `/plan --task "001" --epic "user-authentication"`

- Focuses on single task implementation breakdown
- Creates detailed X.Y.Z task structure

**Reference format**: TASK-001:1.2.3 for precise implementation task identification

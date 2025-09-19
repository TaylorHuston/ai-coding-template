---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "development", "execution"]
description: "Execute implementation tasks with test-first enforcement and epic integration"
argument-hint: "[--epic \"name\"] [--task \"###\"] [--review]"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: "claude-3-5-sonnet-20241022"
---

# /develop Command

Execute epic tasks with full context awareness and intelligent agent coordination.

## Usage

```bash
/develop --epic "name"                        # Continue next task in sequence
/develop --task "###" --epic "name"          # Work on specific task
/develop --review --epic "name"               # Review progress and blockers
/develop --discover "task-name" --epic "name" # Add discovered task
```

## Core Principles

- **Test-First**: Auto-invoke test-engineer for all implementation (95%+ coverage)
- **Context-Aware**: Full epic goals, ADRs, dependencies, and task coordination
- **Progressive**: Handle task discovery during implementation
- **Quality-Gated**: Validate against acceptance criteria and architectural decisions

## Execution Flow

### 1. Context Loading
Read from epic directory:
- `EPIC.md`: Goals, success criteria, task execution order
- `TASK-###-*/TASK.md`: Requirements, X.Y.Z subtasks, dependencies
- `resources/ADR-*.md`: Technical decisions and constraints
- `HANDOFF.yml`: Current status, agent assignments

### 2. Task Execution
- Select specialist agent based on task domain and X.Y.Z subtasks
- Provide full context: epic goals, ADRs, acceptance criteria
- Execute X.Y.Z implementation tasks in dependency order
- Track progress with check marks (✓) and test coverage

### 3. Progress Updates
- Mark completed subtasks in TASK.md (✓ 1.1.1, ✓ 1.1.2)
- Update HANDOFF.yml with current focus and next steps
- Record discoveries and decisions in RESEARCH.md
- Update EPIC.md task list and implementation phases

### 4. Task Discovery
When implementation reveals new work:
- Use `/develop --discover "task-name" --epic "epic-name"`
- Creates new `TASK-###-name/` directory with templates
- Updates EPIC.md task list in appropriate execution order
- Adjusts dependencies and timeline as needed

## Quality Gates

- **Acceptance Criteria**: Validate against user stories from `/design`
- **ADR Compliance**: Follow architectural decisions from `resources/`
- **Test Coverage**: 95%+ comprehensive test suite (unit, integration, E2E)
- **Quality Checks**: Linting, security validation, performance requirements

## Dependencies & Coordination

- **Blocking**: Identify alternatives or resolution steps when dependencies block
- **Parallel**: Coordinate independent task streams across multiple developers
- **Updates**: Track blocking information and coordination state in HANDOFF.yml

## Outputs

- **TASK.md**: Updated with completed X.Y.Z subtasks (✓ markers)
- **HANDOFF.yml**: Current focus, progress, and agent coordination state
- **RESEARCH.md**: Discoveries, decisions, and technical learnings
- **EPIC.md**: Completed tasks marked in task list and implementation phases

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

**Purpose**: Execute implementation tasks from plans through intelligent agent coordination and progress tracking.

## Usage

```bash
/develop                 # Execute next task in plan
/develop P2.3.0         # Execute specific task by ID
/develop --instruct     # Learn approach without changes
/develop --force        # Skip validation checks
```

## Objectives

**Primary Goal**: Execute planned implementation tasks through specialist agent coordination with quality validation and progress tracking.

**Core Outcomes**:
1. **Task Execution**: Complete specific implementation tasks from PLAN.md
2. **Agent Coordination**: Route tasks to appropriate specialist agents
3. **Quality Validation**: Ensure task completion meets requirements
4. **Progress Tracking**: Update plan status and coordination files
5. **Context Preservation**: Maintain implementation state across tasks

## Approach

Use **intelligent task orchestration** to execute implementations:
- Automatically detect next task in active plan phase
- Route tasks to specialist agents based on expertise
- Provide comprehensive context from planning artifacts
- Validate completion against task requirements
- Update coordination files with implementation results

**Focus on systematic execution** - complete tasks in logical order with proper validation and handoffs.

## Key Execution Areas

### Task Management
- What is the next task to execute in the current phase?
- Which specialist agent should handle this task?
- What context and requirements guide execution?
- How do we validate successful completion?

### Agent Coordination
- How do we route tasks to appropriate specialists?
- What context does each agent need for success?
- How do we handle handoffs between agents?
- What information needs preservation across tasks?

### Quality Assurance
- How do we validate task completion?
- What criteria determine successful implementation?
- When do we move to the next phase?
- How do we maintain quality standards?

### Progress Tracking
- How do we update plan status after completion?
- What coordination information needs updating?
- How do we communicate progress to the team?
- When do we trigger commits and phase transitions?

## Execution Structure

Execute implementation tasks with these components:

**Task Processing**:
1. **Detection** - Find next unchecked task in PLAN.md
2. **Agent Selection** - Route to specialist based on task type
3. **Context Assembly** - Gather requirements and dependencies
4. **Execution** - Agent implements task requirements
5. **Validation** - Verify completion against success criteria

**Coordination Updates**:
- **PLAN.md** - Mark tasks complete with checkboxes
- **HANDOFF.yml** - Record implementation decisions and context
- **RESEARCH.md** - Capture discoveries and learnings
- **STATUS.md** - Update project progress summaries

Include execution markers:
- Task completion status
- Quality validation results
- Implementation decisions made
- Next task dependencies

## Integration with Workflow

**Position**: Executes planned work by coordinating specialist agents

**Relationship to Other Commands**:
- **After /plan**: Executes tasks defined in implementation plan
- **Uses specialist agents**: Routes work to appropriate domain experts
- **Tracks progress**: Maintains state through task completion
- **Enables iteration**: Supports incremental development cycles

## Success Criteria

**Successful Task Execution**:
- Task requirements implemented completely
- Quality validation criteria satisfied
- Appropriate agent handled implementation
- Coordination files updated accurately
- Progress tracked and communicated

**Quality Indicators**:
- Implementation meets task specifications
- Code quality standards maintained
- Dependencies properly handled
- Phase transitions occur correctly


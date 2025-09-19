---
version: "0.4.0"
created: "2025-09-17"
last_updated: "2025-09-18"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "planning", "implementation"]
description: "Implementation planning for epics, standalone tasks, and bugs with X.Y.Z task structure"
argument-hint: "[--epic \"name\"] [--task \"###\"] [--misc \"task-id\"] [--bug \"bug-id\"] [--review-epic \"name\"] [--issue KEY]"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Grep", "Glob", "TodoWrite", "Task"]
model: "claude-opus-4-1"
---

# /plan Command

**Purpose**: Add implementation details and sequencing to epics, standalone tasks, and bugs through multi-agent coordination.

## Usage

### Epic Planning
```bash
/plan --epic "name"                  # Plan all tasks in epic with sequencing and implementation
/plan --task "###" --epic "name"     # Plan specific task with implementation details
/plan --review-epic "name"           # Review existing epic implementation plan
```

### Interactive Standalone Task Planning
```bash
/plan --misc "task name"             # Create MISC-### with auto-incrementing number and interactive planning
/plan --misc-review "MISC-001"       # Review existing misc task plan
```

### Interactive Bug Planning
```bash
/plan --bug "bug description"        # Create BUG-### with auto-incrementing number and interactive planning
/plan --bug-review "BUG-001"         # Review existing bug fix plan
```

## Approach

### **Epic-Driven Planning**
- Gather context from EPIC.md, task requirements, and architecture decisions (resources/ADR-*.md)
- Sequence tasks based on dependencies discovered across /design and /architect phases
- Add X.Y.Z implementation tasks to each TASK.md file with TDD/BDD integration
- Create dedicated testing tasks for comprehensive coverage (95%+ target)
- Create agent coordination files (HANDOFF.yml) for each task directory
- Organize epic execution in logical phases with testing gates

### **Interactive Standalone Task Planning**
- Auto-generate MISC-### ID by scanning workbench/misc/ for next available number
- Create task directory structure: `workbench/misc/MISC-###-task-name/`
- Interactive requirements gathering through back-and-forth conversation:
  - Ask for detailed task description and objectives
  - Clarify any ambiguous requirements or scope
  - Identify acceptance criteria and success metrics
  - Determine appropriate methodology and approach
- Generate comprehensive TASK.md, HANDOFF.yml, and RESEARCH.md
- Create detailed X.Y.Z implementation breakdown based on clarified requirements

### **Interactive Bug Planning**
- Auto-generate BUG-### ID by scanning workbench/bugs/ for next available number
- Create bug directory structure: `workbench/bugs/BUG-###-bug-description/`
- Interactive bug analysis through structured conversation:
  - Ask for detailed reproduction steps and environment details
  - Clarify expected vs actual behavior
  - Assess impact and priority level
  - Identify investigation approach and debugging strategy
- Generate comprehensive BUG.md, HANDOFF.yml, and RESEARCH.md
- Create structured investigation and fix plan with X.Y.Z breakdown

**Key principle**: Transform requirements into executable implementation steps regardless of work type.

## Planning Process

### **For Epics**
1. **Analyze epic context**: Review EPIC.md, existing tasks, and resources/ADR-*.md for full picture
2. **Sequence tasks**: Order tasks by dependencies in EPIC.md "Implementation Phases"
3. **Add implementation details**: Enhance each TASK.md with X.Y.Z numbered implementation tasks
4. **Integrate testing strategy**: Add TDD/BDD requirements and create dedicated testing tasks
5. **Coordinate agents**: Create HANDOFF.yml in each task directory for agent assignments
6. **Plan quality gates**: Define completion criteria, coverage targets (95%+), and validation approaches
7. **Discover missing tasks**: Identify coordination, infrastructure, and testing tasks needed

### **For Interactive Standalone Tasks (Misc)**
1. **Auto-generate ID**: Scan workbench/misc/ to find next available MISC-### number
2. **Create directory**: Create workbench/misc/MISC-###-task-name/ with kebab-case formatting
3. **Interactive requirements gathering**:
   - Ask user for detailed task description and objectives
   - Clarify scope, constraints, and acceptance criteria through conversation
   - Identify success metrics and validation approach
   - Determine required resources and dependencies
4. **MANDATORY: Use templates**: Generate task structure using established templates:
   - **TASK.md**: Use `.resources/templates/workflow/epic/task.template.md` with placeholder substitution
   - **HANDOFF.yml**: Use agent coordination template patterns
   - **RESEARCH.md**: Use research methodology template
5. **Create implementation plan**: Develop detailed X.Y.Z task breakdown with checkboxes based on clarified requirements
6. **Assign agents**: Determine appropriate agent assignments based on task type and complexity
7. **Finalize planning**: Confirm plan with user and adjust based on feedback

### **For Interactive Bug Planning**
1. **Auto-generate ID**: Scan workbench/bugs/ to find next available BUG-### number
2. **Create directory**: Create workbench/bugs/BUG-###-description/ with kebab-case formatting
3. **Interactive bug analysis**:
   - Ask user for detailed reproduction steps and environment information
   - Clarify expected vs actual behavior through conversation
   - Assess business impact and priority level
   - Identify affected systems and potential root causes
4. **Generate bug structure**: Create BUG.md, HANDOFF.yml, and RESEARCH.md with gathered information
5. **Plan investigation strategy**: Develop systematic approach for root cause analysis
6. **Plan fix implementation**: Structure fix approach with X.Y.Z task breakdown
7. **Define testing and validation**: Plan regression testing and fix verification approach
8. **Finalize bug plan**: Confirm approach with user and adjust based on feedback

## Outputs

### **For Epics**
- **EPIC.md**: Updated with "Implementation Phases" section showing task execution order
- **TASK.md files**: Enhanced with "Implementation Tasks" using X.Y.Z numbering and testing requirements
- **HANDOFF.yml**: Agent coordination file in each task directory
- **RESEARCH.md**: Knowledge capture template in each task directory
- **Testing Tasks**: Dedicated TASK-###-testing directories for comprehensive test coverage
- **New tasks**: Additional coordination/infrastructure/testing tasks discovered during planning

### **For Interactive Standalone Tasks (Misc)**
- **Auto-generated directory**: `workbench/misc/MISC-###-task-name/`
- **TASK.md**: Comprehensive task definition with clarified requirements and X.Y.Z implementation breakdown
- **HANDOFF.yml**: Agent coordination with assignments based on task complexity and type
- **RESEARCH.md**: Methodology and approach documentation based on interactive planning
- **Implementation Plan**: Detailed step-by-step execution plan derived from user conversation

### **For Interactive Bug Planning**
- **Auto-generated directory**: `workbench/bugs/BUG-###-description/`
- **BUG.md**: Complete bug report with reproduction steps, impact assessment, and investigation plan
- **HANDOFF.yml**: Agent coordination with debugging specialists and investigation assignments
- **RESEARCH.md**: Investigation strategy and findings documentation
- **Investigation Plan**: Systematic root cause analysis approach
- **Fix Plan**: Structured implementation and testing strategy

## Integration with Workflow

### **Epic Workflow Integration**
**Position**: After `/design` and `/architect`, before `/develop`

- **After /design**: Takes user stories and acceptance criteria as input
- **After /architect**: Incorporates technical decisions (resources/ADR-*.md) into implementation approach
- **Before /develop**: Provides detailed, sequenced implementation tasks with agent coordination
- **Supports discovery**: Can add new tasks discovered during planning phase

### **Interactive Standalone Task Integration**
**Position**: On-demand creation and planning, independent of epic workflow

- **User-initiated**: Triggered by `/plan --misc "task name"` command
- **Auto-incrementing**: Automatically assigns next available MISC-### number
- **Conversational planning**: Interactive requirements gathering through back-and-forth dialogue
- **Immediate execution**: Task ready for `/develop` phase after planning completion
- **Flexible scope**: Supports any type of standalone work (analysis, development, maintenance, etc.)

### **Interactive Bug Workflow Integration**
**Position**: Immediate response capability, independent of epic cycles

- **User-initiated**: Triggered by `/plan --bug "bug description"` command
- **Auto-incrementing**: Automatically assigns next available BUG-### number
- **Structured analysis**: Interactive bug analysis through guided conversation
- **Investigation-first**: Emphasizes systematic root cause analysis before fixing
- **Rapid response**: Bug tracking and resolution planning in single session

**Universal Principle**: All work types benefit from systematic planning and agent coordination.

## Examples

### **Epic Planning**
**Plan entire epic**: `/plan --epic "user-authentication"`
- Sequences all discovered tasks in execution order
- Adds implementation details to each TASK.md
- Creates agent coordination files

**Plan specific task**: `/plan --task "001" --epic "user-authentication"`
- Focuses on single task implementation breakdown
- Creates detailed X.Y.Z task structure

### **Interactive Standalone Task Planning**
**Create new miscellaneous task**: `/plan --misc "update documentation system"`

**Conversation flow**:
```
AI: I'll create MISC-002-update-documentation-system. Can you provide a detailed
    description of what needs to be accomplished?

User: I want to modernize our documentation system to use better tooling and
      improve the developer experience.

AI: To clarify the scope:
    1. What specific aspects of the current documentation system need improvement?
    2. Are there particular tools or technologies you want to evaluate?
    3. What does "better developer experience" mean in this context?
    4. Is this a research task, implementation task, or both?

User: [Provides clarifications...]

AI: Based on our discussion, I'll create a comprehensive task plan with X.Y.Z
    implementation breakdown and assign appropriate agents.
```

**Review existing task**: `/plan --misc-review "MISC-002"`

### **Interactive Bug Planning**
**Create new bug report**: `/plan --bug "login fails on mobile devices"`

**Conversation flow**:
```
AI: I'll create BUG-001-login-fails-on-mobile-devices. Can you provide detailed
    reproduction steps?

User: Users can't log in using mobile browsers, getting a "session expired" error.

AI: To help plan the investigation:
    1. Which mobile browsers and versions are affected?
    2. Does this happen immediately or after some time?
    3. What's the expected behavior vs what users see?
    4. How many users are affected?
    5. Is there a workaround available?

User: [Provides details...]

AI: I'll create a structured investigation plan with systematic root cause
    analysis and coordinate appropriate debugging specialists.
```

**Review existing bug**: `/plan --bug-review "BUG-001"`

### **File Structure Examples**
```
workbench/
├── epics/[epic-name]/           # Epic-driven development
├── misc/MISC-001-[task]/        # Standalone miscellaneous tasks
└── bugs/BUG-001-[description]/  # Bug investigation and fixes
```

**Interactive Features**:
- **Auto-incrementing IDs**: Automatically assigns next available number
- **Conversational planning**: Back-and-forth requirements gathering
- **Structured outputs**: Comprehensive task/bug documentation
- **Agent coordination**: Automatic assignment of appropriate specialists

**Reference formats**:
- Epic tasks: `TASK-001:1.2.3`
- Misc tasks: `MISC-001:1.2.3` (auto-generated)
- Bug tasks: `BUG-001:1.2.3` (auto-generated)

## Interactive Planning Implementation

When implementing `/plan --misc "task name"` or `/plan --bug "description"`:

1. **Scan for next ID**: Check workbench/misc/ or workbench/bugs/ for highest existing number
2. **Create directory**: Generate kebab-case directory name with auto-incremented ID
3. **Start conversation**: Ask initial open-ended question about requirements/details
4. **Iterative clarification**: Ask follow-up questions to resolve ambiguity
5. **Generate structure**: Create all necessary files (TASK.md/BUG.md, HANDOFF.yml, RESEARCH.md)
6. **Confirm plan**: Present final plan to user for approval/adjustments

**Key principle**: Interactive planning ensures comprehensive requirements capture and eliminates ambiguity before implementation begins.

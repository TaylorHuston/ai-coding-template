---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-18"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "design", "vision", "features", "non-technical", "epic"]
allowed-tools: ["Read", "Write", "Edit", "Grep", "Glob", "TodoWrite"]
argument-hint: "[--brief|--epic \"name\"|--task \"name\" [--epic \"epic-name\"]|--review]"
description: "Create and document non-technical project aspects from vision to epic structure with user stories"
model: "claude-opus-4-1"
---

# /design Command

**Purpose**: Create and document all non-technical aspects of your project - from high-level vision to specific feature requirements.

## Usage

```bash
/design --brief               # Create/update project brief
/design --epic "name"         # Create epic-driven development structure
/design --task "name"         # Create user story/task within current or specified epic
/design --task "name" --epic "epic-name"  # Create task in specific epic
/design --review              # Review and validate existing design docs
```

## Objectives

**Primary Goal**: Capture and document the "what" and "why" of your project without getting into technical implementation details.

**Core Outcomes**:

1. **Project Brief Documents**: Project purpose, goals, and success metrics
2. **Epic Structure**: Organized development units with clear scope and business context
3. **User Stories**: Individual TASK files with user stories and acceptance criteria
4. **Business Context**: Problem statements, target audience, and value propositions
5. **Test Scenarios**: BDD-style Given-When-Then scenarios derived from acceptance criteria
6. **Design Documentation**: Create appropriate docs in `docs/` or project root

## Approach

**Flexible scope design** - use for any level of non-technical planning:

- **Project Brief**: Overall product strategy and goals
- **Epic Development**: Organized work units that align with project management tools
- **User Stories**: Individual tasks with user workflows and acceptance criteria
- **Business Requirements**: User needs, constraints, and success criteria
- **Requirements Definition**: What capabilities users need and why they need them

**Collaborative exploration** to uncover design elements through natural conversation rather than rigid templates.

## Design Levels

- **Brief**: Problem statement, solution approach, target audience, success metrics
- **Epic**: Organized work units with scope, planned tasks, and external PM tool links
- **Task**: Individual user stories with acceptance criteria and business value
- **Requirements Only**: No implementation details (those belong in `/plan`)

## File Structure

**Brief**: `docs/project-brief.md` - Problem, solution, audience, success metrics
*Uses template: `.resources/templates/docs/project/project-brief.template.md`*

**Epic**: `epics/[name]/EPIC.md` - Overview, scope, planned tasks, external refs, status management, dependencies

**Tasks**: `epics/[name]/TASK-###-[name]/TASK.md` - User stories, acceptance criteria in task directories

**Resources**: `epics/[name]/resources/` - Architecture decisions (ADRs), research, screenshots, customer feedback

## Integration with Workflow

**Position**: First phase for any new project, feature, or significant change

**Clear Separation from /architect**:

- **`/design`**: Focus on WHAT users need and WHY they need it (non-technical)
- **`/architect`**: Focus on HOW to build it technically (implementation decisions)

**Workflow Relationships**:

- **Before /architect**: Define user needs and business requirements before technical decisions
- **Guides /architect**: Technical choices must support design requirements and constraints
- **Informs /plan**: Implementation planning based on design specifications
- **Validates /develop**: Ensure implementation meets design intent

**Flexible Usage**:

- Start new projects with project-brief-level design
- Add features with feature-level design
- Break down complex features with story-level design
- Use at any granularity that makes sense for your project

## Success Criteria

**Effective Design Documents**:

- Clear problem or need statement
- Specific target users and use cases
- Measurable success criteria or acceptance criteria
- Actionable requirements for implementation
- Alignment between project brief, features, and stories

**Quality Indicators**:

- Stakeholders can explain requirements consistently
- Implementation teams understand what to build
- Architecture decisions support design goals
- Success can be measured and validated

## Agent Coordination

**Primary Approach**: Direct conversation with user, no specific agents required

**Supporting Consultation** (when beneficial):

- **project-manager**: For complex multi-feature design coordination
- **context-analyzer**: For understanding existing system requirements
- Any domain specialists for requirement validation and feasibility input

**Key Principle**: Keep design phase non-technical - save implementation details for `/architect` phase.

## Examples: /design vs /architect

**`/design` captures WHAT and WHY** (user perspective):

- "Users need to upload files up to 100MB for document sharing"
- "System must support 1000 concurrent users during peak hours"
- "Users require real-time notifications when someone mentions them"
- "Data must be retained for 7 years for compliance"

**Plus testable scenarios**:

- "Given a user has a 50MB file, When they upload it, Then it completes within 30 seconds"
- "Given 1000 concurrent users, When they all access the dashboard, Then response time stays under 2 seconds"

**`/architect` decides HOW** (technical implementation):

- "Use S3 with multipart upload API for 100MB file handling"
- "Deploy on Kubernetes with horizontal pod autoscaling for 1000 users"
- "Implement WebSockets via Socket.io for real-time notifications"
- "PostgreSQL with partitioned tables for 7-year data retention"

## Quick Examples

**Create project brief**: `/design --brief`
**Create epic with planned tasks**: `/design --epic "user-authentication"`
**Add user story to epic**: `/design --task "User Registration" --epic "user-authentication"`

*For detailed workflow examples, see [Design Workflow Examples Guide](../../docs/ai-tools/guides/design-workflow-examples.md)*

## Progressive Task Discovery

**Task Creation Flow**:

- **`/design`** creates initial user-facing tasks (numbered by discovery order)
- **`/architect`** may create additional technical foundation tasks
- **`/plan`** sequences all tasks for execution and adds implementation details
- **`/develop`** can discover new tasks during implementation

**Task Structure**: Each task gets its own directory with TASK.md, plus HANDOFF.yml and RESEARCH.md added during planning/development.

**Resource Organization**: All reference materials stored in `resources/` directory within each epic for clean separation from executable tasks.

**Epic Evolution**: EPIC.md maintains current task list in execution order, updated as tasks are discovered across workflow phases.

## Epic Lifecycle Management

**Status Tracking**: Epics include status metadata (planning → active → blocked → completed → archived) for project coordination.

**Cross-Epic Dependencies**: Epic files document relationships with other epics:

- **Requires**: Dependencies that must complete before this epic can start
- **Blocks**: Other epics that depend on this epic's completion
- **Shares**: Resources or coordination needed between concurrent epics

**Timeline Management**: Start dates and target completion for project planning and coordination.

**Knowledge Capture**: Lessons learned section populated upon epic completion for organizational learning.

*Uses templates from `.resources/templates/workflow/epic/` for consistent structure*

## Tools

- **Read**: Access existing design documents and project context
- **Write**: Create new design documents, vision files, and epic structures
- **Edit**: Update existing design documentation and epic components
- **Grep**: Search for existing design patterns and references across the codebase
- **Glob**: Discover related design files and templates for consistency
- **TodoWrite**: Track progress during complex design workflows

## Additional Resources

- **[Design Workflow Examples](../../docs/ai-tools/guides/design-workflow-examples.md)** - Detailed epic and task creation examples
- **[Epic Templates](../../.resources/templates/workflow/epic/)** - Template files for consistent structure

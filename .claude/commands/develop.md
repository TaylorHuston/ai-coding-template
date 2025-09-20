---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-19"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "development", "execution"]
description: "Execute implementation tasks with test-first enforcement and epic integration"
argument-hint: "[--epic \"name\"] [--task \"###\"] [--review] [--guided]"
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
/develop --guided [other flags]               # Teaching mode: suggest code, don't change directly
```

## Core Principles

- **Test-First**: Auto-invoke test-engineer for all implementation (95%+ coverage)
- **Context-Aware**: Full epic goals, ADRs, dependencies, and task coordination
- **Progressive**: Handle task discovery during implementation
- **Quality-Gated**: Validate against acceptance criteria and architectural decisions
- **User-Controlled**: Guided mode for learning and explicit code change approval

## Guided Mode (--guided flag)

When `--guided` flag is used, enforce **teaching mode** behavior:

### **Code Change Restrictions**
- **NO direct file modifications** - Never use Write, Edit, or MultiEdit tools
- **Suggest code only** - Present code changes as examples and explanations
- **Require explicit approval** - Ask user to make changes themselves or grant permission
- **Teaching approach** - Explain reasoning, alternatives, and best practices

### **Guided Mode Workflow**
1. **Analyze requirements** - Same context loading and planning as normal mode
2. **Present implementation plan** - Show step-by-step approach with explanations
3. **Suggest code changes** - Provide exact code with file paths and explanations
4. **Wait for user action** - User implements changes or grants permission for direct changes
5. **Review user implementation** - Analyze user's code and provide feedback/suggestions
6. **Continue iteratively** - Repeat suggest → review cycle until subtask complete

### **Teaching Elements**
- **Explain decisions** - Why this approach over alternatives
- **Highlight best practices** - Point out good patterns and anti-patterns
- **Provide context** - How this fits into larger architecture
- **Suggest improvements** - Code quality and optimization opportunities

### **User Control Options**
```bash
# During guided mode, user can:
"Please make this change directly"           # Grant permission for specific change
"Show me alternative approaches"             # Request different implementation options
"Explain why you chose this approach"       # Deep dive into decision rationale
"Review my implementation"                   # Get feedback on user's code
```

## Execution Flow

### 1. Context Loading & HANDOFF Validation
**MANDATORY HANDOFF.yml Management:**
- **Read HANDOFF.yml**: Load current coordination state and agent assignments
- **Validate handoff state**: Confirm current agent focus and previous handoffs
- **Check for blockers**: Identify any coordination issues or dependencies
- **Load task context**: Read EPIC.md, TASK.md, ADRs, and acceptance criteria

### 2. Pre-Task HANDOFF Update
**REQUIRED before starting any subtask:**
- **Update current agent**: Set active agent and current subtask focus
- **Record handoff received**: Document transition from previous agent (if applicable)
- **Set expected deliverables**: Specify what this agent will produce
- **Update timestamps**: Track when work started for coordination audit

### 3. Agent Task Execution
- **Agent selection**: Choose specialist based on task domain and HANDOFF.yml assignments
- **Intelligent context distillation**: Filter and prepare domain-specific context for the selected agent
  - **Backend specialists**: Technical stack, API contracts, security requirements, database patterns
  - **Frontend specialists**: Component architecture, state patterns, UI/UX requirements, responsive design
  - **Test engineers**: Coverage requirements, validation patterns, quality gates, testing methodologies
  - **Security auditors**: Threat models, authentication patterns, authorization requirements, compliance
  - **Database specialists**: Schema patterns, migration strategies, performance constraints, data validation
  - **Performance optimizers**: Scaling requirements, performance targets, bottleneck patterns, optimization opportunities
- **Context provision**: Distilled domain-specific context from epic goals, ADRs, acceptance criteria, and coordination state
- **Mode awareness**: If `--guided` flag present, agents operate in teaching mode
- **Subtask execution**: Execute X.Y.Z implementation tasks with test-first approach
  - **Normal mode**: Direct implementation with file changes
  - **Guided mode**: Suggestions and explanations only, no direct file modifications
- **Progress tracking**: Mark subtasks complete with checkboxes (✓ 1.1.1, ✓ 1.1.2)

### 4. Post-Subtask HANDOFF Update
**REQUIRED after each subtask completion:**
- **Record deliverables**: Document what was actually produced by current agent
- **Update task progress**: Mark subtask complete in HANDOFF.yml coordination
- **Set handoff target**: Specify next agent and their expected focus
- **Update coordination state**: Prepare handoff information for next agent

### 5. Final HANDOFF Completion
**REQUIRED when task is complete:**
- **Mark task complete**: Update overall task status in HANDOFF.yml
- **Record final deliverables**: Complete list of all agent outputs
- **Close coordination loop**: Confirm all handoffs completed successfully
- **Update EPIC.md**: Mark task complete in epic task list

### 4. Task Discovery
When implementation reveals new work:
- Use `/develop --discover "task-name" --epic "epic-name"`
- Creates new `TASK-###-name/` directory with templates
- Updates EPIC.md task list in appropriate execution order
- Adjusts dependencies and timeline as needed

## Intelligent Context Distillation

The `/develop` command uses domain-aware context filtering to optimize agent performance:

### **Context Filtering Patterns**
- **Technical Stack Extraction**: Framework choices, database patterns, library usage from ADRs
- **API Contract Focus**: Endpoint specifications, request/response formats, integration requirements
- **Security Context**: Authentication patterns, authorization models, threat considerations
- **Performance Context**: Scaling requirements, optimization targets, bottleneck patterns
- **Testing Context**: Coverage expectations, validation strategies, quality gate requirements

### **Agent-Specific Context Briefings**
Instead of overwhelming agents with full epic context, provide filtered, relevant information:

- **Backend Specialists** receive: API contracts, database schemas, security requirements, performance targets
- **Frontend Specialists** receive: Component specifications, state management patterns, UI/UX requirements
- **Test Engineers** receive: Coverage targets, validation patterns, quality gates, existing test structure
- **Security Auditors** receive: Threat models, authentication flows, authorization requirements, compliance needs
- **Database Specialists** receive: Schema requirements, migration patterns, performance constraints, data validation
- **Performance Optimizers** receive: Performance targets, current bottlenecks, scaling requirements, optimization opportunities

### **Dynamic Context Loading**
- Parse HANDOFF.yml, RESEARCH.md, and ADR files in real-time
- Extract only domain-relevant sections for the selected agent
- Combine with task-specific requirements from TASK.md
- Present concise, actionable context that eliminates noise

**Benefit**: Agents focus on relevant information without context overload, improving decision quality and execution speed.

## Quality Gates

- **Acceptance Criteria**: Validate against user stories from `/design`
- **ADR Compliance**: Follow architectural decisions from `resources/`
- **Test Coverage**: 95%+ comprehensive test suite (unit, integration, E2E)
- **Quality Checks**: Linting, security validation, performance requirements

## HANDOFF.yml Enforcement Requirements

### **Mandatory HANDOFF.yml Structure**
Every HANDOFF.yml must track:
```yaml
current_execution:
  active_agent: "agent-name"
  current_subtask: "X.Y.Z subtask description"
  started_at: "2025-09-19T10:30:00Z"
  expected_deliverables: ["deliverable1", "deliverable2"]

agent_coordination:
  - agent: "previous-agent"
    subtask: "X.Y.Z"
    status: "✅ completed"
    deliverables: ["actual output1", "actual output2"]
    handoff_to: "current-agent"
    completed_at: "2025-09-19T10:25:00Z"

  - agent: "current-agent"
    subtask: "X.Y.Z"
    status: "🔄 in_progress"
    expected_deliverables: ["planned output1"]
    handoff_from: "previous-agent"
    started_at: "2025-09-19T10:30:00Z"
```

### **Enforcement Checkpoints**
1. **Before any agent invocation**: Read and validate HANDOFF.yml state
2. **Before starting subtask**: Update current_execution with agent/subtask/deliverables
3. **After completing subtask**: Record actual deliverables and set handoff_to
4. **Between agent transitions**: Validate handoff chain completeness
5. **At task completion**: Mark all coordination complete and update epic status

### **Validation Requirements**
- **No orphaned agents**: Every agent must have clear handoff_from/handoff_to
- **Complete deliverable tracking**: All expected vs actual deliverables documented
- **Timestamp audit trail**: Start/completion times for coordination analysis
- **Status consistency**: Agent status must match actual task progress

## Dependencies & Coordination

- **Blocking**: Identify alternatives or resolution steps when dependencies block
- **Parallel**: Coordinate independent task streams across multiple developers
- **HANDOFF.yml tracking**: ALL coordination state must be documented in real-time
- **Validation**: Verify HANDOFF.yml consistency before any agent transitions

## Outputs

### **MANDATORY Output Requirements**

**TASK.md Updates:**
- ✓ Mark completed X.Y.Z subtasks with checkboxes
- Document any discovered requirements or scope changes
- Update acceptance criteria status

**HANDOFF.yml Updates (ENFORCED):**
- **Real-time coordination tracking**: Current agent, subtask, and deliverables
- **Complete handoff chain**: From start to finish with timestamps
- **Deliverable documentation**: Expected vs actual outputs for each agent
- **Status validation**: Ensure coordination state matches actual progress
- **Mode tracking**: Document whether work was done in normal or guided mode

**RESEARCH.md Documentation:**
- Technical decisions and rationale from each agent
- Discoveries and insights that impact future work
- Integration challenges and solutions

**EPIC.md Status Updates:**
- Mark completed tasks in task list and implementation phases
- Update overall epic progress and next priorities

### **Guided Mode Deliverables**

When `--guided` flag is used, deliverables differ from normal mode:

**Instead of direct file changes:**

- **Code suggestions**: Detailed implementation recommendations with explanations
- **Teaching documentation**: Step-by-step reasoning and best practice explanations
- **Alternative approaches**: Multiple implementation options with trade-offs
- **Review feedback**: Analysis of user-implemented code with improvement suggestions

**Enhanced documentation:**

- **Learning objectives**: What the user should understand from each step
- **Decision rationale**: Why specific approaches were recommended
- **Best practice explanations**: Deeper context on coding standards and patterns
- **User implementation tracking**: Record of what user implemented vs suggested

### **Validation Before Completion**

**REQUIRED before marking any task complete:**

1. **HANDOFF.yml completeness check**: All agents have completed handoffs
2. **Deliverable verification**: All expected outputs documented and delivered
3. **Coordination closure**: No orphaned handoffs or incomplete agent transitions
4. **Epic consistency**: Task completion properly reflected in epic status

### **Quality Gates for HANDOFF.yml**

- **Structure validation**: Required fields present and properly formatted
- **Chain completeness**: No gaps in agent-to-agent handoffs
- **Timestamp consistency**: Logical start/end times for all agent work
- **Deliverable tracking**: All promised outputs documented as delivered

---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "planning", "implementation"]
---

# /plan Command

**Purpose**: Create comprehensive implementation plans through multi-agent analysis and task breakdown.

## Usage

```bash
/plan --issue ISSUE-KEY              # Create implementation plan for issue
/plan --issue KEY --deliverable NAME # Plan within specific deliverable
/plan --review-plan                  # Review and improve existing plan
/plan --init                         # Setup structure only, no planning
```

## Objectives

**Primary Goal**: Transform requirements and architecture into actionable implementation tasks through multi-agent expertise.

**Core Outcomes**:
1. **Task Breakdown**: Detailed implementation tasks organized by phases
2. **Agent Assignment**: Specific agents assigned to tasks based on expertise
3. **Dependency Mapping**: Task relationships and prerequisites identified
4. **Resource Allocation**: Time estimates and coordination requirements
5. **Documentation**: PLAN.md with HANDOFF.yml and RESEARCH.md

## Approach

Use **sequential agent consultation** to build comprehensive plans:
- Gather context from feature and architecture documents
- Consult specialist agents for domain expertise
- Build tasks incrementally with validation at each step
- Organize work into logical phases with dependencies
- Create coordination artifacts for execution

**Focus on buildability** - ensure plans are technically feasible and properly sequenced.

## Key Planning Areas

### Context Analysis
- What existing context informs this implementation?
- What architecture decisions guide the approach?
- What constraints and dependencies exist?
- What risks need mitigation during development?

### Task Breakdown
- What are the major implementation phases?
- What specific tasks need completion in each phase?
- How do tasks depend on each other?
- What validation gates ensure quality?

### Agent Coordination
- Which specialist agents should handle each task?
- What handoff information do agents need?
- How will research and decisions be shared?
- What coordination reduces task conflicts?

### Risk Management
- What could block or delay implementation?
- What technical assumptions need validation?
- What external dependencies create risk?
- How can risks be mitigated proactively?

## Plan Structure

Create comprehensive implementation plans with these components:

**PLAN.md Structure**:
1. **Overview** - Issue context and success criteria
2. **Phases** - Major implementation stages (P1, P2, P3)
3. **Tasks** - Specific work items (P1.1.0, P1.2.0, etc.)
4. **Dependencies** - Task relationships and prerequisites
5. **Agent Assignment** - Specialist agents for each task

**Coordination Files**:
- **HANDOFF.yml** - Context and decisions for agent coordination
- **RESEARCH.md** - Accumulated knowledge and findings
- **Working Directory** - Issue-specific workspace

Include planning markers:
- Task complexity and time estimates
- Quality gates and validation checkpoints
- Risk mitigation strategies
- Iteration and feedback loops

## Integration with Workflow

**Position**: Bridges architecture and implementation by defining execution strategy

**Relationship to Other Commands**:
- **After /vision, /feature, /architect**: Plans implement defined requirements and architecture
- **Before /develop**: Provides structured tasks for execution
- **Enables coordination**: Creates artifacts for multi-agent collaboration
- **Tracks progress**: Maintains state through implementation phases

## Success Criteria

**Complete Implementation Plan**:
- Tasks cover all requirements comprehensively
- Dependencies identified and properly sequenced
- Agent assignments match task complexity
- Quality gates ensure deliverable standards
- Risk mitigation strategies included

**Quality Indicators**:
- Tasks are specific and actionable
- Phases have clear completion criteria
- Agent expertise matches task requirements
- Plan is technically feasible and realistic


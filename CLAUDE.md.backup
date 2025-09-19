---
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "specification"
priority: "critical"
tags: ["ai-instructions", "workflow", "standards", "intelligent-integration"]
---

# CLAUDE.md - AI Agent Instructions

You are working with an AI coding template repository designed to optimize AI-assisted development workflows. Follow these instructions precisely when operating in this codebase.

## Essential Knowledge

### Tech Stack

<Add the high level details of your tech stack here>

### External Links

Project Management: <Add the link and details to your Jira/Linear/etc here>

Wiki: <Add the link and details to your Confluence/Notion/etc here>

### Project Vision

Vision Document: `docs/vision.md` or `project-vision.md` - Contains problem statement, solution approach, target audience, core features, success metrics, and differentiators that guide all development decisions.

## Core Workflow: /feature → /architect → /plan → /develop

**THIS IS THE PRIMARY WAY TO WORK WITH THIS TEMPLATE**

This template provides a hierarchical development workflow that follows industry-standard patterns while leveraging AI agents for enhanced productivity and context management.

### The Four Phases

#### 1. `/feature` - Feature Definition and Requirements
**Purpose**: Define WHAT we're building and WHY, creating lightweight feature context documents

- **Business Context**: Explores user needs, problem statements, and success criteria
- **Requirements Gathering**: Documents functional requirements and dependencies
- **External Integration**: Links to Jira/Linear issues when available
- **Lightweight Documentation**: 1-2 page feature contexts, not heavy PRDs
- **Scale Gracefully**: Useful for solo devs, complements enterprise tools

**Example Usage**:
```bash
/feature --new "User Authentication"
# → Interactive requirements gathering
# → Business context and success criteria
# → Creates docs/technical/features/user-authentication.md
```

#### 2. `/architect` - Technical Architecture Design
**Purpose**: Define HOW to implement features through technical decisions and system design

- **Architecture Exploration**: Evaluates multiple technical approaches
- **Technology Selection**: Chooses frameworks, patterns, and technologies
- **Decision Recording**: Creates ADRs documenting choices and rationale
- **System Design**: Documents component structure and integration
- **Specialist Consultation**: Leverages domain-specific agents

**Example Usage**:
```bash
/architect user-authentication
# → Reviews feature requirements
# → Explores JWT vs sessions architecture
# → Creates architecture docs and ADRs
```

#### 3. `/plan` - Implementation Planning
**Purpose**: Break down architecture into executable tasks with context preservation

- **Context Integration**: Builds on feature and architecture documentation
- **Task Decomposition**: Generates P1.X.X, P2.X.X, P3.X.X phased tasks
- **Agent Selection**: Intelligent assignment based on task requirements
- **Working Directory**: Creates .claude/working/[issue-id]/ for active development
- **Context Coordination**: HANDOFF.yml and RESEARCH.md for agent coordination

**Example Usage**:
```bash
/plan --issue AUTH-123
# → Reads feature context and architecture docs
# → Sequential agent analysis and task generation
# → Creates implementation plan in working directory
```

#### 4. `/develop` - Development Execution
**Purpose**: Execute implementation tasks with AI agent orchestration

- **Orchestrator Model**: Main Claude coordinates specialized agents
- **Context Preservation**: Complete handoff context across all tasks
- **Quality Gates**: Validation between phases with smart recovery
- **Tutoring Mode**: `--instruct` flag for learning without changes
- **Implementation Records**: Promotes completed work to permanent documentation

**Example Usage**:
```bash
/develop                    # Execute next task from plan
/develop --instruct P1.3.0  # Learn approach without implementing
# → Agent coordination with context passing
# → Quality validation between tasks
# → Implementation record creation
```

### The Complete Workflow in Action

```
FEATURE DEFINITION:
/feature --new "Real-time Notifications"
├── Interactive requirements gathering
├── Business context and user needs analysis
└── Creates docs/technical/features/real-time-notifications.md

TECHNICAL ARCHITECTURE:
/architect real-time-notifications
├── Evaluates WebSocket vs SSE vs polling approaches
├── Considers scalability and browser compatibility
└── Creates architecture docs and ADR-001-websocket-selection.md

IMPLEMENTATION PLANNING:
/plan --issue NOTIFY-123
├── Reads feature context and architecture decisions
├── Sequential agent analysis building on documented context
└── Creates .claude/working/NOTIFY-123/PLAN.md with phased tasks

DEVELOPMENT EXECUTION:
/develop (through all phases)
├── P1.X.X: Core implementation → Quality gates → Commit
├── P2.X.X: Integration features → Quality gates → Commit
└── P3.X.X: Testing & documentation → Promote to implementations/
```

### Why This Workflow Matters

1. **Architectural Quality**: Decisions are thoroughly explored before implementation
2. **Context Preservation**: Never lose context across long development sessions
3. **Multi-Agent Expertise**: Leverage 17 specialized agents with perfect coordination
4. **Quality Assurance**: Built-in gates prevent progression without validation
5. **Scalability**: Works for simple features to complex architectural changes
6. **Learning Mode**: `--instruct` flag enables mentorship and understanding before implementation

### Everything Else Supports This Workflow

- **17-Agent Framework**: Provides domain expertise with intelligent script orchestration
- **Unified Commands**: `/docs`, `/quality`, `/status` provide intelligent agent coordination
- **Documentation System**: Automatically maintains context and decisions via agent-script integration
- **Quality Gates**: Ensures standards throughout the workflow with automated script validation
- **Script Orchestration**: Agents intelligently coordinate existing scripts based on context
- **Status Management**: Preserves workflow state across sessions with intelligent analysis

**CRITICAL**: When in doubt about how to approach any task, use this workflow. It ensures you're not just generating code, but creating well-architected, thoroughly planned, and quality-validated solutions.

## Documentation Structure

This template uses a three-tier documentation system with hierarchical organization:

- **docs/technical/** - YOUR project's technical documentation following the workflow hierarchy
  - `features/` - Feature context documents (WHAT and WHY)
  - `architecture/` - System design documents (HOW)
  - `decisions/` - Architecture Decision Records (WHY specific choices)
  - `implementations/` - Historical implementation records (WHAT was actually done)
- **docs/development/** - Team processes and guidelines (workflows, standards, testing)
- **docs/ai-tools/** - AI assistant and template documentation (agents, commands, setup)

**Active Development Context**: `.claude/working/[issue-id]/` contains ephemeral work artifacts (PLAN.md, HANDOFF.yml, RESEARCH.md) that get promoted to permanent documentation after completion.

**Note**: This file (CLAUDE.md) contains AI instructions. For human-readable documentation about using this template, see `docs/ai-tools/`.

### Key Documentation References

- [Command System](./docs/ai-tools/reference/commands.md) - All available slash commands and automation
- [Using Agents](./docs/ai-tools/guides/using-agents.md) - Practical agent usage guide for development
- [AI Collaboration Guide](./docs/ai-tools/guides/ai-collaboration-guide.md) - Essential AI development patterns
- [MCP Setup](./docs/ai-tools/setup/mcp-setup.md) - Enhanced AI capabilities and tools
- [Troubleshooting](./docs/ai-tools/reference/troubleshooting.md) - Comprehensive problem-solving guide
- [STATUS.md](./STATUS.md) - Current project context and state for session continuity

## Critical Rules

These apply to all actions and agents:

1. **Commit Approval:** Never commit without explicit user approval first
2. **Comment Approval:** Never comment on <Jira/Linear/etc> without explicit user approval first
3. **No Assumptions**: Always check existing patterns and code, run tests, ask user if any ambiguity
4. **Test First:** Follow strict TDD guidelines
5. **Branch First:** Never work directly on main branches (see [AI Collaboration Guide](./docs/ai-tools/guides/ai-collaboration-guide.md#ai-branching-strategy))
6. **Atomic Commits:** Keep commits small and focused
7. **Ask Questions Often and Early**: Clarify ambiguity before implementation

## AI Autonomy Matrix

| Action             | Permission    | Example                                   |
| ------------------ | ------------- | ----------------------------------------- |
| **Read/Analyze**   | ✅ Autonomous | Reading files, analyzing code, searching  |
| **Plan/Test**      | ✅ Autonomous | Creating plans, running tests, validation |
| **Code Changes**   | ⚠️ Show First | Display changes before applying           |
| **Commits/Merges** | 🛑 Always Ask | Never commit without explicit approval    |
| **Deletions**      | 🛑 Always Ask | Any file/branch deletions need approval   |

## Response Protocol

You MUST follow these behavioral guidelines:

- **Be Concise**: Show code/commands, explain only when asked
- **Be Explicit**: Confirm understanding before major changes
- **Be Incremental**: Work in small, atomic commits
- **Be Transparent**: Report errors immediately with context
- **Be Evidence-Based**: Support decisions with verifiable information

## File Naming Requirements

You MUST follow these naming conventions:

- **Documentation files**: Use `lowercase-kebab-case` exclusively (e.g., `authentication-guide.md`)
- **Code files**: Follow the naming conventions for the specific programming language
- **No exceptions**: Enforce these conventions in all file operations

## Context Management Protocol

## 17-Agent Framework: Workflow Enablers

The 17 specialized agents exist to enhance and support the core workflow at each phase. Your role is to orchestrate these agents appropriately throughout the /idea → /plan → /iterate workflow.

### Agents by Workflow Phase

**During `/idea` (Architectural Exploration)**:
- On-demand consultation during conversation
- Domain-specific insights for decision-making
- Technical feasibility assessment

**During `/plan` (Sequential Planning)**:
- Automatic selection based on issue content
- Sequential analysis building comprehensive understanding
- Technical specification generation

**During `/iterate` (Task Execution)**:
- Agent hints from PLAN.md tasks guide selection
- Context passing via orchestrator model
- Structured results for coordination file updates

### Agent Categories for Workflow Support

**Foundation Agents** (Always involved in planning):
- **context-analyzer**: Codebase understanding and pattern analysis
- **code-architect**: Architectural decisions and system design
- **project-manager**: Plan generation and task coordination

**Domain Specialists** (Selected based on content):
- **frontend-specialist**, **backend-specialist**: Implementation domains
- **database-specialist**: Data architecture and schema design
- **api-designer**: Service contracts and integration patterns
- **security-auditor**: Security analysis and vulnerability assessment
- **performance-optimizer**: Performance analysis and optimization

**Quality Specialists** (Cross-cutting concerns):
- **test-engineer**: Testing strategy and quality validation
- **code-reviewer**: Code quality and standards compliance
- **docs-sync-agent**: Documentation maintenance and generation

**Infrastructure Specialists** (Deployment and operations):
- **devops-engineer**: Infrastructure and deployment automation
- **migration-specialist**: Version upgrades and framework migrations

### Enhanced Orchestration Principles

You should rarely update files directly. Always delegate to the appropriate agent through the workflow with intelligent script integration:
- **Read context** from HANDOFF.yml and RESEARCH.md
- **Pass complete context** to agents via Task tool prompts including script coordination requirements
- **Agent-Script Coordination**: Agents automatically invoke appropriate scripts with full context
- **Update coordination files** after agent completion and script execution
- **Maintain workflow state** across all agent interactions and script orchestrations

### Agent-Script Integration Mapping

**New Unified Commands with Agent Coordination:**

```yaml
unified_commands:
  docs:
    primary_agent: technical-writer | docs-sync-agent
    script_coordination:
      generate: auto-docs-generator.js
      validate: check-docs-links.js + docs-health.js
      sync: docs-manager.sh + context analysis

  quality:
    primary_agent: code-reviewer
    supporting_agents: [security-auditor, test-engineer, performance-optimizer]
    script_coordination:
      assess: validate-quality-gates.sh + static analysis tools
      validate: test runners + linting tools + security scanners
      audit: security scanning tools + compliance checkers
      fix: automated formatting + remediation scripts

  status:
    primary_agent: context-analyzer
    script_coordination:
      basic_data: ai-status.sh
      intelligent_analysis: agent processes script output
      enhanced_reporting: context-aware insights generation
```

### Script Invocation Protocol

When agents need to invoke scripts, they MUST:

1. **Context Assessment**: Determine which scripts are relevant based on task and project state
2. **Parameter Optimization**: Pass relevant context and parameters to scripts
3. **Result Processing**: Interpret script output in context of current task and project
4. **Integration**: Incorporate script results into agent response and workflow coordination
5. **Documentation**: Update coordination files with script execution results

**Example Agent-Script Coordination:**
```yaml
agent_task: "Generate comprehensive documentation"
agent: technical-writer
script_sequence:
  1. auto-docs-generator.js --type tech-stack --context HANDOFF.yml
  2. docs-manager.sh auto-docs all --integration-mode
  3. check-docs-links.js --validate-internal --validate-external
  4. Agent processes all outputs and creates unified documentation report
```

## Multi-Agent Workflow Execution

When working with deliverables that contain PLAN.md files, follow these orchestrator-based coordination protocols:

### Orchestrator Model (Claude Code Architecture)

**Critical Understanding**: Sub-agents operate in separate context windows and start fresh each invocation. Context must be passed explicitly through Task tool prompts.

**Orchestrator Responsibilities** (YOU as main Claude):
- Read HANDOFF.yml and RESEARCH.md for complete context
- Construct comprehensive prompts with all relevant information
- Pass context explicitly to agents via Task tool prompts
- Update coordination files after agent completion
- Manage quality gates and phase transitions

**Agent Responsibilities** (Sub-agents):
- Execute assigned task with provided context
- Return structured results (do NOT update files directly)
- Focus solely on task execution

### Phase-Based Task Execution

PLAN.md files use a structured P X.X.X format where each phase represents a logical commit boundary:

- **P1.X.X**: Core implementation phase (analysis, testing, initial implementation)
- **P2.X.X**: Integration/extension phase (features, integration, optimization)
- **P3.X.X**: Finalization phase (review, documentation, deployment)
- Each phase enforced by quality gates before progression

### Agent Selection from Task Hints

Tasks include agent hints in HTML comments that YOU parse and use:

- `<!--agent:context-analyzer-->` - Use context-analyzer agent
- `<!--agent:test-engineer-->` - Use test-engineer agent
- `<!--agent:backend-specialist-->` - Use backend-specialist agent
- `<!--agent:code-reviewer-->` - Use code-reviewer agent

**Implementation**: Extract agent hint, validate against .claude/agents/, call via Task tool

### Context Management Protocol

**Before Agent Execution**:
1. Read HANDOFF.yml for previous agent context (last 2 entries)
2. Read RESEARCH.md CRITICAL_CONTEXT section
3. Read current task details from PLAN.md
4. Construct comprehensive prompt with ALL context

**During Agent Execution**:
1. Call agent via Task tool with complete context in prompt
2. Agent executes task and returns structured results
3. Parse agent output for technical details and findings

**After Agent Execution**:
1. Update PLAN.md task status (checkbox ✅)
2. Create new HANDOFF.yml entry with agent's work details
3. Update RESEARCH.md if new findings discovered
4. Update CHANGELOG.md if user-facing changes made
5. Run quality gate validation before next task

### CHANGELOG.md Maintenance

For user-facing changes, ensure CHANGELOG.md is kept current:

**When to Update CHANGELOG.md:**

- New features users interact with (UI components, API endpoints, commands)
- Breaking API changes or configuration changes
- Bug fixes that users would notice (not internal refactoring)
- Security vulnerability fixes
- Performance improvements users would experience
- New dependencies or system requirements

**When NOT to Update CHANGELOG.md:**

- Internal code refactoring without user impact
- Test additions or improvements
- Documentation updates (unless user-facing guides)
- Build system or CI/CD changes
- Code style or linting fixes

**Update Process:**

1. **Feature Development**: Add entries to `[Unreleased]` section for qualifying changes
2. **Bug Fixes**: Document fixes in the `Fixed` section with issue references
3. **Breaking Changes**: Mark clearly with `**BREAKING**` prefix and migration notes
4. **Final Phase Tasks**: Include CHANGELOG update as part of documentation tasks
5. **Automation Available**: Use `./scripts/ai-update-changelog.sh` for assistance

### Simplified Agent Coordination Protocol

**Agent Execution Model** (Respects Claude Code Architecture):

```yaml
Orchestrator Workflow (YOU handle):
1. Read PLAN.md to get current task (P X.X.X)
2. Read HANDOFF.yml for previous agent context
3. Read RESEARCH.md for critical context and findings
4. Construct comprehensive prompt with all context
5. Call agent via Task tool with complete context
6. Parse agent results and update all coordination files
7. Run quality gates before proceeding to next task

Agent Expectations (Sub-agents do):
1. Receive complete context through Task tool prompt
2. Execute assigned task with provided context
3. Return structured results with technical details
4. NO file updates (orchestrator handles all file operations)
```

### Task Delegation Examples

**Good delegation pattern**:
"Use the Task tool with test-engineer to work on P1.2.0. Context from HANDOFF.yml shows the context-analyzer identified the need for authentication tests covering JWT token generation and validation. Create comprehensive tests for these requirements."

**Poor delegation pattern**:
"Use test-engineer to write tests." (Lacks context and specific task reference)

### Multi-Phase Coordination

- Work through phases sequentially (complete all P1.X.X before P2.X.X)
- Each phase should result in a logical, committable unit of work
- If a phase needs subdivision, use sub-task numbering (P1.3.1, P1.3.2)
- Phases can vary in length - not all require exactly 6 steps
- Customize phase structure based on complexity and requirements
- Quality gate at end of each phase: tests pass, code reviewed, documented
- STATUS.md updated with phase summary upon completion

### Agent Selection Rules

- Match agent expertise to specific task domains
- Use appropriate model complexity (haiku/sonnet/opus) for task requirements
- Plan coordination procedures for multi-agent workflows
- Monitor agent effectiveness and optimize selection patterns

## Tool Selection Guide: Workflow-Optimized with Intelligent Commands

Use these tools appropriately for each workflow phase, prioritizing unified intelligent commands:

### During `/idea` (Architectural Exploration)
```yaml
Exploration Tools:
  - Read: Review vision documents and existing architecture
  - Grep/Glob: Search codebase for patterns and examples
  - Task: Consult specialist agents on-demand during conversation
  - WebFetch: Research external patterns and best practices

Documentation Tools:
  - /docs generate --type decisions: Generate ADRs with intelligent agent coordination
  - Edit: Update exploration session files (fallback)
  - Write: Create ADR files when consensus reached (fallback)
```

### During `/plan` (Sequential Planning)
```yaml
Analysis Tools:
  - Read: Understand existing codebase and patterns
  - Grep/Glob: Discover related files and dependencies
  - Task: Sequential agent execution with context passing

Planning Tools:
  - Write: Create PLAN.md, HANDOFF.yml, RESEARCH.md
  - Edit: Update deliverable tracking and status
  - TodoWrite: Track planning progress (not implementation tasks)
```

### During `/iterate` (Task Execution)
```yaml
Execution Mode:
  - Read: Always read context from HANDOFF.yml and RESEARCH.md
  - Task: Execute agents with complete context for each P X.X.X task (agents automatically coordinate scripts)
  - Edit/MultiEdit: Update coordination files after agent completion
  - /quality validate: Intelligent quality gates with multi-agent coordination

Tutoring Mode (--instruct):
  - Read: Same context gathering as execution mode
  - Task: Call agent with tutoring-specific prompt for educational response
  - Interactive Q&A: Enable follow-up questions and clarifications
  - No file updates: Purely educational, task remains available for execution

Quality Assurance:
  - /quality assess: Multi-dimensional quality analysis with automatic script coordination
  - /docs sync: Intelligent documentation updates with context awareness
  - Read: Review agent results and validation outputs
  - Edit: Update CHANGELOG.md for user-facing changes

Workflow Management:
  - Edit: Update PLAN.md task checkboxes and HANDOFF.yml entries
  - /status --ai-format: Intelligent project status with context analysis
  - TodoWrite: Track implementation progress within phases
```

### General Workflow Support
```yaml
Context Management:
  - Read: Always read before editing existing files
  - /status: Enhanced project intelligence with context-analyzer coordination
  - Edit: Update STATUS.md and coordination files
  - Grep/Glob: Search for patterns and integration points

Agent Coordination:
  - Task: Primary tool for all specialized agent delegation with script coordination
  - Read: Understand agent capabilities from .claude/agents/
  - Edit: Update HANDOFF.yml with agent results and script execution outcomes

Quality Gates:
  - /quality validate --scope current-phase: Intelligent validation with agent oversight
  - /docs validate: Documentation health checks with agent coordination
  - Read: Review quality standards and guidelines
```

### Unified Command Priority

**ALWAYS prefer unified intelligent commands when available:**

1. **Documentation Operations**: Use `/docs` instead of manual script invocation
2. **Quality Assessment**: Use `/quality` instead of individual validation scripts
3. **Project Status**: Use `/status` instead of basic status reporting
4. **Agent Coordination**: Agents automatically invoke scripts with full context

**CRITICAL**: The new unified commands provide intelligent agent-script coordination. Always use these for better context awareness and integrated execution.

## Code Generation Standards

You MUST adhere to these standards:

- Follow patterns established in the `examples/` directory
- Use existing project patterns and conventions consistently
- Validate against quality standards in `docs/development/guidelines/quality-standards.md`
- Never duplicate existing functionality without explicit justification

## Quality Requirements

### Validation Protocol

1. Validate all code against project technical standards
2. Follow security best practices and established patterns
3. Document AI assistance level in all commit messages
4. Ensure comprehensive test coverage for new functionality
5. **Update CHANGELOG.md** for user-facing changes (features, fixes, breaking changes)

### Code Quality Gates

- All code MUST pass existing linting and formatting standards
- Security patterns MUST be followed for all implementations
- Performance considerations MUST be evaluated for user-facing changes
- Documentation MUST be updated to reflect code changes
- Tests MUST be written or updated for all functional changes

## Intelligent Documentation System

This project includes intelligent documentation management that coordinates agents with scripts automatically:

### Unified Documentation Commands (Preferred)

- **Generate All Documentation**: `/docs generate --type all`
- **Generate Technology Stack**: `/docs generate --type tech-stack`
- **Generate System Overview**: `/docs generate --type system-overview`
- **Generate Dependency Graph**: `/docs generate --type dependencies`
- **Validate Documentation**: `/docs validate`
- **Sync Documentation**: `/docs sync`
- **Health Check**: `/docs health`

### Architecture Decision Records (ADRs)

For significant architectural or technical decisions, use the intelligent `/docs` command:

- **Create ADR with Intelligence**: `/docs generate --type decisions`
- **Legacy ADR Creation**: `./scripts/docs-manager.sh decision "Decision Title"`
- **Location**: `.decisions/YYYY-MM-DD-decision-title.md`
- **Template**: Includes context, rationale, alternatives, and consequences

### When to Use Intelligent Documentation

**Automatically Generate** using `/docs generate` when:
- Adding new technologies or frameworks
- Making architectural changes
- Modifying system structure or components
- Updating dependencies or tech stack
- After implementing major features

**Create ADRs** using `/docs generate --type decisions` for:
- Technology selection decisions
- Architectural pattern choices
- Security implementation decisions
- Performance optimization strategies
- Database or infrastructure decisions

### Agent-Script Integration

The intelligent `/docs` commands provide superior coordination:

1. **Agent Selection**: Automatically selects appropriate agents (technical-writer, docs-sync-agent)
2. **Context Awareness**: Agents understand project state and documentation needs
3. **Script Orchestration**: Agents invoke scripts with optimized parameters and context
4. **Result Integration**: Intelligent processing and integration of script outputs
5. **Quality Validation**: Automatic validation and improvement suggestions

**Example Intelligence:**
```yaml
command: "/docs generate --type tech-stack"
agent_coordination:
  1. technical-writer analyzes project structure
  2. auto-docs-generator.js invoked with context parameters
  3. Agent processes output for completeness and accuracy
  4. check-docs-links.js validates generated documentation
  5. Agent provides recommendations for improvements
```

## Architecture Compliance

You MUST maintain these architectural principles:

- Clear, consistent file organization patterns
- Well-documented code and project structure adherence
- Established conventions for reliable AI tool usage
- Context preservation strategies across development sessions
- Advanced memory management for long-term project continuity
- Structured approach to AI-human collaborative development

## Problem-Solving Framework: Workflow-First Approach

### Decision Framework

When uncertain about any task, use the core workflow:

1. **For Architectural Decisions**: Use `/idea` to explore options with specialist consultation
2. **For Implementation Planning**: Use `/plan` to get comprehensive multi-agent analysis
3. **For Execution Issues**: Use `/iterate` with appropriate agent for domain expertise
4. **Check existing patterns** in similar files and components
5. **Run tests** to validate current assumptions and functionality
6. **Ask user** for clarification rather than making assumptions
7. **Document decision** in appropriate workflow artifacts (ADRs, RESEARCH.md, HANDOFF.yml)

### Issue Resolution Protocol

When encountering problems:

1. **Report immediately** with full context and error details
2. **Suggest fix** if the solution is obvious and low-risk
3. **Never hide or suppress** errors or warnings
4. **Use appropriate agent** for domain-specific problem resolution
5. **Update documentation** to prevent similar issues

### Research and Analysis

When working with unfamiliar areas:

1. Use context engineering techniques from the [AI Collaboration Guide](./docs/ai-tools/guides/ai-collaboration-guide.md#context-management)
2. Apply RAG strategies when working with large codebases
3. Reference the [AI Collaboration Guide](./docs/ai-tools/guides/ai-collaboration-guide.md#effective-ai-communication) for effective interaction patterns
4. Leverage the 17-agent framework for domain-specific expertise
5. Maintain evidence-based reasoning throughout problem-solving

## Security Compliance

You MUST:

- Apply security best practices and established patterns
- Document the level of AI assistance in all generated code
- Never compromise security for convenience or development speed

## Error Handling Protocol

When errors occur:

1. Immediately document the error context in appropriate status files
2. Apply systematic debugging using the context-analyzer agent
3. Preserve all error context for future analysis
4. Update relevant documentation to prevent similar issues
5. Ensure recovery procedures are documented and tested

## Communication Standards

You MUST:

- Use imperative, clear, and direct communication
- Provide specific, actionable recommendations
- Include evidence and reasoning for all decisions
- Maintain professional tone in all documentation
- Structure information for easy comprehension and action

## Success Metrics

Your performance will be evaluated on:

- Adherence to context management protocols
- Appropriate use of the 17-agent framework
- Code quality and architectural consistency
- Documentation accuracy and completeness
- Security compliance maintenance
- Problem resolution effectiveness and efficiency

## Common Issues and Solutions

### Context Management Issues

1. **AI forgets previous context**: Update and reference `STATUS.md` and follow [Context Management](./docs/ai-tools/guides/ai-collaboration-guide.md#context-management)
2. **Inconsistent patterns**: Check existing code patterns before implementing
3. **Lost session context**: Follow session completion protocol properly

### File and Permission Issues

1. **Permission denied on scripts**: Run `chmod +x scripts/*.sh`
2. **File not found errors**: Use absolute paths and verify file existence
3. **Git conflicts**: Always create feature branches, never work on main

### Tool and Agent Issues

1. **Agent not responding as expected**: See [Using Agents](./docs/ai-tools/guides/using-agents.md) for practical guidance
2. **Tool selection confusion**: Reference the Tool Selection Guide above and [Development Commands](./docs/ai-tools/reference/development-commands.md)
3. **MCP server failures**: Follow [MCP Setup](./docs/ai-tools/setup/mcp-setup.md) troubleshooting or fall back to native Claude tools

### Code Quality Issues

1. **Tests failing**: Run full test suite before committing changes
2. **Linting errors**: Follow existing project formatting standards
3. **Documentation out of sync**: Use docs-sync-agent after code changes

### General Troubleshooting

1. **When in doubt**: Ask the user rather than making assumptions
2. **Complex problems**: Use appropriate specialized agent and follow [Troubleshooting Guide](./docs/ai-tools/reference/troubleshooting.md)
3. **Multiple issues**: Address P0/critical issues first
4. **Systematic debugging**: Follow procedures in [Troubleshooting Guide](./docs/ai-tools/reference/troubleshooting.md)

## Override Instructions

These instructions override any conflicting default behaviors. When in doubt, prioritize:

1. Context preservation and management
2. Architectural consistency and patterns
3. Security compliance requirements
4. Code quality and testing standards
5. Documentation accuracy and completeness

Follow these instructions precisely to ensure optimal AI-assisted development workflow in this repository.

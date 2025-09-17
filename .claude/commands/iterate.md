---
description: Execute tasks from PLAN.md files with multi-agent coordination
argument-hint: [TASK-ID] [--force] [--agent AGENT-NAME]
allowed-tools: Read, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task
model: sonnet
---

Executes tasks from PLAN.md files using the structured P X.X.X numbering system with intelligent agent coordination and context preservation.

## Core Functionality

**Automatic Task Detection:**
- Finds PLAN.md in current directory or nearest parent directory
- Identifies next unchecked task in active phase (first phase with incomplete tasks)
- Extracts agent hint from HTML comment (e.g., `<!--agent:backend-specialist-->`)

**Context Integration (Orchestrator Model):**
- Reads HANDOFF.yml and RESEARCH.md for complete context
- Constructs detailed prompts with all relevant information
- Passes context explicitly to agents via Task tool prompts
- Updates coordination files after agent completion (agents don't write files)

**Phase Management:**
- Enforces sequential phase execution (complete P1.X.X before P2.X.X)
- Prompts for commits at end of each phase
- Updates STATUS.md with phase summaries
- Validates task completion before progression

## Usage Patterns

```bash
/iterate                    # Execute next unchecked task in current phase
/iterate P2.3.0            # Execute specific task P2.3.0
/iterate 1.4.0             # Execute specific task (P prefix optional)
/iterate --force P1.5.0    # Execute task even if previous tasks incomplete
/iterate --agent test-engineer P1.2.0  # Override agent hint
```

## Orchestrator Architecture with Hooks

As the main Claude instance, `/iterate` acts as the orchestrator for all agent coordination, enhanced by automatic Claude Code hooks:

**Context Management:**
- Reads HANDOFF.yml and RESEARCH.md for complete context
- **Hook Enhancement**: `scripts/distill-context.sh` automatically generates focused context
- Constructs detailed prompts with all relevant information
- Passes context explicitly to agents via Task tool prompts
- Updates coordination files after agent completion

**Agent Isolation:**
- Sub-agents operate in separate context windows
- Agents start fresh each invocation (no persistent memory)
- All context must be passed through Task tool prompts
- Agents focus solely on task execution, not file coordination

**Automatic Enforcement via Hooks:**
- **Pre-Task Hook**: Validates context before agent execution
- **Post-Task Hook**: Validates agent output and updates coordination files
- **Context Distillation**: Automatic generation of agent-specific focused context
- **Quality Gates**: Automatic enforcement without manual script execution

## Execution Process

For each task execution:

1. **Task Validation & Context Gathering**
   - Parse PLAN.md and locate target task
   - Validate task format and agent hint presence
   - Check prerequisites completed (unless --force)
   - Run quality gate validation: `scripts/validate-quality-gates.sh`
   - Read HANDOFF.yml for previous agent context
   - Extract CRITICAL_CONTEXT from RESEARCH.md
   - Validate context integrity: `scripts/validate-context.sh`

2. **Agent Execution (Orchestrated with Script Integration)**
   - Validate agent exists in .claude/agents/ directory
   - **Auto Script Integration**: Agent intelligently invokes relevant scripts:
     ```yaml
     agent_script_mapping:
       test-engineer: [validate-quality-gates.sh, test validation scripts]
       docs-sync-agent: [check-docs-links.js, docs-health.js]
       security-auditor: [security validation scripts]
       code-reviewer: [validation scripts, linting tools]
       devops-engineer: [deployment scripts, environment validation]
     ```
   - Generate focused context: `scripts/distill-context.sh --agent AGENT-TYPE --task TASK-ID`
   - Construct comprehensive prompt including:
     - Current task P X.X.X with full description
     - **Script Integration Context**: Available scripts the agent can invoke
     - Distilled technical specifications from previous agents
     - CRITICAL_CONTEXT requirements from RESEARCH.md
     - Focused handoff context relevant to agent type
     - Quality requirements and success criteria
   - Call agent via Task tool with enhanced context in prompt
   - **Agent Script Orchestration**: Agent automatically invokes appropriate scripts during execution
   - Agent executes task and returns structured results with script outputs
   - Validate agent output: `scripts/validate-agent-output.sh --output AGENT-OUTPUT --task TASK-ID`

3. **Post-Execution Coordination**
   - Parse agent output for technical details and findings
   - Update PLAN.md task status (checkbox ✅)
   - Create new HANDOFF.yml entry with:
     - Agent's technical specifications
     - Implementation details and patterns used
     - Context for next agent
     - Quality validation completed
   - Update RESEARCH.md if new findings discovered
   - Update CHANGELOG.md if user-facing changes made
   - Update STATUS.md timestamp and progress

4. **Quality Gate Enforcement with Intelligent Script Integration**
   - **Agent-Driven Quality Validation**: Quality checks now handled by specialized agents:
     ```yaml
     quality_gate_agents:
       code_quality: code-reviewer (auto-invokes linting and validation scripts)
       test_coverage: test-engineer (auto-invokes test validation scripts)
       security_compliance: security-auditor (auto-invokes security scanning scripts)
       documentation: docs-sync-agent (auto-invokes docs validation scripts)
     ```
   - **Smart Recovery with Agent Orchestration**:
     - Test failures → test-engineer automatically invokes `validate-quality-gates.sh` and provides fix
     - Build failures → devops-engineer automatically diagnoses and suggests solutions
     - Security vulnerabilities → security-auditor automatically scans and provides remediation
     - Documentation gaps → docs-sync-agent automatically validates and updates
   - **Automatic Script Orchestration**: Agents determine which scripts to run based on task context
   - **Progressive Quality Enforcement**: Quality gates adapt to workflow phase and complexity
   - **Intelligent Recovery**: `scripts/remediation-advisor.sh` integrated into agent decision-making

5. **Phase Transition Management**
   - Detect phase completion when all P X.X.X tasks checked
   - Generate comprehensive phase summary in STATUS.md
   - Run full quality validation before phase transition
   - Prompt: "Phase X complete. Quality gates passed. `/commit` to commit changes?"
   - Update HANDOFF.yml current_phase to next phase
   - Next iteration automatically starts next phase tasks

## Error Handling

**File Issues:**
- **Missing PLAN.md**: "No PLAN.md found in current directory or parent directories"
- **Malformed HANDOFF.yml**: Report parsing error, continue with empty context
- **Missing agent reference**: Prompt for manual agent selection with --agent flag

**Task Issues:**
- **Invalid task ID**: "Task P2.8.0 not found in PLAN.md" + suggest available tasks
- **Prerequisites incomplete**: List incomplete tasks, suggest --force if intentional
- **Agent not found**: List available agents from .claude/agents/
- **Task too complex**: Run `scripts/smart-task-decomposition.sh --task TASK-ID` for decomposition suggestions
- **Agent output validation fails**: Provide specific feedback and suggest retry with different agent

**Quality Gates:**
- **Tests failing**: Block progression, run `scripts/remediation-advisor.sh` for specific guidance
- **Linting errors**: Block progression, suggest automatic fixes and appropriate agents
- **Security issues**: Block progression, suggest security-auditor agent
- **Multiple failures**: Consider task decomposition with `scripts/smart-task-decomposition.sh`
- **Missing documentation**: Warn but allow progression, suggest docs-maintainer

## Integration with PLAN.md Structure

**Task Format Recognition:**
```markdown
- [ ] P1.1.0 - Initial context analysis <!--agent:context-analyzer-->
- [ ] P1.2.0 - Write comprehensive tests <!--agent:test-engineer-->
- [x] P1.3.0 - Implement core functionality <!--agent:backend-specialist-->
```

**Agent Hint Parsing:**
- Required format: `<!--agent:agent-name-->`
- Validates against .claude/agents/ directory
- Falls back to manual selection if missing/invalid

**Phase Detection:**
- P1.X.X = Phase 1, P2.X.X = Phase 2, etc.
- Enforces sequential phase completion
- Supports sub-phases with additional decimal places

## Context Handoff Protocol

**To Agent (Input):**
```markdown
## Current Task: P1.2.0 - Write comprehensive tests
[Full task description from PLAN.md]

## Context from Planning Phase
[Relevant sections from RESEARCH.md]

## Previous Agent Work
[Last 2 HANDOFF.yml entries with summaries]

## Success Criteria
- Tests cover all core functionality
- Code coverage above 80%
- All tests pass before marking complete
```

**From Agent (Expected Output):**
```yaml
Agent returns structured results that /iterate parses:
- Technical implementation details and specifications
- Files changed and patterns followed
- Quality validation results and test outcomes
- Context needed for next agent
- Any new findings or architectural decisions
- User-facing changes requiring CHANGELOG updates

Note: Agents DO NOT update files directly - /iterate handles all file updates
```

## Parameters from $ARGUMENTS

- **TASK-ID**: Specific task to execute (e.g., P2.3.0, 1.4.0)
- **--force**: Execute task even if prerequisites incomplete (also affects hooks)
- **--agent AGENT-NAME**: Override agent hint with specific agent
- **--dry-run**: Show what would be executed without running
- **--context-only**: Display context that would be passed to agent

## Hook Integration

This command works seamlessly with Claude Code hooks for automatic enforcement:

**Setup Requirements:**
```bash
# Copy hooks configuration
cp .claude/hooks-config.json ~/.claude/settings/hooks.json

# Ensure hook scripts are executable
chmod +x scripts/hooks/*.sh
```

**Automatic Hook Behavior:**
- **Pre-Task Validation**: Context and workflow state validated automatically
- **Context Distillation**: Agent-specific focused context generated automatically
- **Post-Task Validation**: Agent output structure and quality gates validated automatically
- **TDD Enforcement**: Implementation files blocked without corresponding tests

**Hook Override:**
Use `--force` flag to override hook validations when necessary:
```bash
/iterate --force P1.3.0  # Bypasses TDD and quality gate blocking
```

For complete hook setup and configuration, see: [Claude Code Hooks Setup](../../../docs/ai-tools/setup/claude-code-hooks-setup.md)
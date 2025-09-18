---
description: Development execution with AI agent orchestration from working directory plans
argument-hint: [TASK-ID] [--force] [--agent AGENT-NAME] [--instruct] [--working-dir PATH]
allowed-tools: Read, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task
model: sonnet
---

Executes implementation tasks from PLAN.md files using **iterative development checkpoints** with collaborative validation and continuous learning loops, transforming linear task execution into adaptive development conversations.

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

**Tutoring Mode (`--instruct` flag):**
- Agent explains their planned approach and reasoning without making changes
- Interactive Q&A session for learning and understanding
- Detailed explanation of implementation patterns and best practices
- User can ask follow-up questions and request clarifications
- Agent provides code examples and explanations in teaching format
- No file modifications or coordination updates (purely educational)

## Iterative Development Patterns

```bash
# Collaborative checkpoint execution
/develop                    # Execute next task with progress checkpoints
/develop P2.3.0            # Execute specific task with validation conversations
/develop --checkpoint P1.3.0 # Execute with frequent validation points
/develop --review P1.2.0   # Review task results and iterate if needed
/develop --collaborate P1.4.0 # Enhanced collaboration mode with confidence indicators
/develop --instruct P1.3.0 # Tutoring mode: explain approach without changes
```

### Collaborative Development Principles

```yaml
iterative_development_approach:
  checkpoint_validation: "Validate progress at logical breakpoints"
  confidence_communication: "Express uncertainty and invite discussion"
  learning_integration: "Capture and apply discoveries during implementation"
  iteration_triggers: "Recognize when to revisit earlier decisions"
  progressive_implementation: "Build incrementally with validation"
```

## Orchestrator Architecture with Hooks

As the main Claude instance, `/iterate` acts as the orchestrator for all agent coordination, enhanced by automatic Claude Code hooks:

**Context Management:**
- Reads HANDOFF.yml and RESEARCH.md for complete context
- **Hook Enhancement**: `scripts/workflow/distill-context.sh` automatically generates focused context
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

## Iterative Development Process

For each task execution with collaborative checkpoints:

### Phase 1: Context Validation & Goal Setting

**Checkpoint 1A - Task Understanding**
- *AI*: "Starting task P1.3.0: [task description]. Based on the plan and previous work, I understand we need to [interpretation]. Is this correct? What specific outcomes do you need?"
- *Focus*: Validate task understanding before beginning
- *Context Review*: "From previous work, I see [key context]. What's changed since this was planned?"

**Checkpoint 1B - Approach Confirmation**
- *AI*: "I'm planning to approach this by [implementation strategy]. I'm [confidence level] about this approach. Any concerns or preferences about the implementation method?"
- *Focus*: Confirm implementation approach collaboratively
- *Risk Assessment*: "I see [potential risks]. Should we mitigate these first?"

### Phase 2: Iterative Implementation with Checkpoints

**Agent Consultation & Progress Validation Pattern:**

```yaml
implementation_checkpoint_flow:
  start_validation: "Confirm approach before beginning work"
  progress_checkpoints: "Validate at 25%, 50%, 75% completion"
  discovery_integration: "Incorporate learnings and adjust approach"
  quality_validation: "Validate quality at each checkpoint"
  completion_confirmation: "Confirm success criteria met"
```

**Checkpoint 2A - Implementation Start**
- *AI*: "Starting implementation. First, I'll [initial step]. This should take about [time estimate]. I'll check back when [milestone] is complete."
- *Focus*: Set expectations for first implementation phase
- *Progress Tracking*: "I'll validate progress at [checkpoint criteria]"

**Checkpoint 2B - Mid-Implementation Review**
- *AI*: "Progress update: I've completed [work done] and discovered [findings]. This is [on track/ahead/behind] schedule. I found [unexpected complexity/simplification]. Should I [continue as planned/adjust approach]?"
- *Focus*: Integrate discoveries and adjust if needed
- *Learning Capture*: "Key insight: [discovery]. This affects [impact]"

**Checkpoint 2C - Near-Completion Validation**
- *AI*: "Implementation is 75% complete. I've [major accomplishments] and need to [remaining work]. I'm [confidence level] about meeting the success criteria. Any concerns before I finish?"
- *Focus*: Final validation before completion
- *Quality Preview*: "Current quality status: [tests/docs/security/performance]"

### Phase 3: Completion Validation & Learning Integration

**Checkpoint 3A - Implementation Completion**
- *AI*: "Task implementation complete! Here's what I accomplished: [summary]. Success criteria met: [checklist]. Quality gates passed: [validation results]. Ready for your review."
- *Focus*: Confirm task completion and quality
- *Deliverable Summary*: "Files changed: [list], Patterns used: [patterns], Tests added: [coverage]"

**Checkpoint 3B - Learning & Discovery Documentation**
- *AI*: "During implementation, I learned [key insights]. This affects future work because [implications]. Should we update our approach for similar tasks?"
- *Focus*: Capture and integrate implementation learnings
- *Knowledge Transfer*: "For the next agent, key context is [handoff information]"

**Checkpoint 3C - Context Handoff Preparation**
- *AI*: "Preparing handoff for next task. Key context for the next agent: [context]. Open questions that emerged: [questions]. Recommendations for next steps: [guidance]."
- *Focus*: Set up next task for success
- *Coordination Update*: Updates HANDOFF.yml with structured context

### Phase 4: Collaborative Quality Validation

**Quality Checkpoint Pattern:**

```yaml
quality_validation_approach:
  incremental_validation: "Check quality at each checkpoint, not just at end"
  confidence_based_gating: "Stricter validation for uncertain areas"
  collaborative_fixing: "Work together to resolve quality issues"
  learning_integration: "Use quality feedback to improve process"
```

**Checkpoint 4A - Quality Assessment**
- *AI*: "Running quality validation: [tests, linting, security, docs]. Results: [summary]. I'm [confidence level] about code quality, but [concern area] needs attention. Should we address now or in next task?"
- *Focus*: Collaborative quality decision-making
- *Quality Transparency*: "Test coverage: X%, Linting: Y issues, Security: Z concerns"

**Checkpoint 4B - Issue Resolution**
- *AI*: "Found [quality issues]. I can fix [easy fixes] immediately. For [complex issues], I recommend [approach]. What's your preference for handling these?"
- *Focus*: Collaborative issue resolution
- *Smart Recovery*: "Similar issue solved in [previous task] using [pattern]"

**Checkpoint 4C - Quality Gate Confirmation**
- *AI*: "All quality gates passed! Summary: [quality metrics]. This implementation follows [established patterns] and maintains [quality standards]. Ready to mark task complete and move to next phase."
- *Focus*: Final quality confirmation
- *Process Learning*: "Quality process improvements for next time: [suggestions]"

### Phase 5: Transition & Continuous Learning

**Phase Completion Checkpoint:**

**Checkpoint 5A - Phase Summary**
- *AI*: "Phase [X] complete! Accomplished: [achievements]. Key learnings: [insights]. Quality status: [metrics]. This phase took [actual time] vs [planned time]. Ready for phase transition?"
- *Focus*: Comprehensive phase review
- *Learning Integration*: "Based on this phase, I recommend [process improvements] for next phase"

**Checkpoint 5B - Commit & Documentation**
- *AI*: "Ready to commit Phase [X] changes. Commit message: [suggested message]. Documentation updates needed: [list]. Should I also update [related docs/changelog] based on user-facing changes?"
- *Focus*: Collaborative commit and documentation
- *Change Summary*: "User impact: [changes], Technical debt: [status], Performance: [impact]"

**Checkpoint 5C - Next Phase Preparation**
- *AI*: "Starting Phase [X+1]. Based on what we learned in Phase [X], I suggest [approach adjustments]. Next task is [task] - I'm [confidence level] about this. Any concerns before we begin?"
- *Focus*: Apply learnings to next phase
- *Adaptive Planning*: "Plan adjustments based on discoveries: [changes]"

## Collaborative Learning Mode (`--instruct`)

When using the `--instruct` flag, `/develop` transforms into an interactive learning session that builds understanding through structured dialogue:

### Interactive Learning Process

**Learning Checkpoint 1 - Approach Exploration**
- *AI*: "Let me explain my approach to this task. I would [detailed approach] because [reasoning]. This involves [steps] with [considerations]. What aspects would you like me to explain deeper?"
- *Focus*: Build foundational understanding
- *Interactive Element*: "Ask me about any part - implementation details, architectural choices, trade-offs"

**Learning Checkpoint 2 - Alternative Analysis**
- *AI*: "There are actually 3 ways to approach this: [Option A], [Option B], [Option C]. I recommended [chosen option] because [rationale]. Would you like to explore why the other options are less suitable?"
- *Focus*: Understand decision-making process
- *Collaborative Learning*: "Which alternative interests you most?"

**Learning Checkpoint 3 - Implementation Deep-Dive**
- *AI*: "Let me walk through the implementation step-by-step: [detailed steps]. The key challenges are [challenges] and here's how I'd address them: [solutions]. What questions do you have about the implementation?"
- *Focus*: Technical implementation understanding
- *Interactive Support*: "Want to see code examples for any specific part?"

**Learning Checkpoint 4 - Pattern Recognition**
- *AI*: "This task follows the [pattern name] pattern we've used in [previous instances]. The benefits are [benefits] and the trade-offs are [trade-offs]. This helps with [larger architectural goal]. How does this fit with your understanding of the system?"
- *Focus*: Connect to broader architectural understanding
- *Knowledge Building*: "See how this relates to [other similar tasks]?"

### Collaborative Learning Benefits

- **Understanding Before Action**: Build confidence through explanation before implementation
- **Interactive Exploration**: Ask questions and explore alternatives safely
- **Pattern Learning**: Understand architectural patterns and implementation strategies
- **Confidence Building**: Reduce uncertainty through collaborative explanation
- **Context Preservation**: Learning enhances rather than replaces implementation context
- **Adaptive Teaching**: Agent adjusts explanation depth based on your questions
- **Decision Transparency**: Understand why specific choices are made
- **Knowledge Transfer**: Capture learnings for future similar tasks

## Error Handling

**File Issues:**
- **Missing PLAN.md**: "No PLAN.md found in current directory or parent directories"
- **Malformed HANDOFF.yml**: Report parsing error, continue with empty context
- **Missing agent reference**: Prompt for manual agent selection with --agent flag

**Task Issues:**
- **Invalid task ID**: "Task P2.8.0 not found in PLAN.md" + suggest available tasks
- **Prerequisites incomplete**: List incomplete tasks, suggest --force if intentional
- **Agent not found**: List available agents from .claude/agents/
- **Task too complex**: Run `scripts/workflow/smart-task-decomposition.sh --task TASK-ID` for decomposition suggestions
- **Agent output validation fails**: Provide specific feedback and suggest retry with different agent

**Quality Gates:**
- **Tests failing**: Block progression, run `scripts/workflow/remediation-advisor.sh` for specific guidance
- **Linting errors**: Block progression, suggest automatic fixes and appropriate agents
- **Security issues**: Block progression, suggest security-auditor agent
- **Multiple failures**: Consider task decomposition with `scripts/workflow/smart-task-decomposition.sh`
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

**Collaborative Task Context (Input):**
```markdown
## Current Task: P1.2.0 - Write comprehensive tests
[Full task description from PLAN.md]

## Implementation Approach
- Confidence Level: [high/medium/low] based on task complexity
- Checkpoint Strategy: [validation points and frequency]
- Risk Areas: [aspects requiring extra attention]
- Success Criteria: [measurable completion indicators]

## Context from Planning Phase
[Relevant sections from RESEARCH.md]

## Previous Agent Work
[Last 2 HANDOFF.yml entries with summaries]

## Collaboration Instructions
- Use checkpoint pattern for progress validation
- Express confidence levels for different aspects
- Identify when iteration or plan adjustment needed
- Capture learnings for handoff to next agent
```

**Collaborative Implementation Output:**
```yaml
Agent returns structured checkpoint results that /develop parses:

Checkpoint Progress:
- Implementation status: [25%/50%/75%/100%]
- Confidence levels: [aspects with high/medium/low confidence]
- Discoveries made: [new insights affecting implementation]
- Quality status: [tests/docs/security/performance]

Implementation Details:
- Files changed: [list with rationale]
- Patterns followed: [architectural patterns used]
- Quality metrics: [test coverage, linting, security]
- Performance impact: [any performance considerations]

Learning & Handoff:
- Key learnings: [insights for future similar tasks]
- Context for next agent: [essential handoff information]
- Open questions: [unresolved items for discussion]
- Recommendations: [suggestions for next phase]

Iteration Triggers:
- Plan adjustments needed: [any scope or approach changes]
- Risk escalations: [concerns requiring attention]
- Quality improvements: [suggestions for better outcomes]

Note: Agents provide checkpoint feedback - /develop handles coordination
```

## Parameters from $ARGUMENTS

- **TASK-ID**: Specific task to execute (e.g., P2.3.0, 1.4.0)
- **--force**: Execute task even if prerequisites incomplete (also affects hooks)
- **--agent AGENT-NAME**: Override agent hint with specific agent
- **--instruct**: Tutoring mode - agent explains approach without making changes
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
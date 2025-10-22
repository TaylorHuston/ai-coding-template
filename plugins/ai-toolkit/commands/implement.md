---
version: "0.10.0"
created: "2025-10-22"
last_updated: "2025-10-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "development", "execution"]
description: "Execute specific implementation phases from task plans with test-first enforcement"
argument-hint: "TASK-### PHASE | BUG-### PHASE"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
---

# /implement Command

Execute specific phases of implementation plans with full context awareness and intelligent agent coordination.

## Usage

**Required Parameters**: Issue ID and Phase

```bash
/implement TASK-001 1.1    # Execute phase 1.1 of TASK-001
/implement BUG-003 2.2     # Execute phase 2.2 of BUG-003
```

**IMPORTANT**: Both parameters are mandatory:
- **Issue ID**: Must be a valid TASK-### or BUG-### identifier
- **Phase**: Must match a phase item from the Plan section (e.g., 1.1, 2.3, 3.1)

If parameters are missing or invalid, the command will:
1. Check if TASK.md or BUG.md exists in `pm/issues/`
2. If Plan section exists, show available phases
3. Ask user to provide valid issue ID and phase number

## Agent Coordination

**Primary**: Domain specialists (frontend-specialist, backend-specialist, database-specialist) based on task type
**Supporting**: test-engineer (test-first approach), code-reviewer (quality validation), security-auditor (security-sensitive tasks)
**Coordination**: WORKLOG.md for narrative work history and context preservation

## Core Principles

- **Test-First**: Auto-invoke test-engineer for all implementation (95%+ coverage)
- **Phase-Focused**: Execute specific plan phases, not entire tasks
- **Context-Aware**: Full epic goals, ADRs, dependencies, and task coordination
- **Quality-Gated**: Validate against acceptance criteria and architectural decisions

## Execution Flow

### 1. Parameter Validation & Context Loading

**Validate Parameters:**
- Check if issue ID format is valid (TASK-### or BUG-###)
- Locate issue file in `pm/issues/ISSUE-ID-*/TASK.md` or `BUG.md`
- If issue not found: **ERROR** and list available issues
- Parse Plan section from issue file
- If phase parameter doesn't match any plan item: **ERROR** and list available phases
- If no Plan section exists: **ERROR** with message "Run `/plan TASK-###` first to create implementation plan"

**Branch Verification & Management:**
- Read `docs/development/guidelines/git-workflow.md` for branching configuration
- Get current branch: `git branch --show-current`
- Calculate expected branch from issue ID:
  - TASK-### → feature/TASK-###
  - BUG-### → bugfix/BUG-###
- Compare current branch with expected branch

**If branch doesn't match:**
1. Show warning: "⚠️ You're on `{current}` but implementing {ISSUE-ID}"
2. Show expected: "Expected branch: {expected}"
3. Check if expected branch exists:
   - If exists: Offer to switch: "Switch to {expected}? (y/n)"
   - If not exists: Offer to create: "Create and switch to {expected}? (y/n)"
4. If user accepts:
   - Execute: `/branch create {ISSUE-ID}` or `/branch switch {expected}`
   - Continue with implementation
5. If user declines:
   - Show reminder: "Reminder: Work branch naming helps track work to issues"
   - Continue with implementation (don't block)

**Load Task Context:**
- Read issue file (TASK.md or BUG.md)
- Load epic context from `epic:` field in frontmatter (if present)
- Read relevant ADRs from `docs/architecture/`
- Read WORKLOG.md for work history and lessons learned (if exists)
- Read RESEARCH.md for technical decisions and rationale (if exists)

**Test-First Check** (gentle prompts, not blocking):
- Look for test files related to this phase
- If phase is implementation (e.g., "2.2 Implement X"):
  - Check if corresponding test phase exists before it (e.g., "2.1 Write tests for X")
  - If test phase exists but unchecked:
    - **PROMPT**: "TDD workflow: Phase '2.1 Write tests' should be completed first.

      Execute 2.1 first? (yes/skip): _"
  - **NEVER BLOCK**: Always allow skip, just prompt for best practice
- If no tests found AND about to implement code:
  - **PROMPT**: "⚠️ No tests found for this implementation.

    TDD best practice: Write tests first to clarify requirements.

    Options:
    1. Auto-generate comprehensive test suite from acceptance criteria (RECOMMENDED)
    2. I'll write tests manually first
    3. Skip tests for now (can add later)

    Choose (1/2/3): _"
  - **DEFAULT** to option 1 if no user input
  - Track choice in WORKLOG.md entry

### 2. Pre-Phase Context Loading

**REQUIRED before starting phase execution:**
- **Read WORKLOG.md**: Review previous work entries for context and lessons learned
- **Understand what's been done**: Identify completed work and any gotchas from previous phases
- **Load agent context**: Review domain-specific entries from previous agents
- **Note human contributions**: Check for `/comment` entries from human developers

### 3. Agent Phase Execution

- **Agent selection**: Choose specialist based on phase domain and task requirements
- **Intelligent context distillation**: Filter and prepare domain-specific context for the selected agent, including WORKLOG insights
  - **Backend specialists**: Technical stack, API contracts, security requirements, database patterns
  - **Frontend specialists**: Component architecture, state patterns, UI/UX requirements, responsive design
  - **Test engineers**: Coverage requirements, validation patterns, quality gates, testing methodologies
  - **Security auditors**: Threat models, authentication patterns, authorization requirements, compliance
  - **Database specialists**: Schema patterns, migration strategies, performance constraints, data validation
  - **Performance optimizers**: Scaling requirements, performance targets, bottleneck patterns, optimization opportunities
- **Context provision**: Distilled domain-specific context from epic goals, ADRs, acceptance criteria, and coordination state
- **Phase execution**: Execute the specific plan phase with test-first approach
  - Parse phase description from Plan section
  - Execute work described in phase item (e.g., "Write tests", "Implement feature X", "Refactor module Y")
  - Mark phase complete by checking box in TASK.md
- **AI-Powered Test Generation** (superpower, not chore):
  - When generating tests from acceptance criteria:
    - Create comprehensive test suites (unit, integration, edge cases) in seconds
    - Add explanatory comments: WHY this test matters, WHAT it verifies
    - Use appropriate testing patterns for tech stack (auto-detected)
    - Frame tests as living documentation for team knowledge sharing
  - **Messaging to user**: "✅ Generated comprehensive test suite with X unit tests, Y integration tests, Z edge cases. All tests documented for team reference."
  - Makes TDD/BDD easier than skipping tests!

### 4. Post-Phase WORKLOG Entry

**REQUIRED after phase completion:**
- **Get current timestamp**: Run `date '+%Y-%m-%d %H:%M'` to get accurate timestamp
- **Write WORKLOG entry**: Document what was done in ~500 char narrative summary
- **Prepend to top**: Add new entry at the beginning (reverse chronological order)
- **Include lessons learned**: Capture gotchas, unexpected issues, alternative approaches tried
- **Note files changed**: List key files modified for easy reference
- **Mark phase complete**: Check off phase in TASK.md Plan section
- **Reference deep rationale**: If complex technical decisions were made, note "See RESEARCH.md #section-ref"

**WORKLOG Entry Format (newest entries first):**
```markdown
## YYYY-MM-DD HH:MM - agent-name
Summary of what was implemented (~500 chars).
Gotcha: [Any unexpected issues encountered]
Lesson: [What worked well or what to avoid]
Files: [key/files/changed.js, other/files.ts]
```

**Note**: Use `date '+%Y-%m-%d %H:%M'` for timestamp - never estimate the date/time.

### 5. Task Completion Check

**If all phases complete:**
- **Final WORKLOG entry**: Document task completion with overall summary
- **Update task status**: Mark task as complete in TASK.md frontmatter
- **Update epic file**: Mark task complete in epic task list (if epic exists)
- **Verify completeness**: Confirm all acceptance criteria met and documented

## Intelligent Context Distillation

The `/implement` command uses domain-aware context filtering to optimize agent performance:

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
- Parse WORKLOG.md, RESEARCH.md, and ADR files in real-time
- Extract only domain-relevant sections for the selected agent
- Combine with phase-specific requirements from TASK.md Plan section
- Present concise, actionable context that eliminates noise
- Include lessons learned from previous phases to avoid repeating mistakes

**Benefit**: Agents focus on relevant information without context overload, improving decision quality and execution speed.

## Quality Gates

- **Acceptance Criteria**: Validate against user stories from task definition
- **ADR Compliance**: Follow architectural decisions from `docs/architecture/`
- **Test Coverage**: 95%+ comprehensive test suite (unit, integration, E2E)
- **Quality Checks**: Linting, security validation, performance requirements

## WORKLOG.md Documentation Requirements

### **WORKLOG Entry Guidelines**

Every phase completion must create a WORKLOG.md entry **at the top** (reverse chronological):

**Entry Structure (newest first):**
```markdown
## YYYY-MM-DD HH:MM - agent-name
Brief summary of work completed (~500 chars).
Gotcha: [Any unexpected issues or important discoveries]
Lesson: [What worked well or what to avoid in future]
Files: [path/to/main/file.js, other/modified/file.ts]
```

**Required Elements:**
- **Entry Order**: Reverse chronological (newest entries prepended to top)
- **Timestamp**: Get from system using `date '+%Y-%m-%d %H:%M'` (NEVER guess the date/time)
- **Agent identifier**: Name of the agent that did the work (or @username for humans)
- **Summary**: What was done (implementation details, approach taken)
- **Gotchas**: Unexpected issues, edge cases, important discoveries
- **Lessons**: What worked well, what to avoid, better approaches found
- **Files**: Key files modified (helps locate code changes)

**Critical**: Always run `date '+%Y-%m-%d %H:%M'` before creating WORKLOG entries. Do not use estimated dates.

### **WORKLOG Best Practices**

1. **Keep entries scannable**: ~500 chars is ideal, can be longer if needed for critical gotchas
2. **Focus on insights**: Document WHY things were done certain ways, not just WHAT was done
3. **Capture alternatives**: "Tried X but Y worked better because..." helps future work
4. **Reference deep dives**: "See RESEARCH.md #caching-strategy for full rationale"
5. **Human-friendly**: Write for developers who will read this weeks/months later

### **When WORKLOG Entries Are Created**

- **After each phase completion** via `/implement` - Agent auto-writes entry
- **When humans add comments** via `/comment` - Human-written entries with @username
- **At task completion** - Final summary entry documenting overall results
- **When discoveries are made** - Mid-phase insights can be added to guide future work

## Branch Management Integration

The `/implement` command integrates with `/branch` for seamless work branch management:

**Automatic branch creation:**
- When implementing TASK-001, automatically creates `feature/TASK-001` if needed
- When implementing BUG-003, automatically creates `bugfix/BUG-003` if needed
- Creates from configured base branch (typically `develop`)
- Reads branch configuration from `docs/development/guidelines/git-workflow.md`

**Branch verification (non-blocking):**
- Warns if you're on wrong branch (e.g., on `develop` but implementing TASK-001)
- Offers to switch/create correct branch
- Allows proceeding if user declines (trusts user judgment)

**Why non-blocking:**
- Sometimes you want to spike/explore on any branch
- Advanced users may have custom workflows
- Warnings provide guidance without restrictions

**Workflow integration:**
```bash
/implement TASK-001 1.1
# 1. Checks current branch (e.g., develop)
# 2. Warns: "You're on develop but implementing TASK-001"
# 3. Offers: "Create and switch to feature/TASK-001? (y/n)"
# 4. If yes: Creates branch and continues
# 5. If no: Proceeds with implementation on current branch
```

## Dependencies & Coordination

- **Blocking**: Identify alternatives or resolution steps when dependencies block
- **Parallel**: Coordinate independent phase streams across multiple developers
- **WORKLOG tracking**: Document coordination and discoveries in narrative entries
- **Context sharing**: Agents read WORKLOG to understand previous work and avoid conflicts

## Outputs

### **MANDATORY Output Requirements**

**pm/issues/ISSUE-ID-*/TASK.md or BUG.md Updates:**
- ✓ Mark completed phase with checkbox (e.g., `- [x] 1.1 Write tests`)
- Document any discovered requirements or scope changes
- Update acceptance criteria status

**pm/issues/ISSUE-ID-*/WORKLOG.md Updates (REQUIRED):**
- **Timestamped narrative entries**: What was done, how it was done, lessons learned
- **Gotchas and discoveries**: Unexpected issues, edge cases, important findings
- **Files changed**: List key files modified for easy reference
- **Context for future work**: Insights that help AI and developers understand the implementation

**pm/issues/ISSUE-ID-*/RESEARCH.md Documentation:**
- Technical decisions and rationale from each agent
- Discoveries and insights that impact future work
- Integration challenges and solutions
- Deep dives on complex technical choices

**pm/epics/EPIC-###-name.md Status Updates (if epic exists):**
- Mark completed tasks in task list when all phases complete
- Update overall epic progress and next priorities

### **Validation Before Completion**

**REQUIRED before marking any task complete:**

1. **All phases checked**: Verify all Plan checkboxes marked complete
2. **Acceptance criteria met**: Confirm all user stories and requirements satisfied
3. **WORKLOG documented**: Final entry summarizing overall task completion
4. **Tests passing**: All test suites pass with 95%+ coverage
5. **Epic consistency**: Task completion properly reflected in epic status (if epic exists)

### **WORKLOG Completeness Check**

- **Narrative continuity**: WORKLOG tells coherent story from start to finish
- **Lessons captured**: Key gotchas and discoveries documented for future reference
- **File coverage**: Major implementation files referenced in entries
- **Human contributions**: Any manual work by developers documented via `/comment`

## Error Handling

### **Missing Parameters**
```
Error: Missing required parameters

Usage: /implement TASK-### PHASE

Example: /implement TASK-001 1.1
```

### **Invalid Issue ID**
```
Error: Issue 'TASK-999' not found in pm/issues/

Available issues:
  - TASK-001-user-authentication
  - TASK-002-database-schema
  - BUG-001-login-error
```

### **Invalid Phase**
```
Error: Phase '5.5' not found in TASK-001 plan

Available phases:
  - [ ] 1.1 Write tests for authentication
  - [ ] 1.2 Implement authentication logic
  - [x] 2.1 Create database schema (completed)
  - [ ] 2.2 Add migration scripts
```

### **No Plan Section**
```
Error: TASK-001 does not have a Plan section

Run `/plan TASK-001` first to create an implementation plan with phases.
```

## Migration from /develop

The `/implement` command replaces `/develop` with a more focused, phase-based approach:

**Old `/develop` command:**
```bash
/develop --epic "name"                    # Continue next task
/develop --task "###" --epic "name"       # Work on specific task
```

**New `/implement` command:**
```bash
/implement TASK-001 1.1                   # Execute specific phase
/implement TASK-001 1.2                   # Execute next phase
```

**Benefits:**
- **Clearer scope**: Execute one phase at a time, not entire tasks
- **Better tracking**: Each phase maps to a checkbox in the Plan
- **Simplified parameters**: Two required parameters instead of multiple flags
- **Progressive work**: Work through plan phases sequentially
- **Integrated branching**: Automatic branch creation and verification
- **Git workflow enforcement**: Reads project git-workflow.md configuration

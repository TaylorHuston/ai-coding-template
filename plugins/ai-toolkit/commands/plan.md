---
version: "0.5.0"
created: "2025-09-17"
last_updated: "2025-10-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "planning", "implementation"]
description: "Add implementation plan with phase-based breakdown to individual tasks and bugs"
argument-hint: "TASK-### | BUG-###"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
references_guidelines:
  - docs/development/guidelines/development-loop.md  # Development workflow configuration, test-first patterns
---

# /plan Command

**Purpose**: Add "Plan" section with phase-based breakdown to individual TASK.md or BUG.md files.

## Usage

```bash
/plan TASK-001    # Add plan to task
/plan BUG-003     # Add plan to bug
```

**Simple invocation**: Just pass the task/bug ID. Command automatically:
- Locates file in `pm/issues/` directory (e.g., `pm/issues/TASK-001-*/TASK.md` or `pm/issues/BUG-003-*/BUG.md`)
- Reads appropriate template (`pm/templates/task.md` or `pm/templates/bug.md`) for structure requirements
- Reads epic context from `epic:` field in YAML frontmatter (if present)
- Loads relevant architecture decisions from `docs/project/adrs/ADR-*.md`
- Adds or updates "Plan" section with phase-based breakdown following template
- Performs complexity analysis and suggests decomposition if needed

**Re-running**: Run command again on same ID to update/refine existing plan

## Agent Coordination

**Primary**: project-manager (task analysis and planning), test-engineer (testing strategy integration)
**Supporting**: Domain specialists (frontend-specialist, backend-specialist, database-specialist) for complexity assessment
**Quality**: code-reviewer (implementation validation), security-auditor (security requirements)

## Approach

### **Context Gathering**
1. **Locate issue**: Use Glob to find `pm/issues/TASK-###-*/` or `pm/issues/BUG-###-*/`
2. **Read template**: Load `pm/templates/task.md` or `pm/templates/bug.md` to understand structure
3. **Read issue file**: Load TASK.md or BUG.md with description and acceptance criteria
4. **Load epic context** (if applicable):
   - Extract `epic: EPIC-###` from YAML frontmatter
   - Read `pm/epics/EPIC-###-name.md` for feature context
5. **Load architecture**: Read relevant `docs/project/adrs/ADR-*.md` files
6. **Assess complexity**: Analyze issue for complexity indicators

### **Complexity Analysis**

**Complexity scoring is configured in** `docs/development/guidelines/development-loop.md` (YAML frontmatter). The command reads this configuration to score tasks and recommend decomposition.

**How It Works:**
1. Analyzes task for complexity indicators (multi-domain integration, security, database changes, etc.)
2. Assigns points based on configured scoring rules
3. Compares total score to thresholds (high/medium/low complexity)
4. Recommends decomposition for high-complexity tasks (≥5 points by default)

**Teams can customize:**
- Point values for each complexity indicator
- Decomposition thresholds based on team experience
- Which indicators matter most for their context

See `docs/development/guidelines/development-loop.md` "Complexity Scoring" section for configuration and customization examples.

### **Plan Creation**

**Phase structures drive the development loop**: Read `docs/development/guidelines/development-loop.md` for current workflow configuration that agents will follow during implementation.

1. **Suggest phase structure**: Based on task type, suggest logical phases
   - **Default for implementation**: Design → Test-Driven Implementation → Integration → Documentation
   - **Frontend tasks**: Design → Component Tests → Implementation → Responsive/E2E
   - **Backend tasks**: API Design → Unit Tests → Implementation → Integration Tests
   - **Bug fixes**: Investigation → Root Cause → Fix → Regression Tests

2. **Add Plan section** to TASK.md/BUG.md:
   - Phase headers: `### Phase X - <description>`
   - Checkboxed items: `- [ ] x.x <description>` under each phase
   - Include test-first patterns (Red-Green-Refactor) when appropriate
   - Note: "Phases are suggestions. Modify to fit your workflow!"

3. **Suggest patterns**: Show alternative test-first patterns as options:
   - **Strict TDD** (Red-Green-Refactor cycle visible)
   - **BDD Scenarios** (Given/When/Then → implementation)
   - **Test Pyramid** (heavy unit, moderate integration, light E2E)
   - **Pragmatic** (spike/explore → test → implement)

## Outputs

- **pm/issues/TASK-###-name/TASK.md** or **pm/issues/BUG-###-name/BUG.md**: Enhanced with "Plan" section featuring:
  - Phase headers with logical grouping
  - Checkboxed implementation steps
  - Test-first patterns embedded
  - Human-AI collaboration friendly (check off manually or via /implement)

## Integration with Workflow

**Position**: After task creation (via /epic or other means), before /implement

- **After task creation**: Takes requirements and acceptance criteria as input
- **After /adr**: Incorporates technical decisions from ADRs
- **Before /implement**: Provides detailed implementation roadmap with agent coordination
- **Complexity-aware**: Suggests decomposition when tasks are too complex

## Example

### Command Usage
```bash
/plan TASK-001
```

### Sample Output (TASK.md with Plan section)
```markdown
---
epic: EPIC-001
type: user-story
status: todo
created: 2025-10-21
updated: 2025-10-21
---

# TASK-001: User Registration

## Description
As a new user, I want to create an account with email and password, So that I can access the application securely.

## Acceptance Criteria
- [ ] All features covered by tests (aim for 95%+ coverage)
- [ ] Tests verify behavior, not just execute code
- [ ] User can register with email and password
- [ ] Email validation shows inline errors
- [ ] Password meets security requirements (8+ chars, special chars)
- [ ] Success redirects to dashboard

<!-- Acceptance Criteria Formats (choose what works for your team):
- Simple: '- [ ] User can register with email'
- BDD: '- [ ] Given valid email, When user submits, Then account created'
- Testable: '- [ ] Should validate email format before submission' -->

## Plan

### Phase 1 - Design
- [ ] 1.1 Design database schema for users table
- [ ] 1.2 Design API contract for registration endpoint
- [ ] 1.3 Design form validation rules

### Phase 2 - Test-Driven Implementation
- [ ] 2.1 Write failing tests for User model validation (RED)
- [ ] 2.2 Implement User model to pass tests (GREEN)
- [ ] 2.3 Refactor User model for clarity (REFACTOR)
- [ ] 2.4 Write tests for password hashing with bcrypt (RED)
- [ ] 2.5 Implement password hashing (GREEN)
- [ ] 2.6 Write tests for registration endpoint (RED)
- [ ] 2.7 Implement POST /api/auth/register endpoint (GREEN)
- [ ] 2.8 Write tests for registration form component (RED)
- [ ] 2.9 Build registration form component (GREEN)

### Phase 3 - Integration & E2E
- [ ] 3.1 Write integration tests for complete registration flow
- [ ] 3.2 Write E2E tests for user journey
- [ ] 3.3 Verify all acceptance criteria met

### Phase 4 - Documentation
- [ ] 4.1 Update API documentation
- [ ] 4.2 Add inline code documentation

---

**Note**: Phases are suggestions. Modify to fit your workflow!

**Alternative Patterns**:
- **Strict TDD**: Red-Green-Refactor cycle visible in every step
- **BDD Scenarios**: Define Given/When/Then → Implement tests → Build features
- **Test Pyramid**: Heavy unit, moderate integration, light E2E
- **Pragmatic**: Spike/explore → Write tests → Implement production code
```

## Testing Best Practices (Recommendations)

**Test-first development cycle** is configured in `docs/development/guidelines/development-loop.md`. Read the guideline for current workflow settings, code review thresholds, coverage targets, and quality gate requirements.

**Focus testing effort on:**
- ✅ Business logic and algorithms
- ✅ Complex conditional flows
- ✅ User-facing features
- ✅ API contracts and integrations
- ✅ Security-critical code

**Tests may be optional for:**
- Simple configuration files
- Trivial property getters/setters
- One-time migration scripts
- Pure UI styling (no behavior)
- Generated/scaffolded code

**Quality over quantity:**
- 95% coverage is a guide, not gospel
- Tests should verify behavior, not just execute code
- One test that catches real bugs > ten tests that don't
- Tests are living documentation - make them readable!

**When tests feel painful:**
- Might indicate design issues (hard to test = hard to use)
- Consider refactoring code to be more testable
- Ask: "How would I explain this to a teammate?" → Write that as a test
- Tests should help you, not slow you down

**AI-Powered Testing Advantage:**
- AI can generate comprehensive test suites in seconds
- No more "testing takes too long" objection
- Tests include explanatory comments for team knowledge sharing
- Removes friction from TDD/BDD adoption

## Implementation Notes

When implementing `/plan TASK-###` or `/plan BUG-###`:

1. **Validate ID format**: Ensure ID matches `TASK-###` or `BUG-###` pattern
2. **Find directory**: Use Glob `pm/issues/{TASK|BUG}-###-*/` to locate task directory
3. **Read existing file**: Load TASK.md or BUG.md to check for existing Plan section
4. **Parse frontmatter**: Extract `epic:` field if present to load parent context
5. **Analyze complexity**: Calculate score and suggest decomposition if ≥5 points
6. **Generate phases**: Create contextually appropriate phase breakdown
7. **Add/update Plan**: Insert Plan section or update if already exists
8. **Confirm with user**: Present plan and ask for modifications

**Key principle**: Transform requirements into executable implementation steps with clear test-first guidance.

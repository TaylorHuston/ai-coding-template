---
title: "Design Command Workflow Examples"
version: "0.1.0"
created: "2025-09-18"
last_updated: "2025-09-18"
status: "active"
target_audience: ["developers", "product-managers", "ai-assistants"]
document_type: "guide"
tags: ["workflow", "design", "examples", "epic", "tasks"]
---

# Design Command Workflow Examples

This guide provides comprehensive examples of using the `/design` command for epic-driven development workflows.

## Epic-Driven Development Example

### Command: `/design --epic "user-authentication"`

**Creates**: `epics/user-authentication/EPIC.md` with:

- Problem: "Users cannot securely access the application"
- Scope: Registration, login, password reset (excluding OAuth/2FA)
- Success criteria: Secure auth system supporting 1000 concurrent users
- External reference: Link to JIRA epic or Linear project
- Planned tasks: Checkbox list of all tasks to be created for this epic

**Epic includes planned tasks**:

```markdown
## Planned Tasks
- [ ] TASK-001: Database setup and user schema
- [ ] TASK-002: User registration flow
- [ ] TASK-003: Login authentication
- [ ] TASK-004: Password reset functionality
- [ ] TASK-005: Session management
- [ ] TASK-006: Security validation and testing
```

### Progressive Discovery Workflow:

1. **`/design --task "User Registration" --epic "user-authentication"`** creates `TASK-001-user-registration/TASK.md`
2. **`/design --task "Login Flow" --epic "user-authentication"`** creates `TASK-002-login-flow/TASK.md`
3. **`/architect --epic "user-authentication"`** adds ADR files to `resources/` and discovers technical tasks like `TASK-003-redis-setup/`
4. **`/plan --epic "user-authentication"`** sequences all tasks, adds X.Y.Z implementation details, creates HANDOFF.yml files
5. **During `/develop`**: May discover additional tasks like `TASK-004-validation-helpers/`

**Task Structure**: Each task gets its own directory with TASK.md, HANDOFF.yml (from /plan), and RESEARCH.md (during development).

## Design vs Plan Separation

### What `/design` creates in TASK files (requirements):

```markdown
# TASK-001: User Registration

## User Story
As a new user
I want to create an account with my email
So that I can access the application securely

## Acceptance Criteria
- [ ] User can register with email and password
- [ ] Email validation shows inline errors
- [ ] Password meets security requirements
- [ ] Success redirects to dashboard

## External Reference
[JIRA AUTH-101](https://company.atlassian.net/browse/AUTH-101)
```

### What `/plan` adds (implementation):

```markdown
## Implementation Tasks
- [ ] Create registration form component
- [ ] Add client-side email validation
- [ ] Implement POST /api/auth/register endpoint
- [ ] Add server-side validation and error handling
- [ ] Hash password with bcrypt
- [ ] Generate JWT token
- [ ] Write unit and integration tests

## Assignment
- Assignee: @alice
- Dependencies: TASK-002 (database setup)
```

## Complete Progressive Discovery Example

### Final Epic Structure After All Phases

```
epics/user-authentication/
  EPIC.md                               # Epic overview with Implementation Phases
  resources/                            # All reference materials
    ADR-001-jwt-strategy.md            # From /architect phase
    ADR-002-session-management.md      # From /architect phase
    screenshots/                       # UI mockups and designs
      login-wireframe.png
      registration-flow.pdf
    research/                          # Technical analysis
      auth-benchmarks.md
      security-considerations.md
    customer-feedback/                 # User research
      user-interviews.md
      requirements-analysis.md
  TASK-001-user-registration/          # From /design phase
    TASK.md                            # Requirements + Implementation tasks (1.1.0, 1.2.0, etc.)
    HANDOFF.yml                        # From /plan phase
    RESEARCH.md                        # From /develop phase
  TASK-002-login-flow/                 # From /design phase
    TASK.md
    HANDOFF.yml
    RESEARCH.md
  TASK-003-redis-setup/                # Discovered during /architect
    TASK.md
    HANDOFF.yml
    RESEARCH.md
  TASK-004-validation-helpers/         # Discovered during /develop
    TASK.md
    HANDOFF.yml
    RESEARCH.md
```

### EPIC.md Evolution Through Phases

**After /design**:
```markdown
## Task List (Execution Order)
- [ ] TASK-001: User registration
- [ ] TASK-002: Login flow
```

**After /architect** (discovered Redis needed):
```markdown
## Task List (Execution Order)
- [ ] TASK-003: Redis setup *(added by architect)*
- [ ] TASK-001: User registration
- [ ] TASK-002: Login flow
```

**After /plan** (added phases and discovered coordination task):
```markdown
## Task List (Execution Order)
- [ ] TASK-003: Redis setup
- [ ] TASK-001: User registration
- [ ] TASK-002: Login flow

## Implementation Phases
### Phase 1: Foundation
- [ ] TASK-003: Redis setup

### Phase 2: Core Features
- [ ] TASK-001: User registration
- [ ] TASK-002: Login flow
```

**During /develop** (discovered helper needed):
```markdown
## Task List (Execution Order)
- [x] TASK-003: Redis setup
- [ ] TASK-004: Validation helpers *(discovered during dev)*
- [ ] TASK-001: User registration
- [ ] TASK-002: Login flow
```

### Implementation Task Example (TASK-001 after /plan)

```markdown
# TASK-001: User Registration

**Status**: pending

## Acceptance Criteria
- [ ] Email validation with error messages
- [ ] Password meets security requirements
- [ ] Confirmation email sent

## Implementation Tasks
### 1.1.0 Setup registration form
- [ ] 1.1.1 Create form component with email/password fields
- [ ] 1.1.2 Add client-side validation rules
- [ ] 1.1.3 Show inline error messages

### 1.2.0 Create registration endpoint
- [ ] 1.2.1 Setup POST /api/auth/register route
- [ ] 1.2.2 Validate request payload
- [ ] 1.2.3 Check for existing email
- [ ] 1.2.4 Hash password with bcrypt (per resources/ADR-002)
- [ ] 1.2.5 Store user in database
- [ ] 1.2.6 Generate JWT token (per resources/ADR-001)
```

**Reference Format**: TASK-001:1.2.3 = "Check for existing email" in User Registration task

## Benefits of Epic-Driven Approach

- **Progressive task discovery** across all workflow phases
- **Stable task numbering** (discovery order, not execution order)
- **Precise implementation references** with X.Y.Z format
- **Clear project boundaries** aligned with PM tools
- **Individual tasks map directly** to tickets/stories
- **Architecture decisions documented** within epic context
- **External tool integration** via reference links
- **Maintains context** throughout development lifecycle

## Template Usage Examples

The `/design` command leverages templates from `.resources/templates/workflow/epic/`:

### Epic Creation
- `/design --epic "name"` uses `epic.template.md` to create epic overview
- Templates include placeholder replacement for project-specific content

### Task Creation
- `/design --task "name"` uses `task.template.md` to create user story with acceptance criteria
- Implementation details added later by `/plan` command

### Template Structure
- `epic/epic.template.md` - Epic overview with external references
- `epic/task.template.md` - Individual story/task files with user stories and acceptance criteria

## Advanced Workflow Patterns

### Multi-Epic Coordination
When working with dependent epics:

1. Create primary epic: `/design --epic "user-authentication"`
2. Create dependent epic: `/design --epic "user-profiles"`
3. Document dependencies in epic EPIC.md files
4. Coordinate task creation across epics

### Development Planning Integration
Using epics for development planning:

1. Epic EPIC.md provides high-level scope
2. Individual TASK files map to development work items
3. `/plan` adds technical implementation details and assignments
4. Progress tracked through epic task checklist

### External Tool Integration
Connecting to project management tools:

1. Epic EPIC.md links to JIRA epic or Linear project
2. Individual TASK files link to specific tickets
3. External references enable bidirectional navigation
4. Status sync between code and PM tools
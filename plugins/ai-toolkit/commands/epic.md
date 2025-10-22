---
version: "0.2.0"
created: "2025-10-22"
last_updated: "2025-10-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "epic", "project-management", "conversational"]
description: "Create new epics or refine existing ones through natural language conversation"
argument-hint: "[EPIC-###]"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "TodoWrite"]
model: claude-opus-4-0
---

# /epic Command

**Purpose**: Work with feature epics through natural, conversational interaction. Create new epics or refine existing ones - the command adapts to what you need.

## Usage

```bash
/epic                 # Start conversation (create new or work with existing)
/epic EPIC-001        # Work with specific epic
```

**Philosophy**: Natural language conversation on the surface, lightweight structured templates underneath to ensure completeness.

## Lightweight Epic Template

**What gets created** (used behind the scenes during conversation):

```yaml
---
epic_number: EPIC-001
status: planning
created: 2025-10-22
updated: 2025-10-22
---

# EPIC-001: User Authentication

## Description
Implement secure user authentication system supporting email/password and OAuth providers (Google, GitHub). Users can register, login, reset passwords. Security-first approach with proper session management.

## Definition of Done
All tasks checked off below. 95%+ test coverage across authentication flows. Security audit passed. Documentation complete (API docs, user guides). Successfully deployed to production with monitoring in place.

**Note**: Definition of Done is flexible - can be prose (like above) or bulleted checklist, depending on epic needs. The key is making it concrete enough to avoid scope creep.

## Dependencies
- ADR-001: Authentication architecture decision
- EPIC-002: Database schema must be complete first
- External: OAuth provider accounts configured

## Tasks
- [ ] TASK-001: User registration endpoint
- [ ] TASK-002: Login flow with session management
- [ ] TASK-003: Password reset functionality
- [ ] TASK-004: Google OAuth integration
```

**File Location**: `pm/epics/EPIC-###-name.md` (single markdown file)
**Issue Files**: `pm/issues/TASK-###-name/TASK.md` or `pm/issues/BUG-###-name/BUG.md` with `epic: EPIC-###` in frontmatter
**Template**: `pm/templates/epic.md` defines epic structure and required sections

## Command Flow

### Starting Point: Determine Intent

**No Arguments** (`/epic`):
```
Assistant: "Would you like to create a new epic or work on an existing one?"

→ User: "Create new" / "New" / "Start fresh" / "Create"
   ACTION: Enter creation flow

→ User: "Existing" / "Update" / "Work on existing" / "Refine"
   Assistant: "Which epic? Give me the EPIC-### number."
   User: "EPIC-001"
   ACTION: Find epic and enter refinement flow
```

**With Epic ID** (`/epic EPIC-001`):
- Use Glob to find `pm/epics/EPIC-001-*.md`
- If found: Load epic and enter refinement flow
- If not found: "EPIC-001 doesn't exist. Would you like to create it?"
- ACTION: Based on response, create or exit
- **Template Loading**: Read `pm/templates/epic.md` for structure requirements

##  Creation Flow

### 1. Determine Epic Number

- Scan `pm/epics/` directory for existing EPIC-###-*.md files
- Auto-assign next available number (EPIC-001, EPIC-002, etc.)
- Zero-padded to 3 digits for consistent sorting
- **Template Check**: Read `pm/templates/epic.md` to determine required sections

### 2. Conversational Information Gathering (Guided but Natural)

Invoke **project-manager agent** for collaborative epic definition:

```
Agent: "Let's create a new epic. Tell me about the feature or capability you want to build.
        What's the main goal?"

User: "We need user authentication - login, signup, password reset. Support email/password
       and Google OAuth. Security is important."

Agent: "Great! I'll call this 'User Authentication'. A few questions to structure this:

        1. Who are the primary users?"
User: "End users of our web app - individuals and enterprise users."

Agent: "Perfect. What are the key success criteria - how will we know this epic is complete?"
User: "Users can create accounts, log in securely, reset passwords, 95%+ test coverage."

Agent: "Excellent. What's explicitly OUT of scope?"
User: "No SSO, no 2FA yet, only Google OAuth (not other providers)."

Agent: "Got it! Creating EPIC-001-user-authentication..."
```

**Epic File Created**:
```
pm/epics/EPIC-001-user-authentication.md
```

**File Contents**:
- Overview and goal
- Scope (in/out)
- User stories
- Planned tasks (initially empty or high-level)
- Dependencies (references to project-level ADRs in docs/architecture/)
- Success criteria
- Timeline
- Status: planning

### 3. Optional Issue Creation

After epic created:

```
Epic EPIC-001-user-authentication created successfully!

Would you like to add initial tasks now? This will help you start development faster.
You can always add more tasks later with /epic EPIC-###.

Add initial tasks? (yes/no)
```

**If user says YES**:

Run intelligent issue creation flow:

```
Let me suggest some initial issues based on your epic scope...

Suggested issues:

1. TASK-001-user-registration (user-story)
   User can create account with email and password
   → Rationale: Core auth feature, foundation for system
   → Depends on: None (can start immediately)

2. TASK-002-database-schema (task)
   Set up users table with authentication fields
   → Rationale: Required foundation for storing user data
   → Depends on: None (can start immediately)

3. TASK-003-login-form (user-story)
   User can log in with email and password
   → Rationale: Core authentication entry point
   → Depends on: TASK-002 (database ready)

Which would you like to create? (1/2/3/custom/stop)
> 1

[Interactive issue creation...]

Issue TASK-001-user-registration created!

Would you like to create another issue? (yes/no)
> yes

[Loop continues until user says "no" or "stop"]
```

**Issue Creation Features**:
- AI suggests 2-3 logical next issues
- User can select suggestion or describe custom issue
- Auto-numbered TASK-###-name format
- Interactive loop until user stops
- Creates **complete TASK.md** with:
  - YAML frontmatter (type, status, created, updated)
  - Description section
  - Acceptance Criteria section
  - NO "Plan" section (added later by /plan command)
- Updates EPIC.md issues list

**If user says NO**:

```
Epic EPIC-001-user-authentication created!

Next steps:
- Review epic: Check pm/epics/EPIC-001-user-authentication.md
- Add issues later: /epic EPIC-001
- Start planning: /plan TASK-###
```

### 4. Summary and Next Steps

```
✅ Epic Created: EPIC-001-user-authentication

Epic Details:
- Goal: Implement secure user authentication system
- Status: planning
- Issues: 3 created (2 user stories, 1 task)
- Epic file: pm/epics/EPIC-001-user-authentication.md
- Issue locations: pm/issues/TASK-001/, pm/issues/TASK-002/, pm/issues/TASK-003/

Next Steps:
1. Review epic: Check pm/epics/EPIC-001-user-authentication.md
2. Add more tasks: /epic EPIC-001
3. Plan implementation: /plan TASK-001
4. Start development: /implement TASK-001 1.1
```

## Refinement Flow

**Objective**: Work with existing epics through natural conversation to update scope, add tasks, or review progress.

### 1. Load Epic Context

- Use Glob to find `pm/epics/EPIC-###-*.md`
- Read epic file (description, definition of done, dependencies, tasks)
- Read `pm/templates/epic.md` for structure requirements
- Scan `pm/issues/` directory for related issues (filter by `epic: EPIC-###` in frontmatter)
- Analyze: issue completion status, recent progress, gaps in coverage

### 2. Conversational Exploration

**Invoke project-manager agent** for natural dialogue:

```
Assistant: "What would you like to do with [Epic Name]?"

→ User: "Add OAuth support" or "Need to add GitHub OAuth"
   Assistant: "Should I add GitHub OAuth to the scope and create a task for it?"
   User: "Yes"
   ACTION: Update Dependencies/Description, create new TASK-###

→ User: "Update the description" or "Change the goal"
   Assistant: "What changes do you want to make?"
   User: [describes changes]
   ACTION: Edit epic file with new description

→ User: "Add some tasks" or "What tasks should I add?"
   Assistant: "Based on what's been completed, here are some suggestions..."
   [Presents 2-3 contextual suggestions]
   User: selects or describes custom tasks
   ACTION: Create new TASK-### files, update epic task list

→ User: "How's it going?" or "Show me the status"
   Assistant: [Provides conversational progress summary]
   - X of Y tasks complete (Z%)
   - Recently completed: TASK-###
   - Still needed: [analysis of gaps]
   ACTION: Informational only

→ User: "Update definition of done"
   Assistant: "What should the new definition be?"
   User: [provides new criteria]
   ACTION: Edit epic file Definition of Done section
```

### 3. Proactive Suggestions (Light Guidance)

When appropriate, assistant offers suggestions:
- "I see you've completed 3 tasks since last time. Based on that, you might want to add: [suggestions]"
- "The description mentions mobile support but I don't see any mobile tasks yet. Want to add those?"
- "Dependencies list ADR-001 but it doesn't exist in docs/architecture/ yet. Should we create it or update the dependency?"

### 4. Multiple Actions in One Session

- User can make multiple changes in conversation
- After each action, assistant confirms and asks "Anything else?"
- Session continues until user says "done" / "that's it" / "exit"

### 5. Behind-the-Scenes Updates

When updating epics:
- Use Edit tool to modify specific sections
- Maintain template structure from `pm/templates/epic.md` (name, description, definition of done, dependencies, tasks)
- Update frontmatter `updated` date
- Keep task list in chronological order
- When adding issues: Use Glob to find next TASK-###/BUG-###, create in `pm/issues/`, update epic file

##  Epic Naming Convention

**Format**: `EPIC-###-<kebab-case-name>.md`

**Examples**:
```
pm/epics/EPIC-001-user-authentication.md
pm/epics/EPIC-002-content-management.md
pm/epics/EPIC-003-analytics-dashboard.md
```

**Name Assignment**:
- Agent asks for or extracts epic name from description
- Converts to kebab-case (lowercase with hyphens)
- Examples: "User Authentication" → `user-authentication`
- Combined: `EPIC-001-user-authentication.md`

## Issue Naming Convention (when created)

**Format**: `[TYPE]-###-<kebab-case-name>/`

**Examples**:
```
pm/issues/TASK-001-user-registration/
pm/issues/TASK-002-database-schema/
pm/issues/BUG-001-login-validation/
pm/issues/TASK-003-content-editor/
```

**Auto-numbering** (Globally Sequential per Type):
- Scans `pm/issues/` directory for all existing [TYPE]-###-* folders
- Assigns next available number **globally** for each type (not per-epic)
- TASK sequence: TASK-001, TASK-002, TASK-003...
- BUG sequence: BUG-001, BUG-002, BUG-003...
- Example: EPIC-001 creates TASK-001, TASK-002, BUG-001, then EPIC-002 creates TASK-003

## Integration with Workflow

**Position**: Foundation of epic-driven development

```
/project-brief → /epic (create) → /plan TASK-### → /implement TASK-### PHASE
                      ↓
                 /epic EPIC-### (refine iteratively)
```

**Workflow Relationships**:

- **After /project-brief**: Break down project vision into epics
- **Before /plan**: Define what to build before planning how
- **Iterative refinement**: Use `/epic EPIC-###` to update and add tasks
- **Starts cycle**: Epic is entry point for development work

## Epic Lifecycle

1. **Create** with `/epic` - Initial definition + optional tasks (status: planning)
2. **Refine** with `/epic EPIC-###` - Add tasks, update scope (status: planning → active)
3. **Plan** with `/plan TASK-###` - Add implementation details to individual tasks
4. **Implement** with `/implement TASK-### PHASE` - Execute specific phases
5. **Refine again** with `/epic EPIC-###` - Add more tasks based on learnings (status: active)
6. **Complete** - All tasks done (status: completed)

## Implementation Details

### File Locations

**Epic Created**:
- `pm/epics/EPIC-###-name.md` (single markdown file following template from `pm/templates/epic.md`)

**Issues Created** (if user adds them):
- `pm/issues/TASK-###-name/TASK.md` (follows `pm/templates/task.md`)
- `pm/issues/BUG-###-name/BUG.md` (follows `pm/templates/bug.md`)
- `pm/issues/[TYPE]-###-name/resources/` (optional - for issue-specific scripts, attachments)

**ADRs and Architecture** (referenced from epic):
- `docs/architecture/ADR-###-name.md` (project-level documentation)

### Agent Invocation

**Epic Creation Phase**:
```
Task: "Create new epic EPIC-###.

FIRST: Read pm/templates/epic.md to understand required sections and structure.

Conduct conversational (guided but natural) dialogue with user to gather sections defined in template:
- Epic name (extract from conversation or ask)
- Description (what is this epic about)
- Definition of Done (concrete criteria to avoid scope creep - can be prose or bulleted list)
- Dependencies (what this epic depends on - ADRs, other epics, external factors)

User describes epic in their own words. Ask clarifying questions naturally based on template prompts.
Extract or ask for epic name. Convert to kebab-case.

Structure information following pm/templates/epic.md format:
- Name (in heading)
- Description (prose paragraph)
- Definition of Done (flexible format - prose or bullets as appropriate)
- Dependencies (bulleted list, reference ADRs from docs/architecture/)
- Tasks (initially empty bulleted checkbox list)

Create single file: pm/epics/EPIC-###-<name>.md with minimal YAML frontmatter (epic_number, status, created, updated)

Note: ADRs should be created in docs/architecture/ and referenced from epic file."
```

**Issue Creation Phase** (if user opts in):
```
Task: "Add initial issues for EPIC-###-name.

Analyze epic scope and goals. Suggest 2-3 foundational issues to start development.
Consider:
- Core user stories from epic description
- Technical foundations needed
- Logical starting points
- Dependencies between issues

Present suggestions with rationale. Let user select or describe custom issue.

For each issue created:
1. Determine next issue number (GLOBAL SCAN per type):
   - Use Glob: 'pm/issues/TASK-*/' to scan ALL existing tasks
   - Use Glob: 'pm/issues/BUG-*/' to scan ALL existing bugs
   - Extract numbers per type, find max, increment by 1
   - Creates globally sequential IDs per type across all epics
2. Read appropriate template (pm/templates/task.md or pm/templates/bug.md)
3. Gather details based on template structure (name, description, acceptance criteria, etc.)
4. Create issue directory: pm/issues/TASK-###-name/ or pm/issues/BUG-###-name/
5. Generate complete TASK.md or BUG.md following template with:
   - YAML frontmatter:
     - epic: EPIC-### (references parent epic)
     - type: user-story | task
     - status: todo
     - created, updated dates
   - ## Description section with detailed task description
     - For user-story: suggest 'As a [user], I want [feature], So that [benefit]' format
   - ## Acceptance Criteria section with SMART DEFAULTS (user can edit):
     - DEFAULT FIRST ITEM: '- [ ] All features covered by tests (aim for 95%+ coverage)'
     - DEFAULT SECOND ITEM: '- [ ] Tests verify behavior, not just execute code'
     - Then task-specific criteria based on user input
     - Add helpful comment at bottom:
       <!-- Acceptance Criteria Formats (choose what works for your team):
       - Simple: '- [ ] User can register with email'
       - BDD: '- [ ] Given valid email, When user submits, Then account created'
       - Testable: '- [ ] Should validate email format before submission' -->
   - DO NOT create 'Plan' section (that's for /plan command)
6. Create optional resources/ subdirectory (for issue-specific scripts/attachments if needed)
7. Update epic file (pm/epics/EPIC-###-name.md) issues list (maintain numerical order)
8. Ask: 'Create another issue? (yes/no)'

Continue until user stops."
```

### Command Logic Flow

```markdown
1. Read pm/templates/epic.md to understand structure requirements

2. Scan pm/epics/ for existing EPIC-###-*.md files
   - Determine next EPIC-### number

3. Invoke project-manager agent: Epic Creation
   - Agent reads template for required sections and prompts
   - Agent conducts free-form conversation following template guidance
   - Agent gathers epic details
   - Agent extracts/asks for epic name
   - Agent converts to kebab-case

4. Create epic file:
   - Create pm/epics/EPIC-###-<name>.md (single file)
   - Generate content with all sections from template
   - Include reference format for ADRs (docs/architecture/)
   - Set status: planning

5. Ask: "Add initial issues? (yes/no)"

6. IF yes:
   a. Invoke project-manager agent: Issue Creation
   b. Agent analyzes epic scope
   c. BEGIN ISSUE LOOP:
      i. Agent suggests 2-3 next issues
      ii. User selects or enters "custom" or "stop"
      iii. IF stop: break loop
      iv. Determine next issue number (GLOBAL SCAN per type: pm/issues/TASK-*/, pm/issues/BUG-*/)
      v. Read appropriate template (pm/templates/task.md or pm/templates/bug.md)
      vi. Agent gathers issue details based on template
      vii. Create pm/issues/[TYPE]-###-name/ directory
      viii. Generate [TYPE].md with epic: EPIC-### in frontmatter following template
      ix. Optionally create resources/ subdirectory
      x. Update epic file (pm/epics/EPIC-###-name.md) issues list
      xi. Ask: "Create another? (yes/no)"
      xii. IF no: break loop
   d. END LOOP

7. Display summary:
   - Epic number and name
   - Epic file location
   - Epic status
   - Issues created (count, types, locations in pm/issues/)
   - Next steps

8. Exit
```

## Success Criteria

**Effective Epic Creation**:
- ✅ Clear, specific epic goal (one sentence)
- ✅ Well-defined scope boundaries (in/out of scope)
- ✅ Measurable success criteria
- ✅ Realistic timeline
- ✅ Dependencies documented (if any)
- ✅ Optional issues provide starting point

**Quality Indicators**:
- Team understands what epic delivers
- Scope is focused (one major capability)
- Success is measurable
- Initial issues (if created) align with epic goals
- Ready for `/plan` and `/develop` workflow

## Examples

### Example 1: Epic with Initial Tasks

```bash
/epic
```

**Interaction**:
```
Creating new epic (EPIC-001)...

Tell me about the feature you want to build. What's the main goal?
> User authentication system - login, signup, password reset, Google OAuth

Perfect! I'll call this "User Authentication". Who are the primary users?
> End users of our web application

What are the key success criteria?
> Users can create accounts, log in securely, reset passwords, 95%+ test coverage

What's explicitly OUT of scope for this epic?
> No SSO, no 2FA, only Google OAuth

Creating EPIC-001-user-authentication...

Epic created! Would you like to add initial issues? (yes/no)
> yes

Suggesting initial issues based on epic scope...

1. TASK-001-user-registration (user-story)
2. TASK-002-database-schema (task)
3. TASK-003-login-form (user-story)

Which would you like to create? (1/2/3/custom/stop)
> 1

[Creates TASK-001]

Created TASK-001-user-registration!
Create another? (yes/no)
> yes

[Suggests next issues, loop continues]
```

**Result**:
- Epic created: EPIC-001-user-authentication
- 3 tasks created
- Ready for `/plan TASK-001`

### Example 2: Epic Without Issues (Add Later)

```bash
/epic
```

**Interaction**:
```
Creating new epic (EPIC-002)...

[Epic creation conversation...]

Epic EPIC-002-content-management created!

Would you like to add initial issues? (yes/no)
> no

Epic created successfully!

Next steps:
- Add tasks: /epic EPIC-002
- Review progress: /epic EPIC-002
```

**Result**:
- Epic created without tasks
- Can add tasks later with `/epic EPIC-002`

## Tips for Effective Epic Creation

**During Epic Definition**:
- Start with clear goal statement
- Be specific about scope boundaries
- Think user outcomes, not technical implementation
- Include measurable success criteria
- Keep epic focused (one major capability)

**Deciding on Initial Issues**:
- **Add issues now** if:
  - You know the foundational work needed
  - You want to start development soon
  - Epic scope is clear

- **Add issues later** if:
  - Epic needs architectural decisions first
  - Scope may change after review
  - You prefer to plan iteratively

**Task Creation Best Practices**:
- Start with 2-4 foundational tasks
- Include mix of user stories and implementation tasks
- Focus on core features first
- Can add more with `/epic EPIC-###` later

## Common Use Cases

### Feature Decomposition

```bash
# After project brief
/project-brief

# Create epics for major features
/epic  # EPIC-001-user-authentication
/epic  # EPIC-002-content-management
/epic  # EPIC-003-analytics-dashboard
```

### Quick Start Development

```bash
/epic
# Add 2-3 initial tasks

/plan TASK-001
/implement TASK-001 1.1
# Start building immediately!
```

### Exploratory Epic

```bash
/epic
# Skip initial tasks

/architect
# Make technical decisions first

/epic EPIC-001
# Add tasks after architecture clear
```

## Related Commands

- **`/project-brief`**: Define project vision before creating epics
- **`/epic EPIC-###`**: Work with existing epic (update scope, add tasks, review progress)
- **`/plan TASK-###`**: Add "Plan" section with phase-based breakdown to individual tasks
- **`/implement TASK-### PHASE`**: Execute specific implementation phases
- **`/status`**: Check progress across all epics

## Tools

- **Read**: Access project context and existing epics
- **Write**: Create epic and issue files
- **Glob**: Scan for existing epics and issues (numbering)
- **Grep**: Search epic and project content
- **Task**: Invoke project-manager agent for orchestration
- **TodoWrite**: Track progress during epic creation

---

**Next Steps**: After creating an epic, use `/epic EPIC-###` to add more tasks or `/plan TASK-###` to start implementation planning.

## Notes on Template-Driven Structure

**Epic Files**: Simple markdown files in `pm/epics/` directory following `pm/templates/epic.md` structure
**Issue Directories**: All issues in flat `pm/issues/` directory with globally unique IDs per type
**Templates**: `pm/templates/` defines structure for epics, tasks, bugs, and custom issue types
**ADR References**: Project-level ADRs in `docs/architecture/`, linked from epic files
**Issue Resources**: Optional `resources/` subdirectory per issue for scripts and attachments
**System Guide**: `pm/README.md` explains the project management system and workflow

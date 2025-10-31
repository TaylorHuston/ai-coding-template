---
version: "1.0.0"
created: "2025-10-22"
last_updated: "2025-10-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "epic", "project-management", "conversational"]
description: "Create new epics or refine existing ones through natural language conversation"
argument-hint: "[EPIC-###]"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "TodoWrite"]
model: claude-opus-4-1
---

# /epic Command

Work with feature epics through natural, conversational interaction. Create new epics or refine existing ones - the command adapts to what you need.

**Philosophy**: Natural language conversation on the surface, lightweight structured templates underneath to ensure completeness.

## Usage

```bash
/epic                 # Start conversation (create new or work with existing)
/epic EPIC-###        # Work with specific epic
```

## Template System

The command reads `pm/templates/epic.md` to understand required structure:
- Epic name, description, definition of done, dependencies, tasks
- YAML frontmatter configuration
- Section-specific prompts and requirements

**Epic Location**: `pm/epics/EPIC-###-<kebab-case-name>.md` (sequential numbering)
**Issue Location**: `pm/issues/TASK-###-<name>/` and `pm/issues/BUG-###-<name>/`

**See `pm/README.md`** for epic patterns, best practices, file organization, and ID numbering.

## Operations

### Create Epic

1. Determine next EPIC-### number (scan `pm/epics/`)
2. Read `pm/templates/epic.md` for required sections
3. Conversational Q&A to gather epic details
4. Create `pm/epics/EPIC-###-<name>.md`
5. Optionally add initial tasks (interactive loop)

### Refine Epic

1. Find epic file (Glob `pm/epics/EPIC-###-*.md`)
2. Read epic content and related issues
3. Conversational interaction to update scope, add tasks, review progress
4. Update epic file as needed

## Example Conversation

```
User: /epic

AI: Would you like to create a new epic or work on an existing one?

User: Create new

AI: [Reads pm/templates/epic.md for structure]

Let's create a new epic. Tell me about the feature or capability you want to build.
What's the main goal?

User: User authentication - login, signup, password reset, Google OAuth

AI: Great! I'll call this "User Authentication". Who are the primary users?

User: End users of our web app

AI: What are the key success criteria?

User: Users can create accounts, log in securely, reset passwords, 95%+ test coverage

AI: What's explicitly OUT of scope for this epic?

User: No SSO, no 2FA yet, only Google OAuth

AI: Creating EPIC-001-user-authentication...

✓ Epic created!

Would you like to add initial tasks? (yes/no)

User: yes

AI: Suggesting initial tasks based on epic scope...

1. TASK-001-user-registration (user-story)
2. TASK-002-database-schema (task)
3. TASK-003-login-form (user-story)

Which would you like to create? (1/2/3/custom/stop)

[Interactive loop continues until user says stop]

✓ Epic EPIC-001-user-authentication created
✓ 3 tasks created (TASK-001, TASK-002, TASK-003)

Next steps:
- Review epic: pm/epics/EPIC-001-user-authentication.md
- Plan implementation: /plan TASK-001
- Start development: /implement TASK-001 1.1
```

## Agent Coordination

**Primary**: `project-manager` - Leads conversation and creates epic/tasks

Invokes during issue creation:
- `test-engineer` - For test strategy
- Domain specialists - For complexity assessment

## Command Instructions

When this command is invoked, execute:

```
Task: "Create or refine epic through natural conversation.

**DETERMINE INTENT**:
- No arguments: Ask "Create new or work on existing?"
- EPIC-### provided: Find and load epic, enter refinement mode
- If not found: Offer to create with that number

**TEMPLATE AND CONTEXT**:
1. Read pm/templates/epic.md for required sections and structure
2. Read pm/README.md for epic patterns and best practices
3. Scan pm/epics/ for existing epics (determine next number)
4. If refining: Read epic file and scan pm/issues/ for related tasks

**CREATION FLOW**:
1. Determine next EPIC-### number
2. Conduct natural conversation following template guidance:
   - Epic name (extract from conversation or ask)
   - Description (what is this epic about)
   - Definition of Done (concrete criteria - prose or bullets as appropriate)
   - Dependencies (ADRs from docs/project/adrs/, other epics, external factors)
3. Extract or ask for epic name, convert to kebab-case
4. Create pm/epics/EPIC-###-<name>.md with:
   - YAML frontmatter (epic_number, status: planning, created, updated)
   - All sections from template
   - Tasks section (initially empty checkbox list)
5. Ask: "Add initial tasks? (yes/no)"
6. IF yes: Enter issue creation loop (see below)

**REFINEMENT FLOW**:
1. Read epic file and related issues
2. Ask: "What would you like to do?"
   - Add tasks → Enter issue creation loop
   - Update description/scope → Edit epic file
   - Update definition of done → Edit epic file
   - Show status → Display progress summary
   - Continue conversation until user says "done"

**ISSUE CREATION LOOP** (if user opts in):
1. Analyze epic scope and suggest 2-3 foundational tasks
2. Present suggestions with rationale
3. User selects or describes custom task
4. For each task:
   - Determine next TASK-### or BUG-### (GLOBAL scan: pm/issues/TASK-*/, pm/issues/BUG-*/)
   - Read appropriate template (pm/templates/task.md or pm/templates/bug.md)
   - Gather details based on template
   - Create pm/issues/[TYPE]-###-<name>/ directory
   - Generate [TYPE].md following template with:
     * YAML frontmatter (epic: EPIC-###, type, status: todo, created, updated)
     * Description section
     * Acceptance Criteria section (with smart defaults from template)
     * NO Plan section (added later by /plan)
   - Update epic file task list
5. Ask: "Create another? (yes/no)"
6. Loop until user stops

**EPIC FILE FORMAT**:
```yaml
---
epic_number: EPIC-###
status: planning
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# EPIC-###: Name

## Description
[Epic goal and scope]

## Definition of Done
[Concrete criteria - prose or checklist]

## Dependencies
- ADR-###: [Decision name]
- EPIC-###: [Other epic dependency]
- External: [External dependencies]

## Tasks
- [ ] TASK-###: [Task name]
- [ ] TASK-###: [Task name]
```

**NAMING CONVENTIONS**:
- Epic files: EPIC-###-<kebab-case-name>.md
- Issue directories: [TYPE]-###-<kebab-case-name>/
- Sequential numbering per type across entire project (not per-epic)

See pm/README.md for complete patterns and best practices."
```

## Integration with Workflow

```
/project-brief → /epic (create) → /plan TASK-### → /implement TASK-### PHASE
                      ↓
                 /epic EPIC-### (refine iteratively)
```

**Workflow Relationships**:
- After `/project-brief` - Break down project vision into epics
- Before `/plan` - Define what to build before planning how
- Iterative refinement - Use `/epic EPIC-###` to update and add tasks
- Starts cycle - Epic is entry point for development work

## Related Commands

- `/project-brief` - Define project vision before creating epics
- `/epic EPIC-###` - Refine existing epic (add tasks, update scope)
- `/plan TASK-###` - Add implementation breakdown to tasks
- `/implement TASK-### PHASE` - Execute specific phases
- `/project-status` - Check progress across all epics

## Related Guidelines

- `pm/README.md` - **Source of truth** for epic patterns, best practices, file organization
- `pm/templates/epic.md` - Epic structure and requirements
- `pm/templates/task.md` - Task structure and requirements
- `pm/templates/bug.md` - Bug structure and requirements

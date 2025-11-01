---
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

## Jira Integration

**Dual Mode Support**: This command adapts based on Jira configuration.

### Configuration Check

**Read CLAUDE.md at start:**
```yaml
## Jira Integration
- **Enabled**: true/false
- **Project Key**: PROJ
```

### Local Mode (Jira Disabled - Default)

**Current behavior unchanged**:
- Creates `pm/epics/EPIC-001-name.md` files
- Issues: TASK-001, BUG-001 directories
- Fully offline, no external dependencies

### Jira Mode (Jira Enabled)

**When `jira.enabled: true`:**
- **Epics**: Created in Jira ONLY (PROJ-100, PROJ-200)
- **No local epic files**: `pm/epics/` remains empty (or just .gitkeep)
- **Issues**: Can be Jira (PROJ-123) or local exploration (TASK-001)
- **Resources**: Create `pm/issues/PROJ-100/` if epic needs local resources

### Jira Epic Creation Flow

**When creating epic with Jira enabled:**

1. **Check MCP availability**:
   - Look for Atlassian MCP tools (`mcp__atlassian__*`)
   - If unavailable: Error with setup instructions

2. **Discover required fields** (first time):
   - Check for cache: `.ai-toolkit/jira-field-cache.json`
   - If no cache: Fetch field metadata from Jira
   - Parse required fields + allowed values
   - Cache for future use (7 day TTL)

3. **Conversational field collection**:
   - Standard fields: Summary, Description
   - Custom required fields: Prompt with field name + allowed values
   - Example: "Your Jira requires 'Team' field. Which team? (Frontend/Backend/DevOps)"

4. **Create epic in Jira**:
   - Use Atlassian MCP to create epic
   - Get returned epic ID: PROJ-100
   - Display success with Jira URL

5. **Optional issue creation**:
   - Ask: "Create initial issues?"
   - If yes: Create issues in Jira (PROJ-101, PROJ-102, ...)
   - Use same field discovery for issues

6. **Local directory** (optional):
   - Create `pm/issues/PROJ-100/` if user needs resources directory
   - No epic file created

### Field Discovery & Caching

**Cache structure** (`.ai-toolkit/jira-field-cache.json`):
```json
{
  "last_updated": "2025-10-31T14:30:00Z",
  "project_key": "PROJ",
  "issue_types": {
    "epic": {
      "fields": {
        "summary": {"required": true, "type": "string"},
        "description": {"required": false, "type": "string"},
        "customfield_10011": {
          "required": true,
          "type": "string",
          "name": "Epic Name"
        },
        "customfield_10020": {
          "required": true,
          "type": "option",
          "name": "Team",
          "allowedValues": ["Frontend", "Backend", "DevOps"]
        }
      }
    }
  }
}
```

**Cache management**:
- Auto-created on first epic/issue creation
- 7 day TTL (configurable)
- Refresh on creation failure
- Manual refresh: `/refresh-schema`

### Jira Example Flow

```
User: /epic

AI: [Checks CLAUDE.md → jira.enabled: true]
    [Checks cache → not found, discovers fields]

    Discovering Jira field requirements...
    ✓ Cached field schema

    Let's create an epic. What's the main goal?

User: User authentication system

AI: Great! I'll call this "User Authentication System".

    Your Jira requires these fields:
    - Summary: "User Authentication System" ✓
    - Description: Tell me about the scope...

User: Login, registration, password reset, OAuth

AI: Perfect. Your Jira also requires:
    - Epic Name: What short name? (shows in Jira UI)

User: user-auth

AI: Got it. And which team owns this?
    Options: Frontend, Backend, DevOps

User: Backend

AI: Creating epic in Jira...
    ✓ Created PROJ-100: User Authentication System
    🔗 https://company.atlassian.net/browse/PROJ-100

    Create initial issues? (yes/no)

User: yes

AI: Suggesting initial issues:
    1. User Registration (Story)
    2. Login Flow (Story)
    3. Password Reset (Story)

    Create these? (yes/all/custom/no)

User: all

AI: Creating issues in Jira...
    ✓ PROJ-101: User Registration
    ✓ PROJ-102: Login Flow
    ✓ PROJ-103: Password Reset

    Epic complete! Next steps:
    - View in Jira: https://company.atlassian.net/browse/PROJ-100
    - Plan implementation: /plan PROJ-101
```

### Error Handling

**MCP unavailable**:
```
Error: Jira integration enabled but Atlassian MCP not configured.

Setup steps:
1. Install Atlassian Remote MCP Server
2. Configure in Claude Code MCP settings
3. Restart Claude Code

Or: Set jira.enabled: false in CLAUDE.md to work locally
```

**Field discovery fails**:
```
Warning: Could not discover Jira fields. Using standard fields only.

If epic creation fails, run: /refresh-schema
```

**Epic creation fails**:
```
Error: Failed to create epic in Jira.
Reason: Field 'customfield_12345' is required

This usually means:
1. Jira admin added new required fields
2. Field cache is stale

Fix: Run /refresh-schema and try again
```

### Updated Command Instructions

**Add to CREATION FLOW** (step 0 before current step 1):

```
0. **Check Jira mode**:
   - Read CLAUDE.md jira.enabled
   - IF false: Follow local flow (current behavior)
   - IF true: Follow Jira flow (below)

**JIRA CREATION FLOW** (when jira.enabled: true):
1. Validate MCP: Check for Atlassian MCP tools
2. Load/discover fields:
   - Check cache: .ai-toolkit/jira-field-cache.json
   - If missing: Fetch from Jira, cache locally
3. Conversational collection:
   - Standard: Summary, Description
   - Custom required: Prompt with field name + options
4. Create in Jira:
   - Use MCP to create epic
   - Get epic ID (PROJ-100)
   - Display Jira URL
5. Ask: "Create initial issues?"
6. IF yes:
   - Suggest issues based on epic scope
   - Create in Jira (PROJ-101, PROJ-102, ...)
   - Display URLs
7. Optional: Create pm/issues/PROJ-100/ for resources
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

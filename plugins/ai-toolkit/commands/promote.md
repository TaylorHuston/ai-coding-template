---
tags: ["jira", "integration", "promote", "workflow"]
description: "Promote local exploration issue to Jira for team visibility"
argument-hint: "TASK-### | BUG-###"
allowed-tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]
model: claude-sonnet-4-5
---

# /promote Command

Promote a local exploration issue to Jira for team collaboration and visibility.

## Purpose

Convert a local issue (TASK-###, BUG-###) into a Jira issue when:
- Prototype validated and ready for production
- Exploration complete, now needs team collaboration
- Want to track work in Jira for stakeholder visibility
- Need to coordinate with other team members

## Usage

```bash
/promote TASK-001    # Promote local task to Jira
/promote BUG-003     # Promote local bug to Jira
```

## Requirements

- **Jira integration enabled** in CLAUDE.md
- **Atlassian Remote MCP** configured
- **Local issue must exist** with TASK.md or BUG.md
- **Field cache available** (auto-discovered on first use)

## What It Does

1. **Reads local issue**:
   - Loads TASK.md or BUG.md
   - Extracts: description, acceptance criteria
   - Reads PLAN.md (if exists)
   - Reads WORKLOG.md (if exists)

2. **Discovers Jira fields** (if needed):
   - Checks cache: `.ai-toolkit/jira-field-cache.json`
   - If missing: Fetches field requirements from Jira
   - Prompts for custom required fields

3. **Creates issue in Jira**:
   - Uses Atlassian MCP
   - Maps local fields to Jira fields
   - Returns Jira issue key (PROJ-123)

4. **Migrates local artifacts**:
   - Creates `pm/issues/PROJ-123-{name}/`
   - Copies PLAN.md, WORKLOG.md, RESEARCH.md
   - Adds promotion note to WORKLOG.md

5. **Cleanup**:
   - Optionally deletes original TASK-###/ directory
   - Updates git branch (feature/TASK-001 → feature/PROJ-123)

## Workflow Example

```bash
# Developer prototyped auth approach locally
/plan TASK-001
/implement TASK-001 1.1
/implement TASK-001 1.2

# Prototype validated, ready for production
/promote TASK-001

AI: Promoting TASK-001 to Jira...

    Reading local issue...
    ✓ TASK-001: OAuth Implementation Spike

    Description: Explored OAuth 2.0 integration...
    Acceptance Criteria: [from TASK.md]

    Checking Jira field requirements...
    ✓ Loaded cached schema

    Your Jira requires these fields:
    - Summary: "OAuth Implementation Spike" ✓
    - Issue Type: Story / Task / Bug? (Story)

User: Story

AI: - Team: Which team owns this?
    Options: Frontend, Backend, DevOps

User: Backend

AI: Creating issue in Jira...
    ✓ Created PROJ-456: OAuth Implementation Spike
    🔗 https://company.atlassian.net/browse/PROJ-456

    Migrating local artifacts...
    ✓ Created pm/issues/PROJ-456-oauth-implementation/
    ✓ Copied PLAN.md (3 phases)
    ✓ Copied WORKLOG.md (4 entries)
    ✓ Added promotion note to WORKLOG

    Delete original TASK-001 directory? (yes/no)

User: yes

AI: ✓ Deleted pm/issues/TASK-001-oauth-spike/

    Updating git branch...
    Current: feature/TASK-001
    ✓ Renamed to feature/PROJ-456

    Promotion complete!
    - Jira: https://company.atlassian.net/browse/PROJ-456
    - Local: pm/issues/PROJ-456-oauth-implementation/
    - Branch: feature/PROJ-456

    Next: /implement PROJ-456 2.1
```

## Command Behavior

### Prerequisites Check

1. **Validate Jira enabled**:
   - Read CLAUDE.md
   - If `jira.enabled: false`: Error "Jira not enabled"

2. **Validate MCP**:
   - Check for Atlassian MCP tools
   - If unavailable: Error with setup instructions

3. **Validate local issue exists**:
   - Find `pm/issues/TASK-###-*/` or `pm/issues/BUG-###-*/`
   - Must have TASK.md or BUG.md
   - If not found: Error with available issues

### Field Discovery & Collection

**Same process as `/epic` command:**

1. **Check cache**:
   - Load `.ai-toolkit/jira-field-cache.json`
   - If missing or stale: Fetch from Jira

2. **Determine issue type**:
   - TASK-### → Story or Task (ask user)
   - BUG-### → Bug (automatic)

3. **Collect required fields conversationally**:
   - Summary: From TASK.md title
   - Description: From TASK.md description
   - Custom required fields: Prompt user

### Create in Jira

**Use Atlassian MCP:**
- Create issue with all collected fields
- Get returned issue key (PROJ-456)
- Display Jira URL

### Migrate Artifacts

**Copy local work to Jira issue directory:**

1. **Create new directory**:
   - `pm/issues/PROJ-456-{name}/`

2. **Copy files**:
   - PLAN.md (if exists)
   - WORKLOG.md (if exists)
   - RESEARCH.md (if exists)
   - resources/ (if exists)

3. **Add promotion note to WORKLOG**:
   ```markdown
   ## 2025-10-31 14:30 - system

   Promoted from TASK-001 to PROJ-456.

   Original work preserved. Issue now tracked in Jira.

   Jira: https://company.atlassian.net/browse/PROJ-456
   ```

### Cleanup & Branch Update

**Optionally remove original:**

1. **Ask user**: "Delete original TASK-001 directory? (yes/no)"
2. **If yes**: Delete `pm/issues/TASK-001-*/`
3. **If no**: Keep for reference

**Update git branch (if on feature/TASK-001)**:

1. **Check current branch**: `git branch --show-current`
2. **If matches TASK-001**:
   - Rename: `git branch -m feature/TASK-001 feature/PROJ-456`
   - Inform user of new branch name

## Error Handling

### Jira Not Enabled
```
Error: Jira integration not enabled.

To promote to Jira, enable integration in CLAUDE.md:
## Jira Integration
- **Enabled**: true
- **Project Key**: PROJ

Or continue working locally with TASK-001
```

### Local Issue Not Found
```
Error: TASK-001 not found.

Available local issues:
- TASK-002: Session management
- BUG-001: Login timeout

Usage: /promote TASK-002
```

### Jira Creation Fails
```
Error: Failed to create issue in Jira.
Reason: Field 'customfield_10099' is required

This usually means:
1. Jira admin added new required fields
2. Field cache is stale

Fix: /refresh-schema and try again

Local issue preserved at: pm/issues/TASK-001-oauth-spike/
```

### MCP Unavailable
```
Error: Atlassian Remote MCP not configured.

Cannot create Jira issue without MCP.

Setup:
1. Install Atlassian Remote MCP Server
2. Configure in Claude Code MCP settings
3. Run: /promote TASK-001 again

Local issue preserved at: pm/issues/TASK-001-oauth-spike/
```

## Field Mapping

**Local → Jira mapping:**

| Local (TASK.md) | Jira Field |
|----------------|-----------|
| Title | Summary |
| Description | Description |
| Acceptance Criteria | Append to Description or custom field |
| Type (TASK/BUG) | Issue Type (Story/Task/Bug) |
| Epic (frontmatter) | Epic Link (if provided) |
| Status | Always "To Do" (new issue) |

**Custom fields:**
- Prompted conversationally based on cached schema
- Example: Team, Priority, Sprint, etc.

## Integration with Workflow

**Typical flow:**

```
Local Exploration → Validation → Promotion → Team Collaboration

/plan TASK-001
/implement TASK-001 1.1
/implement TASK-001 1.2
/implement TASK-001 1.3
# Validated: This works!

/promote TASK-001
# → PROJ-456 created in Jira

/plan PROJ-456  # Continue with Jira issue
/implement PROJ-456 2.1
```

**When to promote:**
- ✅ Prototype validated and working
- ✅ Ready for production implementation
- ✅ Needs team collaboration
- ✅ Stakeholders want visibility

**When NOT to promote:**
- ❌ Still exploring/experimenting
- ❌ Throwaway spike
- ❌ Personal learning project
- ❌ Already complete (just keep local)

## Implementation Notes

When implementing `/promote TASK-###`:

1. **Validate prerequisites**:
   - Check Jira enabled in CLAUDE.md
   - Check Atlassian MCP available
   - Verify local issue exists

2. **Load local issue**:
   - Read TASK.md or BUG.md
   - Parse: title, description, acceptance criteria
   - Load: PLAN.md, WORKLOG.md, RESEARCH.md (if exist)

3. **Discover/load Jira fields**:
   - Check cache: `.ai-toolkit/jira-field-cache.json`
   - If missing: Fetch and cache
   - Determine required fields for issue type

4. **Collect fields conversationally**:
   - Map local data to Jira fields
   - Prompt for custom required fields
   - Validate all required fields collected

5. **Create in Jira**:
   - Use Atlassian MCP to create issue
   - Get issue key (PROJ-456)
   - Display success with URL

6. **Migrate artifacts**:
   - Create `pm/issues/PROJ-456-{name}/`
   - Copy PLAN.md, WORKLOG.md, RESEARCH.md, resources/
   - Add promotion note to WORKLOG

7. **Cleanup**:
   - Ask: Delete original directory?
   - Update git branch if on feature/TASK-001
   - Confirm completion with next steps

## Related Commands

- `/import-issue PROJ-123` - Opposite direction (Jira → local)
- `/plan TASK-001` - Work locally before promoting
- `/refresh-schema` - Update field cache if promotion fails
- `/epic` - Create epic in Jira directly (no promotion needed)

## Notes

- **Preserves work** - Copies all artifacts, doesn't lose progress
- **Optional cleanup** - User chooses whether to keep original
- **Branch aware** - Updates git branch automatically
- **Field discovery** - Same mechanism as `/epic` command
- **Idempotent** - Safe to retry if creation fails

---
tags: ["jira", "integration", "import", "workflow"]
description: "Import Jira issue for local work with PLAN.md creation"
argument-hint: "PROJ-###"
allowed-tools: ["Read", "Write", "Bash", "Grep", "Glob"]
model: claude-sonnet-4-5
---

# /import-issue Command

Import a Jira issue into local project structure for AI-assisted implementation.

## Purpose

Pull a Jira issue (created by PM or stakeholders) into the local repository to:
- Create local directory for implementation artifacts
- Display issue requirements from Jira
- Enable `/plan` and `/implement` workflows

**This is NOT required** - `/plan PROJ-123` will auto-import if needed. Use `/import-issue` when you want to:
- Preview issue details before planning
- Verify issue exists and you have access
- Explicitly pull issue into local structure

## Usage

```bash
/import-issue PROJ-123    # Import specific Jira issue
```

## Requirements

- **Jira integration enabled** in CLAUDE.md
- **Atlassian Remote MCP** configured
- **Issue must exist** in Jira and be accessible

## What It Does

1. **Fetches issue from Jira**:
   - Issue key, summary, description
   - Acceptance criteria (if present)
   - Issue type, status, epic link
   - Reporter, assignee

2. **Creates local directory**:
   - `pm/issues/PROJ-123-{kebab-case-summary}/`
   - No TASK.md created (Jira is source of truth)

3. **Displays issue details**:
   - Shows all fetched information
   - Provides Jira URL
   - Suggests next steps

4. **Ready for work**:
   - `/plan PROJ-123` - Create implementation plan
   - `/implement PROJ-123 1.1` - Start work

## Workflow Example

```bash
# PM creates PROJ-456 in Jira
# Dev imports it

/import-issue PROJ-456

AI: Fetching PROJ-456 from Jira...

    ✓ Found: API Rate Limiting Implementation

    Type: Story
    Status: To Do
    Epic: PROJ-400 (API Infrastructure)
    Reporter: Sarah Chen

    Description:
    Implement rate limiting for REST API to prevent abuse.
    - 100 requests per minute per user
    - 1000 requests per minute per IP
    - Return 429 Too Many Requests with Retry-After header

    Acceptance Criteria:
    - [ ] Rate limiting middleware implemented
    - [ ] Redis backend for distributed counting
    - [ ] Proper HTTP 429 responses
    - [ ] Tests with 95%+ coverage

    ✓ Created pm/issues/PROJ-456-api-rate-limiting/

    Next steps:
    - Plan: /plan PROJ-456
    - View in Jira: https://company.atlassian.net/browse/PROJ-456
```

## Command Behavior

### Prerequisites Check

1. **Validate Jira enabled**:
   - Read CLAUDE.md
   - If `jira.enabled: false`: Error "Jira integration not enabled"

2. **Validate MCP**:
   - Check for Atlassian MCP tools
   - If unavailable: Error with setup instructions

3. **Validate ID format**:
   - Must match `[A-Z]+-###` pattern
   - Example: PROJ-123, ENG-456, BACKEND-789

### Fetch from Jira

**Use Atlassian MCP to get issue:**
- Issue key, summary, description
- Type (Story, Task, Bug, Epic)
- Status, priority
- Epic link (if part of epic)
- Reporter, assignee, created/updated dates
- Any custom fields visible to user

### Create Local Directory

**Directory structure:**
```
pm/issues/PROJ-456-api-rate-limiting/
└── (empty - ready for PLAN.md, WORKLOG.md, RESEARCH.md)
```

**Naming:**
- Convert summary to kebab-case
- Strip special characters
- Truncate if too long (max 50 chars)

### Display Information

**Show user:**
```
Issue: PROJ-456
Summary: API Rate Limiting Implementation
Type: Story
Status: To Do
Epic: PROJ-400 (API Infrastructure)

Description:
[Full description from Jira]

Acceptance Criteria:
[Parsed from description or custom field]

Local directory: pm/issues/PROJ-456-api-rate-limiting/

Next steps:
- Create plan: /plan PROJ-456
- View in Jira: [URL]
```

## Error Handling

### Issue Not Found
```
Error: PROJ-456 not found in Jira.

Possible causes:
- Issue doesn't exist
- No permission to view
- Wrong project key in CLAUDE.md

Check: https://company.atlassian.net/browse/PROJ-456
```

### Jira Not Enabled
```
Error: Jira integration not enabled.

To enable:
1. Add to CLAUDE.md:
   ## Jira Integration
   - **Enabled**: true
   - **Project Key**: PROJ
2. Configure Atlassian Remote MCP

Or work locally: /plan TASK-001
```

### MCP Unavailable
```
Error: Atlassian Remote MCP not configured.

Setup:
1. Install Atlassian Remote MCP Server
2. Configure in Claude Code MCP settings
3. Restart Claude Code

Guide: https://www.atlassian.com/blog/announcements/remote-mcp-server
```

### Directory Already Exists
```
Warning: pm/issues/PROJ-456-api-rate-limiting/ already exists.

This issue was previously imported. Contents:
- PLAN.md: ✓ exists
- WORKLOG.md: ✓ exists

Issue details (refreshed from Jira):
[Show latest Jira data]

Continue with: /plan PROJ-456 or /implement PROJ-456 1.1
```

## Integration with Workflow

**Position:** After issue created in Jira, before local work

```
Jira (PM creates) → /import-issue PROJ-456 → /plan PROJ-456 → /implement PROJ-456 1.1
```

**Alternative (auto-import):**
```
Jira (PM creates) → /plan PROJ-456 (auto-imports) → /implement PROJ-456 1.1
```

**Use /import-issue when:**
- You want to preview issue before planning
- You're unsure if issue exists
- You want to verify access permissions
- You want to see acceptance criteria before committing to work

**Skip /import-issue when:**
- You're ready to plan immediately: `/plan PROJ-456` auto-imports
- You trust the issue exists and is accessible

## Implementation Notes

When implementing `/import-issue PROJ-###`:

1. **Validate prerequisites**:
   - Read CLAUDE.md: Check `jira.enabled: true`
   - Check MCP: Ensure Atlassian MCP tools available
   - Validate ID: Must match `[A-Z]+-###` pattern

2. **Fetch from Jira**:
   - Use Atlassian MCP to get issue details
   - Parse description for acceptance criteria
   - Get epic link if exists
   - Handle "not found" gracefully

3. **Create directory**:
   - Convert summary to kebab-case
   - Create `pm/issues/PROJ-###-{name}/`
   - If exists: Show warning, display contents

4. **Display information**:
   - Show issue details clearly
   - Include Jira URL
   - Suggest next steps
   - Note: No TASK.md created (Jira is source)

5. **Return success**:
   - Confirm directory created
   - Ready for `/plan` or `/implement`

## Related Commands

- `/plan PROJ-123` - Create implementation plan (auto-imports if needed)
- `/implement PROJ-123 1.1` - Execute phase
- `/project-status` - View all imported issues
- `/promote TASK-001` - Convert local issue to Jira (opposite direction)

## Notes

- **Not required for workflow** - `/plan` auto-imports
- **Useful for exploration** - Preview before committing
- **Idempotent** - Can run multiple times (refreshes data)
- **Read-only** - Doesn't modify Jira, only fetches

---
tags: ["jira", "integration", "cache", "maintenance"]
description: "Refresh Jira field schema cache when requirements change"
argument-hint: ""
allowed-tools: ["Read", "Write", "Bash", "Grep", "Glob"]
model: claude-sonnet-4-5
---

# /refresh-schema Command

Refresh the cached Jira field schema when Jira administrators add or modify required fields.

## Purpose

Force refresh of the Jira field cache (`.ai-toolkit/jira-field-cache.json`) when:
- Jira administrator added new required fields
- Field requirements changed in Jira
- Epic/issue creation fails due to missing fields
- You want to ensure you have the latest schema

## Usage

```bash
/refresh-schema    # Refresh field cache from Jira
```

## Requirements

- **Jira integration enabled** in CLAUDE.md
- **Atlassian Remote MCP** configured and accessible
- **Network connectivity** to Jira instance

## What It Does

1. **Validates prerequisites**:
   - Checks Jira enabled in CLAUDE.md
   - Verifies Atlassian MCP available
   - Confirms network connectivity

2. **Clears existing cache**:
   - Deletes `.ai-toolkit/jira-field-cache.json` if exists
   - Removes stale field definitions

3. **Fetches fresh schema**:
   - Uses Atlassian MCP to get field metadata
   - Queries all issue types (Epic, Story, Task, Bug)
   - Gets required fields + allowed values

4. **Updates cache**:
   - Creates new `.ai-toolkit/jira-field-cache.json`
   - Stores field definitions with timestamp
   - Displays summary of discovered fields

5. **Validates schema**:
   - Confirms all issue types discovered
   - Checks for common required fields
   - Reports any warnings

## Workflow Example

```bash
# Developer tries to create an epic
/epic

AI: Creating epic in Jira...
    Error: Failed to create issue.
    Reason: Field 'customfield_10099' is required

    This usually means:
    1. Jira admin added new required fields
    2. Field cache is stale

    Fix: Run /refresh-schema and try again

User: /refresh-schema

AI: Refreshing Jira field schema...

    ✓ Cleared existing cache
    ✓ Connected to Jira

    Fetching field metadata...
    ✓ Epic fields (8 required)
    ✓ Story fields (6 required)
    ✓ Task fields (5 required)
    ✓ Bug fields (6 required)

    Discovered new required fields:
    - Team Assignment (customfield_10099)
    - Sprint (customfield_10020)

    ✓ Cached to .ai-toolkit/jira-field-cache.json

    Schema refresh complete!
    Next: Retry your command (e.g., /epic)

User: /epic

AI: Creating epic in Jira...

    Your Jira requires these fields:
    - Summary: What should we call this epic?
    - Epic Name: [from summary]
    - Team Assignment: Which team? (Frontend/Backend/DevOps)

    [Proceeds with conversational field collection]
```

## Command Behavior

### Prerequisites Check

1. **Validate Jira enabled**:
   - Read CLAUDE.md
   - If `jira.enabled: false`: Error "Jira not enabled"

2. **Validate MCP**:
   - Check for Atlassian MCP tools
   - If unavailable: Error with setup instructions

3. **Test connectivity**:
   - Attempt simple Jira API call
   - If fails: Error with connectivity message

### Cache Clearing

**Delete existing cache file:**
```bash
rm .ai-toolkit/jira-field-cache.json
```

**If file doesn't exist:**
- Log: "No existing cache found (this is fine)"
- Continue to fetch

### Schema Fetching

**Use Atlassian MCP to query field metadata:**

For each issue type (Epic, Story, Task, Bug):
1. Get field requirements via MCP
2. Parse required vs optional fields
3. Extract allowed values for select fields
4. Store field metadata

**Expected data structure:**
```json
{
  "last_updated": "2025-10-31T14:30:00Z",
  "project_key": "PROJ",
  "issue_types": {
    "epic": {
      "fields": {
        "summary": {"required": true, "type": "string"},
        "customfield_10011": {
          "required": true,
          "type": "string",
          "name": "Epic Name"
        },
        "customfield_10099": {
          "required": true,
          "type": "option",
          "name": "Team Assignment",
          "allowedValues": ["Frontend", "Backend", "DevOps"]
        }
      }
    },
    "story": { /* ... */ },
    "task": { /* ... */ },
    "bug": { /* ... */ }
  }
}
```

### Cache Writing

**Write to `.ai-toolkit/jira-field-cache.json`:**
- Create `.ai-toolkit/` directory if needed
- Write formatted JSON
- Set timestamp to current time
- Ensure file is readable

### Validation & Summary

**Display summary:**
- Number of issue types discovered
- Number of required fields per type
- Any new fields since last cache
- Any removed fields since last cache
- Warnings if common fields missing

## Error Handling

### Jira Not Enabled
```
Error: Jira integration not enabled.

To use /refresh-schema, enable Jira in CLAUDE.md:
## Jira Integration
- **Enabled**: true
- **Project Key**: PROJ

Or continue working locally without Jira.
```

### MCP Unavailable
```
Error: Atlassian Remote MCP not configured.

Cannot refresh schema without MCP.

Setup:
1. Install Atlassian Remote MCP Server
2. Configure in Claude Code MCP settings
3. Run: /refresh-schema again

Guide: https://www.atlassian.com/blog/announcements/remote-mcp-server
```

### Network/Permission Error
```
Error: Failed to connect to Jira.

Possible causes:
- Network/VPN issue
- Jira credentials expired
- No permission to view project

Check:
1. Can you access https://your-company.atlassian.net?
2. Are you logged in?
3. Do you have access to project 'PROJ'?

Then retry: /refresh-schema
```

### Fetch Fails
```
Error: Failed to fetch field metadata from Jira.
Reason: API returned 404

This usually means:
- Project key 'PROJ' is incorrect
- Project doesn't exist
- No permission to view project

Check CLAUDE.md project key and retry.
```

### No Issue Types Found
```
Warning: No issue types discovered in project.

This is unusual. Possible causes:
- Project is empty/new
- Incorrect project key
- Limited permissions

Cached what we found, but /epic and /plan may fail.
Check project configuration in Jira.
```

## Integration with Workflow

**Position:** Maintenance command, used when field requirements change

```
Normal workflow:
/epic → Success

Schema changes:
/epic → Error "Field X required"
/refresh-schema → Updates cache
/epic → Success (prompts for field X)
```

**When to use:**
- ✅ Epic/issue creation fails due to missing fields
- ✅ After Jira administrator announces schema changes
- ✅ When starting with a new Jira project
- ✅ If cache is corrupted or deleted
- ✅ Periodically (e.g., monthly) to stay current

**When NOT to use:**
- ❌ Before every epic/issue creation (unnecessary)
- ❌ When Jira is working fine
- ❌ If Jira integration is disabled

## Cache Lifecycle

**Creation:**
- First `/epic` or `/plan PROJ-###` command automatically fetches and caches schema
- Manual `/refresh-schema` can force refresh

**Expiration:**
- No automatic expiration (cache persists indefinitely)
- Recommended: Refresh monthly or when Jira changes
- Error-driven: Refresh when creation fails

**Storage:**
- Location: `.ai-toolkit/jira-field-cache.json`
- Format: JSON with timestamp
- Version control: Add to `.gitignore` (local only)

## Implementation Notes

When implementing `/refresh-schema`:

1. **Validate prerequisites**:
   - Read CLAUDE.md: Check `jira.enabled: true`
   - Check MCP: Ensure Atlassian MCP tools available
   - Test connectivity: Simple Jira API call

2. **Clear existing cache**:
   - Check if `.ai-toolkit/jira-field-cache.json` exists
   - If exists: Delete file
   - If not exists: Log "No cache found"

3. **Fetch schema from Jira**:
   - Use Atlassian MCP to get field metadata
   - Query each issue type: Epic, Story, Task, Bug
   - Parse required fields and allowed values
   - Handle errors gracefully

4. **Write new cache**:
   - Create `.ai-toolkit/` directory if needed
   - Write JSON with current timestamp
   - Format for readability
   - Validate file written successfully

5. **Display summary**:
   - Count issue types discovered
   - Count required fields per type
   - Highlight new/changed fields
   - Provide next steps

6. **Return success**:
   - Confirm cache updated
   - Suggest retrying failed command

## Related Commands

- `/epic` - Create epic (uses field cache)
- `/plan PROJ-123` - Import Jira issue (uses field cache for issue creation)
- `/promote TASK-001` - Promote local issue to Jira (uses field cache)
- `/import-issue PROJ-123` - Import Jira issue (doesn't require cache)

## Notes

- **Automatic fallback**: If commands fail due to stale cache, they should suggest `/refresh-schema`
- **First-time usage**: First Jira command auto-creates cache if missing
- **Manual refresh**: This command forces refresh regardless of cache state
- **Network requirement**: Requires connectivity to Jira instance
- **Safe operation**: Doesn't modify Jira, only local cache

---
version: "0.10.0"
created: "2025-10-22"
last_updated: "2025-10-22"
status: "active"
target_audience: ["ai-assistants", "developers"]
document_type: "command"
tags: ["workflow", "collaboration", "documentation"]
description: "Add timestamped work log entries to track manual changes and communicate with AI"
argument-hint: "\"your comment text\""
allowed-tools: ["Read", "Write", "Edit", "Grep", "Glob"]
model: claude-sonnet-4-5
references_guidelines:
  - docs/development/guidelines/development-loop.md  # WORKLOG format and work documentation standards
---

# /comment Command

Add timestamped work log entries to document manual changes and communicate with AI agents. Creates bidirectional human ↔ AI collaboration through narrative work logs.

## Usage

```bash
# Add a comment about manual work
/comment "I added a login button to the header"

# Document a manual fix
/comment "Fixed the dark mode toggle - using --color-grey-dark (#2d2d2d)"

# Add a note for future work
/comment "Remember we need loading states when API is wired up"

# Document a gotcha
/comment "Don't use jsonwebtoken - jose has better TypeScript support"
```

## Purpose

The `/comment` command solves the "AI forgets what humans did" problem by:

1. **Documenting manual work** - Track changes you make outside of `/implement`
2. **Communicating with AI** - Tell AI about decisions, constraints, gotchas
3. **Creating narrative history** - Build scannable work log that AI reads for context
4. **Triggering plan updates** - AI offers to update task plan based on your comment

## How It Works

### 1. Add Comment Entry

When you run `/comment "text"`, AI:

1. **Gets accurate timestamp**: Runs `date '+%Y-%m-%d %H:%M'` to get current system time
2. **Gets username**: Runs `git config user.name` to get git username
3. Locates the current task's WORKLOG.md file in `pm/issues/TASK-###-*/`
4. **Prepends** a timestamped entry at the top (reverse chronological):
   ```markdown
   ## 2025-10-22 15:30 - @username
   I added a login button to the header
   ```
5. Confirms entry was added

### 2. Analyze Impact on Task Plan

AI then:

1. Reads the current TASK.md plan
2. Analyzes if your comment relates to any existing phases
3. Identifies potential plan updates needed

### 3. Offer Plan Update (Interactive)

AI asks:
```
Your comment mentions adding a login button. This might relate to:
- [ ] 2.1 Implement login UI components

Should I update the task plan?
  1. Mark phase 2.1 as complete
  2. Add new phase for login button work
  3. No update needed

Choose (1/2/3): _
```

### 4. Update Plan and Confirm

If you choose an update:

1. AI updates TASK.md accordingly
2. AI adds confirmation entry to WORKLOG.md:
   ```markdown
   ## 2025-10-22 15:31 - project-manager
   Updated task plan: Marked phase 2.1 complete based on @taylor's manual work.
   ```

## WORKLOG.md Integration

Your comments become part of the narrative work log that AI reads when starting new work:

```markdown
# Work Log - TASK-001: User Authentication

## 2025-10-22 15:30 - @taylor
Added login button to header with dark mode support.
Using --color-grey-dark (#2d2d2d) for consistency.
Files: src/components/Header.tsx

## 2025-10-22 14:30 - backend-specialist
Implemented JWT authentication middleware with token refresh logic.
Gotcha: Token expiry must be configurable via env var (TOKEN_EXPIRY_HOURS).
Files: src/middleware/auth.js

## 2025-10-22 12:15 - test-engineer
Added integration tests for login flow. Mock JWT validation for speed.
Coverage: 98% on auth module, all edge cases covered.
Files: tests/integration/auth.test.ts
```

**Note**: Entries are in **reverse chronological order** (newest first) so recent work is immediately visible.

## When to Use /comment

✅ **Use /comment when:**
- You manually change code outside of `/implement`
- You make styling tweaks, configuration changes, quick fixes
- You want to document a gotcha or lesson learned
- You need to communicate constraints to AI ("must use library X")
- You've discovered something AI should know ("API changed, use v2")

❌ **Don't use /comment when:**
- AI agents are doing the work (they auto-log via `/implement`)
- You're just reading code (no changes made)
- The work is already documented in a commit message

## Benefits

**For AI Context:**
- AI reads WORKLOG before starting new phases
- Understands what humans have done manually
- Avoids duplicating human work
- Respects human decisions and constraints

**For Developers:**
- Quick way to document manual changes
- No context switching to update task files
- AI keeps task plan synchronized
- Creates shared narrative history with AI

**For Teams:**
- Other developers see what was done and why
- Gotchas and lessons are captured
- Work log provides implementation timeline
- Reduces "why did they do this?" questions

## Examples

### Example 1: Manual Styling Work

```bash
/comment "Tweaked button padding to 12px/24px for better mobile UX"

# AI responds:
# Added entry to WORKLOG.md
# No task plan updates needed (styling detail)
```

### Example 2: Manual Feature Addition

```bash
/comment "Added email validation regex to login form"

# AI responds:
# Added entry to WORKLOG.md
# This relates to phase 1.3 "Implement form validation"
# Should I mark phase 1.3 as complete? (y/n)
```

### Example 3: Documenting a Gotcha

```bash
/comment "Don't use setTimeout for token refresh - use setInterval and clear on logout"

# AI responds:
# Added entry to WORKLOG.md
# Gotcha documented for future reference
# No task plan updates needed
```

### Example 4: API Change Notification

```bash
/comment "Backend API changed - login endpoint now /api/v2/auth/login (not /api/login)"

# AI responds:
# Added entry to WORKLOG.md
# This affects phase 3.1 "Wire up login API"
# Should I update phase 3.1 description to reference /api/v2/auth/login? (y/n)
```

## File Structure

Comments are added to the current task's WORKLOG.md:

```
pm/issues/
  TASK-001-user-authentication/
    TASK.md          # Requirements (synced with PM tool)
    PLAN.md          # Implementation plan with checkboxes
    WORKLOG.md       # Narrative work log (comments go here)
    RESEARCH.md      # Technical decisions
```

If no task is currently active, AI will:

1. List available tasks
2. Ask which task this comment relates to
3. Add entry to the selected task's WORKLOG.md

## Integration with Other Commands

**`/implement`** - Reads WORKLOG to understand previous work (including human comments)
**`/plan`** - Can reference WORKLOG entries when creating implementation plan
**`/project-status`** - Shows recent WORKLOG activity in status report

## Best Practices

**Keep comments focused:**
- What you did (~200-300 chars)
- Why you did it (if not obvious)
- Any gotchas or lessons learned
- Files changed (optional but helpful)

**Don't overthink it:**
- Comments are informal, like Jira comments
- No need for perfect grammar or structure
- Just capture the essence of what happened

**Use when it helps AI memory:**
- Document things AI wouldn't know from reading code
- Capture the "why" behind manual decisions
- Note gotchas that aren't obvious in code

## Technical Details

**Comment Entry Format:**
```markdown
## YYYY-MM-DD HH:MM - @username
Comment text goes here.
Gotchas, lessons, file references.
```

**Entry Order:** Reverse chronological (newest entries at top)
**Timestamp:** Get from system using `date '+%Y-%m-%d %H:%M'` (NEVER guess the date/time)
**Username:** Git username from `git config user.name`
**Length:** ~500 chars guideline (not enforced, just recommended)

**Critical**: Always run `date '+%Y-%m-%d %H:%M'` to get the current timestamp. Do not use estimated dates.

## Error Handling

**No active task:**
```
No active task found. Which task does this comment relate to?
Available tasks:
  - TASK-001-user-authentication
  - TASK-002-database-schema
  - BUG-001-login-error

Select task: _
```

**No WORKLOG.md:**
AI automatically creates WORKLOG.md with header:
```markdown
# Work Log - TASK-001: User Authentication

## 2025-10-22 15:30 - @taylor
[Your comment]
```

## Philosophy

The `/comment` command embodies the core principle: **AI and humans work together, not separately.**

- **Humans** add comments when they manually change things
- **AI agents** add entries when they complete phases via `/implement`
- **Both** contribute to a shared narrative work log
- **Result**: Complete implementation history that helps AI remember context

This solves the "vibe coding" problem where AI forgets what was done and breaks existing features.

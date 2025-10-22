# Project Management Guide

## Overview

This directory contains all project management artifacts for planning and tracking work. The structure is template-driven, allowing customization while maintaining intelligent workflow assistance.

## Directory Structure

```
pm/
├── README.md              # This guide
├── templates/
│   ├── README.md          # Template customization guide
│   ├── epic.md           # Epic template (structure + metadata)
│   ├── task.md           # Task template (structure + metadata)
│   └── bug.md            # Bug template (structure + metadata)
├── epics/
│   └── EPIC-###-name.md  # High-level features and initiatives
└── issues/
    ├── TASK-###-name/     # Implementation tasks
    │   ├── TASK.md        # Task definition and plan
    │   ├── WORKLOG.md     # Narrative work history (auto-created by /implement)
    │   └── RESEARCH.md    # Technical decisions and deep dives (optional)
    └── BUG-###-name/      # Defects and fixes
        ├── BUG.md         # Bug report and fix plan
        ├── WORKLOG.md     # Fix implementation history (auto-created by /implement)
        └── RESEARCH.md    # Root cause analysis and technical investigation (optional)
```

## Core Workflow

### 1. Define Strategy
```bash
/project-brief    # Create or update project vision
```

### 2. Create Epics
```bash
/epic             # Create new epic or refine existing
```

The `/epic` command:
- Guides you through conversational epic creation
- Reads `templates/epic.md` for structure (name, description, DoD, dependencies, tasks)
- Creates `epics/EPIC-###-name.md`
- Allows iterative refinement by passing existing EPIC-###

### 3. Plan Implementation
```bash
/plan TASK-001    # Add implementation plan to task
/plan BUG-003     # Add fix plan to bug
```

The `/plan` command:
- Finds issue in `issues/` directory
- Reads corresponding template (`templates/task.md` or `templates/bug.md`)
- Loads epic context from issue frontmatter
- Generates phase-based breakdown with TDD encouragement
- Performs complexity analysis and suggests decomposition

### 4. Execute Work
```bash
/implement TASK-001 1.1    # Execute specific phase with specialized agents
```

## Issue Types

### Standard Types

**TASK** - Implementation work
- Description, Acceptance Criteria, Technical Notes, Plan
- Template: `templates/task.md`

**BUG** - Defects and fixes
- Description, Reproduction Steps, Expected vs Actual Behavior, Fix Plan
- Template: `templates/bug.md`

### Custom Types

Create custom issue types by adding templates to `templates/` directory. See `templates/README.md` for details.

Examples of custom types teams create:
- **SPIKE** - Research and investigation
- **RFC** - Request for Comments / design proposals
- **EXPERIMENT** - Proof of concept work
- **DEBT** - Technical debt remediation

## ID Numbering

- **Epics**: `EPIC-001`, `EPIC-002`, ... (sequential, global)
- **Tasks**: `TASK-001`, `TASK-002`, ... (sequential, global)
- **Bugs**: `BUG-001`, `BUG-002`, ... (sequential, global)
- **Custom**: `[TYPE]-001`, `[TYPE]-002`, ... (sequential per type)

Each issue type maintains its own sequential numbering across the entire project.

## Workflow Integration

Commands automatically reference this structure:
- `/epic` reads `templates/epic.md` for required sections
- `/plan` reads issue type template for structure
- `/implement` executes specific phases from issue plans
- `/architect` references `epics/` for context
- `/design` references `epics/` for strategic alignment

## File Organization

### Epic Files
- Location: `epics/EPIC-###-kebab-case-name.md`
- Single file per epic
- Contains metadata (frontmatter), description, DoD, dependencies, task list

### Issue Files

Each issue gets a directory containing:

**[TYPE].md** (Required)
- Primary issue file with definition and plan
- Contains metadata (frontmatter), sections defined by template
- Includes acceptance criteria and phase-based breakdown

**WORKLOG.md** (Auto-created)
- Narrative work history created by `/implement` and `/comment`
- **Reverse chronological order** (newest entries first for easy scanning)
- Timestamped entries from AI agents and human developers
- Documents what was done, lessons learned, gotchas discovered
- Helps AI and humans understand implementation history
- Format: ~500 char entries with timestamp, summary, lessons, files changed

**RESEARCH.md** (Optional)
- Deep technical investigation and decision documentation
- Created when complex technical decisions need detailed rationale
- Contains root cause analysis, alternatives considered, trade-offs
- Referenced from WORKLOG for deeper context ("See RESEARCH.md #section")

**File Relationship:**
- **[TYPE].md**: WHAT to do (plan checklist)
- **WORKLOG.md**: HOW it was done (narrative history with lessons)
- **RESEARCH.md**: WHY decisions were made (technical deep dives)

## Customization

This system is template-driven. You can:
- Modify existing templates to change structure
- Add new templates for custom issue types
- Adjust section requirements and prompts
- Customize workflow to match your process

See `templates/README.md` for complete customization guide.

## Best Practices

### Epic Planning
- Keep epics focused (2-8 tasks typically)
- Write concrete Definition of Done to prevent scope creep
- Use flexible DoD format (prose or checklist) based on epic needs
- Reference ADRs and other epics for dependencies

### Task/Bug Creation
- Write testable acceptance criteria
- Reference epic in frontmatter (`epic: EPIC-001`)
- Use descriptive names (shows in file paths and git branches)
- Add technical notes for future reference

### Implementation Planning
- Run `/plan` before `/implement` to create phase-based breakdown
- Review phase breakdown and adjust if needed
- Follow TDD/BDD guidance from plan
- Keep plans living documents (update as you learn)

## Git Integration

Branch names align with issue IDs:
```bash
# Epic branches
git checkout -b epic/user-authentication    # EPIC-001

# Task branches (from epic)
git checkout -b task/001-user-registration  # TASK-001

# Bug branches
git checkout -b bugfix/003-login-error      # BUG-003
```

See project Git workflow documentation for complete branching strategy.

## Related Documentation

- **Templates**: `templates/README.md` - Template customization guide
- **Commands**: Plugin commands documentation for detailed command reference
- **Git Workflow**: Project git workflow guidelines
- **Project Brief**: `docs/project-brief.md` - Strategic context

# Workbench

**Created**: 2025-08-21
**Last Updated**: 2025-08-21
**Status**: Active
**Target Audience**: Development Team, AI Assistants

## Overview

This directory serves as your AI assistant's working memory for issue-based development. It provides structured workspace organization that integrates with external project management systems.

## Purpose

- **AI Memory Extension**: Prevents context window limitations by providing persistent storage for work-in-progress
- **Project Integration**: Maps to your external ticket system (Jira, Linear, GitHub Issues, etc.)
- **Development Artifacts**: Stores temporary files, analysis, and planning documents
- **Context Preservation**: Maintains continuity across AI sessions and team handoffs

## Directory Structure

```
workbench/
├── README.md                    # This file
├── template/                    # Templates for new issues
│   ├── <key>_plan.md           # Issue planning template
│   └── docs/
│       ├── requirements.md      # Requirements documentation template
│       └── decision_log.md      # Decision tracking template
└── <ISSUE-KEY>/                # Individual issue workspaces
    ├── README.md               # Issue overview and status
    ├── <key>_plan.md          # Implementation plan
    ├── analysis/               # Research and analysis files
    ├── docs/                   # Issue-specific documentation
    │   ├── requirements.md     # Detailed requirements
    │   └── decision_log.md     # Technical decisions made
    └── temp/                   # Temporary files and scratch work
```

## Getting Started

### 1. Create Issue Workspace

When starting work on a new issue:

```bash
# Create directory using your issue tracking system's key format
mkdir workbench/PROJ-123        # Jira example
mkdir workbench/ENG-456         # Linear example  
mkdir workbench/issue-789       # GitHub Issues example
```

### 2. Copy Templates

```bash
# Copy planning template
cp workbench/template/<key>_plan.md workbench/PROJ-123/proj-123_plan.md

# Copy documentation templates
cp -r workbench/template/docs/ workbench/PROJ-123/docs/

# Create additional directories as needed
mkdir workbench/PROJ-123/analysis
mkdir workbench/PROJ-123/temp
```

### 3. Initialize Issue Files

Edit the copied templates with your issue details:
- Replace `{ISSUE_KEY}` with your actual issue key
- Fill in issue title, description, and initial requirements
- Set up your implementation plan

## Issue Management Integration

### Jira Integration
```
Directory: workbench/PROJ-123/
Issue URL: https://yourcompany.atlassian.net/browse/PROJ-123
Status: In Progress
Assignee: Developer Name
```

### Linear Integration
```
Directory: workbench/ENG-456/
Issue URL: https://linear.app/team/issue/ENG-456
Status: In Progress  
Assignee: Developer Name
```

### GitHub Issues Integration
```
Directory: workbench/issue-789/
Issue URL: https://github.com/org/repo/issues/789
Status: In Progress
Assignee: Developer Name
```

### Custom Systems
Adapt the naming convention to match your issue tracking system:
- Zendesk: `ticket-12345/`
- Asana: `task-67890/`
- Custom: `feature-name/` or `bug-fix-name/`

## Workflow

### Starting Work
1. **Create workspace** using issue key as directory name
2. **Copy templates** and customize with issue details
3. **Document requirements** in `docs/requirements.md`
4. **Create implementation plan** in `<key>_plan.md`
5. **Begin development** with AI assistant

### During Development
1. **Track decisions** in `docs/decision_log.md`
2. **Store analysis** in `analysis/` directory
3. **Create temp files** for exploration and debugging
4. **Update plan** as work progresses
5. **Document discoveries** for future reference

### Completing Work
1. **Finalize documentation** with actual implementation details
2. **Archive temp files** or clean up as needed
3. **Update external ticket** with final status
4. **Preserve workspace** for future reference or maintenance

## AI Assistant Guidelines

### For AI Assistants

**When starting work on an issue:**
1. Check if a workbench directory exists for the issue
2. If not, create one using the issue key
3. Copy and customize templates with issue-specific information
4. Use the workspace to store all working files and analysis

**During development:**
1. Store all temporary analysis and planning files in the workspace
2. Update the implementation plan as you progress
3. Document all significant decisions in the decision log
4. Use temp/ directory for experimental code and debugging files

**Context management:**
1. Reference workspace files to restore context quickly
2. Update documentation as you learn about the system
3. Store code snippets and examples for reuse
4. Keep notes about what works and what doesn't

### Workspace Organization Tips

**Use consistent naming:**
- `analysis_[topic].md` for research documents
- `spike_[technology].md` for technical investigations  
- `notes_[date].md` for daily work notes
- `debug_[component].md` for troubleshooting records

**Keep files focused:**
- One topic per file for easier context management
- Use descriptive filenames that explain the content
- Date-stamp files when chronology matters
- Link related files using markdown references

## Templates

### Issue Planning Template
The `<key>_plan.md` template provides:
- Phase-based implementation breakdown
- Concrete, actionable steps
- Checkpoint and validation milestones
- Clear acceptance criteria

### Requirements Template
The `docs/requirements.md` template covers:
- Functional and non-functional requirements
- Acceptance criteria and success metrics
- Dependencies and constraints
- Risk assessment and mitigation

### Decision Log Template
The `docs/decision_log.md` template tracks:
- Technical architecture decisions
- UX/UI design choices
- Process and workflow decisions
- Decision rationale and consequences

## Best Practices

### Workspace Hygiene
- **Regular cleanup**: Remove obsolete temp files periodically
- **Archive completed work**: Move finished issues to archive if needed
- **Document lessons learned**: Keep notes about what worked well
- **Update templates**: Improve templates based on experience

### Team Collaboration
- **Consistent naming**: Use organization-wide issue key conventions
- **Shared templates**: Keep templates updated and accessible
- **Handoff documentation**: Include context for team members
- **Link to external systems**: Always reference original tickets

### AI Collaboration
- **Explicit context**: AI assistants should read workspace files to understand current state
- **Progressive documentation**: Update docs as understanding develops
- **Decision tracking**: Record why certain approaches were chosen
- **Context preservation**: Maintain enough detail to resume work after context loss

## Troubleshooting

### Common Issues

**Large context windows**: If workspace files become too large for AI context:
- Break large files into focused, smaller files
- Use summary documents to provide overview
- Reference external files instead of including full content

**File organization**: If workspace becomes cluttered:
- Use subdirectories to group related files
- Follow consistent naming conventions
- Archive or remove obsolete files regularly

**Integration sync**: If workspace diverges from external ticket:
- Regularly sync status and requirements
- Use external ticket as source of truth for business requirements
- Use workspace for technical implementation details

## Migration and Maintenance

### Workspace Archiving
When issues are complete:
- Move workspace to `workbench/archive/` if needed
- Update external ticket with final status
- Document any ongoing maintenance needs
- Preserve workspace for future reference

### Template Updates
- Regularly review and improve templates
- Gather feedback from team members
- Update based on project-specific needs
- Version control template changes

---

**Integration Examples**

See the `template/` directory for complete examples of:
- Issue planning workflows
- Requirements documentation
- Decision tracking processes
- AI assistant collaboration patterns

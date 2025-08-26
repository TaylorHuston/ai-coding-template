# Deliverables

**Version**: 1.0.0  
**Created**: 2025-08-22  
**Last Updated**: 2025-08-22  
**Type**: Product Management Hub  
**Audience**: Product Managers, Stakeholders, Business Users

## Overview

This directory contains all product deliverables for the project. Each deliverable is organized as a folder containing:

- **Main deliverable document** (`.md` file): Business-focused documentation of the deliverable
- **Issues subdirectory** (`issues/`): All work items and technical tasks related to achieving the deliverable

**Remember:** These are not intended to be a replacement for an actual project management application such as Jira, Linear, etc. They don't have any kind of commenting functionality, you can't truly assign them to anyone, it will be very difficult to search and sort through them. There's no real way track velocity or estimates, etc. For a solo dev working on a small project, you can probably get away with using just these, but not really anything beyond that. They are primarily intended to give your AI coding tools local context to work off of and a standardized way to track their progress. They should follow the naming convention and be a 1:1 map of whatever issue tracking/project management tool you use externally.

## Glossary

**Deliverable:** A large, _but finite_, body of work with a clear goal/definition of done. Roughly analogous to an Epic in Jira or a Project in Linear.  
**Issue:** A small piece of concrete work tied to a deliverable. Also sometimes referred to as a User Story, if you subscribe to that methodology. Should be small enough that it can be completed in few hours of dedicated developer work, if not it should be further broken up. Remember the idea is to help the AI optimize its limited context, so you want to keep them small and focused.  
**Bug:** Something is broken and needs to be fixed immediately.  
**Task:** One-off actions that need to be completed but don't cleanly tie to any established deliverable.

## Structure

```
deliverables/
├── README.md                           # This file
├── status.md                           # Overall project status
├── usage-guide.md                      # Guide for using the templates
├── template-deliverable/               # Template for creating new deliverables
│   ├── template-deliverable.md         # Main deliverable documentation template
│   └── issues/                         # Related issues and work items
│       └── template/                   # Issue template structure
│           ├── ISSUE-KEY-plan.md       # Issue plan template
│           ├── docs/                   # Supporting documentation
│           │   ├── requirements.md
│           │   └── decision-log.md
│           ├── reports/                # Generated reports and artifacts
│           └── scripts/                # Automation and helper scripts
├── bugs/                               # Bugs and hotfixes
│   └── template/                       # Bug template structure
│       ├── BUG-KEY-plan.md             # Bug plan template
│       ├── docs/                       # Supporting documentation
│       │   └── root-cause.md
│       ├── reports/                    # Bug reports and test results
│       └── scripts/                    # Bug reproduction/fix scripts
├── tasks/                              # Quick tasks not associated with a deliverable
│   └── template/                       # Task template structure
│       ├── TASK-KEY-plan.md            # Task plan template
│       ├── docs/                       # Supporting documentation
│       │   ├── scope.md
│       │   └── decision-log.md
│       ├── reports/                    # Task reports and metrics
│       └── scripts/                    # Automation and helper scripts
├── 001-initial-setup/                  # EXAMPLE deliverable (USE, MODIFY, or DELETE)
│   ├── 001-initial-setup.md            # Example: Complete project setup guide
│   ├── README.md                       # Quick overview with instructions
│   └── issues/                         # 9 real setup tasks you can actually use
│       ├── SETUP-001/                  # Repository initialization
│       ├── SETUP-002/                  # Development environment
│       ├── SETUP-003/                  # Testing framework
│       └── ...                          # (6 more practical setup tasks)
├── user-authentication/                # Example deliverable structure
│   ├── user-authentication.md          # Main deliverable documentation
│   └── issues/                         # Authentication-related issues
│       └── EXAMPLE-AUTH-001-login-implementation/  # Example issue
│           └── AUTH-001-plan.md
└── [other-deliverables]/               # Additional deliverables as needed
```

## About the Example Deliverable (001-initial-setup)

The `001-initial-setup` directory is a **fully functional example deliverable** that serves two purposes:

1. **Template Demonstration**: Shows how to structure deliverables with proper documentation, issues, and plans
2. **Practical Value**: Contains 9 real setup tasks based on 2025 best practices that you can actually use

**Your Options:**
- ✅ **USE IT**: If starting a new project, these setup tasks provide excellent foundation
- ✏️ **MODIFY IT**: Remove or adapt issues based on your specific needs  
- 🗑️ **DELETE IT**: Simply run `rm -rf deliverables/001-initial-setup` if you don't need it

## Creating a New Deliverable

1. **Copy the template folder**:

   ```bash
   cp -r deliverables/template-deliverable deliverables/[your-deliverable-name]
   ```

2. **Rename and update the main document**:

   - Rename `template-deliverable.md` to `[your-deliverable-name].md`
   - Update the document with your deliverable's information

3. **Create issues in the issues subdirectory**:
   - Each issue should have its own folder within `issues/`
   - Use the template structure from `issues/template/`
   - Name issues with a clear identifier (e.g., `PROJ-001-feature-name`)

## Deliverable Documentation

Each deliverable's main `.md` file should contain:

### Business Information

- Executive summary and business value
- Success criteria and KPIs
- Stakeholder information
- Timeline and milestones

### Scope

- What's included in this deliverable
- What's explicitly out of scope
- Dependencies and prerequisites

### Risk & Resources

- Risk assessment and mitigation strategies
- Resource requirements (team, budget, etc.)
- External dependencies

### Links

- References to related architecture documentation
- Links to design assets and research
- Cross-references to other deliverables

## Issue Management

Within each deliverable's `issues/` directory:

### Issue Organization

- Each issue gets its own folder (e.g., `PROJ-001-login-feature/`)
- Include a PLAN.md file for detailed work planning
- Add supporting documentation as needed

### Issue Naming Convention

```
[PREFIX]-[NUMBER]-[brief-description]/
├── PLAN.md           # Detailed work plan
├── docs/             # Supporting documentation
│   ├── requirements.md
│   └── decision-log.md
└── [other-files]     # As needed
```

### Issue Lifecycle

1. **Planning**: Create issue folder with PLAN.md
2. **Active Development**: Update PLAN.md with progress
3. **Completion**: Mark as complete in deliverable's main document
4. **Archive**: Move to completed/ subdirectory if desired

## Relationship to Other Documentation

### Deliverables vs Architecture

- **Deliverables**: Focus on business value, user impact, and project management
- **Architecture**: Technical implementation details and system design
- Each deliverable may reference multiple architecture documents
- One architecture component may support multiple deliverables

### Deliverables vs Workbench

- **Deliverables**: Long-term product goals and business objectives
- **Workbench**: Active development workspace (being phased out)
- Issues are now organized under their parent deliverable

## Best Practices

### Keep Business Focus

- Write for non-technical stakeholders
- Emphasize user value and business impact
- Use clear, jargon-free language

### Maintain Traceability

- Link issues to their parent deliverable
- Reference related architecture documentation
- Track dependencies between deliverables

### Regular Updates

- Update deliverable status weekly
- Keep stakeholder information current
- Archive completed deliverables appropriately

## Migration from Workbench

The previous `/workbench` directory structure is being migrated to this new organization where:

- Each deliverable owns its related issues
- Work items are grouped by business objective
- Technical tasks are linked to business outcomes

## Changelog Maintenance

When completing work items, remember to update the project [CHANGELOG.md](../CHANGELOG.md):

1. **Add entries to `[Unreleased]` section** as work is completed
2. **Use the format**: `- [KEY] Brief description`
3. **Categorize properly**: Added, Changed, Fixed, Removed, Deprecated, Security
4. **Mark breaking changes**: Use **BREAKING** prefix with migration notes

See the [Changelog Guide](../docs/guides/changelog-guide.md) for detailed instructions.

## Quick Links

- [Deliverable Template](./template-deliverable/template-deliverable.md)
- [Issue Template](./template-deliverable/issues/template/)
- [Documentation Standards](../docs/documentation-standards.md)
- [Architecture Documentation](../docs/architecture/)
- [Changelog Guide](../docs/guides/changelog-guide.md)
- [Project Changelog](../CHANGELOG.md)

---

**Note**: This structure emphasizes the connection between business objectives (deliverables) and technical implementation (issues), making it easier to track progress and communicate with stakeholders.

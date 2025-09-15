# Template Deliverable

This directory contains templates for creating new deliverables and issues in your project.

## Structure

```
template-deliverable/
├── README.md                   # This file
├── template-deliverable.md     # Template for deliverable overview
└── issues/
    └── template/
        ├── PLAN.md            # Task checklist template (~50 lines)
        ├── README.md          # Implementation guide template (~200 lines)  
        ├── reports/           # Optional: For analysis outputs
        └── scripts/           # Optional: For automation scripts
```

## 2-File Documentation Pattern

Each issue uses a lightweight 2-file structure:

### PLAN.md
**Purpose**: Track what needs to be done  
**Contents**:
- Goal (1-2 sentences)
- Task checklist for AI/developer tracking
- Acceptance criteria
- Minimal context for AI agents
- Notes section for progress updates

### README.md
**Purpose**: Show how to implement  
**Contents**:
- Quick start commands
- Code examples and configurations
- Testing procedures
- Troubleshooting tips
- Resource links

## Usage

1. **Create a new deliverable**:
   - Copy `template-deliverable.md` to `deliverables/XXX-your-deliverable/README.md`
   - Update with your deliverable details

2. **Create a new issue**:
   - Copy `issues/template/` to `deliverables/XXX/issues/ISSUE-KEY/`
   - Update PLAN.md with tasks and criteria
   - Update README.md with implementation details

## Philosophy

This template follows the "Docs as Code" philosophy with a focus on:
- **Minimal overhead**: Just enough documentation to work effectively
- **Practical content**: Code examples over lengthy descriptions
- **Clear separation**: Planning (PLAN.md) vs implementation (README.md)
- **AI-friendly**: Structured for AI assistants to parse and update

## What This Is NOT

- Not a replacement for Jira/Linear (project management)
- Not a replacement for Confluence/Notion (documentation)
- Not for extensive requirements or user stories
- Not for project timelines or resource planning

## See Also

- [Documentation Guidelines](../../docs/documentation-guidelines.md) - Detailed guide on what goes where
- [AI Collaboration Guide](../../docs/ai-collaboration-guide.md) - How AI should work with branches and code
- [CLAUDE.md](../../CLAUDE.md) - Instructions for AI assistants
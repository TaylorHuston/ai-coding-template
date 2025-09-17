---
version: "0.1.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "project-managers"]
document_type: "template"
tags: ["template", "deliverables", "workflow"]
---

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

## 4-File Documentation Pattern

Each issue uses a lightweight 4-file structure:

### PLAN.md
**Purpose**: Track what needs to be done through structured phases
**Contents**:
- Goal (1-2 sentences)
- Multi-phase task structure with P X.X.X numbering
- Flexible phase lengths (phases can have 3-10+ tasks as needed)
- Each phase represents a logical commit boundary
- Agent hints for automatic coordination (<!--agent:specific-agent-->)
- Overall acceptance criteria
- Notes section for progress updates

### README.md
**Purpose**: Show how to implement  
**Contents**:
- Quick start commands
- Code examples and configurations
- Testing procedures
- Troubleshooting tips
- Resource links

### HANDOFF.yml
**Purpose**: Agent coordination and context passing
**Contents**:
- Structured handoff entries between AI agents
- Task progress tracking with P X.X.X references
- Agent-to-agent context preservation
- Quality gate status tracking
- Workflow state management

### RESEARCH.md
**Purpose**: Unstructured research and investigation findings
**Contents**:
- Context discovery and analysis findings
- Code snippets, dependencies, and technical details
- Security considerations and performance analysis
- Design decisions and rejected approaches
- External resources and documentation links
- Questions, assumptions, and future considerations

## Usage

1. **Create a new deliverable**:
   - Copy `template-deliverable.md` to `deliverables/XXX-your-deliverable/README.md`
   - Update with your deliverable details

2. **Create a new issue**:
   - Copy `issues/template/` to `deliverables/XXX/issues/ISSUE-KEY/`
   - Update PLAN.md with phased tasks (P X.X.X structure)
   - Update README.md with implementation details
   - Initialize HANDOFF.yml for agent coordination
   - Use RESEARCH.md for investigation findings and discoveries


## Philosophy

This template follows the "Docs as Code" philosophy with a focus on:
- **Minimal overhead**: Just enough documentation to work effectively
- **Practical content**: Code examples over lengthy descriptions
- **Clear separation**: Planning (PLAN.md) vs implementation (README.md) vs coordination (HANDOFF.yml) vs research (RESEARCH.md)
- **AI-friendly**: Structured for AI assistants to parse and update
- **Phase-driven**: Multi-phase P X.X.X structure for logical commit boundaries
- **Flexible structure**: Phases can vary in length based on complexity
- **Agent coordination**: Built-in handoff system for multi-agent workflows
- **STATUS.md integration**: Automatic project status updates at phase completion

## What This Is NOT

- Not a replacement for Jira/Linear (project management)
- Not a replacement for Confluence/Notion (documentation)
- Not for extensive requirements or user stories
- Not for project timelines or resource planning

## See Also

- [Documentation Guidelines](../../docs/development/guidelines/documentation-guidelines.md) - Detailed guide on what goes where
- [AI Collaboration Guide](../../docs/ai-tools/guides/ai-collaboration-guide.md) - How AI should work with branches and code
- [CLAUDE.md](../../CLAUDE.md) - Instructions for AI assistants
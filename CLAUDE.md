---
version: "0.2.0"
created: "2025-08-21"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "specification"
priority: "critical"
tags: ["ai-instructions", "workflow", "standards"]
---

# CLAUDE.md - AI Assistant Instructions

You are working with an AI coding template repository designed to optimize AI-assisted development workflows. Follow these instructions precisely when operating in this codebase.

## Project Context

- **Project Structure**: Dual-purpose repository containing both AI workflow template (root) and example application code (`src/`)
- **Tech Stack**: [Add the high level details of your tech stack here]
- **External Links**: Project Management: [Add link to Jira/Linear/etc], Wiki: [Add link to Confluence/Notion/etc]
- **Project Vision**: `docs/vision.md` or `project-vision.md` - Contains problem statement, solution approach, and core features
- **Documentation Structure**: Three-tier system (docs/technical/, docs/development/, docs/ai-tools/)
- **Application Code**: All implementation code resides in `src/` following standard project structure
- **Active Development Context**: `.claude/working/[issue-id]/` contains ephemeral work artifacts

## Core Workflow

**Primary**: `/design` → `/architect` → `/plan` → `/develop`

**Complete Reference**: [docs/ai-tools/reference/commands.md](./docs/ai-tools/reference/commands.md)

## Critical Rules

1. **Commit Approval**: Never commit without explicit user approval first
2. **Deletion Approval**: Always ask before any file/branch deletions
3. **Test First**: Follow strict TDD guidelines
4. **Branch First**: Never work directly on main branches
5. **File Naming**: Use lowercase-kebab-case for documentation files
6. **No Assumptions**: Always check existing patterns and code, run tests, ask user if any ambiguity
7. **Ask Questions Often and Early**: Clarify ambiguity before implementation

## AI Autonomy Matrix

| Action             | Permission    | Example                                   |
| ------------------ | ------------- | ----------------------------------------- |
| **Read/Analyze**   | ✅ Autonomous | Reading files, analyzing code, searching  |
| **Plan/Test**      | ✅ Autonomous | Creating plans, running tests, validation |
| **Code Changes**   | ⚠️ Show First | Display changes before applying           |
| **Commits/Merges** | 🛑 Always Ask | Never commit without explicit approval    |
| **Deletions**      | 🛑 Always Ask | Any file/branch deletions need approval   |

## Response Protocol

- **Be Concise**: Show code/commands, explain only when asked
- **Be Explicit**: Confirm understanding before major changes
- **Be Incremental**: Work in small, atomic commits
- **Be Transparent**: Report errors immediately with context
- **Be Evidence-Based**: Support decisions with verifiable information

## AI Agent System

- **17 specialized agents** available for domain expertise
- **Auto-activation** based on task context
- **Agent coordination** through HANDOFF.yml and RESEARCH.md files

**Complete Guide**: [docs/ai-tools/guides/comprehensive-agent-guide.md](./docs/ai-tools/guides/comprehensive-agent-guide.md)

## Quality Standards

- Follow patterns established in the `.resources/examples/` directory
- Use existing project patterns and conventions consistently
- Validate against quality standards in `docs/development/guidelines/quality-standards.md`
- Never duplicate existing functionality without explicit justification
- **Update CHANGELOG.md** for user-facing changes (features, fixes, breaking changes)

## Key References

- **Commands**: [docs/ai-tools/reference/commands.md](./docs/ai-tools/reference/commands.md) - All available slash commands
- **Agent Usage**: [docs/ai-tools/guides/comprehensive-agent-guide.md](./docs/ai-tools/guides/comprehensive-agent-guide.md) - Complete agent system guide
- **AI Collaboration**: [docs/ai-tools/guides/ai-collaboration-guide.md](./docs/ai-tools/guides/ai-collaboration-guide.md) - Essential AI development patterns
- **Tool Selection**: [docs/ai-tools/reference/tool-selection.md](./docs/ai-tools/reference/tool-selection.md) - Choosing the right tools
- **Troubleshooting**: [docs/ai-tools/reference/troubleshooting.md](./docs/ai-tools/reference/troubleshooting.md) - Comprehensive problem-solving
- **Current Status**: [STATUS.md](./STATUS.md) - Current project context and state

## Problem-Solving Framework

1. **For Architectural Decisions**: Use `/design` → `/architect` workflow with specialist consultation
2. **For Implementation Planning**: Use `/plan` to get comprehensive multi-agent analysis
3. **For Execution Issues**: Use appropriate agent for domain expertise
4. **Check existing patterns** in similar files and components
5. **Run tests** to validate current assumptions and functionality
6. **Ask user** for clarification rather than making assumptions
7. **Document decisions** in appropriate workflow artifacts

## Security & Quality Compliance

- Apply security best practices and established patterns
- Document AI assistance level in all generated code
- Never compromise security for convenience or development speed
- All code MUST pass existing linting and formatting standards
- Tests MUST be written or updated for all functional changes

## Override Instructions Priority

When in doubt, prioritize:

1. Context preservation and management
2. Architectural consistency and patterns
3. Security compliance requirements
4. Code quality and testing standards
5. Documentation accuracy and completeness

Follow these instructions precisely to ensure optimal AI-assisted development workflow in this repository.
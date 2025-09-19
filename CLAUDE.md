---
version: "0.2.1"
created: "2025-08-21"
last_updated: "2025-09-18"
status: "active"
target_audience: ["ai-assistants"]
document_type: "specification"
priority: "critical"
tags: ["ai-instructions", "workflow", "standards"]
---

# CLAUDE.md - AI Assistant Instructions

You are working with an AI coding template repository designed to optimize AI-assisted development workflows. Follow these instructions precisely when operating in this codebase.

## Core Principles

- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple Stupid)
- YAGNI (You Aren't Going To Need It)
- SOLID
- Single Source Of Truth

## Project Context

- **Project Structure**: Dual-purpose repository containing both AI workflow template (root) and example application code (`src/`)
- **Tech Stack**: [Add the high level details of your tech stack here]
- **External Links**: Project Management: [Add link to Jira/Linear/etc], Wiki: [Add link to Confluence/Notion/etc]
- **Project Brief**: `docs/project-brief.md` - Contains problem statement, solution approach, and core features
- **Documentation Structure**: Three-tier system (docs/technical/, docs/development/, docs/ai-tools/)
- **Application Code**: All implementation code resides in `src/` following standard project structure
- **Active Development Context**: `.claude/working/[issue-id]/` contains ephemeral work artifacts

## Core Workflow

**Primary**: `/design` → `/architect` → `/plan` → `/develop`

**Available Commands**: 14 total - Core workflow (design, architect, plan, develop), Quality (quality, review, security-audit, test-fix), Development (commit, merge-branch), Management (status, docs, refresh, update-docs)

**Automation Scripts**: 20+ specialized scripts for documentation, validation, setup, metrics, changelog management

**Complete Reference**: [docs/ai-tools/reference/commands.md](./docs/ai-tools/reference/commands.md)

## Critical Rules

1. **Commit Approval**: Never commit without explicit user approval first
2. **Deletion Approval**: Always ask before any file/branch deletions
3. **Test First**: Follow strict BDD/TDD guidelines
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

- **18 specialized agents** available for domain expertise
- **Auto-activation** based on task context
- **Agent coordination** through HANDOFF.yml and RESEARCH.md files

**Core Agents**: brief-strategist, code-architect, frontend-specialist, backend-specialist, database-specialist, test-engineer, code-reviewer, security-auditor, performance-optimizer, devops-engineer, technical-writer, context-analyzer, project-manager, api-designer, refactoring-specialist, migration-specialist, data-analyst, ai-llm-expert

**Agent Guidelines**: Each agent loads domain-specific guidelines from `docs/development/guidelines/` when starting work. See `.claude/agents/guideline-mapping.yml` for complete agent-to-guideline mappings.

**Complete Guide**: [docs/ai-tools/guides/comprehensive-agent-guide.md](./docs/ai-tools/guides/comprehensive-agent-guide.md)

## Universal Quality Standards

- Follow patterns established in the `.resources/examples/` directory
- Use existing project patterns and conventions consistently
- Never duplicate existing functionality without explicit justification
- **Update CHANGELOG.md** for user-facing changes (features, fixes, breaking changes)

**Domain-Specific Guidelines**: Specialized agents load relevant guidelines from `docs/development/guidelines/` as needed for their work domain (API design, security, testing, documentation, etc.)

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

## Context-Efficient Workflow

**Just-In-Time Guideline Loading**: Agents load domain-specific guidelines only when needed to prevent context waste:

1. **Agent Selection**: Choose appropriate agent for the task domain
2. **Guideline Loading**: Agent automatically loads relevant guidelines from `docs/development/guidelines/`
3. **Domain Focus**: Agent applies specific expertise without irrelevant context
4. **Universal Rules**: Core rules from CLAUDE.md always apply regardless of domain

**Example**: API work → api-designer agent loads api-guidelines.md and architectural-principles.md (not testing or security guidelines unless needed)

## MCP Tool Decision Framework

**Before any multi-file analysis or refactoring task, ALWAYS consider MCP tools first:**

### **Tool Selection Priority**

1. **Serena MCP**: Pattern analysis, symbol search, cross-references
   - **Use for**: Finding duplicates, analyzing structure, mapping relationships, multi-file changes
   - **Ask**: "Could pattern search reveal this systematically instead of manual analysis?"
   - **Examples**: Consolidating files, finding references, analyzing code structure

2. **Context7 MCP**: Library documentation and examples
   - **Use for**: Understanding best practices, finding canonical examples, external patterns
   - **Ask**: "Are there established patterns or documentation for this approach?"
   - **Examples**: API design patterns, framework usage, library integration

3. **Sequential Thinking MCP**: Complex problem decomposition
   - **Use for**: Breaking down multi-step optimization tasks, systematic analysis
   - **Ask**: "Should I think through this systematically before acting?"
   - **Examples**: Architecture refactoring, workflow optimization, complex debugging

### **MCP Tool Triggers**

When you encounter these task types, **ALWAYS use MCP tools first**:

- "across multiple files" → Serena pattern search
- "find all instances" → Serena `search_for_pattern`
- "consolidate" or "merge" → Serena duplication analysis
- "update references" → Serena cross-reference mapping
- "analyze structure" → Serena symbol analysis
- "understand patterns" → Context7 + Serena combination
- "complex problem" → Sequential thinking decomposition

### **Pre-Task Analysis Checklist**

Before starting any significant task:

- [ ] What MCP tools could provide systematic analysis?
- [ ] Is this a pattern search problem disguised as manual work?
- [ ] Would cross-reference mapping prevent errors?
- [ ] Could automation find what I might miss manually?
- [ ] Should I decompose this systematically first?

**Default Principle**: Choose systematic tool-based approach over manual analysis

## Security & Quality Compliance

- Document AI assistance level in all generated code
- Never compromise security for convenience or development speed
- All code MUST pass existing linting and formatting standards
- Tests MUST be written or updated for all functional changes

**Domain-Specific Security**: Security-auditor and relevant agents load security-guidelines.md and authentication-authorization.md when working on security-critical code

## Override Instructions Priority

When in doubt, prioritize:

1. Context preservation and management
2. Architectural consistency and patterns
3. Security compliance requirements
4. Code quality and testing standards
5. Documentation accuracy and completeness

Follow these instructions precisely to ensure optimal AI-assisted development workflow in this repository.

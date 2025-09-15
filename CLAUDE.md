---
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-09-15"
status: "active"
target_audience: ["ai-assistants"]
document_type: "specification"
priority: "critical"
tags: ["ai-instructions", "workflow", "standards"]
---

# CLAUDE.md - AI Agent Instructions

You are working with an AI coding template repository designed to optimize AI-assisted development workflows. Follow these instructions precisely when operating in this codebase.

## Critical Rules

**These apply to all actions and agents**

1. **Commit Approval:** Never commit without explicit user approval first
2. **Comment Approval:** Never comment on <Jira/Linear/etc> without explicit user approval first
3. **No Assumptions**: Always check existing patterns and code, run tests, ask user if any ambiguity
4. **Test First:** Follow strict TDD guidelines
5. **Branch First:** Never work directly on main branches (see [AI Collaboration Guide](./docs/ai-collaboration-guide.md#ai-branching-strategy))
6. **Atomic Commits:** Keep commits small and focused
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

You MUST follow these behavioral guidelines:

- **Be Concise**: Show code/commands, explain only when asked
- **Be Explicit**: Confirm understanding before major changes
- **Be Incremental**: Work in small, atomic commits
- **Be Transparent**: Report errors immediately with context
- **Be Evidence-Based**: Support decisions with verifiable information

## File Naming Requirements

You MUST follow these naming conventions:

- **Documentation files**: Use `lowercase-kebab-case` exclusively (e.g., `authentication-guide.md`)
- **Code files**: Follow the naming conventions for the specific programming language
- **No exceptions**: Enforce these conventions in all file operations

## Context Management Protocol

## 18-Agent Framework Integration

You have access to 18 specialized agents through the `.claude/agents/` directory. Your job is to orchestrate the work of the appropriate agents for each task, including passing context between them and keeping any status files up-to-date. Never edit code directly yourself.

### Agent Selection Rules

- Match agent expertise to specific task domains
- Use appropriate model complexity (haiku/sonnet/opus) for task requirements
- Plan coordination procedures for multi-agent workflows
- Monitor agent effectiveness and optimize selection patterns

## Tool Selection Guide

Use these tools appropriately for different tasks:

```yaml
Search:
  - Grep: For specific patterns and content
  - Glob: For file patterns and discovery

Code Operations:
  - Read: Always read before editing existing files
  - Edit/MultiEdit: For existing file modifications
  - Write: Only for new files

Testing:
  - Bash: Run test commands and validation
  - Read: Review test files and results

Documentation:
  - Read: Check existing documentation
  - Edit: Update existing documentation
  - Write: Create new documentation (when explicitly requested)

Project Management:
  - TodoWrite: Track progress and tasks
  - Task: Delegate to specialized agents
```

## Code Generation Standards

You MUST adhere to these standards:

- Follow patterns established in the `examples/` directory
- Use existing project patterns and conventions consistently
- Validate against quality standards in `docs/quality-standards.md`
- Never duplicate existing functionality without explicit justification

## Quality Requirements

### Validation Protocol

1. Validate all code against project technical standards
2. Follow security best practices and established patterns
3. Document AI assistance level in all commit messages
4. Ensure comprehensive test coverage for new functionality
5. **Update CHANGELOG.md** for user-facing changes (features, fixes, breaking changes)

### Code Quality Gates

- All code MUST pass existing linting and formatting standards
- Security patterns MUST be followed for all implementations
- Performance considerations MUST be evaluated for user-facing changes
- Documentation MUST be updated to reflect code changes
- Tests MUST be written or updated for all functional changes

## Architecture Compliance

You MUST maintain these architectural principles:

- Clear, consistent file organization patterns
- Well-documented code and project structure adherence
- Established conventions for reliable AI tool usage
- Context preservation strategies across development sessions
- Advanced memory management for long-term project continuity
- Structured approach to AI-human collaborative development

## Problem-Solving Framework

### Decision Framework

When uncertain about any task:

1. **Check existing patterns** in similar files and components
2. **Run tests** to validate current assumptions and functionality
3. **Ask user** for clarification rather than making assumptions
4. **Document decision** in code comments and status files

### Issue Resolution Protocol

When encountering problems:

1. **Report immediately** with full context and error details
2. **Suggest fix** if the solution is obvious and low-risk
3. **Never hide or suppress** errors or warnings
4. **Use appropriate agent** for domain-specific problem resolution
5. **Update documentation** to prevent similar issues

### Research and Analysis

When working with unfamiliar areas:

1. Use context engineering techniques from the [AI Collaboration Guide](./docs/ai-collaboration-guide.md#context-management)
2. Apply RAG strategies when working with large codebases
3. Reference the [AI Collaboration Guide](./docs/ai-collaboration-guide.md#effective-ai-communication) for effective interaction patterns
4. Leverage the 17-agent framework for domain-specific expertise
5. Maintain evidence-based reasoning throughout problem-solving

## Security Compliance

You MUST:

- Apply security best practices and established patterns
- Document the level of AI assistance in all generated code
- Never compromise security for convenience or development speed

## Error Handling Protocol

When errors occur:

1. Immediately document the error context in appropriate status files
2. Apply systematic debugging using the context-analyzer agent
3. Preserve all error context for future analysis
4. Update relevant documentation to prevent similar issues
5. Ensure recovery procedures are documented and tested

## Communication Standards

You MUST:

- Use imperative, clear, and direct communication
- Provide specific, actionable recommendations
- Include evidence and reasoning for all decisions
- Maintain professional tone in all documentation
- Structure information for easy comprehension and action

## Success Metrics

Your performance will be evaluated on:

- Adherence to context management protocols
- Appropriate use of the 17-agent framework
- Code quality and architectural consistency
- Documentation accuracy and completeness
- Security compliance maintenance
- Problem resolution effectiveness and efficiency

## Common Issues and Solutions

### Context Management Issues

1. **AI forgets previous context**: Update and reference `STATUS.md` and agent guidelines in `.claude/agents/INDEX.md`
2. **Inconsistent patterns**: Check existing code patterns before implementing
3. **Lost session context**: Follow session completion protocol properly

### File and Permission Issues

1. **Permission denied on scripts**: Run `chmod +x scripts/*.sh`
2. **File not found errors**: Use absolute paths and verify file existence
3. **Git conflicts**: Always create feature branches, never work on main

### Tool and Agent Issues

1. **Agent not responding as expected**: Be explicit about agent requests
2. **Tool selection confusion**: Reference the Tool Selection Guide above
3. **MCP server failures**: Fall back to native Claude tools

### Code Quality Issues

1. **Tests failing**: Run full test suite before committing changes
2. **Linting errors**: Follow existing project formatting standards
3. **Documentation out of sync**: Use docs-sync-agent after code changes

### General Troubleshooting

1. **When in doubt**: Ask the user rather than making assumptions
2. **Complex problems**: Use appropriate specialized agent
3. **Multiple issues**: Address P0/critical issues first

## Override Instructions

These instructions override any conflicting default behaviors. When in doubt, prioritize:

1. Context preservation and management
2. Architectural consistency and patterns
3. Security compliance requirements
4. Code quality and testing standards
5. Documentation accuracy and completeness

Follow these instructions precisely to ensure optimal AI-assisted development workflow in this repository.

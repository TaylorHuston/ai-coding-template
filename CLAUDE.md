# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an AI coding template repository designed as a starter template for projects working with AI coding tools like Claude Code and VSCode. The repository provides a framework to mitigate common challenges when working with LLMs, particularly their limited context windows that can cause them to "forget" previous implementations.

## AI Coding Context

This template addresses key challenges when working with AI coding tools. For a deep dive into best practices, please see:

-   [**PROMPTING.md**](./PROMPTING.md): For detailed guidance on how to write effective prompts.
-   [**LEGAL.md**](./LEGAL.md): For information on legal and ethical considerations.

### Context Window Limitations

-   LLMs have limited "context windows" and will eventually "forget" previous implementations.
-   This leads to duplicate code, broken integrations, and inconsistent patterns.
-   Having established frameworks and patterns helps mitigate these issues.

### Template Philosophy

-   Designed to be technology-agnostic and adaptable.
-   Focus on patterns and structures that help AI tools maintain consistency.
-   Emphasis on clear documentation and context preservation.

## Development Setup

Since this is a template repository, setup depends on your specific use case:

1.  Choose your programming language and framework.
2.  Add appropriate package management files.
3.  Establish project structure based on recommendations in the [README](./README.md).
4.  Implement consistent patterns and best practices.

## Getting Started

When using this template:

1.  Review the [README](./README.md) for AI coding best practices.
2.  Read [PROMPTING.md](./PROMPTING.md) to learn how to write effective prompts.
3.  Familiarize yourself with the considerations in [LEGAL.md](./LEGAL.md).
4.  Adapt the file structure recommendations to your tech stack.
5.  Implement the suggested patterns for working with AI tools.
6.  Update this `CLAUDE.md` file with project-specific details as you develop.

## Context Management

This template includes advanced context management strategies to help AI assistants work effectively:

### Status Management Files
- **status.md**: Project's memory - quickly restore context when hitting context limits
- **technical.md**: Technical specifications and system architecture details
- **instructions.md**: Current task instructions and workflows

### Context Engineering
- **Context Pruning**: Regular cleanup of outdated information
- **Structured Boundaries**: Clear separation between different types of context
- **Progressive Refinement**: Building context incrementally as needed
- **Session Handoffs**: Smooth transitions between AI sessions

### Memory Management Strategies
- Use status.md to summarize progress and current state
- Reference technical.md for system architecture and patterns
- Check instructions.md before starting any new work
- Update context files regularly to maintain accuracy

## Common Workflows

### Starting a New Session
1. Read status.md for current project state
2. Check instructions.md for active tasks
3. Review technical.md for relevant technical context
4. Confirm understanding before beginning work

### Context Window Management
- Use the status management files to maintain context efficiently
- Prune outdated information from conversations
- Reference files by name rather than including full content
- Focus on current task context rather than entire project history

### Ending a Session
1. Update status.md with current progress
2. Update instructions.md with next steps
3. Note any important decisions or changes made
4. Prepare context for next session handoff

## Best Practices for AI Collaboration

### Code Generation
- Follow patterns established in examples/ directory
- Reference .cursor/rules/ for language-specific guidelines
- Use existing project patterns and conventions
- Validate against technical specifications in technical.md

### Problem Solving
- Use context engineering techniques from docs/CONTEXT_ENGINEERING.md
- Apply RAG strategies when working with large codebases
- Reference PROMPTING.md for effective interaction patterns

### Legal and Security
- Follow guidelines in LEGAL.md for AI-generated code
- Apply security patterns from .cursor/rules/security.mdc
- Document AI assistance level in commit messages

## Architecture Notes

This template emphasizes patterns that work well with AI coding tools:

- Clear, consistent file organization
- Well-documented code and project structure
- Established conventions that AI can follow reliably
- Context preservation strategies to maintain consistency across sessions
- Advanced memory management for long-term projects
- Structured approach to AI-human collaboration

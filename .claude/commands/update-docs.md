---
description: Comprehensive documentation accuracy validation and updates using technical-writer agent
argument-hint: Optional scope or specific documentation areas to focus on
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: sonnet
---

Perform comprehensive documentation accuracy validation and updates by:

1. Reviewing the guidelines in docs/development/guidelines/documentation-guidelines.md
2. Reading both reference files in .claude/references/ to understand the complete documentation structure
3. Systematically traversing the entire documentation tree to check every file for accuracy
4. Identifying outdated information, broken links, inconsistent formatting, and missing content
5. Updating documentation to reflect current project state as of 2025-09-18
6. Ensuring all documentation follows established project standards and conventions

Process:

- Use technical-writer agent for comprehensive documentation analysis and coordination
- Review docs/development/guidelines/documentation-guidelines.md
- Start with .claude/references/documentation-tree.md and templates-examples-tree.md for structure understanding
- Traverse all documentation directories systematically: docs/, .claude/, .resources/, and project root files
- Validate cross-references, links, dates, version numbers, and content accuracy
- Update any outdated information found during the traversal
- Ensure bidirectional sync between code changes and documentation
- Generate summary report of all changes made

The technical-writer agent will automatically maintain documentation standards, fix formatting issues, and ensure comprehensive coverage of all project documentation.

Arguments: $ARGUMENTS (optional scope: all, docs, claude, resources, or specific paths)

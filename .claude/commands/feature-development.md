---
description: End-to-end feature implementation with TDD and quality gates
argument-hint: --issue KEY --type TYPE --complexity LEVEL --testing APPROACH
allowed-tools: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task
model: opus
---

End-to-end feature development workflow:
1. Analyze requirements and gather project context
2. Design architecture and plan implementation
3. Create comprehensive tests (TDD approach)
4. Implement feature with quality checks
5. Validate implementation and update documentation

Process:
- Use context-analyzer to gather relevant project patterns
- Use code-architect for system design (if complex)
- Use test-engineer to create comprehensive test suite
- Use appropriate domain specialists for implementation
- Use code-reviewer for quality validation
- Use security-auditor for security review (if sensitive)
- Use docs-sync-agent to update existing documentation
- Update project status and documentation

Parameters from $ARGUMENTS:
- --issue: Issue key for tracking integration
- --type: Feature type (component, api, service, integration)
- --complexity: Complexity level (simple, moderate, complex)
- --testing: Testing approach (unit, integration, e2e, all)
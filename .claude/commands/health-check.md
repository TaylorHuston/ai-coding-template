---
description: Comprehensive project health assessment and reporting
argument-hint: Optional scope (file, module, project, system)
allowed-tools: Read, Bash, Grep, Glob, TodoWrite, Task
model: sonnet
---

Comprehensive project health assessment including:
1. Code quality metrics and technical debt analysis
2. Test coverage and test suite health
3. Security vulnerability scanning
4. Documentation health and currency
5. Performance baseline measurement

Process:
- Use context-analyzer to gather current project state
- Use code-reviewer for code quality assessment
- Use test-engineer for test suite health evaluation
- Use security-auditor for vulnerability assessment
- Use docs-sync-agent for documentation health check
- Run project-specific health checks and linting
- Generate comprehensive health report with recommendations
- Update status files with current health metrics

Arguments: $ARGUMENTS (optional scope: file, module, project, system)
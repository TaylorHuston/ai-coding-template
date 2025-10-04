---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "testing", "debugging", "automation"]
description: "Automatic test failure detection and resolution"
argument-hint: "[test-pattern] [--files FILES]"
allowed-tools: ["Bash", "Read", "Edit", "MultiEdit", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
---

# /test-fix Command

**Purpose**: Automatic test failure detection and resolution with intelligent debugging.

## Usage

```bash
/test-fix                            # Fix all failing tests
/test-fix "auth.test.js"             # Fix specific test file
/test-fix --files "src/auth/"         # Fix tests in directory
```

## Process

Automatically detect and resolve test failures by:
1. Analyzing test failure patterns and error messages
2. Identifying root causes of test failures
3. Implementing appropriate fixes for failing tests
4. Validating fixes don't break other tests

## Agent Coordination

**Primary**: test-engineer (for test analysis and failure resolution)
**Supporting**: Domain specialists (frontend-specialist, backend-specialist, database-specialist) for implementing fixes
**Quality**: code-reviewer (for fix validation)

## Process

- Run test suite and capture failure details
- Use test-engineer agent to analyze failure patterns
- Use appropriate domain agents to implement fixes
- Re-run tests to validate resolution
- Update test documentation if needed
- Report summary of fixes applied

## Examples

**Fix all tests**: `/test-fix` → Run tests → Analyze failures → Apply fixes → Validate
**Fix specific test**: `/test-fix "auth.test.js"` → Target specific test file → Fix issues
**Fix by directory**: `/test-fix --files "src/auth/"` → Fix all tests in directory
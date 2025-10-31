---
# === Metadata ===
template_type: "guideline"
version: "1.0.0"
created: "2025-10-30"
last_updated: "2025-10-30"
status: "Optional"
target_audience: ["AI Assistants", "Test Engineers", "Development Team"]
description: "Testing approach, frameworks, and conventions - fill in via /adr decisions"

# === Testing Configuration (Machine-readable for AI agents) ===
testing_framework: "TBD"      # vitest, jest, mocha, etc.
e2e_framework: "TBD"          # playwright, cypress, etc.
test_location: "TBD"          # tests/, src/**/*.test.ts, etc.
test_priority: "TBD"          # unit-first, integration-first, e2e-first
run_command: "npm test"
# Note: Coverage target is configured in development-loop.md (test_coverage_target)
---

# Testing Standards

**Referenced by Commands:** `/test-fix`

## Quick Reference

This guideline defines our testing approach, frameworks, and conventions. Update as you make testing decisions.

**Coverage Target**: See `development-loop.md` for coverage target configuration (default: 95%).

## Our Testing Philosophy

**Priority**: TBD → Run `/adr "testing strategy"` to decide

- Will we focus on unit tests, integration tests, or E2E tests?
- What's our coverage target?
- How do we balance speed vs confidence?

## Framework Decisions

### Unit/Integration Testing
- **Framework**: TBD
- **Runner**: TBD
- Run `/adr "unit testing framework"` to decide

### E2E Testing
- **Framework**: TBD
- Run `/adr "E2E testing framework"` to decide

### Component Testing (if frontend)
- **Framework**: TBD

## Test Structure

```
TBD - Update once you've written first tests

Example patterns:
- tests/ mirrors src/ structure
- Co-located: src/**/*.test.ts
- Separate: tests/** matching src/**
```

## Running Tests

```bash
npm test              # Run all tests
npm test:unit         # Unit tests only
npm test:integration  # Integration tests only
npm test:e2e          # E2E tests only
npm test:coverage     # With coverage report
```

Update these commands based on your actual test scripts.

## Quality Gates

**Test-related quality gates** are defined in `development-loop.md`:
- **Coverage target**: Configured in development-loop.md frontmatter (default: 95%)
- **Test passage**: All tests must pass before phase completion
- **Test types**: Unit, integration, and E2E requirements per phase

See `development-loop.md` for complete quality gate configuration.

## Examples

This section will be populated as tests are written. Agents will reference existing tests as patterns for consistency.

### Unit Test Example
- TBD - Add link to first unit test

### Integration Test Example
- TBD - Add link to first integration test

### E2E Test Example
- TBD - Add link to first E2E test

## General Testing Knowledge

For testing best practices, patterns, and techniques, Claude has extensive knowledge of:
- Test-Driven Development (TDD) and Behavior-Driven Development (BDD)
- Unit testing, integration testing, E2E testing strategies
- Mocking, stubbing, and test doubles
- Test organization and maintainability
- Coverage analysis and interpretation

Ask questions like "What's the best way to test [X]?" and Claude will provide guidance based on industry standards and your chosen frameworks.

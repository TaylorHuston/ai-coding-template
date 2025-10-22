---
# Testing Configuration (Machine-readable for AI agents)
testing_framework: "TBD"      # vitest, jest, mocha, etc.
e2e_framework: "TBD"          # playwright, cypress, etc.
test_location: "TBD"          # tests/, src/**/*.test.ts, etc.
coverage_target: 70
test_priority: "TBD"          # unit-first, integration-first, e2e-first
run_command: "npm test"
---

# Testing Standards

## Quick Reference

This guideline defines our testing approach, frameworks, and conventions. Update as you make testing decisions.

## Our Testing Philosophy

**Priority**: TBD → Run `/architect "testing strategy"` to decide

- Will we focus on unit tests, integration tests, or E2E tests?
- What's our coverage target?
- How do we balance speed vs confidence?

## Framework Decisions

### Unit/Integration Testing
- **Framework**: TBD
- **Runner**: TBD
- Run `/architect "unit testing framework"` to decide

### E2E Testing
- **Framework**: TBD
- Run `/architect "E2E testing framework"` to decide

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

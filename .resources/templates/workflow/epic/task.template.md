---
version: "0.2.0"
created: "2025-09-18"
last_updated: "2025-09-18"
purpose: "Task template for epic-driven progressive development"
when_to_use: "When creating tasks at any phase: design, architect, plan, or develop"
target_audience: ["developers", "ai-assistants"]
document_type: "template"
tags: ["task", "epic", "progressive-discovery"]
placeholders:
  - name: "NUMBER"
    description: "Sequential task number (001, 002, etc)"
    example: "001"
  - name: "TITLE"
    description: "Brief title of the task"
    example: "User Registration"
  - name: "STATUS"
    description: "Current status"
    example: "pending"
  - name: "EXTERNAL_REF"
    description: "Link to external tracking system (optional)"
    example: "https://company.atlassian.net/browse/AUTH-101"
  - name: "DESCRIPTION"
    description: "Clear description of what needs to be accomplished"
    example: "Users need to create accounts to access the application"
  - name: "CRITERIA"
    description: "Acceptance criteria (can be multiple)"
    example: "Email validation with error messages"
  - name: "DEPENDENCIES"
    description: "What this task depends on (optional)"
    example: "TASK-001 (database setup) must be complete"
  - name: "NOTES"
    description: "Additional context or notes (optional)"
    example: "Use bcrypt for password hashing per ADR-002"
---

# TASK-{{NUMBER}}: {{TITLE}}

**Status**: {{STATUS}}
**External Ref**: {{EXTERNAL_REF}}

## Description

{{DESCRIPTION}}

## Acceptance Criteria

- [ ] {{CRITERIA}}

## Test Scenarios (BDD)
<!-- Generated from acceptance criteria -->
### Scenario: [Scenario Name]
**Given** [initial context]
**When** [action occurs]
**Then** [expected outcome]

## Test Coverage Requirements
- [ ] Unit tests: 95%+ coverage
- [ ] Integration tests: Key user flows
- [ ] Edge cases: Error conditions and boundaries
- [ ] Performance: Response time requirements met

## Implementation Tasks
<!-- Added by /plan command -->
<!-- Format: X.Y.Z for precise referencing -->
<!-- TDD/BDD approach: Write failing tests first, then implement -->
<!-- Example:
### 1.1.0 Setup form component (TDD)
- [ ] 1.1.1 Write failing tests for registration form
- [ ] 1.1.2 Create registration form with email/password fields
- [ ] 1.1.3 Add client-side validation with tests
- [ ] 1.1.4 Handle form submission with test coverage
-->

## Dependencies

{{DEPENDENCIES}}

## Notes

{{NOTES}}

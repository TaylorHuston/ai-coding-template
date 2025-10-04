---
version: "0.1.0"
created: "2025-09-18"
last_updated: "2025-09-18"
purpose: "Epic overview and context"
when_to_use: "When creating a new epic with /design --epic"
target_audience: ["developers", "product-managers", "ai-assistants"]
document_type: "template"
tags: ["epic", "overview", "planning"]
placeholders:
  - name: "EPIC_NAME"
    description: "Name of the epic"
    example: "user-authentication"
  - name: "EPIC_DESCRIPTION"
    description: "Brief description of what this epic delivers"
    example: "Implement secure user authentication system with registration and login"
  - name: "EXTERNAL_REF"
    description: "Link to external tracking system (JIRA, Linear, etc)"
    example: "https://company.atlassian.net/browse/EPIC-123"
  - name: "STATUS"
    description: "Current epic status"
    example: "planning"
  - name: "START_DATE"
    description: "When epic work began"
    example: "2025-09-18"
  - name: "TARGET_DATE"
    description: "Target completion date"
    example: "2025-10-15"
  - name: "PROBLEM_STATEMENT"
    description: "What problem this epic solves"
    example: "Users cannot currently create accounts or securely access the application"
  - name: "SUCCESS_CRITERIA"
    description: "How we know the epic is complete"
    example: "Users can register, login, and reset passwords securely"
  - name: "IN_SCOPE"
    description: "What is included in this epic"
    example: "Registration, login, logout, password reset, session management"
  - name: "OUT_SCOPE"
    description: "What is explicitly not included"
    example: "OAuth/social login, two-factor authentication"
  - name: "EPIC_DEPENDENCIES"
    description: "Cross-epic relationships and dependencies"
    example: "Requires: database-setup epic, Blocks: advanced-permissions epic"
  - name: "DEPENDENCIES"
    description: "Other epics or systems this depends on"
    example: "Database epic must be complete, Email service configured"
  - name: "PLANNED_TASKS"
    description: "List of planned tasks for this epic"
    example: "TASK-001: Database setup, TASK-002: User registration, TASK-003: Login flow"
  - name: "NOTES"
    description: "Any other relevant information"
    example: "OAuth and 2FA will be separate future epics"
  - name: "LESSONS_LEARNED"
    description: "Post-completion insights and learnings"
    example: "JWT implementation was more complex than anticipated, consider library evaluation earlier"
  - name: "COVERAGE_TARGET"
    description: "Test coverage percentage target"
    example: "95"
  - name: "TEST_TYPES"
    description: "Types of tests to be implemented"
    example: "Unit, Integration, End-to-End, Performance"
---

# {{EPIC_NAME}} Epic

**External Ref**: {{EXTERNAL_REF}}
**Status**: {{STATUS}}
**Started**: {{START_DATE}}
**Target Completion**: {{TARGET_DATE}}

## Overview
{{EPIC_DESCRIPTION}}

## Problem Statement
{{PROBLEM_STATEMENT}}

## Success Criteria
{{SUCCESS_CRITERIA}}

## Scope
- **In scope**: {{IN_SCOPE}}
- **Out of scope**: {{OUT_SCOPE}}

## Epic Dependencies
<!-- Relationships with other epics for coordination -->
<!-- Examples:
- **Requires**: user-management epic (authentication foundation needed)
- **Blocks**: advanced-permissions epic (provides basic auth)
- **Shares**: Database schema changes with reporting epic
-->
{{EPIC_DEPENDENCIES}}

## Task List (Execution Order)
<!-- Updated by each workflow phase as tasks are discovered -->
<!-- Tasks are numbered by discovery order, listed by execution order -->
<!-- Will be populated as tasks are created with /design --task commands -->

## Implementation Phases
<!-- Added by /plan command after architecture decisions -->
<!-- Example:
### Phase 1: Foundation
- [ ] TASK-003: Database migrations
- [ ] TASK-005: Redis setup

### Phase 2: Core Features
- [ ] TASK-001: User registration
- [ ] TASK-002: Login flow
-->

## Testing Strategy
- **Coverage Target**: {{COVERAGE_TARGET}}% across all components
- **Test Types**: {{TEST_TYPES}}
- **Automation Level**: Fully automated CI/CD integration
- **Quality Gates**: All tests must pass before deployment

## Resources
<!-- Reference materials and decisions are stored in resources/ directory -->
<!-- - resources/ADR-*.md: Architecture decisions from /architect -->
<!-- - resources/screenshots/: UI mockups and designs -->
<!-- - resources/research/: Technical analysis and benchmarks -->
<!-- - resources/customer-feedback/: User research and requirements -->
<!-- - resources/diagrams/: Architecture diagrams and flowcharts -->

## Dependencies
{{DEPENDENCIES}}

## Notes
{{NOTES}}

## Lessons Learned
<!-- Added upon epic completion for future reference -->
<!-- What went well, what could improve, knowledge for future epics -->
{{LESSONS_LEARNED}}
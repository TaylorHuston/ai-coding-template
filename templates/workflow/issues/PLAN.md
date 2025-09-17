# [ISSUE-KEY]: [Brief Title]

## Goal

[1-2 sentences describing what this issue accomplishes within the larger deliverable]

## Task Complexity Classification

**Classification**: [Simple | Complex | Architectural]

- **Simple**: Single-phase implementation, straightforward tasks → Direct /iterate execution
- **Complex**: Multi-phase implementation, requires comprehensive planning → Full /idea → /plan → /iterate workflow
- **Architectural**: System-level decisions, design choices → Extended /idea with multi-model consultation

**Development Strategy**: [Backend-First | Frontend-First | Full-Stack]
- **Backend-First** (Recommended): API/data layer → Business logic → Frontend integration
- **Frontend-First**: UI mockups → Component structure → Backend integration
- **Full-Stack**: Parallel development when components are independent

**Template Flexibility Guidelines:**
- **Customize phases**: Add, remove, or modify tasks based on actual requirements
- **Variable length**: Phases can have 3-10+ tasks - adapt to complexity
- **Agent selection**: Choose agents that match the work type (frontend-specialist for UI, backend-specialist for APIs, etc.)
- **Phase examples**: Simple bug fix (3 tasks), standard feature (6 tasks), complex integration (10+ tasks)
- **Sub-tasks**: Use P1.3.1, P1.3.2 format when breaking down complex tasks
- **Mission objectives**: Each task should have clear objectives and acceptance criteria

## Phase 1: [Phase Name - Core Implementation]

**Mission Objective**: [Clear description of what this phase accomplishes]

- [ ] P1.1.0 Analyze requirements and gather context <!--agent:context-analyzer-->
  - **Objective**: [Specific goal for this task]
  - **Acceptance Criteria**: [How to verify completion]
  - **Dependencies**: [Prerequisites or blockers]

- [ ] P1.2.0 Write comprehensive tests for core functionality <!--agent:test-engineer-->
  - **Objective**: [Specific testing goals]
  - **Acceptance Criteria**: [Test coverage and quality standards]
  - **Dependencies**: [Requirements analysis completion]

- [ ] P1.3.0 Implement core feature to pass tests <!--agent:frontend-specialist-->
  - **Objective**: [Implementation goals]
  - **Acceptance Criteria**: [Working functionality criteria]
  - **Dependencies**: [Tests written and passing baseline]

- [ ] P1.4.0 Code review and address feedback <!--agent:code-reviewer-->
  - **Objective**: [Quality assurance goals]
  - **Acceptance Criteria**: [Code quality standards met]
  - **Dependencies**: [Implementation complete]

- [ ] P1.5.0 Update documentation <!--agent:docs-sync-agent-->
  - **Objective**: [Documentation goals]
  - **Acceptance Criteria**: [Documentation completeness standards]
  - **Dependencies**: [Implementation and review complete]

- [ ] P1.6.0 Commit: "feat: [brief commit message describing phase]"
  - **Objective**: Create atomic commit for phase completion
  - **Acceptance Criteria**: All phase tasks complete, tests passing
  - **Dependencies**: All previous tasks in phase complete

## Phase 2: [Phase Name - Integration/Extension]

**Mission Objective**: [Clear description of what this phase accomplishes]

- [ ] P2.1.0 Analyze integration requirements <!--agent:context-analyzer-->
  - **Objective**: [Integration analysis goals]
  - **Acceptance Criteria**: [Integration requirements clarity]
  - **Dependencies**: [Phase 1 completion]

- [ ] P2.2.0 Write integration tests <!--agent:test-engineer-->
  - **Objective**: [Integration testing goals]
  - **Acceptance Criteria**: [Integration test coverage standards]
  - **Dependencies**: [Integration requirements analysis]

- [ ] P2.3.0 Implement integration logic <!--agent:backend-specialist-->
  - **Objective**: [Integration implementation goals]
  - **Acceptance Criteria**: [Working integration criteria]
  - **Dependencies**: [Integration tests written]

- [ ] P2.4.0 Code review and refinements <!--agent:code-reviewer-->
  - **Objective**: [Integration quality assurance]
  - **Acceptance Criteria**: [Quality standards for integration code]
  - **Dependencies**: [Integration implementation complete]

- [ ] P2.5.0 Update documentation <!--agent:docs-sync-agent-->
  - **Objective**: [Integration documentation goals]
  - **Acceptance Criteria**: [Documentation completeness for integrations]
  - **Dependencies**: [Integration review complete]

- [ ] P2.6.0 Commit: "feat: [brief commit message describing phase]"
  - **Objective**: Create atomic commit for integration phase
  - **Acceptance Criteria**: All integration tasks complete, tests passing
  - **Dependencies**: All previous tasks in phase complete

## Phase 3: [Phase Name - Finalization]

**Mission Objective**: [Clear description of what this phase accomplishes]

- [ ] P3.1.0 Analyze edge cases and error handling <!--agent:context-analyzer-->
  - **Objective**: [Edge case analysis goals]
  - **Acceptance Criteria**: [Comprehensive edge case identification]
  - **Dependencies**: [Core functionality and integration complete]

- [ ] P3.2.0 Write edge case and error tests <!--agent:test-engineer-->
  - **Objective**: [Edge case testing goals]
  - **Acceptance Criteria**: [Comprehensive test coverage for edge cases]
  - **Dependencies**: [Edge case analysis complete]

- [ ] P3.3.0 Implement error handling and edge cases <!--agent:database-specialist-->
  - **Objective**: [Error handling implementation goals]
  - **Acceptance Criteria**: [Robust error handling criteria]
  - **Dependencies**: [Edge case tests written]

- [ ] P3.4.0 Final code review <!--agent:code-reviewer-->
  - **Objective**: [Final quality assurance]
  - **Acceptance Criteria**: [Production-ready code standards]
  - **Dependencies**: [Error handling implementation complete]

- [ ] P3.5.0 Complete documentation <!--agent:docs-sync-agent-->
  - **Objective**: [Final documentation completion]
  - **Acceptance Criteria**: [Complete, accurate documentation]
  - **Dependencies**: [Final code review complete]

- [ ] P3.5.1 Update CHANGELOG.md for user-facing changes <!--agent:docs-sync-agent-->
  - **Objective**: [User-facing change documentation]
  - **Acceptance Criteria**: [CHANGELOG.md accurately reflects changes]
  - **Dependencies**: [Documentation complete]

- [ ] P3.6.0 Commit: "feat: [brief commit message describing phase]"
  - **Objective**: Create final atomic commit for feature completion
  - **Acceptance Criteria**: All phases complete, full test suite passing
  - **Dependencies**: All previous tasks in phase complete

## Overall Acceptance Criteria

- [ ] All phase commits completed successfully
- [ ] Comprehensive test coverage across all phases
- [ ] Documentation updated and accurate
- [ ] CHANGELOG.md updated for user-facing changes
- [ ] Code reviewed and approved
- [ ] Feature working as specified

## Context

[Optional: 2-3 lines of critical context for AI agents. Only include if essential for understanding the task. Can reference external issue trackers or project management tools.]

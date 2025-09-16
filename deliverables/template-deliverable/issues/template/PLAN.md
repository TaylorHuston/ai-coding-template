# [ISSUE-KEY]: [Brief Title]

## Goal

[1-2 sentences describing what this issue accomplishes within the larger deliverable]

**Template Flexibility Guidelines:**
- **Customize phases**: Add, remove, or modify tasks based on actual requirements
- **Variable length**: Phases can have 3-10+ tasks - adapt to complexity
- **Agent selection**: Choose agents that match the work type (frontend-specialist for UI, backend-specialist for APIs, etc.)
- **Phase examples**: Simple bug fix (3 tasks), standard feature (6 tasks), complex integration (10+ tasks)
- **Sub-tasks**: Use P1.3.1, P1.3.2 format when breaking down complex tasks

## Phase 1: [Phase Name - Core Implementation]

- [ ] P1.1.0 Analyze requirements and gather context <!--agent:context-analyzer-->
- [ ] P1.2.0 Write comprehensive tests for core functionality <!--agent:test-engineer-->
- [ ] P1.3.0 Implement core feature to pass tests <!--agent:frontend-specialist-->
- [ ] P1.4.0 Code review and address feedback <!--agent:code-reviewer-->
- [ ] P1.5.0 Update documentation <!--agent:docs-sync-agent-->
- [ ] P1.6.0 Commit: "feat: [brief commit message describing phase]"

## Phase 2: [Phase Name - Integration/Extension]

- [ ] P2.1.0 Analyze integration requirements <!--agent:context-analyzer-->
- [ ] P2.2.0 Write integration tests <!--agent:test-engineer-->
- [ ] P2.3.0 Implement integration logic <!--agent:backend-specialist-->
- [ ] P2.4.0 Code review and refinements <!--agent:code-reviewer-->
- [ ] P2.5.0 Update documentation <!--agent:docs-sync-agent-->
- [ ] P2.6.0 Commit: "feat: [brief commit message describing phase]"

## Phase 3: [Phase Name - Finalization]

- [ ] P3.1.0 Analyze edge cases and error handling <!--agent:context-analyzer-->
- [ ] P3.2.0 Write edge case and error tests <!--agent:test-engineer-->
- [ ] P3.3.0 Implement error handling and edge cases <!--agent:database-specialist-->
- [ ] P3.4.0 Final code review <!--agent:code-reviewer-->
- [ ] P3.5.0 Complete documentation <!--agent:docs-sync-agent-->
- [ ] P3.5.1 Update CHANGELOG.md for user-facing changes <!--agent:docs-sync-agent-->
- [ ] P3.6.0 Commit: "feat: [brief commit message describing phase]"

## Overall Acceptance Criteria

- [ ] All phase commits completed successfully
- [ ] Comprehensive test coverage across all phases
- [ ] Documentation updated and accurate
- [ ] CHANGELOG.md updated for user-facing changes
- [ ] Code reviewed and approved
- [ ] Feature working as specified

## Context

[Optional: 2-3 lines of critical context for AI agents. Only include if essential for understanding the task. Can reference external issue trackers or project management tools.]

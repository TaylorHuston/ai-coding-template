# Configuration Precedence Rules

**Created**: 2025-08-21 **Last Updated**: 2025-08-21 **Status**: Active **Target Audience**: Development Team, AI Assistants

## Core Principle

**PROJECT-SPECIFIC SETTINGS ALWAYS TAKE PRECEDENCE**

Project-specific configuration (./.claude/) is the **authoritative source** for this project.

## Precedence Hierarchy

When conflicts arise between global (~/.claude/) and project (./.claude/) configurations:

1. **Project-Specific Rules**: Always take precedence (agents, commands, workflows, documentation, testing)
2. **User Directives**: Explicit user instructions override all configurations
3. **Safety & Security**: Critical safety rules from global framework (only if not overridden by project)
4. **Global Fallback**: Apply only when no project-specific rule exists

## Usage Pattern

### For This Project (Template)

- Use project agents for domain-specific work
- Follow project documentation standards and testing approach
- Use project-specific workflow patterns
- Override global settings as needed for project requirements

### For New Projects Using This Template

- Start with these template configurations as baseline
- Create project-specific overrides as needs develop
- Gradually customize to project requirements
- Eventually develop independent project-specific configuration

## Documentation Philosophy Resolution

### Context

- **Global Rule**: "Code > documentation", "NEVER proactively create documentation files"
- **Template Need**: Projects may require comprehensive documentation for team collaboration

### Resolution

```yaml
documentation_strategy:
  scope: "UPDATE existing docs automatically, CREATE new docs only on request"
  rationale: "Balances global 'Code > documentation' with project collaboration needs"

  rules:
    - AUTO-UPDATE: Existing documentation when code changes (docs-maintainer agent)
    - ASK FIRST: Before creating any new documentation files
    - USER-REQUESTED: Always create documentation when explicitly asked
    - CRITICAL ONLY: Auto-suggest new docs for breaking changes (but ask first)

  enforcement:
    - Auto-invoke docs-maintainer ONLY for updating existing files
    - Ask user permission before creating new documentation files
    - Pre-commit: Run docs:health only if docs were modified
    - Quality gate: 90% health score applies only to existing docs
```

### Practical Application

1. **When writing code**: Focus on code quality first (global principle)
2. **When code affects architecture**: Update existing documentation (project requirement)
3. **When code affects technical implementation**: Update existing documentation (project requirement)
4. **When asked about documentation**: Provide it (user directive)
5. **Default behavior**: Don't create new docs unless explicitly needed

## Testing Standards Resolution

### Context

- **Global Rule**: TDD mandatory, tests must pass, ≥80% unit coverage, ≥70% integration
- **Template Reality**: Projects may have varying testing maturity

### Resolution

```yaml
testing_strategy:
  scope: "progressive improvement"
  rationale: "Different projects have different testing starting points"

  immediate_actions:
    - Use fast test configuration for development feedback
    - Fix test failures progressively while maintaining fast feedback
    - Focus on preventing new test failures and performance regression

  phased_approach:
    phase_1: "Fast Feedback"
      - Fast test suite working
      - Quick development feedback
      - Two-track testing: fast for development, comprehensive for CI

    phase_2: "Stabilization"
      - Reduce failures in test suite
      - Improve performance of tests
      - Implement test gates for new code

    phase_3: "Compliance"
      - Reach target standards (high pass rate)
      - Implement full TDD for new features
      - Maintain performance and coverage targets

  enforcement:
    - New code: MUST have passing tests (TDD)
    - Existing code: Fix tests progressively
    - Commits: Allowed if no NEW test failures introduced
    - PR merges: Require improvement trend (not perfection)
```

### Practical Application

1. **For development**: Use fast test commands for quick feedback
2. **For new features**: Write tests first (TDD) - they MUST pass
3. **For bug fixes**: Add regression tests - they MUST pass
4. **For existing failures**: Fix opportunistically, prioritize stability
5. **For CI/deployment**: Use comprehensive test suite
6. **Quality gate**: No NEW test failures, gradual improvement

## Agent Selection Resolution

### Context

- **Global Personas**: Generic development personas available globally
- **Project Agents**: Specialized agents for specific project needs

### Resolution

```yaml
agent_selection:
  scope: "project-first with global fallback"
  rationale: "Project agents understand specific context and patterns"

  rules:
    - PROJECT AGENTS: Use for domain-specific work
    - GLOBAL PERSONAS: Use only when no project agent exists
    - AUTO-INVOCATION: Project agents take precedence
    - CUSTOMIZATION: Adapt template agents to project needs

  precedence: 1. Project-specific agents (.claude/agents/) 2. Custom project workflows (.claude/commands/) 3. Global SuperClaude personas (~/.claude/) 4. Built-in Claude Code capabilities
```

## Key Principle

**Project needs override global preferences, but not global safety rules.**

Each project using this template has legitimate specific needs due to its technology stack, team structure, and business requirements. However, we should still follow global safety and security principles.

**For testing**: We acknowledge technical debt but enforce quality for new code while progressively improving existing code.

**For documentation**: Balance global "Code > documentation" with project-specific collaboration needs through intelligent automation and user permission gates.

**For agents**: Use project-specific agents that understand the context, patterns, and requirements of the specific project.

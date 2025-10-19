# Project Context

Welcome to your AI-assisted project! This file provides context to Claude Code about your project.

## Tech Stack

**Frontend**: [e.g., React, Vue, Next.js, etc.]
**Backend**: [e.g., Node.js, Python/Django, Go, etc.]
**Database**: [e.g., PostgreSQL, MongoDB, etc.]
**Infrastructure**: [e.g., AWS, Docker, Kubernetes, etc.]

## External Links

- **Project Management**: [Your Jira/Linear/etc URL]
- **Wiki/Documentation**: [Your Confluence/Notion/etc URL]
- **CI/CD**: [Your GitHub Actions/Jenkins/etc URL]
- **Monitoring**: [Your Datadog/New Relic/etc URL]

## Project Brief

See `docs/project/project-brief.md` for:
- Problem statement and solution approach
- Target audience and use cases
- Core features and success metrics
- Technical constraints and requirements

## Development Workflow

This project uses the AI Workflow plugin:

```bash
# Design phase
/design --brief              # Create project brief
/design --epic "feature"     # Design feature epics

# Architecture phase
/architect --epic "feature"  # Make technical decisions

# Planning phase
/plan --epic "feature"       # Break down into implementation tasks

# Development phase
/develop --epic "feature"    # Execute with specialized agents

# Quality gates
/review --scope all          # Code review
/test-fix --failed-only      # Fix failing tests
/commit                      # Create quality commit
```

## Project-Specific Guidelines

Add any project-specific conventions, patterns, or guidelines here:

### Coding Standards
- [Your linting/formatting rules]
- [Naming conventions]
- [Architecture patterns]

### Testing Requirements
- [Test coverage targets]
- [Testing frameworks]
- [Test organization]

### Documentation Standards
- [Documentation requirements]
- [Code comment guidelines]
- [ADR process]

---

**Note**: This file is read by Claude Code to understand your project context. Keep it updated as your project evolves.

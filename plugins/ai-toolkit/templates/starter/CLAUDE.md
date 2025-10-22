# Project Context

Welcome to your AI-assisted project! This file provides essential context to Claude Code about your project.

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

See `docs/project-brief.md` for:
- Problem statement and solution approach
- Target audience and use cases
- Core features and success metrics
- Technical constraints and requirements

## Development Workflow

This project uses the AI Toolkit plugin for structured development:

```bash
# 1. Design phase - Define what you're building
/design --brief              # Create project brief
/design --epic "feature"     # Design feature epics

# 2. Architecture phase - Decide how to build it
/architect --epic "feature"  # Make technical decisions

# 3. Planning phase - Break down the work
/plan --epic "feature"       # Create implementation tasks

# 4. Development phase - Build it
/develop --epic "feature"    # Execute with specialized agents

# 5. Quality gates - Ensure it's good
/review --scope all          # Code review
/test-fix --failed-only      # Fix failing tests
/commit                      # Create quality commit
```

## Development Guidelines

**The AI Toolkit includes comprehensive guidelines** covering:
- Architectural principles (DRY, KISS, YAGNI, SOLID)
- API design and documentation
- Security best practices
- Testing standards (TDD, BDD)
- Code quality and review
- And 11 more...

**Guidelines live in the plugin** and are automatically used by AI agents.

**To customize for this project**:
1. Copy guideline from plugin to `docs/development/guidelines/`
2. Edit for your project's needs
3. Agents will use your version

See `docs/development/README.md` for details.

## Project-Specific Notes

Add any project-specific conventions or guidelines here:

### Coding Conventions
- [Add language-specific style guides]
- [Naming conventions unique to this project]
- [Module organization patterns]

### Testing Strategy
- [Test coverage targets]
- [Testing frameworks and tools]
- [CI/CD integration]

### Deployment
- [Deployment process]
- [Environment configuration]
- [Release procedures]

---

**Note**: This file is read by Claude Code to understand your project. Keep it current as your project evolves.

**Need help?** See `GETTING-STARTED.md` for how to use the AI Toolkit effectively!

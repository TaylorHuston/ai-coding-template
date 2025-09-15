# Common Workflows

**Version**: 1.0.0  
**Created**: 2025-08-22  
**Last Updated**: 2025-08-22  
**Status**: Active  
**Target Audience**: Developers, AI Assistants

This guide provides step-by-step workflows for common development tasks using AI agents.

## Quick Navigation

- [Git Workflows](#git-workflows)
- [Feature Development](#feature-development)
- [Bug Fixing](#bug-fixing)
- [Code Review](#code-review)
- [Documentation](#documentation)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)

## Git Workflows

### AI-Safe Git Workflow

Follow the [AI Branching Strategy](../../ai-collaboration/ai-branching-strategy.md) for safe AI-assisted development.

```bash
# 1. Create feature branch (AI should ask permission)
git checkout -b feature/FEATURE-001-user-authentication

# 2. AI implements changes with oversight
# AI shows changes before committing

# 3. Review and approve before merge
git push origin feature/FEATURE-001-user-authentication

# 4. Create PR with AI assistance
"Please create a pull request for this feature"
```

### Commit Workflow

```bash
# 1. Stage changes
git add -A

# 2. AI generates commit message
"Generate a commit message for these changes"

# 3. Commit with AI attribution
git commit -m "feat: implement user authentication (AI-assisted)

- Added login/logout endpoints
- Implemented JWT tokens
- Added password hashing

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Feature Development

### Starting a New Feature

```bash
# 1. Create feature issue
mkdir -p deliverables/features/issues/FEATURE-001
echo "# Feature: User Authentication" > deliverables/features/issues/FEATURE-001/README.md

# 2. Update project status
echo "## Current Focus: User Authentication" >> STATUS.md

# 3. Request implementation
"Using the project-manager agent, help me implement user authentication
following the patterns in our docs/technical.md file"
```

### Feature Development Workflow

```markdown
Day 1: Planning
1. context-analyzer: Understand requirements
2. code-architect: Design solution
3. Create technical spec in deliverables/

Day 2-3: Implementation
1. database-specialist: Create schema
2. backend-specialist: Implement API
3. frontend-specialist: Build UI
4. test-engineer: Write tests

Day 4: Review & Polish
1. code-reviewer: Quality check
2. security-auditor: Security review
3. docs-sync-agent: Update documentation
```

## Bug Fixing

### Bug Investigation Workflow

```bash
# 1. Create bug tracking
mkdir -p deliverables/bugs/BUG-001
echo "# Bug: Login fails on mobile" > deliverables/bugs/BUG-001/README.md

# 2. Investigate
"Using the context-analyzer agent, investigate why login fails on mobile devices"

# 3. Root cause analysis
"Search for mobile-specific code in the authentication module"

# 4. Fix implementation
"Using the frontend-specialist, fix the mobile login issue"

# 5. Test fix
"Using test-engineer, write tests to prevent regression"
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-security-issue

# 2. Quick fix
"Using security-auditor, identify the vulnerability"
"Implement minimal fix for the security issue"

# 3. Fast review
"Using code-reviewer, quickly review this hotfix"

# 4. Deploy
git push origin hotfix/critical-security-issue
```

## Code Review

### Pre-Commit Review

```markdown
Before committing:
1. "Use code-reviewer agent to review my changes"
2. "Check for any security issues with security-auditor"
3. "Verify test coverage with test-engineer"
```

### Pull Request Review

```markdown
For PR review:
1. "Analyze this PR with context-analyzer"
2. "Review code quality with code-reviewer"
3. "Check security with security-auditor"
4. "Verify tests with test-engineer"
5. "Update documentation with docs-sync-agent"
```

## Documentation

### Creating Documentation

```markdown
For new features:
1. "Using technical-writer, create user documentation for [feature]"
2. "Generate API documentation for new endpoints"
3. "Update README with new feature information"
```

### Syncing Documentation

```markdown
After code changes:
1. "Using docs-sync-agent, update docs to match code changes"
2. "Check for outdated documentation"
3. "Update examples to match new API"
```

## Testing

### Test Creation Workflow

```markdown
TDD Approach:
1. "Using test-engineer, write tests for [feature] before implementation"
2. Implement feature
3. "Verify all tests pass"
4. "Add edge case tests"
```

### Test Coverage Improvement

```bash
# 1. Check current coverage
npm test -- --coverage

# 2. Identify gaps
"Using test-engineer, identify untested code paths"

# 3. Generate tests
"Write tests for uncovered functions in src/auth/"

# 4. Verify improvement
npm test -- --coverage
```

## Performance Optimization

### Performance Analysis Workflow

```markdown
1. Identify bottlenecks:
   "Using performance-optimizer, analyze application performance"

2. Database optimization:
   "Using database-specialist, optimize slow queries"

3. Frontend optimization:
   "Using frontend-specialist, improve React render performance"

4. Measure improvements:
   "Compare performance metrics before and after optimization"
```

### Load Testing Workflow

```bash
# 1. Set up load testing
"Using devops-engineer, set up load testing infrastructure"

# 2. Run baseline tests
npm run load-test

# 3. Optimize based on results
"Using performance-optimizer, address bottlenecks found in load testing"

# 4. Re-test
npm run load-test
```

## Deployment Workflows

### CI/CD Setup

```markdown
1. "Using devops-engineer, set up GitHub Actions CI/CD"
2. "Create deployment pipeline for staging and production"
3. "Add automated tests to pipeline"
4. "Set up rollback procedures"
```

### Release Workflow

```bash
# 1. Prepare release
"Update CHANGELOG.md with release notes"
git checkout -b release/v1.0.0

# 2. Final checks
"Using code-reviewer, final review of release"
"Using security-auditor, security scan"

# 3. Tag and release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Refactoring Workflows

### Code Refactoring

```markdown
1. Identify technical debt:
   "Using refactoring-specialist, identify areas needing refactoring"

2. Plan refactoring:
   "Create refactoring plan maintaining backward compatibility"

3. Implement:
   "Refactor [module] following SOLID principles"

4. Verify:
   "Ensure all tests still pass after refactoring"
```

### Architecture Refactoring

```markdown
1. "Using code-architect, analyze current architecture issues"
2. "Design improved architecture"
3. "Create migration plan"
4. "Implement incrementally with specialists"
```

## Migration Workflows

### Framework Migration

```markdown
Example: Migrating to React 18

1. "Using migration-specialist, create React 18 migration plan"
2. "Identify breaking changes"
3. "Update dependencies incrementally"
4. "Test each component after migration"
5. "Update documentation"
```

### Database Migration

```bash
# 1. Plan migration
"Using database-specialist, plan PostgreSQL to MongoDB migration"

# 2. Create migration scripts
"Generate data transformation scripts"

# 3. Test migration
"Set up test environment and validate migration"

# 4. Execute migration
"Perform production migration with rollback plan"
```

## Team Collaboration Workflows

### Onboarding New Developer

```markdown
1. Share context files:
   - CLAUDE.md
   - STATUS.md
   - docs/technical.md

2. "Using context-analyzer, explain project structure to new developer"

3. "Identify good first issues for new team member"

4. Set up pairing session:
   "Guide through first feature implementation"
```

### Knowledge Transfer

```markdown
1. "Using technical-writer, document [complex module]"
2. "Create architecture diagrams"
3. "Write onboarding guide for this module"
4. "Generate FAQ from common issues"
```

## Emergency Workflows

### Production Issue

```markdown
URGENT FIX:
1. "Using context-analyzer, gather information about production issue"
2. "Identify root cause in error logs"
3. "Using appropriate specialist, implement emergency fix"
4. "Deploy hotfix immediately"
5. "Create proper fix for next release"
```

### Security Incident

```markdown
SECURITY RESPONSE:
1. "Using security-auditor, assess security breach"
2. "Identify affected systems"
3. "Implement immediate patches"
4. "Audit for similar vulnerabilities"
5. "Update security procedures"
```

## Best Practices

### Workflow Optimization

1. **Batch similar tasks** - Group related work
2. **Use parallel agents** - Multiple agents simultaneously
3. **Maintain context** - Keep STATUS.md updated
4. **Document decisions** - Record in deliverables
5. **Review regularly** - Weekly code reviews

### Common Patterns

```markdown
Pattern: Feature → Test → Review → Document
Pattern: Investigate → Design → Implement → Validate
Pattern: Analyze → Optimize → Measure → Iterate
```

---

For more specific workflows, see individual guides in the `docs/guides/` directory.
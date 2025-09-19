---
description: Safe branch merging with deployment validation
argument-hint: Optional target branch or merge options
allowed-tools: ["Bash(git *)", "Bash(npm *)", "Bash(pnpm *)", "Bash(yarn *)", "Read", "Edit", "Grep", "Glob", "TodoWrite", "Task"]
model: sonnet
---

Safely merge current feature branch into target branch by:

1. **Pre-merge validation**: Verify all tests pass and code is committed
2. **Branch status check**: Ensure feature branch is up to date with remote
3. **Quality gates**: Run linting, type checking, and test suites
4. **Safe merge**: Switch to target branch, pull latest, merge feature branch
5. **Deployment validation**: Deploy merged code to staging/preview environment
6. **Health verification**: Confirm deployment health endpoints and functionality
7. **Status reporting**: Report merge success, deployment URLs, and next steps
8. **Documentation update**: Update project tracking and close related issues

## Enhanced Process with Deployment Validation

**Phase 1: Pre-Merge Validation**
- Validate current branch status and uncommitted changes
- Run comprehensive pre-merge quality checks (linting, tests, type checking)
- Verify all requirements are met and ready for integration
- Check for merge conflicts before attempting merge

**Phase 2: Safe Merge Execution**
- Execute safe git merge workflow with conflict detection
- Switch to target branch, pull latest changes
- Merge feature branch with proper merge strategy
- Verify merge success and code integrity

**Phase 3: Deployment and Health Validation**
- Deploy merged code to staging/preview environment (if configured)
- Monitor deployment process for errors or failures
- Run health checks on deployed application (if applicable)
- Verify key functionality works as expected
- Test critical user paths and API endpoints (if configured)

**Phase 4: Documentation and Cleanup**
- Update project tracking systems with merge status (if configured)
- Close related issues or mark them as completed (if configured)
- Update STATUS.md and CHANGELOG.md as needed
- Report deployment URLs and verification results

## Safety Features

- **Conflict Detection**: Abort merge if conflicts cannot be auto-resolved
- **Quality Gates**: Block merge if tests or linting fail
- **Deployment Monitoring**: Track deployment success/failure (if configured)
- **Health Verification**: Ensure application functions after merge (if applicable)
- **Rollback Preparation**: Document rollback procedures if needed

## Process

- Validate current branch status and uncommitted changes
- Run comprehensive pre-merge quality checks
- Execute safe git merge workflow with conflict detection
- Deploy merged code to appropriate environment (if configured)
- Verify deployment health and application functionality (if applicable)
- Update project documentation and close related issues (if configured)
- Report final status with deployment URLs and next steps

Arguments: $ARGUMENTS (optional target branch name, merge strategy, or deployment environment)
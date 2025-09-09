---
command: "/merge-branch"
description: Safe branch merging with validation and deployment checks
category: "Version Control & Deployment"
purpose: "Safe branch merging with automated testing and validation"
wave-enabled: false
performance-profile: "standard"
argument-hint: Optional target branch name or merge options
allowed-tools: Bash(git *), Bash(npm *), Bash(pnpm *), Bash(yarn *), Read, Edit, Grep, Glob, TodoWrite
model: sonnet
---

Safely merge current feature branch into target branch by:

1. **Pre-merge validation**: Verify all tests pass and code is committed
2. **Branch status check**: Ensure feature branch is up to date with remote
3. **Quality gates**: Run linting, type checking, and test suites
4. **Safe merge**: Switch to target branch, pull latest, merge feature branch
5. **Deployment validation**: Deploy target branch to preview environment (if configured)
6. **Health verification**: Confirm deployment health endpoints (if applicable)
7. **Status reporting**: Report merge success and deployment URLs
8. **Issue tracking**: Update issue status in tracking system (if configured)

## Process

- Validate current branch status and uncommitted changes
- Run comprehensive pre-merge quality checks
- Execute safe git merge workflow with conflict detection
- Trigger deployment and monitor build status (if deployment configured)
- Verify deployed application health and functionality (if applicable)
- Report final status with deployment URLs and next steps
- Update issue tracking system with completion status (if configured)

Arguments: $ARGUMENTS (optional target branch name, defaults to 'develop' or 'main')
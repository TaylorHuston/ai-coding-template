---
description: Create a proper git commit with quality checks and conventional message
argument-hint: Optional commit message or files to include
allowed-tools: Bash(git *), Bash(npm run *), Bash(pnpm *), Bash(yarn *), Read, Grep, Glob
model: sonnet
---

Help create a proper git commit by:
1. Running pre-commit checks (tests, lint, type-check) 
2. Reviewing staged changes for quality and completeness
3. Drafting an appropriate commit message following project conventions
4. Only proceeding with commit after user approval

Process:
- Use code-reviewer agent to assess staged changes
- Run project-specific quality checks (tests, linting, etc.)
- Generate conventional commit message with AI attribution
- Provide summary of changes and impact assessment
- Ask for user confirmation before committing

Arguments: $ARGUMENTS (optional commit scope or files)
---
description: Comprehensive feature planning workflow with deliverable setup
argument-hint: --issue ISSUE-KEY --deliverable DELIVERABLE-NAME --complexity LEVEL --research DEPTH
allowed-tools: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task
model: opus
---

Plan a new feature using comprehensive planning workflow:

1. Analyze issue requirements and gather context
2. Research existing patterns and architectural considerations
3. Create proper deliverable structure and issue workspace
4. Design comprehensive implementation plan with code architect
5. Set up development environment and branch structure

Process:

- Read deliverables/README.md to understand workflow structure
- Use context-analyzer to gather issue details and requirements
- Use context-analyzer to gather additional context from project documentation
- Use code-architect to design comprehensive feature architecture and plan
- Create proper deliverable directories and template files following project structure
- Set up feature branch following project branching strategy
- Generate detailed PLAN.md with implementation roadmap, acceptance criteria, and technical specifications
- Create supporting documentation (requirements.md, decision-log.md) as needed
- Update project status and prepare development environment
- Ask clarifying questions throughout the process to ensure plan accuracy

Parameters from $ARGUMENTS:

- --issue: Issue tracking key for feature requirements (optional)
- --deliverable: Target deliverable name for organizing the feature
- --complexity: Feature complexity level (simple, moderate, complex, enterprise)
- --research: Research depth (basic, comprehensive, extensive) for context gathering

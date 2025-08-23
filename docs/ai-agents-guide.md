# AI Agents Guide

**Version**: 1.0.0  
**Created**: 2025-08-22  
**Last Updated**: 2025-08-22  
**Status**: Active  
**Target Audience**: Developers, AI Assistants

This guide explains the AI agent system and how to effectively use specialized agents for different development tasks.

## What Are AI Agents?

AI agents are specialized prompts and instructions that give AI assistants specific expertise. Think of them as "expert consultants" you can call upon for different tasks. Each agent has:

- **Specific domain expertise**
- **Defined tool access**
- **Coordination patterns**
- **Quality standards**

## How Agents Work

### Activation Methods

1. **Automatic Activation**: Agents activate based on task context
2. **Manual Request**: Explicitly ask for a specific agent
3. **Agent Handoff**: Agents coordinate with each other
4. **Parallel Execution**: Multiple agents can work simultaneously

### Agent Coordination

```
User Request
    ↓
context-analyzer (gathers context)
    ↓
project-manager (orchestrates)
    ↓
Specialist Agents (execute)
    ↓
code-reviewer (validates)
    ↓
docs-sync-agent (updates docs)
```

## Complete Agent Roster

### 🎯 Automatically Invoked Agents (8)

These activate automatically based on context:

| Agent | Purpose | Auto-Triggers |
|-------|---------|---------------|
| **project-manager** | Orchestrates complex tasks | 3+ domain tasks |
| **context-analyzer** | Gathers project context | Before complex work |
| **frontend-specialist** | UI/UX development | React/Vue/Angular tasks |
| **backend-specialist** | Server implementation | API/business logic |
| **database-specialist** | Data architecture | Schema/query work |
| **test-engineer** | Test creation | Test failures detected |
| **code-reviewer** | Quality assessment | After implementation |
| **docs-sync-agent** | Documentation updates | After code changes |

### 🛠️ On-Demand Specialists (9)

Invoke these for specific needs:

| Agent | Purpose | Example Use |
|-------|---------|-------------|
| **code-architect** | System design | "Design authentication architecture" |
| **api-designer** | API architecture | "Design REST API for users" |
| **security-auditor** | Security review | "Audit for vulnerabilities" |
| **devops-engineer** | Infrastructure | "Set up CI/CD pipeline" |
| **performance-optimizer** | Performance | "Optimize database queries" |
| **technical-writer** | Documentation | "Write API documentation" |
| **refactoring-specialist** | Code improvement | "Refactor user service" |
| **migration-specialist** | Upgrades | "Migrate to React 18" |
| **data-analyst** | Data analysis | "Analyze user behavior data" |

## Using Agents Effectively

### Basic Usage Examples

#### Simple Request
```
"Create a login form component"
→ frontend-specialist automatically handles this
```

#### Explicit Agent Request
```
"Using the security-auditor agent, review the authentication code"
→ Specific agent performs targeted review
```

#### Multi-Agent Coordination
```
"Implement user management system"
→ project-manager coordinates:
  - code-architect for design
  - database-specialist for schema
  - backend-specialist for API
  - frontend-specialist for UI
  - test-engineer for tests
```

## Agent Workflows

### Feature Development Workflow

```markdown
1. Context Analysis
   - context-analyzer gathers requirements
   - Reviews existing patterns

2. Architecture Design
   - code-architect designs solution
   - api-designer creates contracts

3. Implementation
   - database-specialist: Schema
   - backend-specialist: Business logic
   - frontend-specialist: UI components

4. Quality Assurance
   - test-engineer: Test coverage
   - security-auditor: Security review
   - code-reviewer: Code quality

5. Documentation
   - docs-sync-agent: Updates docs
   - technical-writer: User guides
```

### Bug Fix Workflow

```markdown
1. Investigation
   - context-analyzer: Gather context
   - Specialist agent: Root cause analysis

2. Solution Design
   - code-architect: Solution approach
   - Impact assessment

3. Implementation
   - Appropriate specialist fixes issue
   - test-engineer: Regression tests

4. Validation
   - code-reviewer: Quality check
   - docs-sync-agent: Update docs
```

### Performance Optimization Workflow

```markdown
1. Analysis
   - performance-optimizer: Identify bottlenecks
   - database-specialist: Query analysis

2. Strategy
   - code-architect: Optimization plan
   - Prioritize improvements

3. Implementation
   - Specialists implement optimizations
   - Continuous performance monitoring

4. Validation
   - Performance benchmarks
   - code-reviewer: Quality assurance
```

## Agent Selection Guide

### By Task Type

| Task Type | Primary Agent | Supporting Agents |
|-----------|---------------|-------------------|
| New Feature | project-manager | All specialists as needed |
| Bug Fix | context-analyzer | Domain specialist + test-engineer |
| UI Work | frontend-specialist | test-engineer, code-reviewer |
| API Design | api-designer | backend-specialist, database-specialist |
| Database Work | database-specialist | backend-specialist, performance-optimizer |
| Security | security-auditor | code-reviewer, backend-specialist |
| Documentation | technical-writer | docs-sync-agent |
| Refactoring | refactoring-specialist | test-engineer, code-reviewer |
| Performance | performance-optimizer | database-specialist, backend-specialist |

### By Project Phase

| Phase | Agents to Use |
|-------|---------------|
| Planning | context-analyzer, code-architect |
| Design | api-designer, database-specialist |
| Implementation | frontend/backend specialists |
| Testing | test-engineer |
| Review | code-reviewer, security-auditor |
| Documentation | technical-writer, docs-sync-agent |
| Deployment | devops-engineer |

## Advanced Agent Usage

### Parallel Agent Execution

```
"Please have the frontend-specialist create the UI components
while the backend-specialist implements the API endpoints
and the test-engineer prepares the test suite"
```

### Agent Chaining

```
"First use context-analyzer to understand the codebase,
then have code-architect design the solution,
finally implement with appropriate specialists"
```

### Custom Agent Combinations

```
"For this e-commerce feature, coordinate:
- database-specialist for product schema
- backend-specialist for inventory API
- frontend-specialist for product catalog
- performance-optimizer for search optimization"
```

## Agent Best Practices

### Do's ✅

- **Be specific** when requesting agents
- **Provide context** files (status.md, technical.md)
- **Let agents coordinate** naturally
- **Trust agent expertise** in their domains
- **Review agent output** before applying

### Don'ts ❌

- Don't use wrong agent for task (e.g., frontend agent for database)
- Don't skip context-analyzer for complex tasks
- Don't bypass code-reviewer for critical code
- Don't ignore agent recommendations
- Don't override agent safety checks

## Creating Custom Agents

### Agent Template

```yaml
---
name: your-custom-agent
description: What this agent does
tools: [Read, Write, Edit, Bash]
model: haiku|sonnet|opus
coordination:
  hands_off_to: [other-agents]
  receives_from: [other-agents]
---

You are a [Role]. Your expertise includes...

## Core Responsibilities
- Primary responsibility 1
- Primary responsibility 2

## Workflow
1. Step 1
2. Step 2
```

### Adding Custom Agent

1. Create file: `.claude/agents/your-agent.md`
2. Follow the template structure
3. Update `.claude/agents/INDEX.md`
4. Test with simple tasks
5. Document usage patterns

## Troubleshooting Agents

### Agent Not Activating

- Check agent name spelling
- Verify task matches agent domain
- Be more explicit in request
- Check `.claude/agents/INDEX.md`

### Wrong Agent Activated

- Be specific: "Use backend-specialist"
- Provide more context
- Check agent descriptions
- Override with explicit request

### Agent Coordination Issues

- Let project-manager orchestrate
- Don't force specific order
- Trust automatic handoffs
- Check coordination patterns

## Agent Performance Tips

### Optimize Context

- Share only relevant files
- Use context-analyzer first
- Keep status.md updated
- Reference specific sections

### Efficient Requests

```markdown
Good: "Using frontend-specialist, create a responsive navbar"
Better: "Using frontend-specialist, create a responsive navbar following our design system in docs/design-system.md"
```

### Model Selection

- **Haiku**: Simple tasks, fast responses
- **Sonnet**: Most development tasks
- **Opus**: Complex architecture, coordination

## Summary

The AI agent system provides specialized expertise for every aspect of development. By understanding each agent's strengths and coordination patterns, you can dramatically improve development efficiency and code quality.

Key takeaways:
- Agents activate automatically or on request
- Each agent has specific expertise
- Agents coordinate naturally
- Trust agent recommendations
- Review output before applying

For the complete list of agents and their detailed specifications, see `.claude/agents/INDEX.md`.
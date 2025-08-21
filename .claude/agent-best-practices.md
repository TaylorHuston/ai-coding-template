# AI Agent Best Practices & Guidelines

**Created**: 2025-08-21
**Last Updated**: 2025-08-21
**Status**: Active
**Target Audience**: Development Team, AI Assistants

Comprehensive guide for creating, using, and maintaining AI agents in this project template.

## Table of Contents

1. [Core Architecture & Structure](#core-architecture--structure)
2. [Design Principles](#design-principles)
3. [Tool Access & Security](#tool-access--security)
4. [Orchestration Patterns](#orchestration-patterns)
5. [System Prompt Best Practices](#system-prompt-best-practices)
6. [Performance Optimization](#performance-optimization)
7. [Workflow Integration](#workflow-integration)
8. [Quality Assurance](#quality-assurance)
9. [Template Customization](#template-customization)

## Core Architecture & Structure

### File Structure Template

```yaml
---
name: agent-name
description: When and how to invoke this agent (include "PROACTIVELY" for auto-use)
tools: tool1, tool2, tool3  # Optional - inherits all if omitted
model: haiku|sonnet|opus   # Optional - model selection for cost optimization
color: blue|green|yellow|red  # Optional - visual identification
---

Multi-paragraph system prompt defining:
- Role and expertise domain
- Specific capabilities and constraints
- Decision-making frameworks
- Integration patterns with other agents
- Project-specific context and patterns
```

### Storage Locations

| Location | Purpose | Precedence |
|----------|---------|------------|
| `.claude/agents/` | Project-specific agents | **High** (overrides global) |
| `~/.claude/agents/` | Global user agents | Low (fallback only) |

**Best Practice**: Always use project-level agents for consistency across team members and project-specific patterns.

### Naming Conventions

- Use kebab-case: `code-architect.md`, `database-specialist.md`
- Be descriptive but concise: `security-auditor.md` not `security.md`
- Match role/domain: `api-designer.md`, `test-engineer.md`
- Avoid generic names: `specialist-frontend.md` not `helper.md`

## Design Principles

### 1. Single Responsibility Principle

**✅ Good Example**:
```yaml
---
name: security-auditor
description: Security assessment, vulnerability detection, compliance validation
---
```

**❌ Avoid**:
```yaml
---
name: full-stack-everything
description: Does frontend, backend, security, testing, deployment, documentation
---
```

### 2. Progressive Development Strategy

1. **Start with template agents** (provided in this repository)
2. **Begin with carefully scoped tool sets**
3. **Progressively expand capabilities** based on validation
4. **Iterate based on real usage patterns**
5. **Customize for specific project needs**

### 3. Context Isolation Benefits

- **Prevents "context pollution"** between different tasks
- **Enables larger task completion** without context contamination
- **Maintains clean conversational threads**
- **Allows specialized focus** without distraction
- **Improves consistency** across similar tasks

## Tool Access & Security

### Security Best Practices

#### Principle of Least Privilege
Only grant tools that are necessary for the agent's specific purpose.

```yaml
# Analysis-focused agent (read-only tools)
tools: Read, Grep, Glob

# Documentation agent (read and write docs)
tools: Read, Write, Edit, MultiEdit, Glob, Grep

# Development agent (broader access)
tools: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite

# Infrastructure agent (broad system access)
tools: Bash, Read, Write, Edit, Grep, Glob, TodoWrite
```

#### Granular Control Examples

| Agent Type | Tool Access | Rationale |
|------------|-------------|-----------|
| **Documentation** | Read, Write, Edit, MultiEdit, Glob, Grep | Documentation management only |
| **Code Review** | Read, Grep, Glob, Bash | Analysis + test execution |
| **Implementation** | Read, Write, Edit, MultiEdit, Bash, TodoWrite | Full development cycle |
| **Database** | Read, Edit, Bash, Grep | SQL execution + schema changes |
| **Security** | Read, Grep, Glob | Security scanning, no modifications |
| **Testing** | Read, Write, Edit, Bash, Grep, Glob | Test creation and execution |

### Environment Security

```bash
# For risky operations, use isolated environments
# Session-specific permissions
claude --tools Read,Grep,Glob

# Review tool usage in agent configurations
grep -r "tools:" .claude/agents/
```

## Orchestration Patterns

### 1. Orchestrator-Worker Pattern (Most Recommended)

```
Project Manager (Coordinator)
├── Code Architect (System Design) 
├── Test Engineer (Quality Assurance)
├── Security Auditor (Security Review)
└── Docs Maintainer (Documentation)
```

**Benefits**:
- Parallel execution
- Specialized expertise
- Clean delegation
- Artifact-based communication

### 2. Sequential Pipeline

```
User Request → Context Analyzer → Specialist Agent → Code Reviewer → Docs Maintainer
```

**Example Workflow**:
```
Feature Request → context-analyzer → code-architect → test-engineer → code-reviewer → docs-maintainer
```

### 3. Parallel Execution

```
User Request → [Agent A + Agent B] (simultaneously) → Merge Results
```

**Example**:
```
Performance Issue → [code-reviewer + database-specialist] → Optimized Solution
```

### 4. Review Chain Pattern

```
Primary Agent → Review Agent → Final Result
```

**Example**:
```
api-designer → security-auditor → Validated API Design
```

## System Prompt Best Practices

### Essential Components

#### 1. Role Definition
```markdown
You are a {specific role} specializing in {domain} with expertise in {technologies}.
Your primary focus is {main responsibility}.
```

#### 2. Capabilities
```markdown
**Core Expertise**:
- {Capability 1} with {specific tools/frameworks}
- {Capability 2} following {specific patterns/principles}
- {Capability 3} ensuring {quality/security/performance}
```

#### 3. Constraints
```markdown
**What NOT to do**:
- Never {prohibited action} without {required condition}
- Avoid {pattern} unless {specific circumstance}
- Don't {action} without considering {important factor}
```

#### 4. Decision Framework
```markdown
**Approach**:
1. Always {first principle}
2. Prefer {option A} over {option B}
3. Apply {methodology} to {domain} decisions
4. Consider {factors} when making choices
```

#### 5. Project Integration
```markdown
**Project Context**:
- Technology stack: {framework}, {language}, {database}
- Architecture patterns: {pattern1}, {pattern2}
- Quality standards: {testing approach}, {coverage targets}
- Documentation approach: {documentation strategy}
```

### Proactive Invocation Patterns

Include these phrases to encourage automatic usage:

```yaml
description: "Use PROACTIVELY after any code changes to ensure quality standards"

description: "MUST BE USED for all {domain}-related work including {specific tasks}"

description: "AUTOMATICALLY INVOKED when {condition} to maintain {quality aspect}"
```

## Performance Optimization

### Model Selection

```yaml
# Cost-effective model selection
model: haiku    # Simple tasks, documentation, basic analysis
model: sonnet   # Standard development, moderate complexity  
model: opus     # Critical tasks, security auditing, complex architecture
```

**Model Selection Guidelines**:

| Task Complexity | Model | Use Cases |
|------------------|-------|-----------|
| **Low** | Haiku | Documentation updates, simple fixes, pattern matching |
| **Medium** | Sonnet | Feature implementation, code review, test creation |
| **High** | Opus | Architecture decisions, security audits, complex debugging |

### Template Agent Assignments

| Model | Agents | Rationale |
|-------|--------|-----------|
| **Haiku** | docs-maintainer, context-analyzer | Pattern-based work, documentation updates |
| **Sonnet** | code-reviewer, test-engineer, api-designer | Standard development, quality assessment |
| **Opus** | project-manager, code-architect, security-auditor | Complex orchestration, strategic decisions |

### Cost-Effective Strategies

1. **Group Related Tasks**: Reduce context switching overhead
2. **Use Appropriate Models**: Match complexity to model capability
3. **Leverage Caching**: Reuse context and analysis results
4. **Progressive Complexity**: Start simple, escalate as needed
5. **Batch Operations**: Group similar tasks together

## Workflow Integration

### Test-Driven Development with Agents

```markdown
1. **test-engineer** creates tests based on requirements
2. Confirm tests fail initially (red phase)
3. **{domain-specialist}** implements code to pass tests (green phase)
4. **code-reviewer** ensures quality and refactoring (refactor phase)
5. **docs-maintainer** updates documentation automatically
```

### Custom Workflow Commands

Store repeated workflows as commands in `.claude/commands/`:

```markdown
<!-- .claude/commands/feature-development -->
# Feature Development Workflow

1. Use context-analyzer to gather relevant documentation
2. Use code-architect for system design (if complex)
3. Use test-engineer to create comprehensive tests
4. Use appropriate specialist for implementation
5. Use code-reviewer for quality validation
6. Use docs-maintainer to update documentation
```

## Quality Assurance

### Quality Gates Implementation

```yaml
# Example quality gate configuration
quality_gates:
  pre_commit:
    - syntax_check: true
    - type_check: true
    - test_run: fast_suite
    - lint_check: true
    
  pre_merge:
    - full_test_suite: true
    - security_scan: true
    - documentation_health: ">= 80%"
    - code_review: required
```

### Agent Performance Monitoring

#### Decision Tracking
- Monitor which agents are invoked and why
- Track interaction patterns between agents
- Identify failure patterns and common issues
- Measure time-to-completion for workflows

#### Quality Metrics
- Success rate of different agent combinations
- Code quality improvements after agent reviews
- Documentation health score improvements
- Test coverage increases

## Template Customization

### Project-Specific Adaptations

#### Technology Stack Customization
```yaml
# Frontend-focused project
technology_focus:
  primary_agents: [ui-specialist, accessibility-expert]
  secondary_agents: [performance-optimizer, test-engineer]
  
# Backend API project  
technology_focus:
  primary_agents: [api-designer, database-specialist, security-auditor]
  secondary_agents: [performance-optimizer, test-engineer]
  
# Full-stack project
technology_focus:
  primary_agents: [code-architect, test-engineer, security-auditor]
  secondary_agents: [ui-specialist, database-specialist]
```

#### Team Size Adaptations
```yaml
# Small team (1-3 developers)
agent_strategy:
  approach: "generalist_agents"
  agents: [code-architect, test-engineer, docs-maintainer]
  
# Medium team (4-8 developers)
agent_strategy:
  approach: "balanced_specialists"
  agents: [code-architect, api-designer, test-engineer, security-auditor, docs-maintainer]
  
# Large team (9+ developers)
agent_strategy:
  approach: "full_specialization"
  agents: [all_template_agents_plus_custom]
```

### Agent Template Variables

When customizing agents, replace these template variables:

- `{PROJECT_NAME}`: Name of the specific project
- `{TECH_STACK}`: Primary technology stack
- `{FRAMEWORK}`: Main framework (React, Django, etc.)
- `{DATABASE}`: Database technology
- `{TESTING_FRAMEWORK}`: Testing library/framework
- `{DEPLOYMENT_PLATFORM}`: Deployment target
- `{TEAM_SIZE}`: Number of team members
- `{PROJECT_PHASE}`: Development phase (startup, growth, maintenance)

## Best Practices Checklist

### Agent Creation
- [ ] Single, clear responsibility defined
- [ ] Appropriate tool access granted
- [ ] Model selection optimized for task complexity
- [ ] Project context included in prompt
- [ ] Auto-invocation patterns configured
- [ ] Integration with other agents considered

### Agent Usage
- [ ] Start with template agents and customize gradually
- [ ] Test agent combinations with representative tasks
- [ ] Monitor performance and success rates
- [ ] Adjust auto-invocation thresholds based on results
- [ ] Document successful patterns for team reference

### Agent Maintenance
- [ ] Regular review of agent effectiveness
- [ ] Update agents as project requirements evolve
- [ ] Remove or consolidate underused agents
- [ ] Keep agent prompts current with technology changes
- [ ] Share successful customizations across projects

## Common Pitfalls and Solutions

### Pitfall: Over-Specialization
**Problem**: Too many narrow agents that don't coordinate well
**Solution**: Start with fewer, broader agents and specialize gradually

### Pitfall: Poor Tool Access
**Problem**: Agents can't perform their intended functions
**Solution**: Review tool access regularly, grant minimum necessary permissions

### Pitfall: Context Overload
**Problem**: Agents receive too much irrelevant context
**Solution**: Use context-analyzer to filter and focus information

### Pitfall: Auto-Invocation Spam
**Problem**: Agents trigger too frequently, creating noise
**Solution**: Tune auto-invocation thresholds, use manual invocation initially

### Pitfall: Inconsistent Results
**Problem**: Same task produces different results with different agents
**Solution**: Standardize prompts, create clear decision frameworks

## Getting Started Guide

### 1. Initial Setup
1. Review template agents in `.claude/agents/`
2. Customize 2-3 core agents for your project
3. Test with simple tasks to validate configuration
4. Gradually expand agent usage based on success

### 2. Team Training
1. Share agent best practices with team
2. Document successful workflow patterns
3. Establish guidelines for when to use which agents
4. Create feedback loops for continuous improvement

### 3. Continuous Improvement
1. Monitor agent usage patterns and success rates
2. Collect feedback from team members
3. Adjust configurations based on real-world performance
4. Share successful patterns with the broader community

---

*This guide provides comprehensive best practices for AI agent usage. Adapt these guidelines to your specific project needs and technology stack.*
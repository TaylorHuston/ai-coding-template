# Claude Code Integration Guide

**Created**: 2025-08-21
**Last Updated**: 2025-09-18
**Status**: Active
**Target Audience**: Development Team, AI Assistants

How the .claude directory components work together with the broader project structure.

## Overview

This integration system provides:

- **Intelligent agent orchestration** for complex tasks
- **Automated quality gates** and workflow enforcement
- **Context-aware documentation** management
- **Progressive project improvement** through specialized agents

## Component Integration Map

```text
Project Root
├── .claude/                    # AI assistant configuration
│   ├── agents/                 # 18 specialized AI agents
│   ├── commands/               # Epic-driven workflow commands
│   ├── working/                # Active development workspace
│   ├── precedence.md          # Configuration precedence rules
│   ├── integration.md         # This file
│   └── agent-best-practices.md # Agent usage guidelines
├── epics/                      # Epic-driven task organization
│   └── [epic-name]/            # Epic directories with EPIC.md and task directories
├── docs/                       # Three-tier documentation system
│   ├── technical/              # Technical documentation and ADRs
│   ├── development/            # Development guidelines and workflows
│   └── ai-tools/               # AI assistant documentation
├── STATUS.md                   # Project status and context preservation
└── CLAUDE.md                  # Main AI assistant instructions
```

## Agent Orchestration Flow

### 1. Context Analysis Phase

```text
User Request
    ↓
context-analyzer (auto-invoked)
    ↓
Gathers: STATUS.md, docs/, epics/, .claude/working/
    ↓
Provides enriched context to specialist agents
```

### 2. Task Execution Phase

```text
Complex Task
    ↓
project-manager (orchestrator)
    ↓
Coordinates: code-architect, api-designer, test-engineer, security-auditor
    ↓
Parallel/Sequential execution based on dependencies
```

### 3. Quality Assurance Phase

```text
Implementation Complete
    ↓
code-reviewer (auto-invoked)
    ↓
If critical: security-auditor
    ↓
docs-maintainer (auto-invoked for existing docs)
    ↓
Update STATUS.md and deliverables/{features,bugs,tasks}/issues/
```

## Workflow Integration Patterns

### Epic Development Workflow

1. **Design Phase**: /design creates epic structure and user stories
2. **Architecture Phase**: /architect defines technical approach with ADRs
3. **Planning Phase**: /plan creates task breakdown with X.Y.Z numbering
4. **Development Phase**: /develop executes tasks with quality gates
5. **Quality Assurance**: code-reviewer, test-engineer, security-auditor
6. **Documentation**: technical-writer updates existing documentation
7. **Status Update**: Update STATUS.md with progress

### Bug Fix Workflow

1. **Analysis**: context-analyzer gathers relevant context
2. **Investigation**: Specialist agents identify root cause
3. **Fix Implementation**: Domain-specific agents implement solution
4. **Testing**: test-engineer creates regression tests
5. **Review**: code-reviewer validates fix
6. **Documentation**: Update troubleshooting guides if needed

### Performance Optimization Workflow

1. **Assessment**: Agents analyze current performance
2. **Bottleneck Identification**: Specialist agents in different domains
3. **Optimization**: Coordinated improvements across stack
4. **Validation**: Performance testing and measurement
5. **Documentation**: Update performance documentation

## Quality Gate Integration

### Automated Quality Checks

```yaml
pre_commit_gates:
  level_1_fast: # < 30 seconds
    - Syntax validation
    - Basic linting
    - Type checking
    
  level_2_comprehensive: # 2-5 minutes
    - Full test suite
    - Security scanning
    - Documentation health check
    
  level_3_premium: # 5-15 minutes
    - Integration tests
    - Performance benchmarks
    - Comprehensive security audit
```

### Quality Escalation Path

1. **Green Zone** (90%+ health): Auto-approve with standard review
2. **Yellow Zone** (80-89%): Human review recommended
3. **Orange Zone** (70-79%): Automated improvement suggestions
4. **Red Zone** (<70%): Block until issues resolved

## Documentation Integration

### Automatic Documentation Sync

```text
Code Changes Detected
    ↓
technical-writer analyzes impact
    ↓
Updates existing documentation:
- API documentation
- Architecture diagrams  
- Component guides
- Troubleshooting guides
    ↓
Runs documentation health check
    ↓
Reports updates in STATUS.md
```

### Documentation Creation Policy

- **Never**: Automatically create new documentation files
- **Ask First**: Suggest new documentation when gaps detected
- **User Requested**: Always create when explicitly asked
- **Update Only**: Automatically update existing documentation

## Agent Auto-Invocation Rules

### Always Auto-Invoked

- **context-analyzer**: Before complex tasks
- **technical-writer**: After code changes affecting existing docs
- **test-engineer**: When test failures detected
- **code-reviewer**: After significant code changes

### Conditionally Auto-Invoked

- **project-manager**: Complex multi-domain tasks
- **security-auditor**: Security-sensitive changes
- **code-architect**: Architectural changes

### Manual Invocation Only

- **api-designer**: API design work
- **database-specialist**: Database optimization
- **technical-writer**: New documentation creation

## Configuration Customization

### Per-Project Adaptation

1. **Technology Stack**: Customize agents for specific frameworks
2. **Team Preferences**: Adjust auto-invocation thresholds  
3. **Quality Standards**: Configure quality gate requirements
4. **Workflow Patterns**: Adapt command templates to team practices

### Agent Customization Examples

```yaml
# Frontend-focused project
agents:
  priority: [ui-specialist, accessibility-expert, performance-optimizer]
  auto_invoke: component-changes

# Backend API project  
agents:
  priority: [api-designer, database-specialist, security-auditor]
  auto_invoke: schema-changes

# Full-stack project
agents:
  priority: [code-architect, test-engineer, security-auditor]
  auto_invoke: feature-changes
```

## Integration with External Tools

### Issue Tracking Systems

- **Jira**: Map agent workflows to Jira automation
- **Linear**: Integrate with Linear issue states
- **GitHub Issues**: Connect with GitHub Actions

### CI/CD Integration

- **Quality Gates**: Integrate with CI pipeline checks
- **Automated Reviews**: Agent-powered code review in PRs
- **Documentation Sync**: Auto-update docs in deployment pipeline

### Development Tools

- **IDE Integration**: Agent suggestions in development environment
- **Git Hooks**: Agent-powered pre-commit and pre-push checks
- **Testing Frameworks**: Agent-assisted test generation and fixing

## Monitoring and Analytics

### Agent Usage Tracking

- Which agents are most frequently used
- Success rates of different workflows
- Time to completion for various task types
- Quality improvement trends

### Quality Metrics

- Documentation health score trends
- Test coverage improvements
- Security issue detection and resolution
- Performance optimization results

### Workflow Optimization

- Identify bottlenecks in agent workflows
- Optimize agent coordination patterns
- Improve auto-invocation accuracy
- Reduce manual intervention needs

## Getting Started

### Initial Setup

1. Review and customize agent configurations in `.claude/agents/`
2. Test agent workflows with sample tasks
3. Configure quality gates for your project needs
4. Set up monitoring and metrics tracking
5. Train team on agent usage patterns

### Best Practices

- Start with conservative auto-invocation settings
- Gradually increase automation as confidence builds
- Regularly review and optimize agent performance
- Keep agent configurations updated with project evolution
- Document custom workflows and patterns

## Troubleshooting

### Common Issues

- **Agent conflicts**: Check precedence.md for resolution rules
- **Performance issues**: Review agent resource usage
- **Quality gate failures**: Check rule configurations
- **Documentation sync issues**: Verify technical-writer settings

### Support Resources

- [Agent Best Practices](agent-best-practices.md)
- [AI Tools Reference](../docs/ai-tools/reference/)
- [Project Status](../STATUS.md)
- [Technical Documentation](../docs/technical/)

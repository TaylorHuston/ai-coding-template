---
version: "0.1.0"
created: "2025-09-15"
status: "active"
target_audience: ["ai-assistants", "developers"]
document_type: "reference"
priority: "critical"
tags: ["agents", "coordination", "workflows"]
---

# AI Agents Directory

**Documentation for the 17 specialized AI agents and their coordination.**

This directory contains detailed documentation for each AI agent, including their capabilities, usage patterns, and coordination strategies.

## Agent Documentation Location

The complete agent documentation is located in `.claude/agents/INDEX.md` which provides:

- **Agent Classification** by domain expertise
- **Capability Matrix** showing what each agent handles
- **Usage Patterns** for automatic vs on-demand agents
- **Coordination Workflows** for multi-agent tasks
- **Selection Guidelines** based on task complexity
- **Performance Metrics** and optimization strategies

## Quick Agent Reference

### Auto-Invoked Agents (8)
These activate automatically based on task context:
1. **project-manager** - Complex/multi-domain coordination
2. **context-analyzer** - Investigation and root cause analysis
3. **frontend-specialist** - UI/UX development
4. **backend-specialist** - Server-side implementation
5. **database-specialist** - All database operations
6. **test-engineer** - Test creation and strategy
7. **code-reviewer** - Post-implementation quality reviews
8. **docs-sync-agent** - After code changes affecting docs

### On-Demand Specialists (9)
Invoke these for specific domains:
1. **code-architect** - System design and architecture
2. **api-designer** - API architecture and endpoints
3. **security-auditor** - Security audits and compliance
4. **devops-engineer** - Infrastructure and deployment
5. **performance-optimizer** - Performance analysis
6. **technical-writer** - New documentation creation
7. **refactoring-specialist** - Code improvement
8. **migration-specialist** - Version upgrades
9. **data-analyst** - Data processing and reporting

## Common Coordination Patterns

### Sequential Workflows
For feature development:
```
project-manager → specialists → code-reviewer → security-auditor → devops-engineer
```

### Parallel Workflows
For comprehensive analysis:
```
security-auditor + performance-optimizer + code-reviewer + database-specialist
```

## Agent Selection by Task Type

| Task Type | Primary Agents | Supporting Agents |
|-----------|----------------|-------------------|
| **Feature Development** | frontend/backend-specialist | database-specialist, test-engineer |
| **Bug Investigation** | context-analyzer | relevant domain specialists |
| **Performance Issues** | performance-optimizer | database-specialist, devops-engineer |
| **Security Review** | security-auditor | code-reviewer, devops-engineer |
| **Code Quality** | code-reviewer | refactoring-specialist |
| **Architecture** | code-architect | project-manager |
| **Documentation** | technical-writer | docs-sync-agent |

## Usage Guidelines

### For Developers
- Reference the agent index when unsure which agent to use
- Use project-manager for complex tasks requiring multiple domains
- Allow auto-invoked agents to activate naturally during development

### For AI Assistants
- Always check `.claude/agents/INDEX.md` for complete agent capabilities
- Follow coordination patterns for multi-agent workflows
- Use appropriate model complexity (haiku/sonnet/opus) based on task requirements

### For Team Leads
- Monitor agent effectiveness using the performance metrics
- Adjust agent selection patterns based on team needs
- Use coordination patterns to establish consistent workflows

## Integration with Template

The agent system integrates with:
- **Quality Standards** (`../development/guidelines/quality-standards.md`)
- **AI Collaboration Guide** (`./guides/ai-collaboration-guide.md`)
- **Tool Selection** (`./reference/tool-selection.md`)
- **Troubleshooting** (`./reference/troubleshooting.md`)

## Future Enhancements

This agent documentation will be expanded to include:
- Individual agent documentation files
- Detailed workflow examples
- Agent customization guides
- Performance optimization strategies

---

**Full Documentation**: See `.claude/agents/INDEX.md` for complete agent system documentation.

**Related**: [AI Collaboration Guide](../guides/ai-collaboration-guide.md) | [Tool Selection](../reference/tool-selection.md) | [Troubleshooting](../reference/troubleshooting.md)
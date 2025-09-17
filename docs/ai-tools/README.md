---
version: "0.1.0"
created: "2025-09-15"
status: "active"
target_audience: ["ai-assistants", "developers"]
document_type: "reference"
priority: "critical"
tags: ["ai-template", "agents", "automation"]
---

# AI Tools Documentation

**Documentation for AI tools, agents, and automated workflows.**

This directory contains all documentation for AI tools and systems. This is the documentation you need to understand and work with the AI agent system, automation tools, and AI-powered workflows.

## System Overview

- **[system-context.md](./system-context.md)** - High-level architecture of the AI tools system

## Directory Structure

### `/guides/`
**Comprehensive guides and patterns**
- **ai-agents-guide.md** - Complete guide to the 17-agent system
- **ai-collaboration-guide.md** - Patterns for effective AI collaboration
- **using-agents.md** - Practical guide for working with AI agents

### `/setup/`
**Template installation and configuration**
- **integration-guide.md** - Adding this template to existing projects
- **quick-start.md** - Fast setup for new projects
- **mcp-setup.md** - MCP server setup and enhanced AI capabilities
- **project-management-integration.md** - Jira, Linear, GitHub integration
- **rag-setup.md** - RAG system configuration for large codebases

### `/reference/`
**Quick reference and troubleshooting**
- **setup-manager.md** - **NEW: Intelligent project initialization system**
- **commands.md** - Complete slash commands reference for AI workflows
- **ai-assistant-guide.md** - Working with AI assistants effectively
- **development-commands.md** - Common CLI development commands and scripts
- **tool-selection.md** - Choosing the right tools for tasks
- **troubleshooting.md** - Comprehensive troubleshooting guide

## Key Features of This Template

### 17 Specialized AI Agents
- **Architecture**: code-architect, project-manager, context-analyzer
- **Development**: frontend-specialist, backend-specialist, database-specialist, api-designer
- **Quality**: test-engineer, code-reviewer, security-auditor, refactoring-specialist
- **Operations**: devops-engineer, performance-optimizer, migration-specialist
- **Documentation**: technical-writer, docs-sync-agent, data-analyst

### Smart Context Management
- Preserve project knowledge across AI sessions
- Structured approach to AI-human collaboration
- Advanced memory management for long-term continuity

### Automated Quality Gates
- Pre-commit hooks for quality validation
- Automated testing and linting integration
- Security scanning and compliance checks

### Template Integration
- Works with new projects or existing codebases
- Gradual adoption strategies
- Integration with popular development tools

## Getting Started

### For New Projects
1. Read `/setup/quick-start.md` for fast setup
2. Review `/guides/ai-agents-guide.md` to understand the agent system
3. Follow `/setup/mcp-setup.md` for enhanced AI capabilities

### For Existing Projects
1. Start with `/setup/integration-guide.md`
2. Choose gradual adoption strategy from the integration guide
3. Configure only the agents and features you need

### For AI Assistants
1. Start with `/guides/using-agents.md` for practical agent usage
2. Reference `/guides/ai-collaboration-guide.md` for advanced patterns
3. Use `/reference/commands.md` for slash command workflows
4. Follow `/reference/troubleshooting.md` for issue resolution

## Core Workflows

### Agent Coordination
- Use project-manager for complex multi-domain tasks
- Coordinate frontend-specialist + backend-specialist for full-stack features
- Follow code-reviewer → security-auditor → performance-optimizer for quality assurance

### Context Preservation
- Always read STATUS.md first to understand current project state
- Update STATUS.md after significant progress or decisions
- Use deliverables/ directory for organized issue tracking

### Quality Assurance
- Use `/reference/commands.md` for systematic quality workflows
- Follow automated quality gates for consistent standards
- Apply patterns from `/guides/ai-collaboration-guide.md`

## Tool Integration

### MCP Servers
- **context7** - Official library documentation access
- **sequential-thinking** - Multi-step reasoning for complex problems
- **gemini-cli** - Second opinions and massive context analysis
- **playwright** - Browser automation and testing
- **magic** - Modern UI component generation

### Development Tools
- Git hooks for automated quality checks
- Scripts for project health monitoring
- Documentation generation and maintenance
- Automated changelog management

### AI Platforms
- Optimized for Claude Code but adaptable to other assistants
- Works with VS Code, Cursor, and other IDEs
- Integration patterns for team collaboration

## Troubleshooting

### Common Issues
- **Agent not responding**: Check `/reference/troubleshooting.md`
- **MCP connection issues**: See `/setup/mcp-setup.md`
- **Integration problems**: Reference `/setup/integration-guide.md`
- **Generic AI responses**: Review `/guides/using-agents.md`

### Getting Help
- Start with troubleshooting guides in `/reference/`
- Check agent-specific documentation in `/agents/`
- Review integration guides in `/setup/`

## Template Philosophy

This template is designed to:
- **Augment, not replace** human developers
- **Scale AI assistance** across development teams
- **Maintain code quality** while increasing development velocity
- **Preserve context** across long development sessions
- **Support both new and existing** project integration

---

**Related Documentation**: [Project Documentation](../project/README.md) | [Development Documentation](../development/README.md) | [Root Documentation](../README.md)
# Documentation Index

**Version**: 1.0.0
**Created**: 2025-09-15
**Last Updated**: 2025-09-15
**Status**: Active
**Target Audience**: All Users - Developers, AI Assistants, Product Teams

## Quick Navigation

### 🚀 Getting Started
- **[Main README](../README.md)** - Project overview and quick start
- **[Setup Guide](./setup/README.md)** - Installation and configuration
- **[Integration Guide](./setup/integration-guide.md)** - Add to existing projects

### 🏗️ Core Architecture
- **[AI Agents Guide](./ai-agents-guide.md)** - Complete agent reference
- **[Quality Standards](./quality-standards.md)** - Development requirements
- **[System Guidelines](../CLAUDE.md)** - AI assistant instructions and system design

### 📚 How-To Guides
- **[AI-Assisted Development](../ai-collaboration/prompting.md)** - Effective AI collaboration
- **[Context Engineering](../ai-collaboration/context-engineering.md)** - Managing AI context
- **[Branching Strategy](../ai-collaboration/ai-branching-strategy.md)** - Git workflow for AI
- **[Changelog Maintenance](./guides/project-guidelines/changelog-maintenance.md)** - Automated changelog
- **[Testing Strategy](./guides/implementation/testing/tdd-strategy.md)** - TDD with AI assistance
- **[Local Environment](./guides/implementation/environment-setup.md)** - Development setup
- **[Deployment Patterns](./guides/implementation/deployment-patterns.md)** - Production deployment
- **[RAG Setup](./guides/implementation/rag-setup.md)** - Retrieval augmented generation

### 🔧 Reference Materials
- **[Development Commands](./reference/development-commands.md)** - Common CLI commands
- **[Tool Selection](./reference/tool-selection.md)** - Tool usage patterns
- **[AI Assistant Guide](./reference/ai-assistant-guide.md)** - AI interaction patterns
- **[MCP Quick Start](./reference/mcp-quick-start.md)** - MCP server reference
- **[Troubleshooting](./reference/troubleshooting-checklist.md)** - Common issues

### 🏛️ System Architecture
- **[System Design](./architecture/system-design.md)** - Overall architecture
- **[User Authentication](./architecture/user-authentication-architecture.md)** - Auth system design

### 🔄 Workflows & Processes
- **[Development Workflows](./workflows/README.md)** - Standard processes
- **[Documentation Guidelines](./documentation-guidelines.md)** - Writing standards

### 📝 Document Templates
- **[Simple Feature Template](./templates/simple/feature-simple.template.md)** - Basic feature docs
- **[Standard Feature Template](./templates/standard/feature.template.md)** - Comprehensive docs
- **[API Documentation Template](./templates/api.template.md)** - API reference
- **[Architecture Template](./templates/architecture.template.md)** - System design

### 🔍 Troubleshooting & Support
- **[Troubleshooting Guide](./troubleshooting.md)** - Common issues and solutions
- **[Setup Issues](./setup/README.md#troubleshooting)** - Installation problems

## Documentation Categories

### By Audience

#### For Developers
- [AI Agents Guide](./ai-agents-guide.md)
- [System Guidelines](../CLAUDE.md)
- [Development Commands](./reference/development-commands.md)
- [Testing Strategy](./guides/implementation/testing/tdd-strategy.md)
- [Architecture Docs](./architecture/)

#### For AI Assistants
- [AI-Specific Guides](../ai-collaboration/prompting.md)
- [Context Engineering](../ai-collaboration/context-engineering.md)
- [Changelog Maintenance](./guides/project-guidelines/changelog-maintenance.md)
- [Quality Standards](./quality-standards.md)

#### For Project Managers
- [Setup and Integration](./setup/)
- [Quality Requirements](./quality-standards.md)
- [Documentation Standards](./documentation-guidelines.md)

### By Purpose

#### Getting Started
1. [Main README](../README.md) - Project overview
2. [Setup Guide](./setup/README.md) - Initial setup
3. [Integration Guide](./setup/integration-guide.md) - Add to existing project
4. [AI Agents Guide](./ai-agents-guide.md) - Using the agent system

#### Implementation
- [System Guidelines](../CLAUDE.md)
- [Architecture Examples](./architecture/)
- [Development Workflows](./workflows/)
- [Testing Guides](./guides/testing-strategy-tdd.md)

#### Maintenance
- [Quality Standards](./quality-standards.md)
- [Documentation Guidelines](./documentation-guidelines.md)
- [Troubleshooting](./troubleshooting.md)
- [Changelog Management](./guides/ai-changelog-maintenance.md)

## Search by Topic

### AI & Machine Learning
- [AI Agents Guide](./ai-agents-guide.md)
- [Prompting Guide](../ai-collaboration/prompting.md)
- [Context Engineering](../ai-collaboration/context-engineering.md)
- [AI Branching Strategy](../ai-collaboration/ai-branching-strategy.md)
- [AI Architecture Patterns](../ai-collaboration/ai-architecture-patterns.md)

### Development & Testing
- [Testing Strategy (TDD)](./guides/implementation/testing/tdd-strategy.md)
- [Test Benchmarking](./guides/implementation/testing/benchmarking.md)
- [Local Environment Setup](./guides/implementation/environment-setup.md)
- [Development Commands](./reference/development-commands.md)

### Architecture & Design
- [AI Agent System](./ai-agents-guide.md)
- [System Design](./architecture/examples/system-overview.md)
- [User Authentication](./architecture/user-authentication-architecture.md)
- [Architecture Templates](./templates/architecture.template.md)

### Setup & Integration
- [Setup Hub](./setup/README.md)
- [Integration Guide](./setup/integration-guide.md)
- [MCP Configuration](./setup/mcp-configuration-guide.md)
- [Project Management Integration](./setup/project-management-integration.md)
- [Deployment Guide](./setup/deployment-guide.md)

### Documentation & Processes
- [Documentation Guidelines](./documentation-guidelines.md)
- [Quality Standards](./quality-standards.md)
- [Document Templates](./templates/)
- [Changelog Maintenance](./guides/project-guidelines/changelog-maintenance.md)

## Common Tasks

| I want to... | Go here |
|---------------|---------|
| **Start using this template** | [Setup Guide](./setup/README.md) |
| **Add to existing project** | [Integration Guide](./setup/integration-guide.md) |
| **Understand the agent system** | [AI Agents Guide](./ai-agents-guide.md) |
| **Learn effective AI prompting** | [Prompting Guide](../ai-collaboration/prompting.md) |
| **Set up development environment** | [Local Environment Setup](./guides/implementation/environment-setup.md) |
| **Create documentation** | [Documentation Guidelines](./documentation-guidelines.md) |
| **Understand system architecture** | [AI Agents Guide](./ai-agents-guide.md) |
| **Troubleshoot issues** | [Troubleshooting Guide](./troubleshooting.md) |
| **Find command references** | [Development Commands](./reference/development-commands.md) |
| **Configure deployment** | [Deployment Guide](./setup/deployment-guide.md) |

## Contributing to Documentation

### Adding New Documentation
1. Follow [Documentation Guidelines](./documentation-guidelines.md)
2. Use appropriate [templates](./templates/)
3. Add to this index in the relevant section
4. Update related navigation files

### Updating Existing Documentation
1. Maintain version headers and update dates
2. Follow single source of truth principle
3. Update cross-references as needed
4. Test all links and examples

## File Organization

```
docs/
├── INDEX.md                     # This file - complete navigation
├── README.md                    # Documentation hub (alternative entry)
├── ai-agents-guide.md           # Agent system reference
├── quality-standards.md         # Development requirements
├── documentation-guidelines.md  # Writing standards
├── troubleshooting.md          # Problem solving
├── setup/                      # Setup and integration
├── guides/                     # How-to documentation
├── reference/                  # Quick reference materials
├── architecture/               # System design documents
├── workflows/                  # Process documentation
├── templates/                  # Document templates
└── archived/                   # Deprecated content
```

---

*This index provides comprehensive navigation for all project documentation. For contribution guidelines, see [Documentation Guidelines](./documentation-guidelines.md).*
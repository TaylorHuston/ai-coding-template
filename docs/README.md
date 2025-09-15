---
version: "0.1.0"
created: "2025-08-22"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "project-managers", "ai-assistants"]
document_type: "guide"
tags: ["documentation", "hub", "navigation"]
---

# Documentation Hub

## Quick Start

### I need to create documentation...

**🔧 For developers and technical implementation?**
→ [Technical Documentation Guide](project/architecture/README.md) | [Use Technical Template](development/templates/simple/feature-simple.template.md)

**📊 For product managers and business stakeholders?**
→ [Documentation Guidelines](development/guidelines/documentation-guidelines.md) | [Use Simple Template](development/templates/simple/feature-simple.template.md)

**📝 For comprehensive/enterprise features?**
→ Use [Standard Technical Template](development/templates/standard/feature.template.md) with comprehensive documentation

### I need to understand the system...

**📚 Documentation standards and guidelines?**
→ [Documentation Guidelines](development/guidelines/documentation-guidelines.md)

**🎯 See examples of good documentation?**
→ [Technical Examples](project/architecture/examples/) | [System Design Example](project/architecture/examples/system-overview.md)

## Documentation Map

```
📁 docs/
├── 🏠 README.md                     # You are here - Central hub
├── 📋 project/                      # YOUR project's documentation
│   ├── architecture/                # System design, C4 diagrams, ADRs
│   ├── api/                         # API specs, endpoint docs
│   ├── database/                    # Schema, ERDs, migrations
│   └── decisions/                   # Architecture Decision Records
├── 🔧 development/                  # Team processes & guidelines
│   ├── guidelines/                  # Code quality, documentation standards
│   │   ├── quality-standards.md     # Quality requirements & validation
│   │   ├── documentation-guidelines.md # Documentation standards
│   │   └── *.md                     # Other team guidelines
│   ├── workflows/                   # Git, testing, deployment processes
│   ├── setup/                       # Development environment setup
│   └── templates/                   # Document templates
│       ├── simple/                  # Quick-start templates
│       └── standard/                # Comprehensive templates
├── 🤖 ai-template/                  # AI assistant & template docs
│   ├── setup/                       # Template integration guides
│   │   ├── integration-guide.md     # Project integration
│   │   ├── quick-start.md           # Fast setup guide
│   │   └── mcp-configuration-guide.md # MCP server setup
│   ├── reference/                   # Commands, tools, troubleshooting
│   │   ├── development-commands.md  # Common commands
│   │   ├── tool-selection.md        # Tool usage patterns
│   │   └── troubleshooting.md       # Problem solving guide
│   ├── guides/                      # AI collaboration patterns
│   │   ├── ai-agents-guide.md       # Complete agent system reference
│   │   └── ai-collaboration-guide.md # AI development patterns
│   └── agents/                      # Agent documentation & workflows
└── 📦 archived/                     # Deprecated content
    └── *.md                         # Archived documentation
```

## Documentation Types

### Project Documentation (Project-Specific)
- **Purpose**: Your project's architecture, API specs, database design
- **Location**: `docs/project/`
- **Audience**: Project team, stakeholders, new developers
- **When to use**: System architecture, API design, database schemas, technical decisions

### Development Documentation (Team Processes)
- **Purpose**: Development workflows, coding standards, team guidelines
- **Location**: `docs/development/`
- **Audience**: Development team, contributors, code reviewers
- **When to use**: Team standards, workflow processes, quality guidelines

### AI Template Documentation (Template-Specific)
- **Purpose**: AI assistant usage, template features, automation tools
- **Location**: `docs/ai-template/`
- **Audience**: AI assistants, developers using this template
- **When to use**: Agent coordination, template setup, AI collaboration patterns

## Template Selection Guide

### For Simple Features (Most Common)

**Technical**: Use [Simple Technical Template](development/templates/simple/feature-simple.template.md)
- Basic architecture description
- Key implementation details
- Essential testing information
- ~5-7 sections, ~50-75 lines

**Process**: Use [Documentation Guidelines](development/guidelines/documentation-guidelines.md)
- Clear objectives and success criteria
- Key requirements and implementation notes
- Testing and validation approach
- ~5-7 sections, ~50-75 lines

### For Complex/Enterprise Features

**Technical**: Use [Standard Technical Template](development/templates/standard/feature.template.md)
- Comprehensive architecture analysis
- Detailed implementation specifications
- Complete testing and security coverage
- ~15+ sections, ~200+ lines

**Process**: Use comprehensive documentation approach
- Detailed workflow analysis
- Comprehensive process planning
- Risk assessment and mitigation
- ~13+ sections, ~200+ lines

## Decision Tree

```
┌─ Need documentation? ────────────────────────────────────┐
│                                                           │
├─ For developers/technical team? ───── YES ──→ Technical  │
│  │                                                       │
│  └─ NO ──→ For process/workflow docs? ──→ Guidelines     │
│                                                           │
├─ Simple feature (<2 weeks dev)? ──── YES ──→ Simple      │
│  │                                                       │
│  └─ NO ──→ Complex/enterprise feature? ──→ Standard      │
│                                                           │
└─ Updating existing docs? ──→ Follow original template    │
```

## Getting Started

### New Technical Document
1. Copy [Simple Technical Template](development/templates/simple/feature-simple.template.md)
2. Save as `project/architecture/[feature-name]-architecture.md`
3. Fill in required sections, remove unused sections
4. Follow [Technical Documentation Guide](project/architecture/README.md)

### New Process Document
1. Follow [Documentation Guidelines](development/guidelines/documentation-guidelines.md)
2. Save as `development/workflows/[process-name].md` or `development/guidelines/[guide-name].md`
3. Fill in required sections, remove unused sections
4. Use appropriate templates from `development/templates/` directory

### Complex Features
- Start with simple template to outline basics
- Upgrade to standard template when detail is needed
- Use standard templates for enterprise features

## Key Documentation Principles

1. **Single Source of Truth**: Don't duplicate information - reference the authoritative source
2. **Audience-Focused**: Write for your specific audience (developers vs business users)
3. **Template-Driven**: Use templates to ensure consistency and completeness
4. **Evidence-Based**: Support all claims with verifiable information
5. **Living Documents**: Keep documentation current with implementation

## Setup and Integration

### 🚀 [AI Template Setup Hub](./ai-template/setup/)
Complete integration and setup guidance for new and existing projects.

- **[Integration Guide](./ai-template/setup/integration-guide.md)**: Project integration strategies
- **[Quick Start](./ai-template/setup/quick-start.md)**: Fast setup for new projects
- **[MCP Configuration](./ai-template/setup/mcp-configuration-guide.md)**: MCP server setup
- **[Project Management](./ai-template/setup/project-management-integration.md)**: PM tool integration

## Quick Reference

| I want to... | Go here |
|---------------|---------|
| **Setup & integrate this template** | **[AI Template Setup](ai-template/setup/)** |
| **Get quick development commands** | **[Reference Hub](ai-template/reference/README.md)** |
| **Start using this template** | [Quick Start Guide](./ai-template/setup/quick-start.md) |
| **Add to existing project** | [Integration Guide](./ai-template/setup/integration-guide.md) |
| **Understand the agent system** | [AI Agents Guide](./ai-template/guides/ai-agents-guide.md) |
| **Learn effective AI prompting** | [AI Collaboration Guide](./ai-template/guides/ai-collaboration-guide.md#effective-ai-communication) |
| **Set up development environment** | [Local Environment Setup](./development/setup/environment-setup.md) |
| **Troubleshoot issues** | [Troubleshooting Guide](./ai-template/reference/troubleshooting.md) |
| **Find command references** | [Development Commands](./ai-template/reference/development-commands.md) |
| **Configure deployment** | [Deployment Guide](./development/workflows/deployment-guide.md) |
| Create simple technical docs | [Simple Technical Template](development/templates/simple/feature-simple.template.md) |
| Create process documentation | [Documentation Guidelines](development/guidelines/documentation-guidelines.md) |
| Create comprehensive docs | [Standard Templates](development/templates/standard/) |
| Understand documentation standards | [Documentation Guidelines](development/guidelines/documentation-guidelines.md) |
| Understand quality requirements | [Quality Standards](development/guidelines/quality-standards.md) |
| See examples | [Technical Examples](project/architecture/examples/) |
| Get technical guidance | [Architecture Guide](project/architecture/README.md) |
| Get process guidance | [Documentation Guidelines](development/guidelines/documentation-guidelines.md) |
| Browse how-to guides | [AI Template Guides](ai-template/guides/) |

## Search by Topic

### AI & Machine Learning

- [AI Agents Guide](./ai-template/guides/ai-agents-guide.md)
- [AI Collaboration Guide](./ai-template/guides/ai-collaboration-guide.md) - Essential AI development patterns
  - [Effective Communication](./ai-template/guides/ai-collaboration-guide.md#effective-ai-communication)
  - [Context Management](./ai-template/guides/ai-collaboration-guide.md#context-management)
  - [Branching Strategy](./ai-template/guides/ai-collaboration-guide.md#ai-branching-strategy)
  - [Architecture Patterns](./ai-template/guides/ai-collaboration-guide.md#architecture-patterns-for-ai-development)

### Development & Testing

- [Testing Strategy (TDD)](./development/workflows/tdd-strategy.md)
- [Test Benchmarking](./development/workflows/benchmarking.md)
- [Local Environment Setup](./development/setup/environment-setup.md)
- [Development Commands](./ai-template/reference/development-commands.md)

### Architecture & Design

- [AI Agent System](./ai-template/guides/ai-agents-guide.md)
- [System Design](./project/architecture/examples/system-overview.md)
- [Documentation Templates](./development/templates/README.md)

### Setup & Integration

- [AI Template Setup](./ai-template/setup/)
- [Integration Guide](./ai-template/setup/integration-guide.md)
- [Quick Start Guide](./ai-template/setup/quick-start.md)
- [MCP Configuration](./ai-template/setup/mcp-configuration-guide.md)
- [Project Management Integration](./ai-template/setup/project-management-integration.md)
- [Deployment Guide](./development/workflows/deployment-guide.md)

### Documentation & Processes

- [Documentation Guidelines](./development/guidelines/documentation-guidelines.md)
- [Quality Standards](./development/guidelines/quality-standards.md)
- [Document Templates](./development/templates/)
- [Changelog Maintenance](./development/guidelines/changelog-maintenance.md)

## Support

- **Documentation Questions**: See [Documentation Guidelines](development/guidelines/documentation-guidelines.md)
- **Template Issues**: Use existing examples as reference
- **Process Improvements**: Submit feedback through your team's standard channels

---

**Next Steps**: Choose your documentation type above and get started with the appropriate template and guide.

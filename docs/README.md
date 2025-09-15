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
→ [Technical Documentation Guide](architecture/README.md) | [Use Technical Template](templates/simple/feature-simple.template.md)

**📊 For product managers and business stakeholders?**
→ [Documentation Guidelines](documentation-guidelines.md) | [Use Simple Template](templates/simple/feature-simple.template.md)

**📝 For comprehensive/enterprise features?**
→ Use [Standard Technical Template](templates/standard/feature.template.md) with comprehensive documentation

### I need to understand the system...

**📚 Documentation standards and guidelines?**
→ [Documentation Guidelines](documentation-guidelines.md)

**🎯 See examples of good documentation?**
→ [Technical Example](architecture/user-authentication-architecture.md) | [System Design Example](architecture/system-design.md)

## Documentation Map

```
📁 docs/
├── 🏠 README.md                    # You are here - Central hub
├── 📋 documentation-guidelines.md   # Documentation standards & guidelines
├── 🔧 ai-agents-guide.md           # Complete agent system reference
├── 📊 quality-standards.md         # Quality requirements & validation
├── 🛠️ setup/                      # Integration & setup guides
│   ├── README.md                   # Setup hub
│   ├── integration-guide.md        # Project integration
│   ├── mcp-configuration-guide.md  # MCP server setup
│   ├── project-management-integration.md # PM tools
│   └── deployment-guide.md         # Production deployment
├── 📚 guides/                      # How-to guides & tutorials
│   ├── ai-*.md                     # AI-specific guides
│   ├── testing-*.md                # Testing guides
│   └── *.md                        # Other implementation guides
├── 📖 reference/                   # Quick reference materials
│   ├── README.md                   # Reference hub
│   ├── development-commands.md     # Common commands
│   ├── tool-selection.md           # Tool usage patterns
│   └── *.md                        # Reference materials
├── 🏗️ architecture/               # Technical documentation
│   ├── README.md                   # Architecture guide
│   └── *.md                        # Architecture documents
├── 🧩 workflows/                   # Process workflows
│   └── *.md                        # Workflow documentation
├── 📝 templates/                   # Document templates
│   ├── simple/                     # Quick-start templates
│   └── standard/                   # Comprehensive templates
└── 📦 archived/                    # Deprecated content
    └── *.md                        # Archived documentation
```

## Documentation Types

### Technical Documentation (Developer-Focused)
- **Purpose**: Implementation details, system design, code patterns
- **Location**: `docs/architecture/`
- **Audience**: Developers, AI assistants, technical contributors
- **When to use**: System architecture, API design, database schemas, code implementation

### Process Documentation (Workflow-Focused)
- **Purpose**: Development workflows, processes, and business requirements
- **Location**: `docs/workflows/` and `docs/guides/`
- **Audience**: Product managers, stakeholders, development teams
- **When to use**: Process documentation, workflow guides, team standards

## Template Selection Guide

### For Simple Features (Most Common)

**Technical**: Use [Simple Technical Template](templates/simple/feature-simple.template.md)
- Basic architecture description
- Key implementation details
- Essential testing information
- ~5-7 sections, ~50-75 lines

**Process**: Use [Documentation Guidelines](documentation-guidelines.md)
- Clear objectives and success criteria
- Key requirements and implementation notes
- Testing and validation approach
- ~5-7 sections, ~50-75 lines

### For Complex/Enterprise Features

**Technical**: Use [Standard Technical Template](templates/standard/feature.template.md)
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
1. Copy [Simple Technical Template](templates/simple/feature-simple.template.md) 
2. Save as `architecture/[feature-name]-architecture.md`
3. Fill in required sections, remove unused sections
4. Follow [Technical Documentation Guide](architecture/README.md)

### New Process Document
1. Follow [Documentation Guidelines](documentation-guidelines.md)
2. Save as `workflows/[process-name].md` or `guides/[guide-name].md`
3. Fill in required sections, remove unused sections
4. Use appropriate templates from `templates/` directory

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

### 🚀 [Setup Hub](./setup/README.md)
Complete integration and setup guidance for new and existing projects.

- **[Integration Guide](./setup/integration-guide.md)**: Project integration strategies
- **[MCP Configuration](./setup/mcp-configuration-guide.md)**: MCP server setup
- **[Project Management](./setup/project-management-integration.md)**: PM tool integration  
- **[Deployment Guide](./setup/deployment-guide.md)**: Production deployment

## Quick Reference

| I want to... | Go here |
|---------------|---------|
| **Setup & integrate this template** | **[Setup Hub](setup/README.md)** |
| **Get quick development commands** | **[Reference Hub](reference/README.md)** |
| **Start using this template** | [Setup Guide](./setup/README.md) |
| **Add to existing project** | [Integration Guide](./setup/integration-guide.md) |
| **Understand the agent system** | [AI Agents Guide](./ai-agents-guide.md) |
| **Learn effective AI prompting** | [AI Collaboration Guide](./ai-collaboration-guide.md#effective-ai-communication) |
| **Set up development environment** | [Local Environment Setup](./guides/implementation/environment-setup.md) |
| **Troubleshoot issues** | [Troubleshooting Guide](./troubleshooting.md) |
| **Find command references** | [Development Commands](./reference/development-commands.md) |
| **Configure deployment** | [Deployment Guide](./setup/deployment-guide.md) |
| Create simple technical docs | [Simple Technical Template](templates/simple/feature-simple.template.md) |
| Create process documentation | [Documentation Guidelines](documentation-guidelines.md) |
| Create comprehensive docs | [Standard Templates](templates/standard/) |
| Understand documentation standards | [Documentation Guidelines](documentation-guidelines.md) |
| Understand quality requirements | [Quality Standards](quality-standards.md) |
| See examples | [Technical Example](architecture/user-authentication-architecture.md) \| [System Design Example](architecture/system-design.md) |
| Get technical guidance | [Architecture Guide](architecture/README.md) |
| Get process guidance | [Documentation Guidelines](documentation-guidelines.md) |
| Browse how-to guides | [Guides Directory](guides/) |

## Search by Topic

### AI & Machine Learning

- [AI Agents Guide](./ai-agents-guide.md)
- [AI Collaboration Guide](./ai-collaboration-guide.md) - Essential AI development patterns
  - [Effective Communication](./ai-collaboration-guide.md#effective-ai-communication)
  - [Context Management](./ai-collaboration-guide.md#context-management)
  - [Branching Strategy](./ai-collaboration-guide.md#ai-branching-strategy)
  - [Architecture Patterns](./ai-collaboration-guide.md#architecture-patterns-for-ai-development)

### Development & Testing

- [Testing Strategy (TDD)](./guides/implementation/testing/tdd-strategy.md)
- [Test Benchmarking](./guides/implementation/testing/benchmarking.md)
- [Local Environment Setup](./guides/implementation/environment-setup.md)
- [Development Commands](./reference/development-commands.md)

### Architecture & Design

- [AI Agent System](./ai-agents-guide.md)
- [System Design](./architecture/examples/system-overview.md)
- [User Authentication](./architecture/user-authentication-architecture.md)
- [Documentation Templates](./templates/README.md)

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

## Support

- **Documentation Questions**: See [Documentation Guidelines](documentation-guidelines.md)
- **Template Issues**: Use existing examples as reference
- **Process Improvements**: Submit feedback through your team's standard channels

---

**Next Steps**: Choose your documentation type above and get started with the appropriate template and guide.

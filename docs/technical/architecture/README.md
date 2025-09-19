---
version: "0.1.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "architects", "ai-assistants"]
document_type: "guide"
category: "architecture"
tags: ["architecture", "design", "documentation"]
---

# Architecture Documentation

## What Goes Here

Document the **technical implementation details** of your project:

- **System Architecture**: Overall design, components, and how they connect
- **Technology Stack**: Languages, frameworks, databases, and key tools
- **Feature Architecture**: Detailed design for major features
- **Database Schema**: Data models and relationships
- **API Design**: Endpoint design and service contracts
- **Security Architecture**: Authentication, authorization, and data protection
- **Performance Design**: Scalability and optimization strategies

## Directory Structure

```
📁 Architecture Documentation (Following Three-Tier Structure):

docs/technical/architecture/    # Technical Architecture (Tier 1)
├── README.md                   # This guide
├── c4-overview.md             # C4 methodology guide
├── system-design.md           # Manual: High-level architecture decisions
├── feature-architecture.md    # Manual: Feature-specific design
├── auto-generated/            # 🤖 AUTO-GENERATED: Factual data extraction
│   ├── README.md              # Auto-generated documentation guide
│   ├── tech-stack.md          # Auto: Technology analysis from code
│   ├── system-overview.md     # Auto: Project structure analysis
│   └── dependency-graph.md    # Auto: Dependency relationships
└── examples/                   # Reference examples (remove when not needed)
    ├── README.md              # Guide to examples
    └── architecture-template.md # Template for manual architecture docs
```

**⚠️ CRITICAL: Never manually edit files in auto-generated/ - they are automatically generated!**

## Quick Start

### 1. **For Auto-Generated Architecture Documentation**
```bash
# Generate all architecture documentation automatically
./scripts/docs-manager.sh auto-docs all

# Or generate specific components
./scripts/docs-manager.sh auto-docs tech-stack      # Technology stack analysis
./scripts/docs-manager.sh auto-docs system-overview # System structure overview
./scripts/docs-manager.sh auto-docs dependencies    # Dependency graph

# The auto-generated files will be placed in docs/technical/architecture/auto-generated/
```

### 2. **For Overall System Architecture**
```bash
# Copy the example as starting point
cp docs/architecture/examples/system-overview.md docs/architecture/my-system.md

# Or use a template
cp docs/templates/standard/feature.template.md docs/architecture/my-system.md

# Then customize:
# - Replace placeholders with your system details
# - Add architecture diagrams
# - Document your technology choices
```

### 2. **For New Features**
```bash
# Use the standard feature template
cp docs/templates/standard/feature.template.md docs/architecture/user-management.md

# Customize for your feature
# - Document the feature's purpose and design
# - Add API endpoints and data models
# - Include security and performance considerations
```

### 4. **For Technical Decisions**
```bash
# Create a new technical decision record
./scripts/docs-manager.sh decision "Choose Database Technology"

# This creates a timestamped decision file in .decisions/
# e.g., .decisions/2025-09-17-choose-database-technology.md

# Edit the file to document:
# - Context and problem
# - Decision made
# - Alternatives considered
# - Consequences and implementation notes
```

## Automatic vs Manual Documentation

### Auto-Generated Documentation
The system automatically generates and maintains:

- **Technology Stack Analysis** (`tech-stack.md`): Extracted from package.json, requirements.txt, and configuration files
- **System Overview** (`system-overview.md`): Project structure and component analysis
- **Dependency Graph** (`dependency-graph.md`): Production and development dependencies with analysis
- **Technical Decision Records**: Structured decision capture with .decisions/ framework

These are automatically updated when dependencies or system structure changes.

### Manual Documentation
Add manual architecture documentation when:

- **Starting a new project**: Document overall system design and vision
- **Adding major features**: Document complex features with multiple components
- **Making technology choices**: Create detailed decision records beyond basic templates
- **Designing APIs**: Document endpoint design and data contracts
- **Implementing security**: Document authentication and authorization design
- **Performance requirements**: Document scaling and optimization strategies

## When to Regenerate Auto-Docs

Trigger automatic documentation regeneration:
- After adding or updating dependencies (package.json, requirements.txt)
- When significant code structure changes occur
- After major refactoring that affects system architecture
- Before releases to ensure documentation is current

## File Naming Conventions

- Use `lowercase-kebab-case.md`
- Be descriptive: `user-authentication-system.md` not `auth.md`
- Group related docs: `payment-processing-api.md`, `payment-processing-database.md`

## Integration with Development

### AI Assistant Support
This documentation helps AI assistants:
- Understand your system's design and constraints
- Make informed implementation decisions
- Maintain consistency with existing architecture
- Follow established patterns and conventions

### Development Workflow
1. **Document before building**: Create architecture docs during design phase
2. **Update during development**: Keep docs current with implementation
3. **Review in PRs**: Include architecture changes in code reviews
4. **Reference during debugging**: Use docs to understand system behavior

## Resources

- **[Examples](./examples/README.md)**: Reference examples showing documentation format
- **[Templates](./templates/)**: Ready-to-use templates for common documentation needs
- **[ADR Guide](./decision-records/README.md)**: How to document architectural decisions

## Related Documentation

- **[System Guidelines](../../CLAUDE.md)**: High-level system design of this template
- **[API Documentation](../api/README.md)**: Where to document your APIs
- **[Documentation Guidelines](../documentation-guidelines.md)**: Writing standards

---

*Document your architecture to help both humans and AI assistants understand and maintain your system effectively.*
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
docs/architecture/
├── README.md                    # This guide
├── c4-overview.md              # C4 model guide for visual architecture
├── system-context.md           # Example C4 system context diagram
├── examples/                    # Reference examples (remove when not needed)
│   ├── README.md               # Guide to examples
│   └── system-overview.md      # Example: overall architecture
└── decision-records/            # Architecture Decision Records (ADRs)
    ├── README.md               # ADR guide
    └── template.md             # ADR template
```

## Quick Start

### 1. **For Overall System Architecture**
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

### 3. **For Major Decisions**
```bash
# Copy the ADR template
cp docs/architecture/decision-records/template.md docs/architecture/decision-records/002-database-choice.md

# Document your decision
# - Explain the context and problem
# - List alternatives considered
# - Document the decision and consequences
```

## When to Add Documentation

Add architecture documentation when:

- **Starting a new project**: Document overall system design
- **Adding major features**: Document complex features with multiple components
- **Making technology choices**: Create ADRs for significant decisions
- **Designing APIs**: Document endpoint design and data contracts
- **Implementing security**: Document authentication and authorization design
- **Performance requirements**: Document scaling and optimization strategies

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
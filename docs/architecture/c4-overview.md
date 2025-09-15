---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["architects", "developers", "ai-assistants"]
document_type: "guide"
category: "architecture"
c4_level: "overview"
tags: ["c4", "architecture", "visualization", "documentation"]
---

# C4 Model Architecture Overview

A simplified guide for using the C4 model to document software architecture.

## What is the C4 Model?

The C4 model provides a structured way to visualize software architecture at four levels:

1. **System Context** - How your system fits into the world
2. **Container** - High-level technology choices and responsibilities
3. **Component** - How containers are made up of components
4. **Code** - Implementation details within components

### Progressive Disclosure

Start simple with high-level context, then add detail as needed:
- **Context**: For all stakeholders to understand system purpose
- **Container**: For technical stakeholders to understand architecture
- **Component**: For developers working on specific containers
- **Code**: For developers working on specific components

## Using C4 in Your Project

### When to Use Each Level

**System Context** - Always start here:
- Define system boundaries
- Identify external actors (users, systems)
- Show high-level interactions

**Container** - For most projects:
- Show major technology choices
- Document responsibilities
- Explain data flow

**Component** - For complex containers only:
- Detail internal structure
- Show component interactions
- Document design patterns

**Code** - Rarely needed:
- Critical algorithms
- Complex design patterns
- Performance-critical code

### File Organization

```
docs/architecture/
├── c4-overview.md          # This guide
├── system-context.md       # Level 1: System boundaries
└── container-[name].md     # Level 2: Container details (as needed)
```

## Creating C4 Documentation

### 1. System Context

Start by answering:
- What does your system do?
- Who uses it?
- What external systems does it integrate with?

### 2. Container Architecture

For each major technology component:
- What is its responsibility?
- What technology stack does it use?
- How does it communicate with other containers?

### 3. Documentation Tips

- Use simple language for context diagrams
- Include technology choices in container diagrams
- Focus on relationships and data flow
- Keep diagrams simple and readable

## Template Integration

For architecture documentation, use the [Standard Feature Template](../templates/standard/feature.template.md) and adapt it for architectural content.

## Tools

**Diagramming Tools**:
- [Draw.io](https://draw.io) - Free online diagramming
- [PlantUML C4](https://github.com/plantuml-stdlib/C4-PlantUML) - Code-based diagrams
- [Structurizr](https://structurizr.com) - Purpose-built for C4

## Example

See [system-context.md](./system-context.md) for a practical example of C4 Level 1 documentation.

---

*Keep it simple: most projects only need System Context and Container levels.*
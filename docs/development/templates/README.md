---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "technical-writers", "ai-assistants"]
document_type: "template"
tags: ["templates", "documentation", "standards"]
---

# Documentation Templates

## Overview

Ready-to-use templates for creating consistent, high-quality documentation across the project.

## Template Categories

### Simple Templates (Recommended)
Quick-start templates for most documentation needs.

- **[Feature Template](./simple/feature-simple.template.md)** - Basic feature documentation
- **[Deliverable Template](./simple/deliverable-simple.template.md)** - Simple deliverable docs

### Standard Templates (Comprehensive)
Detailed templates for complex features and enterprise requirements.

- **[Feature Template](./standard/feature.template.md)** - Comprehensive feature documentation
- **[Deliverable Template](./standard/deliverable.template.md)** - Complete deliverable documentation

### Specialized Templates
Purpose-specific templates for common documentation types.

- **[API Template](./api.template.md)** - API reference documentation

## Usage Guide

### Choosing the Right Template

| For... | Use Template | When |
|--------|-------------|------|
| **Quick feature docs** | [Simple Feature](./simple/feature-simple.template.md) | <2 weeks dev time, straightforward implementation |
| **Complex features** | [Standard Feature](./standard/feature.template.md) | >2 weeks dev time, multiple systems involved |
| **API documentation** | [API Template](./api.template.md) | REST APIs, GraphQL schemas, service contracts |
| **System design** | [Standard Feature](./standard/feature.template.md) | System architecture, design decisions |
| **Component specs** | [Standard Feature](./standard/feature.template.md) | UI components, modules, libraries |
| **Support docs** | [Simple Feature](./simple/feature-simple.template.md) | Issue resolution, debugging guides |

### Using Templates

1. **Copy the template** to your target location
2. **Fill in the header** with appropriate metadata
3. **Complete required sections** (marked with `[REQUIRED]`)
4. **Remove unused sections** to keep docs focused
5. **Follow naming conventions** from [Documentation Guidelines](../documentation-guidelines.md)

### Template Locations

```bash
# Copy simple feature template
cp docs/templates/simple/feature-simple.template.md docs/architecture/my-feature.md

# Copy standard feature template
cp docs/templates/standard/feature.template.md docs/architecture/my-system.md

# Copy API template
cp docs/templates/api.template.md docs/api/my-api.md
```

## Template Features

### All Templates Include
- **Version headers** with metadata
- **Structured sections** for consistency
- **Required vs optional** section markers
- **Cross-reference patterns** for linking
- **Target length guidelines** for appropriate scope

### Simple Templates
- **~50-75 lines** target length
- **5-7 main sections** for focused documentation
- **Quick completion** for rapid iteration
- **Essential information** only

### Standard Templates
- **~200+ lines** target length
- **13+ comprehensive sections** for thorough coverage
- **Detailed analysis** for complex requirements
- **Enterprise considerations** built-in

## Integration with Documentation System

### File Naming
Follow [Documentation Guidelines](../documentation-guidelines.md) for naming:
- Use `lowercase-kebab-case.md`
- Be descriptive but concise
- No redundant suffixes in categorized folders

### Cross-References
Templates include patterns for:
- Linking to related documentation
- Referencing architecture decisions
- Connecting to implementation files
- Maintaining documentation trees

### Version Control
- **Header metadata** for tracking changes
- **Created/Updated dates** for currency
- **Status indicators** for document lifecycle
- **Target audience** for appropriate content

## Best Practices

### Template Selection
1. **Start simple** - Use simple templates first, upgrade if needed
2. **Match complexity** - Template complexity should match feature complexity
3. **Consider audience** - Technical vs business vs mixed audiences
4. **Plan for maintenance** - Choose templates you can keep current

### Content Guidelines
1. **Fill completely** - Don't leave template placeholders
2. **Remove unused sections** - Keep focused on actual needs
3. **Update regularly** - Documentation should match implementation
4. **Link appropriately** - Connect to related docs

### Quality Standards
- Follow [Quality Standards](../quality-standards.md)
- Use evidence-based information
- Maintain single source of truth
- Ensure accessibility and clarity

## Template Philosophy

This template set focuses on essential documentation needs:

- **Simple Templates** - For quick, focused documentation
- **Standard Templates** - For comprehensive, detailed documentation
- **API Template** - For API-specific documentation needs

For specialized needs (components, troubleshooting, etc.), use the Standard Feature template as a starting point.

## Related Documentation

- **[Documentation Guidelines](../documentation-guidelines.md)** - Writing standards and conventions
- **[Quality Standards](../quality-standards.md)** - Quality requirements for documentation
- **[Documentation Hub](../README.md)** - Complete documentation navigation

## Contributing Templates

To add new templates:
1. Follow existing template structure and naming
2. Include proper version headers
3. Add to appropriate category above
4. Update this README with template description
5. Test template with real content

---

*Consistent documentation starts with good templates.*
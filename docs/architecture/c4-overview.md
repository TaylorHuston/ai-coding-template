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

**Purpose**: Guide for using the C4 model to document the AI Coding Template's architecture through hierarchical visual diagrams.

## What is the C4 Model?

The C4 model is a hierarchical approach to software architecture documentation created by Simon Brown. It provides a structured way to visualize software architecture at four levels of abstraction:

### The Four Levels

1. **System Context** - The big picture of how your system fits into the world
2. **Container** - High-level technology choices and responsibilities
3. **Component** - How containers are made up of components
4. **Code** - Implementation details within components

### Progressive Disclosure Principle

Start simple with high-level context, then progressively add detail as needed:
- **Context**: For all stakeholders to understand system purpose and boundaries
- **Container**: For technical stakeholders to understand architectural decisions
- **Component**: For developers working on specific containers
- **Code**: For developers working on specific components

## Why C4 for AI Coding Template?

This project has unique characteristics that make C4 particularly valuable:

### Complex Multi-Agent System
- 17 specialized AI agents with distinct domains and interaction patterns
- Hierarchical complexity (Opus → Sonnet → Haiku model usage)
- Dynamic agent coordination and handoff procedures

### Context Management Challenges
- Sophisticated state persistence across AI sessions
- Complex documentation hierarchies and relationships
- Integration with external development tools and workflows

### Documentation-First Philosophy
- Already established metadata standards (YAML frontmatter)
- Template-driven consistency and reusability
- Strong separation of concerns in file organization

## AI Coding Template C4 Architecture

### System Boundary Definition

**Core System**: AI Coding Template Platform
- **Purpose**: Transform individual AI assistants into specialized expert teams with persistent context
- **Scope**: Template structure, agent orchestration, context management, automation tools

**External Actors**:
- **Primary Users**: Solo developers, development teams, technical writers
- **AI Assistants**: Claude, Cursor, and other AI coding platforms
- **External Systems**: Git repositories, project management (Jira/Linear), IDEs, CI/CD pipelines

### Container Architecture

Our system consists of six major containers:

1. **Agent Orchestration System** - Manages 17 specialized agents and coordinates work
2. **Context Management System** - Preserves project state and enables context restoration
3. **Documentation Framework** - Standardizes and organizes all project documentation
4. **Work Organization System** - Organizes development work through hierarchical structure
5. **Automation Toolkit** - Shell scripts and Node.js utilities for maintenance
6. **Quality Assurance System** - Maintains code quality and consistency standards

## Project-Specific C4 Conventions

### Notation Standards

**Visual Elements**:
- **Rectangles**: People, systems, containers, components
- **Lines with arrows**: Relationships and data flow direction
- **Colors**: Domain grouping (agents=blue, context=green, docs=orange, etc.)
- **Labels**: Clear names with brief responsibility descriptions

**Audience Conventions**:
- **Context Level**: Simple language, business value focus
- **Container Level**: Technology choices and architectural rationale
- **Component Level**: Design patterns and component responsibilities
- **Code Level**: Implementation patterns and critical code structures

### File Organization

```
docs/architecture/
├── c4-overview.md                    # This guide
├── system-context.md                 # Level 1: System boundaries and external actors
├── container-architecture.md         # Level 2: Major containers and technology choices
├── components/                       # Level 3: Component diagrams for complex containers
│   ├── agent-orchestration.md       # Agent system component breakdown
│   ├── context-management.md        # Context management component breakdown
│   └── work-organization.md         # Work organization component breakdown
├── workflows/                        # Dynamic diagrams for key scenarios
│   ├── project-setup.md             # New project setup workflow
│   ├── feature-development.md       # Multi-agent feature development
│   ├── context-restoration.md       # Session context restoration
│   └── quality-assurance.md         # Quality gate workflows
└── decision-records/                 # Existing ADR system integration
```

### YAML Frontmatter Enhancements

All C4 documentation includes enhanced metadata:

```yaml
---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["architects", "developers"]
document_type: "architecture"
category: "architecture"
c4_level: "context"                    # context|container|component|code
diagram_type: "system_context"        # Specific diagram type
related_diagrams: ["container-architecture.md"]  # Related C4 documents
external_tools: ["draw.io"]           # Tools used for diagrams
---
```

## Diagram Creation Guidelines

### Tools and Formats

**Primary Tools**:
- **Draw.io (Diagrams.net)**: Free, has C4 templates, good for collaboration
- **PlantUML with C4 extension**: Code-as-diagrams approach for version control
- **Miro**: For collaborative workshops and initial diagram creation

**Format Standards**:
- Embed diagrams as SVG in markdown for version control
- Maintain diagram sources alongside documentation
- Use consistent color schemes across all diagrams
- Include diagram creation date and tool used

### Diagram Quality Criteria

**Context Level Requirements**:
- Shows system in its environment with clear boundaries
- Identifies all primary user types and their goals
- Shows key external systems and their relationships
- Uses simple, non-technical language

**Container Level Requirements**:
- Shows major technology choices with rationale
- Documents container responsibilities and ownership
- Shows inter-container communication patterns
- Explains data storage and processing strategies

**Component Level Requirements**:
- Shows major structural building blocks within containers
- Documents component interfaces and dependencies
- Explains key design patterns and architectural decisions
- Focuses on components that are complex or critical

## Maintenance Strategy

### Regular Updates

**Trigger Events for Updates**:
- Major architectural changes or technology decisions
- New agent types or significant agent capability changes
- Changes to context management or workflow patterns
- External system integrations or API changes

**Update Process**:
1. Identify which C4 levels are affected by the change
2. Update relevant diagrams and documentation
3. Review related diagrams for consistency
4. Update `last_updated` metadata and version if significant

### Quality Assurance

**Diagram Review Checklist**:
- [ ] Diagram serves a clear communication purpose
- [ ] Appropriate level of detail for target audience
- [ ] Consistent with other diagrams in style and notation
- [ ] Current with actual system implementation
- [ ] Clear labels and readable at standard sizes

**Integration with Development Workflow**:
- Include diagram updates in pull request reviews for architectural changes
- Reference C4 documentation in ADRs for major decisions
- Use diagrams in architecture review sessions and onboarding
- Validate diagram currency during quarterly architecture reviews

## Usage Guidelines

### When to Create C4 Diagrams

**Always Create**:
- System Context: For any new team member onboarding
- Container Architecture: When explaining technology choices to stakeholders

**Create When Helpful**:
- Component diagrams: For containers with complex internal structure
- Code diagrams: For critical algorithms or complex implementations
- Dynamic diagrams: For complex workflows that span multiple containers

**Don't Create**:
- Diagrams that duplicate information available elsewhere
- Component diagrams for simple, straightforward containers
- Code diagrams for standard implementation patterns

### Audience-Specific Usage

**For New Team Members**:
1. Start with System Context to understand overall purpose
2. Review Container Architecture to understand technology landscape
3. Dive into Component diagrams for areas they'll work on

**For AI Assistants**:
- Reference System Context for understanding project boundaries
- Use Container Architecture for making technology-consistent decisions
- Consult Component diagrams for understanding interaction patterns

**For Stakeholders**:
- System Context for understanding project scope and value
- Container Architecture for understanding technology investments
- Dynamic diagrams for understanding key user workflows

## Integration with Existing Documentation

### Relationship to Current Architecture Docs

**Enhances Existing Structure**:
- ADRs document decisions; C4 shows current state resulting from those decisions
- Examples show specific implementations; C4 shows how they fit together
- Templates provide starting points; C4 shows target architecture patterns

**Complements Other Documentation**:
- **[System Guidelines](../../CLAUDE.md)**: C4 provides visual representation of guidelines
- **[Quality Standards](../quality-standards.md)**: C4 shows architecture that supports quality
- **[Agent Index](.claude/agents/INDEX.md)**: C4 shows how agents fit into overall system

### Template Integration

C4 templates are available in `docs/templates/` directory:
- `architecture-context.template.md` - System context template
- `architecture-container.template.md` - Container architecture template
- `architecture-component.template.md` - Component architecture template

## Success Metrics

### Immediate Indicators (Month 1)
- New team members understand system architecture in <30 minutes
- AI agents reference architectural context for better decisions
- Clear visual overview reduces architecture questions by 70%

### Long-term Indicators (Quarter 1)
- Architecture documentation referenced in 90%+ of technical decisions
- Agent coordination patterns clearly understood by all team members
- Template adoption by other teams with minimal customization

## Related Resources

### External References
- [C4 Model Official Site](https://c4model.com) - Complete methodology documentation
- [Structurizr](https://structurizr.com) - Purpose-built C4 tooling
- [PlantUML C4 Extension](https://github.com/plantuml-stdlib/C4-PlantUML) - Code-as-diagrams approach

### Internal References
- **[Architecture Examples](./examples/)**: Specific implementation examples
- **[Architecture Templates](./templates/)**: Ready-to-use templates
- **[Documentation Guidelines](../documentation-guidelines.md)**: Writing and formatting standards

---

*This C4 overview provides the foundation for creating clear, hierarchical architecture documentation that serves both human understanding and AI agent effectiveness.*
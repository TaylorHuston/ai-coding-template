---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["architects", "senior-developers", "ai-assistants"]
document_type: "reference"
tags: ["architecture", "decisions", "adr"]
---

# Architecture Decision Records (ADRs)

## What are ADRs?

Architecture Decision Records (ADRs) are documents that capture important architectural decisions made during project development, along with their context and consequences.

## When to Create an ADR

Create an ADR when making decisions about:

- **Technology Choices**: Selecting frameworks, databases, or major libraries
- **Architectural Patterns**: Choosing between microservices vs monolith, event-driven vs request-response
- **External Integrations**: Adding third-party services or APIs
- **Performance Trade-offs**: Decisions affecting system performance or scalability
- **Security Implementations**: Authentication methods, encryption choices
- **Development Workflows**: Build processes, deployment strategies
- **Data Models**: Database schema decisions, data flow architectures

## When NOT to Create an ADR

Don't create ADRs for:
- Minor implementation details
- Temporary workarounds
- Standard practices (unless deviating from them)
- Decisions that can be easily reversed

## ADR Numbering

ADRs are numbered sequentially starting from 001:
- `001-initial-architecture.md`
- `002-database-selection.md`
- `003-authentication-strategy.md`

Use the [template.md](./template.md) to create new ADRs.

## ADR Lifecycle

### Status Values
- **Proposed**: Decision is under consideration
- **Accepted**: Decision has been approved and implemented
- **Superseded**: Replaced by a newer decision (link to the new ADR)
- **Deprecated**: No longer relevant but kept for historical context

### Status Changes
When superseding an ADR:
1. Change the old ADR status to "Superseded by [ADR-XXX](./XXX-new-decision.md)"
2. Reference the superseded ADR in the new one

## Creating a New ADR

1. **Copy the template**:
   ```bash
   cp docs/architecture/decision-records/template.md docs/architecture/decision-records/001-your-decision.md
   ```

2. **Fill in the template**:
   - Replace placeholder text
   - Provide clear context and reasoning
   - Document alternatives considered
   - Explain consequences and trade-offs

3. **Review and approve**:
   - Have the decision reviewed by relevant stakeholders
   - Update status from "Proposed" to "Accepted"
   - Implement the decision

## ADR Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [001](./001-example.md) | Example Decision | Accepted | 2025-09-15 |

*Add new ADRs to this table as they are created*

## Best Practices

### Writing Good ADRs

1. **Be Concise**: Focus on the decision and its rationale
2. **Include Context**: Explain why the decision was needed
3. **Document Alternatives**: Show what options were considered
4. **Explain Consequences**: Both positive and negative impacts
5. **Use Plain Language**: Make it accessible to all team members

### Maintaining ADRs

1. **Update the Index**: Add new ADRs to the table above
2. **Link Related ADRs**: Reference related decisions
3. **Review Periodically**: Ensure ADRs remain relevant
4. **Archive When Appropriate**: Mark superseded decisions clearly

### Team Process

1. **Collaborative Decision Making**: Include relevant stakeholders
2. **Document Before Implementation**: Write the ADR before coding
3. **Review in Pull Requests**: Include ADR changes in code reviews
4. **Communicate Decisions**: Share ADRs with the broader team

## Templates and Examples

- **[ADR Template](./template.md)** - Standard template for new ADRs
- **[Example ADR](./001-example.md)** - Sample ADR showing the format

## Related Documentation

- [System Architecture](../examples/system-overview.md) - Overall system design
- [System Guidelines](../../../CLAUDE.md) - High-level system design
- [Documentation Guidelines](../../documentation-guidelines.md) - Writing standards

---

*ADRs help preserve the reasoning behind important architectural decisions and provide valuable context for future development.*
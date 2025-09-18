---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "architecture", "decisions"]
---

# /architect Command

**Purpose**: Make technical architecture decisions through natural conversation and collaborative exploration.

## Usage

```bash
/architect feature-name           # Design architecture for feature
/architect --decision "Topic"     # Make specific technical decision
/architect --update feature-name  # Update existing architecture
```

## Approach

**Natural conversation focused on alternatives and trade-offs**:
- Present 2-3 viable options with clear pros/cons
- Ask focused questions about priorities and constraints
- Build decisions iteratively through back-and-forth
- Consider team context and real-world limitations
- Document final decisions with rationale

**Key principle**: Always explore alternatives rather than prescribing solutions.

## Conversation Flow

**Start with context**: Understand requirements and constraints
**Present options**: 2-3 viable approaches with trade-offs
**Explore trade-offs**: What matters most - performance? simplicity? team skills?
**Make decisions**: Choose approach based on priorities
**Document rationale**: Create ADRs with reasoning and alternatives considered

## Outputs

**Architecture Decision Records (ADRs)** in `docs/technical/decisions/`:
- Context and problem statement
- Alternatives considered with trade-offs
- Decision made with rationale
- Consequences and next steps

**Architecture documents** in `docs/technical/architecture/` when needed.

## Integration with Workflow

**Position**: After `/vision` and `/feature`, before `/plan`
- Vision/feature requirements → architecture decisions → implementation planning

## Success Criteria

**Quality decisions through conversation**:
- Multiple alternatives explored with clear trade-offs
- Decisions based on priorities, not just preferences
- Team context and constraints considered
- Clear rationale documented for future reference
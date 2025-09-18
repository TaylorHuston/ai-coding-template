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

**Purpose**: Design technical architecture and make implementation decisions through structured exploration and documentation.

## Usage

```bash
/architect feature-name           # Design architecture for feature
/architect --decision "Topic"     # Make specific technical decision
/architect --update feature-name  # Update existing architecture
/architect --system name          # Design system integration
```

## Objectives

**Primary Goal**: Design technical solutions and make architectural decisions through collaborative exploration of alternatives and trade-offs.

**Core Outcomes**:
1. **Technical Design**: System architecture and component structure
2. **Technology Decisions**: Stack choices with explicit trade-offs
3. **Integration Planning**: How components connect and communicate
4. **Risk Assessment**: Technical risks and mitigation strategies
5. **Documentation**: ADRs and architecture documents in `docs/technical/`

## Approach

Use **structured decision exploration** to design architecture:
- Present multiple viable technical approaches
- Explore trade-offs between alternatives explicitly
- Consider team capabilities and system constraints
- Validate assumptions before building on them
- Document decisions with rationale and context

**Focus on alternatives** - always present 2-3 options with clear trade-offs rather than prescribing single solutions.

## Key Exploration Areas

### Technical Alternatives
- What are the viable approaches to solve this technically?
- What are the trade-offs between different technologies?
- Which approaches fit our team's expertise?
- What constraints limit our technical choices?

### System Integration
- How does this connect with existing systems?
- What APIs or interfaces need to be designed?
- What data flows between components?
- What external dependencies are required?

### Quality Attributes
- What performance requirements must be met?
- What security considerations apply?
- How will this scale with growth?
- What operational complexity does this add?

### Implementation Feasibility
- Can our team build and maintain this?
- What technical assumptions need validation?
- What risks could derail implementation?
- How can we mitigate identified risks?

## Document Structure

Create architecture documentation with these core sections:

1. **System Overview** - High-level architecture and components
2. **Technology Decisions** - Stack choices with rationale and alternatives
3. **Integration Points** - APIs, data flows, and external connections
4. **Risk Assessment** - Technical risks and mitigation strategies
5. **Implementation Guidance** - Patterns and practices for development

**Architecture Decision Records (ADRs)**:
- Context and problem statement
- Alternatives considered
- Decision made and rationale
- Consequences and trade-offs

Include collaboration markers:
- Confidence levels for decisions
- Assumptions requiring validation
- Open questions for further exploration
- Review triggers for reconsidering decisions

## Integration with Workflow

**Position**: Bridges requirements and implementation by defining technical approach

**Relationship to Other Commands**:
- **After /vision and /feature**: Decisions guided by product goals and requirements
- **Before /plan**: Architecture informs implementation planning
- **Enables /develop**: Technical design guides development execution
- **Documents /decisions**: Creates ADRs for future reference

## Success Criteria

**Complete Architecture Design**:
- Multiple alternatives explored with trade-offs
- Technology decisions made with clear rationale
- Integration patterns defined and documented
- Risks identified with mitigation strategies
- Architecture validated against requirements

**Quality Indicators**:
- Decisions based on analysis, not preference
- Technical assumptions explicitly stated
- Team capabilities considered in choices
- Future evolution path planned
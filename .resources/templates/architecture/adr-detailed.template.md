---
version: "0.1.0"
created: "2025-09-18"
last_updated: "2025-09-18"
purpose: "Detailed Architecture Decision Record for complex decisions"
when_to_use: "Deep Mode architectural decisions (10% of cases)"
target_audience: ["developers", "ai-assistants", "architects", "stakeholders"]
document_type: "template"
tags: ["adr", "architecture", "detailed", "decision"]
placeholders:
  - name: "ADR_NUMBER"
    description: "Sequential ADR number"
    example: "001"
  - name: "TOPIC"
    description: "Decision topic"
    example: "microservices-architecture"
  - name: "CONTEXT"
    description: "Detailed problem statement and requirements"
    example: "System needs to scale to 100k users with complex business logic"
  - name: "CONSTRAINTS"
    description: "Technical and business constraints"
    example: "Team of 8 developers, 6-month timeline, compliance requirements"
  - name: "ALTERNATIVES"
    description: "Detailed analysis of alternatives with pros/cons"
    example: "Monolith vs Microservices vs Modular Monolith analysis"
  - name: "DECISION"
    description: "Chosen approach with detailed rationale"
    example: "Modular monolith with service extraction plan"
  - name: "CONSEQUENCES"
    description: "Implications, risks, and follow-up actions"
    example: "Reduced complexity, easier deployment, future migration path"
  - name: "IMPLEMENTATION"
    description: "Key implementation considerations"
    example: "Module boundaries, API design, data partitioning strategy"
---

# ADR-{{ADR_NUMBER}}: {{TOPIC}} (Detailed Analysis)

**Date**: {{DATE}}
**Status**: {{STATUS}}
**Decision Owner**: {{OWNER}}
**Stakeholders**: {{STAKEHOLDERS}}

## Context and Problem Statement

{{CONTEXT}}

### Requirements
- {{REQUIREMENT_1}}
- {{REQUIREMENT_2}}
- {{REQUIREMENT_3}}

### Constraints
{{CONSTRAINTS}}

## Alternatives Considered

{{ALTERNATIVES}}

### Option A: {{OPTION_A_NAME}}
**Description**: {{OPTION_A_DESC}}

**Pros**:
- {{OPTION_A_PRO_1}}
- {{OPTION_A_PRO_2}}

**Cons**:
- {{OPTION_A_CON_1}}
- {{OPTION_A_CON_2}}

**Risk Level**: {{OPTION_A_RISK}}

### Option B: {{OPTION_B_NAME}}
**Description**: {{OPTION_B_DESC}}

**Pros**:
- {{OPTION_B_PRO_1}}
- {{OPTION_B_PRO_2}}

**Cons**:
- {{OPTION_B_CON_1}}
- {{OPTION_B_CON_2}}

**Risk Level**: {{OPTION_B_RISK}}

### Option C: {{OPTION_C_NAME}}
**Description**: {{OPTION_C_DESC}}

**Pros**:
- {{OPTION_C_PRO_1}}
- {{OPTION_C_PRO_2}}

**Cons**:
- {{OPTION_C_CON_1}}
- {{OPTION_C_CON_2}}

**Risk Level**: {{OPTION_C_RISK}}

## Decision

{{DECISION}}

### Rationale
{{RATIONALE}}

### Decision Factors
- **Technical Fit**: {{TECHNICAL_FIT}}
- **Team Capability**: {{TEAM_CAPABILITY}}
- **Timeline Impact**: {{TIMELINE_IMPACT}}
- **Maintenance Cost**: {{MAINTENANCE_COST}}
- **Scalability**: {{SCALABILITY}}

## Consequences

### Positive Consequences
- {{POSITIVE_1}}
- {{POSITIVE_2}}
- {{POSITIVE_3}}

### Negative Consequences
- {{NEGATIVE_1}}
- {{NEGATIVE_2}}

### Risks and Mitigation
- **Risk**: {{RISK_1}} → **Mitigation**: {{MITIGATION_1}}
- **Risk**: {{RISK_2}} → **Mitigation**: {{MITIGATION_2}}

## Implementation Notes

{{IMPLEMENTATION}}

### Key Considerations
- {{CONSIDERATION_1}}
- {{CONSIDERATION_2}}
- {{CONSIDERATION_3}}

### Dependencies
- {{DEPENDENCY_1}}
- {{DEPENDENCY_2}}

### Success Metrics
- {{METRIC_1}}
- {{METRIC_2}}

## Follow-up Actions

- [ ] {{ACTION_1}}
- [ ] {{ACTION_2}}
- [ ] {{ACTION_3}}

## Related Decisions

- **Depends on**: {{DEPENDS_ON}}
- **Influences**: {{INFLUENCES}}
- **Related**: {{RELATED}}

## Resources

- **Documentation**: {{DOCS}}
- **Research**: {{RESEARCH}}
- **External References**: {{REFERENCES}}

---
*Detailed ADR - Created using Deep Mode analysis*
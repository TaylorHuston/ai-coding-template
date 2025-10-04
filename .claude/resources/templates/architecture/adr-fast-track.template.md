---
version: "0.1.0"
created: "2025-09-18"
last_updated: "2025-09-18"
purpose: "Fast Track Architecture Decision Record for common decisions"
when_to_use: "Quick Mode architectural decisions (90% of cases)"
target_audience: ["developers", "ai-assistants", "architects"]
document_type: "template"
tags: ["adr", "architecture", "quick", "decision"]
placeholders:
  - name: "ADR_NUMBER"
    description: "Sequential ADR number"
    example: "001"
  - name: "TOPIC"
    description: "Decision topic"
    example: "authentication-strategy"
  - name: "CONTEXT"
    description: "One sentence context"
    example: "Need secure user authentication for web application"
  - name: "OPTION_A"
    description: "First option"
    example: "JWT tokens with local storage"
  - name: "OPTION_B"
    description: "Second option"
    example: "Session cookies with Redis"
  - name: "OPTION_C"
    description: "Third option (optional)"
    example: "OAuth2 with third-party provider"
  - name: "CHOSEN"
    description: "Selected option"
    example: "JWT tokens with local storage"
  - name: "REASON"
    description: "One sentence rationale"
    example: "Fits stateless API architecture and team JWT experience"
  - name: "IMPACT"
    description: "Key implementation impacts"
    example: "- Requires token refresh logic\n- Need XSS protection\n- Client-side token management"
  - name: "TASKS"
    description: "Related tasks created"
    example: "TASK-003: JWT implementation, TASK-004: Token refresh logic"
---

# ADR-{{ADR_NUMBER}}: {{TOPIC}} (Fast Track)

**Date**: {{DATE}}
**Status**: {{STATUS}}
**Context**: {{CONTEXT}}

## Options Considered
- **A)** {{OPTION_A}}
- **B)** {{OPTION_B}}
{{#OPTION_C}}- **C)** {{OPTION_C}}{{/OPTION_C}}

## Decision
**Chosen**: {{CHOSEN}}

**Rationale**: {{REASON}}

## Implementation Impact
{{IMPACT}}

## Related Tasks
{{TASKS}}

## Quick Reference
- **When**: Used for {{CONTEXT}}
- **How**: {{CHOSEN}}
- **Why**: {{REASON}}

---
*Fast Track ADR - For detailed analysis, use Deep Mode*
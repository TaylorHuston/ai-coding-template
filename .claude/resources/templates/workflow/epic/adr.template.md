---
version: "0.1.0"
created: "2025-09-18"
last_updated: "2025-09-18"
purpose: "Architecture Decision Record for epic context"
when_to_use: "When making technical decisions within an epic"
target_audience: ["architects", "developers", "ai-assistants"]
document_type: "template"
tags: ["adr", "architecture", "decisions", "epic"]
placeholders:
  - name: "NUMBER"
    description: "Sequential ADR number (001, 002, etc)"
    example: "001"
  - name: "TITLE"
    description: "Brief title of the decision"
    example: "Use JWT for Authentication Tokens"
  - name: "STATUS"
    description: "Decision status"
    example: "accepted"
  - name: "DATE"
    description: "Date of decision"
    example: "2025-01-15"
  - name: "CONTEXT"
    description: "Background and problem statement"
    example: "Need stateless authentication for multi-user todo application"
  - name: "DECISION"
    description: "The chosen approach"
    example: "Use JSON Web Tokens (JWT) for authentication"
  - name: "ALTERNATIVES"
    description: "Other options considered"
    example: "Session-based auth, OAuth 2.0, API keys"
  - name: "CONSEQUENCES"
    description: "Positive and negative outcomes"
    example: "Stateless scaling benefits, but token management complexity"
  - name: "IMPLEMENTATION_NOTES"
    description: "Key implementation considerations"
    example: "Use RS256 algorithm, 15-minute expiry, refresh token rotation"
---

# ADR-{{NUMBER}}: {{TITLE}}

## Status
{{STATUS}}

## Date
{{DATE}}

## Context
{{CONTEXT}}

## Decision
{{DECISION}}

## Alternatives Considered
{{ALTERNATIVES}}

## Consequences
{{CONSEQUENCES}}

## Implementation Notes
{{IMPLEMENTATION_NOTES}}
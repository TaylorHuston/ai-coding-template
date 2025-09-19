---
version: "0.4.0"
created: "2025-09-17"
last_updated: "2025-09-18"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "architecture", "decisions"]
description: "Technical architecture decisions with Quick Mode (5-10 min) and Deep Mode (20+ min) options"
argument-hint: "[epic-name] [--deep] [\"direct question\"]"
allowed-tools: ["Read", "Write", "Edit", "Grep", "Glob", "TodoWrite", "Task"]
model: "claude-opus-4-1"
---

# /architect Command

Make technical architecture decisions with smart defaults and rapid documentation.

## Usage

```bash
# Direct Questions (fastest)
/architect "should we use NextJS or React for this?"
/architect "PostgreSQL vs MongoDB for user data?"
/architect "JWT or session cookies for authentication?"

# Structured Decisions
/architect --epic "name"        # Epic architecture (Quick Mode: 5-10 min)
/architect --foundation         # Technology stack decisions
/architect --infrastructure     # Deployment/CI-CD architecture

# Complex Analysis
/architect --epic "name" --deep # Deep analysis (20+ min)
/architect "microservices vs monolith" --deep
```

## Process

**Direct Questions**: Answer immediately with brief analysis and recommendation

**Quick Mode** (structured decisions):
1. Read context → 2. Present 2-3 options → 3. Choose with rationale → 4. Create Fast Track ADR

**Deep Mode** (complex decisions):
Full analysis with detailed pros/cons, risks, and comprehensive ADR documentation.

## Outputs

**Direct Questions**: Immediate recommendation with brief rationale (no ADR)
**Fast Track ADRs**: Context + Options + Decision + Impact (Quick Mode)
**Detailed ADRs**: Full analysis with constraints, pros/cons, consequences (Deep Mode)

**ADR Locations**:
- Epic-specific: `epics/[name]/resources/ADR-###-[topic].md`
- Project-wide: `docs/technical/decisions/ADR-###-[topic].md`

**Task Discovery**: Creates `TASK-###-[name]/` directories for infrastructure needs

## Agent Coordination

**Tier 1**: code-architect (always active)
**Tier 2**: Auto-invoked based on context (devops-engineer, database-specialist, security-auditor, test-engineer)
**Tier 3**: On-demand specialists (frontend, backend, API, performance)

## Examples

**Quick Question**: `/architect "NextJS or React for dashboard?"` → "NextJS - built-in SSR fits your requirements"
**Authentication** (3 min): `/architect --epic "user-auth"` → JWT vs Session vs OAuth2 → Fast Track ADR
**Database** (5 min): `/architect --foundation` → PostgreSQL vs MongoDB → Fast Track ADR
**Complex Analysis** (20 min): `/architect "microservices vs monolith" --deep` → Full analysis → Detailed ADR

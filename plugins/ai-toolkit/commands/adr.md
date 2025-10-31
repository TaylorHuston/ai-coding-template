---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-10-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "architecture", "decisions", "adr"]
description: "Create Architecture Decision Records through interactive conversation"
argument-hint: "[\"optional context or topic\"]"
allowed-tools: ["Read", "Write", "Edit", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-opus-4-1
references_guidelines:
  - docs/development/guidelines/architectural-principles.md  # Design principles and patterns to consider
---

# /adr Command

Create Architecture Decision Records (ADRs) through interactive conversation. This command ALWAYS results in a new ADR file being created.

**IMPORTANT**: Architecture decisions have long-term consequences. Take your time, think thoroughly about all considerations and options. Quality matters more than speed.

## Usage

```bash
/adr                                  # Start conversation
/adr "database selection"             # Provide context
/adr "authentication approach"
/adr "frontend framework"
```

## Process Overview

**8-Step Interactive Flow**:

1. **Read Context** - Load ADR best practices, template, existing ADRs, and architecture overview first
2. **Understand Decision** - Read project context, clarify the decision topic
3. **Ask Questions** - ONE at a time, build understanding progressively
4. **Present Options** - 2-3 viable options with trade-offs
5. **Discuss Deeply** - Leverage specialist agents, explore implications, slow down
6. **Get Confirmation** - Ensure user understands trade-offs and is ready
7. **Create ADR** - Document the decision following template
8. **Update Architecture Overview** - Update `architecture-overview.md` to reflect the new decision

## Example Conversation

```
User: /adr "database selection"

AI: [Reads best practices, template, existing ADRs, and architecture overview]

Looking at your project brief, you're building a quotation management app.
Your current architecture uses a monolithic approach with no database yet.
I see you've made decisions about authentication (ADR-002) and API design (ADR-003).

What are your data structure needs?
- Primarily relational?
- Flexible schema?
- Mix of both?

User: Primarily relational

AI: What's your expected scale?
- < 10k users
- 10k-100k users
- 100k+ users

User: < 10k users for first year

AI: What's your team's database experience?
- Strong SQL?
- Prefer ORM?
- NoSQL?

User: SQL + ORM

AI: Hosting preference?
- Managed service?
- Self-hosted?

User: Managed, minimize ops

AI: Based on your answers, here are 3 options:

**PostgreSQL (Supabase)** - Managed, built-in auth, relational model
**PostgreSQL (Self-hosted)** - Full control, no vendor lock-in
**MongoDB Atlas** - Flexible schema, horizontal scaling

Which interests you most?

[Conversation continues, leverages database-specialist and security-auditor agents
for expert analysis, confirms decision]

AI: Great! I'll document the decision.

[Creates ADR-001-use-postgresql-supabase.md]
[Updates architecture-overview.md to reflect PostgreSQL + Supabase as primary database]

✓ ADR-001 created and architecture overview updated
```

## Template System

The command reads these files FIRST to guide the entire conversation:

- `docs/project/adrs/README.md` - Best practices, quality standards, writing guidance
- `docs/project/adrs/adr-template.md` - Required sections via YAML frontmatter
- `docs/project/adrs/ADR-*.md` - All existing ADRs for context (decisions already made, patterns to follow/avoid)
- `docs/project/architecture-overview.md` - Current architecture state (updated after each ADR)

**Why read existing ADRs**: Understand decision history, avoid conflicts, reference related decisions, build on previous choices

**Template Customization**: Add project-specific sections, modify prompts, adjust requirements

**ADR Location**: `docs/project/adrs/ADR-###-<kebab-case-title>.md` (sequential numbering)

**Architecture Overview**: Living document reflecting all architectural decisions - read at start, updated at end

## Agent Coordination

**Primary**: `code-architect` leads conversation and creates ADR

**Specialists** (consult via Task tool during step 5):
- `database-specialist` - DB selection, data modeling, scaling
- `devops-engineer` - Infrastructure, deployment, CI/CD
- `security-auditor` - Security architecture, auth, compliance
- `frontend-specialist` - Frontend frameworks, state management
- `backend-specialist` - Backend frameworks, API design
- `performance-optimizer` - Performance, scalability, caching
- `ui-ux-designer` - UX architecture, design systems

**Example**: Database decision → consult database-specialist + security-auditor + performance-optimizer + devops-engineer

## Command Instructions

When this command is invoked, execute:

```
Task: "Create Architecture Decision Record for [topic] through interactive conversation.

**CRITICAL MINDSET**:
- Architecture decisions have long-term consequences
- Take time to think thoroughly - quality > speed
- Consider implications 1, 3, 5 years out
- Explore edge cases before committing
- Don't rush - architectural decisions are hard to reverse

**PROCESS**:

1. BEFORE conversation:
   - Read docs/project/adrs/README.md (best practices, quality standards)
   - Read docs/project/adrs/adr-template.md (required sections)
   - Read ALL existing docs/project/adrs/ADR-*.md files (decision history, patterns, related decisions)
   - Read docs/project/architecture-overview.md (current architecture state)
   - Read docs/project-brief.md and CLAUDE.md (project context)
   - Use existing ADRs to understand what's already decided, avoid conflicts, reference related decisions

2. DURING conversation:
   - **Ask ONE question at a time** - never present a wall of questions
   - Wait for answer before asking next question
   - Keep questions terminal-friendly and focused
   - Build understanding progressively through dialogue
   - **Leverage specialist agents** (database-specialist, devops-engineer, security-auditor,
     frontend-specialist, backend-specialist, performance-optimizer, ui-ux-designer)
   - Use Task tool to consult specialists during trade-off discussion
   - Expert input should inform options and trade-offs presented

3. AFTER confirmation:
   - Determine next ADR number (scan existing ADR-*.md files)
   - Generate content following template structure and best practices
   - Create docs/project/adrs/ADR-###-<kebab-case-title>.md
   - If epic-related, update epic file with ADR reference
   - **Update docs/project/architecture-overview.md** to reflect the new decision:
     * Add/update relevant architecture components
     * Ensure overview stays accurate and current
     * Link to the new ADR for context

**ADR CONTENT GUIDELINES**:
- **Context**: Why this decision matters, forces at play, honest problem framing
- **Decision**: Definitive ("We will use X"), clear rationale, active voice
- **Alternatives**: Real options considered, why each was rejected
- **Consequences**: Honest trade-offs, negative consequences, long-term impact (1/3/5 years)
- **References**: Related ADRs, epics, documentation for future readers

**CONVERSATION SUMMARY**: [questions asked, answers received, options presented, discussion]
**DECISION CONFIRMED**: [the decision user confirmed]

Generate ADR documenting the conversation and decision."
```

## Workflow Integration

```
/project-brief → /adr → /epic → /plan → /implement
                   ↓
          docs/project/adrs/
                   ↓
        Referenced by epics/tasks
```

Use `/adr`:
- After `/project-brief` - foundational architecture decisions
- Before `/epic` - establish architectural patterns
- During `/epic` - epic-specific technical decisions
- Before `/plan` - document technical approach

## ADR Maintenance

**Status Transitions**:
- Proposed → Accepted (when finalized)
- Accepted → Deprecated (no longer recommended)
- Accepted → Superseded by ADR-### (when replaced)

**Superseding**: Create new ADR (don't edit old one), link bidirectionally, explain why changed

## Related Commands

- `/project-brief` - Project vision informing decisions
- `/epic` - References ADRs in Dependencies
- `/plan` - References ADRs for context
- `/docs` - Generate architecture docs from ADRs

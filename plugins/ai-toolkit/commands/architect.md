---
version: "0.5.0"
created: "2025-09-17"
last_updated: "2025-10-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "architecture", "decisions"]
description: "Technical architecture decisions with Quick Mode (5-10 min) and Deep Mode (20+ min) options"
argument-hint: "[--epic \"name\"] [--foundation] [--infrastructure] [--deep] [--question \"text\"] [\"direct question\"]"
allowed-tools: ["Read", "Write", "Edit", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-opus-4-0
---

# /architect Command

Make technical architecture decisions with smart defaults and rapid documentation.

## Usage

```bash
# Direct Questions (fastest - 30 seconds)
/architect --question "should we use NextJS or React for this?"
/architect --question "PostgreSQL vs MongoDB for user data?"
/architect "JWT or session cookies for authentication?"  # Backward compatible

# Structured Decisions (5-10 minutes)
/architect --epic "name"        # Epic architecture (Quick Mode)
/architect --foundation         # Technology stack decisions
/architect --infrastructure     # Deployment/CI-CD architecture

# Complex Analysis (20+ minutes)
/architect --epic "name" --deep # Deep analysis with comprehensive ADR
/architect --question "microservices vs monolith" --deep  # Deep question analysis
```

## Process

**Parse Arguments**:
- If `--question` flag present OR quoted string without flags detected: Execute Direct Question mode
- If `--epic` flag present: Execute Quick Mode (or Deep Mode with `--deep`)
- If `--foundation` or `--infrastructure`: Execute structured decision mode

**Direct Questions**: Answer immediately with brief analysis and recommendation
- Triggered by: `--question "text"` OR `"text"` (backward compatible)
- Response time: ~30 seconds
- Output: Brief recommendation with rationale (no ADR)

**Quick Mode** (structured decisions):
1. Read context → 2. Present 2-3 options → 3. Choose with rationale → 4. Create Fast Track ADR
- Response time: 5-10 minutes
- Output: Fast Track ADR with context, options, decision, impact

**Deep Mode** (complex decisions):
Full analysis with detailed pros/cons, risks, and comprehensive ADR documentation.
- Response time: 20+ minutes
- Output: Detailed ADR with constraints, alternatives, consequences, risks

## Outputs

**Direct Questions**: Immediate recommendation with brief rationale (no ADR)
**Fast Track ADRs**: Context + Options + Decision + Impact (Quick Mode)
**Detailed ADRs**: Full analysis with constraints, pros/cons, consequences (Deep Mode)

**ADR Location**: `docs/project/adrs/ADR-###-<kebab-case-title>.md`
- All ADRs stored in single location for easy discovery
- Sequential numbering across all decisions
- Template: `docs/project/adrs/adr-template.md` defines structure
- ADRs can reference epics/tasks via "References" section

**Task Discovery**: Creates `TASK-###-[name]/` directories for infrastructure needs when architectural decisions require implementation work

## Agent Coordination

**Tier 1**: code-architect (always active)
**Tier 2**: Auto-invoked based on context (devops-engineer, database-specialist, security-auditor, test-engineer)
**Tier 3**: On-demand specialists (frontend, backend, API, performance)

## Examples

**Quick Question**: `/architect --question "NextJS or React for dashboard?"` → "NextJS - built-in SSR fits your requirements"
**Backward Compatible**: `/architect "NextJS or React for dashboard?"` → Same result (quote detection)
**Authentication** (5-10 min): `/architect --epic "user-auth"` → JWT vs Session vs OAuth2 → Fast Track ADR
**Database** (5-10 min): `/architect --foundation` → PostgreSQL vs MongoDB → Fast Track ADR
**Complex Analysis** (20+ min): `/architect --question "microservices vs monolith" --deep` → Full analysis → Detailed ADR

## Creating ADRs

**Template-Driven Approach**: Just like epic/task/bug templates, the `/architect` command reads `docs/project/adrs/adr-template.md` at runtime to determine structure and what to ask the user.

**Quality-Driven Approach**: The command always reads `docs/project/adrs/README.md` first to refresh on ADR best practices and quality standards.

### 1. Read Best Practices Guide

**CRITICAL FIRST STEP**: Always read `docs/project/adrs/README.md` before creating any ADR

This guide contains:
- Core ADR principles
- Section-by-section writing guidance (what makes great Context, Decision, Consequences, etc.)
- Quality standards checklist
- Mode selection criteria (Quick vs Deep)
- Common mistakes to avoid

**Why This Matters**: Reading this guide ensures every ADR follows consistent quality standards, includes honest trade-off analysis, and avoids common pitfalls like decision bias or missing negative consequences.

### 2. Read Template

**IMPORTANT**: Always read `docs/project/adrs/adr-template.md` second

```yaml
# Template frontmatter defines sections
sections:
  - name: Status
    prompt: "What is the status of this decision?"
    required: true
    hint: "Options: Proposed, Accepted, Deprecated, Superseded"

  - name: Context
    prompt: "What is the issue that we're seeing..."
    required: true
    format: paragraph

  # ... and so on
```

**Template Customization**: Users can edit `docs/project/adrs/adr-template.md` to:
- Add project-specific sections (e.g., "Cost Analysis", "Security Impact")
- Modify prompts to match team preferences
- Change required vs optional sections
- Adjust hints for better guidance

### 3. Determine ADR Number

- Use Glob to scan `docs/project/adrs/ADR-*.md` files
- Find highest ADR-### number and increment by 1
- Zero-padded to 3 digits: ADR-001, ADR-002, etc.

### 4. Parse Template Sections

From template YAML frontmatter:
- **Extract sections**: Get section names, prompts, requirements
- **Identify required sections**: Sections with `required: true`
- **Read hints**: Use hints to guide content generation
- **Note format**: Use `format` field to structure content appropriately

### 5. Invoke code-architect Agent

Pass best practices and template structure to agent:

```
Task: "Make architectural decision for [topic].

FIRST: Read docs/project/adrs/README.md for ADR best practices and quality standards.
- Understand core principles (honest trade-offs, context over implementation, etc.)
- Learn section-specific guidance (what makes great Context, Decision, Consequences)
- Review quality checklist
- Understand common mistakes to avoid

SECOND: Read docs/project/adrs/adr-template.md to understand required sections.
- Template sections define what to gather
- Each section has a 'prompt' - use this to guide your analysis
- Each section has 'hint' - follow this for content guidance
- Required sections (required: true) MUST be completed
- Optional sections can be included if relevant

Mode: [Quick Mode | Deep Mode]
- Quick Mode: Brief, focused content (1-2 paragraphs per section, 200-400 words total)
- Deep Mode: Comprehensive analysis (2-4 paragraphs per section, 600-1000 words total)

Apply best practices from README.md:
- Ensure Context is honest problem framing, not decision justification
- Use definitive language in Decision section
- Include honest negative consequences (every decision has trade-offs)
- List real alternatives that were considered

Generate ADR content following template structure and best practices."
```

### 6. Generate ADR Content

**Content Depth Based on Mode**:

**Quick Mode** (5-10 min):
- Brief analysis for each template section
- Focus on essential information
- Concise format (bullets where appropriate)

**Deep Mode** (20+ min):
- Comprehensive analysis for each template section
- Include detailed rationale and trade-off analysis
- Structured paragraphs with supporting evidence

**Key Principle**: Let template define WHAT sections, let mode define HOW MUCH detail

### 7. Create ADR File

- Filename: `docs/project/adrs/ADR-###-<kebab-case-title>.md`
- Title should be concise and descriptive (e.g., "use-postgresql-for-primary-database")
- Insert current date in YYYY-MM-DD format
- Follow template structure exactly (sections, format, placeholders)
- Fill in all required sections from template
- Include optional sections where relevant

### 8. Link from Related Documents

When ADR is epic-specific:
- Add reference in epic file's Dependencies section: "ADR-###: [Title]"
- This maintains traceability without duplicating ADR storage

### Example ADR Creation Flow

```bash
# User runs command
/architect --foundation

# AI process:
1. Reads docs/project/adrs/README.md to refresh on ADR best practices and quality standards
2. Reads docs/project/adrs/adr-template.md to parse sections from YAML frontmatter
3. Scans docs/project/adrs/ to determine next number (e.g., ADR-003)
4. Invokes code-architect agent with best practices + template structure
5. Agent analyzes decision using:
   - Best practices guidance (honest trade-offs, clear context, definitive decision)
   - Template prompts (specific questions for each section)
   - Quality standards (checklist for what makes a good ADR)
6. Agent generates content for each required/relevant section
7. Agent self-checks against quality standards from README.md
8. Creates docs/project/adrs/ADR-003-use-nextjs-for-frontend.md following template format
9. If related to epic, updates epic file with ADR reference in Dependencies
```

**Template-Driven Example**:

```yaml
# User's custom docs/project/adrs/adr-template.md includes:
sections:
  - name: Status
    prompt: "What is the status?"
    required: true

  - name: Context
    prompt: "What problem are we solving?"
    required: true

  - name: Decision
    prompt: "What did we decide?"
    required: true

  - name: Cost Impact  # Custom section added by user
    prompt: "What are the cost implications?"
    required: false
    hint: "Include infrastructure, licensing, development time costs"

# /architect command reads this template and:
# - Ensures Status, Context, Decision are always included
# - Includes Cost Impact section if relevant to the decision
# - Uses prompts to guide code-architect agent analysis
# - Follows hint for Cost Impact content structure
```

## Integration with Workflow

**Position**: Early in development cycle, before implementation planning

```
/project-brief → /architect → /epic → /plan → /implement
                     ↓
            Creates ADR in docs/project/adrs/
                     ↓
            Referenced by epics/tasks
```

**Workflow Relationships**:

- **After /project-brief**: Make foundational architecture decisions
- **Before /epic**: Establish architectural patterns for features
- **During /epic**: Make epic-specific technical decisions
- **Before /plan**: Ensure technical approach is documented
- **Referenced by /plan**: Plans can reference ADRs for context

## Best Practices

**When to Use Each Mode**:

- **Direct Question**: Quick validation, non-critical choices, temporary decisions
- **Quick Mode**: Standard technical decisions, tool selection, pattern choices
- **Deep Mode**: Critical architecture, major refactors, complex trade-offs

**ADR Quality**:

- Keep Context focused on "why this decision matters"
- Make Decision definitive - use active voice ("We will use X")
- Be honest in Consequences - acknowledge trade-offs
- List real Alternatives you actually considered
- Add References to help future readers understand context

**Maintenance**:

- Update ADR status when decisions change:
  - "Proposed" → "Accepted" when finalized
  - "Accepted" → "Deprecated" when no longer recommended
  - "Accepted" → "Superseded by ADR-###" when replaced
- Create new ADR when superseding (don't edit the old one)
- Link superseding ADRs bidirectionally

## Related Commands

- **`/project-brief`**: Define project vision that informs architectural decisions
- **`/epic`**: Epics reference ADRs in Dependencies section
- **`/plan`**: Plans reference ADRs for technical context
- **`/docs`**: Can generate architecture documentation from ADRs

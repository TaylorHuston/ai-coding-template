# Architecture Decision Records - Best Practices Guide

**Purpose**: This guide defines principles and best practices for creating high-quality Architecture Decision Records (ADRs). The `/adr` command reads this before creating ADRs to ensure consistency and quality.

## What Are ADRs?

Architecture Decision Records document significant architectural and technical decisions along with their context and consequences. They answer the critical question: **"Why did we choose this approach?"**

ADRs serve as institutional memory, helping teams remember the rationale behind decisions months or years later, onboard new members effectively, and avoid relitigating settled questions.

## Core Principles

1. **Document Decisions, Not Requirements**: ADRs capture the "why" behind choices, not the "what" of requirements
2. **Honest Trade-off Analysis**: Acknowledge both benefits and costs of decisions
3. **Context Over Implementation**: Focus on forces, constraints, and alternatives rather than implementation details
4. **Immutable Record**: Once accepted, ADRs are not edited—supersede with new ADRs when decisions change
5. **Appropriate Scope**: Document architectural decisions that affect structure, patterns, or key technologies
6. **Timely Creation**: Write ADRs when decisions are made, not after implementation

## Section-by-Section Writing Guide

### Status

**Purpose**: Track decision lifecycle
**Values**: `Proposed`, `Accepted`, `Deprecated`, `Superseded by ADR-###`

**Best Practice**:
- Use `Proposed` during discussion phase
- Change to `Accepted` when decision is final
- Use `Superseded` (not `Deprecated`) when replaced by new ADR

### Context

**Purpose**: Explain the forces that led to this decision

**Great Context Includes**:
- The problem or need driving the decision
- Relevant constraints (technical, business, organizational)
- Forces in tension that require resolution
- Key assumptions being made

**Avoid**:
- Jumping straight to the solution
- Vague statements like "we need better performance"
- Implementation details (save for Decision section)
- Bias toward the chosen solution

**Quality Check**: Someone unfamiliar with the situation should understand why this decision matters.

### Decision

**Purpose**: State clearly what was decided and the primary rationale

**Great Decisions**:
- Use active, definitive voice: "We will use PostgreSQL" not "PostgreSQL could be used"
- State the decision in the first sentence
- Provide clear rationale explaining why this choice over others
- Focus on the "why" more than the "how"

**Avoid**:
- Hedging language ("maybe", "could", "might consider")
- Excessive implementation details
- Restating the problem (that's Context)
- Listing alternatives (that's Alternatives section)

**Quality Check**: A developer should know exactly what to do after reading this section.

### Consequences

**Purpose**: Honestly assess what becomes easier and harder due to this decision

**Structure**:
- **Positive**: Clear benefits and improvements
- **Negative**: Costs, trade-offs, and new challenges
- **Neutral**: Other impacts worth noting

**Great Consequences Cover**:
- Development velocity impact
- System complexity changes
- Operational/maintenance burden
- Team learning curve
- Cost implications (infrastructure, licensing, time)
- Scalability and performance impacts
- Security considerations

**Avoid**:
- Only listing positives (every decision has trade-offs)
- Vague statements ("better maintainability")
- Consequences that aren't actually caused by this decision

**Quality Check**: The negative consequences should be honest and specific.

### Alternatives Considered

**Purpose**: Document viable options evaluated and why they weren't chosen

**Great Alternatives**:
- List 2-5 realistic alternatives (not strawmen)
- Briefly explain key trade-offs for each
- State why not chosen (but keep it concise)
- Reference similar ADRs if applicable

**Avoid**:
- Only listing obviously bad alternatives
- Extensive detail (this isn't a comparison matrix)
- Criticizing alternatives unfairly
- Omitting the most obvious alternative

**Quality Check**: Prevents "why didn't we just use X?" questions later.

### References

**Purpose**: Link to supporting materials and related decisions

**Include**:
- Related ADRs (dependencies, superseded decisions)
- Epics or tasks implementing this decision
- External articles, benchmarks, or documentation
- RFCs or design documents
- Relevant project documentation

**Format**: Bulleted list with descriptive text, not just raw URLs

## Quality Standards

A high-quality ADR:

✅ **Clear Problem Statement**: Context explains the problem in 1-2 paragraphs
✅ **Definitive Decision**: No ambiguity about what was chosen
✅ **Honest Trade-offs**: Negative consequences are acknowledged
✅ **Actionable**: Team knows what to do based on the decision
✅ **Standalone**: Can be understood without external context
✅ **Concise**: Respects reader's time (Quick: 200-400 words, Deep: 600-1000 words)
✅ **Evidence-Based**: References support the decision when needed

## Mode Selection Guide

### Quick Mode (5-10 minutes)

**Use when**:
- Decision is straightforward with clear trade-offs
- Team has consensus
- Limited alternatives to consider
- Standard technology/pattern choices

**Output**: 200-400 words, focused on essentials

### Deep Mode (20+ minutes)

**Use when**:
- Decision is complex with many factors
- Significant cost or risk involved
- Novel approach for the team
- Multiple viable alternatives
- Long-term architectural implications
- Regulatory or compliance requirements

**Output**: 600-1000 words, comprehensive analysis

### Direct Question (30 seconds, no ADR)

**Use when**:
- Seeking quick validation
- Trivial or easily reversible choice
- Temporary decision
- Just need a recommendation

## Common Mistakes

1. **Writing After the Fact**: ADRs written months later lack genuine context and alternatives
2. **Decision Bias**: Context section reads like justification rather than honest problem framing
3. **Missing Negatives**: Only listing positive consequences (every decision has costs)
4. **Vague Context**: "We need better architecture" doesn't explain the actual problem
5. **Implementation Details**: Confusing "what we'll build" with "why we chose this approach"
6. **No Real Alternatives**: Listing only strawmen rather than viable options
7. **Hedging**: Using "maybe", "could", "might" instead of decisive language
8. **Too Abstract**: Consequences that can't be measured or verified

## ADR Lifecycle

```
Proposed → Decision under discussion, not yet finalized
   ↓
Accepted → Decision made and active
   ↓
Deprecated → No longer recommended but may still be in use
   ↓
Superseded → Replaced by a newer ADR (reference it: "Superseded by ADR-###")
```

**Key Rules**:
- Never edit an Accepted ADR's decision—create a new ADR to supersede it
- Update status when circumstances change
- Link superseding ADRs bidirectionally

## Template Customization

The ADR template (`adr-template.md`) uses YAML frontmatter to define sections. Customize it for your project needs:

- Add project-specific sections (e.g., "Cost Analysis", "Compliance Impact")
- Make sections required/optional via `required: true/false`
- Adjust prompts to match your team's terminology
- Add hints to guide better content

The `/adr` command reads the template at runtime, so changes apply immediately to new ADRs.

## Quick Reference

**File Location**: `docs/project/adrs/ADR-###-<kebab-case-title>.md`
**Numbering**: Sequential across all ADRs (ADR-001, ADR-002, ...)
**Template**: `docs/project/adrs/adr-template.md`
**Creation**: Use `/adr` command (reads this guide automatically)

---

**For Detailed Instructions**: See `/adr` command documentation
**For Template Format**: See `adr-template.md`

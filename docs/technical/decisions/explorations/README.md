---
version: "1.0.0"
created: "2025-09-16"
last_updated: "2025-09-16"
status: "active"
target_audience: ["architects", "developers", "ai-assistants"]
document_type: "reference"
tags: ["architecture", "exploration", "adr", "interactive"]
---

# Architectural Explorations

This directory contains interactive exploration sessions created by the `/idea` command. Each exploration represents a collaborative architectural decision-making process between humans and AI.

## Directory Structure

```
explorations/
├── README.md                    # This guide
├── sessions-index.yml           # Registry of all exploration sessions
├── templates/                   # Template files for new sessions
│   ├── conversation-template.md
│   ├── state-template.yml
│   ├── specialist-inputs-template.md
│   └── notes-template.md
└── {SESSION-ID}/               # Individual exploration sessions
    ├── conversation.md         # Complete conversation log
    ├── state.yml              # Current session state and progress
    ├── specialist-inputs.md   # Agent consultation results
    └── notes.md              # Scratchpad for ideas and insights
```

## Session Lifecycle

### 1. Active Exploration
Sessions in progress are actively maintained with:
- Real-time conversation logging
- Progressive state updates
- Specialist consultation tracking
- Decision factor evolution

### 2. Completed Exploration
When finalized with `/idea --finalize`, sessions become:
- Historical record of decision journey
- Reference for future similar decisions
- Input for generated ADR documentation
- Preserved exploration context

### 3. Archived Exploration
Older sessions may be archived but retained for:
- Decision audit trails
- Pattern recognition for future explorations
- Team learning and decision improvement

## File Purposes

### conversation.md
**Live conversation log** between human and AI facilitator including:
- All phases of exploration dialogue
- User responses and preferences
- AI guidance and questions
- Specialist consultation summaries
- Decision evolution tracking

### state.yml
**Machine-readable session state** containing:
- Current exploration phase and progress
- Options under consideration with preferences
- Specialist consultation history
- User constraints and preferences
- Decision factors and weightings
- Vision alignment context

### specialist-inputs.md
**Detailed agent consultation results** including:
- Full specialist analysis and recommendations
- Technical considerations and risks
- Implementation guidance
- Cross-cutting concerns identified
- Questions raised for further exploration

### notes.md
**Freeform scratchpad** for:
- Quick ideas and insights
- Links to relevant resources
- Sketches and diagrams (text-based)
- Personal reminders and follow-ups
- Alternative framings of the problem

## Usage Patterns

### Starting New Exploration
```bash
/idea --start "Should we implement microservices architecture?"
# Creates: explorations/{SESSION-ID}/
# Initializes: All template files with session context
# Begins: Interactive conversation facilitation
```

### Continuing Exploration
```bash
/idea --continue {SESSION-ID}
# Loads: Previous conversation and state
# Resumes: From last interaction point
# Maintains: Full context and progress
```

### Session Management
```bash
/idea --list                    # Show all sessions
/idea --list --active          # Show incomplete sessions only
/idea --review {SESSION-ID}    # Review and redirect exploration
```

### Finalizing Decisions
```bash
/idea --finalize {SESSION-ID}
# Generates: ADR from complete exploration
# Preserves: Exploration files for reference
# Updates: ADR index and architecture documentation
```

## Session ID Format

Session IDs follow the pattern: `YYYYMMDD-HHMMSS-idea-slug`

Examples:
- `20250116-103045-graphql-migration`
- `20250116-143022-microservices-architecture`
- `20250117-091234-database-choice-analytics`

## Best Practices

### For Effective Exploration
1. **Be specific with initial idea description**
2. **Share constraints and preferences early**
3. **Ask for specialist input when technical questions arise**
4. **Take time to understand trade-offs thoroughly**
5. **Document concerns and assumptions in notes**

### For Session Management
1. **Use descriptive idea titles for easy identification**
2. **Continue sessions within reasonable timeframes**
3. **Review progress periodically to maintain focus**
4. **Finalize decisions promptly to avoid stale explorations**

### For Quality Decisions
1. **Explore minimum 3 viable alternatives**
2. **Involve relevant specialists for technical analysis**
3. **Validate alignment with project vision**
4. **Document implementation considerations clearly**
5. **Identify success metrics and validation approaches**

## Integration with ADR Process

Explorations enhance traditional ADR creation by:

### Before ADR
- **Thorough exploration** of problem space and alternatives
- **Multi-perspective analysis** through specialist consultation
- **User-driven decision** evolution through conversation
- **Comprehensive rationale** development through discussion

### During ADR Generation
- **Rich context** from complete exploration history
- **Evidence-based alternatives** with technical analysis
- **Clear decision rationale** from conversation journey
- **Implementation guidance** from specialist inputs

### After ADR Creation
- **Decision audit trail** preserved in exploration files
- **Learning resource** for similar future decisions
- **Pattern recognition** for architectural decision-making
- **Team knowledge** capture and transfer

## Quality Indicators

Well-conducted explorations typically include:

### Comprehensive Coverage
- ✅ Multiple viable alternatives explored
- ✅ Relevant specialists consulted
- ✅ Trade-offs clearly understood
- ✅ Implementation considerations documented
- ✅ Risk assessment completed

### Collaborative Process
- ✅ User preferences and constraints captured
- ✅ Iterative refinement through discussion
- ✅ Vision alignment verified
- ✅ Consensus achieved through exploration
- ✅ Clear decision rationale articulated

### Documentation Quality
- ✅ Complete conversation history preserved
- ✅ Technical analysis documented
- ✅ Decision factors and weights recorded
- ✅ Implementation guidance provided
- ✅ Success metrics identified

## Common Session Patterns

### Technology Selection
Pattern: Compare specific technologies for defined use case
Duration: 20-40 minutes
Specialists: Typically 2-3 domain experts
Outcome: Technology choice with implementation strategy

### Architecture Pattern Decision
Pattern: Evaluate architectural approaches for system design
Duration: 30-60 minutes
Specialists: code-architect + 1-2 domain specialists
Outcome: Architectural pattern with design principles

### Performance Trade-off
Pattern: Balance performance against other system qualities
Duration: 20-30 minutes
Specialists: performance-optimizer + affected domain experts
Outcome: Performance strategy with acceptable trade-offs

### Security Implementation
Pattern: Choose security approach for specific requirements
Duration: 25-45 minutes
Specialists: security-auditor + relevant implementation experts
Outcome: Security architecture with implementation plan

## Troubleshooting

### Session Not Progressing
- Review current phase and last interaction
- Ask AI to summarize options and next steps
- Use `/idea --review` to redirect or refocus
- Consider breaking complex ideas into smaller decisions

### Too Many Options
- Focus on top 2-3 most viable alternatives
- Use specialist input to eliminate clearly inferior options
- Apply project constraints to narrow choices
- Prioritize options that align with vision and goals

### Technical Complexity
- Request specialist consultation for technical analysis
- Break down complex options into component decisions
- Focus on high-level approach before implementation details
- Document technical concerns for implementation phase

### Decision Paralysis
- Review decision factors and weights
- Focus on "good enough" decisions over perfect ones
- Consider time-boxing remaining exploration
- Use `/idea --finalize` to generate ADR for review

---

*Interactive architectural exploration creates better decisions through collaborative analysis and comprehensive documentation.*
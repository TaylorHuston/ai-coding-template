---
description: Interactive architectural idea exploration and decision facilitation with ADR generation
argument-hint: --start "IDEA_DESCRIPTION" | --continue SESSION-ID | --review SESSION-ID | --finalize SESSION-ID | --list
allowed-tools: Read, Write, Edit, MultiEdit, Bash(git), Grep, Glob, TodoWrite, Task
model: opus
---

Interactive architectural exploration workflow that facilitates collaborative decision-making through structured conversation, on-demand specialist consultation, and progressive documentation.

## Core Approach: AI as Architectural Facilitator

The AI serves as a conversation facilitator that:
- Guides structured exploration through phases
- Asks probing questions to understand context and constraints
- Presents options and alternatives for discussion
- Calls specialist agents on-demand during conversation for technical input
- Documents the exploration journey in real-time
- Generates comprehensive ADR only when consensus is reached

## Command Modes

### --start: Begin New Exploration
Initiates a new architectural exploration session with idea crystallization.

```bash
/idea --start "Should we migrate from REST to GraphQL?"
/idea --start "How should we implement real-time notifications?"
/idea --start "Database choice for high-throughput analytics"
```

**Process**:
1. Create unique session ID (format: YYYYMMDD-HHMMSS-idea-slug)
2. Initialize exploration directory and state files
3. Begin Phase 1: Idea Crystallization with contextual questions
4. Discover and integrate vision document for alignment
5. Start interactive conversation to understand problem space

### --continue: Resume Exploration
Continues an existing exploration session from current state.

```bash
/idea --continue 20250116-103045-graphql-migration
/idea --continue latest  # Resume most recent session
```

**Process**:
1. Load session state and conversation history
2. Present current phase status and previous discussion summary
3. Resume conversation from last interaction point
4. Continue guided exploration process

### --review: Analysis and Pivot
Reviews current exploration state and allows direction changes.

```bash
/idea --review 20250116-103045-graphql-migration
```

**Process**:
1. Summarize exploration progress and current options
2. Highlight key insights and trade-offs discovered
3. Offer opportunities to explore new angles or refine existing options
4. Allow user to redirect exploration focus or add new considerations

### --finalize: Generate ADR
Synthesizes the exploration into a formal Architecture Decision Record.

```bash
/idea --finalize 20250116-103045-graphql-migration
```

**Process**:
1. Review complete exploration conversation
2. Synthesize key decisions and rationale
3. Generate comprehensive ADR with proper numbering
4. Present ADR for user review and refinement
5. Finalize and add to ADR index

### --list: Show Active Sessions
Lists all exploration sessions and their current status.

```bash
/idea --list
/idea --list --active    # Only show incomplete sessions
/idea --list --recent    # Show last 10 sessions
```

## Exploration Phases

### Phase 1: Idea Crystallization (5-15 minutes)
**Objective**: Understand the problem space and driving factors

**Key Questions**:
- What specific problems are you trying to solve?
- What's driving this consideration?
- What constraints do we need to work within?
- How does this align with our project vision?

**Specialist Consultation**: context-analyzer for current system understanding

**Outputs**: Clear problem statement and exploration scope

### Phase 2: Alternative Exploration (15-30 minutes)
**Objective**: Identify and explore viable options

**Activities**:
- Generate 3-5 potential approaches
- Deep dive into promising alternatives
- Call relevant specialists for technical insights
- Build pros/cons for each option

**On-Demand Specialists**:
- api-designer: For API and integration decisions
- database-specialist: For data architecture choices
- security-auditor: For security-related decisions
- performance-optimizer: For performance implications
- devops-engineer: For infrastructure decisions
- frontend-specialist: For UI architecture
- backend-specialist: For server architecture

**Outputs**: Detailed options with technical analysis

### Phase 3: Trade-off Analysis (10-20 minutes)
**Objective**: Compare options and assess trade-offs

**Activities**:
- Structured comparison of final options
- Risk assessment discussion
- Resource and timeline implications
- Alignment with project goals and constraints

**Specialist Consultation**: code-architect for architectural coherence

**Outputs**: Clear trade-off understanding and preference direction

### Phase 4: Decision Synthesis (5-10 minutes)
**Objective**: Converge on decision with clear rationale

**Activities**:
- Synthesize discussion into recommended approach
- Validate alignment with project vision
- Confirm user agreement on decision
- Articulate implementation considerations

**Outputs**: Finalized decision ready for ADR generation

### Phase 5: Documentation (5-10 minutes)
**Objective**: Generate comprehensive ADR

**Activities**:
- Create ADR based on entire conversation
- Include all alternatives considered and rationale
- Document implementation guidance and follow-up actions
- Add to ADR index and update related documentation

**Outputs**: Complete ADR and updated architecture documentation

## File Structure

Each exploration creates:

```
docs/technical/decisions/explorations/
├── {SESSION-ID}/
│   ├── conversation.md          # Live conversation log
│   ├── state.yml               # Current session state
│   ├── specialist-inputs.md    # Agent consultation results
│   └── notes.md               # Scratchpad for ideas
└── sessions-index.yml          # All sessions registry
```

Upon finalization:

```
docs/technical/decisions/
├── {ADR-NUMBER}-{title}.md     # Generated ADR
└── explorations/{SESSION-ID}/  # Preserved exploration files
```

## Session State Management

**State File (state.yml)**:
```yaml
session_id: "20250116-103045-graphql-migration"
idea: "Should we migrate from REST to GraphQL?"
phase: "alternative-exploration"
phase_progress: "exploring-option-2"
vision_context:
  problem_statement: "Reduce API complexity and improve developer experience"
  success_metrics: ["Developer velocity", "API consistency"]
current_options:
  - title: "Gradual GraphQL adoption"
    status: "explored"
    preference: "moderate"
  - title: "Complete migration with federation"
    status: "exploring"
    preference: "pending"
  - title: "Hybrid REST+GraphQL architecture"
    status: "pending"
    preference: "pending"
specialist_consultations:
  - agent: "api-designer"
    timestamp: "2025-01-16T10:30:00"
    context: "Federation complexity analysis"
    key_insights: ["Schema evolution challenges", "Client migration strategy"]
user_preferences:
  - "Minimize disruption to existing clients"
  - "Improve developer experience"
  - "Maintain backward compatibility"
constraints:
  - "6-month timeline for completion"
  - "Limited GraphQL expertise on team"
next_questions:
  - "How do you envision handling client migration?"
  - "What's your risk tolerance for breaking changes?"
decision_factors:
  - factor: "Team expertise"
    weight: "high"
    status: "concerning"
  - factor: "Client impact"
    weight: "high"
    status: "critical"
created: "2025-01-16T10:30:00"
last_updated: "2025-01-16T11:45:00"
```

## Specialist Agent Integration

Agents are called **on-demand** during conversation with specific context:

**Agent Prompt Pattern**:
```
You are being consulted during an architectural exploration session.

Current Context:
- Idea: {idea}
- Phase: {current_phase}
- Options Under Consideration: {current_options}
- User Preferences: {user_preferences}
- Constraints: {constraints}

Specific Consultation Request:
{specific_question_or_analysis_needed}

Please provide:
1. Technical analysis relevant to your domain expertise
2. Key risks or considerations to discuss
3. Specific recommendations for this architectural decision
4. Questions we should explore further

Keep response focused and actionable for ongoing conversation.
```

**Integration Examples**:

```bash
# During option exploration
AI: "You mentioned performance concerns. Let me consult our performance specialist..."
[Calls performance-optimizer with current context]
AI: "Our performance analysis suggests..."

# During trade-off analysis
AI: "Let me get our security expert's perspective on these approaches..."
[Calls security-auditor with options]
AI: "From a security standpoint, here's what we need to consider..."
```

## Conversation Documentation

**Live Conversation Log (conversation.md)**:
```markdown
# GraphQL Migration Exploration

## Session: 20250116-103045-graphql-migration
## Current Phase: Alternative Exploration
## Last Updated: 2025-01-16 11:45:00

---

## Idea Crystallization (Phase 1)

**AI**: Let me help you explore this architectural decision. First, let me understand the context:

1. What specific problems with REST are you trying to solve?
2. Which parts of your API are most problematic?
3. What's driving this consideration - performance, developer experience, something else?

**User**: We're struggling with over-fetching on mobile clients and maintaining multiple API versions. The main driver is improving developer experience and API consistency.

**AI**: Interesting - so it sounds like the main drivers are client efficiency and maintenance burden. Let me bring in our API specialist to get some technical perspective...

**[Specialist Consultation: api-designer]**
- Schema federation could address versioning issues
- Migration complexity depends on client diversity
- Gradual adoption reduces risk but increases temporary complexity

**AI**: Based on our API patterns, here are 3 approaches I see:
- **Option A**: Gradual GraphQL adoption for new endpoints
- **Option B**: Complete migration with federation
- **Option C**: Hybrid REST+GraphQL architecture

Which of these resonates with you, and why?

**User**: Option A sounds safest, but I'm worried about the maintenance burden of running both systems.

---

## Alternative Exploration (Phase 2)

**AI**: That's a valid concern. Let's dive deeper into Option A's implications...

[Conversation continues with detailed exploration]
```

## Vision Integration

Each exploration automatically integrates project vision context:

1. **Discovery**: Read `docs/vision.md` or `project-vision.md` if available
2. **Alignment Check**: Ensure options align with project goals and differentiators
3. **Decision Criteria**: Use vision success metrics as decision factors
4. **Rationale**: Reference vision in ADR rationale

## Success Patterns

**Effective Exploration Characteristics**:
- 3-5 viable options thoroughly explored
- Multiple specialist perspectives integrated
- Clear trade-offs understood and documented
- User preferences and constraints captured
- Alignment with project vision verified
- Consensus reached through discussion

**Quality Gates**:
- Each option has technical analysis from relevant specialist
- Trade-offs clearly articulated and understood
- Implementation considerations documented
- Risk assessment completed
- User explicitly confirms decision readiness

## Generated ADR Quality

ADRs generated from interactive exploration include:

**Enhanced Context Section**:
- Full problem exploration history
- Driving factors and constraints
- Vision alignment statement

**Comprehensive Alternatives**:
- All options explored during conversation
- Technical analysis from specialist consultations
- User feedback and preference evolution

**Rich Consequences Section**:
- Positive/negative/neutral implications discussed
- Risk mitigation strategies identified
- Implementation considerations detailed

**Decision Journey**:
- Key conversation turning points
- Specialist insights that influenced decision
- User concerns and how they were addressed

## Example Usage Flow

```bash
# Start new exploration
/idea --start "Should we implement event sourcing for our audit system?"

# AI begins conversation...
# 30 minutes of interactive exploration...

# Continue later if needed
/idea --continue latest

# Review progress
/idea --review 20250116-event-sourcing

# Generate final ADR
/idea --finalize 20250116-event-sourcing
```

This creates a deeply collaborative architectural exploration process that leverages AI facilitation while keeping humans at the center of decision-making.
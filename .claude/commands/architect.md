---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants", "developers", "tech-leads"]
document_type: "command"
tags: ["workflow", "architecture", "technical-design"]
---

# /architect Command

**Purpose**: Define HOW to implement features through technical architecture design and decision-making, producing ADRs and system design documents that guide implementation.

## Command Usage

### Architect New Feature
```bash
/architect user-authentication
# Designs technical architecture for existing feature context
# References docs/technical/features/user-authentication.md
```

### Architecture Decision
```bash
/architect --decision "JWT vs Sessions for Auth"
# Explores specific technical decision
# Creates ADR documenting choice and rationale
```

### Update Architecture
```bash
/architect --update user-authentication
# Revisits and updates existing architecture decisions
# May create new ADRs or update system design
```

### System Design
```bash
/architect --system payment-processing
# Focuses on overall system design and integration
# Creates architecture documents showing system structure
```

## What This Command Does

### For Feature Architecture (Collaborative Process)
1. **Constraint Discovery**: Understand team, system, and business limitations collaboratively
2. **Alternative Exploration**: Present multiple viable approaches with explicit trade-offs
3. **Collaborative Decision Making**: Build consensus through structured trade-off discussions
4. **Risk-Aware Planning**: Identify and mitigate architectural risks together
5. **Context-Preserving Documentation**: Create living docs with decision rationale and uncertainties

### Trade-Off Focused Conversation Flow

The AI guides you through **structured decision discussions** that explore alternatives, assess trade-offs, and build consensus on technical choices through collaborative analysis.

```yaml
architecture_conversation_principles:
  options_before_decisions: "Present 2-3 concrete alternatives with trade-offs"
  confidence_transparency: "Express uncertainty about technology choices"
  constraint_acknowledgment: "Understand team/system limitations"
  trade_off_analysis: "Every choice has costs - make them explicit"
  iterative_refinement: "Build complex decisions from simple ones"
```

#### Phase 1: Constraint Discovery & Context Setting

**Checkpoint 1A - Requirements Validation**
- *AI*: "From the feature context, I understand we need [capability A], [capability B], and [capability C]. The key constraints seem to be [constraint 1] and [constraint 2]. What technical requirements am I missing?"
- *Focus*: Validate technical understanding of requirements
- *Confidence Check*: "I'm 90% confident about the functional needs, but only 60% about performance requirements"

**Checkpoint 1B - Team & System Context**
- *AI*: "I see your current stack uses [technologies]. Your team's expertise seems to be in [areas]. What are your team's strengths? What technologies should we avoid due to learning curve or maintenance concerns?"
- *Focus*: Understand team capabilities and system constraints
- *Context Inquiry*: "What has worked well/poorly in past architecture decisions?"

**Checkpoint 1C - Non-Functional Requirements Clarification**
- *AI*: "For this feature, I'm thinking about [scale], [performance], [security] requirements. I'm uncertain about [specific concern]. What are your expectations for reliability, scalability, and maintainability?"
- *Focus*: Clarify quality attributes and constraints
- *Priority Forcing*: "If we had to choose between performance and simplicity, what matters more?"

#### Phase 2: Alternative Architecture Exploration

**Checkpoint 2A - Approach Options Presentation**
- *AI*: "I see 3 viable architectural approaches:
  - **Option A**: [Approach 1] - Pro: [benefits], Con: [costs], Risk: [concerns]
  - **Option B**: [Approach 2] - Pro: [benefits], Con: [costs], Risk: [concerns]
  - **Option C**: [Approach 3] - Pro: [benefits], Con: [costs], Risk: [concerns]
  Each has different implications for [key trade-off]. Which direction feels right?"
- *Focus*: Present concrete alternatives with explicit trade-offs
- *Decision Support*: "What factors matter most for this choice?"

**Checkpoint 2B - Technology Stack Discussion**
- *AI*: "For [chosen approach], I'm considering [tech option A] vs [tech option B]. Here's how they compare:
  - **Learning Curve**: A requires [effort], B requires [effort]
  - **Performance**: A delivers [performance], B delivers [performance]
  - **Ecosystem**: A has [ecosystem], B has [ecosystem]
  I'm 80% confident about A for simplicity, but only 70% about B for performance. What's your preference?"
- *Focus*: Compare specific technology choices
- *Uncertainty Acknowledgment*: "Which aspect should we validate further?"

**Checkpoint 2C - Integration Impact Analysis**
- *AI*: "This architectural choice affects [existing system A] and [existing system B]. I see potential challenges with [integration point]. How does this fit with your current architecture? What integration concerns do you have?"
- *Focus*: Understand system-wide implications
- *Risk Assessment*: "What integration risks worry you most?"

#### Phase 3: Decision Refinement & Validation

**Checkpoint 3A - Trade-off Resolution**
- *AI*: "We're facing a key trade-off: [trade-off description]. Option X gives us [benefit] but costs us [cost]. Option Y is simpler but limits [capability]. Given your priorities, which constraint is more acceptable?"
- *Focus*: Resolve critical architectural trade-offs
- *Constraint Validation*: "Can we live with [limitation] to get [benefit]?"

**Checkpoint 3B - Risk Mitigation Planning**
- *AI*: "I see [2-3 main risks] with our chosen approach. For [risk A], we could [mitigation]. For [risk B], we could [mitigation]. What risks concern you most? How should we mitigate them?"
- *Focus*: Address architectural risks proactively
- *Contingency Planning*: "What's our backup plan if [main approach] doesn't work?"

**Checkpoint 3C - Implementation Feasibility**
- *AI*: "This architecture assumes [assumption A] and [assumption B]. I'm confident about A but uncertain about B. Do these assumptions hold? What could invalidate our approach?"
- *Focus*: Validate architecture assumptions
- *Reality Check*: "Is this actually buildable with our current resources?"

#### Phase 4: Documentation & Decision Recording

**Checkpoint 4A - Decision Summary**
- *AI*: "Let me summarize our architectural decisions:
  - **Core Approach**: [decision] because [rationale]
  - **Technology Stack**: [choices] due to [trade-offs]
  - **Key Trade-offs**: We chose [A] over [B] to optimize for [priority]
  - **Main Risks**: [risks] with [mitigations]
  Does this capture our reasoning correctly?"
- *Focus*: Validate complete decision set
- *Coherence Check*: "Do these decisions work together?"

**Checkpoint 4B - Architecture Documentation Planning**
- *AI*: "For documentation, I'll create:
  - Architecture doc showing [system structure]
  - ADR for [key decision] explaining [rationale]
  - Integration patterns for [external connections]
  What other documentation would help the implementation team?"
- *Focus*: Plan comprehensive documentation
- *Audience Consideration*: "What do developers need to understand this architecture?"

### Context Management Throughout Architecture Discussions

**Every 2-3 Checkpoints:**
```yaml
architecture_context_refresh:
  decisions_made: "Key architectural choices and rationale"
  constraints_identified: "Technical and team limitations we're working within"
  trade_offs_accepted: "What we're optimizing for and what we're sacrificing"
  open_questions: "Technical uncertainties that need validation"
  risks_acknowledged: "Known risks and mitigation strategies"
```

**Architecture Iteration Triggers:**
```yaml
architecture_refinement_signals:
  constraint_discovery: "New technical constraint affects our approach"
  assumption_invalidated: "Key assumption proves incorrect during exploration"
  team_feedback: "Team expertise or preferences change considerations"
  requirement_shift: "Feature requirements change architectural needs"
  risk_materialization: "Identified risk becomes more serious than expected"
```

### Collaborative Decision Artifacts

**Architecture Decision Template:**
```yaml
decision_format:
  context: "What situation led to this decision?"
  alternatives: "What options did we consider?"
  decision: "What did we choose?"
  rationale: "Why did we choose this?"
  trade_offs: "What are we gaining/losing?"
  confidence: "How certain are we? (high/medium/low)"
  assumptions: "What must be true for this to work?"
  validation_plan: "How will we verify this works?"
  revisit_triggers: "What would make us reconsider?"
```

**Living Architecture Document:**
```markdown
## System Architecture: [Feature Name]

### Overview
[Architecture summary]
<!-- VALIDATE: Does this actually solve the core requirements? -->

### Technology Choices
**Database**: PostgreSQL (Confidence: High)
- Rationale: Complex queries, team expertise, ACID compliance
- Alternative considered: MongoDB (rejected due to schema complexity)

**API Framework**: Express.js (Confidence: Medium)
- Rationale: Team familiarity, rapid development
<!-- DISCUSSION: Should we consider FastAPI for better performance? -->

### Integration Points
**User Service**: REST API integration
<!-- TODO: Confirm API contract with User Service team -->

### Known Trade-offs
- Chose simplicity over performance for MVP
- Accepted vendor lock-in for faster implementation
<!-- QUESTION: Are these trade-offs still acceptable? -->

### Risk Mitigation
- Database performance: Implement caching layer if needed
- API rate limits: Add queue system for high-volume operations
<!-- MONITOR: Watch these metrics during implementation -->
```

## Integration with Workflow

### Position in 5-Phase Workflow
```
vision.md                           → Why the product exists
features/user-auth.md               → Why we need authentication
architecture/auth-system-design.md  → How we'll design auth system (THIS COMMAND)
decisions/ADR-001-jwt-selection.md  → Why we chose JWT (THIS COMMAND)
implementations/2024-01-15-auth.md  → What steps we took
```

### Relationship to Other Commands
- **After `/vision` and `/feature`**: Architecture decisions guided by vision goals and feature requirements
- **Before `/plan`**: Define architecture before implementation planning
- **Creates input for `/plan`**: Architecture decisions guide task breakdown
- **Vision Alignment**: Ensures technical decisions support core product vision

## Agent Coordination

### Primary Agent
**code-architect** handles technical architecture design:
- Specializes in system design and architectural patterns
- Understands technical trade-offs and best practices
- Can evaluate scalability and maintainability implications

### Supporting Agents
- **backend-specialist**: For server-side architecture decisions
- **frontend-specialist**: For client-side architecture decisions
- **database-specialist**: For data architecture and schema design
- **security-auditor**: For security architecture considerations
- **performance-optimizer**: For performance and scalability planning

### Multi-Agent Consultation
For complex features, multiple specialists may be consulted:
```yaml
Feature: Real-time Notifications
Agents Consulted:
  - backend-specialist: WebSocket vs SSE architecture
  - frontend-specialist: Client-side state management
  - database-specialist: Notification storage and querying
  - performance-optimizer: Scalability considerations
```

## Output Artifacts

### Architecture Documents
```yaml
Location: docs/technical/architecture/[feature-name]-architecture.md
Content:
  - System overview and component structure
  - Technology stack and rationale
  - Data models and relationships
  - API design and integration points
  - Security and performance considerations
```

### Architecture Decision Records (ADRs)
```yaml
Location: docs/technical/decisions/ADR-XXX-[decision-title].md
Content:
  - Context and problem statement
  - Decision made and rationale
  - Alternatives considered
  - Consequences and trade-offs
  - Status and related decisions
```

### Design Artifacts
- Component diagrams (when appropriate)
- Data flow diagrams
- API specifications
- Database schemas

## Types of Architecture Work

### Feature Architecture
```bash
/architect user-authentication
# Designs complete architecture for a feature
# Creates both architecture doc and relevant ADRs
```

### Specific Technical Decisions
```bash
/architect --decision "Database selection for analytics"
# Focuses on one specific technical choice
# Creates targeted ADR with alternatives analysis
```

### System Integration
```bash
/architect --integration payment-system user-accounts
# Designs how multiple features/systems work together
# May update multiple architecture docs
```

### Architecture Review
```bash
/architect --review existing-system
# Analyzes current architecture for improvements
# May suggest new ADRs or architecture updates
```

## Best Practices

### When to Use `/architect` (Decision Framework)

```yaml
architecture_decision_tree:
  technical_choices:
    question: "Are there multiple viable technical approaches?"
    if_yes: "Use /architect to explore trade-offs collaboratively"
    if_no: "Consider simpler technical documentation"

  system_impact:
    question: "Does this affect multiple system components?"
    if_yes: "Use /architect to design integration patterns"
    if_no: "Might be local implementation detail"

  future_implications:
    question: "Will this decision affect future development?"
    if_yes: "Use /architect to document rationale and trade-offs"
    if_no: "Consider implementation-focused approach"
```

**Use `/architect` for:**
- ✅ **Technology Selection**: Multiple viable options with trade-offs
- ✅ **System Integration**: Connecting multiple components or external services
- ✅ **Scalability Planning**: Performance or growth requirements
- ✅ **Security Architecture**: Authentication, authorization, data protection
- ✅ **Data Architecture**: Database design, storage patterns, caching
- ✅ **API Design**: Service contracts and integration patterns
- ✅ **Architecture Evolution**: Modernizing or refactoring existing systems

**Use simpler approaches for:**
- ❌ Obvious technology choices (using existing stack)
- ❌ Simple bug fixes without architectural impact
- ❌ Minor configuration or parameter changes
- ❌ UI/styling changes without backend impact
- ❌ Routine maintenance or dependency updates
- ❌ Local implementation details within established patterns

### Collaborative Architecture Design Principles

1. **Present Alternatives Before Decisions**: Never present single solutions
   - *Good*: "Option A: microservices (scale but complexity) vs Option B: monolith (simplicity but limits)"
   - *Poor*: "We should use microservices" (no alternatives presented)

2. **Make Trade-offs Explicit**: Every choice has costs
   - *Pattern*: "To get [benefit], we accept [cost]. Is this trade-off acceptable?"
   - *Avoid*: Presenting solutions as purely beneficial

3. **Express Technology Uncertainty**: Invite collaboration on uncertain choices
   - *Good*: "I'm 90% confident about PostgreSQL, but only 60% about Redis caching"
   - *Poor*: Presenting uncertain technology choices as confident recommendations

4. **Validate Assumptions Early**: Test architectural assumptions
   - *Pattern*: "This assumes [assumption] - can we validate this before proceeding?"
   - *Risk*: Building elaborate architectures on unvalidated assumptions

5. **Consider Team Context**: Architecture must fit team capabilities
   - *Consider*: Current expertise, learning capacity, maintenance burden
   - *Avoid*: Choosing optimal technology regardless of team context

6. **Plan for Architecture Evolution**: Design for change
   - *Pattern*: "Start simple with [approach], evolve to [complexity] as needed"
   - *Risk*: Over-engineering for theoretical future requirements

## External Tool Integration

### Design Tool Integration
- Can reference external design documents (Figma, Lucidchart)
- Links to existing system documentation
- Integrates with enterprise architecture repositories

### Code Integration
- References existing codebase patterns
- Considers current technology stack
- Plans for code organization and structure

## Collaborative Architecture Examples

### Feature Architecture - Trade-off Exploration
```bash
/architect user-authentication

# Conversation Flow:
AI: "For authentication, I see 3 approaches:
- JWT tokens: Stateless, scalable, but security complexity
- Server sessions: Simple, secure, but state management
- OAuth integration: Robust, but external dependency
What matters more: simplicity, scalability, or security control?"

User: "Security is critical, but we're a small team"
AI: "That suggests server sessions for simplicity with high security. I'm 90% confident this meets your needs, but 60% concerned about mobile app support. Do you need mobile API access?"
# ... continues building architecture collaboratively
```

### Technology Decision - Context-Aware Analysis
```bash
/architect --decision "Database selection for analytics"

# Conversation Flow:
AI: "For analytics, I'm considering:
- PostgreSQL: Your team knows it, complex queries, but large dataset concerns
- MongoDB: Better for unstructured data, but learning curve
- ClickHouse: Analytics-optimized, but operational complexity
Given your team's PostgreSQL expertise, should we start there and optimize later?"

User: "We need to handle 10M records efficiently"
AI: "That changes things. PostgreSQL can handle 10M with proper indexing, but ClickHouse would be faster. I'm 70% confident your team could learn ClickHouse. What's your risk tolerance for new technology?"
```

### System Integration - Risk-Aware Planning
```bash
/architect --integration payment-system user-accounts

# Conversation Flow:
AI: "Integrating payments with user accounts has 2 main approaches:
- Tight coupling: Direct database relationships, fast but rigid
- Event-driven: Loose coupling via events, flexible but complexity
I'm 80% confident about tight coupling for MVP, but concerned about future payment provider changes. How stable is your payment strategy?"

User: "We might switch providers in 6 months"
AI: "That risk suggests event-driven architecture despite the complexity. We could start with simple events and evolve. The trade-off is initial development time for future flexibility. Worth it?"
```

### Architecture Review - Learning Integration
```bash
/architect --review existing-auth-system

# Conversation Flow:
AI: "Looking at your current auth system, I see:
- JWT implementation with 7-day expiry
- No refresh token mechanism
- User sessions stored in Redis
This creates a user experience gap: forced re-login every week. Should we add refresh tokens or extend JWT expiry?"

User: "Users complain about frequent re-logins"
AI: "I see 2 options: 30-day JWTs (simpler) or refresh tokens (more secure). Given your security requirements, I lean toward refresh tokens despite complexity. What's your preference?"
```

### Complex System Design - Iterative Building
```bash
/architect real-time-collaboration-system

# Conversation Flow:
AI: "Real-time collaboration has multiple architectural concerns. Let's start with the core: how should multiple users see each other's changes?
- WebSockets: True real-time, but connection management
- Server-Sent Events: Simpler, but one-way communication
- Polling: Most compatible, but not real-time
What's your priority: true real-time or implementation simplicity?"

[After deciding on WebSockets]
AI: "Good choice. Now for conflict resolution:
- Operational Transforms: Industry standard, but complex
- CRDT: Emerging approach, simpler logic
- Last-write-wins: Simple but data loss risk
Given your team size, should we start with last-write-wins and evolve?"
```

## Collaborative Architecture Quality Gates

### Decision Quality (High Confidence Required)
**Alternative Exploration:**
- ✅ At least 2-3 viable alternatives were presented and compared
- ✅ Trade-offs for each alternative are explicit and understood
- ✅ Decision criteria were discussed and priorities established
- ✅ Team context (expertise, constraints) was considered

**Technical Validation:**
- ✅ Key technical assumptions identified and validation planned
- ✅ Integration points with existing systems are understood
- ✅ Performance and scalability implications are documented
- ✅ Security considerations are addressed for chosen approach

### Collaboration Completeness (Medium Confidence Acceptable)
**Stakeholder Alignment:**
- ✅ Team preferences and expertise were incorporated
- ✅ Business constraints and priorities were considered
- ✅ Implementation feasibility was validated with development team
- ✅ Uncertain areas are marked for further validation

**Documentation Quality:**
- ✅ ADRs capture alternatives, decision, and rationale
- ✅ Architecture docs are actionable for implementation
- ✅ Risk mitigation strategies are documented
- ✅ Context preserved for future architecture evolution

### Red Flags (Stop and Iterate):
- 🚨 Only one architectural approach was considered
- 🚨 Technology choices based on preference, not analysis
- 🚨 Major assumptions unvalidated or unacknowledged
- 🚨 Team expertise/constraints ignored in decisions
- 🚨 Integration impacts not understood or documented
- 🚨 No plan for validating architectural assumptions

### Context Handoff Requirements:
- ✅ Decision rationale preserved for future reference
- ✅ Open questions and uncertainties documented
- ✅ Implementation guidance provided for development team
- ✅ Architecture evolution strategy outlined

## Advanced Collaborative Patterns

### Architecture Consistency Analysis
```bash
/architect --consistency-review

# Conversation Flow:
AI: "I've analyzed your existing architecture patterns:
- 3 features use REST APIs
- 2 features use GraphQL
- 1 feature uses WebSockets
This inconsistency creates maintenance burden. Should we standardize on REST, or is there a reason for this variety?"
```

### Technology Risk Assessment
```bash
/architect --tech-risk-analysis

# Conversation Flow:
AI: "Looking at your technology stack, I see potential risks:
- React version 2 versions behind (security patches)
- MongoDB driver deprecated (EOL in 6 months)
- Custom auth system (maintenance burden)
Which risk should we prioritize addressing? What's your migration capacity?"
```

### Architecture Evolution Planning
```bash
/architect --evolution-strategy current-system

# Conversation Flow:
AI: "Your current monolith works for 10K users, but I see bottlenecks emerging:
- Database queries slowing down
- Deployment takes 20 minutes
- Feature conflicts during development
For evolution, I see 3 paths:
- Optimize monolith: Faster but limited scalability
- Extract services: More work but better scaling
- Rewrite with modern stack: Highest risk/reward
What's your growth timeline and risk tolerance?"
```

### Cross-Feature Architecture Impact
```bash
/architect --impact-analysis new-notification-system

# Conversation Flow:
AI: "Adding notifications affects 4 existing features:
- User Settings: Need notification preferences
- Email Service: Integration point for delivery
- Mobile App: Push notification support needed
- Analytics: Tracking notification effectiveness
This is bigger than just notifications. Should we plan this as a cross-cutting enhancement?"
```

## Related Commands

- **`/feature`**: Define WHAT to build (prerequisite)
- **`/plan`**: Break down HOW into implementable tasks
- **`/develop`**: Execute the implementation
- **`/docs sync`**: Update architecture documentation

---

*The `/architect` command ensures technical decisions are thoughtful, documented, and aligned with both requirements and system evolution.*
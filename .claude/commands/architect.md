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

### For Feature Architecture
1. **Technical Analysis**: Reviews feature requirements from feature context doc
2. **Architecture Exploration**: Explores different technical approaches
3. **Technology Selection**: Chooses appropriate technologies and patterns
4. **Design Documentation**: Creates system design and architecture docs
5. **Decision Recording**: Documents decisions in ADRs with rationale

### Conversation Flow
The AI will guide you through these phases:

#### 1. Requirements Review
- Analyzes feature context document
- Understands functional and non-functional requirements
- Identifies technical constraints and considerations

#### 2. Architecture Exploration
- Explores multiple technical approaches
- Considers different patterns and technologies
- Evaluates trade-offs and implications

#### 3. Technology Selection
- Chooses specific technologies, frameworks, libraries
- Considers team expertise and system consistency
- Evaluates performance, scalability, maintainability

#### 4. Design Documentation
- Creates system design documents
- Documents component interactions
- Defines data models and API contracts

#### 5. Decision Recording
- Creates ADRs for significant decisions
- Documents alternatives considered
- Explains rationale and consequences

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

### When to Use `/architect`
- **New feature implementation**: After feature context is defined
- **Technical decisions**: Choosing between architectural alternatives
- **System integration**: Connecting multiple components or systems
- **Technology changes**: Adopting new frameworks or tools
- **Performance requirements**: Designing for scale or performance
- **Security considerations**: Implementing security patterns

### When NOT to Use `/architect`
- Simple bug fixes without architectural impact
- Minor configuration changes
- Styling or UI tweaks
- Routine maintenance tasks

### Quality Architecture Design
1. **Start with requirements**: Understand functional and non-functional needs
2. **Consider alternatives**: Explore multiple approaches before deciding
3. **Document trade-offs**: Explain why specific choices were made
4. **Think about evolution**: Design for change and growth
5. **Security by design**: Consider security from the start
6. **Performance awareness**: Understand scalability implications

## External Tool Integration

### Design Tool Integration
- Can reference external design documents (Figma, Lucidchart)
- Links to existing system documentation
- Integrates with enterprise architecture repositories

### Code Integration
- References existing codebase patterns
- Considers current technology stack
- Plans for code organization and structure

## Examples

### New Feature Architecture
```bash
/architect user-authentication
# Reviews feature requirements from docs/technical/features/user-authentication.md
# Explores JWT vs session-based authentication
# Creates auth-system-architecture.md and ADR-001-jwt-selection.md
# Documents security patterns and integration points
```

### Technical Decision
```bash
/architect --decision "React vs Vue for frontend"
# Analyzes team expertise, project requirements, ecosystem
# Creates ADR with thorough alternatives analysis
# Considers migration path and learning curve
```

### System Integration
```bash
/architect --integration notification-service user-management
# Designs how notifications integrate with user system
# Updates both architecture docs
# Creates integration patterns and API contracts
```

## Quality Gates

Before completing architecture work:
- ✅ Requirements are clearly understood
- ✅ Multiple alternatives were considered
- ✅ Technology choices are justified
- ✅ Security implications are addressed
- ✅ Performance considerations are documented
- ✅ Integration points are defined
- ✅ ADRs are complete with proper rationale
- ✅ Architecture docs are clear and actionable

## Advanced Features

### Architecture Pattern Library
```bash
/architect --patterns
# Reviews common patterns used in the system
# Suggests consistent approaches for new features
# Helps maintain architectural coherence
```

### Technology Radar
```bash
/architect --tech-radar
# Analyzes technology choices across the system
# Identifies outdated or problematic technologies
# Suggests modernization opportunities
```

## Related Commands

- **`/feature`**: Define WHAT to build (prerequisite)
- **`/plan`**: Break down HOW into implementable tasks
- **`/develop`**: Execute the implementation
- **`/docs sync`**: Update architecture documentation

---

*The `/architect` command ensures technical decisions are thoughtful, documented, and aligned with both requirements and system evolution.*
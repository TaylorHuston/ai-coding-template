---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-18"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "architecture", "decisions", "technical", "infrastructure"]
---

# /architect Command

**Purpose**: Make all technical architecture decisions - from foundational technology stack to feature-specific implementation patterns.

## Usage

```bash
/architect --foundation         # Technology stack and infrastructure decisions
/architect --feature "name"     # Feature-specific architecture patterns
/architect --decision "topic"   # Specific technical decision or trade-off
/architect --infrastructure     # Deployment, containers, CI/CD architecture
/architect --update "name"      # Update existing architecture decisions
```

## Objectives

**Primary Goal**: Make comprehensive technical decisions through collaborative exploration of alternatives and trade-offs.

**Core Outcomes**:

1. **Technology Foundation**: Framework, database, infrastructure, and development environment decisions
2. **Feature Architecture**: Implementation patterns, component design, and integration approaches
3. **System Design**: Data flow, API design, security patterns, and performance considerations
4. **Infrastructure Architecture**: Containerization, deployment, monitoring, and CI/CD pipeline design
5. **Decision Documentation**: Create ADRs in `docs/technical/decisions/` with rationale and alternatives

## Approach

**Collaborative decision-making** through natural conversation focused on alternatives and trade-offs:

- Present 2-3 viable options with clear pros/cons for each decision
- Ask focused questions about priorities and constraints
- Consider team expertise, project scale, and long-term maintenance
- Build decisions iteratively through back-and-forth discussion
- Document final decisions with complete rationale

**Key principle**: Always explore alternatives rather than prescribing solutions. Every technical decision should consider multiple approaches.

## Key Architecture Areas

### Foundation Level (Technology Stack)

- **Backend Framework**: Language, framework, API approach (REST/GraphQL/tRPC)
- **Frontend Framework**: UI framework, build tools, styling approach
- **Database Architecture**: Database choice, ORM/query layer, migration strategy
- **Development Environment**: Local setup, containerization, dependency management

### Infrastructure Level (Deployment & Operations)

- **Containerization**: Docker strategy, orchestration approach
- **Deployment Pipeline**: CI/CD setup, testing automation, quality gates
- **Environment Management**: Development, staging, production configuration
- **Monitoring & Operations**: Logging, metrics, alerting, performance monitoring

### Feature Level (Implementation Patterns)

- **Component Architecture**: Component design, state management, data flow
- **API Design**: Endpoint structure, data validation, error handling
- **Security Patterns**: Authentication, authorization, data protection
- **Performance Optimization**: Caching, optimization strategies, scaling considerations

### Integration Level (System Connectivity)

- **External Services**: Third-party integrations, API consumption patterns
- **Data Flow**: Inter-service communication, event handling, synchronization
- **Cross-Cutting Concerns**: Logging, error handling, configuration management

## Conversation Flow

**Start with context**: What requirements and constraints guide this decision?
**Present options**: 2-3 viable approaches with clear trade-offs
**Explore priorities**: Performance vs simplicity? Team skills vs cutting-edge?
**Consider constraints**: Timeline, team size, maintenance capabilities?
**Make decisions**: Choose approach based on priorities and context
**Document rationale**: Create comprehensive ADRs with reasoning

## Outputs

**Architecture Decision Records (ADRs)** in `docs/technical/decisions/`:

- **Context**: Problem statement and decision requirements
- **Alternatives Considered**: 2-3 options with detailed pros/cons analysis
- **Decision**: Chosen approach with clear rationale
- **Consequences**: Implications, risks, and follow-up actions
- **Implementation Notes**: Key considerations for development teams

**Supporting Documentation**:

- **Architecture diagrams** in `docs/technical/architecture/` when beneficial
- **API specifications** for interface decisions
- **Infrastructure documentation** for deployment architecture
- **Security documentation** for security pattern decisions

## Integration with Workflow

**Position**: After `/design`, before `/plan`

**Workflow Relationships**:

- **After /design**: Design requirements drive architectural decisions
- **Before /plan**: Architecture decisions inform implementation planning
- **Guides /develop**: Implementation follows architectural patterns
- **Supports iterations**: Architecture can evolve based on development learnings

**Flexible Scope**:

- **New Projects**: Start with foundation architecture for technology stack
- **New Features**: Focus on feature-specific patterns and integration
- **System Evolution**: Update architecture for scalability or technology changes
- **Technical Debt**: Re-architect problematic areas with improved patterns

## Success Criteria

**Effective Architecture Decisions**:

- Multiple alternatives explored with clear trade-offs documented
- Decisions aligned with design requirements and project constraints
- Team capabilities and context considered in technology choices
- Clear implementation guidance provided for development teams
- Rationale documented for future reference and evolution

**Quality Indicators**:

- Development teams understand architectural patterns and constraints
- Chosen technologies support design requirements effectively
- Architecture scales appropriately for project scope and timeline
- Technical decisions are consistent and well-integrated
- Clear migration path exists for architectural changes

## Agent Coordination

**Primary Agents**:

- **code-architect**: System design and architectural decision leadership
- **devops-engineer**: Infrastructure, containerization, and deployment architecture
- **database-specialist**: Database architecture, schema design, and data patterns
- **security-auditor**: Security architecture, threat modeling, and compliance patterns

**Supporting Agents** (feature-specific architecture):

- **frontend-specialist**: Frontend architecture patterns and component design
- **backend-specialist**: Backend service architecture and API design patterns
- **api-designer**: API architecture, service contracts, and interface design
- **performance-optimizer**: Performance architecture and optimization patterns

**Consultation Approach**: Engage relevant specialists based on architectural scope and decisions being made.

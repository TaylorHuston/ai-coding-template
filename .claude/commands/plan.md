---
description: Implementation planning with feature/architecture context integration
argument-hint: --issue ISSUE-KEY [--feature FEATURE-NAME] [--working-dir DIR-NAME] [--branch BRANCH-NAME] [--agents LIST] [--review-plan] [--init]
allowed-tools: Read, Write, Edit, MultiEdit, Bash(git), Grep, Glob, TodoWrite, Task
model: opus
---

Implementation planning workflow that integrates feature and architecture context:
1. Check for existing feature context (docs/technical/features/) and architecture docs
2. Create working directory in .claude/working/[issue-id]/
3. Create/checkout feature branch if needed
4. Execute sequential agent analysis chain building on feature/architecture context
5. Generate comprehensive PLAN.md with phase-based tasks (P X.X.X numbering)
6. Initialize coordination files (HANDOFF.yml, RESEARCH.md)
7. Link to feature context and architecture decisions
8. Provide implementation guidance and next steps

## Incremental Planning Conversation Process

The AI facilitates **structured agent consultations** through collaborative checkpoints, building planning consensus incrementally rather than executing all agents sequentially.

```yaml
incremental_planning_principles:
  agent_as_conversation: "Each agent consultation becomes a dialogue"
  priority_alignment: "Validate priorities before detailed planning"
  expertise_transparency: "Agents express confidence and limitations"
  implementation_feasibility: "Check buildability as we plan"
  iterative_refinement: "Refine plan based on specialist insights"
```

### Phase 1: Context Setting & Priority Alignment

**Checkpoint 1A - Requirements Clarification**
- *AI*: "Let me understand this issue. From [issue description], I see [key requirements]. What's the core problem we're solving? What would success look like?"
- *Focus*: Clarify scope and success criteria before planning
- *Interactive Validation*: "Am I understanding this correctly?"

**Checkpoint 1B - Complexity Assessment**
- *AI*: "This seems like a [Simple/Complex/Architectural] issue. I'm thinking it touches [systems/components]. Does this match your expectation of the work involved?"
- *Focus*: Align on complexity and scope
- *Strategy Discussion*: "Should we tackle this backend-first, frontend-first, or full-stack?"

**Checkpoint 1C - Specialist Consultation Planning**
- *AI*: "For this work, I recommend consulting with [3-4 specialist agents]. Here's my thinking:
  - **context-analyzer**: Understand existing patterns and codebase impact
  - **[domain-specialist]**: Get expert insight on [technical area]
  - **test-engineer**: Plan testing strategy
  - **project-manager**: Structure implementation phases
  Should we add other specialists? Any concerns about this approach?"
- *Focus*: Agree on which expertise is needed
- *Consultation Planning*: "Let's start with [first specialist] and build from there"

### Phase 2: Iterative Specialist Consultations

**Agent Consultation Pattern (for each specialist):**

**Pre-Consultation Checkpoint**
- *AI*: "Now consulting with [specialist-agent] about [specific focus area]. Based on our discussion so far, I'll ask them about [key questions]. Anything specific you want me to explore with them?"
- *Focus*: Set consultation agenda collaboratively
- *Context Sharing*: "Here's what we've learned so far..."

**Post-Consultation Discussion**
- *AI*: "The [specialist-agent] provided insights on [key findings]. They're [confidence level] about [recommendation] but raised concerns about [issue]. Here's what this means for our plan: [implications]. Does this change your thinking about the approach?"
- *Focus*: Integrate specialist insights into evolving plan
- *Decision Points*: "Should we adjust our approach based on this feedback?"

**Example Specialist Consultations:**

**Context-Analyzer Consultation:**
```
Pre: "Let me consult context-analyzer about existing patterns and codebase impact."
Post: "Context-analyzer found 3 similar implementations in the codebase. They recommend following the auth-service pattern but warn about database migration complexity. This suggests we should plan for schema changes early. Sound right?"
```

**Security-Auditor Consultation:**
```
Pre: "Now consulting security-auditor about authentication security concerns."
Post: "Security-auditor is concerned about JWT token storage and suggests refresh token rotation. They're confident about the OAuth flow but want us to validate PKCE implementation. Should we prioritize security hardening in Phase 1?"
```

**Test-Engineer Consultation:**
```
Pre: "Consulting test-engineer about testing strategy for this authentication work."
Post: "Test-engineer recommends test-driven development for the auth flow and suggests contract testing for API integration. They estimate 40% test coverage effort. This changes our timeline - still acceptable?"
```

### Phase 3: Plan Building & Validation

**Checkpoint 3A - Phase Structuring**
- *AI*: "Based on specialist consultations, I see 3 logical phases:
  - **Phase 1**: [core implementation with key components]
  - **Phase 2**: [integration and enhancement work]
  - **Phase 3**: [testing and refinement]
  Does this progression make sense? Should we reorder anything?"
- *Focus*: Structure work into manageable phases
- *Dependency Validation*: "Any dependencies I'm missing?"

**Checkpoint 3B - Task Breakdown Discussion**
- *AI*: "For Phase 1, I'm thinking these tasks:
  - P1.1.0: [task description] - [rationale]
  - P1.2.0: [task description] - [rationale]
  - P1.3.0: [task description] - [rationale]
  Each task builds on the previous. Does this breakdown work? Any tasks feeling too big or small?"
- *Focus*: Validate task granularity and dependencies
- *Implementation Feasibility*: "Are these tasks actually doable?"

**Checkpoint 3C - Risk & Mitigation Planning**
- *AI*: "I see [2-3 main risks] in this plan. The specialists highlighted concerns about [risk areas]. For mitigation, I suggest [strategies]. What risks worry you most? Any mitigation approaches you prefer?"
- *Focus*: Address implementation risks proactively
- *Contingency Planning*: "What's our backup plan if [approach] doesn't work?"

### Phase 4: Plan Finalization & Handoff

**Checkpoint 4A - Complete Plan Review**
- *AI*: "Let me walk through the complete plan:
  - **Scope**: [summary of what we're building]
  - **Approach**: [key technical decisions]
  - **Phases**: [phase breakdown with timelines]
  - **Risks**: [identified risks and mitigations]
  - **Success Criteria**: [how we'll know it's done]
  Does this capture everything? Any final adjustments?"
- *Focus*: Final validation of complete plan
- *Handoff Preparation*: "Ready to move to implementation?"

**Checkpoint 4B - Implementation Guidance**
- *AI*: "For implementation, I recommend starting with [first task]. The specialists suggest [implementation approach]. Key things to watch for: [concerns]. Ready to begin, or should we refine anything further?"
- *Focus*: Set up successful implementation start
- *Next Steps*: "Use `/develop` to begin implementation with this plan"

### Context Management Throughout Planning

**After Each Specialist Consultation:**
```yaml
planning_context_refresh:
  scope_confirmed: "What we've agreed to build"
  technical_decisions: "Key choices made with specialist input"
  risks_identified: "Concerns raised by specialists"
  dependencies_discovered: "What needs to happen first"
  open_questions: "What we still need to resolve"
```

**Planning Iteration Triggers:**
```yaml
plan_refinement_signals:
  scope_expansion: "Requirements are growing beyond initial understanding"
  technical_blocker: "Specialist identifies infeasibility in current approach"
  dependency_discovery: "New dependencies change task ordering"
  risk_escalation: "Identified risk becomes more serious than expected"
  resource_constraint: "Timeline or skill constraints affect feasibility"
```

### Collaborative Planning Artifacts

**Living Plan Document:**
```markdown
## Implementation Plan: [Issue]

### Scope & Success Criteria
[Validated understanding]
<!-- CONFIRMED: This matches stakeholder expectations -->

### Technical Approach
**Database Changes**: PostgreSQL schema migration
- Confidence: High (context-analyzer validated pattern)
- Risk: Medium (migration complexity)
<!-- SPECIALIST INPUT: database-specialist recommended phased migration -->

**Authentication Flow**: OAuth2 with PKCE
- Confidence: Medium (new to team)
- Risk: High (security implications)
<!-- DISCUSSION NEEDED: Should we start with simpler JWT approach? -->

### Phase Breakdown
#### Phase 1: Core Implementation (Confidence: High)
- P1.1.0: Database schema setup
- P1.2.0: OAuth integration
- P1.3.0: Basic auth flow

#### Phase 2: Integration (Confidence: Medium)
- P2.1.0: Frontend integration
<!-- VALIDATE: Frontend team capacity for this timeline -->

#### Phase 3: Testing & Hardening (Confidence: High)
- P3.1.0: Security testing
<!-- SPECIALIST REQUIREMENT: security-auditor mandates penetration testing -->

### Identified Risks
1. **OAuth complexity**: Mitigation: Start with simple flow, add PKCE later
2. **Database migration**: Mitigation: Test migration on staging first
<!-- MONITOR: These during implementation -->

### Next Steps
- [ ] Validate frontend team availability
- [ ] Confirm OAuth provider configuration
- [ ] Begin P1.1.0 with /develop
```

Intelligent Task Generation with Technical Specifications:
- **Feature Development**:
  - P1.1.0: Context analysis with API specifications and vision alignment <!--agent:context-analyzer-->
  - P1.2.0: Test scaffolding with coverage requirements <!--agent:test-engineer-->
  - P1.3.0: Implementation with technical constraints <!--agent:backend-specialist-->
  - P1.4.0: Integration with performance benchmarks <!--agent:integration-specialist-->
  - P1.5.0: Code review with quality gates <!--agent:code-reviewer-->
- **Bug Fix**: reproduce with test cases → analyze root cause → implement fix with validation
- **Refactor**: baseline tests → architecture analysis → incremental refactor → validation
- **Performance**: profiling analysis → optimization with benchmarks → validation
- **Security**: audit with threat model → implementation → penetration testing

Each task includes:
- Detailed technical specifications and acceptance criteria
- Integration requirements with existing systems
- Quality gate requirements and validation steps
- Context handoff requirements for next agent

### Collaborative Agent Selection & Consultation

Instead of automatic agent selection, the AI collaboratively determines which specialists to consult based on issue analysis and user input.

```yaml
agent_consultation_approach:
  collaborative_selection: "Discuss which specialists to consult"
  incremental_consultation: "Consult specialists one at a time with validation"
  expertise_transparency: "Agents express confidence and limitations"
  context_building: "Each consultation builds on previous insights"
```

**Core Planning Team (Always Consulted):**
- **context-analyzer**: Foundation analysis and existing pattern discovery
- **test-engineer**: Testing strategy and quality requirements
- **project-manager**: Plan structuring and task breakdown

**Specialist Consultations (Selected Collaboratively):**

**Technical Domain Specialists:**
```yaml
database_specialist:
  triggers: ["database", "schema", "migration", "query", "SQL", "data model"]
  expertise: "Database design, performance, migrations"
  consultation_focus: "Schema changes, query optimization, data integrity"

frontend_specialist:
  triggers: ["UI", "component", "frontend", "React", "interface", "user experience"]
  expertise: "Frontend architecture, component design, user interaction"
  consultation_focus: "UI implementation, state management, user experience"

backend_specialist:
  triggers: ["API", "endpoint", "server", "backend", "service", "business logic"]
  expertise: "Server-side architecture, API design, business logic"
  consultation_focus: "Service implementation, API contracts, server architecture"
```

**Cross-Cutting Specialists:**
```yaml
security_auditor:
  triggers: ["auth", "security", "OAuth", "encryption", "vulnerability", "access control"]
  expertise: "Security architecture, threat modeling, compliance"
  consultation_focus: "Security requirements, vulnerability assessment, secure patterns"

performance_optimizer:
  triggers: ["slow", "optimize", "performance", "scale", "cache", "latency"]
  expertise: "Performance analysis, optimization strategies, scalability"
  consultation_focus: "Performance requirements, bottleneck identification, optimization"

api_designer:
  triggers: ["API", "REST", "GraphQL", "integration", "service contract"]
  expertise: "API design, service contracts, integration patterns"
  consultation_focus: "API architecture, contract design, integration strategy"
```

**Consultation Selection Dialogue:**
```
AI: "For this authentication issue, I recommend consulting with:
- context-analyzer: Understand existing auth patterns
- security-auditor: Ensure secure implementation
- backend-specialist: Design API endpoints
- test-engineer: Plan testing strategy

Should we add frontend-specialist for UI integration? Any other specialists you think we need?"

User: "Yes, add frontend-specialist. We might need database changes too."

AI: "Good point. Adding database-specialist for potential schema changes. So our consultation plan:
1. context-analyzer (foundation)
2. security-auditor (security requirements)
3. database-specialist (schema impact)
4. backend-specialist (API design)
5. frontend-specialist (UI integration)
6. test-engineer (testing strategy)
7. project-manager (plan synthesis)

This gives us comprehensive coverage. Ready to start with context-analyzer?"
```

Parameters from $ARGUMENTS:
- --issue: Issue key identifier (required, e.g., AUTH-123, BUG-456)
- --deliverable: Deliverable name (auto-detected from existing deliverables or issue prefix)
- --branch: Branch name (auto-generated as feature/ISSUE-KEY if not provided)
- --agents: Comma-separated list to override auto-selection (e.g., "context-analyzer,security-auditor,test-engineer")
- --skip-branch: Skip branch creation/checkout (use current branch)
- --template: Custom template path (default: template-deliverable)

## Special Operation Modes

### --init: Directory Initialization Only

Creates issue directory structure and copies template files without any planning analysis.

```bash
/plan --issue AUTH-123 --init
# → Creates directory structure
# → Copies PLAN.md, README.md, HANDOFF.yml, RESEARCH.md templates
# → No agent execution, ready for manual planning
```

### --review-agent AGENT: Specific Agent Review

Add a specific agent's review to an existing plan (useful when agent was missed during initial planning).

```bash
/plan --issue AUTH-123 --review-agent security-auditor
# → security-auditor reads existing RESEARCH.md and PLAN.md
# → Adds security analysis to RESEARCH.md
# → Suggests plan updates based on security requirements
# → Appends findings without disrupting existing plan
```

### --review-plan: Comprehensive Plan Review

Full plan review and analysis based on current implementation progress and new discoveries. Generates recommendations for user approval.

```bash
/plan --issue AUTH-123 --review-plan
# → context-analyzer reviews current progress vs original plan
# → code-architect analyzes what's been built vs what was planned
# → project-manager generates recommended plan updates
# → Presents analysis and recommendations to user
# → Requires explicit user approval before making any changes
# → User can discuss, modify, or reject recommendations
```

## Operation Mode Details

**--init Mode Process**:

1. Create/validate directory structure
2. Copy template files (PLAN.md, README.md, HANDOFF.yml, RESEARCH.md)
3. Initialize HANDOFF.yml with basic structure
4. Create placeholder RESEARCH.md for manual research
5. Create empty PLAN.md template for manual planning
6. Update deliverable tracking
7. Exit (no agent execution)

**--review-agent Mode Process**:

1. Validate existing issue directory and files
2. Execute specified agent with context from existing RESEARCH.md and PLAN.md
3. Agent reads current plan and implementation progress
4. Agent adds analysis section to RESEARCH.md
5. Agent suggests specific plan updates or additions
6. Agent documents any concerns or recommendations
7. Preserve existing plan structure, add addendum if needed

**--review-plan Mode Process**:

1. Analyze current implementation progress from HANDOFF.yml
2. Compare implemented features against original plan
3. Execute sequence: context-analyzer → code-architect → project-manager
4. context-analyzer: Reviews current state vs original assumptions
5. code-architect: Validates architectural decisions made during implementation
6. project-manager: Generates recommended plan updates with rationale
7. Present comprehensive analysis and recommendations to user
8. **USER APPROVAL REQUIRED**: Ask user to review, discuss, and approve changes
9. If approved: Apply specific updates user agrees to
10. If rejected: Save analysis to RESEARCH.md for future reference
11. Document all decisions and rationale

Smart Directory Management:

**If deliverable exists** (most common case):

```bash
deliverables/existing-deliverable/
└── issues/
    └── NEW-ISSUE-KEY/          # Only creates new issue directory
        ├── PLAN.md             # Generated with intelligent tasks
        ├── README.md           # Implementation guide (from template)
        ├── HANDOFF.yml         # Agent coordination (initialized)
        └── RESEARCH.md         # Investigation notes (initialized)
```

**If deliverable doesn't exist** (new deliverable):

```bash
deliverables/XXX-deliverable-name/
├── README.md                   # Deliverable overview (from template)
├── deliverable.md              # Product context (from template)
└── issues/
    └── ISSUE-KEY/
        ├── PLAN.md             # Generated with intelligent phase-based tasks
        ├── README.md           # Implementation guide (from template)
        ├── HANDOFF.yml         # Agent coordination (initialized)
        └── RESEARCH.md         # Investigation notes (initialized)
```

Deliverable Detection Logic:

- **Auto-detection**: Scan existing deliverables for matching issue prefix (AUTH-123 → finds AUTH deliverable)
- **Manual override**: Use --deliverable to specify or create specific deliverable
- **Smart naming**: Create deliverable names from issue prefixes or manual specification
- **Issue tracking**: Automatically update deliverable README.md with new issue entries

Error Handling:

- Validate issue key format and uniqueness
- Check for existing issue directories (prompt for overwrite)
- Verify git repository status before branch operations
- Handle missing template files with fallback options
- Provide clear error messages with recovery suggestions
- Validate agent references against available .claude/agents/ directory

Integration Points:

- Works seamlessly with /iterate for task execution
- Integrates with /commit for phase completion workflows
- Updates STATUS.md for project tracking
- Leverages 17-agent framework for intelligent task assignment
- Compatible with existing deliverable management workflows

Example Usage:

```bash
# Simple feature with auto-selected agents
/plan --issue AUTH-123
# → Auto-selects: context-analyzer, security-auditor, test-engineer, code-architect, project-manager
# → Execution: 5 agents × ~2 min each = ~10 minutes total

# Database-focused issue
/plan --issue DATA-456
# → Auto-selects: context-analyzer, database-specialist, test-engineer, code-architect, project-manager

# Full-stack feature
/plan --issue FEATURE-789
# → Auto-selects: context-analyzer, frontend-specialist, backend-specialist, database-specialist, test-engineer, code-architect, project-manager

# Custom agent selection
/plan --issue PERF-321 --agents "context-analyzer,performance-optimizer,test-engineer,project-manager"

# Use existing branch
/plan --issue API-321 --skip-branch
# → Uses current branch, creates issue structure only

# Multiple issues in same deliverable (most common)
/plan --issue AUTH-124           # Adds to existing AUTH deliverable
/plan --issue AUTH-125 --skip-branch # Use current branch, add issue to AUTH deliverable

## Special Mode Examples

# Initialize directory only (no planning)
/plan --issue AUTH-123 --init
# → Sets up structure, ready for manual planning

# Add missed agent review to existing plan
/plan --issue AUTH-123 --review-agent performance-optimizer
# → performance-optimizer reviews and adds analysis

# Review and update plan after implementation discoveries
/plan --issue AUTH-123 --review-plan
# → Reviews progress, generates recommendations for user approval
# → User can discuss and approve specific changes

# Combine modes
/plan --issue AUTH-123 --review-agent security-auditor --skip-branch
# → Add security review using current branch
```

### Incremental Consultation Example:

```bash
/plan --issue AUTH-123
Starting collaborative planning for AUTH-123...

# Initial Context Setting
AI: "Let me understand this authentication issue. I see we need to implement OAuth login. What's the core problem we're solving? Are you replacing existing auth or adding new capabilities?"
User: "Adding OAuth as alternative to existing email/password login"
AI: "Got it. This seems like a Complex issue touching auth system, database, and frontend. Should we approach this backend-first to establish the auth flow, then integrate frontend?"
User: "Yes, backend-first makes sense"

# Specialist Consultation Planning
AI: "I recommend consulting: context-analyzer, security-auditor, database-specialist, backend-specialist, frontend-specialist, test-engineer, and project-manager. About 20-25 minutes total. Ready to start?"
User: "Let's do it"

# Incremental Consultations
Step 1/7: Consulting context-analyzer about existing auth patterns...
AI: "Context-analyzer found your existing JWT implementation and suggests following the same token pattern for OAuth. They're confident about integration but concerned about session management complexity. This affects our approach - should we unify session handling?"
User: "Yes, let's keep it consistent"

Step 2/7: Consulting security-auditor about OAuth security...
AI: "Security-auditor strongly recommends PKCE flow and is concerned about token storage. They want refresh token rotation implemented. This adds complexity but improves security. Worth the extra work?"
User: "Security is critical, let's do it"

Step 3/7: Consulting database-specialist about schema impact...
AI: "Database-specialist says we need new tables for OAuth providers and social login data. They recommend a migration strategy and are confident about the schema design. Should we plan this for Phase 1?"
User: "Yes, database changes first"

# ... continues through all specialists

Step 7/7: Consulting project-manager for plan synthesis...
AI: "Project-manager has structured this into 3 phases based on specialist input:
- Phase 1: Database schema + OAuth backend (3-4 days)
- Phase 2: Frontend integration (2-3 days)
- Phase 3: Testing and security hardening (2 days)
Total estimate: 7-9 days. Does this timeline work?"
User: "Looks good"

Planning complete! Total time: 23m 15s
Plan created with 3 phases, 12 tasks, and risk mitigation strategies.
Ready to start implementation with: /develop
```

### Collaborative Plan Review Example:

```bash
/plan --issue AUTH-123 --review-plan
Starting collaborative plan review for AUTH-123...

# Progress Assessment
AI: "Let me review your progress against the original plan. I see you've completed P1.1.0 and P1.2.0, but P1.3.0 is taking longer than expected. What challenges are you running into?"
User: "OAuth provider requires PKCE flow which wasn't in our original plan. Much more complex."
AI: "I see. That's a significant discovery. Let me consult the specialists about implications..."

# Specialist Re-consultation
Step 1/3: Re-consulting context-analyzer about implementation learnings...
AI: "Context-analyzer reviewed your PKCE implementation approach and confirms it's the right pattern. They found similar complexity in another project and suggest the same token handling pattern. Should we update our approach based on this precedent?"
User: "Yes, that would help"

Step 2/3: Re-consulting security-auditor about PKCE requirements...
AI: "Security-auditor validates the PKCE requirement and suggests additional security headers. They're confident about your implementation but want to ensure refresh token security. This impacts Phase 3 testing - should we expand security testing?"
User: "Absolutely"

Step 3/3: Re-consulting project-manager about plan adjustments...
AI: "Project-manager has analyzed the impact and recommends splitting P1.3.0 into smaller tasks. They also see frontend coordination needs. Here's what they suggest..."

# Collaborative Plan Adjustment
AI: "Based on specialist input and your implementation learnings, I see several plan adjustments:

**Immediate Changes (affect current work):**
- Split P1.3.0 into P1.3.1 (PKCE flow) + P1.3.2 (token storage)
- Add P1.3.3 for refresh token security

**Future Phase Adjustments:**
- Phase 2 needs frontend auth refactoring (bigger than originally planned)
- Phase 3 needs expanded security testing

Which of these should we tackle first? The immediate splits, or should we plan the broader changes?"

User: "Let's split P1.3.0 first so I can finish current work"

AI: "Perfect. I'll update P1.3.0 right now:
- P1.3.1: Implement PKCE authorization flow (2-3 days)
- P1.3.2: Secure token storage and rotation (1-2 days)
- P1.3.3: Refresh token security implementation (1 day)

For the broader Phase 2 and 3 changes, should we plan those now or revisit when you're ready for Phase 2?"

User: "Let's plan them now while we have context"

AI: "Great. Let me work through the Phase 2 implications with you...

**Phase 2 Updates Needed:**
- Frontend auth system is more coupled than we thought
- Requires authentication context refactoring
- Social login UI is more complex with PKCE

I estimate this adds 2-3 days to Phase 2. Should we:
1. Accept the timeline extension
2. Reduce Phase 2 scope to core functionality
3. Split Phase 2 into two smaller phases

What works best for your schedule?"

User: "Let's split Phase 2 - better to have smaller wins"

# Final Plan Updates
AI: "Perfect. Here's the updated plan structure:

**Phase 1 (Current)**: Backend OAuth with PKCE - 3 focused tasks
**Phase 2A**: Frontend auth refactoring - 2-3 tasks
**Phase 2B**: Social login UI implementation - 2-3 tasks
**Phase 3**: Expanded testing and security validation - 3-4 tasks

This gives you clear checkpoints and smaller deliverables. Should I update PLAN.md with these changes?"

User: "Yes, update it"

Plan review complete! Updated PLAN.md with:
- Split current Phase 1 task for immediate progress
- Restructured Phase 2 into 2A and 2B for better delivery
- Expanded Phase 3 testing based on security requirements
- Preserved all original context and decisions

Ready to continue with updated P1.3.1: /develop
```

Success Indicators:

- Feature branch created and checked out (unless --skip-branch)
- Issue directory structure established (deliverable created only if needed)
- PLAN.md populated with intelligent, actionable tasks
- Appropriate specialized agents assigned to each task
- HANDOFF.yml and RESEARCH.md initialized with starter content
- Deliverable README.md updated with new issue tracking
- User receives confirmation with recommended next steps (/iterate to begin)
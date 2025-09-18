---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants", "developers", "product-managers"]
document_type: "command"
tags: ["workflow", "features", "requirements"]
---

# /feature Command

**Purpose**: Create and manage feature context documents that define WHAT we're building and WHY, providing business and functional requirements that complement external project management tools.

## Command Usage

### Create New Feature Context
```bash
/feature --new "User Authentication"
# Creates docs/technical/features/user-authentication.md from template
# Automatically validates against vision document if present
```

### Update Existing Feature
```bash
/feature --update user-authentication
# Opens existing feature doc for editing and enhancement
```

### Link to External Issue
```bash
/feature --new "Payment Processing" --external JIRA-PAY-123
# Creates feature doc with external reference and vision alignment check
```

### Validate Feature Against Vision
```bash
/feature --validate user-authentication
# Checks feature alignment with current vision document
```

### List Features
```bash
/feature --list
# Shows all feature documents and their status
```

## What This Command Does

### For New Features (Collaborative Process)
1. **User Journey Mapping**: Progressive exploration of user experience and pain points
2. **Incremental Requirements Building**: Layer must-haves, nice-to-haves, and edge cases
3. **Collaborative Success Definition**: Co-create measurable success criteria
4. **System Integration Planning**: Understand dependencies and constraints together
5. **Living Document Creation**: Generate collaborative artifacts with discussion markers
6. **Context Preservation**: Maintain conversation history for architecture handoff

### Progressive Disclosure Conversation Flow

The AI uses **structured checkpoints with incremental revelation** to build feature understanding collaboratively without overwhelming cognitive load.

```yaml
conversation_structure:
  progressive_building: "Start simple, add complexity as understanding deepens"
  checkpoint_validation: "Validate each aspect before moving to next"
  confidence_communication: "Express uncertainty to guide discussion focus"
  user_journey_focus: "Ground everything in actual user experience"
```

#### Phase 1: User Journey Sketching

**Checkpoint 1A - Journey Mapping**
- *AI*: "Let me sketch the user journey for this feature. I imagine users [start here] → [do this] → [achieve goal]. What steps am I missing? Where do they typically get stuck?"
- *Focus*: Map complete user experience path
- *Progressive Building*: Start with happy path, then add complexity

**Checkpoint 1B - Pain Point Discovery**
- *AI*: "I see [3 main pain points] in their current journey. Which one causes the most frustration? What happens when users hit this obstacle?"
- *Focus*: Prioritize most critical pain to solve
- *Confidence Check*: "I'm 80% sure about pain point A, but only 60% about pain point B"

**Checkpoint 1C - User Context Validation**
- *AI*: "My understanding is that [user type] encounters this when [context]. They're trying to [goal] but [obstacle]. Does this match your user research or feedback?"
- *Focus*: Validate user context and motivation
- *Evidence Request*: "What evidence do we have about this user behavior?"

#### Phase 2: Requirements Exploration (Incremental Building)

**Checkpoint 2A - Must-Have Identification**
- *AI*: "To solve [core pain point], I think these 3 capabilities are absolutely essential: [A, B, C]. Without any of these, the feature fails. Do you agree with this minimum set?"
- *Focus*: Define minimum viable feature scope
- *Priority Forcing*: "If we could only build 1 of these 3, which one?"

**Checkpoint 2B - Nice-to-Have Exploration**
- *AI*: "Beyond the essentials, I see these 5 potential enhancements: [list]. Which ones would significantly improve the user experience? Which are just polish?"
- *Focus*: Identify enhancement opportunities
- *Trade-off Discussion*: "Enhancement X adds value but also complexity - worth it?"

**Checkpoint 2C - Edge Case Discovery**
- *AI*: "I'm thinking about these edge cases: [scenario A, B, C]. What unusual situations worry you? What scenarios would break the feature?"
- *Focus*: Uncover potential failure modes
- *Risk Assessment*: "How often do these edge cases happen?"

#### Phase 3: Success Definition (Collaborative Metrics)

**Checkpoint 3A - Success Criteria Brainstorming**
- *AI*: "Success could mean [metric A: usage], [metric B: satisfaction], [metric C: business impact]. Which metrics actually matter for this feature? What would 'winning' look like?"
- *Focus*: Define measurable success
- *Uncertainty Acknowledgment*: "I'm unsure which metrics are most important to your business"

**Checkpoint 3B - User Feedback Integration**
- *AI*: "For user validation, I'm thinking [feedback method]. This would tell us [what we'd learn]. How do you typically validate features with users?"
- *Focus*: Plan user validation approach
- *Adaptation*: Build on team's existing feedback methods

**Checkpoint 3C - Performance Expectations**
- *AI*: "Performance-wise, I imagine users expect [response time] and [availability]. What performance standards does your product maintain? What would frustrate users?"
- *Focus*: Set performance requirements
- *Context Inquiry*: "What are your current performance benchmarks?"

#### Phase 4: Integration & Dependencies (System Thinking)

**Checkpoint 4A - Feature Relationships**
- *AI*: "This feature touches [existing feature A] and [system B]. I see [potential integration points]. What existing functionality should this connect with?"
- *Focus*: Identify system integration needs
- *Dependency Mapping*: "What needs to exist before we can build this?"

**Checkpoint 4B - Technical Constraints**
- *AI*: "I'm assuming we can [technical approach], but I'm only 70% confident about [technical constraint]. What technical limitations should we consider?"
- *Focus*: Surface technical constraints early
- *Expert Consultation*: "Should we consult the technical team about feasibility?"

**Checkpoint 4C - External Dependencies**
- *AI*: "This might need [external service/API/team]. Do we have access to [dependency]? What approvals or coordination is needed?"
- *Focus*: Identify external blockers
- *Risk Mitigation*: "What's our backup plan if [dependency] isn't available?"

### Context Management Throughout Feature Discussion

**Every 3-4 Checkpoints:**
```yaml
feature_context_refresh:
  user_journey: "Key journey elements we've defined"
  requirements_decided: "Must-have vs nice-to-have distinctions"
  success_metrics: "How we'll measure feature success"
  open_questions: "What we still need to resolve"
  dependencies_identified: "What this feature depends on"
```

**Iteration Triggers for Feature Refinement:**
```yaml
refinement_signals:
  scope_creep: "This requirement expands beyond our core problem"
  user_feedback: "New user insight changes our assumptions"
  technical_constraint: "Technical discovery affects feature feasibility"
  priority_shift: "Business priorities change feature importance"
```

### Collaborative Artifacts Creation

**Living Requirements Document:**
```markdown
## User Journey
[Validated journey steps]
<!-- USER: Add specific user quotes or feedback here -->

## Requirements
### Must-Have (Confidence: High)
- [Requirement 1]
- [Requirement 2]

### Nice-to-Have (Confidence: Medium)
- [Enhancement 1]
<!-- DISCUSSION: Is this worth the added complexity? -->

### Edge Cases
- [Scenario 1]
<!-- VALIDATE: How often does this actually happen? -->

## Success Metrics
- [Metric 1] (Confidence: High)
- [Metric 2] (Confidence: Low - need business input)
<!-- QUESTION: What other metrics matter to stakeholders? -->

## Dependencies
- [Dependency 1] (Risk: Medium)
<!-- TODO: Confirm availability with [team/service] -->
```

## Integration with Workflow

### Position in Hierarchy
```
vision.md                    → Why the product exists
features/user-auth.md        → Why we need authentication (THIS COMMAND)
architecture/auth-design.md  → How we'll implement auth
decisions/ADR-001-jwt.md     → Why we chose JWT
implementations/2024-01-15-auth.md → What steps we took
```

### Relationship to Other Commands
- **After `/vision`**: Features must align with and support core product vision
- **Before `/architect`**: Define what you're building before deciding how
- **References external tools**: Links to Jira/Linear when available
- **Informs `/plan`**: Feature context guides implementation planning

## External Tool Integration

### Small Teams
- Creates comprehensive feature documentation locally
- Serves as single source of truth for requirements
- Can export to external tools if needed

### Teams with PM Tools
- Complements Jira epics and Linear initiatives
- Includes `external_ref` field linking to PM tools
- Focuses on technical context and implementation details
- Can sync status updates back to external tools

### Enterprise Teams
- Acts as lightweight summary of external requirements
- References authoritative specs in enterprise tools
- Focuses on local development context

## Agent Coordination

### Primary Agent
**business-analyst** or **product-designer** agent handles feature exploration:
- Specializes in requirements gathering
- Understands user needs and business context
- Can validate feature scope and priorities

### Supporting Agents
- **context-analyzer**: Reviews existing features and dependencies
- **technical-writer**: Helps document requirements clearly
- **project-manager**: Advises on scope and planning implications

## Output Artifacts

### Feature Context Document
```yaml
Location: docs/technical/features/[feature-name].md
Content:
  - Problem statement and user needs
  - Functional requirements
  - Success criteria and metrics
  - Technical approach (high-level)
  - Dependencies and integration points
  - External references (Jira/Linear links)
```

### Updated Feature Index
The command maintains an index of all features for easy discovery and status tracking.

## Best Practices

### When to Use `/feature` (Decision Tree)

```yaml
feature_decision_tree:
  user_facing_capability:
    question: "Does this directly impact user experience?"
    if_yes: "Use /feature for full context development"
    if_no: "Consider simpler documentation"

  complexity_threshold:
    question: "Does this span multiple components or teams?"
    if_yes: "Use /feature for coordination and planning"
    if_no: "Might be simple enough for direct implementation"

  business_driver:
    question: "Is this driven by external business requirements?"
    if_yes: "Use /feature to capture business context"
    if_no: "Consider technical documentation instead"
```

**Use `/feature` for:**
- ✅ **New major capabilities**: User-facing features that add value
- ✅ **Complex functionality**: Features spanning multiple components
- ✅ **Cross-team work**: Features requiring coordination
- ✅ **External requirements**: Features driven by business needs
- ✅ **User experience changes**: Anything that changes how users interact
- ✅ **Integration features**: Connecting systems or third-party services

**Use simpler approaches for:**
- ❌ Simple bug fixes or maintenance
- ❌ Internal refactoring without user impact
- ❌ Minor UI adjustments
- ❌ Development tool improvements
- ❌ Performance optimizations (unless user-visible)
- ❌ Code cleanup or technical debt

### Collaborative Feature Development Principles

1. **Ground in User Journey**: Start with actual user experience, not feature ideas
   - *Good*: "Users struggle to find relevant content in our large catalog"
   - *Poor*: "We need a search feature"

2. **Build Understanding Incrementally**: Layer complexity as conversation progresses
   - *Pattern*: Journey → Must-haves → Nice-to-haves → Edge cases
   - *Avoid*: Dumping all requirements at once

3. **Express Uncertainty Transparently**: Invite collaboration on unclear aspects
   - *Good*: "I'm 90% sure about the UI flow, but only 60% about the data model"
   - *Poor*: Presenting uncertain assumptions as confident decisions

4. **Validate Assumptions Early**: Check understanding before building on it
   - *Pattern*: "My understanding is X - what am I missing?"
   - *Avoid*: Building elaborate solutions on unvalidated assumptions

5. **Focus Scope Through Trade-offs**: Force prioritization decisions
   - *Good*: "We can have speed OR flexibility - what matters more?"
   - *Poor*: "We'll build something fast and flexible" (unrealistic)

6. **Connect to System Context**: Understand how this fits the bigger picture
   - *Consider*: Existing features, technical constraints, business goals
   - *Avoid*: Designing features in isolation

## Collaborative Examples

### Solo Developer - Progressive Exploration
```bash
/feature --new "Dark Mode Toggle"

# Conversation Flow:
AI: "Let me understand the user journey. I imagine users accessing settings → finding appearance options → toggling mode. What triggers users to want dark mode?"
User: "Eye strain during evening usage, battery life on mobile"
AI: "So primary pain is eye strain at night. Should this be automatic (time-based) or manual toggle?"
# ... builds understanding incrementally
```

### Team with Jira - Context Integration
```bash
/feature --new "User Notifications" --external PROJ-456

# Conversation Flow:
AI: "I see PROJ-456 mentions real-time alerts. Let me understand the user journey: [sketches flow]. What notification types are most critical?"
User: "Security alerts and billing issues are urgent, everything else can be batched"
AI: "I'm 90% confident about in-app notifications, but only 60% about email/SMS. What channels does your team support?"
# ... validates assumptions about existing capabilities
```

### Complex Feature - Collaborative Breakdown
```bash
/feature --new "Advanced Search"

# Conversation Flow:
AI: "Search is broad - let me understand the user frustration. When users search now, what goes wrong?"
User: "Too many irrelevant results, no way to filter by category"
AI: "I see 3 potential approaches: [A] Enhanced filters, [B] AI-powered relevance, [C] Faceted search. Each has different complexity. What matters more - speed or precision?"
# ... explores trade-offs collaboratively
```

### Feature Update - Learning Integration
```bash
/feature --update user-dashboard --learnings

# Conversation Flow:
AI: "Looking at the current dashboard feature, I see we assumed users wanted customizable widgets. What did we learn from usage analytics?"
User: "80% use default layout, but 20% heavily customize - maybe we over-engineered"
AI: "This suggests a simpler default with opt-in customization. Should we refocus on the core 80% use case?"
# ... incorporates real-world learnings
```

## Advanced Collaborative Patterns

### Cross-Feature Impact Analysis
```bash
/feature --impact-analysis user-authentication

# Conversation Flow:
AI: "This authentication change could affect [3 existing features]. Let me think through the ripple effects:
- User Profiles: Need to update session handling
- Payment Flow: Security requirements might change
- Admin Dashboard: New auth events to display
What other features might be impacted?"
```

### Feature Prioritization Dialogue
```bash
/feature --prioritize backlog

# Conversation Flow:
AI: "Looking at 5 proposed features, I see different user journey impacts:
- Feature A: Solves major pain for 80% of users
- Feature B: Nice enhancement for 20% of power users
- Feature C: Enables new user segment
If we could only build 2 this quarter, which drive the most vision progress?"
```

### Feature Validation Workshop
```bash
/feature --validate-all --user-feedback

# Conversation Flow:
AI: "Let's review our feature assumptions against user feedback:
- Feature X: Assumed users wanted automation, but they prefer control
- Feature Y: Built for power users, but beginners are struggling
- Feature Z: Success metrics not moving as expected
Which assumptions need the most urgent validation?"
```

### Feature Scope Negotiation
```bash
/feature --scope-discussion payment-integration

# Conversation Flow:
AI: "The payment feature has grown from simple processing to include:
- Multi-currency support
- Subscription management
- Tax calculation
- Refund workflows
I'm concerned about scope creep. What's the minimum that solves the core user problem?"
```

## Collaborative Quality Gates

### Completion Criteria (with Confidence Indicators)

**Problem Understanding (High Confidence Required):**
- ✅ User journey is mapped and validated
- ✅ Core pain point is clearly identified and prioritized
- ✅ User context and motivation is understood
- ✅ Problem evidence exists (user feedback, research, etc.)

**Requirements Definition (Medium Confidence Acceptable):**
- ✅ Must-have requirements identified and justified
- ✅ Nice-to-have enhancements cataloged with trade-offs
- ✅ Edge cases discovered and risk-assessed
- ✅ Requirements traceable to user journey steps

**Success Framework (High Confidence for Key Metrics):**
- ✅ Success metrics defined and measurable
- ✅ User validation approach planned
- ✅ Performance expectations set
- ✅ Business impact criteria established

**System Integration (Medium Confidence with Validation Plan):**
- ✅ Dependencies identified with risk assessment
- ✅ Integration points mapped
- ✅ Technical constraints surfaced
- ✅ External dependencies confirmed or risk-mitigated

**Collaboration Completeness:**
- ✅ All uncertain areas marked for further discussion
- ✅ Open questions captured with owners
- ✅ Context preserved for handoff to architecture phase
- ✅ Stakeholder input incorporated where needed

### Red Flags (Stop and Iterate):
- 🚨 User journey unclear or unvalidated
- 🚨 Requirements based on assumptions, not evidence
- 🚨 Success metrics absent or unmeasurable
- 🚨 Major dependencies unknown or high-risk
- 🚨 Feature scope unclear or constantly expanding

## Related Commands

- **`/architect`**: Define HOW to implement the feature
- **`/plan`**: Break down implementation into tasks
- **`/develop`**: Execute the implementation
- **`/docs sync`**: Update related documentation

---

*The `/feature` command ensures every piece of code can be traced back to a clear business need and user problem.*
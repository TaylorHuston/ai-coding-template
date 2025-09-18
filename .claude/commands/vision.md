---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants", "developers", "product-managers", "stakeholders"]
document_type: "command"
tags: ["workflow", "vision", "strategy", "planning"]
---

# /vision Command

**Purpose**: AI-assisted creation, review, and evolution of project vision documents - the foundational phase that drives all subsequent development decisions.

## Command Usage

### Create New Vision Document
```bash
/vision --create
# Interactive vision creation through guided exploration
```

### Review Existing Vision
```bash
/vision --review
# AI analysis of current vision with suggestions for improvement
```

### Update/Evolve Vision
```bash
/vision --update
# Evolve vision based on learnings and market feedback
```

### Validate Feature Alignment
```bash
/vision --validate feature-name
# Check how well a feature aligns with current vision
```

### Track Success Metrics
```bash
/vision --metrics
# Monitor progress toward vision success metrics
```

### List Vision History
```bash
/vision --history
# Show vision evolution over time
```

## What This Command Does

### For New Projects
1. **Strategic Exploration**: Guided conversation to understand the fundamental "why"
2. **Problem Definition**: Deep dive into the core problem being solved
3. **Solution Articulation**: High-level solution approach and unique value
4. **Audience Identification**: Clear target user definition and characteristics
5. **Success Definition**: Measurable metrics for vision achievement
6. **Document Generation**: Creates `docs/vision.md` or `project-vision.md`

### For Existing Projects
1. **Vision Assessment**: Analyze current vision document for completeness and clarity
2. **Alignment Analysis**: Check how well current features support the vision
3. **Evolution Guidance**: Help evolve vision based on learnings and pivots
4. **Metrics Tracking**: Monitor progress toward stated success metrics
5. **Validation Framework**: Provide framework for ongoing vision alignment

## Collaborative Conversation Flow

The AI guides you through **structured checkpoint conversations** with progressive disclosure and confidence indicators to ensure collaborative vision development.

### Conversation Structure Pattern
```yaml
checkpoint_pattern:
  current_understanding: "Here's what I understand so far..."
  validation_question: "What am I missing or misunderstanding?"
  options_exploration: "I see 3 possible directions..."
  confidence_indicator: "I'm 90% confident about X, but only 60% about Y"
  decision_point: "This seems like a key choice - what matters most?"
  context_preservation: "Based on our discussion of X, now considering Y..."
```

### Phase 1: Problem Space Exploration

**Checkpoint 1A - Problem Validation**
- *AI*: "Let me understand the core problem. From what you've described, I see this challenge: [initial understanding]. What am I missing about the pain points your users face?"
- *Focus*: Validate problem existence and severity
- *Confidence Level*: Express uncertainty about problem nuances

**Checkpoint 1B - Problem Prioritization**
- *AI*: "I'm hearing multiple problems: [A, B, C]. Which one keeps your target users awake at night? Which one, if solved, would create the most significant impact?"
- *Focus*: Narrow to the most critical problem
- *Progressive Disclosure*: Build on validated problem understanding

**Checkpoint 1C - Current Solutions Analysis**
- *AI*: "Here's how I understand people handle this today: [current approach]. What's broken about these existing solutions? What makes this worth building something new?"
- *Focus*: Understand solution landscape and opportunity gaps

### Phase 2: Solution Direction Setting

**Checkpoint 2A - Approach Exploration**
- *AI*: "I see 3 potential solution approaches: [Option A: description], [Option B: description], [Option C: description]. Each has different implications for complexity and market differentiation. Which direction resonates with your vision?"
- *Focus*: Explore solution alternatives with trade-offs
- *Confidence Indicators*: Rate approach feasibility

**Checkpoint 2B - Unique Value Identification**
- *AI*: "Based on your chosen approach, I think your unique value is [X]. But I'm only 70% confident about what makes you truly different. What's your unfair advantage or unique insight?"
- *Focus*: Define competitive differentiation
- *Validation Needed*: Seek confirmation of uniqueness

**Checkpoint 2C - Solution Validation**
- *AI*: "So your solution is [summary]. This would solve [problem] by [approach] for [audience]. Does this capture the essence? What would make someone choose this over [existing alternative]?"
- *Focus*: Consolidate solution understanding

### Phase 3: Target Audience Definition

**Checkpoint 3A - Primary User Identification**
- *AI*: "I'm thinking your primary user is [user type] who [key characteristics]. They currently [current behavior] and value [key values]. Am I targeting the right persona?"
- *Focus*: Define specific target audience
- *Confidence Level*: Express uncertainty about user motivations

**Checkpoint 3B - User Journey Mapping**
- *AI*: "Let me sketch their journey: [discovery → evaluation → adoption → usage]. What steps am I missing? Where do they typically get stuck with current solutions?"
- *Focus*: Understand user experience and pain points
- *Iterative Building*: Build on validated user understanding

**Checkpoint 3C - Value Proposition Validation**
- *AI*: "For this audience, I think the compelling value is [benefit]. But what would actually make them switch from their current solution? What's the minimum improvement that would drive adoption?"
- *Focus*: Validate value proposition with target audience

### Phase 4: Success Framework Creation

**Checkpoint 4A - Success Definition**
- *AI*: "I'm thinking success looks like [6-month vision] in the short term and [2-year vision] longer term. Does this align with your ambitions? What does 'winning' mean to you?"
- *Focus*: Define success vision and ambition level
- *Confidence Check*: Validate timeline assumptions

**Checkpoint 4B - Metrics Selection**
- *AI*: "For tracking progress, I suggest measuring [3-4 key metrics]. I'm confident about [metric A and B] but uncertain whether [metric C] is the right proxy for success. What metrics matter most to your business?"
- *Focus*: Select measurable success indicators
- *Uncertainty Acknowledgment*: Request guidance on measurement

**Checkpoint 4C - Validation Framework**
- *AI*: "To validate we're on track, I propose checking [validation approach] every [timeframe]. This would tell us [what we'd learn]. Does this validation plan make sense for your context?"
- *Focus*: Establish ongoing validation process

### Phase 5: Vision Synthesis & Documentation

**Final Checkpoint - Vision Coherence**
- *AI*: "Let me synthesize our discussion: [complete vision summary]. This connects [problem] → [solution] → [audience] → [success]. Does this capture the essence of what you want to build? What feels missing or misaligned?"
- *Focus*: Validate complete vision coherence
- *Final Confidence Check*: Ensure alignment before documentation

### Context Management Throughout

**Every 3-4 Checkpoints:**
```yaml
context_refresh:
  decisions_made: "Key decisions from our discussion"
  open_questions: "Items we still need to resolve"
  assumptions_log: "What we're assuming that needs validation"
  next_focus: "What we're exploring next"
```

**Iteration Triggers:**
```yaml
backward_flow_signals:
  assumption_challenged: "This new insight challenges our earlier assumption about..."
  constraint_discovered: "This constraint affects our previous decision about..."
  opportunity_identified: "This opens up a possibility we hadn't considered..."
```

## Integration with 5-Phase Workflow

### Position in Hierarchy
```
vision.md                    → Why the product exists (THIS COMMAND)
features/user-auth.md        → Why we need authentication
architecture/auth-design.md  → How we'll implement auth
decisions/ADR-001-jwt.md     → Why we chose JWT
implementations/2024-01.md   → What steps we took
```

### Enhanced Workflow Sequence
```
/vision    → Define WHY (product purpose, problem, solution)
/feature   → Define WHAT (specific capabilities needed)
/architect → Define HOW (technical approach and decisions)
/plan      → Define WHEN (implementation roadmap and phases)
/develop   → Execute and validate against vision
```

### Relationship to Other Commands
- **Before `/feature`**: Establish product foundation before defining features
- **Informs `/feature`**: Features must align with vision problem/solution
- **Guides `/architect`**: Technical decisions must support vision goals
- **Shapes `/plan`**: Implementation priorities driven by vision impact
- **Validates `/develop`**: Implementation outcomes measured against vision metrics

## Vision Document Structure (Collaborative Format)

### Core Sections with Collaboration Markers

1. **The Problem** - Clear, specific problem statement
   ```yaml
   confidence_level: "high|medium|low"
   validation_evidence: "Sources that confirm this problem exists"
   assumptions: "What we're assuming about this problem"
   open_questions: "What we still need to validate"
   # TODO: Add user research evidence here
   ```

2. **The Solution** - High-level solution approach and value proposition
   ```yaml
   approach_confidence: "high|medium|low"
   alternatives_considered: "Other approaches we evaluated"
   unique_insight: "Our key differentiating insight"
   # DISCUSSION NEEDED: Technical feasibility of core approach
   ```

3. **Target Audience** - Specific user/customer definition
   ```yaml
   persona_confidence: "high|medium|low"
   evidence_sources: "How we validated this audience"
   secondary_audiences: "Other potential user groups"
   # USER INPUT: Add specific customer interview insights
   ```

4. **Core Features (MVP)** - Minimum viable product scope
   ```yaml
   feature_confidence: "high|medium|low"
   prioritization_rationale: "Why these features are essential"
   nice_to_haves: "Features for later consideration"
   # VALIDATE: Do these features solve the core problem?
   ```

5. **Key Differentiators** - Unique value and competitive advantages
   ```yaml
   differentiation_confidence: "high|medium|low"
   competitive_analysis: "How we compare to alternatives"
   defensibility: "What makes this advantage sustainable"
   # VERIFY: Are these actually unique?
   ```

6. **Success Metrics** - Measurable goals and validation criteria
   ```yaml
   metrics_confidence: "high|medium|low"
   measurement_approach: "How we'll track these metrics"
   targets: "Specific goals and timeframes"
   # QUESTION: What metrics matter most to the business?
   ```

### Enhanced Sections (Advanced)

7. **Decision Ledger** - Record of key choices made
   ```yaml
   decisions:
     - content: "Chose mobile-first approach"
       confidence: "high"
       rationale: "Target audience primarily uses mobile"
       alternatives: "Web-first, cross-platform"
       validation_needed: "Mobile usage analytics"
       date: "2025-01-15"
   ```

8. **Evolution History** - Vision changes and pivots over time
   ```yaml
   version_history:
     - version: "1.0.0"
       changes: "Initial vision"
       trigger: "Market research completion"
       preserved: "Core problem statement"
       changed: "Target audience narrowed"
   ```

9. **Collaboration Artifacts**
   ```markdown
   ## Outstanding Questions
   - [ ] What's our pricing strategy? (affects value proposition)
   - [ ] Should we support enterprise customers initially?
   - [ ] How do we handle international markets?

   ## Assumptions to Validate
   - [ ] Users will pay for this solution
   - [ ] Market size is sufficient for VC funding
   - [ ] Technical approach is feasible within timeline

   ## Discussion Points
   - [ ] Mobile vs web priority
   - [ ] Freemium vs paid-only model
   - [ ] Geographic expansion strategy
   ```

## Vision Validation Framework

### Feature Alignment Scoring
- **Core Alignment (1-10)**: How well does feature support core problem?
- **Audience Fit (1-10)**: How well does feature serve target audience?
- **Differentiator Support (1-10)**: How well does feature enhance differentiation?
- **Metric Impact (1-10)**: How much will feature drive success metrics?

### Architecture Validation
- **Vision Enablement**: Does architecture support vision goals?
- **Scalability Alignment**: Can architecture handle vision scale?
- **Differentiation Support**: Does architecture enable key differentiators?
- **Success Metric Infrastructure**: Does architecture support measurement?

### Planning Validation
- **Priority Alignment**: Are highest impact vision items prioritized?
- **Resource Allocation**: Are resources focused on vision-critical work?
- **Timeline Realism**: Does timeline support vision achievement?
- **Risk Mitigation**: Are vision-threatening risks addressed?

## Special Agent Integration

### Vision-Strategist Agent
This command can invoke the `vision-strategist` agent for:
- Strategic thinking and market analysis
- Vision articulation and refinement
- Competitive positioning guidance
- Success metrics framework design
- Pivot and evolution guidance

### Multi-Agent Consultation
For comprehensive vision work, may coordinate with:
- **business-analyst**: Market research and competitive analysis
- **user-researcher**: Audience validation and user insights
- **product-manager**: Feature prioritization and roadmap alignment
- **technical-writer**: Vision documentation and communication

## External Tool Integration

### Small Teams/Startups
- Creates comprehensive vision foundation
- Serves as north star for all decisions
- Provides framework for investor/stakeholder communication
- Guides product-market fit exploration

### Teams with Product Management
- Complements product strategy documentation
- Links to OKRs and strategic planning tools
- Informs epic and initiative prioritization
- Provides validation framework for product decisions

### Enterprise Integration
- Aligns with business strategy and objectives
- Supports portfolio management decisions
- Provides clear product vision for stakeholders
- Integrates with enterprise architecture planning

## Vision Evolution and Pivots

### When to Update Vision
- Significant market feedback or user research insights
- Major competitive landscape changes
- Technical feasibility discoveries
- Business model evolution
- Stakeholder strategy shifts

### Pivot Documentation
- **Pivot Type**: Customer, problem, solution, or business model
- **Trigger Events**: What caused the pivot decision
- **Changed Elements**: Specific vision components that changed
- **Preserved Elements**: Core vision elements that remain
- **Success Criteria**: How to measure pivot success

### Version Control
- Major version (X.0.0): Complete vision overhaul or pivot
- Minor version (0.X.0): Significant refinement or audience shift
- Patch version (0.0.X): Clarification or metric adjustment

## Success Metrics and Monitoring

### Vision-Level Metrics
- **Problem Validation**: Evidence that target problem exists and matters
- **Solution Validation**: Evidence that solution addresses problem effectively
- **Market Validation**: Evidence of market demand and willingness to pay
- **Execution Validation**: Evidence of ability to deliver solution

### Feature Impact Tracking
- Track how each feature contributes to vision success metrics
- Measure feature adoption against target audience expectations
- Analyze feature performance against differentiation goals
- Monitor feature complexity vs. vision simplicity

### Quarterly Vision Review
- Assess progress toward success metrics
- Evaluate feature alignment with vision
- Review competitive landscape changes
- Consider vision evolution needs

## Advanced Usage

### Vision-Driven Development
```bash
# Start with vision
/vision --create

# Validate each feature against vision
/feature --new "User Profiles" --vision-check

# Ensure architecture supports vision
/architect user-profiles --vision-align

# Prioritize by vision impact
/plan --issue PROFILE-001 --vision-priority

# Measure vision progress
/develop && /vision --metrics
```

### Continuous Vision Alignment
```bash
# Weekly vision health check
/vision --review --quick

# Monthly comprehensive analysis
/vision --validate all-features --metrics

# Quarterly vision evolution assessment
/vision --update --consider-pivots
```

## Related Commands

- **[/feature](./feature.md)** - Define specific capabilities that support vision
- **[/architect](./architect.md)** - Make technical decisions aligned with vision
- **[/plan](./plan.md)** - Create implementation roadmap driven by vision
- **[/develop](./develop.md)** - Execute while maintaining vision alignment

## Success Patterns

### For Startups
1. Start with problem-focused vision creation
2. Validate vision assumptions with target users
3. Use vision to guide MVP feature selection
4. Track vision metrics alongside development metrics

### For Established Products
1. Assess current vision clarity and team alignment
2. Validate vision against market evolution
3. Use vision to guide feature roadmap prioritization
4. Evolve vision based on user feedback and market learnings

### For Enterprise Projects
1. Align project vision with business strategy
2. Ensure vision supports organizational objectives
3. Use vision for stakeholder communication and buy-in
4. Track vision success within broader business metrics

---

**Note**: This command establishes the foundational "WHY" that drives all subsequent development decisions. Every feature, architecture choice, and implementation priority should trace back to supporting the core vision.
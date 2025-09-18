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

## Conversation Flow

The AI will guide you through these strategic phases:

### 1. Problem Discovery
- What core problem are you solving?
- Who experiences this problem most acutely?
- How do they currently handle this problem?
- What makes this problem worth solving?
- What happens if this problem remains unsolved?

### 2. Solution Exploration
- What is your unique approach to solving this problem?
- What makes your solution different from existing alternatives?
- What is the minimum viable solution that delivers core value?
- How does your solution create 10x better outcomes?

### 3. Audience Definition
- Who is your primary user/customer?
- What are their key characteristics and behaviors?
- What do they value most in a solution?
- How do they currently discover and adopt new tools?
- What would make them switch from their current solution?

### 4. Value Proposition
- What unique value do you deliver?
- What are your 1-3 key differentiators?
- Why would users choose you over alternatives?
- What makes you defensible in the market?

### 5. Success Framework
- What does success look like in 6 months? 2 years?
- What metrics will you track to measure progress?
- What are your key activation and retention goals?
- How will you know if you need to pivot?

### 6. Vision Documentation
- Synthesize insights into clear, compelling vision document
- Establish version tracking for future evolution
- Create validation framework for ongoing alignment
- Set up success metrics monitoring

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

## Vision Document Structure

### Core Sections
1. **The Problem** - Clear, specific problem statement
2. **The Solution** - High-level solution approach and value proposition
3. **Target Audience** - Specific user/customer definition
4. **Core Features (MVP)** - Minimum viable product scope
5. **Key Differentiators** - Unique value and competitive advantages
6. **Success Metrics** - Measurable goals and validation criteria

### Enhanced Sections (Advanced)
7. **Market Context** - Competitive landscape and positioning
8. **Business Model** - How value is captured and delivered
9. **Technical Constraints** - Key technical considerations and limitations
10. **Evolution History** - Vision changes and pivots over time
11. **Validation Results** - Evidence supporting vision assumptions

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
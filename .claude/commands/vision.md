---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "vision", "strategy"]
---

# /vision Command

**Purpose**: Create, review, and evolve project vision documents through collaborative exploration.

## Usage

```bash
/vision --create     # Create new vision document
/vision --review     # Analyze existing vision
/vision --update     # Evolve vision based on learnings
/vision --validate   # Check feature alignment with vision
```

## Objectives

**Primary Goal**: Help users discover and articulate the fundamental "why" behind their project through natural conversation.

**Core Outcomes**:
1. **Problem Definition**: Clear understanding of the core problem being solved
2. **Solution Articulation**: High-level approach and unique value proposition
3. **Audience Clarity**: Specific target users and their characteristics
4. **Success Framework**: Measurable metrics and validation criteria
5. **Documentation**: Create `docs/vision.md` or `project-vision.md`

## Approach

Use **collaborative exploration** to uncover vision elements:
- Ask clarifying questions to understand the problem space
- Explore multiple solution approaches and trade-offs
- Validate assumptions through user perspective
- Build consensus on success criteria
- Synthesize findings into coherent vision

**Trust natural conversation flow** - adapt questions and focus based on user responses rather than following rigid checkpoints.

## Key Exploration Areas

### Problem Space
- What core problem are users facing?
- How do they handle this today and what's broken?
- What makes this problem worth solving?
- Who is most affected by this problem?

### Solution Direction
- What approaches could solve this problem?
- What would make your solution unique or better?
- What's your key insight or unfair advantage?
- How would success look different from existing solutions?

### Target Audience
- Who specifically needs this solution?
- What drives their current behavior and decisions?
- What would motivate them to try something new?
- How do they discover and evaluate solutions?

### Success Definition
- What does winning look like in 6 months? 2 years?
- What metrics would indicate you're on track?
- How will you validate market demand?
- What assumptions need to be tested first?

## Document Structure

Create structured vision documents with these core sections:

1. **The Problem** - Specific problem statement with evidence
2. **The Solution** - High-level approach and value proposition
3. **Target Audience** - Primary users and their characteristics
4. **Success Metrics** - Measurable goals and validation criteria
5. **Key Differentiators** - Unique advantages and competitive positioning

Include collaboration markers for ongoing work:
- Confidence levels (high/medium/low) for each section
- Open questions needing resolution
- Assumptions requiring validation
- Evidence sources and next research steps

## Integration with Workflow

**Position**: Foundation phase that informs all subsequent development decisions

**Relationship to Other Commands**:
- **Before /feature**: Establish product foundation before defining capabilities
- **Guides /architect**: Technical decisions must support vision goals
- **Drives /plan**: Implementation priorities based on vision impact
- **Validates /develop**: Measure outcomes against vision metrics

## Success Criteria

**Effective Vision Documents**:
- Clear problem statement with evidence
- Specific target audience definition
- Measurable success criteria
- Actionable next steps for validation
- Consensus among stakeholders

**Quality Indicators**:
- Team can explain vision consistently
- Features trace back to vision goals
- Architecture supports vision requirements
- Metrics show progress toward vision success
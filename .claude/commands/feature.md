---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "features", "requirements"]
---

# /feature Command

**Purpose**: Define specific capabilities and requirements for features through collaborative exploration.

## Usage

```bash
/feature --new "Feature Name"    # Create new feature document
/feature --update feature-name   # Update existing feature
/feature --validate feature-name # Check vision alignment
/feature --list                  # Show all features
```

## Objectives

**Primary Goal**: Define WHAT capabilities need to be built and WHY through collaborative requirements exploration.

**Core Outcomes**:
1. **User Journey Mapping**: Clear understanding of user experience and pain points
2. **Requirements Definition**: Must-have vs nice-to-have capabilities
3. **Success Criteria**: Measurable outcomes and validation approach
4. **System Integration**: Dependencies and integration points
5. **Documentation**: Create feature specification in `docs/technical/features/`

## Approach

Use **collaborative exploration** to uncover feature requirements:
- Map the user journey and identify pain points
- Define essential capabilities vs enhancements
- Establish success metrics and validation methods
- Identify dependencies and constraints
- Create structured feature documentation

**Focus on user experience** - ground requirements in actual user problems rather than technical solutions.

## Key Exploration Areas

### User Journey & Pain Points
- What specific user problem does this solve?
- What steps do users take today and where do they struggle?
- Who is affected by this problem and how often?
- What would success look like from the user's perspective?

### Requirements & Scope
- What capabilities are absolutely essential?
- What would be nice to have but not critical?
- What edge cases need consideration?
- How does this connect with existing features?

### Success Definition
- What metrics indicate this feature is working?
- How will you validate it with users?
- What performance expectations matter?
- What business outcomes should this drive?

### Technical Context
- What existing systems does this touch?
- What dependencies or constraints exist?
- What external services or APIs are needed?
- What technical risks should be considered?

## Document Structure

Create feature specifications with these core sections:

1. **Problem Statement** - User pain point and context
2. **User Journey** - Current experience and desired improvements
3. **Requirements** - Must-have and nice-to-have capabilities
4. **Success Metrics** - Measurable outcomes and validation plan
5. **Dependencies** - System integration points and external needs
6. **External References** - Links to Jira/Linear when available

Include collaboration markers:
- Confidence levels for requirements
- Open questions needing resolution
- Assumptions requiring validation
- Evidence sources for decisions

## Integration with Workflow

**Position**: Defines capabilities that support the product vision and guide technical implementation

**Relationship to Other Commands**:
- **After /vision**: Features must align with product goals
- **Before /architect**: Define what to build before deciding how
- **Informs /plan**: Requirements guide implementation planning
- **Validated by /develop**: Implementation proves feature value

## Success Criteria

**Complete Feature Specification**:
- Clear user problem and journey mapped
- Requirements prioritized with rationale
- Success metrics defined and measurable
- Dependencies identified with risk assessment
- Integration points documented

**Quality Indicators**:
- Requirements trace to user problems
- Success metrics are actionable
- Scope is focused and achievable
- Technical constraints are considered
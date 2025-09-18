---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-18"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "design", "vision", "features", "non-technical"]
---

# /design Command

**Purpose**: Create and document all non-technical aspects of your project - from high-level vision to specific feature requirements.

## Usage

```bash
/design --vision         # Create/update project vision
/design --feature "name" # Define specific feature requirements
/design --story "name"   # Create user stories and acceptance criteria
/design --review         # Review and validate existing design docs
```

## Objectives

**Primary Goal**: Capture and document the "what" and "why" of your project without getting into technical implementation details.

**Core Outcomes**:

1. **Vision Documents**: Project purpose, goals, and success metrics
2. **Feature Specifications**: What capabilities users need and why
3. **User Stories**: Detailed user workflows and acceptance criteria
4. **Business Context**: Problem statements, target audience, and value propositions
5. **Design Documentation**: Create appropriate docs in `docs/` or project root

## Approach

**Flexible scope design** - use for any level of non-technical planning:

- **Project Vision**: Overall product strategy and goals
- **Feature Definition**: What capabilities users need and why they need them
- **User Stories**: Detailed user workflows and acceptance criteria
- **Business Requirements**: User needs, constraints, and success criteria

**Collaborative exploration** to uncover design elements through natural conversation rather than rigid templates.

## Key Design Areas

### Vision Level (Project Foundation)

- **Problem Space**: What core problem are you solving?
- **Solution Direction**: What's your approach and unique value?
- **Target Audience**: Who needs this and why?
- **Success Metrics**: How will you measure success?

### Feature Level (Specific Capabilities)

- **User Needs**: What do users want to accomplish?
- **Functionality**: What should the feature do?
- **User Experience**: How should users interact with it?
- **Acceptance Criteria**: When is the feature "done"?

### Story Level (Detailed Requirements)

- **User Workflows**: Step-by-step user journeys
- **Edge Cases**: Error conditions and boundary scenarios
- **Dependencies**: Integration with other features
- **Success Criteria**: Specific, testable requirements

## Document Structure

**Vision Documents** (`docs/vision.md` or `project-vision.md`):

1. **The Problem** - Specific problem statement with evidence
2. **The Solution** - High-level approach and value proposition
3. **Target Audience** - Primary users and their characteristics
4. **Success Metrics** - Measurable goals and validation criteria
5. **Key Differentiators** - Unique advantages and positioning

**Feature Documents** (`docs/features/[feature-name].md`):

1. **Feature Overview** - Purpose and user value
2. **User Stories** - Specific use cases and workflows
3. **Requirements** - Functional and non-functional needs
4. **Acceptance Criteria** - Definition of done
5. **Dependencies** - Integration and prerequisite features

**User Story Documents** (embedded in feature docs or separate):

- **As a [user type]** - User persona and context
- **I want [capability]** - Specific functionality needed
- **So that [benefit]** - Value and outcome achieved
- **Acceptance Criteria** - Testable completion criteria

## Integration with Workflow

**Position**: First phase for any new project, feature, or significant change

**Clear Separation from /architect**:

- **`/design`**: Focus on WHAT users need and WHY they need it (non-technical)
- **`/architect`**: Focus on HOW to build it technically (implementation decisions)

**Workflow Relationships**:

- **Before /architect**: Define user needs and business requirements before technical decisions
- **Guides /architect**: Technical choices must support design requirements and constraints
- **Informs /plan**: Implementation planning based on design specifications
- **Validates /develop**: Ensure implementation meets design intent

**Flexible Usage**:

- Start new projects with vision-level design
- Add features with feature-level design
- Break down complex features with story-level design
- Use at any granularity that makes sense for your project

## Success Criteria

**Effective Design Documents**:

- Clear problem or need statement
- Specific target users and use cases
- Measurable success criteria or acceptance criteria
- Actionable requirements for implementation
- Alignment between vision, features, and stories

**Quality Indicators**:

- Stakeholders can explain requirements consistently
- Implementation teams understand what to build
- Architecture decisions support design goals
- Success can be measured and validated

## Agent Coordination

**Primary Approach**: Direct conversation with user, no specific agents required

**Supporting Consultation** (when beneficial):

- **project-manager**: For complex multi-feature design coordination
- **context-analyzer**: For understanding existing system requirements
- Any domain specialists for requirement validation and feasibility input

**Key Principle**: Keep design phase non-technical - save implementation details for `/architect` phase.

## Examples: /design vs /architect

**`/design` captures WHAT and WHY** (user perspective):

- "Users need to upload files up to 100MB for document sharing"
- "System must support 1000 concurrent users during peak hours"
- "Users require real-time notifications when someone mentions them"
- "Data must be retained for 7 years for compliance"

**`/architect` decides HOW** (technical implementation):

- "Use S3 with multipart upload API for 100MB file handling"
- "Deploy on Kubernetes with horizontal pod autoscaling for 1000 users"
- "Implement WebSockets via Socket.io for real-time notifications"
- "PostgreSQL with partitioned tables for 7-year data retention"

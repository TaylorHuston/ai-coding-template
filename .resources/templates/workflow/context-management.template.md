---
version: "0.1.0"
created: "2025-09-17"
purpose: "Context management template for collaborative AI workflows"
usage: "Template for maintaining conversation context and decision history"
tags: ["context", "collaboration", "workflow", "decisions"]
---

# Context Management Template

This template provides structured context management for collaborative AI workflows, ensuring information preservation and effective handoffs between workflow phases.

## Context Checkpoint Template

```yaml
context_checkpoint:
  timestamp: "{{TIMESTAMP}}"
  phase: "{{WORKFLOW_PHASE}}"
  checkpoint_type: "{{VALIDATION_TYPE}}"

  current_understanding:
    scope: "{{CURRENT_SCOPE}}"
    decisions_made:
      - decision: "{{DECISION}}"
        confidence: "{{HIGH_MEDIUM_LOW}}"
        rationale: "{{RATIONALE}}"
        alternatives_considered: "{{ALTERNATIVES}}"

    open_questions:
      - question: "{{QUESTION}}"
        priority: "{{HIGH_MEDIUM_LOW}}"
        requires_input_from: "{{STAKEHOLDER}}"

    assumptions:
      - assumption: "{{ASSUMPTION}}"
        confidence: "{{HIGH_MEDIUM_LOW}}"
        validation_needed: "{{VALIDATION_METHOD}}"
        risk_if_wrong: "{{IMPACT}}"

  progress_status:
    completed_items: ["{{ITEM1}}", "{{ITEM2}}"]
    in_progress_items: ["{{ITEM3}}"]
    blocked_items:
      - item: "{{ITEM4}}"
        blocker: "{{BLOCKER_DESCRIPTION}}"
        resolution_plan: "{{RESOLUTION}}"

  next_steps:
    immediate_actions: ["{{ACTION1}}", "{{ACTION2}}"]
    validation_needed: ["{{VALIDATION1}}", "{{VALIDATION2}}"]
    decisions_pending: ["{{DECISION1}}", "{{DECISION2}}"]
```

## Decision Ledger Template

```yaml
decision_ledger:
  decisions:
    - id: "{{DECISION_ID}}"
      timestamp: "{{TIMESTAMP}}"
      phase: "{{WORKFLOW_PHASE}}"
      category: "{{TECHNICAL_BUSINESS_PROCESS}}"

      context:
        problem: "{{PROBLEM_DESCRIPTION}}"
        constraints: ["{{CONSTRAINT1}}", "{{CONSTRAINT2}}"]
        requirements: ["{{REQUIREMENT1}}", "{{REQUIREMENT2}}"]

      alternatives:
        - option: "{{OPTION_A}}"
          pros: ["{{PRO1}}", "{{PRO2}}"]
          cons: ["{{CON1}}", "{{CON2}}"]
          effort: "{{EFFORT_ESTIMATE}}"
          risk: "{{RISK_LEVEL}}"

        - option: "{{OPTION_B}}"
          pros: ["{{PRO1}}", "{{PRO2}}"]
          cons: ["{{CON1}}", "{{CON2}}"]
          effort: "{{EFFORT_ESTIMATE}}"
          risk: "{{RISK_LEVEL}}"

      decision:
        chosen_option: "{{SELECTED_OPTION}}"
        confidence: "{{HIGH_MEDIUM_LOW}}"
        rationale: "{{DECISION_RATIONALE}}"
        trade_offs_accepted: ["{{TRADEOFF1}}", "{{TRADEOFF2}}"]

      validation:
        success_criteria: ["{{CRITERIA1}}", "{{CRITERIA2}}"]
        validation_method: "{{VALIDATION_APPROACH}}"
        review_date: "{{REVIEW_DATE}}"
        revisit_triggers: ["{{TRIGGER1}}", "{{TRIGGER2}}"]

      impact:
        affects_components: ["{{COMPONENT1}}", "{{COMPONENT2}}"]
        affects_stakeholders: ["{{STAKEHOLDER1}}", "{{STAKEHOLDER2}}"]
        technical_debt: "{{DEBT_DESCRIPTION}}"
        documentation_updates: ["{{DOC1}}", "{{DOC2}}"]
```

## Conversation Context Template

```markdown
# Conversation Context: {{CONVERSATION_TOPIC}}

## Current Conversation State

**Phase**: {{WORKFLOW_PHASE}}
**Focus**: {{CURRENT_FOCUS}}
**Participants**: {{PARTICIPANTS}}
**Started**: {{START_TIME}}

## Understanding Built So Far

### Validated Concepts
- **{{CONCEPT1}}**: {{DESCRIPTION}} (Confidence: {{LEVEL}})
- **{{CONCEPT2}}**: {{DESCRIPTION}} (Confidence: {{LEVEL}})

### Open Questions
- [ ] **{{QUESTION1}}**: {{DESCRIPTION}} (Priority: {{LEVEL}})
- [ ] **{{QUESTION2}}**: {{DESCRIPTION}} (Priority: {{LEVEL}})

### Assumptions Being Made
- **{{ASSUMPTION1}}**: {{DESCRIPTION}}
  - Risk if wrong: {{RISK}}
  - Validation approach: {{VALIDATION}}

## Decision Points Reached

### Decisions Made
1. **{{DECISION1}}**: {{DESCRIPTION}}
   - Rationale: {{RATIONALE}}
   - Alternatives considered: {{ALTERNATIVES}}
   - Confidence: {{LEVEL}}

### Decisions Pending
1. **{{PENDING_DECISION1}}**: {{DESCRIPTION}}
   - Options: {{OPTIONS}}
   - Decision criteria: {{CRITERIA}}
   - Information needed: {{INFO_NEEDED}}

## Progress Tracking

### Completed This Session
- {{COMPLETED_ITEM1}}
- {{COMPLETED_ITEM2}}

### Next Steps Identified
- {{NEXT_STEP1}}
- {{NEXT_STEP2}}

### Iteration Triggers
- **{{TRIGGER1}}**: {{DESCRIPTION}}
- **{{TRIGGER2}}**: {{DESCRIPTION}}

## Context for Handoff

### Essential Information
{{ESSENTIAL_CONTEXT}}

### Key Constraints
{{CONSTRAINTS}}

### Success Criteria
{{SUCCESS_CRITERIA}}
```

## Iteration Trigger Template

```yaml
iteration_triggers:

  # Scope-related triggers
  scope_expansion:
    trigger: "Requirements growing beyond initial understanding"
    indicators: ["New requirements discovered", "Complexity increasing", "Timeline extending"]
    response: "Pause and reassess scope. Consider breaking into phases."

  scope_reduction:
    trigger: "Original scope proving too ambitious"
    indicators: ["Timeline pressure", "Technical constraints", "Resource limitations"]
    response: "Identify minimum viable scope. Defer non-essential features."

  # Technical triggers
  technical_blocker:
    trigger: "Implementation approach not feasible"
    indicators: ["Architecture limitations", "Performance issues", "Integration failures"]
    response: "Revisit /architect phase. Consider alternative approaches."

  technical_simplification:
    trigger: "Simpler solution discovered during implementation"
    indicators: ["Existing patterns found", "Library support available", "Complexity reduced"]
    response: "Update plan to use simpler approach. Document pattern for reuse."

  # Understanding triggers
  assumption_invalidated:
    trigger: "Key assumption proves incorrect"
    indicators: ["User research contradicts assumption", "Technical proof-of-concept fails", "Market feedback differs"]
    response: "Revisit /vision or /feature phase. Update understanding."

  new_insight:
    trigger: "Significant new understanding emerges"
    indicators: ["User behavior insights", "Technical discoveries", "Market opportunities"]
    response: "Assess impact on current plan. Consider plan adjustments."

  # Collaboration triggers
  stakeholder_feedback:
    trigger: "Important stakeholder input changes direction"
    indicators: ["Business priority changes", "User feedback", "Technical team concerns"]
    response: "Pause implementation. Align on new direction."

  team_constraint:
    trigger: "Team capacity or capability issues emerge"
    indicators: ["Key person unavailable", "Skill gap identified", "Timeline conflicts"]
    response: "Adjust plan complexity or timeline. Consider alternative approaches."

  # Quality triggers
  quality_degradation:
    trigger: "Quality standards not being met"
    indicators: ["Test failures", "Performance issues", "Security concerns"]
    response: "Address quality issues before proceeding. May require approach changes."

  quality_improvement_opportunity:
    trigger: "Better quality approach identified"
    indicators: ["Better testing patterns", "Improved architecture", "Enhanced security"]
    response: "Assess cost/benefit of quality improvement. Update standards."
```

## Context Refresh Template

```markdown
## Context Refresh: {{REFRESH_REASON}}

**Date**: {{DATE}}
**Trigger**: {{REFRESH_TRIGGER}}
**Scope**: {{REFRESH_SCOPE}}

### What We've Learned Since Last Refresh

#### New Information
- {{NEW_INFO1}}
- {{NEW_INFO2}}

#### Changed Assumptions
- **Was**: {{OLD_ASSUMPTION}}
- **Now**: {{NEW_ASSUMPTION}}
- **Impact**: {{IMPACT_DESCRIPTION}}

#### Updated Understanding
- {{UPDATED_UNDERSTANDING1}}
- {{UPDATED_UNDERSTANDING2}}

### Decisions That Need Revisiting

#### High Priority
1. **{{DECISION1}}**: {{DESCRIPTION}}
   - Why revisit: {{REASON}}
   - New options: {{NEW_OPTIONS}}

#### Medium Priority
1. **{{DECISION2}}**: {{DESCRIPTION}}
   - Why revisit: {{REASON}}
   - Impact if unchanged: {{IMPACT}}

### Plan Adjustments Needed

#### Immediate Changes
- {{CHANGE1}}
- {{CHANGE2}}

#### Future Phase Changes
- {{FUTURE_CHANGE1}}
- {{FUTURE_CHANGE2}}

### Updated Context for Next Phase

#### Key Facts
- {{FACT1}}
- {{FACT2}}

#### Open Questions
- {{QUESTION1}}
- {{QUESTION2}}

#### Success Criteria Updates
- {{UPDATED_CRITERIA1}}
- {{UPDATED_CRITERIA2}}
```

## Usage Instructions

### When to Use Each Template

**Context Checkpoint**: Use at major workflow transitions and every 3-4 conversation turns
**Decision Ledger**: Use when making significant technical or business decisions
**Conversation Context**: Use for complex conversations spanning multiple sessions
**Iteration Triggers**: Use when considering whether to revisit earlier phases
**Context Refresh**: Use when significant new information emerges

### Template Customization

1. Replace all `{{PLACEHOLDER}}` values with actual content
2. Add project-specific sections as needed
3. Adjust confidence levels and priority scales to match team preferences
4. Include relevant project context and constraints

### Integration with Workflow

- **Vision Phase**: Focus on assumption tracking and success criteria
- **Feature Phase**: Emphasize requirement evolution and user understanding
- **Architecture Phase**: Track technical decisions and trade-offs
- **Planning Phase**: Document task dependencies and resource assumptions
- **Development Phase**: Capture implementation learnings and discoveries

### Best Practices

1. **Be Specific**: Use concrete examples rather than generic statements
2. **Track Confidence**: Always include confidence levels for assumptions and decisions
3. **Document Rationale**: Explain why decisions were made for future reference
4. **Update Regularly**: Refresh context as new information emerges
5. **Enable Handoffs**: Ensure context is sufficient for team members to continue work
6. **Learn from Iterations**: Use trigger patterns to improve future planning
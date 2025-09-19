---
title: "{ISSUE_KEY} Decision Log"
version: "0.1.0"
created: "[Date when decision log was created]"
last_updated: "[Date when last decision was recorded]"
status: "Template"
target_audience: ["Development Team", "Stakeholders"]
tags: ["decision-log", "template", "project-decisions"]
category: "Deliverables"
description: "Template for tracking significant decisions during development."
decision_status: "Active/Archived"
issue_reference: "{ISSUE_KEY} - {Issue Title}"
---

# {ISSUE_KEY} Decision Log

## Overview

This document tracks all significant decisions made during the development of {ISSUE_KEY}. Each decision includes context, options considered, rationale, and consequences.

## Decision Record Format

Each decision follows this structure:
- **Date**: When the decision was made
- **Context**: What situation led to needing this decision
- **Options**: What alternatives were considered
- **Decision**: What was decided
- **Rationale**: Why this option was chosen
- **Consequences**: Expected outcomes and trade-offs
- **Status**: Proposed/Approved/Implemented/Superseded

---

## Decision 001: [Decision Title]

**Date**: [YYYY-MM-DD]
**Decider(s)**: [Names of decision makers]
**Status**: Proposed/Approved/Implemented/Superseded

### Context
What situation or problem required this decision?

### Options Considered
1. **Option A**: Description
   - Pros: [Benefits of this approach]
   - Cons: [Drawbacks of this approach]
   - Effort: [Estimated effort - High/Medium/Low]

2. **Option B**: Description
   - Pros: [Benefits of this approach]
   - Cons: [Drawbacks of this approach]
   - Effort: [Estimated effort - High/Medium/Low]

3. **Option C**: Description
   - Pros: [Benefits of this approach]
   - Cons: [Drawbacks of this approach]
   - Effort: [Estimated effort - High/Medium/Low]

### Decision
We chose **Option [X]** because [brief summary of rationale].

### Rationale
Detailed explanation of why this option was selected:
- [Key factor 1 that influenced the decision]
- [Key factor 2 that influenced the decision]
- [Key factor 3 that influenced the decision]

### Consequences
**Positive Consequences:**
- [Expected benefit 1]
- [Expected benefit 2]

**Negative Consequences:**
- [Expected drawback 1]
- [Expected drawback 2]

**Mitigation Strategies:**
- [How to minimize negative consequences]

### Follow-up Actions
- [ ] [Action item 1 with responsible person]
- [ ] [Action item 2 with responsible person]
- [ ] [Action item 3 with responsible person]

---

## Decision 002: [Decision Title]

**Date**: [YYYY-MM-DD]
**Decider(s)**: [Names of decision makers]
**Status**: Proposed/Approved/Implemented/Superseded

### Context
[Description of the situation requiring a decision]

### Options Considered
[List of alternatives evaluated]

### Decision
[What was decided]

### Rationale
[Why this decision was made]

### Consequences
[Expected outcomes and trade-offs]

### Follow-up Actions
- [ ] [Specific actions needed]

---

## Decision Templates

### Technical Architecture Decision
Use this template for technical design decisions:

**Context**: What technical challenge or requirement led to this decision?
**Requirements**: What technical requirements must be met?
**Options**: What technical approaches were considered?
**Decision**: What technical solution was chosen?
**Implementation**: How will this be implemented?
**Testing**: How will this be validated?
**Documentation**: What technical documentation is needed?

### User Experience Decision
Use this template for UX/UI decisions:

**Context**: What user need or usability issue led to this decision?
**User Research**: What user feedback or research informed this decision?
**Options**: What design alternatives were considered?
**Decision**: What design solution was chosen?
**Rationale**: Why this design best serves users?
**Success Metrics**: How will we measure if this decision was successful?

### Process Decision
Use this template for workflow or process decisions:

**Context**: What process inefficiency or need led to this decision?
**Current State**: How do we currently handle this?
**Options**: What process alternatives were considered?
**Decision**: What new process was chosen?
**Implementation**: How will the new process be rolled out?
**Training**: What training or communication is needed?

## Decision Dependencies

### Decisions That Block This Work
- [Decision from another issue/epic that must be made first]
- [External decision that affects this work]

### Decisions That This Work Blocks
- [Other issues/epics waiting on decisions from this work]
- [Future work that depends on these decisions]

## Retrospective Notes

### What Worked Well
- [Decisions that turned out better than expected]
- [Decision-making processes that were effective]

### What Could Be Improved
- [Decisions that had unexpected consequences]
- [Decision-making processes that could be improved]

### Lessons Learned
- [Key insights for future decision making]
- [Patterns to watch for in similar situations]

## Superseded Decisions

When decisions are changed or overruled, move them here with explanation:

### ~~Decision [Number]: [Title]~~ *(Superseded)*
**Original Decision**: [What was originally decided]
**Superseded By**: [New decision that replaces this]
**Date Superseded**: [When it was changed]
**Reason**: [Why the decision was changed]

## Quick Reference

### Key Decisions Summary
| Decision | Date | Impact | Status |
|----------|------|--------|--------|
| [Decision 1] | [Date] | High/Medium/Low | Implemented |
| [Decision 2] | [Date] | High/Medium/Low | Approved |
| [Decision 3] | [Date] | High/Medium/Low | Proposed |

### Decision Categories
- **Architecture**: Fundamental technical design decisions
- **User Experience**: Interface and interaction design decisions  
- **Process**: Workflow and methodology decisions
- **Integration**: External system and API decisions
- **Security**: Security approach and implementation decisions
- **Performance**: Optimization and scalability decisions

## Communication

### Who Should Be Informed
- [Stakeholders who need to know about decisions]
- [Teams affected by these decisions]
- [External parties that should be notified]

### Communication Methods
- [How decisions will be communicated]
- [Meeting updates, Slack channels, email, etc.]
- [Documentation that needs to be updated]

---

**Instructions for Maintainers**
1. Add new decisions as they are made
2. Update status as decisions are implemented
3. Move superseded decisions to the appropriate section
4. Keep the quick reference table current
5. Review and archive this log when the issue is complete
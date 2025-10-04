---
version: "0.1.0"
created: "2025-09-18"
last_updated: "2025-09-18"
purpose: "Bug template for systematic investigation and resolution"
when_to_use: "When bugs are identified and need structured resolution approach"
target_audience: ["developers", "ai-assistants"]
document_type: "template"
tags: ["bug", "investigation", "debugging", "resolution"]
placeholders:
  - name: "NUMBER"
    description: "Sequential bug number (001, 002, etc)"
    example: "001"
  - name: "TITLE"
    description: "Brief title describing the bug"
    example: "User login fails with invalid session error"
  - name: "STATUS"
    description: "Current status"
    example: "investigating"
  - name: "PRIORITY"
    description: "Bug priority level"
    example: "high"
  - name: "EXTERNAL_REF"
    description: "Link to external bug tracking system (optional)"
    example: "https://company.atlassian.net/browse/BUG-101"
  - name: "DESCRIPTION"
    description: "Clear description of the bug and its impact"
    example: "Users cannot log in after session timeout, receiving unexpected error messages"
  - name: "REPRODUCTION_STEPS"
    description: "Steps to reproduce the bug"
    example: "1. Log in normally, 2. Wait for session timeout, 3. Attempt to log in again"
  - name: "EXPECTED_BEHAVIOR"
    description: "What should happen"
    example: "User should be able to log in successfully after session timeout"
  - name: "ACTUAL_BEHAVIOR"
    description: "What actually happens"
    example: "Login fails with 'Invalid session' error and user is not redirected properly"
  - name: "ENVIRONMENT"
    description: "Environment where bug occurs"
    example: "Production, Chrome browser, mobile devices"
  - name: "IMPACT"
    description: "Business and user impact"
    example: "Blocks user access, affects 15% of daily active users"
---

# BUG-{{NUMBER}}: {{TITLE}}

**Status**: {{STATUS}}
**Priority**: {{PRIORITY}}
**External Ref**: {{EXTERNAL_REF}}

## Description

{{DESCRIPTION}}

## Impact Assessment

**Business Impact**: {{IMPACT}}
**Affected Users**: [Specify user segments or percentage]
**Frequency**: [How often does this occur]
**Workaround Available**: [Yes/No - describe if available]

## Reproduction Information

### Steps to Reproduce
{{REPRODUCTION_STEPS}}

### Expected Behavior
{{EXPECTED_BEHAVIOR}}

### Actual Behavior
{{ACTUAL_BEHAVIOR}}

### Environment Details
{{ENVIRONMENT}}

## Investigation Tasks
<!-- Added by /plan command -->
<!-- Format: X.Y.Z for precise referencing -->
<!-- Investigation approach: Systematic analysis, hypothesis testing, root cause identification -->
<!-- Example:
### 1.1.0 Initial Investigation
- [ ] 1.1.1 Reproduce bug in development environment
- [ ] 1.1.2 Analyze error logs and stack traces
- [ ] 1.1.3 Identify affected code components
- [ ] 1.1.4 Document initial findings and hypotheses

### 1.2.0 Root Cause Analysis
- [ ] 1.2.1 Test hypothesis A: Session timeout handling
- [ ] 1.2.2 Test hypothesis B: Authentication token validation
- [ ] 1.2.3 Review recent changes to authentication system
- [ ] 1.2.4 Identify root cause with evidence
-->

## Fix Implementation
<!-- Added by /plan command -->
<!-- Format: X.Y.Z for precise referencing -->
<!-- Fix approach: Test-driven fix development, validation, deployment -->
<!-- Example:
### 2.1.0 Fix Development
- [ ] 2.1.1 Write failing test that reproduces the bug
- [ ] 2.1.2 Implement fix for root cause
- [ ] 2.1.3 Verify fix resolves the issue
- [ ] 2.1.4 Ensure no regression in related functionality
-->

## Testing Strategy

### Regression Testing
- [ ] Test all authentication flows
- [ ] Verify session management functionality
- [ ] Test edge cases and boundary conditions
- [ ] Validate fix across different environments

### Validation Criteria
- [ ] Bug no longer reproducible
- [ ] All existing tests pass
- [ ] New test cases prevent regression
- [ ] Performance impact acceptable
- [ ] User experience improved

## Communication Plan

### Stakeholder Updates
- [ ] Notify product team of investigation progress
- [ ] Update support team with workaround information
- [ ] Communicate fix timeline to affected users
- [ ] Document lessons learned for future prevention

### Documentation Updates
- [ ] Update troubleshooting documentation
- [ ] Add test cases to prevent regression
- [ ] Document fix approach for knowledge sharing
- [ ] Update monitoring and alerting if needed

## Notes

{{NOTES}}

## Related Issues

- Related bugs: [List any related bug reports]
- Upstream dependencies: [External systems or components involved]
- Downstream impacts: [Other features that might be affected]
---
version: "1.0.0"
created: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "tech-leads"]
document_type: "guide"
tags: ["implementations", "history", "troubleshooting"]
---

# Implementation Records

**Purpose**: Historical record of completed implementation work, providing detailed context for troubleshooting, auditing, and knowledge transfer.

## What Goes Here

### Completed Implementation Plans
- **Source**: Promoted from `.claude/working/[issue-id]/PLAN.md` after completion
- **Content**: Exact steps taken, results achieved, lessons learned
- **Format**: Enhanced version of the original PLAN.md with outcomes
- **Naming**: `YYYY-MM-DD-feature-name.md` (e.g., `2024-01-15-auth-system.md`)

### When to Create Implementation Records

**Always Create For:**
- Completed features from the `/develop` workflow
- Major bug fixes that required significant investigation
- Performance optimizations with measurable impact
- Security implementations or patches
- Complex refactoring or migration work

**Optional For:**
- Simple bug fixes (< 1 day of work)
- Minor configuration changes
- Documentation-only updates

## Purpose and Benefits

### For Troubleshooting
- "Why is authentication failing?" → Check `2024-01-15-auth-system.md`
- "When did we add rate limiting?" → Search implementation records
- "What exactly changed in the payment flow?" → Review implementation steps

### For Knowledge Transfer
- New team members can see how features were built
- Understanding the evolution of the system over time
- Learning from past implementation approaches and challenges

### For Auditing and Compliance
- Complete trail of what was implemented when
- Evidence of testing and security considerations
- Record of who made changes and why

### For Process Improvement
- Identify patterns in implementation challenges
- See which approaches worked well vs poorly
- Track time estimates vs actual implementation time

## Record Structure

### Enhanced PLAN.md Format
When moving from `.claude/working/` to `implementations/`, the PLAN.md is enhanced with:

```markdown
# [Feature Name] Implementation

**Date**: YYYY-MM-DD
**Issue**: [External issue reference]
**Feature**: [Link to feature doc]
**Duration**: [Actual time taken]
**Agents Used**: [List of AI agents involved]

## Implementation Summary
[High-level overview of what was built]

## Implementation Steps
[Original PLAN.md content with completion status and notes]

### Phase 1: [Name] ✅
- [x] P1.1.0: Task description [✅ completed YYYY-MM-DD, X hours, notes]
- [x] P1.2.0: Task description [✅ completed YYYY-MM-DD, X hours, notes]

## Key Decisions Made During Implementation
[Decisions that weren't in original ADRs]
- Choice A over B because of constraint X
- Added feature Y after discovering issue Z

## Challenges and Solutions
[Problems encountered and how they were resolved]
- Problem: Database migration took 6 hours instead of 1
- Solution: Added parallel processing, will use for future migrations

## Testing Results
[What testing was performed and results]
- Unit tests: 95% coverage
- Integration tests: All passing
- Performance tests: 200ms avg response time

## Lessons Learned
[What we'd do differently next time]
- Should have added integration tests earlier
- Redis configuration needed more tuning than expected
- Team communication could have been better

## Post-Implementation Notes
[Updates made after initial completion]
- 2024-01-20: Added monitoring alerts
- 2024-02-01: Fixed edge case in password reset
```

## Integration with Dual Record System

### Local Implementation Record (Detailed)
```yaml
docs/technical/implementations/2024-01-15-auth-system.md
- Complete technical implementation steps
- Exact commands run and results
- Agent coordination details
- Troubleshooting information
- Performance metrics and test results
```

### External Record (Summary)
```yaml
Jira Issue AUTH-123:
- Phase completion comments
- Blockers and resolutions
- High-level status updates
- Final completion confirmation
```

## Naming Conventions

### File Naming
- Format: `YYYY-MM-DD-feature-name.md`
- Date: Implementation completion date
- Name: Short, descriptive feature name
- Examples:
  - `2024-01-15-user-authentication.md`
  - `2024-02-03-payment-processing.md`
  - `2024-02-10-performance-optimization.md`

### Avoid Generic Names
- ❌ `2024-01-15-bug-fix.md`
- ✅ `2024-01-15-login-timeout-fix.md`
- ❌ `2024-02-01-refactor.md`
- ✅ `2024-02-01-database-query-optimization.md`

## Maintenance and Cleanup

### Regular Review
- Quarterly review of implementation records
- Archive records older than 2 years (unless critical)
- Update references when related systems change

### Search and Discovery
- Use consistent tagging in frontmatter
- Include relevant keywords in content
- Link between related implementation records

### Archive Strategy
```yaml
implementations/
├── 2024/              # Current year implementations
├── 2023/              # Previous year implementations
└── archived/          # Records older than 2 years
    └── 2022/
```

## Best Practices

### Writing Good Implementation Records

1. **Be specific about what was done**: Include actual commands, configurations, code changes
2. **Document the reasoning**: Why specific approaches were chosen during implementation
3. **Include metrics**: Performance before/after, test coverage, time taken
4. **Note surprises**: Things that didn't go as planned and how they were handled
5. **Link to related docs**: Feature docs, ADRs, external issues

### Using Implementation Records

1. **Before troubleshooting**: Check if similar work was done before
2. **Before new implementations**: Learn from past approaches and challenges
3. **During onboarding**: Help new team members understand system evolution
4. **For estimates**: Use past implementation times to improve future estimates

## Related Documentation

- [Feature Documentation](../features/README.md) - Business context and requirements
- [Architecture Documentation](../architecture/README.md) - System design and structure
- [Decision Records](../decisions/README.md) - Technical decisions and rationale
- [Development Workflows](../../development/workflows/) - Team processes and guidelines

---

*Implementation records preserve the valuable context of how things were actually built, not just how they were designed.*
---
version: "0.1.0"
created: "2025-08-22"
last_updated: "2025-09-17"
status: "active"
target_audience: ["development-team", "product-managers", "ai-assistants"]
document_type: "guide"
tags: ["deliverables", "usage", "templates"]
---

# Deliverables Usage Guide  

## When to Use Each Template

### 🎯 Deliverable Issue (`template-deliverable/issues/`)

**Use for:**
- Part of a larger product initiative
- Has clear business value and user impact
- Requires stakeholder visibility
- Multiple days or weeks of work
- Needs comprehensive planning and documentation

**Examples:**
- Implementing user authentication
- Adding payment processing
- Building a dashboard feature
- API integration project

**Effort Range:** 3+ days

### 🐛 Bug (`bugs/`)

**Use for:**
- Something is broken in production/staging/development
- Has clear reproduction steps
- Impacts users or blocks development
- Needs quick turnaround
- Regression from previous functionality

**Examples:**
- Login button not working
- Data not saving correctly
- Performance degradation
- UI rendering issues

**Effort Range:** 1 hour - 2 days

### ✅ Task (`tasks/`)

**Use for:**
- Technical improvements (refactoring, cleanup)
- Documentation updates
- Small enhancements
- Independent work items
- Technical debt reduction
- Performance optimizations

**Examples:**
- Refactor authentication module
- Update API documentation
- Optimize database queries
- Add logging to service
- Upgrade dependencies

**Effort Range:** 2 hours - 3 days

## Quick Decision Tree

```
Is something broken?
  └─ Yes → Use Bug template
  └─ No → Continue
  
Is it part of a product deliverable?
  └─ Yes → Use Issue template (under deliverable)
  └─ No → Continue
  
Is it a standalone improvement?
  └─ Yes → Use Task template
  └─ No → Discuss with team
```

## Naming Conventions

### Issue Naming
```
[PROJECT]-[NUMBER]-[brief-description]/
Examples:
- AUTH-001-login-implementation/
- PAY-002-stripe-integration/
- DASH-003-metrics-widget/
```

### Bug Naming
```
BUG-[NUMBER]-[brief-description]/
Examples:
- BUG-001-login-failure/
- BUG-002-data-corruption/
- BUG-003-slow-page-load/
```

### Task Naming
```
TASK-[NUMBER]-[brief-description]/
Examples:
- TASK-001-refactor-auth/
- TASK-002-update-docs/
- TASK-003-optimize-queries/
```

### Status Prefixes (Optional)
Add status to folder name for visibility:
```
[ACTIVE]-BUG-001-login-issue/
[BLOCKED]-TASK-002-refactor/
[REVIEW]-ISSUE-003-feature/
[DONE]-BUG-004-fixed-bug/
```

## Workflow by Type

### Bug Workflow

1. **Discovery**
   - Bug reported or discovered
   - Create folder in `bugs/` directory
   - Copy template from `bugs/template/`

2. **Documentation**
   - Fill out `BUG-KEY-plan.md` with reproduction steps
   - Add details to `docs/reproduction.md`
   - Set priority based on impact

3. **Investigation**
   - Reproduce the bug
   - Identify root cause
   - Document findings

4. **Fix**
   - Implement fix
   - Add regression tests
   - Test thoroughly

5. **Release**
   - Deploy fix
   - Verify in production
   - Close ticket

### Task Workflow

1. **Planning**
   - Identify improvement opportunity
   - Create folder in `tasks/` directory
   - Copy template from `tasks/template/`

2. **Scoping**
   - Fill out `TASK-KEY-plan.md`
   - Define scope in `docs/scope.md`
   - Estimate effort

3. **Implementation**
   - Follow phases in plan
   - Update progress tracker
   - Document decisions

4. **Completion**
   - Review changes
   - Update documentation
   - Mark as complete

### Issue Workflow

1. **Creation**
   - Issue identified as part of deliverable
   - Create folder under `deliverables/[name]/issues/`
   - Copy template from issue template

2. **Planning**
   - Fill out `ISSUE-KEY-plan.md`
   - Complete `docs/requirements.md`
   - Link to parent deliverable

3. **Development**
   - Follow 5-phase implementation plan
   - Update progress trackers
   - Maintain decision log

4. **Delivery**
   - Complete all acceptance criteria
   - Pass review process
   - Deploy to production
   - Update deliverable status

## Priority Guidelines

### P0 - Critical
- **Bug**: Production down, data loss, security breach
- **Task**: Urgent security patch, critical performance fix
- **Issue**: Launch blocker, regulatory requirement
- **Response**: Drop everything, fix immediately

### P1 - High
- **Bug**: Major feature broken, significant user impact
- **Task**: Important refactoring, documentation gaps
- **Issue**: Core feature implementation
- **Response**: Address within current sprint

### P2 - Medium
- **Bug**: Minor feature issue, workaround available
- **Task**: Code cleanup, minor improvements
- **Issue**: Feature enhancement, nice-to-have
- **Response**: Schedule for next sprint

### P3 - Low
- **Bug**: Cosmetic issue, edge case
- **Task**: Future improvements, tech debt
- **Issue**: Future considerations
- **Response**: Backlog, address when possible

## File Structure Summary

```
deliverables/
├── USAGE-GUIDE.md                    # This file
├── STATUS.md                         # Overall project status
│
├── [deliverable-name]/               # Product deliverables
│   ├── [deliverable-name].md         # Deliverable documentation
│   └── issues/
│       └── ISSUE-XXX-description/
│           ├── ISSUE-KEY-plan.md
│           └── docs/
│               ├── requirements.md
│               └── decision-log.md
│
├── bugs/                             # Bug fixes
│   ├── template/
│   └── BUG-XXX-description/
│       ├── BUG-KEY-plan.md
│       └── docs/
│           ├── reproduction.md
│           └── decision-log.md
│
└── tasks/                            # Standalone tasks
    ├── template/
    └── TASK-XXX-description/
        ├── TASK-KEY-plan.md
        └── docs/
            ├── scope.md
            └── decision-log.md
```

## Progress Tracking

### Visual Progress Bars
Use Unicode characters for progress visualization:
```
Not started:  ░░░░░░░░░░ 0%
In progress:  ███░░░░░░░ 30%
Half done:    █████░░░░░ 50%
Almost done:  ████████░░ 80%
Complete:     ██████████ 100%
```

### Status Indicators
- ✅ **Complete**: Work finished and validated
- 🔄 **In Progress**: Currently active work
- ⚠️ **Blocked**: Waiting on dependency
- 🚨 **Critical**: Urgent attention needed
- 📋 **Planned**: Ready to start
- 🔍 **In Review**: Awaiting review
- ⏸️ **On Hold**: Temporarily paused

## Best Practices

### Do's
- ✅ Choose the right template for the work type
- ✅ Keep plans updated with actual progress
- ✅ Document decisions as you make them
- ✅ Link related work items
- ✅ Update status regularly
- ✅ Clean up completed items periodically

### Don'ts
- ❌ Use Issue template for quick fixes (use Bug/Task)
- ❌ Create deliverables for small tasks
- ❌ Skip documentation for "obvious" decisions
- ❌ Leave status unchanged for days
- ❌ Mix different work types in one folder

## Tips for AI Assistants

1. **Always check existing work** before creating new items
2. **Match the template to the work type** - don't over-document simple bugs
3. **Update progress in real-time** as you work through phases
4. **Reference related items** to maintain traceability
5. **Use status prefixes** in folder names for active work
6. **Keep stakeholders informed** through status updates in plans

## Common Scenarios

### "The website is slow"
→ Could be a **Bug** if it's a regression, or a **Task** if it's optimization work

### "Add user authentication"
→ **Issue** under a deliverable, as it's a major feature

### "Fix typo in documentation"
→ **Task** for a quick documentation update

### "Customer can't log in"
→ **Bug** that needs immediate attention

### "Refactor the payment module"
→ **Task** for technical improvement

### "Build admin dashboard"
→ Create a **Deliverable** with multiple **Issues**

---

**Remember**: The goal is to track work efficiently, not create unnecessary overhead. Choose the simplest template that captures what you need.
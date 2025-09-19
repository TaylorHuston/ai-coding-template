---
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-09-15"
status: "active"
target_audience: ["ai-assistants", "developers"]
document_type: "reference"
difficulty: "intermediate"
tags: ["ai-assistant", "reference", "workflow"]
---

# AI Assistant Quick Reference Guide

Quick reference for AI assistants working with this repository.

## First Session Checklist

### 1. Context Loading Priority (Read in Order)
1. **STATUS.md** - Current project state and active work
2. **CLAUDE.md** - Project-specific instructions and patterns
3. **../../development/guidelines/quality-standards.md** - Development requirements and standards
4. **../../../.claude/working/README.md** - Deliverables and issue management workflow
5. **../../development/guidelines/documentation-guidelines.md** - Documentation conventions

### 2. Validate Context Understanding
- [ ] Current sprint/milestone understood
- [ ] Active issues and priorities identified
- [ ] Technology stack and patterns recognized
- [ ] Any blocking issues or dependencies noted
- [ ] Issue tracking system integration confirmed
- [ ] **AI Branching Strategy** reviewed ([ai-collaboration/ai-branching-strategy.md](../../ai-collaboration/ai-branching-strategy.md))

## Common Workflows

### Starting New Work
```
1. Check STATUS.md for current priorities
2. Look for existing deliverables/[DELIVERABLE]/issues/{ISSUE-KEY}/ directory
3. If none exists, create one with templates
4. Copy templates from deliverables/template-deliverable/issues/template/
5. Update issue planning files with specifics
```

### Git Workflow for AI Assistants
```
1. NEVER commit directly to main or develop branches
2. Ask permission before creating feature branches
3. Show changes before committing
4. Follow naming: feature/ISSUE-KEY-description
5. Tag commits with (AI-assisted)
```
See [AI Branching Strategy](../guides/ai-collaboration-guide.md#ai-branching-strategy) for complete guidelines.

### Implementing Features
```
1. Read requirements from deliverables/[DELIVERABLE]/issues/{ISSUE-KEY}/docs/requirements.md
2. Follow patterns in CLAUDE.md and quality-standards.md
3. Check ../../development/guidelines/documentation-guidelines.md for conventions
4. Update decision log as you make choices
5. Test against acceptance criteria
```

### Completing Work
```
1. Update STATUS.md with progress
2. Complete decision log entries
3. Update deliverables/[DELIVERABLE]/issues/{ISSUE-KEY}/README.md with final status
4. Run documentation health check (if available)
5. Validate all acceptance criteria met
```

## File Conventions

### Naming Rules
- **Documentation**: snake_case.md (except README.md and CLAUDE.md)
- **Code**: Follow quality standards in ../../development/guidelines/quality-standards.md
- **Templates**: Use {{VARIABLE}} syntax for substitution
- **Issues**: Use issue tracking key format (PROJ-123, ENG-456, issue-789)

### Documentation Standards
All .md files require metadata header:
```markdown
# Title

**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Status**: Draft/Review/Active/Archived
**Target Audience**: [Specific audience]
```

## Issue Tracking Integration

### Supported Systems
- **Jira**: deliverables/[DELIVERABLE]/issues/PROJ-123/ format
- **Linear**: deliverables/[DELIVERABLE]/issues/ENG-456/ format  
- **GitHub Issues**: deliverables/[DELIVERABLE]/issues/issue-789/ format
- **Custom**: deliverables/[DELIVERABLE]/issues/[custom-format]/ format

### Workflow Integration
1. Issue created in tracking system
2. Create issue directory under appropriate deliverable
3. Copy planning templates and customize
4. Implement following requirements and decision log
5. Update external system with final status

## Common Commands

### Documentation Health Check
```bash
node scripts/docs-health.js
```

### Generate New Documentation
```bash
node scripts/generate-doc.js
```

### Check Documentation Links
```bash
node scripts/check-docs-links.js
```

### Documentation Changelog
```bash
node scripts/docs-changelog.js
```

## Priority System

### Issue Priorities
- **P0**: Critical - Production down, security breach, data loss
- **P1**: High - Major feature broken, significant user impact
- **P2**: Medium - Feature enhancement, minor bugs
- **P3**: Low - Nice to have, technical debt

### Status Indicators
- ✅ **Complete**: Work finished and validated
- 🔄 **In Progress**: Currently active work  
- ⚠️ **Blocked**: Waiting on dependency
- 🚨 **Critical**: Urgent attention needed
- 📋 **Planned**: Ready to start

## Visual Progress Bars

Use these Unicode characters for progress visualization:
- **Full blocks**: ██ (complete)
- **Empty blocks**: ▒▒ (remaining)
- **Example**: ████████▒▒ 80% Complete

## Context Management

### When Context Window Fills Up
1. Summarize current progress in STATUS.md
2. Update relevant issue files
3. Start new session with context loading checklist
4. Reference files by name rather than including full content

### Preserving Context Across Sessions
- Update STATUS.md after each significant milestone
- Keep issue directories current with progress
- Document decisions in decision logs immediately
- Reference external issue tracking system for requirements

## Error Prevention

### Common Mistakes to Avoid
- ❌ Creating UPPERCASE.md files (should be snake_case.md)
- ❌ Skipping metadata headers in documentation
- ❌ Not updating STATUS.md after progress
- ❌ Creating files without reading existing patterns
- ❌ Ignoring issue tracking system integration

### Quality Gates
- All documentation includes required metadata
- Progress is tracked in visual format where applicable
- Decision logs are updated with rationale
- External issue tracking system is kept in sync
- Code follows quality standards in ../../development/guidelines/quality-standards.md

## Emergency Procedures

### Context Loss Recovery
1. Read STATUS.md for last known state
2. Check git log for recent commits
3. Review deliverables/[DELIVERABLE]/issues/ directories for active issues
4. Consult external issue tracking system
5. Ask user for clarification on current priorities

### Conflicting Information
1. External issue tracking system = source of truth for requirements
2. STATUS.md = source of truth for current progress
3. ../../development/guidelines/quality-standards.md = source of truth for quality requirements
4. When in doubt, ask user for clarification

## Best Practices

### Communication Style
- Be concise and focused on current task
- Reference specific files and line numbers when relevant
- Update status visually with progress bars where helpful
- Document decisions and rationale immediately

### Code Generation
- Always follow existing patterns in codebase
- Check CLAUDE.md for system guidelines and architecture
- Validate against requirements in workbench
- Update documentation as you implement
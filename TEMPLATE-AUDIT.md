# Template System Audit

**Date**: 2025-09-17
**Purpose**: Complete inventory and analysis of all templates in the system
**Status**: In Progress

## Template Inventory

### Feature Templates (DUPLICATES FOUND)

| Location | File | Lines | Purpose | Status |
|----------|------|-------|---------|--------|
| `/templates/docs/features/` | `feature-simple-specification.template.md` | 71 | Simple feature spec | DUPLICATE |
| `/templates/docs/features/` | `feature-comprehensive-specification.template.md` | 260 | Comprehensive spec | DUPLICATE |
| `/templates/docs/features/` | `feature-specification-template.md` | 188 | Generic spec | DUPLICATE |
| `/docs/development/templates/simple/` | `feature-simple.template.md` | ? | Simple feature | DUPLICATE |
| `/docs/development/templates/standard/` | `feature.template.md` | ? | Standard feature | DUPLICATE |
| `/docs/technical/features/` | `template.md` | 60 | New workflow feature | KEEP |

**RECOMMENDATION**: Consolidate to 3 levels in new hierarchy:
- `feature-minimal.template.md`
- `feature-standard.template.md`
- `feature-comprehensive.template.md`

### Deliverable Templates (DUPLICATES FOUND)

| Location | File | Purpose | Status |
|----------|------|---------|--------|
| `/templates/workflow/deliverables/` | `deliverable-simple.template.md` | Simple deliverable | DUPLICATE |
| `/templates/workflow/deliverables/` | `deliverable-comprehensive.template.md` | Comprehensive deliverable | DUPLICATE |
| `/docs/development/templates/simple/` | `deliverable-simple.template.md` | Simple deliverable | DUPLICATE |
| `/docs/development/templates/standard/` | `deliverable.template.md` | Standard deliverable | DUPLICATE |

**RECOMMENDATION**: Replace with new workflow templates:
- `planning.template.md` (for /plan output)
- `implementation-record.template.md` (for completed work)

### ADR/Decision Templates (DUPLICATES FOUND)

| Location | File | Purpose | Status |
|----------|------|---------|--------|
| `/templates/docs/decisions/` | `architecture-decision-record.template.md` | ADR template | DUPLICATE |
| `/docs/technical/decisions/` | `template.md` | ADR template | KEEP |

**RECOMMENDATION**: Keep the one in `docs/technical/decisions/` and remove duplicate.

### Exploration Templates (DUPLICATES FOUND)

| Location | File | Purpose | Status |
|----------|------|---------|--------|
| `/templates/workflow/explorations/` | `conversation-template.md` | Exploration conversation | DUPLICATE |
| `/templates/workflow/explorations/` | `notes-template.md` | Exploration notes | DUPLICATE |
| `/templates/workflow/explorations/` | `specialist-inputs-template.md` | Specialist inputs | DUPLICATE |
| `/docs/technical/decisions/explorations/templates/` | `conversation-template.md` | Same as above | DUPLICATE |
| `/docs/technical/decisions/explorations/templates/` | `notes-template.md` | Same as above | DUPLICATE |
| `/docs/technical/decisions/explorations/templates/` | `specialist-inputs-template.md` | Same as above | DUPLICATE |

**RECOMMENDATION**: Keep only one set in appropriate location.

### Project Templates (ORGANIZED)

| Location | File | Purpose | Status |
|----------|------|---------|--------|
| `/templates/docs/project/` | `web-app-template.md` | Web app README | KEEP |
| `/templates/docs/project/` | `api-service-template.md` | API service README | KEEP |
| `/templates/docs/project/` | `cli-tool-template.md` | CLI tool README | KEEP |
| `/templates/docs/project/` | `library-template.md` | Library README | KEEP |
| `/templates/docs/project/` | `mobile-app-template.md` | Mobile app README | KEEP |
| `/templates/docs/project/` | `enterprise-template.md` | Enterprise README | KEEP |

**RECOMMENDATION**: These are well organized, keep as-is.

### Code Templates (ORGANIZED)

| Location | File | Purpose | Status |
|----------|------|---------|--------|
| `/templates/code/components/` | `component.template.tsx` | React component | KEEP |
| `/templates/code/api/` | `service.template.ts` | API service | KEEP |

**RECOMMENDATION**: These are well organized, keep as-is.

### Vision/Technical Templates

| Location | File | Purpose | Status |
|----------|------|---------|--------|
| `/templates/docs/technical/` | `project-vision.template.md` | Project vision | KEEP |
| `/templates/docs/technical/` | `project-changelog.template.md` | Changelog | KEEP |
| `/docs/vision-template.md` | Vision template | DUPLICATE |

### Working Directory Templates (OLD STRUCTURE)

| Location | File | Purpose | Status |
|----------|------|---------|--------|
| `.claude/working/template-deliverable/` | Various templates | Old deliverable structure | REMOVE |
| `.claude/working/bugs/template/` | Bug templates | Update for new workflow | UPDATE |
| `.claude/working/tasks/template/` | Task templates | Update for new workflow | UPDATE |

## Missing Templates for New Workflow

1. **Architecture Template** - For /architect command output
2. **Implementation Record Template** - For completed work records
3. **Working Directory Templates** - Updated for new workflow structure

## Naming Convention Analysis

| Pattern | Count | Examples | Recommendation |
|---------|-------|----------|----------------|
| `{name}.template.{ext}` | ~25 | `component.template.tsx` | **ADOPT** |
| `{name}-template.{ext}` | ~15 | `feature-simple-template.md` | Convert |
| `template.{ext}` | ~5 | `template.md` | Convert |

## Directory Structure Issues

**Current Chaos:**
- Templates scattered across 6+ directories
- Same purpose templates in multiple locations
- No clear organization principle

**Proposed Cleanup:**
```
templates/                    # All templates here
├── workflow/                 # Workflow phase templates
│   ├── feature/             # /feature command templates
│   ├── architecture/        # /architect command templates
│   ├── planning/            # /plan command templates
│   └── implementation/      # /develop command templates
├── documentation/           # Documentation templates
│   ├── technical/          # ADRs, architecture docs
│   └── project/            # Vision, README, etc.
└── code/                    # Code generation templates

examples/                     # All examples here
├── workflow/                # Complete workflow examples
├── documentation/           # Doc examples
└── code/                    # Code examples
```

## Action Plan

### Immediate Actions
1. ✅ Create this audit document
2. 🔄 Consolidate feature templates (3 → 1 configurable)
3. 🔄 Remove duplicate deliverable templates
4. 🔄 Move ADR template to correct location
5. 🔄 Clean up exploration template duplicates

### Create Missing Templates
1. Architecture template for /architect command
2. Implementation record template
3. Updated working directory templates

### Reorganize Structure
1. Move all templates to unified hierarchy
2. Rename files to follow convention
3. Update all references

### Update Documentation
1. Master index update
2. Template selection guide
3. Cross-reference validation

---

**Progress**: Phase 1 - Inventory Complete ✅
**Next**: Begin consolidation of duplicate templates
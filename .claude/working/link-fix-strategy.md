---
created: "2025-09-17"
status: "active"
document_type: "strategy"
priority: "high"
tags: ["documentation", "links", "fixes", "strategy"]
---

# Documentation Link Fix Strategy

## Executive Summary

**Scale**: 491 broken internal links across 192 files
**Categories**: 4 main types requiring different fix approaches
**Priority**: Critical infrastructure issue affecting documentation quality score

## Link Categories Analysis

### 1. Critical Missing Core Files (Priority 1)
**Count**: ~15-20 links
**Impact**: High - Core project files expected by users

| Missing File | Referenced In | Fix Action |
|--------------|---------------|------------|
| `CONTRIBUTING.md` | Multiple locations | Create contribution guidelines |
| `LICENSE` | Multiple locations | Add license file |
| `CHANGELOG.md` | Multiple locations | Already exists - fix paths |
| `TEMPLATES-EXAMPLES-INDEX.md` | README.md | Rename or create index |

### 2. Template Placeholder Links (Priority 4)
**Count**: ~200+ links
**Impact**: Low - These are intentional placeholders in templates
**Examples**: `{{DEMO_URL}}`, `{{FEATURE_CONTEXT_LINK}}`, `link`

**Fix Strategy**: Exclude from validation rather than fix
- Update link-validator.sh to filter template placeholders
- Patterns to exclude: `{{*}}`, `link`, `[name]`, `[service]`

### 3. Incorrect Path References (Priority 2)
**Count**: ~150+ links
**Impact**: Medium - Existing files with wrong paths

| Pattern | Issue | Fix |
|---------|-------|-----|
| `../../../docs/ai-tools/setup/claude-code-hooks-setup.md` | File doesn't exist | Create missing setup doc |
| `../docs/reference/` | Incomplete path | Complete or remove |
| `./docs/api/README.md` | Wrong relative path | Correct path |

### 4. Missing Documentation Files (Priority 3)
**Count**: ~100+ links
**Impact**: Medium - Referenced docs that should exist

| Missing Category | Examples | Action |
|------------------|----------|--------|
| Setup guides | `claude-code-hooks-setup.md` | Create setup documentation |
| Best practices | `agent-best-practices.md` | Create from existing patterns |
| API docs | Various `docs/api/` references | Create API documentation |
| Architecture docs | `auth-system-architecture.md` | Create architecture templates |

## Implementation Plan

### Phase 1: Critical Fixes (Week 1)
1. **Create Core Missing Files**
   ```bash
   # Create CONTRIBUTING.md
   # Create LICENSE file
   # Fix CHANGELOG.md references
   # Create/rename TEMPLATES-EXAMPLES-INDEX.md
   ```

2. **Update Link Validator**
   ```bash
   # Exclude template placeholder patterns
   # Add smart path resolution
   # Improve categorization
   ```

3. **Fix High-Impact Path Issues**
   ```bash
   # Correct relative paths in .claude/ directory
   # Fix README.md references
   # Update core documentation links
   ```

### Phase 2: Path Corrections (Week 2)
1. **Systematic Path Fixes**
   - Create path mapping for common incorrect patterns
   - Batch fix using sed/find commands
   - Validate fixes with updated link validator

2. **Create Missing Setup Documentation**
   - `claude-code-hooks-setup.md`
   - `agent-best-practices.md`
   - Core workflow setup guides

### Phase 3: Documentation Creation (Week 3)
1. **API Documentation**
   - Create `docs/api/` structure
   - Generate API reference templates
   - Link to existing functionality

2. **Architecture Documentation**
   - Create `docs/technical/architecture/` structure
   - Add template architecture docs
   - Document existing patterns

### Phase 4: Quality Assurance (Week 4)
1. **Validation and Cleanup**
   - Re-run link validator (target: <50 broken links)
   - Quality review of new documentation
   - Integration testing

2. **Automation Enhancement**
   - Add pre-commit link validation
   - Create documentation maintenance scripts
   - Establish link quality metrics

## Quick Wins (Immediate Actions)

### 1. Create Core Files
```bash
# LICENSE file
echo "MIT License" > LICENSE

# Basic CONTRIBUTING.md
echo "# Contributing Guidelines" > CONTRIBUTING.md
echo "See docs/development/guidelines/ for detailed contribution guidelines." >> CONTRIBUTING.md

# Fix TEMPLATES-EXAMPLES-INDEX.md reference
# Check if file exists with different name and create symlink or rename
```

### 2. Filter Template Placeholders
```bash
# Update link-validator.sh to exclude:
# - Lines containing {{*}}
# - Links that are exactly "link"
# - Template variable patterns [name], [service], etc.
```

### 3. Fix Critical Path Issues
```bash
# Fix .claude/working/ paths that reference ../../CLAUDE.md
# CLAUDE.md exists at project root, paths are wrong
find .claude/working -name "*.md" -exec sed -i 's|../../CLAUDE.md|../../CLAUDE.md|g' {} +
```

## Success Metrics

| Metric | Current | Target Week 1 | Target Week 4 |
|--------|---------|---------------|---------------|
| Broken Links | 491 | <200 | <50 |
| Critical Missing Files | 4 | 0 | 0 |
| Template Placeholder Noise | ~200 | 0 (filtered) | 0 (filtered) |
| Documentation Coverage | 85/100 | 90/100 | 95/100 |

## Risk Assessment

**High Risk**:
- Creating documentation that becomes outdated
- Breaking existing workflows during path fixes

**Mitigation**:
- Create minimal viable documentation first
- Test all path changes with link validator
- Use git branches for major changes

**Low Risk**:
- Template placeholder filtering (no functional impact)
- Core file creation (expected by users)

## Resource Requirements

- **Time**: 4 weeks part-time focus
- **Skills**: Documentation writing, bash scripting, markdown
- **Tools**: Link validator, sed/find, git
- **Validation**: Automated link checking, manual review

## Next Actions

1. ✅ **Immediate**: Create LICENSE and CONTRIBUTING.md files
2. ⏳ **Today**: Update link validator to filter template placeholders
3. 📅 **This Week**: Fix top 20 critical path issues
4. 📅 **Next Week**: Create missing setup documentation

---

*This strategy addresses the 491 broken links systematically, prioritizing user impact and maintainability.*
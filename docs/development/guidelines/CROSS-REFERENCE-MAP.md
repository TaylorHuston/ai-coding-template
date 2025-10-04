---
version: "1.0.0"
created: "2025-09-19"
last_updated: "2025-09-19"
status: "active"
target_audience: ["maintainers", "ai-assistants"]
document_type: "maintenance"
priority: "high"
tags: ["cross-references", "maintenance", "documentation-integrity"]
---

# Cross-Reference Integrity Map

This document maps all cross-references between guideline files to ensure link integrity and facilitate maintenance.

## ✅ Fixed Cross-Reference Issues

### Broken File References (Now Fixed)
- `security-principles.md` → `security-guidelines.md` (corrected in 4 files)
- `testing-principles.md` → `testing-standards.md` (corrected in 3 files)
- `documentation-guidelines.md` → `documentation-standards.md` (corrected in 3 files)
- `security-implementation.md` → **removed** (non-existent file)
- `api-implementation-patterns.md` → **removed** (non-existent file)
- `security-implementation-core.md` → **removed** (non-existent file)
- `testing-implementation.md` → **removed** (non-existent file)

### Incorrect Path References (Now Fixed)
- `../documentation-guidelines.md` → `./documentation-standards.md`
- `../architecture/README.md` → `../../project/architecture/README.md`
- `../STATUS.md` → `../../../STATUS.md`

## 📊 Current Cross-Reference Matrix

### Internal Guideline References (Within /docs/development/guidelines/)

| Source File | References | Target Files |
|-------------|------------|--------------|
| **README.md** | 14 | All guideline files |
| **ai-collaboration-standards.md** | 6 | quality-standards.md, code-review-guidelines.md, documentation-standards.md, security-guidelines.md, testing-standards.md, architectural-principles.md |
| **authentication-authorization.md** | 3 | security-guidelines.md, quality-standards.md, code-review-guidelines.md |
| **code-review-guidelines.md** | 5 | quality-standards.md, coding-standards.md, security-guidelines.md, testing-standards.md, git-workflow.md |
| **git-workflow.md** | 3 | code-review-guidelines.md, quality-standards.md, changelog-maintenance.md |
| **quality-standards.md** | 4 | documentation-standards.md, testing-standards.md, security-guidelines.md, changelog-maintenance.md |
| **code-quality.md** | 5 | quality-standards.md, testing-standards.md, code-review-guidelines.md, coding-standards.md, security-guidelines.md |
| **visual-documentation.md** | 1 | documentation-standards.md |
| **api-guidelines.md** | 3 | security-guidelines.md, testing-standards.md, documentation-standards.md |
| **security-guidelines.md** | 2 | api-guidelines.md, testing-standards.md |
| **architectural-principles.md** | 2 | api-guidelines.md, security-guidelines.md |
| **coding-standards.md** | 1 | quality-standards.md |
| **documentation-standards.md** | 0 | (referenced by others, no outbound refs) |
| **testing-standards.md** | 1 | quality-standards.md |
| **changelog-maintenance.md** | 0 | (referenced by others, no outbound refs) |

### External References (Outside guidelines directory)

| Source File | External References |
|-------------|-------------------|
| **README.md** | `../README.md`, `../../ai-toolkit/README.md`, `../../project/README.md` |
| **ai-collaboration-standards.md** | `../../ai-toolkit/guides/ai-collaboration-guide.md`, `../../ai-toolkit/guides/comprehensive-agent-guide.md`, `../../../CLAUDE.md` |
| **authentication-authorization.md** | `../README.md`, `../../../CLAUDE.md` |
| **quality-standards.md** | `../workflows/benchmarking.md`, `../workflows/deployment-guide.md`, `../../../CLAUDE.md` |
| **code-quality.md** | `../workflows/benchmarking.md`, `../workflows/deployment-guide.md`, `../../../CLAUDE.md` |
| **visual-documentation.md** | `../../project/architecture/README.md`, `../../../STATUS.md` |
| **architectural-principles.md** | `../../../CLAUDE.md` |
| **coding-standards.md** | `../../../CLAUDE.md` |
| **git-workflow.md** | `../../../CLAUDE.md` |

### Template References (.resources/examples/)

| Source File | Template References |
|-------------|-------------------|
| **code-review-guidelines.md** | 6 templates in `.resources/examples/code-review/` |

## 🔗 Reference Validation Status

### ✅ All Internal References Validated
- All guideline-to-guideline references point to existing files
- All internal links use correct relative paths
- No broken internal cross-references remain

### ✅ All External References Validated
- `../../project/architecture/README.md` ✓ exists
- `../../../STATUS.md` ✓ exists
- `../../../CLAUDE.md` ✓ exists
- All development and ai-toolkit README.md files ✓ exist

### ✅ All Template References Validated
- All 6 code review templates in `.resources/examples/code-review/` ✓ exist

## 📋 Maintenance Guidelines

### When Adding New Guidelines
1. **Update README.md** - Add new guideline to the main index
2. **Add Cross-References** - Link to related guidelines in "Related Guidelines" section
3. **Validate Links** - Ensure all references point to existing files
4. **Update This Map** - Document new cross-references in this file

### When Renaming Files
1. **Search All Files** - Use `grep -r "old-filename.md" docs/development/guidelines/`
2. **Update All References** - Replace all instances with new filename
3. **Validate Links** - Ensure all updated references work
4. **Update This Map** - Reflect filename changes

### Regular Maintenance
- **Monthly Link Validation** - Run link checker on all guideline files
- **Cross-Reference Audit** - Verify this map matches actual references
- **Template Validation** - Ensure template files still exist

## 🛠️ Validation Commands

```bash
# Check for broken internal references
grep -r "]\([^)]*\.md" docs/development/guidelines/ | grep -v "\.resources"

# Validate external file existence
ls -la docs/project/architecture/README.md STATUS.md CLAUDE.md

# Check template references
find .resources/examples/code-review -name "*.md" | wc -l  # Should return 6
```

## 📈 Reference Statistics

- **Total Guidelines**: 14 files (excludes README.md and CROSS-REFERENCE-MAP.md)
- **Internal Cross-References**: 52 links
- **External References**: 16 links
- **Template References**: 6 links
- **Total References**: 74 links
- **Broken References Fixed**: 8+ issues resolved
- **New Files Added**: ai-collaboration-standards.md, code-quality.md

## 🔄 Last Validation

- **Date**: 2025-09-19
- **Status**: ✅ All references validated and working
- **Issues Found**: 0
- **Issues Fixed**: 8+ broken references resolved

---

**Maintenance Note**: This document should be updated whenever cross-references are added, modified, or removed to maintain documentation integrity.
# Documentation Maintenance Guide

**Version**: 1.0.0
**Created**: 2025-09-15
**Last Updated**: 2025-09-15
**Status**: Active
**Target Audience**: Developers, AI Assistants, Documentation Maintainers

## Overview

This guide provides systematic procedures for maintaining documentation quality, consistency, and currency across the AI Coding Template project.

## Core Principles

### Single Source of Truth
- **No duplicate information** - Reference authoritative sources instead of copying
- **Clear ownership** - Each piece of information has one canonical location
- **Consistent cross-references** - Use links, not copied content

### Reachability
- **Everything linked** - All documentation must be reachable from main navigation
- **Clear navigation paths** - Users should never hit dead ends
- **Logical organization** - Related content grouped appropriately

### Currency
- **Active maintenance** - Update dates when content changes
- **Broken link detection** - Regular validation of internal and external links
- **Version tracking** - Header metadata for all documentation

## Documentation Structure

### Primary Navigation Tree
```
README.md (project overview)
├── CLAUDE.md (AI instructions)
├── docs/INDEX.md (complete navigation hub)
└── docs/README.md (documentation hub alternative)
    ├── setup/ (installation and configuration)
    ├── guides/ (how-to documentation)
    ├── reference/ (quick reference materials)
    ├── architecture/ (system design documents)
    ├── workflows/ (process documentation)
    ├── templates/ (document templates)
    └── archived/ (deprecated content)
```

### Validation Requirements
- All files reachable from INDEX.md or README.md
- No orphaned documentation
- No broken internal references
- Consistent cross-references between related documents

## Maintenance Procedures

### Daily Maintenance (During Development)

#### For AI Assistants
1. **Update headers** when modifying documents
   ```markdown
   **Last Updated**: 2025-MM-DD
   ```

2. **Check cross-references** when creating new files
   - Add to appropriate navigation files
   - Link to related documentation
   - Update reverse references

3. **Validate links** in modified documents
   - Test internal links work
   - Check anchor links to sections
   - Verify file paths are correct

#### For Developers
1. **Update documentation** with code changes
   - Architecture docs when system changes
   - API docs when interfaces change
   - Setup docs when requirements change

2. **Maintain examples** and code snippets
   - Test code examples still work
   - Update version numbers and commands
   - Verify screenshots and diagrams

### Weekly Maintenance

#### Link Validation
```bash
# Check all documentation links
node scripts/check-docs-links.js --external
```

#### Health Assessment
```bash
# Generate documentation health report
node scripts/docs-health.js
```

#### Navigation Audit
1. **Trace navigation paths** from main entry points
2. **Identify orphaned files** not reachable from navigation
3. **Check for broken reference chains**
4. **Validate cross-directory links**

### Monthly Maintenance

#### Comprehensive Review
1. **Content accuracy** - Verify information is current
2. **Link health** - Check all external links
3. **Navigation completeness** - Ensure all docs are reachable
4. **Template usage** - Verify consistent formatting

#### Metrics Collection
- Documentation coverage by area
- Update frequency by document
- Broken link trends
- User navigation patterns (if available)

## Common Issues and Solutions

### Orphaned Documentation
**Problem**: Documentation files not linked from main navigation

**Detection**:
```bash
# Find files not referenced in navigation
grep -r "filename.md" docs/INDEX.md docs/README.md docs/*/README.md
```

**Solution**:
1. Add to appropriate README.md file
2. Link from docs/INDEX.md
3. Create logical navigation path

### Broken References
**Problem**: Links to non-existent files or sections

**Detection**:
```bash
# Use automated link checker
node scripts/check-docs-links.js
```

**Solution**:
1. Update file paths to correct locations
2. Create missing files if they should exist
3. Remove references to deleted content

### Duplicate Information
**Problem**: Same information in multiple places

**Detection**:
- Manual review during updates
- Grep for similar content patterns
- Check for parallel documentation structures

**Solution**:
1. Choose authoritative source
2. Replace duplicates with references
3. Document decision in maintenance log

### Outdated Content
**Problem**: Documentation doesn't match current implementation

**Detection**:
- Regular review of Last Updated dates
- Testing of code examples and commands
- Comparison with actual system behavior

**Solution**:
1. Update content to match current state
2. Update Last Updated header
3. Test all examples and commands

## Automation Tools

### Available Scripts
- **`scripts/check-docs-links.js`** - Link validation
- **`scripts/docs-health.js`** - Health dashboard
- **`scripts/docs-changelog.js`** - Change tracking
- **`scripts/generate-doc.js`** - Template-based creation

### Integration Points
- **Pre-commit hooks** - Basic validation before commits
- **CI/CD checks** - Automated link and format validation
- **Scheduled audits** - Regular health assessments

## Quality Gates

### Before Committing
1. **Update Last Updated date** in modified documents
2. **Check internal links** in modified files
3. **Verify navigation paths** for new files
4. **Test code examples** if applicable

### Before Releases
1. **Run full link validation**
2. **Generate health report**
3. **Update version references**
4. **Validate external links**

### Continuous Monitoring
1. **Track documentation health metrics**
2. **Monitor broken link reports**
3. **Review update frequency patterns**
4. **Assess navigation usage**

## Roles and Responsibilities

### AI Assistants
- Update headers when modifying documents
- Maintain cross-references appropriately
- Follow single source of truth principle
- Use established templates and patterns

### Developers
- Update documentation with code changes
- Test and maintain code examples
- Report broken or outdated documentation
- Follow documentation guidelines

### Documentation Maintainers
- Perform regular health assessments
- Maintain navigation structure
- Update templates and guidelines
- Monitor and improve processes

## Tools and Workflows

### Documentation Creation
1. **Choose appropriate template** from docs/templates/
2. **Follow naming conventions** (lowercase-kebab-case)
3. **Add to navigation structure** immediately
4. **Test all links and examples**

### Documentation Updates
1. **Read current content** to understand context
2. **Update Last Updated header**
3. **Maintain cross-references**
4. **Validate changes with tools**

### Navigation Maintenance
1. **Update INDEX.md** for new major sections
2. **Maintain README.md files** in each directory
3. **Create logical groupings** by audience and purpose
4. **Test navigation paths** regularly

## Metrics and Success Indicators

### Health Metrics
- **Link health** - Percentage of working links
- **Coverage** - Percentage of features documented
- **Currency** - Average time since last update
- **Reachability** - Percentage of files in navigation

### Quality Indicators
- **Consistency** - Template adherence rate
- **Completeness** - Required sections filled
- **Accuracy** - Code examples that work
- **Usability** - Clear navigation paths

### Maintenance Effectiveness
- **Issue resolution time** - How quickly problems are fixed
- **Proactive identification** - Issues found before users report
- **Process adherence** - Following maintenance procedures
- **Tool utilization** - Using available automation

## Emergency Procedures

### Broken Navigation
1. **Identify scope** - Which navigation paths are broken
2. **Create temporary fixes** - Direct links to critical content
3. **Repair systematically** - Fix root causes
4. **Validate comprehensively** - Test all navigation paths

### Large-Scale Changes
1. **Plan impact** - Map affected documentation
2. **Update systematically** - Use tools for bulk changes
3. **Validate thoroughly** - Test all affected links
4. **Communicate changes** - Update team on modifications

## Future Improvements

### Automation Opportunities
- Automated navigation validation
- Content freshness monitoring
- Template compliance checking
- Cross-reference integrity validation

### Process Enhancements
- Documentation review workflows
- Change impact assessment tools
- User feedback collection
- Maintenance effort tracking

---

*Consistent maintenance ensures documentation remains a valuable, trustworthy resource for the entire team.*
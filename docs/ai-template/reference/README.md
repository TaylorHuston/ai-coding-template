---
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "reference"
tags: ["reference", "quick-guide", "workflow"]
---

# Quick Reference Guides

Collection of quick reference guides for common development tasks and workflows.

## Available Guides

### 📖 [AI Assistant Instructions](../../CLAUDE.md)
Essential instructions for AI assistants working with this repository.
- Core operating principles
- Critical rules and approval matrix
- Context management protocol
- Session initialization and completion
- Integration with 17-agent framework

### 📖 [AI Assistant Guide](./ai-assistant-guide.md)
Quick reference for AI assistants working with this repository.
- First session checklist
- Common workflows
- File conventions
- Issue tracking integration
- Context management strategies

### ⚡ [Development Commands](./development-commands.md)
Essential commands for common development tasks.
- Documentation tools
- Git workflow commands
- Testing and build commands
- Environment management
- Debugging utilities

### 🔧 [Troubleshooting Guide](./troubleshooting.md)
Comprehensive troubleshooting guide for AI template and development issues.
- AI template-specific issues and solutions
- Systematic debugging procedures
- Application, network, and database problems
- Emergency recovery procedures

### 🎤 [Commands Reference](./commands.md)
Complete slash commands reference for AI-powered workflows.
- Development and implementation commands
- Quality and security assessment
- Planning and architecture tools
- Project management workflows

### 🔧 [Tool Selection Guide](./tool-selection.md)
Guide for selecting the right tools for different development tasks.
- File operations patterns
- Search and discovery strategies
- Performance considerations
- Best practices and anti-patterns

## Quick Access

### For AI Assistants
**Start here**: [AI Assistant Instructions](../../CLAUDE.md)
1. Follow first session checklist
2. Reference common workflows
3. Check file conventions
4. Understand context management

### For Developers
**Most Common**: [Development Commands](./development-commands.md)
- Documentation health: `node scripts/docs-health.js`
- Generate docs: `node scripts/generate-doc.js`
- Git workflow with AI attribution and [AI Branching Strategy](../guides/ai-collaboration-guide.md#ai-branching-strategy)

### For Troubleshooting
**When Things Break**: [Troubleshooting Guide](./troubleshooting.md)
1. 5-minute quick checks
2. Systematic investigation
3. Issue-specific troubleshooting trees
4. Emergency recovery procedures

## Integration with Project Structure

### Documentation System
These guides integrate with:
- **docs/documentation-guidelines.md**: Writing standards
- **docs/guides/project-guidelines/visual-documentation.md**: Visual documentation patterns
- **docs/templates/**: Documentation templates

### Deliverables System
Related to deliverables and issue management:
- **deliverables/README.md**: Deliverables and issue management
- **deliverables/template-deliverable/**: Deliverable and issue templates
- **STATUS.md**: Project status with visual progress tracking

### Automation Scripts
Referenced commands:
- **scripts/docs-health.js**: Documentation health dashboard
- **scripts/generate-doc.js**: Template-based doc generation
- **scripts/check-docs-links.js**: Link validation
- **scripts/docs-changelog.js**: Documentation change tracking

## Usage Patterns

### Daily Development
1. Check **STATUS.md** for current priorities
2. Use **development-commands.md** for common tasks
3. Follow **ai-assistant-guide.md** workflows
4. Update documentation following standards

### Issue Resolution
1. Create issue directory under appropriate deliverable
2. Use **troubleshooting.md** for systematic investigation
3. Document findings in decision log
4. Update status with resolution

### New Team Members
1. Read **ai-assistant-guide.md** for project patterns
2. Bookmark **development-commands.md** for daily tasks
3. Familiarize with **troubleshooting.md**
4. Review documentation standards and templates

## Maintenance

### Keeping Guides Current
- Update commands when tooling changes
- Add new troubleshooting patterns as they emerge
- Expand AI assistant guide based on usage patterns
- Review and update examples quarterly

### Contributing
When adding new guides:
1. Follow documentation standards metadata format
2. Include clear target audience
3. Use consistent formatting and structure
4. Add entry to this README
5. Update related guides with cross-references

## Customization

### Project-Specific Adaptations
- Customize development commands for your tech stack
- Add project-specific troubleshooting patterns
- Update AI assistant guide with project conventions
- Include environment-specific procedures

### Template Usage
Use these guides as templates for:
- Team onboarding documentation
- Project-specific quick reference
- Technology-specific command collections
- Custom troubleshooting procedures

---

## Related Documentation

- [AI Collaboration Guide](../guides/ai-collaboration-guide.md)
- [Documentation Guidelines](../../development/guidelines/documentation-guidelines.md)
- [Visual Guide](../../development/guidelines/visual-documentation.md) 
- [Deliverables System](../../deliverables/README.md)
- [Project Status](../../STATUS.md)
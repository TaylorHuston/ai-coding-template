---
version: "0.1.0"
created: "2025-09-15"
status: "active"
target_audience: ["developers", "team-leads", "project-managers"]
document_type: "reference"
priority: "high"
tags: ["development", "processes", "guidelines"]
---

# Development Documentation

**Team processes, guidelines, and standards that apply to any development project.**

This directory contains documentation about how your development team works together, regardless of the specific project. These are the processes, standards, and guidelines that help maintain code quality and team coordination.

## Directory Structure

### `/guidelines/`
**Code quality, documentation, and project standards**
- **quality-standards.md** - Comprehensive quality requirements and validation protocols
- **documentation-standards.md** - Documentation writing and maintenance standards
- **documentation-maintenance.md** - Processes for keeping documentation current
- **changelog-maintenance.md** - Changelog management and release documentation
- **visual-documentation.md** - Guidelines for diagrams, screenshots, and visual content

### `/workflows/`
**Development processes and methodologies**
- **README.md** - Overview of development workflows
- **deployment-guide.md** - Comprehensive deployment patterns, strategies, and procedures
- **tdd-strategy.md** - Test-driven development approach
- **benchmarking.md** - Performance testing and benchmarking processes

### `/setup/`
**Development environment configuration**
- **environment-setup.md** - Local development environment setup

### `/templates/`
**Document templates for consistency**
- **standard/** - Standard document templates
- **simple/** - Simplified templates for quick documentation
- **api.template.md** - API documentation template
- **yaml-frontmatter-schema.md** - YAML frontmatter standards

## How to Use This Documentation

### For New Team Members
1. Start with `/guidelines/quality-standards.md` to understand quality expectations
2. Review `/workflows/README.md` for development processes
3. Follow `/setup/environment-setup.md` for local setup
4. Use templates in `/templates/` for consistent documentation

### For Team Leads
- Use guidelines to establish team standards
- Reference workflows for process consistency
- Update templates as team practices evolve
- Maintain documentation currency using maintenance guides

### For AI Assistants
- Reference quality standards for all code generation
- Follow workflow patterns for development tasks
- Use templates for consistent documentation creation
- Apply guidelines for code review and validation

## Key Principles

### Quality First
- All code must meet standards in `guidelines/quality-standards.md`
- Documentation must follow `guidelines/documentation-standards.md`
- Testing follows `workflows/tdd-strategy.md`

### Consistency
- Use templates in `/templates/` for new documentation
- Follow established patterns in workflows
- Maintain consistent naming and organization

### Continuous Improvement
- Regularly review and update processes
- Gather feedback on workflow effectiveness
- Update guidelines based on lessons learned

## Integration with Project Work

This development documentation works alongside:
- **Project Documentation** (`../project/`) - Your specific project's architecture, API, and decisions
- **AI Template Documentation** (`../ai-template/`) - AI assistant and template-specific guidance

When starting a new feature or fixing a bug:
1. Reference these development guidelines for process
2. Update project documentation with specific decisions
3. Use AI template documentation for assistant guidance

---

**Related Documentation**: [Project Documentation](../project/README.md) | [AI Template Documentation](../ai-template/README.md) | [Root Documentation](../README.md)
---
version: "0.1.0"
created: "2025-09-17"
status: "active"
target_audience: ["developers", "product-managers", "ai-assistants"]
document_type: "guide"
tags: ["templates", "features", "workflow"]
---

# Feature Templates Guide

**Purpose**: Consolidated feature context templates for the `/feature` command workflow phase.

## Template Levels

### 📝 Minimal Template (`feature-minimal.template.md`)
**Lines**: ~25
**Use when**:
- Solo development or small teams
- Simple features with clear requirements
- Rapid prototyping or MVP development
- Internal tools or proof-of-concepts

**Contains**:
- Basic feature information
- Problem statement
- Functional requirements
- High-level technical approach
- Dependencies

### 📋 Standard Template (`feature-standard.template.md`)
**Lines**: ~75
**Use when**:
- Team development (2-5 developers)
- Standard feature development
- Features requiring stakeholder alignment
- Cross-team coordination needed

**Contains everything from Minimal plus**:
- User experience details
- Success metrics
- Implementation notes
- Acceptance criteria
- External references

### 📊 Comprehensive Template (`feature-comprehensive.template.md`)
**Lines**: ~200+
**Use when**:
- Enterprise environments
- Complex features with multiple integrations
- Compliance or regulatory requirements
- High-stakes or customer-facing features
- Large team coordination (5+ developers)

**Contains everything from Standard plus**:
- Executive summary and business context
- Visual progress tracking
- Detailed architecture diagrams
- Risk assessment and mitigation
- Comprehensive testing strategy
- Monitoring and maintenance plans
- Stakeholder approval tracking

## Decision Matrix

| Project Size | Team Size | Complexity | Compliance | Recommended Template |
|--------------|-----------|------------|------------|---------------------|
| Small | 1-2 | Low | No | **Minimal** |
| Medium | 2-5 | Medium | No | **Standard** |
| Large | 5+ | High | No | **Standard** or **Comprehensive** |
| Enterprise | Any | Any | Yes | **Comprehensive** |

## Usage Instructions

### With `/feature` Command
```bash
# Automatically selects appropriate template based on context
/feature --new "User Authentication"

# Explicitly specify template level
/feature --new "User Authentication" --template minimal
/feature --new "Payment Processing" --template standard
/feature --new "Enterprise SSO" --template comprehensive
```

### Manual Usage
1. Copy the appropriate template file
2. Replace all `{{PLACEHOLDER}}` variables
3. Remove unused sections
4. Save in `docs/technical/features/[feature-name].md`

## Template Variables

### Common Variables (All Templates)
- `{{FEATURE_NAME}}` - Name of the feature
- `{{PURPOSE}}` - Why this feature exists
- `{{USER_BENEFIT}}` - What users gain
- `{{SUCCESS_CRITERIA}}` - How to measure success
- `{{EXTERNAL_REF}}` - Jira/Linear issue reference
- `{{PROBLEM_DESCRIPTION}}` - Problem being solved
- `{{TECHNICAL_APPROACH}}` - High-level solution
- `{{DEPENDENCIES}}` - What this feature depends on

### Standard Template Additional Variables
- `{{USER_EXPERIENCE_DESCRIPTION}}` - UX details
- `{{PERFORMANCE_METRICS}}` - Performance targets
- `{{IMPLEMENTATION_NOTES}}` - Development guidance
- `{{ACCEPTANCE_CRITERION_X}}` - Specific acceptance criteria

### Comprehensive Template Additional Variables
- `{{BUSINESS_CONTEXT}}` - Business justification
- `{{ARCHITECTURE_DIAGRAM}}` - Mermaid diagram code
- `{{PHASE_X_NAME}}` - Implementation phase names
- `{{RISK_X}}` - Risk assessment items
- `{{STAKEHOLDER_APPROVAL}}` - Approval tracking

## Integration with Workflow

### Relationship to Other Templates
- **Prerequisites**: Project vision document
- **Next Phase**: Architecture templates (`/architect` command)
- **Generates**: Input for planning templates (`/plan` command)
- **Completion**: Implementation record templates

### Cross-References
- Links to architecture documents (created by `/architect`)
- References decision records (ADRs)
- Connects to implementation records (after `/develop`)
- External system integration (Jira/Linear/etc.)

## Best Practices

### Template Selection
1. **Start smaller**: Begin with minimal, upgrade if needed
2. **Consider audience**: More stakeholders = more detail
3. **Match project phase**: Early exploration vs final specification
4. **Compliance matters**: Regulatory requirements mandate comprehensive

### Content Guidelines
1. **Be specific**: Avoid vague statements
2. **Include examples**: Concrete examples over abstract descriptions
3. **Link externally**: Reference Jira/Linear issues when available
4. **Keep current**: Update as understanding evolves

### Workflow Integration
1. **Feature first**: Always create feature context before architecture
2. **External sync**: Update external systems (Jira/Linear) with key changes
3. **Version control**: Track changes to feature requirements
4. **Handoff clarity**: Ensure clean handoff to `/architect` phase

## Migration from Old Templates

### Deprecated Templates
- `feature-simple-specification.template.md` → Use `feature-standard.template.md`
- `feature-comprehensive-specification.template.md` → Use `feature-comprehensive.template.md`
- `feature-specification-template.md` → Use `feature-standard.template.md`

### Migration Steps
1. Identify current template being used
2. Map content to new template structure
3. Update variable names to new format
4. Move to new location structure
5. Update documentation references

## Troubleshooting

### Common Issues
- **Too much detail**: Start with minimal template, upgrade if needed
- **Missing context**: Ensure project vision exists first
- **External sync**: Check Jira/Linear integration configuration
- **Template confusion**: Use decision matrix above for selection

### Getting Help
- See workflow documentation: `docs/ai-tools/guides/`
- Check command documentation: `.claude/commands/feature.md`
- Review examples: `examples/workflow/feature/`

---

**Related Documentation:**
- [Feature Command](../../../.claude/commands/feature.md) - Command usage details
- [Workflow Overview](../../../docs/ai-tools/guides/ai-collaboration-guide.md) - Complete workflow guide
- [Template System](../../README.md) - General template guidelines
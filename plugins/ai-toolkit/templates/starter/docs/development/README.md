# Development Guidelines

This directory is for **project-specific development guidelines** that override plugin defaults.

## How Guidelines Work

The AI Toolkit includes **comprehensive development guidelines** covering:

- **Architectural Principles** - DRY, KISS, YAGNI, SOLID
- **API Guidelines** - REST, GraphQL, versioning, documentation
- **Security Guidelines** - Authentication, authorization, threat modeling
- **Testing Standards** - TDD, BDD, coverage requirements
- **Code Quality** - Metrics, reviews, static analysis
- **Coding Standards** - Naming, formatting, best practices
- And 10 more...

**These guidelines live in the plugin** at:
```
${CLAUDE_PLUGIN_ROOT}/docs/guidelines/
```

## Why Plugin Defaults?

**Benefits**:
- ✅ **Always up-to-date**: Guidelines update with plugin
- ✅ **Consistent across projects**: Same standards everywhere
- ✅ **No duplication**: DRY principle for documentation
- ✅ **Well-maintained**: Community improvements benefit everyone

**AI agents automatically use plugin guidelines** when working on your project.

## Customizing Guidelines

Most projects use the plugin defaults. But when you need **project-specific variations**:

### Option 1: Copy and Customize

Copy a guideline from the plugin to your project:

```bash
# Copy the guideline you want to customize
cp ${CLAUDE_PLUGIN_ROOT}/docs/guidelines/api-guidelines.md docs/development/guidelines/

# Edit for your project
# AI agents will now use your version instead of plugin default
```

### Option 2: Create Project-Specific Guidelines

Create new guidelines specific to your project:

```bash
# Create a new guideline
docs/development/guidelines/internal-api-standards.md
```

### Option 3: Extend Plugin Guidelines

Reference plugin defaults and add project-specific rules:

```markdown
# API Guidelines

See plugin guidelines for standard API design: ${CLAUDE_PLUGIN_ROOT}/docs/guidelines/api-guidelines.md

## Project-Specific API Rules

1. All internal APIs must use gRPC
2. Public APIs use REST with JSON:API format
3. ... your specific rules ...
```

## Guideline Precedence

When AI agents load guidelines:

1. **Check project first**: `docs/development/guidelines/{guideline}.md`
2. **Fall back to plugin**: `${CLAUDE_PLUGIN_ROOT}/docs/guidelines/{guideline}.md`
3. **Use whichever exists**

Project guidelines always override plugin defaults.

## Available Plugin Guidelines

The plugin includes these guidelines (check plugin docs for complete list):

**Foundation**:
- architectural-principles.md
- quality-standards.md
- code-quality.md

**Development**:
- coding-standards.md
- testing-standards.md
- code-review-guidelines.md

**Domain-Specific**:
- api-guidelines.md
- security-guidelines.md
- authentication-authorization.md

**Process**:
- git-workflow.md
- documentation-standards.md
- changelog-maintenance.md

**AI Collaboration**:
- ai-collaboration-standards.md
- visual-documentation.md

## When to Customize

**Use plugin defaults** (90% of projects):
- Following industry standards
- Standard tech stack
- No special compliance requirements

**Customize guidelines** (10% of projects):
- Unique compliance requirements (HIPAA, PCI-DSS, etc.)
- Non-standard architecture patterns
- Legacy system integration constraints
- Company-specific coding standards

## Examples

**Example: Customized Security for Healthcare**
```bash
# Copy security guideline
cp ${CLAUDE_PLUGIN_ROOT}/docs/guidelines/security-guidelines.md docs/development/guidelines/

# Add HIPAA-specific requirements
# Add encryption requirements
# Add audit logging standards
```

**Example: Project-Specific API Standards**
```markdown
# docs/development/guidelines/api-guidelines.md

# API Guidelines

## Standard Guidelines
See ${CLAUDE_PLUGIN_ROOT}/docs/guidelines/api-guidelines.md for base API design principles.

## Project-Specific Extensions

### Internal APIs
- Use gRPC with Protocol Buffers
- Service mesh: Istio for all internal communication

### Public APIs
- REST with JSON:API specification
- Rate limiting: 1000 req/hour for free tier
- Authentication: OAuth 2.0 + API keys
```

## Best Practices

1. **Start with defaults** - Don't customize until you need to
2. **Document why** - Add comments explaining project-specific rules
3. **Reference plugin** - Link to plugin guidelines you're extending
4. **Keep in sync** - When plugin updates, review your customizations
5. **Minimize duplication** - Only override what's different

## Getting Help

**View plugin guidelines**:
- Check your Claude Code plugin installation
- Or browse: `plugins/ai-toolkit/docs/guidelines/`

**Questions about customization**:
- See plugin documentation
- Check examples in `plugins/ai-toolkit/docs/examples/`

Most projects never need to customize guidelines. The plugin defaults are comprehensive and battle-tested! 🛡️

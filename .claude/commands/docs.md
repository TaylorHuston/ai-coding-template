---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "documentation", "management", "automation"]
description: "Unified documentation management with intelligent agent coordination"
argument-hint: "[generate|validate|sync|health|auto] [--type TYPE] [--scope SCOPE]"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: "claude-sonnet-4"
---

# /docs Command

Unified documentation management that orchestrates documentation agents and scripts intelligently.

## Usage

```bash
# Generate all automatic documentation
/docs generate --type all

# Generate specific documentation types
/docs generate --type tech-stack
/docs generate --type system-overview
/docs generate --type dependencies

# Validate documentation health and links
/docs validate

# Auto-sync documentation with code changes
/docs sync

# Comprehensive documentation health check
/docs health

# Update and validate all documentation accuracy
/docs update

# Interactive documentation generation
/docs auto
```

## Commands

### `generate` - Generate Documentation

Orchestrates the technical-writer agent with auto-docs-generator.js to create comprehensive documentation.

**Options:**
- `--type all` - Generate all documentation types
- `--type tech-stack` - Technology stack documentation
- `--type system-overview` - System architecture overview
- `--type dependencies` - Dependency graph documentation
- `--type decisions` - Compile technical decision records

**Agent Integration:**
- Uses **technical-writer** for content creation and structuring
- Automatically invokes `auto-docs-generator.js` for codebase analysis
- Uses **technical-writer** for consistency validation

### `validate` - Validate Documentation

Comprehensive validation of documentation quality, links, and structure.

**Features:**
- Link validation (internal and external)
- Documentation structure verification
- Freshness analysis using Git history
- TODO/FIXME item tracking

**Agent Integration:**
- Uses **technical-writer** for validation coordination
- Automatically invokes `check-docs-links.js` and `docs-health.js`
- Generates actionable improvement recommendations

### `sync` - Synchronize Documentation

Automatically updates documentation to reflect code changes and maintains consistency.

**Features:**
- Detects code changes requiring documentation updates
- Updates API documentation based on code analysis
- Maintains cross-reference integrity
- Validates documentation-code alignment

**Agent Integration:**
- Uses **technical-writer** as primary coordinator
- Involves domain specialists (frontend-specialist, backend-specialist) for technical accuracy
- Automatically updates architectural documentation

### `health` - Documentation Health Dashboard

Comprehensive health analysis with detailed reporting and maintenance recommendations.

**Features:**
- Documentation coverage analysis
- Quality metrics and scoring
- Maintenance recommendations
- Visual health dashboard

**Agent Integration:**
- Uses **technical-writer** for health analysis coordination
- Automatically invokes `docs-health.js` for metrics

### `update` - Comprehensive Documentation Accuracy Validation and Updates

Performs comprehensive documentation accuracy validation and updates across the entire project documentation.

**Features:**
- Reviews documentation guidelines and standards
- Systematically traverses entire documentation tree
- Identifies outdated information, broken links, inconsistent formatting
- Updates documentation to reflect current project state
- Validates cross-references, dates, version numbers, and content accuracy
- Ensures bidirectional sync between code changes and documentation
- Generates summary report of all changes made

**Process:**
- Reviews docs/development/guidelines/documentation-guidelines.md
- Analyzes .claude/references/ structure files for complete understanding
- Traverses all documentation directories: docs/, .claude/, .resources/, project root
- Validates all cross-references and links for accuracy
- Updates any outdated information discovered during traversal
- Maintains documentation standards and formatting consistency

**Agent Integration:**
- Uses **technical-writer** as primary coordinator for comprehensive analysis
- Automatic adherence to documentation-guidelines.md standards
- Systematic coverage of all project documentation areas
- Generates detailed markdown reports

### `auto` - Interactive Documentation Assistant

Interactive mode for documentation creation, maintenance, and improvement.

**Features:**
- Guided documentation creation workflow
- Smart template suggestions based on project analysis
- Interactive validation and improvement suggestions
- Context-aware documentation recommendations

**Agent Integration:**
- Uses **technical-writer** for content creation guidance
- Uses **context-analyzer** for project analysis
- Provides intelligent recommendations based on codebase patterns

## Integration with Scripts

This command intelligently orchestrates existing documentation scripts:

```yaml
script_integration:
  generate:
    primary_script: auto-docs-generator.js
    supporting_scripts: [docs-manager.sh]

  validate:
    primary_script: check-docs-links.js
    supporting_scripts: [docs-health.js, docs-manager.sh validate]

  sync:
    primary_script: docs-manager.sh
    supporting_scripts: [check-docs-links.js]

  health:
    primary_script: docs-health.js
    supporting_scripts: [docs-manager.sh health]
```

## Examples

### Generate All Documentation
```bash
/docs generate --type all
# → technical-writer coordinates complete documentation generation
# → auto-docs-generator.js analyzes codebase
# → Creates tech-stack.md, system-overview.md, dependency-graph.md
```

### Validate Before Commit
```bash
/docs validate
# → technical-writer validates all documentation
# → check-docs-links.js verifies link integrity
# → docs-health.js provides quality metrics
```

### Interactive Documentation Creation
```bash
/docs auto
# → technical-writer guides through documentation creation
# → context-analyzer provides project insights
# → Generates appropriate templates and structure
```

## Agent Coordination

The `/docs` command uses intelligent agent coordination:

1. **Primary Agent Selection**: Based on action type (technical-writer for creation, technical-writer for maintenance)
2. **Script Orchestration**: Agents invoke appropriate scripts automatically
3. **Context Preservation**: All results are captured in workflow context files
4. **Quality Gates**: Automatic validation ensures documentation quality

## Benefits Over Manual Scripts

✅ **Intelligent Coordination**: Agents understand context and make smart decisions
✅ **Integrated Workflow**: Works seamlessly with /design → /architect → /plan → /develop
✅ **Quality Assurance**: Built-in validation and quality checks
✅ **Context Awareness**: Understands project structure and requirements
✅ **Unified Interface**: Single command for all documentation needs
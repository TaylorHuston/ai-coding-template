---
version: "1.0.0"
created: "2025-09-23"
last_updated: "2025-09-23"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["documentation", "generation", "technical-writer"]
description: "Generate comprehensive project documentation with intelligent content creation"
argument-hint: "[\"natural language instruction\"]"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
---

# /docs-generate Command

**Purpose**: Generate comprehensive project documentation with intelligent content creation and technical-writer agent coordination.

## Usage

```bash
/docs-generate "create all automatic documentation"
/docs-generate "generate API documentation for the auth system"
/docs-generate "create technical architecture overview"
/docs-generate "generate dependency documentation"
/docs-generate "create system overview and tech stack docs"
```

## Arguments

| Variable | Type | Description |
|----------|------|-------------|
| `$ARGUMENTS` | string | Natural language instruction describing what documentation to generate |

## Prerequisites

- [ ] Project structure and codebase available for analysis
- [ ] Documentation guidelines in place
- [ ] Technical requirements understood
- [ ] Target audience identified

## Agent Coordination

**Primary**: technical-writer _(content creation and structuring)_
**Supporting**: context-analyzer _(project analysis)_, domain specialists _(technical accuracy)_

## Context

- Project codebase for analysis and documentation extraction
- Documentation guidelines from `docs/development/guidelines/`
- Existing documentation structure and patterns
- Technical architecture and design decisions
- Auto-generation scripts: `auto-docs-generator.js`

## Instructions

1. **Parse natural language instruction**
   - Identify documentation type and scope
   - Understand target audience and format requirements
   - Determine generation strategy

2. **Analyze project context**
   - Use context-analyzer for comprehensive project understanding
   - Identify relevant code sections and architectural patterns
   - Gather technical specifications and dependencies

3. **Coordinate with technical-writer**
   - Generate appropriate documentation structure
   - Create comprehensive content following guidelines
   - Ensure consistency with existing documentation

4. **Execute auto-generation scripts**
   - Invoke `auto-docs-generator.js` for codebase analysis
   - Generate technical documentation automatically
   - Integrate script outputs with manual content

5. **Validate and finalize**
   - Review generated content for accuracy and completeness
   - Ensure adherence to documentation standards
   - Create appropriate file structure and cross-references

## Output

**Generated Documentation**: Complete documentation files in appropriate locations
**Content Analysis**: Technical content extracted from codebase
**Structure Validation**: Proper documentation hierarchy and organization
**Quality Report**: Summary of generated content and coverage

**File Locations**:
- Generated docs: `docs/project/`, `docs/development/`, relevant directories
- Analysis reports: Generated as part of documentation process

**Related**: `/design` → `/architect` → **`/docs-generate`** → `/docs-validate`

### Usage Examples

**Natural Language Documentation Generation**:
- `/docs-generate "create complete API documentation"` → Generates comprehensive API docs with examples
- `/docs-generate "generate technical architecture overview"` → Creates system architecture documentation
- `/docs-generate "create all automatic documentation"` → Full auto-generation using scripts
- `/docs-generate "generate user guides for authentication"` → User-facing documentation
- `/docs-generate "create dependency and tech stack documentation"` → Technical infrastructure docs

**Key Features**:
- **Natural language** parsing for flexible documentation requests
- **Intelligent coordination** with technical-writer agent
- **Auto-generation** integration with existing scripts
- **Context awareness** for accurate technical content
- **Quality validation** ensuring documentation standards
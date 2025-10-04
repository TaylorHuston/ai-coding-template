---
version: "1.0.0"
created: "2025-09-23"
last_updated: "2025-09-23"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["documentation", "validation", "quality", "links"]
description: "Validate documentation health, links, and quality with comprehensive reporting"
argument-hint: "[\"natural language instruction\"]"
allowed-tools: ["Read", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
---

# /docs-validate Command

**Purpose**: Validate documentation health, links, and quality with comprehensive reporting and actionable recommendations.

## Usage

```bash
/docs-validate "check all documentation links and structure"
/docs-validate "validate API documentation accuracy"
/docs-validate "check for broken links and outdated content"
/docs-validate "comprehensive documentation health check"
/docs-validate "validate before commit"
```

## Arguments

| Variable | Type | Description |
|----------|------|-------------|
| `$ARGUMENTS` | string | Natural language instruction describing validation scope and focus |

## Prerequisites

- [ ] Documentation files present in project
- [ ] Validation scripts available (`check-docs-links.js`, `docs-health.js`)
- [ ] Project structure accessible for analysis
- [ ] Git history available for freshness analysis

## Agent Coordination

**Primary**: technical-writer _(validation coordination)_
**Supporting**: code-reviewer _(quality assessment)_, context-analyzer _(structural analysis)_

## Context

- All documentation files across project (`docs/`, `.claude/`, `.resources/`)
- Validation scripts: `check-docs-links.js`, `docs-health.js`
- Documentation guidelines and standards
- Git history for freshness analysis
- Cross-reference mappings and link structures

## Instructions

1. **Parse validation instruction**
   - Identify validation scope (all docs, specific areas, links only)
   - Understand quality criteria and focus areas
   - Determine validation depth and reporting needs

2. **Execute validation scripts**
   - Run `check-docs-links.js` for link validation
   - Execute `docs-health.js` for quality metrics
   - Analyze documentation structure and consistency

3. **Coordinate with technical-writer**
   - Perform comprehensive quality assessment
   - Validate content accuracy and freshness
   - Check adherence to documentation guidelines

4. **Analyze findings**
   - Categorize issues by severity and type
   - Identify broken links, outdated content, structural problems
   - Generate actionable improvement recommendations

5. **Generate validation report**
   - Create comprehensive findings summary
   - Prioritize issues by impact and effort
   - Provide specific fix recommendations

## Output

**Validation Report**: Comprehensive analysis of documentation health
**Link Status**: Complete inventory of working and broken links
**Quality Metrics**: Documentation coverage, freshness, and consistency scores
**Action Items**: Prioritized list of improvements needed

**File Locations**:
- Validation reports: Generated in current directory or specified location
- Link analysis: Detailed link status and recommendations

**Related**: `/docs-generate` → **`/docs-validate`** → `/docs-sync`

### Usage Examples

**Natural Language Validation Instructions**:
- `/docs-validate "check all links before release"` → Comprehensive link validation with blocking issues
- `/docs-validate "validate API documentation accuracy"` → Focus on technical accuracy of API docs
- `/docs-validate "quick health check for commit"` → Fast validation for pre-commit workflow
- `/docs-validate "comprehensive documentation audit"` → Full quality assessment with recommendations
- `/docs-validate "check for outdated content and broken references"` → Content freshness and integrity focus

**Key Features**:
- **Natural language** parsing for flexible validation scope
- **Comprehensive checking** including links, structure, and content
- **Quality metrics** with actionable insights
- **Pre-commit integration** for workflow validation
- **Detailed reporting** with prioritized recommendations
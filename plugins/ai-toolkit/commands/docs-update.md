---
version: "1.0.0"
created: "2025-09-23"
last_updated: "2025-09-23"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["documentation", "maintenance", "accuracy", "comprehensive"]
description: "Comprehensive documentation accuracy validation and maintenance across entire project"
argument-hint: "[\"natural language instruction\"]"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
---

# /docs-update Command

**Purpose**: Perform comprehensive documentation accuracy validation and maintenance across the entire project documentation tree.

## Usage

```bash
/docs-update "comprehensive accuracy review of all documentation"
/docs-update "update outdated information across project docs"
/docs-update "validate and fix all cross-references and links"
/docs-update "ensure documentation reflects current project state"
/docs-update "complete documentation maintenance and cleanup"
```

## Arguments

| Variable | Type | Description |
|----------|------|-------------|
| `$ARGUMENTS` | string | Natural language instruction describing update scope and maintenance focus |

## Prerequisites

- [ ] Complete project documentation tree accessible
- [ ] Documentation guidelines available
- [ ] Current project state understood
- [ ] Git history for change tracking

## Agent Coordination

**Primary**: technical-writer _(comprehensive maintenance coordination)_
**Supporting**: context-analyzer _(project analysis)_, code-reviewer _(accuracy validation)_

## Context

- Complete documentation tree: `docs/`, `.claude/`, `.claude/resources/`, project root
- Documentation guidelines from `docs/development/guidelines/documentation-guidelines.md`
- Project structure files from `.claude/references/`
- Current codebase state and recent changes
- Cross-reference mappings and link structures

## Instructions

1. **Parse maintenance instruction**
   - Identify update scope (comprehensive, specific areas, accuracy focus)
   - Understand maintenance priorities and constraints
   - Determine validation depth required

2. **Review documentation guidelines**
   - Load current documentation standards
   - Understand formatting and structural requirements
   - Identify quality criteria for validation

3. **Systematic documentation traversal**
   - Analyze entire documentation tree structure
   - Identify outdated information and broken links
   - Check cross-references, dates, version numbers

4. **Coordinate comprehensive updates**
   - Update outdated information to reflect current state
   - Fix broken links and invalid cross-references
   - Ensure formatting consistency and standard adherence

5. **Validate bidirectional sync**
   - Verify documentation reflects current code state
   - Ensure consistency between different documentation areas
   - Generate comprehensive change summary

## Output

**Updated Documentation**: Comprehensive maintenance across entire documentation tree
**Accuracy Report**: Detailed analysis of changes made and issues resolved
**Cross-Reference Validation**: Complete verification of all links and references
**Maintenance Summary**: Overview of improvements and remaining considerations

**File Locations**:
- Updated docs: Throughout project (`docs/`, `.claude/`, `.claude/resources/`, root)
- Change reports: Comprehensive summary of all maintenance performed

**Related**: `/docs-sync` → **`/docs-update`** → `/docs-validate`

### Usage Examples

**Natural Language Maintenance Instructions**:
- `/docs-update "complete accuracy review before release"` → Comprehensive pre-release documentation validation
- `/docs-update "fix all outdated references and broken links"` → Focus on link integrity and reference accuracy
- `/docs-update "ensure all documentation reflects current architecture"` → Architecture-focused accuracy update
- `/docs-update "comprehensive maintenance of entire documentation tree"` → Full-scope documentation maintenance
- `/docs-update "validate and update cross-references throughout project"` → Cross-reference integrity focus

**Key Features**:
- **Natural language** parsing for flexible maintenance scope
- **Comprehensive coverage** of entire documentation tree
- **Systematic validation** following documentation guidelines
- **Bidirectional sync** ensuring documentation-code alignment
- **Detailed reporting** of all maintenance activities performed
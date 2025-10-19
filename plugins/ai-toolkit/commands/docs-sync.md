---
version: "1.0.0"
created: "2025-09-23"
last_updated: "2025-09-23"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["documentation", "synchronization", "code-alignment"]
description: "Synchronize documentation with code changes and maintain consistency"
argument-hint: "[\"natural language instruction\"]"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
---

# /docs-sync Command

**Purpose**: Automatically synchronize documentation with code changes and maintain consistency between implementation and documentation.

## Usage

```bash
/docs-sync "update documentation to reflect recent code changes"
/docs-sync "sync API docs with latest endpoint changes"
/docs-sync "align documentation with current codebase state"
/docs-sync "update architecture docs after refactoring"
/docs-sync "sync all documentation with code changes"
```

## Arguments

| Variable | Type | Description |
|----------|------|-------------|
| `$ARGUMENTS` | string | Natural language instruction describing synchronization scope and focus |

## Prerequisites

- [ ] Code changes present requiring documentation updates
- [ ] Existing documentation structure in place
- [ ] Git history available for change analysis
- [ ] Documentation guidelines accessible

## Agent Coordination

**Primary**: technical-writer _(synchronization coordination)_
**Supporting**: frontend-specialist, backend-specialist _(technical accuracy)_, context-analyzer _(change analysis)_

## Context

- Recent code changes from Git history
- Existing documentation that may be outdated
- API definitions, interfaces, and architectural patterns
- Documentation structure and cross-references
- Synchronization scripts: `docs-manager.sh`

## Instructions

1. **Parse synchronization instruction**
   - Identify synchronization scope (all docs, specific areas, recent changes)
   - Understand code change impact on documentation
   - Determine synchronization strategy

2. **Analyze code changes**
   - Use Git history to identify recent modifications
   - Analyze impact on existing documentation
   - Identify documentation requiring updates

3. **Coordinate with domain specialists**
   - Involve frontend-specialist for UI/component documentation
   - Use backend-specialist for API and service documentation
   - Ensure technical accuracy in all updates

4. **Execute synchronization**
   - Update documentation to reflect code changes
   - Maintain cross-reference integrity
   - Validate documentation-code alignment

5. **Verify synchronization**
   - Check for remaining inconsistencies
   - Validate updated documentation accuracy
   - Ensure all cross-references remain valid

## Output

**Synchronized Documentation**: Updated documentation reflecting current code state
**Change Summary**: Overview of documentation updates made
**Consistency Report**: Analysis of documentation-code alignment
**Cross-Reference Validation**: Confirmation that all links and references work

**File Locations**:
- Updated docs: Various locations based on changes (`docs/`, `.claude/`, project-specific)
- Sync reports: Generated summaries of changes made

**Related**: `/develop` → **`/docs-sync`** → `/docs-validate`

### Usage Examples

**Natural Language Synchronization Instructions**:
- `/docs-sync "update API docs after adding authentication endpoints"` → Syncs API documentation with new auth code
- `/docs-sync "align architecture docs with recent refactoring"` → Updates architectural documentation post-refactor
- `/docs-sync "sync all documentation with current sprint changes"` → Comprehensive sync of recent development work
- `/docs-sync "update component docs after UI redesign"` → Syncs frontend documentation with UI changes
- `/docs-sync "keep documentation current with codebase"` → General synchronization maintenance

**Key Features**:
- **Natural language** parsing for flexible synchronization scope
- **Change detection** using Git history analysis
- **Domain specialist coordination** for technical accuracy
- **Cross-reference integrity** maintenance during updates
- **Automated alignment** between code and documentation
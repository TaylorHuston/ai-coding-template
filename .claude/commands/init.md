---
version: "1.0.0"
created: "2025-09-19"
last_updated: "2025-09-19"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["initialization", "setup", "template", "tool-selection", "fresh-project"]
allowed-tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "TodoWrite"]
argument-hint: "[--check|--force]"
description: "Initialize fresh template installations with smart tool selection and project structure setup"
model: "claude-3-5-sonnet-20241022"
---

# /init Command

Initialize fresh template installations with appropriate tool selection and project structure.

## Execution Instructions

### 1. Detect Project Maturity

Check these indicators to classify project state:

**Fresh Template**:
- `.template-manifest.json` exists
- No `docs/project-brief.md` OR content matches template exactly
- `src/` directory has <5 implementation files
- No user content in `epics/` directory
- Git history shows only template commits

**Established Project**:
- `src/` has 20+ implementation files
- Modified `docs/project-brief.md` with project content
- Active epics with real tasks
- `.serena/project.yml` exists

**Developing** (everything else between fresh and established)

### 2. Create Tool Preference Configuration

Write `.claude/project-state.yml`:

```yaml
project_maturity: [fresh_template|developing|established]
preferred_tools:
  file_discovery: [glob|serena]
  code_analysis: [grep|serena]
  template_search: glob
last_assessed: [current-date]
reasoning: "[why these tools were selected]"
```

**Tool Selection Rules**:
- Fresh template: Use `glob` and `grep` (Serena not beneficial for minimal projects)
- Developing: Use `glob` and `grep`, suggest Serena for complex tasks
- Established: Use `serena` for code analysis, `glob` for templates

### 3. Create Essential Structure

Ensure these directories exist:
- `docs/` - Documentation
- `src/` - Implementation code
- `tests/` - Test files
- `epics/` - Epic-driven workflow

### 4. Generate Initial Content

If `docs/project-brief.md` missing or matches template exactly:
1. Use Glob to find: `.resources/templates/docs/project/project-brief.template.md`
2. Copy template to `docs/project-brief.md`
3. Update frontmatter with current date

### 5. Provide Status Report

Report:
- Project maturity classification
- Tool preferences set
- Directory structure status
- Next recommended command

## Argument Handling

**Default (`/init`)**:
- Perform full detection and setup
- Create missing structure
- Generate initial content

**`--check`**:
- Only assess and report current state
- Don't modify any files
- Show current tool preferences

**`--force`**:
- Re-run detection even if already initialized
- Update tool preferences based on current state
- Recreate missing structure

## Tool Usage

- **Read**: Check existing files and project state
- **Write**: Create `.claude/project-state.yml` and missing templates
- **Edit**: Update existing configuration if needed
- **Bash**: Git commands for history analysis
- **Grep**: Search existing content patterns
- **Glob**: Find template files and assess directory contents
- **TodoWrite**: Track progress for complex initialization

## Success Criteria

- `.claude/project-state.yml` exists with appropriate tool preferences
- Essential directory structure exists
- `docs/project-brief.md` ready for editing
- Next workflow step clearly identified
- No unnecessary Serena activation on minimal projects

## Next Steps Guidance

**For Fresh Templates**:
- Run `/design --brief` (will use Glob - no Serena delays)
- Continue with standard workflow

**For Established Projects**:
- Consider Serena activation if beneficial
- Proceed with appropriate workflow commands

## Error Handling

- If template files missing: Report incomplete installation
- If git issues: Continue without git analysis
- Conservative defaults: Use Glob/Grep when unsure
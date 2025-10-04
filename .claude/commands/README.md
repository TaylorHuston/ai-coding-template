---
version: "1.0.0"
created: "2025-08-21"
last_updated: "2025-09-23"
status: "active"
target_audience: ["ai-assistants", "development-team"]
document_type: "reference"
priority: "high"
tags: ["claude-code", "commands", "workflow", "reference"]
---

# Claude Code Command Reference

Streamlined catalog of Claude Code slash commands centered around the **4-phase epic-driven workflow** that transforms AI from code generator to architectural partner.

## 🌟 Core Workflow Commands (Primary)

**4-Phase Epic Workflow**: From vision to validated execution

### 📝 **/design** - Vision, Epics, and Requirements

- _Purpose_: Create and document non-technical project aspects from vision to epic structure
- _Usage_: `/design "create project brief" | "design auth epic" | "add user story"`
- _Workflow Phase_: **1. Design** - Vision documents, epic structure, user stories, business context

### 🏗️ **/architect** - Technical Architecture and Infrastructure

- _Purpose_: Design technical solutions through Quick Mode (5-10 min) or Deep Mode (20+ min) exploration
- _Usage_: `/architect epic-name | epic-name deep | "direct question"`
- _Workflow Phase_: **2. Architecture** - Technical decisions, ADRs, Fast Track vs comprehensive analysis

### 📋 **/plan** - Epic-Driven Implementation Planning

- _Purpose_: Create epic structure with progressive task discovery and X.Y.Z implementation tasks
- _Usage_: `/plan epic-name | "review current plan" | "initialize new epic"`
- _Workflow Phase_: **3. Planning** - Epic directories, TASK-### numbering, agent assignment, testing integration

### ⚡ **/develop** - Streamlined Development Execution

- _Purpose_: Execute implementation tasks with test-first enforcement and epic integration
- _Usage_: `/develop | epic-name | "continue current task"`
- _Workflow Phase_: **4. Execution** - Test-first development, 95%+ coverage, hierarchical branching

## 🔧 Supporting Commands (By Domain)

### **Quality & Security**

- **[/quality](./quality.md)** - Multi-dimensional quality analysis using specialized agents
- **[/review](./review.md)** - Code quality assessment with detailed feedback
- **[/security-audit](./security-audit.md)** - OWASP-compliant security assessment with vulnerability remediation
- **[/test-fix](./test-fix.md)** - Automated test failure detection, analysis, and resolution

### **Development Support**

- **[/commit](./commit.md)** - Smart git commits with natural language instructions
- **[/merge-branch](./merge-branch.md)** - Safe branch merging with automated testing and validation
- **[/improve](./improve.md)** - Template and project improvement suggestions

### **Project Management & Documentation**

- **[/status](./status.md)** - Project status dashboard with context analysis
- **[/docs-generate](./docs-generate.md)** - Generate comprehensive project documentation
- **[/docs-validate](./docs-validate.md)** - Validate documentation health and links
- **[/docs-sync](./docs-sync.md)** - Synchronize documentation with code changes
- **[/docs-update](./docs-update.md)** - Comprehensive documentation maintenance
- **[/docs-health](./docs-health.md)** - Documentation health analysis and metrics
- **[/refresh](./refresh.md)** - Quick context refresh on project state and conventions

---

## 📚 Complete Command Index

| Command | Purpose | Usage Pattern |
|---------|---------|---------------|
| `/design` | Vision, epics, requirements | Natural language instructions |
| `/architect` | Technical architecture | `epic-name [deep]` or questions |
| `/plan` | Implementation planning | `epic-name` or natural language |
| `/develop` | Development execution | `epic-name` or natural language |
| `/quality` | Quality assessment | Multi-agent analysis |
| `/review` | Code review | Detailed feedback |
| `/security-audit` | Security assessment | OWASP compliance |
| `/test-fix` | Test failure resolution | Automated detection |
| `/commit` | Smart git commits | Natural language instructions |
| `/merge-branch` | Safe branch merging | Automated validation |
| `/improve` | Template improvements | Suggestions and updates |
| `/status` | Project dashboard | Context analysis |
| `/docs-generate` | Documentation creation | Natural language instructions |
| `/docs-validate` | Documentation validation | Natural language instructions |
| `/docs-sync` | Documentation synchronization | Natural language instructions |
| `/docs-update` | Documentation maintenance | Natural language instructions |
| `/docs-health` | Documentation health analysis | Natural language instructions |
| `/refresh` | Context refresh | Quick state update |

## Command Creation Best Practices

### Command Structure Template

**YAML Frontmatter:**
```yaml
---
allowed-tools: ["Read", "Grep", "Glob"]  # Essential tools only
argument-hint: "[target] [mode] | [\"natural language instruction\"]"  # Expected arguments
description: "Brief command purpose"     # One-line description
model: claude-sonnet-4-5                 # Versioned alias (claude-sonnet-4-5, claude-opus-4-0)
---
```

**Content Structure:**
```markdown
## /command-name Command

**Purpose**: Clear, concise purpose statement

## Usage
```bash
/command-name target-name         # Basic usage
/command-name target-name mode    # With mode
/command-name "direct question"   # Direct question
```

### Claude Code Argument System

**Supported Patterns:**
- **Positional**: `$1`, `$2`, `$3` for individual arguments
- **Natural Language**: `$ARGUMENTS` for flexible instructions
- **NOT supported**: `--flag` syntax (use positional instead)

**Usage Examples:**
```bash
# Positional arguments (structured commands)
/command epic-name        # $1="epic-name"
/command epic-name deep   # $1="epic-name", $2="deep"

# Natural language (flexible commands)
/command "all files with message 'feat: add auth'"     # $ARGUMENTS
/command "only the components we changed for this task" # $ARGUMENTS
```

**When to Use Each:**
- **Positional**: Simple, structured commands with predictable patterns
- **Natural Language**: Complex instructions requiring context and intelligence

## Arguments _(choose approach)_

**Positional Arguments** _(for structured commands)_:
| Position | Type | Values | Description |
|----------|------|--------|-------------|
| `$1` | string | target-name | Primary target |
| `$2` | string | mode | Optional mode |

**Natural Language** _(for flexible commands)_:
| Variable | Type | Description |
|----------|------|-------------|
| `$ARGUMENTS` | string | Full natural language instruction |

## Agent Coordination _(if multi-agent)_
**Primary**: agent-name **Supporting**: agent1, agent2

## Context _(if needed)_
[Files to read for context - e.g., project docs, existing patterns]

## Instructions
1. Step-by-step numbered list
2. Clear, actionable items
3. Expected outcomes

## Output
[What to return to the user when done]

**Related**: Previous → **This** → Next _(if part of workflow)_
```

### **🤖 Model Selection Strategy**

#### **Claude Opus 4.1** - Complex Reasoning & Architecture

- **Use For**: Design, architecture, planning, security analysis
- **Model ID**: `claude-opus-4-1-20250805` (alias: `claude-opus-4-1`)
- **Commands**: `/design`, `/architect`, `/plan`, `/security-audit`, `/improve`
- **When**: Complex multi-step reasoning, architectural decisions, strategic planning

#### **Claude Sonnet 4** - Execution & Development

- **Use For**: Development, quality, documentation, operations
- **Model ID**: `claude-sonnet-4-20250514` (alias: `claude-sonnet-4-0`)
- **Commands**: `/develop`, `/commit`, `/quality`, `/review`, `/docs`, `/status`
- **When**: Implementation tasks, code execution, standard operations

#### **Claude Haiku 3.5** - Quick Operations

- **Use For**: Status checks, simple queries, quick operations
- **Model ID**: `claude-3-5-haiku-20241022` (alias: `claude-3-5-haiku-latest`)
- **Commands**: `/status`, `/refresh`, simple utility commands
- **When**: Fast responses, lightweight operations

#### **Model Selection Guidelines**

- **Complex Strategy**: Use Opus 4.1 for decisions requiring deep reasoning
- **Implementation Focus**: Use Sonnet 4 for coding and execution tasks
- **Quick Operations**: Use Haiku 3.5 for fast, simple operations

### Migration from Flag-Based Commands

**Converting Existing Commands:**
```bash
# OLD (unsupported flags)
/command --epic "name" --deep

# NEW (positional arguments)
/command epic-name deep
```

**Common Conversions:**
- `--deep` → second argument: `command target deep`
- `--scope project` → first argument: `command project`
- `--format json` → second argument: `command target json`

### Tool Permissions Guidelines

**Essential Tools**: `Read`, `Grep`, `Glob` - Always safe for file operations

**Modification Tools**: `Edit` (preferred), `MultiEdit`, `Write` (use sparingly)

**Execution Tools**: `Bash` (specify scope when possible)

**Advanced Tools**: `Task` (multi-agent), `TodoWrite` (progress tracking)

```yaml
# Simple commands
allowed-tools: ["Read", "Grep", "Glob"]

# Commands with modifications
allowed-tools: ["Read", "Edit", "Bash", "Grep", "Glob"]

# Complex multi-agent commands
allowed-tools: ["Read", "Edit", "Bash", "Grep", "Glob", "Task", "TodoWrite"]
````

### Quality Guidelines

**Performance Expectations**:

- Fast commands (<30s): Status, simple operations
- Standard commands (1-5min): Code generation, analysis
- Complex commands (5-15min): Multi-agent coordination

**Security & Best Practices**:

- Use principle of least privilege for tool permissions
- Prefer `Read` over `Write`, `Edit` over `MultiEdit`
- Minimize context loading, use progressive information gathering
- Validate inputs and handle errors gracefully

**Quality Checklist**:

- [ ] YAML front matter validates correctly
- [ ] All specified tools are actually used
- [ ] Works with various argument combinations
- [ ] Clear purpose and predictable behavior
- [ ] Practical examples and proper documentation
- [ ] Appropriate model assignment for complexity

This guide ensures all commands follow Claude Code best practices while maintaining consistency and quality.

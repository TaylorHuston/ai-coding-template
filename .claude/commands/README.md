# Claude Code Command Reference

**Created**: 2025-08-21 **Last Updated**: 2025-09-23 **Status**: Active - Claude Code Compatible **Target Audience**: AI Assistants, Development Team

Streamlined catalog of Claude Code slash commands centered around the **4-phase epic-driven workflow** that transforms AI from code generator to architectural partner.

## 🌟 Core Workflow Commands (Primary)

**THE 4-PHASE EPIC WORKFLOW: From vision to validated execution**

### 📝 **/design** - Vision, Epics, and Requirements

- _Purpose_: Create and document non-technical project aspects from vision to epic structure
- _Usage_: `/design --vision | --epic "name" | --task "name" | --review`
- _Workflow Phase_: **1. Design** - Vision documents, epic structure, user stories, business context

### 🏗️ **/architect** - Technical Architecture and Infrastructure

- _Purpose_: Design technical solutions through Quick Mode (5-10 min) or Deep Mode (20+ min) exploration
- _Usage_: `/architect epic-name | --deep | "direct question"`
- _Workflow Phase_: **2. Architecture** - Technical decisions, ADRs, Fast Track vs comprehensive analysis

### 📋 **/plan** - Epic-Driven Implementation Planning

- _Purpose_: Create epic structure with progressive task discovery and X.Y.Z implementation tasks
- _Usage_: `/plan --epic "name" --issue KEY | --review | --init`
- _Workflow Phase_: **3. Planning** - Epic directories, TASK-### numbering, agent assignment, testing integration

### ⚡ **/develop** - Streamlined Development Execution

- _Purpose_: Execute implementation tasks with test-first enforcement and epic integration
- _Usage_: `/develop | /develop --task TASK-### | --epic "name"`
- _Workflow Phase_: **4. Execution** - Test-first development, 95%+ coverage, hierarchical branching

---

## 🔧 Supporting Commands (By Domain)

### **Quality & Security**

- **[/quality](./quality.md)** - Comprehensive quality assessment with multi-agent coordination

  - _Purpose_: Multi-dimensional quality analysis using specialized agents
  - _Usage_: `/quality assess|validate|audit|fix [--scope SCOPE] [--depth DEPTH] [--focus FOCUS]`
  - _Model_: claude-sonnet-4 | _Tools_: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

- **[/review](./review.md)** - Comprehensive code review with multi-dimensional analysis

  - _Purpose_: Multi-dimensional code quality assessment with detailed feedback
  - _Usage_: `/review --scope SCOPE --focus FOCUS --depth DEPTH --output FORMAT`
  - _Model_: claude-sonnet-4 | _Tools_: Read, Bash, Grep, Glob, TodoWrite, Task

- **[/security-audit](./security-audit.md)** - OWASP-compliant security assessment

  - _Purpose_: OWASP-compliant security assessment with vulnerability remediation
  - _Usage_: `/security-audit --scope SCOPE --depth DEPTH --compliance FRAMEWORK --output FORMAT`
  - _Model_: claude-opus-4 | _Tools_: Read, Bash, Grep, Glob, TodoWrite, Task

- **[/test-fix](./test-fix.md)** - Automatic test failure detection and resolution
  - _Purpose_: Automated test failure detection, analysis, and resolution
  - _Usage_: `/test-fix [test pattern or files]`
  - _Model_: claude-sonnet-4 | _Tools_: Bash(npm/pnpm/yarn), Read, Edit, MultiEdit, Grep, Glob, TodoWrite, Task

### **Development Support**

- **[/commit](./commit.md)** - Git commit with quality checks and conventional messages

  - _Purpose_: Create proper commits with pre-commit validation
  - _Usage_: `/commit [scope or files]`
  - _Model_: claude-sonnet-4 | _Tools_: Bash(git), npm/pnpm/yarn, Read, Grep, Glob

- **[/merge-branch](./merge-branch.md)** - Safe branch merging with deployment validation
  - _Purpose_: Safe branch merging with automated testing, deployment, and validation
  - _Usage_: `/merge-branch [target branch or merge options]`
  - _Model_: claude-sonnet-4 | _Tools_: Bash(git), Bash(npm/pnpm/yarn), Read, Edit, Grep, Glob, TodoWrite, Task

### **Project Management**

- **[/status](./status.md)** - Enhanced project status with intelligent context analysis

  - _Purpose_: Enhanced project status dashboard with context-analyzer agent integration
  - _Usage_: `/status [--format FORMAT] [--scope SCOPE] [--ai-format] [--detailed]`
  - _Model_: claude-sonnet-4 | _Tools_: Read, Write, Edit, Bash, Grep, Glob, TodoWrite, Task

- **[/docs](./docs.md)** - Unified documentation management with intelligent agent coordination

  - _Purpose_: Intelligent documentation coordination with technical-writer agent
  - _Usage_: `/docs generate|validate|sync [--type TYPE] [--scope SCOPE]`
  - _Model_: claude-sonnet-4 | _Tools_: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

- **[/refresh](./refresh.md)** - Intelligent project context refresh with git awareness
  - _Purpose_: Quick context refresh for AI assistants on project state and conventions
  - _Usage_: `/refresh [specific area]`
  - _Model_: claude-sonnet-4 | _Tools_: Read, Bash(git), Task

---

## 🚀 Epic Workflow Usage Patterns

### The Complete Epic Workflow (Recommended for All Features)

```yaml
# Complete Epic Development Workflow
core_workflow: "/design → /architect → /plan → /develop"

# Epic Structure Creation
epic_creation:
  phase_1_design:
    command: "design --epic 'epic-name'"
    purpose: "Non-technical foundation"
    output: "Vision documents, user stories, business context"

  phase_2_architecture:
    command: "architect epic-name"
    purpose: "Technical decisions"
    output: "ADRs with Quick Mode (5-10 min) or Deep Mode (20+ min)"
    modes:
      quick_mode: "Standard decisions (90% of cases)"
      deep_mode: "Complex analysis (10% of cases)"
      direct_questions: "architect 'NextJS or React?'"

  phase_3_planning:
    command: "plan --epic 'epic-name' --issue KEY"
    purpose: "Implementation structure"
    output: "Epic directory with TASK-### progressive discovery"
    structure:
      - "epics/epic-name/EPIC.md"
      - "epics/epic-name/TASK-001/ (with TASK.md, HANDOFF.yml, RESEARCH.md)"
      - "epics/epic-name/resources/ (ADRs, research, assets)"

  phase_4_execution:
    command: "develop"
    purpose: "Test-first implementation"
    output: "Quality-validated code with 95%+ coverage"
    features:
      - "Auto-invoked test-engineer"
      - "X.Y.Z implementation tasks"
      - "Hierarchical epic/task branching"

# Progressive Task Discovery
task_numbering:
  format: "TASK-###"
  discovery_order: "Numbered across ALL workflow phases"
  implementation: "X.Y.Z hierarchical subtasks (e.g., TASK-001:1.2.3)"

# Branching Strategy
epic_branching:
  structure: "epic/[name] containing task/###-[name]"
  workflow: "Task → Epic → Develop merging"
  local_focus: "No PRs initially, local merging workflow"
```

### Quality-First Development Pattern

```yaml
pattern: "design → architect → plan → develop → quality → commit"
use_case: "Security-critical or high-visibility features"
additional_validation: [quality, review, security-audit]
coverage_requirement: "95%+ with TDD/BDD hybrid approach"
```

### Quick Decision Pattern

```yaml
pattern: "architect 'direct question' → quick implementation"
use_case: "Simple architectural decisions"
example: "architect 'Should we use JWT or sessions?'"
time_investment: "5-10 minutes for standard decisions"
```

---

## 📝 **Custom Command Best Practices & Guidelines**

### **🎯 Command Structure Requirements**

#### **YAML Frontmatter (Required)**
```yaml
---
version: "0.3.0"                          # Semantic version
created: "YYYY-MM-DD"                     # Creation date
last_updated: "YYYY-MM-DD"                # Last modification
status: "active"                          # active|deprecated|experimental
target_audience: ["ai-assistants"]        # Who uses this command
document_type: "command"                  # Always "command"
tags: ["workflow", "category"]            # Descriptive tags
allowed-tools: ["Read", "Write", "Task"]  # Permitted tool names
argument-hint: "[--flag VALUE]"           # Usage hint for help
description: "Brief command purpose"      # One-line description
model: "claude-opus-4|claude-sonnet-4"   # Required model specification
---
```

#### **Content Structure (Standardized)**
```markdown
# /command-name Command

**Purpose**: Clear, concise purpose statement

## Usage
[Usage examples with bash code blocks]

## Agent Coordination
**Primary Agent**: specific-agent-name
**Supporting Agents**: agent1, agent2
**Quality Gates**: validation-agent

## Arguments
[Detailed argument documentation]

## Examples
[Practical usage examples]
```

### **🤖 Claude 4 Model Strategy**

#### **Claude Opus 4** - Complex Reasoning & Architecture
- **Use For**: Design, architecture, planning, security analysis
- **Characteristics**: Superior sustained performance, best coding model (72.5% SWE-bench)
- **Commands**: `/design`, `/architect`, `/plan`, `/security-audit`, `/improve`
- **When**: Complex multi-step reasoning, architectural decisions, strategic planning

#### **Claude Sonnet 4** - Execution & Development
- **Use For**: Development, quality, documentation, operations
- **Characteristics**: Balanced performance, precise instruction following (72.7% SWE-bench)
- **Commands**: `/develop`, `/commit`, `/quality`, `/review`, `/docs`, `/status`
- **When**: Implementation tasks, code execution, standard operations

#### **Model Selection Guidelines**
- **Complex Strategy**: Use Opus for decisions requiring deep reasoning
- **Implementation Focus**: Use Sonnet for coding and execution tasks
- **Hybrid Reasoning**: Both models support near-instant + extended thinking modes
- **Tool Parallelization**: Both can use multiple tools simultaneously

### **🔧 Tool Permissions Best Practices**

#### **Essential Tools (Always Safe)**
• `Read` - File reading operations
• `Grep` - Code search and pattern matching
• `Glob` - File pattern matching and discovery

#### **Modification Tools (Use Carefully)**
• `Edit` - Single file modifications (preferred over Write)
• `MultiEdit` - Batch file editing for refactoring
• `Write` - File creation (use sparingly)

#### **Execution Tools (Specify Scope)**
• `Bash(git)` - Git operations only
• `Bash(npm)` - Node.js package management
• `Bash(test)` - Test execution only
• `Bash` - General shell access (use carefully)

#### **Advanced Tools (Complex Commands)**
• `Task` - Subagent invocation for multi-agent coordination
• `TodoWrite` - Progress tracking for multi-step processes

#### **Tool Specification Format**
```yaml
# Preferred: Specific, scoped permissions
allowed-tools: ["Read", "Bash(git)", "Edit", "Grep", "Task"]

# Acceptable: General but documented
allowed-tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"]

# Avoid: Overly broad without justification
allowed-tools: ["*"]  # Only for specialized meta-commands
```

### **🎨 Agent Coordination Patterns**

#### **Single Agent Pattern**
```markdown
## Agent Coordination
**Primary Agent**: technical-writer
**Purpose**: Focused domain expertise
**Best For**: Clear single-specialty tasks
```

#### **Multi-Agent Workflow**
```markdown
## Agent Coordination
**Primary Agent**: project-manager
**Supporting Agents**: frontend-specialist, backend-specialist
**Quality Gates**: code-reviewer, test-engineer
**Best For**: Complex multi-domain tasks
```

#### **Progressive Specialization**
```markdown
## Agent Coordination
**Phase 1**: context-analyzer (understand scope)
**Phase 2**: code-architect (design solution)
**Phase 3**: technical-writer (document results)
**Best For**: Sequential expertise application
```

### **📋 Documentation Standards**

#### **Description Guidelines**
• **One-Line Focus**: Clear, actionable purpose statement
• **User-Centric**: What the user accomplishes, not internal mechanics
• **Specific Outcomes**: Concrete deliverables and results

**Good Examples**:
- "Create comprehensive project brief with business requirements"
- "Execute test-first development with automated quality gates"
- "Generate technical documentation with agent coordination"

**Avoid**:
- "Handle project stuff"
- "Do development work"
- "Manage various tasks"

#### **Argument Documentation**
```yaml
# Excellent: Clear structure and options
argument-hint: "[--brief|--epic \"name\"|--task \"name\"]"
argument-hint: "[--scope SCOPE] [--depth shallow|deep] [--format json|yaml]"

# Good: Simple but clear
argument-hint: "[--target BRANCH] [--force]"

# Poor: Vague or incomplete
argument-hint: "[options]"
argument-hint: "[various flags]"
```

#### **Usage Examples**
• **Always use bash code blocks** for consistency
• **Show multiple patterns** to demonstrate flexibility
• **Include real scenarios** users will encounter
• **Demonstrate flag combinations** and their effects

### **⚡ Performance & Security**

#### **Execution Efficiency**
• **Fast Commands** (<30s): Status checks, simple operations
• **Standard Commands** (1-5min): Code generation, analysis
• **Complex Commands** (5-15min): Multi-agent coordination

#### **Security Practices**
• **Principle of Least Privilege**: Only necessary tool permissions
• **Bash Command Scoping**: Specify allowed operations when possible
• **File Access Patterns**: Prefer Read over Write, Edit over MultiEdit
• **Validation Requirements**: Input sanitization and error handling

#### **Context Management**
• **Minimize Token Usage**: Load only necessary context
• **Progressive Loading**: Acquire information as needed
• **Subagent Delegation**: Use specialized agents for complex analysis
• **Result Caching**: Store intermediate outputs for reuse

### **🔄 Maintenance & Evolution**

#### **Version Management**
```yaml
# Update version for functional changes
version: "0.2.0"  # Feature additions
version: "0.1.1"  # Bug fixes
version: "1.0.0"  # Breaking changes

# Always update last_updated date
last_updated: "2025-09-23"

# Document status changes
status: "active"      # Fully supported
status: "deprecated"  # Scheduled for removal
status: "experimental" # Testing phase
```

#### **Deprecation Strategy**
```yaml
status: "deprecated"
deprecated_reason: "Replaced by /new-command with better features"
removal_date: "2025-12-01"
migration_path: "Use /new-command --enhanced-mode instead"
```

### **📊 Quality Checklist**

#### **Before Publishing**
- [ ] YAML frontmatter validates correctly
- [ ] All specified tools are actually used
- [ ] Command works with various argument combinations
- [ ] Error handling for invalid inputs
- [ ] Documentation matches actual behavior
- [ ] Model assignment appropriate for complexity
- [ ] Examples are practical and helpful
- [ ] Agent coordination is clearly defined

#### **Quality Indicators**
✅ **Clear Purpose**: User immediately understands command function
✅ **Predictable Behavior**: Consistent results across similar inputs
✅ **Appropriate Scope**: Neither too narrow nor overly broad
✅ **Complete Documentation**: Usage examples and comprehensive guidance
✅ **Efficient Tool Usage**: Only necessary permissions requested
✅ **Proper Model Assignment**: Complexity matches Claude 4 capabilities

---

## 🚀 **Command Development Template**

```markdown
---
version: "0.1.0"
created: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["category", "purpose"]
allowed-tools: ["Read", "Edit", "Bash"]
argument-hint: "[--flag VALUE]"
description: "Clear one-line purpose statement"
model: "claude-sonnet-4"
---

# /command-name Command

**Purpose**: What this command accomplishes for the user

## Usage
```bash
/command-name --flag value
```

## Agent Coordination
**Primary Agent**: agent-name
**Supporting Agents**: agent1, agent2

## Arguments
- `--flag`: Description of what this flag does

## Examples
```bash
# Basic usage
/command-name --basic

# Advanced usage
/command-name --advanced --with-options
```
```

This comprehensive guide ensures all custom commands follow Claude 4 best practices while maintaining consistency and quality across the entire command ecosystem.

# Claude Code Command Reference

**Created**: 2025-08-21 **Last Updated**: 2025-09-18 **Status**: Active - Claude Code Compatible **Target Audience**: AI Assistants, Development Team

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
  - _Model_: sonnet | _Tools_: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

- **[/review](./review.md)** - Comprehensive code review with multi-dimensional analysis

  - _Purpose_: Multi-dimensional code quality assessment with detailed feedback
  - _Usage_: `/review --scope SCOPE --focus FOCUS --depth DEPTH --output FORMAT`
  - _Model_: sonnet | _Tools_: Read, Bash, Grep, Glob, TodoWrite, Task

- **[/security-audit](./security-audit.md)** - OWASP-compliant security assessment

  - _Purpose_: OWASP-compliant security assessment with vulnerability remediation
  - _Usage_: `/security-audit --scope SCOPE --depth DEPTH --compliance FRAMEWORK --output FORMAT`
  - _Model_: opus | _Tools_: Read, Bash, Grep, Glob, TodoWrite, Task

- **[/test-fix](./test-fix.md)** - Automatic test failure detection and resolution
  - _Purpose_: Automated test failure detection, analysis, and resolution
  - _Usage_: `/test-fix [test pattern or files]`
  - _Model_: sonnet | _Tools_: Bash(npm/pnpm/yarn), Read, Edit, MultiEdit, Grep, Glob, TodoWrite, Task

### **Development Support**

- **[/commit](./commit.md)** - Git commit with quality checks and conventional messages

  - _Purpose_: Create proper commits with pre-commit validation
  - _Usage_: `/commit [scope or files]`
  - _Model_: sonnet | _Tools_: Bash(git), npm/pnpm/yarn, Read, Grep, Glob

- **[/merge-branch](./merge-branch.md)** - Safe branch merging with deployment validation
  - _Purpose_: Safe branch merging with automated testing, deployment, and validation
  - _Usage_: `/merge-branch [target branch or merge options]`
  - _Model_: sonnet | _Tools_: Bash(git), Bash(npm/pnpm/yarn), Read, Edit, Grep, Glob, TodoWrite, Task

### **Project Management**

- **[/status](./status.md)** - Enhanced project status with intelligent context analysis

  - _Purpose_: Enhanced project status dashboard with context-analyzer agent integration
  - _Usage_: `/status [--format FORMAT] [--scope SCOPE] [--ai-format] [--detailed]`
  - _Model_: sonnet | _Tools_: Read, Write, Edit, Bash, Grep, Glob, TodoWrite, Task

- **[/docs](./docs.md)** - Unified documentation management with intelligent agent coordination

  - _Purpose_: Intelligent documentation coordination with technical-writer agent
  - _Usage_: `/docs generate|validate|sync [--type TYPE] [--scope SCOPE]`
  - _Model_: sonnet | _Tools_: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

- **[/refresh](./refresh.md)** - Intelligent project context refresh with git awareness
  - _Purpose_: Quick context refresh for AI assistants on project state and conventions
  - _Usage_: `/refresh [specific area]`
  - _Model_: sonnet | _Tools_: Read, Bash(git), Task

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

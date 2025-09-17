# Claude Code Command Reference

**Created**: 2025-08-21 **Last Updated**: 2025-09-17 **Status**: Active - Claude Code Compatible **Target Audience**: AI Assistants, Development Team

Comprehensive catalog of Claude Code slash commands centered around the revolutionary ***/idea → /plan → /iterate workflow*** that transforms AI from code generator to architectural partner.

## 🌟 Core Workflow Commands (Primary)

**THE THREE-PHASE WORKFLOW: From architectural exploration to quality execution**

### 💡 **/idea** - Interactive Architectural Exploration
- _Purpose_: Transform architectural decision-making through guided conversation with specialist consultation
- _Usage_: `/idea --start "IDEA" | --continue SESSION | --finalize SESSION`
- _Model_: opus | _Tools_: Read, Write, Edit, MultiEdit, Bash(git), Grep, Glob, TodoWrite, Task
- _Workflow Phase_: **1. Exploration** - 20-45 minutes of guided conversation → ADR generation

### 📋 **/plan** - Sequential Multi-Agent Planning
- _Purpose_: Transform decisions into expertly-reviewed implementation plans through sequential agent analysis
- _Usage_: `/plan --issue KEY [--deliverable NAME] [--agents LIST]`
- _Model_: opus | _Tools_: Read, Write, Edit, MultiEdit, Bash(git), Grep, Glob, TodoWrite, Task
- _Workflow Phase_: **2. Planning** - 8-10 minutes of agent coordination → PLAN.md with phased tasks

### ⚡ **/iterate** - Orchestrated Task Execution
- _Purpose_: Execute planned tasks with intelligent agent coordination and perfect context preservation
- _Usage_: `/iterate [TASK-ID] [--force] [--agent AGENT]`
- _Model_: sonnet | _Tools_: Read, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task
- _Workflow Phase_: **3. Execution** - Agent-orchestrated task completion → Quality-validated implementation

---

## 🔧 Supporting Commands (By Domain)

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

- **[/health-check](./health-check.md)** - Comprehensive project health assessment
  - _Purpose_: Multi-dimensional project health evaluation and reporting
  - _Usage_: `/health-check [scope]`
  - _Model_: sonnet | _Tools_: Read, Bash, Grep, Glob, TodoWrite, Task

### **Development Support**

- **[/feature-development](./feature-development.md)** - End-to-end feature implementation with TDD
  - _Purpose_: Complete feature development workflow with quality gates (alternative to workflow)
  - _Usage_: `/feature-development --issue KEY --type TYPE --complexity LEVEL --testing APPROACH`
  - _Model_: opus | _Tools_: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

- **[/feature-plan](./feature-plan.md)** - Comprehensive feature planning workflow
  - _Purpose_: Create detailed feature plans with deliverable setup and architectural analysis
  - _Usage_: `/feature-plan --issue ISSUE-KEY --deliverable DELIVERABLE-NAME --complexity LEVEL --research DEPTH`
  - _Model_: opus | _Tools_: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

- **[/commit](./commit.md)** - Git commit with quality checks and conventional messages
  - _Purpose_: Create proper commits with pre-commit validation
  - _Usage_: `/commit [scope or files]`
  - _Model_: sonnet | _Tools_: Bash(git), npm/pnpm/yarn, Read, Grep, Glob

### **Project Management**

- **[/progress](./progress.md)** - Project progress validation and tracking with evidence verification

  - _Purpose_: Validate progress claims and update status with mandatory evidence verification
  - _Usage_: `/progress --mode validate|update|both [issue key or progress details]`
  - _Model_: sonnet | _Tools_: Read, Write, Edit, Grep, Glob, TodoWrite, Task

- **[/merge-branch](./merge-branch.md)** - Safe branch merging with deployment validation

  - _Purpose_: Safe branch merging with automated testing, deployment, and validation
  - _Usage_: `/merge-branch [target branch or merge options]`
  - _Model_: sonnet | _Tools_: Bash(git), Bash(npm/pnpm/yarn), Read, Edit, Grep, Glob, TodoWrite, Task

- **[/refresh](./refresh.md)** - AI assistant context refresh with git awareness
  - _Purpose_: Quick context refresh for AI assistants on project state and conventions
  - _Usage_: `/refresh [specific area]`
  - _Model_: haiku | _Tools_: Read, Bash(git)

## 🚀 Workflow Usage Patterns

### The Complete Workflow (Recommended for All Features)

```yaml
core_workflow: "/idea → /plan → /iterate"

phase_1_exploration:
  command: "idea"
  duration: "20-45 minutes"
  output: "ADR with architectural decision"
  description: "Guided conversation with specialist consultation"

phase_2_planning:
  command: "plan"
  duration: "8-10 minutes"
  output: "PLAN.md with phased tasks"
  description: "Sequential multi-agent analysis and task generation"

phase_3_execution:
  command: "iterate"
  duration: "Variable (per task)"
  output: "Quality-validated implementation"
  description: "Agent-orchestrated task execution with context preservation"

total_workflow_time: "30-60 minutes planning + implementation time"
quality_gates: "Built-in at every phase transition"
```

### Alternative Patterns (Legacy Support)

#### **Enterprise/Complex Features**
```yaml
pattern: "idea → plan → feature-plan → iterate → security-audit"
use_case: "System-wide changes, new architectures"
additional_commands: [feature-plan, security-audit]
```

#### **Simple Features**
```yaml
pattern: "idea → plan → iterate → commit"
use_case: "Straightforward implementations"
skip_commands: [feature-plan, review]
```

#### **Quality-First Development**
```yaml
pattern: "idea → plan → iterate → review → security-audit → commit"
use_case: "Security-critical or high-visibility features"
additional_validation: [review, security-audit]
```

### By Complexity Level

#### **High Complexity Commands**

- security-audit - Comprehensive security assessment
- feature-plan - System-wide planning
- feature-development (complex) - Multi-system feature development

#### **Medium Complexity Commands**

- feature-development (standard) - Single-system feature development
- health-check - Project health analysis
- review - Quality assessment
- iterate - Code improvement

#### **Low Complexity Commands**

- commit - Git commit workflow
- refresh - Context refresh
- progress - Status validation and updates
- test-fix - Test failure resolution

## Command Selection Guide

### Decision Matrix

```yaml
task_requirements:
  new_feature:
    simple: [feature-development]
    complex: [feature-plan, feature-development, security-audit]

  code_quality:
    review: [review]
    improvement: [iterate, review]
    analysis: [health-check, review]

  security_focus:
    assessment: [security-audit]
    compliance: [security-audit, review]
    hardening: [security-audit, feature-development]

  project_management:
    planning: [feature-plan]
    progress: [progress]
    context: [refresh]
    merging: [merge-branch]
```

## Claude Code Best Practices Applied

All commands now follow Claude Code standards:

### ✅ **Proper File Structure**

- **File Extensions**: All commands use `.md` extension for proper Claude Code recognition
- **YAML Frontmatter**: Complete metadata with description, argument hints, allowed tools, and model specifications
- **Argument Handling**: Support for `$ARGUMENTS` and positional parameters

### ✅ **Command Features**

- **Tool Restrictions**: Specific allowed-tools to ensure security and proper functionality
- **Model Selection**: Appropriate model complexity (haiku/sonnet/opus) for each command's requirements
- **Agent Integration**: Clear specification of which specialized agents each command leverages

### ✅ **Usage Patterns**

- **Slash Command Syntax**: All commands accessible via `/command-name arguments` format
- **Parameter Support**: Flexible argument parsing for different command contexts
- **Project Integration**: Commands work within project structure and conventions

## Available Commands Summary

### 🌟 Core Workflow Commands (Use These First)

| Command | Model | Usage | Workflow Phase |
| --- | --- | --- | --- |
| 💡 `/idea` | opus | `/idea --start "DESCRIPTION" \| --continue ID` | **Phase 1**: Architectural exploration → ADR |
| 📋 `/plan` | opus | `/plan --issue KEY [--deliverable NAME]` | **Phase 2**: Sequential planning → PLAN.md |
| ⚡ `/iterate` | sonnet | `/iterate [TASK-ID] [--force]` | **Phase 3**: Task execution → Implementation |

### 🔧 Supporting Commands

| Command | Model | Usage | Primary Purpose |
| --- | --- | --- | --- |
| `/commit` | sonnet | `/commit [scope/files]` | Git commit with quality checks |
| `/feature-development` | opus | `/feature-development --issue KEY --type TYPE` | Alternative to workflow (legacy) |
| `/feature-plan` | opus | `/feature-plan --issue KEY --deliverable NAME` | Enterprise-level planning (additional) |
| `/health-check` | sonnet | `/health-check [scope]` | Project health assessment |
| `/review` | sonnet | `/review --scope SCOPE --focus FOCUS` | Comprehensive code review |
| `/security-audit` | opus | `/security-audit --scope SCOPE --depth DEPTH` | OWASP security assessment |
| `/test-fix` | sonnet | `/test-fix [pattern]` | Automatic test failure resolution |
| `/progress` | sonnet | `/progress --mode validate\|update [issue]` | Progress validation and tracking |
| `/merge-branch` | sonnet | `/merge-branch [target]` | Branch merging with deployment validation |
| `/refresh` | haiku | `/refresh [area]` | Context refresh with git awareness |

---

*Claude Code slash commands provide structured, reusable workflows with proper argument handling, tool restrictions, and agent coordination for AI-assisted development.*

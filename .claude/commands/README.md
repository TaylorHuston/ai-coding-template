# Claude Code Command Reference

**Created**: 2025-08-21 **Last Updated**: 2025-09-17 **Status**: Active - Claude Code Compatible **Target Audience**: AI Assistants, Development Team

Streamlined catalog of Claude Code slash commands centered around the **5-phase workflow** that transforms AI from code generator to architectural partner. Commands have been dramatically simplified (77% reduction in instruction overhead) for better performance and usability.

## 🌟 Core Workflow Commands (Primary)

**THE FIVE-PHASE WORKFLOW: From vision to validated execution**

### 🎯 **/vision** - Project Vision & Strategy
- _Purpose_: Create and evolve project vision through collaborative exploration
- _Usage_: `/vision --create | --review | --update | --validate`
- _Workflow Phase_: **1. Vision** - Problem definition, solution direction, success framework

### 💡 **/feature** - Feature Requirements
- _Purpose_: Define specific capabilities and requirements through user journey mapping
- _Usage_: `/feature --new "FEATURE" | --update FEATURE | --validate FEATURE`
- _Workflow Phase_: **2. Feature** - User stories, requirements, success criteria

### 🏗️ **/architect** - Technical Architecture
- _Purpose_: Design technical solutions through structured exploration of alternatives
- _Usage_: `/architect FEATURE | --decision "TOPIC" | --update FEATURE`
- _Workflow Phase_: **3. Architecture** - Technical design, technology decisions, ADRs

### 📋 **/plan** - Implementation Planning
- _Purpose_: Create comprehensive implementation plans through multi-agent analysis
- _Usage_: `/plan --issue KEY | --review-plan | --init`
- _Workflow Phase_: **4. Planning** - Task breakdown, agent assignment, dependencies

### ⚡ **/develop** - Task Execution
- _Purpose_: Execute implementation tasks through intelligent agent coordination
- _Usage_: `/develop | /develop TASK-ID | --instruct | --force`
- _Workflow Phase_: **5. Execution** - Specialist agent coordination, quality validation

---

## ✨ Recent Improvements (September 2025)

**Major Command Simplification**: All 5 core workflow commands have been dramatically simplified based on AI expert analysis:

- **Before**: ~2,470 total lines of instructions (average 500+ lines per command)
- **After**: ~575 total lines of instructions (average 100-120 lines per command)
- **Reduction**: 77% decrease in instruction overhead

**Key Benefits**:
- ✅ **Performance**: Eliminated 15-20% AI performance degradation from excessive instructions
- ✅ **Efficiency**: Reduced 75% computational waste from token overhead
- ✅ **Usability**: Natural AI conversations vs scripted dialogue patterns
- ✅ **Maintainability**: Much easier to understand and modify commands
- ✅ **Focus**: Emphasis on outcomes rather than micromanaging process

**What Changed**:
- Removed scripted conversation checkpoints and forced dialogue patterns
- Eliminated prescriptive step-by-step processes that constrained AI behavior
- Maintained all essential objectives, success criteria, and quality gates
- Focused on clear guidance while trusting AI's natural capabilities

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
# Standard Feature Workflow
core_workflow: "/vision → /feature → /architect → /plan → /develop"

# New Project Foundation-First Workflow
foundation_first: "/vision → /architect --decision 'foundational tech stack' → /feature → /architect [feature] → /plan → /develop"

phase_0_foundation:
  command: "architect --decision"
  purpose: "Foundational architecture"
  output: "Core technology stack ADRs"
  when: "New projects before first feature"

phase_1_vision:
  command: "vision"
  purpose: "Strategic foundation"
  output: "Vision document with problem/solution/metrics"

phase_2_feature:
  command: "feature"
  purpose: "Requirements definition"
  output: "Feature specification with user journeys"

phase_3_architecture:
  command: "architect"
  purpose: "Technical design"
  output: "Architecture decisions and ADRs"

phase_4_planning:
  command: "plan"
  purpose: "Implementation strategy"
  output: "PLAN.md + HANDOFF.yml + RESEARCH.md"

phase_5_execution:
  command: "develop"
  purpose: "Task execution"
  output: "Quality-validated implementation"

key_improvements:
  - "77% reduction in instruction overhead for better AI performance"
  - "Eliminated scripted conversation patterns"
  - "Foundation-first workflow for new projects"
  - "Natural AI interaction vs forced dialogue"
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

| Command | Usage | Workflow Phase |
| --- | --- | --- |
| 🎯 `/vision` | `/vision --create \| --review \| --update` | **Phase 1**: Strategic foundation |
| 💡 `/feature` | `/feature --new "NAME" \| --update NAME` | **Phase 2**: Requirements definition |
| 🏗️ `/architect` | `/architect FEATURE \| --decision "TOPIC"` | **Phase 3**: Technical design |
| 📋 `/plan` | `/plan --issue KEY \| --review-plan` | **Phase 4**: Implementation strategy |
| ⚡ `/develop` | `/develop \| /develop TASK-ID` | **Phase 5**: Task execution |

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

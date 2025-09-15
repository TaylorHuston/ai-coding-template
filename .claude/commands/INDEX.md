# Claude Code Command Reference

**Created**: 2025-08-21
**Last Updated**: 2025-09-09
**Status**: Active - Claude Code Compatible
**Target Audience**: AI Assistants, Development Team

Comprehensive catalog of Claude Code slash commands with proper YAML frontmatter, argument handling, and tool specifications.

## Command Classification System

### By Domain

#### **Development & Implementation**
- **[/commit](./commit.md)** - Git commit with quality checks and conventional messages
  - *Purpose*: Create proper commits with pre-commit validation  
  - *Usage*: `/commit [scope or files]`
  - *Model*: sonnet | *Tools*: Bash(git), npm/pnpm/yarn, Read, Grep, Glob

- **[/feature-development](./feature-development.md)** - End-to-end feature implementation with TDD
  - *Purpose*: Complete feature development workflow with quality gates
  - *Usage*: `/feature-development --issue KEY --type TYPE --complexity LEVEL --testing APPROACH`
  - *Model*: opus | *Tools*: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

- **[/iterate](./iterate.md)** - Progressive iterative improvement workflow
  - *Purpose*: Systematic refinement through multiple improvement cycles
  - *Usage*: `/iterate --target TARGET --iterations N --threshold LEVEL --scope SCOPE`  
  - *Model*: sonnet | *Tools*: Read, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

#### **Quality & Security**
- **[/review](./review.md)** - Comprehensive code review with multi-dimensional analysis
  - *Purpose*: Multi-dimensional code quality assessment with detailed feedback
  - *Usage*: `/review --scope SCOPE --focus FOCUS --depth DEPTH --output FORMAT`
  - *Model*: sonnet | *Tools*: Read, Bash, Grep, Glob, TodoWrite, Task

- **[/security-audit](./security-audit.md)** - OWASP-compliant security assessment
  - *Purpose*: OWASP-compliant security assessment with vulnerability remediation
  - *Usage*: `/security-audit --scope SCOPE --depth DEPTH --compliance FRAMEWORK --output FORMAT`
  - *Model*: opus | *Tools*: Read, Bash, Grep, Glob, TodoWrite, Task

- **[/test-fix](./test-fix.md)** - Automatic test failure detection and resolution
  - *Purpose*: Automated test failure detection, analysis, and resolution
  - *Usage*: `/test-fix [test pattern or files]`
  - *Model*: sonnet | *Tools*: Bash(npm/pnpm/yarn), Read, Edit, MultiEdit, Grep, Glob, TodoWrite, Task

- **[/health-check](./health-check.md)** - Comprehensive project health assessment
  - *Purpose*: Multi-dimensional project health evaluation and reporting
  - *Usage*: `/health-check [scope]`
  - *Model*: sonnet | *Tools*: Read, Bash, Grep, Glob, TodoWrite, Task

#### **Planning & Architecture**
- **[/feature-plan](./feature-plan.md)** - Comprehensive feature planning workflow
  - *Purpose*: Create detailed feature plans with deliverable setup and architectural analysis
  - *Usage*: `/feature-plan --issue ISSUE-KEY --deliverable DELIVERABLE-NAME --complexity LEVEL --research DEPTH`
  - *Model*: opus | *Tools*: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

#### **Project Management**
- **[/progress](./progress.md)** - **MERGED** - Project progress validation and tracking with evidence verification
  - *Purpose*: Validate progress claims and update status with mandatory evidence verification
  - *Usage*: `/progress --mode validate|update|both [issue key or progress details]`
  - *Model*: sonnet | *Tools*: Read, Write, Edit, Grep, Glob, TodoWrite, Task

- **[/merge-branch](./merge-branch.md)** - **ENHANCED** - Safe branch merging with deployment validation
  - *Purpose*: Safe branch merging with automated testing, deployment, and validation
  - *Usage*: `/merge-branch [target branch or merge options]`
  - *Model*: sonnet | *Tools*: Bash(git), Bash(npm/pnpm/yarn), Read, Edit, Grep, Glob, TodoWrite, Task

- **[/refresh](./refresh.md)** - **ENHANCED** - AI assistant context refresh with git awareness
  - *Purpose*: Quick context refresh for AI assistants on project state and conventions
  - *Usage*: `/refresh [specific area]`
  - *Model*: haiku | *Tools*: Read, Bash(git)

## Command Usage Patterns

### By Project Phase

#### **Planning Phase**
```yaml
recommended_commands:
  - feature-plan: "Comprehensive feature planning and architecture"
  - health-check: "Assess current system state"
  - security-audit: "Identify security requirements"

workflow_pattern: "analysis → planning → validation"
typical_duration: "1-3 days"
```

#### **Development Phase**
```yaml
recommended_commands:
  - feature-development: "Core development workflow"
  - review: "Quality assurance during development"
  - iterate: "Continuous improvement"

workflow_pattern: "implement → review → iterate → test"
typical_duration: "1-4 weeks"
```

#### **Quality Assurance Phase**
```yaml
recommended_commands:
  - security-audit: "Security validation"
  - health-check: "Project health validation"
  - review: "Final quality review"

workflow_pattern: "security → health → quality → approval"
typical_duration: "3-7 days"
```

#### **Deployment Phase**
```yaml
recommended_commands:
  - commit: "Quality commit preparation"
  - merge-branch: "Safe branch merging"
  - health-check: "Post-deployment validation"

workflow_pattern: "commit → merge → validate → monitor"
typical_duration: "1-2 days"
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

| Command | Model | Usage | Primary Purpose |
|---------|--------|--------|-----------------|
| `/commit` | sonnet | `/commit [scope/files]` | Git commit with quality checks |
| `/feature-development` | opus | `/feature-development --issue KEY --type TYPE` | End-to-end feature implementation |
| `/feature-plan` | opus | `/feature-plan --issue KEY --deliverable NAME` | Comprehensive feature planning |
| `/health-check` | sonnet | `/health-check [scope]` | Project health assessment |
| `/iterate` | sonnet | `/iterate --target TARGET --iterations N` | Progressive improvement cycles |
| `/review` | sonnet | `/review --scope SCOPE --focus FOCUS` | Comprehensive code review |
| `/security-audit` | opus | `/security-audit --scope SCOPE --depth DEPTH` | OWASP security assessment |
| `/test-fix` | sonnet | `/test-fix [pattern]` | Automatic test failure resolution |
| `/progress` | sonnet | `/progress --mode validate\|update [issue]` | **MERGED** - Progress validation and tracking |
| `/merge-branch` | sonnet | `/merge-branch [target]` | **ENHANCED** - Branch merging with deployment validation |
| `/refresh` | haiku | `/refresh [area]` | **ENHANCED** - Context refresh with git awareness |

---

*Claude Code slash commands provide structured, reusable workflows with proper argument handling, tool restrictions, and agent coordination for AI-assisted development.*
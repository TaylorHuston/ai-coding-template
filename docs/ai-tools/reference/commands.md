---
version: "0.1.0"
created: "2025-09-15"
status: "active"
target_audience: ["developers", "ai-assistants", "team-leads"]
document_type: "reference"
priority: "high"
tags: ["commands", "slash-commands", "workflows", "ai-automation"]
---

# Slash Commands Reference

**Comprehensive catalog of AI-powered slash commands for development workflows.**

Claude Code slash commands provide structured, reusable workflows with proper argument handling, tool restrictions, and agent coordination for AI-assisted development.

## Quick Command Reference

| Command | Purpose | Usage | Model |
|---------|---------|-------|-------|
| `/commit` | Git commit with quality checks | `/commit [scope/files]` | sonnet |
| `/feature-development` | End-to-end feature implementation | `/feature-development --issue KEY --type TYPE` | opus |
| `/feature-plan` | Comprehensive feature planning | `/feature-plan --issue KEY --deliverable NAME` | opus |
| `/health-check` | Project health assessment | `/health-check [scope]` | sonnet |
| `/iterate` | Progressive improvement cycles | `/iterate --target TARGET --iterations N` | sonnet |
| `/merge-branch` | Safe branch merging with validation | `/merge-branch [target]` | sonnet |
| `/progress` | Progress validation and tracking | `/progress --mode validate\|update [issue]` | sonnet |
| `/refresh` | Context refresh with git awareness | `/refresh [area]` | haiku |
| `/review` | Comprehensive code review | `/review --scope SCOPE --focus FOCUS` | sonnet |
| `/security-audit` | OWASP security assessment | `/security-audit --scope SCOPE --depth DEPTH` | opus |
| `/test-fix` | Automatic test failure resolution | `/test-fix [pattern]` | sonnet |

## Development & Implementation Commands

### `/commit` - Git Commit with Quality Checks

**Purpose**: Create proper commits with pre-commit validation and conventional messages

**Usage**: `/commit [scope or files]`

**Features**:
- Pre-commit validation and quality checks
- Conventional commit message formatting
- Automatic staging of relevant files
- Integration with project linting and testing

**Example**:
```bash
/commit auth
/commit src/components/Login.tsx
/commit
```

**Tools**: Bash(git), npm/pnpm/yarn, Read, Grep, Glob

---

### `/feature-development` - End-to-End Feature Implementation

**Purpose**: Complete feature development workflow with TDD and quality gates

**Usage**: `/feature-development --issue KEY --type TYPE --complexity LEVEL --testing APPROACH`

**Parameters**:
- `--issue`: Issue or ticket identifier
- `--type`: Feature type (component, api, integration, etc.)
- `--complexity`: simple, standard, complex
- `--testing`: unit, integration, e2e, comprehensive

**Features**:
- Test-driven development workflow
- Comprehensive quality validation
- Automated testing and documentation
- Multi-agent coordination for complex features

**Example**:
```bash
/feature-development --issue AUTH-123 --type authentication --complexity standard --testing comprehensive
```

**Tools**: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

---

### `/iterate` - Workflow Task Execution

**Purpose**: Execute tasks from PLAN.md files with multi-agent coordination

**Usage**:
```bash
/iterate                    # Execute next unchecked task in current phase
/iterate P2.3.0            # Execute specific task P2.3.0
/iterate 1.4.0             # Execute specific task (P prefix optional)
```

**Behavior**:
- Automatically finds PLAN.md in current directory or nearest parent
- Identifies next unchecked task in active phase (first phase with incomplete tasks)
- Uses agent specified in HTML comment (e.g., `<!--agent:backend-specialist-->`)
- Reads HANDOFF.yml for context and RESEARCH.md for investigation findings
- Passes both structured context and research findings to selected agent
- Updates PLAN.md checkbox when task completes
- Updates HANDOFF.yml with agent's work summary
- Updates RESEARCH.md if agent discovers new findings or insights
- Updates CHANGELOG.md if agent makes user-facing changes
- Updates STATUS.md with phase summary when phase completes
- Prompts for commit at end of each phase

**Phase Completion Flow**:
1. Completes final task in phase (e.g., P2.6.0)
2. Updates STATUS.md with phase summary
3. Prompts: "Phase 2 complete. Run `/commit` to commit changes?"
4. Next `/iterate` starts next phase (P3.1.0)

**Error Handling**:
- **Malformed HANDOFF.yml**: Reports parsing error, suggests validation, continues with empty context
- **Missing Agent Reference**: Reports missing `<!--agent:name-->` comment, prompts for manual agent selection
- **Invalid Task Number**: "Task P2.8.0 not found in PLAN.md" - suggests available tasks
- **Agent Validation**: Checks if referenced agent exists in `.claude/agents/` directory
- **File Corruption**: Reports missing/corrupted files, suggests recovery procedures

**End States**:
- All phases complete: "All phases complete! Issue ready for final review."
- No PLAN.md found: "No PLAN.md file found in current directory or parent directories."
- Task validation failure: Prompts for correction before proceeding

**Example Workflow**:
```bash
/iterate        # Executes P1.1.0 with context-analyzer
/iterate        # Executes P1.2.0 with test-engineer
/iterate P1.4.0 # Jumps to P1.4.0 with code-reviewer
/iterate        # Continues with P1.5.0
```

**Tools**: Read, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

## Quality & Security Commands

### `/review` - Comprehensive Code Review

**Purpose**: Multi-dimensional code quality assessment with detailed feedback

**Usage**: `/review --scope SCOPE --focus FOCUS --depth DEPTH --output FORMAT`

**Parameters**:
- `--scope`: file, component, feature, project
- `--focus`: quality, security, performance, maintainability
- `--depth`: quick, standard, comprehensive
- `--output`: summary, detailed, checklist

**Features**:
- Code quality analysis
- Security vulnerability assessment
- Performance implications review
- Best practices validation

**Example**:
```bash
/review --scope feature --focus security --depth comprehensive
/review --scope src/api/ --focus performance
```

**Tools**: Read, Bash, Grep, Glob, TodoWrite, Task

---

### `/security-audit` - OWASP Security Assessment

**Purpose**: OWASP-compliant security assessment with vulnerability remediation

**Usage**: `/security-audit --scope SCOPE --depth DEPTH --compliance FRAMEWORK --output FORMAT`

**Parameters**:
- `--scope`: component, api, frontend, backend, full
- `--depth`: basic, standard, comprehensive
- `--compliance`: owasp, nist, custom
- `--output`: report, checklist, recommendations

**Features**:
- OWASP Top 10 vulnerability scanning
- Security best practices validation
- Compliance framework assessment
- Remediation recommendations

**Example**:
```bash
/security-audit --scope api --depth comprehensive --compliance owasp
```

**Tools**: Read, Bash, Grep, Glob, TodoWrite, Task

---

### `/test-fix` - Automatic Test Failure Resolution

**Purpose**: Automated test failure detection, analysis, and resolution

**Usage**: `/test-fix [test pattern or files]`

**Features**:
- Automatic test execution and failure detection
- Root cause analysis of test failures
- Intelligent fix suggestions and implementation
- Regression prevention

**Example**:
```bash
/test-fix
/test-fix auth.test.js
/test-fix "**/*integration*"
```

**Tools**: Bash(npm/pnpm/yarn), Read, Edit, MultiEdit, Grep, Glob, TodoWrite, Task

---

### `/health-check` - Project Health Assessment

**Purpose**: Multi-dimensional project health evaluation and reporting

**Usage**: `/health-check [scope]`

**Scope Options**:
- `dependencies`: Package and dependency analysis
- `security`: Security posture assessment
- `performance`: Performance metrics and bottlenecks
- `quality`: Code quality and technical debt
- `all`: Comprehensive health assessment (default)

**Features**:
- Dependency vulnerability scanning
- Performance bottleneck identification
- Code quality metrics
- Technical debt assessment

**Example**:
```bash
/health-check
/health-check security
/health-check dependencies
```

**Tools**: Read, Bash, Grep, Glob, TodoWrite, Task

## Planning & Architecture Commands

### `/feature-plan` - Comprehensive Feature Planning

**Purpose**: Create detailed feature plans with deliverable setup and architectural analysis

**Usage**: `/feature-plan --issue ISSUE-KEY --deliverable DELIVERABLE-NAME --complexity LEVEL --research DEPTH`

**Parameters**:
- `--issue`: Issue or epic identifier
- `--deliverable`: Specific deliverable name
- `--complexity`: simple, standard, complex, enterprise
- `--research`: basic, standard, comprehensive

**Features**:
- Architectural analysis and planning
- Task breakdown and estimation
- Risk assessment and mitigation
- Technical specification generation

**Example**:
```bash
/feature-plan --issue EPIC-456 --deliverable "User Authentication System" --complexity complex --research comprehensive
```

**Tools**: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task

## Project Management Commands

### `/progress` - Progress Validation and Tracking

**Purpose**: Validate progress claims and update status with mandatory evidence verification

**Usage**: `/progress --mode validate|update|both [issue key or progress details]`

**Modes**:
- `validate`: Verify claimed progress against actual implementation
- `update`: Update project status and documentation
- `both`: Validate and update in sequence

**Features**:
- Evidence-based progress verification
- Automatic status file updates
- Integration with issue tracking
- Progress reporting and metrics

**Example**:
```bash
/progress --mode validate AUTH-123
/progress --mode update "Completed user login implementation"
/progress --mode both
```

**Tools**: Read, Write, Edit, Grep, Glob, TodoWrite, Task

---

### `/merge-branch` - Safe Branch Merging

**Purpose**: Safe branch merging with automated testing, deployment, and validation

**Usage**: `/merge-branch [target branch or merge options]`

**Features**:
- Pre-merge validation and testing
- Conflict detection and resolution
- Automated deployment verification
- Rollback procedures if needed

**Example**:
```bash
/merge-branch main
/merge-branch --target develop --strategy squash
```

**Tools**: Bash(git), Bash(npm/pnpm/yarn), Read, Edit, Grep, Glob, TodoWrite, Task

---

### `/refresh` - Context Refresh

**Purpose**: Quick context refresh for AI assistants on project state and conventions

**Usage**: `/refresh [specific area]`

**Areas**:
- `git`: Repository state and recent changes
- `dependencies`: Package and dependency status
- `tests`: Test suite status and coverage
- `docs`: Documentation updates
- `all`: Complete project context (default)

**Features**:
- Git-aware context updates
- Rapid project state assessment
- Convention and pattern discovery
- Recent changes analysis

**Example**:
```bash
/refresh
/refresh git
/refresh dependencies
```

**Tools**: Read, Bash(git)

## Command Usage Patterns

### By Project Phase

#### Planning Phase
**Recommended Commands**: `feature-plan`, `health-check`, `security-audit`

**Workflow Pattern**: analysis → planning → validation

**Example Sequence**:
```bash
/health-check                    # Assess current state
/feature-plan --issue EPIC-123   # Plan the feature
/security-audit --scope feature  # Security requirements
```

#### Development Phase
**Recommended Commands**: `feature-development`, `review`, `iterate`

**Workflow Pattern**: implement → review → iterate → test

**Example Sequence**:
```bash
/feature-development --issue AUTH-123 --type authentication
/review --scope feature --focus quality
/iterate --target auth-components --iterations 2
/test-fix
```

#### Quality Assurance Phase
**Recommended Commands**: `security-audit`, `health-check`, `review`

**Workflow Pattern**: security → health → quality → approval

**Example Sequence**:
```bash
/security-audit --scope full --depth comprehensive
/health-check
/review --scope project --focus maintainability
```

#### Deployment Phase
**Recommended Commands**: `commit`, `merge-branch`, `health-check`

**Workflow Pattern**: commit → merge → validate → monitor

**Example Sequence**:
```bash
/commit
/merge-branch main
/health-check
```

### By Complexity Level

#### High Complexity
- `/security-audit` - Comprehensive security assessment
- `/feature-plan` - System-wide planning
- `/feature-development` (complex) - Multi-system features

#### Medium Complexity
- `/feature-development` (standard) - Single-system features
- `/health-check` - Project health analysis
- `/review` - Quality assessment
- `/iterate` - Code improvement

#### Low Complexity
- `/commit` - Git commit workflow
- `/refresh` - Context refresh
- `/progress` - Status updates
- `/test-fix` - Test failure resolution

## Command Selection Guide

### Decision Matrix

**New Feature Development**:
- Simple: `/feature-development`
- Complex: `/feature-plan` → `/feature-development` → `/security-audit`

**Code Quality Improvement**:
- Review: `/review`
- Improvement: `/iterate` → `/review`
- Analysis: `/health-check` → `/review`

**Security-Focused Work**:
- Assessment: `/security-audit`
- Compliance: `/security-audit` → `/review`
- Hardening: `/security-audit` → `/feature-development`

**Project Management**:
- Planning: `/feature-plan`
- Progress Tracking: `/progress`
- Context Updates: `/refresh`
- Branch Management: `/merge-branch`

## Best Practices

### Command Chaining
Chain related commands for comprehensive workflows:
```bash
/feature-plan --issue AUTH-123 --complexity complex
/feature-development --issue AUTH-123 --type authentication --testing comprehensive
/security-audit --scope feature --depth standard
/review --scope feature --focus security
/commit
```

### Parameter Usage
Use specific parameters for better results:
```bash
# Good: Specific and targeted
/review --scope src/auth/ --focus security --depth comprehensive

# Less effective: Generic
/review
```

### Context Awareness
Use `/refresh` before complex operations:
```bash
/refresh git
/feature-development --issue NEW-456
```

---

**Related Documentation**:
- [Using Agents Guide](../guides/using-agents.md) - How to work with AI agents
- [AI Collaboration Guide](../guides/ai-collaboration-guide.md) - Advanced AI workflows
- [MCP Setup Guide](../setup/mcp-setup.md) - Enhanced tool capabilities

**Technical Details**: See `.claude/commands/` directory for complete command specifications and implementation details.
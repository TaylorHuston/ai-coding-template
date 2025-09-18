---
version: "0.2.0"
created: "2025-09-15"
last_updated: "2025-09-18"
status: "active"
target_audience: ["developers", "ai-assistants", "team-leads"]
document_type: "reference"
priority: "high"
tags: ["commands", "slash-commands", "workflows", "ai-automation"]
---

# Slash Commands Reference

**Comprehensive catalog of AI-powered slash commands for development workflows.**

Claude Code slash commands provide structured, reusable workflows with proper argument handling, tool restrictions, and agent coordination for AI-assisted development.

## Core Workflow Commands ⭐

**The four-phase workflow that transforms AI from code generator to architectural partner:**

| Command | Purpose | Usage | Model |
|---------|---------|-------|-------|
| 📝 `/design` | Vision, features, and requirements (combines vision + feature planning) | `/design --new "PROJECT" \| --feature "FEATURE" \| --update` | opus |
| 🏗️ `/architect` | Technical architecture and technology decisions (combines scaffold + architectural design) | `/architect FEATURE \| --tech-stack \| --decision "DECISION"` | opus |
| 📋 `/plan` | Sequential multi-agent planning | `/plan --issue KEY [--deliverable NAME]` | opus |
| ⚡ `/develop` | Development execution | `/develop [TASK-ID] [--force] [--instruct]` | sonnet |

## All Available Commands

| Command | Purpose | Usage | Model |
|---------|---------|-------|-------|
| **Core Workflow** | | | |
| `/design` | Vision, features, and requirements | `/design --new "PROJECT" \| --feature "FEATURE" \| --update` | opus |
| `/architect` | Technical architecture and technology decisions | `/architect FEATURE \| --tech-stack \| --decision "DECISION"` | opus |
| `/plan` | Sequential multi-agent planning | `/plan --issue KEY [--deliverable NAME]` | opus |
| `/develop` | Development execution | `/develop [TASK-ID] [--force] [--instruct]` | sonnet |
| **Development & Quality** | | | |
| `/commit` | Git commit with quality checks | `/commit [scope/files]` | sonnet |
| `/feature-development` | End-to-end feature implementation | `/feature-development --issue KEY --type TYPE` | opus |
| `/feature-plan` | Comprehensive feature planning | `/feature-plan --issue KEY --deliverable NAME` | opus |
| `/health-check` | Project health assessment | `/health-check [scope]` | sonnet |
| `/merge-branch` | Safe branch merging with validation | `/merge-branch [target]` | sonnet |
| `/progress` | Progress validation and tracking | `/progress --mode validate\|update [issue]` | sonnet |
| `/refresh` | Context refresh with git awareness | `/refresh [area]` | haiku |
| `/review` | Comprehensive code review | `/review --scope SCOPE --focus FOCUS` | sonnet |
| `/security-audit` | OWASP security assessment | `/security-audit --scope SCOPE --depth DEPTH` | opus |
| `/test-fix` | Automatic test failure resolution | `/test-fix [pattern]` | sonnet |

## Core Workflow Commands

### 💡 `/idea` - Interactive Architectural Exploration (Supporting)

**Purpose**: Transform architectural decision-making from guesswork to guided exploration through conversational AI facilitation

**Usage**:
```bash
/idea --start "IDEA_DESCRIPTION"     # Begin new exploration
/idea --continue SESSION-ID          # Resume exploration
/idea --continue latest              # Resume most recent
/idea --review SESSION-ID            # Analysis and pivot
/idea --finalize SESSION-ID          # Generate ADR
/idea --list [--active] [--recent]   # Show sessions
```

**The Five Exploration Phases**:

1. **Idea Crystallization** (5-15 min): Understand problem space and constraints
2. **Alternative Exploration** (15-30 min): Generate and explore 3-5 viable options with specialist consultation
3. **Trade-off Analysis** (10-20 min): Compare options and assess trade-offs
4. **Decision Synthesis** (5-10 min): Converge on decision with clear rationale
5. **Documentation** (5-10 min): Generate comprehensive ADR

**Specialist Consultation During Conversation**:
- **On-Demand**: AI calls relevant agents during exploration (api-designer, security-auditor, performance-optimizer, etc.)
- **Context-Aware**: Specialists receive complete conversation context and current options
- **Integrated**: Agent insights seamlessly woven into ongoing conversation

**Session Management**:
```
docs/technical/decisions/explorations/
├── {SESSION-ID}/
│   ├── conversation.md          # Live conversation log
│   ├── state.yml               # Current session state
│   ├── specialist-inputs.md    # Agent consultation results
│   └── notes.md               # Scratchpad for ideas
└── sessions-index.yml          # All sessions registry
```

**ADR Generation**:
Upon finalization, creates comprehensive Architecture Decision Record:
- Enhanced context from full exploration history
- All alternatives explored with specialist analysis
- Rich consequences section with implementation considerations
- Decision journey with key conversation turning points

**Example Workflow**:
```bash
# Start exploration
/idea --start "Should we implement event sourcing for audit trails?"

# AI guides conversation through 5 phases with specialist consultation...
# Resume later if needed: /idea --continue latest

# Generate final ADR when consensus reached
/idea --finalize latest
```

**Vision Integration**: Automatically aligns decisions with project goals from `docs/vision.md`

**Tools**: Read, Write, Edit, MultiEdit, Bash(git), Grep, Glob, TodoWrite, Task

---

### 📋 `/plan` - Sequential Multi-Agent Planning

**Purpose**: Transform architectural decisions into expertly-reviewed implementation plans through sequential multi-agent analysis

**[Detailed documentation continues as existing...]**

---

### ⚡ `/develop` - Orchestrated Task Execution

**Purpose**: Execute tasks from PLAN.md with intelligent agent coordination and context preservation

**[Detailed documentation continues as existing...]**

---

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

### `/develop` - Workflow Task Execution

**Purpose**: Execute tasks from PLAN.md files with multi-agent coordination

**Usage**:
```bash
/develop                    # Execute next unchecked task in current phase
/develop P2.3.0            # Execute specific task P2.3.0
/develop 1.4.0             # Execute specific task (P prefix optional)
```

**Orchestrator Architecture**:
- Acts as orchestrator for multi-agent coordination (respects Claude Code sub-agent isolation)
- Reads HANDOFF.yml and RESEARCH.md for complete context
- Constructs comprehensive prompts with all relevant information
- Passes context explicitly to agents via Task tool prompts
- Updates coordination files after agent completion (agents don't write files)

**Behavior**:
- Automatically finds PLAN.md in current directory or nearest parent
- Identifies next unchecked task in active phase (first phase with incomplete tasks)
- Validates agent hint from HTML comment (e.g., `<!--agent:backend-specialist-->`)
- Runs quality gate validation: `.resources/scripts/validate-quality-gates.sh`
- Constructs comprehensive context from HANDOFF.yml and RESEARCH.md
- Calls agent via Task tool with complete context in prompt
- Parses agent output and updates PLAN.md checkbox when task completes
- Creates new HANDOFF.yml entry with agent's technical specifications
- Updates RESEARCH.md if new findings discovered
- Updates CHANGELOG.md if user-facing changes made
- Updates STATUS.md with phase summary when phase completes
- Runs quality gates before phase transitions

**Phase Completion Flow**:
1. Completes final task in phase (e.g., P2.6.0)
2. Runs comprehensive quality validation: `.resources/scripts/validate-quality-gates.sh`
3. Updates STATUS.md with phase summary
4. Prompts: "Phase 2 complete. Quality gates passed. Run `/commit` to commit changes?"
5. Next `/iterate` starts next phase (P3.1.0)

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
/develop        # Executes P1.1.0 with context-analyzer
/develop        # Executes P1.2.0 with test-engineer
/develop P1.4.0 # Jumps to P1.4.0 with code-reviewer
/develop        # Continues with P1.5.0
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

---

### `/plan` - Sequential Multi-Agent Planning

**Purpose**: Sequential multi-agent planning with comprehensive context gathering and technical specification generation

**Usage**: `/plan --issue ISSUE-KEY [--deliverable DELIVERABLE-NAME] [--branch BRANCH-NAME] [--agents LIST] [--review-agent AGENT] [--review-plan] [--init]`

**Orchestrator Architecture**:
- Acts as orchestrator reading RESEARCH.md and passing context to agents
- Constructs detailed prompts with accumulated findings for each agent
- Updates RESEARCH.md with agent findings after each execution
- Generates technical specifications for clear implementation guidance

**Parameters**:
- `--issue`: Issue key identifier (required, e.g., AUTH-123, BUG-456)
- `--deliverable`: Deliverable name (auto-detected from existing deliverables or issue prefix)
- `--branch`: Branch name (auto-generated as feature/ISSUE-KEY if not provided)
- `--agents`: Comma-separated list to override auto-selection (e.g., "context-analyzer,security-auditor,test-engineer")
- `--skip-branch`: Skip branch creation/checkout (use current branch)
- `--template`: Custom template path (default: template-deliverable)

**Special Modes**:
- `--init`: Initialize directory structure and template files only (no planning analysis)
- `--review-agent AGENT`: Add specific agent review to existing plan (e.g., "security-auditor")
- `--review-plan`: Comprehensive plan review with recommendations for user approval (no automatic updates)

**Features**:
- Sequential agent execution (8-10 minutes for thorough planning)
- Dynamic agent selection based on issue content keywords
- Each agent builds on previous findings in RESEARCH.md
- Comprehensive context gathering before plan generation
- Smart deliverable detection (creates only if needed)
- Issue directory structure setup within existing or new deliverables
- Intelligent task generation based on accumulated context
- Specialized agent assignment using HTML comment hints
- Phase-based task organization (P X.X.X numbering)
- HANDOFF.yml and RESEARCH.md initialization
- Automatic deliverable issue tracking updates
- Integration with existing workflow automation

**Example**:
```bash
/plan --issue AUTH-123                # Auto-selects agents based on keywords
/plan --issue AUTH-124                # Second issue: adds to existing AUTH deliverable
/plan --issue PERF-456 --agents "context-analyzer,performance-optimizer,test-engineer"
/plan --issue BUG-789 --skip-branch   # Bug fix using current branch

# Special modes
/plan --issue AUTH-123 --init                    # Setup only, no planning
/plan --issue AUTH-123 --review-agent security-auditor   # Add security review
/plan --issue AUTH-123 --review-plan             # Generate plan recommendations
```

**Tools**: Read, Write, Edit, MultiEdit, Bash(git), Grep, Glob, TodoWrite, Task

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

#### Architectural Exploration Phase
**Recommended Commands**: `idea` → `plan` → `iterate`

**Workflow Pattern**: explore → plan → execute

**Example Sequence**:
```bash
/idea --start "Should we implement microservices architecture?"  # Explore decision
/plan --issue ARCH-123           # Plan implementation
/iterate                         # Execute tasks
```

#### Planning Phase
**Recommended Commands**: `plan`, `feature-plan`, `health-check`, `security-audit`

**Workflow Pattern**: setup → analysis → planning → validation

**Example Sequence**:
```bash
/plan --issue AUTH-123           # Set up issue structure and branch
/health-check                    # Assess current state
/feature-plan --issue AUTH-123   # Detailed planning (for complex features)
/security-audit --scope feature  # Security requirements
```

#### Development Phase
**Recommended Commands**: `iterate`, `feature-development`, `review`

**Workflow Pattern**: execute → implement → review → iterate → test

**Example Sequence**:
```bash
/iterate                         # Execute tasks from PLAN.md
/feature-development --issue AUTH-123 --type authentication  # Complex implementation
/review --scope feature --focus quality
/iterate                         # Continue with next tasks
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
- Simple: `/idea` → `/plan` → `/iterate` → `/commit`
- Standard: `/idea` → `/plan` → `/iterate` → `/review` → `/commit`
- Complex: `/idea` → `/plan` → `/feature-plan` → `/iterate` → `/security-audit`

**Code Quality Improvement**:
- Review: `/review`
- Improvement: `/iterate` → `/review`
- Analysis: `/health-check` → `/review`

**Security-Focused Work**:
- Assessment: `/security-audit`
- Compliance: `/security-audit` → `/review`
- Hardening: `/security-audit` → `/feature-development`

**Project Management**:
- Issue Setup: `/plan`
- Planning: `/feature-plan` (for complex features)
- Progress Tracking: `/progress`
- Context Updates: `/refresh`
- Branch Management: `/merge-branch`

## Best Practices

### Command Chaining
Chain related commands for comprehensive workflows:

**Complete Workflow (Recommended)**:
```bash
/idea --start "How should we implement user authentication?"  # Explore decision
/plan --issue AUTH-123          # Plan implementation
/iterate                        # Execute phase 1 tasks
/iterate                        # Execute phase 2 tasks
/review --scope feature --focus security
/commit
```

**Legacy Complex Planning** (for enterprise features):
```bash
/plan --issue AUTH-123
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

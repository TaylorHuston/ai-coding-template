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

| Command | Purpose | Usage | Model | 📊 Metrics Tracked |
|---------|---------|-------|-------|-------------------|
| 📝 `/design` | Vision, features, and requirements (combines vision + feature planning) | `/design --new "PROJECT" \| --feature "FEATURE" \| --update` | opus | Feature scope, requirements complexity, iteration cycles |
| 🏗️ `/architect` | Technical architecture and technology decisions (Quick Mode: 5-10 min, Deep Mode: 20+ min) | `/architect FEATURE \| --deep \| --tech-stack \| --decision "DECISION"` | opus | Decision time, consultation patterns, ADR generation |
| 📋 `/plan` | Sequential multi-agent planning | `/plan --issue KEY [--deliverable NAME]` | opus | Task breakdown accuracy, agent selection, dependency mapping |
| ⚡ `/develop` | Development execution | `/develop [TASK-ID] [--force] [--instruct]` | sonnet | Implementation speed, quality gates, testing integration |

## All Available Commands

| Command | Purpose | Usage | Model |
|---------|---------|-------|-------|
| **Core Workflow** | | | |
| `/design` | Vision, features, and requirements | `/design --new "PROJECT" \| --feature "FEATURE" \| --update` | opus |
| `/architect` | Technical architecture and technology decisions | `/architect FEATURE \| --deep \| --tech-stack \| --decision "DECISION"` | opus |
| `/plan` | Sequential multi-agent planning | `/plan --issue KEY [--deliverable NAME]` | opus |
| `/develop` | Development execution | `/develop [TASK-ID] [--force] [--instruct]` | sonnet |
| **Development & Quality** | | | |
| `/commit` | Git commit with quality checks | `/commit [scope/files]` | sonnet |
| `/quality` | Comprehensive quality assessment | `/quality assess [--scope SCOPE]` | sonnet |
| `/merge-branch` | Safe branch merging with validation | `/merge-branch [target]` | sonnet |
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

### 🏗️ `/architect` - Quick Mode & Deep Mode Technical Architecture

**Purpose**: Make comprehensive technical decisions through collaborative exploration with optimized Quick Mode (default) and Deep Mode options

**Usage**:
```bash
/architect FEATURE                    # Quick Mode (5-10 min, 90% of cases)
/architect --deep FEATURE             # Deep Mode (20+ min, complex decisions)
/architect --tech-stack                # Technology stack decisions
/architect --decision "DECISION"       # Direct architectural questions
/architect "NextJS or React for this?" # Direct questions (Quick Mode)
```

**Mode Selection**:

#### **Quick Mode (Default - 90% of decisions)**
- **Duration**: 5-10 minutes
- **Use For**: Standard architectural decisions, technology choices, pattern selection
- **Output**: Fast Track ADR (streamlined format)
- **Agent System**: 3-tier optimization (reduced from 9 agents)
  - **Tier 1**: Core technical decisions (code-architect, api-designer)
  - **Tier 2**: Specialized review (security-auditor, performance-optimizer)
  - **Tier 3**: Implementation focus (database-specialist)

#### **Deep Mode (--deep flag - 10% of decisions)**
- **Duration**: 20+ minutes
- **Use For**: Complex architectural decisions, system-wide changes, critical infrastructure
- **Output**: Detailed ADR (comprehensive analysis)
- **Agent System**: Full multi-agent consultation with extended analysis
- **Includes**: Alternative analysis, risk assessment, migration planning

**Direct Questions**:
```bash
/architect "Should we use GraphQL or REST for this API?"
/architect "PostgreSQL vs MongoDB for user data?"
/architect "Microservices or monolith for this scale?"
```

**3-Tier Agent Optimization**:
- **Streamlined Consultation**: Focused agent involvement based on decision complexity
- **Faster Execution**: Reduced coordination overhead for standard decisions
- **Quality Maintained**: Full Deep Mode available for complex scenarios

**ADR Generation**:
- **Fast Track ADR**: Streamlined format for Quick Mode decisions
- **Detailed ADR**: Comprehensive format for Deep Mode decisions
- **Automatic Filing**: ADRs filed in `docs/technical/decisions/`

**Integration with Workflow**:
- **Vision Alignment**: Automatically references `docs/vision.md` for context
- **Epic Context**: Integrates with epic-driven development structure
- **Progressive Discovery**: Can create additional tasks during analysis

**Example Workflow**:
```bash
# Standard decision (Quick Mode)
/architect "authentication approach for user management"
# → 5-10 minute analysis with Fast Track ADR

# Complex decision (Deep Mode)
/architect --deep "microservices architecture migration"
# → 20+ minute comprehensive analysis with Detailed ADR
```

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


### `/develop` - Streamlined Task Execution (Optimized from 253 to 78 lines)

**Purpose**: Execute tasks from PLAN.md with test-first enforcement and streamlined 4-step execution flow

**Usage**:
```bash
/develop                    # Execute next unchecked task with auto-testing
/develop TASK-001:1.2.3    # Execute specific X.Y.Z implementation
/develop --test-first      # Enforce TDD with test-engineer auto-invocation
```

**Streamlined 4-Step Execution Flow**:
1. **Test-First Validation**: Auto-invokes test-engineer for TDD/BDD approach
2. **Task Execution**: Intelligent agent selection based on X.Y.Z task context
3. **Quality Integration**: Built-in testing with 95%+ coverage enforcement
4. **Progress Tracking**: Updates epic structure with implementation status

**Epic-Driven Integration**:
- **Progressive Task Discovery**: Tasks numbered by discovery order (X.Y.Z format)
- **Epic Structure**: Works with `epics/[name]/TASK-###.md` format
- **Testing Tasks**: Dedicated testing tasks created during /plan phase
- **BDD Scenarios**: Generated from acceptance criteria during planning

**Test-First Enforcement**:
- **Auto-Testing**: Automatic test-engineer invocation for all development tasks
- **TDD/BDD Hybrid**: Enforces test-first with BDD scenarios for acceptance criteria
- **Coverage Goals**: 95%+ test coverage enforced across all implementation phases
- **Testing Templates**: Uses comprehensive testing task templates from epic structure

**Epic Branch Management**:
- **Hierarchical Branching**: Epic branches (`epic/[name]`) contain task branches (`task/###-[name]`)
- **Integration with /merge-branch**: Automated epic/task branch workflow
- **Progressive Discovery**: New tasks can be added during any phase without disrupting numbering

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

**Example Epic-Driven Workflow**:
```bash
/develop        # Executes TASK-001:1.1.0 with test-engineer auto-invocation
/develop        # Executes TASK-001:1.2.0 with implementation specialist
/develop TASK-002:2.1.0 # Jump to specific task implementation
/develop --test-first   # Enforce TDD for current task
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

### `/status --detailed` - Progress Validation and Tracking

**Purpose**: Validate progress claims and update status with mandatory evidence verification

**Usage**: `/status --detailed --mode validate|update|both [issue key or progress details]`

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
/status --detailed --mode validate AUTH-123
/status --detailed --mode update "Completed user login implementation"
/status --detailed --mode both
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
/quality assess                    # Assess current state
/feature-plan --issue AUTH-123   # Detailed planning (for complex features)
/security-audit --scope feature  # Security requirements
```

#### Development Phase
**Recommended Commands**: `iterate`, `feature-development`, `review`

**Workflow Pattern**: execute → implement → review → iterate → test

**Example Sequence**:
```bash
/iterate                         # Execute tasks from PLAN.md
/develop --issue AUTH-123 --type authentication  # Complex implementation
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
/quality assess
/review --scope project --focus maintainability
```

#### Deployment Phase
**Recommended Commands**: `commit`, `merge-branch`, `health-check`

**Workflow Pattern**: commit → merge → validate → monitor

**Example Sequence**:
```bash
/commit
/merge-branch main
/quality assess
```

### By Complexity Level

#### High Complexity
- `/security-audit` - Comprehensive security assessment
- `/feature-plan` - System-wide planning
- `/develop` (complex) - Multi-system features

#### Medium Complexity
- `/develop` (standard) - Single-system features
- `/quality assess` - Project health analysis
- `/review` - Quality assessment
- `/iterate` - Code improvement

#### Low Complexity
- `/commit` - Git commit workflow
- `/refresh` - Context refresh
- `/status --detailed` - Status updates
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
- Analysis: `/quality assess` → `/review`

**Security-Focused Work**:
- Assessment: `/security-audit`
- Compliance: `/security-audit` → `/review`
- Hardening: `/security-audit` → `/develop`

**Project Management**:
- Issue Setup: `/plan`
- Planning: `/feature-plan` (for complex features)
- Progress Tracking: `/status --detailed`
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
/develop --issue AUTH-123 --type authentication --testing comprehensive
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
/develop --issue NEW-456
```

## 📊 Metrics Integration

All commands automatically collect detailed metrics for workflow optimization and performance analysis.

### Automatic Metrics Collection

Every command execution tracks:
- **Performance**: Execution time, success/failure rates, resource usage
- **Context**: Workflow phase, epic/task correlation, agent involvement
- **Dependencies**: Agent invocations, script executions, tool usage
- **Quality**: Testing integration, validation outcomes, error patterns

### Command-Specific Metrics

#### Core Workflow Commands

**`/design`**:
```bash
# Metrics tracked:
# - Feature scope complexity (simple/medium/complex)
# - Requirements iteration cycles
# - Vision document generation time
# - Epic creation patterns
```

**`/architect`**:
```bash
# Metrics tracked:
# - Decision exploration time (Quick vs Deep mode)
# - Agent consultation patterns
# - ADR generation success rates
# - Technology decision complexity
```

**`/plan`**:
```bash
# Metrics tracked:
# - Task breakdown accuracy and completeness
# - Agent selection effectiveness
# - Dependency mapping precision
# - Epic structuring patterns
```

**`/develop`**:
```bash
# Metrics tracked:
# - Implementation velocity (tasks per hour)
# - Quality gate success rates
# - Testing integration effectiveness
# - Code generation vs modification ratios
```

### Using Metrics for Optimization

#### View Command Effectiveness
```bash
# Analyze command success patterns
./.resources/scripts/metrics/query-metrics.sh --type command --stats --range 30d

# Sample insights:
# - /architect: 95% success rate, 12 min avg duration
# - /plan: 87% success rate, 25 min avg duration (optimization opportunity)
# - /develop: 92% success rate, 45 min avg duration
```

#### Identify Workflow Bottlenecks
```bash
# Find slowest workflow phases
./.resources/scripts/metrics/generate-report.sh --period 7d --type detailed | grep -A5 "Command Analysis"

# Optimization actions:
# - If /plan is slow: Improve task breakdown templates
# - If /architect takes long: Use Quick mode for simpler decisions
# - If /develop fails often: Add more validation in planning
```

#### Track Agent Performance in Commands
```bash
# See which agents are most effective during command execution
./.resources/scripts/metrics/query-metrics.sh --type agent --triggered-by command --stats

# Decision framework:
# - High-usage agents: Optimize for speed and accuracy
# - Low-success agents: Improve prompts or training
# - Underused valuable agents: Increase adoption
```

### Privacy & Configuration

- **Local Storage**: All metrics stay on your machine
- **Configurable**: Adjust collection levels in `.claude/metrics/config.yml`
- **No Code Content**: Only metadata and performance metrics collected

```yaml
# Example configuration
collection:
  enabled: true
  level: "detailed"  # basic|detailed|debug
  collectors:
    commands: true    # Track command execution
    agents: true      # Track agent performance
    workflows: true   # Track workflow patterns
```

### Metrics-Driven Command Selection

Use metrics to choose optimal commands for your team:

```bash
# Weekly command effectiveness report
./.resources/scripts/metrics/generate-report.sh --period 7d --type summary

# Use insights for:
# - Choosing between /architect quick vs deep mode
# - Optimizing /plan task breakdown strategies
# - Improving /develop execution patterns
# - Validating quality gate effectiveness
```

**📈 Pro Tip**: Review metrics weekly to identify patterns and optimize your team's AI-assisted development workflow.

---

**Related Documentation**:
- **[Metrics System Guide](../analytics/metrics-system.md)** - Comprehensive metrics documentation
- **[Agent Performance Guide](../guides/comprehensive-agent-guide.md)** - Agent optimization using metrics
- **[AI Collaboration Guide](../guides/ai-collaboration-guide.md)** - Advanced AI workflows
- **[MCP Setup Guide](../setup/mcp-setup.md)** - Enhanced tool capabilities

**Technical Details**: See `.claude/commands/` directory for complete command specifications and implementation details.

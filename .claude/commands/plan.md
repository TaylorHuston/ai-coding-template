---
description: Sequential multi-agent planning with comprehensive context gathering
argument-hint: --issue ISSUE-KEY [--deliverable DELIVERABLE-NAME] [--branch BRANCH-NAME] [--agents LIST] [--review-agent AGENT] [--review-plan] [--init]
allowed-tools: Read, Write, Edit, MultiEdit, Bash(git), Grep, Glob, TodoWrite, Task
model: opus
---

Sequential multi-agent planning workflow for thorough context gathering and intelligent plan generation:
1. Check if deliverable exists, create only if needed
2. Create/checkout feature branch if needed
3. Set up issue directory structure from templates
4. Execute sequential agent analysis chain (each agent reads previous findings)
5. Generate comprehensive PLAN.md with phase-based tasks (P X.X.X numbering)
6. Initialize coordination files (HANDOFF.yml, RESEARCH.md)
7. Update deliverable tracking with new issue
8. Provide setup confirmation and next steps

Sequential Agent Process:
- Parse arguments and determine required agents based on issue content
- Create directory structure and initialize RESEARCH.md with CRITICAL_CONTEXT
- Execute agents sequentially, /plan orchestrating context flow:
  1. context-analyzer: Foundation analysis and codebase patterns
  2. domain specialists: Database, frontend, backend (based on issue content)
  3. cross-cutting specialists: Security, performance (based on issue content)
  4. test-engineer: Testing strategy and comprehensive quality requirements
  5. code-architect: Synthesis and architectural decisions
  6. project-manager: Final PLAN.md generation with technical specifications
- /plan reads RESEARCH.md and passes accumulated context to each agent
- /plan updates RESEARCH.md with agent findings after each execution
- Each phase builds technical specifications for implementation clarity
- Total execution time: 8-10 minutes for thorough planning

Intelligent Task Generation with Technical Specifications:
- **Feature Development**:
  - P1.1.0: Context analysis with API specifications <!--agent:context-analyzer-->
  - P1.2.0: Test scaffolding with coverage requirements <!--agent:test-engineer-->
  - P1.3.0: Implementation with technical constraints <!--agent:backend-specialist-->
  - P1.4.0: Integration with performance benchmarks <!--agent:integration-specialist-->
  - P1.5.0: Code review with quality gates <!--agent:code-reviewer-->
- **Bug Fix**: reproduce with test cases → analyze root cause → implement fix with validation
- **Refactor**: baseline tests → architecture analysis → incremental refactor → validation
- **Performance**: profiling analysis → optimization with benchmarks → validation
- **Security**: audit with threat model → implementation → penetration testing

Each task includes:
- Detailed technical specifications and acceptance criteria
- Integration requirements with existing systems
- Quality gate requirements and validation steps
- Context handoff requirements for next agent

Dynamic Agent Selection:
Based on issue content analysis, agents are automatically selected:

Always Included:
- context-analyzer (foundation analysis)
- test-engineer (testing strategy)
- code-architect (synthesis and decisions)
- project-manager (final plan generation)

Conditionally Included (based on issue keywords):
- database-specialist: "database", "schema", "migration", "query", "SQL"
- frontend-specialist: "UI", "component", "frontend", "React", "CSS", "interface"
- backend-specialist: "API", "endpoint", "server", "backend", "service"
- api-designer: "API", "REST", "GraphQL", "endpoint", "integration"
- security-auditor: "auth", "security", "OAuth", "encryption", "vulnerability"
- performance-optimizer: "slow", "optimize", "performance", "scale", "cache"
- devops-engineer: "deploy", "infrastructure", "Docker", "CI/CD"

Parameters from $ARGUMENTS:
- --issue: Issue key identifier (required, e.g., AUTH-123, BUG-456)
- --deliverable: Deliverable name (auto-detected from existing deliverables or issue prefix)
- --branch: Branch name (auto-generated as feature/ISSUE-KEY if not provided)
- --agents: Comma-separated list to override auto-selection (e.g., "context-analyzer,security-auditor,test-engineer")
- --skip-branch: Skip branch creation/checkout (use current branch)
- --template: Custom template path (default: template-deliverable)

## Special Operation Modes

### --init: Directory Initialization Only

Creates issue directory structure and copies template files without any planning analysis.

```bash
/plan --issue AUTH-123 --init
# → Creates directory structure
# → Copies PLAN.md, README.md, HANDOFF.yml, RESEARCH.md templates
# → No agent execution, ready for manual planning
```

### --review-agent AGENT: Specific Agent Review

Add a specific agent's review to an existing plan (useful when agent was missed during initial planning).

```bash
/plan --issue AUTH-123 --review-agent security-auditor
# → security-auditor reads existing RESEARCH.md and PLAN.md
# → Adds security analysis to RESEARCH.md
# → Suggests plan updates based on security requirements
# → Appends findings without disrupting existing plan
```

### --review-plan: Comprehensive Plan Review

Full plan review and analysis based on current implementation progress and new discoveries. Generates recommendations for user approval.

```bash
/plan --issue AUTH-123 --review-plan
# → context-analyzer reviews current progress vs original plan
# → code-architect analyzes what's been built vs what was planned
# → project-manager generates recommended plan updates
# → Presents analysis and recommendations to user
# → Requires explicit user approval before making any changes
# → User can discuss, modify, or reject recommendations
```

## Operation Mode Details

**--init Mode Process**:

1. Create/validate directory structure
2. Copy template files (PLAN.md, README.md, HANDOFF.yml, RESEARCH.md)
3. Initialize HANDOFF.yml with basic structure
4. Create placeholder RESEARCH.md for manual research
5. Create empty PLAN.md template for manual planning
6. Update deliverable tracking
7. Exit (no agent execution)

**--review-agent Mode Process**:

1. Validate existing issue directory and files
2. Execute specified agent with context from existing RESEARCH.md and PLAN.md
3. Agent reads current plan and implementation progress
4. Agent adds analysis section to RESEARCH.md
5. Agent suggests specific plan updates or additions
6. Agent documents any concerns or recommendations
7. Preserve existing plan structure, add addendum if needed

**--review-plan Mode Process**:

1. Analyze current implementation progress from HANDOFF.yml
2. Compare implemented features against original plan
3. Execute sequence: context-analyzer → code-architect → project-manager
4. context-analyzer: Reviews current state vs original assumptions
5. code-architect: Validates architectural decisions made during implementation
6. project-manager: Generates recommended plan updates with rationale
7. Present comprehensive analysis and recommendations to user
8. **USER APPROVAL REQUIRED**: Ask user to review, discuss, and approve changes
9. If approved: Apply specific updates user agrees to
10. If rejected: Save analysis to RESEARCH.md for future reference
11. Document all decisions and rationale

Smart Directory Management:

**If deliverable exists** (most common case):

```bash
deliverables/existing-deliverable/
└── issues/
    └── NEW-ISSUE-KEY/          # Only creates new issue directory
        ├── PLAN.md             # Generated with intelligent tasks
        ├── README.md           # Implementation guide (from template)
        ├── HANDOFF.yml         # Agent coordination (initialized)
        └── RESEARCH.md         # Investigation notes (initialized)
```

**If deliverable doesn't exist** (new deliverable):

```bash
deliverables/XXX-deliverable-name/
├── README.md                   # Deliverable overview (from template)
├── deliverable.md              # Product context (from template)
└── issues/
    └── ISSUE-KEY/
        ├── PLAN.md             # Generated with intelligent phase-based tasks
        ├── README.md           # Implementation guide (from template)
        ├── HANDOFF.yml         # Agent coordination (initialized)
        └── RESEARCH.md         # Investigation notes (initialized)
```

Deliverable Detection Logic:

- **Auto-detection**: Scan existing deliverables for matching issue prefix (AUTH-123 → finds AUTH deliverable)
- **Manual override**: Use --deliverable to specify or create specific deliverable
- **Smart naming**: Create deliverable names from issue prefixes or manual specification
- **Issue tracking**: Automatically update deliverable README.md with new issue entries

Error Handling:

- Validate issue key format and uniqueness
- Check for existing issue directories (prompt for overwrite)
- Verify git repository status before branch operations
- Handle missing template files with fallback options
- Provide clear error messages with recovery suggestions
- Validate agent references against available .claude/agents/ directory

Integration Points:

- Works seamlessly with /iterate for task execution
- Integrates with /commit for phase completion workflows
- Updates STATUS.md for project tracking
- Leverages 17-agent framework for intelligent task assignment
- Compatible with existing deliverable management workflows

Example Usage:

```bash
# Simple feature with auto-selected agents
/plan --issue AUTH-123
# → Auto-selects: context-analyzer, security-auditor, test-engineer, code-architect, project-manager
# → Execution: 5 agents × ~2 min each = ~10 minutes total

# Database-focused issue
/plan --issue DATA-456
# → Auto-selects: context-analyzer, database-specialist, test-engineer, code-architect, project-manager

# Full-stack feature
/plan --issue FEATURE-789
# → Auto-selects: context-analyzer, frontend-specialist, backend-specialist, database-specialist, test-engineer, code-architect, project-manager

# Custom agent selection
/plan --issue PERF-321 --agents "context-analyzer,performance-optimizer,test-engineer,project-manager"

# Use existing branch
/plan --issue API-321 --skip-branch
# → Uses current branch, creates issue structure only

# Multiple issues in same deliverable (most common)
/plan --issue AUTH-124           # Adds to existing AUTH deliverable
/plan --issue AUTH-125 --skip-branch # Use current branch, add issue to AUTH deliverable

## Special Mode Examples

# Initialize directory only (no planning)
/plan --issue AUTH-123 --init
# → Sets up structure, ready for manual planning

# Add missed agent review to existing plan
/plan --issue AUTH-123 --review-agent performance-optimizer
# → performance-optimizer reviews and adds analysis

# Review and update plan after implementation discoveries
/plan --issue AUTH-123 --review-plan
# → Reviews progress, generates recommendations for user approval
# → User can discuss and approve specific changes

# Combine modes
/plan --issue AUTH-123 --review-agent security-auditor --skip-branch
# → Add security review using current branch
```

Sequential Execution Example:

```bash
/plan --issue AUTH-123
Starting sequential planning for AUTH-123...

Step 1/5: context-analyzer analyzing codebase... ✓ (2m 15s)
Step 2/5: security-auditor reviewing security needs... ✓ (1m 45s)
Step 3/5: test-engineer planning testing strategy... ✓ (1m 30s)
Step 4/5: code-architect synthesizing approach... ✓ (2m 00s)
Step 5/5: project-manager generating PLAN.md... ✓ (1m 10s)

Planning complete! Total time: 8m 40s
Ready to start implementation with: /iterate
```

Plan Review Example:

```bash
/plan --issue AUTH-123 --review-plan
Starting plan review for AUTH-123...

Step 1/3: context-analyzer reviewing progress... ✓ (2m 00s)
Step 2/3: code-architect analyzing decisions... ✓ (1m 45s)
Step 3/3: project-manager generating recommendations... ✓ (1m 30s)

## Plan Review Analysis

### Current Progress
✅ P1.1.0 - Context analysis (Complete)
✅ P1.2.0 - Write tests (Complete)
⚠️  P1.3.0 - Implement OAuth flow (In Progress - discovered complexity)
❌ P1.4.0 - Frontend integration (Not started)
❌ P1.5.0 - Testing (Not started)

### Key Discoveries
- OAuth provider requires PKCE flow (not in original plan)
- Frontend needs major refactoring for new auth system
- Database schema changes required for social login

### Recommended Plan Updates

**Phase 1 Updates**:
- P1.3.0: Split into P1.3.1 (PKCE implementation) + P1.3.2 (token handling)
- P1.3.3: NEW - Database schema migration for social login

**Phase 2 Updates**:
- P2.1.0: NEW - Frontend authentication refactoring
- P2.2.0: MODIFIED - Update P1.4.0 to use new auth system
- P2.3.0: NEW - Social login UI components

**Phase 3 Updates**:
- P3.1.0: MODIFIED - Expand testing for PKCE flow
- P3.2.0: NEW - End-to-end testing for social login

### Impact Assessment
- Additional effort: ~3-4 days
- Architecture change: OAuth flow complexity
- Dependencies: Frontend team coordination needed

Would you like to:
1. Accept all recommendations and update PLAN.md
2. Accept specific recommendations (I'll ask which ones)
3. Discuss modifications to these recommendations
4. Reject recommendations and keep current plan
5. Save analysis for later review

Your choice: _
```

Success Indicators:

- Feature branch created and checked out (unless --skip-branch)
- Issue directory structure established (deliverable created only if needed)
- PLAN.md populated with intelligent, actionable tasks
- Appropriate specialized agents assigned to each task
- HANDOFF.yml and RESEARCH.md initialized with starter content
- Deliverable README.md updated with new issue tracking
- User receives confirmation with recommended next steps (/iterate to begin)
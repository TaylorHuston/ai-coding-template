---
description: Comprehensive quality assessment with multi-agent coordination
argument-hint: [assess|validate|audit|fix] [--scope SCOPE] [--depth DEPTH] [--focus FOCUS]
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: "claude-3-5-sonnet-20241022"
---

# Quality Assessment Command

Unified quality management that orchestrates quality agents and validation scripts intelligently.

## Usage

```bash
# Comprehensive quality assessment
/quality assess

# Validate specific quality gates
/quality validate --scope current-phase

# Security-focused quality audit
/quality audit --focus security

# Auto-fix detected quality issues
/quality fix --scope code-style

# Pre-commit quality check
/quality validate --scope commit-ready
```

## Commands

### `assess` - Comprehensive Quality Assessment

Multi-dimensional quality analysis using specialized agents.

**Options:**
- `--scope all|current|specific-files` - Assessment scope
- `--depth shallow|standard|deep` - Analysis depth
- `--focus code|security|performance|architecture` - Specific focus area

**Agent Coordination:**
1. **code-reviewer** - Code quality, maintainability, best practices
2. **security-auditor** - Security vulnerabilities, compliance
3. **performance-optimizer** - Performance bottlenecks, optimization opportunities
4. **test-engineer** - Test coverage, quality, effectiveness

**Script Integration:**
- Automatically invokes `validate-quality-gates.sh` for gate checking
- Uses `validate-context.sh` for workflow consistency
- Integrates static analysis and linting tools

### `validate` - Quality Gate Validation

Validates quality gates for workflow progression with automatic remediation suggestions.

**Options:**
- `--scope current-phase|all-phases|commit-ready` - Validation scope
- `--auto-fix` - Automatically fix simple issues
- `--report FORMAT` - Generate validation report

**Features:**
- Multi-phase quality validation (P1, P2, P3)
- Test coverage verification
- Code quality metrics checking
- Documentation completeness validation
- Security compliance verification

**Agent Integration:**
- Uses **code-reviewer** for code quality validation
- Uses **test-engineer** for test coverage analysis
- Uses **security-auditor** for security compliance
- Automatically invokes validation scripts with agent oversight

### `audit` - Security and Compliance Audit

Comprehensive security audit with OWASP compliance and vulnerability assessment.

**Options:**
- `--focus security|compliance|vulnerabilities` - Audit focus
- `--framework owasp|nist|custom` - Compliance framework
- `--severity low|medium|high|critical` - Minimum severity threshold

**Features:**
- OWASP Top 10 compliance checking
- Dependency vulnerability scanning
- Code security pattern analysis
- Infrastructure security assessment

**Agent Integration:**
- Primary: **security-auditor** for comprehensive security analysis
- Supporting: **code-reviewer** for security code patterns
- Supporting: **devops-engineer** for infrastructure security

### `fix` - Automated Quality Issue Resolution

Intelligent issue resolution with agent-guided fixes.

**Options:**
- `--scope code-style|tests|security|documentation` - Fix scope
- `--auto` - Automatic fixes for safe issues
- `--interactive` - Interactive fix approval
- `--dry-run` - Preview fixes without applying

**Features:**
- Code style and formatting fixes
- Test failure resolution
- Documentation synchronization
- Simple security issue remediation

**Agent Integration:**
- Uses **refactoring-specialist** for code improvements
- Uses **test-engineer** for test fixes
- Uses **technical-writer** for documentation fixes
- Coordinates with domain specialists for complex fixes

## Quality Dimensions

The `/quality` command assesses multiple dimensions:

```yaml
quality_dimensions:
  code_quality:
    metrics: [complexity, maintainability, readability, duplication]
    agent: code-reviewer
    scripts: [linting, static analysis]

  security:
    metrics: [vulnerabilities, compliance, best practices]
    agent: security-auditor
    scripts: [security scanners, dependency checks]

  performance:
    metrics: [bottlenecks, optimization, scalability]
    agent: performance-optimizer
    scripts: [performance profiling, load testing]

  testing:
    metrics: [coverage, effectiveness, reliability]
    agent: test-engineer
    scripts: [test runners, coverage tools]

  documentation:
    metrics: [completeness, accuracy, freshness]
    agent: technical-writer
    scripts: [docs validation, link checking]

  architecture:
    metrics: [design patterns, coupling, cohesion]
    agent: code-architect
    scripts: [dependency analysis, architecture validation]
```

## Integration with Workflow

The `/quality` command integrates seamlessly with the core workflow:

### During `/iterate` Phase
- Automatic quality validation between tasks
- Progressive quality gate enforcement
- Context-aware quality recommendations

### Pre-Commit Validation
- Comprehensive quality check before commits
- Automatic fix suggestions for common issues
- Integration with git hooks

### Continuous Quality
- Background quality monitoring
- Proactive issue detection
- Quality trend analysis

## Script Orchestration

Intelligently coordinates existing validation scripts:

```yaml
script_orchestration:
  validate-quality-gates.sh:
    triggers: [phase transitions, commit preparation]
    coordinating_agent: code-reviewer

  validate-context.sh:
    triggers: [workflow state changes]
    coordinating_agent: context-analyzer

  validate-agent-output.sh:
    triggers: [agent task completion]
    coordinating_agent: project-manager

  remediation-advisor.sh:
    triggers: [validation failures]
    coordinating_agent: refactoring-specialist
```

## Examples

### Comprehensive Quality Assessment
```bash
/quality assess --depth deep
# → Multi-agent quality analysis
# → code-reviewer: Code quality assessment
# → security-auditor: Security vulnerability scan
# → performance-optimizer: Performance bottleneck analysis
# → test-engineer: Test coverage and effectiveness review
```

### Pre-Commit Quality Check
```bash
/quality validate --scope commit-ready
# → Validates all quality gates for commit readiness
# → Runs validation scripts with agent oversight
# → Provides clear pass/fail status with remediation steps
```

### Security-Focused Audit
```bash
/quality audit --focus security --framework owasp
# → security-auditor performs comprehensive security audit
# → OWASP Top 10 compliance checking
# → Vulnerability assessment with remediation recommendations
```

### Automated Issue Resolution
```bash
/quality fix --scope code-style --auto
# → refactoring-specialist identifies code style issues
# → Automatically applies safe formatting and style fixes
# → Reports all changes made for review
```

## Quality Reports

Generates comprehensive quality reports:

```yaml
report_types:
  summary:
    format: markdown
    content: [overall_score, key_metrics, recommendations]

  detailed:
    format: markdown_with_charts
    content: [dimension_breakdown, trend_analysis, action_items]

  dashboard:
    format: interactive_html
    content: [visual_metrics, drill_down_capabilities, historical_data]

  ci_cd:
    format: json
    content: [gate_status, metrics, pipeline_integration]
```

## Benefits Over Individual Commands

✅ **Unified Interface**: Single command for all quality concerns
✅ **Intelligent Coordination**: Agents work together for comprehensive analysis
✅ **Context Awareness**: Understands project state and workflow phase
✅ **Automated Remediation**: Intelligent fix suggestions and auto-resolution
✅ **Progressive Quality**: Enforces quality gates throughout development
✅ **Script Integration**: Leverages existing tools with agent intelligence
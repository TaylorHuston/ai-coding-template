---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "quality", "assessment", "validation"]
description: "Comprehensive quality assessment with multi-agent coordination"
argument-hint: "[assess|validate|audit|fix] [--scope SCOPE] [--depth DEPTH] [--focus FOCUS]"
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
---

# /quality Command

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

## Agent Coordination

**Primary**: code-reviewer (comprehensive quality analysis), security-auditor (security assessment), test-engineer (test validation)
**Supporting**: performance-optimizer (performance analysis), refactoring-specialist (improvement suggestions), technical-writer (documentation quality)
**Orchestration**: Intelligent coordination of validation scripts with agent oversight

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

**Integration:**
- Integrates static analysis and linting tools through AI coordination
- Provides intelligent quality gate enforcement

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
- AI agents provide intelligent validation and remediation suggestions

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
    approach: AI-driven code analysis with integrated linting tools

  security:
    metrics: [vulnerabilities, compliance, best practices]
    agent: security-auditor
    approach: AI-driven security analysis with dependency scanning

  performance:
    metrics: [bottlenecks, optimization, scalability]
    agent: performance-optimizer
    approach: AI-driven performance analysis with profiling integration

  testing:
    metrics: [coverage, effectiveness, reliability]
    agent: test-engineer
    approach: AI-driven test analysis with coverage tool integration

  documentation:
    metrics: [completeness, accuracy, freshness]
    agent: technical-writer
    approach: AI-driven documentation validation and link checking

  architecture:
    metrics: [design patterns, coupling, cohesion]
    agent: code-architect
    approach: AI-driven architectural analysis and pattern recognition
```

## Integration with Workflow

The `/quality` command integrates seamlessly with the core workflow:

### During `/implement` Phase
- Automatic quality validation between phases
- Progressive quality gate enforcement
- Context-aware quality recommendations

### Pre-Commit Validation
- Comprehensive quality check before commits
- Automatic fix suggestions for common issues
- AI-driven validation and remediation

### Continuous Quality
- Background quality monitoring
- Proactive issue detection
- Quality trend analysis

## AI Agent Orchestration

Coordinates specialized agents for comprehensive quality analysis:

```yaml
agent_orchestration:
  quality_gates:
    triggers: [phase transitions, commit preparation]
    coordinating_agent: code-reviewer
    approach: AI-driven validation with intelligent remediation

  context_validation:
    triggers: [workflow state changes]
    coordinating_agent: context-analyzer
    approach: AI-driven context consistency checking

  output_validation:
    triggers: [agent task completion]
    coordinating_agent: project-manager
    approach: AI-driven quality assurance of agent work

  remediation:
    triggers: [validation failures]
    coordinating_agent: refactoring-specialist
    approach: AI-driven issue analysis and fix suggestions
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
# → AI agents perform comprehensive validation
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
✅ **Pure AI-Driven**: Flexible natural language approach with integrated tooling
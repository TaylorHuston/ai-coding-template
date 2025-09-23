---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "review", "quality", "analysis"]
description: "Comprehensive code review with multi-dimensional analysis"
argument-hint: "[--scope SCOPE] [--focus FOCUS] [--depth DEPTH] [--output FORMAT]"
allowed-tools: ["Read", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: "claude-sonnet-4"
---

# /review Command

**Purpose**: Comprehensive code review with multi-dimensional analysis and agent coordination.

## Usage

```bash
/review                              # Review recent changes
/review --scope changes              # Review specific scope
/review --focus security             # Security-focused review
/review --depth comprehensive        # Deep analysis
```

## Process

Comprehensive code review workflow:
1. Analyze changes for quality, security, and maintainability
2. Check adherence to project standards and best practices
3. Validate test coverage and quality
4. Assess performance implications
5. Provide detailed feedback and recommendations

## Agent Coordination

**Primary**: code-reviewer (for comprehensive quality assessment)
**Supporting**: security-auditor (security focus), test-engineer (test coverage), performance-optimizer (performance focus)
**Domain Specialists**: frontend-specialist, backend-specialist, database-specialist (as needed)

## Options

- `--scope`: Review scope (changes, file, module, full)
- `--focus`: Review focus (security, performance, quality, all)
- `--depth`: Review depth (quick, standard, comprehensive)
- `--output`: Output format (summary, detailed, checklist)

## Process

- Use context-analyzer to understand change context
- Use code-reviewer for comprehensive quality assessment
- Use security-auditor for security-focused review (if sensitive)
- Use test-engineer to validate test coverage and quality
- Use appropriate domain specialists for technical review
- Generate detailed review report with categorized feedback
- Provide recommendations for improvement
- Update review tracking in project status

## Examples

**Basic review**: `/review` → Analyze recent changes → Quality assessment → Report
**Security focus**: `/review --focus security` → Security-specific analysis → Vulnerability report
**Comprehensive**: `/review --depth comprehensive` → Multi-agent deep analysis → Detailed report
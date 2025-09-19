---
description: Comprehensive code review with multi-dimensional analysis
argument-hint: --scope SCOPE --focus FOCUS --depth DEPTH --output FORMAT
allowed-tools: ["Read", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: sonnet
---

Comprehensive code review workflow:
1. Analyze changes for quality, security, and maintainability
2. Check adherence to project standards and best practices
3. Validate test coverage and quality
4. Assess performance implications
5. Provide detailed feedback and recommendations

Process:
- Use context-analyzer to understand change context
- Use code-reviewer for comprehensive quality assessment
- Use security-auditor for security-focused review (if sensitive)
- Use test-engineer to validate test coverage and quality
- Use appropriate domain specialists for technical review
- Generate detailed review report with categorized feedback
- Provide recommendations for improvement
- Update review tracking in project status

Parameters from $ARGUMENTS:
- --scope: Review scope (changes, file, module, full)
- --focus: Review focus (security, performance, quality, all)
- --depth: Review depth (quick, standard, comprehensive)
- --output: Output format (summary, detailed, checklist)
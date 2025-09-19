---
description: OWASP-compliant security assessment with vulnerability remediation
argument-hint: --scope SCOPE --depth DEPTH --compliance FRAMEWORK --output FORMAT
allowed-tools: ["Read", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: "claude-opus-4-1"
---

Comprehensive security assessment workflow:
1. Scan for common security vulnerabilities (OWASP Top 10)
2. Analyze authentication and authorization implementation
3. Review data protection and privacy compliance
4. Assess infrastructure and deployment security
5. Generate detailed security report with remediation guidance

Process:
- Use context-analyzer to understand system architecture
- Use security-auditor for comprehensive vulnerability assessment
- Use code-reviewer for security-focused code review
- Use database-specialist for data security review (if applicable)
- Run automated security scanning tools
- Generate prioritized vulnerability report
- Provide specific remediation recommendations
- Update security documentation and procedures

Parameters from $ARGUMENTS:
- --scope: Audit scope (code, infrastructure, data, all)
- --depth: Audit depth (basic, standard, comprehensive)
- --compliance: Compliance framework (GDPR, PCI-DSS, HIPAA, SOC2)
- --output: Report format (summary, detailed, checklist)
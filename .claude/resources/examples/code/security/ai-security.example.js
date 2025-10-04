/**
 * @example AI Security Implementation
 *
 * Demonstrates:
 * - Security review processes for AI-generated code
 * - Automated detection of common security anti-patterns
 * - Human-in-the-loop validation for critical systems
 * - Risk assessment frameworks for AI code review
 * - Integration with security scanning and static analysis
 *
 * Key Patterns:
 * - Multi-layered security review combining automated and human analysis
 * - Pattern-based detection of AI-specific security vulnerabilities
 * - Risk-based escalation for human review requirements
 * - Comprehensive logging and audit trail for AI code changes
 * - Integration with existing security tools and workflows
 */

// Enhanced security review for AI-generated code
class AICodeSecurityReviewer {
  constructor(securityAnalyzer, humanReviewer, securityLogger) {
    this.analyzer = securityAnalyzer;
    this.humanReviewer = humanReviewer;
    this.logger = securityLogger;
    this.aiSecurityPatterns = this.loadSecurityPatterns();
  }

  async reviewAIGeneratedCode(code, context) {
    const review = {
      timestamp: new Date(),
      aiModel: context.aiModel,
      humanReviewer: context.humanReviewer,
      codeHash: this.generateCodeHash(code),
      securityIssues: [],
      recommendations: [],
      riskScore: 0,
      approved: false
    };

    try {
      // 1. Automated security analysis
      const automaticIssues = await this.analyzer.scanCode(code);
      review.securityIssues.push(...automaticIssues);

      // 2. AI-specific pattern analysis
      const aiSpecificIssues = this.checkAISecurityPatterns(code);
      review.securityIssues.push(...aiSpecificIssues);

      // 3. Calculate risk score
      review.riskScore = this.calculateRiskScore(review.securityIssues, context);

      // 4. Human security review (required for critical code)
      if (this.isCriticalCode(code, context) || review.riskScore >= 0.7) {
        const humanReview = await this.humanReviewer.reviewCode(code, {
          focus: 'security',
          aiGenerated: true,
          automaticIssues: review.securityIssues,
          riskScore: review.riskScore
        });

        review.humanReview = humanReview;
        review.approved = humanReview.approved;
      } else {
        // Auto-approve low-risk code with no critical issues
        review.approved = !review.securityIssues.some(issue =>
          issue.severity === 'critical' || issue.severity === 'high'
        );
      }

      // 5. Generate security recommendations
      review.recommendations = this.generateSecurityRecommendations(
        code,
        review.securityIssues
      );

      // 6. Log security review
      this.logger.logSecurityReview(review, context);

      return review;

    } catch (error) {
      this.logger.logSecurityViolation('ai_security_review_failed', {
        error: error.message,
        codeHash: review.codeHash,
        context
      });

      throw error;
    }
  }

  checkAISecurityPatterns(code) {
    const issues = [];

    // Check for common AI security anti-patterns
    for (const pattern of this.aiSecurityPatterns) {
      if (pattern.matcher(code)) {
        issues.push({
          type: 'ai_security_pattern',
          severity: pattern.severity,
          message: pattern.message,
          recommendation: pattern.recommendation,
          pattern: pattern.name,
          location: this.findPatternLocation(code, pattern)
        });
      }
    }

    return issues;
  }

  loadSecurityPatterns() {
    return [
      {
        name: 'hardcoded_credentials',
        matcher: (code) => /(?:password|secret|key|token)\s*[=:]\s*['"][^'"]{8,}['"]/.test(code),
        severity: 'critical',
        message: 'Hardcoded credentials detected in AI-generated code',
        recommendation: 'Use environment variables or secure key management services'
      },
      {
        name: 'sql_injection_risk',
        matcher: (code) => /query\s*\+|SELECT.*\+|INSERT.*\+|UPDATE.*\+|DELETE.*\+/.test(code),
        severity: 'high',
        message: 'Potential SQL injection vulnerability in string concatenation',
        recommendation: 'Use parameterized queries or ORM methods instead of string concatenation'
      },
      {
        name: 'eval_usage',
        matcher: (code) => /\beval\s*\(|new\s+Function\s*\(/.test(code),
        severity: 'high',
        message: 'Use of eval() or Function constructor detected',
        recommendation: 'Avoid dynamic code execution and use safer alternatives'
      },
      {
        name: 'unsafe_redirect',
        matcher: (code) => /redirect\([^)]*req\.|window\.location\s*=.*req\./i.test(code),
        severity: 'medium',
        message: 'Potential open redirect vulnerability',
        recommendation: 'Validate redirect URLs against allowlist or use relative URLs'
      },
      {
        name: 'command_injection',
        matcher: (code) => /exec\s*\(|spawn\s*\(|system\s*\(/i.test(code),
        severity: 'critical',
        message: 'Potential command injection through exec/spawn/system calls',
        recommendation: 'Sanitize inputs and use safe alternatives to shell execution'
      },
      {
        name: 'path_traversal',
        matcher: (code) => /\.\.\/|\.\.\\|path\.join\([^)]*req\./i.test(code),
        severity: 'high',
        message: 'Potential path traversal vulnerability',
        recommendation: 'Validate and sanitize file paths, use path.resolve() safely'
      },
      {
        name: 'unsafe_deserialization',
        matcher: (code) => /JSON\.parse\([^)]*req\.|pickle\.loads|yaml\.load\(/i.test(code),
        severity: 'high',
        message: 'Potentially unsafe deserialization of user input',
        recommendation: 'Validate input before deserialization and use safe parsing methods'
      },
      {
        name: 'weak_crypto',
        matcher: (code) => /md5|sha1|des|rc4/i.test(code),
        severity: 'medium',
        message: 'Use of weak cryptographic algorithms',
        recommendation: 'Use strong cryptographic algorithms like SHA-256, AES-256'
      },
      {
        name: 'missing_auth_check',
        matcher: (code) => /app\.(get|post|put|delete)\s*\([^)]+,\s*(?!.*auth).*req/i.test(code),
        severity: 'medium',
        message: 'API endpoint potentially missing authentication middleware',
        recommendation: 'Ensure all sensitive endpoints have proper authentication'
      },
      {
        name: 'console_log_secrets',
        matcher: (code) => /console\.log.*(?:password|token|secret|key)/i.test(code),
        severity: 'medium',
        message: 'Potential secret exposure in console logs',
        recommendation: 'Remove debug logs containing sensitive information'
      }
    ];
  }

  findPatternLocation(code, pattern) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (pattern.matcher(lines[i])) {
        return {
          line: i + 1,
          snippet: lines[i].trim()
        };
      }
    }
    return null;
  }

  calculateRiskScore(issues, context) {
    const severityWeights = {
      'critical': 0.4,
      'high': 0.3,
      'medium': 0.2,
      'low': 0.1
    };

    const contextMultipliers = {
      'authentication': 1.5,
      'authorization': 1.5,
      'payment': 2.0,
      'admin': 1.8,
      'user-data': 1.3,
      'public-api': 1.0
    };

    let baseScore = 0;
    for (const issue of issues) {
      baseScore += severityWeights[issue.severity] || 0;
    }

    // Apply context multiplier
    const contextType = this.determineContextType(context);
    const multiplier = contextMultipliers[contextType] || 1.0;

    return Math.min(baseScore * multiplier, 1.0);
  }

  determineContextType(context) {
    const codeContext = context.description?.toLowerCase() || '';
    const filename = context.filename?.toLowerCase() || '';

    if (codeContext.includes('auth') || filename.includes('auth')) {
      return 'authentication';
    }
    if (codeContext.includes('payment') || filename.includes('payment')) {
      return 'payment';
    }
    if (codeContext.includes('admin') || filename.includes('admin')) {
      return 'admin';
    }
    if (codeContext.includes('user') || filename.includes('user')) {
      return 'user-data';
    }
    if (codeContext.includes('api') || filename.includes('api')) {
      return 'public-api';
    }

    return 'general';
  }

  isCriticalCode(code, context) {
    // Determine if code requires mandatory human security review
    const criticalIndicators = [
      'authentication',
      'authorization',
      'encryption',
      'payment',
      'database',
      'admin',
      'security',
      'crypto'
    ];

    const codeText = code.toLowerCase();
    const contextText = (context.description || '').toLowerCase();

    return criticalIndicators.some(indicator =>
      codeText.includes(indicator) || contextText.includes(indicator)
    );
  }

  generateSecurityRecommendations(code, issues) {
    const recommendations = [];

    // Group issues by type
    const issuesByType = issues.reduce((acc, issue) => {
      acc[issue.type] = acc[issue.type] || [];
      acc[issue.type].push(issue);
      return acc;
    }, {});

    // Generate specific recommendations
    if (issuesByType['hardcoded_credentials']) {
      recommendations.push({
        type: 'immediate',
        priority: 'critical',
        message: 'Remove all hardcoded credentials and implement secure configuration management'
      });
    }

    if (issuesByType['sql_injection_risk']) {
      recommendations.push({
        type: 'immediate',
        priority: 'high',
        message: 'Replace string concatenation with parameterized queries or ORM methods'
      });
    }

    if (issuesByType['command_injection']) {
      recommendations.push({
        type: 'immediate',
        priority: 'critical',
        message: 'Review all shell command executions and implement input validation'
      });
    }

    // General recommendations
    if (issues.length > 3) {
      recommendations.push({
        type: 'process',
        priority: 'medium',
        message: 'Consider additional security training for AI code generation patterns'
      });
    }

    return recommendations;
  }

  generateCodeHash(code) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(code).digest('hex');
  }
}

// AI Code Security Analyzer
class AICodeAnalyzer {
  constructor() {
    this.staticAnalysisTools = this.initializeAnalysisTools();
  }

  async scanCode(code) {
    const issues = [];

    // Run static analysis tools
    for (const tool of this.staticAnalysisTools) {
      try {
        const toolIssues = await tool.analyze(code);
        issues.push(...toolIssues);
      } catch (error) {
        console.warn(`Analysis tool ${tool.name} failed:`, error.message);
      }
    }

    return issues;
  }

  initializeAnalysisTools() {
    return [
      new ESLintSecurityAnalyzer(),
      new BanditSecurityAnalyzer(),
      new SemgrepAnalyzer(),
      new CustomPatternAnalyzer()
    ];
  }
}

// Example static analysis tool implementations
class ESLintSecurityAnalyzer {
  constructor() {
    this.name = 'ESLint Security';
  }

  async analyze(code) {
    // This would integrate with actual ESLint security plugins
    const issues = [];

    // Simulate ESLint security rule checks
    if (code.includes('eval(')) {
      issues.push({
        type: 'eslint_security',
        severity: 'high',
        message: 'eval() usage detected',
        rule: 'no-eval'
      });
    }

    return issues;
  }
}

class CustomPatternAnalyzer {
  constructor() {
    this.name = 'Custom Pattern Analyzer';
  }

  async analyze(code) {
    const issues = [];

    // Custom security pattern detection
    const patterns = [
      {
        regex: /process\.env\.\w+.*console\.log/,
        severity: 'medium',
        message: 'Environment variable potentially logged to console'
      },
      {
        regex: /req\.query\.\w+.*exec|req\.params\.\w+.*exec/,
        severity: 'critical',
        message: 'User input directly used in exec() call'
      }
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(code)) {
        issues.push({
          type: 'custom_pattern',
          severity: pattern.severity,
          message: pattern.message
        });
      }
    }

    return issues;
  }
}

// Placeholder for other analyzers
class BanditSecurityAnalyzer {
  constructor() { this.name = 'Bandit'; }
  async analyze() { return []; }
}

class SemgrepAnalyzer {
  constructor() { this.name = 'Semgrep'; }
  async analyze() { return []; }
}

module.exports = {
  AICodeSecurityReviewer,
  AICodeAnalyzer,
  ESLintSecurityAnalyzer,
  CustomPatternAnalyzer
};
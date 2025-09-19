/**
 * @example Compliance and Governance Implementation
 *
 * Demonstrates:
 * - GDPR compliance implementation with data subject rights
 * - Automated security policy enforcement and violation handling
 * - Comprehensive audit logging and data processing activity tracking
 * - Privacy-preserving data handling and secure erasure procedures
 * - Regulatory compliance frameworks and policy management
 *
 * Key Patterns:
 * - Rights-based data processing with automated request handling
 * - Policy-driven security enforcement with configurable rules
 * - Audit trail maintenance for regulatory compliance
 * - Secure data lifecycle management from creation to deletion
 * - Integration with legal and compliance team workflows
 */

// GDPR-compliant data handling
class GDPRComplianceService {
  constructor(dataRepository, auditLogger, encryptionService) {
    this.data = dataRepository;
    this.audit = auditLogger;
    this.encryption = encryptionService;
  }

  async processDataSubjectRequest(requestType, userEmail, context) {
    this.audit.logDataProcessingActivity({
      type: 'data_subject_request',
      requestType,
      userEmail,
      requestedBy: context.requestedBy,
      ipAddress: context.ipAddress,
      timestamp: new Date(),
      legalBasis: this.determineLegalBasis(requestType)
    });

    try {
      switch (requestType) {
        case 'access':
          return await this.handleAccessRequest(userEmail, context);
        case 'rectification':
          return await this.handleRectificationRequest(userEmail, context);
        case 'erasure':
          return await this.handleErasureRequest(userEmail, context);
        case 'portability':
          return await this.handlePortabilityRequest(userEmail, context);
        case 'restriction':
          return await this.handleRestrictionRequest(userEmail, context);
        case 'objection':
          return await this.handleObjectionRequest(userEmail, context);
        default:
          throw new ValidationError('Invalid request type');
      }
    } catch (error) {
      this.audit.logDataProcessingActivity({
        type: 'data_subject_request_failed',
        requestType,
        userEmail,
        error: error.message,
        timestamp: new Date()
      });
      throw error;
    }
  }

  async handleAccessRequest(userEmail, context) {
    const user = await this.data.findUserByEmail(userEmail);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Collect all personal data across systems
    const personalData = await this.collectUserData(user.id);

    // Decrypt sensitive data for the access request
    const decryptedData = await this.decryptPersonalData(personalData);

    // Create structured export
    const accessReport = {
      requestId: crypto.randomUUID(),
      userId: user.id,
      email: userEmail,
      generatedAt: new Date(),
      dataCategories: {
        profile: decryptedData.profile,
        preferences: decryptedData.preferences,
        activityHistory: decryptedData.activity,
        communications: decryptedData.communications
      },
      processingPurposes: this.getProcessingPurposes(),
      retentionPeriods: this.getRetentionPeriods(),
      thirdPartySharing: this.getThirdPartySharing(user.id)
    };

    this.audit.logDataAccess('export', 'full_user_data', user.id, {
      success: true,
      recordCount: Object.keys(accessReport.dataCategories).length,
      requestId: accessReport.requestId
    });

    return accessReport;
  }

  async handleErasureRequest(userEmail, context) {
    const user = await this.data.findUserByEmail(userEmail);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check for legal basis to retain data
    const retentionCheck = await this.checkDataRetentionRequirements(user.id);

    if (retentionCheck.mustRetain) {
      return {
        success: false,
        reason: 'legal_retention_requirement',
        details: retentionCheck.reasons,
        partialErasure: retentionCheck.erasableData,
        retentionPeriod: retentionCheck.retentionPeriod
      };
    }

    // Perform cascading deletion with proper audit trail
    const deletionResults = await this.performSecureErasure(user.id);

    this.audit.logDataProcessingActivity({
      type: 'data_erasure',
      userId: user.id,
      userEmail,
      deletionResults,
      requestedBy: context.requestedBy,
      timestamp: new Date(),
      verificationRequired: true
    });

    // Schedule verification of erasure completion
    await this.scheduleErasureVerification(user.id, deletionResults.requestId);

    return {
      success: true,
      deletedRecords: deletionResults.totalRecords,
      completionDate: new Date(),
      requestId: deletionResults.requestId,
      verificationScheduled: true
    };
  }

  async performSecureErasure(userId) {
    const requestId = crypto.randomUUID();
    const deletionResults = {
      requestId,
      userProfile: 0,
      userActivity: 0,
      userContent: 0,
      communications: 0,
      preferences: 0,
      totalRecords: 0,
      anonymizedRecords: 0
    };

    // Use database transactions for consistency
    return await this.data.transaction(async (tx) => {
      // Delete user profile
      deletionResults.userProfile = await tx.users.delete({ id: userId });

      // Delete user activity logs (keeping anonymized analytics)
      deletionResults.userActivity = await tx.userActivity.delete({ userId });

      // Delete user-generated content
      deletionResults.userContent = await tx.userContent.delete({ authorId: userId });

      // Delete communications
      deletionResults.communications = await tx.communications.delete({ userId });

      // Delete preferences
      deletionResults.preferences = await tx.userPreferences.delete({ userId });

      // Anonymize data that must be retained for legal/business reasons
      const anonymizationResult = await tx.transactions.update(
        { userId },
        {
          userId: null,
          userEmail: '[DELETED]',
          anonymized: true,
          anonymizedAt: new Date(),
          originalUserId: crypto.createHash('sha256').update(userId).digest('hex') // One-way hash for correlation if needed
        }
      );

      deletionResults.anonymizedRecords = anonymizationResult.affectedRows;

      deletionResults.totalRecords =
        deletionResults.userProfile +
        deletionResults.userActivity +
        deletionResults.userContent +
        deletionResults.communications +
        deletionResults.preferences;

      // Create erasure verification record
      await tx.erasureVerifications.create({
        requestId,
        userId,
        deletionResults,
        scheduledVerification: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'pending'
      });

      return deletionResults;
    });
  }

  async checkDataRetentionRequirements(userId) {
    const requirements = [];
    let mustRetain = false;
    const erasableData = [];

    // Check legal requirements
    const legalHolds = await this.data.legalHolds.find({ userId, active: true });
    if (legalHolds.length > 0) {
      mustRetain = true;
      requirements.push({
        type: 'legal_hold',
        reason: 'Active legal proceedings require data retention',
        until: legalHolds[0].expiryDate
      });
    }

    // Check financial/tax requirements
    const financialRecords = await this.data.transactions.find({
      userId,
      createdAt: { gte: new Date(Date.now() - 7 * 365 * 24 * 60 * 60 * 1000) } // 7 years
    });

    if (financialRecords.length > 0) {
      mustRetain = true;
      requirements.push({
        type: 'financial_records',
        reason: 'Financial records must be retained for 7 years',
        until: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000)
      });
    } else {
      erasableData.push('financial_history');
    }

    // Other data can be erased
    erasableData.push('profile', 'preferences', 'communications', 'activity_logs');

    return {
      mustRetain,
      reasons: requirements,
      erasableData,
      retentionPeriod: mustRetain ? Math.max(...requirements.map(r => r.until)) : null
    };
  }

  determineLegalBasis(requestType) {
    const legalBasisMap = {
      'access': 'Art. 15 GDPR - Right of access',
      'rectification': 'Art. 16 GDPR - Right to rectification',
      'erasure': 'Art. 17 GDPR - Right to erasure',
      'portability': 'Art. 20 GDPR - Right to data portability',
      'restriction': 'Art. 18 GDPR - Right to restriction of processing',
      'objection': 'Art. 21 GDPR - Right to object'
    };

    return legalBasisMap[requestType] || 'Unknown';
  }
}

// Automated security policy enforcement
class SecurityPolicyEnforcer {
  constructor(policyRepository, violationHandler, auditLogger) {
    this.policies = policyRepository;
    this.violations = violationHandler;
    this.audit = auditLogger;
  }

  async enforceSecurityPolicies(request, context) {
    const enforcement = {
      timestamp: new Date(),
      requestId: context.requestId || crypto.randomUUID(),
      policies: [],
      violations: [],
      actions: [],
      compliant: true
    };

    try {
      const applicablePolicies = await this.getApplicablePolicies(request, context);
      enforcement.policies = applicablePolicies.map(p => ({ id: p.id, name: p.name }));

      for (const policy of applicablePolicies) {
        const evaluation = await this.evaluatePolicy(policy, request, context);

        if (!evaluation.compliant) {
          enforcement.compliant = false;
          enforcement.violations.push({
            policyId: policy.id,
            policyName: policy.name,
            severity: policy.severity,
            violation: evaluation.violation,
            remediation: evaluation.remediation,
            riskLevel: evaluation.riskLevel
          });

          // Take immediate action for critical violations
          if (policy.severity === 'critical') {
            const action = await this.handleCriticalViolation(policy, evaluation, context);
            enforcement.actions.push(action);
          }
        }
      }

      if (enforcement.violations.length > 0) {
        await this.handlePolicyViolations(enforcement.violations, request, context);
      }

      // Log enforcement activity
      this.audit.logPolicyEnforcement(enforcement);

      return enforcement;

    } catch (error) {
      this.audit.logSecurityViolation('policy_enforcement_failed', {
        error: error.message,
        requestId: enforcement.requestId
      }, context);

      throw error;
    }
  }

  async evaluatePolicy(policy, request, context) {
    switch (policy.type) {
      case 'authentication_strength':
        return this.evaluateAuthenticationPolicy(policy, request, context);
      case 'data_classification':
        return this.evaluateDataClassificationPolicy(policy, request, context);
      case 'access_control':
        return this.evaluateAccessControlPolicy(policy, request, context);
      case 'encryption_requirement':
        return this.evaluateEncryptionPolicy(policy, request, context);
      case 'data_retention':
        return this.evaluateDataRetentionPolicy(policy, request, context);
      default:
        throw new Error(`Unknown policy type: ${policy.type}`);
    }
  }

  async evaluateAuthenticationPolicy(policy, request, context) {
    const requirements = policy.requirements;
    const violations = [];

    // Check MFA requirement
    if (requirements.mfaRequired && !context.mfaVerified) {
      violations.push('MFA required but not verified');
    }

    // Check session age
    if (requirements.maxSessionAge) {
      const sessionAge = Date.now() - new Date(context.sessionCreated).getTime();
      if (sessionAge > requirements.maxSessionAge) {
        violations.push('Session exceeds maximum age');
      }
    }

    // Check password strength requirements
    if (requirements.passwordComplexity && context.passwordScore < requirements.passwordComplexity) {
      violations.push('Password does not meet complexity requirements');
    }

    return {
      compliant: violations.length === 0,
      violation: violations.join(', '),
      remediation: 'Ensure strong authentication methods are used',
      riskLevel: this.calculateRiskLevel(violations.length, policy.severity)
    };
  }

  async evaluateDataClassificationPolicy(policy, request, context) {
    const dataClassification = await this.classifyRequestData(request);
    const violations = [];

    // Check if sensitive data requires encryption
    if (dataClassification.containsPII && !context.encrypted) {
      violations.push('PII data transmitted without encryption');
    }

    // Check access controls for classified data
    if (dataClassification.classification === 'confidential' && !this.hasRequiredClearance(context.user, 'confidential')) {
      violations.push('Insufficient clearance for confidential data');
    }

    return {
      compliant: violations.length === 0,
      violation: violations.join(', '),
      remediation: 'Ensure proper data classification and access controls',
      riskLevel: this.calculateRiskLevel(violations.length, policy.severity)
    };
  }

  async handleCriticalViolation(policy, evaluation, context) {
    const action = {
      type: 'critical_violation_response',
      policyId: policy.id,
      timestamp: new Date(),
      response: null
    };

    switch (policy.criticalResponse) {
      case 'block_request':
        action.response = 'Request blocked due to critical policy violation';
        throw new SecurityPolicyError('Critical security policy violation', evaluation);

      case 'require_additional_auth':
        action.response = 'Additional authentication required';
        await this.requireAdditionalAuthentication(context.user.id);
        break;

      case 'alert_security_team':
        action.response = 'Security team alerted';
        await this.alertSecurityTeam(policy, evaluation, context);
        break;
    }

    return action;
  }

  calculateRiskLevel(violationCount, severity) {
    const baseRisk = {
      'critical': 0.8,
      'high': 0.6,
      'medium': 0.4,
      'low': 0.2
    }[severity] || 0.1;

    return Math.min(baseRisk * (1 + violationCount * 0.2), 1.0);
  }
}

// Audit Trail Management
class ComplianceAuditService {
  constructor(auditRepository) {
    this.audit = auditRepository;
  }

  async logDataProcessingActivity(activity) {
    const auditRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: activity.type,
      dataSubject: activity.userEmail || activity.userId,
      legalBasis: activity.legalBasis,
      purpose: activity.purpose || 'Not specified',
      dataCategories: activity.dataCategories || [],
      recipients: activity.recipients || [],
      retention: activity.retentionPeriod,
      details: activity.details,
      processedBy: activity.processedBy,
      ipAddress: activity.ipAddress,
      result: activity.result || 'success'
    };

    await this.audit.create(auditRecord);
    return auditRecord;
  }

  async generateComplianceReport(timeframe, regulations = ['GDPR']) {
    const report = {
      generatedAt: new Date(),
      timeframe,
      regulations,
      summary: {},
      details: {},
      recommendations: []
    };

    for (const regulation of regulations) {
      switch (regulation) {
        case 'GDPR':
          report.details.gdpr = await this.generateGDPRReport(timeframe);
          break;
        case 'CCPA':
          report.details.ccpa = await this.generateCCPAReport(timeframe);
          break;
      }
    }

    report.summary = this.summarizeCompliance(report.details);
    report.recommendations = this.generateRecommendations(report.details);

    return report;
  }

  async generateGDPRReport(timeframe) {
    const startDate = this.parseTimeframe(timeframe);

    return {
      dataSubjectRequests: await this.audit.count({
        type: { in: ['data_subject_request', 'data_subject_request_failed'] },
        timestamp: { gte: startDate }
      }),
      dataBreaches: await this.audit.count({
        type: 'data_breach',
        timestamp: { gte: startDate }
      }),
      processingActivities: await this.audit.count({
        type: 'data_processing',
        timestamp: { gte: startDate }
      }),
      consentUpdates: await this.audit.count({
        type: 'consent_update',
        timestamp: { gte: startDate }
      }),
      erasureRequests: await this.audit.count({
        type: 'data_erasure',
        timestamp: { gte: startDate }
      })
    };
  }
}

// Custom Error Classes
class SecurityPolicyError extends Error {
  constructor(message, violations) {
    super(message);
    this.name = 'SecurityPolicyError';
    this.violations = violations;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

module.exports = {
  GDPRComplianceService,
  SecurityPolicyEnforcer,
  ComplianceAuditService,
  SecurityPolicyError,
  NotFoundError,
  ValidationError
};
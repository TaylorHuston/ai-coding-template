/**
 * Attribute-Based Access Control (ABAC) Implementation Example
 *
 * Advanced context-aware authorization with dynamic rule evaluation
 *
 * Features:
 * - Context-aware policy evaluation
 * - Time-based access control
 * - Location-based restrictions
 * - Resource ownership validation
 * - Dynamic attribute evaluation
 * - Sandboxed JavaScript execution
 */

const vm = require('vm');

class ABACAuthorizationService {
  constructor(policyRepository, auditService) {
    this.policies = policyRepository;
    this.audit = auditService;
  }

  async evaluatePolicy(subject, resource, action, context = {}) {
    const policy = await this.getPolicy(resource, action);

    const evaluationContext = {
      subject: await this.getSubjectAttributes(subject),
      resource: await this.getResourceAttributes(resource),
      action: action,
      environment: {
        time: new Date(),
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        location: context.location
      }
    };

    const result = this.evaluateRules(policy.rules, evaluationContext);

    // Audit the decision
    await this.audit.logAuthorizationDecision({
      subject: subject,
      resource: resource,
      action: action,
      decision: result,
      policyId: policy.id,
      context: evaluationContext,
      timestamp: new Date()
    });

    return result;
  }

  evaluateRules(rules, context) {
    return rules.every(rule => {
      try {
        switch (rule.type) {
          case 'time_based':
            return this.evaluateTimeRule(rule, context.environment.time);
          case 'location_based':
            return this.evaluateLocationRule(rule, context.environment.location);
          case 'role_based':
            return this.evaluateRoleRule(rule, context.subject.roles);
          case 'resource_owner':
            return this.evaluateOwnershipRule(rule, context);
          case 'dynamic_attribute':
            return this.evaluateDynamicRule(rule, context);
          case 'risk_based':
            return this.evaluateRiskRule(rule, context);
          default:
            this.logPolicyEvaluationError(rule, new Error(`Unknown rule type: ${rule.type}`));
            return false;
        }
      } catch (error) {
        this.logPolicyEvaluationError(rule, error);
        return false; // Fail secure on evaluation errors
      }
    });
  }

  evaluateTimeRule(rule, currentTime) {
    const hour = currentTime.getHours();
    const dayOfWeek = currentTime.getDay();
    const date = currentTime.getDate();
    const month = currentTime.getMonth();

    // Check allowed hours
    if (rule.allowedHours && !rule.allowedHours.includes(hour)) {
      return false;
    }

    // Check blocked hours
    if (rule.blockedHours && rule.blockedHours.includes(hour)) {
      return false;
    }

    // Check allowed days of week (0 = Sunday, 6 = Saturday)
    if (rule.allowedDays && !rule.allowedDays.includes(dayOfWeek)) {
      return false;
    }

    // Check date ranges
    if (rule.allowedDateRange) {
      const start = new Date(rule.allowedDateRange.start);
      const end = new Date(rule.allowedDateRange.end);

      if (currentTime < start || currentTime > end) {
        return false;
      }
    }

    // Check specific blocked dates
    if (rule.blockedDates) {
      const currentDateString = currentTime.toISOString().split('T')[0];
      if (rule.blockedDates.includes(currentDateString)) {
        return false;
      }
    }

    return true;
  }

  evaluateLocationRule(rule, location) {
    if (!location) {
      return rule.allowUnknownLocation || false;
    }

    // Check allowed countries
    if (rule.allowedCountries && !rule.allowedCountries.includes(location.country)) {
      return false;
    }

    // Check blocked countries
    if (rule.blockedCountries && rule.blockedCountries.includes(location.country)) {
      return false;
    }

    // Check allowed IP ranges
    if (rule.allowedIpRanges) {
      return rule.allowedIpRanges.some(range => this.isIpInRange(location.ip, range));
    }

    // Check blocked IP ranges
    if (rule.blockedIpRanges) {
      const inBlockedRange = rule.blockedIpRanges.some(range => this.isIpInRange(location.ip, range));
      if (inBlockedRange) {
        return false;
      }
    }

    // Check geofencing (requires coordinates)
    if (rule.allowedRegions && location.coordinates) {
      return rule.allowedRegions.some(region =>
        this.isPointInPolygon(location.coordinates, region.boundary)
      );
    }

    return true;
  }

  evaluateRoleRule(rule, userRoles) {
    // Check required roles
    if (rule.requiredRoles) {
      return rule.requiredRoles.every(role => userRoles.includes(role));
    }

    // Check forbidden roles
    if (rule.forbiddenRoles) {
      return !rule.forbiddenRoles.some(role => userRoles.includes(role));
    }

    // Check minimum role level
    if (rule.minimumRoleLevel) {
      const maxUserLevel = Math.max(...userRoles.map(role => this.getRoleLevel(role)));
      return maxUserLevel >= rule.minimumRoleLevel;
    }

    return true;
  }

  evaluateOwnershipRule(rule, context) {
    // Check if subject owns the resource
    if (rule.requireOwnership) {
      return context.resource.ownerId === context.subject.id;
    }

    // Check if subject is in the same organization
    if (rule.requireSameOrganization) {
      return context.resource.organizationId === context.subject.organizationId;
    }

    // Check if subject is in the same department
    if (rule.requireSameDepartment) {
      return context.resource.departmentId === context.subject.departmentId;
    }

    // Check if subject is in the same team
    if (rule.requireSameTeam) {
      return context.resource.teamId === context.subject.teamId;
    }

    return true;
  }

  evaluateRiskRule(rule, context) {
    let riskScore = 0;

    // Location risk
    if (context.environment.location) {
      if (rule.riskFactors.highRiskCountries?.includes(context.environment.location.country)) {
        riskScore += 30;
      }
    }

    // Time risk
    const hour = context.environment.time.getHours();
    if (rule.riskFactors.offHours && (hour < 8 || hour > 18)) {
      riskScore += 20;
    }

    // New device risk
    if (context.subject.isNewDevice) {
      riskScore += 25;
    }

    // Multiple failed attempts
    if (context.subject.recentFailedAttempts > 3) {
      riskScore += 35;
    }

    // IP reputation risk
    if (context.environment.ipReputation === 'bad') {
      riskScore += 40;
    }

    return riskScore <= (rule.maxRiskScore || 50);
  }

  evaluateDynamicRule(rule, context) {
    // Support for custom JavaScript evaluation (carefully sandboxed)
    try {
      const sandbox = {
        subject: context.subject,
        resource: context.resource,
        action: context.action,
        environment: context.environment,
        helpers: this.getHelperFunctions(),
        Math: Math,
        Date: Date,
        console: { log: () => {} } // Disabled console for security
      };

      const script = new vm.Script(rule.condition);
      const vmContext = vm.createContext(sandbox);

      return script.runInContext(vmContext, {
        timeout: 1000,
        microtaskMode: 'afterEvaluate'
      });
    } catch (error) {
      // Fail secure on evaluation errors
      this.logPolicyEvaluationError(rule, error);
      return false;
    }
  }

  getHelperFunctions() {
    return {
      isInRole: (subject, role) => subject.roles.includes(role),
      hasAttribute: (obj, attr, value) => obj[attr] === value,
      isWithinTimeRange: (start, end) => {
        const now = new Date();
        return now >= new Date(start) && now <= new Date(end);
      },
      hasPermission: (subject, permission) => subject.permissions.includes(permission),
      isInDepartment: (subject, department) => subject.department === department,
      hasSecurityClearance: (subject, level) => subject.securityClearance >= level,
      daysSinceLastLogin: (subject) => {
        if (!subject.lastLoginDate) return Infinity;
        return Math.floor((Date.now() - new Date(subject.lastLoginDate)) / (1000 * 60 * 60 * 24));
      }
    };
  }

  isIpInRange(ip, range) {
    // Implementation for IP range checking (CIDR notation)
    // This is a simplified version - use a proper IP library in production
    if (range.includes('/')) {
      // CIDR notation
      const [network, prefixLength] = range.split('/');
      // Implement CIDR matching logic
      return this.ipMatchesCIDR(ip, network, parseInt(prefixLength));
    } else {
      // Single IP
      return ip === range;
    }
  }

  ipMatchesCIDR(ip, network, prefixLength) {
    // Simplified IPv4 CIDR matching
    // In production, use a proper networking library
    const ipOctets = ip.split('.').map(Number);
    const networkOctets = network.split('.').map(Number);

    const mask = Math.pow(2, 32) - Math.pow(2, 32 - prefixLength);
    const ipInt = (ipOctets[0] << 24) + (ipOctets[1] << 16) + (ipOctets[2] << 8) + ipOctets[3];
    const networkInt = (networkOctets[0] << 24) + (networkOctets[1] << 16) + (networkOctets[2] << 8) + networkOctets[3];

    return (ipInt & mask) === (networkInt & mask);
  }

  isPointInPolygon(point, polygon) {
    // Ray casting algorithm for point-in-polygon test
    const x = point.latitude;
    const y = point.longitude;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].latitude;
      const yi = polygon[i].longitude;
      const xj = polygon[j].latitude;
      const yj = polygon[j].longitude;

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }

  getRoleLevel(roleName) {
    // Define role hierarchy levels
    const roleLevels = {
      'super_admin': 10,
      'admin': 8,
      'manager': 6,
      'senior_user': 4,
      'user': 2,
      'guest': 1
    };

    return roleLevels[roleName] || 0;
  }

  async logPolicyEvaluationError(rule, error) {
    await this.audit.logError({
      type: 'policy_evaluation_error',
      ruleType: rule.type,
      ruleId: rule.id,
      error: error.message,
      timestamp: new Date()
    });
  }

  // Repository interface methods (to be implemented)
  async getPolicy(resource, action) {
    // Implement policy retrieval
    throw new Error('Not implemented');
  }

  async getSubjectAttributes(subject) {
    // Implement subject attributes retrieval
    throw new Error('Not implemented');
  }

  async getResourceAttributes(resource) {
    // Implement resource attributes retrieval
    throw new Error('Not implemented');
  }
}

// Example ABAC policies
const createExamplePolicies = () => {
  return {
    documentAccess: {
      id: 'doc_access_001',
      resource: 'document',
      action: 'read',
      rules: [
        {
          id: 'org_membership',
          type: 'resource_owner',
          requireOwnership: false,
          requireSameOrganization: true
        },
        {
          id: 'business_hours',
          type: 'time_based',
          allowedHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          allowedDays: [1, 2, 3, 4, 5]
        },
        {
          id: 'geo_restriction',
          type: 'location_based',
          allowedCountries: ['US', 'CA', 'GB'],
          allowUnknownLocation: false
        },
        {
          id: 'clearance_check',
          type: 'dynamic_attribute',
          condition: `
            subject.department === 'legal' ||
            (subject.clearanceLevel >= resource.classificationLevel &&
             subject.needToKnow.includes(resource.category))
          `
        }
      ]
    },

    sensitiveOperation: {
      id: 'sensitive_op_001',
      resource: 'financial_data',
      action: 'modify',
      rules: [
        {
          id: 'high_privilege',
          type: 'role_based',
          requiredRoles: ['financial_admin'],
          minimumRoleLevel: 8
        },
        {
          id: 'secure_location',
          type: 'location_based',
          allowedIpRanges: ['192.168.1.0/24', '10.0.0.0/8'],
          allowedCountries: ['US']
        },
        {
          id: 'low_risk',
          type: 'risk_based',
          maxRiskScore: 20,
          riskFactors: {
            highRiskCountries: ['CN', 'RU', 'IR'],
            offHours: true
          }
        },
        {
          id: 'multi_factor',
          type: 'dynamic_attribute',
          condition: `
            subject.mfaVerified &&
            subject.lastMfaCheck < (Date.now() - 10 * 60 * 1000) // 10 minutes
          `
        }
      ]
    }
  };
};

module.exports = {
  ABACAuthorizationService,
  createExamplePolicies
};
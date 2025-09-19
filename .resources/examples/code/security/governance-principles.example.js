/**
 * Security Governance and Principles Examples
 *
 * Implementation examples for core security principles including least privilege,
 * zero trust architecture, fail-secure patterns, and security governance.
 *
 * Features:
 * - Principle of least privilege implementation
 * - Zero trust verification framework
 * - Fail-secure authorization patterns
 * - Permission auditing and lifecycle management
 * - Trust scoring and risk assessment
 */

const crypto = require('crypto');

/**
 * Permission Service implementing Principle of Least Privilege
 * Provides granular permission management with automatic auditing
 */
class PermissionService {
  constructor(database, auditLogger) {
    this.db = database;
    this.auditLogger = auditLogger;
  }

  /**
   * Grant minimal required access for specific operation
   * @param {string} userId - User identifier
   * @param {string} resourceType - Type of resource
   * @param {string} operation - Operation to perform
   */
  async grantMinimalAccess(userId, resourceType, operation) {
    const requiredPermissions = this.calculateMinimalPermissions(resourceType, operation);

    // Only grant the specific permissions needed
    for (const permission of requiredPermissions) {
      await this.grantTemporaryPermission(userId, permission, {
        duration: '1h',
        resource: resourceType,
        justification: `Required for ${operation}`,
        grantor: 'system',
        grantedAt: new Date()
      });

      // Log permission grant
      await this.auditLogger.log('permission_granted', {
        userId,
        permission: permission.name,
        resource: resourceType,
        operation,
        duration: '1h'
      });
    }
  }

  /**
   * Calculate minimal permissions required for operation
   * @param {string} resourceType - Resource type
   * @param {string} operation - Operation
   * @returns {Array} Required permissions
   */
  calculateMinimalPermissions(resourceType, operation) {
    const permissionMatrix = {
      'user_profile': {
        'read': ['profile.read'],
        'update': ['profile.read', 'profile.write'],
        'delete': ['profile.read', 'profile.delete']
      },
      'document': {
        'read': ['document.read'],
        'create': ['document.create'],
        'update': ['document.read', 'document.write'],
        'delete': ['document.read', 'document.delete'],
        'share': ['document.read', 'document.share']
      },
      'admin_panel': {
        'read': ['admin.read'],
        'manage_users': ['admin.read', 'admin.user_management'],
        'system_config': ['admin.read', 'admin.system_config']
      }
    };

    const resourcePermissions = permissionMatrix[resourceType];
    if (!resourcePermissions) {
      throw new Error(`Unknown resource type: ${resourceType}`);
    }

    const permissions = resourcePermissions[operation];
    if (!permissions) {
      throw new Error(`Unknown operation ${operation} for resource ${resourceType}`);
    }

    return permissions.map(name => ({ name, level: 'minimal' }));
  }

  /**
   * Grant temporary permission with automatic expiration
   * @param {string} userId - User ID
   * @param {Object} permission - Permission object
   * @param {Object} options - Grant options
   */
  async grantTemporaryPermission(userId, permission, options) {
    const expiresAt = new Date(Date.now() + this.parseDuration(options.duration));

    await this.db.permissions.create({
      userId,
      permission: permission.name,
      resource: options.resource,
      justification: options.justification,
      grantor: options.grantor,
      grantedAt: options.grantedAt,
      expiresAt,
      temporary: true
    });

    // Schedule automatic revocation
    await this.schedulePermissionRevocation(userId, permission.name, expiresAt);
  }

  /**
   * Regularly audit and revoke unnecessary permissions
   * @param {string} userId - User ID
   */
  async auditPermissions(userId) {
    const userPermissions = await this.getUserPermissions(userId);
    const activeUsage = await this.getPermissionUsage(userId, '30d');

    const unusedPermissions = userPermissions.filter(
      permission => !activeUsage.includes(permission.id)
    );

    if (unusedPermissions.length > 0) {
      await this.schedulePermissionReview(userId, unusedPermissions);

      // Log audit findings
      await this.auditLogger.log('permission_audit', {
        userId,
        totalPermissions: userPermissions.length,
        unusedPermissions: unusedPermissions.length,
        reviewScheduled: true
      });
    }
  }

  /**
   * Parse duration string to milliseconds
   * @param {string} duration - Duration string (e.g., '1h', '30m', '1d')
   * @returns {number} Duration in milliseconds
   */
  parseDuration(duration) {
    const units = { h: 3600000, m: 60000, d: 86400000, s: 1000 };
    const match = duration.match(/^(\d+)([hmds])$/);

    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }

    const [, value, unit] = match;
    return parseInt(value) * units[unit];
  }

  /**
   * Get user permissions
   * @param {string} userId - User ID
   * @returns {Array} User permissions
   */
  async getUserPermissions(userId) {
    return await this.db.permissions.findMany({
      where: { userId, expiresAt: { gt: new Date() } }
    });
  }

  /**
   * Get permission usage statistics
   * @param {string} userId - User ID
   * @param {string} period - Period to analyze
   * @returns {Array} Used permission IDs
   */
  async getPermissionUsage(userId, period) {
    const since = new Date(Date.now() - this.parseDuration(period));

    const usageLogs = await this.db.auditLogs.findMany({
      where: {
        userId,
        action: 'permission_used',
        timestamp: { gte: since }
      }
    });

    return [...new Set(usageLogs.map(log => log.permissionId))];
  }

  /**
   * Schedule permission review
   * @param {string} userId - User ID
   * @param {Array} permissions - Permissions to review
   */
  async schedulePermissionReview(userId, permissions) {
    await this.db.permissionReviews.create({
      userId,
      permissions: permissions.map(p => p.id),
      scheduledAt: new Date(),
      status: 'pending',
      priority: permissions.length > 5 ? 'high' : 'normal'
    });
  }

  /**
   * Schedule automatic permission revocation
   * @param {string} userId - User ID
   * @param {string} permissionName - Permission name
   * @param {Date} expiresAt - Expiration date
   */
  async schedulePermissionRevocation(userId, permissionName, expiresAt) {
    // Implementation would use job queue or scheduler
    console.log(`Scheduled revocation of ${permissionName} for user ${userId} at ${expiresAt}`);
  }
}

/**
 * Zero Trust Verification Framework
 * Implements comprehensive trust scoring and risk assessment
 */
class ZeroTrustVerifier {
  constructor(riskEngine, deviceService, locationService, behaviorAnalyzer) {
    this.riskEngine = riskEngine;
    this.deviceService = deviceService;
    this.locationService = locationService;
    this.behaviorAnalyzer = behaviorAnalyzer;
  }

  /**
   * Verify request using zero trust principles
   * @param {Object} request - Request to verify
   * @returns {Object} Verification result
   */
  async verifyRequest(request) {
    const verificationResults = await Promise.all([
      this.verifyIdentity(request.user),
      this.verifyDevice(request.deviceFingerprint),
      this.verifyLocation(request.ipAddress),
      this.verifyBehavior(request.user, request.pattern),
      this.verifyResource(request.resource),
      this.verifyContext(request.context)
    ]);

    const trustScore = this.calculateTrustScore(verificationResults);
    const riskLevel = this.assessRisk(request, trustScore);

    return {
      allowed: trustScore >= this.getRequiredTrustScore(request.resource),
      trustScore,
      riskLevel,
      additionalControls: this.getAdditionalControls(riskLevel),
      verificationDetails: verificationResults
    };
  }

  /**
   * Calculate overall trust score from verification results
   * @param {Array} verificationResults - Individual verification results
   * @returns {number} Trust score (0-1)
   */
  calculateTrustScore(verificationResults) {
    const weights = {
      identity: 0.3,
      device: 0.2,
      location: 0.15,
      behavior: 0.2,
      resource: 0.1,
      context: 0.05
    };

    return verificationResults.reduce((score, result, index) => {
      const factor = Object.values(weights)[index];
      return score + (result.confidence * factor);
    }, 0);
  }

  /**
   * Verify user identity
   * @param {Object} user - User object
   * @returns {Object} Identity verification result
   */
  async verifyIdentity(user) {
    // Check MFA status
    const mfaVerified = await this.checkMFAStatus(user.id);

    // Check account status
    const accountStatus = await this.checkAccountStatus(user.id);

    // Check password age
    const passwordAge = await this.getPasswordAge(user.id);

    let confidence = 0.5; // Base confidence

    if (mfaVerified) confidence += 0.3;
    if (accountStatus === 'active') confidence += 0.1;
    if (passwordAge < 90) confidence += 0.1; // Recent password change

    return {
      type: 'identity',
      confidence: Math.min(confidence, 1.0),
      factors: { mfaVerified, accountStatus, passwordAge }
    };
  }

  /**
   * Verify device fingerprint
   * @param {string} deviceFingerprint - Device fingerprint
   * @returns {Object} Device verification result
   */
  async verifyDevice(deviceFingerprint) {
    const deviceInfo = await this.deviceService.getDeviceInfo(deviceFingerprint);

    let confidence = 0.3; // Base confidence for unknown devices

    if (deviceInfo.known) confidence += 0.4;
    if (deviceInfo.trusted) confidence += 0.3;
    if (deviceInfo.lastSeen && this.isRecentlyUsed(deviceInfo.lastSeen)) {
      confidence += 0.2;
    }

    return {
      type: 'device',
      confidence: Math.min(confidence, 1.0),
      factors: deviceInfo
    };
  }

  /**
   * Verify location
   * @param {string} ipAddress - IP address
   * @returns {Object} Location verification result
   */
  async verifyLocation(ipAddress) {
    const locationInfo = await this.locationService.getLocationInfo(ipAddress);

    let confidence = 0.5; // Base confidence

    // Check against user's typical locations
    const typicalLocations = await this.getUserTypicalLocations(ipAddress);
    if (this.isTypicalLocation(locationInfo, typicalLocations)) {
      confidence += 0.3;
    } else {
      confidence -= 0.2; // Penalty for unusual location
    }

    // Check for VPN/Tor usage
    if (locationInfo.isVPN || locationInfo.isTor) {
      confidence -= 0.3;
    }

    return {
      type: 'location',
      confidence: Math.max(Math.min(confidence, 1.0), 0.0),
      factors: locationInfo
    };
  }

  /**
   * Verify behavior patterns
   * @param {Object} user - User object
   * @param {Object} pattern - Current behavior pattern
   * @returns {Object} Behavior verification result
   */
  async verifyBehavior(user, pattern) {
    const behaviorProfile = await this.behaviorAnalyzer.getUserProfile(user.id);
    const anomalyScore = await this.behaviorAnalyzer.calculateAnomalyScore(pattern, behaviorProfile);

    // Lower anomaly score = higher confidence
    const confidence = Math.max(1.0 - anomalyScore, 0.0);

    return {
      type: 'behavior',
      confidence,
      factors: { anomalyScore, pattern, profile: behaviorProfile }
    };
  }

  /**
   * Verify resource access requirements
   * @param {Object} resource - Resource being accessed
   * @returns {Object} Resource verification result
   */
  async verifyResource(resource) {
    const sensitivity = this.getResourceSensitivity(resource);
    const accessHistory = await this.getResourceAccessHistory(resource);

    let confidence = 0.7; // Base confidence

    // Adjust based on resource sensitivity
    if (sensitivity === 'high') confidence -= 0.2;
    if (sensitivity === 'critical') confidence -= 0.4;

    // Consider access patterns
    if (accessHistory.suspicious) confidence -= 0.3;

    return {
      type: 'resource',
      confidence: Math.max(Math.min(confidence, 1.0), 0.0),
      factors: { sensitivity, accessHistory }
    };
  }

  /**
   * Verify request context
   * @param {Object} context - Request context
   * @returns {Object} Context verification result
   */
  async verifyContext(context) {
    const timeOfDay = new Date().getHours();
    const isBusinessHours = timeOfDay >= 9 && timeOfDay <= 17;

    let confidence = 0.5;

    if (isBusinessHours) confidence += 0.2;
    if (context.userAgent && this.isKnownUserAgent(context.userAgent)) {
      confidence += 0.2;
    }
    if (context.referrer && this.isValidReferrer(context.referrer)) {
      confidence += 0.1;
    }

    return {
      type: 'context',
      confidence: Math.min(confidence, 1.0),
      factors: { timeOfDay, isBusinessHours, context }
    };
  }

  /**
   * Assess risk level based on trust score and request
   * @param {Object} request - Request object
   * @param {number} trustScore - Trust score
   * @returns {string} Risk level
   */
  assessRisk(request, trustScore) {
    if (trustScore >= 0.8) return 'low';
    if (trustScore >= 0.6) return 'medium';
    if (trustScore >= 0.4) return 'high';
    return 'critical';
  }

  /**
   * Get required trust score for resource
   * @param {Object} resource - Resource object
   * @returns {number} Required trust score
   */
  getRequiredTrustScore(resource) {
    const sensitivity = this.getResourceSensitivity(resource);

    const requirements = {
      'low': 0.4,
      'medium': 0.6,
      'high': 0.8,
      'critical': 0.9
    };

    return requirements[sensitivity] || 0.6;
  }

  /**
   * Get additional controls for risk level
   * @param {string} riskLevel - Risk level
   * @returns {Array} Additional security controls
   */
  getAdditionalControls(riskLevel) {
    const controls = {
      'low': [],
      'medium': ['additional_logging'],
      'high': ['require_approval', 'additional_logging', 'time_limited_access'],
      'critical': ['require_approval', 'additional_logging', 'time_limited_access', 'continuous_monitoring']
    };

    return controls[riskLevel] || [];
  }

  // Helper methods
  async checkMFAStatus(userId) { return true; } // Simplified
  async checkAccountStatus(userId) { return 'active'; }
  async getPasswordAge(userId) { return 30; }
  isRecentlyUsed(lastSeen) { return Date.now() - new Date(lastSeen).getTime() < 86400000; }
  async getUserTypicalLocations(userId) { return []; }
  isTypicalLocation(location, typical) { return true; }
  getResourceSensitivity(resource) { return resource.sensitivity || 'medium'; }
  async getResourceAccessHistory(resource) { return { suspicious: false }; }
  isKnownUserAgent(userAgent) { return true; }
  isValidReferrer(referrer) { return true; }
}

/**
 * Fail-Secure Authorization Gate
 * Implements secure failure handling patterns
 */
class SecureAuthorizationGate {
  constructor(authService, auditLogger) {
    this.authService = authService;
    this.auditLogger = auditLogger;
  }

  /**
   * Check access with fail-secure pattern
   * @param {string} userId - User ID
   * @param {Object} resource - Resource to access
   * @param {string} action - Action to perform
   * @returns {Object} Access decision
   */
  async checkAccess(userId, resource, action) {
    try {
      // Primary authorization check
      const hasAccess = await this.primaryAuthCheck(userId, resource, action);

      if (!hasAccess) {
        await this.logSecurityEvent('access_denied', {
          userId, resource: resource.id, action, reason: 'primary_auth_failed'
        });
        return { allowed: false, reason: 'primary_auth_failed' };
      }

      // Secondary validation
      const secondaryCheck = await this.secondaryValidation(userId, resource);

      if (!secondaryCheck) {
        await this.logSecurityEvent('access_denied', {
          userId, resource: resource.id, action, reason: 'secondary_validation_failed'
        });
        return { allowed: false, reason: 'secondary_validation_failed' };
      }

      // Log successful access
      await this.logSecurityEvent('access_granted', {
        userId, resource: resource.id, action
      });

      return { allowed: true };

    } catch (error) {
      // Log security event
      await this.logSecurityEvent('authorization_failure', {
        userId,
        resource: resource.id,
        action,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      // Fail secure - deny access on any error
      return {
        allowed: false,
        reason: 'system_error',
        message: 'Access denied due to system error'
      };
    }
  }

  /**
   * Primary authorization check
   * @param {string} userId - User ID
   * @param {Object} resource - Resource
   * @param {string} action - Action
   * @returns {boolean} Access granted
   */
  async primaryAuthCheck(userId, resource, action) {
    return await this.authService.hasPermission(userId, resource.type, action);
  }

  /**
   * Secondary validation check
   * @param {string} userId - User ID
   * @param {Object} resource - Resource
   * @returns {boolean} Validation passed
   */
  async secondaryValidation(userId, resource) {
    // Additional checks like resource ownership, time constraints, etc.
    const isOwner = await this.authService.isResourceOwner(userId, resource.id);
    const withinBusinessHours = this.isWithinBusinessHours();

    return isOwner || withinBusinessHours;
  }

  /**
   * Log security events
   * @param {string} eventType - Event type
   * @param {Object} details - Event details
   */
  async logSecurityEvent(eventType, details) {
    await this.auditLogger.log(eventType, {
      ...details,
      timestamp: new Date().toISOString(),
      severity: this.getEventSeverity(eventType)
    });
  }

  /**
   * Get event severity level
   * @param {string} eventType - Event type
   * @returns {string} Severity level
   */
  getEventSeverity(eventType) {
    const severityMap = {
      'access_granted': 'info',
      'access_denied': 'warning',
      'authorization_failure': 'error'
    };

    return severityMap[eventType] || 'info';
  }

  /**
   * Check if current time is within business hours
   * @returns {boolean} Within business hours
   */
  isWithinBusinessHours() {
    const hour = new Date().getHours();
    return hour >= 9 && hour <= 17;
  }
}

module.exports = {
  PermissionService,
  ZeroTrustVerifier,
  SecureAuthorizationGate
};
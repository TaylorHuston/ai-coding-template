/**
 * @example Security Monitoring and Logging Implementation
 *
 * Demonstrates:
 * - Comprehensive security event logging with data sanitization
 * - Real-time threat detection and anomaly analysis
 * - Automated security alerting and incident response
 * - Behavioral pattern analysis for fraud detection
 * - Progressive lockout mechanisms and brute force protection
 *
 * Key Patterns:
 * - Structured logging with security-focused data collection
 * - Statistical analysis for behavior pattern detection
 * - Automated threat response with configurable severity levels
 * - Privacy-preserving logging with sensitive data masking
 * - Integration with security teams and incident management
 */

// Security-focused logging system
class SecurityLogger {
  constructor(logger) {
    this.logger = logger;
    this.sensitiveFields = ['password', 'token', 'ssn', 'creditCard'];
  }

  logAuthenticationAttempt(result, context) {
    this.logger.info('Authentication attempt', {
      event: 'auth_attempt',
      success: result.success,
      userId: result.userId,
      email: this.maskEmail(context.email),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      timestamp: new Date().toISOString(),
      mfaRequired: result.mfaRequired,
      failureReason: result.failureReason
    });
  }

  logPrivilegeEscalation(userId, fromRole, toRole, context) {
    this.logger.warn('Privilege escalation', {
      event: 'privilege_escalation',
      userId,
      fromRole,
      toRole,
      performedBy: context.performedBy,
      ipAddress: context.ipAddress,
      timestamp: new Date().toISOString(),
      severity: 'high'
    });
  }

  logSecurityViolation(violationType, details, context) {
    this.logger.error('Security violation detected', {
      event: 'security_violation',
      type: violationType,
      details: this.sanitizeLogData(details),
      userId: context.userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      timestamp: new Date().toISOString(),
      severity: this.getViolationSeverity(violationType)
    });

    // Trigger security alerts for critical violations
    if (this.isCriticalViolation(violationType)) {
      this.triggerSecurityAlert(violationType, details, context);
    }
  }

  logDataAccess(operation, resource, userId, context) {
    this.logger.info('Data access', {
      event: 'data_access',
      operation, // 'read', 'write', 'delete'
      resource,
      userId,
      ipAddress: context.ipAddress,
      timestamp: new Date().toISOString(),
      success: context.success,
      recordCount: context.recordCount
    });
  }

  sanitizeLogData(data) {
    const sanitized = { ...data };

    for (const field of this.sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  maskEmail(email) {
    if (!email) return null;
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.substring(0, 2) + '*'.repeat(localPart.length - 2);
    return `${maskedLocal}@${domain}`;
  }

  getViolationSeverity(violationType) {
    const severityMap = {
      'brute_force_attack': 'high',
      'sql_injection_attempt': 'critical',
      'xss_attempt': 'medium',
      'privilege_escalation': 'high',
      'malware_detected': 'critical',
      'unusual_data_access': 'medium'
    };

    return severityMap[violationType] || 'low';
  }

  isCriticalViolation(violationType) {
    const criticalTypes = [
      'sql_injection_attempt',
      'malware_detected',
      'data_breach_attempt',
      'privilege_escalation'
    ];

    return criticalTypes.includes(violationType);
  }

  triggerSecurityAlert(violationType, details, context) {
    // In a real implementation, this would integrate with alerting systems
    console.log(`🚨 CRITICAL SECURITY ALERT: ${violationType}`, {
      details,
      context,
      timestamp: new Date().toISOString()
    });
  }
}

// Automated threat detection
class ThreatDetectionService {
  constructor(redisClient, securityLogger) {
    this.redis = redisClient;
    this.logger = securityLogger;
    this.thresholds = {
      failed_logins: { count: 5, window: 15 * 60 * 1000 },
      api_abuse: { count: 100, window: 60 * 1000 },
      privilege_requests: { count: 3, window: 60 * 60 * 1000 }
    };
  }

  async detectBruteForceAttack(identifier, context) {
    const key = `brute_force:${identifier}`;
    const attempts = await this.redis.incr(key);

    if (attempts === 1) {
      await this.redis.expire(key, this.thresholds.failed_logins.window / 1000);
    }

    if (attempts >= this.thresholds.failed_logins.count) {
      await this.handleBruteForceDetection(identifier, attempts, context);
      return true;
    }

    return false;
  }

  async detectAnomalousActivity(userId, activity, context) {
    const patterns = await this.getUserBehaviorPatterns(userId);
    const anomalies = [];

    // Check for unusual login times
    if (this.isUnusualLoginTime(patterns.loginTimes, context.timestamp)) {
      anomalies.push('unusual_login_time');
    }

    // Check for unusual geographic location
    if (this.isUnusualLocation(patterns.locations, context.location)) {
      anomalies.push('unusual_location');
    }

    // Check for unusual device/browser
    if (this.isUnusualDevice(patterns.devices, context.userAgent)) {
      anomalies.push('unusual_device');
    }

    // Check for unusual data access patterns
    if (this.isUnusualDataAccess(patterns.dataAccess, activity)) {
      anomalies.push('unusual_data_access');
    }

    if (anomalies.length > 0) {
      await this.handleAnomalousActivity(userId, anomalies, context);
      return anomalies;
    }

    return [];
  }

  async handleBruteForceDetection(identifier, attempts, context) {
    // Log security event
    this.logger.logSecurityViolation('brute_force_attack', {
      identifier,
      attempts,
      window: this.thresholds.failed_logins.window
    }, context);

    // Implement progressive delays
    const lockoutDuration = Math.min(attempts * 60 * 1000, 60 * 60 * 1000); // Max 1 hour
    await this.redis.setex(`lockout:${identifier}`, lockoutDuration / 1000, 'true');

    // Notify security team
    await this.notifySecurityTeam('brute_force_attack', {
      identifier,
      attempts,
      context
    });
  }

  async handleAnomalousActivity(userId, anomalies, context) {
    this.logger.logSecurityViolation('anomalous_activity', {
      userId,
      anomalies,
      riskScore: this.calculateRiskScore(anomalies)
    }, context);

    // Take protective actions based on risk level
    const riskScore = this.calculateRiskScore(anomalies);

    if (riskScore >= 0.8) {
      // High risk - require additional authentication
      await this.requireAdditionalAuth(userId);
    } else if (riskScore >= 0.5) {
      // Medium risk - increase monitoring
      await this.increasedMonitoring(userId);
    }
  }

  calculateRiskScore(anomalies) {
    const weights = {
      'unusual_login_time': 0.2,
      'unusual_location': 0.4,
      'unusual_device': 0.3,
      'unusual_data_access': 0.5
    };

    const score = anomalies.reduce((total, anomaly) => {
      return total + (weights[anomaly] || 0);
    }, 0);

    return Math.min(score, 1.0);
  }

  async getUserBehaviorPatterns(userId) {
    // Retrieve historical behavior patterns
    const patterns = await this.redis.get(`patterns:${userId}`);

    if (!patterns) {
      return {
        loginTimes: [],
        locations: [],
        devices: [],
        dataAccess: []
      };
    }

    return JSON.parse(patterns);
  }

  isUnusualLoginTime(historicalTimes, currentTime) {
    if (historicalTimes.length < 5) return false;

    const currentHour = new Date(currentTime).getHours();
    const commonHours = this.getMostCommonHours(historicalTimes);

    return !commonHours.includes(currentHour);
  }

  isUnusualLocation(historicalLocations, currentLocation) {
    if (!currentLocation || historicalLocations.length < 3) return false;

    return !historicalLocations.some(location =>
      this.calculateDistance(location, currentLocation) < 100 // 100 miles
    );
  }

  isUnusualDevice(historicalDevices, currentUserAgent) {
    if (historicalDevices.length < 2) return false;

    const currentFingerprint = this.generateDeviceFingerprint(currentUserAgent);
    return !historicalDevices.includes(currentFingerprint);
  }

  isUnusualDataAccess(historicalAccess, currentAccess) {
    if (historicalAccess.length < 10) return false;

    // Check if accessing unusual volume of data
    const avgVolume = historicalAccess.reduce((sum, access) => sum + access.volume, 0) / historicalAccess.length;
    return currentAccess.volume > avgVolume * 3; // 3x normal volume
  }

  getMostCommonHours(times) {
    const hourCounts = {};
    times.forEach(time => {
      const hour = new Date(time).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const sortedHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8) // Top 8 most common hours
      .map(([hour]) => parseInt(hour));

    return sortedHours;
  }

  calculateDistance(location1, location2) {
    // Simplified distance calculation
    const R = 3959; // Earth's radius in miles
    const dLat = this.degreesToRadians(location2.lat - location1.lat);
    const dLon = this.degreesToRadians(location2.lon - location1.lon);

    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.degreesToRadians(location1.lat)) * Math.cos(this.degreesToRadians(location2.lat)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  degreesToRadians(degrees) {
    return degrees * (Math.PI/180);
  }

  generateDeviceFingerprint(userAgent) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(userAgent).digest('hex');
  }

  async isAccountLocked(identifier) {
    return await this.redis.exists(`lockout:${identifier}`);
  }

  async notifySecurityTeam(alertType, details) {
    // In a real implementation, integrate with Slack, PagerDuty, etc.
    console.log(`Security Team Alert: ${alertType}`, details);
  }

  async requireAdditionalAuth(userId) {
    // Flag user for additional authentication
    await this.redis.setex(`require_mfa:${userId}`, 3600, 'true');
  }

  async increasedMonitoring(userId) {
    // Increase monitoring sensitivity for this user
    await this.redis.setex(`increased_monitoring:${userId}`, 3600, 'true');
  }
}

// Security Metrics and Reporting
class SecurityMetricsService {
  constructor(database, logger) {
    this.db = database;
    this.logger = logger;
  }

  async generateSecurityReport(timeframe = '24h') {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - this.parseTimeframe(timeframe));

    const metrics = {
      authenticationAttempts: await this.getAuthMetrics(startTime, endTime),
      securityViolations: await this.getViolationMetrics(startTime, endTime),
      apiUsage: await this.getAPIMetrics(startTime, endTime),
      userActivity: await this.getUserActivityMetrics(startTime, endTime)
    };

    return {
      timeframe,
      generatedAt: new Date(),
      metrics
    };
  }

  async getAuthMetrics(startTime, endTime) {
    // Query authentication logs from database or logs
    return {
      totalAttempts: 1250,
      successfulLogins: 1180,
      failedAttempts: 70,
      bruteForceAttempts: 15,
      mfaRequests: 89,
      newDeviceLogins: 23
    };
  }

  async getViolationMetrics(startTime, endTime) {
    return {
      totalViolations: 45,
      byType: {
        'sql_injection_attempt': 5,
        'xss_attempt': 12,
        'brute_force_attack': 8,
        'unusual_data_access': 20
      },
      bySeverity: {
        'critical': 5,
        'high': 13,
        'medium': 20,
        'low': 7
      }
    };
  }

  parseTimeframe(timeframe) {
    const units = {
      'h': 60 * 60 * 1000,
      'd': 24 * 60 * 60 * 1000,
      'w': 7 * 24 * 60 * 60 * 1000
    };

    const match = timeframe.match(/^(\d+)([hdw])$/);
    if (!match) throw new Error('Invalid timeframe format');

    const [, amount, unit] = match;
    return parseInt(amount) * units[unit];
  }
}

module.exports = {
  SecurityLogger,
  ThreatDetectionService,
  SecurityMetricsService
};
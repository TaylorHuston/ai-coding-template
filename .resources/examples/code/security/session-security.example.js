/**
 * Session Management Security Examples
 *
 * Comprehensive examples for secure session handling, including encrypted
 * session storage, integrity validation, and suspicious activity detection.
 *
 * Features:
 * - Encrypted session data storage
 * - Session integrity validation
 * - Suspicious activity detection
 * - Secure session ID generation
 * - Session timeout and rotation
 */

const crypto = require('crypto');

/**
 * Secure Session Management Service
 * Handles encrypted session storage and validation
 */
class SessionService {
  constructor(redisClient, encryptionService) {
    this.redis = redisClient;
    this.encryption = encryptionService;
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
    this.requireIPConsistency = false; // Configurable
  }

  /**
   * Create a new encrypted session
   * @param {Object} user - User object
   * @param {Object} context - Request context (IP, user agent, etc.)
   * @returns {Object} Session information
   */
  async createSession(user, context = {}) {
    const sessionId = this.generateSecureSessionId();
    const sessionData = {
      userId: user.id,
      userRole: user.role,
      permissions: user.permissions || [],
      createdAt: new Date(),
      lastActivity: new Date(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      mfaVerified: context.mfaVerified || false,
      loginMethod: context.loginMethod || 'password',
      deviceFingerprint: context.deviceFingerprint
    };

    // Encrypt session data
    const encryptedData = this.encryption.encrypt(
      JSON.stringify(sessionData),
      this.getSessionKey()
    );

    // Store in Redis with expiration
    await this.redis.setex(
      `session:${sessionId}`,
      this.sessionTimeout / 1000,
      JSON.stringify(encryptedData)
    );

    // Store session metadata for monitoring
    await this.storeSessionMetadata(sessionId, user.id, context);

    return {
      sessionId,
      expiresAt: new Date(Date.now() + this.sessionTimeout)
    };
  }

  /**
   * Validate and refresh session
   * @param {string} sessionId - Session ID
   * @param {Object} context - Current request context
   * @returns {Object} Session data
   */
  async validateSession(sessionId, context = {}) {
    const encryptedData = await this.redis.get(`session:${sessionId}`);

    if (!encryptedData) {
      throw new SessionError('Session not found or expired');
    }

    // Decrypt session data
    const sessionData = JSON.parse(
      this.encryption.decrypt(JSON.parse(encryptedData), this.getSessionKey())
    );

    // Validate session integrity
    this.validateSessionIntegrity(sessionData, context);

    // Check for suspicious activity
    await this.checkSuspiciousActivity(sessionId, sessionData, context);

    // Update last activity
    sessionData.lastActivity = new Date();
    await this.updateSession(sessionId, sessionData);

    return sessionData;
  }

  /**
   * Validate session integrity and security
   * @param {Object} sessionData - Decrypted session data
   * @param {Object} context - Current request context
   */
  validateSessionIntegrity(sessionData, context) {
    // Check session age
    const sessionAge = Date.now() - new Date(sessionData.createdAt).getTime();
    if (sessionAge > this.maxSessionAge) {
      throw new SessionError('Session expired due to age');
    }

    // Check activity timeout
    const inactivityTime = Date.now() - new Date(sessionData.lastActivity).getTime();
    if (inactivityTime > this.sessionTimeout) {
      throw new SessionError('Session expired due to inactivity');
    }

    // Check IP address consistency (optional)
    if (this.requireIPConsistency && sessionData.ipAddress !== context.ipAddress) {
      throw new SessionError('Session IP address mismatch');
    }

    // Validate user agent consistency (detect session hijacking)
    if (sessionData.userAgent && sessionData.userAgent !== context.userAgent) {
      // Log suspicious activity but don't immediately terminate
      this.logSuspiciousActivity(sessionData.userId, 'user_agent_change', {
        original: sessionData.userAgent,
        current: context.userAgent,
        session: sessionData.sessionId
      });
    }
  }

  /**
   * Check for suspicious activity patterns
   * @param {string} sessionId - Session ID
   * @param {Object} sessionData - Session data
   * @param {Object} context - Request context
   */
  async checkSuspiciousActivity(sessionId, sessionData, context) {
    const suspiciousPatterns = [];

    // Check for rapid location changes
    if (context.geoLocation && sessionData.lastGeoLocation) {
      const distance = this.calculateDistance(
        sessionData.lastGeoLocation,
        context.geoLocation
      );
      const timeDiff = Date.now() - new Date(sessionData.lastActivity).getTime();
      const speedKmh = (distance / (timeDiff / 1000 / 60 / 60));

      if (speedKmh > 1000) { // Impossible travel speed
        suspiciousPatterns.push('impossible_travel');
      }
    }

    // Check for unusual access times
    const hour = new Date().getHours();
    const userTypicalHours = await this.getUserTypicalAccessHours(sessionData.userId);
    if (!userTypicalHours.includes(hour)) {
      suspiciousPatterns.push('unusual_access_time');
    }

    // Check for concurrent sessions from different locations
    const activeSessions = await this.getActiveSessionsForUser(sessionData.userId);
    if (activeSessions.length > 3) {
      suspiciousPatterns.push('multiple_concurrent_sessions');
    }

    // Log and potentially act on suspicious activity
    if (suspiciousPatterns.length > 0) {
      await this.handleSuspiciousActivity(sessionId, sessionData, suspiciousPatterns);
    }
  }

  /**
   * Handle detected suspicious activity
   * @param {string} sessionId - Session ID
   * @param {Object} sessionData - Session data
   * @param {Array} patterns - Detected suspicious patterns
   */
  async handleSuspiciousActivity(sessionId, sessionData, patterns) {
    // Log suspicious activity
    await this.logSuspiciousActivity(sessionData.userId, 'multiple_patterns', {
      patterns,
      session: sessionId,
      timestamp: new Date()
    });

    // Require additional authentication for high-risk patterns
    const highRiskPatterns = ['impossible_travel', 'multiple_concurrent_sessions'];
    const requiresReauth = patterns.some(p => highRiskPatterns.includes(p));

    if (requiresReauth) {
      // Mark session as requiring re-authentication
      sessionData.requiresReauth = true;
      sessionData.suspiciousActivity = patterns;
      await this.updateSession(sessionId, sessionData);

      // Notify security team
      await this.notifySecurityTeam(sessionData.userId, patterns);
    }
  }

  /**
   * Update session data
   * @param {string} sessionId - Session ID
   * @param {Object} sessionData - Updated session data
   */
  async updateSession(sessionId, sessionData) {
    const encryptedData = this.encryption.encrypt(
      JSON.stringify(sessionData),
      this.getSessionKey()
    );

    await this.redis.setex(
      `session:${sessionId}`,
      this.sessionTimeout / 1000,
      JSON.stringify(encryptedData)
    );
  }

  /**
   * Destroy session
   * @param {string} sessionId - Session ID
   */
  async destroySession(sessionId) {
    await this.redis.del(`session:${sessionId}`);
    await this.redis.del(`session_meta:${sessionId}`);
  }

  /**
   * Generate cryptographically secure session ID
   * @returns {string} Secure session ID
   */
  generateSecureSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Get session encryption key
   * @returns {string} Session encryption key
   */
  getSessionKey() {
    // In production, retrieve from secure key management
    return process.env.SESSION_ENCRYPTION_KEY || 'default-session-key';
  }

  /**
   * Store session metadata for monitoring
   * @param {string} sessionId - Session ID
   * @param {string} userId - User ID
   * @param {Object} context - Request context
   */
  async storeSessionMetadata(sessionId, userId, context) {
    const metadata = {
      userId,
      createdAt: new Date(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      geoLocation: context.geoLocation
    };

    await this.redis.setex(
      `session_meta:${sessionId}`,
      this.maxSessionAge / 1000,
      JSON.stringify(metadata)
    );
  }

  /**
   * Calculate distance between two geographic points
   * @param {Object} point1 - First geographic point
   * @param {Object} point2 - Second geographic point
   * @returns {number} Distance in kilometers
   */
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lon - point1.lon);
    const lat1 = this.toRad(point1.lat);
    const lat2 = this.toRad(point2.lat);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  /**
   * Convert degrees to radians
   * @param {number} deg - Degrees
   * @returns {number} Radians
   */
  toRad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Get user's typical access hours
   * @param {string} userId - User ID
   * @returns {Array} Array of typical hours
   */
  async getUserTypicalAccessHours(userId) {
    // In production, analyze user's historical access patterns
    return [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // Business hours default
  }

  /**
   * Get active sessions for user
   * @param {string} userId - User ID
   * @returns {Array} Array of active session metadata
   */
  async getActiveSessionsForUser(userId) {
    const keys = await this.redis.keys('session_meta:*');
    const sessions = [];

    for (const key of keys) {
      const metadata = JSON.parse(await this.redis.get(key));
      if (metadata.userId === userId) {
        sessions.push(metadata);
      }
    }

    return sessions;
  }

  /**
   * Log suspicious activity
   * @param {string} userId - User ID
   * @param {string} type - Activity type
   * @param {Object} details - Activity details
   */
  async logSuspiciousActivity(userId, type, details) {
    const logEntry = {
      userId,
      type,
      details,
      timestamp: new Date(),
      severity: this.getSeverityLevel(type)
    };

    // Store in security log
    await this.redis.lpush('security_log', JSON.stringify(logEntry));

    // Alert if high severity
    if (logEntry.severity === 'high') {
      await this.sendSecurityAlert(logEntry);
    }
  }

  /**
   * Get severity level for activity type
   * @param {string} type - Activity type
   * @returns {string} Severity level
   */
  getSeverityLevel(type) {
    const severityMap = {
      'impossible_travel': 'high',
      'multiple_concurrent_sessions': 'medium',
      'user_agent_change': 'low',
      'unusual_access_time': 'low'
    };

    return severityMap[type] || 'medium';
  }

  /**
   * Send security alert
   * @param {Object} logEntry - Security log entry
   */
  async sendSecurityAlert(logEntry) {
    // Implementation depends on alerting system
    console.warn('Security Alert:', logEntry);
  }

  /**
   * Notify security team
   * @param {string} userId - User ID
   * @param {Array} patterns - Suspicious patterns
   */
  async notifySecurityTeam(userId, patterns) {
    // Implementation depends on notification system
    console.warn(`Security notification for user ${userId}:`, patterns);
  }
}

/**
 * Session Error class
 */
class SessionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SessionError';
  }
}

/**
 * Express middleware for session management
 */
function createSessionMiddleware(sessionService) {
  return async (req, res, next) => {
    try {
      const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

      if (!sessionId) {
        return res.status(401).json({ error: 'No session provided' });
      }

      const context = {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        geoLocation: req.geoLocation // Assuming geo middleware
      };

      const sessionData = await sessionService.validateSession(sessionId, context);

      // Check if re-authentication is required
      if (sessionData.requiresReauth) {
        return res.status(403).json({
          error: 'Re-authentication required',
          reason: 'suspicious_activity'
        });
      }

      req.session = sessionData;
      next();
    } catch (error) {
      if (error instanceof SessionError) {
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  };
}

module.exports = {
  SessionService,
  SessionError,
  createSessionMiddleware
};
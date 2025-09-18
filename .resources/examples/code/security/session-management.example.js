/**
 * @example Session Management Security Implementation
 *
 * Demonstrates:
 * - Secure session creation with encryption and validation
 * - Session integrity checking and anomaly detection
 * - Proper session timeout and expiration handling
 * - Cross-platform session management with Redis
 * - Context-aware session validation patterns
 *
 * Key Patterns:
 * - Encrypted session data for sensitive information protection
 * - Comprehensive session validation including IP and device checks
 * - Progressive session timeout based on activity
 * - Secure session ID generation with cryptographic randomness
 * - Session hijacking and fixation protection mechanisms
 */

const crypto = require('crypto');

// Secure Session Handling
class SessionService {
  constructor(redisClient, encryptionService) {
    this.redis = redisClient;
    this.encryption = encryptionService;
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
    this.requireIPConsistency = false; // Configurable based on security needs
  }

  async createSession(user, context = {}) {
    const sessionId = this.generateSecureSessionId();
    const sessionData = {
      userId: user.id,
      userRole: user.role,
      createdAt: new Date(),
      lastActivity: new Date(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      mfaVerified: context.mfaVerified || false,
      deviceFingerprint: this.generateDeviceFingerprint(context)
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

    return {
      sessionId,
      expiresAt: new Date(Date.now() + this.sessionTimeout)
    };
  }

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

    // Update last activity
    sessionData.lastActivity = new Date();
    await this.updateSession(sessionId, sessionData);

    return sessionData;
  }

  validateSessionIntegrity(sessionData, context) {
    // Check session age
    const sessionAge = Date.now() - new Date(sessionData.createdAt).getTime();
    if (sessionAge > this.maxSessionAge) {
      throw new SessionError('Session expired due to age');
    }

    // Check IP address consistency (optional, configurable)
    if (this.requireIPConsistency && sessionData.ipAddress !== context.ipAddress) {
      throw new SessionError('Session IP address mismatch');
    }

    // Check for suspicious activity patterns
    if (this.detectSuspiciousActivity(sessionData, context)) {
      throw new SessionError('Suspicious session activity detected');
    }

    // Validate device fingerprint consistency
    const currentFingerprint = this.generateDeviceFingerprint(context);
    if (sessionData.deviceFingerprint !== currentFingerprint) {
      // Log potential session hijacking attempt
      this.logSecurityEvent('device_fingerprint_mismatch', {
        sessionId: sessionData.sessionId,
        originalFingerprint: sessionData.deviceFingerprint,
        currentFingerprint
      });
    }
  }

  detectSuspiciousActivity(sessionData, context) {
    // Check for unusual activity patterns
    const timeSinceLastActivity = Date.now() - new Date(sessionData.lastActivity).getTime();

    // Rapid location changes (simplified example)
    if (context.location && sessionData.location) {
      const distance = this.calculateDistance(context.location, sessionData.location);
      const timeHours = timeSinceLastActivity / (1000 * 60 * 60);

      // If user appears to have traveled > 500 miles per hour
      if (distance / timeHours > 500) {
        return true;
      }
    }

    return false;
  }

  generateSecureSessionId() {
    // Generate cryptographically secure random session ID
    return crypto.randomBytes(32).toString('hex');
  }

  generateDeviceFingerprint(context) {
    // Create a hash of device characteristics
    const fingerprint = [
      context.userAgent,
      context.acceptLanguage,
      context.acceptEncoding,
      context.timezone
    ].join('|');

    return crypto.createHash('sha256').update(fingerprint).digest('hex');
  }

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

  async destroySession(sessionId) {
    await this.redis.del(`session:${sessionId}`);
  }

  async destroyAllUserSessions(userId) {
    // Find all sessions for the user
    const sessionKeys = await this.redis.keys('session:*');

    for (const key of sessionKeys) {
      const encryptedData = await this.redis.get(key);
      if (encryptedData) {
        try {
          const sessionData = JSON.parse(
            this.encryption.decrypt(JSON.parse(encryptedData), this.getSessionKey())
          );

          if (sessionData.userId === userId) {
            await this.redis.del(key);
          }
        } catch (error) {
          // Session data corrupted, delete it
          await this.redis.del(key);
        }
      }
    }
  }

  getSessionKey() {
    // In production, retrieve from secure key management service
    return crypto.scryptSync(process.env.SESSION_SECRET, 'session-salt', 32);
  }

  calculateDistance(location1, location2) {
    // Simplified distance calculation (would use proper geolocation library)
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

  logSecurityEvent(eventType, details) {
    // Log security event for monitoring
    console.log(`SECURITY EVENT: ${eventType}`, details);
  }
}

// Session Middleware for Express
class SessionMiddleware {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  middleware() {
    return async (req, res, next) => {
      try {
        const sessionId = this.extractSessionId(req);

        if (!sessionId) {
          req.session = null;
          return next();
        }

        const context = {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          acceptLanguage: req.get('Accept-Language'),
          acceptEncoding: req.get('Accept-Encoding'),
          timezone: req.get('X-Timezone')
        };

        const sessionData = await this.sessionService.validateSession(sessionId, context);
        req.session = sessionData;
        req.sessionId = sessionId;

        next();
      } catch (error) {
        if (error instanceof SessionError) {
          // Clear invalid session
          this.clearSessionCookie(res);
          req.session = null;
          return next();
        }

        next(error);
      }
    };
  }

  extractSessionId(req) {
    // Try Authorization header first
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Fallback to cookie
    return req.cookies?.sessionId;
  }

  clearSessionCookie(res) {
    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }
}

// Custom Error Classes
class SessionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SessionError';
  }
}

module.exports = {
  SessionService,
  SessionMiddleware,
  SessionError
};
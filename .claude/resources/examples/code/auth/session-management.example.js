/**
 * Session Management Implementation Example
 *
 * Comprehensive session handling with encryption, integrity validation,
 * and security features
 *
 * Features:
 * - Encrypted session storage
 * - Session integrity validation
 * - IP address consistency checking
 * - Session rotation
 * - Active session tracking
 * - Suspicious activity detection
 */

const crypto = require('crypto');
const Redis = require('redis');

class SessionManager {
  constructor(redisClient, encryptionService) {
    this.redis = redisClient;
    this.encryption = encryptionService;
    this.sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
    this.maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
    this.requireIPConsistency = false; // Configurable
    this.maxConcurrentSessions = 5;
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
      permissions: await this.getUserPermissions(user.id),
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

    // Track active sessions for user
    await this.addToActiveSessions(user.id, sessionId);

    // Enforce concurrent session limit
    await this.enforceConcurrentSessionLimit(user.id);

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

    // Check device fingerprint consistency
    if (sessionData.deviceFingerprint && context.deviceFingerprint &&
        sessionData.deviceFingerprint !== context.deviceFingerprint) {
      throw new SessionError('Device fingerprint mismatch');
    }

    // Check for suspicious activity patterns
    if (this.detectSuspiciousActivity(sessionData, context)) {
      throw new SessionError('Suspicious session activity detected');
    }
  }

  detectSuspiciousActivity(sessionData, context) {
    // Check for impossible travel
    if (sessionData.ipAddress !== context.ipAddress) {
      const lastLocation = this.getLocationFromIP(sessionData.ipAddress);
      const currentLocation = this.getLocationFromIP(context.ipAddress);

      if (lastLocation && currentLocation) {
        const distance = this.calculateDistance(lastLocation, currentLocation);
        const timeDiff = Date.now() - new Date(sessionData.lastActivity).getTime();
        const maxSpeed = 800; // km/h (airplane speed)

        if (distance > (maxSpeed * timeDiff / (1000 * 60 * 60))) {
          return true; // Impossible travel detected
        }
      }
    }

    // Check for rapid location changes
    const recentLocations = sessionData.recentLocations || [];
    if (recentLocations.length >= 3) {
      const uniqueCountries = new Set(recentLocations.map(loc => loc.country));
      if (uniqueCountries.size > 2) {
        return true; // Multiple countries in short time
      }
    }

    // Check for unusual user agent changes
    if (sessionData.userAgent !== context.userAgent) {
      const similarity = this.calculateUserAgentSimilarity(
        sessionData.userAgent,
        context.userAgent
      );
      if (similarity < 0.7) {
        return true; // Significant user agent change
      }
    }

    return false;
  }

  async updateSession(sessionId, sessionData) {
    // Encrypt updated session data
    const encryptedData = this.encryption.encrypt(
      JSON.stringify(sessionData),
      this.getSessionKey()
    );

    // Update in Redis maintaining TTL
    const ttl = await this.redis.ttl(`session:${sessionId}`);
    if (ttl > 0) {
      await this.redis.setex(
        `session:${sessionId}`,
        ttl,
        JSON.stringify(encryptedData)
      );
    }
  }

  async rotateSession(oldSessionId, user, context) {
    // Create new session
    const newSession = await this.createSession(user, context);

    // Invalidate old session
    await this.invalidateSession(oldSessionId);

    return newSession;
  }

  async invalidateSession(sessionId) {
    const sessionData = await this.getSessionData(sessionId);

    if (sessionData) {
      await this.removeFromActiveSessions(sessionData.userId, sessionId);
    }

    await this.redis.del(`session:${sessionId}`);
  }

  async invalidateAllUserSessions(userId, exceptSessionId = null) {
    const activeSessions = await this.getActiveSessions(userId);

    for (const sessionId of activeSessions) {
      if (sessionId !== exceptSessionId) {
        await this.invalidateSession(sessionId);
      }
    }
  }

  async getSessionData(sessionId) {
    try {
      const encryptedData = await this.redis.get(`session:${sessionId}`);
      if (!encryptedData) return null;

      return JSON.parse(
        this.encryption.decrypt(JSON.parse(encryptedData), this.getSessionKey())
      );
    } catch (error) {
      return null;
    }
  }

  generateSecureSessionId() {
    // Generate cryptographically secure random session ID
    return crypto.randomBytes(32).toString('hex');
  }

  getSessionKey() {
    // Derive session encryption key from master key
    return crypto.pbkdf2Sync(
      process.env.SESSION_MASTER_KEY,
      'session-salt',
      100000,
      32,
      'sha256'
    );
  }

  async addToActiveSessions(userId, sessionId) {
    const key = `active_sessions:${userId}`;
    await this.redis.sadd(key, sessionId);
    await this.redis.expire(key, this.maxSessionAge / 1000);
  }

  async removeFromActiveSessions(userId, sessionId) {
    await this.redis.srem(`active_sessions:${userId}`, sessionId);
  }

  async getActiveSessions(userId) {
    return await this.redis.smembers(`active_sessions:${userId}`);
  }

  async enforceConcurrentSessionLimit(userId) {
    const activeSessions = await this.getActiveSessions(userId);

    if (activeSessions.length > this.maxConcurrentSessions) {
      // Sort sessions by last activity and remove oldest
      const sessionsWithActivity = [];

      for (const sessionId of activeSessions) {
        const sessionData = await this.getSessionData(sessionId);
        if (sessionData) {
          sessionsWithActivity.push({
            sessionId,
            lastActivity: new Date(sessionData.lastActivity)
          });
        }
      }

      // Sort by last activity (oldest first)
      sessionsWithActivity.sort((a, b) => a.lastActivity - b.lastActivity);

      // Remove excess sessions
      const sessionsToRemove = sessionsWithActivity.length - this.maxConcurrentSessions;
      for (let i = 0; i < sessionsToRemove; i++) {
        await this.invalidateSession(sessionsWithActivity[i].sessionId);
      }
    }
  }

  async getSessionMetrics(userId) {
    const activeSessions = await this.getActiveSessions(userId);
    const sessionDetails = [];

    for (const sessionId of activeSessions) {
      const sessionData = await this.getSessionData(sessionId);
      if (sessionData) {
        sessionDetails.push({
          sessionId,
          createdAt: sessionData.createdAt,
          lastActivity: sessionData.lastActivity,
          ipAddress: sessionData.ipAddress,
          userAgent: sessionData.userAgent,
          location: this.getLocationFromIP(sessionData.ipAddress)
        });
      }
    }

    return {
      totalActiveSessions: sessionDetails.length,
      sessions: sessionDetails
    };
  }

  // Helper methods (implement according to your needs)
  async getUserPermissions(userId) {
    // Implement user permissions retrieval
    return [];
  }

  getLocationFromIP(ipAddress) {
    // Implement IP geolocation lookup
    // Return { country, city, latitude, longitude }
    return null;
  }

  calculateDistance(location1, location2) {
    // Implement Haversine formula for distance calculation
    // Return distance in kilometers
    return 0;
  }

  calculateUserAgentSimilarity(ua1, ua2) {
    // Implement user agent similarity calculation
    // Return similarity score between 0 and 1
    if (ua1 === ua2) return 1;

    // Simple implementation - extract browser and OS
    const extract = (ua) => {
      const browser = ua.match(/(Chrome|Firefox|Safari|Edge)\/?\d*/)?.[0] || '';
      const os = ua.match(/(Windows|Mac|Linux|Android|iOS)/)?.[0] || '';
      return { browser, os };
    };

    const info1 = extract(ua1);
    const info2 = extract(ua2);

    let score = 0;
    if (info1.browser === info2.browser) score += 0.5;
    if (info1.os === info2.os) score += 0.5;

    return score;
  }
}

// Express.js middleware for session validation
const sessionMiddleware = (sessionManager) => {
  return async (req, res, next) => {
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

    if (!sessionId) {
      return res.status(401).json({ error: 'No session provided' });
    }

    try {
      const sessionData = await sessionManager.validateSession(sessionId, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        deviceFingerprint: req.headers['x-device-fingerprint']
      });

      req.session = sessionData;
      req.user = { id: sessionData.userId, role: sessionData.userRole };

      next();
    } catch (error) {
      if (error instanceof SessionError) {
        return res.status(401).json({
          error: 'Invalid session',
          message: error.message
        });
      }

      return res.status(500).json({
        error: 'Session validation failed',
        message: error.message
      });
    }
  };
};

class SessionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SessionError';
  }
}

module.exports = {
  SessionManager,
  sessionMiddleware,
  SessionError
};
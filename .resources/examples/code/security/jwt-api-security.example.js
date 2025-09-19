/**
 * JWT Token Security and API Rate Limiting Examples
 *
 * Comprehensive examples for secure JWT implementation and API rate limiting,
 * including token revocation, refresh tokens, and advanced rate limiting strategies.
 *
 * Features:
 * - RS256 JWT implementation with key rotation
 * - Token revocation and blacklisting
 * - Refresh token management
 * - Multiple rate limiting algorithms
 * - API authentication middleware
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Secure JWT Service
 * Handles JWT token generation, validation, and revocation
 */
class JWTService {
  constructor(redisClient) {
    this.redis = redisClient;
    this.privateKey = this.loadPrivateKey();
    this.publicKey = this.loadPublicKey();
    this.algorithm = 'RS256';
    this.issuer = process.env.JWT_ISSUER || 'your-app';
    this.audience = process.env.JWT_AUDIENCE || 'your-app-users';
    this.keyId = process.env.JWT_KEY_ID || 'key-1';
  }

  /**
   * Generate JWT access token
   * @param {Object} payload - Token payload
   * @param {Object} options - Token options
   * @returns {string} JWT token
   */
  generateToken(payload, options = {}) {
    const tokenPayload = {
      ...payload,
      iss: this.issuer,
      aud: this.audience,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (options.expiresIn || 3600), // 1 hour default
      jti: crypto.randomUUID(), // Unique token ID for revocation
      scope: options.scope || 'user',
      type: 'access'
    };

    return jwt.sign(tokenPayload, this.privateKey, {
      algorithm: this.algorithm,
      keyid: this.keyId
    });
  }

  /**
   * Generate refresh token
   * @param {Object} payload - Token payload
   * @returns {Object} Refresh token and metadata
   */
  async generateRefreshToken(payload) {
    const refreshTokenData = {
      userId: payload.sub,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      jti: crypto.randomUUID(),
      type: 'refresh'
    };

    const refreshToken = jwt.sign(refreshTokenData, this.privateKey, {
      algorithm: this.algorithm,
      keyid: this.keyId
    });

    // Store refresh token metadata in Redis
    await this.redis.setex(
      `refresh_token:${refreshTokenData.jti}`,
      30 * 24 * 60 * 60, // 30 days
      JSON.stringify({
        userId: payload.sub,
        createdAt: new Date(),
        lastUsed: new Date()
      })
    );

    return {
      token: refreshToken,
      expiresAt: new Date(refreshTokenData.exp * 1000)
    };
  }

  /**
   * Verify and decode JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.publicKey, {
        algorithms: [this.algorithm],
        issuer: this.issuer,
        audience: this.audience
      });

      // Check if token is revoked
      if (this.isTokenRevoked(decoded.jti)) {
        throw new Error('Token has been revoked');
      }

      return decoded;
    } catch (error) {
      throw new AuthenticationError('Invalid token: ' + error.message);
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} New access token and refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.publicKey, {
        algorithms: [this.algorithm]
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Check if refresh token exists and is valid
      const tokenData = await this.redis.get(`refresh_token:${decoded.jti}`);
      if (!tokenData) {
        throw new Error('Refresh token not found or expired');
      }

      // Update last used timestamp
      const metadata = JSON.parse(tokenData);
      metadata.lastUsed = new Date();
      await this.redis.setex(
        `refresh_token:${decoded.jti}`,
        30 * 24 * 60 * 60,
        JSON.stringify(metadata)
      );

      // Generate new access token
      const newAccessToken = this.generateToken({
        sub: decoded.userId,
        role: decoded.role || 'user'
      });

      // Optionally rotate refresh token for enhanced security
      const shouldRotateRefresh = Math.random() < 0.1; // 10% chance
      let newRefreshToken = null;

      if (shouldRotateRefresh) {
        newRefreshToken = await this.generateRefreshToken({
          sub: decoded.userId
        });
        await this.revokeRefreshToken(decoded.jti);
      }

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token: ' + error.message);
    }
  }

  /**
   * Revoke JWT token
   * @param {string} tokenId - Token JTI
   */
  async revokeToken(tokenId) {
    // Add to revocation list with expiration
    await this.redis.setex(`revoked:${tokenId}`, 3600, 'true');
  }

  /**
   * Revoke refresh token
   * @param {string} tokenId - Refresh token JTI
   */
  async revokeRefreshToken(tokenId) {
    await this.redis.del(`refresh_token:${tokenId}`);
  }

  /**
   * Check if token is revoked
   * @param {string} tokenId - Token JTI
   * @returns {boolean} True if revoked
   */
  async isTokenRevoked(tokenId) {
    const revoked = await this.redis.get(`revoked:${tokenId}`);
    return revoked === 'true';
  }

  /**
   * Load private key for signing
   * @returns {string} Private key
   */
  loadPrivateKey() {
    // In production, load from secure key management
    return process.env.JWT_PRIVATE_KEY || this.generateKeyPair().privateKey;
  }

  /**
   * Load public key for verification
   * @returns {string} Public key
   */
  loadPublicKey() {
    // In production, load from secure key management
    return process.env.JWT_PUBLIC_KEY || this.generateKeyPair().publicKey;
  }

  /**
   * Generate RSA key pair for development
   * @returns {Object} Key pair
   */
  generateKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    return { privateKey, publicKey };
  }
}

/**
 * Comprehensive Rate Limiting Service
 * Implements multiple rate limiting algorithms
 */
class RateLimitService {
  constructor(redisClient) {
    this.redis = redisClient;
    this.limits = {
      authentication: { requests: 5, window: 15 * 60 * 1000 }, // 5 per 15 min
      api_general: { requests: 1000, window: 60 * 60 * 1000 }, // 1000 per hour
      api_premium: { requests: 10000, window: 60 * 60 * 1000 }, // 10000 per hour
      password_reset: { requests: 3, window: 60 * 60 * 1000 }, // 3 per hour
      file_upload: { requests: 10, window: 60 * 60 * 1000 } // 10 per hour
    };
  }

  /**
   * Fixed window rate limiting
   * @param {string} identifier - Client identifier
   * @param {string} limitType - Type of rate limit
   * @param {Object} context - Request context
   * @returns {Object} Rate limit result
   */
  async checkRateLimit(identifier, limitType, context = {}) {
    const limit = this.limits[limitType];
    if (!limit) {
      throw new Error(`Unknown rate limit type: ${limitType}`);
    }

    const key = `rate_limit:${limitType}:${identifier}`;
    const current = await this.redis.get(key);

    if (!current) {
      // First request in window
      await this.redis.setex(key, limit.window / 1000, '1');
      return {
        allowed: true,
        remaining: limit.requests - 1,
        resetTime: new Date(Date.now() + limit.window)
      };
    }

    const currentCount = parseInt(current, 10);

    if (currentCount >= limit.requests) {
      // Rate limit exceeded
      const ttl = await this.redis.ttl(key);
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(Date.now() + (ttl * 1000)),
        retryAfter: ttl
      };
    }

    // Increment counter
    await this.redis.incr(key);

    return {
      allowed: true,
      remaining: limit.requests - currentCount - 1,
      resetTime: new Date(Date.now() + (await this.redis.ttl(key) * 1000))
    };
  }

  /**
   * Sliding window rate limiting
   * @param {string} identifier - Client identifier
   * @param {string} limitType - Type of rate limit
   * @returns {Object} Rate limit result
   */
  async checkSlidingWindowRateLimit(identifier, limitType) {
    const limit = this.limits[limitType];
    const now = Date.now();
    const windowStart = now - limit.window;

    const key = `sliding:${limitType}:${identifier}`;

    // Remove old entries
    await this.redis.zremrangebyscore(key, 0, windowStart);

    // Count current requests in window
    const currentCount = await this.redis.zcard(key);

    if (currentCount >= limit.requests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(now + limit.window)
      };
    }

    // Add current request
    await this.redis.zadd(key, now, `${now}-${Math.random()}`);
    await this.redis.expire(key, limit.window / 1000);

    return {
      allowed: true,
      remaining: limit.requests - currentCount - 1,
      resetTime: new Date(now + limit.window)
    };
  }

  /**
   * Token bucket rate limiting
   * @param {string} identifier - Client identifier
   * @param {string} limitType - Type of rate limit
   * @returns {Object} Rate limit result
   */
  async checkTokenBucketRateLimit(identifier, limitType) {
    const limit = this.limits[limitType];
    const capacity = limit.requests;
    const refillRate = capacity / (limit.window / 1000); // tokens per second

    const key = `bucket:${limitType}:${identifier}`;
    const now = Date.now() / 1000;

    // Get current bucket state
    const bucketData = await this.redis.hmget(key, 'tokens', 'lastRefill');
    let tokens = bucketData[0] ? parseFloat(bucketData[0]) : capacity;
    let lastRefill = bucketData[1] ? parseFloat(bucketData[1]) : now;

    // Calculate tokens to add based on time passed
    const timePassed = now - lastRefill;
    const tokensToAdd = timePassed * refillRate;
    tokens = Math.min(capacity, tokens + tokensToAdd);

    if (tokens < 1) {
      // Not enough tokens
      await this.redis.hmset(key, 'tokens', tokens, 'lastRefill', now);
      await this.redis.expire(key, limit.window / 1000);

      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date((now + (1 - tokens) / refillRate) * 1000)
      };
    }

    // Consume one token
    tokens -= 1;
    await this.redis.hmset(key, 'tokens', tokens, 'lastRefill', now);
    await this.redis.expire(key, limit.window / 1000);

    return {
      allowed: true,
      remaining: Math.floor(tokens),
      resetTime: new Date((now + (capacity - tokens) / refillRate) * 1000)
    };
  }

  /**
   * Create Express middleware for rate limiting
   * @param {string} limitType - Type of rate limit
   * @param {string} algorithm - Rate limiting algorithm
   * @returns {Function} Express middleware
   */
  createMiddleware(limitType, algorithm = 'fixed') {
    return async (req, res, next) => {
      const identifier = this.getIdentifier(req);

      let result;
      switch (algorithm) {
        case 'sliding':
          result = await this.checkSlidingWindowRateLimit(identifier, limitType);
          break;
        case 'token':
          result = await this.checkTokenBucketRateLimit(identifier, limitType);
          break;
        default:
          result = await this.checkRateLimit(identifier, limitType, {
            ip: req.ip,
            userAgent: req.get('User-Agent')
          });
      }

      // Set rate limit headers
      res.set('X-RateLimit-Limit', this.limits[limitType].requests);
      res.set('X-RateLimit-Remaining', result.remaining);
      res.set('X-RateLimit-Reset', Math.floor(result.resetTime.getTime() / 1000));

      if (!result.allowed) {
        res.set('Retry-After', result.retryAfter || Math.ceil((result.resetTime - new Date()) / 1000));
        return res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: result.retryAfter
        });
      }

      next();
    };
  }

  /**
   * Get client identifier for rate limiting
   * @param {Object} req - Express request object
   * @returns {string} Client identifier
   */
  getIdentifier(req) {
    // Use user ID if authenticated, otherwise IP address
    return req.user?.id || req.ip;
  }
}

/**
 * Authentication Error class
 */
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * JWT Authentication middleware
 * @param {JWTService} jwtService - JWT service instance
 * @returns {Function} Express middleware
 */
function createJWTMiddleware(jwtService) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No valid authorization header' });
      }

      const token = authHeader.substring(7);
      const decoded = await jwtService.verifyToken(token);

      req.user = {
        id: decoded.sub,
        role: decoded.role,
        scope: decoded.scope
      };

      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  };
}

module.exports = {
  JWTService,
  RateLimitService,
  AuthenticationError,
  createJWTMiddleware
};
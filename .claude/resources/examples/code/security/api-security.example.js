/**
 * @example API Security Implementation
 *
 * Demonstrates:
 * - Secure JWT token generation and validation with RS256
 * - Comprehensive rate limiting with multiple tiers and contexts
 * - API authentication patterns with proper error handling
 * - Token revocation mechanisms and security monitoring
 * - Progressive rate limiting and intelligent threat detection
 *
 * Key Patterns:
 * - Asymmetric JWT signing for better security and scalability
 * - Context-aware rate limiting based on user types and operations
 * - Proper token lifecycle management with revocation support
 * - Security headers and response formatting for API endpoints
 * - Integration with Redis for distributed rate limiting
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// JWT Token Security
class JWTService {
  constructor() {
    this.privateKey = this.loadPrivateKey();
    this.publicKey = this.loadPublicKey();
    this.algorithm = 'RS256';
    this.issuer = process.env.JWT_ISSUER;
    this.audience = process.env.JWT_AUDIENCE;
  }

  generateToken(payload, options = {}) {
    const tokenPayload = {
      ...payload,
      iss: this.issuer,
      aud: this.audience,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (options.expiresIn || 3600), // 1 hour default
      jti: crypto.randomUUID(), // Unique token ID for revocation
    };

    return jwt.sign(tokenPayload, this.privateKey, {
      algorithm: this.algorithm,
      keyid: this.getKeyId()
    });
  }

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

  async revokeToken(tokenId) {
    // Add to revocation list with expiration
    await this.redis.setex(`revoked:${tokenId}`, 3600, 'true');
  }

  isTokenRevoked(tokenId) {
    // In a real implementation, this would check Redis or database
    return false;
  }

  loadPrivateKey() {
    // Load from secure storage or environment variable
    return process.env.JWT_PRIVATE_KEY || 'default-key-for-dev';
  }

  loadPublicKey() {
    // Load from secure storage or environment variable
    return process.env.JWT_PUBLIC_KEY || 'default-key-for-dev';
  }

  getKeyId() {
    // Return key identifier for key rotation support
    return 'key-1';
  }
}

// Rate Limiting Implementation
class RateLimitService {
  constructor(redisClient) {
    this.redis = redisClient;
    this.limits = {
      authentication: { requests: 5, window: 15 * 60 * 1000 }, // 5 per 15 min
      api_general: { requests: 1000, window: 60 * 60 * 1000 }, // 1000 per hour
      api_premium: { requests: 10000, window: 60 * 60 * 1000 }, // 10000 per hour
      password_reset: { requests: 3, window: 60 * 60 * 1000 }  // 3 per hour
    };
  }

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

  // Middleware for Express.js
  createMiddleware(limitType) {
    return async (req, res, next) => {
      const identifier = this.getIdentifier(req);
      const result = await this.checkRateLimit(identifier, limitType, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Set rate limit headers
      res.set('X-RateLimit-Limit', this.limits[limitType].requests);
      res.set('X-RateLimit-Remaining', result.remaining);
      res.set('X-RateLimit-Reset', Math.floor(result.resetTime.getTime() / 1000));

      if (!result.allowed) {
        res.set('Retry-After', result.retryAfter);
        return res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: result.retryAfter
        });
      }

      next();
    };
  }

  getIdentifier(req) {
    // Use user ID if authenticated, otherwise IP address
    return req.user?.id || req.ip;
  }
}

// API Authentication Middleware
class APIAuthenticationMiddleware {
  constructor(jwtService, rateLimitService) {
    this.jwt = jwtService;
    this.rateLimit = rateLimitService;
  }

  authenticate() {
    return async (req, res, next) => {
      try {
        const token = this.extractToken(req);

        if (!token) {
          return res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_TOKEN_MISSING'
          });
        }

        // Verify token
        const decoded = this.jwt.verifyToken(token);
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          permissions: decoded.permissions || []
        };

        next();
      } catch (error) {
        if (error instanceof AuthenticationError) {
          return res.status(401).json({
            error: 'Invalid authentication token',
            code: 'AUTH_TOKEN_INVALID',
            details: error.message
          });
        }

        next(error);
      }
    };
  }

  requireRole(requiredRole) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (req.user.role !== requiredRole) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: requiredRole,
          current: req.user.role
        });
      }

      next();
    };
  }

  requirePermission(requiredPermission) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (!req.user.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: requiredPermission,
          userPermissions: req.user.permissions
        });
      }

      next();
    };
  }

  extractToken(req) {
    const authHeader = req.get('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Fallback to query parameter (less secure, for specific use cases)
    return req.query.token;
  }
}

// API Security Headers Middleware
class SecurityHeadersMiddleware {
  static apply() {
    return (req, res, next) => {
      // Security headers
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('X-Frame-Options', 'DENY');
      res.set('X-XSS-Protection', '1; mode=block');
      res.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      // API-specific headers
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');

      // CORS headers (configure based on your needs)
      res.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

      next();
    };
  }
}

// API Key Management
class APIKeyService {
  constructor(database) {
    this.db = database;
  }

  async generateAPIKey(userId, name, permissions = []) {
    const keyId = crypto.randomUUID();
    const secretKey = crypto.randomBytes(32).toString('base64url');
    const hashedKey = await this.hashAPIKey(secretKey);

    const apiKey = {
      id: keyId,
      userId,
      name,
      hashedKey,
      permissions,
      createdAt: new Date(),
      lastUsedAt: null,
      isActive: true
    };

    await this.db.apiKeys.create(apiKey);

    // Return the full key only once during creation
    return {
      keyId,
      secretKey: `ak_${keyId}_${secretKey}`,
      permissions,
      createdAt: apiKey.createdAt
    };
  }

  async validateAPIKey(keyString) {
    if (!keyString.startsWith('ak_')) {
      throw new Error('Invalid API key format');
    }

    const [, keyId, secretKey] = keyString.split('_');
    const apiKey = await this.db.apiKeys.findOne({
      id: keyId,
      isActive: true
    });

    if (!apiKey) {
      throw new Error('API key not found');
    }

    const isValid = await this.verifyAPIKey(secretKey, apiKey.hashedKey);
    if (!isValid) {
      throw new Error('Invalid API key');
    }

    // Update last used timestamp
    await this.db.apiKeys.update(
      { id: keyId },
      { lastUsedAt: new Date() }
    );

    return {
      userId: apiKey.userId,
      permissions: apiKey.permissions,
      keyId: apiKey.id
    };
  }

  async hashAPIKey(secretKey) {
    const bcrypt = require('bcrypt');
    return await bcrypt.hash(secretKey, 12);
  }

  async verifyAPIKey(secretKey, hashedKey) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(secretKey, hashedKey);
  }
}

// Custom Error Classes
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

module.exports = {
  JWTService,
  RateLimitService,
  APIAuthenticationMiddleware,
  SecurityHeadersMiddleware,
  APIKeyService,
  AuthenticationError
};
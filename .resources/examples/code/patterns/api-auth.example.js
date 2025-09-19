/**
 * API Authentication Pattern Examples
 *
 * Demonstrates JWT and API key authentication strategies with proper token lifecycle management.
 * Includes stateless authentication, role-based authorization, and security best practices.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { AuthenticationError, AuthorizationError } = require('./api-error-handling.example');

/**
 * JWT Authentication Service
 *
 * Handles JSON Web Token creation, validation, and refresh mechanisms.
 */
class JWTAuthService {
  constructor(options = {}) {
    this.accessTokenSecret = options.accessTokenSecret || process.env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = options.refreshTokenSecret || process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = options.accessTokenExpiry || '15m';
    this.refreshTokenExpiry = options.refreshTokenExpiry || '7d';
    this.issuer = options.issuer || 'api.example.com';
  }

  /**
   * Generate Access Token
   *
   * Short-lived token for API access (typically 15 minutes)
   */
  generateAccessToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      sessionId: user.sessionId || crypto.randomUUID()
    };

    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: this.issuer,
      subject: user.id.toString(),
      audience: 'api-users'
    });
  }

  /**
   * Generate Refresh Token
   *
   * Long-lived token for getting new access tokens (typically 7 days)
   */
  generateRefreshToken(user) {
    const payload = {
      userId: user.id,
      sessionId: user.sessionId || crypto.randomUUID(),
      type: 'refresh'
    };

    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: this.issuer,
      subject: user.id.toString(),
      audience: 'api-refresh'
    });
  }

  /**
   * Generate Token Pair
   *
   * Returns both access and refresh tokens
   */
  generateTokenPair(user) {
    const sessionId = crypto.randomUUID();
    const userWithSession = { ...user, sessionId };

    return {
      accessToken: this.generateAccessToken(userWithSession),
      refreshToken: this.generateRefreshToken(userWithSession),
      expiresIn: this._parseExpiry(this.accessTokenExpiry),
      tokenType: 'Bearer'
    };
  }

  /**
   * Verify Access Token
   */
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: this.issuer,
        audience: 'api-users'
      });

      return {
        valid: true,
        decoded,
        expired: false
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { valid: false, expired: true, error: 'Token expired' };
      }
      if (error.name === 'JsonWebTokenError') {
        return { valid: false, expired: false, error: 'Invalid token' };
      }
      return { valid: false, expired: false, error: error.message };
    }
  }

  /**
   * Verify Refresh Token
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: this.issuer,
        audience: 'api-refresh'
      });

      if (decoded.type !== 'refresh') {
        return { valid: false, error: 'Invalid token type' };
      }

      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  _parseExpiry(expiry) {
    const match = expiry.match(/(\d+)([smhd])/);
    if (!match) return 900; // Default 15 minutes

    const [, value, unit] = match;
    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
    return parseInt(value) * multipliers[unit];
  }
}

/**
 * API Key Authentication Service
 *
 * Handles API key generation, validation, and management for service-to-service authentication.
 */
class APIKeyAuthService {
  constructor() {
    this.keyPrefix = 'ak_'; // API key prefix for identification
    this.secretLength = 32; // API secret length in bytes
  }

  /**
   * Generate API Key
   *
   * Creates a new API key with associated secret
   */
  generateAPIKey(userId, name, permissions = [], expiresAt = null) {
    const keyId = crypto.randomBytes(16).toString('hex');
    const secret = crypto.randomBytes(this.secretLength).toString('hex');
    const publicKey = `${this.keyPrefix}${keyId}`;

    // Hash the secret for storage (never store plain secret)
    const hashedSecret = bcrypt.hashSync(secret, 12);

    const apiKey = {
      id: keyId,
      publicKey,
      hashedSecret,
      userId,
      name,
      permissions,
      createdAt: new Date(),
      expiresAt,
      lastUsedAt: null,
      isActive: true,
      usageCount: 0
    };

    return {
      apiKey,
      secret: `${publicKey}.${secret}` // Return full key only once
    };
  }

  /**
   * Validate API Key
   *
   * Verifies API key format and authenticates against stored hash
   */
  async validateAPIKey(fullKey) {
    try {
      // Parse the full key (format: ak_keyid.secret)
      const [publicKey, secret] = fullKey.split('.');

      if (!publicKey || !secret || !publicKey.startsWith(this.keyPrefix)) {
        return { valid: false, error: 'Invalid API key format' };
      }

      const keyId = publicKey.replace(this.keyPrefix, '');

      // Find API key in database
      const apiKey = await APIKey.findOne({
        id: keyId,
        isActive: true
      });

      if (!apiKey) {
        return { valid: false, error: 'API key not found' };
      }

      // Check expiration
      if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
        return { valid: false, error: 'API key expired' };
      }

      // Verify secret
      const isValidSecret = await bcrypt.compare(secret, apiKey.hashedSecret);
      if (!isValidSecret) {
        return { valid: false, error: 'Invalid API key secret' };
      }

      // Update usage statistics
      await this.updateAPIKeyUsage(apiKey.id);

      return {
        valid: true,
        apiKey: {
          id: apiKey.id,
          userId: apiKey.userId,
          name: apiKey.name,
          permissions: apiKey.permissions
        }
      };

    } catch (error) {
      return { valid: false, error: 'API key validation failed' };
    }
  }

  /**
   * Update API Key Usage
   */
  async updateAPIKeyUsage(keyId) {
    await APIKey.updateOne(
      { id: keyId },
      {
        $inc: { usageCount: 1 },
        $set: { lastUsedAt: new Date() }
      }
    );
  }

  /**
   * Revoke API Key
   */
  async revokeAPIKey(keyId, userId) {
    const result = await APIKey.updateOne(
      { id: keyId, userId },
      { $set: { isActive: false, revokedAt: new Date() } }
    );

    return result.modifiedCount > 0;
  }
}

/**
 * Authentication Middleware
 *
 * Express middleware for handling various authentication methods.
 */
class AuthenticationMiddleware {
  constructor() {
    this.jwtService = new JWTAuthService();
    this.apiKeyService = new APIKeyAuthService();
  }

  /**
   * JWT Authentication Middleware
   */
  authenticateJWT() {
    return async (req, res, next) => {
      try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return next(new AuthenticationError('Missing or invalid authorization header'));
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const verification = this.jwtService.verifyAccessToken(token);

        if (!verification.valid) {
          if (verification.expired) {
            return next(new AuthenticationError('Token expired', { type: 'expired' }));
          }
          return next(new AuthenticationError('Invalid token', { type: 'invalid' }));
        }

        // Check if user is still active
        const user = await User.findById(verification.decoded.userId);
        if (!user || !user.isActive) {
          return next(new AuthenticationError('User account deactivated'));
        }

        // Check if session is still valid (for logout functionality)
        if (user.revokedSessions && user.revokedSessions.includes(verification.decoded.sessionId)) {
          return next(new AuthenticationError('Session revoked'));
        }

        // Attach user information to request
        req.user = {
          id: verification.decoded.userId,
          email: verification.decoded.email,
          role: verification.decoded.role,
          permissions: verification.decoded.permissions,
          sessionId: verification.decoded.sessionId
        };

        next();

      } catch (error) {
        next(new AuthenticationError('Authentication failed'));
      }
    };
  }

  /**
   * API Key Authentication Middleware
   */
  authenticateAPIKey() {
    return async (req, res, next) => {
      try {
        const apiKey = req.header('X-API-Key') || req.query.api_key;

        if (!apiKey) {
          return next(new AuthenticationError('API key required'));
        }

        const validation = await this.apiKeyService.validateAPIKey(apiKey);

        if (!validation.valid) {
          return next(new AuthenticationError(validation.error));
        }

        // Get user information
        const user = await User.findById(validation.apiKey.userId);
        if (!user || !user.isActive) {
          return next(new AuthenticationError('Associated user account deactivated'));
        }

        // Attach API key and user information to request
        req.apiKey = validation.apiKey;
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: validation.apiKey.permissions, // Use API key permissions
          authMethod: 'api_key'
        };

        next();

      } catch (error) {
        next(new AuthenticationError('API key authentication failed'));
      }
    };
  }

  /**
   * Flexible Authentication Middleware
   *
   * Supports both JWT and API key authentication
   */
  authenticate() {
    return async (req, res, next) => {
      // Check for API key first
      const apiKey = req.header('X-API-Key') || req.query.api_key;
      if (apiKey) {
        return this.authenticateAPIKey()(req, res, next);
      }

      // Fall back to JWT authentication
      return this.authenticateJWT()(req, res, next);
    };
  }
}

/**
 * Authorization Middleware
 *
 * Role-based and permission-based access control.
 */
class AuthorizationMiddleware {
  /**
   * Require Specific Role
   */
  requireRole(requiredRole) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
      }

      if (req.user.role !== requiredRole) {
        return next(new AuthorizationError(
          `${requiredRole} role required`,
          { required: requiredRole, actual: req.user.role }
        ));
      }

      next();
    };
  }

  /**
   * Require Specific Permission
   */
  requirePermission(permission) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
      }

      if (!req.user.permissions.includes(permission)) {
        return next(new AuthorizationError(
          `Permission '${permission}' required`,
          { required: permission, userPermissions: req.user.permissions }
        ));
      }

      next();
    };
  }

  /**
   * Require Any of Multiple Permissions
   */
  requireAnyPermission(permissions) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
      }

      const hasPermission = permissions.some(permission =>
        req.user.permissions.includes(permission)
      );

      if (!hasPermission) {
        return next(new AuthorizationError(
          'Insufficient permissions',
          { required: permissions, userPermissions: req.user.permissions }
        ));
      }

      next();
    };
  }

  /**
   * Resource Owner Authorization
   *
   * Allows access if user owns the resource or has admin role
   */
  requireOwnershipOrAdmin(resourceUserIdPath = 'params.userId') {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
      }

      // Get resource user ID from request (e.g., req.params.userId)
      const pathParts = resourceUserIdPath.split('.');
      let resourceUserId = req;
      for (const part of pathParts) {
        resourceUserId = resourceUserId[part];
      }

      // Allow if user owns the resource or is admin
      if (req.user.id === resourceUserId || req.user.role === 'admin') {
        return next();
      }

      next(new AuthorizationError('Access denied to this resource'));
    };
  }
}

/**
 * Token Refresh Route Handler
 */
async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AuthenticationError('Refresh token required'));
    }

    const jwtService = new JWTAuthService();
    const verification = jwtService.verifyRefreshToken(refreshToken);

    if (!verification.valid) {
      return next(new AuthenticationError('Invalid refresh token'));
    }

    // Get user information
    const user = await User.findById(verification.decoded.userId);
    if (!user || !user.isActive) {
      return next(new AuthenticationError('User account deactivated'));
    }

    // Check if refresh token is in revoked list
    if (user.revokedRefreshTokens && user.revokedRefreshTokens.includes(refreshToken)) {
      return next(new AuthenticationError('Refresh token revoked'));
    }

    // Generate new token pair
    const tokenPair = jwtService.generateTokenPair(user);

    // Optionally revoke the old refresh token (for security)
    await User.updateOne(
      { _id: user.id },
      { $addToSet: { revokedRefreshTokens: refreshToken } }
    );

    res.apiSuccess(tokenPair);

  } catch (error) {
    next(new AuthenticationError('Token refresh failed'));
  }
}

/**
 * Logout Route Handler
 */
async function logout(req, res, next) {
  try {
    const { sessionId } = req.user;
    const { refreshToken } = req.body;

    // Revoke the session
    await User.updateOne(
      { _id: req.user.id },
      {
        $addToSet: {
          revokedSessions: sessionId,
          ...(refreshToken && { revokedRefreshTokens: refreshToken })
        }
      }
    );

    res.apiSuccess({ message: 'Logged out successfully' });

  } catch (error) {
    next(error);
  }
}

/**
 * Example Route Implementations
 */

const auth = new AuthenticationMiddleware();
const authz = new AuthorizationMiddleware();

// Public route - no authentication
app.get('/api/health', (req, res) => {
  res.apiSuccess({ status: 'healthy' });
});

// JWT protected route
app.get('/api/profile',
  auth.authenticateJWT(),
  (req, res) => {
    res.apiSuccess({ user: req.user });
  }
);

// API key protected route
app.get('/api/data',
  auth.authenticateAPIKey(),
  (req, res) => {
    res.apiSuccess({ data: 'sensitive information' });
  }
);

// Flexible authentication route
app.get('/api/users',
  auth.authenticate(),
  authz.requirePermission('read_users'),
  (req, res) => {
    // Handle user listing
  }
);

// Admin only route
app.delete('/api/users/:id',
  auth.authenticateJWT(),
  authz.requireRole('admin'),
  (req, res) => {
    // Handle user deletion
  }
);

// Resource ownership route
app.put('/api/users/:userId/profile',
  auth.authenticateJWT(),
  authz.requireOwnershipOrAdmin('params.userId'),
  (req, res) => {
    // Handle profile update
  }
);

/**
 * Authentication Examples
 */

// JWT Token Example
const jwtTokenExample = {
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "tokenType": "Bearer"
};

// API Key Example
const apiKeyExample = {
  "publicKey": "ak_1234567890abcdef",
  "fullKey": "ak_1234567890abcdef.secret123456789abcdef",
  "permissions": ["read_data", "write_data"]
};

module.exports = {
  JWTAuthService,
  APIKeyAuthService,
  AuthenticationMiddleware,
  AuthorizationMiddleware,
  refreshToken,
  logout,
  examples: {
    jwtTokenExample,
    apiKeyExample
  }
};

/**
 * Key Benefits of This Pattern:
 *
 * 1. Flexibility: Supports multiple authentication methods
 * 2. Security: Proper token lifecycle management and validation
 * 3. Scalability: Stateless JWT tokens enable horizontal scaling
 * 4. Granular Control: Role and permission-based authorization
 * 5. Auditability: Token usage tracking and session management
 *
 * Usage Tips:
 * - Use short-lived access tokens (15 minutes) for security
 * - Implement proper token refresh mechanisms
 * - Store API key secrets as hashes, never in plain text
 * - Include session management for secure logout functionality
 * - Implement rate limiting on authentication endpoints
 * - Log authentication events for security monitoring
 */
/**
 * JWT Security Implementation Example
 *
 * Secure JWT service with token validation, revocation, and refresh handling
 *
 * Features:
 * - RSA256 asymmetric signing
 * - Token revocation blacklist
 * - Custom claims validation
 * - Refresh token rotation
 * - Key rotation support
 * - Comprehensive security checks
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const Redis = require('redis');

class JWTService {
  constructor(redisClient) {
    this.redis = redisClient;
    this.privateKey = this.loadPrivateKey();
    this.publicKey = this.loadPublicKey();
    this.algorithm = 'RS256';
    this.issuer = process.env.JWT_ISSUER;
    this.audience = process.env.JWT_AUDIENCE;
    this.keyId = process.env.JWT_KEY_ID || 'default';
  }

  generateToken(payload, options = {}) {
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iss: this.issuer,
      aud: this.audience,
      iat: now,
      exp: now + (options.expiresIn || 3600), // 1 hour default
      jti: crypto.randomUUID(), // Unique token ID for revocation
      scope: options.scope || 'default',
      type: options.type || 'access'
    };

    return jwt.sign(tokenPayload, this.privateKey, {
      algorithm: this.algorithm,
      keyid: this.keyId
    });
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.publicKey, {
        algorithms: [this.algorithm],
        issuer: this.issuer,
        audience: this.audience,
        clockTolerance: 60 // 60 seconds clock skew tolerance
      });

      // Check if token is revoked
      if (await this.isTokenRevoked(decoded.jti)) {
        throw new Error('Token has been revoked');
      }

      // Check custom claims
      await this.validateCustomClaims(decoded);

      // Check token freshness for sensitive operations
      if (decoded.type === 'access' && this.requiresFreshToken(decoded)) {
        const tokenAge = Date.now() / 1000 - decoded.iat;
        if (tokenAge > 300) { // 5 minutes for sensitive operations
          throw new Error('Token too old for sensitive operation');
        }
      }

      return decoded;
    } catch (error) {
      throw new AuthenticationError('Invalid token: ' + error.message);
    }
  }

  async revokeToken(tokenId, reason = 'user_request') {
    // Add to revocation list with expiration
    const expirationTime = 24 * 60 * 60; // 24 hours
    await this.redis.setex(`revoked:${tokenId}`, expirationTime, JSON.stringify({
      revokedAt: new Date().toISOString(),
      reason
    }));
  }

  async isTokenRevoked(tokenId) {
    const revocationData = await this.redis.get(`revoked:${tokenId}`);
    return revocationData !== null;
  }

  async validateCustomClaims(decoded) {
    // Validate scope claims
    if (decoded.scope && !await this.isScopeValid(decoded.scope)) {
      throw new Error('Invalid token scope');
    }

    // Validate user still exists and is active
    if (decoded.sub) {
      const user = await this.getUserById(decoded.sub);
      if (!user || !user.isActive) {
        throw new Error('User account is inactive');
      }

      // Check if user's permissions have changed significantly
      if (decoded.permissions && await this.hasPermissionsChanged(decoded.sub, decoded.permissions)) {
        throw new Error('User permissions have changed - token refresh required');
      }
    }

    // Validate organization membership
    if (decoded.org && !await this.isUserInOrganization(decoded.sub, decoded.org)) {
      throw new Error('User no longer belongs to organization');
    }
  }

  createRefreshToken(userId, metadata = {}) {
    return this.generateToken({
      sub: userId,
      type: 'refresh',
      ...metadata
    }, {
      expiresIn: 30 * 24 * 60 * 60, // 30 days
      scope: 'refresh'
    });
  }

  async refreshAccessToken(refreshToken) {
    const decoded = await this.verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Get current user data
    const user = await this.getUserById(decoded.sub);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Generate new access token with current permissions
    const accessToken = this.generateToken({
      sub: decoded.sub,
      type: 'access',
      permissions: await this.getUserPermissions(user.id),
      org: user.organizationId,
      role: user.role
    });

    // Optionally rotate refresh token
    const newRefreshToken = this.createRefreshToken(decoded.sub, {
      deviceId: decoded.deviceId,
      location: decoded.location
    });

    // Revoke old refresh token
    await this.revokeToken(decoded.jti, 'token_refresh');

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600 // 1 hour
    };
  }

  async createTokenPair(user, context = {}) {
    const tokenPayload = {
      sub: user.id,
      permissions: await this.getUserPermissions(user.id),
      org: user.organizationId,
      role: user.role,
      email: user.email,
      deviceId: context.deviceId,
      location: context.location
    };

    const accessToken = this.generateToken({
      ...tokenPayload,
      type: 'access'
    });

    const refreshToken = this.generateToken({
      sub: user.id,
      type: 'refresh',
      deviceId: context.deviceId,
      location: context.location
    }, {
      expiresIn: 30 * 24 * 60 * 60 // 30 days
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600
    };
  }

  async blacklistUserTokens(userId, reason = 'security_incident') {
    // Add user to token blacklist
    const expirationTime = 24 * 60 * 60; // 24 hours
    await this.redis.setex(`user_blacklist:${userId}`, expirationTime, JSON.stringify({
      blacklistedAt: new Date().toISOString(),
      reason
    }));
  }

  async isUserTokensBlacklisted(userId) {
    const blacklistData = await this.redis.get(`user_blacklist:${userId}`);
    return blacklistData !== null;
  }

  loadPrivateKey() {
    try {
      const keyPath = process.env.JWT_PRIVATE_KEY_PATH || './keys/jwt-private.pem';
      return fs.readFileSync(keyPath, 'utf8');
    } catch (error) {
      throw new Error('Failed to load JWT private key: ' + error.message);
    }
  }

  loadPublicKey() {
    try {
      const keyPath = process.env.JWT_PUBLIC_KEY_PATH || './keys/jwt-public.pem';
      return fs.readFileSync(keyPath, 'utf8');
    } catch (error) {
      throw new Error('Failed to load JWT public key: ' + error.message);
    }
  }

  async rotateKeys() {
    // Generate new key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    // Save new keys
    const newKeyId = crypto.randomUUID();
    fs.writeFileSync(`./keys/jwt-private-${newKeyId}.pem`, privateKey);
    fs.writeFileSync(`./keys/jwt-public-${newKeyId}.pem`, publicKey);

    // Update configuration (this would typically be done through config management)
    console.log(`New key pair generated with ID: ${newKeyId}`);

    return { keyId: newKeyId, privateKey, publicKey };
  }

  getTokenClaims(token) {
    // Decode without verification for inspection
    return jwt.decode(token, { complete: true });
  }

  requiresFreshToken(decoded) {
    // Define operations that require fresh tokens
    const sensitiveScopes = ['admin', 'financial', 'user_management'];
    return sensitiveScopes.includes(decoded.scope);
  }

  // Repository interface methods (to be implemented)
  async getUserById(userId) {
    // Implement user retrieval
    throw new Error('Not implemented');
  }

  async getUserPermissions(userId) {
    // Implement user permissions retrieval
    throw new Error('Not implemented');
  }

  async isScopeValid(scope) {
    // Implement scope validation
    const validScopes = ['default', 'admin', 'api', 'refresh', 'financial'];
    return validScopes.includes(scope);
  }

  async hasPermissionsChanged(userId, tokenPermissions) {
    // Implement permission change detection
    const currentPermissions = await this.getUserPermissions(userId);
    return JSON.stringify(currentPermissions) !== JSON.stringify(tokenPermissions);
  }

  async isUserInOrganization(userId, orgId) {
    // Implement organization membership check
    const user = await this.getUserById(userId);
    return user && user.organizationId === orgId;
  }
}

// Express.js middleware for JWT authentication
const jwtMiddleware = (jwtService) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = await jwtService.verifyToken(token);

      // Check if user tokens are blacklisted
      if (await jwtService.isUserTokensBlacklisted(decoded.sub)) {
        return res.status(401).json({
          error: 'User tokens have been revoked',
          code: 'USER_TOKENS_BLACKLISTED'
        });
      }

      req.user = {
        id: decoded.sub,
        role: decoded.role,
        permissions: decoded.permissions || [],
        organization: decoded.org,
        tokenId: decoded.jti,
        tokenType: decoded.type
      };

      req.token = decoded;

      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(401).json({
          error: 'Invalid token',
          message: error.message
        });
      }

      return res.status(500).json({
        error: 'Token validation failed',
        message: error.message
      });
    }
  };
};

// Middleware to require specific scopes
const requireScope = (requiredScope) => {
  return (req, res, next) => {
    if (!req.token || req.token.scope !== requiredScope) {
      return res.status(403).json({
        error: 'Insufficient scope',
        required: requiredScope,
        current: req.token?.scope
      });
    }

    next();
  };
};

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

module.exports = {
  JWTService,
  jwtMiddleware,
  requireScope,
  AuthenticationError
};
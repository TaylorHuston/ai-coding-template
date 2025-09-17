---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "security-engineers", "backend-engineers"]
document_type: "guide"
priority: "critical"
tags: ["authentication", "authorization", "jwt", "mfa", "rbac", "abac", "sessions"]
difficulty: "advanced"
estimated_time: "25 min"
---

# Authentication & Authorization

**Purpose**: Comprehensive authentication and authorization patterns, including multi-factor authentication, role-based access control, session management, and secure token handling.

## Authentication Standards

### **Multi-Factor Authentication (MFA)**

```javascript
// Comprehensive MFA implementation
class MFAService {
  async authenticateUser(credentials) {
    // Step 1: Primary authentication
    const user = await this.validateCredentials(credentials);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Step 2: Check MFA requirement
    if (user.mfaEnabled) {
      const mfaToken = await this.generateMFAChallenge(user);
      return {
        status: 'mfa_required',
        challengeToken: mfaToken,
        availableMethods: user.mfaMethods
      };
    }

    // Step 3: Create authenticated session
    return this.createSession(user);
  }

  async validateMFAToken(challengeToken, userToken, method) {
    const challenge = await this.validateChallengeToken(challengeToken);

    switch (method) {
      case 'totp':
        return this.validateTOTP(challenge.userId, userToken);
      case 'sms':
        return this.validateSMSCode(challenge.userId, userToken);
      case 'email':
        return this.validateEmailCode(challenge.userId, userToken);
      case 'webauthn':
        return this.validateWebAuthn(challenge.userId, userToken);
      default:
        throw new ValidationError('Invalid MFA method');
    }
  }

  async validateTOTP(userId, token) {
    const user = await this.getUserById(userId);
    const secret = await this.getTOTPSecret(userId);

    // Use window to account for clock skew
    const window = 1; // Allow 1 step before/after current

    for (let i = -window; i <= window; i++) {
      const expectedToken = this.generateTOTP(secret, Date.now() + (i * 30000));
      if (this.constantTimeCompare(token, expectedToken)) {

        // Prevent token reuse
        if (await this.hasTokenBeenUsed(userId, token)) {
          throw new AuthenticationError('Token already used');
        }

        await this.markTokenAsUsed(userId, token);
        return { success: true, method: 'totp' };
      }
    }

    throw new AuthenticationError('Invalid TOTP token');
  }

  async setupTOTP(userId) {
    const secret = this.generateTOTPSecret();
    const user = await this.getUserById(userId);

    const qrCode = await this.generateQRCode({
      secret,
      label: user.email,
      issuer: process.env.APP_NAME
    });

    // Store secret temporarily until verification
    await this.storeTempTOTPSecret(userId, secret);

    return {
      secret,
      qrCode,
      backupCodes: await this.generateBackupCodes(userId)
    };
  }

  constantTimeCompare(a, b) {
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}
```

### **Password Security**

```javascript
// Secure password handling
const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  preventUserInfoInPassword: true
};

class PasswordService {
  async hashPassword(password, userData = {}) {
    // Validate password strength
    this.validatePasswordStrength(password, userData);

    // Use bcrypt with high cost factor
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  validatePasswordStrength(password, userData) {
    // Check basic requirements
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      throw new ValidationError('Password too short');
    }

    if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
      throw new ValidationError('Password too long');
    }

    // Check character requirements
    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      throw new ValidationError('Password must contain uppercase letters');
    }

    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      throw new ValidationError('Password must contain lowercase letters');
    }

    if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
      throw new ValidationError('Password must contain numbers');
    }

    if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new ValidationError('Password must contain special characters');
    }

    // Check against common passwords
    if (this.isCommonPassword(password)) {
      throw new ValidationError('Password is too common');
    }

    // Check against user information
    if (this.containsUserInfo(password, userData)) {
      throw new ValidationError('Password cannot contain personal information');
    }

    // Calculate entropy
    const entropy = this.calculatePasswordEntropy(password);
    if (entropy < 60) {
      throw new ValidationError('Password is not complex enough');
    }
  }

  calculatePasswordEntropy(password) {
    const charsets = [
      /[a-z]/.test(password) ? 26 : 0, // lowercase
      /[A-Z]/.test(password) ? 26 : 0, // uppercase
      /\d/.test(password) ? 10 : 0,    // digits
      /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 32 : 0 // special chars
    ];

    const charsetSize = charsets.reduce((sum, size) => sum + size, 0);
    return password.length * Math.log2(charsetSize);
  }

  // Prevent timing attacks during verification
  async verifyPassword(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);

    // Add consistent timing delay
    await this.constantTimeDelay();

    return isValid;
  }

  async constantTimeDelay() {
    // Add small random delay to prevent timing analysis
    const delay = Math.random() * 50 + 50; // 50-100ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async generateSecureRandomPassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    // Ensure at least one character from each required type
    password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz');
    password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    password += this.getRandomChar('0123456789');
    password += this.getRandomChar('!@#$%^&*');

    // Fill remaining length
    for (let i = 4; i < length; i++) {
      password += this.getRandomChar(charset);
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}
```

## Authorization Patterns

### **Role-Based Access Control (RBAC)**

```javascript
// Comprehensive RBAC implementation
class RBACAuthorizationService {
  constructor(roleRepository, permissionRepository) {
    this.roles = roleRepository;
    this.permissions = permissionRepository;
  }

  async hasPermission(userId, resource, action) {
    const userRoles = await this.getUserRoles(userId);
    const requiredPermission = `${resource}:${action}`;

    for (const role of userRoles) {
      const rolePermissions = await this.getRolePermissions(role.id);

      if (this.permissionMatches(rolePermissions, requiredPermission)) {
        return true;
      }
    }

    return false;
  }

  permissionMatches(userPermissions, requiredPermission) {
    return userPermissions.some(permission => {
      // Support wildcard permissions
      if (permission.includes('*')) {
        const pattern = permission.replace('*', '.*');
        return new RegExp(`^${pattern}$`).test(requiredPermission);
      }

      return permission === requiredPermission;
    });
  }

  async assignRole(userId, roleId, context = {}) {
    // Check if user can assign this role
    const canAssign = await this.hasPermission(
      context.assignedBy,
      'roles',
      'assign'
    );

    if (!canAssign) {
      throw new AuthorizationError('Insufficient permissions to assign role');
    }

    // Check role hierarchy constraints
    const assignerRoles = await this.getUserRoles(context.assignedBy);
    const targetRole = await this.getRoleById(roleId);

    if (!this.canAssignRole(assignerRoles, targetRole)) {
      throw new AuthorizationError('Cannot assign role with equal or higher privileges');
    }

    await this.roles.assignUserRole(userId, roleId);

    // Audit trail
    await this.auditRoleAssignment(userId, roleId, context);
  }

  canAssignRole(assignerRoles, targetRole) {
    const maxAssignerLevel = Math.max(
      ...assignerRoles.map(role => role.hierarchyLevel)
    );

    return targetRole.hierarchyLevel < maxAssignerLevel;
  }

  async createRoleHierarchy() {
    const hierarchy = {
      'super_admin': {
        level: 10,
        permissions: ['*'],
        inherits: []
      },
      'admin': {
        level: 8,
        permissions: [
          'users:*',
          'roles:read',
          'reports:*'
        ],
        inherits: ['moderator']
      },
      'moderator': {
        level: 5,
        permissions: [
          'content:*',
          'users:read',
          'users:suspend'
        ],
        inherits: ['user']
      },
      'user': {
        level: 1,
        permissions: [
          'profile:read',
          'profile:update',
          'content:read',
          'content:create'
        ],
        inherits: []
      }
    };

    return hierarchy;
  }
}

// Usage in middleware
const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasAccess = await rbacService.hasPermission(userId, resource, action);

    if (!hasAccess) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: `${resource}:${action}`
      });
    }

    next();
  };
};

// Usage in routes
router.get('/admin/users',
  authenticate,
  requirePermission('users', 'list'),
  adminController.getUsers
);

router.delete('/admin/users/:id',
  authenticate,
  requirePermission('users', 'delete'),
  adminController.deleteUser
);
```

### **Attribute-Based Access Control (ABAC)**

```javascript
// Advanced context-aware authorization
class ABACAuthorizationService {
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

    return this.evaluateRules(policy.rules, evaluationContext);
  }

  evaluateRules(rules, context) {
    return rules.every(rule => {
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
        default:
          return false;
      }
    });
  }

  evaluateTimeRule(rule, currentTime) {
    const hour = currentTime.getHours();
    const dayOfWeek = currentTime.getDay();

    if (rule.allowedHours && !rule.allowedHours.includes(hour)) {
      return false;
    }

    if (rule.allowedDays && !rule.allowedDays.includes(dayOfWeek)) {
      return false;
    }

    return true;
  }

  evaluateLocationRule(rule, location) {
    if (!location) return rule.allowUnknownLocation || false;

    if (rule.allowedCountries && !rule.allowedCountries.includes(location.country)) {
      return false;
    }

    if (rule.blockedCountries && rule.blockedCountries.includes(location.country)) {
      return false;
    }

    if (rule.allowedIpRanges) {
      return rule.allowedIpRanges.some(range => this.isIpInRange(location.ip, range));
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

    return true;
  }

  evaluateDynamicRule(rule, context) {
    // Support for custom JavaScript evaluation (carefully sandboxed)
    try {
      const vm = require('vm');
      const sandbox = {
        subject: context.subject,
        resource: context.resource,
        action: context.action,
        environment: context.environment,
        helpers: this.getHelperFunctions()
      };

      const script = new vm.Script(rule.condition);
      const vmContext = vm.createContext(sandbox);

      return script.runInContext(vmContext, { timeout: 1000 });
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
      }
    };
  }
}

// Example ABAC policy
const documentAccessPolicy = {
  resource: 'document',
  action: 'read',
  rules: [
    {
      type: 'resource_owner',
      requireOwnership: false,
      requireSameOrganization: true
    },
    {
      type: 'time_based',
      allowedHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], // Business hours
      allowedDays: [1, 2, 3, 4, 5] // Monday to Friday
    },
    {
      type: 'location_based',
      allowedCountries: ['US', 'CA', 'GB'],
      allowUnknownLocation: false
    },
    {
      type: 'dynamic_attribute',
      condition: `
        subject.department === 'legal' ||
        (subject.clearanceLevel >= resource.classificationLevel &&
         subject.needToKnow.includes(resource.category))
      `
    }
  ]
};
```

## Session Management

### **Secure Session Handling**

```javascript
// Comprehensive session management
class SessionManager {
  constructor(redisClient, encryptionService) {
    this.redis = redisClient;
    this.encryption = encryptionService;
    this.sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
    this.maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
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
      permissions: await this.getUserPermissions(user.id)
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

  async invalidateAllUserSessions(userId) {
    const activeSessions = await this.getActiveSessions(userId);

    for (const sessionId of activeSessions) {
      await this.invalidateSession(sessionId);
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
}
```

## JWT Token Security

### **Secure JWT Implementation**

```javascript
// Secure JWT service
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
      scope: options.scope || 'default'
    };

    return jwt.sign(tokenPayload, this.privateKey, {
      algorithm: this.algorithm,
      keyid: this.getKeyId()
    });
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.publicKey, {
        algorithms: [this.algorithm],
        issuer: this.issuer,
        audience: this.audience
      });

      // Check if token is revoked
      if (await this.isTokenRevoked(decoded.jti)) {
        throw new Error('Token has been revoked');
      }

      // Check custom claims
      await this.validateCustomClaims(decoded);

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
    }
  }

  createRefreshToken(userId) {
    return this.generateToken({
      sub: userId,
      type: 'refresh'
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

    // Generate new access token
    const accessToken = this.generateToken({
      sub: decoded.sub,
      type: 'access'
    });

    // Optionally rotate refresh token
    const newRefreshToken = this.createRefreshToken(decoded.sub);

    // Revoke old refresh token
    await this.revokeToken(decoded.jti, 'token_refresh');

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }
}
```

## Rate Limiting and Account Protection

### **Advanced Rate Limiting**

```javascript
// Comprehensive rate limiting service
class RateLimitService {
  constructor(redisClient) {
    this.redis = redisClient;
    this.limits = {
      authentication: { requests: 5, window: 15 * 60 * 1000 }, // 5 per 15 min
      password_reset: { requests: 3, window: 60 * 60 * 1000 }, // 3 per hour
      api_general: { requests: 1000, window: 60 * 60 * 1000 }, // 1000 per hour
      api_premium: { requests: 10000, window: 60 * 60 * 1000 } // 10000 per hour
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

      // Log rate limit violation
      await this.logRateLimitViolation(identifier, limitType, currentCount, context);

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

  // Progressive delay for failed authentication attempts
  async getAuthenticationDelay(identifier) {
    const failureKey = `auth_failures:${identifier}`;
    const failures = await this.redis.get(failureKey) || 0;

    // Progressive delays: 0s, 1s, 4s, 9s, 16s, 25s...
    const delay = Math.min(Math.pow(failures, 2), 300) * 1000; // Max 5 minutes

    return delay;
  }

  async recordAuthenticationFailure(identifier) {
    const failureKey = `auth_failures:${identifier}`;
    const failures = await this.redis.incr(failureKey);

    if (failures === 1) {
      // Set expiration for first failure
      await this.redis.expire(failureKey, 60 * 60); // 1 hour
    }

    return failures;
  }

  async clearAuthenticationFailures(identifier) {
    await this.redis.del(`auth_failures:${identifier}`);
  }

  // Middleware for Express.js
  createMiddleware(limitType) {
    return async (req, res, next) => {
      const identifier = this.getIdentifier(req);
      const result = await this.checkRateLimit(identifier, limitType, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path
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
```

---

## Related Guidelines

- **[Security Principles](./security-principles.md)** - Core security principles and foundations
- **[Security Implementation](./security-implementation.md)** - Practical security implementation patterns
- **[API Implementation Patterns](./api-implementation-patterns.md)** - API authentication and authorization patterns
- **[Quality Standards](./quality-standards.md)** - Security validation protocols

## Navigation

- **[← Back to Guidelines](./README.md)** - All development guideline documentation
- **[Development Documentation](../README.md)** - All development documentation overview

---

**System Guidelines**: [CLAUDE.md](../../../CLAUDE.md) - AI assistant instructions and project context
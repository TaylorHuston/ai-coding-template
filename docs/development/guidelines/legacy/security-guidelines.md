---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "security-engineers"]
document_type: "specification"
priority: "critical"
tags: ["security", "authentication", "authorization", "encryption", "compliance"]
difficulty: "advanced"
estimated_time: "45 min"
---

# Security Guidelines

**Purpose**: Comprehensive security standards, practices, and requirements for building secure applications with AI assistance while maintaining robust protection against threats.

## Security Philosophy

### **Security by Design**
- Security considerations integrated from project inception
- Threat modeling conducted for all major features
- Defense in depth strategy with multiple security layers
- Zero trust architecture principles applied

### **Proactive Security**
- Regular security assessments and penetration testing
- Continuous monitoring and threat detection
- Automated security scanning in CI/CD pipelines
- Incident response procedures documented and tested

### **AI-Assisted Security**
- AI-generated code receives enhanced security review
- Automated security pattern detection and validation
- Human oversight for all security-critical implementations
- Security training data and patterns maintained

## Authentication and Authorization

### **Authentication Standards**

#### **Multi-Factor Authentication (MFA)**
```javascript
// Good: Comprehensive MFA implementation
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
      default:
        throw new ValidationError('Invalid MFA method');
    }
  }
}
```

#### **Password Security**
```javascript
// Good: Secure password handling
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

  // Prevent timing attacks during verification
  async verifyPassword(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);

    // Add consistent timing delay
    await this.constantTimeDelay();

    return isValid;
  }
}
```

### **Authorization Patterns**

#### **Role-Based Access Control (RBAC)**
```javascript
// Good: Comprehensive RBAC implementation
class AuthorizationService {
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
}

// Usage in middleware
const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasAccess = await authService.hasPermission(userId, resource, action);

    if (!hasAccess) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: `${resource}:${action}`
      });
    }

    next();
  };
};
```

#### **Attribute-Based Access Control (ABAC)**
```javascript
// Advanced: Context-aware authorization
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
        default:
          return false;
      }
    });
  }
}
```

## Input Validation and Sanitization

### **Comprehensive Input Validation**

#### **Validation Patterns**
```javascript
// Good: Layered validation approach
class InputValidator {
  static validateUserRegistration(data) {
    const schema = {
      email: {
        type: 'email',
        required: true,
        maxLength: 254,
        blacklist: ['tempmail.com', 'throwaway.email']
      },
      password: {
        type: 'password',
        required: true,
        minLength: 12,
        maxLength: 128,
        complexity: 'high'
      },
      name: {
        type: 'string',
        required: true,
        maxLength: 100,
        pattern: /^[a-zA-Z\s\-']+$/,
        sanitize: true
      },
      age: {
        type: 'integer',
        required: true,
        min: 13,
        max: 120
      },
      profilePicture: {
        type: 'file',
        required: false,
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        scanForMalware: true
      }
    };

    return this.validate(data, schema);
  }

  static validate(data, schema) {
    const errors = [];
    const sanitized = {};

    for (const [field, rules] of Object.entries(schema)) {
      try {
        const value = this.validateField(data[field], rules, field);
        sanitized[field] = value;
      } catch (error) {
        errors.push({ field, message: error.message });
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    return sanitized;
  }

  static validateField(value, rules, fieldName) {
    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      throw new Error(`${fieldName} is required`);
    }

    // Skip further validation if optional and empty
    if (!rules.required && !value) {
      return value;
    }

    // Type validation
    const validatedValue = this.validateType(value, rules.type, fieldName);

    // Length validation
    if (rules.minLength && validatedValue.length < rules.minLength) {
      throw new Error(`${fieldName} must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && validatedValue.length > rules.maxLength) {
      throw new Error(`${fieldName} must not exceed ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(validatedValue)) {
      throw new Error(`${fieldName} format is invalid`);
    }

    // Sanitization
    if (rules.sanitize) {
      return this.sanitizeString(validatedValue);
    }

    return validatedValue;
  }
}
```

#### **SQL Injection Prevention**
```javascript
// Good: Parameterized queries and ORM usage
class UserRepository {
  constructor(database) {
    this.db = database;
  }

  // Using parameterized queries
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL';
    const result = await this.db.query(query, [email]);
    return result[0];
  }

  // Using query builder (prevents injection)
  async findUsersWithFilters(filters) {
    let query = this.db.table('users')
      .select('id', 'email', 'name', 'created_at')
      .where('deleted_at', null);

    if (filters.department) {
      query = query.where('department', filters.department);
    }

    if (filters.role) {
      query = query.where('role', filters.role);
    }

    if (filters.created_after) {
      query = query.where('created_at', '>=', filters.created_after);
    }

    return await query;
  }

  // Bad example (vulnerable to SQL injection)
  async findByEmailVulnerable(email) {
    // NEVER DO THIS
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    return await this.db.query(query);
  }
}
```

#### **XSS Prevention**
```javascript
// Good: Context-aware output encoding
class HTMLSanitizer {
  static sanitizeForHTML(input) {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'title'],
      ALLOW_DATA_ATTR: false
    });
  }

  static sanitizeForHTMLAttribute(input) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  static sanitizeForJavaScript(input) {
    // For JSON context
    return JSON.stringify(input);
  }

  static sanitizeForURL(input) {
    return encodeURIComponent(input);
  }
}

// Usage in templating
app.get('/user/:id', async (req, res) => {
  const user = await userService.findById(req.params.id);

  res.render('user-profile', {
    userName: HTMLSanitizer.sanitizeForHTML(user.name),
    userBio: HTMLSanitizer.sanitizeForHTML(user.bio),
    avatarUrl: HTMLSanitizer.sanitizeForHTMLAttribute(user.avatarUrl)
  });
});
```

## Data Protection and Encryption

### **Encryption Standards**

#### **Data at Rest**
```javascript
// Good: Comprehensive encryption for sensitive data
class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16;  // 128 bits
    this.tagLength = 16; // 128 bits
  }

  encrypt(plaintext, key) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData, key) {
    const decipher = crypto.createDecipher(
      this.algorithm,
      key,
      Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

// Usage for PII storage
class UserService {
  async storeUser(userData) {
    const encryptedData = {
      email: userData.email, // Searchable, less sensitive
      name: this.encryption.encrypt(userData.name, this.getEncryptionKey()),
      ssn: this.encryption.encrypt(userData.ssn, this.getEncryptionKey()),
      phone: this.encryption.encrypt(userData.phone, this.getEncryptionKey())
    };

    return await this.repository.create(encryptedData);
  }
}
```

#### **Data in Transit**
```javascript
// Good: TLS configuration and certificate pinning
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

// TLS configuration
const tlsOptions = {
  key: fs.readFileSync('/path/to/private-key.pem'),
  cert: fs.readFileSync('/path/to/certificate.pem'),
  ca: fs.readFileSync('/path/to/ca-certificate.pem'),

  // Security enhancements
  secureProtocol: 'TLSv1_2_method',
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-RSA-AES256-SHA384'
  ].join(':'),
  honorCipherOrder: true
};

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'");
  next();
});

https.createServer(tlsOptions, app).listen(443);
```

### **Key Management**

#### **Secure Key Storage and Rotation**
```javascript
// Good: Key management service
class KeyManagementService {
  constructor(vaultService) {
    this.vault = vaultService;
    this.keyRotationInterval = 90 * 24 * 60 * 60 * 1000; // 90 days
  }

  async getEncryptionKey(keyId, version = 'latest') {
    const key = await this.vault.getSecret(`encryption-keys/${keyId}`, version);

    // Check if key rotation is needed
    if (this.isKeyRotationNeeded(key)) {
      await this.rotateKey(keyId);
    }

    return key.value;
  }

  async rotateKey(keyId) {
    // Generate new key
    const newKey = crypto.randomBytes(32);
    const newVersion = await this.vault.createSecret(
      `encryption-keys/${keyId}`,
      newKey.toString('hex')
    );

    // Schedule re-encryption of data with old key
    await this.scheduleDataReencryption(keyId, newVersion);

    return newVersion;
  }

  async scheduleDataReencryption(keyId, newVersion) {
    // Background job to re-encrypt data with new key
    await this.jobQueue.add('reencrypt-data', {
      keyId,
      newVersion,
      oldVersion: newVersion - 1
    });
  }
}
```

## Session Management

### **Secure Session Handling**

#### **Session Security Implementation**
```javascript
// Good: Comprehensive session management
class SessionService {
  constructor(redisClient, encryptionService) {
    this.redis = redisClient;
    this.encryption = encryptionService;
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
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
      mfaVerified: context.mfaVerified || false
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
  }

  generateSecureSessionId() {
    // Generate cryptographically secure random session ID
    return crypto.randomBytes(32).toString('hex');
  }
}
```

## API Security

### **API Authentication and Rate Limiting**

#### **JWT Token Security**
```javascript
// Good: Secure JWT implementation
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
}
```

#### **Rate Limiting Implementation**
```javascript
// Good: Comprehensive rate limiting
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
```

## Security Monitoring and Logging

### **Security Event Logging**

#### **Comprehensive Security Logging**
```javascript
// Good: Security-focused logging system
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
}
```

### **Threat Detection**

#### **Anomaly Detection System**
```javascript
// Good: Automated threat detection
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

  async isAccountLocked(identifier) {
    return await this.redis.exists(`lockout:${identifier}`);
  }
}
```

## File Upload Security

### **Secure File Handling**

#### **File Upload Validation**
```javascript
// Good: Comprehensive file upload security
class SecureFileUploadService {
  constructor(virusScanner, encryptionService) {
    this.virusScanner = virusScanner;
    this.encryption = encryptionService;
    this.allowedTypes = {
      'image/jpeg': { maxSize: 5 * 1024 * 1024, extensions: ['.jpg', '.jpeg'] },
      'image/png': { maxSize: 5 * 1024 * 1024, extensions: ['.png'] },
      'image/webp': { maxSize: 5 * 1024 * 1024, extensions: ['.webp'] },
      'application/pdf': { maxSize: 10 * 1024 * 1024, extensions: ['.pdf'] },
      'text/plain': { maxSize: 1 * 1024 * 1024, extensions: ['.txt'] }
    };
  }

  async validateAndProcessUpload(file, context) {
    // 1. Basic validation
    this.validateFileBasics(file);

    // 2. MIME type validation
    const detectedType = await this.detectMimeType(file.buffer);
    this.validateMimeType(detectedType, file.mimetype);

    // 3. File size validation
    this.validateFileSize(file.size, detectedType);

    // 4. File extension validation
    this.validateFileExtension(file.originalname, detectedType);

    // 5. Content validation
    await this.validateFileContent(file.buffer, detectedType);

    // 6. Virus scanning
    await this.scanForMalware(file.buffer);

    // 7. Generate secure filename
    const secureFilename = this.generateSecureFilename(file.originalname);

    // 8. Process and store file
    return await this.storeSecureFile(file.buffer, secureFilename, context);
  }

  validateFileBasics(file) {
    if (!file || !file.buffer) {
      throw new ValidationError('No file provided');
    }

    if (file.size === 0) {
      throw new ValidationError('Empty files are not allowed');
    }

    if (file.originalname.length > 255) {
      throw new ValidationError('Filename too long');
    }

    // Check for dangerous filename patterns
    const dangerousPatterns = [
      /\.\./,           // Directory traversal
      /[<>:"|?*]/,      // Invalid filename characters
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i // Windows reserved names
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(file.originalname)) {
        throw new ValidationError('Invalid filename pattern');
      }
    }
  }

  async detectMimeType(buffer) {
    // Use file signature detection, not client-provided MIME type
    const FileType = require('file-type');
    const result = await FileType.fromBuffer(buffer);
    return result?.mime || 'application/octet-stream';
  }

  validateMimeType(detectedType, clientType) {
    if (!this.allowedTypes[detectedType]) {
      throw new ValidationError(`File type ${detectedType} is not allowed`);
    }

    // Optional: Check if client-provided type matches detected type
    if (clientType !== detectedType) {
      // Log potential MIME type spoofing attempt
      this.logger.logSecurityViolation('mime_type_mismatch', {
        clientType,
        detectedType
      });
    }
  }

  async validateFileContent(buffer, mimeType) {
    switch (mimeType) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/webp':
        return this.validateImageContent(buffer);
      case 'application/pdf':
        return this.validatePDFContent(buffer);
      case 'text/plain':
        return this.validateTextContent(buffer);
      default:
        throw new ValidationError('Content validation not implemented for this file type');
    }
  }

  async validateImageContent(buffer) {
    try {
      const sharp = require('sharp');
      const metadata = await sharp(buffer).metadata();

      // Check for reasonable image dimensions
      if (metadata.width > 10000 || metadata.height > 10000) {
        throw new ValidationError('Image dimensions too large');
      }

      // Check for embedded scripts or malicious content
      if (this.containsSuspiciousContent(buffer)) {
        throw new ValidationError('Suspicious content detected in image');
      }

      return metadata;
    } catch (error) {
      throw new ValidationError('Invalid image file');
    }
  }

  async scanForMalware(buffer) {
    try {
      const scanResult = await this.virusScanner.scan(buffer);

      if (scanResult.infected) {
        this.logger.logSecurityViolation('malware_detected', {
          virusName: scanResult.virusName,
          scanner: scanResult.scanner
        });

        throw new SecurityError('Malware detected in uploaded file');
      }
    } catch (error) {
      if (error instanceof SecurityError) {
        throw error;
      }

      // If virus scanning fails, log error but don't fail upload
      this.logger.logSecurityViolation('virus_scan_failed', {
        error: error.message
      });
    }
  }

  generateSecureFilename(originalName) {
    const ext = path.extname(originalName).toLowerCase();
    const uuid = crypto.randomUUID();
    const timestamp = Date.now();

    return `${timestamp}-${uuid}${ext}`;
  }

  async storeSecureFile(buffer, filename, context) {
    // Encrypt file before storage
    const encryptedBuffer = this.encryption.encrypt(buffer, this.getFileEncryptionKey());

    // Store with restricted permissions
    const filePath = path.join(this.getSecureStoragePath(), filename);
    await fs.writeFile(filePath, encryptedBuffer, { mode: 0o600 });

    // Create database record
    const fileRecord = {
      filename,
      originalName: context.originalName,
      mimeType: context.mimeType,
      size: buffer.length,
      uploadedBy: context.userId,
      uploadedAt: new Date(),
      encryptionKeyId: this.getFileEncryptionKeyId()
    };

    return await this.fileRepository.create(fileRecord);
  }
}
```

## AI Security Considerations

### **AI-Generated Code Security**

#### **AI Code Security Review Process**
```javascript
// Good: Enhanced security review for AI-generated code
class AICodeSecurityReviewer {
  constructor(securityAnalyzer, humanReviewer) {
    this.analyzer = securityAnalyzer;
    this.humanReviewer = humanReviewer;
    this.aiSecurityPatterns = this.loadSecurityPatterns();
  }

  async reviewAIGeneratedCode(code, context) {
    const review = {
      timestamp: new Date(),
      aiModel: context.aiModel,
      humanReviewer: context.humanReviewer,
      securityIssues: [],
      recommendations: [],
      approved: false
    };

    // 1. Automated security analysis
    const automaticIssues = await this.analyzer.scanCode(code);
    review.securityIssues.push(...automaticIssues);

    // 2. AI-specific pattern analysis
    const aiSpecificIssues = this.checkAISecurityPatterns(code);
    review.securityIssues.push(...aiSpecificIssues);

    // 3. Human security review (required for critical code)
    if (this.isCriticalCode(code, context)) {
      const humanReview = await this.humanReviewer.reviewCode(code, {
        focus: 'security',
        aiGenerated: true,
        automaticIssues: review.securityIssues
      });

      review.humanReview = humanReview;
      review.approved = humanReview.approved;
    }

    // 4. Generate security recommendations
    review.recommendations = this.generateSecurityRecommendations(
      code,
      review.securityIssues
    );

    return review;
  }

  checkAISecurityPatterns(code) {
    const issues = [];

    // Check for common AI security anti-patterns
    for (const pattern of this.aiSecurityPatterns) {
      if (pattern.matcher(code)) {
        issues.push({
          type: 'ai_security_pattern',
          severity: pattern.severity,
          message: pattern.message,
          recommendation: pattern.recommendation,
          pattern: pattern.name
        });
      }
    }

    return issues;
  }

  loadSecurityPatterns() {
    return [
      {
        name: 'hardcoded_credentials',
        matcher: (code) => /(?:password|secret|key|token)\s*=\s*['"][^'"]{8,}['"]/.test(code),
        severity: 'critical',
        message: 'Hardcoded credentials detected',
        recommendation: 'Use environment variables or secure key management'
      },
      {
        name: 'sql_injection_risk',
        matcher: (code) => /query\s*\+|SELECT.*\+|INSERT.*\+/.test(code),
        severity: 'high',
        message: 'Potential SQL injection vulnerability',
        recommendation: 'Use parameterized queries or ORM methods'
      },
      {
        name: 'eval_usage',
        matcher: (code) => /\beval\s*\(/.test(code),
        severity: 'high',
        message: 'Use of eval() function detected',
        recommendation: 'Avoid eval() and use safer alternatives'
      },
      {
        name: 'unsafe_redirect',
        matcher: (code) => /redirect\([^)]*req\./.test(code),
        severity: 'medium',
        message: 'Potential open redirect vulnerability',
        recommendation: 'Validate redirect URLs against allowlist'
      }
    ];
  }

  isCriticalCode(code, context) {
    // Determine if code requires mandatory human security review
    const criticalIndicators = [
      'authentication',
      'authorization',
      'encryption',
      'payment',
      'database',
      'admin',
      'security'
    ];

    return criticalIndicators.some(indicator =>
      code.toLowerCase().includes(indicator) ||
      context.description?.toLowerCase().includes(indicator)
    );
  }
}
```

## Compliance and Governance

### **Regulatory Compliance**

#### **GDPR Compliance Implementation**
```javascript
// Good: GDPR-compliant data handling
class GDPRComplianceService {
  constructor(dataRepository, auditLogger) {
    this.data = dataRepository;
    this.audit = auditLogger;
  }

  async processDataSubjectRequest(requestType, userEmail, context) {
    this.audit.logDataProcessingActivity({
      type: 'data_subject_request',
      requestType,
      userEmail,
      requestedBy: context.requestedBy,
      timestamp: new Date()
    });

    switch (requestType) {
      case 'access':
        return await this.handleAccessRequest(userEmail, context);
      case 'rectification':
        return await this.handleRectificationRequest(userEmail, context);
      case 'erasure':
        return await this.handleErasureRequest(userEmail, context);
      case 'portability':
        return await this.handlePortabilityRequest(userEmail, context);
      case 'restriction':
        return await this.handleRestrictionRequest(userEmail, context);
      default:
        throw new ValidationError('Invalid request type');
    }
  }

  async handleErasureRequest(userEmail, context) {
    const user = await this.data.findUserByEmail(userEmail);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check for legal basis to retain data
    const retentionCheck = await this.checkDataRetentionRequirements(user.id);

    if (retentionCheck.mustRetain) {
      return {
        success: false,
        reason: 'legal_retention_requirement',
        details: retentionCheck.reasons,
        partialErasure: retentionCheck.erasableData
      };
    }

    // Perform cascading deletion
    const deletionResults = await this.performSecureErasure(user.id);

    this.audit.logDataProcessingActivity({
      type: 'data_erasure',
      userId: user.id,
      userEmail,
      deletionResults,
      requestedBy: context.requestedBy,
      timestamp: new Date()
    });

    return {
      success: true,
      deletedRecords: deletionResults.totalRecords,
      completionDate: new Date()
    };
  }

  async performSecureErasure(userId) {
    const deletionResults = {
      userProfile: 0,
      userActivity: 0,
      userContent: 0,
      totalRecords: 0
    };

    // Use database transactions for consistency
    return await this.data.transaction(async (tx) => {
      // Delete user profile
      deletionResults.userProfile = await tx.users.delete({ id: userId });

      // Delete user activity logs (keeping anonymized analytics)
      deletionResults.userActivity = await tx.userActivity.delete({ userId });

      // Delete user-generated content
      deletionResults.userContent = await tx.userContent.delete({ authorId: userId });

      // Anonymize data that must be retained for legal/business reasons
      await tx.transactions.update(
        { userId },
        {
          userId: null,
          userEmail: '[DELETED]',
          anonymized: true,
          anonymizedAt: new Date()
        }
      );

      deletionResults.totalRecords =
        deletionResults.userProfile +
        deletionResults.userActivity +
        deletionResults.userContent;

      return deletionResults;
    });
  }
}
```

### **Security Governance**

#### **Security Policy Enforcement**
```javascript
// Good: Automated security policy enforcement
class SecurityPolicyEnforcer {
  constructor(policyRepository, violationHandler) {
    this.policies = policyRepository;
    this.violations = violationHandler;
  }

  async enforceSecurityPolicies(request, context) {
    const applicablePolicies = await this.getApplicablePolicies(request, context);
    const violations = [];

    for (const policy of applicablePolicies) {
      const evaluation = await this.evaluatePolicy(policy, request, context);

      if (!evaluation.compliant) {
        violations.push({
          policyId: policy.id,
          policyName: policy.name,
          severity: policy.severity,
          violation: evaluation.violation,
          remediation: evaluation.remediation
        });
      }
    }

    if (violations.length > 0) {
      await this.handlePolicyViolations(violations, request, context);
    }

    return {
      compliant: violations.length === 0,
      violations,
      timestamp: new Date()
    };
  }

  async getApplicablePolicies(request, context) {
    return await this.policies.findPolicies({
      active: true,
      applicableTo: this.determineResourceType(request),
      environment: context.environment
    });
  }

  async evaluatePolicy(policy, request, context) {
    switch (policy.type) {
      case 'authentication_strength':
        return this.evaluateAuthenticationPolicy(policy, request, context);
      case 'data_classification':
        return this.evaluateDataClassificationPolicy(policy, request, context);
      case 'access_control':
        return this.evaluateAccessControlPolicy(policy, request, context);
      case 'encryption_requirement':
        return this.evaluateEncryptionPolicy(policy, request, context);
      default:
        throw new Error(`Unknown policy type: ${policy.type}`);
    }
  }

  async handlePolicyViolations(violations, request, context) {
    const criticalViolations = violations.filter(v => v.severity === 'critical');

    if (criticalViolations.length > 0) {
      // Block request for critical violations
      throw new SecurityPolicyError('Critical security policy violations detected', violations);
    }

    // Log and alert for non-critical violations
    await this.violations.logViolations(violations, request, context);

    const highSeverityViolations = violations.filter(v => v.severity === 'high');
    if (highSeverityViolations.length > 0) {
      await this.violations.alertSecurityTeam(highSeverityViolations, context);
    }
  }
}
```

## Security Testing

### **Security Test Automation**

#### **Automated Security Testing Suite**
```javascript
// Good: Comprehensive security testing
describe('Security Test Suite', () => {
  describe('Authentication Security', () => {
    it('should prevent brute force attacks', async () => {
      const credentials = { email: 'test@example.com', password: 'wrong' };

      // Attempt authentication multiple times
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post('/auth/login')
          .send(credentials)
          .expect(401);
      }

      // Next attempt should be rate limited
      await request(app)
        .post('/auth/login')
        .send(credentials)
        .expect(429);
    });

    it('should implement secure password requirements', async () => {
      const weakPasswords = [
        'password',
        '123456',
        'abc123',
        'password123'
      ];

      for (const password of weakPasswords) {
        await request(app)
          .post('/auth/register')
          .send({
            email: 'test@example.com',
            password,
            name: 'Test User'
          })
          .expect(400)
          .expect(res => {
            expect(res.body.error).toContain('password');
          });
      }
    });
  });

  describe('Input Validation Security', () => {
    it('should prevent SQL injection attacks', async () => {
      const sqlInjectionPayloads = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "1'; UPDATE users SET admin=1; --"
      ];

      for (const payload of sqlInjectionPayloads) {
        await request(app)
          .get(`/api/users/${payload}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);
      }
    });

    it('should prevent XSS attacks', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(\'xss\')">',
        'javascript:alert("xss")'
      ];

      for (const payload of xssPayloads) {
        await request(app)
          .post('/api/comments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ content: payload })
          .expect(400);
      }
    });
  });

  describe('Authorization Security', () => {
    it('should enforce access controls', async () => {
      const userToken = await createUserToken({ role: 'user' });

      // User should not access admin endpoints
      await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      // User should not access other users' data
      await request(app)
        .get('/api/users/other-user-id/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});
```

## Related Guidelines

- **[Quality Standards](./quality-standards.md)** - Security requirements within quality standards
- **[Code Review Guidelines](./code-review-guidelines.md)** - Security-focused code review processes
- **[Testing Guidelines](./testing-guidelines.md)** - Security testing strategies and implementation
- **[API Design Guidelines](./api-design-guidelines.md)** - API security design patterns

## Related Workflows

- **[Deployment Guide](../workflows/deployment-guide.md)** - Security considerations in deployment and infrastructure
- **[Deployment Patterns](../workflows/deployment-patterns.md)** - Secure deployment strategies and patterns

---

*Robust security practices protect user data, maintain system integrity, and ensure compliance while enabling effective AI-assisted development.*
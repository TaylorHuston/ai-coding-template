---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "security-engineers"]
document_type: "guide"
priority: "high"
tags: ["security", "implementation", "validation", "encryption", "authentication"]
---

# Security Implementation - Core Patterns

**Purpose**: Core security implementation patterns for secure coding, including input validation, data protection, session management, and API security.

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

## Related Guidelines

- **[Security Principles](./security-principles.md)** - Core security concepts and governance
- **[Authentication Authorization](./authentication-authorization.md)** - Identity management patterns
- **[Security Testing](./security-testing.md)** - Security testing strategies and validation
- **[Testing Guidelines](./testing-guidelines.md)** - General testing approaches
- **[API Implementation Patterns](./api-implementation-patterns.md)** - API security patterns

## Navigation

- **[← Back to Guidelines](./README.md)** - All development guideline documentation
- **[Development Documentation](../README.md)** - All development documentation overview

---
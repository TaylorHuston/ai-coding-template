---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "api-designers", "architects"]
document_type: "guide"
priority: "high"
tags: ["api-design", "rest", "graphql", "versioning", "documentation"]
difficulty: "intermediate"
estimated_time: "40 min"
---

# API Design Guidelines

**Purpose**: Comprehensive API design standards, patterns, and best practices for building consistent, scalable, and maintainable APIs with AI assistance.

## API Design Philosophy

### **Design Principles**

#### **Developer Experience First**
- APIs should be intuitive and self-documenting
- Consistent patterns across all endpoints
- Clear error messages with actionable guidance
- Comprehensive documentation with examples

#### **RESTful Design**
- Use HTTP methods semantically (GET, POST, PUT, DELETE, PATCH)
- Resource-oriented URLs with logical hierarchies
- Stateless operations with appropriate status codes
- HATEOAS (Hypermedia as the Engine of Application State) where beneficial

#### **Backward Compatibility**
- Non-breaking changes in minor versions
- Graceful deprecation with advance notice
- Version migration guides and tooling
- Progressive API evolution strategies

### **AI-Assisted API Development**
- AI can generate OpenAPI specifications from requirements
- Automated validation of API design consistency
- AI-assisted documentation generation and maintenance
- Pattern recognition for common API anti-patterns

## REST API Design

### **Resource Naming Conventions**

#### **URL Structure**
```
# Good: Resource-oriented, hierarchical URLs
GET    /api/v1/users                    # Get all users
GET    /api/v1/users/{id}               # Get specific user
POST   /api/v1/users                    # Create new user
PUT    /api/v1/users/{id}               # Update entire user
PATCH  /api/v1/users/{id}               # Partial user update
DELETE /api/v1/users/{id}               # Delete user

# Nested resources
GET    /api/v1/users/{id}/orders        # Get user's orders
POST   /api/v1/users/{id}/orders        # Create order for user
GET    /api/v1/users/{id}/orders/{order_id}  # Get specific order

# Collection operations
GET    /api/v1/users?status=active      # Filter active users
GET    /api/v1/users?page=2&limit=20    # Pagination
GET    /api/v1/users?sort=created_at:desc  # Sorting

# Bad: Non-resource oriented URLs
POST   /api/v1/getUserById              # Use GET /api/v1/users/{id}
GET    /api/v1/user_list                # Use GET /api/v1/users
POST   /api/v1/createUser               # Use POST /api/v1/users
```

#### **Resource Naming Rules**
- Use **plural nouns** for collections (`/users`, `/orders`, `/products`)
- Use **lowercase** with **hyphens** for multi-word resources (`/order-items`, `/user-preferences`)
- Avoid **verbs** in URLs (use HTTP methods instead)
- Use **consistent** naming patterns across the API

### **HTTP Methods and Status Codes**

#### **Method Usage**
```javascript
// Good: Semantic HTTP method usage
class UserController {
  // GET: Retrieve data (safe, idempotent)
  async getUsers(req, res) {
    const users = await userService.findAll(req.query);
    res.status(200).json({
      data: users,
      meta: {
        total: users.length,
        page: parseInt(req.query.page || 1),
        limit: parseInt(req.query.limit || 20)
      }
    });
  }

  // POST: Create new resource (not idempotent)
  async createUser(req, res) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details
        });
      } else {
        res.status(500).json({
          error: 'Internal server error'
        });
      }
    }
  }

  // PUT: Update entire resource (idempotent)
  async updateUser(req, res) {
    const user = await userService.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.status(200).json({
      data: user,
      message: 'User updated successfully'
    });
  }

  // PATCH: Partial update (idempotent)
  async patchUser(req, res) {
    const user = await userService.partialUpdate(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.status(200).json({
      data: user,
      message: 'User updated successfully'
    });
  }

  // DELETE: Remove resource (idempotent)
  async deleteUser(req, res) {
    const deleted = await userService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.status(204).send(); // No content
  }
}
```

#### **Status Code Standards**

| Code | Meaning | When to Use | Example Response |
|------|---------|-------------|------------------|
| **200** | OK | Successful GET, PUT, PATCH | `{ "data": {...}, "message": "Success" }` |
| **201** | Created | Successful POST | `{ "data": {...}, "message": "Resource created" }` |
| **204** | No Content | Successful DELETE | Empty response body |
| **400** | Bad Request | Invalid request data | `{ "error": "Validation failed", "details": [...] }` |
| **401** | Unauthorized | Missing/invalid authentication | `{ "error": "Authentication required" }` |
| **403** | Forbidden | Insufficient permissions | `{ "error": "Insufficient permissions" }` |
| **404** | Not Found | Resource doesn't exist | `{ "error": "Resource not found" }` |
| **409** | Conflict | Resource already exists | `{ "error": "Email already registered" }` |
| **422** | Unprocessable Entity | Semantic validation errors | `{ "error": "Invalid business rule", "details": [...] }` |
| **429** | Too Many Requests | Rate limit exceeded | `{ "error": "Rate limit exceeded", "retryAfter": 60 }` |
| **500** | Internal Server Error | Server error | `{ "error": "Internal server error", "requestId": "..." }` |

### **Response Format Standards**

#### **Consistent Response Structure**
```javascript
// Good: Consistent response format
const ApiResponse = {
  // Success responses
  success: (data, message = null, meta = {}) => ({
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  }),

  // Error responses
  error: (message, details = null, code = null) => ({
    success: false,
    error: message,
    details,
    code,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId()
    }
  }),

  // Paginated responses
  paginated: (data, pagination) => ({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1
      }
    }
  })
};

// Usage examples
app.get('/api/v1/users', async (req, res) => {
  const { users, total } = await userService.findAll(req.query);
  res.json(ApiResponse.paginated(users, {
    page: parseInt(req.query.page || 1),
    limit: parseInt(req.query.limit || 20),
    total
  }));
});

app.post('/api/v1/users', async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(ApiResponse.success(
      user,
      'User created successfully'
    ));
  } catch (error) {
    res.status(400).json(ApiResponse.error(
      'Failed to create user',
      error.details,
      'VALIDATION_ERROR'
    ));
  }
});
```

#### **Error Response Standards**
```javascript
// Good: Comprehensive error responses
class ApiError extends Error {
  constructor(message, statusCode = 500, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class ErrorHandler {
  static handle(error, req, res, next) {
    const response = {
      success: false,
      error: error.message || 'Internal server error',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
        path: req.path,
        method: req.method
      }
    };

    // Add error code if provided
    if (error.code) {
      response.code = error.code;
    }

    // Add details for validation errors
    if (error.details) {
      response.details = error.details;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
      response.stack = error.stack;
    }

    const statusCode = error.statusCode || 500;

    // Log error for monitoring
    logger.error('API Error', {
      error: error.message,
      statusCode,
      stack: error.stack,
      requestId: req.requestId,
      userId: req.user?.id,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query
    });

    res.status(statusCode).json(response);
  }
}

// Validation error example
class ValidationError extends ApiError {
  constructor(details) {
    super('Validation failed', 400, 'VALIDATION_ERROR', details);
  }
}

// Usage
if (!email || !isValidEmail(email)) {
  throw new ValidationError([
    {
      field: 'email',
      message: 'Valid email address is required',
      code: 'INVALID_EMAIL'
    }
  ]);
}
```

### **Request/Response Validation**

#### **Input Validation Middleware**
```javascript
// Good: Comprehensive input validation
const { body, param, query, validationResult } = require('express-validator');

class ValidationMiddleware {
  static validateUser() {
    return [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),

      body('password')
        .isLength({ min: 8, max: 128 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must be 8-128 characters with uppercase, lowercase, number, and special character'),

      body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Name must be 1-100 characters, letters only'),

      body('age')
        .optional()
        .isInt({ min: 13, max: 120 })
        .withMessage('Age must be between 13 and 120'),

      body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Valid phone number required'),

      this.handleValidationErrors
    ];
  }

  static validatePagination() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .toInt()
        .withMessage('Page must be between 1 and 1000'),

      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .toInt()
        .withMessage('Limit must be between 1 and 100'),

      query('sort')
        .optional()
        .matches(/^[a-zA-Z_]+:(asc|desc)$/)
        .withMessage('Sort format: field:direction (asc|desc)'),

      this.handleValidationErrors
    ];
  }

  static validateResourceId() {
    return [
      param('id')
        .isUUID(4)
        .withMessage('Valid UUID required'),

      this.handleValidationErrors
    ];
  }

  static handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const details = errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value,
        location: error.location
      }));

      return res.status(400).json(ApiResponse.error(
        'Validation failed',
        details,
        'VALIDATION_ERROR'
      ));
    }

    next();
  }
}

// Usage in routes
router.post('/users',
  ValidationMiddleware.validateUser(),
  userController.createUser
);

router.get('/users',
  ValidationMiddleware.validatePagination(),
  userController.getUsers
);

router.get('/users/:id',
  ValidationMiddleware.validateResourceId(),
  userController.getUser
);
```

## API Versioning

### **Versioning Strategies**

#### **URL Path Versioning (Recommended)**
```javascript
// Good: Clear version in URL path
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Route definitions
// v1/users.js
router.get('/users', getUsersV1);
router.post('/users', createUserV1);

// v2/users.js
router.get('/users', getUsersV2);
router.post('/users', createUserV2);

// Version-specific implementations
async function getUsersV1(req, res) {
  // V1 response format
  const users = await userService.findAll(req.query);
  res.json({
    users,
    total: users.length
  });
}

async function getUsersV2(req, res) {
  // V2 enhanced response format
  const { users, total } = await userService.findAll(req.query);
  res.json(ApiResponse.paginated(users, {
    page: parseInt(req.query.page || 1),
    limit: parseInt(req.query.limit || 20),
    total
  }));
}
```

#### **Header-Based Versioning (Alternative)**
```javascript
// Alternative: Header-based versioning
app.use('/api', (req, res, next) => {
  const version = req.headers['api-version'] || '1.0';

  switch (version) {
    case '1.0':
      req.apiVersion = 'v1';
      break;
    case '2.0':
      req.apiVersion = 'v2';
      break;
    default:
      return res.status(400).json({
        error: 'Unsupported API version',
        supportedVersions: ['1.0', '2.0']
      });
  }

  next();
});

// Version-aware controller
class UserController {
  async getUsers(req, res) {
    const users = await userService.findAll(req.query);

    switch (req.apiVersion) {
      case 'v1':
        return this.sendV1Response(res, users);
      case 'v2':
        return this.sendV2Response(res, users);
      default:
        return res.status(400).json({ error: 'Unsupported version' });
    }
  }
}
```

### **Deprecation Strategy**

#### **Graceful API Deprecation**
```javascript
// Good: Deprecation with migration path
class DeprecationMiddleware {
  static deprecateEndpoint(deprecatedVersion, removalVersion, migrationPath) {
    return (req, res, next) => {
      // Add deprecation headers
      res.set('X-API-Deprecated', 'true');
      res.set('X-API-Deprecated-Version', deprecatedVersion);
      res.set('X-API-Removal-Version', removalVersion);
      res.set('X-API-Migration-Path', migrationPath);

      // Log deprecation usage
      logger.warn('Deprecated API endpoint used', {
        endpoint: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
        deprecatedVersion,
        removalVersion,
        migrationPath
      });

      next();
    };
  }
}

// Usage
router.get('/users/:id/profile',
  DeprecationMiddleware.deprecateEndpoint(
    'v1.5.0',
    'v2.0.0',
    '/api/v2/users/:id'
  ),
  userController.getUserProfile
);

// API documentation for deprecation
/**
 * @api {get} /api/v1/users/:id/profile Get User Profile
 * @apiVersion 1.5.0
 * @apiDeprecated since version 1.5.0, will be removed in 2.0.0. Use /api/v2/users/:id instead.
 * @apiDescription This endpoint is deprecated. Please migrate to the new endpoint.
 */
```

## Authentication and Authorization

### **API Authentication Patterns**

#### **JWT Bearer Token Authentication**
```javascript
// Good: Comprehensive JWT authentication
class AuthenticationMiddleware {
  static async authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(ApiResponse.error(
          'Authentication required',
          'Missing or invalid Authorization header',
          'MISSING_AUTH'
        ));
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check token expiration
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return res.status(401).json(ApiResponse.error(
          'Token expired',
          'Please refresh your token',
          'TOKEN_EXPIRED'
        ));
      }

      // Check if token is revoked
      const isRevoked = await tokenService.isRevoked(decoded.jti);
      if (isRevoked) {
        return res.status(401).json(ApiResponse.error(
          'Token revoked',
          'This token has been revoked',
          'TOKEN_REVOKED'
        ));
      }

      // Load user data
      const user = await userService.findById(decoded.sub);
      if (!user || !user.isActive) {
        return res.status(401).json(ApiResponse.error(
          'Invalid user',
          'User account is inactive or not found',
          'INVALID_USER'
        ));
      }

      req.user = user;
      req.token = decoded;
      next();

    } catch (error) {
      return res.status(401).json(ApiResponse.error(
        'Invalid token',
        error.message,
        'INVALID_TOKEN'
      ));
    }
  }

  static requireRole(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json(ApiResponse.error(
          'Authentication required',
          null,
          'NOT_AUTHENTICATED'
        ));
      }

      const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.role];
      const requiredRoles = Array.isArray(roles) ? roles : [roles];

      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json(ApiResponse.error(
          'Insufficient permissions',
          `Required roles: ${requiredRoles.join(', ')}`,
          'INSUFFICIENT_PERMISSIONS'
        ));
      }

      next();
    };
  }
}

// Usage
router.get('/admin/users',
  AuthenticationMiddleware.authenticateToken,
  AuthenticationMiddleware.requireRole(['admin', 'moderator']),
  adminController.getUsers
);
```

#### **API Key Authentication**
```javascript
// Good: API key authentication for service-to-service
class ApiKeyMiddleware {
  static async authenticateApiKey(req, res, next) {
    try {
      const apiKey = req.headers['x-api-key'];

      if (!apiKey) {
        return res.status(401).json(ApiResponse.error(
          'API key required',
          'Missing X-API-Key header',
          'MISSING_API_KEY'
        ));
      }

      // Validate API key format
      if (!this.isValidApiKeyFormat(apiKey)) {
        return res.status(401).json(ApiResponse.error(
          'Invalid API key format',
          'API key must be 32 characters',
          'INVALID_API_KEY_FORMAT'
        ));
      }

      // Look up API key
      const keyRecord = await apiKeyService.findByKey(apiKey);

      if (!keyRecord || !keyRecord.isActive) {
        return res.status(401).json(ApiResponse.error(
          'Invalid API key',
          'API key not found or inactive',
          'INVALID_API_KEY'
        ));
      }

      // Check rate limits
      const rateLimitResult = await rateLimitService.checkApiKeyLimit(apiKey);
      if (!rateLimitResult.allowed) {
        return res.status(429).json(ApiResponse.error(
          'Rate limit exceeded',
          `Limit: ${rateLimitResult.limit} requests per ${rateLimitResult.window}`,
          'RATE_LIMIT_EXCEEDED'
        ));
      }

      // Track usage
      await apiKeyService.recordUsage(keyRecord.id, req);

      req.apiKey = keyRecord;
      req.client = await clientService.findById(keyRecord.clientId);

      next();

    } catch (error) {
      logger.error('API key authentication error', { error: error.message });

      return res.status(500).json(ApiResponse.error(
        'Authentication error',
        'Please try again later',
        'AUTH_ERROR'
      ));
    }
  }

  static isValidApiKeyFormat(key) {
    return /^[a-zA-Z0-9]{32}$/.test(key);
  }

  static requireScope(scopes) {
    return (req, res, next) => {
      if (!req.apiKey) {
        return res.status(401).json(ApiResponse.error(
          'API key required',
          null,
          'NOT_AUTHENTICATED'
        ));
      }

      const keyScopes = req.apiKey.scopes || [];
      const requiredScopes = Array.isArray(scopes) ? scopes : [scopes];

      const hasRequiredScope = requiredScopes.every(scope =>
        keyScopes.includes(scope) || keyScopes.includes('*')
      );

      if (!hasRequiredScope) {
        return res.status(403).json(ApiResponse.error(
          'Insufficient scope',
          `Required scopes: ${requiredScopes.join(', ')}`,
          'INSUFFICIENT_SCOPE'
        ));
      }

      next();
    };
  }
}

// Usage
router.post('/webhooks/payments',
  ApiKeyMiddleware.authenticateApiKey,
  ApiKeyMiddleware.requireScope(['webhooks:write']),
  webhookController.handlePayment
);
```

## Rate Limiting and Throttling

### **Rate Limiting Implementation**

#### **Multi-Tier Rate Limiting**
```javascript
// Good: Comprehensive rate limiting strategy
class RateLimitingService {
  constructor(redisClient) {
    this.redis = redisClient;
    this.limits = {
      // Per-user limits
      user: {
        requests: 1000,
        window: 60 * 60 * 1000, // 1 hour
        burst: 50 // Allow short bursts
      },

      // Per-IP limits (unauthenticated)
      ip: {
        requests: 100,
        window: 60 * 60 * 1000, // 1 hour
        burst: 10
      },

      // Premium user limits
      premium: {
        requests: 10000,
        window: 60 * 60 * 1000, // 1 hour
        burst: 200
      },

      // API key limits
      api_key: {
        requests: 50000,
        window: 60 * 60 * 1000, // 1 hour
        burst: 1000
      }
    };
  }

  async checkRateLimit(identifier, limitType, context = {}) {
    const limit = this.limits[limitType];
    if (!limit) {
      throw new Error(`Unknown limit type: ${limitType}`);
    }

    // Sliding window counter with burst support
    const result = await this.slidingWindowCounter(
      identifier,
      limitType,
      limit,
      context
    );

    return result;
  }

  async slidingWindowCounter(identifier, limitType, limit, context) {
    const key = `rate_limit:${limitType}:${identifier}`;
    const now = Date.now();
    const windowStart = now - limit.window;

    // Use Redis pipeline for atomic operations
    const pipeline = this.redis.pipeline();

    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current requests
    pipeline.zcard(key);

    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiration
    pipeline.expire(key, Math.ceil(limit.window / 1000));

    const results = await pipeline.exec();
    const currentCount = results[1][1];

    // Check if within limits
    const allowed = currentCount < limit.requests;

    // Calculate reset time
    const oldestRequest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
    const resetTime = oldestRequest.length > 0
      ? new Date(parseInt(oldestRequest[1]) + limit.window)
      : new Date(now + limit.window);

    return {
      allowed,
      remaining: Math.max(0, limit.requests - currentCount - 1),
      resetTime,
      limit: limit.requests,
      window: limit.window
    };
  }

  createMiddleware(limitType, options = {}) {
    return async (req, res, next) => {
      try {
        const identifier = this.getIdentifier(req, limitType);

        const result = await this.checkRateLimit(identifier, limitType, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          endpoint: req.path
        });

        // Set rate limit headers
        res.set('X-RateLimit-Limit', result.limit);
        res.set('X-RateLimit-Remaining', result.remaining);
        res.set('X-RateLimit-Reset', Math.floor(result.resetTime.getTime() / 1000));
        res.set('X-RateLimit-Window', result.window);

        if (!result.allowed) {
          const retryAfter = Math.ceil((result.resetTime.getTime() - Date.now()) / 1000);
          res.set('Retry-After', retryAfter);

          return res.status(429).json(ApiResponse.error(
            'Rate limit exceeded',
            `Too many requests. Try again in ${retryAfter} seconds.`,
            'RATE_LIMIT_EXCEEDED'
          ));
        }

        next();

      } catch (error) {
        logger.error('Rate limiting error', { error: error.message });
        // Fail open - allow request if rate limiting fails
        next();
      }
    };
  }

  getIdentifier(req, limitType) {
    switch (limitType) {
      case 'user':
      case 'premium':
        return req.user?.id || req.ip;
      case 'api_key':
        return req.apiKey?.id || req.ip;
      case 'ip':
      default:
        return req.ip;
    }
  }
}

// Usage with different limits based on authentication
router.use('/api/v1', (req, res, next) => {
  let limitType = 'ip'; // Default for unauthenticated requests

  if (req.apiKey) {
    limitType = 'api_key';
  } else if (req.user?.isPremium) {
    limitType = 'premium';
  } else if (req.user) {
    limitType = 'user';
  }

  rateLimitService.createMiddleware(limitType)(req, res, next);
});
```

## Documentation and OpenAPI

### **OpenAPI Specification**

#### **Comprehensive API Documentation**
```yaml
# openapi.yml - Example specification
openapi: 3.0.3
info:
  title: User Management API
  description: |
    A comprehensive API for managing users, authentication, and user data.

    ## Authentication
    This API uses Bearer token authentication. Include your JWT token in the Authorization header:
    ```
    Authorization: Bearer your-jwt-token
    ```

    ## Rate Limiting
    All endpoints are rate limited. See response headers for current limits:
    - `X-RateLimit-Limit`: Maximum requests per window
    - `X-RateLimit-Remaining`: Remaining requests in current window
    - `X-RateLimit-Reset`: Unix timestamp when the window resets

    ## Error Handling
    All errors follow a consistent format with appropriate HTTP status codes and descriptive messages.
  version: 2.0.0
  contact:
    name: API Support
    email: api-support@example.com
    url: https://docs.example.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.example.com/v2
    description: Production server
  - url: https://staging-api.example.com/v2
    description: Staging server
  - url: http://localhost:3000/api/v2
    description: Development server

security:
  - BearerAuth: []
  - ApiKeyAuth: []

paths:
  /users:
    get:
      summary: List users
      description: Retrieve a paginated list of users with optional filtering and sorting.
      operationId: getUsers
      tags:
        - Users
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
        - name: status
          in: query
          description: Filter users by status
          schema:
            type: string
            enum: [active, inactive, pending]
        - name: role
          in: query
          description: Filter users by role
          schema:
            type: string
            enum: [admin, user, moderator]
        - name: sort
          in: query
          description: Sort field and direction
          schema:
            type: string
            pattern: '^[a-zA-Z_]+:(asc|desc)$'
            example: 'created_at:desc'
      responses:
        '200':
          description: List of users retrieved successfully
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
              examples:
                default:
                  $ref: '#/components/examples/UserListExample'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '429':
          $ref: '#/components/responses/TooManyRequests'
        '500':
          $ref: '#/components/responses/InternalServerError'

    post:
      summary: Create user
      description: Create a new user account with the provided information.
      operationId: createUser
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
            examples:
              basic:
                $ref: '#/components/examples/CreateUserExample'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: User already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error: "User with this email already exists"
                code: "DUPLICATE_EMAIL"

  /users/{id}:
    get:
      summary: Get user by ID
      description: Retrieve detailed information about a specific user.
      operationId: getUser
      tags:
        - Users
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '200':
          description: User retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token obtained from the authentication endpoint

    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for service-to-service authentication

  parameters:
    UserIdParam:
      name: id
      in: path
      required: true
      description: Unique identifier for the user
      schema:
        type: string
        format: uuid
        example: '123e4567-e89b-12d3-a456-426614174000'

    PageParam:
      name: page
      in: query
      description: Page number for pagination (1-based)
      schema:
        type: integer
        minimum: 1
        maximum: 1000
        default: 1

    LimitParam:
      name: limit
      in: query
      description: Number of items per page
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

  headers:
    X-RateLimit-Limit:
      description: The number of allowed requests in the current period
      schema:
        type: integer

    X-RateLimit-Remaining:
      description: The number of remaining requests in the current period
      schema:
        type: integer

    X-RateLimit-Reset:
      description: The time at which the current rate limit window resets (Unix timestamp)
      schema:
        type: integer

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier for the user
          example: '123e4567-e89b-12d3-a456-426614174000'
        email:
          type: string
          format: email
          description: User's email address
          example: 'user@example.com'
        name:
          type: string
          description: User's full name
          example: 'John Doe'
        role:
          type: string
          enum: [admin, user, moderator]
          description: User's role in the system
          example: 'user'
        status:
          type: string
          enum: [active, inactive, pending]
          description: Current status of the user account
          example: 'active'
        created_at:
          type: string
          format: date-time
          description: When the user account was created
          example: '2023-01-15T09:30:00Z'
        updated_at:
          type: string
          format: date-time
          description: When the user account was last updated
          example: '2023-01-20T14:45:00Z'
      required:
        - id
        - email
        - name
        - role
        - status
        - created_at
        - updated_at

    CreateUserRequest:
      type: object
      properties:
        email:
          type: string
          format: email
          description: User's email address (must be unique)
          example: 'newuser@example.com'
        password:
          type: string
          minLength: 8
          maxLength: 128
          description: User's password (8-128 characters)
          example: 'SecurePassword123!'
        name:
          type: string
          minLength: 1
          maxLength: 100
          description: User's full name
          example: 'Jane Smith'
        role:
          type: string
          enum: [user, moderator]
          description: Initial role for the user (admin role requires special permissions)
          default: 'user'
          example: 'user'
      required:
        - email
        - password
        - name

    UserResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          $ref: '#/components/schemas/User'
        message:
          type: string
          example: 'User retrieved successfully'
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
              example: '2023-01-20T15:30:00Z'

    UserListResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            pagination:
              type: object
              properties:
                page:
                  type: integer
                  example: 1
                limit:
                  type: integer
                  example: 20
                total:
                  type: integer
                  example: 150
                totalPages:
                  type: integer
                  example: 8
                hasNext:
                  type: boolean
                  example: true
                hasPrev:
                  type: boolean
                  example: false

    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: string
          description: Human-readable error message
          example: 'Validation failed'
        code:
          type: string
          description: Machine-readable error code
          example: 'VALIDATION_ERROR'
        details:
          type: array
          description: Detailed error information (for validation errors)
          items:
            type: object
            properties:
              field:
                type: string
                example: 'email'
              message:
                type: string
                example: 'Valid email address is required'
              code:
                type: string
                example: 'INVALID_EMAIL'
        meta:
          type: object
          properties:
            timestamp:
              type: string
              format: date-time
            requestId:
              type: string
              example: 'req_123456789'

  responses:
    BadRequest:
      description: Bad request - Invalid input data
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Validation failed'
            code: 'VALIDATION_ERROR'
            details:
              - field: 'email'
                message: 'Valid email address is required'
                code: 'INVALID_EMAIL'

    Unauthorized:
      description: Unauthorized - Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Authentication required'
            code: 'NOT_AUTHENTICATED'

    Forbidden:
      description: Forbidden - Insufficient permissions
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Insufficient permissions'
            code: 'INSUFFICIENT_PERMISSIONS'

    NotFound:
      description: Not found - Resource does not exist
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Resource not found'
            code: 'NOT_FOUND'

    TooManyRequests:
      description: Too many requests - Rate limit exceeded
      headers:
        Retry-After:
          description: Number of seconds to wait before retrying
          schema:
            type: integer
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Rate limit exceeded'
            code: 'RATE_LIMIT_EXCEEDED'

    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Internal server error'
            code: 'INTERNAL_ERROR'

  examples:
    UserListExample:
      summary: Example user list response
      value:
        success: true
        data:
          - id: '123e4567-e89b-12d3-a456-426614174000'
            email: 'john.doe@example.com'
            name: 'John Doe'
            role: 'user'
            status: 'active'
            created_at: '2023-01-15T09:30:00Z'
            updated_at: '2023-01-20T14:45:00Z'
          - id: '456e7890-e89b-12d3-a456-426614174001'
            email: 'jane.smith@example.com'
            name: 'Jane Smith'
            role: 'moderator'
            status: 'active'
            created_at: '2023-01-16T10:15:00Z'
            updated_at: '2023-01-19T16:20:00Z'
        meta:
          timestamp: '2023-01-20T15:30:00Z'
          pagination:
            page: 1
            limit: 20
            total: 150
            totalPages: 8
            hasNext: true
            hasPrev: false

    CreateUserExample:
      summary: Example user creation request
      value:
        email: 'newuser@example.com'
        password: 'SecurePassword123!'
        name: 'New User'
        role: 'user'
```

## GraphQL API Design

### **GraphQL Schema Design**

#### **Type Definitions and Resolvers**
```javascript
// Good: Comprehensive GraphQL schema
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar DateTime
  scalar Upload

  type Query {
    # User queries
    user(id: ID!): User
    users(
      filter: UserFilter
      sort: UserSort
      pagination: PaginationInput
    ): UserConnection!

    # Search
    searchUsers(query: String!, limit: Int = 10): [User!]!
  }

  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): UserPayload!
    updateUser(id: ID!, input: UpdateUserInput!): UserPayload!
    deleteUser(id: ID!): DeletePayload!

    # File upload
    uploadAvatar(userId: ID!, file: Upload!): UploadPayload!
  }

  type Subscription {
    userUpdated(userId: ID): User!
    userStatusChanged: UserStatusEvent!
  }

  # User types
  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    status: UserStatus!
    avatar: String
    profile: UserProfile
    createdAt: DateTime!
    updatedAt: DateTime!

    # Relationships
    orders(first: Int, after: String): OrderConnection!
    notifications(unreadOnly: Boolean = false): [Notification!]!
  }

  type UserProfile {
    bio: String
    website: String
    location: String
    preferences: UserPreferences!
  }

  type UserPreferences {
    emailNotifications: Boolean!
    theme: Theme!
    language: String!
  }

  # Enums
  enum UserRole {
    ADMIN
    MODERATOR
    USER
  }

  enum UserStatus {
    ACTIVE
    INACTIVE
    PENDING
    SUSPENDED
  }

  enum Theme {
    LIGHT
    DARK
    AUTO
  }

  # Input types
  input UserFilter {
    role: UserRole
    status: UserStatus
    createdAfter: DateTime
    createdBefore: DateTime
    search: String
  }

  input UserSort {
    field: UserSortField!
    direction: SortDirection!
  }

  enum UserSortField {
    CREATED_AT
    UPDATED_AT
    NAME
    EMAIL
  }

  enum SortDirection {
    ASC
    DESC
  }

  input PaginationInput {
    first: Int
    after: String
    last: Int
    before: String
  }

  input CreateUserInput {
    email: String!
    password: String!
    name: String!
    role: UserRole = USER
    profile: UserProfileInput
  }

  input UpdateUserInput {
    email: String
    name: String
    role: UserRole
    status: UserStatus
    profile: UserProfileInput
  }

  input UserProfileInput {
    bio: String
    website: String
    location: String
    preferences: UserPreferencesInput
  }

  input UserPreferencesInput {
    emailNotifications: Boolean
    theme: Theme
    language: String
  }

  # Connection types (Relay-style pagination)
  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type UserEdge {
    node: User!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  # Payload types
  type UserPayload {
    user: User
    errors: [Error!]!
  }

  type DeletePayload {
    deletedId: ID
    errors: [Error!]!
  }

  type UploadPayload {
    url: String
    errors: [Error!]!
  }

  type Error {
    field: String
    message: String!
    code: String
  }

  # Event types for subscriptions
  type UserStatusEvent {
    user: User!
    previousStatus: UserStatus!
    newStatus: UserStatus!
    timestamp: DateTime!
  }
`;

// Resolvers with comprehensive error handling
const resolvers = {
  Query: {
    user: async (parent, { id }, { dataSources, user }) => {
      try {
        // Check permissions
        if (!user) {
          throw new AuthenticationError('Authentication required');
        }

        if (user.id !== id && !user.permissions.includes('users:read')) {
          throw new ForbiddenError('Insufficient permissions');
        }

        const userData = await dataSources.userAPI.findById(id);

        if (!userData) {
          throw new UserInputError('User not found');
        }

        return userData;
      } catch (error) {
        throw error;
      }
    },

    users: async (parent, { filter, sort, pagination }, { dataSources, user }) => {
      try {
        // Check permissions
        if (!user?.permissions.includes('users:list')) {
          throw new ForbiddenError('Insufficient permissions');
        }

        // Apply rate limiting
        await rateLimitService.checkGraphQLRateLimit(user.id, 'users');

        const result = await dataSources.userAPI.findMany({
          filter,
          sort,
          pagination
        });

        return {
          edges: result.users.map(user => ({
            node: user,
            cursor: Buffer.from(user.id).toString('base64')
          })),
          pageInfo: {
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
            startCursor: result.users.length > 0
              ? Buffer.from(result.users[0].id).toString('base64')
              : null,
            endCursor: result.users.length > 0
              ? Buffer.from(result.users[result.users.length - 1].id).toString('base64')
              : null
          },
          totalCount: result.totalCount
        };
      } catch (error) {
        throw error;
      }
    }
  },

  Mutation: {
    createUser: async (parent, { input }, { dataSources, user }) => {
      try {
        // Check permissions
        if (!user?.permissions.includes('users:create')) {
          throw new ForbiddenError('Insufficient permissions');
        }

        // Validate input
        const validationErrors = await validateCreateUserInput(input);
        if (validationErrors.length > 0) {
          return {
            user: null,
            errors: validationErrors
          };
        }

        const createdUser = await dataSources.userAPI.create(input);

        return {
          user: createdUser,
          errors: []
        };
      } catch (error) {
        if (error.code === 'DUPLICATE_EMAIL') {
          return {
            user: null,
            errors: [{
              field: 'email',
              message: 'Email address already exists',
              code: 'DUPLICATE_EMAIL'
            }]
          };
        }
        throw error;
      }
    }
  },

  Subscription: {
    userUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['USER_UPDATED']),
        (payload, variables, context) => {
          // Only send updates if user has permission
          return context.user?.permissions.includes('users:read') &&
                 (!variables.userId || payload.user.id === variables.userId);
        }
      )
    }
  },

  // Field resolvers
  User: {
    orders: async (user, { first, after }, { dataSources }) => {
      return dataSources.orderAPI.findByUserId(user.id, { first, after });
    },

    notifications: async (user, { unreadOnly }, { dataSources }) => {
      return dataSources.notificationAPI.findByUserId(user.id, { unreadOnly });
    }
  }
};

// Input validation
async function validateCreateUserInput(input) {
  const errors = [];

  // Email validation
  if (!input.email || !isValidEmail(input.email)) {
    errors.push({
      field: 'email',
      message: 'Valid email address is required',
      code: 'INVALID_EMAIL'
    });
  }

  // Password validation
  if (!input.password || input.password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters',
      code: 'WEAK_PASSWORD'
    });
  }

  // Name validation
  if (!input.name || input.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Name is required',
      code: 'REQUIRED_FIELD'
    });
  }

  return errors;
}
```

## Testing API Endpoints

### **API Testing Strategies**

#### **Comprehensive Test Suite**
```javascript
// Good: Complete API testing coverage
describe('User API Endpoints', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();

    // Create test user and get auth token
    const user = await userService.create({
      email: 'test@example.com',
      password: 'TestPassword123!',
      name: 'Test User'
    });

    authToken = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    testUser = user;
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('GET /api/v1/users', () => {
    it('should return paginated users list for authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array),
        meta: {
          pagination: {
            page: 1,
            limit: 10,
            total: expect.any(Number),
            totalPages: expect.any(Number)
          }
        }
      });

      // Validate user object structure
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toMatchObject({
          id: expect.any(String),
          email: expect.any(String),
          name: expect.any(String),
          role: expect.any(String),
          createdAt: expect.any(String)
        });
      }
    });

    it('should filter users by status', async () => {
      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'active' })
        .expect(200)
        .expect(res => {
          expect(res.body.data.every(user => user.status === 'active')).toBe(true);
        });
    });

    it('should sort users correctly', async () => {
      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sort: 'created_at:desc' })
        .expect(200)
        .expect(res => {
          const users = res.body.data;
          for (let i = 1; i < users.length; i++) {
            expect(new Date(users[i-1].createdAt) >= new Date(users[i].createdAt)).toBe(true);
          }
        });
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app)
        .get('/api/v1/users')
        .expect(401)
        .expect(res => {
          expect(res.body).toMatchObject({
            success: false,
            error: expect.any(String),
            code: 'NOT_AUTHENTICATED'
          });
        });
    });

    it('should handle rate limiting', async () => {
      // Make multiple requests quickly to trigger rate limit
      const requests = Array(10).fill().map(() =>
        request(app)
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${authToken}`)
      );

      await Promise.all(requests);

      // The next request should be rate limited
      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(429)
        .expect(res => {
          expect(res.body.error).toContain('Rate limit exceeded');
          expect(res.headers['retry-after']).toBeDefined();
        });
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create user with valid data', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
        name: 'New User'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          email: userData.email,
          name: userData.name,
          role: 'user',
          status: 'pending'
        },
        message: expect.any(String)
      });

      // Verify user was actually created in database
      const createdUser = await userService.findById(response.body.data.id);
      expect(createdUser).toBeTruthy();
      expect(createdUser.email).toBe(userData.email);
    });

    it('should validate required fields', async () => {
      const invalidData = {
        email: 'invalid-email',
        // Missing password and name
      };

      await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400)
        .expect(res => {
          expect(res.body).toMatchObject({
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: expect.arrayContaining([
              expect.objectContaining({
                field: 'email',
                message: expect.any(String)
              }),
              expect.objectContaining({
                field: 'password',
                message: expect.any(String)
              }),
              expect.objectContaining({
                field: 'name',
                message: expect.any(String)
              })
            ])
          });
        });
    });

    it('should prevent duplicate email addresses', async () => {
      const userData = {
        email: testUser.email, // Use existing email
        password: 'SecurePassword123!',
        name: 'Duplicate User'
      };

      await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(409)
        .expect(res => {
          expect(res.body).toMatchObject({
            success: false,
            error: expect.stringContaining('already exists'),
            code: 'DUPLICATE_EMAIL'
          });
        });
    });
  });

  describe('Security Tests', () => {
    it('should prevent SQL injection in user ID parameter', async () => {
      const maliciousId = "1'; DROP TABLE users; --";

      await request(app)
        .get(`/api/v1/users/${maliciousId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400); // Should be rejected as invalid UUID
    });

    it('should prevent XSS in user creation', async () => {
      const xssPayload = '<script>alert("xss")</script>';

      const userData = {
        email: 'xss@example.com',
        password: 'SecurePassword123!',
        name: xssPayload
      };

      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(201);

      // Verify XSS payload was sanitized
      expect(response.body.data.name).not.toContain('<script>');
      expect(response.body.data.name).not.toContain('alert');
    });

    it('should enforce authorization for protected endpoints', async () => {
      const userToken = createUserToken({ role: 'user' });

      // Regular user should not access admin endpoints
      await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large result sets efficiently', async () => {
      const startTime = Date.now();

      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 100 })
        .expect(200);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle concurrent requests', async () => {
      const concurrentRequests = 50;
      const requests = Array(concurrentRequests).fill().map(() =>
        request(app)
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
```

## Related Guidelines

- **[Security Guidelines](./security-guidelines.md)** - API security patterns and authentication
- **[Testing Guidelines](./testing-guidelines.md)** - Comprehensive API testing strategies
- **[Code Review Guidelines](./code-review-guidelines.md)** - API code review checklist
- **[Quality Standards](./quality-standards.md)** - API quality requirements and validation

---

*Well-designed APIs provide intuitive developer experiences while maintaining security, performance, and maintainability standards throughout the application lifecycle.*
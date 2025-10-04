/**
 * API Error Handling Pattern Examples
 *
 * Demonstrates hierarchical error classification and handling strategies.
 * Provides consistent error responses with appropriate detail levels.
 */

/**
 * Error Classification System
 *
 * Organizes errors by type, scope, and severity for consistent handling.
 */

// Base Error Classes
class ApiError extends Error {
  constructor(message, code, statusCode = 500, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }
}

// Client Error Classes (4xx)
class ValidationError extends ApiError {
  constructor(message, details = {}) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required', details = {}) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
  }
}

class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions', details = {}) {
    super(message, 'AUTHORIZATION_ERROR', 403, details);
  }
}

class NotFoundError extends ApiError {
  constructor(resource = 'Resource', id = null) {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
    super(message, 'NOT_FOUND', 404, { resource, id });
  }
}

class ConflictError extends ApiError {
  constructor(message, details = {}) {
    super(message, 'CONFLICT_ERROR', 409, details);
  }
}

class RateLimitError extends ApiError {
  constructor(retryAfter = 60) {
    super('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429, { retryAfter });
  }
}

// Server Error Classes (5xx)
class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', details = {}) {
    super(message, 'INTERNAL_ERROR', 500, details);
  }
}

class ServiceUnavailableError extends ApiError {
  constructor(message = 'Service temporarily unavailable', retryAfter = 60) {
    super(message, 'SERVICE_UNAVAILABLE', 503, { retryAfter });
  }
}

class DatabaseError extends ApiError {
  constructor(message = 'Database operation failed', details = {}) {
    super(message, 'DATABASE_ERROR', 500, details);
  }
}

class ExternalServiceError extends ApiError {
  constructor(service, message = 'External service error', details = {}) {
    super(`${service}: ${message}`, 'EXTERNAL_SERVICE_ERROR', 502, { service, ...details });
  }
}

// Business Logic Error Classes
class BusinessRuleError extends ApiError {
  constructor(rule, message, details = {}) {
    super(message, 'BUSINESS_RULE_VIOLATION', 422, { rule, ...details });
  }
}

class PaymentError extends ApiError {
  constructor(message, details = {}) {
    super(message, 'PAYMENT_ERROR', 402, details);
  }
}

/**
 * Error Handler Middleware
 *
 * Centralized error handling for Express applications.
 */
function errorHandler(err, req, res, next) {
  // Log error for monitoring
  console.error('API Error:', {
    requestId: req.id || 'unknown',
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    error: err.toJSON ? err.toJSON() : err.message,
    stack: err.stack
  });

  // Handle known API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
      requestId: req.id || null,
      error: {
        message: err.message,
        code: err.code,
        details: sanitizeErrorDetails(err.details, req)
      }
    });
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.name === 'ValidationError') {
    const validationError = new ValidationError('Input validation failed', {
      fields: err.errors || []
    });
    return errorHandler(validationError, req, res, next);
  }

  // Handle database errors
  if (err.name === 'MongoError' || err.name === 'SequelizeError') {
    const dbError = new DatabaseError('Database operation failed', {
      operation: err.sql || err.op || 'unknown'
    });
    return errorHandler(dbError, req, res, next);
  }

  // Handle unexpected errors
  const internalError = new InternalServerError('An unexpected error occurred');
  return errorHandler(internalError, req, res, next);
}

/**
 * Error Detail Sanitization
 *
 * Removes sensitive information based on environment and user context.
 */
function sanitizeErrorDetails(details, req) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isInternalUser = req.user && req.user.role === 'admin';

  // Always include basic details
  const sanitized = { ...details };

  // Remove sensitive information in production
  if (!isDevelopment && !isInternalUser) {
    delete sanitized.stack;
    delete sanitized.query;
    delete sanitized.originalError;
  }

  return sanitized;
}

/**
 * Error Factory Functions
 *
 * Convenient functions for creating common error scenarios.
 */
const ErrorFactory = {
  // Validation errors
  requiredField(field) {
    return new ValidationError(`${field} is required`, { field, type: 'required' });
  },

  invalidFormat(field, expectedFormat) {
    return new ValidationError(`${field} must be in ${expectedFormat} format`, {
      field,
      type: 'format',
      expectedFormat
    });
  },

  fieldTooLong(field, maxLength) {
    return new ValidationError(`${field} must be no more than ${maxLength} characters`, {
      field,
      type: 'length',
      maxLength
    });
  },

  // Authentication errors
  invalidCredentials() {
    return new AuthenticationError('Invalid email or password');
  },

  expiredToken() {
    return new AuthenticationError('Token has expired', { type: 'expired' });
  },

  invalidToken() {
    return new AuthenticationError('Invalid token', { type: 'invalid' });
  },

  // Authorization errors
  insufficientPermissions(requiredPermission) {
    return new AuthorizationError('Insufficient permissions', {
      required: requiredPermission
    });
  },

  resourceAccess(resource) {
    return new AuthorizationError(`Access denied to ${resource}`, { resource });
  },

  // Business rule errors
  duplicateEmail(email) {
    return new ConflictError('Email address already in use', { email, field: 'email' });
  },

  accountSuspended(reason) {
    return new AuthorizationError('Account suspended', { reason });
  },

  insufficientBalance(required, available) {
    return new PaymentError('Insufficient account balance', { required, available });
  }
};

/**
 * Example Usage in Route Handlers
 */

// Example 1: Input validation with multiple errors
async function createUser(req, res, next) {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email) throw ErrorFactory.requiredField('email');
    if (!password) throw ErrorFactory.requiredField('password');
    if (!name) throw ErrorFactory.requiredField('name');

    // Validate formats
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw ErrorFactory.invalidFormat('email', 'valid email');
    }

    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters', {
        field: 'password',
        type: 'length',
        minLength: 8
      });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ErrorFactory.duplicateEmail(email);
    }

    // Create user...
    const user = await User.create({ email, password, name });
    res.apiSuccess(user, {}, 201);

  } catch (error) {
    next(error);
  }
}

// Example 2: Authentication with detailed error handling
async function authenticateUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ErrorFactory.invalidCredentials();
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw ErrorFactory.invalidCredentials();
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw ErrorFactory.invalidCredentials();
    }

    if (user.status === 'suspended') {
      throw ErrorFactory.accountSuspended(user.suspensionReason);
    }

    // Generate JWT token...
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.apiSuccess({ token, user });

  } catch (error) {
    next(error);
  }
}

// Example 3: Resource authorization
async function getUserProfile(req, res, next) {
  try {
    const userId = req.params.id;
    const requestingUser = req.user;

    // Check if user can access this profile
    if (requestingUser.id !== userId && requestingUser.role !== 'admin') {
      throw ErrorFactory.resourceAccess('user profile');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }

    res.apiSuccess(user);

  } catch (error) {
    next(error);
  }
}

/**
 * Error Response Examples
 */

// Validation Error Example
const validationErrorExample = {
  "success": false,
  "statusCode": 400,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "error": {
    "message": "email is required",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "type": "required"
    }
  }
};

// Authentication Error Example
const authErrorExample = {
  "success": false,
  "statusCode": 401,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "error": {
    "message": "Token has expired",
    "code": "AUTHENTICATION_ERROR",
    "details": {
      "type": "expired"
    }
  }
};

// Business Rule Error Example
const businessRuleErrorExample = {
  "success": false,
  "statusCode": 422,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "error": {
    "message": "Account suspended",
    "code": "AUTHORIZATION_ERROR",
    "details": {
      "reason": "Multiple failed login attempts"
    }
  }
};

/**
 * Error Monitoring and Alerting
 */
function logErrorForMonitoring(error, req) {
  const errorData = {
    timestamp: new Date().toISOString(),
    requestId: req.id,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || null,
    error: {
      name: error.name,
      message: error.message,
      code: error.code || 'UNKNOWN',
      statusCode: error.statusCode || 500,
      details: error.details || {}
    }
  };

  // Send to monitoring service (e.g., Datadog, New Relic)
  // monitoringService.logError(errorData);

  // Trigger alerts for critical errors
  if (error.statusCode >= 500) {
    // alertingService.triggerAlert('CRITICAL_ERROR', errorData);
  }

  return errorData;
}

module.exports = {
  // Error classes
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
  DatabaseError,
  ExternalServiceError,
  BusinessRuleError,
  PaymentError,

  // Utilities
  ErrorFactory,
  errorHandler,
  sanitizeErrorDetails,
  logErrorForMonitoring,

  // Example handlers
  createUser,
  authenticateUser,
  getUserProfile,

  // Examples
  examples: {
    validationErrorExample,
    authErrorExample,
    businessRuleErrorExample
  }
};

/**
 * Key Benefits of This Pattern:
 *
 * 1. Consistency: Standardized error structure across all endpoints
 * 2. Debuggability: Detailed error information with request correlation
 * 3. Security: Sanitized error details based on environment and user role
 * 4. Monitoring: Structured error logging for observability
 * 5. Maintainability: Centralized error handling logic
 *
 * Usage Tips:
 * - Always extend the base ApiError class for custom errors
 * - Use appropriate HTTP status codes for different error types
 * - Include enough detail for debugging without exposing sensitive data
 * - Log errors for monitoring and alerting purposes
 * - Provide user-friendly error messages for client applications
 */
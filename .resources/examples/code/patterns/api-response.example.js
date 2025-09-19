/**
 * API Response Pattern Examples
 *
 * Demonstrates unified response structure patterns for consistent API design.
 * These patterns ensure predictable response formats across all endpoints.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Base Response Builder
 *
 * Creates consistent response envelopes for all API responses.
 * Includes metadata, correlation IDs, and standardized structure.
 */
class ApiResponse {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.requestId = uuidv4();
  }

  /**
   * Success Response
   *
   * @param {*} data - The response data
   * @param {Object} metadata - Additional metadata (pagination, etc.)
   * @param {number} statusCode - HTTP status code (default: 200)
   * @returns {Object} Standardized success response
   */
  success(data, metadata = {}, statusCode = 200) {
    return {
      success: true,
      statusCode,
      timestamp: this.timestamp,
      requestId: this.requestId,
      data,
      metadata: {
        ...metadata,
        responseTime: this._calculateResponseTime()
      }
    };
  }

  /**
   * Error Response
   *
   * @param {string} message - Human-readable error message
   * @param {string} code - Machine-readable error code
   * @param {number} statusCode - HTTP status code
   * @param {Object} details - Additional error details
   * @returns {Object} Standardized error response
   */
  error(message, code, statusCode = 500, details = {}) {
    return {
      success: false,
      statusCode,
      timestamp: this.timestamp,
      requestId: this.requestId,
      error: {
        message,
        code,
        details,
        ...(process.env.NODE_ENV === 'development' && details.stack && { stack: details.stack })
      }
    };
  }

  /**
   * Paginated Response
   *
   * @param {Array} items - Array of data items
   * @param {Object} pagination - Pagination metadata
   * @returns {Object} Standardized paginated response
   */
  paginated(items, pagination) {
    return this.success(items, {
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
        hasNext: pagination.hasNext || false,
        hasPrevious: pagination.hasPrevious || false,
        ...pagination.cursor && {
          nextCursor: pagination.nextCursor,
          previousCursor: pagination.previousCursor
        }
      }
    });
  }

  _calculateResponseTime() {
    // In real implementation, this would calculate time from request start
    return `${Math.random() * 100}ms`;
  }
}

/**
 * Express.js Middleware for Response Standardization
 *
 * Attaches response helper methods to Express response object.
 */
function responseMiddleware(req, res, next) {
  const apiResponse = new ApiResponse();

  // Attach helper methods to response object
  res.apiSuccess = (data, metadata, statusCode) => {
    const response = apiResponse.success(data, metadata, statusCode);
    return res.status(response.statusCode).json(response);
  };

  res.apiError = (message, code, statusCode, details) => {
    const response = apiResponse.error(message, code, statusCode, details);
    return res.status(response.statusCode).json(response);
  };

  res.apiPaginated = (items, pagination) => {
    const response = apiResponse.paginated(items, pagination);
    return res.status(200).json(response);
  };

  next();
}

/**
 * Example Usage in Express Routes
 */

// Example 1: Simple success response
function getUserById(req, res) {
  const user = {
    id: 123,
    name: 'John Doe',
    email: 'john@example.com'
  };

  return res.apiSuccess(user);
}

// Example 2: Paginated response
function getUsers(req, res) {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];

  const pagination = {
    page: 1,
    limit: 10,
    total: 150,
    hasNext: true,
    hasPrevious: false
  };

  return res.apiPaginated(users, pagination);
}

// Example 3: Error response
function createUser(req, res) {
  try {
    // Validation fails
    if (!req.body.email) {
      return res.apiError(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        { field: 'email', message: 'Email is required' }
      );
    }

    // Simulate creation logic...
    const newUser = { id: 456, ...req.body };
    return res.apiSuccess(newUser, {}, 201);

  } catch (error) {
    return res.apiError(
      'Internal server error',
      'INTERNAL_ERROR',
      500,
      { originalError: error.message }
    );
  }
}

/**
 * Response Examples for Documentation
 */

// Success Response Example
const successExample = {
  "success": true,
  "statusCode": 200,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "metadata": {
    "responseTime": "45ms"
  }
};

// Error Response Example
const errorExample = {
  "success": false,
  "statusCode": 400,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "message": "Email is required"
    }
  }
};

// Paginated Response Example
const paginatedExample = {
  "success": true,
  "statusCode": 200,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "data": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ],
  "metadata": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15,
      "hasNext": true,
      "hasPrevious": false
    },
    "responseTime": "32ms"
  }
};

/**
 * Testing Helper Functions
 */
function isValidApiResponse(response) {
  const requiredFields = ['success', 'statusCode', 'timestamp', 'requestId'];
  return requiredFields.every(field => response.hasOwnProperty(field));
}

function isSuccessResponse(response) {
  return isValidApiResponse(response) &&
         response.success === true &&
         response.hasOwnProperty('data');
}

function isErrorResponse(response) {
  return isValidApiResponse(response) &&
         response.success === false &&
         response.hasOwnProperty('error');
}

module.exports = {
  ApiResponse,
  responseMiddleware,
  getUserById,
  getUsers,
  createUser,
  examples: {
    successExample,
    errorExample,
    paginatedExample
  },
  validators: {
    isValidApiResponse,
    isSuccessResponse,
    isErrorResponse
  }
};

/**
 * Key Benefits of This Pattern:
 *
 * 1. Consistency: Every response follows the same structure
 * 2. Debuggability: Request IDs enable request tracing
 * 3. Metadata: Additional context without cluttering data
 * 4. Flexibility: Extensible for different response types
 * 5. Testing: Predictable structure simplifies test assertions
 *
 * Usage Tips:
 * - Always include correlation IDs for debugging
 * - Keep metadata separate from business data
 * - Provide both human and machine-readable error information
 * - Consider response size when adding metadata
 */
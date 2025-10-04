/**
 * API Validation Pattern Examples
 *
 * Demonstrates multi-layer input validation with clear failure modes.
 * Implements defense in depth with schema, business rule, and security validation.
 */

const Joi = require('joi');
const { ValidationError } = require('./api-error-handling.example');

/**
 * Validation Layer 1: Schema Validation
 *
 * Validates data types, required fields, and basic format constraints.
 */

// Schema definitions using Joi
const schemas = {
  user: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .max(255)
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.max': 'Email must be no more than 255 characters',
        'any.required': 'Email is required'
      }),

    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be no more than 128 characters',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
        'any.required': 'Password is required'
      }),

    name: Joi.string()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z\s'-]+$/)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must be no more than 100 characters',
        'string.pattern.base': 'Name can only contain letters, spaces, hyphens and apostrophes',
        'any.required': 'Name is required'
      }),

    age: Joi.number()
      .integer()
      .min(13)
      .max(120)
      .optional()
      .messages({
        'number.min': 'Age must be at least 13',
        'number.max': 'Age must be no more than 120',
        'number.integer': 'Age must be a whole number'
      }),

    phone: Joi.string()
      .pattern(/^\+?[\d\s\-\(\)]+$/)
      .min(10)
      .max(20)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number',
        'string.min': 'Phone number must be at least 10 characters',
        'string.max': 'Phone number must be no more than 20 characters'
      })
  }),

  userUpdate: Joi.object({
    email: Joi.string().email().max(255).optional(),
    name: Joi.string().min(2).max(100).pattern(/^[a-zA-Z\s'-]+$/).optional(),
    age: Joi.number().integer().min(13).max(120).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).min(10).max(20).optional()
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  }),

  product: Joi.object({
    name: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().positive().precision(2).required(),
    category: Joi.string().valid('electronics', 'clothing', 'books', 'home', 'sports').required(),
    tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
    inStock: Joi.boolean().default(true)
  })
};

/**
 * Schema Validation Middleware
 */
function validateSchema(schemaName, source = 'body') {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return next(new ValidationError('Invalid schema specified'));
    }

    const data = source === 'query' ? req.query :
                  source === 'params' ? req.params : req.body;

    const { error, value } = schema.validate(data, {
      abortEarly: false, // Collect all validation errors
      stripUnknown: true, // Remove unknown properties
      convert: true // Convert strings to appropriate types
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return next(new ValidationError('Input validation failed', { fields: details }));
    }

    // Replace original data with validated and cleaned data
    if (source === 'query') req.query = value;
    else if (source === 'params') req.params = value;
    else req.body = value;

    next();
  };
}

/**
 * Validation Layer 2: Business Rules Validation
 *
 * Validates domain-specific constraints and business logic.
 */

class BusinessRuleValidator {
  static async validateUserCreation(userData) {
    const errors = [];

    // Check email uniqueness
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      errors.push({
        field: 'email',
        message: 'Email address is already registered',
        code: 'DUPLICATE_EMAIL'
      });
    }

    // Age-based validation
    if (userData.age && userData.age < 18) {
      // Check parental consent for minors
      if (!userData.parentalConsent) {
        errors.push({
          field: 'parentalConsent',
          message: 'Parental consent required for users under 18',
          code: 'PARENTAL_CONSENT_REQUIRED'
        });
      }
    }

    // Domain-specific email validation
    if (userData.email.endsWith('@competitor.com')) {
      errors.push({
        field: 'email',
        message: 'Registrations from competitor domains are not allowed',
        code: 'DOMAIN_BLOCKED'
      });
    }

    return errors;
  }

  static async validateUserUpdate(userId, updateData, requestingUser) {
    const errors = [];

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      errors.push({
        field: 'userId',
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return errors;
    }

    // Authorization check
    if (requestingUser.id !== userId && requestingUser.role !== 'admin') {
      errors.push({
        field: 'authorization',
        message: 'Insufficient permissions to update this user',
        code: 'UNAUTHORIZED'
      });
    }

    // Email uniqueness check (if email is being updated)
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        errors.push({
          field: 'email',
          message: 'Email address is already in use',
          code: 'DUPLICATE_EMAIL'
        });
      }
    }

    return errors;
  }

  static validateProductCreation(productData, user) {
    const errors = [];

    // Check user permissions
    if (!user.permissions.includes('create_product')) {
      errors.push({
        field: 'permissions',
        message: 'Insufficient permissions to create products',
        code: 'PERMISSION_DENIED'
      });
    }

    // Business rule: Electronics must have warranty information
    if (productData.category === 'electronics' && !productData.warranty) {
      errors.push({
        field: 'warranty',
        message: 'Electronics products must include warranty information',
        code: 'WARRANTY_REQUIRED'
      });
    }

    // Price validation based on user role
    if (productData.price > 10000 && user.role !== 'admin') {
      errors.push({
        field: 'price',
        message: 'Products over $10,000 require admin approval',
        code: 'PRICE_LIMIT_EXCEEDED'
      });
    }

    return errors;
  }
}

/**
 * Validation Layer 3: Security Validation
 *
 * Prevents injection attacks, validates file uploads, and checks security constraints.
 */

class SecurityValidator {
  static validateInput(input) {
    const errors = [];

    // SQL injection patterns
    const sqlInjectionPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|#|\/\*|\*\/)/,
      /(\bOR\b.*\bAND\b|\bAND\b.*\bOR\b)/i
    ];

    // XSS patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i
    ];

    // Check for SQL injection attempts
    const inputString = JSON.stringify(input);
    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(inputString)) {
        errors.push({
          field: 'security',
          message: 'Potential SQL injection detected',
          code: 'SQL_INJECTION_ATTEMPT'
        });
        break;
      }
    }

    // Check for XSS attempts
    for (const pattern of xssPatterns) {
      if (pattern.test(inputString)) {
        errors.push({
          field: 'security',
          message: 'Potential XSS attack detected',
          code: 'XSS_ATTEMPT'
        });
        break;
      }
    }

    // Check input size limits
    if (inputString.length > 1000000) { // 1MB limit
      errors.push({
        field: 'size',
        message: 'Input data exceeds maximum size limit',
        code: 'INPUT_TOO_LARGE'
      });
    }

    return errors;
  }

  static validateFileUpload(file) {
    const errors = [];
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain'
    ];

    // MIME type validation
    if (!allowedMimeTypes.includes(file.mimetype)) {
      errors.push({
        field: 'file',
        message: 'File type not allowed',
        code: 'INVALID_FILE_TYPE'
      });
    }

    // File size validation (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errors.push({
        field: 'file',
        message: 'File size exceeds 5MB limit',
        code: 'FILE_TOO_LARGE'
      });
    }

    // Filename validation
    if (!/^[a-zA-Z0-9._-]+$/.test(file.originalname)) {
      errors.push({
        field: 'filename',
        message: 'Filename contains invalid characters',
        code: 'INVALID_FILENAME'
      });
    }

    return errors;
  }
}

/**
 * Validation Layer 4: Authorization Validation
 *
 * Validates user permissions for specific operations.
 */

class AuthorizationValidator {
  static validateResourceAccess(user, resource, action) {
    const errors = [];

    // Check if user has required role
    if (!user.roles || !Array.isArray(user.roles)) {
      errors.push({
        field: 'authorization',
        message: 'User role information missing',
        code: 'MISSING_ROLE_INFO'
      });
      return errors;
    }

    // Check specific permissions
    const requiredPermission = `${action}_${resource}`;
    if (!user.permissions.includes(requiredPermission)) {
      errors.push({
        field: 'authorization',
        message: `Insufficient permissions for ${action} on ${resource}`,
        code: 'PERMISSION_DENIED',
        required: requiredPermission
      });
    }

    // Resource-specific checks
    if (resource === 'user' && action === 'update') {
      // Users can only update their own profile unless they're admin
      if (user.role !== 'admin' && user.id !== resourceId) {
        errors.push({
          field: 'authorization',
          message: 'Can only update own profile',
          code: 'RESOURCE_ACCESS_DENIED'
        });
      }
    }

    return errors;
  }
}

/**
 * Combined Validation Middleware
 *
 * Runs all validation layers and collects errors.
 */
async function validateRequest(schemaName, options = {}) {
  return async (req, res, next) => {
    const allErrors = [];

    try {
      // Layer 1: Schema validation
      const schema = schemas[schemaName];
      if (schema) {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
          const schemaErrors = error.details.map(detail => ({
            layer: 'schema',
            field: detail.path.join('.'),
            message: detail.message,
            code: 'SCHEMA_VALIDATION_ERROR'
          }));
          allErrors.push(...schemaErrors);
        }
      }

      // Layer 2: Business rules validation
      if (options.businessRules && allErrors.length === 0) {
        const businessErrors = await options.businessRules(req.body, req.user, req.params);
        if (businessErrors.length > 0) {
          allErrors.push(...businessErrors.map(err => ({ ...err, layer: 'business' })));
        }
      }

      // Layer 3: Security validation
      if (options.security !== false && allErrors.length === 0) {
        const securityErrors = SecurityValidator.validateInput(req.body);
        if (securityErrors.length > 0) {
          allErrors.push(...securityErrors.map(err => ({ ...err, layer: 'security' })));
        }
      }

      // Layer 4: Authorization validation
      if (options.authorization && allErrors.length === 0) {
        const authErrors = AuthorizationValidator.validateResourceAccess(
          req.user,
          options.authorization.resource,
          options.authorization.action
        );
        if (authErrors.length > 0) {
          allErrors.push(...authErrors.map(err => ({ ...err, layer: 'authorization' })));
        }
      }

      // If any errors found, throw validation error
      if (allErrors.length > 0) {
        throw new ValidationError('Request validation failed', {
          layers: allErrors.reduce((acc, err) => {
            if (!acc[err.layer]) acc[err.layer] = [];
            acc[err.layer].push(err);
            return acc;
          }, {}),
          totalErrors: allErrors.length
        });
      }

      next();

    } catch (error) {
      next(error);
    }
  };
}

/**
 * Example Route Implementations
 */

// Example 1: User creation with all validation layers
const createUserValidation = validateRequest('user', {
  businessRules: BusinessRuleValidator.validateUserCreation,
  security: true,
  authorization: {
    resource: 'user',
    action: 'create'
  }
});

// Example 2: User update with conditional validation
const updateUserValidation = validateRequest('userUpdate', {
  businessRules: (data, user, params) =>
    BusinessRuleValidator.validateUserUpdate(params.id, data, user),
  security: true,
  authorization: {
    resource: 'user',
    action: 'update'
  }
});

// Example 3: Product creation with business rules
const createProductValidation = validateRequest('product', {
  businessRules: (data, user) =>
    BusinessRuleValidator.validateProductCreation(data, user),
  security: true,
  authorization: {
    resource: 'product',
    action: 'create'
  }
});

/**
 * Validation Error Examples
 */

// Schema validation error
const schemaErrorExample = {
  "success": false,
  "statusCode": 400,
  "error": {
    "message": "Input validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "layers": {
        "schema": [
          {
            "field": "email",
            "message": "Please provide a valid email address",
            "code": "SCHEMA_VALIDATION_ERROR"
          },
          {
            "field": "password",
            "message": "Password must contain uppercase, lowercase, number and special character",
            "code": "SCHEMA_VALIDATION_ERROR"
          }
        ]
      },
      "totalErrors": 2
    }
  }
};

// Multi-layer validation error
const multiLayerErrorExample = {
  "success": false,
  "statusCode": 400,
  "error": {
    "message": "Request validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "layers": {
        "business": [
          {
            "field": "email",
            "message": "Email address is already registered",
            "code": "DUPLICATE_EMAIL"
          }
        ],
        "authorization": [
          {
            "field": "authorization",
            "message": "Insufficient permissions for create on user",
            "code": "PERMISSION_DENIED",
            "required": "create_user"
          }
        ]
      },
      "totalErrors": 2
    }
  }
};

module.exports = {
  schemas,
  validateSchema,
  BusinessRuleValidator,
  SecurityValidator,
  AuthorizationValidator,
  validateRequest,

  // Validation middleware
  createUserValidation,
  updateUserValidation,
  createProductValidation,

  // Examples
  examples: {
    schemaErrorExample,
    multiLayerErrorExample
  }
};

/**
 * Key Benefits of This Pattern:
 *
 * 1. Defense in Depth: Multiple validation layers catch different types of errors
 * 2. Early Failure: Schema validation fails fast for basic issues
 * 3. Comprehensive Coverage: Business rules, security, and authorization all validated
 * 4. Detailed Feedback: Clear error messages help developers debug issues
 * 5. Flexibility: Can enable/disable validation layers based on requirements
 *
 * Usage Tips:
 * - Always validate at schema level first for performance
 * - Use business rule validation for domain-specific constraints
 * - Include security validation for all user inputs
 * - Separate authorization validation for clear security boundaries
 * - Provide specific error codes for programmatic error handling
 */
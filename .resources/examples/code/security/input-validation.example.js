/**
 * @example Input Validation and Sanitization Security Implementation
 *
 * Demonstrates:
 * - Layered validation approach with schema-based validation
 * - Type validation and field-specific rules
 * - SQL injection prevention with parameterized queries
 * - XSS prevention with context-aware output encoding
 * - Comprehensive input sanitization strategies
 *
 * Key Patterns:
 * - Centralized validation service for consistency
 * - Schema-driven validation for maintainability
 * - Context-aware sanitization for different output contexts
 * - Proper error handling and user feedback
 * - Security-first approach to user input handling
 */

// Comprehensive Input Validation
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

// SQL Injection Prevention
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

// XSS Prevention
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

module.exports = {
  InputValidator,
  UserRepository,
  HTMLSanitizer
};
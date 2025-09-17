---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "specification"
priority: "high"
tags: ["coding", "standards", "conventions", "quality"]
difficulty: "intermediate"
estimated_time: "35 min"
---

# Coding Standards

**Purpose**: Language-agnostic coding conventions and standards for consistent, maintainable, and AI-friendly codebases.

## Core Principles

### **Readability First**
- Code is written once but read many times
- Optimize for clarity over cleverness
- Use descriptive names that explain intent
- Maintain consistent formatting and structure

### **Consistency**
- Follow established patterns within the project
- Use consistent naming conventions throughout
- Apply formatting rules uniformly
- Maintain architectural consistency

### **Simplicity**
- Prefer simple solutions over complex ones
- Avoid premature optimization
- Write code that is easy to understand and modify
- Use clear, straightforward logic flows

### **AI Collaboration Ready**
- Write code that AI assistants can easily understand and extend
- Use clear, descriptive comments for complex logic
- Maintain consistent patterns for AI pattern recognition
- Structure code in logical, predictable ways

## Naming Conventions

### **General Rules**
- Use descriptive, unambiguous names
- Avoid abbreviations unless they're widely understood
- Be consistent with naming patterns within a project
- Use searchable names (avoid single letters except for loops)

### **Variables and Functions**
```javascript
// Good: Descriptive and clear
const userAccountBalance = 1500;
const isUserAuthenticated = true;
function calculateTotalPrice(items, taxRate) { ... }

// Bad: Unclear and abbreviated
const uab = 1500;
const auth = true;
function calc(i, t) { ... }
```

### **Constants**
```javascript
// Good: Clear purpose and scope
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_API_TIMEOUT = 5000;
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// Bad: Unclear or inconsistent
const MAX = 3;
const timeout = 5000;
const roles = { a: 'admin', u: 'user' };
```

### **Classes and Types**
```typescript
// Good: Clear, descriptive class names
class UserAuthenticationService { ... }
class PaymentProcessor { ... }
interface DatabaseConnection { ... }
type ApiResponse<T> = { ... }

// Bad: Unclear or generic
class Service { ... }
class Manager { ... }
interface Connection { ... }
type Response = { ... }
```

### **Files and Directories**
- Use lowercase-kebab-case for files and directories
- Be descriptive but concise
- Group related files logically
- Use consistent naming patterns

```
// Good: Clear organization
src/
├── user-authentication/
│   ├── auth-service.js
│   ├── password-validator.js
│   └── session-manager.js
├── payment-processing/
│   ├── payment-gateway.js
│   └── transaction-validator.js
└── shared/
    ├── error-handler.js
    └── logger.js

// Bad: Unclear structure
src/
├── auth/
│   ├── svc.js
│   ├── pwd.js
│   └── sess.js
└── pay/
    ├── gw.js
    └── val.js
```

## Code Organization

### **File Structure**
- Keep files focused on a single responsibility
- Limit file length (generally under 300 lines)
- Organize imports/requires at the top
- Export/expose public interfaces clearly

```javascript
// Good: Well-organized file structure
// 1. Imports/requires
import { Logger } from '../shared/logger.js';
import { validateInput } from '../validators/input-validator.js';

// 2. Constants
const MAX_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

// 3. Helper functions (internal)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 4. Main functionality
export class ApiClient {
  // Implementation
}

// 5. Default export (if applicable)
export default ApiClient;
```

### **Function Organization**
- Keep functions small and focused (generally under 50 lines)
- Use pure functions when possible
- Minimize side effects
- Return early to reduce nesting

```javascript
// Good: Small, focused function
function validateUserAge(age) {
  if (!age || typeof age !== 'number') {
    return { valid: false, error: 'Age must be a number' };
  }

  if (age < 0 || age > 150) {
    return { valid: false, error: 'Age must be between 0 and 150' };
  }

  return { valid: true };
}

// Good: Early return reduces nesting
function processUserData(userData) {
  if (!userData) {
    return null;
  }

  if (!userData.email) {
    return null;
  }

  // Process valid data
  return transformedData;
}
```

### **Module Organization**
- Group related functionality into modules
- Use clear module boundaries
- Minimize dependencies between modules
- Export only what's necessary

```javascript
// Good: Clear module boundaries
// user-service.js
export {
  createUser,
  updateUser,
  deleteUser,
  getUserById
};

// auth-service.js
export {
  authenticateUser,
  validateToken,
  refreshToken
};
```

## Error Handling

### **Consistent Error Patterns**
- Use consistent error handling patterns throughout the project
- Provide meaningful error messages
- Include relevant context in errors
- Handle errors at appropriate levels

```javascript
// Good: Consistent error handling
class UserService {
  async createUser(userData) {
    try {
      const validationResult = validateUserData(userData);
      if (!validationResult.valid) {
        throw new ValidationError(
          'Invalid user data',
          { field: validationResult.field, value: validationResult.value }
        );
      }

      return await this.database.createUser(userData);
    } catch (error) {
      this.logger.error('Failed to create user', {
        error: error.message,
        userData: { email: userData.email } // Safe logging
      });
      throw error;
    }
  }
}
```

### **Error Types**
- Define specific error types for different scenarios
- Include error codes for programmatic handling
- Provide user-friendly messages when appropriate

```javascript
// Good: Specific error types
class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_FAILED';
    this.field = field;
    this.value = value;
  }
}

class DatabaseError extends Error {
  constructor(message, operation, table) {
    super(message);
    this.name = 'DatabaseError';
    this.code = 'DATABASE_ERROR';
    this.operation = operation;
    this.table = table;
  }
}
```

## Logging Standards

### **Log Levels**
- **ERROR**: System errors, exceptions, failures
- **WARN**: Potential issues, deprecated usage, fallbacks
- **INFO**: Important system events, user actions
- **DEBUG**: Detailed diagnostic information

### **Log Structure**
```javascript
// Good: Structured logging
logger.info('User created successfully', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
  action: 'user_creation'
});

logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack,
  connectionString: 'postgresql://***', // Sanitized
  timestamp: new Date().toISOString(),
  action: 'database_connection'
});
```

### **Security Considerations**
- Never log sensitive information (passwords, tokens, personal data)
- Sanitize log output
- Use appropriate log levels for security events

```javascript
// Good: Safe logging
logger.info('User authenticated', {
  userId: user.id,
  email: user.email.replace(/(.{2}).*@/, '$1***@'), // Partially masked
  timestamp: new Date().toISOString()
});

// Bad: Unsafe logging
logger.info('User authenticated', {
  password: user.password, // Never log passwords
  token: authToken // Never log tokens
});
```

## Comments and Documentation

### **When to Comment**
- Explain **why**, not **what**
- Document complex business logic
- Explain non-obvious technical decisions
- Provide context for future maintainers

```javascript
// Good: Explains why
// Using exponential backoff to avoid overwhelming the API
// when it's under heavy load
const delay = Math.min(1000 * Math.pow(2, attempt), 30000);

// Good: Explains complex logic
// Calculate tax based on user location and product category
// Different tax rates apply based on local regulations
function calculateTax(location, productCategory, price) {
  // Implementation details...
}

// Bad: Explains what (obvious from code)
// Increment counter by 1
counter++;
```

### **Function Documentation**
```javascript
/**
 * Validates user input data for account creation
 *
 * @param {Object} userData - User data object
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {number} userData.age - User's age
 * @returns {Object} Validation result with success/error details
 * @throws {ValidationError} When input data is invalid
 */
function validateUserInput(userData) {
  // Implementation
}
```

## Code Formatting

### **Consistency Rules**
- Use consistent indentation (2 or 4 spaces, never tabs)
- Follow language-specific formatting conventions
- Use automated formatting tools when available
- Maintain consistent line length (80-120 characters)

### **Automated Formatting**
Use project-appropriate formatters:
- **JavaScript/TypeScript**: Prettier
- **Python**: Black
- **Go**: gofmt
- **Rust**: rustfmt

## Performance Considerations

### **General Guidelines**
- Write clear code first, optimize when necessary
- Measure performance before optimizing
- Use appropriate data structures for the task
- Consider memory usage and garbage collection

### **Common Patterns**
```javascript
// Good: Efficient iteration
const activeUsers = users.filter(user => user.isActive);
const userEmails = activeUsers.map(user => user.email);

// Good: Early exit for expensive operations
function findUserByEmail(email) {
  if (!email || !email.includes('@')) {
    return null; // Early exit for invalid input
  }

  return users.find(user => user.email === email);
}

// Good: Caching expensive operations
class DataProcessor {
  constructor() {
    this.cache = new Map();
  }

  processData(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result = this.expensiveOperation(key);
    this.cache.set(key, result);
    return result;
  }
}
```

## Security Standards

### **Input Validation**
- Validate all external inputs
- Sanitize data before processing
- Use parameterized queries for database operations
- Validate file uploads and user content

```javascript
// Good: Input validation
function createUser(userData) {
  // Validate required fields
  if (!userData.email || !isValidEmail(userData.email)) {
    throw new ValidationError('Invalid email address');
  }

  // Sanitize input
  const sanitizedData = {
    email: userData.email.toLowerCase().trim(),
    name: sanitizeString(userData.name),
    age: parseInt(userData.age, 10)
  };

  return sanitizedData;
}
```

### **Sensitive Data Handling**
- Never hardcode secrets in source code
- Use environment variables for configuration
- Encrypt sensitive data at rest and in transit
- Follow principle of least privilege

```javascript
// Good: Environment-based configuration
const config = {
  databaseUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET
};

// Bad: Hardcoded secrets
const config = {
  databaseUrl: 'postgresql://user:password@localhost:5432/db',
  apiKey: 'sk-1234567890abcdef',
  jwtSecret: 'my-secret-key'
};
```

## AI Collaboration Guidelines

### **AI-Friendly Patterns**
- Use consistent, predictable code patterns
- Avoid overly clever or obscure code
- Maintain clear separation of concerns
- Use descriptive variable and function names

### **Context for AI Assistants**
```javascript
// Good: Clear intent and context
/**
 * Processes user authentication with retry logic
 *
 * This function implements exponential backoff for failed
 * authentication attempts to prevent overwhelming the auth service
 */
async function authenticateUserWithRetry(credentials, maxAttempts = 3) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await this.authService.authenticate(credentials);
    } catch (error) {
      attempt++;

      if (attempt >= maxAttempts) {
        throw new AuthenticationError('Max authentication attempts exceeded');
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = 1000 * Math.pow(2, attempt - 1);
      await this.sleep(delay);
    }
  }
}
```

## Testing Integration

### **Testable Code**
- Write code that's easy to test
- Minimize dependencies and side effects
- Use dependency injection where appropriate
- Separate pure logic from I/O operations

```javascript
// Good: Testable code with dependency injection
class OrderProcessor {
  constructor(paymentService, emailService, logger) {
    this.paymentService = paymentService;
    this.emailService = emailService;
    this.logger = logger;
  }

  async processOrder(order) {
    // Pure logic that's easy to test
    const validation = this.validateOrder(order);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    // Dependency-injected services (easy to mock)
    const payment = await this.paymentService.charge(order.total);
    await this.emailService.sendConfirmation(order.customerEmail);

    return { orderId: order.id, paymentId: payment.id };
  }

  // Pure function - easy to test
  validateOrder(order) {
    if (!order.items || order.items.length === 0) {
      return { valid: false, error: 'Order must contain items' };
    }
    return { valid: true };
  }
}
```

## Language-Specific Conventions

### **JavaScript/TypeScript**
- Use `const` by default, `let` when reassignment needed
- Prefer arrow functions for callbacks
- Use template literals for string interpolation
- Prefer async/await over Promises

### **Python**
- Follow PEP 8 style guidelines
- Use snake_case for variables and functions
- Use type hints for function parameters and returns
- Prefer list/dict comprehensions when readable

### **Go**
- Use gofmt for formatting
- Follow effective Go guidelines
- Use meaningful package names
- Handle errors explicitly

### **Rust**
- Use rustfmt for formatting
- Follow Rust naming conventions
- Use Result<T, E> for error handling
- Prefer explicit error types

## Quality Assurance

### **Pre-commit Checklist**
- [ ] Code follows project naming conventions
- [ ] Functions are small and focused
- [ ] Error handling is consistent
- [ ] No sensitive data in code
- [ ] Comments explain complex logic
- [ ] Code is formatted consistently
- [ ] No obvious performance issues

### **Code Review Focus**
- Readability and maintainability
- Security considerations
- Performance implications
- Test coverage
- Documentation completeness

## Enforcement and Tools

### **Automated Tools**
- **Linters**: ESLint, pylint, golangci-lint
- **Formatters**: Prettier, Black, gofmt
- **Security**: SAST tools, dependency scanners
- **Quality**: SonarQube, CodeClimate

### **Integration Points**
- Pre-commit hooks for formatting and linting
- CI/CD pipeline checks
- Code review requirements
- Quality gate enforcement

## Related Guidelines

- **[Quality Standards](./quality-standards.md)** - Comprehensive quality requirements and validation
- **[Testing Guidelines](./testing-guidelines.md)** - Testing strategies and best practices
- **[Code Review Guidelines](./code-review-guidelines.md)** - Code review processes and checklists
- **[Security Guidelines](./security-guidelines.md)** - Security best practices and requirements

---

*Consistent coding standards enable better collaboration between humans and AI assistants while maintaining high code quality.*
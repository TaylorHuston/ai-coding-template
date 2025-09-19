/**
 * Unit Testing Examples
 *
 * Comprehensive examples for writing effective unit tests with proper
 * isolation, mocking, and test organization
 *
 * Features:
 * - AAA (Arrange, Act, Assert) pattern
 * - Descriptive test names
 * - Proper mocking strategies
 * - Test data factories
 * - Error handling tests
 */

const { jest } = require('@jest/globals');

// Example service under test
class UserService {
  constructor(database, emailService, validator) {
    this.database = database;
    this.emailService = emailService;
    this.validator = validator;
  }

  async createUser(userData) {
    // Validate input
    const validationResult = this.validator.validate(userData);
    if (!validationResult.valid) {
      throw new ValidationError(validationResult.errors[0]);
    }

    // Check for existing user
    const existingUser = await this.database.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create user
    const user = await this.database.create(userData);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return user;
  }

  async updateUser(userId, updateData) {
    const user = await this.database.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await this.database.update(userId, updateData);
    return updatedUser;
  }

  async deleteUser(userId) {
    const user = await this.database.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.database.delete(userId);
    return true;
  }
}

// Test factory functions
const createTestUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  age: 25,
  isActive: true,
  createdAt: new Date('2023-01-01'),
  ...overrides
});

const createMockDatabase = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

const createMockEmailService = () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true)
});

const createMockValidator = () => ({
  validate: jest.fn().mockReturnValue({ valid: true, errors: [] })
});

// Example unit tests following best practices
describe('UserService', () => {
  let userService;
  let mockDatabase;
  let mockEmailService;
  let mockValidator;

  beforeEach(() => {
    mockDatabase = createMockDatabase();
    mockEmailService = createMockEmailService();
    mockValidator = createMockValidator();
    userService = new UserService(mockDatabase, mockEmailService, mockValidator);
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25
      };
      const expectedUser = createTestUser(userData);

      mockDatabase.findByEmail.mockResolvedValue(null);
      mockDatabase.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockDatabase.create).toHaveBeenCalledWith(userData);
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        userData.email,
        userData.name
      );
    });

    it('should throw ValidationError for invalid email', async () => {
      // Arrange
      const userData = { email: 'invalid-email', name: 'Test' };
      mockValidator.validate.mockReturnValue({
        valid: false,
        errors: ['Invalid email format']
      });

      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects.toThrow(ValidationError);

      expect(mockDatabase.create).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should throw ConflictError for duplicate email', async () => {
      // Arrange
      const userData = { email: 'existing@example.com', name: 'Test' };
      const existingUser = createTestUser({ email: userData.email });

      mockDatabase.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects.toThrow(ConflictError);

      expect(mockDatabase.create).not.toHaveBeenCalled();
    });

    it('should handle email service failure gracefully', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test User' };
      const user = createTestUser(userData);

      mockDatabase.findByEmail.mockResolvedValue(null);
      mockDatabase.create.mockResolvedValue(user);
      mockEmailService.sendWelcomeEmail.mockRejectedValue(new Error('Email service down'));

      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects.toThrow('Email service down');

      // Verify user was still created
      expect(mockDatabase.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('updateUser', () => {
    it('should update only provided fields', async () => {
      // Arrange
      const userId = 1;
      const existingUser = createTestUser({ id: userId, name: 'Old Name' });
      const updateData = { name: 'New Name' };
      const updatedUser = createTestUser({ ...existingUser, ...updateData });

      mockDatabase.findById.mockResolvedValue(existingUser);
      mockDatabase.update.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateUser(userId, updateData);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(mockDatabase.update).toHaveBeenCalledWith(userId, updateData);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      // Arrange
      const userId = 999;
      const updateData = { name: 'New Name' };

      mockDatabase.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateUser(userId, updateData))
        .rejects.toThrow(NotFoundError);

      expect(mockDatabase.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      // Arrange
      const userId = 1;
      const existingUser = createTestUser({ id: userId });

      mockDatabase.findById.mockResolvedValue(existingUser);
      mockDatabase.delete.mockResolvedValue(true);

      // Act
      const result = await userService.deleteUser(userId);

      // Assert
      expect(result).toBe(true);
      expect(mockDatabase.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundError when deleting non-existent user', async () => {
      // Arrange
      const userId = 999;

      mockDatabase.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.deleteUser(userId))
        .rejects.toThrow(NotFoundError);

      expect(mockDatabase.delete).not.toHaveBeenCalled();
    });
  });
});

// Example of testing pure functions
describe('Password Validator', () => {
  let validator;

  beforeEach(() => {
    validator = new PasswordValidator();
  });

  it('should require minimum 8 characters', () => {
    // Arrange
    const shortPassword = '1234567';

    // Act
    const result = validator.validate(shortPassword);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  it('should require uppercase, lowercase, number, and special character', () => {
    // Arrange
    const testCases = [
      { password: 'lowercase123!', missing: 'uppercase' },
      { password: 'UPPERCASE123!', missing: 'lowercase' },
      { password: 'Password!', missing: 'number' },
      { password: 'Password123', missing: 'special character' }
    ];

    testCases.forEach(({ password, missing }) => {
      // Act
      const result = validator.validate(password);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors.some(error =>
        error.toLowerCase().includes(missing)
      )).toBe(true);
    });
  });

  it('should accept valid password', () => {
    // Arrange
    const validPassword = 'ValidPassword123!';

    // Act
    const result = validator.validate(validPassword);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});

// Example of testing async operations with timers
describe('RateLimiter', () => {
  let rateLimiter;

  beforeEach(() => {
    jest.useFakeTimers();
    rateLimiter = new RateLimiter({ limit: 3, windowMs: 60000 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow requests within limit', () => {
    // Arrange
    const clientId = 'test-client';

    // Act & Assert
    expect(rateLimiter.isAllowed(clientId)).toBe(true);
    expect(rateLimiter.isAllowed(clientId)).toBe(true);
    expect(rateLimiter.isAllowed(clientId)).toBe(true);
  });

  it('should reject requests exceeding limit', () => {
    // Arrange
    const clientId = 'test-client';

    // Act - Use up the limit
    rateLimiter.isAllowed(clientId);
    rateLimiter.isAllowed(clientId);
    rateLimiter.isAllowed(clientId);

    // Assert - Next request should be rejected
    expect(rateLimiter.isAllowed(clientId)).toBe(false);
  });

  it('should reset limit after time window', () => {
    // Arrange
    const clientId = 'test-client';

    // Act - Use up the limit
    rateLimiter.isAllowed(clientId);
    rateLimiter.isAllowed(clientId);
    rateLimiter.isAllowed(clientId);

    // Fast-forward time
    jest.advanceTimersByTime(60001);

    // Assert - Should allow requests again
    expect(rateLimiter.isAllowed(clientId)).toBe(true);
  });
});

// Custom error classes for examples
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Example implementations for testing
class PasswordValidator {
  validate(password) {
    const errors = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

class RateLimiter {
  constructor({ limit, windowMs }) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.clients = new Map();
  }

  isAllowed(clientId) {
    const now = Date.now();
    const clientData = this.clients.get(clientId) || { count: 0, resetTime: now + this.windowMs };

    if (now > clientData.resetTime) {
      clientData.count = 0;
      clientData.resetTime = now + this.windowMs;
    }

    if (clientData.count >= this.limit) {
      return false;
    }

    clientData.count++;
    this.clients.set(clientId, clientData);
    return true;
  }
}

module.exports = {
  UserService,
  PasswordValidator,
  RateLimiter,
  ValidationError,
  ConflictError,
  NotFoundError,
  createTestUser,
  createMockDatabase,
  createMockEmailService,
  createMockValidator
};
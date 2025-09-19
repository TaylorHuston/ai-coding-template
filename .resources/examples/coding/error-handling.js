// Error Handling Examples

// ===== Good: Consistent error handling =====
class UserService {
  constructor(database, logger) {
    this.database = database;
    this.logger = logger;
  }

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
        userData: { email: userData.email } // Safe logging - no sensitive data
      });
      throw error;
    }
  }

  async getUserById(id) {
    try {
      if (!id) {
        throw new ValidationError('User ID is required');
      }

      const user = await this.database.findUserById(id);
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error('Failed to get user', { userId: id, error: error.message });
      throw error;
    }
  }
}

// ===== Custom Error Classes =====
class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// ===== Error Handling Utilities =====
function handleAsyncError(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Async operation failed:', error);
      throw error;
    }
  };
}

// ===== Good: Result pattern for error handling =====
function validateUserData(userData) {
  if (!userData.email || !userData.email.includes('@')) {
    return {
      valid: false,
      field: 'email',
      value: userData.email,
      error: 'Valid email is required'
    };
  }

  if (!userData.name || userData.name.trim().length < 2) {
    return {
      valid: false,
      field: 'name',
      value: userData.name,
      error: 'Name must be at least 2 characters'
    };
  }

  return { valid: true };
}
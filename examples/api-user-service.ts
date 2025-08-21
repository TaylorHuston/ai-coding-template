/**
 * Example API service implementation
 * 
 * This example demonstrates:
 * - Service class structure
 * - Error handling patterns
 * - Type definitions
 * - Async/await usage
 * - Logging and monitoring
 */

import { Logger } from '../utils/logger';
import { ApiError, ValidationError, NotFoundError } from '../utils/errors';
import { UserRepository } from '../repositories/user-repository';
import { validateUserData } from '../utils/validation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role?: 'admin' | 'user';
}

interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: 'admin' | 'user';
}

export class UserService {
  private logger: Logger;
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository, logger: Logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    this.logger.info('Creating new user', { email: userData.email });

    try {
      // Validate input data
      const validationErrors = validateUserData(userData);
      if (validationErrors.length > 0) {
        throw new ValidationError('Invalid user data', { errors: validationErrors });
      }

      // Check for existing user
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new ValidationError('User already exists', { email: userData.email });
      }

      // Create user with defaults
      const userToCreate = {
        ...userData,
        role: userData.role || 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdUser = await this.userRepository.create(userToCreate);

      this.logger.info('User created successfully', {
        userId: createdUser.id,
        email: createdUser.email,
      });

      return createdUser;
    } catch (error) {
      this.logger.error('Failed to create user', {
        email: userData.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Re-throw known errors, wrap unknown errors
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create user', 500, { originalError: error });
    }
  }

  async getUserById(userId: string): Promise<User> {
    this.logger.debug('Fetching user by ID', { userId });

    try {
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found', { userId });
      }

      this.logger.debug('User fetched successfully', { userId });
      return user;
    } catch (error) {
      this.logger.error('Failed to fetch user', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch user', 500, { originalError: error });
    }
  }

  async updateUser(userId: string, updateData: UpdateUserRequest): Promise<User> {
    this.logger.info('Updating user', { userId });

    try {
      // Validate user exists
      await this.getUserById(userId);

      // Validate update data
      const validationErrors = validateUserData(updateData, { isUpdate: true });
      if (validationErrors.length > 0) {
        throw new ValidationError('Invalid update data', { errors: validationErrors });
      }

      // Check for email conflicts if email is being updated
      if (updateData.email) {
        const existingUser = await this.userRepository.findByEmail(updateData.email);
        if (existingUser && existingUser.id !== userId) {
          throw new ValidationError('Email already in use', { email: updateData.email });
        }
      }

      const updatedUser = await this.userRepository.update(userId, {
        ...updateData,
        updatedAt: new Date(),
      });

      this.logger.info('User updated successfully', { userId });
      return updatedUser;
    } catch (error) {
      this.logger.error('Failed to update user', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update user', 500, { originalError: error });
    }
  }

  async deleteUser(userId: string): Promise<void> {
    this.logger.info('Deleting user', { userId });

    try {
      // Validate user exists
      await this.getUserById(userId);

      await this.userRepository.delete(userId);

      this.logger.info('User deleted successfully', { userId });
    } catch (error) {
      this.logger.error('Failed to delete user', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to delete user', 500, { originalError: error });
    }
  }

  async listUsers(options: {
    limit?: number;
    offset?: number;
    role?: string;
  } = {}): Promise<{ users: User[]; total: number }> {
    this.logger.debug('Listing users', options);

    try {
      const { limit = 20, offset = 0, role } = options;

      // Validate options
      if (limit > 100) {
        throw new ValidationError('Limit cannot exceed 100');
      }

      const result = await this.userRepository.findMany({
        limit,
        offset,
        filter: role ? { role } : undefined,
      });

      this.logger.debug('Users listed successfully', {
        count: result.users.length,
        total: result.total,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to list users', {
        options,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to list users', 500, { originalError: error });
    }
  }
}

// Usage example:
/*
const userRepository = new UserRepository(database);
const logger = new Logger('UserService');
const userService = new UserService(userRepository, logger);

// Create a user
try {
  const newUser = await userService.createUser({
    email: 'john@example.com',
    name: 'John Doe',
    password: 'secure_password123',
  });
  console.log('User created:', newUser);
} catch (error) {
  console.error('Error:', error.message);
}
*/
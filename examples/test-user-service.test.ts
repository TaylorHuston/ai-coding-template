/**
 * Example test implementation
 * 
 * This example demonstrates:
 * - Test structure and organization
 * - Mocking dependencies
 * - Test data setup
 * - Async testing patterns
 * - Error testing
 * - Assertion patterns
 */

import { UserService } from '../services/user-service';
import { UserRepository } from '../repositories/user-repository';
import { Logger } from '../utils/logger';
import { ValidationError, NotFoundError, ApiError } from '../utils/errors';

// Mock dependencies
jest.mock('../repositories/user-repository');
jest.mock('../utils/logger');

const MockUserRepository = UserRepository as jest.MockedClass<typeof UserRepository>;
const MockLogger = Logger as jest.MockedClass<typeof Logger>;

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockLogger: jest.Mocked<Logger>;

  // Test data fixtures
  const mockUser = {
    id: 'user-123',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user' as const,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const validUserData = {
    email: 'jane@example.com',
    name: 'Jane Doe',
    password: 'SecurePass123!',
    role: 'user' as const,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create mock instances
    mockUserRepository = new MockUserRepository() as jest.Mocked<UserRepository>;
    mockLogger = new MockLogger('UserService') as jest.Mocked<Logger>;

    // Create service instance with mocked dependencies
    userService = new UserService(mockUserRepository, mockLogger);
  });

  describe('createUser', () => {
    it('should create user successfully with valid data', async () => {
      // Arrange
      const expectedUser = { ...mockUser, ...validUserData };
      mockUserRepository.findByEmail.mockResolvedValue(null); // User doesn't exist
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Mock validation to return no errors
      jest.doMock('../utils/validation', () => ({
        validateUserData: jest.fn().mockReturnValue([]),
      }));

      // Act
      const result = await userService.createUser(validUserData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...validUserData,
          role: 'user',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'User created successfully',
        expect.objectContaining({
          userId: expectedUser.id,
          email: expectedUser.email,
        })
      );
    });

    it('should throw ValidationError when user data is invalid', async () => {
      // Arrange
      const invalidUserData = {
        email: 'invalid-email',
        name: '',
        password: '123',
      };

      // Mock validation to return errors
      jest.doMock('../utils/validation', () => ({
        validateUserData: jest.fn().mockReturnValue(['Invalid email format', 'Name is required']),
      }));

      // Act & Assert
      await expect(userService.createUser(invalidUserData)).rejects.toThrow(ValidationError);
      await expect(userService.createUser(invalidUserData)).rejects.toThrow('Invalid user data');

      // Verify repository methods were not called
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();

      // Verify error was logged
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to create user',
        expect.objectContaining({
          email: invalidUserData.email,
          error: expect.stringContaining('Invalid user data'),
        })
      );
    });

    it('should throw ValidationError when user already exists', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      jest.doMock('../utils/validation', () => ({
        validateUserData: jest.fn().mockReturnValue([]),
      }));

      // Act & Assert
      await expect(userService.createUser(validUserData)).rejects.toThrow(ValidationError);
      await expect(userService.createUser(validUserData)).rejects.toThrow('User already exists');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockRejectedValue(repositoryError);

      jest.doMock('../utils/validation', () => ({
        validateUserData: jest.fn().mockReturnValue([]),
      }));

      // Act & Assert
      await expect(userService.createUser(validUserData)).rejects.toThrow(ApiError);
      await expect(userService.createUser(validUserData)).rejects.toThrow('Failed to create user');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to create user',
        expect.objectContaining({
          email: validUserData.email,
          error: repositoryError.message,
        })
      );
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 'user-123';
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'User fetched successfully',
        { userId }
      );
    });

    it('should throw NotFoundError when user not found', async () => {
      // Arrange
      const userId = 'nonexistent-user';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById(userId)).rejects.toThrow(NotFoundError);
      await expect(userService.getUserById(userId)).rejects.toThrow('User not found');

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should throw ValidationError when userId is empty', async () => {
      // Arrange
      const emptyUserId = '';

      // Act & Assert
      await expect(userService.getUserById(emptyUserId)).rejects.toThrow(ValidationError);
      await expect(userService.getUserById(emptyUserId)).rejects.toThrow('User ID is required');

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const updateData = {
      name: 'John Updated',
      email: 'john.updated@example.com',
    };

    it('should update user successfully', async () => {
      // Arrange
      const updatedUser = { ...mockUser, ...updateData };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(null); // Email not taken
      mockUserRepository.update.mockResolvedValue(updatedUser);

      jest.doMock('../utils/validation', () => ({
        validateUserData: jest.fn().mockReturnValue([]),
      }));

      // Act
      const result = await userService.updateUser(mockUser.id, updateData);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          ...updateData,
          updatedAt: expect.any(Date),
        })
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'User updated successfully',
        { userId: mockUser.id }
      );
    });

    it('should throw ValidationError when email is already taken by another user', async () => {
      // Arrange
      const otherUser = { ...mockUser, id: 'other-user', email: updateData.email };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(otherUser);

      jest.doMock('../utils/validation', () => ({
        validateUserData: jest.fn().mockReturnValue([]),
      }));

      // Act & Assert
      await expect(userService.updateUser(mockUser.id, updateData)).rejects.toThrow(ValidationError);
      await expect(userService.updateUser(mockUser.id, updateData)).rejects.toThrow('Email already in use');

      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should allow user to keep their own email', async () => {
      // Arrange
      const sameEmailUpdate = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...sameEmailUpdate };
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      jest.doMock('../utils/validation', () => ({
        validateUserData: jest.fn().mockReturnValue([]),
      }));

      // Act
      const result = await userService.updateUser(mockUser.id, sameEmailUpdate);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled(); // Should not check email
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      // Act
      await userService.deleteUser(mockUser.id);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUser.id);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'User deleted successfully',
        { userId: mockUser.id }
      );
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      const userId = 'nonexistent-user';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.deleteUser(userId)).rejects.toThrow(NotFoundError);

      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('listUsers', () => {
    const mockUsers = [mockUser, { ...mockUser, id: 'user-456', email: 'jane@example.com' }];
    const mockResult = { users: mockUsers, total: 2 };

    it('should list users with default options', async () => {
      // Arrange
      mockUserRepository.findMany.mockResolvedValue(mockResult);

      // Act
      const result = await userService.listUsers();

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockUserRepository.findMany).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        filter: undefined,
      });
    });

    it('should list users with custom options', async () => {
      // Arrange
      const options = { limit: 10, offset: 5, role: 'admin' };
      mockUserRepository.findMany.mockResolvedValue(mockResult);

      // Act
      const result = await userService.listUsers(options);

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockUserRepository.findMany).toHaveBeenCalledWith({
        limit: 10,
        offset: 5,
        filter: { role: 'admin' },
      });
    });

    it('should throw ValidationError when limit exceeds maximum', async () => {
      // Arrange
      const options = { limit: 150 };

      // Act & Assert
      await expect(userService.listUsers(options)).rejects.toThrow(ValidationError);
      await expect(userService.listUsers(options)).rejects.toThrow('Limit cannot exceed 100');

      expect(mockUserRepository.findMany).not.toHaveBeenCalled();
    });
  });

  // Test helper functions and error scenarios
  describe('error handling', () => {
    it('should wrap unknown errors in ApiError', async () => {
      // Arrange
      const unknownError = new Error('Unexpected error');
      mockUserRepository.findById.mockRejectedValue(unknownError);

      // Act & Assert
      await expect(userService.getUserById('user-123')).rejects.toThrow(ApiError);
      
      const thrownError = await userService.getUserById('user-123').catch(err => err);
      expect(thrownError).toBeInstanceOf(ApiError);
      expect(thrownError.message).toBe('Failed to fetch user');
      expect(thrownError.statusCode).toBe(500);
    });

    it('should preserve known API errors', async () => {
      // Arrange
      const validationError = new ValidationError('Validation failed');
      mockUserRepository.create.mockRejectedValue(validationError);

      jest.doMock('../utils/validation', () => ({
        validateUserData: jest.fn().mockReturnValue([]),
      }));

      // Act & Assert
      await expect(userService.createUser(validUserData)).rejects.toThrow(ValidationError);
      await expect(userService.createUser(validUserData)).rejects.toThrow('Validation failed');
    });
  });
});

// Integration test example
describe('UserService Integration', () => {
  // These tests would use real database connections
  // and test the full flow without mocking dependencies
  
  it.skip('should create and retrieve user from database', async () => {
    // This would be an integration test with real database
    // Implementation depends on your testing database setup
  });
});

// Performance test example
describe('UserService Performance', () => {
  it.skip('should handle concurrent user creation', async () => {
    // Performance test for concurrent operations
    const promises = Array.from({ length: 100 }, (_, i) =>
      userService.createUser({
        email: `user${i}@example.com`,
        name: `User ${i}`,
        password: 'password123',
      })
    );

    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    expect(successful).toBeGreaterThan(90); // At least 90% success rate
  });
});
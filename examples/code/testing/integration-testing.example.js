/**
 * Integration Testing Examples
 *
 * Comprehensive examples for testing component interactions,
 * API endpoints, and database operations
 *
 * Features:
 * - Real database testing
 * - API endpoint testing
 * - Service integration testing
 * - Test database setup/cleanup
 * - Request/response validation
 */

const request = require('supertest');
const { Pool } = require('pg');

// Example Express app setup for testing
const express = require('express');
const createApp = require('../../../src/app'); // Assuming app factory

// Database setup for integration tests
class TestDatabaseManager {
  constructor() {
    this.pool = null;
  }

  async setup() {
    this.pool = new Pool({
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT || 5432,
      database: process.env.TEST_DB_NAME || 'test_db',
      user: process.env.TEST_DB_USER || 'test_user',
      password: process.env.TEST_DB_PASSWORD || 'test_password'
    });

    await this.createTables();
  }

  async createTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        content TEXT,
        published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async clearAllTables() {
    await this.pool.query('TRUNCATE TABLE posts, users RESTART IDENTITY CASCADE');
  }

  async cleanup() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  // Helper methods for test data
  async createUser(userData) {
    const result = await this.pool.query(
      'INSERT INTO users (email, name, age) VALUES ($1, $2, $3) RETURNING *',
      [userData.email, userData.name, userData.age]
    );
    return result.rows[0];
  }

  async findUserById(id) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findUserByEmail(email) {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }
}

// Integration tests for User API
describe('User API Integration', () => {
  let app;
  let database;

  beforeAll(async () => {
    database = new TestDatabaseManager();
    await database.setup();
    app = createApp({ database: database.pool });
  });

  afterAll(async () => {
    await database.cleanup();
  });

  beforeEach(async () => {
    await database.clearAllTables();
  });

  describe('POST /api/users', () => {
    it('should create user and return 201', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Assert
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        email: userData.email,
        name: userData.name,
        age: userData.age,
        isActive: true,
        createdAt: expect.any(String)
      });

      // Verify database state
      const userInDb = await database.findUserById(response.body.id);
      expect(userInDb).toBeTruthy();
      expect(userInDb.email).toBe(userData.email);
    });

    it('should return 400 for invalid email', async () => {
      // Arrange
      const userData = {
        email: 'invalid-email',
        name: 'Test User'
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      // Assert
      expect(response.body).toMatchObject({
        error: 'Validation Error',
        message: expect.stringContaining('email')
      });
    });

    it('should return 409 for duplicate email', async () => {
      // Arrange
      const userData = {
        email: 'duplicate@example.com',
        name: 'Test User'
      };

      // Create user first
      await database.createUser(userData);

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      // Assert
      expect(response.body).toMatchObject({
        error: 'Conflict',
        message: expect.stringContaining('already exists')
      });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: 30
      };
      const createdUser = await database.createUser(userData);

      // Act
      const response = await request(app)
        .get(`/api/users/${createdUser.id}`)
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        id: createdUser.id,
        email: userData.email,
        name: userData.name,
        age: userData.age
      });
    });

    it('should return 404 for non-existent user', async () => {
      // Act
      const response = await request(app)
        .get('/api/users/999')
        .expect(404);

      // Assert
      expect(response.body).toMatchObject({
        error: 'Not Found',
        message: expect.stringContaining('User not found')
      });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      // Arrange
      const originalUser = await database.createUser({
        email: 'original@example.com',
        name: 'Original Name',
        age: 25
      });

      const updateData = {
        name: 'Updated Name',
        age: 26
      };

      // Act
      const response = await request(app)
        .put(`/api/users/${originalUser.id}`)
        .send(updateData)
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        id: originalUser.id,
        email: originalUser.email, // Should remain unchanged
        name: updateData.name,
        age: updateData.age
      });

      // Verify database state
      const updatedUser = await database.findUserById(originalUser.id);
      expect(updatedUser.name).toBe(updateData.name);
      expect(updatedUser.age).toBe(updateData.age);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const user = await database.createUser({
        email: 'delete@example.com',
        name: 'Delete Me',
        age: 25
      });

      // Act
      const response = await request(app)
        .delete(`/api/users/${user.id}`)
        .expect(204);

      // Assert
      expect(response.body).toEqual({});

      // Verify user is deleted from database
      const deletedUser = await database.findUserById(user.id);
      expect(deletedUser).toBeFalsy();
    });
  });
});

// Integration tests for authentication flow
describe('Authentication Integration', () => {
  let app;
  let database;

  beforeAll(async () => {
    database = new TestDatabaseManager();
    await database.setup();
    app = createApp({ database: database.pool });
  });

  afterAll(async () => {
    await database.cleanup();
  });

  beforeEach(async () => {
    await database.clearAllTables();
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials', async () => {
      // Arrange
      const userData = {
        email: 'auth@example.com',
        name: 'Auth User',
        password: 'SecurePassword123!'
      };

      // Create user first (assuming registration endpoint hashes password)
      await request(app)
        .post('/api/users')
        .send(userData);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        token: expect.any(String),
        user: {
          email: userData.email,
          name: userData.name
        }
      });

      // Verify token format (assuming JWT)
      expect(response.body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });

    it('should reject invalid credentials', async () => {
      // Arrange
      const userData = {
        email: 'auth@example.com',
        name: 'Auth User',
        password: 'SecurePassword123!'
      };

      await request(app)
        .post('/api/users')
        .send(userData);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'WrongPassword'
        })
        .expect(401);

      // Assert
      expect(response.body).toMatchObject({
        error: 'Unauthorized',
        message: expect.stringContaining('Invalid credentials')
      });
    });
  });

  describe('Protected routes', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
      // Create and authenticate user
      const userData = {
        email: 'protected@example.com',
        name: 'Protected User',
        password: 'SecurePassword123!'
      };

      await request(app)
        .post('/api/users')
        .send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      authToken = loginResponse.body.token;
      testUser = loginResponse.body.user;
    });

    it('should access protected route with valid token', async () => {
      // Act
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        email: testUser.email,
        name: testUser.name
      });
    });

    it('should reject access without token', async () => {
      // Act
      const response = await request(app)
        .get('/api/profile')
        .expect(401);

      // Assert
      expect(response.body).toMatchObject({
        error: 'Unauthorized',
        message: expect.stringContaining('token')
      });
    });

    it('should reject access with invalid token', async () => {
      // Act
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      // Assert
      expect(response.body).toMatchObject({
        error: 'Unauthorized',
        message: expect.stringContaining('Invalid token')
      });
    });
  });
});

// Database integration tests
describe('Database Operations', () => {
  let database;

  beforeAll(async () => {
    database = new TestDatabaseManager();
    await database.setup();
  });

  afterAll(async () => {
    await database.cleanup();
  });

  beforeEach(async () => {
    await database.clearAllTables();
  });

  describe('User operations', () => {
    it('should handle concurrent user creation', async () => {
      // Arrange
      const userPromises = Array.from({ length: 10 }, (_, i) =>
        database.createUser({
          email: `user${i}@example.com`,
          name: `User ${i}`,
          age: 20 + i
        })
      );

      // Act
      const users = await Promise.all(userPromises);

      // Assert
      expect(users).toHaveLength(10);
      users.forEach((user, index) => {
        expect(user.email).toBe(`user${index}@example.com`);
        expect(user.id).toBeDefined();
      });
    });

    it('should enforce unique email constraint', async () => {
      // Arrange
      const userData = {
        email: 'unique@example.com',
        name: 'First User',
        age: 25
      };

      await database.createUser(userData);

      // Act & Assert
      await expect(database.createUser({
        ...userData,
        name: 'Second User'
      })).rejects.toThrow(/duplicate key value violates unique constraint/);
    });
  });

  describe('Transaction handling', () => {
    it('should rollback on error', async () => {
      // Arrange
      const client = await database.pool.connect();

      try {
        await client.query('BEGIN');

        // Create user
        const userResult = await client.query(
          'INSERT INTO users (email, name, age) VALUES ($1, $2, $3) RETURNING *',
          ['transaction@example.com', 'Transaction User', 25]
        );

        const userId = userResult.rows[0].id;

        // Create post
        await client.query(
          'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3)',
          [userId, 'Test Post', 'Test content']
        );

        // Simulate error (invalid foreign key)
        await client.query(
          'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3)',
          [999999, 'Invalid Post', 'This should fail']
        );

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
      } finally {
        client.release();
      }

      // Assert - User should not exist due to rollback
      const user = await database.findUserByEmail('transaction@example.com');
      expect(user).toBeFalsy();
    });
  });
});

// Service integration tests
describe('Service Integration', () => {
  let userService;
  let emailService;
  let database;

  beforeAll(async () => {
    database = new TestDatabaseManager();
    await database.setup();

    // Create real services with test database
    emailService = new EmailService({
      apiKey: 'test-key',
      baseUrl: 'https://api.test-email.com'
    });

    userService = new UserService(database.pool, emailService);
  });

  afterAll(async () => {
    await database.cleanup();
  });

  beforeEach(async () => {
    await database.clearAllTables();
    jest.clearAllMocks();
  });

  it('should create user and send welcome email', async () => {
    // Arrange
    const userData = {
      email: 'integration@example.com',
      name: 'Integration User',
      age: 30
    };

    // Mock email service
    const sendEmailSpy = jest.spyOn(emailService, 'sendWelcomeEmail')
      .mockResolvedValue({ messageId: 'test-message-id' });

    // Act
    const user = await userService.createUser(userData);

    // Assert
    expect(user).toMatchObject({
      id: expect.any(Number),
      email: userData.email,
      name: userData.name
    });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      userData.email,
      userData.name
    );

    // Verify user exists in database
    const userInDb = await database.findUserById(user.id);
    expect(userInDb).toBeTruthy();
  });
});

// Example service classes for testing
class EmailService {
  constructor(config) {
    this.config = config;
  }

  async sendWelcomeEmail(email, name) {
    // Mock implementation
    return { messageId: `welcome-${Date.now()}` };
  }
}

class UserService {
  constructor(database, emailService) {
    this.database = database;
    this.emailService = emailService;
  }

  async createUser(userData) {
    const result = await this.database.query(
      'INSERT INTO users (email, name, age) VALUES ($1, $2, $3) RETURNING *',
      [userData.email, userData.name, userData.age]
    );

    const user = result.rows[0];

    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return user;
  }
}

module.exports = {
  TestDatabaseManager,
  EmailService,
  UserService
};
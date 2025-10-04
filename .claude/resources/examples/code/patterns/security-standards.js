// Security Standards Examples

// ===== Good: Input validation =====
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

function sanitizeString(input) {
  if (typeof input !== 'string') return '';

  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim()
    .substring(0, 1000); // Limit length
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===== Good: Environment-based configuration =====
const config = {
  databaseUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'API_KEY', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Required environment variable ${envVar} is not set`);
  }
}

// ===== Bad: Hardcoded secrets =====
const badConfig = {
  databaseUrl: 'postgresql://user:password@localhost:5432/db',
  apiKey: 'sk-1234567890abcdef',
  jwtSecret: 'my-secret-key'
};

// ===== Good: Parameterized queries =====
class UserRepository {
  async getUserByEmail(email) {
    // Safe: Using parameterized query
    const query = 'SELECT * FROM users WHERE email = $1';
    return await this.db.query(query, [email]);
  }

  async createUser(userData) {
    const query = `
      INSERT INTO users (email, name, created_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    return await this.db.query(query, [
      userData.email,
      userData.name,
      new Date()
    ]);
  }
}

// ===== Bad: SQL injection vulnerability =====
class UnsafeUserRepository {
  async getUserByEmail(email) {
    // Dangerous: SQL injection vulnerability
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    return await this.db.query(query);
  }
}

// ===== Good: Password handling =====
const bcrypt = require('bcrypt');

class AuthService {
  async hashPassword(plainPassword) {
    const saltRounds = 12;
    return await bcrypt.hash(plainPassword, saltRounds);
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async createUser(userData) {
    // Never store plain text passwords
    const hashedPassword = await this.hashPassword(userData.password);

    return await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
  }
}
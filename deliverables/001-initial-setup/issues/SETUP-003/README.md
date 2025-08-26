# SETUP-003: Configure Testing Framework

**Status**: 📋 Not Started  
**Type**: Setup Task  
**Priority**: P0 - Critical Foundation  
**Estimated Time**: 2-4 hours  
**Assignee**: Unassigned

## Overview

Establish a comprehensive testing framework that supports unit, integration, and end-to-end testing. This ensures code quality, prevents regressions, and enables confident refactoring throughout the project lifecycle.

## Objectives

- ✅ Install and configure testing framework
- ✅ Set up test directory structure
- ✅ Configure code coverage tools
- ✅ Create test utilities and helpers
- ✅ Establish testing patterns (TDD/BDD)
- ✅ Set up continuous testing workflow

## Acceptance Criteria

- [ ] Testing framework installed and configured
- [ ] Test directory structure follows best practices
- [ ] Code coverage reporting configured (target: 80%)
- [ ] Sample tests for each test type created
- [ ] Test utilities and fixtures available
- [ ] Tests run in CI/CD pipeline
- [ ] Testing documentation complete
- [ ] Test commands in package.json/Makefile

## Implementation Guide

### Step 1: Install Testing Dependencies

For **JavaScript/TypeScript** (Jest):

```bash
# Install Jest and related packages
npm install --save-dev \
  jest \
  @types/jest \
  ts-jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest-environment-jsdom \
  supertest \
  msw

# For coverage
npm install --save-dev \
  @vitest/coverage-c8 \
  @vitest/ui
```

For **Python** (pytest):

```bash
# Install pytest and plugins
pip install pytest \
  pytest-cov \
  pytest-mock \
  pytest-asyncio \
  pytest-env \
  pytest-xdist \
  factory-boy \
  faker

# Save to requirements-dev.txt
pip freeze > requirements-dev.txt
```

### Step 2: Configure Testing Framework

Create `jest.config.js`:

```javascript
module.exports = {
  // Test environment
  testEnvironment: 'node', // or 'jsdom' for frontend
  
  // File patterns
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  
  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Coverage configuration
  collectCoverage: false, // Enable with --coverage flag
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  
  // Performance
  maxWorkers: '50%',
  
  // Globals
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json'
    }
  }
};
```

Create `pytest.ini` for Python:

```ini
[tool.pytest.ini_options]
minversion = "7.0"
testpaths = ["tests"]
python_files = "test_*.py"
python_classes = "Test*"
python_functions = "test_*"
addopts = """
    -ra
    --strict-markers
    --cov=src
    --cov-report=term-missing
    --cov-report=html
    --cov-report=xml
    --cov-fail-under=80
    --maxfail=1
    --tb=short
    -v
"""
markers = [
    "unit: Unit tests",
    "integration: Integration tests",
    "e2e: End-to-end tests",
    "slow: Slow running tests",
    "smoke: Smoke tests"
]
env = [
    "ENVIRONMENT=test",
    "DATABASE_URL=sqlite:///:memory:"
]
```

### Step 3: Create Test Directory Structure

```bash
# Create test directories
mkdir -p tests/{unit,integration,e2e,fixtures,helpers,mocks}

# Create structure
tests/
├── unit/              # Unit tests
│   ├── components/    # Component tests
│   ├── services/      # Service tests
│   └── utils/        # Utility tests
├── integration/      # Integration tests
│   ├── api/         # API integration tests
│   └── database/    # Database tests
├── e2e/             # End-to-end tests
│   ├── flows/       # User flow tests
│   └── smoke/       # Smoke tests
├── fixtures/        # Test data
│   ├── users.json
│   └── products.json
├── helpers/         # Test utilities
│   ├── setup.js
│   └── teardown.js
└── mocks/          # Mock implementations
    ├── api.js
    └── database.js
```

### Step 4: Create Test Setup Files

Create `tests/setup.js`:

```javascript
// Global test setup
import '@testing-library/jest-dom';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Mock console methods in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Create test user
  createUser: (overrides = {}) => ({
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  }),
  
  // Create test database connection
  setupDatabase: async () => {
    // Setup test database
  },
  
  // Clean up after tests
  cleanup: async () => {
    // Cleanup logic
  }
};

// Setup before all tests
beforeAll(async () => {
  // Global setup
});

// Cleanup after all tests
afterAll(async () => {
  // Global cleanup
});

// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});
```

### Step 5: Create Sample Tests

Create `tests/unit/utils/validation.test.js`:

```javascript
// Unit test example
import { validateEmail, validatePassword } from '@/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name@example.co.uk')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('StrongP@ss123')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
    });
  });
});
```

Create `tests/integration/api/users.test.js`:

```javascript
// Integration test example
import request from 'supertest';
import app from '@/app';
import { setupDatabase, teardownDatabase } from '../../helpers/database';

describe('Users API Integration', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=10')
        .expect(200);

      expect(response.body.users.length).toBeLessThanOrEqual(10);
    });
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.user).toMatchObject({
        name: userData.name,
        email: userData.email
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });
});
```

Create `tests/e2e/flows/authentication.test.js`:

```javascript
// E2E test example
import puppeteer from 'puppeteer';

describe('Authentication Flow E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should complete login flow', async () => {
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    
    // Fill in credentials
    await page.type('#email', 'test@example.com');
    await page.type('#password', 'password123');
    
    // Submit form
    await page.click('#login-button');
    
    // Wait for navigation
    await page.waitForNavigation();
    
    // Verify redirect to dashboard
    expect(page.url()).toContain('/dashboard');
    
    // Verify user info displayed
    const userName = await page.$eval('.user-name', el => el.textContent);
    expect(userName).toBe('Test User');
  });

  it('should handle login errors', async () => {
    await page.goto('http://localhost:3000/login');
    
    // Submit with invalid credentials
    await page.type('#email', 'wrong@example.com');
    await page.type('#password', 'wrongpass');
    await page.click('#login-button');
    
    // Wait for error message
    await page.waitForSelector('.error-message');
    
    const errorText = await page.$eval('.error-message', el => el.textContent);
    expect(errorText).toContain('Invalid credentials');
  });
});
```

### Step 6: Create Test Utilities

Create `tests/helpers/factories.js`:

```javascript
// Test data factories
import { faker } from '@faker-js/faker';

export const userFactory = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  createdAt: faker.date.past(),
  ...overrides
});

export const productFactory = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
  description: faker.commerce.productDescription(),
  ...overrides
});

export const orderFactory = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
  items: [],
  total: faker.commerce.price(),
  status: faker.helpers.arrayElement(['pending', 'processing', 'completed']),
  ...overrides
});
```

### Step 7: Configure Coverage Reporting

Create `.nycrc.json` for coverage:

```json
{
  "all": true,
  "include": ["src/**/*.js"],
  "exclude": [
    "**/*.test.js",
    "**/*.spec.js",
    "**/node_modules/**",
    "**/coverage/**",
    "**/dist/**"
  ],
  "reporter": ["text", "lcov", "html"],
  "check-coverage": true,
  "branches": 80,
  "lines": 80,
  "functions": 80,
  "statements": 80
}
```

### Step 8: Add Test Scripts

Update `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:debug": "node --inspect-brk ./node_modules/.bin/jest --runInBand"
  }
}
```

## Verification Steps

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Watch mode
npm run test:watch

# Verify coverage report
open coverage/lcov-report/index.html

# Run in CI mode
npm run test:ci
```

## Common Issues & Solutions

### Issue: Tests timing out
```javascript
// Increase timeout for slow tests
jest.setTimeout(10000); // 10 seconds

// Or per test
it('slow test', async () => {
  // test code
}, 10000);
```

### Issue: Module resolution errors
```javascript
// Update jest.config.js moduleNameMapper
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
```

### Issue: Coverage not meeting threshold
```bash
# Find uncovered code
npm run test:coverage
# Check coverage/lcov-report/index.html for details
```

## AI Agent Instructions

When completing this task:

1. Choose appropriate testing framework for tech stack
2. Ensure all test types are configured
3. Create meaningful sample tests
4. Set realistic coverage thresholds
5. Document testing patterns used
6. Verify tests run in CI environment

## Definition of Done

- [ ] Testing framework installed and configured
- [ ] Test directory structure created
- [ ] Coverage reporting configured
- [ ] Sample tests for unit/integration/e2e created
- [ ] Test utilities and helpers implemented
- [ ] Test scripts added to package.json
- [ ] Coverage threshold set (minimum 80%)
- [ ] Tests passing locally
- [ ] Documentation complete
- [ ] Team reviewed testing approach

## Related Issues

- Previous: [SETUP-002](../SETUP-002/README.md) - Development Environment
- Next: [SETUP-004](../SETUP-004/README.md) - Linting & Code Quality
- Related: [SETUP-007](../SETUP-007/README.md) - CI/CD Pipeline

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Test Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
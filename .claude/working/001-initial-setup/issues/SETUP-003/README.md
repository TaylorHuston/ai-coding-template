# SETUP-003: Testing Framework Implementation

## Quick Start

1. Install dependencies:
   ```bash
   npm run test:setup
   # or manually: npm install --save-dev jest @types/jest ts-jest
   ```

2. Run tests:
   ```bash
   npm test
   npm run test:coverage
   ```

## Implementation

### JavaScript/TypeScript Setup

Install dependencies:
```bash
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
```

Create `jest.config.js`:
```javascript
module.exports = {
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

### Python Setup

Install dependencies:
```bash
pip install pytest \
  pytest-cov \
  pytest-mock \
  pytest-asyncio \
  pytest-env \
  pytest-xdist \
  factory-boy \
  faker
```

Create `pytest.ini`:
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

### Test Directory Structure

Create directories:
```bash
mkdir -p tests/{unit,integration,e2e,fixtures,helpers,mocks}
```

Structure:
```
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
├── helpers/         # Test utilities
└── mocks/          # Mock implementations
```

### Test Setup Files

Create `tests/setup.js`:
```javascript
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
  createUser: (overrides = {}) => ({
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  }),
  
  setupDatabase: async () => {
    // Setup test database
  },
  
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

### Sample Tests

**Unit Test** - `tests/unit/utils/validation.test.js`:
```javascript
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
});
```

**Integration Test** - `tests/integration/api/users.test.js`:
```javascript
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
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: process.env.TEST_PASSWORD
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
  });
});
```

**E2E Test** - `tests/e2e/flows/authentication.test.js`:
```javascript
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
});
```

### Test Factories

Create `tests/helpers/factories.js`:
```javascript
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
```

### Package Scripts

Add to `package.json`:
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

## Testing

### Verify Setup

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

## Troubleshooting

### Tests Timing Out

```javascript
// Increase timeout for slow tests
jest.setTimeout(10000); // 10 seconds

// Or per test
it('slow test', async () => {
  // test code
}, 10000);
```

### Module Resolution Errors

```javascript
// Update jest.config.js moduleNameMapper
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
```

### Coverage Not Meeting Threshold

```bash
# Find uncovered code
npm run test:coverage
# Check coverage/lcov-report/index.html for details
```

### Database Test Issues

```javascript
// Setup test database in beforeAll
beforeAll(async () => {
  await testUtils.setupDatabase();
});

// Clean up in afterAll
afterAll(async () => {
  await testUtils.cleanup();
});
```
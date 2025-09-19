/**
 * Performance Testing Examples
 *
 * Comprehensive examples for performance testing including
 * load testing, benchmark testing, and performance monitoring
 *
 * Features:
 * - Load testing with k6
 * - Performance benchmarks
 * - Memory usage testing
 * - Database performance testing
 * - API response time testing
 * - Stress testing scenarios
 */

// k6 Load Testing Scripts
// File: load-test-api.js (for k6)
const k6LoadTestExample = `
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTimeCheck = new Trend('response_time_check');

// Test configuration
export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate must be below 10%
    errors: ['rate<0.1'],
  },
};

// Test data
const users = [
  { email: 'user1@example.com', password: 'password123' },
  { email: 'user2@example.com', password: 'password123' },
  { email: 'user3@example.com', password: 'password123' },
];

export default function() {
  // Select random user
  const user = users[Math.floor(Math.random() * users.length)];

  // Login
  const loginResponse = http.post('http://api.example.com/auth/login', {
    email: user.email,
    password: user.password,
  });

  const loginCheck = check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 300ms': (r) => r.timings.duration < 300,
    'has auth token': (r) => r.json('token') !== undefined,
  });

  errorRate.add(!loginCheck);

  if (loginCheck) {
    const token = loginResponse.json('token');

    // Get user profile
    const profileResponse = http.get('http://api.example.com/profile', {
      headers: { Authorization: \`Bearer \${token}\` },
    });

    const profileCheck = check(profileResponse, {
      'profile status is 200': (r) => r.status === 200,
      'profile response time < 200ms': (r) => r.timings.duration < 200,
    });

    errorRate.add(!profileCheck);
    responseTimeCheck.add(profileResponse.timings.duration);

    // Create a post
    const postData = {
      title: \`Test Post \${Math.random()}\`,
      content: 'This is a test post for load testing',
    };

    const postResponse = http.post('http://api.example.com/posts', postData, {
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
    });

    check(postResponse, {
      'post creation status is 201': (r) => r.status === 201,
      'post creation response time < 400ms': (r) => r.timings.duration < 400,
    });

    // Get posts list
    const postsResponse = http.get('http://api.example.com/posts?limit=20', {
      headers: { Authorization: \`Bearer \${token}\` },
    });

    check(postsResponse, {
      'posts list status is 200': (r) => r.status === 200,
      'posts list response time < 300ms': (r) => r.timings.duration < 300,
      'posts list has data': (r) => r.json('data').length > 0,
    });
  }

  sleep(1); // Wait 1 second between iterations
}

// Teardown function
export function teardown(data) {
  console.log('Load test completed');
}
`;

// Node.js Performance Testing Examples
const { performance } = require('perf_hooks');

// Performance benchmark utility
class PerformanceBenchmark {
  constructor(name) {
    this.name = name;
    this.measurements = [];
  }

  async measure(fn, iterations = 1) {
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      this.measurements.push(end - start);
    }
  }

  getStats() {
    const sorted = this.measurements.sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      name: this.name,
      iterations: this.measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: sum / sorted.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  report() {
    const stats = this.getStats();
    console.log(`\\n=== ${stats.name} Benchmark ===`);
    console.log(`Iterations: ${stats.iterations}`);
    console.log(`Min: ${stats.min.toFixed(2)}ms`);
    console.log(`Max: ${stats.max.toFixed(2)}ms`);
    console.log(`Mean: ${stats.mean.toFixed(2)}ms`);
    console.log(`Median: ${stats.median.toFixed(2)}ms`);
    console.log(`95th percentile: ${stats.p95.toFixed(2)}ms`);
    console.log(`99th percentile: ${stats.p99.toFixed(2)}ms`);
  }
}

// Database Performance Testing
class DatabasePerformanceTest {
  constructor(database) {
    this.database = database;
  }

  async testInsertPerformance(recordCount = 1000) {
    const benchmark = new PerformanceBenchmark(`Insert ${recordCount} records`);

    await benchmark.measure(async () => {
      const promises = [];
      for (let i = 0; i < recordCount; i++) {
        promises.push(
          this.database.query(
            'INSERT INTO test_table (name, email, age) VALUES ($1, $2, $3)',
            [`User ${i}`, `user${i}@example.com`, 20 + (i % 50)]
          )
        );
      }
      await Promise.all(promises);
    });

    return benchmark.getStats();
  }

  async testSelectPerformance() {
    const benchmark = new PerformanceBenchmark('Select with complex query');

    await benchmark.measure(async () => {
      await this.database.query(`
        SELECT u.*, p.title, p.content
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id
        WHERE u.age > 25
        ORDER BY u.created_at DESC
        LIMIT 100
      `);
    }, 100); // Run 100 times

    return benchmark.getStats();
  }

  async testUpdatePerformance() {
    const benchmark = new PerformanceBenchmark('Bulk update');

    await benchmark.measure(async () => {
      await this.database.query(`
        UPDATE users
        SET last_login = NOW()
        WHERE age > 30
      `);
    }, 50);

    return benchmark.getStats();
  }

  async testIndexPerformance() {
    // Test query performance with and without index
    const withoutIndex = new PerformanceBenchmark('Query without index');
    const withIndex = new PerformanceBenchmark('Query with index');

    // Drop index
    await this.database.query('DROP INDEX IF EXISTS idx_users_email');

    await withoutIndex.measure(async () => {
      await this.database.query('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    }, 100);

    // Create index
    await this.database.query('CREATE INDEX idx_users_email ON users(email)');

    await withIndex.measure(async () => {
      await this.database.query('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    }, 100);

    return {
      withoutIndex: withoutIndex.getStats(),
      withIndex: withIndex.getStats()
    };
  }
}

// API Performance Testing
class ApiPerformanceTest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.authToken = null;
  }

  async authenticate() {
    const start = performance.now();
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    this.authToken = data.token;
    const end = performance.now();

    return { duration: end - start, success: response.ok };
  }

  async testEndpointPerformance(endpoint, method = 'GET', body = null) {
    const benchmark = new PerformanceBenchmark(`${method} ${endpoint}`);

    await benchmark.measure(async () => {
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      await response.json();
    }, 50);

    return benchmark.getStats();
  }

  async testConcurrentRequests(endpoint, concurrency = 10) {
    const benchmark = new PerformanceBenchmark(`${concurrency} concurrent requests to ${endpoint}`);

    await benchmark.measure(async () => {
      const promises = Array(concurrency).fill().map(() =>
        fetch(`${this.baseUrl}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        })
      );

      const responses = await Promise.all(promises);
      const failedRequests = responses.filter(r => !r.ok).length;

      if (failedRequests > 0) {
        throw new Error(`${failedRequests} out of ${concurrency} requests failed`);
      }
    }, 10);

    return benchmark.getStats();
  }
}

// Memory Usage Testing
class MemoryUsageTest {
  constructor() {
    this.initialMemory = process.memoryUsage();
  }

  getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: usage.rss / 1024 / 1024, // MB
      heapTotal: usage.heapTotal / 1024 / 1024, // MB
      heapUsed: usage.heapUsed / 1024 / 1024, // MB
      external: usage.external / 1024 / 1024, // MB
    };
  }

  async testMemoryLeak(fn, iterations = 1000) {
    const measurements = [];

    for (let i = 0; i < iterations; i++) {
      await fn();

      if (i % 100 === 0) {
        global.gc && global.gc(); // Force garbage collection if available
        measurements.push({
          iteration: i,
          memory: this.getMemoryUsage()
        });
      }
    }

    return this.analyzeMemoryTrend(measurements);
  }

  analyzeMemoryTrend(measurements) {
    const heapUsedValues = measurements.map(m => m.memory.heapUsed);
    const firstValue = heapUsedValues[0];
    const lastValue = heapUsedValues[heapUsedValues.length - 1];
    const growthRate = (lastValue - firstValue) / firstValue;

    return {
      measurements,
      memoryGrowth: {
        initial: firstValue,
        final: lastValue,
        growth: lastValue - firstValue,
        growthRate: growthRate * 100 // percentage
      },
      potentialLeak: growthRate > 0.1 // 10% growth threshold
    };
  }
}

// Performance Test Examples
describe('Performance Tests', () => {
  let apiTest;
  let memoryTest;

  beforeAll(async () => {
    apiTest = new ApiPerformanceTest('http://localhost:3000/api');
    memoryTest = new MemoryUsageTest();
    await apiTest.authenticate();
  });

  describe('Algorithm Performance', () => {
    it('should process large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: Math.random(),
        name: `Item ${i}`
      }));

      const benchmark = new PerformanceBenchmark('Large dataset processing');

      await benchmark.measure(() => {
        // Simulate data processing
        const result = largeDataset
          .filter(item => item.value > 0.5)
          .map(item => ({ ...item, processed: true }))
          .sort((a, b) => b.value - a.value);

        return result;
      }, 10);

      const stats = benchmark.getStats();
      expect(stats.mean).toBeLessThan(100); // Should complete in under 100ms on average

      benchmark.report();
    });

    it('should handle recursive operations efficiently', async () => {
      const benchmark = new PerformanceBenchmark('Fibonacci calculation');

      // Test memoized vs non-memoized fibonacci
      const fibMemo = createMemoizedFib();

      await benchmark.measure(() => {
        fibMemo(30); // This should be fast with memoization
      }, 100);

      const stats = benchmark.getStats();
      expect(stats.p95).toBeLessThan(1); // 95% should complete in under 1ms

      benchmark.report();
    });
  });

  describe('API Performance', () => {
    it('should respond to GET requests quickly', async () => {
      const stats = await apiTest.testEndpointPerformance('/users');

      expect(stats.p95).toBeLessThan(200); // 95% of requests under 200ms
      expect(stats.mean).toBeLessThan(100); // Average under 100ms

      console.log('API Performance Stats:', stats);
    });

    it('should handle concurrent requests', async () => {
      const stats = await apiTest.testConcurrentRequests('/posts', 20);

      expect(stats.p95).toBeLessThan(1000); // 95% complete within 1 second
      console.log('Concurrent Request Stats:', stats);
    });

    it('should handle POST requests efficiently', async () => {
      const postData = {
        title: 'Performance Test Post',
        content: 'This is a test post for performance testing'
      };

      const stats = await apiTest.testEndpointPerformance('/posts', 'POST', postData);

      expect(stats.p95).toBeLessThan(300); // 95% under 300ms
      console.log('POST Request Stats:', stats);
    });
  });

  describe('Memory Performance', () => {
    it('should not have memory leaks in data processing', async () => {
      const result = await memoryTest.testMemoryLeak(async () => {
        // Simulate data processing that might leak memory
        const data = Array.from({ length: 1000 }, () => ({
          value: Math.random(),
          timestamp: new Date(),
          buffer: Buffer.alloc(1024) // 1KB buffer
        }));

        // Process and clear
        data.forEach(item => {
          item.processed = item.value > 0.5;
        });

        // Clear references
        data.length = 0;
      }, 500);

      console.log('Memory Usage Analysis:', result.memoryGrowth);
      expect(result.potentialLeak).toBe(false);
    });

    it('should efficiently handle string operations', async () => {
      const benchmark = new PerformanceBenchmark('String concatenation');

      await benchmark.measure(() => {
        // Test different string concatenation methods
        const iterations = 10000;

        // Array join method (efficient)
        const parts = [];
        for (let i = 0; i < iterations; i++) {
          parts.push(`string ${i}`);
        }
        const result = parts.join(' ');
        return result;
      }, 10);

      const stats = benchmark.getStats();
      expect(stats.mean).toBeLessThan(50); // Should be fast

      benchmark.report();
    });
  });

  describe('Database Performance', () => {
    it('should handle bulk operations efficiently', async () => {
      // Mock database for testing
      const mockDb = {
        query: jest.fn().mockResolvedValue({ rows: [] })
      };

      const dbTest = new DatabasePerformanceTest(mockDb);
      const stats = await dbTest.testInsertPerformance(100);

      expect(stats.mean).toBeLessThan(1000); // Bulk insert under 1 second
      console.log('Database Insert Stats:', stats);
    });
  });
});

// Stress Testing Example
describe('Stress Tests', () => {
  it('should handle extreme load gracefully', async () => {
    const stressTest = async () => {
      // Simulate extreme conditions
      const promises = Array.from({ length: 1000 }, async (_, i) => {
        // Heavy computation
        let result = 0;
        for (let j = 0; j < 10000; j++) {
          result += Math.sqrt(j);
        }
        return result;
      });

      const results = await Promise.all(promises);
      return results.length;
    };

    const benchmark = new PerformanceBenchmark('Stress test');
    await benchmark.measure(stressTest);

    const stats = benchmark.getStats();
    expect(stats.mean).toBeLessThan(5000); // Should complete within 5 seconds

    benchmark.report();
  });
});

// Helper functions
function createMemoizedFib() {
  const cache = new Map();

  function fib(n) {
    if (n <= 1) return n;
    if (cache.has(n)) return cache.get(n);

    const result = fib(n - 1) + fib(n - 2);
    cache.set(n, result);
    return result;
  }

  return fib;
}

// Export the performance testing utilities
module.exports = {
  PerformanceBenchmark,
  DatabasePerformanceTest,
  ApiPerformanceTest,
  MemoryUsageTest,
  k6LoadTestExample,
  createMemoizedFib
};
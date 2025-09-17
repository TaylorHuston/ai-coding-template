/**
 * Circuit Breaker Pattern Implementation
 *
 * Provides fault tolerance and resilience when calling external services.
 * Prevents cascading failures by temporarily disabling calls to failing services.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Failing fast, requests are immediately rejected
 * - HALF_OPEN: Testing if service has recovered
 */

const EventEmitter = require('events');

// Circuit breaker states
const STATES = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN'
};

class CircuitBreaker extends EventEmitter {
  constructor(serviceCall, options = {}) {
    super();

    this.serviceCall = serviceCall;
    this.state = STATES.CLOSED;

    // Configuration options
    this.options = {
      threshold: options.threshold || 5,           // Failure threshold to open circuit
      timeout: options.timeout || 60000,          // Timeout before attempting reset (ms)
      resetTimeout: options.resetTimeout || 30000, // Timeout for individual requests (ms)
      monitor: options.monitor || false,           // Enable monitoring/logging
      ...options
    };

    // State tracking
    this.failures = 0;
    this.successes = 0;
    this.requests = 0;
    this.nextAttempt = Date.now();

    // Metrics for monitoring
    this.metrics = {
      totalRequests: 0,
      totalFailures: 0,
      totalSuccesses: 0,
      circuitOpened: 0,
      lastFailureTime: null,
      lastSuccessTime: null
    };
  }

  /**
   * Execute the service call through the circuit breaker
   */
  async call(...args) {
    this.requests++;
    this.metrics.totalRequests++;

    // Check circuit state and handle accordingly
    if (this.state === STATES.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = STATES.HALF_OPEN;
        this.emit('halfOpen');
        if (this.options.monitor) {
          console.log(`[CircuitBreaker] Transitioning to HALF_OPEN state`);
        }
      } else {
        const error = new Error('Circuit breaker is OPEN');
        error.code = 'CIRCUIT_BREAKER_OPEN';
        this.emit('reject', error);
        throw error;
      }
    }

    try {
      // Execute the service call with timeout
      const result = await this.executeWithTimeout(...args);
      return this.onSuccess(result);
    } catch (error) {
      return this.onFailure(error);
    }
  }

  /**
   * Execute service call with timeout protection
   */
  async executeWithTimeout(...args) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const timeoutError = new Error(`Service call timeout after ${this.options.resetTimeout}ms`);
        timeoutError.code = 'TIMEOUT';
        reject(timeoutError);
      }, this.options.resetTimeout);

      this.serviceCall(...args)
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Handle successful service call
   */
  onSuccess(result) {
    this.failures = 0;
    this.successes++;
    this.metrics.totalSuccesses++;
    this.metrics.lastSuccessTime = new Date();

    if (this.state === STATES.HALF_OPEN) {
      this.state = STATES.CLOSED;
      this.emit('close');
      if (this.options.monitor) {
        console.log(`[CircuitBreaker] Circuit CLOSED after successful call`);
      }
    }

    this.emit('success', result);
    return result;
  }

  /**
   * Handle failed service call
   */
  onFailure(error) {
    this.failures++;
    this.metrics.totalFailures++;
    this.metrics.lastFailureTime = new Date();

    this.emit('failure', error);

    if (this.state === STATES.HALF_OPEN) {
      this.state = STATES.OPEN;
      this.nextAttempt = Date.now() + this.options.timeout;
      this.emit('open', error);
      if (this.options.monitor) {
        console.log(`[CircuitBreaker] Circuit OPEN after failed half-open attempt`);
      }
    } else if (this.failures >= this.options.threshold) {
      this.state = STATES.OPEN;
      this.nextAttempt = Date.now() + this.options.timeout;
      this.metrics.circuitOpened++;
      this.emit('open', error);
      if (this.options.monitor) {
        console.log(`[CircuitBreaker] Circuit OPEN after ${this.failures} failures`);
      }
    }

    throw error;
  }

  /**
   * Check if we should attempt to reset the circuit
   */
  shouldAttemptReset() {
    return Date.now() >= this.nextAttempt;
  }

  /**
   * Get current circuit breaker status
   */
  getStatus() {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      requests: this.requests,
      nextAttempt: new Date(this.nextAttempt),
      metrics: { ...this.metrics }
    };
  }

  /**
   * Force circuit to specific state (for testing)
   */
  forceState(state) {
    this.state = state;
    if (state === STATES.OPEN) {
      this.nextAttempt = Date.now() + this.options.timeout;
    }
  }

  /**
   * Reset circuit breaker to initial state
   */
  reset() {
    this.state = STATES.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.nextAttempt = Date.now();
    this.emit('reset');
  }
}

/**
 * Circuit Breaker Factory for common service patterns
 */
class CircuitBreakerFactory {
  static createHttpCircuitBreaker(httpClient, options = {}) {
    const defaultOptions = {
      threshold: 5,
      timeout: 60000,
      resetTimeout: 10000,
      monitor: true
    };

    return new CircuitBreaker(
      async (url, config) => {
        const response = await httpClient(url, config);

        // Consider 4xx and 5xx as failures
        if (response.status >= 400) {
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          error.status = response.status;
          error.response = response;
          throw error;
        }

        return response;
      },
      { ...defaultOptions, ...options }
    );
  }

  static createDatabaseCircuitBreaker(dbConnection, options = {}) {
    const defaultOptions = {
      threshold: 3,
      timeout: 30000,
      resetTimeout: 5000,
      monitor: true
    };

    return new CircuitBreaker(
      async (query, params) => {
        return await dbConnection.query(query, params);
      },
      { ...defaultOptions, ...options }
    );
  }

  static createServiceCircuitBreaker(serviceFunction, options = {}) {
    const defaultOptions = {
      threshold: 5,
      timeout: 60000,
      resetTimeout: 15000,
      monitor: true
    };

    return new CircuitBreaker(serviceFunction, { ...defaultOptions, ...options });
  }
}

/**
 * Example Usage Patterns
 */

// Example 1: HTTP Service Circuit Breaker
async function exampleHttpCircuitBreaker() {
  const axios = require('axios'); // Assuming axios is available

  const httpBreaker = CircuitBreakerFactory.createHttpCircuitBreaker(
    axios.get,
    {
      threshold: 3,
      timeout: 30000,
      monitor: true
    }
  );

  // Add event listeners for monitoring
  httpBreaker.on('open', () => console.log('HTTP Circuit breaker opened'));
  httpBreaker.on('close', () => console.log('HTTP Circuit breaker closed'));
  httpBreaker.on('halfOpen', () => console.log('HTTP Circuit breaker half-open'));

  try {
    const response = await httpBreaker.call('https://api.example.com/data');
    console.log('HTTP call successful:', response.data);
  } catch (error) {
    if (error.code === 'CIRCUIT_BREAKER_OPEN') {
      console.log('Circuit breaker prevented call');
    } else {
      console.log('Service call failed:', error.message);
    }
  }
}

// Example 2: Database Circuit Breaker
async function exampleDatabaseCircuitBreaker() {
  // Mock database connection
  const mockDb = {
    query: async (sql, params) => {
      // Simulate occasional database failures
      if (Math.random() < 0.3) {
        throw new Error('Database connection timeout');
      }
      return { rows: [{ id: 1, name: 'test' }] };
    }
  };

  const dbBreaker = CircuitBreakerFactory.createDatabaseCircuitBreaker(mockDb);

  try {
    const result = await dbBreaker.call('SELECT * FROM users WHERE id = ?', [1]);
    console.log('Database query successful:', result);
  } catch (error) {
    console.log('Database query failed:', error.message);
  }
}

// Example 3: Custom Service Circuit Breaker
async function exampleCustomServiceCircuitBreaker() {
  // Mock external service
  const externalService = async (userId) => {
    // Simulate service failures
    if (Math.random() < 0.4) {
      throw new Error('External service unavailable');
    }
    return { userId, profile: { name: 'John Doe', email: 'john@example.com' } };
  };

  const serviceBreaker = new CircuitBreaker(externalService, {
    threshold: 2,
    timeout: 20000,
    monitor: true
  });

  // Monitor circuit breaker events
  serviceBreaker.on('failure', (error) => {
    console.log(`Service failure: ${error.message}`);
  });

  serviceBreaker.on('open', () => {
    console.log('Circuit opened - failing fast for 20 seconds');
  });

  try {
    const userProfile = await serviceBreaker.call(123);
    console.log('User profile retrieved:', userProfile);
  } catch (error) {
    console.log('Failed to get user profile:', error.message);
  }
}

/**
 * Advanced Circuit Breaker with Retry Logic
 */
class RetryCircuitBreaker extends CircuitBreaker {
  constructor(serviceCall, options = {}) {
    super(serviceCall, options);
    this.retryOptions = {
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000,
      exponentialBackoff: options.exponentialBackoff || true,
      ...options.retry
    };
  }

  async call(...args) {
    let lastError;
    let retryCount = 0;

    while (retryCount <= this.retryOptions.maxRetries) {
      try {
        return await super.call(...args);
      } catch (error) {
        lastError = error;

        if (error.code === 'CIRCUIT_BREAKER_OPEN' || retryCount >= this.retryOptions.maxRetries) {
          throw error;
        }

        // Calculate retry delay with exponential backoff
        const delay = this.retryOptions.exponentialBackoff
          ? this.retryOptions.retryDelay * Math.pow(2, retryCount)
          : this.retryOptions.retryDelay;

        await this.sleep(delay);
        retryCount++;

        if (this.options.monitor) {
          console.log(`[RetryCircuitBreaker] Retry ${retryCount}/${this.retryOptions.maxRetries} after ${delay}ms`);
        }
      }
    }

    throw lastError;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Example usage with retry
async function exampleRetryCircuitBreaker() {
  const flakyService = async (data) => {
    if (Math.random() < 0.7) {
      throw new Error('Service temporarily unavailable');
    }
    return { success: true, data };
  };

  const retryBreaker = new RetryCircuitBreaker(flakyService, {
    threshold: 5,
    timeout: 60000,
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
    monitor: true
  });

  try {
    const result = await retryBreaker.call({ message: 'test' });
    console.log('Service call with retry successful:', result);
  } catch (error) {
    console.log('Service call failed after retries:', error.message);
  }
}

module.exports = {
  CircuitBreaker,
  CircuitBreakerFactory,
  RetryCircuitBreaker,
  STATES,
  exampleHttpCircuitBreaker,
  exampleDatabaseCircuitBreaker,
  exampleCustomServiceCircuitBreaker,
  exampleRetryCircuitBreaker
};
// Testable Code Examples

// ===== Good: Testable code with dependency injection =====
class OrderProcessor {
  constructor(paymentService, emailService, logger) {
    this.paymentService = paymentService;
    this.emailService = emailService;
    this.logger = logger;
  }

  async processOrder(order) {
    // Pure logic that's easy to test
    const validation = this.validateOrder(order);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    // Dependency-injected services (easy to mock)
    const payment = await this.paymentService.charge(order.total);
    await this.emailService.sendConfirmation(order.customerEmail);

    this.logger.info('Order processed successfully', {
      orderId: order.id,
      paymentId: payment.id
    });

    return { orderId: order.id, paymentId: payment.id };
  }

  // Pure function - easy to test
  validateOrder(order) {
    if (!order.items || order.items.length === 0) {
      return { valid: false, error: 'Order must contain items' };
    }

    if (!order.customerEmail || !this.isValidEmail(order.customerEmail)) {
      return { valid: false, error: 'Valid customer email required' };
    }

    if (!order.total || order.total <= 0) {
      return { valid: false, error: 'Order total must be greater than 0' };
    }

    return { valid: true };
  }

  // Pure utility function
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// ===== Good: AI-friendly patterns =====

/**
 * Processes user authentication with retry logic
 *
 * This function implements exponential backoff for failed
 * authentication attempts to prevent overwhelming the auth service
 */
class AuthenticationService {
  constructor(authService) {
    this.authService = authService;
  }

  async authenticateUserWithRetry(credentials, maxAttempts = 3) {
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        return await this.authService.authenticate(credentials);
      } catch (error) {
        attempt++;

        if (attempt >= maxAttempts) {
          throw new AuthenticationError('Max authentication attempts exceeded');
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = 1000 * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ===== Example test file for the above =====
/*
// order-processor.test.js
const { OrderProcessor } = require('./order-processor');
const { ValidationError } = require('./errors');

describe('OrderProcessor', () => {
  let orderProcessor;
  let mockPaymentService;
  let mockEmailService;
  let mockLogger;

  beforeEach(() => {
    mockPaymentService = {
      charge: jest.fn()
    };
    mockEmailService = {
      sendConfirmation: jest.fn()
    };
    mockLogger = {
      info: jest.fn()
    };

    orderProcessor = new OrderProcessor(
      mockPaymentService,
      mockEmailService,
      mockLogger
    );
  });

  describe('validateOrder', () => {
    it('should return valid for a complete order', () => {
      const order = {
        items: [{ id: 1, name: 'Test Item' }],
        customerEmail: 'test@example.com',
        total: 100
      };

      const result = orderProcessor.validateOrder(order);
      expect(result.valid).toBe(true);
    });

    it('should return invalid for order without items', () => {
      const order = {
        items: [],
        customerEmail: 'test@example.com',
        total: 100
      };

      const result = orderProcessor.validateOrder(order);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Order must contain items');
    });
  });
});
*/
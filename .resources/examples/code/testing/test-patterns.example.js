/**
 * Test Patterns and Organization Examples
 *
 * Comprehensive examples of testing patterns, data management,
 * and test organization strategies
 *
 * Features:
 * - Builder pattern for test data
 * - Factory functions
 * - Property-based testing
 * - Test-driven development patterns
 * - Behavior-driven development patterns
 * - Custom matchers and assertions
 */

const fc = require('fast-check');

// Builder Pattern for Test Data
class UserBuilder {
  constructor() {
    this.userData = {
      id: 1,
      email: 'default@example.com',
      name: 'Default User',
      age: 25,
      isActive: true,
      role: 'user',
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en'
      },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };
  }

  withId(id) {
    this.userData.id = id;
    return this;
  }

  withEmail(email) {
    this.userData.email = email;
    return this;
  }

  withName(name) {
    this.userData.name = name;
    return this;
  }

  withAge(age) {
    this.userData.age = age;
    return this;
  }

  withRole(role) {
    this.userData.role = role;
    return this;
  }

  asAdmin() {
    this.userData.role = 'admin';
    return this;
  }

  asInactive() {
    this.userData.isActive = false;
    return this;
  }

  withPreferences(preferences) {
    this.userData.preferences = { ...this.userData.preferences, ...preferences };
    return this;
  }

  withDarkTheme() {
    this.userData.preferences.theme = 'dark';
    return this;
  }

  createdDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    this.userData.createdAt = date;
    return this;
  }

  updatedDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    this.userData.updatedAt = date;
    return this;
  }

  build() {
    return { ...this.userData };
  }
}

// Product Builder for E-commerce scenarios
class ProductBuilder {
  constructor() {
    this.productData = {
      id: 1,
      name: 'Default Product',
      description: 'A default product for testing',
      price: 99.99,
      currency: 'USD',
      category: 'electronics',
      inStock: true,
      quantity: 100,
      sku: 'DEFAULT-001',
      tags: ['default', 'test'],
      ratings: {
        average: 4.5,
        count: 10
      },
      images: ['https://example.com/image1.jpg']
    };
  }

  withName(name) {
    this.productData.name = name;
    return this;
  }

  withPrice(price, currency = 'USD') {
    this.productData.price = price;
    this.productData.currency = currency;
    return this;
  }

  inCategory(category) {
    this.productData.category = category;
    return this;
  }

  outOfStock() {
    this.productData.inStock = false;
    this.productData.quantity = 0;
    return this;
  }

  withQuantity(quantity) {
    this.productData.quantity = quantity;
    this.productData.inStock = quantity > 0;
    return this;
  }

  withRating(average, count = 1) {
    this.productData.ratings = { average, count };
    return this;
  }

  withTags(...tags) {
    this.productData.tags = tags;
    return this;
  }

  build() {
    return { ...this.productData };
  }
}

// Factory Functions
const createTestUser = (overrides = {}) => {
  return new UserBuilder().build({ ...overrides });
};

const createAdminUser = (overrides = {}) => {
  return new UserBuilder().asAdmin().build({ ...overrides });
};

const createInactiveUser = (overrides = {}) => {
  return new UserBuilder().asInactive().build({ ...overrides });
};

const createTestProduct = (overrides = {}) => {
  return new ProductBuilder().build({ ...overrides });
};

// Usage examples in tests
describe('UserBuilder Pattern', () => {
  it('should create user with default values', () => {
    const user = new UserBuilder().build();

    expect(user).toMatchObject({
      email: 'default@example.com',
      name: 'Default User',
      age: 25,
      isActive: true,
      role: 'user'
    });
  });

  it('should allow method chaining for complex scenarios', () => {
    const user = new UserBuilder()
      .withEmail('admin@company.com')
      .withName('System Admin')
      .asAdmin()
      .withDarkTheme()
      .createdDaysAgo(30)
      .build();

    expect(user).toMatchObject({
      email: 'admin@company.com',
      name: 'System Admin',
      role: 'admin',
      preferences: expect.objectContaining({
        theme: 'dark'
      })
    });

    const daysDiff = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    expect(daysDiff).toBeCloseTo(30, 0);
  });

  it('should handle edge cases with builders', () => {
    const youngUser = new UserBuilder()
      .withAge(16)
      .build();

    const seniorUser = new UserBuilder()
      .withAge(65)
      .createdDaysAgo(365 * 5) // 5 years ago
      .build();

    expect(youngUser.age).toBe(16);
    expect(seniorUser.age).toBe(65);
  });
});

// Property-Based Testing Examples
describe('Array utilities with property-based testing', () => {
  it('should maintain array length when shuffling', () => {
    fc.assert(fc.property(
      fc.array(fc.integer()),
      (arr) => {
        const shuffled = shuffleArray([...arr]);
        return shuffled.length === arr.length;
      }
    ));
  });

  it('should contain same elements when shuffling', () => {
    fc.assert(fc.property(
      fc.array(fc.integer()),
      (arr) => {
        const shuffled = shuffleArray([...arr]);
        const sorted1 = [...arr].sort();
        const sorted2 = [...shuffled].sort();
        return JSON.stringify(sorted1) === JSON.stringify(sorted2);
      }
    ));
  });

  it('should handle empty arrays', () => {
    fc.assert(fc.property(
      fc.constant([]),
      (arr) => {
        const shuffled = shuffleArray([...arr]);
        return shuffled.length === 0;
      }
    ));
  });

  it('should handle single element arrays', () => {
    fc.assert(fc.property(
      fc.array(fc.integer(), { minLength: 1, maxLength: 1 }),
      (arr) => {
        const shuffled = shuffleArray([...arr]);
        return shuffled.length === 1 && shuffled[0] === arr[0];
      }
    ));
  });
});

// Price calculation property tests
describe('Price Calculator Properties', () => {
  it('should never return negative total', () => {
    fc.assert(fc.property(
      fc.array(fc.record({
        price: fc.float({ min: 0, max: 1000 }),
        quantity: fc.integer({ min: 0, max: 100 })
      })),
      fc.float({ min: 0, max: 0.5 }), // tax rate
      (items, taxRate) => {
        const calculator = new PriceCalculator();
        const result = calculator.calculateTotal(items, taxRate);
        return result.total >= 0;
      }
    ));
  });

  it('should have tax less than or equal to total', () => {
    fc.assert(fc.property(
      fc.array(fc.record({
        price: fc.float({ min: 0, max: 1000 }),
        quantity: fc.integer({ min: 0, max: 100 })
      })),
      fc.float({ min: 0, max: 0.5 }),
      (items, taxRate) => {
        const calculator = new PriceCalculator();
        const result = calculator.calculateTotal(items, taxRate);
        return result.tax <= result.total;
      }
    ));
  });

  it('should satisfy: total = subtotal + tax', () => {
    fc.assert(fc.property(
      fc.array(fc.record({
        price: fc.float({ min: 0, max: 1000 }),
        quantity: fc.integer({ min: 0, max: 100 })
      })),
      fc.float({ min: 0, max: 0.5 }),
      (items, taxRate) => {
        const calculator = new PriceCalculator();
        const result = calculator.calculateTotal(items, taxRate);
        const expectedTotal = result.subtotal + result.tax;
        return Math.abs(result.total - expectedTotal) < 0.01; // Allow for floating point precision
      }
    ));
  });
});

// Test-Driven Development (TDD) Example
describe('Password Validator (TDD)', () => {
  describe('minimum length requirement', () => {
    it('should reject passwords shorter than 8 characters', () => {
      const validator = new PasswordValidator();
      const result = validator.validate('1234567');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    it('should accept passwords with 8 or more characters', () => {
      const validator = new PasswordValidator();
      const result = validator.validate('12345678');

      expect(result.errors).not.toContain('Password must be at least 8 characters');
    });
  });

  describe('complexity requirements', () => {
    it('should require uppercase letters', () => {
      const validator = new PasswordValidator();
      const result = validator.validate('lowercase123!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain uppercase letters');
    });

    it('should require lowercase letters', () => {
      const validator = new PasswordValidator();
      const result = validator.validate('UPPERCASE123!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain lowercase letters');
    });

    it('should require numbers', () => {
      const validator = new PasswordValidator();
      const result = validator.validate('Password!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain numbers');
    });

    it('should require special characters', () => {
      const validator = new PasswordValidator();
      const result = validator.validate('Password123');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain special characters');
    });
  });

  describe('valid passwords', () => {
    it('should accept password meeting all requirements', () => {
      const validator = new PasswordValidator();
      const result = validator.validate('ValidPassword123!');

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });
});

// Behavior-Driven Development (BDD) Example
describe('Shopping Cart (BDD)', () => {
  describe('Given an empty cart', () => {
    let cart;

    beforeEach(() => {
      cart = new ShoppingCart();
    });

    describe('When adding a product', () => {
      const product = { id: 1, price: 10.00, name: 'Test Product' };

      beforeEach(() => {
        cart.addProduct(product);
      });

      it('Then cart should contain one item', () => {
        expect(cart.getItemCount()).toBe(1);
      });

      it('Then cart total should equal product price', () => {
        expect(cart.getTotal()).toBe(10.00);
      });

      describe('When adding the same product again', () => {
        beforeEach(() => {
          cart.addProduct(product);
        });

        it('Then cart should have quantity of 2 for that product', () => {
          const item = cart.getItem(product.id);
          expect(item.quantity).toBe(2);
        });

        it('Then cart total should be double the product price', () => {
          expect(cart.getTotal()).toBe(20.00);
        });
      });
    });

    describe('When removing a product that is not in cart', () => {
      it('Then cart should remain empty', () => {
        cart.removeProduct(999);
        expect(cart.getItemCount()).toBe(0);
      });

      it('Then should not throw an error', () => {
        expect(() => cart.removeProduct(999)).not.toThrow();
      });
    });
  });

  describe('Given a cart with multiple products', () => {
    let cart;
    const products = [
      { id: 1, price: 10.00, name: 'Product 1' },
      { id: 2, price: 15.00, name: 'Product 2' },
      { id: 3, price: 5.00, name: 'Product 3' }
    ];

    beforeEach(() => {
      cart = new ShoppingCart();
      products.forEach(product => cart.addProduct(product));
    });

    describe('When applying a 10% discount', () => {
      beforeEach(() => {
        cart.applyDiscount(0.10);
      });

      it('Then total should be reduced by 10%', () => {
        const expectedTotal = 30.00 * 0.90; // (10 + 15 + 5) * 0.90
        expect(cart.getTotal()).toBe(expectedTotal);
      });
    });

    describe('When clearing the cart', () => {
      beforeEach(() => {
        cart.clear();
      });

      it('Then cart should be empty', () => {
        expect(cart.getItemCount()).toBe(0);
      });

      it('Then total should be zero', () => {
        expect(cart.getTotal()).toBe(0);
      });
    });
  });
});

// Custom Matchers
expect.extend({
  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },

  toBeWithinRange(received, min, max) {
    const pass = received >= min && received <= max;

    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${min} - ${max}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${min} - ${max}`,
        pass: false,
      };
    }
  },

  toHaveValidStructure(received, expectedStructure) {
    const hasAllKeys = Object.keys(expectedStructure).every(key => key in received);
    const hasCorrectTypes = Object.keys(expectedStructure).every(key => {
      if (!(key in received)) return false;
      return typeof received[key] === expectedStructure[key];
    });

    const pass = hasAllKeys && hasCorrectTypes;

    if (pass) {
      return {
        message: () => `expected object not to have valid structure`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected object to have valid structure matching ${JSON.stringify(expectedStructure)}`,
        pass: false,
      };
    }
  }
});

// Usage of custom matchers
describe('Custom Matchers', () => {
  it('should validate email format', () => {
    expect('test@example.com').toBeValidEmail();
    expect('invalid-email').not.toBeValidEmail();
  });

  it('should check value ranges', () => {
    expect(25).toBeWithinRange(18, 65);
    expect(5).not.toBeWithinRange(18, 65);
  });

  it('should validate object structure', () => {
    const user = { name: 'John', age: 30, active: true };
    expect(user).toHaveValidStructure({
      name: 'string',
      age: 'number',
      active: 'boolean'
    });
  });
});

// Helper functions and classes for examples
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

class PriceCalculator {
  calculateTotal(items, taxRate = 0) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }
}

class PasswordValidator {
  validate(password) {
    const errors = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain uppercase letters');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain lowercase letters');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain numbers');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain special characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

class ShoppingCart {
  constructor() {
    this.items = new Map();
    this.discountRate = 0;
  }

  addProduct(product) {
    if (this.items.has(product.id)) {
      const existingItem = this.items.get(product.id);
      existingItem.quantity += 1;
    } else {
      this.items.set(product.id, { ...product, quantity: 1 });
    }
  }

  removeProduct(productId) {
    this.items.delete(productId);
  }

  getItem(productId) {
    return this.items.get(productId);
  }

  getItemCount() {
    return Array.from(this.items.values()).reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal() {
    const subtotal = Array.from(this.items.values())
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return subtotal * (1 - this.discountRate);
  }

  applyDiscount(rate) {
    this.discountRate = rate;
  }

  clear() {
    this.items.clear();
    this.discountRate = 0;
  }
}

module.exports = {
  UserBuilder,
  ProductBuilder,
  createTestUser,
  createAdminUser,
  createInactiveUser,
  createTestProduct,
  PriceCalculator,
  PasswordValidator,
  ShoppingCart,
  shuffleArray
};
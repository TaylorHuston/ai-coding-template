// Example: Test Data Management with Factories and Fixtures

// Good: Use factories for consistent test data
const createTestUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  age: 25,
  isActive: true,
  ...overrides
});

// Usage
it('should deactivate user account', () => {
  const user = createTestUser({ isActive: true });
  const result = userService.deactivateUser(user.id);
  expect(result.isActive).toBe(false);
});

// Good: Use fixtures for complex data
const loadFixture = (name) => {
  return require(`../fixtures/${name}.json`);
};

const sampleUsers = loadFixture('users');

// Factory patterns for different entities
const createTestOrder = (overrides = {}) => ({
  id: 1,
  userId: 1,
  items: [
    { productId: 1, quantity: 2, price: 10.00 }
  ],
  status: 'pending',
  total: 20.00,
  createdAt: new Date().toISOString(),
  ...overrides
});

const createTestProduct = (overrides = {}) => ({
  id: 1,
  name: 'Test Product',
  price: 10.00,
  category: 'electronics',
  inStock: true,
  ...overrides
});
// Naming Conventions Examples

// ===== Variables and Functions =====

// Good: Descriptive and clear
const userAccountBalance = 1500;
const isUserAuthenticated = true;
function calculateTotalPrice(items, taxRate) {
  return items.reduce((total, item) => total + item.price, 0) * (1 + taxRate);
}

// Bad: Unclear and abbreviated
const uab = 1500;
const auth = true;
function calc(i, t) {
  return i.reduce((total, item) => total + item.price, 0) * (1 + t);
}

// ===== Constants =====

// Good: Clear purpose and scope
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_API_TIMEOUT = 5000;
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// Bad: Unclear or inconsistent
const MAX = 3;
const timeout = 5000;
const roles = { a: 'admin', u: 'user' };

// ===== File and Directory Naming =====

// Good: lowercase-kebab-case
// user-authentication-service.js
// payment-processing/
// api-endpoints/

// Bad: inconsistent casing
// UserAuthService.js
// paymentProcessing/
// APIEndpoints/
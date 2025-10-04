// Comments and Documentation Examples

// ===== Good: Explains why =====

// Using exponential backoff to avoid overwhelming the API
// when it's under heavy load
const delay = Math.min(1000 * Math.pow(2, attempt), 30000);

// Calculate tax based on user location and product category
// Different tax rates apply based on local regulations
function calculateTax(location, productCategory, price) {
  // Complex tax calculation logic here
  const baseTaxRate = getBaseTaxRate(location);
  const categoryMultiplier = getCategoryMultiplier(productCategory);
  return price * baseTaxRate * categoryMultiplier;
}

// ===== Bad: Explains what (obvious from code) =====

// Increment counter by 1
counter++;

// Set user name to the provided name
user.name = providedName;

// ===== Function Documentation Examples =====

/**
 * Validates user input data for account creation
 *
 * @param {Object} userData - User data object
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {number} userData.age - User's age
 * @returns {Object} Validation result with success/error details
 * @throws {ValidationError} When input data is invalid
 */
function validateUserInput(userData) {
  if (!userData.email || !isValidEmail(userData.email)) {
    throw new ValidationError('Invalid email address');
  }

  if (!userData.password || userData.password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }

  if (!userData.age || userData.age < 13 || userData.age > 120) {
    throw new ValidationError('Age must be between 13 and 120');
  }

  return { valid: true, userData };
}

/**
 * Processes payment with retry logic and fraud detection
 *
 * @param {Object} paymentRequest - Payment details
 * @param {number} paymentRequest.amount - Amount in cents
 * @param {string} paymentRequest.currency - Currency code (e.g., 'USD')
 * @param {Object} paymentRequest.card - Card information
 * @returns {Promise<Object>} Payment result with transaction ID
 * @throws {PaymentError} When payment processing fails
 */
async function processPayment(paymentRequest) {
  // Implementation with complex business logic
}

// ===== Good: Context for complex algorithms =====

/**
 * Implements Luhn algorithm for credit card validation
 * See: https://en.wikipedia.org/wiki/Luhn_algorithm
 *
 * This is required by PCI DSS for basic card number validation
 * before sending to payment processor
 */
function validateCreditCardNumber(cardNumber) {
  // Remove spaces and non-digits
  const digits = cardNumber.replace(/\D/g, '');

  // Luhn algorithm implementation
  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = digit % 10 + 1;
      }
    }

    sum += digit;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}
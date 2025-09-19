// Code Structure and Organization Examples

// ===== Good: Clear, single responsibility =====
function calculateUserSubscriptionCost(user, plan, discounts = []) {
  const baseCost = plan.monthlyPrice;
  const userDiscount = calculateUserDiscount(user, discounts);
  const finalCost = Math.max(0, baseCost - userDiscount);

  return {
    baseCost,
    discount: userDiscount,
    finalCost,
    currency: plan.currency
  };
}

function calculateUserDiscount(user, discounts) {
  let totalDiscount = 0;

  for (const discount of discounts) {
    if (isDiscountApplicable(user, discount)) {
      totalDiscount += discount.amount;
    }
  }

  return Math.min(totalDiscount, user.maxDiscountAllowed || Infinity);
}

function isDiscountApplicable(user, discount) {
  // Check if user meets discount criteria
  if (discount.minSubscriptionMonths && user.subscriptionMonths < discount.minSubscriptionMonths) {
    return false;
  }

  if (discount.userTier && user.tier !== discount.userTier) {
    return false;
  }

  return true;
}

// ===== Review concern: Multiple responsibilities =====
function processUser(userData) {
  // Validates, creates, sends email, logs - too many responsibilities
  const isValid = validateUserData(userData);
  if (!isValid) {
    throw new Error('Invalid user data');
  }

  const user = createUserInDatabase(userData);
  sendWelcomeEmail(user.email);
  logUserCreation(user.id);
  return user;
}

// ===== Better: Separated responsibilities =====
class UserProcessor {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async processUser(userData) {
    // Single responsibility: orchestrate user processing
    const validatedData = this.validateUserData(userData);
    const user = await this.userRepository.create(validatedData);

    // These can be done asynchronously
    this.emailService.sendWelcomeEmail(user.email);
    this.logger.logUserCreation(user.id);

    return user;
  }

  validateUserData(userData) {
    // Single responsibility: validation
    if (!userData.email || !userData.name) {
      throw new ValidationError('Email and name are required');
    }
    return userData;
  }
}
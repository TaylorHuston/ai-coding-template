// Error Handling and Edge Cases Examples

// ===== Good: Comprehensive error handling =====
async function fetchUserProfile(userId) {
  // Input validation
  if (!userId || typeof userId !== "string") {
    throw new ValidationError("User ID must be a non-empty string");
  }

  try {
    const user = await userRepository.findById(userId);

    // Handle not found case
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    return user;
  } catch (error) {
    // Re-throw known errors
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }

    // Handle unexpected errors
    logger.error("Unexpected error fetching user profile", {
      userId,
      error: error.message,
      stack: error.stack,
    });

    throw new InternalServerError("Failed to fetch user profile");
  }
}

// ===== Good: Edge case handling =====
function processPaymentAmount(amount) {
  // Handle null/undefined
  if (amount == null) {
    throw new ValidationError("Payment amount is required");
  }

  // Handle string conversion
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle invalid numbers
  if (isNaN(numericAmount) || !isFinite(numericAmount)) {
    throw new ValidationError("Payment amount must be a valid number");
  }

  // Handle negative amounts
  if (numericAmount < 0) {
    throw new ValidationError("Payment amount cannot be negative");
  }

  // Handle very large amounts (potential overflow)
  if (numericAmount > Number.MAX_SAFE_INTEGER) {
    throw new ValidationError("Payment amount exceeds maximum allowed value");
  }

  // Handle precision issues
  return Math.round(numericAmount * 100) / 100; // Round to 2 decimal places
}

// ===== Good: Graceful degradation =====
async function getUserWithPreferences(userId) {
  try {
    const user = await userService.getUser(userId);

    try {
      // Try to get preferences, but don't fail if service is down
      const preferences = await preferencesService.getPreferences(userId);
      return { ...user, preferences };
    } catch (preferencesError) {
      logger.warn("Failed to load user preferences, using defaults", {
        userId,
        error: preferencesError.message
      });

      // Return user with default preferences
      return { ...user, preferences: getDefaultPreferences() };
    }
  } catch (userError) {
    // User service failure is critical, re-throw
    throw userError;
  }
}
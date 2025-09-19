// Function Organization Examples

// ===== Good: Small, focused function =====
function validateUserAge(age) {
  if (!age || typeof age !== 'number') {
    return { valid: false, error: 'Age must be a number' };
  }

  if (age < 0 || age > 150) {
    return { valid: false, error: 'Age must be between 0 and 150' };
  }

  return { valid: true };
}

// ===== Good: Early return reduces nesting =====
function processUserData(userData) {
  if (!userData) {
    return null;
  }

  if (!userData.email) {
    return null;
  }

  // Process valid data
  const transformedData = {
    email: userData.email.toLowerCase().trim(),
    name: userData.name?.trim() || '',
    createdAt: new Date().toISOString()
  };

  return transformedData;
}

// ===== Bad: Deeply nested function =====
function processUserDataBad(userData) {
  if (userData) {
    if (userData.email) {
      if (validateEmail(userData.email)) {
        if (userData.name) {
          // Deep nesting makes code hard to read
          return transformData(userData);
        }
      }
    }
  }
  return null;
}

// ===== Good: Module boundaries =====

// user-service.js exports
export {
  createUser,
  updateUser,
  deleteUser,
  getUserById
};

// auth-service.js exports
export {
  authenticateUser,
  validateToken,
  refreshToken
};
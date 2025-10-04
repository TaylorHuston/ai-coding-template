// Input Validation and Security Examples

// ===== Good: Comprehensive input validation =====
function createUserAccount(userData) {
  const validator = new UserDataValidator();

  // Validate and sanitize inputs
  const validatedData = validator.validate({
    email: sanitize.email(userData.email),
    name: sanitize.string(userData.name, { maxLength: 100 }),
    age: parseInt(userData.age, 10),
  });

  if (!validatedData.isValid) {
    throw new ValidationError("Invalid user data", validatedData.errors);
  }

  return userService.create(validatedData.data);
}

// ===== Security concern: No input validation =====
function createUser(userData) {
  // Direct database insertion without validation
  return database.query(`INSERT INTO users (email, name) VALUES ('${userData.email}', '${userData.name}')`);
}
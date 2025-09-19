// Testing Examples for Code Review

// ===== Good: Comprehensive test coverage =====
describe("UserService.createUser", () => {
  it("should create user with valid data", async () => {
    const userData = createValidUserData();
    const result = await userService.createUser(userData);

    expect(result).toMatchObject({
      id: expect.any(String),
      email: userData.email,
      createdAt: expect.any(Date),
    });
  });

  it("should throw ValidationError for invalid email", async () => {
    const userData = createValidUserData({ email: "invalid-email" });

    await expect(userService.createUser(userData)).rejects.toThrow(ValidationError);
  });

  it("should throw ConflictError for duplicate email", async () => {
    const userData = createValidUserData();
    await userService.createUser(userData); // Create first user

    await expect(userService.createUser(userData)).rejects.toThrow(ConflictError);
  });
});
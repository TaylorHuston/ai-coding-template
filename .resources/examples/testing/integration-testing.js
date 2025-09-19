// Example: Integration Testing for API Endpoints

// api-integration.test.js
describe('User API Integration', () => {
  let app;
  let database;

  beforeAll(async () => {
    database = await setupTestDatabase();
    app = createApp({ database });
  });

  afterAll(async () => {
    await cleanupTestDatabase(database);
  });

  beforeEach(async () => {
    await database.clearAllTables();
  });

  describe('POST /api/users', () => {
    it('should create user and return 201', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        email: userData.email,
        name: userData.name,
        createdAt: expect.any(String)
      });

      // Verify database state
      const userInDb = await database.users.findById(response.body.id);
      expect(userInDb).toBeTruthy();
    });
  });
});
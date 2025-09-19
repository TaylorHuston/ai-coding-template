// Example: Mocking and Stubbing External Dependencies

// Good: Mock external dependencies
describe('EmailService', () => {
  let emailService;
  let mockSmtpClient;

  beforeEach(() => {
    mockSmtpClient = {
      send: jest.fn().mockResolvedValue({ messageId: '123' }),
      connect: jest.fn().mockResolvedValue(true),
      disconnect: jest.fn().mockResolvedValue(true)
    };
    emailService = new EmailService(mockSmtpClient);
  });

  it('should send email with correct parameters', async () => {
    const emailData = {
      to: 'user@example.com',
      subject: 'Welcome',
      body: 'Welcome to our service'
    };

    await emailService.sendWelcomeEmail(emailData);

    expect(mockSmtpClient.send).toHaveBeenCalledWith({
      to: emailData.to,
      subject: emailData.subject,
      html: expect.stringContaining('Welcome to our service')
    });
  });
});

// Mock database dependencies
describe('UserRepository', () => {
  let userRepository;
  let mockDatabase;

  beforeEach(() => {
    mockDatabase = {
      query: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    userRepository = new UserRepository(mockDatabase);
  });

  it('should create user with generated ID', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    mockDatabase.insert.mockResolvedValue({ id: 1, ...userData });

    const result = await userRepository.create(userData);

    expect(mockDatabase.insert).toHaveBeenCalledWith('users', userData);
    expect(result).toEqual({ id: 1, ...userData });
  });
});
// Logging Standards Examples

// ===== Good: Structured logging =====
logger.info('User created successfully', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
  action: 'user_creation'
});

logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack,
  connectionString: 'postgresql://***', // Sanitized
  timestamp: new Date().toISOString(),
  action: 'database_connection'
});

// ===== Security Considerations =====

// Good: Safe logging
logger.info('User authenticated', {
  userId: user.id,
  email: user.email.replace(/(.{2}).*@/, '$1***@'), // Partially masked
  timestamp: new Date().toISOString()
});

logger.warn('Failed login attempt', {
  userId: attemptedUserId,
  ipAddress: req.ip,
  userAgent: req.get('User-Agent'),
  timestamp: new Date().toISOString(),
  action: 'failed_login'
});

// Bad: Unsafe logging
logger.info('User authenticated', {
  password: user.password, // Never log passwords
  token: authToken, // Never log tokens
  creditCard: user.paymentInfo.cardNumber // Never log sensitive data
});

// ===== Log Levels Usage =====

// ERROR: System errors, exceptions, failures
logger.error('Payment processing failed', {
  orderId: order.id,
  error: error.message,
  paymentMethod: payment.type
});

// WARN: Potential issues, deprecated usage, fallbacks
logger.warn('Using deprecated API endpoint', {
  endpoint: '/api/v1/users',
  suggestedEndpoint: '/api/v2/users',
  userId: user.id
});

// INFO: Important system events, user actions
logger.info('Order completed', {
  orderId: order.id,
  userId: user.id,
  totalAmount: order.total,
  timestamp: new Date().toISOString()
});

// DEBUG: Detailed diagnostic information
logger.debug('Cache hit for user data', {
  userId: user.id,
  cacheKey: `user:${user.id}`,
  hitRate: cache.getHitRate()
});
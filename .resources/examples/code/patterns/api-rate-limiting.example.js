/**
 * API Rate Limiting Pattern Examples
 *
 * Demonstrates multi-tier protection strategies with various rate limiting algorithms.
 * Includes per-user, per-endpoint, and global limits with burst handling.
 */

const Redis = require('redis');
const { RateLimitError } = require('./api-error-handling.example');

/**
 * Token Bucket Rate Limiter
 *
 * Allows bursts while maintaining long-term rate limits.
 * Good for APIs that need to handle traffic spikes gracefully.
 */
class TokenBucketLimiter {
  constructor(options = {}) {
    this.capacity = options.capacity || 10; // Maximum tokens
    this.refillRate = options.refillRate || 1; // Tokens per second
    this.refillInterval = options.refillInterval || 1000; // Milliseconds
    this.storage = options.storage || new Map(); // In-memory storage
  }

  /**
   * Get Bucket State
   */
  getBucket(key) {
    const now = Date.now();
    let bucket = this.storage.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.capacity,
        lastRefill: now
      };
      this.storage.set(key, bucket);
      return bucket;
    }

    // Calculate tokens to add based on time elapsed
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillInterval) * this.refillRate;

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    return bucket;
  }

  /**
   * Attempt to Consume Tokens
   */
  async consume(key, tokens = 1) {
    const bucket = this.getBucket(key);

    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens;
      return {
        allowed: true,
        remaining: bucket.tokens,
        resetTime: bucket.lastRefill + (this.capacity - bucket.tokens) * this.refillInterval
      };
    }

    return {
      allowed: false,
      remaining: bucket.tokens,
      resetTime: bucket.lastRefill + (this.capacity - bucket.tokens) * this.refillInterval,
      retryAfter: Math.ceil((tokens - bucket.tokens) * (this.refillInterval / this.refillRate))
    };
  }
}

/**
 * Sliding Window Rate Limiter
 *
 * More accurate than fixed windows but requires more memory.
 * Tracks exact request timestamps within the window.
 */
class SlidingWindowLimiter {
  constructor(options = {}) {
    this.windowSize = options.windowSize || 60000; // 1 minute in milliseconds
    this.maxRequests = options.maxRequests || 100;
    this.storage = options.storage || new Map();
  }

  /**
   * Get Request Window
   */
  getWindow(key) {
    const now = Date.now();
    let window = this.storage.get(key);

    if (!window) {
      window = [];
      this.storage.set(key, window);
    }

    // Remove old requests outside the window
    const windowStart = now - this.windowSize;
    while (window.length > 0 && window[0] < windowStart) {
      window.shift();
    }

    return window;
  }

  /**
   * Check Rate Limit
   */
  async isAllowed(key) {
    const window = this.getWindow(key);
    const now = Date.now();

    if (window.length < this.maxRequests) {
      window.push(now);
      return {
        allowed: true,
        remaining: this.maxRequests - window.length,
        resetTime: window[0] + this.windowSize
      };
    }

    const oldestRequest = window[0];
    const resetTime = oldestRequest + this.windowSize;

    return {
      allowed: false,
      remaining: 0,
      resetTime,
      retryAfter: resetTime - now
    };
  }
}

/**
 * Fixed Window Rate Limiter
 *
 * Simple and efficient but allows bursts at window boundaries.
 * Good for basic rate limiting with predictable reset times.
 */
class FixedWindowLimiter {
  constructor(options = {}) {
    this.windowSize = options.windowSize || 60000; // 1 minute
    this.maxRequests = options.maxRequests || 100;
    this.storage = options.storage || new Map();
  }

  /**
   * Get Current Window
   */
  getCurrentWindow(key) {
    const now = Date.now();
    const windowStart = Math.floor(now / this.windowSize) * this.windowSize;
    const windowKey = `${key}:${windowStart}`;

    let window = this.storage.get(windowKey);
    if (!window) {
      window = { count: 0, start: windowStart };
      this.storage.set(windowKey, window);

      // Clean up old windows
      for (const [k, v] of this.storage.entries()) {
        if (k.startsWith(`${key}:`) && v.start < windowStart - this.windowSize) {
          this.storage.delete(k);
        }
      }
    }

    return { window, windowKey };
  }

  /**
   * Check Rate Limit
   */
  async isAllowed(key) {
    const { window } = this.getCurrentWindow(key);

    if (window.count < this.maxRequests) {
      window.count++;
      return {
        allowed: true,
        remaining: this.maxRequests - window.count,
        resetTime: window.start + this.windowSize
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetTime: window.start + this.windowSize,
      retryAfter: window.start + this.windowSize - Date.now()
    };
  }
}

/**
 * Redis-Based Rate Limiter
 *
 * Distributed rate limiting using Redis for multi-server deployments.
 */
class RedisRateLimiter {
  constructor(options = {}) {
    this.redis = options.redis || Redis.createClient();
    this.windowSize = options.windowSize || 60; // seconds
    this.maxRequests = options.maxRequests || 100;
    this.keyPrefix = options.keyPrefix || 'rate_limit:';
  }

  /**
   * Sliding Window with Redis
   */
  async slidingWindow(key) {
    const redisKey = this.keyPrefix + key;
    const now = Date.now();
    const windowStart = now - (this.windowSize * 1000);

    const multi = this.redis.multi();

    // Remove old entries
    multi.zremrangebyscore(redisKey, 0, windowStart);

    // Count current entries
    multi.zcard(redisKey);

    // Add current request
    multi.zadd(redisKey, now, now);

    // Set expiration
    multi.expire(redisKey, this.windowSize + 1);

    const results = await multi.exec();
    const currentCount = results[1][1];

    if (currentCount <= this.maxRequests) {
      return {
        allowed: true,
        remaining: this.maxRequests - currentCount,
        resetTime: now + (this.windowSize * 1000)
      };
    } else {
      // Remove the request we just added since we're over the limit
      await this.redis.zrem(redisKey, now);

      return {
        allowed: false,
        remaining: 0,
        resetTime: now + (this.windowSize * 1000),
        retryAfter: this.windowSize * 1000
      };
    }
  }

  /**
   * Fixed Window with Redis
   */
  async fixedWindow(key) {
    const now = Date.now();
    const windowStart = Math.floor(now / (this.windowSize * 1000)) * this.windowSize;
    const redisKey = `${this.keyPrefix}${key}:${windowStart}`;

    const count = await this.redis.incr(redisKey);

    if (count === 1) {
      await this.redis.expire(redisKey, this.windowSize + 1);
    }

    if (count <= this.maxRequests) {
      return {
        allowed: true,
        remaining: this.maxRequests - count,
        resetTime: (windowStart + this.windowSize) * 1000
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetTime: (windowStart + this.windowSize) * 1000,
      retryAfter: ((windowStart + this.windowSize) * 1000) - now
    };
  }
}

/**
 * Multi-Tier Rate Limiting Strategy
 *
 * Combines multiple rate limiters for comprehensive protection.
 */
class MultiTierRateLimiter {
  constructor(options = {}) {
    this.limits = options.limits || {
      global: { maxRequests: 10000, windowSize: 60 },
      perUser: { maxRequests: 100, windowSize: 60 },
      perEndpoint: { maxRequests: 1000, windowSize: 60 },
      perUserEndpoint: { maxRequests: 10, windowSize: 60 }
    };

    this.limiters = {};
    this.initializeLimiters(options.limiterType || 'tokenBucket');
  }

  /**
   * Initialize Limiters
   */
  initializeLimiters(type) {
    for (const [tier, config] of Object.entries(this.limits)) {
      switch (type) {
        case 'tokenBucket':
          this.limiters[tier] = new TokenBucketLimiter({
            capacity: config.maxRequests,
            refillRate: Math.ceil(config.maxRequests / config.windowSize)
          });
          break;
        case 'slidingWindow':
          this.limiters[tier] = new SlidingWindowLimiter({
            maxRequests: config.maxRequests,
            windowSize: config.windowSize * 1000
          });
          break;
        case 'fixedWindow':
          this.limiters[tier] = new FixedWindowLimiter({
            maxRequests: config.maxRequests,
            windowSize: config.windowSize * 1000
          });
          break;
      }
    }
  }

  /**
   * Check All Rate Limits
   */
  async checkLimits(userId, endpoint, ip) {
    const checks = [
      { tier: 'global', key: 'global' },
      { tier: 'perUser', key: `user:${userId}` },
      { tier: 'perEndpoint', key: `endpoint:${endpoint}` },
      { tier: 'perUserEndpoint', key: `user:${userId}:endpoint:${endpoint}` }
    ];

    const results = [];

    for (const { tier, key } of checks) {
      const limiter = this.limiters[tier];
      let result;

      if (limiter instanceof TokenBucketLimiter) {
        result = await limiter.consume(key);
      } else {
        result = await limiter.isAllowed(key);
      }

      result.tier = tier;
      result.key = key;
      results.push(result);

      // Fail fast on first limit exceeded
      if (!result.allowed) {
        return {
          allowed: false,
          limitExceeded: tier,
          results,
          retryAfter: result.retryAfter,
          resetTime: result.resetTime
        };
      }
    }

    return {
      allowed: true,
      results
    };
  }
}

/**
 * Adaptive Rate Limiting
 *
 * Adjusts limits based on system load and user behavior.
 */
class AdaptiveRateLimiter {
  constructor(options = {}) {
    this.baseLimiter = new TokenBucketLimiter(options.base);
    this.systemLoadThreshold = options.systemLoadThreshold || 0.8;
    this.userTrustScores = new Map();
    this.loadHistory = [];
  }

  /**
   * Calculate Dynamic Limit
   */
  calculateDynamicLimit(baseLimit, userId, endpoint) {
    let adjustedLimit = baseLimit;

    // Adjust based on system load
    const currentLoad = this.getCurrentSystemLoad();
    if (currentLoad > this.systemLoadThreshold) {
      const loadFactor = Math.max(0.1, 1 - ((currentLoad - this.systemLoadThreshold) / 0.2));
      adjustedLimit *= loadFactor;
    }

    // Adjust based on user trust score
    const trustScore = this.getUserTrustScore(userId);
    if (trustScore > 0.8) {
      adjustedLimit *= 1.5; // Trusted users get higher limits
    } else if (trustScore < 0.3) {
      adjustedLimit *= 0.5; // Suspicious users get lower limits
    }

    // Adjust based on endpoint sensitivity
    const endpointMultiplier = this.getEndpointMultiplier(endpoint);
    adjustedLimit *= endpointMultiplier;

    return Math.max(1, Math.floor(adjustedLimit));
  }

  /**
   * Get Current System Load
   */
  getCurrentSystemLoad() {
    // Simplified load calculation - in practice, use system metrics
    const now = Date.now();
    this.loadHistory = this.loadHistory.filter(time => now - time < 60000);
    return Math.min(1, this.loadHistory.length / 1000);
  }

  /**
   * Get User Trust Score
   */
  getUserTrustScore(userId) {
    return this.userTrustScores.get(userId) || 0.5; // Default neutral score
  }

  /**
   * Update User Trust Score
   */
  updateUserTrustScore(userId, behavior) {
    const currentScore = this.getUserTrustScore(userId);
    let adjustment = 0;

    switch (behavior) {
      case 'normal_usage':
        adjustment = 0.01;
        break;
      case 'rate_limit_hit':
        adjustment = -0.05;
        break;
      case 'suspicious_pattern':
        adjustment = -0.1;
        break;
      case 'verified_human':
        adjustment = 0.1;
        break;
    }

    const newScore = Math.max(0, Math.min(1, currentScore + adjustment));
    this.userTrustScores.set(userId, newScore);
  }

  /**
   * Get Endpoint Multiplier
   */
  getEndpointMultiplier(endpoint) {
    const endpointConfig = {
      '/api/auth/login': 0.1, // Very strict for auth endpoints
      '/api/search': 0.5, // Strict for expensive operations
      '/api/users': 1.0, // Normal for standard operations
      '/api/health': 10.0 // Lenient for health checks
    };

    return endpointConfig[endpoint] || 1.0;
  }

  /**
   * Check Adaptive Rate Limit
   */
  async checkLimit(userId, endpoint, baseLimit = 100) {
    const dynamicLimit = this.calculateDynamicLimit(baseLimit, userId, endpoint);

    // Create temporary limiter with dynamic limit
    const tempLimiter = new TokenBucketLimiter({
      capacity: dynamicLimit,
      refillRate: Math.ceil(dynamicLimit / 60)
    });

    const result = await tempLimiter.consume(`${userId}:${endpoint}`);

    // Track system load
    this.loadHistory.push(Date.now());

    // Update user trust score based on result
    if (!result.allowed) {
      this.updateUserTrustScore(userId, 'rate_limit_hit');
    } else {
      this.updateUserTrustScore(userId, 'normal_usage');
    }

    return {
      ...result,
      dynamicLimit,
      trustScore: this.getUserTrustScore(userId),
      systemLoad: this.getCurrentSystemLoad()
    };
  }
}

/**
 * Rate Limiting Middleware
 *
 * Express middleware for applying rate limits to routes.
 */
function rateLimitMiddleware(options = {}) {
  const strategy = options.strategy || 'multiTier';
  let limiter;

  switch (strategy) {
    case 'tokenBucket':
      limiter = new TokenBucketLimiter(options);
      break;
    case 'slidingWindow':
      limiter = new SlidingWindowLimiter(options);
      break;
    case 'fixedWindow':
      limiter = new FixedWindowLimiter(options);
      break;
    case 'multiTier':
      limiter = new MultiTierRateLimiter(options);
      break;
    case 'adaptive':
      limiter = new AdaptiveRateLimiter(options);
      break;
    default:
      limiter = new TokenBucketLimiter(options);
  }

  return async (req, res, next) => {
    try {
      const userId = req.user?.id || req.ip;
      const endpoint = req.route?.path || req.path;
      const ip = req.ip;

      let result;

      if (strategy === 'multiTier') {
        result = await limiter.checkLimits(userId, endpoint, ip);
      } else if (strategy === 'adaptive') {
        result = await limiter.checkLimit(userId, endpoint);
      } else {
        const key = `${userId}:${endpoint}`;
        if (limiter.consume) {
          result = await limiter.consume(key);
        } else {
          result = await limiter.isAllowed(key);
        }
      }

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': options.maxRequests || 100,
        'X-RateLimit-Remaining': result.remaining || 0,
        'X-RateLimit-Reset': result.resetTime ? new Date(result.resetTime).toISOString() : null
      });

      if (!result.allowed) {
        const retryAfter = Math.ceil((result.retryAfter || 60000) / 1000);
        res.set('Retry-After', retryAfter);

        return next(new RateLimitError(retryAfter));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Example Route Configurations
 */

// Basic rate limiting
const basicRateLimit = rateLimitMiddleware({
  strategy: 'tokenBucket',
  capacity: 10,
  refillRate: 1
});

// Multi-tier protection
const multiTierRateLimit = rateLimitMiddleware({
  strategy: 'multiTier',
  limits: {
    global: { maxRequests: 10000, windowSize: 60 },
    perUser: { maxRequests: 100, windowSize: 60 },
    perEndpoint: { maxRequests: 1000, windowSize: 60 }
  }
});

// Adaptive rate limiting
const adaptiveRateLimit = rateLimitMiddleware({
  strategy: 'adaptive',
  base: { capacity: 100, refillRate: 2 },
  systemLoadThreshold: 0.8
});

// Endpoint-specific configurations
const authRateLimit = rateLimitMiddleware({
  strategy: 'fixedWindow',
  maxRequests: 5,
  windowSize: 900000 // 15 minutes
});

const uploadRateLimit = rateLimitMiddleware({
  strategy: 'slidingWindow',
  maxRequests: 10,
  windowSize: 3600000 // 1 hour
});

/**
 * Example Usage in Routes
 */

// Apply to all routes
// app.use(basicRateLimit);

// Apply to specific routes
// app.post('/api/auth/login', authRateLimit, loginHandler);
// app.post('/api/upload', uploadRateLimit, uploadHandler);
// app.use('/api', multiTierRateLimit);

/**
 * Rate Limit Response Examples
 */

const rateLimitHeaders = {
  "X-RateLimit-Limit": "100",
  "X-RateLimit-Remaining": "99",
  "X-RateLimit-Reset": "2025-09-17T10:31:00.000Z"
};

const rateLimitExceededResponse = {
  "success": false,
  "statusCode": 429,
  "timestamp": "2025-09-17T10:30:00.000Z",
  "error": {
    "message": "Rate limit exceeded",
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "retryAfter": 60
    }
  },
  "headers": {
    "Retry-After": "60",
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": "2025-09-17T10:31:00.000Z"
  }
};

module.exports = {
  TokenBucketLimiter,
  SlidingWindowLimiter,
  FixedWindowLimiter,
  RedisRateLimiter,
  MultiTierRateLimiter,
  AdaptiveRateLimiter,
  rateLimitMiddleware,

  // Preconfigured middleware
  basicRateLimit,
  multiTierRateLimit,
  adaptiveRateLimit,
  authRateLimit,
  uploadRateLimit,

  // Examples
  examples: {
    rateLimitHeaders,
    rateLimitExceededResponse
  }
};

/**
 * Key Benefits of This Pattern:
 *
 * 1. Multi-Layer Protection: Global, per-user, and per-endpoint limits
 * 2. Algorithm Flexibility: Choose appropriate algorithm for use case
 * 3. Burst Handling: Token bucket allows legitimate traffic spikes
 * 4. Distributed Support: Redis-based limiting for multi-server deployments
 * 5. Adaptive Behavior: Dynamic limits based on system load and user trust
 *
 * Usage Tips:
 * - Use token bucket for APIs that need burst tolerance
 * - Use sliding window for more accurate rate limiting
 * - Use fixed window for simple, predictable limits
 * - Implement multi-tier protection for comprehensive security
 * - Monitor and adjust limits based on actual usage patterns
 * - Consider user experience when setting retry-after values
 */
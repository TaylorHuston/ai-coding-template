/**
 * Rate Limiting and Account Protection Implementation Example
 *
 * Comprehensive rate limiting service with progressive delays,
 * account protection, and distributed enforcement
 *
 * Features:
 * - Multiple rate limit types
 * - Progressive authentication delays
 * - Distributed rate limiting via Redis
 * - Account lockout protection
 * - Detailed violation logging
 * - Express.js middleware integration
 */

const Redis = require('redis');

class RateLimitService {
  constructor(redisClient, auditService) {
    this.redis = redisClient;
    this.audit = auditService;
    this.limits = {
      authentication: { requests: 5, window: 15 * 60 * 1000 }, // 5 per 15 min
      password_reset: { requests: 3, window: 60 * 60 * 1000 }, // 3 per hour
      api_general: { requests: 1000, window: 60 * 60 * 1000 }, // 1000 per hour
      api_premium: { requests: 10000, window: 60 * 60 * 1000 }, // 10000 per hour
      api_admin: { requests: 5000, window: 60 * 60 * 1000 }, // 5000 per hour
      file_upload: { requests: 10, window: 60 * 60 * 1000 }, // 10 per hour
      search: { requests: 100, window: 60 * 60 * 1000 }, // 100 per hour
      email_send: { requests: 50, window: 24 * 60 * 60 * 1000 } // 50 per day
    };
  }

  async checkRateLimit(identifier, limitType, context = {}) {
    const limit = this.limits[limitType];
    if (!limit) {
      throw new Error(`Unknown rate limit type: ${limitType}`);
    }

    const key = `rate_limit:${limitType}:${identifier}`;
    const current = await this.redis.get(key);

    if (!current) {
      // First request in window
      await this.redis.setex(key, Math.ceil(limit.window / 1000), '1');
      return {
        allowed: true,
        remaining: limit.requests - 1,
        resetTime: new Date(Date.now() + limit.window),
        total: limit.requests
      };
    }

    const currentCount = parseInt(current, 10);

    if (currentCount >= limit.requests) {
      // Rate limit exceeded
      const ttl = await this.redis.ttl(key);

      // Log rate limit violation
      await this.logRateLimitViolation(identifier, limitType, currentCount, context);

      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(Date.now() + (ttl * 1000)),
        retryAfter: ttl,
        total: limit.requests
      };
    }

    // Increment counter
    await this.redis.incr(key);

    return {
      allowed: true,
      remaining: limit.requests - currentCount - 1,
      resetTime: new Date(Date.now() + (await this.redis.ttl(key) * 1000)),
      total: limit.requests
    };
  }

  // Progressive delay for failed authentication attempts
  async getAuthenticationDelay(identifier) {
    const failureKey = `auth_failures:${identifier}`;
    const failures = parseInt(await this.redis.get(failureKey) || '0', 10);

    // Progressive delays: 0s, 1s, 4s, 9s, 16s, 25s...
    const delay = Math.min(Math.pow(failures, 2), 300) * 1000; // Max 5 minutes

    return {
      delay,
      attempts: failures,
      nextAttemptAt: new Date(Date.now() + delay)
    };
  }

  async recordAuthenticationFailure(identifier, context = {}) {
    const failureKey = `auth_failures:${identifier}`;
    const failures = await this.redis.incr(failureKey);

    if (failures === 1) {
      // Set expiration for first failure
      await this.redis.expire(failureKey, 60 * 60); // 1 hour
    }

    // Check if account should be locked
    if (failures >= 10) {
      await this.lockAccount(identifier, 'excessive_failed_attempts', context);
    }

    // Log the failure
    await this.audit.logAuthenticationFailure({
      identifier,
      attempts: failures,
      timestamp: new Date(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return failures;
  }

  async clearAuthenticationFailures(identifier) {
    await this.redis.del(`auth_failures:${identifier}`);
  }

  async lockAccount(identifier, reason, context = {}) {
    const lockKey = `account_locked:${identifier}`;
    const lockDuration = this.getLockDuration(reason);

    const lockInfo = {
      reason,
      lockedAt: new Date().toISOString(),
      lockedUntil: new Date(Date.now() + lockDuration).toISOString(),
      context: {
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      }
    };

    await this.redis.setex(lockKey, Math.ceil(lockDuration / 1000), JSON.stringify(lockInfo));

    // Log account lock
    await this.audit.logAccountLock({
      identifier,
      reason,
      duration: lockDuration,
      timestamp: new Date(),
      context
    });
  }

  async isAccountLocked(identifier) {
    const lockKey = `account_locked:${identifier}`;
    const lockData = await this.redis.get(lockKey);

    if (!lockData) {
      return { locked: false };
    }

    const lockInfo = JSON.parse(lockData);
    return {
      locked: true,
      reason: lockInfo.reason,
      lockedAt: new Date(lockInfo.lockedAt),
      lockedUntil: new Date(lockInfo.lockedUntil),
      remainingTime: new Date(lockInfo.lockedUntil) - Date.now()
    };
  }

  async unlockAccount(identifier, reason = 'manual_unlock') {
    const lockKey = `account_locked:${identifier}`;
    await this.redis.del(lockKey);

    // Also clear authentication failures
    await this.clearAuthenticationFailures(identifier);

    // Log account unlock
    await this.audit.logAccountUnlock({
      identifier,
      reason,
      timestamp: new Date()
    });
  }

  getLockDuration(reason) {
    const durations = {
      excessive_failed_attempts: 30 * 60 * 1000, // 30 minutes
      suspicious_activity: 60 * 60 * 1000, // 1 hour
      security_violation: 24 * 60 * 60 * 1000, // 24 hours
      manual_lock: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    return durations[reason] || 60 * 60 * 1000; // Default 1 hour
  }

  // Sliding window rate limiter for more accurate limiting
  async checkSlidingWindow(identifier, limitType, context = {}) {
    const limit = this.limits[limitType];
    if (!limit) {
      throw new Error(`Unknown rate limit type: ${limitType}`);
    }

    const key = `sliding_window:${limitType}:${identifier}`;
    const now = Date.now();
    const windowStart = now - limit.window;

    // Remove old entries
    await this.redis.zremrangebyscore(key, '-inf', windowStart);

    // Count current entries
    const currentCount = await this.redis.zcard(key);

    if (currentCount >= limit.requests) {
      // Get oldest entry to determine reset time
      const oldestEntry = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
      const resetTime = oldestEntry.length > 0 ?
        new Date(parseInt(oldestEntry[1]) + limit.window) :
        new Date(now + limit.window);

      await this.logRateLimitViolation(identifier, limitType, currentCount, context);

      return {
        allowed: false,
        remaining: 0,
        resetTime,
        retryAfter: Math.ceil((resetTime - now) / 1000),
        total: limit.requests
      };
    }

    // Add current request
    await this.redis.zadd(key, now, `${now}-${Math.random()}`);
    await this.redis.expire(key, Math.ceil(limit.window / 1000));

    return {
      allowed: true,
      remaining: limit.requests - currentCount - 1,
      resetTime: new Date(now + limit.window),
      total: limit.requests
    };
  }

  // Burst handling with token bucket algorithm
  async checkTokenBucket(identifier, limitType, context = {}) {
    const limit = this.limits[limitType];
    if (!limit) {
      throw new Error(`Unknown rate limit type: ${limitType}`);
    }

    const key = `token_bucket:${limitType}:${identifier}`;
    const bucketData = await this.redis.get(key);

    const now = Date.now();
    const refillRate = limit.requests / (limit.window / 1000); // tokens per second
    const bucketSize = limit.requests;

    let tokens, lastRefill;

    if (!bucketData) {
      tokens = bucketSize;
      lastRefill = now;
    } else {
      const bucket = JSON.parse(bucketData);
      tokens = bucket.tokens;
      lastRefill = bucket.lastRefill;

      // Calculate tokens to add based on time passed
      const timePassed = (now - lastRefill) / 1000;
      const tokensToAdd = Math.floor(timePassed * refillRate);

      tokens = Math.min(bucketSize, tokens + tokensToAdd);
      lastRefill = now;
    }

    if (tokens < 1) {
      await this.logRateLimitViolation(identifier, limitType, 0, context);

      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(now + (1000 / refillRate)),
        retryAfter: Math.ceil(1000 / refillRate / 1000),
        total: bucketSize
      };
    }

    // Consume one token
    tokens -= 1;

    // Save bucket state
    await this.redis.setex(
      key,
      Math.ceil(limit.window / 1000),
      JSON.stringify({ tokens, lastRefill })
    );

    return {
      allowed: true,
      remaining: tokens,
      resetTime: new Date(now + ((bucketSize - tokens) * 1000 / refillRate)),
      total: bucketSize
    };
  }

  // Middleware factory for Express.js
  createMiddleware(limitType, options = {}) {
    return async (req, res, next) => {
      const identifier = this.getIdentifier(req, options);

      try {
        // Check if account is locked first
        const lockStatus = await this.isAccountLocked(identifier);
        if (lockStatus.locked) {
          return res.status(423).json({
            error: 'Account locked',
            reason: lockStatus.reason,
            lockedUntil: lockStatus.lockedUntil,
            remainingTime: lockStatus.remainingTime
          });
        }

        // Apply rate limiting algorithm based on options
        let result;
        switch (options.algorithm) {
          case 'sliding_window':
            result = await this.checkSlidingWindow(identifier, limitType, {
              ip: req.ip,
              userAgent: req.get('User-Agent'),
              endpoint: req.path
            });
            break;
          case 'token_bucket':
            result = await this.checkTokenBucket(identifier, limitType, {
              ip: req.ip,
              userAgent: req.get('User-Agent'),
              endpoint: req.path
            });
            break;
          default:
            result = await this.checkRateLimit(identifier, limitType, {
              ip: req.ip,
              userAgent: req.get('User-Agent'),
              endpoint: req.path
            });
        }

        // Set rate limit headers
        res.set('X-RateLimit-Limit', result.total);
        res.set('X-RateLimit-Remaining', result.remaining);
        res.set('X-RateLimit-Reset', Math.floor(result.resetTime.getTime() / 1000));

        if (!result.allowed) {
          res.set('Retry-After', result.retryAfter);
          return res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfter: result.retryAfter,
            resetTime: result.resetTime
          });
        }

        next();
      } catch (error) {
        return res.status(500).json({
          error: 'Rate limiting check failed',
          message: error.message
        });
      }
    };
  }

  getIdentifier(req, options = {}) {
    if (options.identifierFn) {
      return options.identifierFn(req);
    }

    // Use user ID if authenticated, otherwise IP address
    return req.user?.id || req.ip;
  }

  async logRateLimitViolation(identifier, limitType, currentCount, context) {
    await this.audit.logRateLimitViolation({
      identifier,
      limitType,
      currentCount,
      limit: this.limits[limitType].requests,
      timestamp: new Date(),
      context
    });
  }

  async getRateLimitStatus(identifier, limitType) {
    const limit = this.limits[limitType];
    const key = `rate_limit:${limitType}:${identifier}`;
    const current = await this.redis.get(key);
    const ttl = await this.redis.ttl(key);

    return {
      limitType,
      limit: limit.requests,
      window: limit.window,
      current: parseInt(current || '0', 10),
      remaining: Math.max(0, limit.requests - parseInt(current || '0', 10)),
      resetTime: ttl > 0 ? new Date(Date.now() + (ttl * 1000)) : null
    };
  }
}

// Usage examples
const setupRateLimitMiddleware = (app, rateLimitService) => {
  // Authentication endpoints
  app.use('/auth/login',
    rateLimitService.createMiddleware('authentication', {
      identifierFn: (req) => req.ip // Always use IP for auth attempts
    })
  );

  // Password reset endpoints
  app.use('/auth/reset-password',
    rateLimitService.createMiddleware('password_reset')
  );

  // General API endpoints
  app.use('/api',
    rateLimitService.createMiddleware('api_general', {
      algorithm: 'sliding_window'
    })
  );

  // File upload endpoints
  app.use('/api/upload',
    rateLimitService.createMiddleware('file_upload', {
      algorithm: 'token_bucket'
    })
  );

  // Admin endpoints with higher limits
  app.use('/api/admin',
    rateLimitService.createMiddleware('api_admin')
  );
};

module.exports = {
  RateLimitService,
  setupRateLimitMiddleware
};
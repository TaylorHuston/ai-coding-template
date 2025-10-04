// Example: Graceful API Deprecation Middleware

const deprecationMiddleware = (version, sunsetDate, migrationPath) => {
  return (req, res, next) => {
    res.set({
      'Sunset': sunsetDate,
      'Deprecation': 'true',
      'Link': `<${migrationPath}>; rel="successor-version"`
    });

    // Log usage for analytics
    logger.warn('Deprecated API usage', {
      endpoint: req.originalUrl,
      version,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    next();
  };
};

// Apply to deprecated routes
app.use('/api/v1', deprecationMiddleware('v1', '2025-12-31', '/docs/migration/v1-to-v2'));

/**
 * Deprecation Timeline:
 * 1. Announcement (6 months before): Communicate deprecation plans
 * 2. Warning Headers (3 months before): Add deprecation headers to responses
 * 3. Migration Period (2 months): Provide migration tools and support
 * 4. Sunset (Planned date): Remove deprecated version
 */
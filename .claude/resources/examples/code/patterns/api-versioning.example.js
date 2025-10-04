/**
 * API Versioning Strategies Implementation
 *
 * Comprehensive implementation of different API versioning approaches:
 * - URL Path Versioning (/v1/users, /v2/users)
 * - Header Versioning (Accept-Version, API-Version)
 * - Query Parameter Versioning (?version=2)
 * - Content Negotiation (Accept: application/vnd.api+json;version=2)
 * - Semantic Versioning with backward compatibility
 * - Version deprecation and migration strategies
 */

const semver = require('semver'); // Assuming semver is available

/**
 * API Version Manager
 * Central management for API versioning across different strategies
 */
class APIVersionManager {
  constructor(options = {}) {
    this.currentVersion = options.currentVersion || '1.0.0';
    this.supportedVersions = options.supportedVersions || ['1.0.0'];
    this.deprecatedVersions = new Map(); // version -> deprecation info
    this.versionHandlers = new Map(); // version -> handler functions
    this.defaultStrategy = options.defaultStrategy || 'path';
    this.routes = new Map(); // route patterns with version mappings

    // Version compatibility matrix
    this.compatibility = options.compatibility || {};

    // Migration strategies
    this.migrations = new Map(); // from-version -> to-version -> migration function
  }

  /**
   * Register version handler
   */
  registerVersion(version, handler, options = {}) {
    if (!semver.valid(version)) {
      throw new Error(`Invalid semantic version: ${version}`);
    }

    this.versionHandlers.set(version, {
      handler,
      deprecated: options.deprecated || false,
      deprecationDate: options.deprecationDate,
      sunsetDate: options.sunsetDate,
      breaking: options.breaking || false,
      changelog: options.changelog || ''
    });

    if (!this.supportedVersions.includes(version)) {
      this.supportedVersions.push(version);
      this.supportedVersions.sort(semver.rcompare); // Sort in descending order
    }

    return this;
  }

  /**
   * Deprecate a version
   */
  deprecateVersion(version, deprecationInfo = {}) {
    const versionInfo = this.versionHandlers.get(version);
    if (!versionInfo) {
      throw new Error(`Version ${version} not found`);
    }

    const deprecation = {
      version,
      deprecatedAt: deprecationInfo.deprecatedAt || new Date(),
      sunsetDate: deprecationInfo.sunsetDate,
      reason: deprecationInfo.reason || 'Version deprecated',
      migrationGuide: deprecationInfo.migrationGuide,
      recommendedVersion: deprecationInfo.recommendedVersion || this.currentVersion
    };

    this.deprecatedVersions.set(version, deprecation);
    versionInfo.deprecated = true;
    versionInfo.deprecationDate = deprecation.deprecatedAt;
    versionInfo.sunsetDate = deprecation.sunsetDate;

    return deprecation;
  }

  /**
   * Get version from request based on strategy
   */
  extractVersion(req, strategy = this.defaultStrategy) {
    switch (strategy) {
      case 'path':
        return this.extractVersionFromPath(req.path);
      case 'header':
        return this.extractVersionFromHeader(req.headers);
      case 'query':
        return this.extractVersionFromQuery(req.query);
      case 'content-negotiation':
        return this.extractVersionFromAcceptHeader(req.headers.accept);
      default:
        throw new Error(`Unknown versioning strategy: ${strategy}`);
    }
  }

  /**
   * Extract version from URL path
   */
  extractVersionFromPath(path) {
    const pathVersionMatch = path.match(/^\/v(\d+(?:\.\d+)?(?:\.\d+)?)/);
    if (pathVersionMatch) {
      let version = pathVersionMatch[1];
      // Ensure semantic version format
      if (!/^\d+\.\d+\.\d+$/.test(version)) {
        if (/^\d+$/.test(version)) {
          version = `${version}.0.0`;
        } else if (/^\d+\.\d+$/.test(version)) {
          version = `${version}.0`;
        }
      }
      return version;
    }
    return null;
  }

  /**
   * Extract version from headers
   */
  extractVersionFromHeader(headers) {
    return headers['api-version'] ||
           headers['accept-version'] ||
           headers['x-api-version'] ||
           null;
  }

  /**
   * Extract version from query parameters
   */
  extractVersionFromQuery(query) {
    return query.version || query.v || query.api_version || null;
  }

  /**
   * Extract version from Accept header (content negotiation)
   */
  extractVersionFromAcceptHeader(acceptHeader) {
    if (!acceptHeader) return null;

    // Parse Accept header for version parameter
    const versionMatch = acceptHeader.match(/version=([^;,\s]+)/);
    if (versionMatch) {
      return versionMatch[1];
    }

    // Parse vendor-specific media types
    const vendorMatch = acceptHeader.match(/application\/vnd\.[\w-]+\+json;version=([^;,\s]+)/);
    if (vendorMatch) {
      return vendorMatch[1];
    }

    return null;
  }

  /**
   * Resolve version to use (with fallback logic)
   */
  resolveVersion(requestedVersion) {
    // If no version requested, use current version
    if (!requestedVersion) {
      return this.currentVersion;
    }

    // Exact match
    if (this.supportedVersions.includes(requestedVersion)) {
      return requestedVersion;
    }

    // Semantic version range matching
    const compatibleVersion = this.supportedVersions.find(version =>
      semver.satisfies(version, `^${requestedVersion}`)
    );

    if (compatibleVersion) {
      return compatibleVersion;
    }

    // Find closest compatible version
    const sortedVersions = this.supportedVersions.sort(semver.rcompare);
    const closestVersion = sortedVersions.find(version =>
      semver.gte(version, requestedVersion)
    );

    return closestVersion || this.currentVersion;
  }

  /**
   * Validate if version is supported
   */
  isVersionSupported(version) {
    return this.supportedVersions.includes(version);
  }

  /**
   * Check if version is deprecated
   */
  isVersionDeprecated(version) {
    return this.deprecatedVersions.has(version);
  }

  /**
   * Get deprecation info for version
   */
  getDeprecationInfo(version) {
    return this.deprecatedVersions.get(version);
  }

  /**
   * Create versioning middleware
   */
  createVersioningMiddleware(options = {}) {
    const strategy = options.strategy || this.defaultStrategy;
    const strict = options.strict || false;

    return (req, res, next) => {
      try {
        // Extract version from request
        const requestedVersion = this.extractVersion(req, strategy);
        const resolvedVersion = this.resolveVersion(requestedVersion);

        // Validate version support
        if (strict && requestedVersion && !this.isVersionSupported(requestedVersion)) {
          return res.status(400).json({
            error: 'unsupported_version',
            message: `Version ${requestedVersion} is not supported`,
            supported_versions: this.supportedVersions
          });
        }

        // Add version info to request
        req.apiVersion = {
          requested: requestedVersion,
          resolved: resolvedVersion,
          strategy: strategy,
          isLatest: resolvedVersion === this.currentVersion
        };

        // Add deprecation warnings
        if (this.isVersionDeprecated(resolvedVersion)) {
          const deprecationInfo = this.getDeprecationInfo(resolvedVersion);

          res.set('Deprecation', 'true');
          res.set('Sunset', deprecationInfo.sunsetDate?.toISOString());
          res.set('Link', `<https://api.example.com/docs/migration>; rel="migration-guide"`);

          req.apiVersion.deprecated = true;
          req.apiVersion.deprecationInfo = deprecationInfo;
        }

        // Set response headers
        res.set('API-Version', resolvedVersion);
        res.set('API-Supported-Versions', this.supportedVersions.join(', '));

        next();
      } catch (error) {
        res.status(400).json({
          error: 'version_error',
          message: error.message
        });
      }
    };
  }

  /**
   * Version-aware route handler
   */
  createVersionedHandler(handlers) {
    return (req, res, next) => {
      const version = req.apiVersion?.resolved || this.currentVersion;

      // Find exact version handler
      let handler = handlers[version];

      if (!handler) {
        // Find compatible version handler
        const compatibleVersion = Object.keys(handlers)
          .sort(semver.rcompare)
          .find(v => semver.lte(v, version));

        handler = handlers[compatibleVersion];
      }

      if (!handler) {
        return res.status(500).json({
          error: 'no_handler',
          message: `No handler found for version ${version}`
        });
      }

      // Execute version-specific handler
      handler(req, res, next);
    };
  }
}

/**
 * URL Path Versioning Implementation
 */
class PathVersioning {
  constructor(app, versionManager) {
    this.app = app;
    this.versionManager = versionManager;
    this.versionedRoutes = new Map();
  }

  /**
   * Register versioned route
   */
  route(method, pattern, handlers) {
    Object.entries(handlers).forEach(([version, handler]) => {
      const versionedPath = `/v${version.split('.')[0]}${pattern}`;
      this.app[method.toLowerCase()](versionedPath,
        this.versionManager.createVersioningMiddleware({ strategy: 'path' }),
        (req, res, next) => {
          req.apiVersion.resolved = version;
          handler(req, res, next);
        }
      );
    });

    return this;
  }

  /**
   * Create version-specific router
   */
  createVersionedRouter(version) {
    const express = require('express');
    const router = express.Router();

    // Add version middleware to all routes in this router
    router.use(this.versionManager.createVersioningMiddleware({ strategy: 'path' }));

    // Validate that requests are for this version
    router.use((req, res, next) => {
      if (req.apiVersion.resolved !== version) {
        return res.status(400).json({
          error: 'version_mismatch',
          message: `This router handles version ${version}, but ${req.apiVersion.resolved} was requested`
        });
      }
      next();
    });

    return router;
  }
}

/**
 * Header-based Versioning Implementation
 */
class HeaderVersioning {
  constructor(versionManager) {
    this.versionManager = versionManager;
  }

  /**
   * Create header versioning middleware
   */
  middleware() {
    return this.versionManager.createVersioningMiddleware({ strategy: 'header' });
  }

  /**
   * Version-specific response transformer
   */
  createResponseTransformer() {
    return (req, res, next) => {
      const originalJson = res.json;

      res.json = function(data) {
        const version = req.apiVersion?.resolved;

        // Transform response based on version
        const transformedData = this.transformResponse(data, version);

        return originalJson.call(this, transformedData);
      }.bind(this);

      next();
    };
  }

  transformResponse(data, version) {
    // Version-specific transformations
    const transformations = {
      '1.0.0': (data) => data,
      '1.1.0': (data) => ({
        ...data,
        metadata: {
          version: '1.1.0',
          timestamp: new Date().toISOString()
        }
      }),
      '2.0.0': (data) => ({
        result: data,
        meta: {
          version: '2.0.0',
          generated_at: new Date().toISOString(),
          api_version: '2.0.0'
        }
      })
    };

    const transformer = transformations[version];
    return transformer ? transformer(data) : data;
  }
}

/**
 * Content Negotiation Versioning
 */
class ContentNegotiationVersioning {
  constructor(versionManager) {
    this.versionManager = versionManager;
    this.mediaTypes = new Map();
  }

  /**
   * Register media type for version
   */
  registerMediaType(version, mediaType) {
    this.mediaTypes.set(version, mediaType);
    return this;
  }

  /**
   * Create content negotiation middleware
   */
  middleware() {
    return (req, res, next) => {
      // Extract version from Accept header
      const version = this.versionManager.extractVersionFromAcceptHeader(req.headers.accept);
      const resolvedVersion = this.versionManager.resolveVersion(version);

      req.apiVersion = {
        requested: version,
        resolved: resolvedVersion,
        strategy: 'content-negotiation'
      };

      // Set appropriate Content-Type
      const mediaType = this.mediaTypes.get(resolvedVersion) || 'application/json';
      res.set('Content-Type', `${mediaType}; version=${resolvedVersion}`);

      next();
    };
  }
}

/**
 * Backward Compatibility Manager
 */
class BackwardCompatibilityManager {
  constructor() {
    this.transformers = new Map(); // version -> transformation functions
    this.fieldMappings = new Map(); // old_field -> new_field mappings per version
    this.deprecatedFields = new Map(); // version -> [deprecated_fields]
  }

  /**
   * Register transformation between versions
   */
  registerTransformation(fromVersion, toVersion, transformer) {
    const key = `${fromVersion}->${toVersion}`;
    this.transformers.set(key, transformer);
    return this;
  }

  /**
   * Register field mapping for version
   */
  registerFieldMapping(version, mappings) {
    this.fieldMappings.set(version, mappings);
    return this;
  }

  /**
   * Transform data for specific version
   */
  transformForVersion(data, targetVersion, currentVersion) {
    const key = `${currentVersion}->${targetVersion}`;
    const transformer = this.transformers.get(key);

    if (transformer) {
      return transformer(data);
    }

    // Default field mapping transformation
    return this.applyFieldMappings(data, targetVersion);
  }

  /**
   * Apply field mappings
   */
  applyFieldMappings(data, version) {
    const mappings = this.fieldMappings.get(version);
    if (!mappings) return data;

    const transformed = { ...data };

    Object.entries(mappings).forEach(([oldField, newField]) => {
      if (data[newField] !== undefined) {
        transformed[oldField] = data[newField];
      }
    });

    return transformed;
  }

  /**
   * Create backward compatibility middleware
   */
  createCompatibilityMiddleware() {
    return (req, res, next) => {
      const originalJson = res.json;

      res.json = function(data) {
        const targetVersion = req.apiVersion?.resolved;
        const currentVersion = req.apiVersion?.current || '2.0.0';

        // Apply transformations if needed
        if (targetVersion !== currentVersion) {
          data = this.transformForVersion(data, targetVersion, currentVersion);
        }

        return originalJson.call(this, data);
      }.bind(this);

      next();
    };
  }
}

/**
 * API Version Documentation Generator
 */
class VersionDocumentationGenerator {
  constructor(versionManager) {
    this.versionManager = versionManager;
    this.endpoints = new Map();
  }

  /**
   * Register endpoint documentation
   */
  registerEndpoint(path, method, versionDocs) {
    const key = `${method.toUpperCase()} ${path}`;
    this.endpoints.set(key, versionDocs);
    return this;
  }

  /**
   * Generate version compatibility matrix
   */
  generateCompatibilityMatrix() {
    const versions = this.versionManager.supportedVersions;
    const matrix = {};

    versions.forEach(version => {
      matrix[version] = {
        supported: true,
        deprecated: this.versionManager.isVersionDeprecated(version),
        deprecationInfo: this.versionManager.getDeprecationInfo(version),
        endpoints: this.getEndpointsForVersion(version)
      };
    });

    return matrix;
  }

  /**
   * Get endpoints available for specific version
   */
  getEndpointsForVersion(version) {
    const endpoints = [];

    this.endpoints.forEach((versionDocs, endpoint) => {
      if (versionDocs[version]) {
        endpoints.push({
          endpoint,
          ...versionDocs[version]
        });
      }
    });

    return endpoints;
  }

  /**
   * Generate migration guide
   */
  generateMigrationGuide(fromVersion, toVersion) {
    const guide = {
      from: fromVersion,
      to: toVersion,
      breaking_changes: [],
      new_features: [],
      deprecated_features: [],
      field_mappings: {},
      examples: []
    };

    // Compare endpoints between versions
    this.endpoints.forEach((versionDocs, endpoint) => {
      const fromDoc = versionDocs[fromVersion];
      const toDoc = versionDocs[toVersion];

      if (fromDoc && toDoc) {
        // Compare request/response schemas
        const changes = this.compareSchemas(fromDoc, toDoc);
        guide.breaking_changes.push(...changes.breaking);
        guide.new_features.push(...changes.new);
        guide.deprecated_features.push(...changes.deprecated);
      }
    });

    return guide;
  }

  compareSchemas(fromSchema, toSchema) {
    // Simplified schema comparison
    return {
      breaking: [],
      new: [],
      deprecated: []
    };
  }
}

/**
 * Example Usage Demonstrations
 */

// Example 1: Path-based versioning
async function examplePathVersioning() {
  const express = require('express');
  const app = express();

  const versionManager = new APIVersionManager({
    currentVersion: '2.0.0',
    supportedVersions: ['1.0.0', '1.1.0', '2.0.0']
  });

  // Register version handlers
  versionManager.registerVersion('1.0.0', null, {
    deprecated: true,
    deprecationDate: new Date('2024-01-01'),
    sunsetDate: new Date('2024-12-31')
  });

  const pathVersioning = new PathVersioning(app, versionManager);

  // Version-specific user endpoints
  pathVersioning.route('get', '/users/:id', {
    '1.0.0': (req, res) => {
      res.json({
        id: req.params.id,
        name: 'John Doe',
        email: 'john@example.com'
      });
    },
    '2.0.0': (req, res) => {
      res.json({
        user: {
          id: req.params.id,
          profile: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          metadata: {
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        }
      });
    }
  });

  console.log('Path versioning example set up');
}

// Example 2: Header-based versioning
async function exampleHeaderVersioning() {
  const express = require('express');
  const app = express();

  const versionManager = new APIVersionManager({
    currentVersion: '2.0.0',
    supportedVersions: ['1.0.0', '2.0.0']
  });

  const headerVersioning = new HeaderVersioning(versionManager);

  app.use(headerVersioning.middleware());
  app.use(headerVersioning.createResponseTransformer());

  app.get('/users/:id', versionManager.createVersionedHandler({
    '1.0.0': (req, res) => {
      res.json({ id: req.params.id, name: 'John Doe' });
    },
    '2.0.0': (req, res) => {
      res.json({
        id: req.params.id,
        name: 'John Doe',
        profile: { avatar_url: 'https://example.com/avatar.jpg' }
      });
    }
  }));

  console.log('Header versioning example set up');
}

// Example 3: Migration and deprecation
async function exampleVersionMigration() {
  const versionManager = new APIVersionManager({
    currentVersion: '3.0.0',
    supportedVersions: ['1.0.0', '2.0.0', '3.0.0']
  });

  // Deprecate v1.0.0
  const deprecation = versionManager.deprecateVersion('1.0.0', {
    reason: 'Security vulnerabilities and performance issues',
    sunsetDate: new Date('2024-12-31'),
    migrationGuide: 'https://api.example.com/docs/migration/v1-to-v2',
    recommendedVersion: '2.0.0'
  });

  console.log('Deprecation info:', deprecation);

  // Set up backward compatibility
  const compatibilityManager = new BackwardCompatibilityManager();

  compatibilityManager.registerFieldMapping('1.0.0', {
    'user_name': 'profile.name',
    'user_email': 'profile.email'
  });

  compatibilityManager.registerTransformation('2.0.0', '1.0.0', (data) => {
    // Transform v2 response to v1 format
    return {
      id: data.user.id,
      user_name: data.user.profile.name,
      user_email: data.user.profile.email
    };
  });

  console.log('Migration and compatibility rules configured');
}

module.exports = {
  APIVersionManager,
  PathVersioning,
  HeaderVersioning,
  ContentNegotiationVersioning,
  BackwardCompatibilityManager,
  VersionDocumentationGenerator,
  examplePathVersioning,
  exampleHeaderVersioning,
  exampleVersionMigration
};
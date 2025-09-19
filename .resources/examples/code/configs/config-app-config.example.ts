/**
 * @example Application Configuration Management
 *
 * Demonstrates:
 * - Type-safe configuration with runtime validation
 * - Environment variable handling and parsing
 * - Configuration schema validation with Zod
 * - Default value patterns and fallback strategies
 * - Nested configuration objects and hierarchies
 * - Multi-environment configuration management
 * - Feature flag implementation and toggling
 * - Secrets management and security best practices
 * - Configuration loading and caching patterns
 *
 * Key Patterns:
 * - Schema-driven configuration validation
 * - Environment-specific configuration loading
 * - Type-safe access to configuration values
 * - Validation error handling and reporting
 * - Configuration hot-reloading capabilities
 * - Secure handling of sensitive configuration data
 * - Configuration documentation and self-documenting schemas
 *
 * Usage Context: Application startup, environment configuration, feature flags
 * Complexity: Medium - shows comprehensive configuration patterns
 *
 * @see examples/code/patterns/api-user-service.example.ts for configuration usage
 * @see templates/code/configs/config.template.ts for configuration template
 */

import { z } from 'zod';

// Configuration schema for validation
const DatabaseConfigSchema = z.object({
  host: z.string().min(1, 'Database host is required'),
  port: z.number().int().min(1).max(65535),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Database username is required'),
  password: z.string().min(1, 'Database password is required'),
  poolSize: z.number().int().min(1).max(100).default(10),
  timeout: z.number().int().min(1000).default(30000),
  ssl: z.boolean().default(false),
});

const RedisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().int().min(1).max(65535).default(6379),
  password: z.string().optional(),
  db: z.number().int().min(0).max(15).default(0),
  keyPrefix: z.string().default('app:'),
});

const AuthConfigSchema = z.object({
  jwtSecret: z.string().min(32, 'JWT secret must be at least 32 characters'),
  jwtExpiresIn: z.string().default('24h'),
  refreshTokenExpiresIn: z.string().default('7d'),
  bcryptRounds: z.number().int().min(10).max(15).default(12),
  sessionTimeout: z.number().int().min(300).default(3600), // seconds
});

const ApiConfigSchema = z.object({
  port: z.number().int().min(1).max(65535).default(3000),
  host: z.string().default('0.0.0.0'),
  corsOrigins: z.array(z.string()).default([]),
  rateLimitWindow: z.number().int().min(1000).default(900000), // 15 minutes
  rateLimitMax: z.number().int().min(1).default(100),
  requestTimeout: z.number().int().min(1000).default(30000),
  bodyLimit: z.string().default('10mb'),
});

const LoggingConfigSchema = z.object({
  level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  format: z.enum(['json', 'pretty']).default('json'),
  file: z.object({
    enabled: z.boolean().default(false),
    filename: z.string().default('app.log'),
    maxSize: z.string().default('10m'),
    maxFiles: z.number().int().min(1).default(5),
  }).default({}),
});

const AppConfigSchema = z.object({
  // Environment
  nodeEnv: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  
  // Core services
  database: DatabaseConfigSchema,
  redis: RedisConfigSchema.optional(),
  auth: AuthConfigSchema,
  api: ApiConfigSchema,
  logging: LoggingConfigSchema,
  
  // Feature flags
  features: z.object({
    enableRegistration: z.boolean().default(true),
    enableEmailVerification: z.boolean().default(false),
    enableTwoFactorAuth: z.boolean().default(false),
    enableApiVersioning: z.boolean().default(true),
    maintenanceMode: z.boolean().default(false),
  }).default({}),
  
  // External services
  email: z.object({
    provider: z.enum(['smtp', 'sendgrid', 'ses']).default('smtp'),
    from: z.string().email().default('noreply@example.com'),
    smtp: z.object({
      host: z.string().optional(),
      port: z.number().int().min(1).max(65535).optional(),
      secure: z.boolean().default(false),
      auth: z.object({
        user: z.string().optional(),
        pass: z.string().optional(),
      }).optional(),
    }).optional(),
    sendgrid: z.object({
      apiKey: z.string().optional(),
    }).optional(),
    ses: z.object({
      region: z.string().optional(),
      accessKeyId: z.string().optional(),
      secretAccessKey: z.string().optional(),
    }).optional(),
  }).default({}),
  
  // Storage
  storage: z.object({
    provider: z.enum(['local', 's3', 'gcs']).default('local'),
    local: z.object({
      uploadDir: z.string().default('./uploads'),
      maxFileSize: z.string().default('10mb'),
    }).optional(),
    s3: z.object({
      bucket: z.string().optional(),
      region: z.string().optional(),
      accessKeyId: z.string().optional(),
      secretAccessKey: z.string().optional(),
    }).optional(),
  }).default({}),
});

// Type inference from schema
export type AppConfig = z.infer<typeof AppConfigSchema>;
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
export type AuthConfig = z.infer<typeof AuthConfigSchema>;

// Configuration loading utility
export class ConfigLoader {
  private static instance: AppConfig | null = null;

  /**
   * Load configuration from environment variables
   */
  static load(): AppConfig {
    if (this.instance) {
      return this.instance;
    }

    const rawConfig = {
      nodeEnv: process.env.NODE_ENV,
      
      // Database configuration
      database: {
        host: process.env.DB_HOST,
        port: this.parseNumber(process.env.DB_PORT),
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        poolSize: this.parseNumber(process.env.DB_POOL_SIZE),
        timeout: this.parseNumber(process.env.DB_TIMEOUT),
        ssl: this.parseBoolean(process.env.DB_SSL),
      },
      
      // Redis configuration (optional)
      redis: process.env.REDIS_URL ? {
        host: process.env.REDIS_HOST,
        port: this.parseNumber(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        db: this.parseNumber(process.env.REDIS_DB),
        keyPrefix: process.env.REDIS_KEY_PREFIX,
      } : undefined,
      
      // Authentication configuration
      auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN,
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        bcryptRounds: this.parseNumber(process.env.BCRYPT_ROUNDS),
        sessionTimeout: this.parseNumber(process.env.SESSION_TIMEOUT),
      },
      
      // API configuration
      api: {
        port: this.parseNumber(process.env.PORT),
        host: process.env.HOST,
        corsOrigins: this.parseArray(process.env.CORS_ORIGINS),
        rateLimitWindow: this.parseNumber(process.env.RATE_LIMIT_WINDOW),
        rateLimitMax: this.parseNumber(process.env.RATE_LIMIT_MAX),
        requestTimeout: this.parseNumber(process.env.REQUEST_TIMEOUT),
        bodyLimit: process.env.BODY_LIMIT,
      },
      
      // Logging configuration
      logging: {
        level: process.env.LOG_LEVEL,
        format: process.env.LOG_FORMAT,
        file: {
          enabled: this.parseBoolean(process.env.LOG_FILE_ENABLED),
          filename: process.env.LOG_FILE_NAME,
          maxSize: process.env.LOG_FILE_MAX_SIZE,
          maxFiles: this.parseNumber(process.env.LOG_FILE_MAX_FILES),
        },
      },
      
      // Feature flags
      features: {
        enableRegistration: this.parseBoolean(process.env.ENABLE_REGISTRATION),
        enableEmailVerification: this.parseBoolean(process.env.ENABLE_EMAIL_VERIFICATION),
        enableTwoFactorAuth: this.parseBoolean(process.env.ENABLE_2FA),
        enableApiVersioning: this.parseBoolean(process.env.ENABLE_API_VERSIONING),
        maintenanceMode: this.parseBoolean(process.env.MAINTENANCE_MODE),
      },
      
      // Email configuration
      email: {
        provider: process.env.EMAIL_PROVIDER,
        from: process.env.EMAIL_FROM,
        smtp: process.env.SMTP_HOST ? {
          host: process.env.SMTP_HOST,
          port: this.parseNumber(process.env.SMTP_PORT),
          secure: this.parseBoolean(process.env.SMTP_SECURE),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        } : undefined,
        sendgrid: process.env.SENDGRID_API_KEY ? {
          apiKey: process.env.SENDGRID_API_KEY,
        } : undefined,
        ses: process.env.AWS_SES_REGION ? {
          region: process.env.AWS_SES_REGION,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        } : undefined,
      },
      
      // Storage configuration
      storage: {
        provider: process.env.STORAGE_PROVIDER,
        local: {
          uploadDir: process.env.UPLOAD_DIR,
          maxFileSize: process.env.MAX_FILE_SIZE,
        },
        s3: process.env.S3_BUCKET ? {
          bucket: process.env.S3_BUCKET,
          region: process.env.S3_REGION,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        } : undefined,
      },
    };

    try {
      this.instance = AppConfigSchema.parse(rawConfig);
      return this.instance;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(
          (err) => `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Configuration validation failed:\n${errorMessages.join('\n')}`);
      }
      throw error;
    }
  }

  /**
   * Get current configuration (must call load() first)
   */
  static get(): AppConfig {
    if (!this.instance) {
      throw new Error('Configuration not loaded. Call ConfigLoader.load() first.');
    }
    return this.instance;
  }

  /**
   * Validate configuration without loading
   */
  static validate(config: unknown): AppConfig {
    return AppConfigSchema.parse(config);
  }

  /**
   * Reset configuration (useful for testing)
   */
  static reset(): void {
    this.instance = null;
  }

  // Helper methods for parsing environment variables
  private static parseNumber(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  }

  private static parseBoolean(value: string | undefined): boolean | undefined {
    if (!value) return undefined;
    return value.toLowerCase() === 'true';
  }

  private static parseArray(value: string | undefined): string[] | undefined {
    if (!value) return undefined;
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
}

// Configuration utilities
export class ConfigUtils {
  /**
   * Check if running in production
   */
  static isProduction(config: AppConfig): boolean {
    return config.nodeEnv === 'production';
  }

  /**
   * Check if running in development
   */
  static isDevelopment(config: AppConfig): boolean {
    return config.nodeEnv === 'development';
  }

  /**
   * Check if running in test environment
   */
  static isTest(config: AppConfig): boolean {
    return config.nodeEnv === 'test';
  }

  /**
   * Get database connection string
   */
  static getDatabaseUrl(config: AppConfig): string {
    const { database } = config;
    const sslParam = database.ssl ? '?sslmode=require' : '';
    return `postgresql://${database.username}:${database.password}@${database.host}:${database.port}/${database.database}${sslParam}`;
  }

  /**
   * Get Redis connection string
   */
  static getRedisUrl(config: AppConfig): string | undefined {
    const { redis } = config;
    if (!redis) return undefined;
    
    const auth = redis.password ? `:${redis.password}@` : '';
    return `redis://${auth}${redis.host}:${redis.port}/${redis.db}`;
  }

  /**
   * Mask sensitive configuration for logging
   */
  static maskSensitive(config: AppConfig): Partial<AppConfig> {
    return {
      ...config,
      database: {
        ...config.database,
        password: '***masked***',
      },
      auth: {
        ...config.auth,
        jwtSecret: '***masked***',
      },
      redis: config.redis ? {
        ...config.redis,
        password: config.redis.password ? '***masked***' : undefined,
      } : undefined,
      email: {
        ...config.email,
        smtp: config.email.smtp ? {
          ...config.email.smtp,
          auth: config.email.smtp.auth ? {
            ...config.email.smtp.auth,
            pass: config.email.smtp.auth.pass ? '***masked***' : undefined,
          } : undefined,
        } : undefined,
        sendgrid: config.email.sendgrid ? {
          apiKey: '***masked***',
        } : undefined,
        ses: config.email.ses ? {
          ...config.email.ses,
          secretAccessKey: '***masked***',
        } : undefined,
      },
    };
  }
}

// Usage example:
/*
// Load configuration
const config = ConfigLoader.load();

// Use configuration
console.log('Starting server on port:', config.api.port);
console.log('Database host:', config.database.host);
console.log('Environment:', config.nodeEnv);

// Check environment
if (ConfigUtils.isProduction(config)) {
  console.log('Running in production mode');
}

// Get connection strings
const dbUrl = ConfigUtils.getDatabaseUrl(config);
const redisUrl = ConfigUtils.getRedisUrl(config);

// Log masked config (safe for logs)
console.log('Configuration:', ConfigUtils.maskSensitive(config));
*/

export default ConfigLoader;
/**
 * @template {{SERVICE_NAME}} Service
 *
 * Purpose: {{SERVICE_PURPOSE}}
 * Responsibilities: {{SERVICE_RESPONSIBILITIES}}
 *
 * Generated from: templates/code/api/service.template.ts
 * Created: {{CREATED_DATE}}
 * Author: {{AUTHOR_NAME}}
 */

import { {{IMPORTS}} } from '{{IMPORT_PATHS}}';

// Type definitions
interface {{SERVICE_NAME}}Config {
  {{CONFIG_PROPERTY}}: {{CONFIG_TYPE}};
  timeout?: number;
  retryAttempts?: number;
}

interface {{REQUEST_TYPE}} {
  {{REQUEST_PROPERTY}}: {{REQUEST_PROPERTY_TYPE}};
}

interface {{RESPONSE_TYPE}} {
  {{RESPONSE_PROPERTY}}: {{RESPONSE_PROPERTY_TYPE}};
  metadata?: {
    timestamp: string;
    requestId: string;
  };
}

interface {{ERROR_TYPE}} {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Custom error classes
export class {{SERVICE_NAME}}Error extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = '{{SERVICE_NAME}}Error';
  }
}

export class {{SERVICE_NAME}}ValidationError extends {{SERVICE_NAME}}Error {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, details);
    this.name = '{{SERVICE_NAME}}ValidationError';
  }
}

export class {{SERVICE_NAME}}NetworkError extends {{SERVICE_NAME}}Error {
  constructor(message: string, details?: Record<string, unknown>) {
    super('NETWORK_ERROR', message, details);
    this.name = '{{SERVICE_NAME}}NetworkError';
  }
}

/**
 * {{SERVICE_NAME}} - {{SERVICE_DESCRIPTION}}
 */
export class {{SERVICE_NAME}} {
  private config: {{SERVICE_NAME}}Config;
  private logger: {{LOGGER_TYPE}};

  constructor(config: {{SERVICE_NAME}}Config, logger: {{LOGGER_TYPE}}) {
    this.config = {
      timeout: 5000,
      retryAttempts: 3,
      ...config,
    };
    this.logger = logger;
  }

  /**
   * {{METHOD_NAME}} - {{METHOD_DESCRIPTION}}
   *
   * @param request - {{REQUEST_TYPE}}
   * @returns Promise<{{RESPONSE_TYPE}}>
   * @throws {{SERVICE_NAME}}Error
   */
  async {{METHOD_NAME}}(request: {{REQUEST_TYPE}}): Promise<{{RESPONSE_TYPE}}> {
    try {
      // Input validation
      this.validate{{REQUEST_TYPE}}(request);

      // Log request
      this.logger.info('{{SERVICE_NAME}}.{{METHOD_NAME}}', {
        {{LOG_CONTEXT}},
      });

      // Execute business logic
      const result = await this.execute{{METHOD_NAME}}(request);

      // Post-process result
      const response = await this.processResponse(result);

      // Log success
      this.logger.info('{{SERVICE_NAME}}.{{METHOD_NAME}} completed', {
        {{SUCCESS_LOG_CONTEXT}},
      });

      return response;
    } catch (error) {
      // Log error
      this.logger.error('{{SERVICE_NAME}}.{{METHOD_NAME}} failed', {
        error: error.message,
        {{ERROR_LOG_CONTEXT}},
      });

      // Re-throw as service-specific error
      if (error instanceof {{SERVICE_NAME}}Error) {
        throw error;
      }

      throw new {{SERVICE_NAME}}Error(
        'INTERNAL_ERROR',
        `{{METHOD_NAME}} failed: ${error.message}`,
        { originalError: error }
      );
    }
  }

  /**
   * Validates {{REQUEST_TYPE}} input
   */
  private validate{{REQUEST_TYPE}}(request: {{REQUEST_TYPE}}): void {
    if (!request.{{REQUEST_PROPERTY}}) {
      throw new {{SERVICE_NAME}}ValidationError(
        '{{REQUEST_PROPERTY}} is required',
        { request }
      );
    }

    // Additional validation logic
    {{ADDITIONAL_VALIDATION}}
  }

  /**
   * Executes the core business logic for {{METHOD_NAME}}
   */
  private async execute{{METHOD_NAME}}(request: {{REQUEST_TYPE}}): Promise<{{INTERNAL_RESULT_TYPE}}> {
    // Implement business logic here
    {{BUSINESS_LOGIC_IMPLEMENTATION}}

    // Example implementation
    const result = await this.callExternalService(request);
    return this.transformResult(result);
  }

  /**
   * Calls external service with retry logic
   */
  private async callExternalService(request: {{REQUEST_TYPE}}): Promise<{{EXTERNAL_RESPONSE_TYPE}}> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        // Make the external call
        const response = await {{EXTERNAL_SERVICE_CALL}};
        return response;
      } catch (error) {
        lastError = error;

        if (attempt < this.config.retryAttempts) {
          const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
          await this.delay(delay);

          this.logger.warn(`{{SERVICE_NAME}} retry attempt ${attempt}`, {
            error: error.message,
            nextRetryIn: delay,
          });
        }
      }
    }

    throw new {{SERVICE_NAME}}NetworkError(
      `Failed after ${this.config.retryAttempts} attempts`,
      { lastError: lastError.message }
    );
  }

  /**
   * Transforms external result to internal format
   */
  private transformResult(externalResult: {{EXTERNAL_RESPONSE_TYPE}}): {{INTERNAL_RESULT_TYPE}} {
    return {
      {{RESULT_TRANSFORMATION}}
    };
  }

  /**
   * Processes and enriches the response
   */
  private async processResponse(result: {{INTERNAL_RESULT_TYPE}}): Promise<{{RESPONSE_TYPE}}> {
    return {
      {{RESPONSE_CONSTRUCTION}},
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
      },
    };
  }

  /**
   * Generates a unique request ID
   */
  private generateRequestId(): string {
    return `{{SERVICE_NAME_LOWER}}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Factory function
export function create{{SERVICE_NAME}}(
  config: {{SERVICE_NAME}}Config,
  logger: {{LOGGER_TYPE}}
): {{SERVICE_NAME}} {
  return new {{SERVICE_NAME}}(config, logger);
}

// Type exports
export type {
  {{SERVICE_NAME}}Config,
  {{REQUEST_TYPE}},
  {{RESPONSE_TYPE}},
  {{ERROR_TYPE}},
};

/**
 * Usage Example:
 *
 * ```typescript
 * import { {{SERVICE_NAME}}, create{{SERVICE_NAME}} } from './{{SERVICE_NAME}}';
 *
 * // Create service instance
 * const {{SERVICE_NAME_LOWER}} = create{{SERVICE_NAME}}(
 *   {
 *     {{CONFIG_PROPERTY}}: {{EXAMPLE_CONFIG_VALUE}},
 *     timeout: 10000,
 *     retryAttempts: 3,
 *   },
 *   logger
 * );
 *
 * // Use the service
 * try {
 *   const result = await {{SERVICE_NAME_LOWER}}.{{METHOD_NAME}}({
 *     {{REQUEST_PROPERTY}}: {{EXAMPLE_REQUEST_VALUE}},
 *   });
 *   console.log('Result:', result);
 * } catch (error) {
 *   if (error instanceof {{SERVICE_NAME}}Error) {
 *     console.error('Service error:', error.code, error.message);
 *   } else {
 *     console.error('Unexpected error:', error);
 *   }
 * }
 * ```
 */
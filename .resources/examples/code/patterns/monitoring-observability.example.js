/**
 * Monitoring and Observability Patterns
 *
 * Comprehensive implementation of monitoring, logging, metrics, and tracing:
 * - Structured logging with multiple transports
 * - Application metrics collection and aggregation
 * - Distributed tracing with correlation IDs
 * - Health checks and readiness probes
 * - Performance monitoring and alerting
 * - Error tracking and aggregation
 * - Custom dashboards and visualization
 * - SLA/SLO monitoring and reporting
 */

const EventEmitter = require('events');
const crypto = require('crypto');

/**
 * Structured Logger Implementation
 */
class StructuredLogger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.service = options.service || 'unknown-service';
    this.version = options.version || '1.0.0';
    this.environment = options.environment || 'development';
    this.transports = options.transports || [new ConsoleTransport()];
    this.contextStore = new Map(); // For request-scoped context
    this.hooks = {
      beforeLog: [],
      afterLog: []
    };

    // Log levels
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    };
  }

  /**
   * Add logging hook
   */
  addHook(type, hook) {
    if (this.hooks[type]) {
      this.hooks[type].push(hook);
    }
  }

  /**
   * Set request context
   */
  setContext(contextId, context) {
    this.contextStore.set(contextId, context);
  }

  /**
   * Get request context
   */
  getContext(contextId) {
    return this.contextStore.get(contextId) || {};
  }

  /**
   * Clear request context
   */
  clearContext(contextId) {
    this.contextStore.delete(contextId);
  }

  /**
   * Log message with level
   */
  async log(level, message, data = {}, contextId = null) {
    if (this.levels[level] > this.levels[this.level]) {
      return; // Skip if level is below threshold
    }

    const context = contextId ? this.getContext(contextId) : {};

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.service,
      version: this.version,
      environment: this.environment,
      ...context,
      ...data,
      pid: process.pid,
      hostname: require('os').hostname()
    };

    // Execute before hooks
    for (const hook of this.hooks.beforeLog) {
      await hook(logEntry);
    }

    // Send to transports
    for (const transport of this.transports) {
      await transport.write(logEntry);
    }

    // Execute after hooks
    for (const hook of this.hooks.afterLog) {
      await hook(logEntry);
    }
  }

  error(message, data, contextId) {
    return this.log('error', message, data, contextId);
  }

  warn(message, data, contextId) {
    return this.log('warn', message, data, contextId);
  }

  info(message, data, contextId) {
    return this.log('info', message, data, contextId);
  }

  debug(message, data, contextId) {
    return this.log('debug', message, data, contextId);
  }

  trace(message, data, contextId) {
    return this.log('trace', message, data, contextId);
  }

  /**
   * Create child logger with additional context
   */
  child(additionalContext) {
    const childLogger = new StructuredLogger({
      level: this.level,
      service: this.service,
      version: this.version,
      environment: this.environment,
      transports: this.transports
    });

    // Add default context to all logs
    childLogger.defaultContext = { ...this.defaultContext, ...additionalContext };

    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = async function(level, message, data = {}, contextId = null) {
      const mergedData = { ...this.defaultContext, ...data };
      return originalLog(level, message, mergedData, contextId);
    };

    return childLogger;
  }
}

/**
 * Console Transport for logging
 */
class ConsoleTransport {
  async write(logEntry) {
    const colorMap = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m',  // Yellow
      info: '\x1b[36m',  // Cyan
      debug: '\x1b[37m', // White
      trace: '\x1b[90m'  // Gray
    };

    const reset = '\x1b[0m';
    const color = colorMap[logEntry.level] || reset;

    console.log(`${color}[${logEntry.timestamp}] ${logEntry.level.toUpperCase()}: ${logEntry.message}${reset}`);

    if (Object.keys(logEntry).length > 7) {
      const { timestamp, level, message, service, version, environment, pid, hostname, ...extra } = logEntry;
      if (Object.keys(extra).length > 0) {
        console.log(`${color}  Data:${reset}`, JSON.stringify(extra, null, 2));
      }
    }
  }
}

/**
 * File Transport for logging
 */
class FileTransport {
  constructor(options = {}) {
    this.filename = options.filename || 'app.log';
    this.maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB
    this.maxFiles = options.maxFiles || 5;
    this.writeQueue = [];
    this.writing = false;
  }

  async write(logEntry) {
    return new Promise((resolve) => {
      this.writeQueue.push({ logEntry, resolve });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.writing || this.writeQueue.length === 0) return;

    this.writing = true;

    while (this.writeQueue.length > 0) {
      const { logEntry, resolve } = this.writeQueue.shift();
      await this.writeToFile(logEntry);
      resolve();
    }

    this.writing = false;
  }

  async writeToFile(logEntry) {
    const fs = require('fs').promises;
    const logLine = JSON.stringify(logEntry) + '\n';

    try {
      await fs.appendFile(this.filename, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
}

/**
 * Metrics Collection System
 */
class MetricsCollector extends EventEmitter {
  constructor(options = {}) {
    super();
    this.metrics = new Map();
    this.labels = options.labels || {};
    this.flushInterval = options.flushInterval || 60000; // 1 minute
    this.retentionPeriod = options.retentionPeriod || 3600000; // 1 hour

    // Start periodic flush
    this.flushTimer = setInterval(() => this.flush(), this.flushInterval);

    // Built-in metrics
    this.initializeBuiltinMetrics();
  }

  /**
   * Initialize built-in system metrics
   */
  initializeBuiltinMetrics() {
    // Process metrics
    setInterval(() => {
      const memUsage = process.memoryUsage();
      this.gauge('process.memory.heap_used', memUsage.heapUsed);
      this.gauge('process.memory.heap_total', memUsage.heapTotal);
      this.gauge('process.memory.external', memUsage.external);
      this.gauge('process.memory.rss', memUsage.rss);

      const cpuUsage = process.cpuUsage();
      this.gauge('process.cpu.user', cpuUsage.user);
      this.gauge('process.cpu.system', cpuUsage.system);

      this.gauge('process.uptime', process.uptime());
    }, 5000);

    // Event loop lag
    this.measureEventLoopLag();
  }

  /**
   * Measure event loop lag
   */
  measureEventLoopLag() {
    let start = process.hrtime.bigint();

    setImmediate(() => {
      const lag = Number(process.hrtime.bigint() - start) / 1e6; // Convert to milliseconds
      this.histogram('nodejs.eventloop.lag', lag);

      // Schedule next measurement
      setTimeout(() => this.measureEventLoopLag(), 1000);
      start = process.hrtime.bigint();
    });
  }

  /**
   * Counter metric - monotonically increasing value
   */
  counter(name, value = 1, labels = {}) {
    const key = this.buildMetricKey(name, labels);
    const existing = this.metrics.get(key) || { type: 'counter', value: 0, timestamps: [] };

    existing.value += value;
    existing.timestamps.push(Date.now());
    existing.labels = { ...this.labels, ...labels };

    this.metrics.set(key, existing);
    this.emit('metric', { type: 'counter', name, value: existing.value, labels: existing.labels });

    return existing.value;
  }

  /**
   * Gauge metric - current value
   */
  gauge(name, value, labels = {}) {
    const key = this.buildMetricKey(name, labels);
    const metric = {
      type: 'gauge',
      value,
      timestamp: Date.now(),
      labels: { ...this.labels, ...labels }
    };

    this.metrics.set(key, metric);
    this.emit('metric', { type: 'gauge', name, value, labels: metric.labels });

    return value;
  }

  /**
   * Histogram metric - distribution of values
   */
  histogram(name, value, labels = {}) {
    const key = this.buildMetricKey(name, labels);
    const existing = this.metrics.get(key) || {
      type: 'histogram',
      values: [],
      count: 0,
      sum: 0,
      buckets: new Map(),
      labels: { ...this.labels, ...labels }
    };

    existing.values.push({ value, timestamp: Date.now() });
    existing.count++;
    existing.sum += value;

    // Update buckets (predefined bucket boundaries)
    const buckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
    for (const bucket of buckets) {
      if (value <= bucket) {
        existing.buckets.set(bucket, (existing.buckets.get(bucket) || 0) + 1);
      }
    }

    this.metrics.set(key, existing);
    this.emit('metric', { type: 'histogram', name, value, labels: existing.labels });

    return existing;
  }

  /**
   * Summary metric - quantiles over sliding time window
   */
  summary(name, value, labels = {}) {
    const key = this.buildMetricKey(name, labels);
    const existing = this.metrics.get(key) || {
      type: 'summary',
      values: [],
      count: 0,
      sum: 0,
      labels: { ...this.labels, ...labels }
    };

    existing.values.push({ value, timestamp: Date.now() });
    existing.count++;
    existing.sum += value;

    // Keep only recent values (sliding window)
    const cutoff = Date.now() - this.retentionPeriod;
    existing.values = existing.values.filter(v => v.timestamp > cutoff);

    this.metrics.set(key, existing);
    this.emit('metric', { type: 'summary', name, value, labels: existing.labels });

    return existing;
  }

  /**
   * Time a function execution
   */
  time(name, labels = {}) {
    const start = process.hrtime.bigint();

    return {
      end: () => {
        const duration = Number(process.hrtime.bigint() - start) / 1e6; // Convert to milliseconds
        this.histogram(name, duration, labels);
        return duration;
      }
    };
  }

  /**
   * Build metric key from name and labels
   */
  buildMetricKey(name, labels) {
    const labelPairs = Object.entries({ ...this.labels, ...labels })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}="${value}"`)
      .join(',');

    return labelPairs ? `${name}{${labelPairs}}` : name;
  }

  /**
   * Get metric value
   */
  getMetric(name, labels = {}) {
    const key = this.buildMetricKey(name, labels);
    return this.metrics.get(key);
  }

  /**
   * Get all metrics
   */
  getAllMetrics() {
    const result = {};
    for (const [key, metric] of this.metrics.entries()) {
      result[key] = metric;
    }
    return result;
  }

  /**
   * Get aggregated metrics
   */
  getAggregatedMetrics() {
    const aggregated = {};

    for (const [key, metric] of this.metrics.entries()) {
      const [name] = key.split('{');

      if (metric.type === 'histogram') {
        aggregated[name] = {
          count: metric.count,
          sum: metric.sum,
          avg: metric.count > 0 ? metric.sum / metric.count : 0,
          p50: this.calculatePercentile(metric.values, 0.5),
          p95: this.calculatePercentile(metric.values, 0.95),
          p99: this.calculatePercentile(metric.values, 0.99)
        };
      } else if (metric.type === 'summary') {
        aggregated[name] = {
          count: metric.count,
          sum: metric.sum,
          avg: metric.count > 0 ? metric.sum / metric.count : 0,
          min: Math.min(...metric.values.map(v => v.value)),
          max: Math.max(...metric.values.map(v => v.value))
        };
      } else {
        aggregated[name] = metric.value;
      }
    }

    return aggregated;
  }

  /**
   * Calculate percentile from values
   */
  calculatePercentile(values, percentile) {
    if (values.length === 0) return 0;

    const sorted = values.map(v => v.value).sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Flush metrics to storage/external systems
   */
  flush() {
    const metrics = this.getAllMetrics();
    this.emit('flush', metrics);

    // Clean up old histogram/summary values
    for (const [key, metric] of this.metrics.entries()) {
      if (metric.type === 'histogram' || metric.type === 'summary') {
        const cutoff = Date.now() - this.retentionPeriod;
        if (metric.values) {
          metric.values = metric.values.filter(v => v.timestamp > cutoff);
        }
      }
    }
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics.clear();
    this.emit('reset');
  }

  /**
   * Destroy collector
   */
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }
}

/**
 * Distributed Tracing Implementation
 */
class DistributedTracer {
  constructor(options = {}) {
    this.serviceName = options.serviceName || 'unknown-service';
    this.spans = new Map();
    this.activeSpans = new Map(); // contextId -> spanId
    this.samplingRate = options.samplingRate || 1.0;
    this.exporters = options.exporters || [new ConsoleSpanExporter()];
  }

  /**
   * Start a new span
   */
  startSpan(name, options = {}) {
    // Check sampling
    if (Math.random() > this.samplingRate) {
      return new NoOpSpan();
    }

    const spanId = crypto.randomUUID();
    const traceId = options.traceId || crypto.randomUUID();
    const parentSpanId = options.parentSpanId || null;

    const span = new Span({
      spanId,
      traceId,
      parentSpanId,
      name,
      serviceName: this.serviceName,
      startTime: Date.now(),
      tags: options.tags || {},
      logs: []
    });

    this.spans.set(spanId, span);

    // Set as active span if context provided
    if (options.contextId) {
      this.activeSpans.set(options.contextId, spanId);
    }

    return span;
  }

  /**
   * Get active span for context
   */
  getActiveSpan(contextId) {
    const spanId = this.activeSpans.get(contextId);
    return spanId ? this.spans.get(spanId) : null;
  }

  /**
   * Finish span and export
   */
  finishSpan(span) {
    if (span.finished) return;

    span.finished = true;
    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;

    // Export to configured exporters
    for (const exporter of this.exporters) {
      exporter.export(span);
    }

    // Clean up
    this.spans.delete(span.spanId);
  }

  /**
   * Create child span from active span
   */
  createChildSpan(name, contextId, options = {}) {
    const parentSpan = this.getActiveSpan(contextId);

    if (parentSpan) {
      return this.startSpan(name, {
        traceId: parentSpan.traceId,
        parentSpanId: parentSpan.spanId,
        contextId,
        ...options
      });
    }

    return this.startSpan(name, { contextId, ...options });
  }

  /**
   * Extract trace context from headers
   */
  extractTraceContext(headers) {
    const traceParent = headers['traceparent'];
    if (traceParent) {
      // Parse W3C trace context format: version-trace_id-parent_id-trace_flags
      const parts = traceParent.split('-');
      if (parts.length === 4) {
        return {
          traceId: parts[1],
          parentSpanId: parts[2],
          traceFlags: parts[3]
        };
      }
    }

    return null;
  }

  /**
   * Inject trace context into headers
   */
  injectTraceContext(span, headers = {}) {
    if (span && span.traceId && span.spanId) {
      headers['traceparent'] = `00-${span.traceId}-${span.spanId}-01`;
    }
    return headers;
  }
}

/**
 * Span implementation
 */
class Span {
  constructor(options) {
    this.spanId = options.spanId;
    this.traceId = options.traceId;
    this.parentSpanId = options.parentSpanId;
    this.name = options.name;
    this.serviceName = options.serviceName;
    this.startTime = options.startTime;
    this.endTime = null;
    this.duration = null;
    this.tags = new Map(Object.entries(options.tags || {}));
    this.logs = [];
    this.finished = false;
  }

  /**
   * Set tag on span
   */
  setTag(key, value) {
    this.tags.set(key, value);
    return this;
  }

  /**
   * Set multiple tags
   */
  setTags(tags) {
    for (const [key, value] of Object.entries(tags)) {
      this.tags.set(key, value);
    }
    return this;
  }

  /**
   * Log event with timestamp
   */
  log(event, data = {}) {
    this.logs.push({
      timestamp: Date.now(),
      event,
      data
    });
    return this;
  }

  /**
   * Mark span as error
   */
  setError(error) {
    this.setTag('error', true);
    this.setTag('error.kind', error.name || 'Error');
    this.setTag('error.message', error.message);
    if (error.stack) {
      this.setTag('error.stack', error.stack);
    }
    return this;
  }

  /**
   * Get span data for export
   */
  toJSON() {
    return {
      spanId: this.spanId,
      traceId: this.traceId,
      parentSpanId: this.parentSpanId,
      name: this.name,
      serviceName: this.serviceName,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
      tags: Object.fromEntries(this.tags),
      logs: this.logs,
      finished: this.finished
    };
  }
}

/**
 * No-op span for when sampling is disabled
 */
class NoOpSpan {
  setTag() { return this; }
  setTags() { return this; }
  log() { return this; }
  setError() { return this; }
  toJSON() { return {}; }
}

/**
 * Console span exporter
 */
class ConsoleSpanExporter {
  export(span) {
    console.log('Span exported:', JSON.stringify(span.toJSON(), null, 2));
  }
}

/**
 * Health Check System
 */
class HealthCheckSystem {
  constructor(options = {}) {
    this.checks = new Map();
    this.timeout = options.timeout || 5000;
    this.cache = new Map();
    this.cacheTTL = options.cacheTTL || 30000; // 30 seconds
  }

  /**
   * Register health check
   */
  registerCheck(name, checkFunction, options = {}) {
    this.checks.set(name, {
      name,
      check: checkFunction,
      critical: options.critical || false,
      timeout: options.timeout || this.timeout,
      tags: options.tags || []
    });
  }

  /**
   * Run all health checks
   */
  async runHealthChecks() {
    const results = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {},
      summary: {
        total: this.checks.size,
        passed: 0,
        failed: 0,
        critical_failed: 0
      }
    };

    const checkPromises = Array.from(this.checks.entries()).map(async ([name, checkConfig]) => {
      // Check cache first
      const cacheKey = `healthcheck:${name}`;
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return [name, cached.result];
      }

      // Run check with timeout
      const result = await this.runSingleCheck(name, checkConfig);

      // Cache result
      this.cache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });

      return [name, result];
    });

    const checkResults = await Promise.allSettled(checkPromises);

    for (const promiseResult of checkResults) {
      if (promiseResult.status === 'fulfilled') {
        const [name, result] = promiseResult.value;
        results.checks[name] = result;

        if (result.status === 'healthy') {
          results.summary.passed++;
        } else {
          results.summary.failed++;
          const checkConfig = this.checks.get(name);
          if (checkConfig.critical) {
            results.summary.critical_failed++;
            results.status = 'unhealthy';
          }
        }
      } else {
        results.summary.failed++;
      }
    }

    // Overall status determination
    if (results.summary.critical_failed > 0) {
      results.status = 'unhealthy';
    } else if (results.summary.failed > 0) {
      results.status = 'degraded';
    }

    return results;
  }

  /**
   * Run single health check with timeout
   */
  async runSingleCheck(name, checkConfig) {
    const startTime = Date.now();

    try {
      const result = await Promise.race([
        checkConfig.check(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Health check timeout')), checkConfig.timeout)
        )
      ]);

      return {
        status: 'healthy',
        duration: Date.now() - startTime,
        message: result?.message || 'Check passed',
        data: result?.data || {},
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        duration: Date.now() - startTime,
        message: error.message,
        error: error.name,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get readiness status (for Kubernetes readiness probes)
   */
  async getReadinessStatus() {
    const health = await this.runHealthChecks();
    return {
      ready: health.status === 'healthy',
      status: health.status,
      timestamp: health.timestamp
    };
  }

  /**
   * Get liveness status (for Kubernetes liveness probes)
   */
  async getLivenessStatus() {
    // Liveness is typically just checking if the process is responsive
    return {
      alive: true,
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}

/**
 * Performance Monitor
 */
class PerformanceMonitor {
  constructor(metricsCollector) {
    this.metrics = metricsCollector;
    this.thresholds = {
      responseTime: 1000, // 1 second
      memoryUsage: 0.8,   // 80% of heap
      cpuUsage: 0.8,      // 80%
      errorRate: 0.05     // 5%
    };
    this.alerts = new Map();
  }

  /**
   * Monitor HTTP request
   */
  monitorRequest(req, res, next) {
    const startTime = process.hrtime.bigint();
    const contextId = crypto.randomUUID();

    // Add request ID to response headers
    res.setHeader('X-Request-ID', contextId);

    // Count request
    this.metrics.counter('http.requests.total', 1, {
      method: req.method,
      route: req.route?.path || 'unknown'
    });

    // Monitor response
    res.on('finish', () => {
      const duration = Number(process.hrtime.bigint() - startTime) / 1e6;

      // Record response time
      this.metrics.histogram('http.request.duration', duration, {
        method: req.method,
        status_code: res.statusCode.toString(),
        route: req.route?.path || 'unknown'
      });

      // Record response size
      const contentLength = res.getHeader('content-length');
      if (contentLength) {
        this.metrics.histogram('http.response.size', parseInt(contentLength), {
          method: req.method,
          route: req.route?.path || 'unknown'
        });
      }

      // Count errors
      if (res.statusCode >= 400) {
        this.metrics.counter('http.requests.errors', 1, {
          method: req.method,
          status_code: res.statusCode.toString(),
          route: req.route?.path || 'unknown'
        });
      }

      // Check thresholds
      this.checkThresholds(duration, res.statusCode);
    });

    if (next) next();
  }

  /**
   * Check performance thresholds
   */
  checkThresholds(responseTime, statusCode) {
    // Response time threshold
    if (responseTime > this.thresholds.responseTime) {
      this.triggerAlert('response_time', {
        value: responseTime,
        threshold: this.thresholds.responseTime,
        message: `Response time ${responseTime}ms exceeds threshold ${this.thresholds.responseTime}ms`
      });
    }

    // Error rate threshold
    if (statusCode >= 500) {
      this.triggerAlert('server_error', {
        statusCode,
        message: `Server error: ${statusCode}`
      });
    }

    // Memory usage threshold
    const memUsage = process.memoryUsage();
    const memoryUsageRatio = memUsage.heapUsed / memUsage.heapTotal;

    if (memoryUsageRatio > this.thresholds.memoryUsage) {
      this.triggerAlert('memory_usage', {
        value: memoryUsageRatio,
        threshold: this.thresholds.memoryUsage,
        message: `Memory usage ${(memoryUsageRatio * 100).toFixed(1)}% exceeds threshold ${(this.thresholds.memoryUsage * 100)}%`
      });
    }
  }

  /**
   * Trigger alert
   */
  triggerAlert(type, data) {
    const alertKey = `${type}:${Date.now()}`;
    const alert = {
      type,
      timestamp: new Date().toISOString(),
      severity: this.getAlertSeverity(type),
      ...data
    };

    this.alerts.set(alertKey, alert);

    // Emit alert event
    if (this.metrics instanceof EventEmitter) {
      this.metrics.emit('alert', alert);
    }

    console.error(`ALERT [${alert.severity}] ${type}:`, alert.message);
  }

  /**
   * Get alert severity
   */
  getAlertSeverity(type) {
    const severityMap = {
      response_time: 'warning',
      memory_usage: 'warning',
      cpu_usage: 'warning',
      server_error: 'error',
      database_error: 'critical'
    };

    return severityMap[type] || 'info';
  }

  /**
   * Get active alerts
   */
  getActiveAlerts() {
    const cutoff = Date.now() - 300000; // 5 minutes
    const activeAlerts = [];

    for (const [key, alert] of this.alerts.entries()) {
      if (new Date(alert.timestamp).getTime() > cutoff) {
        activeAlerts.push(alert);
      } else {
        this.alerts.delete(key);
      }
    }

    return activeAlerts;
  }
}

/**
 * Example Usage Demonstrations
 */

// Example 1: Structured Logging
async function exampleStructuredLogging() {
  console.log('=== Structured Logging Example ===');

  const logger = new StructuredLogger({
    level: 'info',
    service: 'user-service',
    version: '1.2.3',
    environment: 'production',
    transports: [new ConsoleTransport(), new FileTransport({ filename: 'app.log' })]
  });

  // Set request context
  const requestId = 'req-123';
  logger.setContext(requestId, {
    requestId,
    userId: 'user-456',
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0...'
  });

  // Log with context
  await logger.info('User login attempt', { email: 'user@example.com' }, requestId);
  await logger.warn('Rate limit approaching', { remainingRequests: 5 }, requestId);
  await logger.error('Authentication failed', {
    reason: 'invalid_password',
    attempts: 3
  }, requestId);

  // Child logger with additional context
  const childLogger = logger.child({ module: 'auth' });
  await childLogger.debug('Validating credentials');

  logger.clearContext(requestId);
}

// Example 2: Metrics Collection
async function exampleMetricsCollection() {
  console.log('=== Metrics Collection Example ===');

  const metrics = new MetricsCollector({
    labels: { service: 'api-gateway', version: '2.1.0' }
  });

  // Counter metrics
  metrics.counter('api.requests.total', 1, { method: 'GET', endpoint: '/users' });
  metrics.counter('api.requests.total', 1, { method: 'POST', endpoint: '/users' });

  // Gauge metrics
  metrics.gauge('api.active_connections', 150);
  metrics.gauge('database.pool.size', 20);

  // Histogram metrics (response times)
  metrics.histogram('api.request.duration', 120, { method: 'GET' });
  metrics.histogram('api.request.duration', 250, { method: 'POST' });
  metrics.histogram('api.request.duration', 80, { method: 'GET' });

  // Time a function
  const timer = metrics.time('database.query.duration', { query: 'select_users' });
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate query
  const duration = timer.end();

  console.log('Query duration:', duration, 'ms');
  console.log('Aggregated metrics:', metrics.getAggregatedMetrics());
}

// Example 3: Distributed Tracing
async function exampleDistributedTracing() {
  console.log('=== Distributed Tracing Example ===');

  const tracer = new DistributedTracer({
    serviceName: 'order-service',
    samplingRate: 1.0
  });

  const contextId = 'ctx-123';

  // Start root span
  const rootSpan = tracer.startSpan('process_order', { contextId });
  rootSpan.setTag('order.id', 'order-456');
  rootSpan.setTag('customer.id', 'customer-789');

  // Create child spans
  const dbSpan = tracer.createChildSpan('database.query', contextId);
  dbSpan.setTag('db.statement', 'SELECT * FROM orders WHERE id = ?');
  dbSpan.log('query.start');

  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate DB query

  dbSpan.log('query.complete', { rows_affected: 1 });
  tracer.finishSpan(dbSpan);

  // Another child span
  const paymentSpan = tracer.createChildSpan('payment.process', contextId);
  paymentSpan.setTag('payment.method', 'credit_card');
  paymentSpan.setTag('amount', 99.99);

  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate payment
    paymentSpan.setTag('payment.status', 'completed');
  } catch (error) {
    paymentSpan.setError(error);
  }

  tracer.finishSpan(paymentSpan);

  // Finish root span
  rootSpan.log('order.completed');
  tracer.finishSpan(rootSpan);
}

// Example 4: Health Checks
async function exampleHealthChecks() {
  console.log('=== Health Checks Example ===');

  const healthSystem = new HealthCheckSystem({
    timeout: 5000,
    cacheTTL: 30000
  });

  // Register health checks
  healthSystem.registerCheck('database', async () => {
    // Simulate database connection check
    await new Promise(resolve => setTimeout(resolve, 100));
    return { message: 'Database connection healthy' };
  }, { critical: true });

  healthSystem.registerCheck('redis', async () => {
    // Simulate Redis check
    if (Math.random() < 0.9) {
      return { message: 'Redis connection healthy' };
    }
    throw new Error('Redis connection failed');
  }, { critical: false });

  healthSystem.registerCheck('external_api', async () => {
    // Simulate external API check
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      message: 'External API healthy',
      data: { response_time: 200, status: 'ok' }
    };
  });

  // Run health checks
  const healthResult = await healthSystem.runHealthChecks();
  console.log('Health check result:', JSON.stringify(healthResult, null, 2));

  const readiness = await healthSystem.getReadinessStatus();
  console.log('Readiness status:', readiness);
}

// Example 5: Performance Monitoring
async function examplePerformanceMonitoring() {
  console.log('=== Performance Monitoring Example ===');

  const metrics = new MetricsCollector();
  const perfMonitor = new PerformanceMonitor(metrics);

  // Simulate HTTP requests
  const simulateRequest = (method, path, statusCode, responseTime) => {
    const req = { method, route: { path } };
    const res = {
      statusCode,
      setHeader: () => {},
      getHeader: () => '1024',
      on: (event, callback) => {
        if (event === 'finish') {
          setTimeout(callback, responseTime);
        }
      }
    };

    perfMonitor.monitorRequest(req, res);
  };

  // Simulate various requests
  simulateRequest('GET', '/users', 200, 150);
  simulateRequest('POST', '/users', 201, 300);
  simulateRequest('GET', '/users/123', 404, 50);
  simulateRequest('GET', '/orders', 500, 2000); // Slow error response

  // Wait for monitoring to complete
  await new Promise(resolve => setTimeout(resolve, 2500));

  console.log('Performance metrics:', metrics.getAggregatedMetrics());
  console.log('Active alerts:', perfMonitor.getActiveAlerts());
}

module.exports = {
  StructuredLogger,
  ConsoleTransport,
  FileTransport,
  MetricsCollector,
  DistributedTracer,
  Span,
  NoOpSpan,
  ConsoleSpanExporter,
  HealthCheckSystem,
  PerformanceMonitor,
  exampleStructuredLogging,
  exampleMetricsCollection,
  exampleDistributedTracing,
  exampleHealthChecks,
  examplePerformanceMonitoring
};
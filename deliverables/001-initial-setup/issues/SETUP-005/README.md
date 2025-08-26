# SETUP-005: Implement Observability & Logging

**Status**: 📋 Not Started  
**Type**: Setup Task  
**Priority**: P1 - High  
**Estimated Time**: 3-4 hours  
**Assignee**: Unassigned

## Overview

Implement comprehensive observability using OpenTelemetry for distributed tracing, metrics, and structured logging. This enables proactive monitoring, faster debugging, and data-driven performance optimization.

## Objectives

- ✅ Set up OpenTelemetry for traces, metrics, and logs
- ✅ Configure structured logging with context
- ✅ Implement error tracking (Sentry/Rollbar)
- ✅ Set up application metrics and dashboards
- ✅ Configure distributed tracing
- ✅ Establish alerting rules

## Acceptance Criteria

- [ ] OpenTelemetry SDK integrated
- [ ] Structured logging implemented
- [ ] Error tracking configured
- [ ] Metrics being collected
- [ ] Traces correlating across services
- [ ] Local observability stack running
- [ ] Documentation complete
- [ ] Team trained on tools

## Implementation Guide

### Step 1: Install OpenTelemetry Dependencies

```bash
# Core OpenTelemetry packages
npm install --save \
  @opentelemetry/api \
  @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/sdk-metrics \
  @opentelemetry/sdk-trace-node

# Exporters
npm install --save \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/exporter-metrics-otlp-http \
  @opentelemetry/exporter-logs-otlp-http \
  @opentelemetry/exporter-jaeger \
  @opentelemetry/exporter-prometheus

# Instrumentation libraries
npm install --save \
  @opentelemetry/instrumentation-express \
  @opentelemetry/instrumentation-http \
  @opentelemetry/instrumentation-postgres \
  @opentelemetry/instrumentation-redis

# Logging libraries
npm install --save \
  winston \
  @sentry/node \
  @sentry/tracing
```

### Step 2: Configure OpenTelemetry

Create `src/observability/tracing.js`:

```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

const init = () => {
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'app',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
    })
  );

  const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
  });

  const metricExporter = new OTLPMetricExporter({
    url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://localhost:4318/v1/metrics',
  });

  const sdk = new NodeSDK({
    resource,
    traceExporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 10000,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': {
          enabled: false, // Reduce noise
        },
      }),
    ],
  });

  sdk.start();
  
  console.log('OpenTelemetry initialized');
  
  return sdk;
};

module.exports = { init };
```

### Step 3: Implement Structured Logging

Create `src/observability/logger.js`:

```javascript
const winston = require('winston');
const { trace, context } = require('@opentelemetry/api');

// Custom format to include trace context
const traceFormat = winston.format((info) => {
  const span = trace.getSpan(context.active());
  if (span) {
    const spanContext = span.spanContext();
    info.traceId = spanContext.traceId;
    info.spanId = spanContext.spanId;
    info.traceFlags = spanContext.traceFlags;
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    traceFormat(),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'app',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// Add request logging middleware
logger.requestMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    });
  });
  
  next();
};

module.exports = logger;
```

### Step 4: Configure Error Tracking

Create `src/observability/error-tracking.js`:

```javascript
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

const init = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: 1.0,
    beforeSend(event, hint) {
      // Filter sensitive data
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers?.authorization;
      }
      return event;
    },
  });
};

const captureError = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

module.exports = { init, captureError };
```

### Step 5: Create Custom Metrics

Create `src/observability/metrics.js`:

```javascript
const { metrics } = require('@opentelemetry/api');

// Get meter
const meter = metrics.getMeter('app-metrics', '1.0.0');

// Create counters
const requestCounter = meter.createCounter('http_requests_total', {
  description: 'Total number of HTTP requests',
});

const errorCounter = meter.createCounter('errors_total', {
  description: 'Total number of errors',
});

// Create histograms
const requestDuration = meter.createHistogram('http_request_duration_ms', {
  description: 'HTTP request duration in milliseconds',
});

const dbQueryDuration = meter.createHistogram('db_query_duration_ms', {
  description: 'Database query duration in milliseconds',
});

// Create gauges
const activeConnections = meter.createUpDownCounter('active_connections', {
  description: 'Number of active connections',
});

// Helper functions
const recordRequest = (method, path, statusCode, duration) => {
  requestCounter.add(1, { method, path, statusCode });
  requestDuration.record(duration, { method, path });
};

const recordError = (type, message) => {
  errorCounter.add(1, { type, message });
};

const recordDbQuery = (operation, table, duration) => {
  dbQueryDuration.record(duration, { operation, table });
};

module.exports = {
  requestCounter,
  errorCounter,
  requestDuration,
  dbQueryDuration,
  activeConnections,
  recordRequest,
  recordError,
  recordDbQuery,
};
```

### Step 6: Set Up Local Observability Stack

Create `docker-compose.observability.yml`:

```yaml
version: '3.8'

services:
  # Jaeger for distributed tracing
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"  # Jaeger UI
      - "14268:14268"  # Collector HTTP
      - "4317:4317"    # OTLP gRPC
      - "4318:4318"    # OTLP HTTP
    environment:
      - COLLECTOR_OTLP_ENABLED=true

  # Prometheus for metrics
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  # Grafana for dashboards
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./config/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./config/grafana/datasources:/etc/grafana/provisioning/datasources

  # Loki for log aggregation
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./config/loki.yml:/etc/loki/local-config.yaml
      - loki_data:/loki

  # Promtail for log shipping
  promtail:
    image: grafana/promtail:latest
    volumes:
      - ./logs:/var/log
      - ./config/promtail.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

volumes:
  prometheus_data:
  grafana_data:
  loki_data:
```

### Step 7: Initialize in Application

Create `src/index.js`:

```javascript
// Initialize observability first
require('./observability/tracing').init();
const Sentry = require('./observability/error-tracking');
const logger = require('./observability/logger');
const metrics = require('./observability/metrics');

// Initialize error tracking
Sentry.init();

// Your application code
const express = require('express');
const app = express();

// Add logging middleware
app.use(logger.requestMiddleware);

// Add metrics middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    metrics.recordRequest(req.method, req.path, res.statusCode, duration);
  });
  
  next();
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err });
  metrics.recordError(err.name, err.message);
  Sentry.captureError(err, { req });
  
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  metrics.activeConnections.add(1);
});
```

## Verification Steps

```bash
# Start observability stack
docker-compose -f docker-compose.observability.yml up -d

# Verify services
curl http://localhost:16686  # Jaeger UI
curl http://localhost:9090   # Prometheus UI
curl http://localhost:3001   # Grafana (admin/admin)

# Generate test data
npm run dev
curl http://localhost:3000/test

# Check traces in Jaeger
open http://localhost:16686

# Check metrics in Prometheus
open http://localhost:9090

# View dashboards in Grafana
open http://localhost:3001
```

## Definition of Done

- [ ] OpenTelemetry SDK integrated
- [ ] Structured logging with trace context
- [ ] Error tracking configured
- [ ] Custom metrics implemented
- [ ] Local observability stack running
- [ ] Traces visible in Jaeger
- [ ] Metrics visible in Prometheus
- [ ] Dashboards created in Grafana
- [ ] Documentation complete
- [ ] Team trained on tools

## Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Grafana Stack](https://grafana.com/docs/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Distributed Tracing](https://opentracing.io/docs/)
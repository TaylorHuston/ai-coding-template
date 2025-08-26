# SETUP-005: Observability & Monitoring Implementation

## Quick Start

1. Install observability stack:
   ```bash
   npm run observability:setup
   ```

2. Start monitoring:
   ```bash
   docker-compose -f docker-compose.observability.yml up -d
   ```

## Implementation

### OpenTelemetry Setup

Install dependencies:
```bash
npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-jaeger @opentelemetry/exporter-prometheus
```

Create `observability/tracing.js`:
```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const jaegerExporter = new JaegerExporter({
  endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
});

const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

### Structured Logging

Create `observability/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
```

### Metrics Collection

Create `observability/metrics.js`:
```javascript
const prometheus = require('prom-client');

// Create custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Export metrics endpoint
const register = prometheus.register;
prometheus.collectDefaultMetrics({ register });

module.exports = {
  httpRequestDuration,
  httpRequestTotal,
  register
};
```

### Monitoring Stack (Docker Compose)

Create `docker-compose.observability.yml`:
```yaml
version: '3.8'

services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "14268:14268"
      - "16686:16686"
    environment:
      - COLLECTOR_OTLP_ENABLED=true

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./observability/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

### Express.js Integration

Add to your Express app:
```javascript
const express = require('express');
const { httpRequestDuration, httpRequestTotal, register } = require('./observability/metrics');
const logger = require('./observability/logger');
require('./observability/tracing');

const app = express();

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    };
    
    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration
    });
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

## Testing

### Verify Setup

```bash
# Check services are running
docker-compose -f docker-compose.observability.yml ps

# Generate test traffic
curl http://localhost:3000/health

# View traces
open http://localhost:16686

# View metrics
open http://localhost:9090

# View dashboards
open http://localhost:3001
```

## Troubleshooting

### Tracing Issues

```bash
# Check Jaeger is receiving traces
curl http://localhost:16686/api/services

# Verify OpenTelemetry instrumentation
curl http://localhost:3000/metrics | grep otel
```

### Metrics Issues

```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Verify metrics endpoint
curl http://localhost:3000/metrics
```
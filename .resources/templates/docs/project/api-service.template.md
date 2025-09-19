# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 🔗 API Documentation

{{#API_DOCS_URL}}
**[View API Documentation]({{API_DOCS_URL}})**
{{/API_DOCS_URL}}

## 🚀 Features

- {{FEATURE_1}}
- {{FEATURE_2}}
- {{FEATURE_3}}
- 🔒 Secure authentication and authorization
- 📊 Comprehensive logging and monitoring
- ⚡ High-performance async operations
- 🔄 Auto-generated API documentation

## 📋 Prerequisites

**Required:**
- {{TECH_REQUIREMENTS}}
- {{DATABASE_REQUIREMENTS}}

**Recommended:**
- {{RECOMMENDED_TOOLS}}
- API testing tools (Postman, Insomnia)

## ⚡ Quick Start

### Installation

```bash
# Clone the repository
git clone {{REPO_URL}} {{PROJECT_SLUG}}
cd {{PROJECT_SLUG}}

# Install dependencies
{{INSTALL_COMMANDS}}

# Set up environment variables
cp .env.example .env
# Edit .env with your database and service configuration

# Initialize database
{{DB_INIT_COMMANDS}}
```

### Development

```bash
# Start development server
{{DEV_COMMANDS}}
# API available at http://localhost:{{PORT}}

# Run tests
{{TEST_COMMANDS}}

# View API documentation
{{API_DOCS_COMMANDS}}
```

## 🏗️ Architecture

This API service uses the [AI Coding Template](./docs/ai-tools/template-documentation.md) workflow for intelligent development.

### Tech Stack

- **Runtime**: {{RUNTIME}} ({{RUNTIME_VERSION}})
- **Framework**: {{API_FRAMEWORK}}
- **Database**: {{DATABASE_TECH}}
- **Authentication**: {{AUTH_STRATEGY}}
- **Documentation**: {{API_DOCS_TOOL}}
- **Deployment**: {{DEPLOYMENT_PLATFORM}}

### API Structure

```
src/
├── controllers/    # Route handlers and business logic
├── models/        # Data models and schemas
├── middleware/    # Authentication, validation, logging
├── routes/        # API endpoint definitions
├── services/      # Business logic and external integrations
├── utils/         # Helper functions and utilities
├── validators/    # Input validation schemas
└── tests/         # API and unit tests
```

### Core Endpoints

```
{{API_BASE_URL}}/api/v1/
├── /auth          # Authentication endpoints
├── /users         # User management
├── /{{RESOURCE_1}} # {{RESOURCE_1_DESCRIPTION}}
├── /{{RESOURCE_2}} # {{RESOURCE_2_DESCRIPTION}}
└── /health        # Health check and status
```

## 🔐 Authentication & Authorization

### Authentication Methods
- {{AUTH_METHOD_1}}
- {{AUTH_METHOD_2}}
- {{AUTH_METHOD_3}}

### Authorization Levels
- **Public**: No authentication required
- **User**: Authenticated user access
- **Admin**: Administrative privileges
- **System**: Service-to-service communication

### Example Usage

```bash
# Get access token
curl -X POST {{API_BASE_URL}}/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use authenticated endpoint
curl -X GET {{API_BASE_URL}}/api/v1/{{RESOURCE_1}} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 API Reference

### Core Resources

#### {{RESOURCE_1}}
```http
GET    /api/v1/{{RESOURCE_1}}           # List all {{RESOURCE_1}}
POST   /api/v1/{{RESOURCE_1}}           # Create new {{RESOURCE_1}}
GET    /api/v1/{{RESOURCE_1}}/:id       # Get specific {{RESOURCE_1}}
PUT    /api/v1/{{RESOURCE_1}}/:id       # Update {{RESOURCE_1}}
DELETE /api/v1/{{RESOURCE_1}}/:id       # Delete {{RESOURCE_1}}
```

#### {{RESOURCE_2}}
```http
GET    /api/v1/{{RESOURCE_2}}           # List all {{RESOURCE_2}}
POST   /api/v1/{{RESOURCE_2}}           # Create new {{RESOURCE_2}}
GET    /api/v1/{{RESOURCE_2}}/:id       # Get specific {{RESOURCE_2}}
PUT    /api/v1/{{RESOURCE_2}}/:id       # Update {{RESOURCE_2}}
DELETE /api/v1/{{RESOURCE_2}}/:id       # Delete {{RESOURCE_2}}
```

### Error Handling

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2024-01-01T12:00:00Z",
    "request_id": "req_123456"
  }
}
```

## 🧪 Testing Strategy

```bash
# Unit tests
{{TEST_COMMANDS}}

# Integration tests
{{INTEGRATION_TEST_COMMANDS}}

# API tests
{{API_TEST_COMMANDS}}

# Load testing
{{LOAD_TEST_COMMANDS}}

# Security testing
{{SECURITY_TEST_COMMANDS}}
```

### Test Categories
- **Unit Tests**: Individual function testing
- **Integration Tests**: Database and service integration
- **API Tests**: Endpoint behavior and contracts
- **Load Tests**: Performance under stress
- **Security Tests**: Authentication and authorization

## 🚀 Deployment

### Environment Configuration

```bash
# Application
NODE_ENV={{NODE_ENV}}
PORT={{PORT}}
API_VERSION={{API_VERSION}}

# Database
DATABASE_URL={{DATABASE_URL}}
REDIS_URL={{REDIS_URL}}

# Authentication
JWT_SECRET={{JWT_SECRET}}
JWT_EXPIRES_IN={{JWT_EXPIRES_IN}}

# External Services
{{EXTERNAL_SERVICE_1}}_URL={{SERVICE_1_URL}}
{{EXTERNAL_SERVICE_1}}_API_KEY={{SERVICE_1_KEY}}

# Monitoring
LOG_LEVEL={{LOG_LEVEL}}
SENTRY_DSN={{SENTRY_DSN}}
```

### {{ENVIRONMENT_1}}
```bash
{{DEPLOY_COMMANDS_1}}
```

### {{ENVIRONMENT_2}}
```bash
{{DEPLOY_COMMANDS_2}}
```

## 📊 Monitoring & Observability

### Key Metrics
- **Response Time**: P95 < {{RESPONSE_TIME_TARGET}}ms
- **Throughput**: {{THROUGHPUT_TARGET}} requests/second
- **Error Rate**: < {{ERROR_RATE_TARGET}}%
- **Uptime**: > {{UPTIME_TARGET}}%

### Logging
```javascript
// Structured logging example
logger.info('User authentication successful', {
  userId: user.id,
  email: user.email,
  requestId: req.id,
  timestamp: new Date().toISOString()
});
```

### Health Check
```http
GET /health
```

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T12:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "external_api": "healthy"
  }
}
```

## 🛠️ Development Workflow

This project uses AI-assisted development for consistent, high-quality results:

1. **Define** - Use `/feature` to create feature requirements and context
2. **Design** - Use `/architect` to create technical architecture and decisions
3. **Plan** - Use `/plan` to create detailed implementation roadmaps
4. **Execute** - Use `/develop` to implement with context-aware quality gates
5. **Validate** - Use `/quality` to ensure performance and security standards

### Development Standards
- Follow RESTful API design principles
- Implement comprehensive input validation
- Use structured logging for observability
- Write tests before implementation (TDD)
- Document all endpoints and schemas

## 🔒 Security

### Security Measures
- ✅ Input validation and sanitization
- ✅ Rate limiting per endpoint
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ SQL injection prevention
- ✅ JWT token security
- ✅ API key management

### Security Headers
```javascript
// Example security configuration
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
```

## 🤝 Contributing

### API Development Guidelines
1. Follow OpenAPI 3.0 specification
2. Implement proper error handling
3. Add comprehensive tests for all endpoints
4. Update API documentation
5. Follow semantic versioning for API changes

### Pull Request Process
1. Create feature branch: `git checkout -b feature/new-endpoint`
2. Implement using AI workflow: `/vision` → `/feature` → `/architect` → `/plan` → `/develop`
3. Add tests and documentation
4. Run full test suite: `npm run test:all`
5. Update CHANGELOG.md
6. Submit pull request with API impact assessment

## 📚 Documentation

### API Documentation
- **[OpenAPI Specification](./docs/api/openapi.yaml)** - Complete API spec
- **[Postman Collection](./docs/api/postman-collection.json)** - Ready-to-use API tests
- **[Integration Examples](./docs/api/examples/)** - Code samples for various languages

### Developer Documentation
- **[Architecture Decisions](./docs/technical/decisions/)** - Key technical decisions
- **[Database Schema](./docs/technical/database/)** - Data model documentation
- **[Security Guide](./docs/security/)** - Security implementation details

### AI Development Tools
- **[Template Documentation](./docs/ai-tools/template-documentation.md)** - Complete AI template guide
- **[Agent System](./docs/ai-tools/guides/using-agents.md)** - 19 specialist AI agents

## 📊 Project Status

Current project status and context: [STATUS.md](./STATUS.md)

## 🙏 Acknowledgments

- Built with [AI Coding Template](https://github.com/yourusername/ai-coding-template)
- Powered by intelligent agent-assisted development
- {{ADDITIONAL_ACKNOWLEDGMENTS}}

## 📄 License

This project is licensed under the {{LICENSE_TYPE}} License - see the [LICENSE](LICENSE) file for details.

---

**🤖 AI-Enhanced Development**: This API service leverages intelligent agents for architectural decisions, endpoint design, and security validation. See our [AI development guide](./docs/ai-tools/) to learn how AI accelerates API development while maintaining enterprise standards.
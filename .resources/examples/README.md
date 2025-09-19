---
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants", "development-team"]
document_type: "reference"
tags: ["examples", "reference-implementations", "patterns"]
---

# Examples Directory

## 🎯 Purpose

This directory contains **working reference implementations** that demonstrate established patterns, conventions, and best practices. Unlike templates (which are fill-in-the-blank), examples show complete, functional code that can be studied and adapted.

## 📁 Organization

### Code Examples (`/code/`)
Working code demonstrating implementation patterns:

- **`/patterns/`** - Core implementation patterns (components, services, tests)
- **`/security/`** - Security implementation examples (validation, encryption, monitoring)
- **`/integrations/`** - Integration examples (APIs, databases, external services)
- **`/configs/`** - Configuration and setup examples

### Documentation Examples (`/docs/`)
Completed documentation demonstrating best practices:

- **`/completed/`** - Real completed documentation examples
- **`/references/`** - Reference documentation patterns

### Workflow Examples (`/workflow/`)
Completed workflow artifacts showing proper structure:

- **Completed deliverables, plans, and decision records**

## 🏷️ Naming Convention

**Code Examples:** `{category}-{functionality}.example.{ext}`
- `auth-service.example.ts`
- `user-card.example.tsx`
- `integration-test.example.js`

**Migration Complete:** All examples now follow the standard naming convention.

## 📚 Available Examples

### Code Patterns (`/code/patterns/`)

#### [api-user-service.example.ts](./code/patterns/api-user-service.example.ts) (243 lines)
**API Service Implementation Pattern**
- Service class architecture with dependency injection
- Async/await patterns and error handling
- Type definitions for requests/responses
- Repository pattern integration
- Logging and monitoring implementation
- Input validation and sanitization

#### [component-user-card.example.tsx](./code/patterns/component-user-card.example.tsx) (239 lines)
**React Component Pattern**
- Functional component with TypeScript
- Props interface definitions and validation
- State management with hooks
- Event handling and lifecycle patterns
- Conditional rendering strategies
- Styling and theming approaches

#### [test-user-service.example.test.ts](./code/patterns/test-user-service.example.test.ts) (419 lines)
**Testing Best Practices**
- Unit test structure with Jest/Vitest
- Mock patterns for dependencies and external services
- Test data factories and builders
- Async testing patterns and error simulation
- Test organization and setup/teardown
- Coverage and assertion strategies

### Configuration Examples (`/code/configs/`)

#### [config-app-config.example.ts](./code/configs/config-app-config.example.ts) (404 lines)
**Configuration Management Pattern**
- Environment variable handling and validation
- Type-safe configuration objects
- Default value patterns and fallbacks
- Feature flag implementation
- Secrets management and security
- Multi-environment configuration

### Security Examples (`/code/security/`)

#### [input-validation.example.js](./code/security/input-validation.example.js) (187 lines)
**Input Validation and Sanitization Security**
- Layered validation approach with schema-based validation
- SQL injection prevention with parameterized queries
- XSS prevention with context-aware output encoding
- Comprehensive input sanitization strategies

#### [encryption-data-protection.example.js](./code/security/encryption-data-protection.example.js) (154 lines)
**Encryption and Data Protection Implementation**
- AES-256-GCM encryption for data at rest
- TLS configuration and security headers for data in transit
- Secure key management with rotation capabilities
- Secure password hashing and token generation

#### [session-management.example.js](./code/security/session-management.example.js) (184 lines)
**Session Management Security Implementation**
- Secure session creation with encryption and validation
- Session integrity checking and anomaly detection
- Cross-platform session management with Redis
- Session hijacking and fixation protection mechanisms

#### [api-security.example.js](./code/security/api-security.example.js) (233 lines)
**API Security Implementation**
- Secure JWT token generation and validation with RS256
- Comprehensive rate limiting with multiple tiers and contexts
- API authentication patterns with proper error handling
- API key management and security middleware

#### [security-monitoring.example.js](./code/security/security-monitoring.example.js) (265 lines)
**Security Monitoring and Logging Implementation**
- Comprehensive security event logging with data sanitization
- Real-time threat detection and anomaly analysis
- Automated security alerting and incident response
- Behavioral pattern analysis for fraud detection

#### [file-upload-security.example.js](./code/security/file-upload-security.example.js) (208 lines)
**File Upload Security Implementation**
- Multi-layered file validation including MIME type detection
- Virus scanning integration for malware detection
- Secure file storage with encryption and access controls
- File content validation and suspicious pattern detection

#### [ai-security.example.js](./code/security/ai-security.example.js) (174 lines)
**AI Security Implementation**
- Security review processes for AI-generated code
- Automated detection of common security anti-patterns
- Risk assessment frameworks for AI code review
- Integration with security scanning and static analysis

#### [compliance-governance.example.js](./code/security/compliance-governance.example.js) (251 lines)
**Compliance and Governance Implementation**
- GDPR compliance implementation with data subject rights
- Automated security policy enforcement and violation handling
- Comprehensive audit logging and data processing activity tracking
- Privacy-preserving data handling and secure erasure procedures

#### [security-testing.example.test.js](./code/security/security-testing.example.test.js) (329 lines)
**Security Testing Implementation**
- Comprehensive security test suites covering authentication, authorization, and input validation
- Automated penetration testing patterns for common vulnerabilities
- Security regression testing to prevent reintroduction of fixed vulnerabilities
- Integration with security scanning tools and vulnerability assessment

## 🔍 Quick Reference

### By Development Task

| I need to... | Use this example | File |
|--------------|------------------|------|
| **Create an API service** | Service class patterns | [api-user-service.example.ts](./code/patterns/api-user-service.example.ts) |
| **Build a React component** | Component with TypeScript | [component-user-card.example.tsx](./code/patterns/component-user-card.example.tsx) |
| **Handle configuration** | Environment config patterns | [config-app-config.example.ts](./code/configs/config-app-config.example.ts) |
| **Write unit tests** | Testing best practices | [test-user-service.example.test.ts](./code/patterns/test-user-service.example.test.ts) |
| **Implement security** | Comprehensive security patterns | [All security examples](./code/security/) |
| **Validate user input** | Input validation and sanitization | [input-validation.example.js](./code/security/input-validation.example.js) |
| **Encrypt sensitive data** | Data protection patterns | [encryption-data-protection.example.js](./code/security/encryption-data-protection.example.js) |
| **Manage user sessions** | Session security implementation | [session-management.example.js](./code/security/session-management.example.js) |
| **Secure APIs** | API authentication and rate limiting | [api-security.example.js](./code/security/api-security.example.js) |
| **Monitor security events** | Security logging and monitoring | [security-monitoring.example.js](./code/security/security-monitoring.example.js) |
| **Handle file uploads** | Secure file processing | [file-upload-security.example.js](./code/security/file-upload-security.example.js) |
| **Test security** | Security testing strategies | [security-testing.example.test.js](./code/security/security-testing.example.test.js) |
| **Implement error handling** | See API service example | [api-user-service.example.ts](./code/patterns/api-user-service.example.ts) |
| **Add type definitions** | All examples show patterns | Any TypeScript file |
| **Structure async code** | Service and test examples | [api-user-service.example.ts](./code/patterns/api-user-service.example.ts) |

### By Pattern Type

| Pattern | Example | Purpose |
|---------|---------|----------|
| **Service Layer** | [api-user-service.example.ts](./code/patterns/api-user-service.example.ts) | Business logic and data access |
| **UI Components** | [component-user-card.example.tsx](./code/patterns/component-user-card.example.tsx) | React component patterns |
| **Configuration** | [config-app-config.example.ts](./code/configs/config-app-config.example.ts) | App configuration management |
| **Testing** | [test-user-service.example.test.ts](./code/patterns/test-user-service.example.test.ts) | Unit testing strategies |
| **Security Validation** | [input-validation.example.js](./code/security/input-validation.example.js) | Input validation and XSS/SQL injection prevention |
| **Encryption & Privacy** | [encryption-data-protection.example.js](./code/security/encryption-data-protection.example.js) | Data encryption and protection strategies |
| **Session Security** | [session-management.example.js](./code/security/session-management.example.js) | Secure session management and validation |
| **API Security** | [api-security.example.js](./code/security/api-security.example.js) | Authentication, authorization, and rate limiting |
| **Security Monitoring** | [security-monitoring.example.js](./code/security/security-monitoring.example.js) | Threat detection and security event logging |
| **File Security** | [file-upload-security.example.js](./code/security/file-upload-security.example.js) | Secure file handling and validation |
| **Compliance** | [compliance-governance.example.js](./code/security/compliance-governance.example.js) | GDPR compliance and governance frameworks |
| **Security Testing** | [security-testing.example.test.js](./code/security/security-testing.example.test.js) | Automated security testing and vulnerability assessment |

## 🛠️ How to Use Examples

### For Developers

1. **Study the Pattern**: Read through the complete implementation
2. **Understand the Why**: Review comments explaining decisions
3. **Adapt, Don't Copy**: Use patterns but customize for your needs
4. **Follow Conventions**: Maintain consistency with shown patterns

### For AI Assistants

1. **Reference for Style**: Match naming, formatting, and structure
2. **Follow Error Handling**: Use the error handling patterns shown
3. **Include Proper Typing**: Apply TypeScript patterns consistently
4. **Maintain Architecture**: Respect the architectural decisions shown

## 🔗 Templates vs Examples

| **Examples** (This Directory) | **Templates** ([/templates/](/templates/)) |
|-------------------------------|-------------------------------------------|
| ✅ Complete, working code | 📝 Fill-in-the-blank starting points |
| ✅ Study and learn from | 📝 Copy and customize |
| ✅ Show best practices | 📝 Provide structure |
| ✅ Demonstrate patterns | 📝 Guide implementation |

**When to Use:**
- **Examples**: "How should I implement this?" → Study working code
- **Templates**: "I need to start fresh" → Copy and fill in blanks

## 🤝 Contributing

When adding new examples:

1. **Use naming convention**: `{category}-{functionality}.example.{ext}`
2. **Include comprehensive comments**: Explain the "why" not just the "what"
3. **Show complete patterns**: Include imports, exports, error handling
4. **Test your example**: Ensure code compiles and runs
5. **Update this README**: Add to appropriate section
6. **Add header comment**: Explain the pattern being demonstrated

### Example Header Format

```typescript
/**
 * @example User Service API Implementation
 *
 * Demonstrates:
 * - Service layer architecture with dependency injection
 * - Async/await patterns with proper error handling
 * - TypeScript interfaces and type safety
 * - Repository pattern integration
 *
 * Key Patterns:
 * - Constructor injection for testability
 * - Custom error types for different failure modes
 * - Validation at service boundaries
 * - Logging for observability
 */
```

## 🎓 Learning Path

### Core Development Path
1. **Start with Configuration**: [config-app-config.example.ts](./code/configs/config-app-config.example.ts)
2. **Learn Service Patterns**: [api-user-service.example.ts](./code/patterns/api-user-service.example.ts)
3. **Understand Testing**: [test-user-service.example.test.ts](./code/patterns/test-user-service.example.test.ts)
4. **Build UI Components**: [component-user-card.example.tsx](./code/patterns/component-user-card.example.tsx)

### Security Implementation Path
1. **Input Validation**: [input-validation.example.js](./code/security/input-validation.example.js)
2. **Data Protection**: [encryption-data-protection.example.js](./code/security/encryption-data-protection.example.js)
3. **API Security**: [api-security.example.js](./code/security/api-security.example.js)
4. **Session Management**: [session-management.example.js](./code/security/session-management.example.js)
5. **Security Monitoring**: [security-monitoring.example.js](./code/security/security-monitoring.example.js)
6. **Security Testing**: [security-testing.example.test.js](./code/security/security-testing.example.test.js)

---

**Examples vs Templates**: Examples are complete reference implementations for learning. For fill-in-the-blank starting points, see the [Templates Directory](/templates/).

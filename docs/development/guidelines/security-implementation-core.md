---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "security-engineers"]
document_type: "guide"
priority: "high"
tags: ["security", "principles", "patterns", "validation", "encryption"]
difficulty: "intermediate"
estimated_time: "15 min"
---

# Security Implementation - Core Principles

**Purpose**: Core security implementation principles and patterns for secure coding. This guide focuses on WHAT, WHY, and WHEN rather than HOW - for implementation examples, see `/examples/code/security/`.

## Input Validation and Sanitization

### **Comprehensive Input Validation**

#### **Layered Validation Strategy**

**Schema-Based Validation**: Define comprehensive validation schemas that specify field types, constraints, patterns, and sanitization rules. Schema-driven validation ensures consistency and reduces validation bypass opportunities.

**Multi-Layer Approach**: Implement validation at multiple application layers - client-side for UX, server-side for security, and database-level for data integrity. Never rely solely on client-side validation.

**Fail-Safe Validation**: Design validation to fail securely - unknown or malformed input should be rejected rather than processed with default assumptions.

**Example Implementation**: See `/examples/code/security/input-validation.example.js` for comprehensive validation patterns including schema validation, type checking, and sanitization.

#### **SQL Injection Prevention Principles**

**Parameterized Queries**: Use parameterized queries or prepared statements for all database interactions. This separates SQL code from data, preventing injection attacks.

**Query Builders and ORMs**: Leverage query builders and Object-Relational Mapping tools that automatically parameterize queries and provide safer abstractions.

**Input Validation**: Validate and sanitize all user inputs before database operations. Apply strict type checking and format validation.

**Principle of Least Privilege**: Database users should have only the minimum permissions required for their function.

**Example Implementation**: See `/examples/code/security/input-validation.example.js` for secure database query patterns and vulnerable example for comparison.

#### **Cross-Site Scripting (XSS) Prevention Principles**

**Context-Aware Output Encoding**: Apply different encoding strategies based on output context - HTML content, HTML attributes, JavaScript, URLs, and CSS each require specific encoding approaches.

**Content Security Policy (CSP)**: Implement strict CSP headers to control resource loading and script execution. Use nonce-based or hash-based CSP for inline scripts.

**Input Sanitization**: Sanitize user inputs using trusted libraries like DOMPurify. Define allowed tags, attributes, and protocols explicitly.

**Template Security**: Use templating engines with automatic escaping. Avoid constructing HTML through string concatenation.

**Example Implementation**: See `/examples/code/security/input-validation.example.js` for context-aware sanitization patterns and Express middleware examples.

## Data Protection and Encryption Principles

### **Encryption Strategy**

#### **Data at Rest Protection**

**Algorithm Selection**: Use AES-256-GCM for symmetric encryption, providing both confidentiality and authenticity. This algorithm offers strong security with good performance characteristics.

**Key Management**: Implement proper key lifecycle management including generation, rotation, storage, and destruction. Use dedicated key management services when available.

**Selective Encryption**: Encrypt sensitive data fields while keeping searchable fields unencrypted. Balance security needs with application functionality requirements.

**Storage Separation**: Store encrypted data and encryption keys in separate systems. Never store keys alongside the data they protect.

#### **Data in Transit Protection**

**TLS Configuration**: Use TLS 1.2 or higher with strong cipher suites. Prefer ECDHE for forward secrecy and AES-GCM for authenticated encryption.

**Certificate Management**: Implement proper certificate lifecycle management including validation, renewal, and revocation checking. Use Certificate Transparency monitoring.

**Security Headers**: Implement comprehensive security headers including HSTS, CSP, X-Frame-Options, and X-Content-Type-Options to enhance transport security.

**Perfect Forward Secrecy**: Use ephemeral key exchange algorithms (ECDHE) to ensure that compromised long-term keys don't compromise past communications.

### **Key Management Principles**

#### **Key Lifecycle Management**

**Generation**: Use cryptographically secure random number generators for key creation. Ensure sufficient entropy and proper key length for chosen algorithms.

**Storage**: Store keys in dedicated key management systems or hardware security modules. Never store keys in application code or configuration files.

**Rotation**: Implement automatic key rotation with configurable intervals (typically 90 days). Design systems to support graceful key transitions without service interruption.

**Access Control**: Implement strict access controls for key operations. Use audit logging for all key access and management operations.

**Example Implementation**: See `/examples/code/security/data-encryption.example.js` for complete encryption service and key management patterns.

## Session Management Principles

### **Secure Session Strategy**

#### **Session Security Framework**

**Encrypted Storage**: Store session data in encrypted form to protect against data exposure. Use strong encryption with proper key management.

**Secure Identifiers**: Generate session IDs using cryptographically secure random number generators. Use sufficient entropy (256 bits minimum) to prevent prediction attacks.

**Timeout Management**: Implement both idle timeout (30 minutes) and absolute timeout (24 hours) to limit session exposure window.

**Integrity Validation**: Validate session integrity on each request including age checks, IP consistency (when appropriate), and suspicious activity detection.

**Context Tracking**: Store security-relevant context including IP address, user agent, and geographic location for anomaly detection.

## API Security Principles

### **API Authentication Strategy**

#### **JWT Token Security Framework**

**Algorithm Selection**: Use RS256 (RSA with SHA-256) for JWT signatures to enable key rotation and distributed verification without shared secrets.

**Token Structure**: Include standard claims (iss, aud, iat, exp, jti) and implement proper token revocation mechanisms using unique token identifiers.

**Key Management**: Implement proper key rotation for JWT signing keys. Store private keys securely and distribute public keys for verification.

**Revocation Strategy**: Maintain revocation lists for compromised tokens. Balance security needs with performance requirements using distributed caching.

#### **Rate Limiting Strategy**

**Multiple Algorithms**: Implement different rate limiting algorithms (fixed window, sliding window, token bucket) based on use case requirements and precision needs.

**Tiered Limits**: Define different rate limits for different API endpoints and user tiers - authentication endpoints need stricter limits than general API access.

**Client Identification**: Use authenticated user IDs when available, fall back to IP addresses for unauthenticated requests. Consider geographic and network context.

**Graceful Degradation**: Provide clear error messages and Retry-After headers. Include current limit status in response headers for client awareness.

**Example Implementation**: See `/examples/code/security/jwt-api-security.example.js` for complete JWT service and comprehensive rate limiting implementations including multiple algorithms.

## Implementation Examples

For complete working examples of these security principles:

- **[Input Validation Examples](../../../examples/code/security/input-validation.example.js)** - Schema validation, SQL injection prevention, XSS protection
- **[Data Encryption Examples](../../../examples/code/security/data-encryption.example.js)** - AES-256-GCM encryption, key management, TLS configuration
- **[Session Security Examples](../../../examples/code/security/session-security.example.js)** - Encrypted sessions, integrity validation, suspicious activity detection
- **[JWT & API Security Examples](../../../examples/code/security/jwt-api-security.example.js)** - JWT implementation, rate limiting algorithms, API authentication

## Related Guidelines

- **[Security Principles](./security-principles.md)** - Core security concepts and governance
- **[Authentication Authorization](./authentication-authorization.md)** - Identity management patterns
- **[Testing Principles](./testing-principles.md)** - General testing approaches including security testing
- **[API Implementation Patterns](./api-implementation-patterns.md)** - API security patterns

## Navigation

- **[← Back to Guidelines](./README.md)** - All development guideline documentation
- **[Development Documentation](../README.md)** - All development documentation overview

---
---
version: "2.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "security-engineers", "backend-engineers"]
document_type: "guide"
priority: "critical"
tags: ["authentication", "authorization", "jwt", "mfa", "rbac", "abac", "sessions"]
difficulty: "advanced"
estimated_time: "15 min"
---

# Authentication & Authorization Core Principles

**Purpose**: Essential authentication and authorization principles, patterns, and decision frameworks for secure identity management. This guide focuses on WHAT, WHY, and WHEN rather than HOW - for implementation examples, see `/examples/code/auth/`.

## Authentication Principles

### Multi-Factor Authentication (MFA) Strategy

#### When to Require MFA
- **High-Value Accounts**: Administrative users, financial access, sensitive data handlers
- **Sensitive Operations**: Password changes, account settings, data exports, privilege escalation
- **Risk-Based Triggers**: Unusual login patterns, new devices, geographic anomalies
- **Compliance Requirements**: Regulatory mandates (SOX, HIPAA, PCI-DSS)

#### MFA Method Selection
- **TOTP (Time-based)**: Preferred for technical users, offline capability, no SMS vulnerabilities
- **SMS**: Convenient but vulnerable to SIM swapping, use only for low-risk scenarios
- **Email**: Backup method, suitable for account recovery flows
- **WebAuthn/FIDO2**: Highest security, phishing-resistant, hardware-based authentication
- **Push Notifications**: User-friendly, real-time validation, requires internet connectivity

#### Implementation Principles
- **Clock Skew Tolerance**: Allow 30-60 second window for TOTP validation
- **Token Reuse Prevention**: Track and reject previously used tokens within validity window
- **Backup Codes**: Provide single-use recovery codes for device loss scenarios
- **Progressive Enhancement**: Start with basic MFA, add stronger methods based on risk
- **Constant-Time Comparison**: Prevent timing attacks during token validation

### Password Security Framework

#### Password Requirements Strategy
- **Minimum Length**: 12 characters minimum, 16+ recommended for high-security accounts
- **Maximum Length**: 128 characters to prevent DoS attacks during hashing
- **Character Complexity**: Require mix of uppercase, lowercase, numbers, special characters
- **Entropy Threshold**: Minimum 60 bits of entropy for adequate security
- **Common Password Prevention**: Block passwords from breach databases and common lists
- **Personal Information Restriction**: Prevent use of user's personal data in passwords

#### Hashing and Storage Principles
- **Algorithm Selection**: bcrypt with cost factor 12+ (adjust based on hardware capabilities)
- **Salt Generation**: Unique cryptographic salt per password, handled automatically by bcrypt
- **Timing Attack Prevention**: Constant-time comparison and consistent delay patterns
- **Upgrade Path**: Plan for algorithm migration (bcrypt → scrypt → Argon2)

#### Password Policy Enforcement
- **Client-Side Validation**: User experience only, never rely for security
- **Server-Side Validation**: Primary enforcement point, comprehensive checks
- **Real-Time Feedback**: Password strength meter without revealing specific requirements
- **Grace Periods**: Allow existing users time to upgrade to new requirements

#### Password Reset Security
- **Token-Based Reset**: Cryptographically secure random tokens
- **Time-Limited Tokens**: 15-30 minute expiration for reset links
- **Single-Use Tokens**: Invalidate immediately after use or new token generation
- **Rate Limiting**: Prevent abuse of reset functionality
- **Identity Verification**: Multiple verification methods for high-value accounts

## Authorization Patterns

### Role-Based Access Control (RBAC) Principles

#### When to Use RBAC
- **Well-Defined User Roles**: Organizations with clear job functions and responsibilities
- **Stable Permission Sets**: Applications where permissions don't change frequently per user
- **Scalable User Management**: Large user bases where individual permission management is impractical
- **Compliance Requirements**: Regulations requiring clear role definitions and audit trails

#### RBAC Design Principles
- **Principle of Least Privilege**: Assign minimum permissions necessary for role function
- **Role Hierarchy**: Implement inheritance where higher roles include lower role permissions
- **Permission Granularity**: Balance between too coarse (overprivileged) and too fine (management overhead)
- **Separation of Duties**: Ensure critical operations require multiple roles or approvals

#### Role Assignment Strategy
- **Hierarchy Enforcement**: Users cannot assign roles equal to or higher than their own level
- **Approval Workflows**: Require manager approval for sensitive role assignments
- **Time-Based Roles**: Temporary elevated privileges with automatic expiration
- **Context-Sensitive Roles**: Role effectiveness based on location, time, or other factors

#### Permission Structure
- **Resource-Action Pattern**: Format permissions as `resource:action` (e.g., `users:read`, `reports:create`)
- **Wildcard Support**: Allow broad permissions like `users:*` for administrative roles
- **Negative Permissions**: Explicit denials that override positive permissions
- **Permission Inheritance**: Roles inherit permissions from parent roles in hierarchy

### Attribute-Based Access Control (ABAC) Principles

#### When to Use ABAC
- **Complex Authorization Requirements**: Fine-grained access control with multiple contextual factors
- **Dynamic Decision Making**: Authorization based on real-time attributes and environmental factors
- **Regulatory Compliance**: Requirements for detailed audit trails and policy enforcement
- **Multi-Tenant Systems**: Different organizations with varying access patterns and rules

#### ABAC Core Components
- **Subject Attributes**: User identity, roles, clearance level, department, organization
- **Resource Attributes**: Classification level, owner, creation date, sensitivity, category
- **Action Attributes**: Operation type, risk level, audit requirements
- **Environmental Attributes**: Time, location, IP address, device type, network security

#### Policy Evaluation Strategy
- **Rule Combination**: All rules must pass (AND) vs. any rule passes (OR) vs. weighted scoring
- **Fail-Safe Defaults**: Deny access when policy evaluation fails or encounters errors
- **Performance Optimization**: Cache frequently used attributes and policy decisions
- **Policy Conflict Resolution**: Define precedence rules for conflicting policy outcomes

#### Context-Aware Authorization
- **Time-Based Controls**: Business hours, embargo periods, maintenance windows
- **Location-Based Controls**: Geographic restrictions, IP allowlists, secure networks
- **Risk-Based Controls**: Device trust level, behavioral patterns, threat intelligence
- **Resource-Based Controls**: Ownership, organizational boundaries, data classification

#### Dynamic Rule Evaluation
- **Sandboxed Execution**: Secure evaluation environment for custom business logic
- **Helper Functions**: Pre-approved utility functions for common authorization patterns
- **Timeout Protection**: Prevent policy evaluation from blocking system performance
- **Error Handling**: Graceful degradation when dynamic rules fail to evaluate

## Session Management Principles

### Session Architecture Strategy

#### Session Storage Approaches
- **Server-Side Storage**: Store session data on server, send only session ID to client (recommended)
- **Encrypted Client Storage**: If client storage required, encrypt all session data with server-controlled keys
- **Stateless Tokens**: JWT with proper signing and validation for distributed architectures
- **Hybrid Approach**: Combine server storage with client tokens for scalability and security

#### Session Lifecycle Management
- **Creation**: Generate cryptographically secure session IDs (32+ bytes entropy)
- **Validation**: Verify session integrity and authenticity on every request
- **Renewal**: Regenerate session IDs after authentication and privilege changes
- **Termination**: Implement both explicit logout and automatic timeout mechanisms

### Session Security Controls

#### Session Fixation Prevention
- **ID Regeneration**: Create new session ID after successful authentication
- **Old Session Cleanup**: Destroy previous session data completely
- **Privilege Escalation**: Regenerate session on any permission level change
- **Cross-Site Protection**: Validate session context and origin

#### Session Hijacking Protection
- **IP Validation**: Optional consistency checking (consider mobile users and NAT)
- **Device Fingerprinting**: Track device characteristics for anomaly detection
- **Concurrent Session Limits**: Prevent unlimited simultaneous sessions per user
- **Anomaly Detection**: Monitor for impossible travel and unusual patterns

#### Timeout and Expiration Strategy
- **Absolute Timeout**: Maximum session lifetime regardless of activity (24 hours max)
- **Idle Timeout**: Session expires after period of inactivity (2 hours typical)
- **Progressive Timeout**: Shorter timeouts for higher privilege operations
- **Warning System**: Notify users before session expiration with extension option

### Session Data Management

#### Data Encryption and Storage
- **Encryption at Rest**: Encrypt session data using AES-256-GCM with unique keys
- **Key Derivation**: Derive session keys from master key using PBKDF2 or similar
- **Data Minimization**: Store only essential information in session context
- **Secure Transmission**: Always use HTTPS for session ID transmission

#### Session Context Tracking
- **User Attributes**: ID, role, permissions, organization, MFA status
- **Security Metadata**: Creation time, last activity, IP address, user agent
- **Application State**: Current workflow, temporary data, user preferences
- **Audit Information**: Login source, device fingerprint, geographic location

## JWT Token Security Principles

### JWT Architecture Decisions

#### Algorithm Selection
- **RS256 (Recommended)**: Asymmetric signing for distributed systems, key separation
- **HS256**: Symmetric signing for single-application use, simpler key management
- **ES256**: Elliptic curve signing for performance-critical applications
- **Avoid**: None algorithm (alg: none), weak algorithms (HS256 with weak secrets)

#### Token Structure Strategy
- **Access Tokens**: Short-lived (15-60 minutes), contain current permissions and user context
- **Refresh Tokens**: Long-lived (30 days), single-purpose for generating new access tokens
- **ID Tokens**: User identity information, separate from authorization tokens
- **Specialized Tokens**: Email verification, password reset, API access with specific scopes

### JWT Security Implementation

#### Token Validation Requirements
- **Standard Claims**: Verify issuer (iss), audience (aud), expiration (exp), issued at (iat)
- **Custom Claims**: Validate business-specific claims like scope, permissions, organization
- **Signature Verification**: Always verify token signature before trusting any claims
- **Clock Skew Tolerance**: Allow reasonable time variance (60 seconds) for distributed systems

#### Token Revocation Strategy
- **Revocation Lists**: Maintain blacklist of revoked token IDs in fast storage (Redis)
- **Short Expiration**: Use brief access token lifetimes to limit revocation window
- **User-Level Revocation**: Ability to invalidate all tokens for specific user
- **Refresh Token Rotation**: Generate new refresh token on each use, invalidate old one

#### Key Management Principles
- **Key Rotation**: Regular rotation of signing keys with graceful transition periods
- **Key Separation**: Different keys for different token types or applications
- **Secure Storage**: Hardware Security Modules (HSM) or secure key management services
- **Public Key Distribution**: Secure mechanism for clients to obtain current public keys

### Token Lifecycle Management

#### Generation Best Practices
- **Unique Identifiers**: Include JTI (JWT ID) claim for individual token tracking
- **Minimal Claims**: Include only necessary information to reduce token size
- **Consistent Format**: Standardize claim names and structures across applications
- **Metadata Inclusion**: Add token type, scope, and purpose for proper validation

#### Validation and Verification
- **Multi-Layer Validation**: Verify signature, claims, revocation status, and business rules
- **Performance Optimization**: Cache validation results and public keys appropriately
- **Error Handling**: Provide specific error messages for different validation failures
- **Audit Logging**: Log token validation failures and security events

## Rate Limiting and Account Protection Principles

### Rate Limiting Strategy

#### Rate Limiting Algorithms
- **Fixed Window**: Simple implementation, potential for traffic spikes at window boundaries
- **Sliding Window**: More accurate limiting, higher memory usage and complexity
- **Token Bucket**: Allows burst traffic up to bucket capacity, smooth rate limiting
- **Leaky Bucket**: Constant output rate regardless of input rate, good for traffic shaping

#### Rate Limit Categories
- **Authentication Limits**: 5 attempts per 15 minutes to prevent brute force attacks
- **Password Reset Limits**: 3 requests per hour to prevent abuse and harassment
- **API Rate Limits**: Tiered based on user type (free: 1000/hour, premium: 10000/hour)
- **Resource-Intensive Operations**: File uploads, search queries, email sending

#### Implementation Considerations
- **Identifier Strategy**: User ID for authenticated requests, IP address for anonymous
- **Distributed Enforcement**: Use Redis or similar for consistent limits across instances
- **Graceful Degradation**: Fail open with logging when rate limiting service unavailable
- **Header Communication**: Include X-RateLimit-* headers for client awareness

### Account Protection Mechanisms

#### Progressive Authentication Delays
- **Failure Tracking**: Track consecutive authentication failures per identifier
- **Progressive Delays**: Exponential backoff (1s, 4s, 9s, 16s, 25s) up to maximum (5 minutes)
- **Failure Reset**: Clear counters after successful authentication or time expiration
- **Account Lockout**: Temporary account lock after excessive failures (10+ attempts)

#### Suspicious Activity Detection
- **Geographic Anomalies**: Impossible travel patterns between login attempts
- **Device Fingerprinting**: Unusual device characteristics or rapid device changes
- **Behavioral Patterns**: Unusual access patterns, timing, or usage volumes
- **Threat Intelligence**: Integration with IP reputation and threat feeds

#### Account Lockout Strategy
- **Lockout Triggers**: Excessive failed attempts, suspicious activity, security violations
- **Lockout Duration**: Graduated timeouts based on threat severity and history
- **Unlock Mechanisms**: Automatic expiration, manual override, identity verification
- **User Communication**: Clear messaging about lockout reason and resolution steps

### Distributed Rate Limiting

#### Scalability Considerations
- **Centralized Storage**: Redis cluster for consistent state across application instances
- **Performance Optimization**: Local caching with periodic synchronization for high throughput
- **Fault Tolerance**: Graceful degradation when rate limiting infrastructure fails
- **Monitoring**: Real-time metrics for rate limit violations and system performance

## Decision Framework

### Authentication Method Selection

#### Risk-Based Authentication Decisions
1. **Assess Data Sensitivity**: Personal, financial, health data require strongest authentication
2. **Evaluate User Experience**: Balance security with usability for different user types
3. **Consider Compliance**: Regulatory requirements may dictate specific authentication methods
4. **Review Threat Model**: Consider likely attackers and their capabilities
5. **Resource Constraints**: Implement authentication proportional to available resources

#### Authentication Control Selection
- **High-Value Targets**: Multi-factor authentication with hardware tokens
- **General Users**: Password + TOTP or SMS for moderate security
- **Public APIs**: API keys with rate limiting and IP restrictions
- **Internal Services**: Mutual TLS or service-to-service tokens

### Authorization Architecture Selection

#### RBAC vs ABAC Decision Matrix
- **Use RBAC When**: Clear organizational roles, stable permissions, large user base
- **Use ABAC When**: Complex rules, contextual decisions, regulatory compliance
- **Hybrid Approach**: RBAC for basic permissions, ABAC for sensitive operations
- **Migration Strategy**: Start with RBAC, evolve to ABAC as complexity grows

#### Implementation Priorities

##### Phase 1: Foundation
1. Secure password handling and storage
2. Basic role-based access control
3. Session management with security controls
4. Rate limiting for authentication endpoints

##### Phase 2: Enhancement
1. Multi-factor authentication implementation
2. JWT token security with proper validation
3. Advanced rate limiting and account protection
4. Audit logging and monitoring

##### Phase 3: Advanced
1. Attribute-based access control
2. Risk-based authentication
3. Behavioral analysis and anomaly detection
4. Zero-trust architecture implementation

---

## Related Guidelines

- **[Security Principles](./security-principles.md)** - Core security concepts, threat modeling, and governance framework
- **[Security Implementation](./security-implementation.md)** - Practical security implementation patterns and decision frameworks
- **[API Implementation Patterns](./api-implementation-patterns.md)** - API authentication and authorization patterns
- **[Quality Standards](./quality-standards.md)** - Security requirements within quality standards
- **[Code Review Guidelines](./code-review-guidelines.md)** - Security-focused code review processes

## Implementation Examples

All implementation examples and working code patterns are available in:

- **[MFA Implementation Examples](../../../examples/code/auth/mfa-implementation.example.js)** - Comprehensive multi-factor authentication patterns
- **[Password Security Examples](../../../examples/code/auth/password-security.example.js)** - Secure password handling and validation
- **[RBAC Authorization Examples](../../../examples/code/auth/rbac-authorization.example.js)** - Role-based access control implementation
- **[ABAC Authorization Examples](../../../examples/code/auth/abac-authorization.example.js)** - Attribute-based access control patterns
- **[Session Management Examples](../../../examples/code/auth/session-management.example.js)** - Secure session handling and validation
- **[JWT Security Examples](../../../examples/code/auth/jwt-security.example.js)** - JSON Web Token security implementation
- **[Rate Limiting Examples](../../../examples/code/auth/rate-limiting.example.js)** - Account protection and rate limiting patterns

## Navigation

- **[← Back to Guidelines](./README.md)** - All development guideline documentation
- **[Development Documentation](../README.md)** - All development documentation overview

---

**System Guidelines**: [CLAUDE.md](../../../CLAUDE.md) - AI assistant instructions and project context
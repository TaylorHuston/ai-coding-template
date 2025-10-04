---
version: "1.0.0"
created: "2025-09-18"
last_updated: "2025-09-18"
status: "active"
target_audience: ["developers", "ai-assistants", "api-designers", "architects"]
document_type: "guide"
priority: "high"
tags: ["api-design", "rest", "graphql", "principles", "architecture", "documentation"]
---

# API Guidelines

**Purpose**: Comprehensive API design principles, documentation standards, and implementation patterns for building consistent, scalable, and maintainable APIs. This guide consolidates design philosophy, documentation requirements, and practical patterns.

## API Design Philosophy

### Core Principles

#### Developer Experience First
APIs should feel natural and intuitive to use:
- **Discoverability**: Clear naming and logical patterns help developers predict behavior
- **Consistency**: Similar operations follow identical patterns across all endpoints
- **Clarity**: Error messages provide actionable guidance, not cryptic codes
- **Completeness**: Documentation includes working examples and edge cases

#### Technology-Agnostic Design
Universal principles that apply regardless of implementation:
- **Resource-Oriented**: Model your domain as resources with clear relationships
- **Stateless Operations**: Each request contains all necessary information
- **Semantic Operations**: Use appropriate methods/operations for their intended purpose
- **Predictable Patterns**: Similar operations behave similarly across the API

#### Progressive Evolution
APIs should grow gracefully:
- **Backward Compatibility**: New versions don't break existing consumers
- **Incremental Enhancement**: Add capabilities without disrupting current usage
- **Clear Migration Paths**: Provide tools and guidance for version transitions
- **Deprecation Strategy**: Give consumers adequate time and support to migrate

#### Design for Reliability
Build APIs that handle real-world conditions:
- **Idempotent Operations**: Safe operations can be retried without side effects
- **Graceful Degradation**: Reduced functionality beats complete failure
- **Error Recovery**: Clear paths for resolving error conditions
- **Monitoring Ready**: Built-in observability for operational health

## REST API Design Fundamentals

### Resource Naming Conventions

#### URL Structure and HTTP Methods

**URL Principles**:
- Use **plural nouns** for collections (`/users`, `/orders`, `/products`)
- Use **lowercase** with **hyphens** for multi-word resources (`/order-items`, `/user-preferences`)
- Avoid **verbs** in URLs (use HTTP methods instead)
- Use **consistent** naming patterns across the API

**Method Usage**:
- **GET**: Retrieve data (safe, idempotent)
- **POST**: Create new resource (not idempotent)
- **PUT**: Update entire resource (idempotent)
- **PATCH**: Partial update (idempotent)
- **DELETE**: Remove resource (idempotent)

**Status Codes**:
- **Success**: `200 OK`, `201 Created`, `204 No Content`
- **Client Error**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`
- **Server Error**: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`

### API Versioning and Deprecation

**Versioning Strategies**:
- **URL Path** (Recommended): `/v1/users` - Easy to understand, simple routing and caching
- **Header-Based** (Alternative): `API-Version: 2.0` - Cleaner URLs, flexible versioning

**Deprecation Process**:
1. **Announcement** (6 months before): Communicate deprecation plans
2. **Warning Headers** (3 months before): Add deprecation headers to responses
3. **Migration Period** (2 months): Provide migration tools and support
4. **Sunset** (Planned date): Remove deprecated version

## API Paradigm Selection

### REST vs GraphQL vs RPC Considerations

#### REST APIs
**Best suited for**:
- Resource-oriented domains with clear CRUD operations
- Caching-heavy applications leveraging HTTP cache infrastructure
- Public APIs requiring broad client compatibility
- Teams familiar with web standards and HTTP semantics

**Design priorities**: Resource modeling, HTTP method semantics, stateless operations

#### GraphQL APIs
**Best suited for**:
- Client-driven data requirements with varying needs
- Applications with complex, nested data relationships
- Frontend teams needing flexible data fetching
- Rapid iteration on data requirements

**Design priorities**: Schema evolution, query flexibility, type safety

#### RPC APIs (gRPC, JSON-RPC)
**Best suited for**:
- Service-to-service communication within controlled environments
- Performance-critical applications requiring efficient serialization
- Strongly-typed languages with code generation capabilities
- Actions that don't map well to resource operations

**Design priorities**: Interface contracts, performance, type safety

### Universal Design Principles

#### Consistency Across Paradigms
Regardless of chosen paradigm, maintain:
- **Naming Conventions**: Consistent field and operation naming
- **Error Handling**: Standardized error response patterns
- **Authentication**: Uniform security model across all endpoints
- **Documentation**: Complete specification regardless of API style

**Semantic Versioning**:
- **Major versions**: Breaking changes requiring consumer updates
- **Minor versions**: Backward-compatible feature additions
- **Patch versions**: Bug fixes and clarifications

## GraphQL Schema Design

### Schema Evolution Principles
- **Schema-First Development**: Design schema as contract between frontend and backend
- **Nullable by Default**: Use `!` sparingly for truly required fields
- **Descriptive Types**: Self-documenting type and field names
- **Type System Design**: Custom scalars, clear object relationships, interfaces for polymorphism

### Query Optimization
- **Efficient Data Fetching**: Batch operations, cursor-based pagination, field selection
- **Resolver Efficiency**: Use DataLoader patterns to prevent N+1 queries
- **Query Complexity Management**: Depth limiting, cost analysis, query-based rate limiting

## API Security Principles

### Authentication and Security

**Authentication Methods**:
- **JWT Tokens**: Stateless authentication with essential claims, short lifetime, refresh rotation
- **API Keys**: Service-to-service authentication with scoped permissions and regular rotation
- **Session-Based**: Secure, HTTP-only cookies with CSRF protection and timeout handling

**Authorization Patterns**:
- **Role-Based**: Admin, User, Guest roles with hierarchical permissions
- **Resource-Based**: Ownership-based access, organization-level control
- **Scoped Access**: API key scopes, OAuth permission scopes, time-limited access

**Security Implementation**:
- Input sanitization and validation for all data types
- Access control enforcement at every endpoint
- Secure configuration management with proper encryption
- Comprehensive security logging and monitoring

## API Documentation Standards

### Documentation Philosophy

#### Documentation as Product
Treat API documentation as a first-class product:
- **User-Centered Design**: Written from the consumer's perspective
- **Iterative Improvement**: Regular updates based on user feedback
- **Usability Testing**: Validate documentation with actual developers
- **Maintenance Commitment**: Keep documentation synchronized with implementation
- **Progressive Disclosure**: Layer complexity from Quick Start to Advanced Guides

### Documentation Requirements

#### Essential Documentation Components

**API Overview**:
- **Purpose and Scope**: What the API does and its intended use cases
- **Getting Started Guide**: Authentication setup, first successful request
- **Base Concepts**: Core domain models and their relationships
- **Rate Limits and Quotas**: Usage constraints and fair use policies

**Operation Documentation**:
- **Business Context**: Why you would use this operation
- **Request/Response Examples**: Real data showing typical usage
- **Parameter Details**: Constraints, validation rules, and interdependencies
- **Error Scenarios**: Common failure cases and resolution steps

**Schema Documentation**:
- **Field Semantics**: What each field represents in business terms
- **Validation Rules**: Format requirements, ranges, and patterns
- **Relationship Mapping**: How entities connect to each other
- **Evolution Notes**: How fields change over API versions

#### Interactive Documentation

**Interactive Learning**:
- **Try-It-Out**: Execute real requests against sandbox environments
- **Code Examples**: Working samples in multiple programming languages
- **Postman Collections**: Pre-configured requests for immediate testing
- **SDK Integration**: Language-specific implementation examples
- **Testing Integration**: Example validation, automated accuracy checks, consumer testing

### Documentation Governance

#### Quality Standards and Feedback

**Accuracy Requirements**:
- **Example Verification**: All code examples must execute successfully
- **Schema Synchronization**: Documentation reflects current API behavior
- **Breaking Change Communication**: Clear migration guides for API changes
- **Version Mapping**: Document which features are available in which versions

**Accessibility Standards**:
- **Plain Language**: Avoid jargon and explain necessary technical terms
- **Visual Hierarchy**: Use consistent formatting and navigation structure
- **Search Optimization**: Enable quick discovery of relevant information
- **Multi-Format Support**: Provide documentation in multiple formats (web, PDF, mobile)

**Community Engagement**:
- **Feedback Channels**: Clear ways for developers to report documentation issues
- **Response Commitment**: Acknowledge and address feedback within defined timeframes
- **Usage Analytics**: Track which documentation sections are most/least used
- **Success Metrics**: Measure developer onboarding success and time-to-productivity

## Implementation Patterns

### Error Handling Patterns

#### Universal Error Response Structure
Establish consistent error formatting regardless of API paradigm:

**Core Error Components**:
- **Error Code**: Machine-readable identifier for programmatic handling
- **Message**: Human-readable description for developers and end users
- **Details**: Additional context including field-specific information
- **Request ID**: Unique identifier for debugging and support

**Example Structure** (adaptable to any format):
```
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field_errors": {
        "email": ["Invalid email format"],
        "password": ["Must be at least 8 characters"]
      },
      "request_id": "req_123456789"
    }
  }
}
```

#### Error Classification and Recovery

**Client Errors (4xx)**:
- **Validation Errors**: Invalid input format or business rule violations
- **Authentication Errors**: Missing or invalid credentials
- **Authorization Errors**: Insufficient permissions for requested operation
- **Resource Errors**: Requested resource not found or conflict states

**Server Errors (5xx)**:
- **Processing Errors**: Internal failures during request processing
- **Dependency Errors**: External service failures or timeouts
- **Resource Exhaustion**: Rate limits, capacity constraints, or system overload

**Error Recovery**:
- **Actionable Messages**: Clear problem description with specific resolution steps
- **Retry Strategy**: Indicate retryable errors with appropriate timing guidance
- **Alternative Actions**: Suggest alternative approaches when primary action fails
- **Circuit Breaking**: Communicate when services are temporarily unavailable

### Performance Optimization

**Efficient Operations**:
- Minimize database round trips through optimized queries
- Implement appropriate caching strategies with proper cache headers
- Design efficient pagination patterns (cursor-based or limit/offset)
- Avoid N+1 query problems through proper data fetching

**Rate Limiting**:
- **Per-user/endpoint limits** with graceful degradation
- **Clear communication** through rate limit headers and retry-after suggestions
- **Usage monitoring** with quota tracking and analytics

### Testing Strategies

**API Testing**:
- **Contract Testing**: API contract validation and schema compliance
- **Integration Testing**: End-to-end API workflows and authentication flows
- **Performance Testing**: Load testing and response time validation
- **Security Testing**: Authentication, authorization, and input validation testing

**Documentation Testing**:
- **Example Validation**: Run all code examples as part of build process
- **Accuracy Verification**: Automated checks ensure documentation matches implementation
- **Code Generation Testing**: Validate that generated SDKs work correctly
- **User Acceptance Testing**: Regular validation with real developers

## API Consistency and Developer Experience

### Consistency Principles

#### Naming Conventions
Establish predictable patterns across all API operations:

**Resource Naming**:
- **Consistent Terminology**: Use the same term for the same concept throughout
- **Clear Hierarchies**: Reflect natural domain relationships in URL structure
- **Intuitive Pluralization**: Follow language-appropriate plural/singular patterns
- **Avoid Abbreviations**: Use full words unless abbreviations are industry standard

**Field Naming**:
- **Uniform Casing**: Choose camelCase, snake_case, or kebab-case consistently
- **Descriptive Names**: Field names should be self-documenting
- **Consistent Types**: Same data types for similar concepts (timestamps, IDs, etc.)
- **Standard Patterns**: Use established patterns for common fields (created_at, updated_at)

#### Operation Patterns
Create predictable interaction models:

**CRUD Consistency**:
- **Create Operations**: Consistent input validation and response format
- **Read Operations**: Uniform query patterns and response structure
- **Update Operations**: Clear semantics for full vs partial updates
- **Delete Operations**: Consistent soft vs hard delete behavior

**Collection Operations**:
- **Filtering**: Standard query parameter patterns for filtering
- **Sorting**: Consistent sort parameter syntax and behavior
- **Pagination**: Uniform pagination approach across all collections
- **Search**: Standardized search parameter handling

### Developer Experience Optimization

#### Developer Experience Optimization

**Discoverability**: Include relevant action links, related resources, and documentation references in responses
**Error Prevention**: Comprehensive validation, safe defaults, confirmation patterns for destructive actions
**Performance**: Efficient defaults, lazy loading, batch operations, and proper caching support

## Best Practices

**Design Process**:
1. **Understand Use Cases**: Gather requirements from API consumers
2. **Design Resources**: Identify resources and their relationships
3. **Define Operations**: Map business operations to HTTP methods
4. **Design Data Models**: Create consistent, well-structured schemas
5. **Plan Authentication**: Design appropriate auth and authorization
6. **Document Thoroughly**: Create comprehensive, accurate documentation
7. **Test Extensively**: Validate all aspects of the API design
8. **Gather Feedback**: Iterate based on developer feedback

**Maintenance and Evolution**:
- **Version Management**: Plan for API versioning and evolution
- **Deprecation Strategy**: Communicate changes and provide migration paths
- **Monitoring**: Track API usage and performance metrics
- **Community**: Engage with API consumers for feedback and improvements

## Related Guidelines

**Core Foundation**:
- **Architectural Principles**: `architectural-principles.md` - Foundation principles (DRY, KISS, YAGNI, SOLID)
- **Authentication & Authorization**: `authentication-authorization.md` - Security identity patterns

**Implementation**:
- **Security Guidelines**: `security-guidelines.md` - Comprehensive security patterns and practices
- **Testing Standards**: `testing-standards.md` - API testing strategies and validation patterns
- **Documentation Standards**: `documentation-standards.md` - General documentation principles

**Quality Assurance**:
- **Code Review Guidelines**: `code-review-guidelines.md` - Review processes for API changes
- **Quality Standards**: `quality-standards.md` - Quality metrics and validation approaches

**Reference Materials**:
- **Implementation Examples**: `.claude/resources/examples/api/` - Working code examples for different API patterns
- **Cross-Reference Map**: `CROSS-REFERENCE-MAP.md` - Complete guideline interconnections
- **Visual Documentation**: `visual-documentation.md` - Diagrams and architectural visualizations

## Summary

This guide provides technology-agnostic API design principles focusing on developer experience, consistency, and maintainability. The principles apply regardless of whether you choose REST, GraphQL, RPC, or other API paradigms.

**Key Takeaways**:
- **Developer Experience First**: APIs should be intuitive and self-documenting
- **Consistency Across Paradigms**: Similar operations should behave similarly
- **Progressive Evolution**: APIs should grow gracefully over time
- **Documentation as Product**: Treat documentation as a first-class deliverable
- **Error Recovery**: Design for real-world failure scenarios

Apply these principles thoughtfully, adapting them to your specific domain and technology constraints while maintaining the core focus on developer experience and system reliability.
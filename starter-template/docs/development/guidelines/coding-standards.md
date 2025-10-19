---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-18"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "specification"
priority: "high"
tags: ["coding", "standards", "conventions", "quality"]
difficulty: "intermediate"
estimated_time: "15 min"
---

# Coding Standards

**Purpose**: Language-agnostic coding conventions and standards for consistent, maintainable, and AI-friendly codebases.

## Core Principles

### Readability First
- Code is written once but read many times
- Optimize for clarity over cleverness
- Use descriptive names that explain intent
- Maintain consistent formatting and structure

### Consistency
- Follow established patterns within the project
- Use consistent naming conventions throughout
- Apply formatting rules uniformly
- Maintain architectural consistency

### Simplicity
- Prefer simple solutions over complex ones
- Avoid premature optimization
- Write code that is easy to understand and modify
- Use clear, straightforward logic flows

### AI Collaboration Ready
- Write code that AI assistants can easily understand and extend
- Use clear, descriptive comments for complex logic
- Maintain consistent patterns for AI pattern recognition
- Structure code in logical, predictable ways

## Naming Conventions

### General Rules
- Use descriptive, unambiguous names
- Avoid abbreviations unless they're widely understood
- Be consistent with naming patterns within a project
- Use searchable names (avoid single letters except for loops)

### Variables and Functions
**Good Practices**: Use descriptive and clear variable names like `userAccountBalance`, `isUserAuthenticated`, and function names like `calculateTotalPrice(items, taxRate)`.

**Anti-Patterns**: Unclear and abbreviated names like `uab`, `auth`, or function names like `calc(i, t)`.

### Constants
**Good Practices**: Use clear purpose and scope with names like `MAX_RETRY_ATTEMPTS`, `DEFAULT_API_TIMEOUT`, and structured objects like `USER_ROLES` with descriptive properties.

**Anti-Patterns**: Unclear constants like `MAX`, inconsistent naming, or abbreviated role definitions.

### Classes and Types
**Good Practices**: Clear, descriptive class names like `UserAuthenticationService`, `PaymentProcessor`, interface names like `DatabaseConnection`, and generic types like `ApiResponse<T>`.

**Anti-Patterns**: Unclear or generic names like `Service`, `Manager`, or overly broad interface names.

### Files and Directories
- Use lowercase-kebab-case for files and directories
- Be descriptive but concise
- Group related files logically
- Use consistent naming patterns

**Directory Structure**: Organize with clear hierarchy like `user-authentication/`, `payment-processing/`, and `shared/` with descriptive file names within each directory.

## Code Organization

### File Structure
- Keep files focused on a single responsibility
- Limit file length (generally under 300 lines)
- Organize imports/requires at the top
- Export/expose public interfaces clearly

**File Organization Pattern**:
1. Imports/requires
2. Constants
3. Helper functions (internal)
4. Main functionality
5. Default export (if applicable)

### Function Organization
- Keep functions small and focused (generally under 50 lines)
- Use pure functions when possible
- Minimize side effects
- Return early to reduce nesting

**Function Design Principles**: Validate inputs early, handle edge cases first, return meaningful results, and use early returns to reduce complexity.

### Module Organization
- Group related functionality into modules
- Use clear module boundaries
- Minimize dependencies between modules
- Export only what's necessary

**Module Boundaries**: Separate user operations, authentication logic, and shared utilities into distinct modules with clear interfaces.

## Error Handling

### Consistent Error Patterns
- Use consistent error handling patterns throughout the project
- Provide meaningful error messages
- Include relevant context in errors
- Handle errors at appropriate levels

**Error Strategy**: Implement try-catch blocks with specific error types, log errors with context, and provide actionable error messages.

### Error Types
- Define specific error types for different scenarios
- Include error codes for programmatic handling
- Provide user-friendly messages when appropriate

**Error Classes**: Create specialized error types like `ValidationError`, `DatabaseError`, and `AuthenticationError` with relevant context and error codes.

## Logging Standards

### Log Levels
- **ERROR**: System errors, exceptions, failures
- **WARN**: Potential issues, deprecated usage, fallbacks
- **INFO**: Important system events, user actions
- **DEBUG**: Detailed diagnostic information

### Log Structure
**Structured Logging**: Use consistent log format with timestamp, action, and relevant context. Include structured data for easier parsing and analysis.

### Security Considerations
- Never log sensitive information (passwords, tokens, personal data)
- Sanitize log output
- Use appropriate log levels for security events

**Safe Logging Practices**: Mask sensitive data, log security events appropriately, and avoid exposing system internals in logs.

## Comments and Documentation

### When to Comment
- Explain **why**, not **what**
- Document complex business logic
- Explain non-obvious technical decisions
- Provide context for future maintainers

**Comment Guidelines**: Focus on business rationale, complex algorithms, and architectural decisions rather than obvious code functionality.

### Function Documentation
**Documentation Standards**: Use standard documentation formats (JSDoc, Python docstrings, etc.) with parameter descriptions, return values, and error conditions.

**Documentation Elements**: Include purpose, parameters, return values, exceptions, and usage examples for complex functions.

## Code Formatting

### Consistency Rules
- Use consistent indentation (2 or 4 spaces, never tabs)
- Follow language-specific formatting conventions
- Use automated formatting tools when available
- Maintain consistent line length (80-120 characters)

### Automated Formatting
Use project-appropriate formatters:
- **JavaScript/TypeScript**: Prettier
- **Python**: Black
- **Go**: gofmt
- **Rust**: rustfmt

## Performance Considerations

### General Guidelines
- Write clear code first, optimize when necessary
- Measure performance before optimizing
- Use appropriate data structures for the task
- Consider memory usage and garbage collection

### Common Performance Patterns
**Optimization Strategies**: Implement efficient iteration, early exits for expensive operations, caching for repeated computations, and batch operations where appropriate.

**Performance Best Practices**: Use lazy loading, implement proper caching strategies, optimize database queries, and minimize unnecessary computations.

## Security Standards

### Input Validation
- Validate all external inputs
- Sanitize data before processing
- Use parameterized queries for database operations
- Validate file uploads and user content

**Validation Strategy**: Implement comprehensive input validation, sanitization, and use safe database query patterns.

### Sensitive Data Handling
- Never hardcode secrets in source code
- Use environment variables for configuration
- Encrypt sensitive data at rest and in transit
- Follow principle of least privilege

**Security Practices**: Use environment-based configuration, implement proper password hashing, use parameterized queries, and secure authentication patterns.

## AI Collaboration Guidelines

### AI-Friendly Patterns
- Use consistent, predictable code patterns
- Avoid overly clever or obscure code
- Maintain clear separation of concerns
- Use descriptive variable and function names

### Context for AI Assistants
**AI Collaboration**: Provide clear function documentation, explain complex business logic, use standard patterns, and maintain consistent code structure.

## Testing Integration

### Testable Code
- Write code that's easy to test
- Minimize dependencies and side effects
- Use dependency injection where appropriate
- Separate pure logic from I/O operations

**Testable Design**: Implement dependency injection, create pure functions, separate concerns, and design for mockability.

**Testing Patterns**: Use dependency injection for external services, implement pure validation functions, and design testable interfaces.

## Best Practices

### Code Quality Process
1. **Write Clear Code**: Focus on readability and maintainability
2. **Apply Standards**: Follow established coding conventions consistently
3. **Review Regularly**: Conduct code reviews for quality and consistency
4. **Refactor Continuously**: Improve code structure as understanding evolves
5. **Document Decisions**: Record architectural and design decisions

### Continuous Improvement
- **Learn from Reviews**: Apply feedback to improve coding practices
- **Update Standards**: Evolve standards based on project needs and industry best practices
- **Share Knowledge**: Document patterns and share learning across the team
- **Measure Quality**: Track code quality metrics and improvement over time

## Related Guidelines

- **Implementation Examples**: See `.claude/resources/examples/code/patterns/` for working code examples demonstrating all patterns
- **Code Review**: See `code-review-guidelines.md` for review processes and quality checks
- **Testing Standards**: See `testing-standards.md` for testing patterns and testable code design
- **Security Guidelines**: See `security-guidelines.md` for comprehensive security practices
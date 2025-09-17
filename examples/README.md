---
version: "1.0.0"
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

## 🔍 Quick Reference

### By Development Task

| I need to... | Use this example | File |
|--------------|------------------|------|
| **Create an API service** | Service class patterns | [api-user-service.example.ts](./code/patterns/api-user-service.example.ts) |
| **Build a React component** | Component with TypeScript | [component-user-card.example.tsx](./code/patterns/component-user-card.example.tsx) |
| **Handle configuration** | Environment config patterns | [config-app-config.example.ts](./code/configs/config-app-config.example.ts) |
| **Write unit tests** | Testing best practices | [test-user-service.example.test.ts](./code/patterns/test-user-service.example.test.ts) |
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

1. **Start with Configuration**: [config-app-config.example.ts](./code/configs/config-app-config.example.ts)
2. **Learn Service Patterns**: [api-user-service.example.ts](./code/patterns/api-user-service.example.ts)
3. **Understand Testing**: [test-user-service.example.test.ts](./code/patterns/test-user-service.example.test.ts)
4. **Build UI Components**: [component-user-card.example.tsx](./code/patterns/component-user-card.example.tsx)

---

**Examples vs Templates**: Examples are complete reference implementations for learning. For fill-in-the-blank starting points, see the [Templates Directory](/templates/).

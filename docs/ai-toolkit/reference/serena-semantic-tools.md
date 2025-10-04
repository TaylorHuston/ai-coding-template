---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "reference"
tags: ["serena", "semantic-analysis", "mcp", "tools"]
---

# Serena Semantic Tools Reference

**Quick reference for Serena's semantic code analysis capabilities in the AI Coding Template.**

## Overview

Serena provides semantic code understanding through LSP-based tools, enabling token-efficient and precise code analysis across multiple programming languages.

## Core Tools

### `mcp__serena__find_symbol`

**Purpose**: Locate symbols (functions, classes, variables) by name or pattern

**Usage Patterns**:
```javascript
// Find specific symbol
await mcp__serena__find_symbol("UserController");

// Find with pattern matching
await mcp__serena__find_symbol("authenticate*");

// Find multiple related symbols
await mcp__serena__find_symbol("User|Account|Profile");
```

**Returns**:
- Symbol name and location
- Symbol type (class, function, variable, etc.)
- Code context and definition
- File path and line number

**Best For**:
- Architectural analysis
- Code exploration
- Pattern identification
- Refactoring preparation

### `mcp__serena__find_referencing_symbols`

**Purpose**: Find all references to a specific symbol across the codebase

**Usage Patterns**:
```javascript
// Find all usages of a function
await mcp__serena__find_referencing_symbols("authenticate");

// Analyze impact of changes
await mcp__serena__find_referencing_symbols("UserService.login");

// Trace data flow
await mcp__serena__find_referencing_symbols("userInput");
```

**Returns**:
- All reference locations
- Context around each reference
- Call patterns and relationships
- Dependency mapping

**Best For**:
- Impact analysis
- Security auditing
- Refactoring safety
- Dependency tracking

### `mcp__serena__insert_after_symbol`

**Purpose**: Insert code at precise locations with semantic context awareness

**Usage Patterns**:
```javascript
// Add error handling after function
await mcp__serena__insert_after_symbol(
  "function validateUser(data)",
  "  if (!data) throw new Error('Invalid input');"
);

// Insert security check
await mcp__serena__insert_after_symbol(
  "app.post('/login'",
  "  rateLimiter, // Add rate limiting"
);
```

**Best For**:
- Precise code modifications
- Adding middleware
- Security enhancements
- Bug fixes

## Agent Integration Examples

### Security Auditor Workflow

```javascript
// 1. Find authentication entry points
const authFunctions = await mcp__serena__find_symbol("login|signin|authenticate");

// 2. Analyze each for security issues
for (const func of authFunctions) {
  const references = await mcp__serena__find_referencing_symbols(func.name);
  // Check for rate limiting, input validation, etc.
}

// 3. Add security enhancements
await mcp__serena__insert_after_symbol(
  "app.post('/auth/login'",
  "  rateLimitMiddleware,"
);
```

### Refactoring Specialist Workflow

```javascript
// 1. Find target for refactoring
const oldPattern = await mcp__serena__find_symbol("UserService.getUser");

// 2. Analyze impact of change
const references = await mcp__serena__find_referencing_symbols("UserService.getUser");
console.log(`Found ${references.length} usages to update`);

// 3. Apply refactoring
await mcp__serena__insert_after_symbol(
  "class UserService",
  "  async getUserById(id) { /* new implementation */ }"
);
```

### Performance Optimizer Workflow

```javascript
// 1. Find performance-critical code
const dbQueries = await mcp__serena__find_symbol("*Query|*query");

// 2. Analyze query patterns
for (const query of dbQueries) {
  const usage = await mcp__serena__find_referencing_symbols(query.name);
  // Check for N+1 queries, missing indexes, etc.
}

// 3. Add performance optimizations
await mcp__serena__insert_after_symbol(
  "User.findMany(",
  "  include: { posts: true }, // Eager loading"
);
```

## Language Support

### Supported Languages
- **JavaScript/TypeScript**: Full support
- **Python**: Full support
- **Java**: Full support
- **Go**: Full support
- **Rust**: Full support
- **C#**: Full support
- **PHP**: Full support
- **Ruby**: Full support

### Language-Specific Patterns

#### JavaScript/TypeScript
```javascript
// Find React components
await mcp__serena__find_symbol("*Component|*Hook");

// Find Express routes
await mcp__serena__find_symbol("app.get|app.post|router.*");

// Find async functions
await mcp__serena__find_symbol("async function*");
```

#### Python
```python
# Find class definitions
await mcp__serena__find_symbol("class *");

# Find Django views
await mcp__serena__find_symbol("*View|*view");

# Find FastAPI routes
await mcp__serena__find_symbol("@app.*|@router.*");
```

#### Java
```java
// Find Spring controllers
await mcp__serena__find_symbol("@Controller|@RestController");

// Find service classes
await mcp__serena__find_symbol("*Service");

// Find JPA entities
await mcp__serena__find_symbol("@Entity");
```

## Best Practices

### Token Efficiency
- Use semantic tools instead of reading entire files
- Target specific symbols rather than broad searches
- Combine with context analysis for precise understanding

### Security Applications
- Trace user input flows with `find_referencing_symbols`
- Find security-critical functions with patterns
- Use precise insertion for security enhancements

### Architectural Analysis
- Map component relationships through symbol references
- Identify architectural patterns across codebase
- Understand cross-cutting concerns through semantic analysis

### Refactoring Safety
- Always analyze impact before making changes
- Use `find_referencing_symbols` to understand dependencies
- Test semantic changes in isolated contexts first

## Integration with Other MCP Tools

### Combined with context7
```javascript
// Get official documentation for patterns found
const patterns = await mcp__serena__find_symbol("*Service");
const docs = await mcp__context7__get_library_docs("service-pattern");
```

### Combined with sequential-thinking
```javascript
// Complex analysis workflow
await mcp__sequential_thinking__sequentialthinking(`
  Analyze the authentication flow:
  1. Use Serena to find all auth-related symbols
  2. Trace data flow through semantic references
  3. Identify security vulnerabilities
  4. Recommend specific improvements
`);
```

### Combined with gemini-cli
```javascript
// Multi-model architectural analysis
const codeStructure = await mcp__serena__find_symbol("*Controller|*Service");
const analysis = await mcp__gemini_cli__prompt(`
  Analyze this code structure: ${JSON.stringify(codeStructure)}
  Suggest architectural improvements.
`);
```

## Troubleshooting

### Common Issues

**LSP not starting**:
- Ensure language server is installed for target language
- Check project configuration files (tsconfig.json, etc.)

**Symbols not found**:
- Verify file is part of project workspace
- Check for syntax errors in target files
- Ensure LSP has indexed the codebase

**Performance issues**:
- Use specific symbol patterns instead of wildcards
- Limit scope to relevant directories
- Allow time for initial LSP indexing

### Configuration

Serena automatically configures LSP servers for supported languages. For custom setups, create `.serena/config.yaml`:

```yaml
language_servers:
  typescript:
    command: "typescript-language-server"
    args: ["--stdio"]
  python:
    command: "pylsp"
    args: []
```

## See Also

- [MCP Setup Guide](../setup/mcp-setup.md) - Initial Serena configuration
- [Semantic Security Example](../../../examples/code/security/semantic-security-analysis.example.js) - Complete security audit workflow
- [Agent Documentation](../guides/using-agents.md) - How agents use semantic tools
- [Troubleshooting Guide](./troubleshooting.md) - Solving common issues

---

**Related**: [Claude Code Documentation](https://docs.anthropic.com/claude-code) | [Serena Project](https://github.com/oraios/serena)
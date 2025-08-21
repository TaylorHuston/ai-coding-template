# GitHub Copilot Instructions

These instructions help GitHub Copilot understand this project and generate appropriate code suggestions.

## Project Context

This is an AI coding template repository designed for projects that use AI coding assistants like GitHub Copilot, Claude Code, and Cursor. The template focuses on patterns and practices that work well with AI tools while maintaining code quality and consistency.

## Code Style and Conventions

### General Principles
- Write clear, readable code with descriptive names
- Follow existing patterns and conventions in the project  
- Keep functions small and focused on single responsibilities
- Add meaningful comments for complex logic
- Use consistent naming conventions (camelCase for JS/TS, snake_case for Python)

### TypeScript/JavaScript
- Use TypeScript with proper type definitions when available
- Prefer `const` over `let`, avoid `var`
- Use async/await over Promise chains
- Handle errors explicitly with try/catch blocks
- Use meaningful variable names instead of abbreviations

### Python
- Follow PEP 8 style guidelines
- Use type hints for function parameters and return values
- Use f-strings for string formatting
- Handle exceptions with specific exception types
- Use dataclasses for simple data containers

## Architecture Patterns

This project follows these architectural principles:

### Clean Code Structure
- Clear separation of concerns between layers
- Dependency injection for testability
- Interface-based design for flexibility
- Consistent error handling patterns

### File Organization
```
src/
├── components/     # Reusable components/modules
├── services/      # Business logic and external services  
├── utils/         # Helper functions and utilities
├── types/         # Type definitions
├── config/        # Configuration files
└── tests/         # Test files
```

## Testing Approach

- Write tests for new functionality using existing test patterns
- Use descriptive test names that explain the scenario
- Follow Arrange-Act-Assert pattern
- Mock external dependencies in unit tests
- Include both positive and negative test cases

Example test structure:
```typescript
describe('ComponentName', () => {
  it('should do something when given valid input', () => {
    // Arrange
    const input = { /* test data */ };
    
    // Act
    const result = component.method(input);
    
    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

## Security Guidelines

- Never include real API keys, passwords, or secrets in code
- Validate and sanitize all user inputs
- Use parameterized queries for database operations
- Implement proper authentication and authorization
- Handle sensitive data appropriately (encryption, masking in logs)

## Documentation Standards

- Use clear, concise JSDoc/docstring comments for public functions
- Include parameter types and return value descriptions
- Document complex algorithms or business logic
- Keep README files updated with setup and usage instructions

## AI Assistance Guidelines

When generating code suggestions:

1. **Follow Existing Patterns**: Look at similar functions/components in the codebase and follow the same patterns
2. **Use Project Dependencies**: Only suggest libraries and frameworks that are already in the project
3. **Include Error Handling**: Add appropriate error handling for network requests, file operations, etc.
4. **Add Type Safety**: Include proper TypeScript types or Python type hints
5. **Consider Testing**: Structure code to be easily testable with clear inputs/outputs

## Common Code Patterns

### API Service Pattern
```typescript
class ApiService {
  async getData(id: string): Promise<Data> {
    try {
      const response = await fetch(`/api/data/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      logger.error('Error fetching data:', error);
      throw error;
    }
  }
}
```

### Repository Pattern (Python)
```python
class UserRepository:
    def __init__(self, db_connection: DatabaseConnection):
        self.db = db_connection
    
    async def find_by_id(self, user_id: str) -> Optional[User]:
        query = "SELECT * FROM users WHERE id = %s"
        result = await self.db.fetch_one(query, (user_id,))
        return User(**result) if result else None
```

### Error Handling Pattern
```typescript
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

## Performance Considerations

- Use appropriate data structures for the task
- Implement caching for expensive operations
- Consider memory usage for large datasets
- Use pagination for large result sets
- Optimize database queries and API calls

## Accessibility

When generating UI components:
- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation works
- Use sufficient color contrast
- Include alt text for images

## Environment and Configuration

- Use environment variables for configuration
- Provide sensible defaults for development
- Validate configuration on startup
- Keep secrets out of the codebase

## Commit Message Format

When suggesting commit messages:
```
type(scope): description

- feat: new feature
- fix: bug fix  
- docs: documentation changes
- style: formatting changes
- refactor: code restructuring
- test: adding tests
- chore: maintenance tasks
```

Remember: The goal is to generate code that is maintainable, secure, and follows the project's established patterns. When in doubt, prefer clarity and simplicity over cleverness.
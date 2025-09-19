# AI Code Review Feedback Example

## Security Concerns

- ❌ **SQL Injection Risk**: Line 45 - Raw string concatenation in query
  - **Fix**: Use parameterized queries: `query('SELECT * FROM users WHERE id = ?', [userId])`
  - **AI Pattern**: AI should use prepared statements for all database queries

## Performance Issues

- ⚠️ **N+1 Query Problem**: Lines 67-72 - Loop with individual database calls
  - **Fix**: Use batch query or join to fetch related data
  - **AI Learning**: Provide examples of efficient data fetching patterns

## Code Quality

- ✅ **Good**: Clear variable naming and function structure
- ✅ **Good**: Comprehensive error handling
- ⚠️ **Improvement**: Consider extracting validation logic to separate function

## AI Analysis Summary

```javascript
/*
AI Analysis Summary:
- Security: ✅ No obvious vulnerabilities detected
- Performance: ⚠️ O(n²) complexity in sorting function - consider using built-in sort
- Testing: ❌ Missing test coverage for error handling paths
- Style: ✅ Follows project conventions
- Complexity: ⚠️ Cyclomatic complexity 8/10 - consider refactoring

Human Review Required:
- Business logic validation for pricing calculations
- Integration testing with payment gateway
- Performance testing under load conditions
*/
```
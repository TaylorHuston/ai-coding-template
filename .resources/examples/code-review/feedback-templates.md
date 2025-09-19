# Code Review Feedback Templates

## Good vs Poor Feedback Examples

### Good feedback
The function could be more efficient by using a Map instead of nested loops. Consider extracting this validation logic into a separate utility function. This error handling doesn't account for network timeout scenarios.

### Avoid personal criticism
You always write inefficient code. Why didn't you think about this edge case? This is a terrible approach.

## Specific and Actionable Feedback

### Good: Specific and actionable

**Issue**: The user lookup query could be vulnerable to SQL injection.

**Solution**: Replace line 23 with parameterized query:

```sql
SELECT * FROM users WHERE email = ? AND active = ?
```

**Impact**: Prevents SQL injection attacks and improves security posture.

### Poor: Vague and unhelpful
This code has security issues. Please fix.

## Categorized Feedback by Priority

### Critical (Must Fix Before Merge)
🚨 **Security**: SQL injection vulnerability on line 45
🚨 **Bug**: Null pointer exception when user.profile is undefined

### Important (Should Fix)
⚠️ **Performance**: N+1 query issue could impact response times
⚠️ **Maintainability**: Function is too complex, consider splitting

### Suggestion (Nice to Have)
💡 **Style**: Consider using destructuring for cleaner code
💡 **Documentation**: Add JSDoc comments for public methods
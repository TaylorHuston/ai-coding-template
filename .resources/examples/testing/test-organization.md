# Test Organization Structure

## File Structure Example

```
project/
├── src/
│   ├── services/
│   │   └── user-service.js
│   └── api/
│       └── user-routes.js
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   │   └── user-service.test.js
│   │   └── utils/
│   │       └── validators.test.js
│   ├── integration/
│   │   ├── api/
│   │   │   └── user-routes.test.js
│   │   └── database/
│   │       └── user-repository.test.js
│   ├── e2e/
│   │   ├── user-flows/
│   │   │   └── registration.test.js
│   │   └── admin-flows/
│   │       └── user-management.test.js
│   ├── fixtures/
│   │   ├── users.json
│   │   └── test-data.js
│   └── helpers/
│       ├── test-setup.js
│       └── mock-factories.js
└── package.json
```

## Naming Conventions

- Test files: `*.test.js` or `*.spec.js`
- Test directories mirror source structure
- Descriptive test names that read as sentences
- Group related tests with `describe` blocks

## Good Test Organization Example

```javascript
// Good: Descriptive test organization
describe('UserService', () => {
  describe('when creating a new user', () => {
    it('should return user with generated ID for valid data', () => {});
    it('should throw ValidationError for missing email', () => {});
    it('should throw ValidationError for duplicate email', () => {});
  });

  describe('when updating existing user', () => {
    it('should update only provided fields', () => {});
    it('should throw NotFoundError for non-existent user', () => {});
  });
});
```
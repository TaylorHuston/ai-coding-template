---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "technical-writers", "api-designers"]
document_type: "guide"
priority: "high"
tags: ["api-documentation", "openapi", "swagger", "graphql", "documentation"]
---

# API Documentation Standards

**Purpose**: Comprehensive standards for API documentation using OpenAPI specifications, GraphQL schemas, and documentation best practices.

## OpenAPI Specification Standards

### **Complete API Documentation Structure**

```yaml
# openapi.yml - Comprehensive example
openapi: 3.0.3
info:
  title: User Management API
  description: |
    A comprehensive API for managing users, authentication, and user data.

    ## Authentication
    This API uses Bearer token authentication. Include your JWT token in the Authorization header:
    ```
    Authorization: Bearer your-jwt-token
    ```

    ## Rate Limiting
    All endpoints are rate limited. See response headers for current limits:
    - `X-RateLimit-Limit`: Maximum requests per window
    - `X-RateLimit-Remaining`: Remaining requests in current window
    - `X-RateLimit-Reset`: Unix timestamp when the window resets

    ## Error Handling
    All errors follow a consistent format with appropriate HTTP status codes and descriptive messages.
  version: 2.0.0
  contact:
    name: API Support
    email: api-support@example.com
    url: https://docs.example.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.example.com/v2
    description: Production server
  - url: https://staging-api.example.com/v2
    description: Staging server
  - url: http://localhost:3000/api/v2
    description: Development server

security:
  - BearerAuth: []
  - ApiKeyAuth: []

paths:
  /users:
    get:
      summary: List users
      description: Retrieve a paginated list of users with optional filtering and sorting.
      operationId: getUsers
      tags:
        - Users
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
        - name: status
          in: query
          description: Filter users by status
          schema:
            type: string
            enum: [active, inactive, pending]
        - name: role
          in: query
          description: Filter users by role
          schema:
            type: string
            enum: [admin, user, moderator]
        - name: sort
          in: query
          description: Sort field and direction
          schema:
            type: string
            pattern: '^[a-zA-Z_]+:(asc|desc)$'
            example: 'created_at:desc'
      responses:
        '200':
          description: List of users retrieved successfully
          headers:
            X-RateLimit-Limit:
              $ref: '#/components/headers/X-RateLimit-Limit'
            X-RateLimit-Remaining:
              $ref: '#/components/headers/X-RateLimit-Remaining'
            X-RateLimit-Reset:
              $ref: '#/components/headers/X-RateLimit-Reset'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
              examples:
                default:
                  $ref: '#/components/examples/UserListExample'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '429':
          $ref: '#/components/responses/TooManyRequests'
        '500':
          $ref: '#/components/responses/InternalServerError'

    post:
      summary: Create user
      description: Create a new user account with the provided information.
      operationId: createUser
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
            examples:
              basic:
                $ref: '#/components/examples/CreateUserExample'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: User already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error: "User with this email already exists"
                code: "DUPLICATE_EMAIL"

  /users/{id}:
    get:
      summary: Get user by ID
      description: Retrieve detailed information about a specific user.
      operationId: getUser
      tags:
        - Users
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '200':
          description: User retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token obtained from the authentication endpoint

    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for service-to-service authentication

  parameters:
    UserIdParam:
      name: id
      in: path
      required: true
      description: Unique identifier for the user
      schema:
        type: string
        format: uuid
        example: '123e4567-e89b-12d3-a456-426614174000'

    PageParam:
      name: page
      in: query
      description: Page number for pagination (1-based)
      schema:
        type: integer
        minimum: 1
        maximum: 1000
        default: 1

    LimitParam:
      name: limit
      in: query
      description: Number of items per page
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

  headers:
    X-RateLimit-Limit:
      description: The number of allowed requests in the current period
      schema:
        type: integer

    X-RateLimit-Remaining:
      description: The number of remaining requests in the current period
      schema:
        type: integer

    X-RateLimit-Reset:
      description: The time at which the current rate limit window resets (Unix timestamp)
      schema:
        type: integer

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier for the user
          example: '123e4567-e89b-12d3-a456-426614174000'
        email:
          type: string
          format: email
          description: User's email address
          example: 'user@example.com'
        name:
          type: string
          description: User's full name
          example: 'John Doe'
        role:
          type: string
          enum: [admin, user, moderator]
          description: User's role in the system
          example: 'user'
        status:
          type: string
          enum: [active, inactive, pending]
          description: Current status of the user account
          example: 'active'
        created_at:
          type: string
          format: date-time
          description: When the user account was created
          example: '2023-01-15T09:30:00Z'
        updated_at:
          type: string
          format: date-time
          description: When the user account was last updated
          example: '2023-01-20T14:45:00Z'
      required:
        - id
        - email
        - name
        - role
        - status
        - created_at
        - updated_at

    CreateUserRequest:
      type: object
      properties:
        email:
          type: string
          format: email
          description: User's email address (must be unique)
          example: 'newuser@example.com'
        password:
          type: string
          minLength: 8
          maxLength: 128
          description: User's password (8-128 characters)
          example: 'SecurePassword123!'
        name:
          type: string
          minLength: 1
          maxLength: 100
          description: User's full name
          example: 'Jane Smith'
        role:
          type: string
          enum: [user, moderator]
          description: Initial role for the user (admin role requires special permissions)
          default: 'user'
          example: 'user'
      required:
        - email
        - password
        - name

    UserResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          $ref: '#/components/schemas/User'
        meta:
          $ref: '#/components/schemas/ResponseMeta'

    UserListResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        meta:
          allOf:
            - $ref: '#/components/schemas/ResponseMeta'
            - type: object
              properties:
                pagination:
                  $ref: '#/components/schemas/PaginationMeta'

    ResponseMeta:
      type: object
      properties:
        timestamp:
          type: string
          format: date-time
          description: When the response was generated
          example: '2023-01-20T15:30:00Z'
        request_id:
          type: string
          description: Unique identifier for the request
          example: 'req_123456789'

    PaginationMeta:
      type: object
      properties:
        page:
          type: integer
          description: Current page number
          example: 1
        limit:
          type: integer
          description: Number of items per page
          example: 20
        total:
          type: integer
          description: Total number of items
          example: 150
        totalPages:
          type: integer
          description: Total number of pages
          example: 8
        hasNext:
          type: boolean
          description: Whether there are more pages
          example: true
        hasPrev:
          type: boolean
          description: Whether there are previous pages
          example: false

    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: string
          description: Human-readable error message
          example: 'Validation failed'
        code:
          type: string
          description: Machine-readable error code
          example: 'VALIDATION_ERROR'
        details:
          type: object
          description: Additional error details (for validation errors)
          additionalProperties: true
        timestamp:
          type: string
          format: date-time
          description: When the error occurred
          example: '2023-01-20T15:30:00Z'
      required:
        - success
        - error
        - code
        - timestamp

  responses:
    BadRequest:
      description: Bad request - invalid parameters or request format
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Invalid request parameters'
            code: 'BAD_REQUEST'

    Unauthorized:
      description: Authentication required or invalid credentials
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Authentication required'
            code: 'UNAUTHORIZED'

    Forbidden:
      description: Insufficient permissions to access this resource
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Insufficient permissions'
            code: 'FORBIDDEN'

    NotFound:
      description: The requested resource was not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Resource not found'
            code: 'NOT_FOUND'

    TooManyRequests:
      description: Rate limit exceeded
      headers:
        X-RateLimit-Limit:
          $ref: '#/components/headers/X-RateLimit-Limit'
        X-RateLimit-Remaining:
          $ref: '#/components/headers/X-RateLimit-Remaining'
        X-RateLimit-Reset:
          $ref: '#/components/headers/X-RateLimit-Reset'
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Rate limit exceeded'
            code: 'RATE_LIMIT_EXCEEDED'

    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error: 'Internal server error'
            code: 'INTERNAL_ERROR'

  examples:
    UserListExample:
      summary: Example user list response
      value:
        success: true
        data:
          - id: '123e4567-e89b-12d3-a456-426614174000'
            email: 'john.doe@example.com'
            name: 'John Doe'
            role: 'user'
            status: 'active'
            created_at: '2023-01-15T09:30:00Z'
            updated_at: '2023-01-20T14:45:00Z'
          - id: '456e7890-e89b-12d3-a456-426614174001'
            email: 'jane.smith@example.com'
            name: 'Jane Smith'
            role: 'moderator'
            status: 'active'
            created_at: '2023-01-16T10:15:00Z'
            updated_at: '2023-01-19T16:20:00Z'
        meta:
          timestamp: '2023-01-20T15:30:00Z'
          pagination:
            page: 1
            limit: 20
            total: 150
            totalPages: 8
            hasNext: true
            hasPrev: false

    CreateUserExample:
      summary: Example user creation request
      value:
        email: 'newuser@example.com'
        password: 'SecurePassword123!'
        name: 'New User'
        role: 'user'
```

### **OpenAPI Documentation Best Practices**

#### **Schema Design Standards**
- **Use descriptive names**: Clear, self-documenting schema names
- **Include examples**: Provide realistic examples for all fields
- **Document constraints**: Specify min/max lengths, patterns, enums
- **Version schemas**: Use allOf for schema evolution
- **Reuse components**: Reference common schemas, parameters, responses

#### **Documentation Writing Guidelines**
- **Clear descriptions**: Write for API consumers, not implementers
- **Include context**: Explain when and why to use each endpoint
- **Error documentation**: Document all possible error responses
- **Rate limiting**: Include rate limit information in descriptions
- **Authentication**: Clear authentication requirements

## GraphQL Documentation Standards

### **Schema Documentation with Descriptions**

```graphql
"""
User management schema with comprehensive type definitions
"""
scalar DateTime
scalar Upload

type Query {
  """
  Retrieve a single user by their unique identifier
  """
  user(
    """
    The unique identifier for the user
    """
    id: ID!
  ): User

  """
  Retrieve a paginated list of users with optional filtering and sorting
  """
  users(
    """
    Filter criteria to apply to the user list
    """
    filter: UserFilter
    """
    Sorting configuration for the results
    """
    sort: UserSort
    """
    Pagination parameters for the query
    """
    pagination: PaginationInput
  ): UserConnection!

  """
  Search for users by name or email using full-text search
  """
  searchUsers(
    """
    Search query string to match against user names and emails
    """
    query: String!
    """
    Maximum number of results to return (default: 10, max: 50)
    """
    limit: Int = 10
  ): [User!]!
}

type Mutation {
  """
  Create a new user account with the provided information
  """
  createUser(
    """
    User creation data including email, password, and profile information
    """
    input: CreateUserInput!
  ): UserPayload!

  """
  Update an existing user's information
  """
  updateUser(
    """
    The unique identifier for the user to update
    """
    id: ID!
    """
    Updated user data (only provided fields will be changed)
    """
    input: UpdateUserInput!
  ): UserPayload!

  """
  Permanently delete a user account and all associated data
  """
  deleteUser(
    """
    The unique identifier for the user to delete
    """
    id: ID!
  ): DeletePayload!

  """
  Upload a new avatar image for the specified user
  """
  uploadAvatar(
    """
    The unique identifier for the user
    """
    userId: ID!
    """
    The image file to upload (PNG, JPG, or GIF, max 5MB)
    """
    file: Upload!
  ): UploadPayload!
}

type Subscription {
  """
  Subscribe to updates for a specific user
  """
  userUpdated(
    """
    User ID to subscribe to (omit to subscribe to all users)
    """
    userId: ID
  ): User!

  """
  Subscribe to user status change events across the system
  """
  userStatusChanged: UserStatusEvent!
}

"""
Represents a user account in the system with profile information and relationships
"""
type User {
  """
  Unique identifier for the user (UUID format)
  """
  id: ID!

  """
  User's email address (must be unique across the system)
  """
  email: String!

  """
  User's full display name
  """
  name: String!

  """
  User's role determining their permissions in the system
  """
  role: UserRole!

  """
  Current status of the user account
  """
  status: UserStatus!

  """
  URL to the user's avatar image (if uploaded)
  """
  avatar: String

  """
  Extended profile information for the user
  """
  profile: UserProfile

  """
  When the user account was created
  """
  createdAt: DateTime!

  """
  When the user account was last updated
  """
  updatedAt: DateTime!

  """
  Orders placed by this user (paginated)
  """
  orders(
    """
    Number of orders to fetch
    """
    first: Int
    """
    Cursor for pagination
    """
    after: String
  ): OrderConnection!

  """
  User's notifications
  """
  notifications(
    """
    Only return unread notifications
    """
    unreadOnly: Boolean = false
  ): [Notification!]!
}

"""
Extended profile information for a user
"""
type UserProfile {
  """
  User's biography or description
  """
  bio: String

  """
  User's website URL
  """
  website: String

  """
  User's location (city, country)
  """
  location: String

  """
  User's system preferences
  """
  preferences: UserPreferences!
}

"""
User's configurable preferences for the application
"""
type UserPreferences {
  """
  Whether to receive email notifications
  """
  emailNotifications: Boolean!

  """
  Preferred UI theme
  """
  theme: Theme!

  """
  User's preferred language code (ISO 639-1)
  """
  language: String!
}

"""
Available user roles with different permission levels
"""
enum UserRole {
  """
  Administrator with full system access
  """
  ADMIN

  """
  Moderator with content management permissions
  """
  MODERATOR

  """
  Regular user with standard permissions
  """
  USER
}

"""
Possible states for a user account
"""
enum UserStatus {
  """
  Active user account in good standing
  """
  ACTIVE

  """
  Temporarily inactive account
  """
  INACTIVE

  """
  Account pending email verification or approval
  """
  PENDING

  """
  Account suspended due to policy violations
  """
  SUSPENDED
}

"""
Available UI themes
"""
enum Theme {
  """
  Light theme with bright colors
  """
  LIGHT

  """
  Dark theme with dark colors
  """
  DARK

  """
  Automatic theme based on system preferences
  """
  AUTO
}

"""
Filter options for user queries
"""
input UserFilter {
  """
  Filter by user role
  """
  role: UserRole

  """
  Filter by user status
  """
  status: UserStatus

  """
  Only include users created after this date
  """
  createdAfter: DateTime

  """
  Only include users created before this date
  """
  createdBefore: DateTime

  """
  Search term to match against name and email
  """
  search: String
}

"""
Sorting configuration for user queries
"""
input UserSort {
  """
  Field to sort by
  """
  field: UserSortField!

  """
  Sort direction (ascending or descending)
  """
  direction: SortDirection!
}

"""
Available fields for sorting users
"""
enum UserSortField {
  """
  Sort by account creation date
  """
  CREATED_AT

  """
  Sort by last update date
  """
  UPDATED_AT

  """
  Sort alphabetically by name
  """
  NAME

  """
  Sort alphabetically by email
  """
  EMAIL
}

"""
Sort direction options
"""
enum SortDirection {
  """
  Ascending order (A-Z, 0-9, oldest first)
  """
  ASC

  """
  Descending order (Z-A, 9-0, newest first)
  """
  DESC
}

"""
Pagination parameters using cursor-based pagination
"""
input PaginationInput {
  """
  Number of items to fetch going forward
  """
  first: Int

  """
  Cursor to start fetching from (for forward pagination)
  """
  after: String

  """
  Number of items to fetch going backward
  """
  last: Int

  """
  Cursor to start fetching from (for backward pagination)
  """
  before: String
}

"""
Input for creating a new user account
"""
input CreateUserInput {
  """
  User's email address (must be unique)
  """
  email: String!

  """
  User's password (minimum 8 characters)
  """
  password: String!

  """
  User's full name
  """
  name: String!

  """
  Initial role for the user (defaults to USER)
  """
  role: UserRole = USER

  """
  Optional profile information
  """
  profile: UserProfileInput
}

"""
Input for updating an existing user account
"""
input UpdateUserInput {
  """
  Updated email address
  """
  email: String

  """
  Updated full name
  """
  name: String

  """
  Updated role (admin permissions required)
  """
  role: UserRole

  """
  Updated account status (admin permissions required)
  """
  status: UserStatus

  """
  Updated profile information
  """
  profile: UserProfileInput
}

"""
Input for user profile information
"""
input UserProfileInput {
  """
  User's biography
  """
  bio: String

  """
  User's website URL
  """
  website: String

  """
  User's location
  """
  location: String

  """
  User's preferences
  """
  preferences: UserPreferencesInput
}

"""
Input for user preferences
"""
input UserPreferencesInput {
  """
  Email notification preference
  """
  emailNotifications: Boolean

  """
  UI theme preference
  """
  theme: Theme

  """
  Language preference
  """
  language: String
}
```

### **GraphQL Documentation Best Practices**

#### **Description Writing Guidelines**
- **Schema-level descriptions**: Explain the overall purpose and context
- **Type descriptions**: Describe what the type represents and its role
- **Field descriptions**: Explain the field's purpose, format, and constraints
- **Enum descriptions**: Document each enum value's meaning and use case
- **Input descriptions**: Clarify expected format and validation rules

#### **Documentation Structure**
- **Consistent formatting**: Use standard description formats across schema
- **Examples in descriptions**: Include format examples for complex fields
- **Deprecation notices**: Mark deprecated fields with clear migration paths
- **Validation rules**: Document constraints and validation requirements

## API Documentation Maintenance

### **Documentation Automation**

#### **Generated Documentation**
```javascript
// Example script for generating API documentation
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Auto-generated API documentation',
    },
  },
  apis: ['./routes/*.js', './models/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

// Serve documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Generate static documentation files
const fs = require('fs');
fs.writeFileSync('./docs/api-spec.json', JSON.stringify(specs, null, 2));
```

#### **Documentation Validation**
```yaml
# CI/CD pipeline for documentation validation
documentation_validation:
  stage: validate
  script:
    # Validate OpenAPI specification
    - swagger-codegen validate -i api-spec.yaml

    # Check for breaking changes
    - openapi-diff baseline-spec.yaml current-spec.yaml --fail-on-incompatible

    # Validate examples in documentation
    - newman run api-tests.postman_collection.json

    # Generate documentation
    - redoc-cli build api-spec.yaml --output docs/api.html

  artifacts:
    paths:
      - docs/
    expire_in: 1 week
```

### **Documentation Review Process**

#### **Review Checklist**
- **Accuracy**: All endpoints and parameters documented correctly
- **Completeness**: All public APIs have documentation
- **Examples**: Realistic examples provided for all operations
- **Error handling**: All error responses documented
- **Security**: Authentication and authorization requirements clear
- **Versioning**: Version-specific differences documented

#### **Documentation Quality Gates**
```javascript
// Example documentation quality checks
const documentationQualityCheck = (apiSpec) => {
  const issues = [];

  // Check for missing descriptions
  Object.keys(apiSpec.paths).forEach(path => {
    Object.keys(apiSpec.paths[path]).forEach(method => {
      const operation = apiSpec.paths[path][method];

      if (!operation.description) {
        issues.push(`Missing description for ${method.toUpperCase()} ${path}`);
      }

      if (!operation.responses) {
        issues.push(`Missing responses for ${method.toUpperCase()} ${path}`);
      }

      // Check for examples in request/response schemas
      if (operation.requestBody && !hasExamples(operation.requestBody)) {
        issues.push(`Missing examples for ${method.toUpperCase()} ${path} request`);
      }
    });
  });

  return {
    passed: issues.length === 0,
    issues
  };
};
```

## Documentation Tools and Workflow

### **Recommended Tools**

#### **OpenAPI Tools**
- **Swagger Editor**: Interactive OpenAPI specification editor
- **Redoc**: Clean, responsive API documentation generator
- **Stoplight Studio**: Visual API design and documentation platform
- **Postman**: API testing with automatic documentation generation

#### **GraphQL Tools**
- **GraphQL Playground**: Interactive GraphQL IDE with documentation
- **GraphiQL**: In-browser GraphQL IDE with schema exploration
- **Apollo Studio**: Comprehensive GraphQL development platform
- **GraphQL Inspector**: Schema validation and change detection

### **Integration Workflow**

#### **Documentation-Driven Development**
1. **Design First**: Create API specification before implementation
2. **Generate Code**: Use code generation tools from specifications
3. **Validate Implementation**: Ensure code matches specification
4. **Test Documentation**: Verify examples work correctly
5. **Deploy Together**: Deploy API and documentation simultaneously

#### **Continuous Documentation**
```yaml
# Example workflow for keeping documentation current
documentation_workflow:
  triggers:
    - api_code_changes
    - schema_updates
    - version_releases

  steps:
    1. extract_api_changes
    2. update_specifications
    3. validate_documentation
    4. generate_documentation_site
    5. deploy_documentation
    6. notify_stakeholders
```

---

## Related Guidelines

- **[API Design Principles](./api-design-principles.md)** - Core API design principles and standards
- **[API Implementation Patterns](./api-implementation-patterns.md)** - Implementation details and patterns
- **[Documentation Guidelines](./documentation-guidelines.md)** - General documentation standards
- **[Quality Standards](./quality-standards.md)** - Documentation quality requirements

## Navigation

- **[← Back to Guidelines](./README.md)** - All development guideline documentation
- **[Development Documentation](../README.md)** - All development documentation overview

---

**System Guidelines**: [CLAUDE.md](../../../CLAUDE.md) - AI assistant instructions and project context
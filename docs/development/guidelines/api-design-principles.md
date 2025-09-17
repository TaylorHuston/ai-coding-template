---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants", "api-designers", "architects"]
document_type: "guide"
priority: "high"
tags: ["api-design", "rest", "graphql", "principles", "architecture"]
---

# API Design Principles

**Purpose**: Core API design principles, patterns, and architectural foundations for building consistent, scalable, and maintainable APIs.

## API Design Philosophy

### **Design Principles**

#### **Developer Experience First**
- APIs should be intuitive and self-documenting
- Consistent patterns across all endpoints
- Clear error messages with actionable guidance
- Comprehensive documentation with examples

#### **RESTful Design**
- Use HTTP methods semantically (GET, POST, PUT, DELETE, PATCH)
- Resource-oriented URLs with logical hierarchies
- Stateless operations with appropriate status codes
- HATEOAS (Hypermedia as the Engine of Application State) where beneficial

#### **Backward Compatibility**
- Non-breaking changes in minor versions
- Graceful deprecation with advance notice
- Version migration guides and tooling
- Progressive API evolution strategies

### **AI-Assisted API Development**
- AI can generate OpenAPI specifications from requirements
- Automated validation of API design consistency
- AI-assisted documentation generation and maintenance
- Pattern recognition for common API anti-patterns

## REST API Design Fundamentals

### **Resource Naming Conventions**

#### **URL Structure**
```
# Good: Resource-oriented, hierarchical URLs
GET    /api/v1/users                    # Get all users
GET    /api/v1/users/{id}               # Get specific user
POST   /api/v1/users                    # Create new user
PUT    /api/v1/users/{id}               # Update entire user
PATCH  /api/v1/users/{id}               # Partial user update
DELETE /api/v1/users/{id}               # Delete user

# Nested resources
GET    /api/v1/users/{id}/orders        # Get user's orders
POST   /api/v1/users/{id}/orders        # Create order for user
GET    /api/v1/users/{id}/orders/{order_id}  # Get specific order

# Collection operations
GET    /api/v1/users?status=active      # Filter active users
GET    /api/v1/users?page=2&limit=20    # Pagination
GET    /api/v1/users?sort=created_at:desc  # Sorting

# Bad: Non-resource oriented URLs
POST   /api/v1/getUserById              # Use GET /api/v1/users/{id}
GET    /api/v1/user_list                # Use GET /api/v1/users
POST   /api/v1/createUser               # Use POST /api/v1/users
```

#### **Resource Naming Rules**
- Use **plural nouns** for collections (`/users`, `/orders`, `/products`)
- Use **lowercase** with **hyphens** for multi-word resources (`/order-items`, `/user-preferences`)
- Avoid **verbs** in URLs (use HTTP methods instead)
- Use **consistent** naming patterns across the API

### **HTTP Methods and Status Codes**

#### **Method Usage**
```javascript
// Good: Semantic HTTP method usage
class UserController {
  // GET: Retrieve data (safe, idempotent)
  async getUsers(req, res) {
    const users = await userService.findAll(req.query);
    res.status(200).json({
      data: users,
      meta: {
        total: users.length,
        page: parseInt(req.query.page || 1),
        limit: parseInt(req.query.limit || 20)
      }
    });
  }

  // POST: Create new resource (not idempotent)
  async createUser(req, res) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details
        });
      } else {
        res.status(500).json({
          error: 'Internal server error'
        });
      }
    }
  }

  // PUT: Update entire resource (idempotent)
  async updateUser(req, res) {
    const user = await userService.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.status(200).json({
      data: user,
      message: 'User updated successfully'
    });
  }

  // PATCH: Partial update (idempotent)
  async patchUser(req, res) {
    const user = await userService.partialUpdate(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.status(200).json({
      data: user,
      message: 'User updated successfully'
    });
  }

  // DELETE: Remove resource (idempotent)
  async deleteUser(req, res) {
    const deleted = await userService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.status(204).send(); // No content for successful deletion
  }
}
```

#### **Status Code Standards**

**Success Codes**:
- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests or updates with no response body

**Client Error Codes**:
- `400 Bad Request` - Invalid request format or parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - User lacks permission for this action
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity` - Validation errors

**Server Error Codes**:
- `500 Internal Server Error` - Unexpected server error
- `502 Bad Gateway` - Upstream service error
- `503 Service Unavailable` - Temporary service unavailability

## API Versioning

### **Versioning Strategies**

#### **URL Path Versioning (Recommended)**
```
# Good: Clear version in URL path
GET /api/v1/users
GET /api/v2/users

# Version-specific endpoints
GET /api/v1/users/{id}      # Legacy format
GET /api/v2/users/{id}      # Enhanced format with additional fields
```

**Benefits**:
- Easy to understand and debug
- Clear separation between versions
- Simple routing and caching
- Browser-friendly for direct testing

#### **Header-Based Versioning (Alternative)**
```http
# Request with version header
GET /api/users
Accept: application/vnd.api+json;version=2
API-Version: 2

# Response indicates version
HTTP/1.1 200 OK
API-Version: 2
Content-Type: application/vnd.api+json;version=2
```

**Benefits**:
- Cleaner URLs
- More flexible versioning options
- Supports content negotiation
- RESTful purist approach

#### **Version Lifecycle Management**
```yaml
# API version lifecycle
api_versions:
  v1:
    status: deprecated
    sunset_date: "2025-12-31"
    migration_guide: "/docs/migration/v1-to-v2"

  v2:
    status: current
    release_date: "2025-06-01"
    features: ["enhanced-filtering", "batch-operations"]

  v3:
    status: beta
    release_date: "2025-09-01"
    features: ["graphql-support", "real-time-updates"]
```

### **Deprecation Strategy**

#### **Graceful API Deprecation**
```javascript
// Deprecation middleware
const deprecationMiddleware = (version, sunsetDate, migrationPath) => {
  return (req, res, next) => {
    res.set({
      'Sunset': sunsetDate,
      'Deprecation': 'true',
      'Link': `<${migrationPath}>; rel="successor-version"`
    });

    // Log usage for analytics
    logger.warn('Deprecated API usage', {
      endpoint: req.originalUrl,
      version,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    next();
  };
};

// Apply to deprecated routes
app.use('/api/v1', deprecationMiddleware('v1', '2025-12-31', '/docs/migration/v1-to-v2'));
```

**Deprecation Timeline**:
1. **Announcement** (6 months before): Communicate deprecation plans
2. **Warning Headers** (3 months before): Add deprecation headers to responses
3. **Migration Period** (2 months): Provide migration tools and support
4. **Sunset** (Planned date): Remove deprecated version

## GraphQL API Design Principles

### **Schema Design Philosophy**

#### **Schema-First Development**
```graphql
# Define clear, self-documenting schemas
type User {
  id: ID!
  email: String!
  name: String!
  profile: UserProfile
  orders: [Order!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserProfile {
  bio: String
  avatar: String
  preferences: UserPreferences
}

type Query {
  # Single resource queries
  user(id: ID!): User

  # Collection queries with filtering
  users(
    filter: UserFilter
    pagination: PaginationInput
    sorting: [SortInput!]
  ): UserConnection!
}

type Mutation {
  # CRUD operations
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!
}
```

#### **Type Design Principles**
- **Nullable by Default**: Use `!` only for truly required fields
- **Descriptive Names**: Clear, self-documenting type and field names
- **Logical Grouping**: Related fields grouped in nested types
- **Consistent Patterns**: Similar operations follow same patterns

### **Query Design Patterns**

#### **Efficient Data Fetching**
```graphql
# Good: Single query for related data
query GetUserWithOrders($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    orders(first: 10) {
      edges {
        node {
          id
          total
          status
          items {
            id
            name
            quantity
          }
        }
      }
    }
  }
}

# Avoid: Multiple separate queries (N+1 problem)
query GetUser($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
  }
}

query GetUserOrders($userId: ID!) {
  user(id: $userId) {
    orders {
      id
      total
      status
    }
  }
}
```

## API Security Principles

### **Authentication Architecture**

#### **Token-Based Authentication**
```javascript
// JWT authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      code: 'MISSING_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Token verification failed',
      code: 'TOKEN_VERIFICATION_FAILED'
    });
  }
};
```

### **Authorization Patterns**

#### **Role-Based Access Control (RBAC)**
```javascript
// Permission middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHENTICATED'
      });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'FORBIDDEN',
        required_permission: permission
      });
    }

    next();
  };
};

// Usage in routes
app.get('/api/v1/admin/users',
  authenticateToken,
  requirePermission('users:read'),
  adminController.getUsers
);

app.delete('/api/v1/admin/users/:id',
  authenticateToken,
  requirePermission('users:delete'),
  adminController.deleteUser
);
```

## Performance Principles

### **Efficient Data Loading**

#### **Pagination Strategies**
```javascript
// Cursor-based pagination (recommended for real-time data)
const getCursorPaginatedUsers = async (req, res) => {
  const { after, first = 20 } = req.query;

  const users = await userService.findWithCursor({
    after,
    limit: first + 1 // Fetch one extra to determine hasNextPage
  });

  const hasNextPage = users.length > first;
  const edges = users.slice(0, first);

  res.json({
    data: edges,
    pageInfo: {
      hasNextPage,
      endCursor: edges.length > 0 ? edges[edges.length - 1].id : null
    }
  });
};

// Offset-based pagination (simpler, but less efficient for large datasets)
const getOffsetPaginatedUsers = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    userService.findWithOffset({ offset, limit }),
    userService.count()
  ]);

  res.json({
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: offset + limit < total,
      hasPreviousPage: page > 1
    }
  });
};
```

### **Caching Strategies**

#### **HTTP Caching Headers**
```javascript
// Cache control middleware
const setCacheHeaders = (maxAge = 300) => {
  return (req, res, next) => {
    // Set cache headers for GET requests
    if (req.method === 'GET') {
      res.set({
        'Cache-Control': `public, max-age=${maxAge}`,
        'ETag': generateETag(req.originalUrl),
        'Last-Modified': new Date().toUTCString()
      });
    }
    next();
  };
};

// Conditional requests support
const handleConditionalRequests = (req, res, next) => {
  const etag = generateETag(req.originalUrl);
  const ifNoneMatch = req.headers['if-none-match'];

  if (ifNoneMatch === etag) {
    return res.status(304).end(); // Not Modified
  }

  res.set('ETag', etag);
  next();
};
```

## Error Handling Principles

### **Consistent Error Responses**

#### **Standardized Error Format**
```javascript
// Error response structure
const createErrorResponse = (error, req) => {
  const baseError = {
    error: error.message,
    code: error.code || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Add details for validation errors
  if (error instanceof ValidationError) {
    baseError.details = error.details;
    baseError.fields = error.fields;
  }

  // Add trace ID for debugging (don't expose internal details)
  if (process.env.NODE_ENV === 'development') {
    baseError.trace_id = error.traceId;
    baseError.stack = error.stack;
  }

  return baseError;
};

// Global error handler
const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const errorResponse = createErrorResponse(error, req);

  // Log error for monitoring
  logger.error('API Error', {
    ...errorResponse,
    stack: error.stack,
    user: req.user?.id
  });

  res.status(statusCode).json(errorResponse);
};
```

## API Design Best Practices

### **Design Guidelines Summary**

1. **Start with the User Experience**: Design APIs from the consumer's perspective
2. **Be Consistent**: Follow established patterns throughout your API
3. **Use Standard HTTP**: Leverage HTTP methods and status codes correctly
4. **Plan for Evolution**: Design versioning strategy from the beginning
5. **Secure by Default**: Implement authentication and authorization properly
6. **Document Everything**: Maintain comprehensive, up-to-date documentation
7. **Test Thoroughly**: Include comprehensive testing at all levels
8. **Monitor Usage**: Track API usage and performance metrics

### **Common Anti-Patterns to Avoid**

❌ **Verb-based URLs**: `/api/getUser` → Use `/api/users/{id}`
❌ **Inconsistent naming**: Mix of camelCase and snake_case
❌ **Exposing internal IDs**: Database primary keys in URLs
❌ **Ignoring HTTP methods**: Using POST for everything
❌ **Poor error messages**: Generic "Something went wrong"
❌ **Missing documentation**: Undocumented endpoints and parameters
❌ **No versioning strategy**: Breaking changes without notice

---

## Related Guidelines

- **[API Implementation Patterns](./api-implementation-patterns.md)** - Error handling, pagination, filtering implementation details
- **[API Documentation Standards](./api-documentation-standards.md)** - OpenAPI specifications and documentation best practices
- **[Security Principles](./security-principles.md)** - Security implementation patterns for APIs
- **[Testing Guidelines](./testing-guidelines.md)** - API testing strategies and patterns

## Navigation

- **[← Back to Guidelines](./README.md)** - All development guideline documentation
- **[Development Documentation](../README.md)** - All development documentation overview

---

**System Guidelines**: [CLAUDE.md](../../../CLAUDE.md) - AI assistant instructions and project context
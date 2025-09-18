---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "accepted"
target_audience: ["developers", "ai-assistants", "security-auditor"]
document_type: "adr"
tags: ["security", "authentication", "authorization", "validation"]
---

# ADR-004: Security Architecture

## Status

**ACCEPTED** - 2025-09-17

## Context and Problem Statement

The multi-user todo application requires authentication and security patterns despite being a local development template. We need to balance security best practices with educational value and implementation simplicity.

### Requirements
- **Authentication System**: Username/password login with secure storage
- **Session Management**: Secure user session handling
- **Data Isolation**: Users can only access their own todos
- **Input Validation**: Comprehensive validation of all user inputs
- **Security Education**: Demonstrate professional security patterns
- **Template Validation**: Exercise security-auditor agent meaningfully

### Constraints
- Local development only (no production deployment planned)
- Must remain approachable for developers evaluating template
- Cannot over-engineer security for demo application scope
- Should demonstrate industry best practices appropriately

## Decision Drivers

1. **Security-Auditor Exercise**: Meaningful security work for agent validation
2. **Educational Value**: Demonstrate proper security patterns for template users
3. **Professional Standards**: Show real-world security practices, not toy implementations
4. **Implementation Simplicity**: Balance security with development complexity
5. **Future Production**: Patterns should be extensible for production use
6. **Risk Mitigation**: Prevent common vulnerabilities even in demo applications

## Security Architecture Decisions

### Authentication Strategy
**Custom username/password authentication with secure session management**

#### Why Not External Auth (OAuth/Auth0)
- **Template Focus**: Want to demonstrate authentication patterns, not external integration
- **Local Development**: External services add setup complexity
- **Educational Value**: Custom implementation shows security considerations
- **Agent Exercise**: More meaningful work for security-auditor agent

#### Why Not NextAuth.js
- **Learning Value**: Custom implementation demonstrates security principles
- **Template Control**: Full control over authentication flow and patterns
- **Security Exercise**: More comprehensive security-auditor validation
- **Simplicity**: Fewer dependencies and configuration complexity

### Core Security Decisions

#### 1. Password Security
**bcrypt with 12 salt rounds for password hashing**

```typescript
import bcrypt from 'bcryptjs'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

**Rationale**: Industry standard, appropriate for template demonstration, resistant to rainbow table attacks.

#### 2. Session Management
**Secure HTTP-only cookies with JWT tokens**

```typescript
// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
}
```

**Rationale**: Prevents XSS attacks, appropriate security for demo app, demonstrates proper cookie configuration.

#### 3. Input Validation
**Zod schemas for comprehensive type-safe validation**

```typescript
// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(100),
})

export const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .describe("Must contain at least one uppercase letter, one lowercase letter, and one number"),
})

// Todo schemas
export const createTodoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().datetime().optional(),
})
```

**Rationale**: Compile-time type safety, runtime validation, prevents injection attacks, demonstrates modern validation patterns.

#### 4. Authorization and Data Isolation
**Row-level security patterns with user context**

```typescript
// Secure data access patterns
export async function getUserTodos(userId: string): Promise<Todo[]> {
  return prisma.todo.findMany({
    where: { userId },
    include: { category: true },
  })
}

export async function updateTodo(todoId: string, userId: string, data: UpdateTodo): Promise<Todo> {
  // Verify ownership before update
  const existingTodo = await prisma.todo.findFirst({
    where: { id: todoId, userId },
  })

  if (!existingTodo) {
    throw new Error('Todo not found or access denied')
  }

  return prisma.todo.update({
    where: { id: todoId },
    data: validatedData,
  })
}
```

**Rationale**: Prevents horizontal privilege escalation, demonstrates proper authorization patterns, maintains data isolation.

#### 5. Attack Prevention
**Multiple security layers and common vulnerability prevention**

##### CSRF Protection
```typescript
// CSRF token generation and validation
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  )
}
```

##### Rate Limiting
```typescript
// Simple rate limiting for authentication endpoints
const loginAttempts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)

  if (!attempts || now > attempts.resetTime) {
    loginAttempts.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 })
    return true
  }

  if (attempts.count >= 5) {
    return false // Too many attempts
  }

  attempts.count++
  return true
}
```

##### SQL Injection Prevention
```typescript
// Always use Prisma's type-safe queries - no raw SQL
// Input validation with Zod prevents malicious payloads
```

## Security Implementation Phases

### Phase 1: Minimum Viable Security (MVP)
**Core security requirements for initial template validation**

#### Required Components
- ✅ **Password Hashing**: bcrypt with 12 rounds
- ✅ **Session Management**: HTTP-only cookies with JWT
- ✅ **Input Validation**: Zod schemas for all endpoints
- ✅ **Data Isolation**: User-scoped database queries
- ✅ **Basic Error Handling**: Secure error messages

#### Implementation Priority
1. Authentication endpoints with password hashing
2. Session management middleware
3. Input validation schemas
4. Authorization checks on all data operations
5. Secure error handling

### Phase 2: Enhanced Security
**Additional security layers for comprehensive template demonstration**

#### Components
- ✅ **CSRF Protection**: Token-based CSRF prevention
- ✅ **Rate Limiting**: Login attempt throttling
- ✅ **Account Security**: Password complexity requirements
- ✅ **Security Headers**: Basic security header configuration
- ✅ **Audit Logging**: Security event tracking

#### Implementation Items
```typescript
// Security headers middleware
export function securityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

// Audit logging
export function logSecurityEvent(event: SecurityEvent) {
  console.log(`[SECURITY] ${event.type}: ${event.description}`, {
    userId: event.userId,
    ip: event.ip,
    timestamp: new Date().toISOString(),
  })
}
```

### Phase 3: Complete Security (Future Enhancement)
**Production-ready security patterns for advanced template users**

#### Advanced Components
- **Password Policies**: Complexity requirements and history
- **Session Security**: Advanced session management patterns
- **Monitoring**: Comprehensive security monitoring
- **Compliance**: Basic security compliance patterns

## Database Security Patterns

### Secure Schema Design
```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String   // Always hashed with bcrypt
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Security audit fields
  lastLogin    DateTime?
  loginAttempts Int      @default(0)
  lockedUntil   DateTime?

  todos Todo[]

  @@map("users")
}

model SecurityLog {
  id        String   @id @default(cuid())
  userId    String?
  event     String   // LOGIN_SUCCESS, LOGIN_FAILURE, PASSWORD_CHANGE, etc.
  details   Json?
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())

  @@map("security_logs")
}
```

### Secure Query Patterns
```typescript
// Always scope queries by user
export const secureQueries = {
  // Good: User-scoped query
  async getUserTodos(userId: string) {
    return prisma.todo.findMany({ where: { userId } })
  },

  // Bad: Global query (would be flagged by security-auditor)
  async getAllTodos() {
    return prisma.todo.findMany() // Security risk!
  },

  // Good: Ownership verification
  async updateTodoSecure(todoId: string, userId: string, data: UpdateTodo) {
    return prisma.todo.updateMany({
      where: { id: todoId, userId }, // Ensures ownership
      data,
    })
  }
}
```

## Security Validation and Testing

### Security Test Coverage
```typescript
// Authentication security tests
describe('Authentication Security', () => {
  test('passwords are hashed before storage', async () => {
    const user = await createUser({ username: 'test', password: 'password123' })
    expect(user.password).not.toBe('password123')
    expect(await bcrypt.compare('password123', user.password)).toBe(true)
  })

  test('rate limiting prevents brute force attacks', async () => {
    // Test 5 failed login attempts trigger rate limiting
  })

  test('sessions expire after configured time', async () => {
    // Test session expiration behavior
  })
})

// Authorization security tests
describe('Authorization Security', () => {
  test('users cannot access other users todos', async () => {
    const response = await request(app)
      .get('/api/todos')
      .set('Cookie', `session=${user1Session}`)

    expect(response.body.todos).toHaveLength(user1TodoCount)
    expect(response.body.todos).not.toContainTodos(user2Todos)
  })
})
```

### Security Monitoring
```typescript
// Security event tracking
export const securityEvents = {
  LOGIN_SUCCESS: 'User successfully logged in',
  LOGIN_FAILURE: 'Failed login attempt',
  ACCOUNT_LOCKED: 'Account locked due to repeated failures',
  PASSWORD_CHANGED: 'User changed password',
  SUSPICIOUS_ACTIVITY: 'Potential security threat detected',
}

export function trackSecurityEvent(event: keyof typeof securityEvents, context: SecurityContext) {
  // Log to database and monitoring systems
  prisma.securityLog.create({
    data: {
      userId: context.userId,
      event,
      details: context.details,
      ip: context.ip,
      userAgent: context.userAgent,
    }
  })
}
```

## Consequences

### Positive
- **Professional Security**: Demonstrates industry-standard security practices
- **Educational Value**: Comprehensive security patterns for template users
- **Agent Exercise**: Meaningful validation work for security-auditor agent
- **Production Readiness**: Patterns extensible for production applications
- **Vulnerability Prevention**: Protection against common web application attacks
- **Audit Trail**: Comprehensive security event logging and monitoring

### Negative
- **Implementation Complexity**: More complex than toy authentication
- **Development Overhead**: Additional security considerations throughout development
- **Testing Requirements**: Comprehensive security test coverage needed
- **Maintenance**: Security patterns require ongoing attention and updates

### Neutral
- **Performance Impact**: Minimal overhead for password hashing and validation
- **User Experience**: Standard authentication flows with appropriate security
- **Dependencies**: Additional security libraries (bcrypt, jose, zod)

## Validation and Monitoring

### Security Success Criteria
- [ ] All passwords are properly hashed with bcrypt
- [ ] Session management prevents XSS and session hijacking
- [ ] Input validation prevents injection attacks
- [ ] Authorization prevents horizontal privilege escalation
- [ ] Rate limiting prevents brute force attacks
- [ ] Security events are properly logged and monitored

### Security Testing Requirements
- **Authentication Tests**: Password hashing, session management, login flows
- **Authorization Tests**: Data isolation, ownership verification, access controls
- **Input Validation Tests**: Malicious input handling, SQL injection prevention
- **Security Flow Tests**: Rate limiting, account lockout, session expiration

### Review Triggers
- If security implementations become too complex for template goals
- If security patterns are not properly demonstrated or tested
- If vulnerabilities are discovered in implemented patterns
- If security-auditor agent validation requirements change

## Related Decisions
- [ADR-001: NextJS with SQLite for Full-Stack Application](./ADR-001-nextjs-sqlite-fullstack.md)
- [ADR-002: Prisma ORM Selection](./ADR-002-prisma-orm-selection.md)
- [ADR-003: Frontend Architecture and State Management](./ADR-003-frontend-architecture.md)

## References
- [OWASP Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NextJS Security Documentation](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
- [Security-auditor Agent Consultation](#) - Comprehensive security recommendations
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Zod Validation Library](https://zod.dev/)
---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "accepted"
target_audience: ["developers", "ai-assistants", "database-specialist"]
document_type: "adr"
tags: ["database", "orm", "typescript", "prisma"]
---

# ADR-002: Prisma ORM for Database Access

## Status

**ACCEPTED** - 2025-09-17

## Context and Problem Statement

With the decision to use NextJS + SQLite for full-stack development (ADR-001), we need to select an appropriate ORM/database access layer. The choice must balance type safety, developer experience, learning alignment, and template validation goals.

### Requirements
- **Type Safety**: Strong TypeScript integration for better code quality
- **Developer Experience**: Intuitive API and excellent tooling
- **SQLite Support**: First-class support for file-based database
- **Learning Alignment**: Fits with NextJS ecosystem and developer's learning goals
- **Template Validation**: Provides meaningful work for database-specialist agent
- **Migration Management**: Robust schema evolution and versioning

### Constraints
- Must work seamlessly with NextJS and SQLite
- Should demonstrate modern ORM patterns effectively
- Cannot introduce excessive complexity or bundle size
- Must support database schema evolution for template iteration

## Decision Drivers

1. **NextJS Ecosystem Fit**: Integration with developer's learning path
2. **Type Safety**: Comprehensive TypeScript support and code generation
3. **Database-Specialist Exercise**: Meaningful schema design and migration work
4. **Documentation Quality**: Excellent docs and community for template reference
5. **Migration System**: Robust schema evolution for iterative development
6. **Developer Experience**: Tooling quality and development workflow

## Considered Options

### Option 1: Prisma ORM (SELECTED)
- **Type Safety**: ✅ Excellent - Generated TypeScript client with full type inference
- **Developer Experience**: ✅ Excellent - Prisma Studio, great CLI tools, comprehensive docs
- **Bundle Size**: ⚠️ Larger (~6.5MB) but acceptable for development focus
- **Learning Curve**: ✅ Gentle - Schema-first approach, excellent documentation
- **Migration System**: ✅ Excellent - Robust migration system with version control
- **Community**: ✅ Large, mature ecosystem with extensive NextJS examples

### Option 2: Drizzle ORM
- **Type Safety**: ⚠️ Good - Type-safe but only for query results, can write invalid queries
- **Developer Experience**: ✅ Good - SQL-first approach, lightweight tooling
- **Bundle Size**: ✅ Excellent - Only ~7.4kb, minimal footprint
- **Learning Curve**: ⚠️ Moderate - Requires SQL knowledge, newer ecosystem
- **Migration System**: ⚠️ Good - Drizzle Kit provides migrations but less mature
- **Community**: ⚠️ Growing but smaller ecosystem, fewer examples

### Option 3: Raw better-sqlite3
- **Type Safety**: ❌ None - Manual TypeScript definitions required
- **Developer Experience**: ❌ Manual - No ORM features, custom query builders needed
- **Bundle Size**: ✅ Minimal - Direct SQLite binding
- **Learning Curve**: ❌ Steep - Requires SQL expertise and manual boilerplate
- **Migration System**: ❌ Manual - Custom migration system required
- **Community**: ⚠️ Limited - Database-specific, not ORM community

### Option 4: Kysely (Type-safe SQL Builder)
- **Type Safety**: ✅ Excellent - Compile-time SQL validation
- **Developer Experience**: ⚠️ Moderate - Closer to SQL, less abstraction
- **Bundle Size**: ✅ Good - Lightweight compared to full ORMs
- **Learning Curve**: ⚠️ Moderate - Requires SQL knowledge and schema management
- **Migration System**: ⚠️ Basic - Limited migration tooling
- **Community**: ⚠️ Smaller - Growing but less comprehensive than Prisma

## Decision

**We will use Prisma ORM for database access and schema management.**

### Key Selection Factors
1. **Ecosystem Alignment**: Perfect fit with NextJS and TypeScript learning goals
2. **Type Safety Excellence**: Generated client provides comprehensive type coverage
3. **Developer Experience**: Industry-leading tooling and documentation quality
4. **Migration Robustness**: Production-ready migration system with version control
5. **Template Value**: Demonstrates modern ORM patterns effectively

## Rationale

### Why Prisma over Drizzle
Despite Drizzle's superior performance and smaller bundle size:
1. **Learning Alignment**: Developer is learning NextJS; Prisma fits that ecosystem perfectly
2. **Type Safety**: Prisma provides full type safety vs Drizzle's query-only coverage
3. **Documentation**: More comprehensive examples and NextJS integration guides
4. **Template Reference**: Better reference implementation for template users
5. **Migration System**: More mature and robust for iterative development

### Why Prisma over Raw SQL
1. **Development Speed**: Schema-first approach accelerates development
2. **Type Generation**: Automatic TypeScript types eliminate manual maintenance
3. **Migration Management**: Automated migration generation and application
4. **Query Building**: Type-safe query construction with excellent IntelliSense
5. **Tooling Ecosystem**: Prisma Studio for database exploration and debugging

### Why ORM over Query Builder
1. **Template Simplicity**: Higher-level abstraction appropriate for demo application
2. **Code Generation**: Reduces boilerplate and manual type definitions
3. **Schema Management**: Declarative schema definition with migration automation
4. **Agent Exercise**: Database-specialist can focus on design vs query syntax

## Database Schema Design

Based on database-specialist consultation, our schema will demonstrate:

### Core Entities
```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  todos     Todo[]

  @@map("users")
}

model Todo {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Foreign key relationship
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Optional category relationship
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])

  // Performance indexes
  @@index([userId])
  @@index([completed])
  @@index([priority])
  @@map("todos")
}

model Category {
  id          String @id @default(cuid())
  name        String @unique
  description String?
  color       String @default("#808080")

  // Relationships
  todos       Todo[]

  @@map("categories")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

### Design Decisions Captured
1. **ID Strategy**: CUID for better distribution than auto-increment
2. **Timestamps**: Full audit trail with createdAt/updatedAt
3. **Relationships**: Proper foreign keys with CASCADE deletion
4. **Indexing**: Strategic indexes for common query patterns
5. **Enum Types**: Type-safe priority levels
6. **Optional Fields**: Flexible schema with nullable descriptions and dates

## Consequences

### Positive
- **Excellent Developer Experience**: Schema-first approach with powerful tooling
- **Type Safety**: Comprehensive TypeScript integration eliminates runtime errors
- **Migration System**: Robust schema evolution with version control integration
- **Database-Specialist Exercise**: Meaningful schema design and relationship modeling
- **Documentation Quality**: Excellent reference implementation for template users
- **NextJS Integration**: First-class support with extensive examples and guides

### Negative
- **Bundle Size**: Larger client library (~6.5MB vs Drizzle's ~7.4kb)
- **Abstraction Layer**: Some distance from raw SQL queries
- **Learning Dependency**: Requires understanding of Prisma-specific patterns
- **Build Step**: Requires client generation step in development workflow

### Neutral
- **Performance**: Adequate for demo application; not optimized for high-scale usage
- **Vendor Lock-in**: Framework-specific patterns but migration paths exist
- **Database Features**: Good SQLite support but may not use all advanced features

## Implementation Plan

### Development Workflow
```bash
# Initial setup
npm install prisma @prisma/client
npx prisma init

# Schema development
npx prisma generate        # Generate TypeScript client
npx prisma migrate dev     # Create and apply migrations
npx prisma studio          # Visual database explorer

# Reset for demos
npx prisma migrate reset   # Clean slate for template demos
```

### Database Configuration
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Environment Setup
```env
# .env.local
DATABASE_URL="file:./data/dev.db"
```

### Seed Data Strategy
```typescript
// prisma/seed.ts
// Create sample users and todos for consistent template demos
// Reset capability for clean demonstrations
```

## Validation and Monitoring

### Success Criteria
- [ ] Schema changes generate proper TypeScript types automatically
- [ ] Database operations provide full compile-time type safety
- [ ] Migration system handles schema evolution smoothly
- [ ] Prisma Studio provides effective database exploration
- [ ] Generated client integrates seamlessly with NextJS API routes

### Performance Considerations
- SQLite file size should remain under 10MB for demo data
- Query performance adequate for 1000+ todos across multiple users
- Client generation time should be under 5 seconds
- Bundle size impact acceptable for development-focused application

### Review Triggers
- If bundle size becomes problematic for template evaluation
- If migration system proves too complex for template iteration
- If type generation becomes slow or unreliable
- If SQLite limitations become apparent in development

## Related Decisions
- [ADR-001: NextJS with SQLite for Full-Stack Application](./ADR-001-nextjs-sqlite-fullstack.md)
- [ADR-003: Frontend Architecture and State Management](./ADR-003-frontend-architecture.md)
- [ADR-004: Security Architecture](./ADR-004-security-architecture.md)

## References
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma NextJS Guide](https://www.prisma.io/docs/guides/nextjs)
- [Database-specialist Agent Consultation](#) - Internal architecture feedback
- [Prisma vs Drizzle Comparison Research](#) - Comprehensive market analysis 2024-2025
---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "accepted"
target_audience: ["developers", "ai-assistants"]
document_type: "adr"
tags: ["architecture", "database", "fullstack"]
---

# ADR-001: NextJS with SQLite for Full-Stack Application

## Status

**ACCEPTED** - 2025-09-17

## Context and Problem Statement

The AI Coding Template requires a realistic example application to validate workflows, scripts, and agent coordination patterns. The original vision specified "local storage" for simplicity, but we need to balance simplicity with demonstrating meaningful development patterns.

### Requirements
- **Template Validation**: Exercise multiple AI agents (database-specialist, backend-specialist, api-designer)
- **Local Development**: No hosted services or complex deployment requirements
- **Educational Value**: Demonstrate modern full-stack patterns for template users
- **Multi-user Support**: Basic user management to showcase database relationships

### Constraints
- Must run locally with simple setup (`npm run dev`)
- Should exercise database design and API patterns meaningfully
- Cannot require external services or complex infrastructure
- Must be beginner-friendly for developers evaluating the template

## Decision Drivers

1. **Agent Exercise Requirements**: Need realistic database work for database-specialist agent
2. **Learning Alignment**: Developer is learning NextJS, making it valuable for template validation
3. **Deployment Simplicity**: File-based database eliminates server setup complexity
4. **Pattern Demonstration**: Full-stack patterns more valuable than frontend-only
5. **Template Validation**: Need to test backend-specialist and api-designer agents

## Considered Options

### Option 1: Pure Frontend + Browser localStorage
- **Pros**: Extremely simple, original vision alignment, fast development
- **Cons**: Limited agent exercise, no database patterns, unrealistic for modern apps
- **Verdict**: Too simple to validate template capabilities effectively

### Option 2: NextJS + External Database (PostgreSQL/MySQL)
- **Pros**: Production-realistic, full database capabilities, comprehensive patterns
- **Cons**: Complex setup, requires database server, violates local-only constraint
- **Verdict**: Too complex for template evaluation environment

### Option 3: NextJS + SQLite (SELECTED)
- **Pros**: Full-stack patterns, zero-config database, exercises all target agents
- **Cons**: More complex than original vision, adds backend development
- **Verdict**: Optimal balance of capability and simplicity

### Option 4: Separate Frontend + Backend Services
- **Pros**: Microservices patterns, realistic architecture, service boundaries
- **Cons**: Multiple services to run, complex development setup, operational overhead
- **Verdict**: Excessive complexity for template validation goals

## Decision

**We will build a NextJS full-stack application with SQLite database.**

### Core Architecture
- **Frontend**: NextJS App Router with React and TypeScript
- **Backend**: NextJS API routes for server-side logic
- **Database**: SQLite file-based database (local file storage)
- **Development**: Single `npm run dev` command for complete stack

### Key Characteristics
- **Single Application**: Frontend and backend unified in NextJS
- **File-based Database**: SQLite database stored as `./data/dev.db`
- **Zero External Dependencies**: No hosted services or separate database servers
- **Local Development Focus**: Optimized for local development and template evaluation

## Rationale

### Why NextJS over Pure Frontend
1. **Agent Exercise**: Enables backend-specialist and api-designer agent validation
2. **Modern Patterns**: Demonstrates contemporary full-stack development practices
3. **Unified Experience**: Single framework for frontend and backend reduces complexity
4. **Learning Value**: Developer is learning NextJS, making this educationally valuable

### Why SQLite over Other Databases
1. **Zero Configuration**: No database server setup or configuration required
2. **File-based Storage**: Database is just a file, easy to reset and distribute
3. **Full SQL Support**: Demonstrates real database patterns and relationships
4. **Cross-platform**: Works identically across all development environments
5. **Performance**: More than adequate for demo application requirements

### Why Full-stack over Frontend-only
1. **Template Validation**: Exercises more AI agents meaningfully
2. **Realistic Patterns**: Modern applications typically have backend components
3. **Database Design**: Enables proper data modeling and relationship patterns
4. **API Patterns**: Demonstrates REST API design and implementation

## Consequences

### Positive
- **Enhanced Agent Exercise**: Database-specialist, backend-specialist, and api-designer get meaningful work
- **Realistic Patterns**: Demonstrates modern full-stack development practices
- **Better Learning**: More comprehensive example for developers evaluating template
- **Flexibility**: Can demonstrate authentication, data persistence, and API design patterns
- **Performance**: SQLite provides excellent performance for development use cases

### Negative
- **Increased Complexity**: More moving parts than pure frontend application
- **Learning Curve**: Developers need to understand both frontend and backend patterns
- **Database Knowledge**: Requires basic understanding of SQL and database concepts
- **Deviation from Vision**: More complex than originally specified "local storage" approach

### Neutral
- **Development Setup**: Still single command (`npm run dev`) but more features running
- **File Management**: Database file needs to be managed but is just a single file

## Validation and Monitoring

### Success Criteria
- [ ] Single `npm run dev` command starts complete application
- [ ] Database operations work without external setup
- [ ] Multiple AI agents can work meaningfully with the codebase
- [ ] Template users can easily understand and extend the application
- [ ] Development experience remains smooth and beginner-friendly

### Monitoring Points
- Development setup complexity (should remain single command)
- Database file size and performance (should be negligible for demo data)
- Agent exercise quality (agents should have meaningful architectural work)
- Developer feedback on template evaluation experience

### Review Triggers
- If development setup becomes too complex (more than 2 commands)
- If database performance issues arise during development
- If the stack proves too complex for template evaluation goals
- If external hosting becomes a requirement

## Implementation Guidance

### Project Structure
```
my-todo-app/
├── app/                 # NextJS App Router
│   ├── api/            # API routes for backend logic
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Main application pages
├── components/         # Reusable React components
├── lib/               # Shared utilities and database client
├── prisma/            # Database schema and migrations
│   ├── schema.prisma  # Database schema definition
│   └── migrations/    # Database migration files
└── data/              # SQLite database files
    └── dev.db         # Development database
```

### Development Commands
```bash
# Start complete application (frontend + backend + database)
npm run dev

# Database operations
npx prisma generate    # Generate TypeScript client
npx prisma migrate dev # Run database migrations
npx prisma studio      # Open database GUI

# Reset database for clean demo
npx prisma migrate reset
```

### Environment Setup
```env
# .env.local
DATABASE_URL="file:./data/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key"
```

## Related Decisions
- [ADR-002: Prisma ORM Selection](./ADR-002-prisma-orm-selection.md)
- [ADR-003: Frontend Architecture and State Management](./ADR-003-frontend-architecture.md)
- [ADR-004: Security Architecture](./ADR-004-security-architecture.md)

## References
- [NextJS Documentation](https://nextjs.org/docs)
- [SQLite Documentation](https://sqlite.org/docs.html)
- [Database-specialist Agent Feedback](#) - Internal agent consultation results
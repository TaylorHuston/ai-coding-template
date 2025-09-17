---
version: "1.0.0"
created: "2025-09-17"
status: "active"
target_audience: ["developers", "product-managers", "ai-assistants"]
document_type: "guide"
tags: ["features", "requirements", "documentation"]
---

# Feature Documentation Guide

**Purpose**: Document what capabilities and features exist in the system, providing lightweight business context that complements external project management tools.

## What Goes Here

### Feature Context Documents
- **Purpose**: Business and functional requirements for features
- **Audience**: Developers, product managers, stakeholders
- **Content**: Why features exist, what they do, success criteria
- **Format**: Lightweight, 1-2 page documents

### When to Create Feature Docs

**Always Create For:**
- New major features or capabilities
- Complex features requiring business context
- Features that cross multiple system boundaries
- Features with external dependencies

**Optional For:**
- Simple bug fixes or maintenance tasks
- Internal refactoring without user impact
- Minor UI tweaks or improvements

## How This Fits the Hierarchy

```
vision.md                    → Why the product exists
features/auth-system.md      → Why we need authentication
architecture/auth-design.md  → How we'll implement auth
decisions/ADR-001-jwt.md     → Why we chose JWT
implementations/2024-01-15-auth.md → What steps we took
```

## Integration with External Tools

### Small Teams/Solo Developers
- Create feature docs locally for clarity
- Reference external issues if they exist
- Use as planning and communication tool

### Teams with PM Tools (Jira/Linear)
- Feature docs **complement** external epics/stories
- Include `external_ref` field linking to PM tool
- Focus on technical and implementation context
- Sync key updates to external tools

### Enterprise Teams
- Feature docs become lightweight summaries
- Primary source of truth remains in enterprise tools
- Focus on local development context and technical details

## Template Usage

1. **Copy the template**: `cp template.md your-feature.md`
2. **Fill in the sections**: Focus on clarity and brevity
3. **Link to external tools**: Include Jira/Linear references when available
4. **Keep it current**: Update as feature evolves

## Best Practices

### Writing Good Feature Docs

1. **Start with the problem**: Why does this feature need to exist?
2. **Define success clearly**: How will we know it works?
3. **Keep it concise**: 1-2 pages maximum
4. **Link to technical docs**: Reference architecture and decision docs
5. **Update regularly**: Keep current with implementation

### Naming Conventions

- Use lowercase kebab-case: `user-authentication.md`
- Be descriptive but concise: `payment-processing.md` not `pay.md`
- Group related features: `notifications-email.md`, `notifications-push.md`

### Maintenance

1. **Review quarterly**: Ensure docs reflect current state
2. **Update on major changes**: Keep success criteria current
3. **Archive completed features**: Move deprecated features to archived/
4. **Link to implementations**: Reference completed work in implementations/

## Example Feature Document Structure

```markdown
# Feature: User Authentication

**Purpose:** Enable secure user access to the application
**User Benefit:** Users can securely log in and access personalized features
**Success Criteria:**
- Users can register with email/password
- Users can log in securely
- Sessions persist for 30 days
- Password reset functionality works

**External Reference:** JIRA-AUTH-001

## Functional Requirements
- Email/password registration and login
- JWT-based session management
- Password reset via email
- Rate limiting on authentication attempts

## Technical Approach
- JWT tokens for stateless authentication
- bcrypt for password hashing
- Redis for session storage
- Email service integration for password reset

## Dependencies
- Email service must be configured
- Redis instance required
- Frontend login/register UI components
```

## Related Documentation

- [Architecture Documentation](../architecture/README.md) - Technical system design
- [Decision Records](../decisions/README.md) - Architecture decisions and rationale
- [Implementation Records](../implementations/README.md) - Historical development records
- [Documentation Guidelines](../../development/guidelines/documentation-guidelines.md) - Writing standards

---

*Feature docs provide the "what and why" context that helps developers understand the business purpose behind the code they're writing.*
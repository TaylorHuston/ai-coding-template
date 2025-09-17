---
version: "0.1.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "guide"
tags: ["ai-collaboration", "prompting", "context-engineering", "branching", "architecture"]
---

# AI Collaboration Guide

Essential patterns and practices for effective AI-assisted development. This guide consolidates the most important concepts from detailed AI collaboration documentation.

## Quick Reference

### Core Principles
1. **Be explicit** - Clear communication over clever shortcuts
2. **Preserve context** - Maintain project memory across sessions
3. **Follow protocols** - Use established branching and communication patterns
4. **Iterate safely** - Use appropriate permissions and review processes

### Essential Commands
- **Context**: "Read STATUS.md and CLAUDE.md for current project context"
- **Planning**: "Use project-manager agent to break down this complex task"
- **Review**: "Use code-reviewer agent to assess this implementation"
- **Safety**: "Show me the changes before committing to this branch"

## Effective AI Communication

### Prompt Principles

#### 1. Provide Clear Context
**❌ Vague:**
```
Fix the login bug
```

**✅ Specific:**
```
The login form in src/components/LoginForm.jsx is not validating email format.
Users can submit invalid emails like "test@" and get cryptic backend errors.
Please add client-side email validation that shows clear error messages.
```

#### 2. Specify Your Intent
**❌ Ambiguous:**
```
Make this better
```

**✅ Clear Intent:**
```
Refactor this component to improve:
1. Performance (avoid unnecessary re-renders)
2. Accessibility (add ARIA labels)
3. Type safety (add proper TypeScript interfaces)
```

#### 3. Request Appropriate Agents
**❌ Generic:**
```
Help me with this code
```

**✅ Agent-Specific:**
```
Use the security-auditor agent to review this authentication code for vulnerabilities
```

### Communication Patterns

#### Task Handoff
```
"I've completed [specific task]. Ready for the next step:
- [What was accomplished]
- [Current state]
- [What needs to happen next]"
```

#### Clarification Requests
```
"Before proceeding, I need clarification on:
1. [Specific question]
2. [Another specific question]
This will help me [specific outcome]."
```

#### Progress Updates
```
"Progress update on [task]:
✅ Completed: [specific items]
🚧 In Progress: [current work]
⏳ Blocked: [specific blockers]
Next: [immediate next step]"
```

## Context Management

### Session Continuity

#### Starting Sessions
1. **Read STATUS.md** for current project state
2. **Review recent commits** to understand changes
3. **Check active branches** for ongoing work
4. **Read CLAUDE.md** for project-specific guidelines

#### Maintaining Context
- Update STATUS.md with progress and decisions
- Reference specific files and line numbers
- Document architectural decisions inline
- Maintain todo lists for complex tasks

#### Session Handoffs
```markdown
## Session Summary (YYYY-MM-DD)
- **Focus**: [What was worked on]
- **Completed**: [Specific accomplishments]
- **Next**: [Immediate next steps]
- **Blockers**: [Any issues or decisions needed]
- **Files Modified**: [List with brief descriptions]
```

### Memory Management

#### Preserve Important Decisions
```markdown
## Decision: [Brief Title]
**Date**: YYYY-MM-DD
**Context**: [Why this decision was needed]
**Decision**: [What was decided]
**Rationale**: [Key reasoning]
**Impact**: [Files/systems affected]
```

#### Document Patterns
```markdown
## Pattern: [Pattern Name]
**Used in**: [List of files/components]
**Purpose**: [Why this pattern exists]
**Example**: [Code snippet or reference]
```

## AI Branching Strategy

### AI Autonomy Matrix

| Action | `main` | `develop` | `feature/bugfix` | `experiment` |
|--------|--------|-----------|------------------|--------------|
| **Read/Analyze** | ✅ Always | ✅ Always | ✅ Always | ✅ Always |
| **Create Branch** | ❌ Never | ❌ Never | ⚠️ With Approval | ✅ Autonomous |
| **Commit Changes** | ❌ Never | ❌ Never | ⚠️ Show First | ✅ Autonomous |
| **Push Changes** | ❌ Never | ❌ Never | ⚠️ With Approval | ✅ Autonomous |
| **Merge/PR** | ❌ Never | ❌ Never | ⚠️ With Approval | ✅ Autonomous |

### Branch Types

#### Feature/Bugfix Branches
- **Naming**: `feature/PROJ-123-short-description`
- **AI Permission**: Show changes before committing
- **Review Required**: Human approval for commits and merges

#### Experiment Branches
- **Naming**: `experiment/description`
- **AI Permission**: Full autonomy
- **Purpose**: Testing, prototypes, proof-of-concepts

### Communication Protocols

#### Before Branch Creation
```
AI: "Should I create a new feature/PROJ-123-user-auth branch for this work?"
```

#### Before Committing
```
AI: "Ready to commit these changes to feature/user-auth:
- Added UserAuth component
- Added login validation
- Added unit tests
Should I proceed with this commit?"
```

#### Before Merging
```
AI: "Feature appears complete. Should I create a pull request to merge
feature/PROJ-123-user-auth into develop?"
```

### Workflow Example

```bash
# 1. Human initiates
Human: "Implement user authentication for PROJ-123"

# 2. AI creates branch with approval
AI: "Should I create feature/PROJ-123-user-auth for this work?"
Human: "Yes, create it"

# 3. AI develops with check-ins
AI: "Added login form. Ready to commit:
- LoginForm component with validation
- Unit tests with 95% coverage
- TypeScript interfaces
Should I commit these changes?"

# 4. Human reviews and approves
Human: "Looks good, commit it"

# 5. AI commits with proper message
git commit -m "feat: implement user authentication

- Add LoginForm React component with validation
- Add TypeScript interfaces for auth types
- Add comprehensive unit tests
- Ensure accessibility compliance

Resolves: PROJ-123"
```

## Architecture Patterns for AI Development

### Core Principles

#### 1. Clarity Over Cleverness
AI assistants work best with explicit, readable code.

**❌ Avoid:**
```python
def process(d): return {k: v for k, v in d.items() if callable(getattr(v, 'exec', None))}
```

**✅ Prefer:**
```python
def filter_executable_items(data_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Filter dictionary items that have an 'exec' method."""
    executable_items = {}
    for key, value in data_dict.items():
        if hasattr(value, 'exec') and callable(value.exec):
            executable_items[key] = value
    return executable_items
```

#### 2. Explicit Dependencies
Make dependencies clear and traceable.

**✅ Good Pattern:**
```python
# dependencies.py
class DatabaseConnection:
    def __init__(self, config: DatabaseConfig):
        self.config = config

# user_service.py
from .dependencies import DatabaseConnection

class UserService:
    def __init__(self, db: DatabaseConnection):
        self.db = db
```

#### 3. Consistent Naming Patterns
Use predictable, descriptive names.

**✅ Consistent Patterns:**
```javascript
// Services
UserService, AuthService, NotificationService

// Controllers
UserController, AuthController, NotificationController

// Models
User, AuthToken, Notification

// Utilities
validateEmail, formatDate, sanitizeInput
```

### File Organization

#### 1. Feature-Based Structure
Organize by feature rather than file type.

**✅ Feature-Based:**
```
src/
├── auth/
│   ├── AuthService.js
│   ├── AuthController.js
│   ├── auth.types.js
│   └── auth.test.js
├── users/
│   ├── UserService.js
│   ├── UserController.js
│   ├── user.types.js
│   └── user.test.js
```

#### 2. Predictable Index Files
Use index files for clean imports.

**✅ Clean Exports:**
```javascript
// auth/index.js
export { AuthService } from './AuthService';
export { AuthController } from './AuthController';
export * from './auth.types';

// Usage elsewhere
import { AuthService, AuthToken } from '../auth';
```

### Code Patterns

#### 1. Standardized Error Handling
Consistent error patterns help AI understand context.

**✅ Standard Pattern:**
```javascript
class ValidationError extends Error {
    constructor(field, message) {
        super(`Validation failed for ${field}: ${message}`);
        this.name = 'ValidationError';
        this.field = field;
    }
}

// Usage
if (!email.includes('@')) {
    throw new ValidationError('email', 'Must contain @ symbol');
}
```

#### 2. Configuration Objects
Use configuration objects for complex functions.

**✅ Configuration Pattern:**
```javascript
function createUser(config) {
    const {
        email,
        password,
        profile = {},
        sendWelcomeEmail = true,
        validateStrength = true
    } = config;

    // Implementation with clear defaults
}

// Usage
createUser({
    email: 'user@example.com',
    password: 'secretpassword',
    sendWelcomeEmail: false
});
```

#### 3. Typed Interfaces
Use clear type definitions.

**✅ Clear Types:**
```typescript
interface UserCreateRequest {
    email: string;
    password: string;
    profile?: UserProfile;
    preferences?: UserPreferences;
}

interface UserCreateResponse {
    user: User;
    token: AuthToken;
    success: boolean;
}
```

## Troubleshooting AI Collaboration

### Common Issues

#### AI Loses Context
**Symptoms**: Repetitive questions, forgetting recent decisions
**Solutions**:
- Update STATUS.md with current context
- Reference specific files and decisions
- Use agent-specific instructions
- Break down complex tasks

#### Inconsistent Code Patterns
**Symptoms**: Mixed styles, conflicting approaches
**Solutions**:
- Create clear examples in examples/ directory
- Document patterns in CLAUDE.md
- Use consistent naming conventions
- Reference existing implementations

#### Wrong Agent Selection
**Symptoms**: Frontend agent doing backend work
**Solutions**:
- Be explicit about agent choice
- Use project-manager for complex tasks
- Reference .claude/agents/README.md
- Provide clear domain context

### Best Practices

#### For Developers
1. **Set clear expectations** about AI autonomy levels
2. **Review AI-generated commits** before they're pushed
3. **Maintain up-to-date context files** (STATUS.md, CLAUDE.md)
4. **Use descriptive commit messages** following conventional commits

#### For AI Assistants
1. **Ask before major changes** unless in experiment mode
2. **Show changes before committing** on protected workflows
3. **Reference existing patterns** when generating new code
4. **Update context files** with progress and decisions

## Related Documentation

### Core Project Files
- [Comprehensive AI Agents Guide](./comprehensive-agent-guide.md) - Complete agent system reference
- [Quality Standards](../../development/guidelines/quality-standards.md) - Development requirements
- [System Guidelines](../../../CLAUDE.md) - AI assistant instructions

---

*This guide provides essential AI collaboration patterns. For detailed coverage of any topic, refer to the archived detailed guides.*
---
version: "0.1.0"
created: "2025-09-15"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "guide"
priority: "high"
tags: ["agents", "workflows", "ai-collaboration"]
---

# How to Use AI Agents

**Your team of 17 specialized AI experts, automatically activated based on your task.**

This guide teaches you how to work effectively with the AI agent system to get better results faster.

## The Agent System

### What Are AI Agents?

AI agents are specialized AI assistants that automatically activate based on the type of work you're doing:

- **Frontend work?** → `frontend-specialist` activates
- **Database issues?** → `database-specialist` takes over
- **Security concerns?** → `security-auditor` gets involved
- **Complex coordination?** → `project-manager` orchestrates multiple agents

### Auto-Activation vs Manual

**Auto-Activated Agents (8 agents)**
These activate automatically when you mention relevant work:

| When you say... | Agent that activates | What they do |
|----------------|---------------------|--------------|
| "Create a login form" | `frontend-specialist` | UI/UX development |
| "Build an API endpoint" | `backend-specialist` | Server-side logic |
| "Design user schema" | `database-specialist` | Data modeling |
| "Write unit tests" | `test-engineer` | Test creation |
| "Review this code" | `code-reviewer` | Quality analysis |
| "Audit for vulnerabilities" | `security-auditor` | Security review |
| "Deploy to production" | `devops-engineer` | Infrastructure |
| "Update the docs" | `docs-sync-agent` | Documentation sync |

**On-Demand Agents (9 agents)**
Request these explicitly for specialized work:

| Say this... | Agent | Best for |
|-------------|-------|----------|
| "Use the code-architect" | `code-architect` | System design decisions |
| "Get the api-designer" | `api-designer` | API architecture |
| "Need the performance-optimizer" | `performance-optimizer` | Speed/efficiency issues |
| "Use the refactoring-specialist" | `refactoring-specialist` | Code cleanup |
| "Get the migration-specialist" | `migration-specialist` | Framework upgrades |
| "Need the data-analyst" | `data-analyst` | Data insights |

## Effective Usage Patterns

### 1. Let Agents Activate Naturally

**Good:**
```
"I need to create a user authentication system with login/logout functionality"
```
→ Automatically activates: `frontend-specialist`, `backend-specialist`, `database-specialist`

**Less effective:**
```
"Write code for authentication"
```
→ Generic response, no specialized agents

### 2. Request Specific Agents for Complex Work

**For architectural decisions:**
```
"Use the code-architect to help design a microservices architecture for this e-commerce platform"
```

**For performance issues:**
```
"Get the performance-optimizer to analyze why our API responses are slow"
```

### 3. Use Project Manager for Multi-Domain Tasks

**For complex features:**
```
"Use the project-manager to coordinate building a real-time chat feature with frontend, backend, database, and deployment considerations"
```

## Multi-Agent Workflow Coordination

When working with complex features, agents coordinate through structured workflows:

### Phase-Based Execution

Issues use a P X.X.X task structure where each phase represents a logical commit:

```markdown
## Phase 1: Core Implementation
- [ ] P1.1.0 Analyze requirements <!--agent:context-analyzer-->
- [ ] P1.2.0 Write tests <!--agent:test-engineer-->
- [ ] P1.3.0 Implement feature <!--agent:auto-select-->
- [ ] P1.4.0 Code review <!--agent:code-reviewer-->
- [ ] P1.5.0 Update docs <!--agent:docs-sync-agent-->
- [ ] P1.6.0 Commit: "feat: core implementation"
```

### Agent Coordination System

Agents coordinate through multiple files:

**HANDOFF.yml** - Structured coordination:
- What each agent accomplished
- Context for the next agent
- Files changed and decisions made
- Current workflow state

**RESEARCH.md** - Unstructured findings:
- Investigation discoveries and context analysis
- Code snippets, dependencies, technical details
- Design considerations and rejected approaches
- Questions, assumptions, and external resources

This dual system prevents context loss and preserves valuable research that might otherwise be forgotten.

## Common Workflows

### Feature Development Workflow
```
1. "Use project-manager to plan [feature]"
2. Work begins with relevant specialists (auto-activated)
3. "Use code-reviewer to check the implementation"
4. "Use security-auditor to validate security"
5. "Use devops-engineer to deploy"
```

### Bug Investigation Workflow
```
1. "Investigate this [bug description]"
   → context-analyzer activates automatically
2. Relevant specialists join based on the issue area
3. "Use performance-optimizer" (if performance-related)
4. "Use security-auditor" (if security-related)
```

### Code Quality Workflow
```
1. "Review this code for quality"
   → code-reviewer activates
2. "Use refactoring-specialist to improve this messy code"
3. "Use performance-optimizer to speed this up"
```

## Agent Coordination

### Sequential Workflows
When you need step-by-step work:
```
"First use the database-specialist to design the schema, then have the backend-specialist create the API, then the frontend-specialist build the UI"
```

### Parallel Workflows
When you need comprehensive analysis:
```
"Have the security-auditor, performance-optimizer, and code-reviewer all analyze this application"
```

## Tips for Better Results

### 1. Be Specific About Context
**Good:**
```
"Use the frontend-specialist to create a responsive navigation component with dropdown menus for our React e-commerce site"
```

**Less effective:**
```
"Make a navigation component"
```

### 2. Provide Domain Context
**Good:**
```
"Use the database-specialist to optimize these slow queries in our PostgreSQL e-commerce database with 1M+ products"
```

**Less effective:**
```
"Fix slow queries"
```

### 3. Chain Agents for Complex Tasks
```
"Use the api-designer to plan REST endpoints for user management, then have the backend-specialist implement them, and finally the test-engineer create comprehensive tests"
```

### 4. Reference Previous Agent Work
```
"Based on what the security-auditor found, use the refactoring-specialist to fix the identified vulnerabilities"
```

## Working with Agent Recommendations

### When Agents Suggest Using Other Agents
Agents often recommend bringing in specialists:

```
Frontend Specialist: "For the database schema, I recommend using the database-specialist..."

You: "Use the database-specialist to design the user data schema as suggested"
```

### When You Need a Second Opinion
```
"Get the code-architect to review the database-specialist's schema design and provide architectural feedback"
```

## Troubleshooting Agent Issues

### Agent Not Behaving as Expected?

1. **Be more explicit:**
   ```
   "Please use the frontend-specialist agent specifically for this React component task"
   ```

2. **Provide more context:**
   ```
   "Use the backend-specialist - we're building a Node.js Express API with MongoDB for user authentication"
   ```

3. **Check if right agent for the task:**
   - Database issues → `database-specialist`
   - UI/UX work → `frontend-specialist`
   - Infrastructure → `devops-engineer`

### Getting Generic Responses?

This usually means no agent was activated. Try:
- Being more specific about the domain
- Explicitly requesting an agent
- Providing technical context about your stack

## Advanced Agent Usage

### Project-Specific Customization
Agents adapt to your project patterns. The more you work with them, the better they understand your:
- Code style and conventions
- Architecture patterns
- Technology stack
- Team preferences

### Team Coordination
Multiple team members can work with agents:
- Agents maintain project context
- Decisions made with one agent are available to others
- Use STATUS.md to share agent recommendations across team

---

**Related Guides:**
- [AI Collaboration Guide](./ai-collaboration-guide.md) - Advanced AI workflow patterns
- [Commands Reference](../reference/commands.md) - Slash commands for agent coordination
- [Troubleshooting](../reference/troubleshooting.md) - Solve agent-related issues

**Technical Details:** See `.claude/agents/INDEX.md` for complete agent specifications and technical details.
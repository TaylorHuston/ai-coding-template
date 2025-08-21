# PROMPTING.md

A comprehensive guide to writing effective prompts for AI coding assistants.

## Table of Contents

- [Understanding Context Engineering](#understanding-context-engineering)
- [Core Prompting Principles](#core-prompting-principles)
- [Advanced Prompt Patterns](#advanced-prompt-patterns)
- [Context Window Management](#context-window-management)
- [Tool-Specific Strategies](#tool-specific-strategies)
- [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

## Understanding Context Engineering

**Context engineering** has evolved beyond simple prompt engineering. It's about constructing an entire information environment so AI can solve problems reliably, not just cleverly phrasing questions.

### Key Concepts

- **Quality over Quantity**: The more closely examples in your prompt resemble the target task, the better the model performs
- **Strategic Information Placement**: LLMs are more likely to notice information at the start or end of prompts rather than buried in the middle
- **Context Boundaries**: Use clear markers to separate different phases of work

### Context Management Strategies

1. **Context Pruning**: Regularly summarize progress and start fresh with essential context
2. **Structured Boundaries**: Mark sections as "Previous attempts (for reference)" vs "Current working context"
3. **Progressive Refinement**: Consciously rebuild context after significant progress

## Core Prompting Principles

### 1. Be Specific and Precise

❌ **Poor**: "Make this better"
✅ **Good**: "Refactor this function to use async/await instead of promises, add error handling for network failures, and include JSDoc comments"

### 2. Provide Clear Context

Always include:
- **Background information**: What problem you're solving
- **Constraints**: Libraries to use/avoid, patterns to follow
- **Goal**: What success looks like

### 3. Use Examples (Few-Shot Learning)

Show the AI what you want by providing examples:

```markdown
Here are examples of our coding style:

// Good function documentation
/**
 * Validates user email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 * @throws {ValidationError} When email format is invalid
 */
function validateEmail(email) { /* ... */ }

Now write a similar function for phone number validation.
```

### 4. Structure Your Requests

Use clear sections:
- **Context**: Current situation
- **Goal**: What you want to achieve
- **Constraints**: Requirements and limitations
- **Expected Output**: Format of the response

## Advanced Prompt Patterns

### 1. Context and Instructions Pattern

Combines relevant contextual information with specific instructions for scenarios where AI needs to adapt to dynamic inputs.

```markdown
## Context
You are working on a React TypeScript project using Next.js 14 with:
- App Router
- Tailwind CSS for styling
- Zustand for state management
- React Query for data fetching

## Instructions
Create a user profile component that:
1. Displays user avatar, name, and email
2. Shows loading states during data fetching
3. Handles error states gracefully
4. Follows our established component patterns (see examples/ folder)
5. Uses TypeScript with proper type definitions

## Expected Output
- Component file with TypeScript
- Proper error handling
- Loading states
- Responsive design with Tailwind
```

### 2. Recipe Pattern

Break complex tasks into step-by-step instructions:

```markdown
## Task: Implement User Authentication

Follow these steps:

1. **Create Types**: Define User, AuthState, and AuthActions types
2. **Setup Store**: Create Zustand store with auth state management
3. **API Layer**: Implement login/logout/refresh functions
4. **Components**: Build Login/Register forms
5. **Protection**: Add route protection hooks
6. **Testing**: Write unit tests for each component

For each step, provide:
- Code implementation
- Error handling
- Type definitions
- Usage examples
```

### 3. Example-Driven Development

Provide sample code snippets for patterns you want the AI to follow:

```markdown
Here's our repository pattern:

\`\`\`typescript
export class UserRepository {
  constructor(private api: ApiClient) {}

  async findById(id: string): Promise<User> {
    const response = await this.api.get(\`/users/\${id}\`);
    return UserSchema.parse(response.data);
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const response = await this.api.post('/users', userData);
    return UserSchema.parse(response.data);
  }
}
\`\`\`

Now create a similar repository for Products following the same pattern.
```

### 4. Multi-Agent Architecture

For complex tasks, split the work:

```markdown
## Phase 1: Analysis Agent
Analyze the current codebase and identify:
- Existing patterns
- Dependencies
- Potential conflicts

## Phase 2: Design Agent
Based on the analysis, design:
- Component architecture
- Data flow
- API contracts

## Phase 3: Implementation Agent
Implement the designed solution:
- Write code following established patterns
- Add comprehensive tests
- Include error handling

Please work through each phase sequentially.
```

## Context Window Management

### Understanding Limitations

- **Current Standard**: 32K-128K tokens (250-page book equivalent)
- **Cost Implications**: Large contexts increase computational costs
- **Performance Trade-offs**: Larger contexts can slow performance and dilute attention

### Optimization Techniques

#### 1. Context Chunking

For large codebases, chunk information strategically:

```markdown
## Current Focus: Authentication Module
[Include only auth-related files and dependencies]

## Related Context: 
- User model definition
- API client setup
- Error handling utilities

## Reference Only:
- Database schema
- Other unrelated modules
```

#### 2. Progressive Context Building

Build context incrementally:

1. **Start Small**: Begin with minimal context for the immediate task
2. **Add as Needed**: Include additional context only when required
3. **Prune Regularly**: Remove outdated or irrelevant information

#### 3. Context Templates

Create reusable context templates:

```markdown
## Project Context Template

### Tech Stack
- Framework: [Framework Name]
- Language: [Language/Version]
- Database: [Database Type]
- Key Libraries: [List main dependencies]

### Architecture
- [Brief architecture description]
- [Key patterns used]

### Current Task
- [Specific task description]
- [Success criteria]
- [Constraints]
```

## Tool-Specific Strategies

### Claude Code / Claude 3.5 Sonnet

**Strengths**: Excellent at complex reasoning, architectural decisions, and following patterns

**Best Practices**:
- Provide comprehensive context upfront
- Use structured markdown format
- Include examples and constraints
- Ask for step-by-step explanations when needed

### GitHub Copilot

**Strengths**: Fast autocomplete, pattern recognition, boilerplate generation

**Best Practices**:
- Use descriptive comments before code blocks
- Open relevant files for context
- Use consistent naming and patterns
- Close unrelated files to focus context

### Cursor

**Strengths**: Full codebase understanding, multi-file editing

**Best Practices**:
- Use `.cursor/rules/` for project-specific patterns
- Leverage `@file` references in conversations
- Use inline chat for quick fixes
- Maintain clean git history for context

## Common Pitfalls and Solutions

### 1. Information Overload

**Problem**: Providing too much context dilutes AI attention
**Solution**: Use structured sections, prioritize current needs, prune regularly

### 2. Ambiguous Requirements

**Problem**: "Make it better" or "fix this" without specifics
**Solution**: Define specific success criteria and constraints

### 3. Ignoring Project Patterns

**Problem**: AI generates code that doesn't match existing patterns
**Solution**: Always include examples of existing patterns, use project rules files

### 4. Security Blind Spots

**Problem**: AI might generate insecure code
**Solution**: Explicitly mention security requirements, include security examples

### 5. Context Window Fatigue

**Problem**: Long conversations lose focus
**Solution**: Regularly refresh context with summaries, start new conversations for major changes

## Best Practices Summary

1. **Start with Context**: Always provide project background and constraints
2. **Be Specific**: Detailed requirements lead to better results
3. **Use Examples**: Show the AI what good looks like
4. **Structure Requests**: Use clear sections and formatting
5. **Manage Context**: Prune outdated information regularly
6. **Validate Output**: Always review and test AI-generated code
7. **Iterate**: Refine prompts based on results
8. **Document Patterns**: Save successful prompt patterns for reuse

## Template: Comprehensive Prompt Structure

```markdown
## Project Context
[Brief project description and tech stack]

## Current Situation
[What exists now, what you're working on]

## Goal
[What you want to achieve]

## Requirements
- [Specific requirement 1]
- [Specific requirement 2]
- [Constraint or limitation]

## Examples
[Code examples showing desired patterns]

## Success Criteria
[How to know when it's done correctly]

## Next Steps
[What should happen after this task]
```

Remember: Great prompts are specific, well-structured, and provide just enough context for the AI to understand your needs without overwhelming it.
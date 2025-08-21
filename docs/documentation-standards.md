# Documentation Standards

**Created**: 2025-08-21
**Last Updated**: 2025-08-21
**Purpose**: Ensure consistency and prevent conflicts across all project documentation
**Target Audience**: Developers, Technical Writers, AI Assistants

## Overview

This document establishes documentation standards to prevent conflicts, redundancies, and inconsistencies that can accumulate over time in projects using AI-assisted development.

## Documentation Hierarchy

### 1. Primary Sources (The Source of Truth)
- **`docs/`**: The single source of truth for all technical specifications and guides
- **Core documentation files**: `README`, `CLAUDE.md`, technical specifications
- **Note**: Always reference primary sources rather than duplicating information

### 2. Secondary Sources (Guides & Overviews)  
- **`status.md`**: Current implementation state and priorities
- **`instructions.md`**: Current task instructions and workflows
- **`technical.md`**: Technical specifications and system details

### 3. Tertiary Sources (Entry Points & Quick References)
- **`README`**: Project overview (keep minimal, link to detailed docs)
- **Quick reference guides**: Should link to detailed docs, not duplicate content

## Core Standards

### Version & Date Management

Every documentation file MUST include at the top:

```markdown
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Status**: Active/Archived/Deprecated
**Target Audience**: [Primary audience for this document]
```

### Status Reporting

When documenting any metric or status:

1. **Verify First**: Check with actual code/test output before documenting
2. **Include Both States**: Document current AND target state
   - Example: "Test Status: 85% pass rate (274/320 tests) | Target: 100%"
3. **Date Sensitive Info**: Include "as of YYYY-MM-DD" for time-sensitive data

### Target Audience and Tone

Every documentation file should clearly define its intended audience:

- **Guideline**: All documentation should begin with a `**Target Audience**:` field
- **Informs Writing Style**: 
  - "Senior Developers" → Dense and technical
  - "Junior Developers" → More context and foundational explanations
  - "Product Managers" → Focus on _what_ and _why_, not _how_
- **AI Assistant Consideration**: AI tools MUST adhere to the specified target audience when creating or updating documentation

### Avoiding Conflicts

1. **Single Source of Truth**: Don't duplicate information - reference the authoritative source
2. **Cross-References**: Use links rather than copying content
3. **Update Together**: When implementation changes, update ALL related docs in the same commit
4. **Deprecation**: Never delete docs - mark as DEPRECATED with migration path

## Documentation Patterns

### Feature Documentation Template

```markdown
# Feature Name

**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Status**: Planning/In Progress/Complete/Deprecated
**Target Audience**: Developers

## Summary

Brief overview of the feature

## Current Status

- ✅ Implemented: What's done
- 🚧 In Progress: What's being worked on
- ❌ Not Implemented: What's planned

## Technical Details

Architecture decisions and implementation notes

## API/Schema

Current implementation details

## Testing

- Current Coverage: X%
- Test Files: List key test files
- Known Issues: Any failing tests

## Next Steps

Prioritized list of remaining work
```

### Conflict Resolution Process

When finding conflicting information:

1. **Document First**: Record what conflicts were found
2. **Verify Truth**: Check actual implementation
3. **Update Systematically**: Fix all instances in one commit
4. **Add Note**: Document the resolution in commit message

## Common Pitfalls to Avoid

### ❌ Don't Do This:

- Copy/paste the same information to multiple files
- Document assumptions as facts
- Update one doc without checking for others
- Use vague terms like "mostly complete" without specifics

### ✅ Do This Instead:

- Link to the authoritative source
- Verify everything before documenting
- Search for all references before updating
- Use specific metrics and counts

## Verification Checklist

Before committing documentation updates:

- [ ] All created and last edited dates are present and accurate
- [ ] No duplicate information (use references instead)
- [ ] Links to other docs are valid
- [ ] Deprecated content clearly marked
- [ ] Target audience specified
- [ ] Status information is current and verified

## Examples

### Good: Single Source with References

```markdown
## Testing Status

See [Project Status](../status.md) for current test metrics.
```

### Bad: Duplicated Information

```markdown
## Testing Status

We have 85% test pass rate with 274 out of 320 tests passing.
```

### Good: Clear State Documentation

```markdown
## Feature Implementation

**Current**: Basic functionality implemented
**Planned**: Advanced features with configuration options
```

### Bad: Ambiguous Status

```markdown
## Feature Implementation

Mostly implemented with some work pending.
```

## Code Documentation Standards

### JSDoc Standards

#### Function/Method Documentation Template

```typescript
/**
 * Brief one-line description of what the function does
 *
 * Detailed explanation of the function's purpose, business logic, and context.
 * Explain any complex algorithms, security considerations, or integration points.
 *
 * @param {Type} paramName - Description of the parameter, including constraints
 * @param {Type} [optionalParam] - Optional parameter description
 * @param {Object} complexParam - Complex parameter description
 * @param {string} complexParam.property - Description of nested properties
 *
 * @returns {Type} Description of return value and its structure
 *
 * @throws {Error} When specific error conditions occur
 *
 * @example
 * ```typescript
 * // Basic usage example
 * const result = await functionName(param1, param2)
 * console.log(result.property)
 * ```
 */
```

#### Component Documentation Template

```typescript
/**
 * ComponentName - Brief description of UI component purpose
 *
 * Detailed description of the component's functionality, behavior, and
 * visual appearance. Explain when to use this component and how it fits
 * into the design system.
 *
 * @param {ComponentProps} props - The component props
 * @returns {JSX.Element} Rendered component
 *
 * @example
 * ```tsx
 * <ComponentName
 *   requiredProp="value"
 *   optionalProp={true}
 * />
 * ```
 */
interface ComponentNameProps {
  /** Required property with specific format or constraints */
  requiredProp: string;
  /** Optional property with default behavior description */
  optionalProp?: boolean;
}
```

### Inline Business Logic Comments

#### Business Logic Comment Format

```typescript
// Business Logic: [Brief description of the business rule]
// [Detailed explanation of why this logic exists, what business problem it solves,
// and any important constraints or assumptions]
```

#### Examples of Good Business Logic Comments

```typescript
// Business Logic: Implement access control system
// Global items are accessible to all authenticated users (default items)
// Organization items are only visible to organization members for privacy
if (!item.is_global) {
  // Check organization membership for private items
}

// Security: Return 404 instead of 403 to avoid revealing item existence
// This prevents unauthorized users from discovering private items through error messages
if (!hasAccess) {
  return { error: 'Item not found' };
}

// Performance: Limit context to recent items for efficiency
// This provides sufficient context while staying within reasonable limits
const recentItems = await getRecentItems({ limit: 10 });
```

### File Header Documentation

```typescript
/**
 * @fileoverview [File Purpose] - [Brief description]
 *
 * [Detailed description of the file's role in the system, main components,
 * and how it integrates with other parts of the application.]
 *
 * Key components:
 * - Component 1: Description
 * - Component 2: Description
 *
 * @since Version when this file was created
 */
```

## Documentation Review Checklist

When reviewing or creating code documentation, ensure:

### ✅ Content Quality

- [ ] Explains **why** the code exists (business context)
- [ ] Includes realistic usage examples
- [ ] Documents error conditions and edge cases
- [ ] Explains security implications where relevant
- [ ] Covers performance considerations

### ✅ Technical Accuracy

- [ ] Parameter types and constraints are correct
- [ ] Return value documentation matches implementation
- [ ] Examples can be copied and run successfully
- [ ] Error scenarios are documented accurately

### ✅ Format Consistency

- [ ] Follows the appropriate template for the code type
- [ ] Uses consistent JSDoc formatting
- [ ] Includes proper `@param`, `@returns`, and `@throws` tags
- [ ] Examples use proper syntax highlighting

### ✅ Business Logic Comments

- [ ] Complex business rules are explained with inline comments
- [ ] Security considerations are documented where applicable
- [ ] Performance implications are noted for optimization decisions
- [ ] Integration points and external dependencies are explained

## Maintenance Schedule

- **Daily**: Update documentation when making code changes
- **Weekly**: Review status.md and instructions.md for accuracy
- **Per Feature**: Update feature docs with implementation details
- **Per Release**: Archive outdated documentation
- **Monthly**: Audit for conflicts and redundancies

## Tools and Automation

This project includes automated documentation maintenance tools:

### Available Commands

```bash
# Check documentation health
node scripts/docs-health.js

# Validate all links
node scripts/check-docs-links.js

# Generate new documentation from templates
node scripts/generate-doc.js

# Track documentation changes
node scripts/docs-changelog.js
```

See the `scripts/` directory for detailed information about each tool.

## Instructions for AI Assistants

### Before Updating Documentation

1. **Read Current Content**: Always read existing files before updating
2. **Check for Conflicts**: Search for related information that might need updating
3. **Verify Information**: Confirm all facts against actual implementation
4. **Follow Templates**: Use the appropriate template for new documentation

### During Documentation Updates

1. **Maintain Standards**: Follow all formatting and metadata requirements
2. **Update Related Docs**: Check for and update cross-references
3. **Preserve Links**: Maintain existing link structure
4. **Document Changes**: Note what was changed and why

### Quality Assurance

- Always include metadata headers in new files
- Use appropriate target audience designation
- Verify all examples are functional
- Check links before committing
- Follow single-source-of-truth principle

---

By following these comprehensive documentation standards, we ensure that all project documentation remains clear, accurate, and maintainable for team members and AI assistants alike.
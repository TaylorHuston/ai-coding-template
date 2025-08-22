# Documentation Standards

**Version**: 1.2.0
**Created**: 2025-08-21
**Last Updated**: 2025-08-22
**Status**: Active
**Target Audience**: Developers, Technical Writers, AI Assistants

## Overview

This document establishes documentation standards to prevent conflicts, redundancies, and inconsistencies that can accumulate over time in projects using AI-assisted development.

## Documentation Types & Hierarchy

### Documentation Type Separation

This project maintains two distinct documentation types to serve different audiences and purposes:

#### Technical Documentation (Developer-Focused)
- **Location**: `docs/architecture/` and `docs/templates/feature.template.md`
- **Purpose**: Implementation details, system design, code patterns
- **Audience**: Developers, AI assistants, technical contributors
- **Focus**: HOW to build and maintain the system
- **Template**: Use `feature.template.md` for technical architecture documents
- **Volume**: Multiple technical documents per product deliverable

#### Product Documentation (Business-Focused)  
- **Location**: `docs/deliverables/` and `docs/templates/deliverable.template.md`
- **Purpose**: Business requirements, user impact, product specifications
- **Audience**: Product managers, stakeholders, business teams
- **Focus**: WHAT to build and WHY it matters to users/business
- **Template**: Use `deliverable.template.md` for product deliverable documents
- **Volume**: One deliverable document may encompass multiple technical components

### Documentation Relationship

**Important**: This is **not a 1:1 mapping**. Typically:

- **One product deliverable** (e.g., "User Management System") may require **multiple technical architecture documents** (e.g., authentication, user profiles, permissions, audit logging)
- **One technical component** may serve **multiple product deliverables** (e.g., a shared authentication service used across different product features)
- **Technical documents** are created as needed for implementation, while **product documents** are created for major user-facing features or business initiatives

### Documentation Hierarchy

#### 1. Primary Sources (The Source of Truth)

- **`docs/architecture/`**: Technical specifications and system design
- **`docs/deliverables/`**: Product specifications and business requirements
- **Core documentation files**: `README`, `CLAUDE.md`, technical specifications
- **Note**: Always reference primary sources rather than duplicating information

#### 2. Secondary Sources (Guides & Overviews)

- **`status.md`**: Current implementation state and priorities
- **`workbench/[ISSUE]/PLAN.md`**: Active task instructions and workflows
- **`technical.md`**: Technical specifications and system details

#### 3. Tertiary Sources (Entry Points & Quick References)

- **`README`**: Project overview (keep minimal, link to detailed docs)
- **Quick reference guides**: Should link to detailed docs, not duplicate content

## Core Standards

### File Naming Conventions

To ensure consistency and readability, all documentation files MUST follow these naming conventions:

- **Case:** All filenames must be in `lowercase`.
- **Separators:** Use hyphens (`-`) to separate words (i.e., `kebab-case`).
- **Content:** Filenames should be descriptive and reflect the content of the file.

**✅ Good Examples:**

- `authentication-guide.md`
- `api-reference.md`
- `deployment-instructions.md`

**❌ Bad Examples:**

- `AuthenticationGuide.md` (uses PascalCase)
- `api_reference.md` (uses snake_case)
- `Deployment Instructions.md` (uses spaces)

#### Common Exceptions

While the `lowercase-kebab-case` standard should be used for all documentation files you create, there are several important exceptions for root-level and tool-specific files. These files have their own established conventions.

- **`README.md`**: Always in uppercase to ensure it's easily identifiable.
- **`LICENSE`**: Also typically in uppercase.
- **`CONTRIBUTING.md`**, **`CHANGELOG.md`**, **`CODE_OF_CONDUCT.md`**: These files have established community conventions.
- **Tool-Specific Files**: Always follow the naming conventions of the tool or platform (e.g., `Makefile`, `Dockerfile`, `Vagrantfile`, `Gemfile`, `Procfile`).
- **Framework-Specific Files**: Follow the naming conventions of the framework (e.g., `vercel.json`, `netlify.toml`, `next.config.js`).

**Guiding Principle:** Use `lowercase-kebab-case` for your project's documentation files. For all other files, defer to the established conventions of the tool, platform, or community.

### Version & Date Management

Every documentation file MUST include at the top:

```markdown
**Version**: X.Y.Z
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Status**: Active/Archived/Deprecated
**Target Audience**: [Primary audience for this document]
```

#### Versioning System

Use semantic versioning for documentation:

- **Major (X.0.0)**: Breaking changes, complete rewrites, major restructuring
- **Minor (X.Y.0)**: New sections, significant additions, structural changes
- **Patch (X.Y.Z)**: Corrections, clarifications, small updates, typo fixes

**Examples:**

- `1.0.0`: Initial version
- `1.1.0`: Added new major section
- `1.1.1`: Fixed typos and updated examples
- `2.0.0`: Complete rewrite or major structural change

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

### Template Selection Guide

Choose the appropriate template based on your documentation purpose:

#### Technical Documentation Template
- **Use For**: System architecture, implementation details, code patterns
- **Template**: `docs/templates/feature.template.md`
- **Example**: Authentication system architecture, API implementation details
- **Audience**: Developers, AI assistants, technical teams

#### Product Documentation Template  
- **Use For**: Business requirements, user stories, product specifications
- **Template**: `docs/templates/deliverable.template.md`
- **Example**: User authentication feature requirements, product launch plans
- **Audience**: Product managers, stakeholders, business teams

### Quick Reference Documentation Structure

#### Technical Document Structure
```markdown
# Feature Name - Technical Architecture

**Version**: X.Y.Z
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Status**: Planning/In Progress/Complete/Deprecated
**Target Audience**: Developers

## Summary
Brief technical overview

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

#### Product Document Structure
```markdown
# Feature Name - Product Deliverable

**Version**: X.Y.Z
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Status**: Draft/In Progress/Complete/Delivered
**Target Audience**: Product Managers

## Executive Summary
Business value and user impact

## User Stories
Key user scenarios and workflows

## Success Criteria
Measurable outcomes that define success

## Implementation Plan
High-level phases and timeline

## Risk Assessment
Business and technical risks

## Success Metrics
KPIs and acceptance criteria
```

### Conflict Resolution Process

When finding conflicting information:

1. **Document First**: Record what conflicts were found
2. **Verify Truth**: Check actual implementation
3. **Update Systematically**: Fix all instances in one commit
4. **Add Note**: Document the resolution in commit message

## Common Pitfalls to Avoid

### ❌ Don't Do This

- Copy/paste the same information to multiple files
- Document assumptions as facts
- Update one doc without checking for others
- Use vague terms like "mostly complete" without specifics

### ✅ Do This Instead

- Link to the authoritative source
- Verify everything before documenting
- Search for all references before updating
- Use specific metrics and counts

## Verification Checklist

Before committing documentation updates:

- [ ] Version number updated appropriately (major/minor/patch)
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
- **Weekly**: Review status.md and active workbench PLAN.md files for accuracy
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
4. **Choose Correct Template**: Select technical (`feature.template.md`) or product (`deliverable.template.md`) template based on audience and purpose
5. **Follow Templates**: Use the appropriate template for new documentation

### During Documentation Updates

1. **Maintain Standards**: Follow all formatting and metadata requirements
2. **Update Related Docs**: Check for and update cross-references
3. **Preserve Links**: Maintain existing link structure
4. **Document Changes**: Note what was changed and why

### Quality Assurance

- Always include metadata headers with version numbers in new files
- Update version numbers appropriately when making changes
- Use appropriate target audience designation
- Verify all examples are functional
- Check links before committing
- Follow single-source-of-truth principle

### Version Management Guidelines

When updating documentation:

1. **Patch (X.Y.Z+1)**: For typos, small clarifications, example updates
2. **Minor (X.Y+1.0)**: For new sections, additional content, structural improvements
3. **Major (X+1.0.0)**: For complete rewrites, breaking changes, major restructuring

Always update the "Last Updated" date when incrementing any version number.

---

By following these comprehensive documentation standards, we ensure that all project documentation remains clear, accurate, and maintainable for team members and AI assistants alike.


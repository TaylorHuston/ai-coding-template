---
# === Metadata ===
template_type: "guideline"
version: "1.0.0"
created: "2025-10-30"
last_updated: "2025-10-30"
status: "Optional"
target_audience: ["AI Assistants", "Development Team"]
description: "Code style, naming conventions, and file organization standards"

# === Coding Configuration (Machine-readable for AI agents) ===
language: "TBD"                # javascript, typescript, python, go, etc.
file_naming: "kebab-case"      # kebab-case, camelCase, snake_case, PascalCase
directory_structure: "TBD"      # feature-based, layer-based, etc.
formatter: "TBD"               # prettier, black, gofmt, etc.
linter: "TBD"                  # eslint, pylint, golangci-lint, etc.
max_line_length: 100
indent_style: "spaces"         # spaces or tabs
indent_size: 2
---

# Coding Standards

**Referenced by Commands:** _None currently_ (available for code quality tools and agent guidance)

## Quick Reference

This guideline defines our code style, naming conventions, and file organization. Update as you establish project conventions.

## Language & Tooling

**Primary Language**: TBD → Update when decided

- **Version**: TBD
- **Type System**: TBD (TypeScript, static typing, dynamic typing)
- **Runtime**: TBD (Node.js, Deno, Python, etc.)

### Code Formatting

- **Formatter**: TBD (Prettier, Black, gofmt, etc.)
- **Config**: TBD - Add link to formatter config file
- **Auto-format on save**: TBD (recommended: yes)

### Linting

- **Linter**: TBD (ESLint, Pylint, golangci-lint, etc.)
- **Config**: TBD - Add link to linter config file
- **Rules**: TBD (strict, recommended, custom)

## Naming Conventions

### Files & Directories

- **Files**: kebab-case (already configured)
  - Components: `user-profile.tsx`
  - Utils: `format-date.ts`
  - Tests: `user-profile.test.ts`

- **Directories**: kebab-case
  - Features: `user-management/`
  - Components: `ui-components/`

### Code Identifiers

```
TBD - Define naming for variables, functions, classes, etc.

Examples:
- Variables: camelCase (userData, isLoading)
- Functions: camelCase (getUserData, formatDate)
- Classes: PascalCase (UserProfile, ApiClient)
- Constants: UPPER_SNAKE_CASE (MAX_RETRIES, API_URL)
- Types/Interfaces: PascalCase (User, ApiResponse)
```

## File Organization

### Directory Structure

```
TBD - Define after initial project structure is established

Examples:
- Feature-based: src/features/users/
- Layer-based: src/controllers/, src/services/, src/models/
- Module-based: src/modules/user/
```

### File Size Guidelines

- **Max lines**: TBD (recommended: 200-300)
- **Single Responsibility**: Each file should have one clear purpose
- **Splitting**: TBD (when to split files)

### Import Organization

```
TBD - Define import ordering

Example:
1. External dependencies
2. Internal modules
3. Relative imports
4. Types/interfaces
5. Styles/assets
```

## Code Style

### Line Length

- **Max**: 100 characters (already configured)
- **Wrap**: TBD (how to handle long lines)

### Indentation

- **Style**: spaces (already configured)
- **Size**: 2 spaces (already configured)

### Comments

- **When to comment**: TBD
  - Always: Complex algorithms, non-obvious logic
  - Rarely: Self-explanatory code
  - Never: Obvious code, commented-out code

- **Style**: TBD
  - JSDoc for functions?
  - Inline for clarification?

### Function Guidelines

- **Max parameters**: TBD (recommended: 3-4)
- **Max complexity**: TBD
- **Naming**: TBD (verb-first for actions, noun-first for getters)

## Examples

This section will be populated with examples from the codebase showing good practices.

### Well-Structured File
- TBD - Add link to exemplar file

### Good Function Example
- TBD - Add link to well-written function

### Import Organization Example
- TBD - Add example from codebase

## General Coding Knowledge

For coding best practices, Claude has extensive knowledge of:
- Clean Code principles (naming, functions, comments)
- SOLID principles (single responsibility, open-closed, etc.)
- Design patterns (factory, strategy, observer, etc.)
- Code smells and refactoring techniques
- Language-specific idioms and conventions

Ask questions like "What's the best way to structure [X]?" and Claude will provide guidance based on industry standards and your chosen language/framework.

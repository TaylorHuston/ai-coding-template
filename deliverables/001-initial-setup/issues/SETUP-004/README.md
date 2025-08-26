# SETUP-004: Set Up Linting & Code Quality

**Status**: 📋 Not Started  
**Type**: Setup Task  
**Priority**: P0 - Critical Foundation  
**Estimated Time**: 1-2 hours  
**Assignee**: Unassigned

## Overview

Implement automated code quality tools including linters, formatters, and pre-commit hooks to maintain consistent code style and catch issues early. This ensures all team members follow the same standards and reduces code review friction.

## Objectives

- ✅ Configure ESLint/Prettier (or language equivalents)
- ✅ Set up pre-commit hooks with Husky
- ✅ Configure lint-staged for performance
- ✅ Establish code review standards
- ✅ Set up commit message validation
- ✅ Create code quality scripts

## Acceptance Criteria

- [ ] Linter configured for all file types
- [ ] Formatter configured and working
- [ ] Pre-commit hooks prevent bad commits
- [ ] Commit messages follow conventional format
- [ ] Code quality scripts in package.json
- [ ] Editor integration documented
- [ ] All existing code passes linting
- [ ] Team agreed on rule set

## Implementation Guide

### Step 1: Install Linting Dependencies

For **JavaScript/TypeScript**:

```bash
# ESLint and Prettier
npm install --save-dev \
  eslint \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin

# Additional plugins
npm install --save-dev \
  eslint-plugin-import \
  eslint-plugin-node \
  eslint-plugin-promise \
  eslint-plugin-react \
  eslint-plugin-react-hooks

# Husky and lint-staged
npm install --save-dev \
  husky \
  lint-staged \
  @commitlint/cli \
  @commitlint/config-conventional
```

### Step 2: Configure ESLint

Create `.eslintrc.js`:

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import',
    'promise',
  ],
  rules: {
    // Error prevention
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'prefer-arrow-callback': 'error',
    
    // TypeScript
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // React
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Import
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' }
    }],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.test.{js,ts}', '*.spec.{js,ts}'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
```

Create `.eslintignore`:

```
node_modules/
dist/
build/
coverage/
*.config.js
.eslintrc.js
public/
```

### Step 3: Configure Prettier

Create `.prettierrc.js`:

```javascript
module.exports = {
  // Line length
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  
  // Quotes
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  
  // Punctuation
  semi: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow functions
  arrowParens: 'always',
  
  // Format
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  
  // Framework specific
  vueIndentScriptAndStyle: false,
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,
};
```

Create `.prettierignore`:

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build outputs
dist/
build/
coverage/

# Generated files
*.min.js
*.min.css

# Data files
*.json
*.yml
*.yaml

# Documentation
*.md
```

### Step 4: Configure Pre-commit Hooks

Initialize Husky:

```bash
# Initialize husky
npx husky-init && npm install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Add commit-msg hook for conventional commits
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

Create `.lintstagedrc.js`:

```javascript
module.exports = {
  // JavaScript/TypeScript files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'jest --bail --findRelatedTests',
  ],
  
  // Style files
  '*.{css,scss,sass,less}': [
    'stylelint --fix',
    'prettier --write',
  ],
  
  // JSON files
  '*.json': [
    'prettier --write',
  ],
  
  // Markdown files
  '*.md': [
    'prettier --write',
    'markdownlint',
  ],
  
  // YAML files
  '*.{yml,yaml}': [
    'prettier --write',
  ],
  
  // Check types
  '**/*.ts?(x)': () => 'tsc --noEmit',
};
```

### Step 5: Configure Commit Message Validation

Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type rules
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Code restructuring
        'perf',     // Performance
        'test',     // Tests
        'build',    // Build system
        'ci',       // CI/CD
        'chore',    // Maintenance
        'revert',   // Revert commit
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    
    // Scope rules
    'scope-case': [2, 'always', 'lower-case'],
    
    // Subject rules
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 72],
    
    // Body rules
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 100],
    
    // Footer rules
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
};
```

### Step 6: Add Quality Scripts

Update `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "quality": "npm run lint && npm run format:check && npm run type-check",
    "quality:fix": "npm run lint:fix && npm run format",
    "prepare": "husky install"
  }
}
```

### Step 7: Create Code Quality Documentation

Create `docs/code-quality.md`:

```markdown
# Code Quality Standards

## Overview

We use automated tools to maintain consistent code quality across the project.

## Tools

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Pre-commit checks
- **commitlint**: Commit message validation

## Running Quality Checks

```bash
# Check all files
npm run quality

# Fix all auto-fixable issues
npm run quality:fix

# Run specific tools
npm run lint        # ESLint only
npm run format      # Prettier only
npm run type-check  # TypeScript only
```

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Examples:
- `feat(auth): add login functionality`
- `fix(api): handle null response`
- `docs(readme): update installation steps`

## Editor Integration

### VS Code

1. Install extensions:
   - ESLint
   - Prettier
   - EditorConfig

2. Settings already configured in `.vscode/settings.json`

### Other Editors

See documentation for your specific editor:
- [WebStorm](https://www.jetbrains.com/help/webstorm/eslint.html)
- [Sublime Text](https://github.com/SublimeLinter/SublimeLinter-eslint)
- [Vim](https://github.com/dense-analysis/ale)

## Bypassing Checks (Emergency Only)

```bash
# Skip pre-commit hooks (use sparingly!)
git commit --no-verify

# Disable ESLint for a line
// eslint-disable-next-line

# Disable Prettier for a block
// prettier-ignore
```

## Custom Rules

To propose changes to linting rules:
1. Discuss with team
2. Test impact on codebase
3. Update `.eslintrc.js`
4. Document reasoning
```

## Verification Steps

```bash
# Test linting
echo "var x = 1" > test.js
npm run lint  # Should show errors
rm test.js

# Test formatting
echo "const x={a:1,b:2}" > test.js
npm run format
cat test.js  # Should be formatted
rm test.js

# Test pre-commit hook
git add .
git commit -m "test"  # Should fail with wrong format
git commit -m "test: verify hooks"  # Should pass

# Verify all files pass
npm run quality
```

## AI Agent Instructions

When completing this task:

1. Adapt linting rules to project's tech stack
2. Ensure rules match team preferences
3. Fix all existing linting errors
4. Test hooks work correctly
5. Document any custom rules
6. Verify editor integrations

## Definition of Done

- [ ] ESLint configured and working
- [ ] Prettier configured and working
- [ ] Husky hooks installed and tested
- [ ] lint-staged configured
- [ ] Commit message validation working
- [ ] All existing code passes checks
- [ ] Scripts added to package.json
- [ ] Documentation complete
- [ ] Team reviewed and approved rules

## Related Issues

- Previous: [SETUP-003](../SETUP-003/README.md) - Testing Framework
- Next: [SETUP-005](../SETUP-005/README.md) - Observability & Logging
- Related: [SETUP-007](../SETUP-007/README.md) - CI/CD Pipeline

## Resources

- [ESLint Documentation](https://eslint.org/docs/)
- [Prettier Documentation](https://prettier.io/docs/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [lint-staged](https://github.com/okonet/lint-staged)
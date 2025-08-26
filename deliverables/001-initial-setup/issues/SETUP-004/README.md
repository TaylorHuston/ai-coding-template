# SETUP-004: Linting & Code Quality Implementation

## Quick Start

1. Install dependencies:
   ```bash
   npm run lint:setup
   # or manually install ESLint, Prettier, Husky
   ```

2. Run linting:
   ```bash
   npm run lint
   npm run format
   ```

## Implementation

### JavaScript/TypeScript Setup

Install dependencies:
```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin husky lint-staged @commitlint/cli @commitlint/config-conventional
```

Create `.eslintrc.js`:
```javascript
module.exports = {
  root: true,
  env: { node: true, es2021: true, jest: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'eqeqeq': ['error', 'always'],
    'prefer-const': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_'
    }]
  }
};
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

### Python Setup

Install dependencies:
```bash
pip install black flake8 isort pre-commit
```

Create `.flake8`:
```ini
[flake8]
max-line-length = 88
ignore = E203, W503
exclude = .git,__pycache__,docs/,build/,dist/
```

Create `pyproject.toml`:
```toml
[tool.black]
line-length = 88
target-version = ['py38']

[tool.isort]
profile = "black"
line_length = 88
```

### Pre-commit Hooks Setup

Initialize Husky:
```bash
npx husky-init && npm install
```

Create `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Update `package.json`:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  },
  "scripts": {
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,md}\""
  }
}
```

### Commit Message Validation

Create `commitlint.config.js`:
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'revert'
      ]
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 72]
  }
};
```

Add commit hook `.husky/commit-msg`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```

## Testing

### Verify Setup

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Test pre-commit hook
git add .
git commit -m "test: verify pre-commit hook"

# Test commit message validation
git commit -m "invalid commit message" # Should fail
git commit -m "feat: add new feature" # Should pass
```

### Editor Integration

**VS Code**: Install extensions:
- ESLint
- Prettier - Code formatter
- Prettier ESLint

**VS Code settings** in `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Troubleshooting

### Linting Errors

```bash
# See all linting errors
npm run lint

# Auto-fix what can be fixed
npm run lint:fix

# Check specific file
npx eslint src/components/MyComponent.tsx
```

### Formatting Issues

```bash
# Format specific files
npx prettier --write src/components/MyComponent.tsx

# Check formatting without changing
npx prettier --check src/
```

### Pre-commit Hook Issues

```bash
# Skip pre-commit hooks (emergency only)
git commit --no-verify -m "emergency fix"

# Re-run pre-commit hook
npx lint-staged

# Update hooks
npx husky add .husky/pre-commit "npx lint-staged"
```

### Bypass Emergency

```bash
# Disable ESLint for specific line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response;

# Disable ESLint for entire file
/* eslint-disable */

# Skip commit message validation
git commit --no-verify -m "emergency: fix critical issue"
```
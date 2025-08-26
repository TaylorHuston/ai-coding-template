# SETUP-001: Initialize Repository & Core Structure

**Status**: 📋 Not Started  
**Type**: Setup Task  
**Priority**: P0 - Critical Foundation  
**Estimated Time**: 1-2 hours  
**Assignee**: Unassigned

## Overview

Initialize the project repository with proper version control, environment configuration, and a well-organized directory structure. This forms the foundation for all subsequent development work.

## Objectives

- ✅ Initialize Git repository with proper configuration
- ✅ Create comprehensive .gitignore file
- ✅ Set up environment variables management
- ✅ Establish project directory structure
- ✅ Configure package manager
- ✅ Create initial project metadata

## Acceptance Criteria

- [ ] Git repository initialized with main branch
- [ ] .gitignore covers all common patterns for tech stack
- [ ] Environment variable system configured (.env.example provided)
- [ ] Directory structure follows best practices
- [ ] Package manager configured with lock file
- [ ] README.md created with project information
- [ ] LICENSE file added (if applicable)
- [ ] Security policies in place (no secrets in repo)

## Implementation Guide

### Step 1: Initialize Git Repository

```bash
# Initialize repository
git init

# Configure Git (replace with your info)
git config --local user.name "Your Name"
git config --local user.email "your.email@example.com"

# Create main branch
git checkout -b main

# Set up branch protection (if using GitHub)
# Configure in GitHub Settings > Branches
```

### Step 2: Create Comprehensive .gitignore

Create `.gitignore` file:

```gitignore
# Dependencies
node_modules/
vendor/
venv/
__pycache__/
*.pyc

# Environment variables
.env
.env.local
.env.*.local
!.env.example

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Build outputs
dist/
build/
out/
target/
*.exe
*.dll
*.so
*.dylib

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/
*.lcov
.coverage
htmlcov/

# Temporary files
tmp/
temp/
*.tmp
*.bak
*.cache

# Security
*.key
*.pem
*.p12
*.pfx
.secrets/
```

### Step 3: Set Up Environment Variables

Create `.env.example`:

```bash
# Application
NODE_ENV=development
APP_PORT=3000
APP_HOST=localhost

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# API Keys (never commit real values)
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here

# Feature Flags
ENABLE_FEATURE_X=false
DEBUG_MODE=true

# External Services
SENTRY_DSN=
SLACK_WEBHOOK_URL=
AWS_REGION=us-east-1
```

Create `.env`:

```bash
# Copy .env.example and fill with real values
cp .env.example .env
# Edit .env with actual values (never commit this file)
```

### Step 4: Establish Directory Structure

```bash
# Create standard directories
mkdir -p src/{components,services,utils,config}
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs/{api,guides,architecture}
mkdir -p scripts/{dev,build,deploy}
mkdir -p config/{development,staging,production}
mkdir -p public/assets
mkdir -p .github/{workflows,ISSUE_TEMPLATE}
```

Final structure:
```
project-root/
├── src/                 # Source code
│   ├── components/      # UI components (frontend)
│   ├── services/        # Business logic
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── tests/              # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/          # End-to-end tests
├── docs/              # Documentation
│   ├── api/          # API documentation
│   ├── guides/       # User guides
│   └── architecture/ # Technical design docs
├── scripts/          # Utility scripts
│   ├── dev/         # Development scripts
│   ├── build/       # Build scripts
│   └── deploy/      # Deployment scripts
├── config/          # Environment configs
├── public/          # Static files (frontend)
├── .github/         # GitHub specific files
├── .env.example     # Environment template
├── .gitignore      # Git ignore rules
├── README.md       # Project documentation
└── package.json    # Package configuration
```

### Step 5: Configure Package Manager

For **Node.js** projects:

```bash
# Initialize package.json
npm init -y

# Update package.json
cat > package.json << 'EOF'
{
  "name": "project-name",
  "version": "0.1.0",
  "description": "Project description",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write ."
  },
  "keywords": [],
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
EOF

# Create lock file
npm install
```

For **Python** projects:

```bash
# Create requirements.txt
cat > requirements.txt << 'EOF'
# Core dependencies
python-dotenv==1.0.0

# Development dependencies
pytest==7.4.0
black==23.7.0
flake8==6.1.0
EOF

# Or use Poetry
poetry init
poetry add python-dotenv
poetry add --dev pytest black flake8
```

### Step 6: Create Initial README

```markdown
# Project Name

Brief description of what this project does and why it exists.

## Features

- Feature 1
- Feature 2
- Feature 3

## Quick Start

```bash
# Clone repository
git clone https://github.com/username/project.git
cd project

# Install dependencies
npm install  # or: pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev  # or: python main.py
```

## Project Structure

```
src/          - Source code
tests/        - Test files
docs/         - Documentation
scripts/      - Utility scripts
```

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

[MIT](./LICENSE) © Your Name
```

### Step 7: Add License (if needed)

```bash
# For MIT License
curl -o LICENSE https://raw.githubusercontent.com/licenses/license-templates/master/templates/mit.txt

# Edit LICENSE file with your name and year
```

### Step 8: Create Security Configuration

Create `.gitsecrets` patterns file:

```bash
# Install git-secrets (optional but recommended)
brew install git-secrets  # macOS
# or
git clone https://github.com/awslabs/git-secrets.git

# Configure patterns
git secrets --register-aws  # AWS credentials
git secrets --add 'api[_-]?key.*["\'].*["\']'  # API keys
git secrets --add 'secret.*["\'].*["\']'  # Secrets
```

## Verification Steps

Run these commands to verify setup:

```bash
# Check Git status
git status

# Verify .gitignore works
touch test.log
git status  # test.log should not appear

# Check environment setup
ls -la .env*  # Should see .env and .env.example

# Verify directory structure
tree -L 2 -I 'node_modules'

# Test package manager
npm run test  # or equivalent

# Security check
git secrets --scan  # Should pass
```

## Common Issues & Solutions

### Issue: Accidentally committed .env file
```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
echo ".env" >> .gitignore
```

### Issue: Wrong line endings (Windows/Unix)
```bash
# Configure Git to handle line endings
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input  # Mac/Linux
```

### Issue: Package manager conflicts
```bash
# Choose one and remove others
rm package-lock.json  # if using yarn
rm yarn.lock  # if using npm
```

## AI Agent Instructions

When completing this task:

1. Check for existing repository initialization
2. Adapt examples to project's tech stack
3. Ensure no sensitive data in committed files
4. Verify all acceptance criteria are met
5. Run verification steps before marking complete
6. Document any project-specific decisions

## Definition of Done

- [ ] Git repository initialized and configured
- [ ] Comprehensive .gitignore in place
- [ ] Environment variables system working
- [ ] Directory structure created and documented
- [ ] Package manager configured with lock file
- [ ] README.md with project information
- [ ] LICENSE file added (if applicable)
- [ ] Security measures implemented
- [ ] Initial commit made with all foundation files
- [ ] Team reviewed and approved structure

## Related Issues

- Next: [SETUP-002](../SETUP-002/README.md) - Establish Development Environment
- Related: [SETUP-008](../SETUP-008/README.md) - Create Documentation Foundation

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub .gitignore Templates](https://github.com/github/gitignore)
- [Choose a License](https://choosealicense.com/)
- [The Twelve-Factor App](https://12factor.net/)
- [Semantic Versioning](https://semver.org/)
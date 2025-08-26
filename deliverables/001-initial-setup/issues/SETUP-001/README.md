# Initialize Repository - Implementation Guide

## Quick Start

```bash
# Initialize repo
git init
git checkout -b main

# Copy environment template
cp .env.example .env

# Install dependencies
npm install  # or: pip install -r requirements.txt
```

## Implementation

### Git Configuration

```bash
# Set up local Git config
git config --local user.name "Your Name"
git config --local user.email "your.email@example.com"
```

### .gitignore Template

```gitignore
# Dependencies
node_modules/
venv/
__pycache__/

# Environment
.env
.env.local
!.env.example

# IDE
.vscode/
.idea/
.DS_Store

# Build
dist/
build/
coverage/

# Security
*.key
*.pem
.secrets/
```

### Environment Variables (.env.example)

```bash
# Application
NODE_ENV=development
APP_PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API Keys (never commit real values)
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### Directory Structure

```bash
# Create standard directories
mkdir -p src/{components,services,utils}
mkdir -p tests/{unit,integration}
mkdir -p docs scripts config
```

```
project/
├── src/           # Source code
├── tests/         # Test files
├── docs/          # Documentation
├── scripts/       # Utility scripts
├── config/        # Configuration
├── .env.example   # Environment template
├── .gitignore     # Ignore patterns
├── package.json   # Dependencies
└── README.md      # Project info
```

### Package.json (Node.js)

```json
{
  "name": "project-name",
  "version": "0.1.0",
  "description": "Project description",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "lint": "eslint src/"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Requirements.txt (Python)

```txt
# Core dependencies
python-dotenv==1.0.0

# Dev dependencies
pytest==7.4.0
black==23.7.0
flake8==6.1.0
```

### Project README Template

```markdown
# Project Name

Brief description of the project.

## Quick Start

\```bash
git clone <repo-url>
cd project
npm install
cp .env.example .env
npm run dev
\```

## License

MIT
```

## Testing

```bash
# Verify .gitignore works
touch test.log
git status  # test.log should not appear

# Check environment
ls -la .env*

# Test package manager
npm test
```

## Troubleshooting

- **Accidentally committed .env**: 
  ```bash
  git rm --cached .env
  git commit -m "Remove .env from tracking"
  ```

- **Wrong line endings (Windows/Unix)**:
  ```bash
  git config --global core.autocrlf true  # Windows
  git config --global core.autocrlf input  # Mac/Linux
  ```

- **Package manager conflicts**:
  Remove `package-lock.json` if using Yarn, or `yarn.lock` if using npm
# SETUP-002: Establish Development Environment

**Status**: 📋 Not Started  
**Type**: Setup Task  
**Priority**: P0 - Critical Foundation  
**Estimated Time**: 2-3 hours  
**Assignee**: Unassigned

## Overview

Create a consistent, reproducible development environment that ensures all team members work with the same configurations, tools, and settings. This eliminates "works on my machine" problems and accelerates onboarding.

## Objectives

- ✅ Configure EditorConfig for code consistency
- ✅ Set up development containers (Docker/Dev Containers)
- ✅ Configure IDE/editor settings and extensions
- ✅ Create local development scripts
- ✅ Set up database and service dependencies
- ✅ Document environment setup process

## Acceptance Criteria

- [ ] EditorConfig file covers all file types
- [ ] Docker Compose configured for local services
- [ ] VS Code settings and extensions documented
- [ ] Development scripts for common tasks
- [ ] Database migrations/seeds configured
- [ ] Environment can be set up in <30 minutes
- [ ] README includes setup instructions
- [ ] Works on Windows, Mac, and Linux

## Implementation Guide

### Step 1: Create EditorConfig

Create `.editorconfig` in project root:

```ini
# EditorConfig is awesome: https://EditorConfig.org

# Top-most EditorConfig file
root = true

# Default settings for all files
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

# JavaScript/TypeScript files
[*.{js,jsx,ts,tsx,mjs,cjs}]
indent_size = 2
quote_type = single

# Python files
[*.py]
indent_size = 4

# Go files
[*.go]
indent_style = tab
indent_size = 4

# YAML files
[*.{yml,yaml}]
indent_size = 2

# Markdown files
[*.md]
trim_trailing_whitespace = false
indent_size = 2

# Makefile
[Makefile]
indent_style = tab

# JSON files
[*.json]
indent_size = 2

# Shell scripts
[*.sh]
indent_size = 2

# Dockerfile
[Dockerfile*]
indent_size = 2

# HTML/CSS
[*.{html,css,scss,sass}]
indent_size = 2

# XML files
[*.{xml,svg}]
indent_size = 2
```

### Step 2: Set Up Docker Development Environment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Application service
  app:
    build: 
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - node_modules:/app/node_modules  # For Node.js
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@postgres:5432/devdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    command: npm run dev

  # PostgreSQL database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: devdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/db:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  # Redis cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Admin tools (optional)
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
  node_modules:
```

Create `Dockerfile.dev`:

```dockerfile
# Development Dockerfile
FROM node:18-alpine

# Install development tools
RUN apk add --no-cache git bash curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Development command
CMD ["npm", "run", "dev"]
```

### Step 3: Configure VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/__pycache__": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true
}
```

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    // General
    "editorconfig.editorconfig",
    "ms-vscode-remote.remote-containers",
    "ms-azuretools.vscode-docker",
    
    // JavaScript/TypeScript
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "dsznajder.es7-react-js-snippets",
    
    // Python
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-python.black-formatter",
    
    // Git
    "eamodio.gitlens",
    "mhutchie.git-graph",
    
    // Database
    "mtxr.sqltools",
    "mtxr.sqltools-driver-pg",
    
    // Testing
    "orta.vscode-jest",
    "hbenl.vscode-test-explorer",
    
    // Documentation
    "yzhang.markdown-all-in-one",
    "bierner.markdown-mermaid",
    
    // AI Assistance
    "github.copilot",
    "continue.continue"
  ]
}
```

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Application",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.js",
      "envFile": "${workspaceFolder}/.env",
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--watchAll=false"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Step 4: Create Development Scripts

Create `scripts/dev/setup.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Setting up development environment..."

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required but not installed. Aborting." >&2; exit 1; }

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your local values"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 5

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Seed database (optional)
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Development environment ready!"
echo "Run 'npm run dev' to start the application"
```

Create `scripts/dev/reset.sh`:

```bash
#!/bin/bash
set -e

echo "🔄 Resetting development environment..."

# Stop services
docker-compose down -v

# Clean dependencies
rm -rf node_modules
rm -f package-lock.json

# Clean build artifacts
rm -rf dist/ build/ coverage/

# Reinstall
npm install

# Restart services
docker-compose up -d

echo "✅ Environment reset complete"
```

Create `Makefile` for common tasks:

```makefile
.PHONY: help setup dev test clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Set up development environment
	@./scripts/dev/setup.sh

dev: ## Start development server
	@docker-compose up

test: ## Run tests
	@npm test

clean: ## Clean up environment
	@./scripts/dev/reset.sh

db-migrate: ## Run database migrations
	@npm run db:migrate

db-seed: ## Seed database
	@npm run db:seed

lint: ## Run linters
	@npm run lint

format: ## Format code
	@npm run format

build: ## Build for production
	@npm run build

docker-build: ## Build Docker images
	@docker-compose build

docker-up: ## Start Docker services
	@docker-compose up -d

docker-down: ## Stop Docker services
	@docker-compose down

docker-logs: ## View Docker logs
	@docker-compose logs -f

shell: ## Open shell in app container
	@docker-compose exec app sh
```

### Step 5: Configure Dev Containers (VS Code)

Create `.devcontainer/devcontainer.json`:

```json
{
  "name": "Project Dev Container",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/app",
  
  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash"
      },
      "extensions": [
        "editorconfig.editorconfig",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "eamodio.gitlens"
      ]
    }
  },
  
  "forwardPorts": [3000, 5432, 6379],
  
  "postCreateCommand": "npm install",
  
  "remoteUser": "node"
}
```

### Step 6: Create Development Documentation

Create `docs/development-setup.md`:

```markdown
# Development Environment Setup

## Prerequisites

- Docker Desktop (v20+)
- Node.js (v18+)
- VS Code (recommended)
- Git

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. Run setup script:
   ```bash
   make setup
   # or
   ./scripts/dev/setup.sh
   ```

3. Start development:
   ```bash
   make dev
   # or
   npm run dev
   ```

## Manual Setup

If automated setup fails:

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start services:
   ```bash
   docker-compose up -d
   ```

4. Run migrations:
   ```bash
   npm run db:migrate
   ```

## VS Code Setup

1. Install recommended extensions:
   - Open VS Code
   - Go to Extensions (Cmd/Ctrl+Shift+X)
   - Search "@recommended"
   - Install all workspace recommendations

2. Use Dev Container (optional):
   - Install "Remote - Containers" extension
   - Cmd/Ctrl+Shift+P → "Reopen in Container"

## Common Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start development server |
| `make test` | Run tests |
| `make lint` | Run linters |
| `make format` | Format code |
| `make clean` | Reset environment |
| `make shell` | Open container shell |

## Troubleshooting

### Port already in use
```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Docker issues
```bash
# Reset Docker
docker-compose down -v
docker system prune -a
```

### Database connection issues
```bash
# Check if database is running
docker-compose ps
# View logs
docker-compose logs postgres
```
```

## Verification Steps

```bash
# Verify EditorConfig
cat .editorconfig

# Check Docker services
docker-compose ps

# Test database connection
docker-compose exec postgres psql -U user -d devdb -c "SELECT 1"

# Verify VS Code settings
ls -la .vscode/

# Test development scripts
chmod +x scripts/dev/*.sh
./scripts/dev/setup.sh

# Run application
npm run dev

# Access application
curl http://localhost:3000
```

## AI Agent Instructions

When completing this task:

1. Adapt configurations to project's tech stack
2. Ensure cross-platform compatibility
3. Test setup on fresh environment
4. Document any customizations
5. Verify all services start correctly
6. Update README with setup instructions

## Definition of Done

- [ ] EditorConfig file created and working
- [ ] Docker Compose configuration complete
- [ ] VS Code settings and extensions configured
- [ ] Development scripts created and tested
- [ ] Dev Container configuration (if applicable)
- [ ] Documentation complete and accurate
- [ ] Setup tested on clean environment
- [ ] Works on all major OS platforms
- [ ] Team reviewed and approved

## Related Issues

- Previous: [SETUP-001](../SETUP-001/README.md) - Initialize Repository
- Next: [SETUP-003](../SETUP-003/README.md) - Configure Testing Framework
- Related: [SETUP-007](../SETUP-007/README.md) - Configure CI/CD Pipeline

## Resources

- [EditorConfig](https://editorconfig.org/)
- [Docker Documentation](https://docs.docker.com/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/remote/containers)
- [Docker Compose](https://docs.docker.com/compose/)
- [12 Factor App - Dev/Prod Parity](https://12factor.net/dev-prod-parity)
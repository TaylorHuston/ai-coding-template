# SETUP-002: Development Environment Implementation

## Quick Start

1. Run setup script:
   ```bash
   make setup
   # or
   ./scripts/dev/setup.sh
   ```

2. Start development:
   ```bash
   make dev
   # or
   npm run dev
   ```

## Implementation

### EditorConfig Setup

Create `.editorconfig` in project root:

```ini
# EditorConfig is awesome: https://EditorConfig.org
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

### Docker Configuration

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
      - node_modules:/app/node_modules
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

volumes:
  postgres_data:
  redis_data:
  node_modules:
```

Create `Dockerfile.dev`:

```dockerfile
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

### VS Code Configuration

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
    "editorconfig.editorconfig",
    "ms-vscode-remote.remote-containers",
    "ms-azuretools.vscode-docker",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "dsznajder.es7-react-js-snippets",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-python.black-formatter",
    "eamodio.gitlens",
    "mhutchie.git-graph",
    "mtxr.sqltools",
    "mtxr.sqltools-driver-pg",
    "orta.vscode-jest",
    "hbenl.vscode-test-explorer",
    "yzhang.markdown-all-in-one",
    "bierner.markdown-mermaid",
    "github.copilot",
    "continue.continue"
  ]
}
```

### Development Scripts

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

Create `Makefile`:

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

docker-up: ## Start Docker services
	@docker-compose up -d

docker-down: ## Stop Docker services
	@docker-compose down

shell: ## Open shell in app container
	@docker-compose exec app sh
```

## Testing

### Verify Setup

```bash
# Check EditorConfig
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

### Platform Testing

Test on:
- Windows (WSL2)
- macOS (Intel/Apple Silicon)
- Linux (Ubuntu/Debian)

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Docker Issues

```bash
# Reset Docker
docker-compose down -v
docker system prune -a
```

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps
# View logs
docker-compose logs postgres
```

### Permission Issues

```bash
# Fix script permissions
chmod +x scripts/dev/*.sh
# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
```
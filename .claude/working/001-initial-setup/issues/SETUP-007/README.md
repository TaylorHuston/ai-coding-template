# SETUP-007: CI/CD Pipeline Implementation

## Quick Start

1. Configure CI/CD platform:
   ```bash
   # GitHub Actions (already configured)
   git push origin feature-branch
   ```

2. Monitor pipelines:
   ```bash
   # View workflow runs
   gh run list
   ```

## Implementation

### GitHub Actions Workflow

Create `.github/workflows/ci.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
        
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linting
      run: npm run lint
      
    - name: Run tests
      run: npm run test:ci
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      
  build:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-files
        path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build-files
        path: dist/
        
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment"
        # Add deployment commands here
```

### Docker Build Pipeline

Create `.github/workflows/docker.yml`:
```yaml
name: Docker Build

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ghcr.io/${{ github.repository }}:latest
```

### Deployment Scripts

Create `scripts/deploy.sh`:
```bash
#!/bin/bash
set -e

ENVIRONMENT=${1:-staging}
echo "Deploying to $ENVIRONMENT environment..."

# Build application
npm run build

# Run tests
npm run test:ci

# Deploy based on environment
case $ENVIRONMENT in
  staging)
    echo "Deploying to staging..."
    # Add staging deployment commands
    ;;
  production)
    echo "Deploying to production..."
    # Add production deployment commands
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

echo "Deployment to $ENVIRONMENT completed successfully!"
```

### Package Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "ci:setup": "npm ci",
    "ci:test": "npm run test:ci && npm run lint",
    "ci:build": "npm run build",
    "ci:deploy": "npm run deploy:staging"
  }
}
```

## Testing

### Verify Pipeline

```bash
# Test locally before pushing
npm run ci:test

# Check workflow syntax
gh workflow view ci.yml

# Trigger workflow manually
gh workflow run ci.yml

# Monitor workflow runs
gh run list --workflow=ci.yml
```

## Troubleshooting

### Pipeline Failures

```bash
# Check workflow status
gh run list --json status,conclusion,name

# Download logs
gh run download <run-id>

# Rerun failed jobs
gh run rerun <run-id>
```

### Build Issues

```bash
# Test build locally
npm run build

# Check environment variables
env | grep NODE
```
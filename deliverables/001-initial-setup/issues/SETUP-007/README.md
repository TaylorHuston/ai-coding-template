# SETUP-007: Configure CI/CD Pipeline

**Status**: 📋 Not Started  
**Type**: Setup Task  
**Priority**: P0 - Critical  
**Estimated Time**: 3-4 hours  
**Assignee**: Unassigned

## Overview

Set up comprehensive CI/CD pipelines for automated testing, building, security scanning, and deployment across multiple environments. This ensures code quality gates are enforced and deployments are consistent and reliable.

## Objectives

- ✅ Configure GitHub Actions/GitLab CI pipelines
- ✅ Set up automated testing in CI
- ✅ Implement build and artifact generation
- ✅ Configure deployment pipelines
- ✅ Set up environment promotion strategy
- ✅ Implement rollback mechanisms

## Acceptance Criteria

- [ ] CI pipeline runs on all PRs
- [ ] All tests pass in CI
- [ ] Security scans integrated
- [ ] Build artifacts generated
- [ ] Deployment to staging automated
- [ ] Production deployment with approval
- [ ] Rollback process documented
- [ ] Pipeline performance optimized (<10 min)

## Implementation Guide

### Step 1: Create CI Pipeline

Create `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  CACHE_KEY: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

jobs:
  # Job 1: Linting and Format Check
  lint:
    name: Lint & Format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --prefer-offline --no-audit
      
      - name: Run linters
        run: |
          npm run lint
          npm run format:check
      
      - name: Type check
        run: npm run type-check

  # Job 2: Security Scanning
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}

  # Job 3: Testing
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-type: [unit, integration, e2e]
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ${{ matrix.test-type }} tests
        run: npm run test:${{ matrix.test-type }}
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
      
      - name: Upload coverage
        if: matrix.test-type == 'unit'
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  # Job 4: Build
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint, security, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --production
      
      - name: Build application
        run: npm run build
      
      - name: Generate SBOM
        run: npm run sbom
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            dist/
            sbom-*.json
          retention-days: 7

  # Job 5: Docker Build
  docker:
    name: Docker Build & Push
    runs-on: ubuntu-latest
    needs: [build]
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: myapp/app
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Step 2: Create CD Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Pipeline

on:
  workflow_run:
    workflows: ["CI Pipeline"]
    types: [completed]
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    if: github.event.workflow_run.conclusion == 'success' || github.event_name == 'workflow_dispatch'
    environment:
      name: staging
      url: https://staging.example.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
      
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging..."
          # Add actual deployment commands here
          # Examples:
          # - AWS: aws s3 sync dist/ s3://staging-bucket/
          # - Kubernetes: kubectl apply -f k8s/staging/
          # - Heroku: git push heroku main
      
      - name: Run smoke tests
        run: |
          npm run test:smoke -- --url=https://staging.example.com
      
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
      
      - name: Create backup
        run: |
          echo "Creating production backup..."
          # Add backup commands
      
      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # Add production deployment commands
      
      - name: Verify deployment
        run: |
          npm run test:smoke -- --url=https://example.com
      
      - name: Create release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          body: |
            Changes in this Release
            - Automated deployment from ${{ github.sha }}
          draft: false
          prerelease: false
```

### Step 3: Create Performance Pipeline

Create `.github/workflows/performance.yml`:

```yaml
name: Performance Tests

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  lighthouse:
    name: Lighthouse Performance Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://staging.example.com
            https://staging.example.com/dashboard
          uploadArtifacts: true
          temporaryPublicStorage: true
      
      - name: Format results
        run: |
          echo "### Lighthouse Results" >> $GITHUB_STEP_SUMMARY
          echo "Performance: ${{ steps.lighthouse.outputs.performance }}" >> $GITHUB_STEP_SUMMARY
          echo "Accessibility: ${{ steps.lighthouse.outputs.accessibility }}" >> $GITHUB_STEP_SUMMARY
          echo "Best Practices: ${{ steps.lighthouse.outputs.best-practices }}" >> $GITHUB_STEP_SUMMARY
          echo "SEO: ${{ steps.lighthouse.outputs.seo }}" >> $GITHUB_STEP_SUMMARY

  load-test:
    name: Load Testing
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run K6 Load Test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/load/script.js
          flags: --out json=results.json
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: results.json
```

### Step 4: Configure Branch Protection

Create `.github/settings.yml`:

```yaml
repository:
  name: my-app
  description: My application
  private: false
  has_issues: true
  has_projects: true
  has_wiki: false
  default_branch: main

branches:
  - name: main
    protection:
      required_status_checks:
        strict: true
        contexts:
          - "Lint & Format"
          - "Security Scan"
          - "Test Suite (unit)"
          - "Test Suite (integration)"
          - "Build Application"
      enforce_admins: false
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
      restrictions:
        users: []
        teams: []
      allow_force_pushes: false
      allow_deletions: false
```

### Step 5: Create Rollback Script

Create `scripts/rollback.sh`:

```bash
#!/bin/bash
set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-previous}

echo "🔄 Rolling back $ENVIRONMENT to version $VERSION"

case $ENVIRONMENT in
  staging)
    # Kubernetes rollback
    kubectl rollout undo deployment/app -n staging
    
    # Or Docker rollback
    # docker service update --rollback app-staging
    
    # Or cloud provider rollback
    # aws deploy stop-deployment --deployment-id $DEPLOYMENT_ID --auto-rollback
    ;;
    
  production)
    read -p "⚠️  Confirm production rollback (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
      echo "Rollback cancelled"
      exit 1
    fi
    
    # Production rollback
    kubectl rollout undo deployment/app -n production
    ;;
    
  *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

echo "✅ Rollback complete"

# Verify rollback
./scripts/health-check.sh $ENVIRONMENT
```

### Step 6: Add Pipeline Scripts

Update `package.json`:

```json
{
  "scripts": {
    "ci": "npm run lint && npm run test && npm run build",
    "ci:local": "act -P ubuntu-latest=nektos/act-environments-ubuntu:18.04",
    "deploy:staging": "./scripts/deploy.sh staging",
    "deploy:production": "./scripts/deploy.sh production",
    "rollback": "./scripts/rollback.sh",
    "pipeline:validate": "actionlint .github/workflows/*.yml"
  }
}
```

## Verification Steps

```bash
# Validate workflow syntax
npm run pipeline:validate

# Test locally with act
npm run ci:local

# Push to branch and verify
git checkout -b test-ci
git push origin test-ci
# Check GitHub Actions tab

# Verify all checks pass
# Create PR and verify checks
```

## Definition of Done

- [ ] CI pipeline configured and running
- [ ] All tests passing in CI
- [ ] Security scans integrated
- [ ] Build artifacts generated
- [ ] CD pipeline configured
- [ ] Staging deployment automated
- [ ] Production deployment with approval
- [ ] Rollback process tested
- [ ] Documentation complete
- [ ] Team trained on pipeline

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI Documentation](https://docs.gitlab.com/ee/ci/)
- [CI/CD Best Practices](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment)
- [Docker Build Actions](https://github.com/docker/build-push-action)
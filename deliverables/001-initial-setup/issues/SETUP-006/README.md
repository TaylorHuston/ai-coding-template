# SETUP-006: Establish Security & Dependency Management

**Status**: 📋 Not Started  
**Type**: Setup Task  
**Priority**: P0 - Critical  
**Estimated Time**: 2-3 hours  
**Assignee**: Unassigned

## Overview

Implement comprehensive security scanning and dependency management including SBOM (Software Bill of Materials) generation, vulnerability scanning, and supply chain security measures following 2025 best practices.

## Objectives

- ✅ Generate and maintain SBOM
- ✅ Set up dependency vulnerability scanning  
- ✅ Configure security linting (SAST)
- ✅ Implement secrets scanning
- ✅ Set up dependency update automation
- ✅ Establish security policies

## Acceptance Criteria

- [ ] SBOM generated in standard format (SPDX/CycloneDX)
- [ ] Vulnerability scanning integrated in CI/CD
- [ ] No high/critical vulnerabilities in dependencies
- [ ] Secrets scanning preventing commits
- [ ] Dependency updates automated
- [ ] Security policy documented
- [ ] License compliance verified
- [ ] Supply chain attestations configured

## Implementation Guide

### Step 1: Install Security Tools

```bash
# SBOM and vulnerability scanning
npm install --save-dev \
  @cyclonedx/cyclonedx-npm \
  audit-ci \
  better-npm-audit \
  snyk

# Security linting
npm install --save-dev \
  eslint-plugin-security \
  eslint-plugin-no-secrets

# Additional tools (global)
npm install -g \
  npm-check-updates \
  license-checker \
  dependency-cruiser
```

### Step 2: Configure SBOM Generation

Create `scripts/generate-sbom.js`:

```javascript
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

// Generate SBOM in CycloneDX format
const generateCycloneDX = () => {
  console.log('Generating CycloneDX SBOM...');
  execSync('npx @cyclonedx/cyclonedx-npm --output-format json --output-file sbom-cyclonedx.json');
  execSync('npx @cyclonedx/cyclonedx-npm --output-format xml --output-file sbom-cyclonedx.xml');
};

// Generate SBOM in SPDX format
const generateSPDX = () => {
  console.log('Generating SPDX SBOM...');
  // Using syft for SPDX generation
  try {
    execSync('syft packages . -o spdx-json > sbom-spdx.json');
  } catch (e) {
    console.log('Syft not installed, skipping SPDX generation');
  }
};

// Add metadata
const enrichSBOM = () => {
  const sbom = JSON.parse(fs.readFileSync('sbom-cyclonedx.json', 'utf8'));
  
  sbom.metadata = {
    ...sbom.metadata,
    timestamp: new Date().toISOString(),
    component: {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      description: process.env.npm_package_description,
    },
    properties: [
      { name: 'build_number', value: process.env.BUILD_NUMBER || 'local' },
      { name: 'git_commit', value: execSync('git rev-parse HEAD').toString().trim() },
    ],
  };
  
  fs.writeFileSync('sbom-cyclonedx.json', JSON.stringify(sbom, null, 2));
};

// Main execution
generateCycloneDX();
generateSPDX();
enrichSBOM();

console.log('✅ SBOM generation complete');
```

### Step 3: Set Up Vulnerability Scanning

Create `.snyk`:

```yaml
version: v1.0.0
language-settings:
  javascript:
    enableLinters: true
patch:
  # Patches for known vulnerabilities
ignore:
  # Ignore specific vulnerabilities with justification
  SNYK-JS-EXAMPLE-123456:
    - '*':
        reason: False positive, not applicable
        expires: '2025-12-31T23:59:59.999Z'
```

Create `audit-ci.json`:

```json
{
  "low": true,
  "moderate": true,
  "high": true,
  "critical": true,
  "allowlist": [],
  "report-type": "full",
  "show-not-found": true,
  "show-found": true,
  "registry": "https://registry.npmjs.org",
  "output-format": "json",
  "pass-enoaudit": true
}
```

### Step 4: Configure Security Linting

Update `.eslintrc.js`:

```javascript
module.exports = {
  // ... existing config
  plugins: [
    // ... existing plugins
    'security',
    'no-secrets'
  ],
  extends: [
    // ... existing extends
    'plugin:security/recommended'
  ],
  rules: {
    // Security rules
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-require': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-pseudoRandomBytes': 'error',
    'no-secrets/no-secrets': 'error',
  }
};
```

### Step 5: Implement Secrets Scanning

Create `.gitleaks.toml`:

```toml
title = "Gitleaks Configuration"

[[rules]]
description = "AWS Access Key"
regex = '''AKIA[0-9A-Z]{16}'''
tags = ["aws", "credentials"]

[[rules]]
description = "AWS Secret Key"
regex = '''(?i)aws_secret_access_key\s*=\s*['\"]?[A-Za-z0-9/+=]{40}['\"]?'''
tags = ["aws", "credentials"]

[[rules]]
description = "GitHub Token"
regex = '''ghp_[0-9a-zA-Z]{36}'''
tags = ["github", "token"]

[[rules]]
description = "Private Key"
regex = '''-----BEGIN (RSA|DSA|EC|PGP) PRIVATE KEY-----'''
tags = ["key", "private"]

[[rules]]
description = "Generic API Key"
regex = '''(?i)(api_key|apikey|api-key)\s*[:=]\s*['\"]?[A-Za-z0-9]{32,}['\"]?'''
tags = ["api", "key"]

[allowlist]
description = "Allowlisted files"
files = [
  ".env.example",
  "README.md",
  "docs/*"
]
```

Install and configure pre-commit hook:

```bash
# Install gitleaks
brew install gitleaks  # macOS
# or
docker pull zricethezav/gitleaks

# Add to pre-commit
echo '#!/bin/sh
gitleaks detect --source . --verbose' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Step 6: Configure Dependency Updates

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # JavaScript dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "04:00"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
    labels:
      - "dependencies"
      - "security"
    commit-message:
      prefix: "deps"
      prefix-development: "deps-dev"
    ignore:
      # Major version updates for critical packages
      - dependency-name: "express"
        update-types: ["version-update:semver-major"]

  # Docker dependencies
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
    
  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

Create `renovate.json` (alternative to Dependabot):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base",
    ":dependencyDashboard",
    ":pinVersions",
    "group:allNonMajor"
  ],
  "schedule": ["after 9pm on sunday"],
  "packageRules": [
    {
      "matchDepTypes": ["devDependencies"],
      "automerge": true,
      "automergeType": "pr"
    },
    {
      "matchPackagePatterns": ["*"],
      "matchUpdateTypes": ["patch"],
      "automerge": true
    },
    {
      "matchPackageNames": ["node"],
      "enabled": false
    }
  ],
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security"]
  }
}
```

### Step 7: Create Security Policy

Create `SECURITY.md`:

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report security vulnerabilities to security@example.com

**Do not** create public issues for security vulnerabilities.

### What to Include

- Type of vulnerability
- Full paths of affected files
- Proof-of-concept or exploit code
- Impact of the issue

### Response Timeline

- Initial response: 24 hours
- Status update: 72 hours
- Resolution: Based on severity

## Security Measures

### Dependency Management
- Automated vulnerability scanning via Snyk
- Weekly dependency updates via Dependabot
- SBOM generated for each release

### Code Security
- SAST scanning on all commits
- Secret scanning preventing credential leaks
- Security linting in development

### Supply Chain Security
- All dependencies verified
- SBOM included in releases
- Signed commits required

## Security Checklist

Before each release:
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update dependencies
- [ ] Generate new SBOM
- [ ] Run security scans
- [ ] Review security advisories
```

### Step 8: Add Security Scripts

Update `package.json`:

```json
{
  "scripts": {
    "security": "npm audit && snyk test",
    "security:fix": "npm audit fix && snyk wizard",
    "sbom": "node scripts/generate-sbom.js",
    "deps:check": "ncu",
    "deps:update": "ncu -u && npm install",
    "license:check": "license-checker --summary",
    "secrets:scan": "gitleaks detect --source .",
    "security:all": "npm run security && npm run secrets:scan && npm run license:check"
  }
}
```

## Verification Steps

```bash
# Generate SBOM
npm run sbom
ls -la sbom-*.json

# Run security scans
npm run security

# Check for secrets
npm run secrets:scan

# Check licenses
npm run license:check

# Check for updates
npm run deps:check

# Full security check
npm run security:all
```

## Definition of Done

- [ ] SBOM generation automated
- [ ] Vulnerability scanning integrated
- [ ] Security linting configured
- [ ] Secrets scanning active
- [ ] Dependency updates automated
- [ ] Security policy documented
- [ ] No high/critical vulnerabilities
- [ ] All licenses compatible
- [ ] Team trained on security tools

## Resources

- [SBOM Standards](https://www.cisa.gov/sbom)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Snyk Documentation](https://docs.snyk.io/)
- [Supply Chain Security](https://slsa.dev/)
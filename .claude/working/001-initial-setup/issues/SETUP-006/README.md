# SETUP-006: Security Scanning & SBOM Implementation

## Quick Start

1. Install security tools:
   ```bash
   npm run security:setup
   ```

2. Run security scan:
   ```bash
   npm run security:scan
   ```

## Implementation

### SBOM Generation

Install Syft:
```bash
# macOS
brew install syft

# Linux
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin

# Generate SBOM
syft packages dir:. -o spdx-json=sbom.spdx.json
syft packages dir:. -o cyclonedx-json=sbom.cyclonedx.json
```

Create `scripts/generate-sbom.sh`:
```bash
#!/bin/bash
set -e

echo "Generating Software Bill of Materials (SBOM)..."

# Create SBOM directory
mkdir -p security/sbom

# Generate SPDX format
syft packages dir:. -o spdx-json=security/sbom/sbom.spdx.json

# Generate CycloneDX format
syft packages dir:. -o cyclonedx-json=security/sbom/sbom.cyclonedx.json

# Generate human-readable format
syft packages dir:. -o table=security/sbom/sbom.txt

echo "SBOM generated successfully in security/sbom/"
```

### Vulnerability Scanning

Install Grype:
```bash
# macOS
brew install grype

# Linux
curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin
```

Create `scripts/security-scan.sh`:
```bash
#!/bin/bash
set -e

echo "Running security vulnerability scan..."

# Scan current directory
grype dir:. -o json --file security/vulnerability-report.json

# Scan with different severity levels
grype dir:. --fail-on medium

# Generate human-readable report
grype dir:. -o table --file security/vulnerability-report.txt

echo "Vulnerability scan completed. Check security/ directory for reports."
```

### Secrets Scanning

Install GitLeaks:
```bash
# macOS
brew install gitleaks

# Linux
curl -sSfL https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks_linux_x64.tar.gz | tar -xz -C /usr/local/bin
```

Create `.gitleaks.toml`:
```toml
[extend]
useDefault = true

[[rules]]
id = "custom-api-key"
description = "Custom API key pattern"
regex = '''(?i)api[_-]?key[s]?['"=:\s]{1,6}[0-9a-zA-Z]{16,}'''
keywords = ["api_key", "apikey", "api-key"]

[allowlist]
description = "Allowlist for test files"
files = [
  '''.*test.*''',
  '''.*example.*'''
]
```

### Dependency Scanning

Configure npm audit:
```json
{
  "scripts": {
    "security:audit": "npm audit --audit-level moderate",
    "security:fix": "npm audit fix",
    "security:check": "npm audit --production --audit-level high"
  }
}
```

Install additional security tools:
```bash
npm install --save-dev eslint-plugin-security retire
```

Add to `.eslintrc.js`:
```javascript
module.exports = {
  plugins: ['security'],
  extends: ['plugin:security/recommended'],
  rules: {
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error'
  }
};
```

### Pre-commit Security Hooks

Update `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run linting
npx lint-staged

# Run secrets scanning
gitleaks detect --verbose --no-git

# Run dependency audit
npm audit --audit-level high --production
```

### GitHub Actions Security Workflow

Create `.github/workflows/security.yml`:
```yaml
name: Security Scanning

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run npm audit
      run: npm audit --audit-level high --production
      
    - name: Install Syft
      run: |
        curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin
        
    - name: Generate SBOM
      run: |
        mkdir -p security/sbom
        syft packages dir:. -o spdx-json=security/sbom/sbom.spdx.json
        syft packages dir:. -o cyclonedx-json=security/sbom/sbom.cyclonedx.json
        
    - name: Install Grype
      run: |
        curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin
        
    - name: Run vulnerability scan
      run: |
        mkdir -p security
        grype dir:. --fail-on medium -o json --file security/vulnerability-report.json
        
    - name: Run GitLeaks
      uses: gitleaks/gitleaks-action@v2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Upload security reports
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: security-reports
        path: security/
```

### License Compliance

Install license checker:
```bash
npm install --save-dev license-checker
```

Create `scripts/check-licenses.sh`:
```bash
#!/bin/bash
set -e

echo "Checking license compliance..."

# Generate license report
npx license-checker --json --out security/licenses.json

# Check for forbidden licenses
npx license-checker --failOn "GPL-3.0;AGPL-3.0;LGPL-3.0" --excludePrivatePackages

echo "License compliance check completed."
```

## Testing

### Verify Setup

```bash
# Generate SBOM
./scripts/generate-sbom.sh

# Run vulnerability scan
./scripts/security-scan.sh

# Run secrets scan
gitleaks detect --verbose

# Check dependencies
npm audit

# Check licenses
./scripts/check-licenses.sh

# Run security linting
npm run lint
```

### Security Policy

Create `SECURITY.md`:
```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report security vulnerabilities to security@company.com

## Security Measures

- Automated dependency scanning
- SBOM generation and tracking  
- Secrets scanning in commits
- Regular security audits
- License compliance checking
```

## Troubleshooting

### SBOM Generation Issues

```bash
# Check Syft installation
syft version

# Debug SBOM generation
syft packages dir:. -v

# Validate SBOM format
syft packages dir:. -o spdx-json | jq .
```

### Vulnerability Scan Issues

```bash
# Update vulnerability database
grype db update

# Check specific package
grype package:npm:express@4.17.1

# Ignore specific vulnerabilities (use with caution)
grype dir:. --config .grype.yaml
```

### Secrets Scanning Issues

```bash
# Test GitLeaks rules
gitleaks detect --verbose --log-level debug

# Check specific file
gitleaks detect --source . --verbose --log-level debug
```
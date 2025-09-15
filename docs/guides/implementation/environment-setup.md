---
title: "Local Environment Setup Guide"
version: "0.1.0"
created: "2025-09-10"
last_updated: "2025-09-10"
status: "Active"
target_audience: ["Developers", "New Team Members"]
tags: ["environment-setup", "development-tools", "local-development", "ai-integration"]
category: "Implementation Guides"
description: "Platform-agnostic guide for setting up a local development environment for AI-assisted development."
---

# Local Environment Setup Guide

Platform-agnostic guide for setting up a local development environment for AI-assisted development.

## Overview

This guide provides general patterns for setting up a productive local development environment that works well with AI coding assistants and modern development workflows.

## Core Development Tools

### Version Control
**Git Configuration**:
```bash
# Configure user identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Useful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# Set default branch name
git config --global init.defaultBranch main
```

**Recommended Git Settings**:
```bash
# Better diff algorithm
git config --global diff.algorithm histogram

# Auto-correct typos (2 second delay)
git config --global help.autocorrect 20

# Push only current branch by default
git config --global push.default current
```

### Editor/IDE Setup

**Essential Features to Configure**:
- Syntax highlighting for your project languages
- Code formatting and linting integration
- Git integration for inline diffs and blame
- Integrated terminal access
- Project file search and navigation
- Extension/plugin ecosystem for language support

**Recommended Editor Extensions** (language-agnostic):
- Language server protocol (LSP) support
- Code formatting (Prettier, language-specific formatters)
- Linting integration
- Git integration extensions
- Project structure navigation
- AI coding assistant integration

### Development Environment

**Node.js Projects**:
```bash
# Install Node Version Manager (platform-specific)
# nvm (Unix/macOS) or nvm-windows (Windows)

# Use project-specific Node version
nvm install --lts
nvm use --lts

# Global utilities
npm install -g npm@latest
```

**Python Projects**:
```bash
# Virtual environment setup
python -m venv venv
source venv/bin/activate  # Unix/macOS
# venv\Scripts\activate   # Windows

# Upgrade pip
pip install --upgrade pip
```

**General Package Management**:
- Use project-specific dependency management
- Pin dependency versions for reproducible builds
- Separate development and production dependencies
- Document required system dependencies

## Project-Specific Setup

### Environment Variables
**Development Environment File** (`.env.local` or similar):
```bash
# Application settings
NODE_ENV=development
DEBUG=true

# Database (if applicable)
DATABASE_URL=your_local_database_url

# External services (use development/test endpoints)
API_BASE_URL=https://api-dev.example.com
```

**Environment Variable Best Practices**:
- Never commit secrets to version control
- Use `.env.example` to document required variables
- Validate required environment variables on startup
- Use different files for different environments

### Dependencies and Package Installation

**Initial Setup Checklist**:
1. Clone repository
2. Install language runtime (Node.js, Python, etc.)
3. Install project dependencies
4. Copy and configure environment variables
5. Set up database (if applicable)
6. Run initial build/compilation
7. Execute test suite to verify setup

**Common Setup Commands**:
```bash
# Node.js
npm install
npm run build
npm test

# Python
pip install -r requirements.txt
pip install -r requirements-dev.txt
python -m pytest

# General pattern
./setup.sh  # If project provides setup script
```

## Development Workflow Tools

### Build and Task Automation

**Build Tool Configuration**:
- Configure watch mode for development
- Set up hot reload for web applications
- Optimize build times with caching
- Configure source maps for debugging

**Common Build Patterns**:
```bash
# Development build with watch mode
npm run dev
npm run watch

# Production build
npm run build
npm run build:prod

# Testing
npm test
npm run test:watch
npm run test:coverage
```

### Code Quality Tools

**Linting Setup**:
```bash
# ESLint for JavaScript/TypeScript
npm install --save-dev eslint

# Pylint/Flake8 for Python
pip install pylint flake8

# Language-specific linters
```

**Code Formatting**:
```bash
# Prettier for JavaScript/TypeScript/CSS/HTML
npm install --save-dev prettier

# Black for Python
pip install black

# Language-specific formatters
```

**Pre-commit Hooks** (using any pre-commit tool):
```yaml
# Example pre-commit configuration
repos:
  - repo: local
    hooks:
      - id: lint
        name: Run linting
        entry: npm run lint
        language: system
      - id: test
        name: Run tests
        entry: npm test
        language: system
```

### Database Setup (if applicable)

**Local Database Options**:
- Docker containers for consistent database versions
- Local database installation
- Cloud development databases
- In-memory databases for testing

**Database Setup Patterns**:
```bash
# Docker approach
docker run -d --name project-db \
  -e POSTGRES_DB=project_dev \
  -e POSTGRES_USER=dev \
  -e POSTGRES_PASSWORD=dev \
  -p 5432:5432 postgres:13

# Migration/schema setup
npm run db:migrate
npm run db:seed  # If applicable
```

## AI Coding Assistant Integration

### Code Assistant Setup

**Environment Optimization for AI**:
- Clear, consistent code organization
- Comprehensive README and documentation
- Well-structured project directories
- Consistent naming conventions

**Context Optimization**:
- Maintain clean git history with descriptive commits
- Use clear variable and function names
- Document complex business logic
- Keep files focused and reasonably sized

### Development Best Practices

**AI-Friendly Coding Patterns**:
- Write self-documenting code
- Use consistent code style across the project
- Implement comprehensive error handling
- Write tests that describe expected behavior

**Documentation Strategies**:
- Maintain up-to-date README files
- Document API interfaces clearly
- Include usage examples in documentation
- Keep technical documentation current

## Platform-Specific Considerations

### macOS Development
- Use Homebrew for package management
- Configure Xcode command line tools
- Consider using iTerm2 for terminal
- Set up proper PATH environment

### Windows Development
- Consider WSL2 for Unix-like environment
- Use Windows Terminal for better CLI experience
- Configure PowerShell or use Git Bash
- Set up proper development drive organization

### Linux Development
- Use distribution package manager for system tools
- Configure shell environment (.bashrc/.zshrc)
- Set up proper file permissions for development
- Consider using development containers

## Troubleshooting Common Issues

### Environment Problems
**Node.js Version Conflicts**:
```bash
# Use node version manager
nvm list
nvm use 18.17.0
```

**Python Environment Issues**:
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Dependency Installation Problems**:
```bash
# Clear package manager cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Python pip cache
pip cache purge
```

### Permission Issues
**File System Permissions** (Unix/macOS):
```bash
# Fix ownership issues
sudo chown -R $USER:$USER /path/to/project

# Fix execute permissions
chmod +x scripts/*.sh
```

**NPM Permission Issues**:
```bash
# Configure npm to use different directory
npm config set prefix ~/.npm-global
# Add to PATH: export PATH=~/.npm-global/bin:$PATH
```

### Build and Runtime Issues
**Port Conflicts**:
```bash
# Find process using port
lsof -i :3000  # Unix/macOS
netstat -ano | findstr :3000  # Windows

# Use different port
PORT=3001 npm start
```

**Memory Issues**:
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 script.js

# Environment variable approach
export NODE_OPTIONS="--max-old-space-size=4096"
```

## Project-Specific Customization

### Adapting This Guide
1. **Identify Required Tools**: List specific tools for your tech stack
2. **Document Setup Steps**: Create project-specific setup instructions
3. **Environment Configuration**: Document required environment variables
4. **Build Process**: Explain project-specific build and run commands
5. **Testing Setup**: Document how to run project tests locally

### Team Standardization
- Document team-agreed tool versions
- Share common configuration files (.editorconfig, etc.)
- Create setup scripts for new team members
- Maintain troubleshooting knowledge base

## Maintenance and Updates

### Keeping Environment Current
- Regularly update development dependencies
- Monitor security advisories for dependencies
- Update language runtimes and tools periodically
- Test setup process with fresh environment regularly

### Documentation Maintenance
- Update setup instructions when tools change
- Document new troubleshooting solutions
- Review and validate setup steps quarterly
- Gather feedback from new team members

---

**Related Documentation**: [Integration Guide](../setup/integration-guide.md) | [Development Commands](../reference/development-commands.md) | [Setup Hub](../setup/README.md)
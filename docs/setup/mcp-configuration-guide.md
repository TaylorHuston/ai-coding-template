---
title: "MCP Configuration Guide"
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-08-21"
status: "active"
target_audience: ["developers", "devops", "ai-assistants"]
tags: ["mcp", "configuration", "claude-code", "external-tools"]
category: "Setup"
description: "Comprehensive guide for configuring and managing Model Context Protocol (MCP) servers in AI-assisted development workflows."
---

# MCP Configuration Guide

Comprehensive guide for configuring and managing Model Context Protocol (MCP) servers in AI-assisted development workflows.

## Overview

Model Context Protocol (MCP) extends Claude Code's capabilities by providing access to specialized tools and services. This guide covers setup, configuration, and best practices for MCP integration.

## What is MCP?

MCP (Model Context Protocol) is a standardized protocol that allows AI assistants to connect to external tools and services. It enables:

- **Extended Capabilities**: Access to specialized tools beyond Claude's built-in functions
- **Real-time Data**: Integration with live services and APIs  
- **Multi-Model Collaboration**: Coordination between different AI models
- **Custom Workflows**: Project-specific automation and tooling

## Core MCP Servers

### Essential Servers (Recommended for All Projects)

#### **context7** - Official Documentation Access
```json
{
  "description": "Access official library and framework documentation",
  "use_cases": [
    "Framework best practices lookup",
    "API reference validation", 
    "Official pattern verification"
  ],
  "tools": [
    "mcp__context7__resolve-library-id",
    "mcp__context7__get-library-docs"
  ],
  "setup": "Available through Claude Code MCP marketplace"
}
```

#### **sequential-thinking** - Complex Analysis Engine  
```json
{
  "description": "Multi-step reasoning and systematic problem-solving",
  "use_cases": [
    "Complex debugging workflows",
    "Architectural decision analysis",
    "System-wide impact assessment"
  ],
  "tools": [
    "mcp__sequential-thinking__sequentialthinking"
  ],
  "setup": "Available through Claude Code MCP marketplace"
}
```

#### **gemini-cli** - Multi-Model Consultation
```json
{
  "description": "Google Gemini integration for second opinions and consensus analysis",
  "use_cases": [
    "Critical decision validation",
    "Large codebase analysis (massive context window)",
    "Multi-model consensus building",
    "Cost-effective AI consultation"
  ],
  "tools": [
    "mcp__gemini-cli__prompt"
  ],
  "benefits": [
    "Free alternative to premium AI models",
    "Massive token context window",
    "Consensus validation for critical decisions"
  ],
  "setup": "Requires Google Cloud authentication (no API key needed)"
}
```

### Specialized Servers

#### **playwright** - Browser Automation
```json
{
  "description": "E2E testing and browser automation",
  "use_cases": [
    "Web application testing",
    "Performance monitoring", 
    "Cross-browser validation",
    "Visual regression testing"
  ],
  "tools": [
    "mcp__playwright__browser_navigate",
    "mcp__playwright__browser_click",
    "mcp__playwright__browser_type",
    "mcp__playwright__browser_wait_for",
    "mcp__playwright__browser_press_key",
    "mcp__playwright__browser_console_messages",
    "mcp__playwright__browser_close",
    "mcp__playwright__browser_install"
  ],
  "best_for": ["Web applications", "UI testing", "Performance monitoring"]
}
```

#### **magic** - UI Component Generation
```json
{
  "description": "Modern UI component generation with design system integration",
  "use_cases": [
    "Component development",
    "Design system implementation",
    "Responsive design patterns",
    "Accessibility compliance"
  ],
  "tools": [
    "mcp__magic__*"
  ],
  "best_for": ["Frontend projects", "UI-heavy applications", "Design systems"]
}
```

## Setup and Configuration

### 1. Initial Setup

#### Create Local Configuration
```bash
# Copy template configuration
cp .claude/settings.template.json .claude/settings.local.json

# Edit for your project
vim .claude/settings.local.json
```

#### Choose Permission Template
```bash
# Basic development (minimal)
cp .claude/mcp-permissions/basic.json .claude/my-permissions.json

# Frontend projects
cp .claude/mcp-permissions/frontend.json .claude/my-permissions.json

# Backend projects  
cp .claude/mcp-permissions/backend.json .claude/my-permissions.json

# Full-stack projects
cp .claude/mcp-permissions/fullstack.json .claude/my-permissions.json
```

### 2. Project-Specific Configuration

#### Frontend Projects (React, Vue, Angular)
```json
{
  "enabledMcpjsonServers": [
    "context7",
    "sequential-thinking",
    "gemini-cli", 
    "magic",
    "playwright",
    "shadcn-ui-server"
  ],
  "permissions": {
    "allow": [
      "mcp__context7__*",
      "mcp__sequential-thinking__*",
      "mcp__gemini-cli__prompt",
      "mcp__magic__*",
      "mcp__playwright__browser_*",
      "mcp__shadcn-ui-server__*"
    ]
  }
}
```

#### Backend Projects (API, Database)
```json
{
  "enabledMcpjsonServers": [
    "context7",
    "sequential-thinking",
    "gemini-cli",
    "supabase",
    "database-server",
    "vercel"
  ],
  "permissions": {
    "allow": [
      "mcp__context7__*",
      "mcp__sequential-thinking__*", 
      "mcp__gemini-cli__prompt",
      "mcp__supabase__*",
      "mcp__database__*",
      "mcp__vercel__*"
    ]
  }
}
```

#### Full-Stack Projects
```json
{
  "enabledMcpjsonServers": [
    "context7",
    "sequential-thinking",
    "gemini-cli",
    "magic", 
    "playwright",
    "supabase",
    "vercel",
    "linear"
  ]
}
```

### 3. Security Configuration

#### Permission Categories

**Development Permissions** (Basic):
```json
{
  "allow": [
    "Bash(npm:*)",
    "Bash(git:*)",
    "Bash(node:*)",
    "mcp__context7__*",
    "mcp__sequential-thinking__*",
    "mcp__gemini-cli__prompt"
  ]
}
```

**Production Permissions** (Restricted):
```json
{
  "allow": [
    "Bash(git status:*)",
    "Bash(git log:*)",
    "mcp__context7__resolve-library-id",
    "mcp__context7__get-library-docs"
  ],
  "deny": [
    "Bash(rm:*)",
    "Bash(sudo:*)",
    "mcp__*__delete*",
    "mcp__*__modify*"
  ]
}
```

## MCP Server Setup Instructions

### Gemini CLI Setup

#### Prerequisites
```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

#### Install Gemini CLI MCP Server
```bash
# Option 1: Through Claude Code marketplace
claude mcp install gemini-cli

# Option 2: Manual installation
npm install -g @gemini/mcp-server
```

#### Configuration
```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "gemini-mcp-server",
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/credentials.json"
      }
    }
  }
}
```

### Context7 Setup

#### Installation
```bash
# Through Claude Code marketplace (recommended)
claude mcp install context7

# Verify installation
claude mcp list
```

#### Usage Examples
```typescript
// Resolve library documentation
const libraryId = await mcp__context7__resolve_library_id("react");
const docs = await mcp__context7__get_library_docs(libraryId, "hooks");
```

### Playwright Setup

#### Installation  
```bash
# Install Playwright MCP server
npm install -g @playwright/mcp-server

# Install browsers
npx playwright install
```

#### Configuration
```json
{
  "mcpServers": {
    "playwright": {
      "command": "playwright-mcp-server",
      "args": ["--headless"]
    }
  }
}
```

## Usage Patterns and Best Practices

### Multi-Model Validation Workflow

#### 1. Primary Analysis (Claude)
```typescript
// Conduct initial analysis using Claude's capabilities
const primaryAnalysis = `Analyze this code for potential issues:
@${codeFile}
Focus on: functionality, performance, maintainability`;
```

#### 2. Secondary Validation (Gemini)
```typescript
// Get second opinion from Gemini
const geminiValidation = `Review this code analysis and provide alternative perspective:
@${codeFile}
@${primaryAnalysis}
Focus on: missed issues, alternative approaches, consensus points`;

// Use mcp__gemini-cli__prompt for validation
```

#### 3. Synthesis and Consensus
```typescript
// Combine insights from both models
const consensusAnalysis = {
  agreementPoints: [...],
  divergentViews: [...],
  finalRecommendations: [...],
  confidenceLevel: "high" // based on consensus
};
```

### Framework Research Workflow  

#### 1. Best Practices Lookup
```typescript
// Research official framework patterns
const frameworkResearch = {
  library: "nextjs",
  topic: "performance-optimization"
};

// Use mcp__context7__resolve-library-id and get-library-docs
```

#### 2. Implementation Validation
```typescript
// Validate implementation against official docs
const implementationValidation = `Compare this implementation with official patterns:
@${implementation}
@${officialDocs}
Assess: compliance, best practices, optimization opportunities`;
```

### Complex Analysis Workflow

#### 1. Systematic Breakdown
```typescript
// Use sequential thinking for complex problems
const systemAnalysis = `Systematically analyze this architectural challenge:
Problem: ${problemDescription}
Constraints: ${constraints}
Requirements: ${requirements}
Break down into: components, dependencies, risks, solutions`;

// Use mcp__sequential-thinking__sequentialthinking
```

#### 2. Validation and Refinement
```typescript
// Validate analysis with multiple sources
// Context7 for official patterns
// Gemini CLI for alternative perspectives
// Sequential thinking for systematic verification
```

## Troubleshooting

### Common Issues

#### MCP Server Connection Errors
```
Error: Failed to connect to MCP server 'gemini-cli'
```

**Solutions**:
1. Verify server installation: `claude mcp list`
2. Check authentication: `gcloud auth list`
3. Restart Claude Code
4. Check firewall/network settings

#### Permission Denied Errors
```
Error: Permission denied for 'mcp__gemini-cli__prompt'
```

**Solutions**:
1. Add permission to `settings.local.json`
2. Verify permission format matches exactly
3. Restart Claude Code after permission changes
4. Check for typos in permission names

#### Authentication Issues (Gemini CLI)
```
Error: Google Cloud authentication required
```

**Solutions**:
1. Run `gcloud auth login`
2. Set project: `gcloud config set project PROJECT_ID`
3. Verify credentials: `gcloud auth list`
4. Check service account permissions

#### Performance Issues
```
Issue: Slow MCP server responses
```

**Solutions**:
1. Enable only needed MCP servers
2. Use caching when available
3. Batch related MCP calls
4. Check network connectivity
5. Monitor server resource usage

### Performance Optimization

#### Server Selection Strategy
1. **Start Minimal**: Begin with essential servers only
2. **Add Gradually**: Add specialized servers as needs emerge  
3. **Monitor Usage**: Track which servers provide value
4. **Remove Unused**: Disable servers that aren't actively used

#### Caching Strategies
1. **Context7**: Caches documentation lookups automatically
2. **Sequential Thinking**: Reuses analysis patterns
3. **Gemini CLI**: Leverages conversation history
4. **Custom Caching**: Implement for repeated workflows

#### Resource Management
1. **Concurrent Limits**: Limit concurrent MCP calls
2. **Timeout Configuration**: Set appropriate timeouts
3. **Error Handling**: Implement graceful fallbacks
4. **Resource Monitoring**: Track usage and performance

## Integration Examples

### Security Review with MCP
```typescript
// Multi-model security validation
async function comprehensiveSecurityReview(codeFile) {
  // 1. Primary security analysis (Claude)
  const primaryAnalysis = await analyzeSecurityVulnerabilities(codeFile);
  
  // 2. Framework security patterns (Context7)
  const securityPatterns = await mcp__context7__get_library_docs(
    frameworkId, 
    "security-best-practices"
  );
  
  // 3. Alternative security perspective (Gemini)
  const geminiValidation = await mcp__gemini_cli__prompt(`
    Review security analysis for additional vulnerabilities:
    Code: @${codeFile}
    Analysis: @${primaryAnalysis}
    Patterns: @${securityPatterns}
    Focus: OWASP Top 10, framework-specific issues
  `);
  
  // 4. Systematic validation (Sequential Thinking)
  const systematicValidation = await mcp__sequential_thinking__sequentialthinking(`
    Systematically validate security review:
    Code: @${codeFile}
    Claude Analysis: @${primaryAnalysis}
    Gemini Analysis: @${geminiValidation}
    Official Patterns: @${securityPatterns}
    Create: comprehensive security assessment with priority ranking
  `);
  
  return {
    primaryFindings: primaryAnalysis,
    frameworkCompliance: securityPatterns,
    alternativePerspective: geminiValidation,
    systematicAssessment: systematicValidation
  };
}
```

### Architecture Decision with MCP
```typescript
// Multi-source architectural validation
async function validateArchitecturalDecision(architectureProposal) {
  // 1. Framework best practices
  const frameworkPatterns = await mcp__context7__get_library_docs(
    "system-design",
    "architecture-patterns"
  );
  
  // 2. Systematic analysis
  const systematicAnalysis = await mcp__sequential_thinking__sequentialthinking(`
    Analyze architectural proposal:
    Proposal: @${architectureProposal}
    Evaluate: scalability, maintainability, complexity, performance
    Consider: team expertise, timeline, risk factors
  `);
  
  // 3. Alternative perspective
  const geminiPerspective = await mcp__gemini_cli__prompt(`
    Review architectural decision:
    Proposal: @${architectureProposal}
    Analysis: @${systematicAnalysis}
    Patterns: @${frameworkPatterns}
    Provide: alternative approaches, trade-offs, recommendations
  `);
  
  return synthesizeArchitecturalRecommendation({
    proposal: architectureProposal,
    patterns: frameworkPatterns,
    systematic: systematicAnalysis,
    alternative: geminiPerspective
  });
}
```

## Advanced Configuration

### Custom MCP Server Development

#### Creating Project-Specific MCP Servers
```typescript
// Example: Custom database migration server
class DatabaseMigrationMCPServer {
  async executeMigration(migrationFile) {
    // Custom migration logic
  }
  
  async validateSchema(schemaFile) {
    // Schema validation logic
  }
  
  async rollbackMigration(migrationId) {
    // Rollback logic
  }
}
```

#### MCP Server Registration
```json
{
  "mcpServers": {
    "custom-db-server": {
      "command": "node",
      "args": ["./custom-mcp-servers/database-migration.js"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

### Environment-Specific Configuration

#### Development Environment
```json
{
  "enabledMcpjsonServers": [
    "context7",
    "sequential-thinking", 
    "gemini-cli",
    "magic",
    "playwright"
  ],
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": ["mcp__*"]
  }
}
```

#### Production Environment
```json
{
  "enabledMcpjsonServers": [
    "context7"
  ],
  "permissions": {
    "defaultMode": "denyEdits",
    "allow": [
      "mcp__context7__resolve-library-id",
      "mcp__context7__get-library-docs"
    ]
  }
}
```

## Monitoring and Analytics

### MCP Usage Tracking
1. **Server Utilization**: Track which servers are used most frequently
2. **Performance Metrics**: Monitor response times and success rates
3. **Cost Analysis**: Track usage costs for paid services
4. **Quality Impact**: Measure improvement in code quality and productivity

### Success Metrics
1. **Development Velocity**: Time to complete tasks with MCP assistance
2. **Code Quality**: Defect reduction and quality score improvements  
3. **Decision Confidence**: Consensus rate on critical decisions
4. **Learning Acceleration**: Knowledge transfer and skill development

---

*This MCP configuration guide provides comprehensive setup and usage patterns for integrating Model Context Protocol servers into AI-assisted development workflows.*
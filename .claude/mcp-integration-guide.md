# MCP Integration Guide

**Created**: 2025-08-21
**Last Updated**: 2025-08-21
**Status**: Active
**Target Audience**: AI Assistants, Development Team

Comprehensive guide for integrating Model Context Protocol (MCP) servers with the AI coding template.

## Overview

MCP (Model Context Protocol) servers extend Claude Code's capabilities by providing specialized tools and services. This template includes proven MCP integration patterns based on production implementations.

## Core MCP Servers

### Essential Servers (Recommended for all projects)

#### **context7** - Library Documentation
- **Purpose**: Access official documentation and best practices for libraries and frameworks
- **Use Cases**: Framework documentation, API references, best practices lookup
- **Tools**: `mcp__context7__resolve-library-id`, `mcp__context7__get-library-docs`
- **Setup**: Available through Claude Code MCP marketplace

#### **sequential-thinking** - Complex Analysis
- **Purpose**: Multi-step reasoning and systematic problem-solving
- **Use Cases**: Complex debugging, architectural decisions, system analysis
- **Tools**: `mcp__sequential-thinking__sequentialthinking`
- **Setup**: Available through Claude Code MCP marketplace

#### **gemini-cli** - Multi-Model Consultation
- **Purpose**: Get second opinions and consensus analysis from Google Gemini
- **Use Cases**: Code review validation, architectural decisions, large codebase analysis
- **Tools**: `mcp__gemini-cli__prompt`
- **Benefits**: 
  - Free alternative to premium AI models
  - Massive context window for large file analysis
  - Multi-model consensus for critical decisions
- **Setup**: Requires Google Cloud authentication, no API key needed

### Project-Specific Servers

#### **playwright** - Browser Automation
- **Purpose**: E2E testing, browser automation, visual testing
- **Use Cases**: Web application testing, performance monitoring, cross-browser validation
- **Tools**: `mcp__playwright__browser_*` (navigate, click, type, wait_for, etc.)
- **Best For**: Web applications, UI testing


## Configuration Setup

### 1. Basic Configuration

Copy the template configuration:
```bash
cp .claude/settings.template.json .claude/settings.local.json
```

### 2. Customize for Your Project

Edit `.claude/settings.local.json` to:
- Add project-specific permissions
- Enable/disable MCP servers based on your tech stack
- Add additional MCP servers for specialized needs

### 3. Project-Specific MCP Servers

**Frontend Projects** (React, Vue, Angular):
```json
"enabledMcpjsonServers": [
  "context7",
  "sequential-thinking",
  "gemini-cli",
  "playwright"
]
```

**Backend Projects** (API, Database):
```json
"enabledMcpjsonServers": [
  "context7",
  "sequential-thinking", 
  "gemini-cli",
  "database-server",
  "api-testing-server"
]
```

**Full-Stack Projects**:
```json
"enabledMcpjsonServers": [
  "context7",
  "sequential-thinking",
  "gemini-cli",
  "playwright",
  "database-server"
]
```

## Agent Integration Patterns

### Multi-Model Validation with Gemini

Use gemini-cli for consensus analysis on critical decisions:

```typescript
// Example: Security Review Validation
const securityQuery = `Review this authentication implementation for security vulnerabilities:
@${filePath}
Focus on: OWASP compliance, authentication flaws, session management, data exposure`;

// Use mcp__gemini-cli__prompt to get Gemini's analysis
// Then synthesize with Claude's analysis for comprehensive review
```

### Documentation Lookup with Context7

```typescript
// Example: Framework Best Practices
const frameworkQuery = {
  library: "react",
  topic: "hooks-best-practices"
};

// Use mcp__context7__resolve-library-id and mcp__context7__get-library-docs
// To get official React documentation on hooks
```

### Complex Analysis with Sequential Thinking

```typescript
// Example: System Architecture Analysis
const architectureAnalysis = `Analyze the scalability implications of this microservices architecture:
@${architectureFiles}
Consider: service boundaries, data consistency, communication patterns, failure modes`;

// Use mcp__sequential-thinking__sequentialthinking for systematic analysis
```

## Security and Permissions

### Permission Categories

#### **Basic Development**
```json
"allow": [
  "Bash(npm:*)",
  "Bash(git:*)",
  "Bash(node:*)",
  "mcp__context7__*",
  "mcp__gemini-cli__prompt"
]
```

#### **Frontend Development**
```json
"allow": [
  "mcp__playwright__browser_*",
  "WebFetch(domain:developer.mozilla.org)"
]
```

#### **Full-Stack Development**
```json
"allow": [
  "mcp__*",
  "Bash(docker:*)",
  "Bash(psql:*)"
]
```

### Security Best Practices

1. **Principle of Least Privilege**: Only enable MCP servers you actually need
2. **Granular Permissions**: Use specific tool permissions rather than wildcards when possible
3. **Environment Separation**: Different permission sets for development vs production
4. **Regular Audits**: Review and update permissions as project needs change

## Troubleshooting

### Common Issues

#### MCP Server Not Found
```
Error: MCP server 'gemini-cli' not found
```
**Solution**: Install the MCP server through Claude Code marketplace or verify configuration

#### Permission Denied
```
Error: Permission denied for mcp__gemini-cli__prompt
```
**Solution**: Add the specific permission to your `settings.local.json` allow list

#### Authentication Issues (Gemini CLI)
```
Error: Google Cloud authentication required
```
**Solution**: Run `gcloud auth login` to authenticate with Google Cloud

### Performance Optimization

1. **Server Selection**: Only enable MCP servers you actively use
2. **Caching**: MCP servers cache responses; leverage this for repeated queries
3. **Batching**: Group related MCP calls when possible
4. **Fallbacks**: Configure fallback strategies when MCP servers are unavailable

## Best Practices

### MCP Server Usage

1. **Start Small**: Begin with essential servers (context7, sequential-thinking, gemini-cli)
2. **Add Gradually**: Add specialized servers as project needs evolve
3. **Monitor Usage**: Track which MCP tools provide the most value
4. **Document Integration**: Keep notes on successful MCP usage patterns

### Multi-Model Workflows

1. **Primary Analysis**: Use Claude for initial analysis
2. **Validation**: Use gemini-cli for second opinions on critical decisions
3. **Synthesis**: Combine insights from multiple models
4. **Documentation**: Record consensus and divergent viewpoints

### Development Integration

1. **Agent Assignment**: Assign specific MCP tools to relevant agents
2. **Workflow Integration**: Incorporate MCP calls into standard development workflows
3. **Quality Gates**: Use MCP validation as part of quality assurance
4. **Team Training**: Ensure team understands MCP capabilities and usage

## Examples and Templates

### Security Review Template
```typescript
// 1. Claude's security analysis
// 2. Gemini validation via mcp__gemini-cli__prompt
// 3. Context7 lookup for security best practices
// 4. Synthesized recommendations
```

### Architecture Decision Template
```typescript
// 1. Sequential thinking for systematic analysis
// 2. Context7 for framework patterns
// 3. Gemini consultation for alternative approaches
// 4. Consensus-based recommendations
```

### Component Development Template
```typescript
// 1. Context7 for framework best practices and component patterns
// 2. Playwright for testing integration
// 3. Gemini validation for accessibility and performance
```

---

*This MCP integration guide provides a comprehensive foundation for leveraging Model Context Protocol servers to enhance AI-assisted development workflows.*
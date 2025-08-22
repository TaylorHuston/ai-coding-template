# MCP Quick Start Guide

**Version**: 1.0.0
**Created**: 2025-08-21
**Last Updated**: 2025-08-22
**Status**: Active
**Target Audience**: Developers, AI Assistants

Quick reference for getting started with Model Context Protocol (MCP) servers.

## 5-Minute Setup

### 1. Choose Your Project Type
```bash
# Frontend projects
cp .claude/mcp-permissions/frontend.json .claude/settings.local.json

# Backend projects  
cp .claude/mcp-permissions/backend.json .claude/settings.local.json

# Full-stack projects
cp .claude/mcp-permissions/fullstack.json .claude/settings.local.json

# Minimal setup
cp .claude/mcp-permissions/basic.json .claude/settings.local.json
```

### 2. Essential MCP Servers

#### **context7** (Always Recommended)
- **Purpose**: Official framework documentation
- **Setup**: Pre-installed with Claude Code
- **Usage**: `mcp__context7__get-library-docs`

#### **gemini-cli** (Free Multi-Model)
- **Purpose**: Second opinions, consensus analysis
- **Setup**: `gcloud auth login` (free Google Cloud account)
- **Usage**: `mcp__gemini-cli__prompt`

#### **sequential-thinking** (Complex Analysis)
- **Purpose**: Systematic problem-solving
- **Setup**: Pre-installed with Claude Code  
- **Usage**: `mcp__sequential-thinking__sequentialthinking`

### 3. Quick Authentication

#### Gemini CLI (Required for multi-model features)
```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash

# Authenticate (free)
gcloud auth login

# Verify
claude mcp list
```

## Common Usage Patterns

### Multi-Model Code Review
```typescript
// 1. Primary analysis (Claude)
"Review this code for issues: @${codeFile}"

// 2. Second opinion (Gemini)
mcp__gemini-cli__prompt: "Validate this code review: @${codeFile} @${review}"

// 3. Synthesis: Combine both perspectives
```

### Framework Best Practices
```typescript
// Look up official documentation
mcp__context7__resolve-library-id("react")
mcp__context7__get-library-docs(libraryId, "hooks-best-practices")
```

### Complex Problem Solving
```typescript
// Systematic analysis
mcp__sequential-thinking__sequentialthinking: `
Break down this architectural challenge:
Problem: ${description}
Requirements: ${requirements}
Constraints: ${constraints}
`
```

## Project-Specific Quick Configs

### React Projects
```json
{
  "enabledMcpjsonServers": [
    "context7", "gemini-cli", "sequential-thinking", "magic", "playwright"
  ],
  "key_benefits": [
    "React documentation lookup",
    "Component generation with magic",
    "Multi-model validation",
    "E2E testing with playwright"
  ]
}
```

### Node.js API Projects  
```json
{
  "enabledMcpjsonServers": [
    "context7", "gemini-cli", "sequential-thinking", "supabase"
  ],
  "key_benefits": [
    "Express/Fastify documentation",
    "Database integration", 
    "API design validation",
    "Security best practices"
  ]
}
```

### Full-Stack Projects
```json
{
  "enabledMcpjsonServers": [
    "context7", "gemini-cli", "sequential-thinking", 
    "magic", "playwright", "supabase", "vercel"
  ],
  "key_benefits": [
    "End-to-end development support",
    "Multi-model consensus",
    "Complete testing coverage",
    "Deployment integration"
  ]
}
```

## Quick Troubleshooting

### Common Issues & Solutions

#### "MCP server not found"
```bash
# Check installation
claude mcp list

# Install missing server
claude mcp install gemini-cli
```

#### "Permission denied"
```json
// Add to settings.local.json
{
  "permissions": {
    "allow": [
      "mcp__gemini-cli__prompt",
      "mcp__context7__*"
    ]
  }
}
```

#### "Authentication required" (Gemini)
```bash
# Re-authenticate
gcloud auth login
gcloud auth list
```

## Essential MCP Commands

### Documentation Lookup
```typescript
// Find library ID
const libId = await mcp__context7__resolve-library-id("nextjs");

// Get specific documentation  
const docs = await mcp__context7__get-library-docs(libId, "routing");
```

### Multi-Model Validation
```typescript
// Get Gemini's perspective
const geminiView = await mcp__gemini-cli__prompt(`
Analyze this implementation: @${codeFile}
Focus on: performance, security, best practices
`);
```

### Complex Analysis
```typescript
// Systematic problem breakdown
const analysis = await mcp__sequential-thinking__sequentialthinking(`
Analyze system architecture:
Current: @${currentArchitecture}
Requirements: @${newRequirements}
Create: migration strategy with risk assessment
`);
```

## Performance Tips

### Efficient MCP Usage
1. **Batch Queries**: Group related MCP calls
2. **Cache Results**: MCP servers cache responses automatically
3. **Selective Usage**: Use MCP for complex decisions, not simple tasks
4. **Server Selection**: Only enable servers you actively use

### Cost Optimization
1. **Gemini CLI**: Free with Google Cloud authentication
2. **Context7**: Free documentation lookups
3. **Sequential Thinking**: Included with Claude Code
4. **Resource Monitoring**: Track usage patterns

## Integration with AI Agents

### Agent MCP Assignment
```yaml
code-reviewer:
  mcp_tools:
    - mcp__context7__* (framework validation)
    - mcp__gemini-cli__prompt (second opinions)
    - mcp__sequential-thinking__* (complex analysis)

project-manager:
  mcp_tools:
    - mcp__sequential-thinking__* (planning)
    - mcp__context7__* (technology research) 
    - mcp__gemini-cli__prompt (consensus building)

security-auditor:
  mcp_tools:
    - mcp__context7__* (security documentation)
    - mcp__gemini-cli__prompt (vulnerability validation)
    - mcp__sequential-thinking__* (threat modeling)
```

## Next Steps

### After Basic Setup
1. **Test Essential Servers**: Verify context7, gemini-cli, sequential-thinking
2. **Add Project-Specific Servers**: magic (frontend), supabase (backend)
3. **Configure Permissions**: Customize based on project needs
4. **Train Team**: Share MCP usage patterns and best practices

### Advanced Configuration
1. **Custom MCP Servers**: Build project-specific tools
2. **Workflow Integration**: Embed MCP in development workflows  
3. **Monitoring Setup**: Track usage and performance
4. **Team Optimization**: Refine based on team feedback

---

*This quick start guide gets you up and running with MCP in minutes. See the full [MCP Configuration Guide](../mcp-configuration-guide.md) for detailed setup and advanced usage patterns.*
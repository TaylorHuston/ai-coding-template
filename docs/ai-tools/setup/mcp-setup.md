---
version: "0.1.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "team-leads"]
document_type: "setup"
tags: ["mcp", "setup", "ai-tools"]
difficulty: "beginner"
estimated_time: "5 min"
---

# MCP Setup Guide

**Supercharge your AI assistant with specialized tools and capabilities.**

Model Context Protocol (MCP) extends Claude Code with powerful tools for documentation access, multi-model collaboration, browser automation, and more.

## What Does MCP Give You?

### 📚 **Official Documentation Access**
- Instant access to library and framework documentation
- Always up-to-date API references
- Best practices from official sources

### 🧠 **Enhanced Problem Solving**
- Multi-step reasoning for complex problems
- Systematic debugging workflows
- Second opinions from other AI models

### 🌐 **Browser Automation**
- E2E testing capabilities
- Visual testing and monitoring
- Cross-browser validation


## Quick Setup (5 Minutes)

### 1. Choose Your Project Type

```bash
# Frontend projects (React, Vue, Angular)
cp .claude/mcp-permissions/frontend.json .claude/settings.local.json

# Backend projects (APIs, databases)
cp .claude/mcp-permissions/backend.json .claude/settings.local.json

# Full-stack projects
cp .claude/mcp-permissions/fullstack.json .claude/settings.local.json

# Minimal setup (just essentials)
cp .claude/mcp-permissions/basic.json .claude/settings.local.json
```

### 2. Verify Prerequisites

```bash
# Check all prerequisites (including uv for semantic analysis)
./scripts/setup-manager.sh check
```

The `uv` package manager is required for Serena semantic code analysis. Serena is pre-configured and will download automatically when first used.

### 3. Essential MCP Tools

These are automatically included in all setups:

#### **context7** - Documentation Access
- **What it does**: Provides instant access to official library documentation
- **Why you need it**: No more searching docs manually or using outdated information
- **Example**: "Get the latest Next.js routing documentation"

#### **sequential-thinking** - Complex Analysis
- **What it does**: Multi-step reasoning for complex problems
- **Why you need it**: Better debugging and architectural decisions
- **Example**: "Analyze this performance issue step by step"

#### **gemini-cli** - Second Opinions
- **What it does**: Free access to Google Gemini for consensus analysis
- **Why you need it**: Validation of critical decisions, massive context window
- **Example**: "Review this entire codebase and suggest improvements"
- **Prerequisites**: Requires [Gemini CLI](https://github.com/google-gemini/gemini-cli) installation (see README)

#### **serena** - Semantic Code Intelligence
- **What it does**: Provides semantic code analysis and LSP-based intelligent code manipulation
- **Why you need it**: Token-efficient semantic code understanding, precise symbol-level editing
- **Example**: "Find all references to the Authentication class and analyze dependencies"
- **Prerequisites**: Requires `uv` package manager (template prerequisite)

### 3. Optional Tools by Project Type

#### All Projects Benefit From:
- **serena** - Semantic code analysis for any language with LSP support

#### Frontend Projects Add:
- **playwright** - Browser testing and automation

#### Backend Projects Add:
- **database** tools for schema management
- **api-testing** tools for endpoint validation

#### Large/Complex Projects Add:
- **serena** (essential) - Handles complex codebases with semantic precision

## Getting Started

### Your First MCP Command

Try this to test your setup:
```
Ask your AI assistant: "Use context7 to get the latest React hooks documentation"
```

### Common Usage Patterns

**Before implementing something new:**
```
"Search for existing implementations of [feature] in this codebase first"
```

**For complex problems:**
```
"Use sequential thinking to debug this step by step"
```

**For critical decisions:**
```
"Get a second opinion from Gemini on this architectural choice"
```

**For documentation:**
```
"Get the official documentation for [library/framework]"
```

**For semantic code analysis:**
```
"Find all references to the UserService class"
"Analyze the impact of changing the authenticate method"
"Insert error handling after the validateInput function"
```

## Project-Specific Customization

### Add Custom MCP Servers

Edit `.claude/settings.local.json` to add project-specific tools:

```json
{
  "mcpServers": {
    "your-custom-server": {
      "command": "path/to/your/server",
      "args": ["--config", "config.json"]
    }
  }
}
```

### Enable/Disable Servers

Modify the `enabledMcpServers` array in your settings:

```json
{
  "enabledMcpServers": [
    "context7",           // Essential - always keep
    "sequential-thinking", // Essential - always keep
    "gemini-cli",         // Essential - always keep
    "playwright"         // Optional - for web testing
  ]
}
```

## Troubleshooting

### MCP Not Working?

1. **Check Configuration**: Ensure `.claude/settings.local.json` exists
2. **Restart Claude Code**: Restart after configuration changes
3. **Check Permissions**: Verify MCP servers have proper permissions
4. **Test Basic Tools**: Try `"Use context7 to get React documentation"`

### Authentication Issues?

**For gemini-cli:**
```bash
# Install Google Cloud CLI
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Performance Issues?

- Disable unused MCP servers in settings
- Use `basic.json` template for minimal setup
- Restart Claude Code periodically

## Advanced Usage

### Custom Workflows

Create project-specific MCP command combinations:

```bash
# Complex debugging workflow
"Use sequential thinking to analyze this issue, then get official docs with context7, and finally get Gemini's opinion"

# Code review workflow
"Review this code with context7 for best practices, then get Gemini's assessment"
```

### Team Integration

Share your `.claude/settings.local.json` (without secrets) with your team:

```bash
# Create team template
cp .claude/settings.local.json .claude/team-settings.template.json
# Edit to remove any personal tokens/keys
# Commit to repo for team consistency
```

## Benefits You'll See

✅ **Faster Development**: Instant access to accurate documentation
✅ **Better Decisions**: Multi-model consensus on important choices
✅ **Higher Quality**: Automated testing and validation capabilities
✅ **Less Context Switching**: Everything accessible through your AI assistant
✅ **Team Consistency**: Shared tooling and capabilities across team members

---

**Next Steps**:
- [AI Collaboration Guide](../guides/ai-collaboration-guide.md) - Learn effective AI workflows
- [Commands Reference](../reference/commands.md) - Discover available slash commands
- [Troubleshooting](../reference/troubleshooting.md) - Solve common issues

**Technical Details**: See `.claude/mcp-integration-guide.md` for technical configuration details.
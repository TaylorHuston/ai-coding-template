---
version: "1.0.0"
created: "2025-09-19"
last_updated: "2025-09-19"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "setup-guide"
priority: "medium"
tags: ["serena", "mcp", "semantic-analysis", "activation"]
---

# Adding Serena MCP Server

**When and how to add Serena's semantic code analysis to your project.**

## Overview

Serena MCP Server provides powerful semantic code analysis but adds indexing overhead. New projects start with essential MCP servers only. Add Serena when your project grows in complexity.

## When to Add Serena

### Recommended Addition Threshold
- **20+ implementation files** in your `src/` directory
- **Complex code structure** with multiple modules/components
- **Need for semantic analysis** (finding references, understanding relationships)

### Project Maturity Indicators
- Multiple interconnected classes/modules
- Complex business logic requiring cross-reference analysis
- Refactoring needs that benefit from semantic understanding
- Code review processes that need architectural analysis

## How to Add Serena

### Step 1: Edit `.mcp.json`

Open your project's `.mcp.json` file and add the Serena configuration to the `mcpServers` section:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    },
    "serena": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oraios/serena", "serena", "start-mcp-server", "--context", "ide-assistant"],
      "env": {}
    }
  }
}
```

### Step 2: Restart Claude Code

After adding Serena, restart Claude Code to:
- Initialize the Serena MCP server
- Begin LSP indexing of your codebase
- Enable semantic analysis tools

### Step 3: Verify Activation

Test that Serena is working by asking Claude to:
- Find symbol references in your code
- Analyze code structure semantically
- Use advanced code navigation features

## Serena Tools Available After Activation

### Core Semantic Analysis
- `find_symbol` - Locate functions, classes, variables by name
- `find_referencing_symbols` - Find all usages of a symbol
- `get_symbols_overview` - Understand overall code structure
- `search_for_pattern` - Find architectural patterns

### Code Modification
- `insert_after_symbol` - Precise code insertion
- `insert_before_symbol` - Context-aware code placement

### Use Cases
- **Refactoring**: Safe code changes with impact analysis
- **Code Review**: Understanding component relationships
- **Architecture Analysis**: Mapping system dependencies
- **Bug Fixing**: Tracing data flow and usage patterns

## Performance Considerations

### Initial Indexing
- **First activation**: LSP will index your entire codebase
- **Indexing time**: Proportional to project size (larger projects take longer)
- **Memory usage**: Increases with codebase complexity

### Ongoing Performance
- **Incremental updates**: Only changed files are re-indexed
- **Tool responsiveness**: Generally fast after initial indexing
- **Resource usage**: Moderate impact on system resources

## Troubleshooting

### Serena Not Starting
- Verify `uvx` is installed: `uvx --version`
- Check Claude Code MCP server logs
- Ensure internet connection for Serena download

### Indexing Issues
- Allow time for initial indexing (especially large projects)
- Check for syntax errors in source files
- Verify LSP support for your programming language

### Performance Problems
- Consider project size (Serena works best with substantial codebases)
- Check system resources during indexing
- Restart Claude Code if indexing seems stuck

## When NOT to Use Serena

### Fresh Projects
- Minimal implementation code (<20 files)
- Mostly template or configuration files
- Early prototyping phase

### Simple Projects
- Single-file applications
- Basic scripts or utilities
- Projects without complex interdependencies

### Alternative: Glob and Grep
For simple projects, use:
- **Glob**: File and template discovery
- **Grep**: Basic text search and pattern matching
- **Read**: Direct file access and analysis

## Migration Path

### From No Serena → Serena
1. Develop project with Glob/Grep tools
2. Reach complexity threshold (20+ files)
3. Activate Serena using this guide
4. Begin using semantic analysis features

### Project Growth Timeline
- **Start**: Glob/Grep (immediate productivity)
- **Growing** (5-20 files): Continue with Glob/Grep
- **Complex** (20+ files): Activate Serena for semantic benefits
- **Mature**: Full semantic analysis workflow

## Best Practices

### Activation Timing
- Don't activate too early (unnecessary overhead)
- Don't wait too long (miss refactoring opportunities)
- Consider team workflow and project needs

### Tool Selection
- Use appropriate tool for task complexity
- Combine Serena with Context7 for comprehensive analysis
- Keep Glob for template and simple file operations

### Project Maintenance
- Regular Claude Code restarts help with indexing freshness
- Monitor performance impact as project grows
- Consider deactivating if project complexity decreases

---

**Related Documentation:**
- [Serena Semantic Tools Reference](../reference/serena-semantic-tools.md)
- [MCP Setup Guide](./mcp-setup.md)
- [Tool Selection Guide](../reference/tool-selection.md)
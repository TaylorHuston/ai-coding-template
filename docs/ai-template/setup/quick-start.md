---
version: "0.1.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "end-users"]
document_type: "setup"
difficulty: "beginner"
estimated_time: "5 min"
tags: ["setup", "quick-start", "onboarding"]
---

# Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Git (2.25+)
- Node.js (16+) - for JavaScript-based automation scripts
- Your preferred editor (VS Code, Cursor, etc.)
- AI assistant account (Claude, GitHub Copilot, etc.)

### Installation

```bash
# 1. Clone the template
git clone https://github.com/yourusername/ai-coding-template.git my-project
cd my-project

# 2. Initialize for your project
rm -rf .git && git init
chmod +x scripts/*.sh
./scripts/setup-manager.sh quick

# 3. Set up CHANGELOG (optional)
cp templates/CHANGELOG.template.md CHANGELOG.md

# 4. Verify setup
./scripts/ai-status.sh --check
```

### First AI Session

1. **Share context files** with your AI assistant:
   - `CLAUDE.md` - AI instructions and behavioral guidelines
   - `STATUS.md` - Current project state and progress
   - `docs/quality-standards.md` - Development requirements and standards

2. **Try your first agent**:
   ```
   "Use the context-analyzer agent to understand this project"
   ```

3. **Create something**:
   ```
   "Using the frontend-specialist, create a responsive navbar component"
   ```

## What Just Happened?

### Files Created
- `.env` and `.env.local` - Environment configuration
- Git repository initialized
- Script permissions set
- Basic project structure validated

### Key Files to Know
- **`CLAUDE.md`** - Instructions for AI assistants
- **`STATUS.md`** - Project memory and context
- **`docs/ai-agents-guide.md`** - Agent system reference
- **`.claude/agents/INDEX.md`** - Complete agent reference
- **`docs/README.md`** - Documentation navigation hub

### Scripts Available
- **`./scripts/ai-status.sh`** - Project status dashboard
- **`./scripts/setup-manager.sh`** - Environment management
- **`./scripts/docs-manager.sh`** - Documentation tools

## Next Steps

### For New Projects
1. **Update STATUS.md** with your project details
2. **Configure agents** by reading `.claude/agents/INDEX.md`
3. **Set up development environment** using [Local Environment Setup](../guides/implementation/environment-setup.md)

### For Existing Projects
1. **Review integration options** in [Integration Guide](./integration-guide.md)
2. **Plan gradual adoption** strategy
3. **Configure MCP servers** using [MCP Configuration Guide](./mcp-configuration-guide.md)

### Essential Reading
- [AI Agents Guide](../ai-agents-guide.md) - Understanding the 17 specialized agents
- [Documentation Guidelines](../documentation-guidelines.md) - Writing standards
- [Quality Standards](../quality-standards.md) - Development requirements

## Troubleshooting

### Permission Issues
```bash
chmod +x scripts/*.sh
chmod +x scripts/lib/*.sh
```

### Git Issues
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Node.js Issues
```bash
node --version  # Should be 16+
npm install     # If package.json exists
```

### Script Issues
```bash
# Check script status
./scripts/ai-status.sh --verbose

# Re-run setup
./scripts/setup-manager.sh check
```

## Advanced Setup

For more comprehensive setup options:

- **[Full Setup Guide](./README.md)** - Complete setup workflows
- **[Integration Guide](./integration-guide.md)** - Add to existing projects
- **[MCP Configuration](./mcp-configuration-guide.md)** - Advanced AI capabilities
- **[Deployment Guide](./deployment-guide.md)** - Production setup

## Support

- **Documentation**: [Complete navigation](../README.md)
- **Troubleshooting**: [Common issues](../troubleshooting.md)
- **Examples**: [Architecture examples](../architecture/)

---

*Get up and running in 5 minutes, then explore the full capabilities at your own pace.*
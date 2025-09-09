# Git Hooks for AI Coding Template

This directory contains git hooks specifically designed for AI-assisted development workflows.

## Quick Setup

Run the setup script to install and configure all hooks:

```bash
./scripts/setup-git-hooks.sh
```

## Available Hooks

### Pre-Commit Hook (`pre-commit`)

Comprehensive validation before each commit:

- **🛡️ Branch Protection**: Prevents direct commits to protected branches
- **🤖 AI Documentation**: Validates AI assistance indicators in commit messages  
- **📚 Documentation**: Warns when code changes without STATUS.md updates
- **🔒 Security Scan**: Detects potential secrets, API keys, and sensitive files
- **📝 File Naming**: Enforces kebab-case for documentation files

### Configuration

Hooks are configured via `.githooks.json` in the project root. Key settings:

```json
{
  "pre-commit": {
    "checks": {
      "branch-protection": {
        "protected-branches": ["main", "master", "develop"]
      },
      "ai-documentation": {
        "warning-only": true
      },
      "security-scan": {
        "enabled": true
      }
    }
  }
}
```

## Bypassing Hooks

For emergencies only:

```bash
git commit --no-verify -m "Emergency fix"
```

## AI Documentation Requirements

The hooks expect one of these indicators in commit messages when AI assistance is used:

- `🤖 Generated with [Claude Code](https://claude.ai/code)`
- `Co-Authored-By: Claude <noreply@anthropic.com>`
- `AI-Assisted: [description]`
- `Human-Only: No AI assistance used`

## Troubleshooting

### Hook Not Running
1. Check if hooks are executable: `ls -la .githooks/`
2. Verify git configuration: `git config core.hooksPath`
3. Re-run setup: `./scripts/setup-git-hooks.sh`

### False Positives
1. Update patterns in `.githooks.json`
2. Use `--no-verify` for legitimate exceptions
3. Contact team for hook configuration updates

### Status Check
```bash
./scripts/setup-git-hooks.sh status
```

## Security Patterns

The security scanner looks for:
- API keys and tokens
- Hardcoded passwords
- Private keys
- Sensitive file names
- Common secret patterns

## Contributing

To modify hooks:
1. Edit the hook file in `.githooks/`
2. Update `.githooks.json` configuration
3. Test with sample commits
4. Update this README if needed

## Support

- Check `.githooks.json` for configuration options
- Review `scripts/setup-git-hooks.sh` for installation issues
- See main project documentation for AI assistance guidelines
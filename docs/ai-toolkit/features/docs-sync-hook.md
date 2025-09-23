# Documentation Sync Commit Hook

**Version**: 0.2.0
**Created**: 2025-09-17
**Updated**: 2025-09-17
**Status**: Active

## Overview

The docs-sync commit hook automatically analyzes **all commits** for potential documentation impact and triggers comprehensive documentation synchronization. It ensures that any code, configuration, or structural changes are properly reflected in project documentation.

## How It Works

### Trigger Conditions

The hook **analyzes every commit** and triggers based on:

#### Priority Files (High Documentation Impact)
- `.claude/commands/`, `.claude/agents/`, `.claude/references/` - AI configuration
- `src/`, `lib/`, `scripts/` - Core application code
- `package.json`, `README.md`, `CLAUDE.md`, `STATUS.md` - Project configuration and overview
- `config/`, `examples/` - Configuration and example code

#### General Changes
- Any non-documentation file changes (excluding tests, build artifacts)
- Structural changes that may affect project understanding
- New features or modified functionality

#### Exclusions
- Test files (`test/`, `tests/`, `*.test.*`, `*.spec.*`)
- Build artifacts (`node_modules/`, `dist/`, `build/`)
- CI/CD files (`.github/` workflow files)
- Temporary or cache files

### Automatic Actions

1. **Comprehensive Analysis**: Scans all staged files for documentation impact
2. **Priority Assessment**: Identifies high-impact changes requiring immediate attention
3. **Intelligent Sync**: Invokes docs-sync agent with detailed change analysis
4. **Cross-Reference Validation**: Ensures all documentation links and references remain accurate
5. **User Guidance**: Provides specific recommendations for manual review when needed

## Configuration

### Pre-commit Hook Configuration (`.githooks.json`)

```json
{
  "pre-commit": {
    "checks": {
      "docs-sync": {
        "enabled": true,
        "warning-only": true,
        "description": "Review all commits for documentation sync opportunities",
        "action": "auto-sync",
        "agent": "technical-writer",
        "timeout-seconds": 30,
        "skip-conditions": {
          "docs-only-commits": false,
          "exclude-patterns": [
            "^test/", "^tests/", "^\\.github/",
            "^node_modules/", "^dist/", "^build/"
          ]
        },
        "priority-paths": {
          "high": [
            ".claude/commands/", ".claude/agents/", ".claude/references/",
            "src/", "lib/", "scripts/"
          ],
          "medium": [
            "package.json", "README.md", "CLAUDE.md", "STATUS.md"
          ],
          "low": ["config/", "examples/"]
        }
      }
    }
  }
}
```

### Configuration Options

- **`enabled`**: Enable/disable the docs-sync check
- **`warning-only`**: If `true`, warns but doesn't block commits; if `false`, blocks commits on sync failures
- **`skip-conditions`**: Conditions for skipping the sync check
  - **`docs-only-commits`**: Skip if only documentation files are being committed
  - **`exclude-patterns`**: Regex patterns for files to exclude from analysis
- **`priority-paths`**: Categorized paths by documentation impact level
  - **`high`**: Critical files that almost always require documentation updates
  - **`medium`**: Important files that often affect documentation
  - **`low`**: Files that may occasionally need documentation updates
- **`timeout-seconds`**: Maximum time to wait for sync agent

## Usage Examples

### Automatic Trigger on Any Commit

The hook now analyzes **every commit** for documentation impact:

```bash
# Example 1: Code changes
vim src/utils/helper.js
git add src/utils/helper.js
git commit -m "add new utility function"
```

Output for priority changes:
```
🔍 Running pre-commit validation...
[7/8] docs sync... ⚠ Docs sync: High-priority changes detected (1 files)
  Running comprehensive docs-sync analysis...
🔄 Code changes detected that may affect documentation:
Priority files:
  → src/utils/helper.js
🤖 Triggering docs-sync agent...
✓ Documentation sync analysis completed
```

```bash
# Example 2: Configuration changes
vim package.json
git add package.json
git commit -m "update dependencies"
```

Output for configuration changes:
```
🔍 Running pre-commit validation...
[7/8] docs sync... ⚠ Docs sync: High-priority changes detected (1 files)
Priority files:
  → package.json
Total changed files: 1
🤖 Triggering docs-sync agent...
```

### Manual Sync

If automated sync isn't available:

```bash
# Use Claude Code Task system directly
Task technical-writer "Review .claude/ changes and sync documentation"

# Or manually review affected documentation
# - README.md
# - docs/ai-toolkit/
# - .claude/commands/README.md
```

## Integration with technical-writer

The hook works with the `technical-writer` to automatically:

1. **Analyze Changes**: Review what AI configuration files were modified
2. **Identify Impact**: Determine which documentation files may be affected
3. **Update Documentation**: Automatically sync relevant documentation
4. **Report Results**: Provide summary of changes and any issues

### Sync Analysis Request

The hook generates a structured request for the docs-sync agent:

```markdown
# Documentation Sync Analysis Request

## Context
AI configuration files have been modified in this commit.

## Changed Files
- .claude/commands/develop.md

## Analysis Tasks
1. Review Changes: Examine modifications to AI configuration
2. Identify Inconsistencies: Find documentation referencing changed configs
3. Update Documentation: Synchronize relevant documentation files
4. Validate References: Ensure cross-references remain accurate

## Focus Areas
- Command documentation updates if .claude/commands/ changed
- Agent documentation if .claude/agents/ changed
- Reference documentation if .claude/references/ changed
```

## Benefits

### Consistency Maintenance
- Automatically catches documentation drift from AI configuration changes
- Ensures README.md and guides stay current with command modifications
- Maintains accuracy in cross-references between documentation

### Developer Experience
- **Proactive**: Catches inconsistencies before they become problems
- **Automated**: Reduces manual effort to keep docs synchronized
- **Contextual**: Only triggers when relevant changes are made

### Quality Assurance
- **Prevents**: Outdated documentation from being committed
- **Validates**: Cross-references remain accurate after changes
- **Reports**: Clear summary of what needs attention

## Customization

### Adding Trigger Paths

To monitor additional directories:

```json
{
  "docs-sync": {
    "trigger-paths": [
      ".claude/commands/",
      ".claude/agents/",
      ".claude/references/",
      ".claude/workflows/",
      "custom-ai-config/"
    ]
  }
}
```

### Integration with CI/CD

The hook respects CI environment variables:

```bash
# Skip interactive prompts in CI
CI=true git commit -m "automated update"

# Force commit without docs sync
FORCE_COMMIT=true git commit -m "emergency fix"
```

## Troubleshooting

### Hook Not Triggering

1. **Check Configuration**: Verify `docs-sync.enabled` is `true`
2. **Verify Paths**: Ensure changed files match `trigger-paths`
3. **Test Manually**: Run `./.githooks/pre-commit` directly

### Sync Failures

1. **Warning Mode**: Set `warning-only: true` to allow commits with warnings
2. **Manual Review**: Check documentation manually if agent unavailable
3. **Bypass Hook**: Use `git commit --no-verify` for emergencies

### Performance Issues

1. **Timeout**: Adjust `timeout-seconds` for slower environments
2. **Skip Conditions**: Use `skip-if-docs-only` to avoid unnecessary runs
3. **Selective Triggers**: Narrow `trigger-paths` to critical directories only

## Future Enhancements

### Planned Features
- **Bidirectional Sync**: Update AI config when documentation changes
- **Conflict Resolution**: Handle merge conflicts in documentation
- **Batch Processing**: Optimize sync for multiple file changes
- **Dependency Tracking**: Map configuration dependencies across files

### Integration Opportunities
- **IDE Extensions**: Real-time sync notifications in editors
- **GitHub Actions**: Automated sync in pull request workflows
- **Documentation Generators**: Auto-generate docs from AI configurations

## Related Documentation

- [technical-writer Guide](../guides/technical-writer.md)
- [Git Hooks Configuration](../../development/git-hooks.md)
- [AI Workflow Commands](../reference/commands.md)
- [Agent System Overview](../guides/comprehensive-agent-guide.md)
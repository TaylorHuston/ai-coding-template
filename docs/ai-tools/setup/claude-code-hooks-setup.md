---
version: "0.1.0"
created: "2025-09-16"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "setup-guide"
priority: "high"
tags: ["claude-code", "hooks", "automation", "workflow"]
---

# Claude Code Hooks Setup Guide

**Automatic workflow enforcement using Claude Code's built-in hooks system for the design → architect → plan → develop workflow.**

## Overview

Claude Code hooks provide deterministic enforcement of workflow standards by automatically running validation scripts at key points during development. This eliminates reliance on manual script execution and ensures consistent quality gates.

## Benefits of Hooks vs Scripts

| Aspect | Manual Scripts | Claude Code Hooks |
|--------|---------------|-------------------|
| **Enforcement** | Manual/orchestrator remembers | Automatic on events |
| **Coverage** | Depends on implementation | Every relevant action |
| **Error Prevention** | After the fact | Can block before violation |
| **User Experience** | Extra commands to run | Seamless integration |

## Quick Setup

### 1. Copy Hook Configuration

Copy the hooks configuration to your Claude Code settings:

```bash
# For project-specific hooks
cp .claude/hooks-config.json ~/.claude/settings/hooks.json

# Or merge with existing settings
```

### 2. Verify Hook Scripts

Ensure all hook scripts are executable:

```bash
chmod +x .resources/scripts/hooks/*.sh
```

### 3. Test Hooks

Test with a simple command to verify hooks are working:

```bash
# This should trigger validation hooks if enabled
/plan --help
```

You should see hook output indicating the validation is working.

## Hook Configuration

### Available Hooks

The configuration includes these workflow enforcement hooks:

#### 1. Pre-Task Validation Hook
- **Event**: `PreToolUse` for `Task` tool
- **Purpose**: Validate context before agent execution
- **Script**: `.resources/scripts/hooks/pre-task-validation.sh`
- **Behavior**:
  - Finds workflow directory (PLAN.md, HANDOFF.yml)
  - Validates YAML structure and context integrity
  - Context distillation handled automatically by /develop command
  - **Blocks execution** if validation fails

#### 2. Post-Agent Validation Hook
- **Event**: `PostToolUse` for `Task` tool
- **Purpose**: Validate agent output and update coordination files
- **Script**: `.resources/scripts/hooks/post-agent-validation.sh`
- **Behavior**:
  - Checks if HANDOFF.yml was updated properly
  - Validates HANDOFF.yml structure and required fields
  - Runs basic quality gates (non-blocking)
  - Updates timestamps and quality indicators

#### 3. Pre-Edit Validation Hook
- **Event**: `PreToolUse` for `Edit`/`Write`/`MultiEdit` tools
- **Purpose**: Enforce TDD and quality gates before code changes
- **Script**: `.resources/scripts/hooks/pre-edit-validation.sh`
- **Behavior**:
  - **TDD Enforcement**: Blocks implementation files without tests
  - **Protected Files**: Warns about editing critical files
  - **Quality Gates**: Runs non-blocking quality checks
  - Supports `--force` override for TDD enforcement


### Hook Configuration File

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": {"tool": "Task"},
      "command": ".resources/scripts/hooks/pre-task-validation.sh",
      "description": "Validate context before agent execution",
      "enabled": true
    },
    {
      "event": "PostToolUse",
      "matcher": {"tool": "Task"},
      "command": ".resources/scripts/hooks/post-agent-validation.sh",
      "description": "Validate agent output and update coordination files",
      "enabled": true
    },
    {
      "event": "PreToolUse",
      "matcher": {"tool": ["Edit", "Write", "MultiEdit"]},
      "command": ".resources/scripts/hooks/pre-edit-validation.sh",
      "description": "Quality gates and TDD validation before code changes",
      "enabled": true
    }
  ]
}
```

## Workflow Integration

### Automatic Enforcement Points

With hooks enabled, the workflow automatically enforces:

1. **Context Validation** - Before every agent execution
2. **TDD Compliance** - Before writing implementation code
3. **Quality Gates** - Before major code changes
4. **File Structure** - Proper HANDOFF.yml and RESEARCH.md maintenance

### Workflow Example with Hooks

```bash
# 1. Setup workflow
/plan --issue AUTH-123


# 2. Execute tasks
/develop

# Hook: pre-task-validation validates context
# Agent executes with project context
# Hook: post-agent-validation validates output and updates files

# 3. Edit implementation files
# Hook: pre-edit-validation enforces TDD and quality gates
```

## Hook Script Details

### TDD Enforcement

The pre-edit hook enforces test-driven development:

```bash
# ✅ Allowed: Writing test files
touch src/auth.test.js

# ✅ Allowed: Implementation with corresponding tests
touch src/auth.js  # (if auth.test.js exists)

# ❌ Blocked: Implementation without tests
touch src/newfeature.js  # (no newfeature.test.js found)

# ✅ Override: Use --force for exceptional cases
# Hook detects --force flag and allows with warning
```

### Quality Gate Integration

Quality gates run automatically at key points:

- **Pre-agent**: Validate context integrity
- **Post-agent**: Validate output structure
- **Pre-edit**: Check tests, linting, build status
- **Phase transitions**: Comprehensive validation

## Customization

### Enabling/Disabling Hooks

Edit the hooks configuration to enable/disable specific hooks:

```json
{
  "event": "UserPromptSubmit",
  "matcher": {"pattern": "/(develop|plan)"},
  "command": ".resources/scripts/hooks/pre-task-validation.sh",
  "enabled": false,  // Disable this hook
  "note": "Enable for strict workflow enforcement"
}
```

### Adjusting Hook Behavior

Modify hook scripts for project-specific requirements:

```bash
# Make TDD enforcement less strict
# Edit .resources/scripts/hooks/pre-edit-validation.sh
# Change TDD failure from exit 1 to warning only

# Add project-specific quality gates
# Edit .resources/scripts/hooks/pre-edit-validation.sh
# Add custom validation logic
```

### Adding Custom Hooks

Create additional hooks for project needs:

```json
{
  "event": "PreToolUse",
  "matcher": {"tool": "Bash"},
  "command": ".resources/scripts/hooks/pre-bash-validation.sh",
  "description": "Validate bash commands before execution"
}
```

## Troubleshooting

### Hook Not Running

**Symptoms**: Hook scripts not executing
**Solutions**:
- Verify hooks configuration is in correct location
- Check script permissions: `chmod +x .resources/scripts/hooks/*.sh`
- Verify Claude Code recognizes hooks: check settings
- Test with simple hook to verify system is working

### Hook Failures

**Symptoms**: Hooks blocking valid operations
**Solutions**:
- Check hook script logs for specific errors
- Verify workflow directory structure (PLAN.md, HANDOFF.yml exist)
- Use `--force` flags where appropriate for overrides
- Temporarily disable problematic hooks for debugging

### Performance Issues

**Symptoms**: Hooks causing slow responses
**Solutions**:
- Optimize hook scripts (add `--quiet` flags)
- Increase timeout in hooks configuration
- Cache expensive operations in hook scripts
- Consider disabling non-essential hooks

### Path Issues

**Symptoms**: Scripts not found or permission errors
**Solutions**:
- Use absolute paths in hook commands
- Ensure scripts are executable: `chmod +x .resources/scripts/hooks/*.sh`
- Verify working directory context in hooks
- Test scripts manually before enabling hooks

## Advanced Usage

### Hook Chaining

Hooks can work together for comprehensive validation:

1. **Pre-task** validates context
2. **Agent execution** with automatic context distillation by /develop command
3. **Post-task** validates output and updates files
4. **Pre-edit** enforces quality before file changes

### Integration with CI/CD

Hooks can integrate with external systems:

```bash
# Add to hook scripts
# Send notifications to Slack/Discord
# Update external project management tools
# Trigger additional CI/CD pipeline steps
```

### Metrics and Monitoring

Track hook effectiveness:

```bash
# Add metrics collection to hook scripts
# Track validation pass/fail rates
# Monitor TDD compliance rates
# Measure context quality improvements
```

## Best Practices

### Hook Development

1. **Keep hooks fast** - minimize execution time
2. **Provide clear feedback** - actionable error messages
3. **Support override mechanisms** - `--force` flags for exceptional cases
4. **Log appropriately** - info/warn/error as appropriate
5. **Test thoroughly** - verify hooks work in all scenarios

### Workflow Integration

1. **Start with warnings** - enable blocking gradually
2. **Document exceptions** - when/why to use overrides
3. **Train team** - ensure everyone understands hook behavior
4. **Monitor effectiveness** - track metrics and adjust as needed
5. **Keep hooks updated** - evolve with workflow improvements

### Security Considerations

1. **Validate input** - hook scripts receive external input
2. **Limit permissions** - hooks run with user credentials
3. **Audit hook changes** - review hook script modifications
4. **Secure temp files** - clean up temporary context files
5. **Log security events** - track hook security-related actions

## Migration from Script-Based Workflow

If migrating from manual script execution:

1. **Test hooks alongside scripts** initially
2. **Gradually enable blocking behavior**
3. **Update documentation** to reflect automatic enforcement
4. **Train team** on new hook-based workflow
5. **Remove manual script calls** once hooks are validated

The hooks-based approach provides seamless, automatic enforcement while maintaining the flexibility to override when necessary.
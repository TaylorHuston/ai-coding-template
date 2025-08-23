# Troubleshooting Guide

**Version**: 1.0.0  
**Created**: 2025-08-22  
**Last Updated**: 2025-08-22  
**Status**: Active  
**Target Audience**: Developers, AI Assistants

This guide helps resolve common issues when using the AI Coding Template.

## Common Issues and Solutions

### AI Assistant Issues

#### AI Forgets Context

**Problem**: AI contradicts previous decisions or recreates existing code

**Solutions**:

1. Update and share `status.md` at session start
2. Reference specific files: "Check the existing auth implementation in src/auth/"
3. Use context-analyzer agent: "Please analyze the current project state first"
4. Share `docs/technical.md` for architecture context

#### Agent Not Working as Expected

**Problem**: Agent provides generic instead of specialized responses

**Solutions**:

1. Be explicit: "Please use the frontend-specialist agent for this task"
2. Provide context: Share relevant docs/technical.md sections
3. Check agent documentation: `.claude/agents/[agent-name].md`
4. Verify agent is appropriate for the task

#### AI Creates Duplicate Code

**Problem**: AI writes code that already exists in the project

**Solutions**:

```bash
# Before asking AI to implement:
1. Ask AI to search first: "Search for existing authentication implementations"
2. Use Glob tool: "Find all files matching *auth* pattern"
3. Use context-analyzer: "Analyze existing authentication patterns"
```

### Script and Tool Issues

#### Scripts Not Executing

**Problem**: Permission denied when running scripts

**Solution**:

```bash
# Make all scripts executable
chmod +x scripts/*.sh
chmod +x scripts/**/*.sh

# Verify permissions
ls -la scripts/
```

#### Setup Manager Failures

**Problem**: `setup-manager.sh` fails with errors

**Solutions**:

```bash
# Check prerequisites
which git node npm

# Run in verbose mode
./scripts/setup-manager.sh check --verbose

# Try minimal setup
./scripts/setup-manager.sh quick
```

#### AI Status Dashboard Issues

**Problem**: `ai-status.sh` shows errors or incomplete information

**Solutions**:

```bash
# Check required files exist
ls -la CLAUDE.md status.md docs/technical.md

# Run diagnostics
./scripts/ai-status.sh --check

# Create missing files
touch status.md
echo "# Project Status" > status.md
```

### Documentation Issues

#### Documentation Out of Sync

**Problem**: Documentation doesn't match current code

**Solution**:

```bash
# Check documentation health
node scripts/docs-health.js

# Request documentation update:
"Using the technical-writer agent, update docs to match current implementation"

# Or use docs-sync-agent:
"Please sync documentation with recent code changes"
```

#### Missing Documentation

**Problem**: Key features lack documentation

**Solutions**:

1. Use technical-writer agent: "Document the authentication system"
2. Check deliverables for specs: `deliverables/*/issues/*/docs/`
3. Generate from code: "Analyze src/auth and create documentation"

### Integration Issues

#### Conflicts with Existing Project Structure

**Problem**: Template conflicts with current project setup

**Solutions**:

```bash
# Use gradual integration
cp -r .claude/ your-project/
cp CLAUDE.md your-project/

# Adapt to your structure
# Don't force template structure on existing projects
```

#### Git Hook Conflicts

**Problem**: Template git hooks conflict with existing hooks

**Solutions**:

```bash
# Backup existing hooks
cp .git/hooks/* .git/hooks.backup/

# Merge hooks manually
cat template-hook >> .git/hooks/pre-commit
```

### Workflow Issues

#### Deliverables System Confusion

**Problem**: Unclear how to use deliverables system

**Solution**:

```
deliverables/
├── [deliverable-name]/
│   └── issues/
│       └── [ISSUE-KEY]/
│           ├── README.md
│           ├── ISSUE-KEY-plan.md
│           └── docs/
```

Example:

```bash
# Create new issue
mkdir -p deliverables/auth/issues/AUTH-001
cp deliverables/template-deliverable/issues/template/* deliverables/auth/issues/AUTH-001/
```

### Environment Issues

#### Node Version Incompatibility

**Problem**: Scripts fail with Node.js errors

**Solution**:

```bash
# Check Node version
node --version  # Should be 16.x or higher

# Use nvm to switch versions
nvm use 16
# or
nvm install 16 && nvm use 16
```

#### Missing Dependencies

**Problem**: Scripts fail due to missing packages

**Solution**:

```bash
# Install global dependencies
npm install -g prettier eslint

# For Python projects
pip install -r requirements.txt

# For Ruby projects
bundle install
```

### Performance Issues

#### Slow Script Execution

**Problem**: Scripts take too long to run

**Solutions**:

```bash
# Use minimal options
./scripts/ai-status.sh --minimal

# Skip expensive checks
./scripts/setup-manager.sh quick --skip-validation

# Run specific checks only
./scripts/docs-health.js --file README.md
```

#### Large Context Window Issues

**Problem**: AI struggles with large files

**Solutions**:

1. Break large files into smaller modules
2. Use file offsets: "Read lines 100-200 of large-file.js"
3. Summarize first: "Summarize the main functions in large-file.js"

## Platform-Specific Issues

### macOS

#### Script Compatibility

```bash
# Install GNU tools
brew install coreutils findutils gnu-sed

# Use GNU versions
alias sed=gsed
alias find=gfind
```

### Windows (WSL)

#### Line Ending Issues

```bash
# Configure git for Windows
git config --global core.autocrlf input

# Convert scripts to Unix format
dos2unix scripts/*.sh
```

#### Permission Issues

```bash
# WSL permission fix
chmod -R 755 scripts/
chmod -R 644 docs/
```

### Linux

#### SELinux/AppArmor Issues

```bash
# Temporarily disable for testing
sudo setenforce 0  # SELinux

# Check AppArmor status
sudo aa-status
```

## Error Messages Reference

### Common Error Messages

| Error                       | Cause               | Solution                |
| --------------------------- | ------------------- | ----------------------- |
| `command not found`         | Missing dependency  | Install required tool   |
| `Permission denied`         | File permissions    | Use `chmod +x`          |
| `No such file or directory` | Missing file        | Create required file    |
| `SyntaxError`               | Wrong Node version  | Update Node.js          |
| `Module not found`          | Missing npm package | Run `npm install`       |
| `Agent not found`           | Typo in agent name  | Check `.claude/agents/` |
| `Context too large`         | File too big        | Split or summarize      |

## Debugging Techniques

### Enable Verbose Mode

```bash
# Most scripts support verbose mode
./scripts/setup-manager.sh check --verbose
./scripts/ai-status.sh --verbose --debug
```

### Check Logs

```bash
# Check script logs
tail -f scripts/logs/setup.log
tail -f scripts/logs/ai-status.log
```

### Validate Configuration

```bash
# Run validation suite
./scripts/validate-all.sh

# Check specific components
./scripts/validate-agents.sh
./scripts/validate-docs.sh
```

## Getting Help

### Self-Help Resources

1. **Check Documentation**:

   - Quick Reference: `docs/quick-reference/`
   - Agent docs: `.claude/agents/INDEX.md`
   - Guides: `docs/guides/`

2. **Run Diagnostics**:

   ```bash
   ./scripts/setup-manager.sh check
   ./scripts/ai-status.sh --diagnostics
   ```

3. **Ask AI for Help**:
   - "What agents are available and what do they do?"
   - "How do I troubleshoot [specific issue]?"
   - "Use context-analyzer to check project health"

### Community Support

1. **GitHub Issues**: Open issue with `question` or `bug` label
2. **Discussions**: Check GitHub Discussions for similar issues
3. **Contributing**: See [CONTRIBUTING.md](../CONTRIBUTING.md)

## Prevention Tips

### Best Practices

1. **Regular Updates**:

   - Keep `status.md` current
   - Update `docs/technical.md` with changes
   - Run health checks weekly

2. **Session Management**:

   - Start sessions with context files
   - Use agents appropriately
   - Document decisions in real-time

3. **Team Coordination**:
   - Share context files
   - Document AI usage patterns
   - Maintain consistent structure

### Maintenance Tasks

```bash
# Weekly maintenance
./scripts/docs-health.js
./scripts/validate-all.sh
git clean -fd  # Remove untracked files

# Monthly maintenance
./scripts/cleanup-old-sessions.sh
./scripts/optimize-agents.sh
```

## Emergency Recovery

### Complete Reset

```bash
# Backup current state
cp -r . ../project-backup

# Reset to clean state
git clean -fdx
git reset --hard
./scripts/setup-manager.sh full
```

### Partial Recovery

```bash
# Reset just agents
rm -rf .claude/agents/
./scripts/setup-manager.sh agents-only

# Reset just scripts
rm -rf scripts/
./scripts/setup-manager.sh scripts-only
```

---

Still having issues? Check our [FAQ](./faq.md) or open a GitHub issue for support.

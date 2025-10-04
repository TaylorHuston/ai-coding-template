---
version: "0.1.0"
created: "2025-08-22"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "ai-assistants", "team-leads"]
document_type: "troubleshooting"
difficulty: "intermediate"
tags: ["troubleshooting", "debugging", "common-issues", "systematic-debugging"]
---

# Troubleshooting Guide

**Comprehensive troubleshooting guide for AI template issues and systematic debugging procedures.**

This guide combines AI template-specific troubleshooting with systematic debugging procedures for development issues.

## Quick Reference

### Emergency Issues
- **AI gives generic responses**: See [Agent Issues](#agent-not-working-as-expected)
- **Scripts won't run**: See [Permission Issues](#scripts-not-executing)
- **App won't start**: See [Application Recovery](#application-not-starting)
- **Production down**: See [Emergency Recovery](#emergency-recovery)

### Common Quick Fixes
```bash
# Make scripts executable
chmod +x .resources/scripts/*.sh

# Refresh AI context
/refresh

# Reset dependencies
rm -rf node_modules && npm install

# Check recent changes
git log --oneline -10
```

## Systematic Troubleshooting Process

### 1. Information Gathering (5 minutes)
- [ ] What exactly is the problem? (Specific error messages, unexpected behavior)
- [ ] When did it start happening? (Recent changes, deployments, updates)
- [ ] What was working before? (Last known good state)
- [ ] Can you reproduce it consistently? (Steps to reproduce)
- [ ] What environment? (Development, staging, production)

### 2. Quick Checks (5 minutes)
- [ ] Check git log for recent changes: `git log --oneline -10`
- [ ] Check system resources: `htop` or `top`
- [ ] Check error logs: `tail -100 logs/error.log`
- [ ] Check service status: `systemctl status service-name` or equivalent
- [ ] Check network connectivity: `ping`, `curl`, `wget`

### 3. Systematic Investigation (15-30 minutes)
- [ ] Follow specific troubleshooting sections below
- [ ] Document findings in STATUS.md or deliverables/
- [ ] Update decision log with investigation results

## Common Issues and Solutions

### AI Assistant Issues

#### AI Forgets Context

**Problem**: AI contradicts previous decisions or recreates existing code

**Solutions**:

1. Update and share `STATUS.md` at session start
2. Reference specific files: "Check the existing auth implementation in src/auth/"
3. Use context-analyzer agent: "Please analyze the current project state first"
4. Share `CLAUDE.md` for system guidelines and context

#### Agent Not Working as Expected

**Problem**: Agent provides generic instead of specialized responses

**Solutions**:

1. Be explicit: "Please use the frontend-specialist agent for this task"
2. Provide context: Share relevant CLAUDE.md and quality-standards.md sections
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

### 📊 Metrics System Issues

#### No Metrics Data Collected

**Problem**: Empty metrics files or no data in `.claude/metrics/*.jsonl`

**Diagnosis**:
```bash
# Check if metrics are enabled
grep "enabled:" .claude/metrics/config.yml

# Verify metrics directory exists
ls -la .claude/metrics/

# Check file permissions
ls -la .claude/metrics/*.jsonl

# Test JSON validity
jq . .claude/metrics/*.jsonl > /dev/null
```

**Solutions**:
1. **Enable Metrics Collection**:
   ```bash
   # Edit config file
   sed -i 's/enabled: false/enabled: true/' .claude/metrics/config.yml
   ```

2. **Fix Directory Permissions**:
   ```bash
   # Ensure proper permissions
   chmod 755 .claude/metrics/
   chmod 644 .claude/metrics/*.jsonl
   chmod 644 .claude/metrics/config.yml
   ```

3. **Initialize Missing Files**:
   ```bash
   # Create missing JSONL files
   touch .claude/metrics/{commands,agents,scripts}.jsonl

   # Verify configuration exists
   test -f .claude/metrics/config.yml || echo "Config file missing"
   ```

#### Metrics Collection Performance Impact

**Problem**: Commands running slowly due to metrics collection

**Symptoms**:
- Commands take significantly longer to execute
- System shows high I/O usage during command execution
- Memory usage increases during metrics collection

**Solutions**:
1. **Reduce Collection Level**:
   ```yaml
   # In .claude/metrics/config.yml
   collection:
     level: "basic"  # Change from "detailed" to "basic"
     sampling_rate: 0.5  # Collect only 50% of events
   ```

2. **Disable Heavy Collectors**:
   ```yaml
   collection:
     collectors:
       commands: true
       agents: true
       scripts: false  # Disable if not needed
       workflows: false
   ```

3. **Optimize Storage Settings**:
   ```yaml
   storage:
     retention_days: 30  # Reduce from 90 days
     max_size_mb: 50     # Reduce from 100MB
     flush_interval_seconds: 60  # Increase from 30
   ```

#### Corrupted Metrics Data

**Problem**: JSON parsing errors or invalid data in metrics files

**Diagnosis**:
```bash
# Find corrupted lines
for file in .claude/metrics/*.jsonl; do
    echo "Checking $file:"
    cat -n "$file" | while read line; do
        echo "$line" | cut -f2- | jq . >/dev/null 2>&1 || echo "Invalid JSON at line: $line"
    done
done
```

**Solutions**:
1. **Clean Corrupted Files**:
   ```bash
   # Backup and clean corrupted files
   cp .claude/metrics/commands.jsonl .claude/metrics/commands.jsonl.backup

   # Remove invalid lines (recreates file with only valid JSON)
   jq -c . .claude/metrics/commands.jsonl.backup > .claude/metrics/commands.jsonl.temp
   mv .claude/metrics/commands.jsonl.temp .claude/metrics/commands.jsonl
   ```

2. **Reset Metrics Data**:
   ```bash
   # Complete reset (loses historical data)
   rm .claude/metrics/*.jsonl
   touch .claude/metrics/{commands,agents,scripts}.jsonl
   ```

#### Metrics Query Issues

**Problem**: Query scripts return no results or errors

**Diagnosis**:
```bash
# Test basic query functionality
./.resources/scripts/metrics/query-metrics.sh --type command --limit 1

# Check script permissions
ls -la .resources/scripts/metrics/query-metrics.sh

# Verify dependencies
which jq || echo "jq not installed"
which bash || echo "bash not available"
```

**Solutions**:
1. **Install Missing Dependencies**:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install jq

   # macOS
   brew install jq

   # Alpine
   apk add jq
   ```

2. **Fix Script Permissions**:
   ```bash
   chmod +x .resources/scripts/metrics/*.sh
   ```

3. **Test with Simple Query**:
   ```bash
   # Start with basic test
   echo '{"test": "data"}' | jq .

   # Then test metrics query
   ./.resources/scripts/metrics/query-metrics.sh --help
   ```

#### Metrics Storage Issues

**Problem**: Metrics files growing too large or running out of disk space

**Symptoms**:
- Large `.claude/metrics/*.jsonl` files
- Disk space warnings
- Slow query performance

**Solutions**:
1. **Configure Retention Policies**:
   ```yaml
   # In .claude/metrics/config.yml
   storage:
     retention_days: 30
     max_size_mb: 50
     rotation: "daily"
   ```

2. **Manual Cleanup**:
   ```bash
   # Archive old data
   mkdir -p .claude/metrics/archive/$(date +%Y-%m)
   mv .claude/metrics/*.jsonl .claude/metrics/archive/$(date +%Y-%m)/
   touch .claude/metrics/{commands,agents,scripts}.jsonl
   ```

3. **Optimize Data Collection**:
   ```yaml
   performance:
     batch_size: 20          # Increase batch size
     flush_interval_seconds: 60  # Reduce flush frequency
     sampling_rate: 0.8      # Reduce collection rate
   ```

#### Agent Metrics Not Recording

**Problem**: Agent invocations not appearing in metrics

**Diagnosis**:
```bash
# Check if agent collector is enabled
grep -A5 "collectors:" .claude/metrics/config.yml

# Test agent metric recording
source .resources/scripts/metrics/agent-metrics.sh
track_agent_start "test-agent" "Test task" "manual" "test"
track_agent_end "completed" "none" '[]' 0

# Check if data was recorded
tail -1 .claude/metrics/agents.jsonl | jq .
```

**Solutions**:
1. **Enable Agent Collection**:
   ```yaml
   # In config.yml
   collectors:
     agents: true
   ```

2. **Verify Integration**:
   ```bash
   # Check if agent hooks are properly integrated
   grep -r "agent-metrics.sh" .claude/commands/
   ```

3. **Manual Testing**:
   ```bash
   # Test agent metrics collection manually
   source .resources/scripts/metrics/agent-metrics.sh
   track_agent_start "manual-test" "Testing metrics" "user" "troubleshooting"
   # ... do some work ...
   track_agent_end "completed" "opus" '["Read", "Edit"]' 1500
   ```

#### Report Generation Failures

**Problem**: `generate-report.sh` script fails or produces empty reports

**Diagnosis**:
```bash
# Test report generation with debug output
bash -x ./.resources/scripts/metrics/generate-report.sh --period 1d --type summary

# Check if data exists for the period
./.resources/scripts/metrics/query-metrics.sh --range 1d --limit 5
```

**Solutions**:
1. **Verify Data Availability**:
   ```bash
   # Check if any data exists
   wc -l .claude/metrics/*.jsonl

   # Check data from last 24 hours
   ./.resources/scripts/metrics/query-metrics.sh --range 1d --stats
   ```

2. **Test with Different Periods**:
   ```bash
   # Try longer period
   ./.resources/scripts/metrics/generate-report.sh --period 7d --type summary

   # Try basic format
   ./.resources/scripts/metrics/generate-report.sh --format text
   ```

3. **Manual Report Testing**:
   ```bash
   # Create simple manual report
   echo "=== Manual Metrics Report ===" > test-report.txt
   echo "Commands in last 7 days:" >> test-report.txt
   ./.resources/scripts/metrics/query-metrics.sh --type command --range 7d --format csv >> test-report.txt
   ```

### Script and Tool Issues

#### Scripts Not Executing

**Problem**: Permission denied when running scripts

**Solution**:

```bash
# Make all scripts executable
chmod +x .resources/scripts/*.sh
chmod +x .resources/scripts/**/*.sh

# Verify permissions
ls -la .resources/scripts/
```

#### Setup Manager Failures

**Problem**: `setup-manager.sh` fails with errors

**Solutions**:

```bash
# Check prerequisites
which git node npm

# Run in verbose mode
./.resources/scripts/setup-manager.sh check --verbose

# Try minimal setup
./.resources/scripts/setup-manager.sh quick
```

**Specific Issue**: Script stops after "Archived template README" or exits with LOG_FILE error at line 617

**Root Cause**: Empty LOG_FILE variable causing append operations to fail

**Solution**: This was fixed in the latest template version. If using an older copy:
```bash
# Ensure you're using the latest template version
# The fix involves updating all LOG_FILE append operations in .resources/scripts/lib/logging.sh
# from: [[ -n "${LOG_FILE:-}" ]] && echo "text" >> "$LOG_FILE"
# to: if [[ -n "${LOG_FILE:-}" ]]; then echo "text" >> "${LOG_FILE}"; fi
```

#### AI Status Dashboard Issues

**Problem**: `ai-status.sh` shows errors or incomplete information

**Solutions**:

```bash
# Check required files exist
ls -la CLAUDE.md STATUS.md docs/quality-standards.md

# Run diagnostics
./.resources/scripts/ai-status.sh --check

# Create missing files
touch STATUS.md
echo "# Project Status" > STATUS.md
```

### Documentation Issues

#### Documentation Out of Sync

**Problem**: Documentation doesn't match current code

**Solution**:

```bash
# Check documentation health
node .resources/scripts/docs-health.js

# Request documentation update:
"Using the technical-writer agent, update docs to match current implementation"

# Or use technical-writer:
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
./.resources/scripts/ai-status.sh --minimal

# Skip expensive checks
./.resources/scripts/setup-manager.sh quick --skip-validation

# Run specific checks only
./.resources/scripts/docs-health.js --file README.md
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
dos2unix .resources/scripts/*.sh
```

#### Permission Issues

```bash
# WSL permission fix
chmod -R 755 .resources/scripts/
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

### AI Template Error Messages

| Error                       | Cause               | Solution                |
| --------------------------- | ------------------- | ----------------------- |
| `Agent not found`           | Typo in agent name  | Check `.claude/agents/` |
| `Context too large`         | File too big        | Split or summarize      |
| `MCP server not found`      | Missing MCP server  | Install via marketplace |
| `Permission denied for mcp_*` | Missing permission | Add to settings.local.json |

### System Error Messages

| Error                       | Cause               | Solution                |
| --------------------------- | ------------------- | ----------------------- |
| `command not found`         | Missing dependency  | Install required tool   |
| `Permission denied`         | File permissions    | Use `chmod +x`          |
| `No such file or directory` | Missing file        | Create required file    |
| `SyntaxError`               | Wrong Node version  | Update Node.js          |
| `Module not found`          | Missing npm package | Run `npm install`       |
| `EADDRINUSE`               | Port already in use | Kill process or use different port |
| `ECONNREFUSED`             | Service not running | Start service or check configuration |
| `ENOTFOUND`                | DNS resolution issue | Check network/DNS settings |

## Debugging Techniques

### Enable Verbose Mode

```bash
# Most scripts support verbose mode
./.resources/scripts/setup-manager.sh check --verbose
./.resources/scripts/ai-status.sh --verbose --debug
```

### Check Logs

```bash
# Check script logs
tail -f .resources/scripts/logs/setup.log
tail -f .resources/scripts/logs/ai-status.log
```

### Validate Configuration

```bash
# Run validation suite
./.resources/scripts/validate-all.sh

# Check specific components
./.resources/scripts/validate-agents.sh
./.resources/scripts/validate-docs.sh
```

## Getting Help

### Self-Help Resources

1. **Check Documentation**:

   - Quick Reference: `docs/reference/`
   - Agent docs: `.claude/agents/README.md`
   - Guides: `docs/guides/`

2. **Run Diagnostics**:

   ```bash
   ./.resources/scripts/setup-manager.sh check
   ./.resources/scripts/ai-status.sh --diagnostics
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

   - Keep `STATUS.md` current
   - Update documentation to reflect changes
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
./.resources/scripts/docs-health.js
./.resources/scripts/validate-all.sh
git clean -fd  # Remove untracked files

# Monthly maintenance
./.resources/scripts/cleanup-old-sessions.sh
./.resources/scripts/optimize-agents.sh
```

## Prevention and Monitoring

### Before Making Changes
- [ ] Create backup or branch
- [ ] Test in development environment
- [ ] Document changes in decision log
- [ ] Have rollback plan ready
- [ ] Inform team of changes

### Monitoring Setup
- [ ] Error logging configured
- [ ] Performance monitoring active
- [ ] Alerting rules set up
- [ ] Health checks implemented
- [ ] Backup processes verified

### Escalation Path

#### When to Escalate
- [ ] Security breach or data exposure
- [ ] Production system completely down >30 minutes
- [ ] Data corruption or loss detected
- [ ] Multiple systems affected simultaneously
- [ ] Issue beyond current troubleshooting capabilities

#### Escalation Process
1. **Immediate**: Notify team lead or on-call engineer
2. **Document**: Create incident record with timeline
3. **Communicate**: Update stakeholders with status
4. **Preserve**: Capture logs and system state
5. **Follow-up**: Conduct post-incident review

## Documentation Template

When troubleshooting, document findings:

```markdown
## Issue: [Brief description]

**Date**: [YYYY-MM-DD HH:MM]
**Environment**: [Dev/Staging/Production]
**Impact**: [High/Medium/Low]

### Symptoms
- [What was observed]

### Investigation Steps
1. [Step taken and result]
2. [Another step and result]

### Root Cause
[What caused the issue]

### Resolution
[How it was fixed]

### Prevention
[How to prevent in future]
```

## Application Issues

### Application Not Starting

#### Dependency Issues
```bash
# Node.js
rm -rf node_modules package-lock.json
npm install
npm audit fix

# Python
pip install --upgrade pip
pip install -r requirements.txt
python -m pip check

# Go
go mod download
go mod tidy
go mod verify
```

#### Environment Issues
```bash
# Check environment variables
printenv | grep APP_
echo $NODE_ENV
echo $PORT

# Verify environment file
cat .env
ls -la .env*

# Check file permissions
ls -la
chmod +x start-script.sh
```

#### Port Issues
```bash
# Check what's using the port
lsof -i :3000
netstat -tulpn | grep :3000
ss -tulpn | grep :3000

# Kill process using port
kill -9 $(lsof -ti:3000)
pkill -f "node.*3000"
```

### Performance Issues

#### High CPU Usage
```bash
# Identify CPU-intensive processes
htop
top -o cpu
ps aux --sort=-%cpu | head -10

# Profile application (Node.js example)
node --prof app.js
node --prof-process isolate-*.log > processed.txt
```

#### High Memory Usage
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head -10

# Check for memory leaks (Node.js)
node --inspect app.js
# Use Chrome DevTools for memory profiling
```

#### Slow Database Queries
```bash
# PostgreSQL slow query log
grep "duration:" /var/log/postgresql/postgresql.log
# Check query execution plans
EXPLAIN ANALYZE SELECT ...;

# MySQL slow query log
mysqldumpslow /var/log/mysql/slow.log
# Check query execution plans
EXPLAIN SELECT ...;
```

## Network and Connectivity Issues

### Connection Refused
```bash
# Check if service is running
ps aux | grep service-name
systemctl status service-name

# Check if port is open
telnet hostname port
nc -zv hostname port

# Check firewall rules
iptables -L
ufw status
```

### Timeout Issues
```bash
# Test connectivity with timeout
curl --connect-timeout 10 --max-time 30 https://api.example.com

# Check DNS resolution
nslookup api.example.com
dig api.example.com

# Trace network route
traceroute api.example.com
mtr api.example.com
```

## Database Issues

### Connection Problems
```bash
# Test database connection
# PostgreSQL
psql -h hostname -U username -d database_name -c "SELECT 1;"

# MySQL
mysql -h hostname -u username -p -e "SELECT 1;"

# MongoDB
mongo --host hostname:port/database --eval "db.runCommand('ping')"
```

### Database Performance Issues
```bash
# Check active connections
# PostgreSQL
psql -c "SELECT count(*) FROM pg_stat_activity;"

# MySQL
mysql -e "SHOW PROCESSLIST;"

# Check database size
# PostgreSQL
psql -c "SELECT pg_size_pretty(pg_database_size('database_name'));"
```

## Git and Version Control Issues

### Merge Conflicts
```bash
# Check conflict status
git status
git diff --name-only --diff-filter=U

# Resolve conflicts
git mergetool
# Or manually edit files and:
git add resolved-file.js
git commit
```

### Repository Issues
```bash
# Check repository integrity
git fsck
git gc --aggressive

# Reset to clean state (destructive!)
git clean -fd
git reset --hard HEAD

# Check remote connectivity
git remote -v
git ls-remote origin
```

## Docker and Container Issues

### Container Problems
```bash
# Check container status
docker ps -a
docker logs container-name
docker exec -it container-name /bin/bash

# Resource usage
docker stats
docker system df

# Clean up resources
docker system prune
docker volume prune
docker image prune
```

### Docker Compose Issues
```bash
# Check service status
docker-compose ps
docker-compose logs service-name

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Build and Compilation Issues

### Node.js Build Problems
```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check Node version compatibility
node --version
npm --version
nvm use 18  # if using nvm
```

### Python Build Problems
```bash
# Virtual environment issues
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Package conflicts
pip list --outdated
pip freeze > current-requirements.txt
pip uninstall -y -r current-requirements.txt
pip install -r requirements.txt
```

## Authentication and Security Issues

### API Authentication
```bash
# Test API with curl
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/test

# Check token validity
# JWT tokens can be decoded at jwt.io
echo $TOKEN | base64 -d

# Check environment variables
echo $API_KEY
echo $JWT_SECRET
```

### SSH/Git Authentication
```bash
# Test SSH connection
ssh -T git@github.com
ssh -vT git@github.com  # verbose output

# Check SSH keys
ls -la ~/.ssh/
ssh-add -l

# Generate new SSH key if needed
ssh-keygen -t ed25519 -C "email@example.com"
```

## Log Analysis

### Application Logs
```bash
# Recent errors
grep -i "error" logs/*.log | tail -20
grep -i "exception" logs/*.log | tail -20
grep -i "fail" logs/*.log | tail -20

# Pattern analysis
awk '/ERROR/ {print $1, $2, $NF}' logs/app.log | sort | uniq -c
```

### System Logs
```bash
# System errors
journalctl --since "1 hour ago" --priority=err
dmesg | tail -20

# Service-specific logs
journalctl -u service-name --since today
journalctl -u service-name -f  # follow logs
```

## Emergency Recovery

### Application Recovery
```bash
# Rollback to previous version
git checkout HEAD~1
# Or specific commit
git checkout abc123

# Restart all services
systemctl restart nginx
systemctl restart app-service
docker-compose restart
```

### Database Recovery
```bash
# Create backup before recovery
mysqldump database_name > backup-$(date +%Y%m%d_%H%M%S).sql
pg_dump database_name > backup-$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
mysql database_name < backup.sql
psql database_name < backup.sql
```

### AI Template Recovery

#### Complete Reset
```bash
# Backup current state
cp -r . ../project-backup

# Reset to clean state
git clean -fdx
git reset --hard
./.resources/scripts/setup-manager.sh full
```

#### Partial Recovery
```bash
# Reset just agents
rm -rf .claude/agents/
./.resources/scripts/setup-manager.sh agents-only

# Reset just scripts
rm -rf .resources/scripts/
./.resources/scripts/setup-manager.sh scripts-only
```

## Frequently Asked Questions

### General Questions

#### Q: Do I need to use all 17 agents?

**A**: No! Agents activate automatically based on your needs. Start simple and discover agents as you work. Most developers regularly use 5-6 agents.

#### Q: Can I use this with tools other than Claude Code?

**A**: Yes! While optimized for Claude Code, the patterns work with:
- Cursor
- GitHub Copilot
- Continue.dev
- Any AI coding assistant that supports custom instructions

#### Q: What if my project uses Python/Ruby/Go instead of JavaScript?

**A**: The template is language-agnostic. Simply:
1. Adapt the examples to your language
2. Update documentation with your tech stack details
3. Use appropriate specialist agents
4. Follow your language's conventions

### Setup Questions

#### Q: Can I integrate this into an existing large project?

**A**: Yes! Use the gradual integration approach:
1. Start with just `.claude/` directory
2. Add context files (CLAUDE.md, STATUS.md)
3. Gradually adopt agents and workflows
4. See the integration guide for details

#### Q: What are the minimum requirements?

**A**: Minimal setup needs:
- Git
- Node.js 16+ (for scripts)
- A code editor
- An AI coding assistant (Claude Code, Cursor, etc.)

### Workflow Questions

#### Q: How do I handle merge conflicts with AI changes?

**A**: Follow these steps:
1. Always create feature branches for AI work
2. Review AI changes before committing
3. Use small, atomic commits
4. Have AI explain complex changes in commit messages

#### Q: Should AI assistants commit directly?

**A**: No, always review first:
1. Have AI show proposed changes
2. Review for correctness and style
3. Test the changes
4. Then approve the commit

#### Q: Can multiple developers use AI on the same project?

**A**: Yes! Best practices include:
1. Share `STATUS.md` updates regularly
2. Use consistent agent patterns
3. Document AI usage in commit messages
4. Coordinate through the deliverables system

### Technical Questions

#### Q: How do I customize agents for my project?

**A**: Edit agent definitions in `.claude/agents/`:
1. Modify existing agent instructions
2. Add project-specific context
3. Create custom agents if needed
4. Test with specific scenarios

#### Q: Can I disable certain agents?

**A**: Yes, several ways:
1. Remove agent file from `.claude/agents/`
2. Mark agent as inactive in its metadata
3. Simply don't invoke that agent
4. Use custom CLAUDE.md instructions

#### Q: How much context should I share with AI?

**A**: Follow the minimal effective context principle:
1. Start with high-level files (README, CLAUDE.md)
2. Add specific files as needed
3. Use agents to analyze context automatically
4. Avoid overwhelming with unnecessary files

---

Still having issues? Open a GitHub issue for support or contribute improvements to this guide.

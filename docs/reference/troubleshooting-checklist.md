---
title: "Troubleshooting Checklist"
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-08-22"
status: "active"
target_audience: ["development-team", "ai-assistants"]
tags: ["troubleshooting", "checklist", "debugging", "problem-solving"]
category: "Reference"
description: "Systematic troubleshooting guide for common development issues."
---

# Troubleshooting Checklist

Systematic troubleshooting guide for common development issues.

## General Troubleshooting Process

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
- [ ] Follow specific troubleshooting tree below
- [ ] Document findings in deliverables/[DELIVERABLE]/issues/{ISSUE-KEY}/analysis/
- [ ] Update decision log with investigation results

## Application Not Starting

### Dependency Issues
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

### Environment Issues
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

### Port Issues
```bash
# Check what's using the port
lsof -i :3000
netstat -tulpn | grep :3000
ss -tulpn | grep :3000

# Kill process using port
kill -9 $(lsof -ti:3000)
pkill -f "node.*3000"
```

## Performance Issues

### High CPU Usage
```bash
# Identify CPU-intensive processes
htop
top -o cpu
ps aux --sort=-%cpu | head -10

# Profile application (Node.js example)
node --prof app.js
node --prof-process isolate-*.log > processed.txt
```

### High Memory Usage
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head -10

# Check for memory leaks (Node.js)
node --inspect app.js
# Use Chrome DevTools for memory profiling
```

### Slow Database Queries
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

## Network Issues

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

### Performance Issues
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

## Git Issues

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

## Docker Issues

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

## Build Issues

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

## Authentication Issues

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

## Log Analysis Checklist

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

## Prevention Checklist

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

## Escalation Path

### When to Escalate
- [ ] Security breach or data exposure
- [ ] Production system completely down >30 minutes
- [ ] Data corruption or loss detected
- [ ] Multiple systems affected simultaneously
- [ ] Issue beyond current troubleshooting capabilities

### Escalation Process
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
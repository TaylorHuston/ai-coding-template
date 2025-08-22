# Development Commands Quick Reference

**Version**: 1.0.0
**Created**: 2025-08-21
**Last Updated**: 2025-08-22
**Status**: Active
**Target Audience**: Development Team, AI Assistants

Essential commands for common development tasks.

## Documentation Tools

### Documentation Health Dashboard
```bash
node scripts/docs-health.js
```
**Output**: Overall health score, freshness analysis, completeness metrics

### Generate Documentation from Template
```bash
node scripts/generate-doc.js
```
**Interactive**: Prompts for template selection and variable values

### Check Documentation Links
```bash
node scripts/check-docs-links.js
```
**Output**: Broken links report, orphaned files detection

### Documentation Change History
```bash
node scripts/docs-changelog.js
```
**Output**: Recent changes, author activity, categorized modifications

## Project Setup Commands

### Initialize New Issue Workspace
```bash
# Create directory (replace with your issue key format)
mkdir workbench/PROJ-123

# Copy templates
cp workbench/template/*_plan.md workbench/PROJ-123/proj-123_plan.md
cp -r workbench/template/docs/ workbench/PROJ-123/docs/

# Create additional directories
mkdir workbench/PROJ-123/analysis
mkdir workbench/PROJ-123/temp
```

### Quick Project Status Update
```bash
# Edit status file
$EDITOR status.md

# Check git status for context
git status
git log --oneline -5
```

## Git Workflow Commands

### Standard Git Workflow
```bash
# Check current status
git status
git diff

# Stage changes
git add .

# Commit with conventional format
git commit -m "feat: add new feature implementation

- Add core functionality
- Update documentation
- Add tests for new feature

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push changes
git push
```

### Branch Management
```bash
# Create feature branch
git checkout -b feature/PROJ-123-description

# Switch between branches
git checkout main
git checkout develop
git checkout feature/PROJ-123-description

# Merge feature branch
git checkout main
git merge feature/PROJ-123-description
git branch -d feature/PROJ-123-description
```

## Testing Commands

### Run Tests (Language Agnostic Examples)
```bash
# Node.js/JavaScript
npm test
npm run test:watch
npm run test:coverage

# Python
python -m pytest
pytest --cov=src tests/

# Go
go test ./...
go test -v ./...

# Rust
cargo test
cargo test --release
```

### Code Quality Checks
```bash
# Node.js
npm run lint
npm run format
npm run typecheck

# Python  
black src/
flake8 src/
mypy src/

# Go
go fmt ./...
golint ./...
go vet ./...
```

## Build and Deployment Commands

### Development Build
```bash
# Node.js
npm run dev
npm run start:dev

# Python
python manage.py runserver
flask run --debug

# Go
go run main.go
air  # if using air for hot reload
```

### Production Build
```bash
# Node.js
npm run build
npm run start

# Python
python manage.py collectstatic
gunicorn app:app

# Go
go build -o app main.go
./app
```

## Environment Management

### Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Edit environment file
$EDITOR .env

# Load environment (if needed)
source .env
export $(cat .env | xargs)
```

### Dependency Management
```bash
# Node.js
npm install
npm install package-name
npm install --save-dev dev-package
npm audit
npm audit fix

# Python
pip install -r requirements.txt
pip install package-name
pip freeze > requirements.txt
pip list --outdated

# Go
go mod download
go mod tidy
go get package-name
```

## Database Commands

### Database Operations (Examples)
```bash
# Node.js with Prisma
npx prisma generate
npx prisma db push
npx prisma migrate dev
npx prisma studio

# Python Django
python manage.py makemigrations
python manage.py migrate
python manage.py shell
python manage.py createsuperuser

# SQL Direct
psql -d database_name
mysql -u username -p database_name
sqlite3 database.db
```

## Debugging Commands

### Log Analysis
```bash
# View recent logs
tail -f logs/app.log
tail -100 /var/log/app.log

# Search logs
grep "ERROR" logs/app.log
grep -n "exception" logs/app.log

# Real-time log monitoring
less +F logs/app.log
```

### Process Management
```bash
# Check running processes
ps aux | grep node
ps aux | grep python
lsof -i :3000  # Check what's using port 3000

# Kill processes
pkill -f "node server"
kill -9 PID_NUMBER
```

## Performance Analysis

### Resource Usage
```bash
# System resources
htop
top
free -h
df -h

# Application performance
time command_name
/usr/bin/time -v command_name

# Network analysis
netstat -tulpn
ss -tulpn
curl -w "@curl-format.txt" -o /dev/null -s "http://example.com"
```

## Security Commands

### Security Checks
```bash
# Node.js security audit
npm audit
npm audit fix

# Python security check
bandit -r src/
safety check

# Git secrets scanning
git secrets --scan
git secrets --scan-history
```

## Quick Debugging

### Network Debugging
```bash
# Test connectivity
ping hostname
curl -I https://example.com
wget --spider https://example.com

# DNS lookup
nslookup example.com
dig example.com
```

### File System Debugging
```bash
# Find files
find . -name "*.md" -type f
locate filename
which command_name

# Disk usage
du -sh directory/
du -h --max-depth=1 .

# File permissions
ls -la
chmod +x script.sh
chown user:group file
```

## Emergency Commands

### Service Recovery
```bash
# Restart services (systemd)
sudo systemctl restart service-name
sudo systemctl status service-name
sudo journalctl -u service-name

# Docker recovery
docker-compose restart
docker-compose logs service-name
docker system prune
```

### Backup Commands
```bash
# Quick backup
cp -r project/ project-backup-$(date +%Y%m%d)
tar -czf backup-$(date +%Y%m%d).tar.gz project/

# Git backup
git bundle create backup.bundle --all
```

## Customization

### Add Project-Specific Commands
Edit this file to add commands specific to your project:

```bash
# Your custom commands here
# Example: Start all services
start-services() {
    docker-compose up -d
    npm run dev
}
```

### Environment Aliases
Add to your shell profile (~/.bashrc, ~/.zshrc):

```bash
# Project shortcuts
alias proj="cd /path/to/project"
alias docs-health="node scripts/docs-health.js"
alias start-dev="npm run dev"
```
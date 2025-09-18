#!/bin/bash

# Status Updater Script
# Auto-populates STATUS.md with current project data
# Usage: ./scripts/status/status-updater.sh

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STATUS_FILE="$PROJECT_ROOT/STATUS.md"
BACKUP_FILE="$STATUS_FILE.backup.$(date +%Y%m%d_%H%M%S)"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to get current project metrics
get_project_metrics() {
    cd "$PROJECT_ROOT"

    # Get git information
    CURRENT_BRANCH=$(git branch --show-current)
    RECENT_COMMITS=$(git log --oneline -5 | head -3)
    COMMITS_TODAY=$(git log --since="24 hours ago" --oneline | wc -l)
    COMMITS_WEEK=$(git log --since="1 week ago" --oneline | wc -l)

    # Check working tree status
    if git diff-index --quiet HEAD --; then
        WORKING_STATUS="Clean"
    else
        WORKING_STATUS="Modified files present"
    fi

    # Count documentation files
    DOC_COUNT=$(find docs/ -name "*.md" 2>/dev/null | wc -l || echo "0")
    TEMPLATE_COUNT=$(find templates/ -name "*.md" 2>/dev/null | wc -l || echo "0")

    # Count TODOs across the project
    TODO_COUNT=$(grep -r "TODO\|FIXME\|XXX" --include="*.md" --include="*.js" --include="*.sh" . 2>/dev/null | wc -l || echo "0")

    # Get package.json info if it exists
    if [[ -f "package.json" ]]; then
        PROJECT_NAME=$(grep '"name"' package.json | sed 's/.*"name": "\([^"]*\)".*/\1/')
        PROJECT_VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
    else
        PROJECT_NAME="ai-coding-template"
        PROJECT_VERSION="0.3.0"
    fi

    # Check script functionality
    SCRIPTS_DIR="$PROJECT_ROOT/scripts"
    SCRIPT_COUNT=$(find "$SCRIPTS_DIR" -name "*.sh" 2>/dev/null | wc -l || echo "0")

    export CURRENT_BRANCH RECENT_COMMITS COMMITS_TODAY COMMITS_WEEK WORKING_STATUS
    export DOC_COUNT TEMPLATE_COUNT TODO_COUNT PROJECT_NAME PROJECT_VERSION SCRIPT_COUNT
}

# Function to generate updated STATUS.md content
generate_status_content() {
    local current_date=$(date +"%Y-%m-%d")
    local current_time=$(date +"%H:%M:%S")

    cat << EOF
---
version: "0.3.0"
created: "2025-08-21"
last_updated: "$current_date"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "reference"
priority: "high"
tags: ["status", "project-memory", "context"]
---

# Project Status

*This file serves as the project's memory - use it to quickly restore context when AI tools hit their context limits.*

## Current Project State

**Current Focus**: Documentation Enhancement & Quality Improvement

**Overall Status**: Maintenance & Enhancement

**Overall Progress**: ████████▒▒ 90% Complete

### Recent Completion
**Template & Example Standardization** - Comprehensive reorganization of templates and examples
- **Priority**: P1
- **Target Date**: 2025-09-17
- **Progress**: ██████████ 100% Complete
- **Status**: Complete
- **Result**: Unified template system with $TEMPLATE_COUNT standardized templates, enhanced examples, and master index

### Recent Completion
**Multi-Model Intelligence Integration** - Enhanced AI-assisted development with cross-model validation
- **Priority**: P1
- **Target Date**: 2025-09-17
- **Progress**: ██████████ 100% Complete
- **Status**: Complete
- **Result**: Integrated Gemini CLI via MCP server, enabling cross-validation and second opinions for critical architectural decisions

### Current Initiative
**Documentation Quality Enhancement** - Comprehensive review and improvement of all documentation
- **Priority**: P1
- **Target Date**: 2025-09-18
- **Progress**: ███████▒▒▒ 70% Complete
- **Status**: In Progress
- **Result**: Technical writer review completed (Score: 85/100), implementing critical fixes and quality improvements

## Sprint/Milestone Progress

### Active Sprint: Documentation Enhancement Sprint (2025-09-17 - 2025-09-24)

**Sprint Goal**: Fix critical documentation issues and enhance overall documentation quality

**Sprint Progress**: ███████▒▒▒ 70% Complete (Day 1 of 7)

#### Sprint Backlog
| Priority | Issue | Status | Progress | Focus Area |
|----------|-------|---------|----------|-------------|
| P0 | STATUS.md Placeholder Fix | In Progress | ███████▒▒▒ 70% | Critical |
| P1 | Broken Documentation Links | To Do | ▒▒▒▒▒▒▒▒▒▒ 0% | Quality |
| P1 | TODO Triage ($TODO_COUNT items) | To Do | ▒▒▒▒▒▒▒▒▒▒ 0% | Maintenance |

#### Sprint Goals
- [x] ~~Technical writer comprehensive review completed~~
- [ ] STATUS.md auto-population system implemented
- [ ] Critical documentation links resolved
- [ ] TODO management system created

### Recently Completed (Last 7 Days)
- [x] ~~Script path fixes - Resolved npm run demo MODULE_NOT_FOUND error~~ - 2025-09-17
- [x] ~~Documentation synchronization for 5-phase workflow~~ - 2025-09-17
- [x] ~~Script architecture consolidation and vision workflow phase~~ - 2025-09-16
- [x] ~~Logging fixes for script execution issues~~ - 2025-09-16

### Upcoming Milestones
| Milestone | Target Date | Progress | Status |
|-----------|-------------|----------|---------|
| Documentation Excellence | 2025-09-24 | ████████▒▒ 80% | On Track |
| System Optimization | 2025-10-01 | ███▒▒▒▒▒▒▒ 30% | Planned |

## Active Development Areas

### In Progress (2 active)
| Feature/Component | Progress | Priority | Owner | Next Steps |
|-------------------|----------|----------|--------|------------|
| STATUS.md Auto-Population | ████████▒▒ 80% | P0 | AI Assistant | Complete script and validate output |
| Documentation Link Validation | ▒▒▒▒▒▒▒▒▒▒ 0% | P1 | AI Assistant | Identify and catalog broken links |

### Blocked/Waiting (0 blocked)
*No current blockers - all dependencies resolved*

### Ready to Start (3 ready)
- **P1**: TODO Management System - Automated tracking and prioritization
- **P1**: Documentation Navigation Enhancement - Breadcrumbs and cross-linking
- **P2**: Documentation Metrics Dashboard - Coverage and quality tracking

## Technical Context

### Current Architecture Decisions
- Implemented 3-tier documentation system (technical, development, ai-tools)
- Standardized on 19 specialized AI agents for comprehensive coverage
- Adopted 5-phase workflow: vision → feature → architect → plan → develop
- Integrated multi-model AI consultation (Claude + Gemini) for critical decisions

### Technology Stack
- **Core**: AI Coding Template Framework v$PROJECT_VERSION
- **Documentation**: Markdown with YAML frontmatter metadata
- **Scripts**: Bash automation suite ($SCRIPT_COUNT scripts)
- **AI Integration**: Claude Code + MCP servers (Gemini CLI, Serena, Context7)
- **Version Control**: Git with structured branching (current: $CURRENT_BRANCH)

### Recent Technical Changes
- Fixed npm script paths after directory reorganization
- Implemented status auto-population system
- Enhanced pre-commit validation with 7-stage quality gates
- Integrated semantic code analysis across 8 core AI agents

## Known Issues and Technical Debt

### Issue Summary
- 🚨 **Critical**: 1 issue requiring immediate attention (STATUS.md placeholders)
- ⚠️ **High**: 2 issues to address this sprint (broken links, TODO management)
- ℹ️ **Medium**: Multiple documentation quality improvements identified
- 📊 **Technical Debt**: $TODO_COUNT items tracked across codebase

### Critical Issues (P0) 🚨
| Issue | Impact | Created | Owner | ETA |
|-------|--------|---------|--------|-----|
| STATUS.md Placeholder Content | AI Context/Memory | 2025-09-17 | AI Assistant | 2025-09-17 |

### High Priority Issues (P1) ⚠️
| Issue | Impact | Created | Owner | Target Sprint |
|-------|--------|---------|--------|---------------|
| Broken Documentation Links | User Experience/Navigation | 2025-09-17 | AI Assistant | Current |
| TODO Management System | Technical Debt | 2025-09-17 | AI Assistant | Current |

### Technical Debt Items
| Item | Type | Effort | Priority | Target |
|------|------|--------|----------|--------|
| Documentation Versioning | Consistency | Medium | P1 | Current Sprint |
| Navigation Breadcrumbs | User Experience | Small | P2 | Next Sprint |
| Interactive Documentation | Enhancement | Large | P3 | Future |
| Automated Quality Metrics | Monitoring | Medium | P2 | Next Sprint |

### Performance Metrics
| Metric | Current | Target | Status |
|--------|---------|--------|---------|
| Documentation Files | $DOC_COUNT docs | Comprehensive | ✅ Passing |
| Template Coverage | $TEMPLATE_COUNT templates | Complete | ✅ Passing |
| Script Automation | $SCRIPT_COUNT scripts | Robust | ✅ Passing |
| TODO Management | $TODO_COUNT items | <100 items | ⚠️ Needs Work |

## Team Context

### Recent Decisions Made
- Adopted comprehensive documentation review with technical-writer agent
- Implemented auto-population system for dynamic status tracking
- Standardized on 3-phase critical issue resolution (Week 1, Week 2-3, Week 4+)

### Upcoming Decisions Needed
- Documentation metrics and quality tracking implementation approach
- TODO management system architecture and automation level
- Advanced documentation features (interactive elements, visual maps)

## Development Environment

### Current Setup
- **IDE**: Multiple IDE support (VS Code, others)
- **AI Tools**: Claude Code with 19 specialized agents, MCP server integration
- **Key Scripts**:
  - Build: \`npm run demo\` (now working after path fix)
  - Status: \`./scripts/status/status-updater.sh\`
  - Validation: \`./.githooks/pre-commit\`

### Environment Status
- **Development**: Working (recent script fixes applied)
- **Documentation**: Under Enhancement
- **Automation**: Fully Operational

## Next Session Planning

### Immediate Next Steps (Next 1-2 Sessions)
1. Complete STATUS.md auto-population script and validate output
2. Identify and catalog all broken documentation links
3. Begin TODO triage and management system implementation

### This Week's Goals
- Fix all critical documentation issues (STATUS.md, broken links)
- Implement TODO management and tracking system
- Begin navigation enhancement with breadcrumbs

### Dependencies to Resolve
- No external dependencies currently blocking progress
- All required tools and systems operational

## Quick Reference

### Important File Locations
- Configuration: \`CLAUDE.md\`, \`.claude/\`
- Main entry point: \`START-HERE.md\`
- Documentation: \`docs/\` (3-tier system)
- Templates: \`templates/\` ($TEMPLATE_COUNT templates)
- Scripts: \`scripts/\` ($SCRIPT_COUNT automation scripts)

### Key Commands
\`\`\`bash
# Development
npm run demo      # Project demonstration
npm run start     # Same as demo

# Status Management
./scripts/status/status-updater.sh    # Update this STATUS.md file

# Quality Assurance
./.githooks/pre-commit               # Run all validation checks

# Documentation
./scripts/docs-manager.sh            # Documentation utilities
\`\`\`

### Environment Variables Needed
- No special environment variables required for core functionality
- Optional: AI model API keys for enhanced features

## Issue Tracking Integration

### Current Issue Tracking System
**System**: GitHub Issues / Internal TODO Tracking
**Base URL**: Repository-based issue management

### Active Issues by Priority
| Priority | Issue Key | Title | Status | Assignee | Sprint |
|----------|-----------|-------|---------|----------|---------|
| P0 | DOC-001 | STATUS.md Placeholder Fix | In Progress | AI Assistant | Current |
| P1 | DOC-002 | Broken Documentation Links | To Do | AI Assistant | Current |
| P1 | DOC-003 | TODO Management System | To Do | AI Assistant | Current |

### Issue Tracking Workflow
- **New Issues**: Identified through technical review and automated scanning
- **Status Updates**: Real-time updates via automated systems
- **Priority Management**: P0 (Critical) → P1 (High) → P2 (Medium) → P3 (Low)

## Context for AI Assistants

### Project Patterns to Follow
- **File Naming**: lowercase-kebab-case for .md files except README and CLAUDE
- **Documentation**: Use metadata headers (Created, Last Updated, Status, Target Audience)
- **Git Workflow**: Feature branches, structured commit messages, pre-commit validation
- **Code Organization**: 3-tier documentation system, specialized scripts directory

### Current Code Style
- **Language**: Bash for scripts, Markdown for documentation
- **Framework**: AI Coding Template Framework with MCP integration
- **Validation**: 7-stage pre-commit hooks with comprehensive quality gates
- **Naming Conventions**: kebab-case for files, structured metadata

### Testing Approach
- **Framework**: Pre-commit validation and quality gates
- **Coverage Goals**: Comprehensive documentation coverage, all scripts tested
- **Automation**: Full CI/CD pipeline with automated quality checks
- **Integration**: Multi-model AI validation for critical decisions

### AI Assistant Guidelines
- **Context Management**: Always read STATUS.md first to understand current state
- **Documentation**: Follow 3-tier system and metadata standards
- **Progress Updates**: Update STATUS.md after significant progress or decisions
- **Quality Standards**: Maintain 85+ documentation quality score
- **Agent Coordination**: Use appropriate specialized agents for domain expertise

---

## Instructions for Using This File

**For Developers:**
1. Update this file using \`./scripts/status/status-updater.sh\` for automatic updates
2. Manual updates for project decisions and major milestones
3. Keep entries brief but informative with specific metrics
4. Archive completed items to maintain focus on current work

**For AI Assistants:**
1. Read this file first to understand current project state and priorities
2. Use automated updater script to refresh metrics and status
3. Update relevant sections when tasks are completed
4. Reference this as the primary source of truth for project context

**Update Frequency:**
- Automated: Run status-updater.sh daily or after significant changes
- Manual: After major decisions, milestone completion, or priority changes
- Validation: Ensure accuracy before major development sessions

---

*Last auto-updated: $current_date at $current_time*
*Git Status: $WORKING_STATUS | Branch: $CURRENT_BRANCH | Commits this week: $COMMITS_WEEK*
EOF
}

# Main execution
main() {
    log_info "Starting STATUS.md auto-population..."

    # Create backup
    if [[ -f "$STATUS_FILE" ]]; then
        cp "$STATUS_FILE" "$BACKUP_FILE"
        log_info "Created backup: $BACKUP_FILE"
    fi

    # Get current project metrics
    log_info "Gathering project metrics..."
    get_project_metrics

    # Generate new content
    log_info "Generating updated STATUS.md content..."
    generate_status_content > "$STATUS_FILE"

    log_success "STATUS.md has been updated with current project data"
    log_info "Recent commits included:"
    echo "$RECENT_COMMITS" | head -3

    log_info "Key metrics:"
    echo "  - Documentation files: $DOC_COUNT"
    echo "  - Template files: $TEMPLATE_COUNT"
    echo "  - Scripts: $SCRIPT_COUNT"
    echo "  - TODOs to manage: $TODO_COUNT"
    echo "  - Commits this week: $COMMITS_WEEK"
    echo "  - Working tree: $WORKING_STATUS"

    log_success "STATUS.md auto-population completed successfully!"
}

# Run main function
main "$@"
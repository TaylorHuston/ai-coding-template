#!/bin/bash
# Unified Setup Manager for AI Coding Template
# Consolidates all setup scripts into a single entry point
# Usage: ./scripts/setup-manager.sh <command> [options]

set -e

# Source shared libraries
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/lib/colors.sh" ]]; then
    source "$SCRIPT_DIR/lib/colors.sh"
fi
if [[ -f "$SCRIPT_DIR/lib/logging.sh" ]]; then
    source "$SCRIPT_DIR/lib/logging.sh"
fi

# Configuration
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"
ENV_LOCAL_FILE="$PROJECT_ROOT/.env.local"
ENV_EXAMPLE="$PROJECT_ROOT/.env.example"

# Display usage
show_usage() {
    log_header "AI Coding Template Setup Manager"
    cat << EOF
USAGE:
    $0 <command> [options]

COMMANDS:
    quick           Quick setup with minimal configuration
    full            Complete development environment setup
    init-project    Transform template into a real project
    env             Setup environment files only
    git             Setup git configuration and hooks
    tools           Install and verify development tools
    check           Verify setup completeness

OPTIONS:
    --skip-tools    Skip tool installation checks
    --skip-git      Skip git configuration
    --force         Force overwrite existing configurations
    --verbose       Show detailed output

EXAMPLES:
    $0 quick                 # Quick start for new developers
    $0 full --verbose        # Complete setup with details
    $0 init-project          # Transform template to your project
    $0 env --force           # Reset environment files
    $0 check                 # Verify current setup

EOF
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local has_errors=false
    
    # Check uv (required for semantic code analysis)
    if command -v uv &> /dev/null; then
        local uv_version=$(uv version 2>/dev/null | head -1)
        log_success "uv installed: $uv_version"
    else
        log_error "uv not installed (required for Serena semantic tools)"
        log_info "Install with: curl -LsSf https://astral.sh/uv/install.sh | sh"
        has_errors=true
    fi

    # Check Node.js (optional but recommended)
    if command -v node &> /dev/null; then
        local node_version=$(node -v)
        log_success "Node.js installed: $node_version"
    else
        log_warning "Node.js not installed (optional but recommended)"
        log_info "Install from: https://nodejs.org/"
    fi
    
    # Check npm/yarn/pnpm
    if command -v npm &> /dev/null; then
        local npm_version=$(npm -v)
        log_success "npm installed: $npm_version"
    elif command -v yarn &> /dev/null; then
        local yarn_version=$(yarn -v)
        log_success "Yarn installed: $yarn_version"
    elif command -v pnpm &> /dev/null; then
        local pnpm_version=$(pnpm -v)
        log_success "pnpm installed: $pnpm_version"
    else
        log_warning "No Node package manager found"
        log_info "Install npm, yarn, or pnpm for Node.js projects"
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        local git_version=$(git --version | cut -d' ' -f3)
        log_success "Git installed: $git_version"
    else
        log_error "Git not installed (required)"
        has_errors=true
    fi

    # Check jq (required for git hooks)
    if command -v jq &> /dev/null; then
        local jq_version=$(jq --version)
        log_success "jq installed: $jq_version"
    else
        log_error "jq not installed (required for git hooks)"
        log_info "Install with: sudo apt-get install jq (Ubuntu/Debian) or brew install jq (macOS)"
        has_errors=true
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        if docker info >/dev/null 2>&1; then
            log_success "Docker is running"
        else
            log_warning "Docker installed but not running"
            log_info "Start Docker if needed for containerized development"
        fi
    else
        log_info "Docker not installed (optional for containerized development)"
    fi
    
    if [[ "$has_errors" == "true" ]]; then
        log_error "Please install missing prerequisites before continuing"
        return 1
    fi
    
    return 0
}

# Setup environment files
setup_env() {
    local force=$1
    
    log_info "Setting up environment files..."
    
    # Check if .env exists
    if [[ -f "$ENV_FILE" ]] && [[ "$force" != "true" ]]; then
        log_success ".env file exists"
    else
        if [[ -f "$ENV_EXAMPLE" ]]; then
            cp "$ENV_EXAMPLE" "$ENV_FILE"
            log_success "Created .env from .env.example"
            log_warning "Please update .env with your specific configuration"
        else
            # Create basic .env file
            cat > "$ENV_FILE" << 'EOF'
# Environment Configuration for AI Coding Template
# Update these values based on your project needs

# Development Settings
NODE_ENV=development
PORT=3000

# Add your project-specific environment variables here
# DATABASE_URL=
# API_KEY=
# SECRET_KEY=

EOF
            log_success "Created basic .env file"
            log_info "Add your project-specific environment variables"
        fi
    fi
    
    # Check if .env.local exists
    if [[ -f "$ENV_LOCAL_FILE" ]] && [[ "$force" != "true" ]]; then
        log_success ".env.local file exists"
    else
        # Create minimal .env.local
        cat > "$ENV_LOCAL_FILE" << 'EOF'
# Local environment overrides
# This file should not be committed to version control
# Add any local-specific configurations here

# Example local overrides:
# PORT=3001
# DEBUG=true
EOF
        log_success "Created .env.local file"
    fi
    
    # Add .env.local to .gitignore if not already there
    if [[ -f "$PROJECT_ROOT/.gitignore" ]]; then
        if ! grep -q "\.env\.local" "$PROJECT_ROOT/.gitignore"; then
            echo ".env.local" >> "$PROJECT_ROOT/.gitignore"
            log_info "Added .env.local to .gitignore"
        fi
    fi
}

# Setup git configuration
setup_git() {
    log_info "Setting up git configuration..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_info "Initializing git repository..."
        git init
        log_success "Git repository initialized"
    fi
    
    # Setup basic .gitignore if it doesn't exist
    if [[ ! -f "$PROJECT_ROOT/.gitignore" ]]; then
        cat > "$PROJECT_ROOT/.gitignore" << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Environment files
.env.local
.env.*.local

# Build outputs
dist/
build/
.next/
out/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Temporary folders
tmp/
temp/
EOF
        log_success "Created .gitignore file"
    fi
    
    # Setup basic git hooks directory
    local hooks_dir="$PROJECT_ROOT/.git/hooks"
    if [[ -d "$hooks_dir" ]]; then
        # Create a simple pre-commit hook
        cat > "$hooks_dir/pre-commit" << 'EOF'
#!/bin/bash
# AI Coding Template pre-commit hook

echo "Running pre-commit checks..."

# Check for merge conflict markers
if git diff --cached --check --exit-code; then
    echo "✅ No merge conflict markers found"
else
    echo "❌ Merge conflict markers found. Please resolve conflicts."
    exit 1
fi

# Run linting if script exists
if [[ -f "package.json" ]] && npm list --depth=0 | grep -q eslint; then
    echo "Running ESLint..."
    npm run lint --silent 2>/dev/null || {
        echo "⚠️  ESLint failed. Consider running 'npm run lint:fix'"
        # Don't fail the commit for linting issues
    }
fi

echo "✅ Pre-commit checks passed"
EOF
        chmod +x "$hooks_dir/pre-commit"
        log_success "Git pre-commit hook installed"
    fi
}

# Install and verify tools
setup_tools() {
    log_info "Setting up development tools..."
    
    # If package.json exists, install dependencies
    if [[ -f "$PROJECT_ROOT/package.json" ]]; then
        log_info "Installing Node.js dependencies..."
        cd "$PROJECT_ROOT"
        
        if command -v pnpm &> /dev/null; then
            pnpm install
        elif command -v yarn &> /dev/null; then
            yarn install
        elif command -v npm &> /dev/null; then
            npm install
        else
            log_warning "No package manager found, skipping dependency installation"
            return 0
        fi
        
        log_success "Dependencies installed"
    fi
    
    # Check for required system tools
    local required_tools=("git" "jq")
    local optional_tools=("node" "code")

    for tool in "${required_tools[@]}"; do
        if command -v "$tool" &> /dev/null; then
            log_success "$tool is available"
        else
            log_error "$tool is required but not found"
            log_info "Please install $tool and try again"
            return 1
        fi
    done

    # Check for optional development tools
    for tool in "${optional_tools[@]}"; do
        if command -v "$tool" &> /dev/null; then
            log_success "$tool is available"
        else
            log_info "$tool not found (optional)"
        fi
    done
}

# Quick setup
quick_setup() {
    log_header "Quick Setup"
    
    check_prerequisites || return 1
    log_section "Prerequisites Check Complete"
    
    setup_env false
    log_section "Environment Setup Complete"
    
    setup_git
    log_section "Git Setup Complete"
    
    log_success "Quick setup complete!"
    echo ""
    log_info "Next steps:"
    echo "1. Update .env with your project-specific configuration"
    echo "2. Review and customize .gitignore for your project"
    echo "3. Run './scripts/setup-manager.sh check' to verify setup"
}

# Full setup
full_setup() {
    local skip_tools=$1
    local skip_git=$2
    
    log_header "Full Development Setup"
    
    check_prerequisites || return 1
    log_section "Prerequisites Check Complete"
    
    setup_env false
    log_section "Environment Setup Complete"
    
    if [[ "$skip_git" != "true" ]]; then
        setup_git
        log_section "Git Setup Complete"
    fi
    
    if [[ "$skip_tools" != "true" ]]; then
        setup_tools
        log_section "Tools Setup Complete"
    fi
    
    # Run status check
    log_section "Running Status Check"
    "$SCRIPT_DIR/ai-status.sh" --human
    
    log_success "Full setup complete!"
    echo ""
    log_info "Your development environment is ready!"
    echo ""
    log_info "Available commands:"
    echo "  • Check status: ./scripts/ai-status.sh"
    echo "  • Check docs health: node scripts/docs-health.js"
    echo "  • Verify setup: ./scripts/setup-manager.sh check"
}

# Check setup completeness
check_setup() {
    log_header "Checking Setup Status"
    
    local all_good=true
    
    # Check prerequisites
    if check_prerequisites; then
        log_success "Prerequisites check passed"
    else
        all_good=false
    fi
    
    log_section "Environment Files"
    if [[ -f "$ENV_FILE" ]]; then
        log_success ".env exists"
    else
        log_error ".env missing"
        all_good=false
    fi
    
    if [[ -f "$ENV_LOCAL_FILE" ]]; then
        log_success ".env.local exists"
    else
        log_warning ".env.local missing (optional)"
    fi
    
    log_section "Git Configuration"
    if git rev-parse --git-dir > /dev/null 2>&1; then
        log_success "Git repository initialized"
    else
        log_error "Not a git repository"
        all_good=false
    fi
    
    if [[ -f "$PROJECT_ROOT/.gitignore" ]]; then
        log_success ".gitignore exists"
    else
        log_warning ".gitignore missing"
    fi
    
    log_section "Project Structure"
    local key_dirs=("scripts" "docs" ".claude")
    for dir in "${key_dirs[@]}"; do
        if [[ -d "$PROJECT_ROOT/$dir" ]]; then
            log_success "$dir/ directory exists"
        else
            log_info "$dir/ directory missing (may not be needed for your project)"
        fi
    done

    log_section "MCP Configuration"
    if [[ -f "$PROJECT_ROOT/.mcp.json" ]]; then
        log_success ".mcp.json exists"


        # Verify MCP server availability (non-blocking)
        if command -v npx &> /dev/null; then
            log_info "MCP servers can be installed via npx (Node.js package manager)"
        else
            log_warning "npx not available - MCP servers may not work"
        fi
    else
        log_warning ".mcp.json missing (optional for enhanced AI capabilities)"
    fi
    
    if [[ "$all_good" == "true" ]]; then
        log_success "Setup is complete and working!"
    else
        log_warning "Some setup steps are incomplete"
        log_info "Run: $0 full   to complete setup"
    fi
}

# Claude Code verification
check_claude_code() {
    log_info "Verifying Claude Code installation..."

    if ! command -v claude &> /dev/null; then
        log_warning "Claude Code not found"
        log_info "Claude Code provides the best AI-assisted development experience"
        log_info "Install from: https://claude.ai/code"
        echo

        read -p "$(log_color yellow "Continue without Claude Code? [y/N]: ")" continue_anyway
        if [[ ! "$continue_anyway" =~ ^[Yy] ]]; then
            log_error "Please install Claude Code and run setup again"
            log_info "After installation, run: ./scripts/setup-manager.sh init-project"
            exit 1
        fi

        log_warning "Proceeding without Claude Code (some features may be limited)"
        return 1
    else
        local claude_version=$(claude --version 2>/dev/null || echo "unknown")
        log_success "Claude Code detected: $claude_version"
        return 0
    fi
}

# Project type selection with intelligent defaults
select_project_type() {
    log_header "🎯 Project Discovery"
    log_info "Let's understand what you're building to provide the best setup..."
    echo

    echo "$(log_color cyan "What type of project are you creating?")"
    echo "  1) 🌐 Web Application (React, Vue, Angular, etc.)"
    echo "  2) 🔗 API/Backend Service (Node.js, Python, Go, etc.)"
    echo "  3) ⚡ CLI Tool/Utility"
    echo "  4) 📦 JavaScript Library/Package"
    echo "  5) 📱 Mobile Application (React Native, Flutter, etc.)"
    echo "  6) 🏢 Enterprise Application (with compliance needs)"
    echo

    local project_type=""
    while [[ -z "$project_type" ]]; do
        read -p "$(log_color yellow "Select [1-6]: ")" selection
        case $selection in
            1) project_type="web-app"; break ;;
            2) project_type="api-service"; break ;;
            3) project_type="cli-tool"; break ;;
            4) project_type="library"; break ;;
            5) project_type="mobile-app"; break ;;
            6) project_type="enterprise"; break ;;
            *) log_warning "Please select 1-6" ;;
        esac
    done

    echo "$project_type"
}

# Business context discovery
discover_business_context() {
    local project_type=$1

    echo
    log_info "Understanding your business context..."
    echo

    echo "$(log_color cyan "What's the business context for this project?")"
    echo "  1) 🏢 B2B SaaS Application"
    echo "  2) 👥 Consumer Application"
    echo "  3) 🏭 Internal Company Tool"
    echo "  4) 🌍 Open Source Project"
    echo "  5) 📚 Educational/Learning Project"
    echo "  6) 🔬 Research/Prototype"
    echo

    local business_context=""
    while [[ -z "$business_context" ]]; do
        read -p "$(log_color yellow "Select [1-6]: ")" selection
        case $selection in
            1) business_context="b2b-saas"; break ;;
            2) business_context="consumer"; break ;;
            3) business_context="internal"; break ;;
            4) business_context="open-source"; break ;;
            5) business_context="educational"; break ;;
            6) business_context="research"; break ;;
            *) log_warning "Please select 1-6" ;;
        esac
    done

    echo "$business_context"
}

# Team context discovery
discover_team_context() {
    echo
    log_info "Understanding your team setup..."
    echo

    echo "$(log_color cyan "What's your team structure?")"
    echo "  1) 👤 Solo developer"
    echo "  2) 👥 Small team (2-5 people)"
    echo "  3) 🏢 Medium team (5-15 people)"
    echo "  4) 🏗️ Enterprise team (15+ people)"
    echo

    local team_size=""
    while [[ -z "$team_size" ]]; do
        read -p "$(log_color yellow "Select [1-4]: ")" selection
        case $selection in
            1) team_size="solo"; break ;;
            2) team_size="small"; break ;;
            3) team_size="medium"; break ;;
            4) team_size="enterprise"; break ;;
            *) log_warning "Please select 1-4" ;;
        esac
    done

    echo "$team_size"
}

# External system integration discovery
configure_external_systems() {
    local team_size=$1

    # Skip for solo developers unless they specifically want it
    if [[ "$team_size" == "solo" ]]; then
        read -p "$(log_color yellow "Do you use external project management or documentation tools? [y/N]: ")" use_external
        if [[ ! "$use_external" =~ ^[Yy] ]]; then
            return 0
        fi
    fi

    echo
    log_info "Let's connect your existing development tools..."
    echo

    # Project Management
    echo "$(log_color cyan "Project Management System:")"
    echo "  1) Jira"
    echo "  2) Linear"
    echo "  3) GitHub Issues"
    echo "  4) Asana"
    echo "  5) None/Other"
    echo

    read -p "$(log_color yellow "Select [1-5]: ")" pm_selection
    local pm_system=""
    local pm_url=""
    local pm_project=""

    case $pm_selection in
        1) pm_system="jira" ;;
        2) pm_system="linear" ;;
        3) pm_system="github" ;;
        4) pm_system="asana" ;;
        5) pm_system="none" ;;
    esac

    if [[ "$pm_system" != "none" ]]; then
        read -p "$(log_color yellow "Base URL (e.g., company.atlassian.net): ")" pm_url
        read -p "$(log_color yellow "Project key/identifier: ")" pm_project
    fi

    # Documentation System
    echo
    echo "$(log_color cyan "Documentation System:")"
    echo "  1) Confluence"
    echo "  2) Notion"
    echo "  3) GitBook"
    echo "  4) Just Git/Markdown"
    echo "  5) None/Other"
    echo

    read -p "$(log_color yellow "Select [1-5]: ")" doc_selection
    local doc_system=""
    local doc_url=""

    case $doc_selection in
        1) doc_system="confluence" ;;
        2) doc_system="notion" ;;
        3) doc_system="gitbook" ;;
        4) doc_system="git" ;;
        5) doc_system="none" ;;
    esac

    if [[ "$doc_system" != "none" && "$doc_system" != "git" ]]; then
        read -p "$(log_color yellow "Documentation base URL: ")" doc_url
    fi

    # Export for use in template generation
    export PM_SYSTEM="$pm_system"
    export PM_URL="$pm_url"
    export PM_PROJECT="$pm_project"
    export DOC_SYSTEM="$doc_system"
    export DOC_URL="$doc_url"
}

# Enhanced project vision generation
generate_project_vision() {
    local project_name="$1"
    local project_description="$2"
    local business_context="$3"
    local project_type="$4"

    log_info "Generating comprehensive project vision..."

    mkdir -p "$PROJECT_ROOT/docs/technical"

    # Create project vision document
    cat > "$PROJECT_ROOT/docs/technical/project-vision.md" << EOF
---
title: "$project_name Project Vision"
created: "$(date +"%Y-%m-%d")"
status: "draft"
business_context: "$business_context"
project_type: "$project_type"
---

# $project_name - Project Vision

## Problem Statement

$project_description

## Target Audience

### Primary Users
$(case $business_context in
    "b2b-saas") echo "- Business professionals seeking to improve their workflow efficiency
- Companies looking to streamline their operations
- Teams requiring collaborative solutions" ;;
    "consumer") echo "- End consumers looking for intuitive solutions
- Users seeking better user experiences
- Individuals wanting to solve personal challenges" ;;
    "internal") echo "- Internal team members and stakeholders
- Employees requiring improved tools
- Management seeking operational efficiency" ;;
    "open-source") echo "- Developers and technical contributors
- Users seeking open alternatives
- Community members wanting to contribute" ;;
    "educational") echo "- Students and learners
- Educators and instructors
- Anyone exploring new concepts" ;;
    "research") echo "- Researchers and academics
- Industry professionals
- Innovation teams" ;;
esac)

### Secondary Users
- Technical implementers and developers
- System administrators and operators
- Support and customer success teams

## Success Metrics

### Primary KPIs
$(case $business_context in
    "b2b-saas") echo "- Monthly Recurring Revenue (MRR) growth
- Customer Acquisition Cost (CAC) reduction
- Net Promoter Score (NPS) > 50
- Customer retention rate > 90%" ;;
    "consumer") echo "- Daily/Monthly Active Users growth
- User engagement metrics
- App store ratings > 4.5
- User retention rates" ;;
    "internal") echo "- Employee productivity improvement
- Process efficiency gains
- Cost reduction metrics
- User satisfaction scores" ;;
    "open-source") echo "- GitHub stars and forks
- Community contributions
- Issue resolution time
- Documentation quality scores" ;;
    "educational") echo "- Learning outcome improvements
- Student engagement metrics
- Knowledge retention rates
- Completion rates" ;;
    "research") echo "- Research output quality
- Collaboration effectiveness
- Discovery acceleration
- Publication impact" ;;
esac)

### Technical KPIs
- System uptime > 99.9%
- Response time < 200ms (P95)
- Zero critical security vulnerabilities
- Test coverage > 80%

## Competitive Landscape

### Direct Competitors
- [Competitor 1]: [Key differentiator]
- [Competitor 2]: [Key differentiator]
- [Competitor 3]: [Key differentiator]

### Our Unique Value Proposition
- **AI-Enhanced Development**: Built with intelligent development workflows
- **Quality by Design**: Comprehensive testing and validation from day one
- **Scalable Architecture**: Designed for growth and evolution
- **Developer Experience**: Optimized for team productivity

## Technical Vision

### Architecture Principles
$(case $project_type in
    "web-app") echo "- Component-driven development
- Progressive Web App capabilities
- Mobile-first responsive design
- Performance-optimized delivery" ;;
    "api-service") echo "- RESTful API design principles
- Microservices architecture
- Event-driven communication
- Horizontal scalability" ;;
    "cli-tool") echo "- POSIX compliance
- Cross-platform compatibility
- Plugin-based extensibility
- Zero-dependency operation" ;;
    "library") echo "- Framework agnostic design
- Minimal dependencies
- Tree-shaking optimization
- TypeScript-first development" ;;
    "mobile-app") echo "- Native performance
- Offline-first architecture
- Platform-specific optimizations
- Accessibility by design" ;;
    "enterprise") echo "- Enterprise security standards
- Compliance-ready architecture
- Audit trail capabilities
- Role-based access control" ;;
esac)

### Technology Constraints
- Must maintain backward compatibility
- Security-first development approach
- Performance budgets and monitoring
- Accessibility compliance (WCAG 2.1)

## Feature Roadmap

### Phase 1: MVP (Months 1-3)
- Core functionality implementation
- Basic user interface
- Essential integrations
- Security foundations

### Phase 2: Growth (Months 4-6)
- Advanced features
- Performance optimizations
- Extended integrations
- User feedback incorporation

### Phase 3: Scale (Months 7-12)
- Enterprise features
- Advanced analytics
- Automation capabilities
- Ecosystem expansion

## Risk Assessment

### Technical Risks
- **Scalability challenges**: Mitigation through cloud-native architecture
- **Security vulnerabilities**: Mitigation through automated security scanning
- **Performance bottlenecks**: Mitigation through continuous monitoring
- **Integration complexity**: Mitigation through standardized APIs

### Business Risks
- **Market competition**: Mitigation through unique value proposition
- **User adoption**: Mitigation through user-centered design
- **Resource constraints**: Mitigation through agile development
- **Technology obsolescence**: Mitigation through modular architecture

## Success Criteria

### Definition of Done
- Feature complete according to acceptance criteria
- All tests passing (unit, integration, E2E)
- Security review completed
- Performance benchmarks met
- Documentation updated
- User feedback incorporated

### Launch Readiness
- Production environment verified
- Monitoring and alerting configured
- Support processes established
- User onboarding completed
- Rollback procedures tested

---

*This vision document is living and should be updated as the project evolves.*
EOF

    log_success "Created comprehensive project vision: docs/technical/project-vision.md"
}

# Project initialization - Transform template to real project
init_project() {
    local force=$1

    log_header "🚀 Intelligent Project Initialization"

    # Check if this looks like a fresh template clone
    if [[ -f "$PROJECT_ROOT/.template-initialized" ]] && [[ "$force" != "true" ]]; then
        log_error "Project already initialized. Use --force to reinitialize."
        log_info "Current project: $(cat "$PROJECT_ROOT/.template-initialized" 2>/dev/null || echo "Unknown")"
        return 1
    fi

    # Phase 1: Environment verification
    log_info "🔍 Phase 1: Environment Verification"
    local has_claude_code=false
    if check_claude_code; then
        has_claude_code=true
    fi
    echo

    # Phase 2: Project discovery
    log_info "🎯 Phase 2: Project Discovery"
    local project_type=$(select_project_type)
    local business_context=$(discover_business_context "$project_type")
    local team_size=$(discover_team_context)

    # Phase 3: External systems
    log_info "🔗 Phase 3: External Integration"
    configure_external_systems "$team_size"
    echo

    # Phase 4: Basic project details
    log_header "📝 Project Details"

    # Interactive project details collection with intelligent defaults
    local project_name=""
    local project_slug=""
    local project_description=""
    local author_name=""
    local author_email=""
    local repo_url=""
    local license_type="MIT"
    local tech_stack=""

    # Get current git user info if available
    if command -v git &> /dev/null; then
        author_name=$(git config user.name 2>/dev/null || echo "")
        author_email=$(git config user.email 2>/dev/null || echo "")
    fi

    # Project name
    while [[ -z "$project_name" ]]; do
        read -p "$(log_color yellow "Project Name: ")" project_name
        if [[ -z "$project_name" ]]; then
            log_warning "Project name is required"
        fi
    done

    # Generate slug from project name
    project_slug=$(echo "$project_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    read -p "$(log_color yellow "Project Slug [$project_slug]: ")" input_slug
    if [[ -n "$input_slug" ]]; then
        project_slug="$input_slug"
    fi

    # Project description
    while [[ -z "$project_description" ]]; do
        read -p "$(log_color yellow "Project Description: ")" project_description
        if [[ -z "$project_description" ]]; then
            log_warning "Project description is required"
        fi
    done

    # Author info with defaults
    read -p "$(log_color yellow "Author Name [$author_name]: ")" input_author
    if [[ -n "$input_author" ]]; then
        author_name="$input_author"
    fi

    if [[ -n "$author_email" ]]; then
        read -p "$(log_color yellow "Author Email [$author_email]: ")" input_email
        if [[ -n "$input_email" ]]; then
            author_email="$input_email"
        fi
    else
        read -p "$(log_color yellow "Author Email: ")" author_email
    fi

    # Repository URL
    read -p "$(log_color yellow "Repository URL (optional): ")" repo_url

    # License
    read -p "$(log_color yellow "License [$license_type]: ")" input_license
    if [[ -n "$input_license" ]]; then
        license_type="$input_license"
    fi

    # Tech stack
    read -p "$(log_color yellow "Tech Stack (e.g., React, Node.js, PostgreSQL): ")" tech_stack

    echo
    log_info "Project Details:"
    log_info "  Name: $project_name"
    log_info "  Slug: $project_slug"
    log_info "  Description: $project_description"
    log_info "  Author: $author_name <$author_email>"
    log_info "  Repository: ${repo_url:-"Not specified"}"
    log_info "  License: $license_type"
    log_info "  Tech Stack: ${tech_stack:-"Not specified"}"
    echo

    read -p "$(log_color yellow "Continue with project initialization? [Y/n]: ")" confirm
    if [[ "$confirm" =~ ^[Nn] ]]; then
        log_info "Project initialization cancelled"
        return 0
    fi

    log_info "Initializing project..."

    # Create docs/ai-tools directory if it doesn't exist
    mkdir -p "$PROJECT_ROOT/docs/ai-tools"

    # 1. Archive template documentation
    log_info "Archiving template documentation..."

    # Move README.md to template documentation
    if [[ -f "$PROJECT_ROOT/README.md" ]]; then
        cp "$PROJECT_ROOT/README.md" "$PROJECT_ROOT/docs/ai-tools/template-documentation.md"
        log_success "Archived template README → docs/ai-tools/template-documentation.md"
    fi

    # Move START-HERE.md to getting started guide
    if [[ -f "$PROJECT_ROOT/START-HERE.md" ]]; then
        cp "$PROJECT_ROOT/START-HERE.md" "$PROJECT_ROOT/docs/ai-tools/getting-started-with-template.md"
        log_success "Archived START-HERE.md → docs/ai-tools/getting-started-with-template.md"
    fi

    # Move TEMPLATES-EXAMPLES-INDEX.md
    if [[ -f "$PROJECT_ROOT/TEMPLATES-EXAMPLES-INDEX.md" ]]; then
        cp "$PROJECT_ROOT/TEMPLATES-EXAMPLES-INDEX.md" "$PROJECT_ROOT/docs/ai-tools/templates-and-examples.md"
        log_success "Archived templates index → docs/ai-tools/templates-and-examples.md"
    fi

    # 2. Generate project vision
    generate_project_vision "$project_name" "$project_description" "$business_context" "$project_type"

    # 3. Create project README from intelligent template selection
    log_info "Creating project README..."

    # Select appropriate template based on project type
    local readme_template="$PROJECT_ROOT/templates/docs/project/$project_type-template.md"

    # Fallback to basic template if specific one doesn't exist
    if [[ ! -f "$readme_template" ]]; then
        readme_template="$PROJECT_ROOT/templates/docs/project/project-readme-template.md"
    fi

    if [[ -f "$readme_template" ]]; then
        # Gather external system information
        local pm_system="${EXTERNAL_PM_SYSTEM:-"GitHub Issues"}"
        local pm_url="${EXTERNAL_PM_URL:-"https://github.com/yourusername/$project_slug/issues"}"
        local docs_system="${EXTERNAL_DOCS_SYSTEM:-"GitHub Wiki"}"
        local docs_url="${EXTERNAL_DOCS_URL:-"https://github.com/yourusername/$project_slug/wiki"}"

        # Set project-type specific defaults
        local api_framework="Express.js"
        local frontend_framework="React"
        local database_tech="PostgreSQL"
        local auth_strategy="JWT"

        case "$project_type" in
            "api-service")
                api_framework="Express.js"
                database_tech="PostgreSQL"
                auth_strategy="JWT"
                ;;
            "web-app")
                frontend_framework="React"
                database_tech="PostgreSQL"
                ;;
            "cli-tool")
                api_framework="Commander.js"
                database_tech="SQLite"
                ;;
        esac

        # Business context specific features
        local context_features=""
        case "$business_context" in
            "b2b-saas")
                context_features="Multi-tenant architecture|Enterprise SSO|Usage analytics"
                ;;
            "consumer")
                context_features="User-friendly interface|Social features|Performance optimization"
                ;;
            "internal")
                context_features="Internal tools integration|Audit logging|Administrative controls"
                ;;
            "open-source")
                context_features="Community contributions|Documentation|Extensible architecture"
                ;;
        esac

        # Process the template with comprehensive substitutions
        sed -e "s/{{PROJECT_NAME}}/$project_name/g" \
            -e "s/{{PROJECT_DESCRIPTION}}/$project_description/g" \
            -e "s/{{PROJECT_SLUG}}/$project_slug/g" \
            -e "s/{{PROJECT_SLUG_UPPER}}/$(echo "$project_slug" | tr '[:lower:]' '[:upper:]' | tr '-' '_')/g" \
            -e "s|{{REPO_URL}}|${repo_url:-"https://github.com/yourusername/$project_slug"}|g" \
            -e "s/{{LICENSE_TYPE}}/$license_type/g" \
            -e "s/{{TECH_REQUIREMENTS}}/${tech_stack:-"Node.js 18+, Git 2.25+"}/g" \
            -e "s/{{RECOMMENDED_TOOLS}}/VS Code, AI assistant (Claude Code)/g" \
            -e "s/{{INSTALL_COMMANDS}}/npm install/g" \
            -e "s/{{DEV_COMMANDS}}/npm run dev/g" \
            -e "s/{{TEST_COMMANDS}}/npm test/g" \
            -e "s/{{BUILD_COMMANDS}}/npm run build/g" \
            -e "s/{{API_FRAMEWORK}}/$api_framework/g" \
            -e "s/{{FRONTEND_FRAMEWORK}}/$frontend_framework/g" \
            -e "s/{{DATABASE_TECH}}/$database_tech/g" \
            -e "s/{{AUTH_STRATEGY}}/$auth_strategy/g" \
            -e "s/{{BUSINESS_CONTEXT}}/$business_context/g" \
            -e "s/{{PM_SYSTEM}}/$pm_system/g" \
            -e "s/{{PM_URL}}/$pm_url/g" \
            -e "s/{{DOCS_SYSTEM}}/$docs_system/g" \
            -e "s/{{DOCS_URL}}/$docs_url/g" \
            -e "s/{{TARGET_USERS}}/$(echo "$business_context" | sed 's/-/ /g'| sed 's/\b\w/\u&/g') users/g" \
            -e "s/{{FEATURE_1}}/🚀 AI-assisted development workflow/g" \
            -e "s/{{FEATURE_2}}/📋 Comprehensive documentation system/g" \
            -e "s/{{FEATURE_3}}/⚡ Quality gates and automated validation/g" \
            -e "s/{{ENVIRONMENT_1}}/Development/g" \
            -e "s/{{ENVIRONMENT_2}}/Production/g" \
            -e "s/{{DEPLOY_COMMANDS_1}}/npm run dev/g" \
            -e "s/{{DEPLOY_COMMANDS_2}}/npm run build \&\& npm start/g" \
            -e "s/{{INTEGRATION_TEST_COMMANDS}}/npm run test:integration/g" \
            -e "s/{{E2E_TEST_COMMANDS}}/npm run test:e2e/g" \
            -e "s/{{PERFORMANCE_TEST_COMMANDS}}/npm run test:performance/g" \
            -e "s/{{A11Y_TEST_COMMANDS}}/npm run test:a11y/g" \
            -e "s/{{API_TEST_COMMANDS}}/npm run test:api/g" \
            -e "s/{{LOAD_TEST_COMMANDS}}/npm run test:load/g" \
            -e "s/{{SECURITY_TEST_COMMANDS}}/npm run test:security/g" \
            -e "s/{{COVERAGE_COMMANDS}}/npm run test:coverage/g" \
            -e "s/{{ADDITIONAL_ACKNOWLEDGMENTS}}/Built with intelligence and community support/g" \
            "$readme_template" > "$PROJECT_ROOT/README.md"

        log_success "Created project README.md"
    else
        log_warning "Template README not found, creating basic README"
        cat > "$PROJECT_ROOT/README.md" << EOF
# $project_name

$project_description

## 🚀 Features

- AI-assisted development workflow
- Comprehensive documentation system
- Quality gates and automated validation

## 📋 Prerequisites

${tech_stack:-"Node.js 18+, Git 2.25+"}

## ⚡ Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development
npm run dev
\`\`\`

## 🏗️ Architecture

This project uses the [AI Coding Template](./docs/ai-tools/template-documentation.md) workflow for intelligent development.

## 📖 Documentation

- [Template Documentation](./docs/ai-tools/template-documentation.md)
- [Getting Started with AI Workflow](./docs/ai-tools/getting-started-with-template.md)
- [Templates and Examples](./docs/ai-tools/templates-and-examples.md)

## 📄 License

$license_type
EOF
    fi

    # 3. Update package.json
    if [[ -f "$PROJECT_ROOT/package.json" ]]; then
        log_info "Updating package.json..."

        # Create a temporary script to update package.json
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('$PROJECT_ROOT/package.json', 'utf8'));
        pkg.name = '$project_slug';
        pkg.description = '$project_description';
        if ('$author_name') pkg.author = '$author_name' + ('$author_email' ? ' <$author_email>' : '');
        if ('$repo_url') {
          pkg.repository = { type: 'git', url: '$repo_url' };
          pkg.homepage = '$repo_url';
          pkg.bugs = { url: '$repo_url/issues' };
        }
        fs.writeFileSync('$PROJECT_ROOT/package.json', JSON.stringify(pkg, null, 2));
        " 2>/dev/null && log_success "Updated package.json" || log_warning "Could not update package.json (Node.js required)"
    fi

    # 4. Update CLAUDE.md with project context
    if [[ -f "$PROJECT_ROOT/CLAUDE.md" ]]; then
        log_info "Customizing AI instructions..."

        # Update the tech stack section
        sed -i.bak "s|<Add the high level details of your tech stack here>|$project_name: ${tech_stack:-"Modern web application"}|g" "$PROJECT_ROOT/CLAUDE.md"

        # Update the vision section reference
        sed -i.bak "s|Vision Document:.*|Vision Document: This is $project_name - $project_description|g" "$PROJECT_ROOT/CLAUDE.md"

        rm -f "$PROJECT_ROOT/CLAUDE.md.bak" 2>/dev/null
        log_success "Customized CLAUDE.md for your project"
    fi

    # 5. Initialize STATUS.md with project details
    if [[ -f "$PROJECT_ROOT/STATUS.md" ]]; then
        log_info "Initializing project memory..."

        local current_date=$(date +"%Y-%m-%d")

        # Update STATUS.md with project-specific information
        sed -i.bak \
            -e "s|\[What you're currently working on\]|Setting up $project_name|g" \
            -e "s|\[Planning/Development/Testing/Production/Maintenance\]|Development|g" \
            -e "s|████████▒▒ 85%|██▒▒▒▒▒▒▒▒ 20%|g" \
            -e "s|Multi-Model Intelligence Integration|$project_name Project Initialization|g" \
            -e "s|2025-09-17|$current_date|g" \
            -e "s|Enhanced AI-assisted development with cross-model validation|Initial project setup with AI-assisted development workflow|g" \
            "$PROJECT_ROOT/STATUS.md"

        rm -f "$PROJECT_ROOT/STATUS.md.bak" 2>/dev/null
        log_success "Initialized STATUS.md for project tracking"
    fi

    # 6. Create project tracking marker
    echo "$project_name" > "$PROJECT_ROOT/.template-initialized"

    # 7. Clean up template-specific files (optional)
    rm -f "$PROJECT_ROOT/START-HERE.md" 2>/dev/null
    rm -f "$PROJECT_ROOT/TEMPLATES-EXAMPLES-INDEX.md" 2>/dev/null

    log_success "Project initialization complete!"
    echo
    log_header "🎉 Welcome to $project_name!"
    log_info "Your AI-powered project is ready:"
    log_info "  📋 README.md - Professional project documentation"
    log_info "  🤖 CLAUDE.md - Customized AI instructions"
    log_info "  📊 STATUS.md - Project memory and context"
    log_info "  📚 docs/ai-tools/ - Template documentation preserved"
    echo
    log_info "Next steps:"
    log_info "  1. Review and customize README.md"
    log_info "  2. Start your first feature: /idea 'your feature idea'"
    log_info "  3. Use the AI workflow: /idea → /plan → /iterate"
    echo
    log_success "Happy building with AI superpowers! 🚀"
}

# Main execution
main() {
    local command=$1
    shift
    
    # Parse options
    local skip_tools=false
    local skip_git=false
    local force=false
    local verbose=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tools)
                skip_tools=true
                shift
                ;;
            --skip-git)
                skip_git=true
                shift
                ;;
            --force)
                force=true
                shift
                ;;
            --verbose)
                verbose=true
                LOG_LEVEL=DEBUG
                shift
                ;;
            *)
                echo "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Execute command
    case $command in
        quick)
            quick_setup
            ;;
        full)
            full_setup "$skip_tools" "$skip_git"
            ;;
        init-project)
            init_project "$force"
            ;;
        env)
            setup_env "$force"
            ;;
        git)
            setup_git
            ;;
        tools)
            setup_tools
            ;;
        check)
            check_setup
            ;;
        --help|-h|"")
            show_usage
            exit 0
            ;;
        *)
            log_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"
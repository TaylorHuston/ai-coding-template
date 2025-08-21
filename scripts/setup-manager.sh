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
    $0 env --force           # Reset environment files
    $0 check                 # Verify current setup

EOF
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local has_errors=false
    
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
    
    # Check for common development tools
    local tools=("git" "node" "code")
    for tool in "${tools[@]}"; do
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
    
    if [[ "$all_good" == "true" ]]; then
        log_success "Setup is complete and working!"
    else
        log_warning "Some setup steps are incomplete"
        log_info "Run: $0 full   to complete setup"
    fi
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
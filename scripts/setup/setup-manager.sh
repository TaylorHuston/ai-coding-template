#!/bin/bash
# Unified Setup Manager for AI Coding Template
# Consolidates all setup scripts into a single entry point
# Usage: ./scripts/setup-manager.sh <command> [options]

set -eE  # Also trap ERR
trap 'echo "❌ Error at line $LINENO in function ${FUNCNAME[1]:-main}" >&2; echo "Last command: $BASH_COMMAND" >&2' ERR

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

# Utility function to safely escape variables for sed replacement
escape_sed_replacement() {
    printf '%s\n' "$1" | sed 's/[[\.*^$()+?{|]/\\&/g; s|/|\\/|g'
}

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






# Project initialization - Transform template to real project
init_project() {
    local force=$1

    log_header "🚀 Project Initialization"

    # Check if this looks like a fresh template clone
    if [[ -f "$PROJECT_ROOT/.template-initialized" ]] && [[ "$force" != "true" ]]; then
        log_error "Project already initialized. Use --force to reinitialize."
        log_info "Current project: $(cat "$PROJECT_ROOT/.template-initialized" 2>/dev/null || echo "Unknown")"
        return 1
    fi

    # Collect essential project details
    log_info "📝 Project Details"

    local project_name=""
    local project_slug=""
    local project_description=""
    local author_name=""
    local author_email=""
    local repo_url=""
    local license_type="MIT"

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

    echo
    log_info "Project Details:"
    log_info "  Name: $project_name"
    log_info "  Slug: $project_slug"
    log_info "  Description: $project_description"
    log_info "  Author: $author_name <$author_email>"
    log_info "  Repository: ${repo_url:-"Not specified"}"
    log_info "  License: $license_type"
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

    # 2. Create standard-readme compliant README.md
    log_info "Creating standard README.md..."

    local readme_template="$PROJECT_ROOT/templates/documentation/project/standard-readme.template.md"
    local current_year=$(date +"%Y")

    if [[ -f "$readme_template" ]]; then
        # Prepare email section
        local author_email_section=""
        if [[ -n "$author_email" ]]; then
            author_email_section=" <$author_email>"
        fi

        # Use template with safe variable substitution
        local temp_file=$(mktemp)
        cp "$readme_template" "$temp_file"

        # Safely escape all variables for sed
        local safe_project_name=$(escape_sed_replacement "$project_name")
        local safe_project_description=$(escape_sed_replacement "$project_description")
        local safe_project_slug=$(escape_sed_replacement "$project_slug")
        local safe_repo_url=$(escape_sed_replacement "${repo_url:-"https://github.com/yourusername/$project_slug"}")
        local safe_author_name=$(escape_sed_replacement "$author_name")
        local safe_author_email_section=$(escape_sed_replacement "$author_email_section")
        local safe_license_type=$(escape_sed_replacement "$license_type")

        # Apply substitutions safely
        if sed -i \
            -e "s/{{PROJECT_NAME}}/$safe_project_name/g" \
            -e "s/{{PROJECT_DESCRIPTION}}/$safe_project_description/g" \
            -e "s/{{PROJECT_SLUG}}/$safe_project_slug/g" \
            -e "s|{{REPO_URL}}|$safe_repo_url|g" \
            -e "s/{{INSTALL_COMMANDS}}/npm install/g" \
            -e "s/{{DEV_COMMANDS}}/npm start/g" \
            -e "s/{{AUTHOR_NAME}}/$safe_author_name/g" \
            -e "s/{{AUTHOR_EMAIL_SECTION}}/$safe_author_email_section/g" \
            -e "s/{{LICENSE_TYPE}}/$safe_license_type/g" \
            -e "s/{{CURRENT_YEAR}}/$current_year/g" \
            "$temp_file" && mv "$temp_file" "$PROJECT_ROOT/README.md"; then
            log_success "Created standard-readme compliant README.md from template"
        else
            log_error "Failed to create README from template"
            rm -f "$temp_file"
            return 1
        fi
    else
        # Fallback to basic README if template not found
        local current_year=$(date +"%Y")
        cat > "$PROJECT_ROOT/README.md" << EOF
# $project_name

$project_description

## Install

\`\`\`bash
git clone ${repo_url:-"https://github.com/yourusername/$project_slug"}
cd $project_slug
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Maintainers

$author_name${author_email:+ <$author_email>}

## Contributing

PRs accepted.

## License

$license_type © $current_year $author_name
EOF
        log_warning "Template not found, created basic README"
    fi

    # 3. Copy CHANGELOG template to root
    log_info "Setting up CHANGELOG..."

    if [[ -f "$PROJECT_ROOT/templates/documentation/project/CHANGELOG.template.md" ]]; then
        if cp "$PROJECT_ROOT/templates/documentation/project/CHANGELOG.template.md" "$PROJECT_ROOT/CHANGELOG.md"; then
            # Add initial entry
            local current_date=$(date +"%Y-%m-%d")
            if sed -i.bak \
                -e "s/## \[Unreleased\]/## [Unreleased]\n\n## [0.1.0] - $current_date/" \
                -e "s/### Added\n- New features that have been added/### Added\n- Initial project setup from AI Coding Template\n- Standard README structure\n- Changelog tracking/" \
                "$PROJECT_ROOT/CHANGELOG.md"; then
                rm -f "$PROJECT_ROOT/CHANGELOG.md.bak" 2>/dev/null
                log_success "Created CHANGELOG.md with initial entry"
            else
                log_error "Failed to update CHANGELOG.md with initial entry"
                return 1
            fi
        else
            log_error "Failed to copy CHANGELOG template"
            return 1
        fi
    else
        log_warning "CHANGELOG template not found, skipping"
    fi

    # 4. Clear git history and reinitialize
    log_info "Clearing git history and reinitializing..."

    if [[ -d "$PROJECT_ROOT/.git" ]]; then
        rm -rf "$PROJECT_ROOT/.git"
        log_success "Cleared existing git history"
    fi

    # Initialize fresh repository
    git init
    git add .
    git commit -m "Initial commit - Project initialized from AI Coding Template"
    log_success "Initialized fresh git repository"

    # 5. Update package.json if it exists
    if [[ -f "$PROJECT_ROOT/package.json" ]]; then
        log_info "Updating package.json..."

        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('$PROJECT_ROOT/package.json', 'utf8'));
        pkg.name = '$project_slug';
        pkg.description = '$project_description';
        pkg.version = '0.1.0';
        if ('$author_name') pkg.author = '$author_name' + ('$author_email' ? ' <$author_email>' : '');
        if ('$repo_url') {
          pkg.repository = { type: 'git', url: '$repo_url' };
          pkg.homepage = '$repo_url';
          pkg.bugs = { url: '$repo_url/issues' };
        }
        fs.writeFileSync('$PROJECT_ROOT/package.json', JSON.stringify(pkg, null, 2));
        " 2>/dev/null && log_success "Updated package.json" || log_warning "Could not update package.json (Node.js required)"
    fi

    # 6. Update CLAUDE.md with project context
    if [[ -f "$PROJECT_ROOT/CLAUDE.md" ]]; then
        log_info "Customizing AI instructions..."

        sed -i.bak "s|<Add the high level details of your tech stack here>|$project_name - $project_description|g" "$PROJECT_ROOT/CLAUDE.md"
        rm -f "$PROJECT_ROOT/CLAUDE.md.bak" 2>/dev/null
        log_success "Customized CLAUDE.md for your project"
    fi

    # 7. Initialize STATUS.md with project details
    if [[ -f "$PROJECT_ROOT/STATUS.md" ]]; then
        log_info "Initializing project memory..."

        local current_date=$(date +"%Y-%m-%d")
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

    # 8. Create project tracking marker
    echo "$project_name" > "$PROJECT_ROOT/.template-initialized"

    # 9. Clean up template-specific files
    rm -f "$PROJECT_ROOT/START-HERE.md" 2>/dev/null
    rm -f "$PROJECT_ROOT/TEMPLATES-EXAMPLES-INDEX.md" 2>/dev/null

    log_success "Project initialization complete!"
    echo
    log_header "🎉 Welcome to $project_name!"
    log_info "Your project is ready with:"
    log_info "  📋 README.md - Standard-readme compliant documentation"
    log_info "  📝 CHANGELOG.md - Professional change tracking"
    log_info "  🤖 CLAUDE.md - AI assistant instructions"
    log_info "  📊 STATUS.md - Project memory and context"
    log_info "  📚 docs/ai-tools/ - Template documentation preserved"
    log_info "  🔄 Fresh git history - Ready for your first real commit"
    echo
    log_info "Next steps:"
    log_info "  1. Customize README.md for your project"
    log_info "  2. Start development with the AI workflow"
    log_info "  3. Use: /feature → /architect → /plan → /develop"
    echo
    log_success "Happy building! 🚀"
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

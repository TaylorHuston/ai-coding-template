#!/bin/bash

# AI Coding Template - Git Hooks Setup Script
# Configures git hooks for AI-assisted development

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
GITHOOKS_DIR="$PROJECT_ROOT/.githooks"

echo -e "${BLUE}🔧 Setting up AI Coding Template Git Hooks${NC}"

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ ERROR: Not in a git repository${NC}"
        echo "Please run this script from within your git repository"
        exit 1
    fi
    echo -e "${GREEN}✅ Git repository detected${NC}"
}

# Function to backup existing hooks
backup_existing_hooks() {
    local git_hooks_dir="$(git rev-parse --git-dir)/hooks"
    local backup_dir="$git_hooks_dir/backup-$(date +%Y%m%d-%H%M%S)"
    
    if [[ -d "$git_hooks_dir" ]] && [[ -n "$(ls -A "$git_hooks_dir" 2>/dev/null)" ]]; then
        echo "📦 Backing up existing hooks to $backup_dir"
        mkdir -p "$backup_dir"
        cp -r "$git_hooks_dir"/* "$backup_dir/" 2>/dev/null || true
        echo -e "${GREEN}✅ Existing hooks backed up${NC}"
    fi
}

# Function to install hooks
install_hooks() {
    local git_hooks_dir="$(git rev-parse --git-dir)/hooks"
    
    echo "🔗 Installing git hooks..."
    
    # Configure git to use our hooks directory
    git config core.hooksPath "$GITHOOKS_DIR"
    
    # Also create symlinks for compatibility
    if [[ -d "$GITHOOKS_DIR" ]]; then
        for hook_file in "$GITHOOKS_DIR"/*; do
            if [[ -f "$hook_file" && -x "$hook_file" ]]; then
                local hook_name=$(basename "$hook_file")
                local target="$git_hooks_dir/$hook_name"
                
                # Remove existing hook if it exists
                [[ -f "$target" ]] && rm "$target"
                
                # Create symlink
                ln -s "$hook_file" "$target"
                echo "   📎 Linked $hook_name"
            fi
        done
    fi
    
    echo -e "${GREEN}✅ Git hooks installed${NC}"
}

# Function to setup commit message template
setup_commit_template() {
    local template_file="$PROJECT_ROOT/.gitmessage"
    
    if [[ ! -f "$template_file" ]]; then
        echo "📝 Creating commit message template..."
        
        cat > "$template_file" << 'EOF'
# Brief description of changes (50 chars max)

# Detailed explanation of what and why (wrap at 72 chars)
# 
# Include:
# - What problem this solves
# - Why this approach was chosen
# - Any breaking changes
# - References to issues/tickets

# AI Assistance Level (required):
# AI-Assisted: [Brief description of AI help]
# or
# 🤖 Generated with [Claude Code](https://claude.ai/code)
#
# Co-Authored-By: Claude <noreply@anthropic.com>

# Issue References:
# Fixes #123
# Closes #456
# Related to #789
EOF
        
        echo -e "${GREEN}✅ Commit template created${NC}"
    fi
    
    # Configure git to use the template
    git config commit.template "$template_file"
    echo -e "${GREEN}✅ Commit template configured${NC}"
}

# Function to verify hook installation
verify_installation() {
    echo "🧪 Verifying installation..."
    
    local hooks_path=$(git config core.hooksPath)
    if [[ "$hooks_path" == "$GITHOOKS_DIR" ]]; then
        echo -e "${GREEN}✅ Hooks path configured correctly${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: Hooks path not set correctly${NC}"
    fi
    
    # Test if pre-commit hook is executable
    if [[ -x "$GITHOOKS_DIR/pre-commit" ]]; then
        echo -e "${GREEN}✅ Pre-commit hook is executable${NC}"
    else
        echo -e "${RED}❌ Pre-commit hook is not executable${NC}"
        chmod +x "$GITHOOKS_DIR/pre-commit"
        echo -e "${GREEN}✅ Fixed pre-commit hook permissions${NC}"
    fi
    
    # Check commit template
    local template=$(git config commit.template)
    if [[ -n "$template" && -f "$template" ]]; then
        echo -e "${GREEN}✅ Commit template configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: Commit template not configured${NC}"
    fi
}

# Function to show configuration status
show_status() {
    echo ""
    echo -e "${BLUE}📊 Git Hooks Configuration Status${NC}"
    echo "=================================="
    
    echo "Hooks Directory: $(git config core.hooksPath || echo 'Not set')"
    echo "Commit Template: $(git config commit.template || echo 'Not set')"
    
    echo ""
    echo "Available Hooks:"
    if [[ -d "$GITHOOKS_DIR" ]]; then
        for hook in "$GITHOOKS_DIR"/*; do
            if [[ -f "$hook" ]]; then
                local hook_name=$(basename "$hook")
                local status="❌ Not executable"
                [[ -x "$hook" ]] && status="✅ Ready"
                echo "  $hook_name: $status"
            fi
        done
    else
        echo "  No hooks directory found"
    fi
}

# Function to provide usage instructions
show_usage() {
    echo ""
    echo -e "${BLUE}📖 Usage Instructions${NC}"
    echo "===================="
    echo ""
    echo "Your git hooks are now configured! Here's what they do:"
    echo ""
    echo -e "${YELLOW}Pre-Commit Hook:${NC}"
    echo "  • Prevents commits to protected branches (main, master, develop)"
    echo "  • Validates AI assistance documentation in commit messages"
    echo "  • Checks for security issues (API keys, secrets)"
    echo "  • Enforces file naming conventions"
    echo "  • Warns about missing STATUS.md updates"
    echo ""
    echo -e "${YELLOW}Commit Message Template:${NC}"
    echo "  • Automatically opens with structured format"
    echo "  • Reminds you to document AI assistance"
    echo "  • Includes sections for issue references"
    echo ""
    echo -e "${BLUE}💡 Pro Tips:${NC}"
    echo "  • Use 'git commit --no-verify' to skip hooks in emergencies"
    echo "  • Update .githooks/ to customize hook behavior"
    echo "  • Re-run this script after pulling hook updates"
    echo ""
    echo -e "${GREEN}Happy coding with AI assistance! 🤖${NC}"
}

# Function to handle errors
error_handler() {
    echo -e "${RED}❌ Setup failed${NC}"
    echo "Please check the errors above and try again"
    exit 1
}

# Set up error handling
trap error_handler ERR

# Main execution
main() {
    echo ""
    check_git_repo
    backup_existing_hooks
    install_hooks
    setup_commit_template
    verify_installation
    show_status
    show_usage
    
    echo ""
    echo -e "${GREEN}🎉 Git hooks setup complete!${NC}"
}

# Handle command line arguments
case "${1:-setup}" in
    setup)
        main
        ;;
    status)
        show_status
        ;;
    verify)
        verify_installation
        ;;
    help|--help|-h)
        echo "AI Coding Template Git Hooks Setup"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  setup   - Install and configure git hooks (default)"
        echo "  status  - Show current configuration status"
        echo "  verify  - Verify installation"
        echo "  help    - Show this help message"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
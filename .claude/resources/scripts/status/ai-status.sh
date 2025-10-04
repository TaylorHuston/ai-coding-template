#!/bin/bash

# AI Coding Template Status Dashboard
# AI-friendly project status dashboard providing comprehensive project information
# in multiple output formats for both humans and AI assistants
# Usage: ./.claude/resources/scripts/ai-status.sh [options]

set -e

# Source shared libraries
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/lib/colors.sh" ]]; then
    source "$SCRIPT_DIR/lib/colors.sh"
fi
if [[ -f "$SCRIPT_DIR/lib/logging.sh" ]]; then
    source "$SCRIPT_DIR/lib/logging.sh"
fi

PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CLAUDE_MD_FILE="$PROJECT_ROOT/CLAUDE.md"

# Status indicators
STATUS_GOOD="${EMOJI_SUCCESS}"
STATUS_WARNING="${EMOJI_WARNING}"
STATUS_ERROR="${EMOJI_ERROR}"
STATUS_INFO="${EMOJI_INFO}"

show_usage() {
    cat << EOF
${EMOJI_ROBOT} AI Coding Template Status Dashboard

USAGE:
    $0 [options]

OUTPUT FORMATS:
    --ai-format         Machine-readable format optimized for AI consumption
    --json              JSON format for programmatic access
    --markdown          Markdown format for documentation
    --human             Human-readable format (default)

STATUS COMPONENTS:
    --full              Complete status report (default)
    --git-only          Git repository status only
    --project-only      Project structure status only
    --env-only          Environment and tools status only

OPTIONS:
    --no-color          Disable colored output
    --timestamp         Include ISO timestamp
    --verbose           Include detailed information
    --health-check      Focus on health metrics only

EXAMPLES:
    $0 --ai-format
    $0 --json --git-only
    $0 --markdown --timestamp

EOF
}

# Get git repository status
get_git_status() {
    local format=$1
    
    local branch=$(git branch --show-current 2>/dev/null || echo "unknown")
    local commit=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    local short_commit=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    local uncommitted=$(git status --porcelain 2>/dev/null | wc -l)
    local ahead_behind=$(git rev-list --count --left-right @{upstream}...HEAD 2>/dev/null || echo "0	0")
    local ahead=$(echo $ahead_behind | cut -f2)
    local behind=$(echo $ahead_behind | cut -f1)
    
    case $format in
        "ai"|"json")
            cat << EOF
{
  "git": {
    "branch": "$branch",
    "commit": "$commit",
    "short_commit": "$short_commit",
    "clean": $([ $uncommitted -eq 0 ] && echo "true" || echo "false"),
    "uncommitted_files": $uncommitted,
    "ahead": $ahead,
    "behind": $behind,
    "last_commit": {
      "message": "$(git log -1 --pretty=format:'%s' 2>/dev/null || echo 'No commits')",
      "author": "$(git log -1 --pretty=format:'%an' 2>/dev/null || echo 'Unknown')",
      "date": "$(git log -1 --pretty=format:'%ci' 2>/dev/null || echo 'Unknown')"
    }
  }
EOF
            ;;
        "markdown")
            cat << EOF
## Git Repository Status

- **Branch**: \`$branch\`
- **Commit**: \`$short_commit\`
- **Status**: $([ $uncommitted -eq 0 ] && echo "Clean" || echo "$uncommitted uncommitted files")
- **Sync**: $ahead ahead, $behind behind
- **Last Commit**: $(git log -1 --pretty=format:'%s (%an, %ar)' 2>/dev/null || echo 'No commits')

EOF
            ;;
        *)
            echo -e "${BLUE}${EMOJI_FOLDER} Git Repository Status:${NC}"
            echo "   Branch: $branch"
            echo "   Commit: $short_commit"
            if [ $uncommitted -eq 0 ]; then
                echo -e "   Status: ${STATUS_GOOD} Clean working directory"
            else
                echo -e "   Status: ${STATUS_WARNING}$uncommitted uncommitted files"
            fi
            echo "   Sync: $ahead ahead, $behind behind"
            echo ""
            ;;
    esac
}

# Get project structure status
get_project_status() {
    local format=$1
    
    # Count files by type
    local total_files=$(find "$PROJECT_ROOT" -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | wc -l)
    local md_files=$(find "$PROJECT_ROOT" -name "*.md" -not -path "*/node_modules/*" | wc -l)
    local code_files=$(find "$PROJECT_ROOT" -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.py" -o -name "*.go" -o -name "*.java" -o -name "*.cpp" -o -name "*.c" | wc -l)
    local config_files=$(find "$PROJECT_ROOT" -name "package.json" -o -name "*.config.*" -o -name ".*rc" -o -name "Dockerfile" -o -name "docker-compose.*" | wc -l)
    
    # Check key directories
    local has_docs=$([ -d "$PROJECT_ROOT/docs" ] && echo "true" || echo "false")
    local has_scripts=$([ -d "$PROJECT_ROOT/scripts" ] && echo "true" || echo "false")
    local has_claude=$([ -d "$PROJECT_ROOT/.claude" ] && echo "true" || echo "false")
    local has_cursor=$([ -d "$PROJECT_ROOT/.cursor" ] && echo "true" || echo "false")
    
    # Check key files
    local has_readme=$([ -f "$PROJECT_ROOT/README.md" ] && echo "true" || echo "false")
    local has_claude_md=$([ -f "$CLAUDE_MD_FILE" ] && echo "true" || echo "false")
    local has_gitignore=$([ -f "$PROJECT_ROOT/.gitignore" ] && echo "true" || echo "false")
    
    case $format in
        "ai"|"json")
            cat << EOF
{
  "project": {
    "structure": {
      "total_files": $total_files,
      "markdown_files": $md_files,
      "code_files": $code_files,
      "config_files": $config_files
    },
    "directories": {
      "docs": $has_docs,
      "scripts": $has_scripts,
      "claude_config": $has_claude,
      "cursor_config": $has_cursor
    },
    "key_files": {
      "readme": $has_readme,
      "claude_md": $has_claude_md,
      "gitignore": $has_gitignore
    }
  }
EOF
            ;;
        "markdown")
            cat << EOF
## Project Structure

- **Total Files**: $total_files files
- **Documentation**: $md_files markdown files
- **Code Files**: $code_files source files
- **Configuration**: $config_files config files

### Key Directories
- **docs/**: $([ "$has_docs" = "true" ] && echo "✅ Present" || echo "❌ Missing")
- **.claude/resources/scripts/**: $([ "$has_scripts" = "true" ] && echo "✅ Present" || echo "❌ Missing")
- **.claude/**: $([ "$has_claude" = "true" ] && echo "✅ Present" || echo "❌ Missing")
- **.cursor/**: $([ "$has_cursor" = "true" ] && echo "✅ Present" || echo "❌ Missing")

### Key Files
- **README.md**: $([ "$has_readme" = "true" ] && echo "✅ Present" || echo "❌ Missing")
- **CLAUDE.md**: $([ "$has_claude_md" = "true" ] && echo "✅ Present" || echo "❌ Missing")
- **.gitignore**: $([ "$has_gitignore" = "true" ] && echo "✅ Present" || echo "❌ Missing")

EOF
            ;;
        *)
            echo -e "${BLUE}${EMOJI_FILE} Project Structure:${NC}"
            echo "   Total Files: $total_files"
            echo "   Documentation: $md_files markdown files"
            echo "   Code Files: $code_files source files"
            echo "   Configuration: $config_files config files"
            echo ""
            echo -e "${CYAN}Key Directories:${NC}"
            echo -e "   docs/: $([ "$has_docs" = "true" ] && echo "${STATUS_GOOD} Present" || echo "${STATUS_ERROR} Missing")"
            echo -e "   .claude/resources/scripts/: $([ "$has_scripts" = "true" ] && echo "${STATUS_GOOD} Present" || echo "${STATUS_ERROR} Missing")"
            echo -e "   .claude/: $([ "$has_claude" = "true" ] && echo "${STATUS_GOOD} Present" || echo "${STATUS_ERROR} Missing")"
            echo -e "   .cursor/: $([ "$has_cursor" = "true" ] && echo "${STATUS_GOOD} Present" || echo "${STATUS_ERROR} Missing")"
            echo ""
            ;;
    esac
}

# Get environment status
get_environment_status() {
    local format=$1
    
    # Check common tools
    local has_node=$(command -v node >/dev/null 2>&1 && echo "true" || echo "false")
    local has_npm=$(command -v npm >/dev/null 2>&1 && echo "true" || echo "false")
    local has_git=$(command -v git >/dev/null 2>&1 && echo "true" || echo "false")
    local has_docker=$(command -v docker >/dev/null 2>&1 && echo "true" || echo "false")
    
    local node_version=$([ "$has_node" = "true" ] && node --version || echo "N/A")
    local npm_version=$([ "$has_npm" = "true" ] && npm --version || echo "N/A")
    local git_version=$([ "$has_git" = "true" ] && git --version | cut -d' ' -f3 || echo "N/A")
    local docker_version=$([ "$has_docker" = "true" ] && docker --version | cut -d' ' -f3 | tr -d ',' || echo "N/A")
    
    # Check if Docker is running
    local docker_running="false"
    if [ "$has_docker" = "true" ] && docker info >/dev/null 2>&1; then
        docker_running="true"
    fi
    
    case $format in
        "ai"|"json")
            cat << EOF
{
  "environment": {
    "tools": {
      "node": {
        "available": $has_node,
        "version": "$node_version"
      },
      "npm": {
        "available": $has_npm,
        "version": "$npm_version"
      },
      "git": {
        "available": $has_git,
        "version": "$git_version"
      },
      "docker": {
        "available": $has_docker,
        "version": "$docker_version",
        "running": $docker_running
      }
    }
  }
EOF
            ;;
        "markdown")
            cat << EOF
## Environment Status

- **Node.js**: $([ "$has_node" = "true" ] && echo "✅ $node_version" || echo "❌ Not installed")
- **npm**: $([ "$has_npm" = "true" ] && echo "✅ $npm_version" || echo "❌ Not installed")
- **Git**: $([ "$has_git" = "true" ] && echo "✅ $git_version" || echo "❌ Not installed")
- **Docker**: $([ "$has_docker" = "true" ] && echo "✅ $docker_version" || echo "❌ Not installed")$([ "$has_docker" = "true" ] && [ "$docker_running" = "false" ] && echo " (not running)" || echo "")

EOF
            ;;
        *)
            echo -e "${BLUE}${EMOJI_GEAR} Environment Status:${NC}"
            echo -e "   Node.js: $([ "$has_node" = "true" ] && echo "${STATUS_GOOD} $node_version" || echo "${STATUS_ERROR} Not installed")"
            echo -e "   npm: $([ "$has_npm" = "true" ] && echo "${STATUS_GOOD} $npm_version" || echo "${STATUS_ERROR} Not installed")"
            echo -e "   Git: $([ "$has_git" = "true" ] && echo "${STATUS_GOOD} $git_version" || echo "${STATUS_ERROR} Not installed")"
            
            if [ "$has_docker" = "true" ]; then
                if [ "$docker_running" = "true" ]; then
                    echo -e "   Docker: ${STATUS_GOOD} $docker_version (running)"
                else
                    echo -e "   Docker: ${STATUS_WARNING} $docker_version (not running)"
                fi
            else
                echo -e "   Docker: ${STATUS_ERROR} Not installed"
            fi
            echo ""
            ;;
    esac
}

# Generate complete status report
generate_full_status() {
    local format=$1
    local timestamp=""
    
    if [ "$2" = "--timestamp" ]; then
        timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    fi
    
    case $format in
        "ai")
            echo "=== AI CODING TEMPLATE STATUS REPORT ==="
            [ -n "$timestamp" ] && echo "TIMESTAMP: $timestamp"
            echo "PROJECT: AI Coding Template"
            echo "FORMAT: AI_OPTIMIZED"
            echo ""
            
            get_git_status "ai" | sed 's/[{}]//g' | sed 's/"//g' | sed 's/,//g' | grep -v '^$'
            echo ""
            get_project_status "ai" | sed 's/[{}]//g' | sed 's/"//g' | sed 's/,//g' | grep -v '^$'
            echo ""
            get_environment_status "ai" | sed 's/[{}]//g' | sed 's/"//g' | sed 's/,//g' | grep -v '^$'
            echo ""
            echo "=== END STATUS REPORT ==="
            ;;
        "json")
            echo "{"
            [ -n "$timestamp" ] && echo "  \"timestamp\": \"$timestamp\","
            echo "  \"project\": \"AI Coding Template\","
            get_git_status "json" | sed '1d;$d'
            echo ","
            get_project_status "json" | sed '1d;$d'
            echo ","
            get_environment_status "json" | sed '1d;$d'
            echo "}"
            ;;
        "markdown")
            echo "# AI Coding Template Status Report"
            echo ""
            [ -n "$timestamp" ] && echo "**Generated**: $timestamp"
            echo ""
            get_git_status "markdown"
            get_project_status "markdown"
            get_environment_status "markdown"
            ;;
        *)
            log_header "AI Coding Template Status Dashboard"
            [ -n "$timestamp" ] && echo -e "${CYAN}Generated: $timestamp${NC}"
            echo ""
            
            get_git_status "human"
            get_project_status "human"
            get_environment_status "human"
            
            echo -e "${PURPLE}================================================${NC}"
            ;;
    esac
}

# Main function
main() {
    local format="human"
    local component="full"
    local timestamp=""
    local color=true
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --ai-format)
                format="ai"
                shift
                ;;
            --json)
                format="json"
                shift
                ;;
            --markdown)
                format="markdown"
                shift
                ;;
            --human)
                format="human"
                shift
                ;;
            --git-only)
                component="git"
                shift
                ;;
            --project-only)
                component="project"
                shift
                ;;
            --env-only)
                component="environment"
                shift
                ;;
            --timestamp)
                timestamp="--timestamp"
                shift
                ;;
            --no-color)
                color=false
                # Clear color variables
                GREEN='' RED='' YELLOW='' BLUE='' PURPLE='' CYAN='' BOLD='' NC=''
                shift
                ;;
            --help|-h)
                show_usage
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Generate status based on component
    case $component in
        "git")
            get_git_status "$format"
            ;;
        "project")
            get_project_status "$format"
            ;;
        "environment")
            get_environment_status "$format"
            ;;
        *)
            generate_full_status "$format" "$timestamp"
            ;;
    esac
}

# Change to project root
cd "$PROJECT_ROOT"

# Execute main function
main "$@"
#!/usr/bin/env bash

# Template Development Sync System
# Bidirectional sync between template source and project instances
# Uses .template-manifest.json to identify template files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

# Configuration
MANIFEST_FILE="$PROJECT_DIR/.template-manifest.json"
CONFIG_FILE="$PROJECT_DIR/.template-dev.json"
TEMPLATE_DIR=""
MODE=""
DRY_RUN=false
VERBOSE=false
FORCE=false

# Stats
PULLED_COUNT=0
PUSHED_COUNT=0
SKIPPED_COUNT=0
CONFLICT_COUNT=0

#####################################
# Helper Functions
#####################################

log_info() {
    echo -e "${CYAN}ℹ${NC}  $1"
}

log_success() {
    echo -e "${GREEN}✓${NC}  $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

log_error() {
    echo -e "${RED}✗${NC}  $1"
}

log_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${BLUE}→${NC}  $1"
    fi
}

#####################################
# Configuration Management
#####################################

load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        TEMPLATE_DIR=$(jq -r '.templateRepo // empty' "$CONFIG_FILE")
        log_verbose "Loaded template dir from config: $TEMPLATE_DIR"
    fi
}

create_config() {
    log_info "Creating .template-dev.json configuration..."

    echo -n "Enter path to template repository (e.g., ~/dev/ai-coding-template): "
    read -r template_path

    # Expand tilde
    template_path="${template_path/#\~/$HOME}"

    if [ ! -d "$template_path" ]; then
        log_error "Directory does not exist: $template_path"
        exit 1
    fi

    cat > "$CONFIG_FILE" <<EOF
{
  "templateRepo": "$template_path",
  "autoCommit": false,
  "defaultMode": "bidirectional",
  "verbose": false
}
EOF

    log_success "Created $CONFIG_FILE"
    TEMPLATE_DIR="$template_path"
}

detect_template_dir() {
    # Try common locations
    local candidates=(
        "../ai-coding-template"
        "../../ai-coding-template"
        "$HOME/dev/ai-coding-template"
        "$HOME/projects/ai-coding-template"
    )

    for candidate in "${candidates[@]}"; do
        candidate="${candidate/#\~/$HOME}"
        if [ -f "$candidate/.template-manifest.json" ]; then
            log_success "Detected template at: $candidate"
            TEMPLATE_DIR="$candidate"
            return 0
        fi
    done

    return 1
}

#####################################
# Manifest Processing
#####################################

get_category_files() {
    local category=$1
    local files=()

    # Get files from manifest category
    local file_patterns=$(jq -r ".categories.$category.files[]" "$MANIFEST_FILE" 2>/dev/null || echo "")

    if [ -z "$file_patterns" ]; then
        return 1
    fi

    # Expand glob patterns
    while IFS= read -r pattern; do
        # Handle directory patterns
        if [[ "$pattern" == */ ]]; then
            pattern="${pattern%/}"
        fi

        # Expand pattern relative to project dir
        cd "$PROJECT_DIR"
        for file in $pattern; do
            if [ -e "$file" ] || [ -e "$TEMPLATE_DIR/$file" ]; then
                files+=("$file")
            fi
        done
    done <<< "$file_patterns"

    printf '%s\n' "${files[@]}"
}

#####################################
# Sync Operations
#####################################

analyze_file() {
    local file=$1
    local project_path="$PROJECT_DIR/$file"
    local template_path="$TEMPLATE_DIR/$file"

    local action="skip"
    local reason=""

    # Check existence
    local project_exists=false
    local template_exists=false

    [ -e "$project_path" ] && project_exists=true
    [ -e "$template_path" ] && template_exists=true

    if [ "$project_exists" = false ] && [ "$template_exists" = false ]; then
        reason="File does not exist in either location"
        echo "skip|$reason"
        return
    fi

    if [ "$project_exists" = false ] && [ "$template_exists" = true ]; then
        if [ "$MODE" = "push" ]; then
            reason="File only exists in template"
            echo "skip|$reason"
        else
            reason="New file from template"
            echo "pull|$reason"
        fi
        return
    fi

    if [ "$project_exists" = true ] && [ "$template_exists" = false ]; then
        if [ "$MODE" = "pull" ]; then
            reason="File only exists in project"
            echo "skip|$reason"
        else
            reason="New file in project"
            echo "push|$reason"
        fi
        return
    fi

    # Both exist - compare content
    if diff -q "$project_path" "$template_path" > /dev/null 2>&1; then
        reason="Files are identical"
        echo "skip|$reason"
        return
    fi

    # Files differ - check mode
    if [ "$MODE" = "pull" ]; then
        reason="Update from template"
        echo "pull|$reason"
    elif [ "$MODE" = "push" ]; then
        reason="Push changes to template"
        echo "push|$reason"
    else
        # Bidirectional - use timestamps
        project_time=$(stat -c %Y "$project_path" 2>/dev/null || stat -f %m "$project_path" 2>/dev/null)
        template_time=$(stat -c %Y "$template_path" 2>/dev/null || stat -f %m "$template_path" 2>/dev/null)

        if [ "$template_time" -gt "$project_time" ]; then
            reason="Template is newer"
            echo "pull|$reason"
        elif [ "$project_time" -gt "$template_time" ]; then
            reason="Project is newer"
            echo "push|$reason"
        else
            reason="Files differ but have same timestamp"
            echo "conflict|$reason"
        fi
    fi
}

sync_file() {
    local action=$1
    local file=$2
    local project_path="$PROJECT_DIR/$file"
    local template_path="$TEMPLATE_DIR/$file"

    if [ "$action" = "pull" ]; then
        # Create directory if needed
        mkdir -p "$(dirname "$project_path")"

        if [ "$DRY_RUN" = false ]; then
            cp -r "$template_path" "$project_path"
            log_verbose "Pulled: $file"
        else
            log_verbose "[DRY RUN] Would pull: $file"
        fi
        ((PULLED_COUNT++))

    elif [ "$action" = "push" ]; then
        # Create directory if needed
        mkdir -p "$(dirname "$template_path")"

        if [ "$DRY_RUN" = false ]; then
            cp -r "$project_path" "$template_path"
            log_verbose "Pushed: $file"
        else
            log_verbose "[DRY RUN] Would push: $file"
        fi
        ((PUSHED_COUNT++))
    fi
}

#####################################
# Main Sync Logic
#####################################

run_sync() {
    log_info "🔄 Template Development Sync"
    echo ""

    # Validate setup
    if [ ! -f "$MANIFEST_FILE" ]; then
        log_error "Not in a template project. Missing .template-manifest.json"
        exit 1
    fi

    if [ -z "$TEMPLATE_DIR" ]; then
        log_warning "Template directory not configured"
        if ! detect_template_dir; then
            create_config
        fi
    fi

    if [ ! -d "$TEMPLATE_DIR" ]; then
        log_error "Template directory not found: $TEMPLATE_DIR"
        exit 1
    fi

    log_info "📁 Project: $PROJECT_DIR"
    log_info "📂 Template: $TEMPLATE_DIR"
    log_info "🔄 Mode: $MODE"
    [ "$DRY_RUN" = true ] && log_warning "DRY RUN - no changes will be made"
    echo ""

    # Process syncable categories (core and reference)
    local -a pull_files=()
    local -a push_files=()
    local -a conflict_files=()

    for category in "core" "reference"; do
        log_verbose "Processing category: $category"

        while IFS= read -r file; do
            [ -z "$file" ] && continue

            IFS='|' read -r action reason <<< "$(analyze_file "$file")"

            case "$action" in
                pull)
                    pull_files+=("$file|$reason")
                    ;;
                push)
                    push_files+=("$file|$reason")
                    ;;
                conflict)
                    conflict_files+=("$file|$reason")
                    ;;
                skip)
                    ((SKIPPED_COUNT++))
                    log_verbose "Skipped: $file ($reason)"
                    ;;
            esac
        done < <(get_category_files "$category")
    done

    # Display plan
    echo "📋 Sync Plan:"
    echo "═══════════════════════════════════════════════════════"
    echo "📥 Pull (Template → Project): ${#pull_files[@]}"
    echo "📤 Push (Project → Template): ${#push_files[@]}"
    echo "⚠️  Conflicts: ${#conflict_files[@]}"
    echo "⏭️  Skipped: $SKIPPED_COUNT"
    echo ""

    if [ "$VERBOSE" = true ] || [ "${#conflict_files[@]}" -gt 0 ]; then
        if [ "${#pull_files[@]}" -gt 0 ]; then
            echo "📥 Files to pull from template:"
            for item in "${pull_files[@]}"; do
                IFS='|' read -r file reason <<< "$item"
                echo "   📄 $file ($reason)"
            done
            echo ""
        fi

        if [ "${#push_files[@]}" -gt 0 ]; then
            echo "📤 Files to push to template:"
            for item in "${push_files[@]}"; do
                IFS='|' read -r file reason <<< "$item"
                echo "   📄 $file ($reason)"
            done
            echo ""
        fi

        if [ "${#conflict_files[@]}" -gt 0 ]; then
            echo "⚠️  Conflicts requiring resolution:"
            for item in "${conflict_files[@]}"; do
                IFS='|' read -r file reason <<< "$item"
                echo "   ⚠️  $file - $reason"
            done
            echo ""
        fi
    fi

    # Handle conflicts
    if [ "${#conflict_files[@]}" -gt 0 ] && [ "$FORCE" = false ]; then
        log_warning "Conflicts detected. Use --force to overwrite or resolve manually."
        exit 1
    fi

    if [ "$DRY_RUN" = true ]; then
        log_info "🔍 Dry run complete - no files were synced"
        exit 0
    fi

    # Execute sync
    log_info "🔧 Executing sync operations..."

    for item in "${pull_files[@]}"; do
        IFS='|' read -r file reason <<< "$item"
        sync_file "pull" "$file"
    done

    for item in "${push_files[@]}"; do
        IFS='|' read -r file reason <<< "$item"
        sync_file "push" "$file"
    done

    # Report results
    echo ""
    echo "📊 Sync Results:"
    echo "═══════════════════════════════════════════════════════"
    total=$((PULLED_COUNT + PUSHED_COUNT))
    log_success "Successfully synced: $total files"
    echo "   📥 Pulled: $PULLED_COUNT"
    echo "   📤 Pushed: $PUSHED_COUNT"

    if [ "$total" -gt 0 ]; then
        echo ""
        log_success "🎉 Template sync completed successfully!"
        echo ""
        echo "💡 Next Steps:"
        echo "   - Review synced changes with: git diff"
        echo "   - Test functionality in your project"
        if [ "$PUSHED_COUNT" -gt 0 ]; then
            echo "   - Commit template improvements: cd $TEMPLATE_DIR && git commit"
        fi
    else
        echo ""
        log_success "✅ No changes needed - template and project are in sync"
    fi
}

run_status() {
    log_info "📊 Template Sync Status"
    echo ""

    # Similar to run_sync but just shows status
    # Implementation similar to above but without actual sync
    MODE="bidirectional"
    DRY_RUN=true
    VERBOSE=true
    run_sync
}

run_diff() {
    local file=${1:-}

    if [ -z "$file" ]; then
        log_error "Usage: template-sync diff <file>"
        exit 1
    fi

    local project_path="$PROJECT_DIR/$file"
    local template_path="$TEMPLATE_DIR/$file"

    if [ ! -f "$project_path" ]; then
        log_error "File not found in project: $file"
        exit 1
    fi

    if [ ! -f "$template_path" ]; then
        log_error "File not found in template: $file"
        exit 1
    fi

    diff -u "$template_path" "$project_path" || true
}

run_claude_diff() {
    log_info "📊 Comparing CLAUDE.md files"
    echo ""

    # Ensure template dir is set
    if [ -z "$TEMPLATE_DIR" ]; then
        if ! detect_template_dir; then
            create_config
        fi
    fi

    local project_claude="$PROJECT_DIR/CLAUDE.md"
    local template_claude="$TEMPLATE_DIR/.claude/CLAUDE-template.md"

    if [ ! -f "$project_claude" ]; then
        log_error "Project CLAUDE.md not found"
        exit 1
    fi

    if [ ! -f "$template_claude" ]; then
        log_error "Template CLAUDE-template.md not found at: $template_claude"
        exit 1
    fi

    echo "Comparing:"
    echo "  Your version:     CLAUDE.md"
    echo "  Template version: .claude/CLAUDE-template.md"
    echo ""

    # Try to use colordiff if available, otherwise regular diff
    if command -v colordiff &> /dev/null; then
        diff -u "$template_claude" "$project_claude" | colordiff || true
    else
        diff -u "$template_claude" "$project_claude" || true
    fi

    echo ""
    log_info "💡 To merge template improvements:"
    echo "   1. Review differences above"
    echo "   2. Edit CLAUDE.md with desired changes"
    echo "   3. Update 'Last compared with template' date in CLAUDE.md comment"
}

run_claude_status() {
    log_info "📊 CLAUDE.md Sync Status"
    echo ""

    # Ensure template dir is set
    if [ -z "$TEMPLATE_DIR" ]; then
        if ! detect_template_dir; then
            create_config
        fi
    fi

    local project_claude="$PROJECT_DIR/CLAUDE.md"
    local template_claude="$TEMPLATE_DIR/.claude/CLAUDE-template.md"

    if [ ! -f "$project_claude" ]; then
        log_error "Project CLAUDE.md not found"
        exit 1
    fi

    if [ ! -f "$template_claude" ]; then
        log_warning "Template CLAUDE-template.md not found at: $template_claude"
        echo "This may be expected if working with an older template version."
        exit 0
    fi

    # Remove comment headers before comparing (since project has tracking header)
    if diff -q <(grep -v "^<!--" "$project_claude" | grep -v "^-->") \
               <(grep -v "^<!--" "$template_claude" | grep -v "^-->") > /dev/null 2>&1; then
        log_success "✓ CLAUDE.md matches template (ignoring comments)"
    else
        log_warning "⚠ CLAUDE.md differs from template"
        echo "  Run: template-sync.sh claude-diff to see changes"
    fi
}

#####################################
# CLI
#####################################

show_help() {
    cat << EOF
Template Development Sync System

Usage:
  template-sync <command> [options]

Commands:
  pull              Pull template updates into project
  push              Push project improvements to template
  status            Show sync status without making changes
  diff <file>       Show diff for specific file
  config            Create/update configuration
  claude-diff       Compare CLAUDE.md with template version
  claude-status     Check if CLAUDE.md matches template

Options:
  --template-dir DIR  Path to template repository
  --dry-run          Preview changes without applying
  --verbose          Show detailed output
  --force            Force sync even with conflicts
  --help             Show this help message

Examples:
  template-sync pull
  template-sync push --dry-run
  template-sync status --verbose
  template-sync diff .claude/agents/code-architect.md
  template-sync claude-diff
  template-sync claude-status

Configuration:
  Create .template-dev.json in project root:
  {
    "templateRepo": "/path/to/template",
    "autoCommit": false,
    "defaultMode": "bidirectional"
  }

CLAUDE.md Management:
  - CLAUDE.md (root) = Your customized version (never syncs)
  - .claude/CLAUDE-template.md = Template reference (syncs)
  - Use claude-diff to see template updates
  - Manually merge improvements to preserve customizations

EOF
}

#####################################
# Main
#####################################

main() {
    # Check for jq
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed. Install with: brew install jq (macOS) or apt-get install jq (Linux)"
        exit 1
    fi

    # Load configuration
    load_config

    # Parse arguments
    COMMAND=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            pull|push|status|diff|config|claude-diff|claude-status)
                COMMAND=$1
                shift
                ;;
            --template-dir)
                TEMPLATE_DIR="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --force)
                FORCE=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                if [ -z "$COMMAND" ]; then
                    log_error "Unknown command: $1"
                    show_help
                    exit 1
                else
                    # Additional argument for command (e.g., file for diff)
                    break
                fi
                ;;
        esac
    done

    if [ -z "$COMMAND" ]; then
        show_help
        exit 1
    fi

    # Set mode based on command
    case $COMMAND in
        pull)
            MODE="pull"
            run_sync
            ;;
        push)
            MODE="push"
            run_sync
            ;;
        status)
            MODE="bidirectional"
            run_status
            ;;
        diff)
            run_diff "$@"
            ;;
        config)
            create_config
            ;;
        claude-diff)
            run_claude_diff
            ;;
        claude-status)
            run_claude_status
            ;;
        *)
            log_error "Unknown command: $COMMAND"
            show_help
            exit 1
            ;;
    esac
}

main "$@"

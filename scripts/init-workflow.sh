#!/bin/bash
# Workflow Initialization Script
# Sets up proper workflow structure for plan → iterate coordination

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default values
ISSUE_KEY=""
DELIVERABLE_NAME=""
FORCE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --issue)
            ISSUE_KEY="$2"
            shift 2
            ;;
        --deliverable)
            DELIVERABLE_NAME="$2"
            shift 2
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 --issue ISSUE-KEY [--deliverable DELIVERABLE-NAME] [--force]"
            echo ""
            echo "Options:"
            echo "  --issue ISSUE-KEY           Issue identifier (required)"
            echo "  --deliverable DELIVERABLE   Deliverable name (auto-detected if not provided)"
            echo "  --force                     Overwrite existing files"
            echo "  -h, --help                 Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --issue AUTH-123"
            echo "  $0 --issue AUTH-123 --deliverable user-management"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Validation
if [ -z "$ISSUE_KEY" ]; then
    echo -e "${RED}Error:${NC} --issue is required"
    echo "Use --help for usage information"
    exit 1
fi

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Find template directory
find_template_dir() {
    local template_dir=""

    # Look for template in common locations
    if [ -d "deliverables/template-deliverable" ]; then
        template_dir="deliverables/template-deliverable"
    elif [ -d "../deliverables/template-deliverable" ]; then
        template_dir="../deliverables/template-deliverable"
    elif [ -d "../../deliverables/template-deliverable" ]; then
        template_dir="../../deliverables/template-deliverable"
    fi

    if [ -z "$template_dir" ]; then
        log_error "Could not find template-deliverable directory"
        log_error "Ensure you're in the project root or a deliverable directory"
        return 1
    fi

    echo "$template_dir"
    return 0
}

# Auto-detect or validate deliverable
setup_deliverable() {
    if [ -n "$DELIVERABLE_NAME" ]; then
        # Explicit deliverable name provided
        DELIVERABLE_PATH="deliverables/$DELIVERABLE_NAME"
    else
        # Try to auto-detect current deliverable
        current_dir=$(basename "$(pwd)")
        parent_dir=$(basename "$(dirname "$(pwd)")")

        if [ "$parent_dir" = "deliverables" ]; then
            # We're in a deliverable directory
            DELIVERABLE_NAME="$current_dir"
            DELIVERABLE_PATH="."
        else
            # Default to issue-based deliverable name
            DELIVERABLE_NAME=$(echo "$ISSUE_KEY" | cut -d'-' -f1 | tr '[:upper:]' '[:lower:]')
            DELIVERABLE_PATH="deliverables/$DELIVERABLE_NAME"
        fi
    fi

    log_info "Using deliverable: $DELIVERABLE_NAME"
    log_info "Deliverable path: $DELIVERABLE_PATH"
}

# Create directory structure
create_directories() {
    log_step "Creating directory structure..."

    local issue_dir="$DELIVERABLE_PATH/issues/$ISSUE_KEY"

    if [ -d "$issue_dir" ] && [ "$FORCE" != true ]; then
        log_error "Issue directory already exists: $issue_dir"
        log_error "Use --force to overwrite"
        return 1
    fi

    # Create deliverable and issue directories
    mkdir -p "$issue_dir"
    log_info "Created: $issue_dir"

    return 0
}

# Copy and customize template files
setup_template_files() {
    log_step "Setting up template files..."

    local template_dir
    template_dir=$(find_template_dir)
    if [ $? -ne 0 ]; then
        return 1
    fi

    local issue_dir="$DELIVERABLE_PATH/issues/$ISSUE_KEY"
    local template_issue_dir="$template_dir/issues/template"

    # Copy template files
    for file in PLAN.md README.md HANDOFF.yml RESEARCH.md; do
        if [ -f "$template_issue_dir/$file" ]; then
            cp "$template_issue_dir/$file" "$issue_dir/"
            log_info "Copied: $file"

            # Customize file content
            customize_template_file "$issue_dir/$file"
        else
            log_warn "Template file not found: $template_issue_dir/$file"
        fi
    done

    return 0
}

# Customize template file content
customize_template_file() {
    local file="$1"
    local filename=$(basename "$file")

    case "$filename" in
        "README.md")
            sed -i "s/\[ISSUE-KEY\]/$ISSUE_KEY/g" "$file"
            sed -i "s/\[Brief Title\]/Issue $ISSUE_KEY/g" "$file"
            ;;
        "RESEARCH.md")
            sed -i "s/\[ISSUE-KEY\]/$ISSUE_KEY/g" "$file"
            sed -i "s/\[Brief Title\]/Issue $ISSUE_KEY/g" "$file"
            sed -i "s/\[Date\]/$(date +%Y-%m-%d)/g" "$file"
            ;;
        "HANDOFF.yml")
            sed -i "s/YYYY-MM-DDTHH:MM:SSZ/$(date -u +%Y-%m-%dT%H:%M:%SZ)/g" "$file"
            ;;
    esac

    log_info "Customized: $filename"
}

# Create deliverable README if needed
setup_deliverable_readme() {
    local deliverable_readme="$DELIVERABLE_PATH/README.md"

    if [ ! -f "$deliverable_readme" ]; then
        log_step "Creating deliverable README..."

        cat > "$deliverable_readme" << EOF
# $DELIVERABLE_NAME

**Deliverable**: $DELIVERABLE_NAME
**Created**: $(date +%Y-%m-%d)

## Overview

Brief description of this deliverable and its purpose.

## Issues

- [$ISSUE_KEY](./issues/$ISSUE_KEY/) - Issue $ISSUE_KEY

## Status

- 🟡 In Progress

## Architecture Notes

Key architectural decisions and patterns used in this deliverable.

## Dependencies

External dependencies and integration points.
EOF

        log_info "Created deliverable README: $deliverable_readme"
    else
        log_info "Deliverable README already exists: $deliverable_readme"
    fi
}

# Validate setup
validate_setup() {
    log_step "Validating setup..."

    local issue_dir="$DELIVERABLE_PATH/issues/$ISSUE_KEY"

    # Check required files exist
    local required_files=("PLAN.md" "README.md" "HANDOFF.yml" "RESEARCH.md")
    for file in "${required_files[@]}"; do
        if [ ! -f "$issue_dir/$file" ]; then
            log_error "Missing required file: $issue_dir/$file"
            return 1
        fi
    done

    # Validate with context validation script
    if [ -f "scripts/validate-context.sh" ]; then
        log_info "Running context validation..."
        cd "$issue_dir"
        if ../../../scripts/validate-context.sh --quiet; then
            log_info "✅ Context validation passed"
        else
            log_warn "⚠️  Context validation found issues"
        fi
        cd - > /dev/null
    fi

    return 0
}

# Main execution
log_info "Initializing workflow for issue: $ISSUE_KEY"

# Setup deliverable
setup_deliverable

# Create directories
if ! create_directories; then
    exit 1
fi

# Setup template files
if ! setup_template_files; then
    exit 1
fi

# Create deliverable README if needed
setup_deliverable_readme

# Validate setup
if ! validate_setup; then
    log_error "Setup validation failed"
    exit 1
fi

# Success message
echo ""
log_info "✅ Workflow initialization complete!"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. cd $DELIVERABLE_PATH/issues/$ISSUE_KEY"
echo "2. Run: /plan --issue $ISSUE_KEY"
echo "3. Review generated PLAN.md"
echo "4. Start execution: /iterate"
echo ""
echo -e "${BLUE}Files created:${NC}"
echo "- $DELIVERABLE_PATH/issues/$ISSUE_KEY/PLAN.md"
echo "- $DELIVERABLE_PATH/issues/$ISSUE_KEY/README.md"
echo "- $DELIVERABLE_PATH/issues/$ISSUE_KEY/HANDOFF.yml"
echo "- $DELIVERABLE_PATH/issues/$ISSUE_KEY/RESEARCH.md"

if [ ! -f "$DELIVERABLE_PATH/README.md" ]; then
    echo "- $DELIVERABLE_PATH/README.md"
fi
#!/bin/bash

# Pre-commit hook for link validation
# Validates only changed documentation files for performance
# Usage: This script should be called from a git pre-commit hook

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LINK_VALIDATOR="$PROJECT_ROOT/.claude/resources/scripts/docs/link-validator.sh"

# Logging functions
log_info() {
    echo -e "${GREEN}[PRE-COMMIT]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[PRE-COMMIT]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[PRE-COMMIT]${NC} $1" >&2
}

# Function to get staged markdown files
get_staged_md_files() {
    git diff --cached --name-only --diff-filter=ACM | grep '\.md$' || true
}

# Function to create temporary directory with staged files
create_temp_workspace() {
    local temp_dir="/tmp/link-validation-$$"
    mkdir -p "$temp_dir"

    # Copy entire project structure to temp directory to maintain relative paths
    cp -r "$PROJECT_ROOT"/* "$temp_dir/" 2>/dev/null || true
    cp -r "$PROJECT_ROOT"/.* "$temp_dir/" 2>/dev/null || true

    # Checkout staged versions of modified files
    while IFS= read -r file; do
        if [[ -n "$file" ]]; then
            local dir="$(dirname "$temp_dir/$file")"
            mkdir -p "$dir"
            git show ":$file" > "$temp_dir/$file" 2>/dev/null || true
        fi
    done < <(get_staged_md_files)

    echo "$temp_dir"
}

# Main validation logic
main() {
    cd "$PROJECT_ROOT"

    # Check if link validator exists
    if [[ ! -f "$LINK_VALIDATOR" ]]; then
        log_warn "Link validator not found at $LINK_VALIDATOR"
        log_warn "Skipping link validation"
        exit 0
    fi

    # Get list of staged markdown files
    local staged_files
    staged_files=$(get_staged_md_files)

    if [[ -z "$staged_files" ]]; then
        log_info "No markdown files staged for commit"
        exit 0
    fi

    log_info "Validating links in staged markdown files..."
    echo "Files to validate:"
    echo "$staged_files" | sed 's/^/  - /'

    # Create temporary workspace with staged content
    local temp_dir
    temp_dir=$(create_temp_workspace)

    # Change to temp directory and run validation
    cd "$temp_dir"

    # Copy the link validator to temp directory
    cp "$LINK_VALIDATOR" "./link-validator-temp.sh"
    chmod +x "./link-validator-temp.sh"

    # Run validation in CI mode (fast, no external validation, no report)
    local validation_result=0
    if ./link-validator-temp.sh --ci --fast --no-report 2>&1 | tee /tmp/pre-commit-link-validation.log; then
        log_info "✅ All links in staged files are valid"
    else
        validation_result=$?
        log_error "❌ Broken links detected in staged files"
        echo ""
        echo "Link validation output:"
        cat /tmp/pre-commit-link-validation.log
        echo ""
        log_error "Please fix broken links before committing"
        log_info "Run '.claude/resources/scripts/docs/link-validator.sh' for detailed analysis"
    fi

    # Cleanup
    cd "$PROJECT_ROOT"
    rm -rf "$temp_dir"
    rm -f /tmp/pre-commit-link-validation.log

    exit $validation_result
}

# Handle script interruption
trap 'rm -rf /tmp/link-validation-$$ /tmp/pre-commit-link-validation.log 2>/dev/null || true' EXIT

# Run main function
main "$@"
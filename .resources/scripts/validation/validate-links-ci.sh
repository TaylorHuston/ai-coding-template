#!/bin/bash

# CI Link Validation Script
# Comprehensive link validation for CI/CD pipelines
# Usage: ./validate-links-ci.sh [OPTIONS]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
LINK_VALIDATOR="$PROJECT_ROOT/.resources/scripts/docs/link-validator.sh"

# Default options
VALIDATE_EXTERNAL=false
GENERATE_REPORT=true
FAIL_FAST=false
VERBOSE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --external)
            VALIDATE_EXTERNAL=true
            shift
            ;;
        --no-report)
            GENERATE_REPORT=false
            shift
            ;;
        --fail-fast)
            FAIL_FAST=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "CI Link Validation Script"
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --external     Also validate external URLs (slower)"
            echo "  --no-report    Skip generating detailed report"
            echo "  --fail-fast    Exit immediately on first failure"
            echo "  --verbose      Enable verbose output"
            echo "  --help         Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Logging functions
log_info() {
    if [[ "$VERBOSE" == true ]]; then
        echo -e "${BLUE}[CI-LINKS]${NC} $1"
    fi
}

log_success() {
    echo -e "${GREEN}[CI-LINKS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[CI-LINKS]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[CI-LINKS]${NC} $1" >&2
}

# Function to validate environment
validate_environment() {
    local errors=0

    # Check if link validator exists
    if [[ ! -f "$LINK_VALIDATOR" ]]; then
        log_error "Link validator not found at: $LINK_VALIDATOR"
        ((errors++))
    fi

    # Check if curl is available (needed for external validation)
    if [[ "$VALIDATE_EXTERNAL" == true ]] && ! command -v curl >/dev/null 2>&1; then
        log_error "curl is required for external link validation but not found"
        ((errors++))
    fi

    # Check if we're in a git repository
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        log_warn "Not in a git repository - continuing anyway"
    fi

    return $errors
}

# Function to run validation with appropriate options
run_validation() {
    local validation_args="--ci"

    if [[ "$VALIDATE_EXTERNAL" != true ]]; then
        validation_args="$validation_args --fast"
    else
        validation_args="$validation_args --external"
    fi

    if [[ "$GENERATE_REPORT" != true ]]; then
        validation_args="$validation_args --no-report"
    fi

    log_info "Running link validation with: $validation_args"

    # Run the validation
    if "$LINK_VALIDATOR" $validation_args; then
        log_success "Link validation passed"
        return 0
    else
        local exit_code=$?
        log_error "Link validation failed with exit code: $exit_code"
        return $exit_code
    fi
}

# Function to handle validation results
handle_results() {
    local exit_code=$1

    if [[ $exit_code -eq 0 ]]; then
        log_success "✅ All documentation links are valid"

        if [[ "$GENERATE_REPORT" == true ]]; then
            local report_file="$PROJECT_ROOT/.claude/working/broken-links-report.md"
            if [[ -f "$report_file" ]]; then
                log_info "Report saved to: $report_file"
            fi
        fi

        return 0
    else
        log_error "❌ Documentation link validation failed"

        if [[ "$GENERATE_REPORT" == true ]]; then
            local report_file="$PROJECT_ROOT/.claude/working/broken-links-report.md"
            if [[ -f "$report_file" ]]; then
                log_error "Detailed report available at: $report_file"

                # Show summary of broken links
                if [[ "$VERBOSE" == true ]] && grep -q "## Statistics" "$report_file"; then
                    echo ""
                    echo "Summary from report:"
                    sed -n '/## Statistics/,/## /p' "$report_file" | head -n -1
                fi
            fi
        fi

        return $exit_code
    fi
}

# Main execution
main() {
    echo ""
    log_info "=== CI Link Validation ==="
    log_info "Project: $(basename "$PROJECT_ROOT")"
    log_info "External validation: $VALIDATE_EXTERNAL"
    log_info "Generate report: $GENERATE_REPORT"
    echo ""

    # Validate environment
    if ! validate_environment; then
        log_error "Environment validation failed"
        exit 1
    fi

    # Change to project root
    cd "$PROJECT_ROOT"

    # Run validation
    local validation_result=0
    if ! run_validation; then
        validation_result=$?

        if [[ "$FAIL_FAST" == true ]]; then
            log_error "Failing fast due to validation errors"
            exit $validation_result
        fi
    fi

    # Handle results
    handle_results $validation_result

    return $validation_result
}

# Error handling
trap 'log_error "Script interrupted"; exit 130' INT

# Run main function
main "$@"
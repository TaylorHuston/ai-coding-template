#!/bin/bash
# Claude Code Pre-Edit Hook - Quality and TDD Validation
# Runs before Edit/Write/MultiEdit tools to enforce quality gates and TDD

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Parse hook arguments - Claude Code passes tool information
TOOL_NAME="$1"
FILE_PATH="$2"
shift 2
TOOL_ARGS="$*"

# Only validate for Edit, Write, MultiEdit tools
case "$TOOL_NAME" in
    "Edit"|"Write"|"MultiEdit")
        ;;
    *)
        exit 0
        ;;
esac

# Logging functions
log_info() {
    echo -e "${GREEN}[HOOK]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[HOOK]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[HOOK]${NC} $1" >&2
}

# Check if we're in a workflow context
is_workflow_context() {
    local current_dir="$(pwd)"
    while [ "$current_dir" != "/" ]; do
        if [ -f "$current_dir/PLAN.md" ]; then
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    return 1
}

# Check if file is an implementation file
is_implementation_file() {
    local file="$1"

    # Check for common implementation directories and file extensions
    if echo "$file" | grep -E "(src/|lib/|app/|components/)" | grep -E "\.(js|ts|jsx|tsx|py|go|rs|java|cpp|c)$" >/dev/null; then
        return 0
    fi

    return 1
}

# Check if file is a test file
is_test_file() {
    local file="$1"

    if echo "$file" | grep -E "\.(test|spec)\." >/dev/null; then
        return 0
    fi

    return 1
}

# Find corresponding test file for implementation
find_test_file() {
    local impl_file="$1"
    local base_name dir_name

    base_name=$(basename "$impl_file" | sed 's/\.[^.]*$//')
    dir_name=$(dirname "$impl_file")

    # Common test file patterns
    local test_patterns=(
        "${dir_name}/${base_name}.test.js"
        "${dir_name}/${base_name}.test.ts"
        "${dir_name}/${base_name}.test.jsx"
        "${dir_name}/${base_name}.test.tsx"
        "${dir_name}/${base_name}.spec.js"
        "${dir_name}/${base_name}.spec.ts"
        "test/${base_name}.test.js"
        "tests/${base_name}.test.js"
        "__tests__/${base_name}.test.js"
        "${dir_name}/__tests__/${base_name}.test.js"
    )

    for pattern in "${test_patterns[@]}"; do
        if [ -f "$pattern" ]; then
            echo "$pattern"
            return 0
        fi
    done

    return 1
}

# TDD enforcement for implementation files
enforce_tdd() {
    local file="$1"

    log_info "Checking TDD compliance for: $file"

    if is_test_file "$file"; then
        log_info "✅ Writing test file - TDD compliant"
        return 0
    fi

    if is_implementation_file "$file"; then
        log_info "Implementation file detected - checking for tests"

        local test_file
        test_file=$(find_test_file "$file")

        if [ $? -eq 0 ]; then
            log_info "✅ Found test file: $test_file"
            return 0
        else
            log_error "❌ No test file found for implementation: $file"
            log_error "TDD requires tests before implementation"
            log_error "Please create a test file first or use --force to override"

            # Check if this is a force override
            if echo "$TOOL_ARGS" | grep -q "force\|--force"; then
                log_warn "⚠️  Force override detected - allowing implementation without tests"
                return 0
            fi

            return 1
        fi
    fi

    log_info "✅ File is not implementation code - skipping TDD check"
    return 0
}

# Basic quality gate checks
check_quality_gates() {
    if ! is_workflow_context; then
        return 0
    fi

    log_info "Running quality gate checks..."

    # Find and run quality gate script (non-blocking for edits)
    local script_path=""
    if [ -f "scripts/validate-quality-gates.sh" ]; then
        script_path="scripts/validate-quality-gates.sh"
    elif [ -f "../scripts/validate-quality-gates.sh" ]; then
        script_path="../scripts/validate-quality-gates.sh"
    elif [ -f "../../scripts/validate-quality-gates.sh" ]; then
        script_path="../../scripts/validate-quality-gates.sh"
    fi

    if [ -n "$script_path" ]; then
        if "$script_path" --quiet --continue-on-failure; then
            log_info "✅ Quality gates passed"
        else
            log_warn "⚠️  Quality gates failing - consider fixing before major changes"
        fi
    fi

    return 0
}

# Check for destructive operations
check_destructive_operations() {
    local file="$1"

    # Protect critical files
    local protected_patterns=(
        "package.json"
        "package-lock.json"
        "yarn.lock"
        "Cargo.toml"
        "Cargo.lock"
        "go.mod"
        "go.sum"
        ".env"
        ".env.production"
        "docker-compose.yml"
        "Dockerfile"
    )

    for pattern in "${protected_patterns[@]}"; do
        if echo "$file" | grep -q "$pattern"; then
            log_warn "⚠️  Editing protected file: $file"
            log_warn "Please ensure changes are intentional"
            break
        fi
    done

    return 0
}

# Main execution
main() {
    if [ -z "$FILE_PATH" ]; then
        # No file path provided (e.g., MultiEdit), skip file-specific checks
        log_info "No specific file path - running general quality checks"
        check_quality_gates
        exit 0
    fi

    log_info "Pre-edit validation for: $TOOL_NAME on $FILE_PATH"

    # Check for destructive operations
    check_destructive_operations "$FILE_PATH"

    # Enforce TDD for implementation files
    if ! enforce_tdd "$FILE_PATH"; then
        log_error "TDD enforcement failed - blocking edit"
        exit 1
    fi

    # Run quality gate checks (non-blocking)
    check_quality_gates

    log_info "✅ Pre-edit validation passed"
    exit 0
}

# Run main function
main "$@"
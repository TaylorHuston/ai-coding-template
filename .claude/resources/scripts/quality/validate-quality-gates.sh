#!/bin/bash
# Quality Gate Validation Script
# Used by /iterate command to enforce quality standards before task progression

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
STRICT_MODE=false
QUIET=false
EXIT_ON_FAILURE=true

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --strict)
            STRICT_MODE=true
            shift
            ;;
        --quiet)
            QUIET=true
            shift
            ;;
        --continue-on-failure)
            EXIT_ON_FAILURE=false
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --strict                Enforce all gates (including optional ones)"
            echo "  --quiet                 Suppress non-error output"
            echo "  --continue-on-failure   Don't exit on quality gate failures"
            echo "  -h, --help             Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Logging functions
log_info() {
    if [ "$QUIET" != true ]; then
        echo -e "${GREEN}[INFO]${NC} $1"
    fi
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Track overall status
CRITICAL_FAILURES=0
WARNINGS=0

# Detect project type and available commands
detect_test_command() {
    if [ -f "package.json" ]; then
        if grep -q '"test"' package.json; then
            echo "npm test"
        elif grep -q '"vitest"' package.json; then
            echo "npm run test"
        else
            echo ""
        fi
    elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ] || [ -f "pytest.ini" ]; then
        if command -v pytest &> /dev/null; then
            echo "pytest"
        elif command -v python -m pytest &> /dev/null; then
            echo "python -m pytest"
        else
            echo ""
        fi
    elif [ -f "Cargo.toml" ]; then
        echo "cargo test"
    elif [ -f "go.mod" ]; then
        echo "go test ./..."
    else
        echo ""
    fi
}

detect_lint_command() {
    if [ -f "package.json" ]; then
        if grep -q '"lint"' package.json; then
            echo "npm run lint"
        elif command -v eslint &> /dev/null; then
            echo "eslint ."
        else
            echo ""
        fi
    elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
        if command -v flake8 &> /dev/null; then
            echo "flake8"
        elif command -v pylint &> /dev/null; then
            echo "pylint ."
        else
            echo ""
        fi
    elif [ -f "Cargo.toml" ]; then
        echo "cargo clippy"
    elif [ -f "go.mod" ]; then
        echo "go vet ./..."
    else
        echo ""
    fi
}

detect_build_command() {
    if [ -f "package.json" ]; then
        if grep -q '"build"' package.json; then
            echo "npm run build"
        else
            echo ""
        fi
    elif [ -f "Cargo.toml" ]; then
        echo "cargo build"
    elif [ -f "go.mod" ]; then
        echo "go build ./..."
    else
        echo ""
    fi
}

# Quality gate checks
check_tests() {
    log_info "Checking test execution..."

    TEST_CMD=$(detect_test_command)
    if [ -z "$TEST_CMD" ]; then
        log_warn "No test command detected - skipping test validation"
        return 0
    fi

    log_info "Running: $TEST_CMD"
    if $TEST_CMD > /tmp/test_output.log 2>&1; then
        log_info "✅ All tests passing"
        return 0
    else
        log_error "❌ Tests failing"
        if [ "$QUIET" != true ]; then
            echo "Test output:"
            cat /tmp/test_output.log
        fi
        return 1
    fi
}

check_linting() {
    log_info "Checking code quality..."

    LINT_CMD=$(detect_lint_command)
    if [ -z "$LINT_CMD" ]; then
        log_warn "No lint command detected - skipping lint validation"
        return 0
    fi

    log_info "Running: $LINT_CMD"
    if $LINT_CMD > /tmp/lint_output.log 2>&1; then
        log_info "✅ Linting passed"
        return 0
    else
        log_error "❌ Linting failed"
        if [ "$QUIET" != true ]; then
            echo "Lint output:"
            cat /tmp/lint_output.log
        fi
        return 1
    fi
}

check_build() {
    log_info "Checking build..."

    BUILD_CMD=$(detect_build_command)
    if [ -z "$BUILD_CMD" ]; then
        log_warn "No build command detected - skipping build validation"
        return 0
    fi

    log_info "Running: $BUILD_CMD"
    if $BUILD_CMD > /tmp/build_output.log 2>&1; then
        log_info "✅ Build successful"
        return 0
    else
        log_error "❌ Build failed"
        if [ "$QUIET" != true ]; then
            echo "Build output:"
            cat /tmp/build_output.log
        fi
        return 1
    fi
}

check_git_status() {
    log_info "Checking git status..."

    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_warn "Not in a git repository - skipping git checks"
        return 0
    fi

    # Check for uncommitted changes that might break things
    if git diff --exit-code > /dev/null 2>&1; then
        log_info "✅ No uncommitted changes detected"
    else
        log_warn "⚠️  Uncommitted changes detected - ensure they don't break tests"
        ((WARNINGS++))
    fi

    return 0
}

check_security_basics() {
    log_info "Checking basic security..."

    # Check for common security issues
    SECURITY_ISSUES=0

    # Check for hardcoded secrets (basic patterns)
    if grep -r -i --include="*.js" --include="*.py" --include="*.go" --include="*.rs" \
        -E "(password|secret|key|token)\s*=\s*['\"][^'\"]{8,}['\"]" . > /dev/null 2>&1; then
        log_error "❌ Potential hardcoded secrets detected"
        ((SECURITY_ISSUES++))
    fi

    # Check for TODO/FIXME security comments
    if grep -r -i --include="*.js" --include="*.py" --include="*.go" --include="*.rs" \
        -E "(TODO|FIXME).*[Ss]ecurity" . > /dev/null 2>&1; then
        log_warn "⚠️  Security-related TODO/FIXME comments found"
        ((WARNINGS++))
    fi

    if [ $SECURITY_ISSUES -eq 0 ]; then
        log_info "✅ Basic security checks passed"
        return 0
    else
        return 1
    fi
}

check_documentation_links() {
    log_info "Checking documentation links..."

    # Find the link validator script
    LINK_VALIDATOR=""
    if [ -f ".resources/scripts/docs/link-validator.sh" ]; then
        LINK_VALIDATOR=".resources/scripts/docs/link-validator.sh"
    elif [ -f "scripts/docs/link-validator.sh" ]; then
        LINK_VALIDATOR="scripts/docs/link-validator.sh"
    fi

    if [ -z "$LINK_VALIDATOR" ]; then
        log_warn "Link validator not found - skipping documentation link validation"
        return 0
    fi

    # Run link validation in CI mode (fast, no external validation)
    log_info "Running: $LINK_VALIDATOR --ci --fast --no-report"
    if "$LINK_VALIDATOR" --ci --fast --no-report > /tmp/link_validation.log 2>&1; then
        log_info "✅ Documentation links are valid"
        return 0
    else
        log_error "❌ Broken documentation links found"
        if [ "$QUIET" != true ]; then
            echo "Link validation output:"
            cat /tmp/link_validation.log
        fi
        return 1
    fi
}

# Main execution
log_info "Starting quality gate validation..."

# Critical quality gates (always enforced)
log_info "=== CRITICAL QUALITY GATES ==="

if ! check_tests; then
    ((CRITICAL_FAILURES++))
fi

if ! check_build; then
    ((CRITICAL_FAILURES++))
fi

if ! check_security_basics; then
    ((CRITICAL_FAILURES++))
fi

if ! check_documentation_links; then
    ((CRITICAL_FAILURES++))
fi

# Optional quality gates (enforced in strict mode)
if [ "$STRICT_MODE" == true ]; then
    log_info "=== OPTIONAL QUALITY GATES (Strict Mode) ==="

    if ! check_linting; then
        ((CRITICAL_FAILURES++))
    fi
fi

# Always run but non-blocking checks
log_info "=== ADVISORY CHECKS ==="
check_git_status

# Cleanup
rm -f /tmp/test_output.log /tmp/lint_output.log /tmp/build_output.log /tmp/link_validation.log

# Summary
echo ""
log_info "=== QUALITY GATE SUMMARY ==="

if [ $CRITICAL_FAILURES -eq 0 ]; then
    log_info "✅ All critical quality gates passed"
    if [ $WARNINGS -gt 0 ]; then
        log_warn "⚠️  $WARNINGS warnings found (non-blocking)"
    fi

    # Success - can proceed
    exit 0
else
    log_error "❌ $CRITICAL_FAILURES critical quality gate(s) failed"
    if [ $WARNINGS -gt 0 ]; then
        log_warn "⚠️  $WARNINGS additional warnings found"
    fi

    log_error "Fix critical issues before proceeding with workflow"

    if [ "$EXIT_ON_FAILURE" == true ]; then
        exit 1
    else
        exit 0
    fi
fi
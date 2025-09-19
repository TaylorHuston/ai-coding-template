#!/bin/bash
# Context Validation Script
# Ensures HANDOFF.yml and RESEARCH.md are properly maintained during workflow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Default values
QUIET=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --quiet)
            QUIET=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --quiet     Suppress non-error output"
            echo "  -h, --help  Show this help message"
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

# Find workflow files
find_workflow_files() {
    # Look for HANDOFF.yml in current directory or parent directories
    HANDOFF_FILE=""
    RESEARCH_FILE=""
    PLAN_FILE=""

    current_dir="$(pwd)"
    while [ "$current_dir" != "/" ]; do
        if [ -f "$current_dir/HANDOFF.yml" ]; then
            HANDOFF_FILE="$current_dir/HANDOFF.yml"
            RESEARCH_FILE="$current_dir/RESEARCH.md"
            PLAN_FILE="$current_dir/PLAN.md"
            break
        fi
        current_dir="$(dirname "$current_dir")"
    done

    if [ -z "$HANDOFF_FILE" ]; then
        log_error "No HANDOFF.yml found in current directory or parent directories"
        return 1
    fi

    log_info "Found workflow files in: $(dirname "$HANDOFF_FILE")"
    return 0
}

# Validate HANDOFF.yml structure
validate_handoff() {
    log_info "Validating HANDOFF.yml structure..."

    if [ ! -f "$HANDOFF_FILE" ]; then
        log_error "HANDOFF.yml not found"
        return 1
    fi

    # Check if file is valid YAML
    if ! python3 -c "import yaml; yaml.safe_load(open('$HANDOFF_FILE'))" 2>/dev/null; then
        log_error "HANDOFF.yml is not valid YAML"
        return 1
    fi

    # Check required top-level keys
    required_keys=("schema_version" "current_phase" "last_updated" "handoffs" "quality_gates")
    for key in "${required_keys[@]}"; do
        if ! grep -q "^$key:" "$HANDOFF_FILE"; then
            log_error "Missing required key: $key"
            return 1
        fi
    done

    # Check if handoffs array has at least one entry (or is properly initialized)
    if grep -A 1 "^handoffs:" "$HANDOFF_FILE" | grep -q "^\s*$"; then
        log_warn "No handoff entries found - workflow may not have started"
    fi

    log_info "✅ HANDOFF.yml structure is valid"
    return 0
}

# Validate RESEARCH.md structure
validate_research() {
    log_info "Validating RESEARCH.md structure..."

    if [ ! -f "$RESEARCH_FILE" ]; then
        log_error "RESEARCH.md not found"
        return 1
    fi

    # Check for required sections
    if ! grep -q "## CRITICAL_CONTEXT" "$RESEARCH_FILE"; then
        log_error "Missing CRITICAL_CONTEXT section in RESEARCH.md"
        return 1
    fi

    if ! grep -q "## Agent Analysis" "$RESEARCH_FILE"; then
        log_error "Missing Agent Analysis section in RESEARCH.md"
        return 1
    fi

    log_info "✅ RESEARCH.md structure is valid"
    return 0
}

# Validate PLAN.md integration
validate_plan() {
    log_info "Validating PLAN.md integration..."

    if [ ! -f "$PLAN_FILE" ]; then
        log_error "PLAN.md not found"
        return 1
    fi

    # Check for P X.X.X task format
    if ! grep -q "P[0-9]\+\.[0-9]\+\.[0-9]\+" "$PLAN_FILE"; then
        log_error "No P X.X.X task format found in PLAN.md"
        return 1
    fi

    # Check for agent hints
    if ! grep -q "<!--agent:" "$PLAN_FILE"; then
        log_warn "No agent hints found in PLAN.md - agents may need manual selection"
    fi

    log_info "✅ PLAN.md structure is valid"
    return 0
}

# Check workflow consistency
validate_consistency() {
    log_info "Validating workflow consistency..."

    # Check if current_phase in HANDOFF.yml matches active tasks in PLAN.md
    if [ -f "$HANDOFF_FILE" ] && [ -f "$PLAN_FILE" ]; then
        current_phase=$(grep "^current_phase:" "$HANDOFF_FILE" | cut -d'"' -f2 | cut -d"'" -f2)

        if [ -n "$current_phase" ]; then
            # Extract phase number (P1, P2, etc.)
            phase_num=$(echo "$current_phase" | grep -o "P[0-9]\+")

            # Check if this phase has incomplete tasks
            if grep -q "\- \[ \] $phase_num\." "$PLAN_FILE"; then
                log_info "✅ Current phase $phase_num has incomplete tasks"
            elif grep -q "\- \[x\] $phase_num\." "$PLAN_FILE"; then
                log_warn "Current phase $phase_num appears complete - may need phase transition"
            else
                log_warn "Current phase $phase_num not found in PLAN.md"
            fi
        fi
    fi

    return 0
}

# Check for stale context
check_stale_context() {
    log_info "Checking for stale context..."

    if [ -f "$HANDOFF_FILE" ]; then
        # Check last_updated timestamp
        last_updated=$(grep "^last_updated:" "$HANDOFF_FILE" | cut -d'"' -f2 | cut -d"'" -f2)

        if [ "$last_updated" = "YYYY-MM-DDTHH:MM:SSZ" ]; then
            log_warn "HANDOFF.yml timestamp not updated from template"
        elif [ -n "$last_updated" ]; then
            # Check if older than 24 hours (basic staleness check)
            if command -v date &> /dev/null; then
                current_time=$(date +%s)
                # Note: This is a simplified check - proper timestamp parsing would be more robust
                log_info "Last updated: $last_updated"
            fi
        fi
    fi

    return 0
}

# Main execution
log_info "Starting context validation..."

# Find workflow files
if ! find_workflow_files; then
    exit 1
fi

VALIDATION_FAILURES=0

# Run validations
if ! validate_handoff; then
    ((VALIDATION_FAILURES++))
fi

if ! validate_research; then
    ((VALIDATION_FAILURES++))
fi

if ! validate_plan; then
    ((VALIDATION_FAILURES++))
fi

# Run consistency checks (non-failing)
validate_consistency
check_stale_context

# Summary
echo ""
log_info "=== CONTEXT VALIDATION SUMMARY ==="

if [ $VALIDATION_FAILURES -eq 0 ]; then
    log_info "✅ All context validation checks passed"
    exit 0
else
    log_error "❌ $VALIDATION_FAILURES validation check(s) failed"
    log_error "Fix context issues before proceeding with workflow"
    exit 1
fi
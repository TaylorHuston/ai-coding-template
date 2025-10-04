#!/bin/bash
# Claude Code Post-Task Hook - Agent Output Validation
# Runs after Task tool execution to validate agent output and update coordination files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse hook arguments
TOOL_ARGS="$*"

# Check if this is an iterate workflow Task call
if ! echo "$TOOL_ARGS" | grep -q "iterate\|Task.*agent"; then
    # Not an iterate workflow call - skip validation
    exit 0
fi

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

log_step() {
    echo -e "${BLUE}[HOOK]${NC} $1" >&2
}

# Find workflow files
find_workflow_directory() {
    local current_dir="$(pwd)"
    while [ "$current_dir" != "/" ]; do
        if [ -f "$current_dir/PLAN.md" ] && [ -f "$current_dir/HANDOFF.yml" ]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    return 1
}

# Check if agent output indicates task completion
check_task_completion() {
    # This is a placeholder - in practice, the orchestrator (/iterate) would
    # handle parsing agent output and updating files
    # The hook validates that updates were made properly

    log_info "Checking for task completion indicators..."

    # Check if HANDOFF.yml was recently updated
    if [ -f "HANDOFF.yml" ]; then
        local last_modified=$(stat -c %Y HANDOFF.yml 2>/dev/null || stat -f %m HANDOFF.yml 2>/dev/null)
        local current_time=$(date +%s)
        local age=$((current_time - last_modified))

        if [ $age -lt 30 ]; then
            log_info "✅ HANDOFF.yml recently updated (${age}s ago)"
            return 0
        else
            log_warn "⚠️  HANDOFF.yml not recently updated (${age}s ago)"
            return 1
        fi
    fi

    return 1
}

# Validate HANDOFF.yml structure after agent work
validate_handoff_structure() {
    log_step "Validating HANDOFF.yml structure..."

    if [ ! -f "HANDOFF.yml" ]; then
        log_error "HANDOFF.yml not found"
        return 1
    fi

    # Check if file is valid YAML
    if ! python3 -c "import yaml; yaml.safe_load(open('HANDOFF.yml'))" 2>/dev/null; then
        log_error "HANDOFF.yml contains invalid YAML after agent execution"
        return 1
    fi

    # Check if handoffs array has entries
    if ! grep -A 5 "^handoffs:" HANDOFF.yml | grep -q "agent:"; then
        log_warn "No agent entries found in HANDOFF.yml"
        return 1
    fi

    # Check for required fields in latest handoff
    local latest_entry=$(grep -A 20 "^handoffs:" HANDOFF.yml | head -25)

    local required_fields=("agent:" "timestamp:" "task:" "status:" "summary:")
    for field in "${required_fields[@]}"; do
        if ! echo "$latest_entry" | grep -q "$field"; then
            log_warn "Missing required field: $field in latest handoff entry"
        fi
    done

    log_info "✅ HANDOFF.yml structure validation passed"
    return 0
}

# Check for quality indicators in agent work
validate_quality_indicators() {
    log_step "Checking quality indicators..."

    # Check if validation_completed section exists
    if grep -A 10 "validation_completed:" HANDOFF.yml >/dev/null 2>&1; then
        log_info "✅ Quality validation section found"
    else
        log_warn "⚠️  No validation_completed section in latest handoff"
    fi

    # Check if files_changed is documented
    if grep -A 5 "files_changed:" HANDOFF.yml >/dev/null 2>&1; then
        log_info "✅ Files changed documented"
    else
        log_warn "⚠️  No files_changed documentation in latest handoff"
    fi

    # Check if technical_specs exist for implementation agents
    if grep -A 10 "technical_specs:" HANDOFF.yml >/dev/null 2>&1; then
        log_info "✅ Technical specifications documented"
    else
        log_warn "⚠️  No technical specifications in latest handoff"
    fi

    return 0
}

# Run basic quality gates if available
run_quality_gates() {
    log_step "Running basic quality gates..."

    # Find and run quality gate script
    if [ -f "../../scripts/validate-quality-gates.sh" ]; then
        if ../../scripts/validate-quality-gates.sh --quiet --continue-on-failure; then
            log_info "✅ Quality gates passed"
        else
            log_warn "⚠️  Quality gates failed - check output"
        fi
    elif [ -f "../../../scripts/validate-quality-gates.sh" ]; then
        if ../../../scripts/validate-quality-gates.sh --quiet --continue-on-failure; then
            log_info "✅ Quality gates passed"
        else
            log_warn "⚠️  Quality gates failed - check output"
        fi
    else
        log_info "No quality gate script found - skipping"
    fi
}

# Update last_updated timestamp in HANDOFF.yml
update_handoff_timestamp() {
    if [ -f "HANDOFF.yml" ]; then
        local current_timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)

        # Update last_updated field
        if grep -q "^last_updated:" HANDOFF.yml; then
            # Use sed to update the timestamp
            if command -v gsed >/dev/null 2>&1; then
                # macOS with gsed
                gsed -i "s/^last_updated:.*/last_updated: \"$current_timestamp\"/" HANDOFF.yml
            else
                # Linux sed
                sed -i "s/^last_updated:.*/last_updated: \"$current_timestamp\"/" HANDOFF.yml
            fi
            log_info "Updated HANDOFF.yml timestamp: $current_timestamp"
        fi
    fi
}

# Main execution
main() {
    log_info "Post-Task validation hook triggered"

    local workflow_dir
    workflow_dir=$(find_workflow_directory)

    if [ $? -ne 0 ]; then
        log_info "No workflow directory found - skipping validation"
        return 0
    fi

    log_info "Validating agent output in: $workflow_dir"

    # Change to workflow directory for validation
    cd "$workflow_dir"

    # Check if task was completed
    if check_task_completion; then
        log_info "Task completion detected - running validations"

        # Validate HANDOFF.yml structure
        validate_handoff_structure

        # Check quality indicators
        validate_quality_indicators

        # Run quality gates
        run_quality_gates

        # Update timestamp
        update_handoff_timestamp

        log_info "✅ Post-Task validation completed"
    else
        log_info "No task completion detected - skipping validation"
    fi

    exit 0
}

# Run main function
main "$@"
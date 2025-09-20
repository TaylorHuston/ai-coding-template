#!/bin/bash
# Claude Code Pre-Task Hook - Context Validation
# Runs before any Task tool execution to validate context and workflow state

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Parse hook arguments - Claude Code passes tool arguments
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

# Validate workflow state
validate_workflow_state() {
    local workflow_dir
    workflow_dir=$(find_workflow_directory)

    if [ $? -ne 0 ]; then
        log_info "No workflow directory found - skipping validation"
        return 0
    fi

    log_info "Validating workflow state in: $workflow_dir"

    # Change to workflow directory for validation
    cd "$workflow_dir"

    # Check if context validation script exists and run it
    if [ -f "../../scripts/validate-context.sh" ]; then
        if ! ../../scripts/validate-context.sh --quiet; then
            log_error "Context validation failed"
            log_error "Please fix HANDOFF.yml and RESEARCH.md structure before proceeding"
            return 1
        fi
    elif [ -f "../../../scripts/validate-context.sh" ]; then
        if ! ../../../scripts/validate-context.sh --quiet; then
            log_error "Context validation failed"
            log_error "Please fix HANDOFF.yml and RESEARCH.md structure before proceeding"
            return 1
        fi
    fi

    # Basic file structure validation
    if [ ! -f "HANDOFF.yml" ]; then
        log_error "HANDOFF.yml not found in workflow directory"
        return 1
    fi

    if [ ! -f "RESEARCH.md" ]; then
        log_error "RESEARCH.md not found in workflow directory"
        return 1
    fi

    # Check if HANDOFF.yml is valid YAML
    if ! python3 -c "import yaml; yaml.safe_load(open('HANDOFF.yml'))" 2>/dev/null; then
        log_error "HANDOFF.yml contains invalid YAML"
        return 1
    fi

    # Check for CRITICAL_CONTEXT in RESEARCH.md
    if ! grep -q "## CRITICAL_CONTEXT" RESEARCH.md; then
        log_warn "RESEARCH.md missing CRITICAL_CONTEXT section"
    fi

    log_info "✅ Workflow state validation passed"
    return 0
}

# Extract agent type from tool arguments for context preparation
extract_agent_type() {
    # Look for agent type in task arguments
    if echo "$TOOL_ARGS" | grep -o "agent.*:" | grep -o "[a-z-]*-[a-z]*"; then
        return 0
    elif echo "$TOOL_ARGS" | grep -o "subagent_type.*[a-z-]*-[a-z]*" | grep -o "[a-z-]*-[a-z]*"; then
        return 0
    else
        echo "unknown"
    fi
}

# Context preparation is now handled automatically by the /develop command
# No additional preparation needed in hooks

# Main execution
main() {
    log_info "Pre-Task validation hook triggered"

    # Validate workflow state
    if ! validate_workflow_state; then
        log_error "Workflow validation failed - blocking Task execution"
        exit 1
    fi

    # Prepare context for agent
    prepare_agent_context

    log_info "Pre-Task validation completed successfully"
    exit 0
}

# Run main function
main "$@"
#!/bin/bash
# Claude Code UserPromptSubmit Hook - Workflow State Check
# Runs when user submits prompts containing /iterate or /plan

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse user prompt from arguments
USER_PROMPT="$*"

# Check if prompt contains workflow commands
if ! echo "$USER_PROMPT" | grep -qE "/(iterate|plan)"; then
    # Not a workflow command - skip validation
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

# Find workflow directory
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

# Check workflow readiness for /iterate
check_iterate_readiness() {
    log_step "Checking /iterate readiness..."

    local workflow_dir
    workflow_dir=$(find_workflow_directory)

    if [ $? -ne 0 ]; then
        log_warn "No workflow directory found"
        log_warn "Run '/plan --issue ISSUE-KEY' to set up workflow first"
        return 1
    fi

    cd "$workflow_dir"

    # Check if PLAN.md has unchecked tasks
    if ! grep -q "^- \[ \]" PLAN.md; then
        log_info "✅ All tasks in PLAN.md appear to be completed"
        log_info "Consider running '/plan --review-plan' if more work is needed"
    else
        log_info "✅ Found unchecked tasks in PLAN.md"
    fi

    # Check HANDOFF.yml structure
    if ! python3 -c "import yaml; yaml.safe_load(open('HANDOFF.yml'))" 2>/dev/null; then
        log_error "❌ HANDOFF.yml contains invalid YAML"
        return 1
    fi

    # Check if context validation script exists
    if [ -f "../../scripts/quality/validate-context.sh" ]; then
        if ../../scripts/quality/validate-context.sh --quiet; then
    elif [ -f "../../scripts/validate-context.sh" ]; then
        if ../../scripts/validate-context.sh --quiet; then
            log_info "✅ Context validation passed"
        else
            log_warn "⚠️  Context validation issues found"
        fi
    fi

    return 0
}

# Check setup readiness for /plan
check_plan_readiness() {
    log_step "Checking /plan readiness..."

    # Check if we have deliverables directory structure
    if [ ! -d "deliverables" ]; then
        log_warn "No deliverables directory found"
        log_info "Consider running scripts/init-workflow.sh first"
    fi

    # Check if template exists
    if [ ! -d "deliverables/template-deliverable" ]; then
        log_warn "No template-deliverable found"
        log_info "Template is required for /plan command"
    fi

    # Check for git repository
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        log_warn "Not in a git repository"
        log_info "/plan works better with git for branch management"
    fi

    return 0
}

# Provide workflow guidance
provide_workflow_guidance() {
    log_step "Workflow guidance:"

    if echo "$USER_PROMPT" | grep -q "/plan"; then
        log_info "📋 /plan usage:"
        log_info "  /plan --issue ISSUE-KEY                 # Basic setup"
        log_info "  /plan --issue ISSUE-KEY --init          # Setup only"
        log_info "  /plan --issue ISSUE-KEY --review-plan   # Update existing plan"
        log_info ""
    fi

    if echo "$USER_PROMPT" | grep -q "/iterate"; then
        log_info "🔄 /iterate usage:"
        log_info "  /iterate                    # Execute next task"
        log_info "  /iterate P1.2.0            # Execute specific task"
        log_info "  /iterate --force P1.3.0    # Force execution"
        log_info ""
    fi

    log_info "💡 Workflow tips:"
    log_info "  - Run /plan first to set up issue structure"
    log_info "  - Use /iterate to execute tasks sequentially"
    log_info "  - Check HANDOFF.yml for context between tasks"
    log_info "  - Run scripts/quality/validate.js quality-gates to check status"
}

# Main execution
main() {
    log_info "Workflow state check triggered by: $USER_PROMPT"

    local command_valid=true

    # Check readiness based on command type
    if echo "$USER_PROMPT" | grep -q "/iterate"; then
        if ! check_iterate_readiness; then
            command_valid=false
        fi
    fi

    if echo "$USER_PROMPT" | grep -q "/plan"; then
        if ! check_plan_readiness; then
            command_valid=false
        fi
    fi

    # Provide guidance
    provide_workflow_guidance

    if [ "$command_valid" = true ]; then
        log_info "✅ Workflow state check passed"
    else
        log_warn "⚠️  Workflow state issues detected - command may fail"
        log_warn "Review guidance above and fix issues before proceeding"
    fi

    # Don't block execution - just provide warnings
    exit 0
}

# Run main function
main "$@"
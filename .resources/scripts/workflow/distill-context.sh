#!/bin/bash
# Context Distillation Script for Claude Code Hooks
# Generates focused, agent-specific context from verbose HANDOFF.yml and RESEARCH.md

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default values
AGENT_TYPE=""
TASK_ID=""
PREPARE_MODE=false
OUTPUT_FILE=""
QUIET=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --agent)
            AGENT_TYPE="$2"
            shift 2
            ;;
        --task)
            TASK_ID="$2"
            shift 2
            ;;
        --prepare)
            PREPARE_MODE=true
            shift
            ;;
        --output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --quiet)
            QUIET=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 --agent AGENT_TYPE [--task TASK_ID] [--prepare] [--output FILE] [--quiet]"
            echo ""
            echo "Options:"
            echo "  --agent AGENT_TYPE    Agent type (backend-specialist, test-engineer, etc.)"
            echo "  --task TASK_ID        Specific task ID (e.g., P1.3.0)"
            echo "  --prepare             Prepare context for hooks (creates temp files)"
            echo "  --output FILE         Output to file instead of stdout"
            echo "  --quiet               Suppress info messages"
            echo ""
            echo "Examples:"
            echo "  $0 --agent backend-specialist --task P1.3.0"
            echo "  $0 --agent test-engineer --prepare"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validation
if [ -z "$AGENT_TYPE" ]; then
    echo "Error: --agent is required"
    exit 1
fi

# Logging functions
log_info() {
    if [ "$QUIET" != true ]; then
        echo -e "${GREEN}[DISTILL]${NC} $1" >&2
    fi
}

log_warn() {
    if [ "$QUIET" != true ]; then
        echo -e "${YELLOW}[DISTILL]${NC} $1" >&2
    fi
}

log_error() {
    echo -e "${RED}[DISTILL]${NC} $1" >&2
}

# Find workflow files
find_workflow_files() {
    local current_dir="$(pwd)"
    while [ "$current_dir" != "/" ]; do
        if [ -f "$current_dir/HANDOFF.yml" ] && [ -f "$current_dir/RESEARCH.md" ]; then
            WORKFLOW_DIR="$current_dir"
            HANDOFF_FILE="$current_dir/HANDOFF.yml"
            RESEARCH_FILE="$current_dir/RESEARCH.md"
            PLAN_FILE="$current_dir/PLAN.md"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    return 1
}

# Extract context for backend-specialist
distill_backend_context() {
    cat << 'EOF'
## 🔧 Backend Implementation Context

### Technical Stack & Patterns
EOF

    # Extract framework and patterns
    grep -A 10 -i "framework\|database\|patterns_followed\|technical_specs" "$HANDOFF_FILE" "$RESEARCH_FILE" 2>/dev/null | head -20

    cat << 'EOF'

### API Contracts & Integration
EOF

    # Extract API specifications
    grep -A 8 -i "api_endpoints\|integration_contracts\|request_format\|response_format" "$HANDOFF_FILE" 2>/dev/null | head -15

    cat << 'EOF'

### Security & Performance Requirements
EOF

    # Extract constraints
    grep -A 5 -i "security\|performance\|validation\|rate.limit" "$RESEARCH_FILE" "$HANDOFF_FILE" 2>/dev/null | head -12

    cat << 'EOF'

### Implementation Patterns to Follow
EOF

    # Extract existing patterns and anti-patterns
    grep -A 5 -i "patterns_followed\|anti_patterns\|error_patterns" "$HANDOFF_FILE" 2>/dev/null | head -10

    cat << 'EOF'

### Database & Environment Context
EOF

    # Extract database and environment info
    grep -A 5 -i "database\|environment\|migration" "$HANDOFF_FILE" "$RESEARCH_FILE" 2>/dev/null | head -10
}

# Extract context for test-engineer
distill_test_context() {
    cat << 'EOF'
## 🧪 Testing Implementation Context

### Test Requirements & Coverage
EOF

    # Extract test specifications
    grep -A 8 -i "test\|coverage\|quality_gates\|validation_completed" "$HANDOFF_FILE" "$RESEARCH_FILE" 2>/dev/null | head -15

    cat << 'EOF'

### Business Rules for Testing
EOF

    # Extract business logic and edge cases
    grep -A 5 -i "business.rule\|edge.case\|scenario\|requirement" "$RESEARCH_FILE" 2>/dev/null | head -10

    cat << 'EOF'

### Technical Implementation Details
EOF

    # Extract implementation details relevant to testing
    grep -A 5 -i "api_endpoints\|database\|error.handling" "$HANDOFF_FILE" 2>/dev/null | head -10

    cat << 'EOF'

### Performance & Security Test Requirements
EOF

    # Extract performance and security requirements
    grep -A 3 -i "performance\|security\|rate.limit\|timeout" "$RESEARCH_FILE" 2>/dev/null | head -8
}

# Extract context for context-analyzer
distill_analyzer_context() {
    cat << 'EOF'
## 🔍 Context Analysis Focus

### Critical Decisions & Constraints
EOF

    # Extract critical context
    if grep -q "## CRITICAL_CONTEXT" "$RESEARCH_FILE"; then
        sed -n '/## CRITICAL_CONTEXT/,/^## /p' "$RESEARCH_FILE" | head -20
    fi

    cat << 'EOF'

### Previous Agent Findings
EOF

    # Extract recent handoff summaries
    grep -A 5 "summary:\|next_agent_context:" "$HANDOFF_FILE" 2>/dev/null | head -15

    cat << 'EOF'

### Architecture & Integration Points
EOF

    # Extract architecture decisions
    grep -A 5 -i "architecture\|integration\|dependency" "$RESEARCH_FILE" "$HANDOFF_FILE" 2>/dev/null | head -12
}

# Extract context for code-reviewer
distill_reviewer_context() {
    cat << 'EOF'
## 👁️ Code Review Context

### Quality Standards & Requirements
EOF

    # Extract quality requirements
    grep -A 5 -i "quality\|standard\|pattern\|convention" "$RESEARCH_FILE" 2>/dev/null | head -10

    cat << 'EOF'

### Recent Implementation Details
EOF

    # Extract recent work and file changes
    grep -A 8 "files_changed\|implementation_details\|validation_completed" "$HANDOFF_FILE" 2>/dev/null | head -15

    cat << 'EOF'

### Security & Performance Considerations
EOF

    # Extract security and performance context
    grep -A 3 -i "security\|performance\|vulnerability" "$RESEARCH_FILE" "$HANDOFF_FILE" 2>/dev/null | head -8

    cat << 'EOF'

### Anti-Patterns to Check
EOF

    # Extract anti-patterns
    grep -A 3 -i "anti.pattern\|avoid\|don't" "$RESEARCH_FILE" "$HANDOFF_FILE" 2>/dev/null | head -8
}

# Extract context for frontend-specialist
distill_frontend_context() {
    cat << 'EOF'
## 🎨 Frontend Implementation Context

### API Integration Requirements
EOF

    # Extract API contracts and frontend expectations
    grep -A 8 -i "frontend\|api_endpoints\|response_format\|ui\|component" "$HANDOFF_FILE" "$RESEARCH_FILE" 2>/dev/null | head -15

    cat << 'EOF'

### User Experience Requirements
EOF

    # Extract UX and interaction requirements
    grep -A 5 -i "user\|interface\|interaction\|accessibility" "$RESEARCH_FILE" 2>/dev/null | head -10

    cat << 'EOF'

### Performance & Security for Frontend
EOF

    # Extract frontend-specific constraints
    grep -A 3 -i "performance\|security\|authentication\|token" "$RESEARCH_FILE" "$HANDOFF_FILE" 2>/dev/null | head -8
}

# Generic context distillation
distill_generic_context() {
    cat << 'EOF'
## 🔧 Implementation Context

### Current Task Context
EOF

    if [ -n "$TASK_ID" ] && [ -f "$PLAN_FILE" ]; then
        grep -A 2 "$TASK_ID" "$PLAN_FILE" 2>/dev/null
    fi

    cat << 'EOF'

### Critical Requirements
EOF

    # Extract critical context
    if grep -q "## CRITICAL_CONTEXT" "$RESEARCH_FILE"; then
        sed -n '/## CRITICAL_CONTEXT/,/^## /p' "$RESEARCH_FILE" | head -15
    fi

    cat << 'EOF'

### Recent Agent Work
EOF

    # Extract last 2 handoff entries
    grep -A 10 "agent:\|summary:\|next_agent_context:" "$HANDOFF_FILE" 2>/dev/null | head -20
}

# Main distillation function
distill_context() {
    log_info "Distilling context for agent: $AGENT_TYPE"

    case "$AGENT_TYPE" in
        "backend-specialist"|"backend")
            distill_backend_context
            ;;
        "test-engineer"|"testing")
            distill_test_context
            ;;
        "context-analyzer"|"analyzer")
            distill_analyzer_context
            ;;
        "code-reviewer"|"reviewer")
            distill_reviewer_context
            ;;
        "frontend-specialist"|"frontend")
            distill_frontend_context
            ;;
        *)
            log_warn "Unknown agent type: $AGENT_TYPE, using generic context"
            distill_generic_context
            ;;
    esac

    cat << 'EOF'

---
*Context distilled from HANDOFF.yml and RESEARCH.md*
*Use this focused context for implementation - refer to full files for complete details*
EOF
}

# Prepare context for hooks (create temp files)
prepare_context_for_hooks() {
    local temp_dir="/tmp/claude-context"
    mkdir -p "$temp_dir"

    local context_file="$temp_dir/distilled-context-${AGENT_TYPE}.md"
    distill_context > "$context_file"

    log_info "Context prepared at: $context_file"
    echo "$context_file"
}

# Main execution
main() {
    # Find workflow files
    if ! find_workflow_files; then
        log_error "No workflow files found (HANDOFF.yml, RESEARCH.md)"
        log_error "Ensure you're in a workflow directory"
        exit 1
    fi

    log_info "Found workflow files in: $WORKFLOW_DIR"

    if [ "$PREPARE_MODE" = true ]; then
        # Prepare mode - create temp files for hooks
        prepare_context_for_hooks
    elif [ -n "$OUTPUT_FILE" ]; then
        # Output to file
        distill_context > "$OUTPUT_FILE"
        log_info "Context written to: $OUTPUT_FILE"
    else
        # Output to stdout
        distill_context
    fi
}

# Run main function
main "$@"
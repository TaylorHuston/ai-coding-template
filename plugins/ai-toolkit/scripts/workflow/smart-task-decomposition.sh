#!/bin/bash
# Smart Task Decomposition Script
# Automatically detects when tasks are too complex and suggests decomposition

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse arguments
TASK_ID=""
FAILURE_REASON=""
AUTO_DECOMPOSE=false
PLAN_INTEGRATION=false
DEVELOP_INTEGRATION=false
TASK_DESCRIPTION=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --task)
            TASK_ID="$2"
            shift 2
            ;;
        --failure-reason)
            FAILURE_REASON="$2"
            shift 2
            ;;
        --auto-decompose)
            AUTO_DECOMPOSE=true
            shift
            ;;
        --plan-integration)
            PLAN_INTEGRATION=true
            shift
            ;;
        --develop-integration)
            DEVELOP_INTEGRATION=true
            shift
            ;;
        --description)
            TASK_DESCRIPTION="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 --task TASK-ID [OPTIONS]"
            echo ""
            echo "Analyzes task complexity and suggests decomposition"
            echo ""
            echo "Options:"
            echo "  --failure-reason REASON    Reason for task failure (for /develop integration)"
            echo "  --auto-decompose          Automatically apply decomposition suggestions"
            echo "  --plan-integration        Called from /plan command for proactive analysis"
            echo "  --develop-integration     Called from /develop command for failure recovery"
            echo "  --description TEXT        Task description for complexity analysis"
            echo ""
            echo "Examples:"
            echo "  $0 --task P1.3.1 --plan-integration --description \"Implement user auth\""
            echo "  $0 --task P1.3.1 --develop-integration --failure-reason \"too complex\""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [ -z "$TASK_ID" ]; then
    echo "Error: --task is required"
    exit 1
fi

# Find PLAN.md
find_plan_file() {
    current_dir="$(pwd)"
    while [ "$current_dir" != "/" ]; do
        if [ -f "$current_dir/PLAN.md" ]; then
            echo "$current_dir/PLAN.md"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    echo ""
    return 1
}

PLAN_FILE=$(find_plan_file)
if [ -z "$PLAN_FILE" ]; then
    echo "Error: No PLAN.md found in current or parent directories"
    exit 1
fi

# Extract task details
extract_task_details() {
    local task_line=$(grep "$TASK_ID" "$PLAN_FILE")

    if [ -z "$task_line" ]; then
        echo "Error: Task $TASK_ID not found in PLAN.md"
        exit 1
    fi

    echo "$task_line"
}

# Analyze task complexity
analyze_complexity() {
    local task_description="$1"

    echo -e "${BLUE}=== TASK COMPLEXITY ANALYSIS ===${NC}"
    echo "Task: $task_description"
    echo ""

    local complexity_score=0
    local complexity_factors=()

    # Check for multiple domains
    if echo "$task_description" | grep -qi "api.*database\|frontend.*backend\|ui.*server"; then
        ((complexity_score += 3))
        complexity_factors+=("Multi-domain integration")
    fi

    # Check for security aspects
    if echo "$task_description" | grep -qi "auth\|security\|permission\|encrypt"; then
        ((complexity_score += 2))
        complexity_factors+=("Security implementation")
    fi

    # Check for data migration/schema changes
    if echo "$task_description" | grep -qi "migration\|schema\|database.*change"; then
        ((complexity_score += 2))
        complexity_factors+=("Database schema changes")
    fi

    # Check for multiple integrations
    if echo "$task_description" | grep -qi "integrate.*and\|connect.*with\|external.*service"; then
        ((complexity_score += 2))
        complexity_factors+=("External integrations")
    fi

    # Check for testing requirements
    if echo "$task_description" | grep -qi "test.*implement\|implement.*test"; then
        ((complexity_score += 1))
        complexity_factors+=("Testing requirements")
    fi

    # Check for performance requirements
    if echo "$task_description" | grep -qi "optimize\|performance\|scale"; then
        ((complexity_score += 2))
        complexity_factors+=("Performance optimization")
    fi

    # Check for UI/UX work
    if echo "$task_description" | grep -qi "ui\|component\|interface\|design"; then
        ((complexity_score += 1))
        complexity_factors+=("UI/UX implementation")
    fi

    echo -e "${BLUE}Complexity Score: $complexity_score${NC}"

    if [ ${#complexity_factors[@]} -gt 0 ]; then
        echo -e "${BLUE}Contributing Factors:${NC}"
        for factor in "${complexity_factors[@]}"; do
            echo "• $factor"
        done
    fi

    echo ""

    # Integration-specific recommendations
    if [ "$PLAN_INTEGRATION" = true ]; then
        # For /plan integration - proactive decomposition suggestions
        if [ $complexity_score -ge 5 ]; then
            echo -e "${RED}HIGH COMPLEXITY DETECTED${NC}"
            echo "📋 /plan recommendation: Break this task into smaller subtasks before development"
            echo "🎯 Suggested approach: Use auto-decomposition patterns based on domain complexity"
            return 2
        elif [ $complexity_score -ge 3 ]; then
            echo -e "${YELLOW}MEDIUM COMPLEXITY DETECTED${NC}"
            echo "📋 /plan recommendation: Consider breaking into 2-3 focused subtasks"
            echo "🎯 This complexity level may benefit from specialized agent coordination"
            return 1
        else
            echo -e "${GREEN}APPROPRIATE COMPLEXITY${NC}"
            echo "📋 /plan confirmation: Task is well-scoped for single agent execution"
            return 0
        fi
    elif [ "$DEVELOP_INTEGRATION" = true ]; then
        # For /develop integration - failure recovery recommendations
        if [ $complexity_score -ge 5 ]; then
            echo -e "${RED}HIGH COMPLEXITY CONFIRMED${NC}"
            echo "🔧 /develop recommendation: Pause current task and decompose immediately"
            echo "🎯 Recovery approach: Break into focused subtasks with clear handoffs"
            return 2
        elif [ $complexity_score -ge 3 ]; then
            echo -e "${YELLOW}MEDIUM COMPLEXITY IDENTIFIED${NC}"
            echo "🔧 /develop recommendation: Consider agent handoff or subtask breakdown"
            echo "🎯 Alternative: Try different specialist agent for current approach"
            return 1
        else
            echo -e "${GREEN}COMPLEXITY NOT THE ISSUE${NC}"
            echo "🔧 /develop analysis: Task complexity is appropriate - investigate other failure causes"
            return 0
        fi
    else
        # Standard standalone analysis
        if [ $complexity_score -ge 5 ]; then
            echo -e "${RED}HIGH COMPLEXITY: Strong decomposition recommended${NC}"
            return 2
        elif [ $complexity_score -ge 3 ]; then
            echo -e "${YELLOW}MEDIUM COMPLEXITY: Consider decomposition${NC}"
            return 1
        else
            echo -e "${GREEN}LOW COMPLEXITY: Task is appropriately scoped${NC}"
            return 0
        fi
    fi
}

# Generate decomposition suggestions
suggest_decomposition() {
    local task_description="$1"
    local base_task_num=$(echo "$TASK_ID" | sed 's/P//' | sed 's/\.//')

    echo -e "${BLUE}=== SUGGESTED TASK DECOMPOSITION ===${NC}"
    echo ""

    # Extract phase and task numbers
    local phase=$(echo "$TASK_ID" | cut -d'.' -f1)
    local major=$(echo "$TASK_ID" | cut -d'.' -f2)
    local minor=$(echo "$TASK_ID" | cut -d'.' -f3)

    echo "Original task: $TASK_ID - $task_description"
    echo ""
    echo "Suggested subtasks:"

    # Generate context-aware decomposition
    if echo "$task_description" | grep -qi "implement.*api"; then
        echo "• ${phase}.${major}.${minor}.1 - Design API specification and contracts <!--agent:api-designer-->"
        echo "• ${phase}.${major}.${minor}.2 - Implement core business logic <!--agent:backend-specialist-->"
        echo "• ${phase}.${major}.${minor}.3 - Add authentication and validation <!--agent:security-auditor-->"
        echo "• ${phase}.${major}.${minor}.4 - Write comprehensive tests <!--agent:test-engineer-->"

    elif echo "$task_description" | grep -qi "database\|schema"; then
        echo "• ${phase}.${major}.${minor}.1 - Design schema and migration scripts <!--agent:database-specialist-->"
        echo "• ${phase}.${major}.${minor}.2 - Implement data access layer <!--agent:backend-specialist-->"
        echo "• ${phase}.${major}.${minor}.3 - Add data validation and constraints <!--agent:database-specialist-->"
        echo "• ${phase}.${major}.${minor}.4 - Performance testing and optimization <!--agent:performance-optimizer-->"

    elif echo "$task_description" | grep -qi "frontend\|ui\|component"; then
        echo "• ${phase}.${major}.${minor}.1 - Design component architecture <!--agent:frontend-specialist-->"
        echo "• ${phase}.${major}.${minor}.2 - Implement core UI components <!--agent:ui-specialist-->"
        echo "• ${phase}.${major}.${minor}.3 - Add state management and API integration <!--agent:frontend-specialist-->"
        echo "• ${phase}.${major}.${minor}.4 - Implement responsive design and accessibility <!--agent:ui-specialist-->"

    elif echo "$task_description" | grep -qi "auth\|security"; then
        echo "• ${phase}.${major}.${minor}.1 - Security analysis and threat modeling <!--agent:security-auditor-->"
        echo "• ${phase}.${major}.${minor}.2 - Implement authentication mechanisms <!--agent:backend-specialist-->"
        echo "• ${phase}.${major}.${minor}.3 - Add authorization and permission controls <!--agent:security-auditor-->"
        echo "• ${phase}.${major}.${minor}.4 - Security testing and penetration testing <!--agent:security-auditor-->"

    elif echo "$task_description" | grep -qi "integrate\|external"; then
        echo "• ${phase}.${major}.${minor}.1 - API research and integration planning <!--agent:integration-specialist-->"
        echo "• ${phase}.${major}.${minor}.2 - Implement external service client <!--agent:backend-specialist-->"
        echo "• ${phase}.${major}.${minor}.3 - Add error handling and retry logic <!--agent:backend-specialist-->"
        echo "• ${phase}.${major}.${minor}.4 - Integration testing and monitoring <!--agent:test-engineer-->"

    else
        # Generic decomposition
        echo "• ${phase}.${major}.${minor}.1 - Analysis and design phase <!--agent:code-architect-->"
        echo "• ${phase}.${major}.${minor}.2 - Core implementation <!--agent:backend-specialist-->"
        echo "• ${phase}.${major}.${minor}.3 - Testing and validation <!--agent:test-engineer-->"
        echo "• ${phase}.${major}.${minor}.4 - Integration and documentation <!--agent:code-reviewer-->"
    fi

    echo ""
    echo -e "${BLUE}Benefits of decomposition:${NC}"
    echo "• Clearer focus for each agent"
    echo "• Better error isolation and recovery"
    echo "• Improved quality validation at each step"
    echo "• Easier progress tracking and rollback"
}

# Auto-decompose if requested
auto_decompose_task() {
    echo -e "${BLUE}=== AUTO-DECOMPOSING TASK ===${NC}"
    echo ""

    # Create backup of original PLAN.md
    cp "$PLAN_FILE" "${PLAN_FILE}.backup.$(date +%s)"
    echo "Backup created: ${PLAN_FILE}.backup.$(date +%s)"

    # Replace original task with subtasks
    local task_description=$(extract_task_details)
    local temp_file=$(mktemp)

    # Generate replacement content
    suggest_decomposition "$task_description" | grep "^•" | sed 's/^• /- [ ] /' > "$temp_file"

    # Replace the task in PLAN.md
    local task_line_escaped=$(echo "$task_description" | sed 's/[[\.*^$()+?{|]/\\&/g')

    if sed -i "/$task_line_escaped/r $temp_file" "$PLAN_FILE" && sed -i "/$task_line_escaped/d" "$PLAN_FILE"; then
        echo -e "${GREEN}✅ Task $TASK_ID successfully decomposed in PLAN.md${NC}"
        echo ""
        echo -e "${BLUE}Next steps:${NC}"
        echo "1. Review the decomposed tasks in PLAN.md"
        echo "2. Run: /develop (will start with first subtask)"
        echo "3. Use: git diff to see the changes made"
        echo ""
        echo -e "${YELLOW}To rollback:${NC} cp ${PLAN_FILE}.backup.* PLAN.md"
    else
        echo -e "${RED}❌ Failed to auto-decompose task${NC}"
        cp "${PLAN_FILE}.backup.$(date +%s)" "$PLAN_FILE"
        echo "Restored original PLAN.md"
    fi

    rm -f "$temp_file"
}

# Main execution
echo -e "${BLUE}Smart Task Decomposition for: $TASK_ID${NC}"
echo ""

# Get task description - use provided description or extract from files
if [ -n "$TASK_DESCRIPTION" ]; then
    task_description="$TASK_DESCRIPTION"
    echo -e "${GREEN}Using provided task description for analysis${NC}"
else
    task_description=$(extract_task_details)
    echo -e "${BLUE}Extracted task description from workflow files${NC}"
fi

# Analyze complexity
complexity_result=0
analyze_complexity "$task_description" || complexity_result=$?

echo ""

# Handle failure reason if provided
if [ -n "$FAILURE_REASON" ]; then
    echo -e "${YELLOW}Failure Reason: $FAILURE_REASON${NC}"
    echo ""

    case "$FAILURE_REASON" in
        *"timeout"*|*"too complex"*|*"multiple errors"*)
            echo -e "${RED}Task appears too complex for single execution${NC}"
            complexity_result=2
            ;;
        *"dependency"*|*"blocked"*)
            echo -e "${YELLOW}Task has external dependencies${NC}"
            echo "Consider splitting dependencies into separate tasks"
            ;;
        *"quality"*|*"tests failing"*)
            echo -e "${YELLOW}Quality issues suggest implementation complexity${NC}"
            echo "Consider separating implementation from testing/validation"
            ;;
    esac
    echo ""
fi

# Provide recommendations
if [ $complexity_result -ge 1 ]; then
    suggest_decomposition "$task_description"
    echo ""

    if [ "$AUTO_DECOMPOSE" = true ]; then
        auto_decompose_task
    else
        echo -e "${BLUE}To auto-decompose this task:${NC}"
        echo "$0 --task $TASK_ID --auto-decompose"
        echo ""
        echo -e "${BLUE}To manually decompose:${NC}"
        echo "1. Edit PLAN.md to replace current task with suggested subtasks"
        echo "2. Run: /develop (will start with first subtask)"
    fi
else
    echo -e "${GREEN}Task complexity is appropriate - no decomposition needed${NC}"
    echo ""
    echo -e "${BLUE}Alternative approaches if task is failing:${NC}"
    echo "• Try different agent: /develop --agent DIFFERENT-AGENT $TASK_ID"
    echo "• Force retry: /develop --force $TASK_ID"
    echo "• Get more context: /refresh --task $TASK_ID"
fi

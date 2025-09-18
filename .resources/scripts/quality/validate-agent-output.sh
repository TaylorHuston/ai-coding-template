#!/bin/bash
# Agent Output Validation Script
# Validates that agent outputs meet structured requirements and follow technical specifications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse arguments
AGENT_OUTPUT_FILE=""
TASK_ID=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --output)
            AGENT_OUTPUT_FILE="$2"
            shift 2
            ;;
        --task)
            TASK_ID="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 --output AGENT-OUTPUT-FILE --task TASK-ID"
            echo "Validates agent output meets requirements"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [ -z "$AGENT_OUTPUT_FILE" ] || [ -z "$TASK_ID" ]; then
    echo "Error: --output and --task are required"
    exit 1
fi

# Validation functions
validate_technical_acknowledgment() {
    echo -e "${BLUE}Checking technical requirement acknowledgment...${NC}"

    # Check if agent acknowledged critical context
    if grep -qi "CRITICAL_CONTEXT\|critical requirement\|must follow\|constraint" "$AGENT_OUTPUT_FILE"; then
        echo -e "${GREEN}✅ Agent acknowledged critical requirements${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ Agent may not have acknowledged critical requirements${NC}"
        return 1
    fi
}

validate_implementation_details() {
    echo -e "${BLUE}Checking implementation detail completeness...${NC}"

    local details_found=0

    # Check for file changes mentioned
    if grep -qi "file\|created\|modified\|updated" "$AGENT_OUTPUT_FILE"; then
        ((details_found++))
    fi

    # Check for technical decisions explained
    if grep -qi "decision\|approach\|pattern\|architecture" "$AGENT_OUTPUT_FILE"; then
        ((details_found++))
    fi

    # Check for next steps or handoff context
    if grep -qi "next\|handoff\|ready for\|context" "$AGENT_OUTPUT_FILE"; then
        ((details_found++))
    fi

    if [ $details_found -ge 2 ]; then
        echo -e "${GREEN}✅ Agent provided sufficient implementation details${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ Agent output lacks implementation details${NC}"
        echo "   Missing: file changes, technical decisions, or handoff context"
        return 1
    fi
}

validate_quality_compliance() {
    echo -e "${BLUE}Checking quality compliance mentions...${NC}"

    # Check if agent mentioned testing
    if grep -qi "test\|testing\|coverage" "$AGENT_OUTPUT_FILE"; then
        echo -e "${GREEN}✅ Agent addressed testing considerations${NC}"
    else
        echo -e "${YELLOW}⚠️ No testing considerations mentioned${NC}"
    fi

    # Check if agent mentioned security
    if grep -qi "security\|auth\|permission\|safe" "$AGENT_OUTPUT_FILE"; then
        echo -e "${GREEN}✅ Agent considered security aspects${NC}"
    else
        echo -e "${YELLOW}⚠️ No security considerations mentioned${NC}"
    fi

    # Check if agent mentioned performance
    if grep -qi "performance\|speed\|optimization\|efficient" "$AGENT_OUTPUT_FILE"; then
        echo -e "${GREEN}✅ Agent considered performance aspects${NC}"
    else
        echo -e "${YELLOW}⚠️ No performance considerations mentioned${NC}"
    fi

    return 0
}

validate_structured_output() {
    echo -e "${BLUE}Checking output structure and completeness...${NC}"

    local structure_score=0

    # Check for clear summary
    if grep -qi "summary\|completed\|implemented" "$AGENT_OUTPUT_FILE"; then
        ((structure_score++))
    fi

    # Check for specific deliverables mentioned
    if grep -qi "deliverable\|artifact\|output\|result" "$AGENT_OUTPUT_FILE"; then
        ((structure_score++))
    fi

    # Check for blockers or issues mentioned
    if grep -qi "blocker\|issue\|problem\|challenge\|concern" "$AGENT_OUTPUT_FILE"; then
        ((structure_score++))
        echo -e "${YELLOW}⚠️ Agent reported blockers or issues${NC}"
    fi

    if [ $structure_score -ge 2 ]; then
        echo -e "${GREEN}✅ Agent output is well-structured${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ Agent output lacks clear structure${NC}"
        return 1
    fi
}

check_constraint_compliance() {
    echo -e "${BLUE}Checking compliance with CRITICAL_CONTEXT constraints...${NC}"

    if [ ! -f "RESEARCH.md" ]; then
        echo -e "${YELLOW}⚠️ No RESEARCH.md found for constraint validation${NC}"
        return 0
    fi

    # Extract critical constraints
    local constraints_section=$(sed -n '/## CRITICAL_CONTEXT/,/## /p' RESEARCH.md | sed '$d')

    if [ -z "$constraints_section" ]; then
        echo -e "${YELLOW}⚠️ No CRITICAL_CONTEXT section found${NC}"
        return 0
    fi

    # Check if agent output mentions following patterns/constraints
    local compliance_indicators=0

    if echo "$constraints_section" | grep -qi "architecture" && grep -qi "architecture\|pattern" "$AGENT_OUTPUT_FILE"; then
        ((compliance_indicators++))
    fi

    if echo "$constraints_section" | grep -qi "security" && grep -qi "security\|auth" "$AGENT_OUTPUT_FILE"; then
        ((compliance_indicators++))
    fi

    if echo "$constraints_section" | grep -qi "performance" && grep -qi "performance\|efficient" "$AGENT_OUTPUT_FILE"; then
        ((compliance_indicators++))
    fi

    if [ $compliance_indicators -gt 0 ]; then
        echo -e "${GREEN}✅ Agent output shows constraint compliance${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ Agent output may not comply with critical constraints${NC}"
        return 1
    fi
}

generate_feedback() {
    echo ""
    echo -e "${BLUE}=== AGENT OUTPUT VALIDATION SUMMARY ===${NC}"
    echo ""

    local validation_score=0
    local total_checks=5

    if validate_technical_acknowledgment; then ((validation_score++)); fi
    if validate_implementation_details; then ((validation_score++)); fi
    if validate_structured_output; then ((validation_score++)); fi
    if check_constraint_compliance; then ((validation_score++)); fi
    validate_quality_compliance  # Always runs, doesn't affect score

    echo ""
    echo -e "${BLUE}Validation Score: $validation_score/$total_checks${NC}"

    if [ $validation_score -ge 4 ]; then
        echo -e "${GREEN}✅ EXCELLENT: Agent output meets high quality standards${NC}"
        echo "Ready to update HANDOFF.yml and continue workflow"
        return 0
    elif [ $validation_score -ge 3 ]; then
        echo -e "${YELLOW}⚠️ GOOD: Agent output is acceptable with minor gaps${NC}"
        echo "Proceed with workflow but consider requesting clarification"
        return 0
    else
        echo -e "${RED}❌ NEEDS IMPROVEMENT: Agent output has significant gaps${NC}"
        echo ""
        echo -e "${BLUE}Recommended Actions:${NC}"
        echo "• Request agent to provide more detailed technical specifications"
        echo "• Ask agent to explicitly acknowledge critical constraints"
        echo "• Consider re-running task with different agent or additional context"
        echo "• Use /iterate --agent AGENT-NAME --force to retry with specific agent"
        return 1
    fi
}

# Main execution
echo -e "${BLUE}Validating agent output for task: $TASK_ID${NC}"
echo "Output file: $AGENT_OUTPUT_FILE"
echo ""

if [ ! -f "$AGENT_OUTPUT_FILE" ]; then
    echo -e "${RED}Error: Agent output file not found: $AGENT_OUTPUT_FILE${NC}"
    exit 1
fi

generate_feedback
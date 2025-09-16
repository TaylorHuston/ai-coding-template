#!/bin/bash
# Quality Gate Remediation Advisor
# Provides specific guidance when quality gates fail and suggests next steps

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse quality gate results and provide remediation
analyze_failures() {
    local test_failed=false
    local build_failed=false
    local lint_failed=false
    local security_failed=false

    echo -e "${BLUE}=== QUALITY GATE REMEDIATION ADVISOR ===${NC}"
    echo ""

    # Run quality gates and capture results
    if ! scripts/validate-quality-gates.sh --quiet --continue-on-failure; then
        echo -e "${YELLOW}Quality gate failures detected. Analyzing...${NC}"
        echo ""

        # Test failure analysis
        if [ -f "/tmp/test_output.log" ] && grep -q "fail\|error\|Error" /tmp/test_output.log; then
            test_failed=true
            echo -e "${RED}❌ TESTS FAILING${NC}"
            echo -e "${BLUE}Recommended Actions:${NC}"

            # Analyze test failure patterns
            if grep -qi "syntax\|parse" /tmp/test_output.log; then
                echo "• Fix syntax errors in test files or source code"
                echo "• Suggested agent: code-reviewer (for syntax fixes)"
            elif grep -qi "timeout\|slow" /tmp/test_output.log; then
                echo "• Optimize slow tests or increase timeout thresholds"
                echo "• Suggested agent: performance-optimizer"
            elif grep -qi "connection\|network\|database" /tmp/test_output.log; then
                echo "• Check test database setup and network connectivity"
                echo "• Suggested agent: devops-engineer or database-specialist"
            elif grep -qi "mock\|stub" /tmp/test_output.log; then
                echo "• Fix mocking/stubbing issues in test setup"
                echo "• Suggested agent: test-engineer"
            else
                echo "• Review failing tests and fix implementation issues"
                echo "• Suggested agent: test-engineer (for test fixes) or domain specialist (for implementation)"
            fi
            echo ""
        fi

        # Build failure analysis
        if [ -f "/tmp/build_output.log" ] && grep -q "fail\|error\|Error" /tmp/build_output.log; then
            build_failed=true
            echo -e "${RED}❌ BUILD FAILING${NC}"
            echo -e "${BLUE}Recommended Actions:${NC}"

            if grep -qi "missing\|not found\|cannot resolve" /tmp/build_output.log; then
                echo "• Install missing dependencies or fix import paths"
                echo "• Suggested agent: devops-engineer (for dependencies)"
            elif grep -qi "type\|typescript" /tmp/build_output.log; then
                echo "• Fix TypeScript type errors"
                echo "• Suggested agent: frontend-specialist or backend-specialist"
            elif grep -qi "syntax\|parse" /tmp/build_output.log; then
                echo "• Fix syntax errors in source code"
                echo "• Suggested agent: code-reviewer"
            else
                echo "• Review build configuration and source code issues"
                echo "• Suggested agent: devops-engineer or relevant domain specialist"
            fi
            echo ""
        fi

        # Lint failure analysis
        if [ -f "/tmp/lint_output.log" ] && grep -q "error\|warning" /tmp/lint_output.log; then
            lint_failed=true
            echo -e "${YELLOW}⚠️ LINTING ISSUES${NC}"
            echo -e "${BLUE}Recommended Actions:${NC}"
            echo "• Run automatic linting fixes: npm run lint:fix or similar"
            echo "• Review and fix remaining style/quality issues"
            echo "• Suggested agent: code-reviewer (for style consistency)"
            echo ""
        fi

        # Security analysis
        if grep -r -q "password.*=.*['\"][^'\"]{8,}['\"]" . 2>/dev/null; then
            security_failed=true
            echo -e "${RED}❌ SECURITY ISSUES${NC}"
            echo -e "${BLUE}Recommended Actions:${NC}"
            echo "• Remove hardcoded secrets and use environment variables"
            echo "• Implement proper secret management"
            echo "• Suggested agent: security-auditor"
            echo ""
        fi

        # Provide workflow recommendations
        echo -e "${BLUE}=== WORKFLOW RECOMMENDATIONS ===${NC}"

        if $test_failed || $build_failed; then
            echo -e "${YELLOW}CRITICAL:${NC} Fix tests and build issues before proceeding"
            echo "Next task should focus on stabilizing core functionality"

            if $test_failed; then
                echo "• Consider: /iterate --agent test-engineer [current-task]"
            fi
            if $build_failed; then
                echo "• Consider: /iterate --agent devops-engineer [current-task]"
            fi
        elif $lint_failed; then
            echo -e "${YELLOW}MEDIUM:${NC} Address code quality issues"
            echo "• Consider: /iterate --agent code-reviewer [current-task]"
        elif $security_failed; then
            echo -e "${RED}HIGH:${NC} Address security vulnerabilities immediately"
            echo "• Consider: /iterate --agent security-auditor [current-task]"
        else
            echo -e "${GREEN}✅ Quality gates passed - proceed with next task${NC}"
        fi

        echo ""
        echo -e "${BLUE}=== TASK DECOMPOSITION SUGGESTIONS ===${NC}"

        if $test_failed && $build_failed; then
            echo "Current task may be too complex. Consider splitting:"
            echo "• P[X].[Y].1 - Fix build issues and dependencies"
            echo "• P[X].[Y].2 - Fix failing tests"
            echo "• P[X].[Y].3 - Continue original implementation"
        fi

    else
        echo -e "${GREEN}✅ All quality gates passed!${NC}"
        echo "Ready to proceed with next task in workflow"
    fi

    # Cleanup
    rm -f /tmp/test_output.log /tmp/build_output.log /tmp/lint_output.log
}

# Generate agent selection recommendations
suggest_agents() {
    echo ""
    echo -e "${BLUE}=== INTELLIGENT AGENT SELECTION ===${NC}"

    # Analyze current task from PLAN.md if available
    if [ -f "PLAN.md" ]; then
        current_task=$(grep -E "\- \[ \] P[0-9]+\.[0-9]+\.[0-9]+" PLAN.md | head -1)

        if [ -n "$current_task" ]; then
            echo "Current task: $current_task"

            # Extract task description for analysis
            if echo "$current_task" | grep -qi "test\|testing"; then
                echo "• Primary agent: test-engineer"
                echo "• Backup agent: qa-specialist"
            elif echo "$current_task" | grep -qi "api\|endpoint"; then
                echo "• Primary agent: api-designer"
                echo "• Backup agent: backend-specialist"
            elif echo "$current_task" | grep -qi "database\|schema\|migration"; then
                echo "• Primary agent: database-specialist"
                echo "• Backup agent: backend-specialist"
            elif echo "$current_task" | grep -qi "frontend\|ui\|component"; then
                echo "• Primary agent: frontend-specialist"
                echo "• Backup agent: ui-specialist"
            elif echo "$current_task" | grep -qi "security\|auth"; then
                echo "• Primary agent: security-auditor"
                echo "• Backup agent: backend-specialist"
            elif echo "$current_task" | grep -qi "deploy\|infrastructure"; then
                echo "• Primary agent: devops-engineer"
                echo "• Backup agent: infrastructure-specialist"
            else
                echo "• Primary agent: code-architect (for analysis)"
                echo "• Backup agent: context-analyzer"
            fi
        fi
    fi
}

# Main execution
analyze_failures
suggest_agents

echo ""
echo -e "${BLUE}💡 Pro Tips:${NC}"
echo "• Use /iterate --agent AGENT-NAME to override default agent selection"
echo "• Run this script after any quality gate failures for guidance"
echo "• Consider task decomposition if multiple areas are failing"
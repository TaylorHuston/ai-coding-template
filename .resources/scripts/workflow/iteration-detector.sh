#!/bin/bash

# Iteration Trigger Detection Script
# Purpose: Analyze workflow state and detect when iteration/revision is needed
# Version: 0.1.0
# Usage: ./iteration-detector.sh [--phase PHASE] [--context-file FILE] [--report-only]

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Source common utilities
source "$SCRIPT_DIR/../lib/logging.sh"

# Default values
PHASE=""
CONTEXT_FILE=""
REPORT_ONLY=false
OUTPUT_FORMAT="markdown"

# Trigger definitions
declare -A SCOPE_TRIGGERS=(
    ["requirements_growth"]="New requirements discovered during implementation"
    ["scope_creep"]="Feature scope expanding beyond original definition"
    ["timeline_pressure"]="Original timeline proving unrealistic"
    ["complexity_increase"]="Implementation complexity higher than planned"
)

declare -A TECHNICAL_TRIGGERS=(
    ["architecture_limitations"]="Current architecture cannot support requirements"
    ["performance_issues"]="Performance requirements not being met"
    ["integration_failures"]="Integration with external systems failing"
    ["technical_debt"]="Significant technical debt accumulating"
    ["security_concerns"]="New security requirements or vulnerabilities"
)

declare -A UNDERSTANDING_TRIGGERS=(
    ["assumption_invalidated"]="Key planning assumptions proving incorrect"
    ["user_feedback"]="User research contradicting current direction"
    ["business_pivot"]="Business priorities or strategy changing"
    ["market_feedback"]="Market validation differing from expectations"
)

declare -A COLLABORATION_TRIGGERS=(
    ["stakeholder_conflict"]="Conflicting requirements from stakeholders"
    ["team_capacity"]="Team capacity issues affecting delivery"
    ["skill_gaps"]="Required skills not available on team"
    ["external_dependencies"]="External dependencies blocking progress"
)

# Display help
show_help() {
    cat << EOF
Iteration Trigger Detection Script

USAGE:
    $0 [OPTIONS]

OPTIONS:
    --phase PHASE           Workflow phase to analyze (vision, feature, architect, plan, develop)
    --context-file FILE     Path to context file to analyze
    --report-only          Generate report without recommendations
    --format FORMAT        Output format (markdown, yaml, json)
    --help                 Show this help message

EXAMPLES:
    # Analyze current project state
    $0

    # Analyze specific phase
    $0 --phase develop

    # Analyze specific context file
    $0 --context-file .claude/working/AUTH-123/RESEARCH.md

    # Generate detailed report
    $0 --report-only --format yaml

DESCRIPTION:
    This script analyzes project workflow state to detect when iteration
    or revision of earlier phases might be beneficial. It examines:

    - Scope changes and requirements evolution
    - Technical challenges and constraints
    - Understanding gaps and assumption failures
    - Collaboration and team issues

    Based on detected triggers, it provides recommendations for workflow
    iteration and process improvements.

EOF
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --phase)
                PHASE="$2"
                shift 2
                ;;
            --context-file)
                CONTEXT_FILE="$2"
                shift 2
                ;;
            --report-only)
                REPORT_ONLY=true
                shift
                ;;
            --format)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Detect iteration triggers from context analysis
analyze_scope_triggers() {
    local context_content="$1"
    local triggers=()

    # Check for scope expansion indicators
    if echo "$context_content" | grep -qi "new requirement\|additional feature\|scope expanding\|more complex than"; then
        triggers+=("requirements_growth")
    fi

    # Check for timeline issues
    if echo "$context_content" | grep -qi "behind schedule\|timeline\|deadline\|taking longer"; then
        triggers+=("timeline_pressure")
    fi

    # Check for complexity increases
    if echo "$context_content" | grep -qi "more complex\|complexity\|harder than expected\|underestimated"; then
        triggers+=("complexity_increase")
    fi

    # Check for scope creep
    if echo "$context_content" | grep -qi "scope creep\|feature creep\|expanding scope\|additional requirements"; then
        triggers+=("scope_creep")
    fi

    printf '%s\n' "${triggers[@]}"
}

# Detect technical triggers
analyze_technical_triggers() {
    local context_content="$1"
    local triggers=()

    # Check for architecture issues
    if echo "$context_content" | grep -qi "architecture\|design limitation\|cannot support\|architectural"; then
        triggers+=("architecture_limitations")
    fi

    # Check for performance issues
    if echo "$context_content" | grep -qi "performance\|slow\|latency\|timeout\|memory"; then
        triggers+=("performance_issues")
    fi

    # Check for integration issues
    if echo "$context_content" | grep -qi "integration\|API\|service\|connection\|external"; then
        triggers+=("integration_failures")
    fi

    # Check for technical debt
    if echo "$context_content" | grep -qi "technical debt\|refactor\|cleanup\|hack\|workaround"; then
        triggers+=("technical_debt")
    fi

    # Check for security issues
    if echo "$context_content" | grep -qi "security\|vulnerability\|auth\|encryption\|compliance"; then
        triggers+=("security_concerns")
    fi

    printf '%s\n' "${triggers[@]}"
}

# Detect understanding triggers
analyze_understanding_triggers() {
    local context_content="$1"
    local triggers=()

    # Check for invalidated assumptions
    if echo "$context_content" | grep -qi "assumption\|incorrect\|wrong\|unexpected\|surprising"; then
        triggers+=("assumption_invalidated")
    fi

    # Check for user feedback issues
    if echo "$context_content" | grep -qi "user feedback\|user research\|user testing\|usability"; then
        triggers+=("user_feedback")
    fi

    # Check for business changes
    if echo "$context_content" | grep -qi "business\|strategy\|priority\|pivot\|direction"; then
        triggers+=("business_pivot")
    fi

    # Check for market feedback
    if echo "$context_content" | grep -qi "market\|customer\|validation\|product-market fit"; then
        triggers+=("market_feedback")
    fi

    printf '%s\n' "${triggers[@]}"
}

# Detect collaboration triggers
analyze_collaboration_triggers() {
    local context_content="$1"
    local triggers=()

    # Check for stakeholder conflicts
    if echo "$context_content" | grep -qi "conflict\|disagreement\|different opinion\|stakeholder"; then
        triggers+=("stakeholder_conflict")
    fi

    # Check for team capacity issues
    if echo "$context_content" | grep -qi "capacity\|resource\|team\|availability\|bandwidth"; then
        triggers+=("team_capacity")
    fi

    # Check for skill gaps
    if echo "$context_content" | grep -qi "skill\|expertise\|knowledge\|learning\|training"; then
        triggers+=("skill_gaps")
    fi

    # Check for external dependencies
    if echo "$context_content" | grep -qi "dependency\|blocked\|waiting\|external\|third-party"; then
        triggers+=("external_dependencies")
    fi

    printf '%s\n' "${triggers[@]}"
}

# Analyze git commit history for iteration patterns
analyze_git_history() {
    local triggers=()

    # Check for frequent reverts or back-and-forth changes
    local revert_count
    revert_count=$(git log --oneline --since="1 week ago" | grep -c "revert\|undo\|rollback" || echo "0")

    if [[ $revert_count -gt 3 ]]; then
        triggers+=("frequent_reverts")
    fi

    # Check for scope-related commits
    local scope_commits
    scope_commits=$(git log --oneline --since="1 week ago" | grep -c "scope\|requirement\|feature" || echo "0")

    if [[ $scope_commits -gt 5 ]]; then
        triggers+=("scope_churn")
    fi

    printf '%s\n' "${triggers[@]}"
}

# Generate recommendations based on triggers
generate_recommendations() {
    local -n scope_ref=$1
    local -n technical_ref=$2
    local -n understanding_ref=$3
    local -n collaboration_ref=$4

    local recommendations=()

    # Scope-based recommendations
    if [[ ${#scope_ref[@]} -gt 0 ]]; then
        recommendations+=("Consider scope review and re-prioritization")
        recommendations+=("Break large features into smaller, manageable pieces")

        if [[ " ${scope_ref[*]} " =~ " timeline_pressure " ]]; then
            recommendations+=("Reassess timeline and resource allocation")
        fi
    fi

    # Technical recommendations
    if [[ ${#technical_ref[@]} -gt 0 ]]; then
        recommendations+=("Review architecture decisions in /architect phase")

        if [[ " ${technical_ref[*]} " =~ " performance_issues " ]]; then
            recommendations+=("Consult performance-optimizer agent for optimization strategies")
        fi

        if [[ " ${technical_ref[*]} " =~ " security_concerns " ]]; then
            recommendations+=("Engage security-auditor agent for security review")
        fi
    fi

    # Understanding recommendations
    if [[ ${#understanding_ref[@]} -gt 0 ]]; then
        recommendations+=("Revisit /vision and /feature phases to update understanding")

        if [[ " ${understanding_ref[*]} " =~ " assumption_invalidated " ]]; then
            recommendations+=("Document invalidated assumptions and update planning")
        fi
    fi

    # Collaboration recommendations
    if [[ ${#collaboration_ref[@]} -gt 0 ]]; then
        recommendations+=("Schedule stakeholder alignment session")

        if [[ " ${collaboration_ref[*]} " =~ " team_capacity " ]]; then
            recommendations+=("Reassess team capacity and adjust scope accordingly")
        fi
    fi

    printf '%s\n' "${recommendations[@]}"
}

# Generate markdown report
generate_markdown_report() {
    local -n scope_ref=$1
    local -n technical_ref=$2
    local -n understanding_ref=$3
    local -n collaboration_ref=$4
    local -n recommendations_ref=$5

    cat << EOF
# Iteration Trigger Analysis Report

**Generated**: $(date)
**Project**: $(basename "$PWD")
**Phase**: ${PHASE:-"auto-detected"}

## Summary

This report analyzes the current project state for indicators that suggest
iteration or revision of earlier workflow phases might be beneficial.

## Detected Triggers

### Scope & Requirements
EOF

    if [[ ${#scope_ref[@]} -eq 0 ]]; then
        echo "✅ No scope-related triggers detected"
    else
        for trigger in "${scope_ref[@]}"; do
            echo "⚠️  **$trigger**: ${SCOPE_TRIGGERS[$trigger]}"
        done
    fi

    cat << EOF

### Technical Issues
EOF

    if [[ ${#technical_ref[@]} -eq 0 ]]; then
        echo "✅ No technical triggers detected"
    else
        for trigger in "${technical_ref[@]}"; do
            echo "⚠️  **$trigger**: ${TECHNICAL_TRIGGERS[$trigger]}"
        done
    fi

    cat << EOF

### Understanding & Assumptions
EOF

    if [[ ${#understanding_ref[@]} -eq 0 ]]; then
        echo "✅ No understanding-related triggers detected"
    else
        for trigger in "${understanding_ref[@]}"; do
            echo "⚠️  **$trigger**: ${UNDERSTANDING_TRIGGERS[$trigger]}"
        done
    fi

    cat << EOF

### Collaboration & Team
EOF

    if [[ ${#collaboration_ref[@]} -eq 0 ]]; then
        echo "✅ No collaboration triggers detected"
    else
        for trigger in "${collaboration_ref[@]}"; do
            echo "⚠️  **$trigger**: ${COLLABORATION_TRIGGERS[$trigger]}"
        done
    fi

    if [[ ! "$REPORT_ONLY" == "true" ]]; then
        cat << EOF

## Recommendations

Based on the detected triggers, consider the following actions:

EOF

        if [[ ${#recommendations_ref[@]} -eq 0 ]]; then
            echo "✅ No specific recommendations at this time"
        else
            for recommendation in "${recommendations_ref[@]}"; do
                echo "- $recommendation"
            done
        fi

        cat << EOF

## Next Steps

1. Review triggered areas with relevant stakeholders
2. Consider running workflow commands to address issues:
   - \`/vision --review\` for understanding issues
   - \`/feature --validate\` for scope issues
   - \`/architect --review\` for technical issues
   - \`/plan --review-plan\` for planning adjustments

3. Update documentation to reflect new learnings
4. Communicate changes to team and stakeholders

EOF
    fi
}

# Main execution function
main() {
    parse_args "$@"

    log_info "Starting iteration trigger analysis..."

    # Gather context content
    local context_content=""

    if [[ -n "$CONTEXT_FILE" ]]; then
        if [[ ! -f "$CONTEXT_FILE" ]]; then
            log_error "Context file not found: $CONTEXT_FILE"
            exit 1
        fi
        context_content=$(cat "$CONTEXT_FILE")
    else
        # Auto-discover context files
        local context_files=(
            ".claude/working/*/RESEARCH.md"
            ".claude/working/*/PLAN.md"
            "docs/vision.md"
            "project-vision.md"
            "STATUS.md"
        )

        for pattern in "${context_files[@]}"; do
            for file in $pattern; do
                if [[ -f "$file" ]]; then
                    context_content+=$'\n'"$(cat "$file")"
                fi
            done
        done
    fi

    if [[ -z "$context_content" ]]; then
        log_warning "No context content found for analysis"
        context_content="No context available"
    fi

    # Analyze triggers
    local scope_triggers=()
    local technical_triggers=()
    local understanding_triggers=()
    local collaboration_triggers=()

    # Read triggers into arrays
    while IFS= read -r trigger; do
        [[ -n "$trigger" ]] && scope_triggers+=("$trigger")
    done < <(analyze_scope_triggers "$context_content")

    while IFS= read -r trigger; do
        [[ -n "$trigger" ]] && technical_triggers+=("$trigger")
    done < <(analyze_technical_triggers "$context_content")

    while IFS= read -r trigger; do
        [[ -n "$trigger" ]] && understanding_triggers+=("$trigger")
    done < <(analyze_understanding_triggers "$context_content")

    while IFS= read -r trigger; do
        [[ -n "$trigger" ]] && collaboration_triggers+=("$trigger")
    done < <(analyze_collaboration_triggers "$context_content")

    # Generate recommendations
    local recommendations=()
    while IFS= read -r recommendation; do
        [[ -n "$recommendation" ]] && recommendations+=("$recommendation")
    done < <(generate_recommendations scope_triggers technical_triggers understanding_triggers collaboration_triggers)

    # Generate report
    case "$OUTPUT_FORMAT" in
        "markdown"|"md")
            generate_markdown_report scope_triggers technical_triggers understanding_triggers collaboration_triggers recommendations
            ;;
        *)
            log_error "Unsupported output format: $OUTPUT_FORMAT"
            exit 1
            ;;
    esac

    # Exit with appropriate code
    local total_triggers=$((${#scope_triggers[@]} + ${#technical_triggers[@]} + ${#understanding_triggers[@]} + ${#collaboration_triggers[@]}))

    if [[ $total_triggers -eq 0 ]]; then
        log_success "No iteration triggers detected"
        exit 0
    else
        log_warning "$total_triggers iteration triggers detected"
        exit 1
    fi
}

# Execute main function
main "$@"
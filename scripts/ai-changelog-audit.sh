#!/bin/bash

# AI Changelog Audit Tool
# Comprehensive audit tool for AI assistants to ensure CHANGELOG is up-to-date
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
CHANGELOG_FILE="CHANGELOG.md"
DELIVERABLES_DIR="deliverables"
STATUS_FILE="STATUS.md"

# Statistics
STATS_TOTAL_COMMITS=0
STATS_DOCUMENTED_COMMITS=0
STATS_MISSING_COMMITS=0
STATS_TOTAL_ISSUES=0
STATS_DOCUMENTED_ISSUES=0
STATS_AI_COMMITS=0

# Function to display header
show_header() {
    echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║          AI CHANGELOG AUDIT TOOL v1.0.0                 ║${NC}"
    echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function to check if commit should have changelog entry
should_have_changelog() {
    local files="$1"
    
    # Skip if only documentation or config files
    if echo "$files" | grep -qvE '\.(md|txt|json|yml|yaml|toml|lock)$'; then
        return 0
    fi
    
    return 1
}

# Function to extract all references from CHANGELOG
get_changelog_references() {
    grep -oE "(ISSUE|BUG|TASK)-[0-9]+" "$CHANGELOG_FILE" 2>/dev/null | sort -u || echo ""
}

# Function to analyze commits
analyze_git_history() {
    echo -e "${CYAN}═══ Git Commit Analysis ═══${NC}"
    echo ""
    
    local period="${1:-30 days ago}"
    local changelog_refs=$(get_changelog_references)
    
    # Get all commits with their details
    local commits=$(git log --since="$period" --pretty=format:"%H|%s|%an|%ai" --name-status)
    
    local missing_entries=""
    local documented_entries=""
    
    # Process commits
    while IFS='|' read -r hash subject author date; do
        [[ -z "$hash" ]] && continue
        
        ((STATS_TOTAL_COMMITS++))
        
        # Check for issue/bug/task reference
        local ref=$(echo "$subject" | grep -oE "(ISSUE|BUG|TASK)-[0-9]+" | head -1)
        
        # Check for AI assistance
        local commit_body=$(git show -s --format=%B "$hash" 2>/dev/null)
        if echo "$commit_body" | grep -qE "(AI-assisted|Co-Authored-By: Claude|🤖|Generated with)"; then
            ((STATS_AI_COMMITS++))
        fi
        
        # Get changed files for this commit
        local files=$(git diff-tree --no-commit-id --name-only -r "$hash" 2>/dev/null || echo "")
        
        # Check if this commit should have a changelog entry
        if should_have_changelog "$files"; then
            if [[ -n "$ref" ]]; then
                ((STATS_TOTAL_ISSUES++))
                
                # Check if reference is in CHANGELOG
                if echo "$changelog_refs" | grep -q "^$ref$"; then
                    documented_entries="${documented_entries}  ${GREEN}✓${NC} $ref - $subject\n"
                    ((STATS_DOCUMENTED_COMMITS++))
                    ((STATS_DOCUMENTED_ISSUES++))
                else
                    missing_entries="${missing_entries}  ${YELLOW}⚠${NC} $ref - $subject\n"
                    ((STATS_MISSING_COMMITS++))
                fi
            else
                # Commit without reference but with code changes
                local short_hash=$(echo "$hash" | cut -c1-8)
                
                # Check if commit message appears in changelog
                if grep -qF "$subject" "$CHANGELOG_FILE" 2>/dev/null; then
                    documented_entries="${documented_entries}  ${GREEN}✓${NC} $short_hash - $subject\n"
                    ((STATS_DOCUMENTED_COMMITS++))
                else
                    missing_entries="${missing_entries}  ${YELLOW}⚠${NC} $short_hash - $subject (no ref)\n"
                    ((STATS_MISSING_COMMITS++))
                fi
            fi
        fi
    done < <(git log --since="$period" --pretty=format:"%H|%s|%an|%ai")
    
    # Display results
    if [[ -n "$missing_entries" ]]; then
        echo -e "${YELLOW}Missing CHANGELOG entries:${NC}"
        echo -e "$missing_entries"
    fi
    
    if [[ -n "$documented_entries" ]] && [[ "$VERBOSE" == "true" ]]; then
        echo -e "${GREEN}Documented entries:${NC}"
        echo -e "$documented_entries"
    fi
    
    echo ""
}

# Function to analyze deliverables
analyze_deliverables() {
    echo -e "${CYAN}═══ Deliverables Analysis ═══${NC}"
    echo ""
    
    if [[ ! -d "$DELIVERABLES_DIR" ]]; then
        echo -e "${YELLOW}No deliverables directory found${NC}"
        return
    fi
    
    local total_deliverables=0
    local missing_changelog=0
    local has_changelog=0
    
    # Find all plan files
    for plan_file in $(find "$DELIVERABLES_DIR" -name "*-plan.md" -type f 2>/dev/null | sort); do
        ((total_deliverables++))
        
        local basename=$(basename "$plan_file")
        local ref="${basename%-plan.md}"
        local dir=$(dirname "$plan_file")
        
        # Check for changelog entry in plan file
        local has_entry=false
        if grep -q "## Changelog Entry\|### Changelog Entry" "$plan_file" 2>/dev/null; then
            has_entry=true
        fi
        
        # Check if reference exists in CHANGELOG
        local in_changelog=false
        if grep -q "$ref" "$CHANGELOG_FILE" 2>/dev/null; then
            in_changelog=true
            ((has_changelog++))
        else
            ((missing_changelog++))
        fi
        
        # Determine status
        if [[ "$in_changelog" == "true" ]]; then
            echo -e "  ${GREEN}✓${NC} $ref - In CHANGELOG"
        elif [[ "$has_entry" == "true" ]]; then
            echo -e "  ${YELLOW}⚠${NC} $ref - Has entry in plan but not in CHANGELOG"
            
            # Show the entry from plan if verbose
            if [[ "$VERBOSE" == "true" ]]; then
                echo -e "      ${CYAN}Plan entry:${NC}"
                sed -n '/## Changelog Entry/,/^##[^#]/p' "$plan_file" | grep -v "^##" | head -3
            fi
        else
            echo -e "  ${BLUE}ℹ${NC} $ref - No changelog entry planned"
        fi
    done
    
    echo ""
    echo -e "${BOLD}Deliverables Summary:${NC}"
    echo -e "  Total: $total_deliverables"
    echo -e "  In CHANGELOG: ${GREEN}$has_changelog${NC}"
    echo -e "  Missing: ${YELLOW}$missing_changelog${NC}"
    echo ""
}

# Function to check for orphaned changelog entries
check_orphaned_entries() {
    echo -e "${CYAN}═══ Orphaned Entry Check ═══${NC}"
    echo ""
    
    local changelog_refs=$(get_changelog_references)
    local orphaned=0
    
    for ref in $changelog_refs; do
        # Check if reference exists in deliverables
        local found=false
        
        if [[ -d "$DELIVERABLES_DIR" ]]; then
            if find "$DELIVERABLES_DIR" -name "${ref}-plan.md" -type f 2>/dev/null | grep -q .; then
                found=true
            fi
        fi
        
        # Check if reference exists in recent commits
        if ! $found; then
            if git log --since="90 days ago" --grep="$ref" --oneline | grep -q .; then
                found=true
            fi
        fi
        
        if ! $found; then
            echo -e "  ${YELLOW}⚠${NC} $ref - In CHANGELOG but no matching deliverable or commit"
            ((orphaned++))
        fi
    done
    
    if [[ $orphaned -eq 0 ]]; then
        echo -e "  ${GREEN}✓${NC} No orphaned entries found"
    fi
    
    echo ""
}

# Function to generate recommendations
generate_recommendations() {
    echo -e "${CYAN}═══ AI Assistant Recommendations ═══${NC}"
    echo ""
    
    local recommendations=()
    
    # Check completion rate
    local completion_rate=0
    if [[ $STATS_TOTAL_COMMITS -gt 0 ]]; then
        completion_rate=$((STATS_DOCUMENTED_COMMITS * 100 / STATS_TOTAL_COMMITS))
    fi
    
    if [[ $STATS_MISSING_COMMITS -gt 0 ]]; then
        recommendations+=("${YELLOW}▸${NC} Run: ${BOLD}./scripts/ai-update-changelog.sh analyze${NC} to review missing entries")
    fi
    
    if [[ $completion_rate -lt 80 ]]; then
        recommendations+=("${YELLOW}▸${NC} Changelog completion rate is ${RED}$completion_rate%${NC} - consider updating")
    fi
    
    if [[ $STATS_AI_COMMITS -gt 0 ]]; then
        local ai_percentage=$((STATS_AI_COMMITS * 100 / STATS_TOTAL_COMMITS))
        recommendations+=("${BLUE}▸${NC} ${BOLD}$ai_percentage%${NC} of commits are AI-assisted - ensure proper attribution")
    fi
    
    # Check for [Unreleased] section
    if ! grep -q "## \[Unreleased\]" "$CHANGELOG_FILE" 2>/dev/null; then
        recommendations+=("${RED}▸${NC} Missing [Unreleased] section in CHANGELOG.md")
    fi
    
    # Display recommendations
    if [[ ${#recommendations[@]} -gt 0 ]]; then
        for rec in "${recommendations[@]}"; do
            echo -e "  $rec"
        done
    else
        echo -e "  ${GREEN}✓${NC} CHANGELOG is well-maintained!"
    fi
    
    echo ""
}

# Function to display summary statistics
display_summary() {
    echo -e "${CYAN}═══ Summary Statistics ═══${NC}"
    echo ""
    
    local completion_rate=0
    if [[ $STATS_TOTAL_COMMITS -gt 0 ]]; then
        completion_rate=$((STATS_DOCUMENTED_COMMITS * 100 / STATS_TOTAL_COMMITS))
    fi
    
    local issue_rate=0
    if [[ $STATS_TOTAL_ISSUES -gt 0 ]]; then
        issue_rate=$((STATS_DOCUMENTED_ISSUES * 100 / STATS_TOTAL_ISSUES))
    fi
    
    echo -e "${BOLD}Git Commits:${NC}"
    echo -e "  Total analyzed: $STATS_TOTAL_COMMITS"
    echo -e "  Documented: ${GREEN}$STATS_DOCUMENTED_COMMITS${NC}"
    echo -e "  Missing: ${YELLOW}$STATS_MISSING_COMMITS${NC}"
    echo -e "  AI-assisted: ${BLUE}$STATS_AI_COMMITS${NC}"
    echo -e "  Completion rate: ${completion_rate}%"
    echo ""
    
    if [[ $STATS_TOTAL_ISSUES -gt 0 ]]; then
        echo -e "${BOLD}Issue References:${NC}"
        echo -e "  Total: $STATS_TOTAL_ISSUES"
        echo -e "  Documented: ${GREEN}$STATS_DOCUMENTED_ISSUES${NC}"
        echo -e "  Completion rate: ${issue_rate}%"
        echo ""
    fi
    
    # Overall health score
    local health_score=$completion_rate
    local health_color=$GREEN
    local health_status="Excellent"
    
    if [[ $health_score -lt 50 ]]; then
        health_color=$RED
        health_status="Needs Attention"
    elif [[ $health_score -lt 80 ]]; then
        health_color=$YELLOW
        health_status="Good"
    fi
    
    echo -e "${BOLD}Overall Health:${NC} ${health_color}$health_status ($health_score%)${NC}"
    echo ""
}

# Function to generate actionable report for AI
generate_ai_report() {
    local output_file="${1:-changelog-audit-report.md}"
    
    cat > "$output_file" << EOF
# CHANGELOG Audit Report
Generated: $(date)

## Action Items for AI Assistant

### Missing Entries (Priority: HIGH)
EOF
    
    # Add missing entries
    git log --since="30 days ago" --pretty=format:"%H|%s" --grep -E "(ISSUE|BUG|TASK)-[0-9]+" | while IFS='|' read -r hash subject; do
        local ref=$(echo "$subject" | grep -oE "(ISSUE|BUG|TASK)-[0-9]+" | head -1)
        if [[ -n "$ref" ]] && ! grep -q "$ref" "$CHANGELOG_FILE"; then
            echo "- [ ] Add entry for $ref: $subject" >> "$output_file"
        fi
    done
    
    cat >> "$output_file" << EOF

### Session Completion Checklist
- [ ] Review all code changes made in this session
- [ ] Update CHANGELOG.md with appropriate entries
- [ ] Verify all issue references are included
- [ ] Mark changes as AI-assisted where applicable
- [ ] Check for breaking changes and mark appropriately

### Commands to Run
\`\`\`bash
# Review recent changes
./scripts/ai-update-changelog.sh analyze

# Add missing entries interactively
./scripts/ai-update-changelog.sh add

# Audit current status
./scripts/ai-changelog-audit.sh
\`\`\`
EOF
    
    echo -e "${GREEN}✓ Report generated: $output_file${NC}"
}

# Main function
main() {
    show_header
    
    # Parse arguments
    VERBOSE=false
    PERIOD="30 days ago"
    GENERATE_REPORT=false
    
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            --since)
                PERIOD="$2"
                shift 2
                ;;
            --report)
                GENERATE_REPORT=true
                shift
                ;;
            -h|--help)
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  -v, --verbose     Show detailed information"
                echo "  --since PERIOD    Analyze commits since (default: '30 days ago')"
                echo "  --report          Generate actionable report for AI"
                echo "  -h, --help        Show this help message"
                exit 0
                ;;
            *)
                shift
                ;;
        esac
    done
    
    # Run analyses
    analyze_git_history "$PERIOD"
    analyze_deliverables
    check_orphaned_entries
    display_summary
    generate_recommendations
    
    # Generate report if requested
    if [[ "$GENERATE_REPORT" == "true" ]]; then
        generate_ai_report
    fi
    
    # Exit with appropriate code
    if [[ $STATS_MISSING_COMMITS -gt 0 ]]; then
        exit 1  # Non-zero exit indicates action needed
    fi
    
    exit 0
}

# Run main function
main "$@"
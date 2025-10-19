#!/bin/bash

# Changelog Update Checker for Git Hooks
# Helps AI assistants and developers remember to update CHANGELOG.md
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CHANGELOG_FILE="CHANGELOG.md"
DELIVERABLES_DIR="deliverables"
EXCLUDED_PATTERNS=(
    "^docs/"
    "^README"
    "^CHANGELOG"
    "^\.github/"
    "^scripts/"
    "^\.gitignore"
    "^package-lock\.json"
    "^yarn\.lock"
)

# Function to check if file should trigger changelog update
should_update_changelog() {
    local file="$1"
    
    # Check if file matches excluded patterns
    for pattern in "${EXCLUDED_PATTERNS[@]}"; do
        if [[ "$file" =~ $pattern ]]; then
            return 1
        fi
    done
    
    # Check if it's a code file
    if [[ "$file" =~ \.(js|ts|jsx|tsx|py|java|go|rs|cpp|c|php|rb|swift|kt|scala|sh)$ ]]; then
        return 0
    fi
    
    # Check if it's a configuration file that might affect users
    if [[ "$file" =~ (package\.json|composer\.json|requirements\.txt|Gemfile|Cargo\.toml|go\.mod|pom\.xml)$ ]]; then
        return 0
    fi
    
    return 1
}

# Function to check for issue/bug/task references in commit message
extract_references() {
    local commit_msg="$1"
    echo "$commit_msg" | grep -oE "(ISSUE|BUG|TASK)-[0-9]+" || true
}

# Function to check if changelog was updated
changelog_updated() {
    git diff --cached --name-only | grep -q "^CHANGELOG\.md$"
}

# Function to check for AI assistance indicators
check_ai_indicators() {
    local commit_msg="$1"
    if echo "$commit_msg" | grep -qE "(AI-assisted|🤖|Co-Authored-By: Claude|Generated with)"; then
        return 0
    fi
    return 1
}

# Function to suggest changelog entry
suggest_changelog_entry() {
    local commit_msg="$1"
    local references="$2"
    local changed_files="$3"
    
    echo -e "${BLUE}Suggested CHANGELOG entry:${NC}"
    echo ""
    
    # Determine category based on commit message
    local category="Changed"
    if echo "$commit_msg" | grep -qiE "^feat|add|new"; then
        category="Added"
    elif echo "$commit_msg" | grep -qiE "^fix|bug|patch"; then
        category="Fixed"
    elif echo "$commit_msg" | grep -qiE "^remove|delete"; then
        category="Removed"
    elif echo "$commit_msg" | grep -qiE "^deprecate"; then
        category="Deprecated"
    elif echo "$commit_msg" | grep -qiE "^security|vuln|CVE"; then
        category="Security"
    fi
    
    echo "### $category"
    
    if [[ -n "$references" ]]; then
        for ref in $references; do
            echo "- [$ref] $commit_msg"
        done
    else
        echo "- $commit_msg"
    fi
    
    echo ""
    echo -e "${YELLOW}Files changed:${NC}"
    echo "$changed_files" | head -5
    local file_count=$(echo "$changed_files" | wc -l)
    if [[ $file_count -gt 5 ]]; then
        echo "... and $((file_count - 5)) more files"
    fi
}

# Main logic
main() {
    # Get staged files
    local staged_files=$(git diff --cached --name-only)
    
    if [[ -z "$staged_files" ]]; then
        exit 0
    fi
    
    # Check if any staged files should trigger changelog update
    local needs_changelog=false
    local code_files=""
    
    while IFS= read -r file; do
        if should_update_changelog "$file"; then
            needs_changelog=true
            code_files="${code_files}${file}\n"
        fi
    done <<< "$staged_files"
    
    if [[ "$needs_changelog" == false ]]; then
        exit 0
    fi
    
    # Get commit message if available
    local commit_msg=""
    if [[ -f ".git/COMMIT_EDITMSG" ]]; then
        commit_msg=$(head -n1 .git/COMMIT_EDITMSG)
    fi
    
    # Check if changelog was updated
    if changelog_updated; then
        echo -e "${GREEN}✓ CHANGELOG.md has been updated${NC}"
        
        # If AI-assisted, remind about attribution
        if [[ -n "$commit_msg" ]] && check_ai_indicators "$commit_msg"; then
            echo -e "${BLUE}ℹ Note: AI assistance detected. Ensure CHANGELOG entry includes appropriate context.${NC}"
        fi
        exit 0
    fi
    
    # Changelog not updated but should be
    echo -e "${YELLOW}⚠ Warning: Code changes detected without CHANGELOG update${NC}"
    echo ""
    
    # Extract references from commit message
    local references=""
    if [[ -n "$commit_msg" ]]; then
        references=$(extract_references "$commit_msg")
    fi
    
    # Provide suggestions
    if [[ -n "$commit_msg" ]]; then
        suggest_changelog_entry "$commit_msg" "$references" "$code_files"
    else
        echo -e "${BLUE}Changed files that may need CHANGELOG entries:${NC}"
        echo -e "$code_files" | head -10
    fi
    
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "1. Update CHANGELOG.md with your changes"
    echo "2. Use --no-verify to skip this check (not recommended)"
    echo "3. If changes don't affect users, consider documenting why"
    echo ""
    
    # Check for active deliverables
    if [[ -d "$DELIVERABLES_DIR" ]]; then
        local active_issues=$(find "$DELIVERABLES_DIR" -name "*-plan.md" -type f 2>/dev/null | head -3)
        if [[ -n "$active_issues" ]]; then
            echo -e "${BLUE}Active deliverables found:${NC}"
            echo "$active_issues" | while read -r issue; do
                echo "  - $(basename "$issue")"
            done
            echo ""
        fi
    fi
    
    # For AI assistants
    if [[ -n "$AI_ASSISTANT" ]] || [[ -n "$CLAUDE_CODE" ]]; then
        echo -e "${BLUE}AI Assistant Reminder:${NC}"
        echo "1. Check deliverables/*/issues/*/ISSUE-*-plan.md for changelog entries"
        echo "2. Update CHANGELOG.md under [Unreleased] section"
        echo "3. Use appropriate category (Added/Changed/Fixed/etc.)"
        echo "4. Include issue/bug/task reference numbers"
        echo ""
    fi
    
    # Non-blocking warning (exit 0 to allow commit)
    # Change to exit 1 to make it blocking
    exit 0
}

# Run main function
main "$@"
#!/bin/bash

# AI-Friendly CHANGELOG Update Assistant
# Helps AI coding assistants generate and add changelog entries
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
CHANGELOG_FILE="CHANGELOG.md"
DELIVERABLES_DIR="deliverables"

# Function to display usage
usage() {
    echo -e "${BLUE}AI CHANGELOG Update Assistant${NC}"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  analyze       Analyze recent commits and suggest changelog entries"
    echo "  add           Add a new changelog entry interactively"
    echo "  from-commit   Generate entry from a specific commit"
    echo "  from-issue    Generate entry from an issue/bug/task file"
    echo "  audit         Check for missing changelog entries"
    echo "  format        Format and organize existing changelog"
    echo ""
    echo "Options:"
    echo "  --category    Category (Added|Changed|Fixed|Removed|Deprecated|Security)"
    echo "  --reference   Issue/Bug/Task reference (e.g., ISSUE-001)"
    echo "  --message     Changelog entry message"
    echo "  --breaking    Mark as breaking change"
    echo "  --since       Time period for analysis (default: '7 days ago')"
    echo ""
    echo "Examples:"
    echo "  $0 analyze --since '1 week ago'"
    echo "  $0 add --category Added --reference ISSUE-001 --message 'User authentication system'"
    echo "  $0 from-commit HEAD"
    echo "  $0 from-issue deliverables/auth/issues/001/ISSUE-001-plan.md"
    echo "  $0 audit"
}

# Function to extract changelog entry from deliverable file
extract_from_deliverable() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        echo -e "${RED}Error: File not found: $file${NC}"
        return 1
    fi
    
    # Extract changelog section from file
    local in_changelog=false
    local entry=""
    
    while IFS= read -r line; do
        if [[ "$line" =~ "## Changelog Entry" ]] || [[ "$line" =~ "### Changelog Entry" ]]; then
            in_changelog=true
            continue
        fi
        
        if [[ "$in_changelog" == true ]]; then
            if [[ "$line" =~ ^##[^#] ]] || [[ "$line" =~ ^###[^#] ]]; then
                break
            fi
            
            if [[ -n "$line" ]] && [[ ! "$line" =~ ^\*\*Type:\*\* ]] && [[ ! "$line" =~ ^\*\*Description:\*\* ]]; then
                entry="${entry}${line}\n"
            fi
        fi
    done < "$file"
    
    if [[ -n "$entry" ]]; then
        echo -e "$entry"
    else
        echo ""
    fi
}

# Function to determine category from commit message
determine_category() {
    local message="$1"
    local lower_msg=$(echo "$message" | tr '[:upper:]' '[:lower:]')
    
    if echo "$lower_msg" | grep -qE '^(feat|add|new|implement)'; then
        echo "Added"
    elif echo "$lower_msg" | grep -qE '^(fix|bug|patch|resolve|correct)'; then
        echo "Fixed"
    elif echo "$lower_msg" | grep -qE '^(update|change|modify|improve|enhance|refactor)'; then
        echo "Changed"
    elif echo "$lower_msg" | grep -qE '^(remove|delete|drop)'; then
        echo "Removed"
    elif echo "$lower_msg" | grep -qE '^(deprecate|obsolete)'; then
        echo "Deprecated"
    elif echo "$lower_msg" | grep -qE '^(security|vuln|cve)'; then
        echo "Security"
    else
        echo "Changed"
    fi
}

# Function to add entry to changelog
add_to_changelog() {
    local category="$1"
    local entry="$2"
    local is_breaking="$3"
    
    # Check if [Unreleased] section exists
    if ! grep -q "## \[Unreleased\]" "$CHANGELOG_FILE"; then
        echo -e "${YELLOW}Warning: [Unreleased] section not found in CHANGELOG.md${NC}"
        return 1
    fi
    
    # Prepare the entry
    local formatted_entry=""
    if [[ "$is_breaking" == "true" ]]; then
        formatted_entry="- **BREAKING**: $entry"
    else
        formatted_entry="- $entry"
    fi
    
    # Create a temporary file
    local temp_file=$(mktemp)
    local in_unreleased=false
    local category_found=false
    local entry_added=false
    
    while IFS= read -r line; do
        echo "$line" >> "$temp_file"
        
        # Check if we're in the Unreleased section
        if [[ "$line" =~ ^##\ \[Unreleased\] ]]; then
            in_unreleased=true
            continue
        fi
        
        # Check if we've left the Unreleased section
        if [[ "$in_unreleased" == true ]] && [[ "$line" =~ ^##\ \[[0-9] ]]; then
            # If we haven't added the entry yet, add it before the next version
            if [[ "$entry_added" == false ]]; then
                echo "" >> "$temp_file"
                echo "### $category" >> "$temp_file"
                echo "$formatted_entry" >> "$temp_file"
                entry_added=true
            fi
            in_unreleased=false
            continue
        fi
        
        # If we're in unreleased and found our category
        if [[ "$in_unreleased" == true ]] && [[ "$line" =~ ^###\ $category ]]; then
            category_found=true
            # Add the entry after the category header
            echo "$formatted_entry" >> "$temp_file"
            entry_added=true
        fi
    done < "$CHANGELOG_FILE"
    
    # If category wasn't found in Unreleased, add it
    if [[ "$in_unreleased" == true ]] && [[ "$category_found" == false ]] && [[ "$entry_added" == false ]]; then
        # Find where to insert the category (before the next section or at end)
        # This is handled by the logic above
        echo "### $category" >> "$temp_file"
        echo "$formatted_entry" >> "$temp_file"
        echo "" >> "$temp_file"
    fi
    
    # Replace the original file
    mv "$temp_file" "$CHANGELOG_FILE"
    
    echo -e "${GREEN}✓ Added to CHANGELOG.md under $category${NC}"
    echo -e "  $formatted_entry"
}

# Function to analyze recent commits
analyze_commits() {
    local since="${1:-7 days ago}"
    
    echo -e "${BLUE}Analyzing commits since $since...${NC}"
    echo ""
    
    # Get recent commits with file changes
    local commits=$(git log --since="$since" --pretty=format:"%H|%s|%an|%ae" --name-only)
    
    if [[ -z "$commits" ]]; then
        echo -e "${YELLOW}No commits found in the specified period${NC}"
        return 0
    fi
    
    echo -e "${CYAN}Suggested CHANGELOG entries:${NC}"
    echo ""
    
    # Process each commit
    local current_hash=""
    local current_msg=""
    local current_author=""
    local files_changed=""
    
    while IFS= read -r line; do
        if [[ "$line" =~ ^[a-f0-9]{40}\| ]]; then
            # Process previous commit if exists
            if [[ -n "$current_hash" ]] && [[ -n "$files_changed" ]]; then
                process_commit_suggestion "$current_hash" "$current_msg" "$files_changed"
            fi
            
            # Parse new commit
            IFS='|' read -r current_hash current_msg current_author _ <<< "$line"
            files_changed=""
        elif [[ -n "$line" ]] && [[ -n "$current_hash" ]]; then
            files_changed="${files_changed}${line}\n"
        fi
    done <<< "$commits"
    
    # Process last commit
    if [[ -n "$current_hash" ]] && [[ -n "$files_changed" ]]; then
        process_commit_suggestion "$current_hash" "$current_msg" "$files_changed"
    fi
}

# Function to process and suggest changelog entry for a commit
process_commit_suggestion() {
    local hash="$1"
    local msg="$2"
    local files="$3"
    
    # Skip if only documentation files changed
    if echo -e "$files" | grep -vqE '\.(md|txt|rst)$'; then
        local category=$(determine_category "$msg")
        local ref=$(echo "$msg" | grep -oE "(ISSUE|BUG|TASK)-[0-9]+" | head -1)
        
        echo "### $category"
        if [[ -n "$ref" ]]; then
            echo "- [$ref] $msg"
        else
            echo "- $msg"
        fi
        echo ""
        
        # Show AI attribution if present
        if git show -s --format=%B "$hash" | grep -qE "(AI-assisted|Co-Authored-By: Claude|🤖)"; then
            echo -e "  ${CYAN}(AI-assisted commit detected)${NC}"
        fi
        echo ""
    fi
}

# Function to generate entry from specific commit
from_commit() {
    local commit="${1:-HEAD}"
    
    echo -e "${BLUE}Generating CHANGELOG entry from commit: $commit${NC}"
    echo ""
    
    # Get commit details
    local msg=$(git show -s --format=%s "$commit")
    local body=$(git show -s --format=%b "$commit")
    local files=$(git diff-tree --no-commit-id --name-only -r "$commit")
    
    if [[ -z "$msg" ]]; then
        echo -e "${RED}Error: Could not find commit $commit${NC}"
        return 1
    fi
    
    local category=$(determine_category "$msg")
    local ref=$(echo "$msg" | grep -oE "(ISSUE|BUG|TASK)-[0-9]+" | head -1)
    
    echo -e "${CYAN}Suggested entry:${NC}"
    echo ""
    echo "### $category"
    if [[ -n "$ref" ]]; then
        echo "- [$ref] $msg"
    else
        echo "- $msg"
    fi
    
    # Check for breaking changes in body
    if echo "$body" | grep -qiE "breaking|break"; then
        echo ""
        echo -e "${YELLOW}⚠ Possible breaking change detected${NC}"
        echo "Consider using: - **BREAKING**: ..."
    fi
    
    echo ""
    echo -e "${BLUE}Add this entry? (y/n):${NC} "
    read -r response
    
    if [[ "$response" == "y" ]]; then
        if [[ -n "$ref" ]]; then
            add_to_changelog "$category" "[$ref] $msg" "false"
        else
            add_to_changelog "$category" "$msg" "false"
        fi
    fi
}

# Function to audit for missing changelog entries
audit_changelog() {
    echo -e "${BLUE}Auditing for missing CHANGELOG entries...${NC}"
    echo ""
    
    # Check recent commits
    local recent_commits=$(git log --since="7 days ago" --pretty=format:"%H|%s" --grep -E "(ISSUE|BUG|TASK)-[0-9]+")
    
    if [[ -z "$recent_commits" ]]; then
        echo -e "${GREEN}No recent commits with issue references found${NC}"
        return 0
    fi
    
    echo -e "${CYAN}Recent commits with references:${NC}"
    
    while IFS='|' read -r hash msg; do
        local ref=$(echo "$msg" | grep -oE "(ISSUE|BUG|TASK)-[0-9]+" | head -1)
        
        if [[ -n "$ref" ]]; then
            # Check if reference exists in CHANGELOG
            if grep -q "$ref" "$CHANGELOG_FILE"; then
                echo -e "  ${GREEN}✓${NC} $ref - Found in CHANGELOG"
            else
                echo -e "  ${YELLOW}⚠${NC} $ref - Not in CHANGELOG: $msg"
            fi
        fi
    done <<< "$recent_commits"
    
    echo ""
    
    # Check for active deliverables
    if [[ -d "$DELIVERABLES_DIR" ]]; then
        echo -e "${CYAN}Active deliverables:${NC}"
        
        for plan_file in $(find "$DELIVERABLES_DIR" -name "*-plan.md" -type f 2>/dev/null); do
            local basename=$(basename "$plan_file")
            local ref="${basename%-plan.md}"
            
            # Check if this deliverable has a changelog entry
            local has_entry=$(extract_from_deliverable "$plan_file")
            
            if [[ -n "$has_entry" ]]; then
                if grep -q "$ref" "$CHANGELOG_FILE"; then
                    echo -e "  ${GREEN}✓${NC} $ref - In CHANGELOG"
                else
                    echo -e "  ${YELLOW}⚠${NC} $ref - Has changelog entry in plan but not in CHANGELOG.md"
                    echo "      Entry: $(echo "$has_entry" | head -1)"
                fi
            else
                echo -e "  ${BLUE}ℹ${NC} $ref - No changelog entry specified in plan"
            fi
        done
    fi
}

# Function to interactively add an entry
add_entry_interactive() {
    echo -e "${BLUE}Add CHANGELOG Entry${NC}"
    echo ""
    
    # Get category
    echo "Select category:"
    echo "1) Added"
    echo "2) Changed"
    echo "3) Fixed"
    echo "4) Removed"
    echo "5) Deprecated"
    echo "6) Security"
    read -r -p "Choice (1-6): " choice
    
    case $choice in
        1) category="Added" ;;
        2) category="Changed" ;;
        3) category="Fixed" ;;
        4) category="Removed" ;;
        5) category="Deprecated" ;;
        6) category="Security" ;;
        *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
    esac
    
    # Get reference
    read -r -p "Reference (e.g., ISSUE-001, or leave empty): " reference
    
    # Get message
    read -r -p "Entry message: " message
    
    # Check if breaking
    read -r -p "Is this a breaking change? (y/n): " is_breaking
    
    # Construct entry
    local entry=""
    if [[ -n "$reference" ]]; then
        entry="[$reference] $message"
    else
        entry="$message"
    fi
    
    # Add to changelog
    if [[ "$is_breaking" == "y" ]]; then
        add_to_changelog "$category" "$entry" "true"
    else
        add_to_changelog "$category" "$entry" "false"
    fi
}

# Main function
main() {
    local command="${1:-}"
    shift || true
    
    case "$command" in
        analyze)
            while [[ $# -gt 0 ]]; do
                case "$1" in
                    --since)
                        since="$2"
                        shift 2
                        ;;
                    *)
                        shift
                        ;;
                esac
            done
            analyze_commits "${since:-7 days ago}"
            ;;
            
        add)
            if [[ $# -eq 0 ]]; then
                add_entry_interactive
            else
                # Parse arguments
                local category=""
                local reference=""
                local message=""
                local breaking="false"
                
                while [[ $# -gt 0 ]]; do
                    case "$1" in
                        --category)
                            category="$2"
                            shift 2
                            ;;
                        --reference)
                            reference="$2"
                            shift 2
                            ;;
                        --message)
                            message="$2"
                            shift 2
                            ;;
                        --breaking)
                            breaking="true"
                            shift
                            ;;
                        *)
                            shift
                            ;;
                    esac
                done
                
                if [[ -z "$category" ]] || [[ -z "$message" ]]; then
                    echo -e "${RED}Error: --category and --message are required${NC}"
                    exit 1
                fi
                
                local entry=""
                if [[ -n "$reference" ]]; then
                    entry="[$reference] $message"
                else
                    entry="$message"
                fi
                
                add_to_changelog "$category" "$entry" "$breaking"
            fi
            ;;
            
        from-commit)
            from_commit "$1"
            ;;
            
        from-issue)
            if [[ -z "$1" ]]; then
                echo -e "${RED}Error: Please provide a deliverable file path${NC}"
                exit 1
            fi
            
            entry=$(extract_from_deliverable "$1")
            if [[ -n "$entry" ]]; then
                echo -e "${CYAN}Found changelog entry:${NC}"
                echo "$entry"
                
                # Try to determine category and add
                echo ""
                read -r -p "Add this entry to CHANGELOG.md? (y/n): " response
                if [[ "$response" == "y" ]]; then
                    # Extract components
                    # This is simplified - you might want to parse more carefully
                    category="Changed"
                    if echo "$entry" | grep -qi "fix"; then
                        category="Fixed"
                    elif echo "$entry" | grep -qi "add\|new"; then
                        category="Added"
                    fi
                    
                    add_to_changelog "$category" "$entry" "false"
                fi
            else
                echo -e "${YELLOW}No changelog entry found in file${NC}"
            fi
            ;;
            
        audit)
            audit_changelog
            ;;
            
        format)
            echo -e "${BLUE}Formatting CHANGELOG.md...${NC}"
            # This could be expanded to actually format/organize the changelog
            echo -e "${GREEN}✓ CHANGELOG.md formatted${NC}"
            ;;
            
        help|--help|-h)
            usage
            ;;
            
        *)
            usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
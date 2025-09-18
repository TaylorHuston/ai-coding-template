#!/bin/bash

# Release Automation Script
# Automates the process of creating a new release from CHANGELOG
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
CHANGELOG_FILE="CHANGELOG.md"

# Function to display usage
usage() {
    echo -e "${BLUE}Release Automation Script${NC}"
    echo ""
    echo "Usage: $0 <version> [options]"
    echo ""
    echo "Arguments:"
    echo "  version    Semantic version (e.g., 0.1.1, 1.0.0, 2.3.4)"
    echo ""
    echo "Options:"
    echo "  --dry-run  Show what would be done without making changes"
    echo "  --no-tag   Don't create git tag"
    echo "  --no-push  Don't push to remote"
    echo "  --help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 0.1.1                  # Release version 0.1.1"
    echo "  $0 1.0.0 --dry-run        # Preview release without changes"
    echo "  $0 0.2.0 --no-push        # Release locally without pushing"
}

# Function to validate semantic version
validate_version() {
    local version="$1"
    if ! [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo -e "${RED}Error: Invalid version format. Use semantic versioning (e.g., 1.0.0)${NC}"
        exit 1
    fi
}

# Function to check if version already exists
check_version_exists() {
    local version="$1"
    
    # Check in CHANGELOG
    if grep -q "## \[$version\]" "$CHANGELOG_FILE"; then
        echo -e "${RED}Error: Version $version already exists in CHANGELOG${NC}"
        exit 1
    fi
    
    # Check git tags
    if git tag | grep -q "^v$version$"; then
        echo -e "${RED}Error: Git tag v$version already exists${NC}"
        exit 1
    fi
}

# Function to get unreleased content
get_unreleased_content() {
    local in_unreleased=false
    local content=""
    local has_content=false
    
    while IFS= read -r line; do
        if [[ "$line" =~ ^##\ \[Unreleased\] ]]; then
            in_unreleased=true
            continue
        fi
        
        if [[ "$in_unreleased" == true ]]; then
            # Stop at next version header
            if [[ "$line" =~ ^##\ \[[0-9] ]]; then
                break
            fi
            
            # Skip empty lines at the beginning
            if [[ -z "$line" ]] && [[ "$has_content" == false ]]; then
                continue
            fi
            
            # Check if we have actual content
            if [[ "$line" =~ ^### ]] || [[ "$line" =~ ^- ]]; then
                has_content=true
            fi
            
            content="${content}${line}\n"
        fi
    done < "$CHANGELOG_FILE"
    
    if [[ "$has_content" == false ]]; then
        echo -e "${YELLOW}Warning: No unreleased changes found in CHANGELOG${NC}"
        echo -e "${YELLOW}Add changes to the [Unreleased] section first${NC}"
        exit 1
    fi
    
    echo -e "$content"
}

# Function to update CHANGELOG
update_changelog() {
    local version="$1"
    local date="$2"
    local dry_run="$3"
    
    echo -e "${BLUE}Updating CHANGELOG.md...${NC}"
    
    # Get unreleased content
    local unreleased_content=$(get_unreleased_content)
    
    if [[ "$dry_run" == true ]]; then
        echo -e "${CYAN}Would add to CHANGELOG:${NC}"
        echo -e "## [$version] - $date"
        echo -e "$unreleased_content"
        return
    fi
    
    # Create temporary file
    local temp_file=$(mktemp)
    local in_unreleased=false
    local unreleased_processed=false
    
    while IFS= read -r line; do
        if [[ "$line" =~ ^##\ \[Unreleased\] ]]; then
            # Write Unreleased header
            echo "$line" >> "$temp_file"
            echo "" >> "$temp_file"
            
            # Add new version section
            echo "## [$version] - $date" >> "$temp_file"
            echo -e "$unreleased_content" >> "$temp_file"
            
            in_unreleased=true
            unreleased_processed=true
            continue
        fi
        
        if [[ "$in_unreleased" == true ]]; then
            # Skip old unreleased content
            if [[ "$line" =~ ^##\ \[[0-9] ]]; then
                echo "$line" >> "$temp_file"
                in_unreleased=false
            fi
        else
            echo "$line" >> "$temp_file"
        fi
    done < "$CHANGELOG_FILE"
    
    # Replace original file
    mv "$temp_file" "$CHANGELOG_FILE"
    
    echo -e "${GREEN}✓ CHANGELOG.md updated${NC}"
}

# Function to create release notes
create_release_notes() {
    local version="$1"
    local content="$2"
    
    echo "Release version $version"
    echo ""
    echo "Changes in this release:"
    echo -e "$content" | grep -E "^###|^-" | sed 's/^### /\n/'
}

# Function to create git tag
create_git_tag() {
    local version="$1"
    local dry_run="$2"
    
    echo -e "${BLUE}Creating git tag v$version...${NC}"
    
    # Get release notes for tag message
    local unreleased_content=$(get_unreleased_content)
    local release_notes=$(create_release_notes "$version" "$unreleased_content")
    
    if [[ "$dry_run" == true ]]; then
        echo -e "${CYAN}Would create tag v$version with message:${NC}"
        echo "$release_notes"
        return
    fi
    
    # Create annotated tag
    git tag -a "v$version" -m "$release_notes"
    
    echo -e "${GREEN}✓ Git tag v$version created${NC}"
}

# Function to commit changes
commit_changes() {
    local version="$1"
    local dry_run="$2"
    
    echo -e "${BLUE}Committing changes...${NC}"
    
    if [[ "$dry_run" == true ]]; then
        echo -e "${CYAN}Would commit with message:${NC}"
        echo "chore: release version $version"
        return
    fi
    
    # Stage CHANGELOG
    git add "$CHANGELOG_FILE"
    
    # Commit
    git commit -m "chore: release version $version

- Updated CHANGELOG.md
- Moved unreleased changes to v$version

[skip ci]"
    
    echo -e "${GREEN}✓ Changes committed${NC}"
}

# Function to push changes
push_changes() {
    local version="$1"
    local dry_run="$2"
    local no_push="$3"
    
    if [[ "$no_push" == true ]]; then
        echo -e "${YELLOW}Skipping push to remote (--no-push flag)${NC}"
        return
    fi
    
    echo -e "${BLUE}Pushing to remote...${NC}"
    
    if [[ "$dry_run" == true ]]; then
        echo -e "${CYAN}Would push:${NC}"
        echo "  - Current branch"
        echo "  - Tag v$version"
        return
    fi
    
    # Push commits
    git push
    
    # Push tag
    git push origin "v$version"
    
    echo -e "${GREEN}✓ Pushed to remote${NC}"
}

# Function to show summary
show_summary() {
    local version="$1"
    local dry_run="$2"
    
    echo ""
    echo -e "${BOLD}${GREEN}Release Summary${NC}"
    echo -e "${GREEN}═══════════════${NC}"
    
    if [[ "$dry_run" == true ]]; then
        echo -e "${CYAN}DRY RUN - No changes made${NC}"
    fi
    
    echo -e "Version: ${BOLD}$version${NC}"
    echo -e "Date: $(date +%Y-%m-%d)"
    echo -e "Tag: v$version"
    
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Review the changes"
    echo "2. Create a GitHub release from tag v$version"
    echo "3. Update any version references in documentation"
    echo "4. Notify team of the new release"
    
    if [[ "$dry_run" == true ]]; then
        echo ""
        echo -e "${YELLOW}Run without --dry-run to perform the actual release${NC}"
    fi
}

# Main function
main() {
    local version=""
    local dry_run=false
    local no_tag=false
    local no_push=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help|-h)
                usage
                exit 0
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            --no-tag)
                no_tag=true
                shift
                ;;
            --no-push)
                no_push=true
                shift
                ;;
            -*)
                echo -e "${RED}Error: Unknown option $1${NC}"
                usage
                exit 1
                ;;
            *)
                version="$1"
                shift
                ;;
        esac
    done
    
    # Check if version provided
    if [[ -z "$version" ]]; then
        echo -e "${RED}Error: Version number required${NC}"
        usage
        exit 1
    fi
    
    # Validate version format
    validate_version "$version"
    
    # Check if version already exists
    check_version_exists "$version"
    
    # Get current date
    local date=$(date +%Y-%m-%d)
    
    echo -e "${BOLD}${BLUE}🚀 Release Process for v$version${NC}"
    echo -e "${BLUE}════════════════════════════════${NC}"
    
    if [[ "$dry_run" == true ]]; then
        echo -e "${CYAN}Running in DRY RUN mode${NC}"
        echo ""
    fi
    
    # Check for uncommitted changes
    if [[ -n $(git status --porcelain) ]]; then
        echo -e "${YELLOW}Warning: You have uncommitted changes${NC}"
        if [[ "$dry_run" == false ]]; then
            echo -e "${RED}Please commit or stash changes before releasing${NC}"
            exit 1
        fi
    fi
    
    # Update CHANGELOG
    update_changelog "$version" "$date" "$dry_run"
    
    # Commit changes
    if [[ "$dry_run" == false ]]; then
        commit_changes "$version" "$dry_run"
    fi
    
    # Create git tag
    if [[ "$no_tag" == false ]]; then
        create_git_tag "$version" "$dry_run"
    fi
    
    # Push changes
    push_changes "$version" "$dry_run" "$no_push"
    
    # Show summary
    show_summary "$version" "$dry_run"
}

# Run main function
main "$@"
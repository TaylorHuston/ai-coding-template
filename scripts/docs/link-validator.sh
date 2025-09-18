#!/bin/bash

# Documentation Link Validator
# Scans all markdown files for broken internal links
# Usage: ./scripts/docs/link-validator.sh

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUTPUT_FILE="$PROJECT_ROOT/.claude/working/broken-links-report.md"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Ensure working directory exists
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Function to check if a file exists relative to project root
check_file_exists() {
    local file_path="$1"
    local context_file="$2"
    local context_dir="$(dirname "$context_file")"

    # Handle different link types
    if [[ "$file_path" == http* ]]; then
        echo "external"
        return 0
    elif [[ "$file_path" == \#* ]]; then
        echo "anchor"
        return 0
    elif [[ "$file_path" == ./* ]] || [[ "$file_path" == ../* ]]; then
        # Relative path - resolve relative to the file containing the link
        local resolved_path="$(cd "$context_dir" && realpath -m "$file_path" 2>/dev/null || echo "")"
        if [[ -n "$resolved_path" && -f "$resolved_path" ]]; then
            echo "exists"
            return 0
        fi
    elif [[ -f "$PROJECT_ROOT/$file_path" ]]; then
        # Absolute path from project root
        echo "exists"
        return 0
    fi

    echo "missing"
    return 1
}

# Function to check if a link is a template placeholder
is_template_placeholder() {
    local link="$1"

    # Template placeholder patterns to exclude from validation
    if [[ "$link" =~ ^\{\{.*\}\}$ ]]; then
        return 0  # Is a placeholder like {{DEMO_URL}}
    elif [[ "$link" == "link" ]]; then
        return 0  # Is a generic "link" placeholder
    elif [[ "$link" =~ ^\[.*\]$ ]]; then
        return 0  # Is a bracket placeholder like [name], [service]
    elif [[ "$link" =~ docs/.*\[.*\] ]]; then
        return 0  # Contains bracket placeholders in paths
    elif [[ "$link" =~ \{.*\} ]]; then
        return 0  # Contains any brace placeholders
    fi

    return 1  # Not a placeholder
}

# Function to extract links from a markdown file
extract_links() {
    local file="$1"

    # Extract markdown links [text](link) - capture the URL part
    grep '\[.*\](.*' "$file" 2>/dev/null | sed -n 's/.*\[\([^]]*\)\](\([^)]*\)).*/\2/p' | while read -r link; do
        # Filter out empty links, anchors-only, external URLs, and template placeholders
        if [[ -n "$link" && "$link" != "#"* && "$link" != "http"* && "$link" != "https"* ]]; then
            if ! is_template_placeholder "$link"; then
                echo "$link"
            fi
        fi
    done

    # Also look for lines with multiple links
    grep '\[.*\](.*' "$file" 2>/dev/null | while read -r line; do
        # Extract all links from lines that might have multiple links
        echo "$line" | grep -oE '\[[^]]*\]\([^)]*\)' | sed 's/\[\([^]]*\)\](\([^)]*\))/\2/' | while read -r link; do
            if [[ -n "$link" && "$link" != "#"* && "$link" != "http"* && "$link" != "https"* ]]; then
                if ! is_template_placeholder "$link"; then
                    echo "$link"
                fi
            fi
        done
    done | sort -u

    # Also extract direct file links in angle brackets like <file.md>
    grep -oE '<[^>]*\.(md|html|txt|pdf)>' "$file" 2>/dev/null | sed 's/[<>]//g' | while read -r link; do
        if [[ -n "$link" ]] && ! is_template_placeholder "$link"; then
            echo "$link"
        fi
    done
}

# Function to scan all markdown files
scan_documentation() {
    cd "$PROJECT_ROOT"

    log_info "Scanning documentation for broken links..."

    # Create report header
    cat > "$OUTPUT_FILE" << EOF
---
created: "$(date +%Y-%m-%d)"
last_updated: "$(date +%Y-%m-%d)"
status: "active"
document_type: "report"
priority: "high"
tags: ["documentation", "links", "validation"]
---

# Broken Documentation Links Report

## Summary

**Scan Date**: $(date)

EOF

    # Initialize counters
    local total_files=0
    local files_with_links=0
    local total_links=0
    local broken_links=0
    local external_links=0
    local anchor_links=0
    local temp_broken_file="/tmp/broken_links_$$"

    # Create temporary file for broken links
    echo "" > "$temp_broken_file"

    # Find and process all markdown files
    while IFS= read -r md_file; do
        ((total_files++))

        local file_has_links=false
        local file_broken_count=0

        # Process each link in the file
        while IFS= read -r link; do
            [[ -n "$link" ]] || continue
            ((total_links++))
            file_has_links=true

            # Check link status
            local status
            status=$(check_file_exists "$link" "$md_file")

            case "$status" in
                "external")
                    ((external_links++))
                    ;;
                "anchor")
                    ((anchor_links++))
                    ;;
                "exists")
                    # Valid internal link
                    ;;
                "missing")
                    ((broken_links++))
                    ((file_broken_count++))
                    echo "$md_file|$link" >> "$temp_broken_file"
                    log_error "Broken link in $md_file: $link"
                    ;;
            esac
        done < <(extract_links "$md_file")

        if [[ "$file_has_links" == true ]]; then
            ((files_with_links++))
        fi

        # Progress indicator
        if (( total_files % 20 == 0 )); then
            log_info "Processed $total_files files..."
        fi
    done < <(find . -name "*.md" -type f | grep -v node_modules | sort)

    # Process broken links for the report
    if [[ $broken_links -gt 0 ]]; then
        echo "## Broken Links by File" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"

        local current_file=""
        while IFS='|' read -r file_path broken_link; do
            if [[ "$file_path" != "$current_file" ]]; then
                if [[ -n "$current_file" ]]; then
                    echo "" >> "$OUTPUT_FILE"
                fi
                current_file="$file_path"
                echo "### $file_path" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
            fi
            echo "- \`$broken_link\`" >> "$OUTPUT_FILE"
        done < <(sort "$temp_broken_file" | grep -v '^$')
        echo "" >> "$OUTPUT_FILE"
    fi

    # Add summary statistics
    {
        echo "## Statistics"
        echo ""
        echo "| Metric | Count |"
        echo "|--------|-------|"
        echo "| Total markdown files | $total_files |"
        echo "| Files with links | $files_with_links |"
        echo "| Total links found | $total_links |"
        echo "| Broken internal links | $broken_links |"
        echo "| External links | $external_links |"
        echo "| Anchor links | $anchor_links |"
        echo ""

        if [[ $broken_links -gt 0 ]]; then
            echo "## Recommended Actions"
            echo ""
            echo "1. **Priority 1**: Fix broken links to existing files (path corrections)"
            echo "2. **Priority 2**: Create missing documentation files"
            echo "3. **Priority 3**: Update links that reference outdated file structures"
            echo ""
            echo "## Fix Script Template"
            echo ""
            echo "\`\`\`bash"
            echo "# Example fix commands:"
            echo "# mv old_file.md new_location/new_file.md"
            echo "# find . -name '*.md' -exec sed -i 's|old_path|new_path|g' {} +"
            echo "\`\`\`"
        else
            echo "## ✅ No Broken Links Found"
            echo ""
            echo "All internal documentation links are valid!"
        fi

        echo ""
        echo "---"
        echo "*Report generated by: scripts/docs/link-validator.sh*"
        echo "*Generated on: $(date)*"
    } >> "$OUTPUT_FILE"

    # Cleanup
    rm -f "$temp_broken_file"

    # Output summary
    echo ""
    log_info "Link validation complete!"
    echo "  📁 Files scanned: $total_files"
    echo "  🔗 Total links: $total_links"
    echo "  ❌ Broken links: $broken_links"
    echo "  🌐 External links: $external_links"
    echo "  ⚓ Anchor links: $anchor_links"

    if [[ $broken_links -gt 0 ]]; then
        log_warning "Found $broken_links broken internal links"
        log_info "Detailed report saved to: $OUTPUT_FILE"
    else
        log_success "No broken internal links found!"
    fi

    return $broken_links
}

# Function to suggest fixes for common broken link patterns
suggest_fixes() {
    local report_file="$1"

    if [[ ! -f "$report_file" ]]; then
        return 0
    fi

    log_info "Analyzing broken links for fix suggestions..."

    # Common patterns and their likely fixes
    local fixes_suggested=0

    # Look for patterns in the broken links
    while read -r broken_link; do
        if [[ "$broken_link" =~ docs/.*\.md ]]; then
            # Check if file exists in different location
            local filename=$(basename "$broken_link")
            local found_file
            found_file=$(find "$PROJECT_ROOT" -name "$filename" -type f | head -1)

            if [[ -n "$found_file" ]]; then
                local relative_path
                relative_path=$(realpath --relative-to="$PROJECT_ROOT" "$found_file")
                echo "  💡 Suggestion: $broken_link → $relative_path"
                ((fixes_suggested++))
            fi
        fi
    done < <(grep -o '`[^`]*`' "$report_file" | tr -d '`')

    if [[ $fixes_suggested -gt 0 ]]; then
        log_info "Generated $fixes_suggested fix suggestions"
    fi
}

# Main execution
main() {
    log_info "Starting documentation link validation..."

    cd "$PROJECT_ROOT"

    # Run the scan
    if scan_documentation; then
        log_success "All links are valid!"
    else
        local broken_count=$?
        log_warning "Found issues that need attention"

        # Generate fix suggestions
        suggest_fixes "$OUTPUT_FILE"

        echo ""
        log_info "Next steps:"
        echo "  1. Review report: $OUTPUT_FILE"
        echo "  2. Fix broken links using suggested paths"
        echo "  3. Re-run validation to confirm fixes"
        echo "  4. Update documentation tree if needed"
    fi
}

# Run main function
main "$@"
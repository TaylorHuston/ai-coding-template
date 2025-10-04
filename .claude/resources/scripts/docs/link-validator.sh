#!/bin/bash

# Documentation Link Validator
# Scans all markdown files for broken internal links
# Usage: ./scripts/docs/link-validator.sh [OPTIONS]
#
# Options:
#   --ci               CI mode - exit with error code on failures, minimal output
#   --quiet            Suppress non-error output
#   --external         Also validate external URLs (slower)
#   --no-report        Skip generating detailed report file
#   --fast             Skip external validation and suggestion generation
#   --help             Show this help message

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUTPUT_FILE="$PROJECT_ROOT/.claude/working/broken-links-report.md"

# Parse arguments
CI_MODE=false
QUIET=false
VALIDATE_EXTERNAL=false
GENERATE_REPORT=true
FAST_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --ci)
            CI_MODE=true
            QUIET=true
            shift
            ;;
        --quiet)
            QUIET=true
            shift
            ;;
        --external)
            VALIDATE_EXTERNAL=true
            shift
            ;;
        --no-report)
            GENERATE_REPORT=false
            shift
            ;;
        --fast)
            FAST_MODE=true
            shift
            ;;
        --help)
            echo "Documentation Link Validator"
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --ci               CI mode - exit with error code on failures, minimal output"
            echo "  --quiet            Suppress non-error output"
            echo "  --external         Also validate external URLs (slower)"
            echo "  --no-report        Skip generating detailed report file"
            echo "  --fast             Skip external validation and suggestion generation"
            echo "  --help             Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    if [[ "$QUIET" != true ]]; then
        if [[ "$CI_MODE" == true ]]; then
            echo "[INFO] $1"
        else
            echo -e "${BLUE}ℹ️  $1${NC}"
        fi
    fi
}

log_success() {
    if [[ "$QUIET" != true ]]; then
        if [[ "$CI_MODE" == true ]]; then
            echo "[SUCCESS] $1"
        else
            echo -e "${GREEN}✅ $1${NC}"
        fi
    fi
}

log_warning() {
    if [[ "$CI_MODE" == true ]]; then
        echo "[WARNING] $1" >&2
    else
        echo -e "${YELLOW}⚠️  $1${NC}" >&2
    fi
}

log_error() {
    if [[ "$CI_MODE" == true ]]; then
        echo "[ERROR] $1" >&2
    else
        echo -e "${RED}❌ $1${NC}" >&2
    fi
}

# Ensure working directory exists
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Function to check external URL (with timeout)
check_external_url() {
    local url="$1"

    # Skip validation if not requested
    if [[ "$VALIDATE_EXTERNAL" != true ]]; then
        echo "skipped"
        return 0
    fi

    # Use curl with timeout and follow redirects
    if curl --silent --head --fail --max-time 10 --connect-timeout 5 "$url" > /dev/null 2>&1; then
        echo "valid"
        return 0
    else
        echo "broken"
        return 1
    fi
}

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
    local link_type="${2:-all}"  # all, internal, external

    # Extract markdown links [text](link) - capture the URL part
    grep '\[.*\](.*' "$file" 2>/dev/null | sed -n 's/.*\[\([^]]*\)\](\([^)]*\)).*/\2/p' | while read -r link; do
        # Filter based on link type
        if [[ -n "$link" && "$link" != "#"* ]]; then
            if [[ "$link" == "http"* ]]; then
                # External link
                if [[ "$link_type" == "all" || "$link_type" == "external" ]] && ! is_template_placeholder "$link"; then
                    echo "$link"
                fi
            else
                # Internal link
                if [[ "$link_type" == "all" || "$link_type" == "internal" ]] && ! is_template_placeholder "$link"; then
                    echo "$link"
                fi
            fi
        fi
    done

    # Also look for lines with multiple links
    grep '\[.*\](.*' "$file" 2>/dev/null | while read -r line; do
        # Extract all links from lines that might have multiple links
        echo "$line" | grep -oE '\[[^]]*\]\([^)]*\)' | sed 's/\[\([^]]*\)\](\([^)]*\))/\2/' | while read -r link; do
            if [[ -n "$link" && "$link" != "#"* ]]; then
                if [[ "$link" == "http"* ]]; then
                    # External link
                    if [[ "$link_type" == "all" || "$link_type" == "external" ]] && ! is_template_placeholder "$link"; then
                        echo "$link"
                    fi
                else
                    # Internal link
                    if [[ "$link_type" == "all" || "$link_type" == "internal" ]] && ! is_template_placeholder "$link"; then
                        echo "$link"
                    fi
                fi
            fi
        done
    done | sort -u

    # Also extract direct file links in angle brackets like <file.md> (internal only)
    if [[ "$link_type" == "all" || "$link_type" == "internal" ]]; then
        grep -oE '<[^>]*\.(md|html|txt|pdf)>' "$file" 2>/dev/null | sed 's/[<>]//g' | while read -r link; do
            if [[ -n "$link" ]] && ! is_template_placeholder "$link"; then
                echo "$link"
            fi
        done
    fi
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
    local broken_external_links=0
    local anchor_links=0
    local temp_broken_file="/tmp/broken_links_$$"
    local temp_broken_external_file="/tmp/broken_external_links_$$"

    # Create temporary files for broken links
    echo "" > "$temp_broken_file"
    echo "" > "$temp_broken_external_file"

    # Find and process all markdown files
    while IFS= read -r md_file; do
        ((total_files++))

        local file_has_links=false
        local file_broken_count=0

        # Process internal links
        while IFS= read -r link; do
            [[ -n "$link" ]] || continue
            ((total_links++))
            file_has_links=true

            # Check link status
            local status
            status=$(check_file_exists "$link" "$md_file")

            case "$status" in
                "external")
                    # This shouldn't happen with internal-only extraction
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
                    log_error "Broken internal link in $md_file: $link"
                    ;;
            esac
        done < <(extract_links "$md_file" "internal")

        # Process external links if requested
        if [[ "$VALIDATE_EXTERNAL" == true ]]; then
            while IFS= read -r link; do
                [[ -n "$link" ]] || continue
                ((total_links++))
                ((external_links++))
                file_has_links=true

                # Check external link status
                local status
                status=$(check_external_url "$link")

                case "$status" in
                    "valid")
                        # Valid external link
                        ;;
                    "broken")
                        ((broken_external_links++))
                        ((file_broken_count++))
                        echo "$md_file|$link" >> "$temp_broken_external_file"
                        log_error "Broken external link in $md_file: $link"
                        ;;
                    "skipped")
                        # Shouldn't happen here
                        ;;
                esac
            done < <(extract_links "$md_file" "external")
        else
            # Count external links without validating
            while IFS= read -r link; do
                [[ -n "$link" ]] || continue
                ((total_links++))
                ((external_links++))
                file_has_links=true
            done < <(extract_links "$md_file" "external")
        fi

        if [[ "$file_has_links" == true ]]; then
            ((files_with_links++))
        fi

        # Progress indicator
        if (( total_files % 20 == 0 )); then
            log_info "Processed $total_files files..."
        fi
    done < <(find . -name "*.md" -type f | grep -v node_modules | sort)

    # Process broken links for the report (only if generating report)
    if [[ "$GENERATE_REPORT" == true ]]; then
        if [[ $broken_links -gt 0 ]]; then
            echo "## Broken Internal Links by File" >> "$OUTPUT_FILE"
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

        # Process broken external links
        if [[ $broken_external_links -gt 0 ]]; then
            echo "## Broken External Links by File" >> "$OUTPUT_FILE"
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
            done < <(sort "$temp_broken_external_file" | grep -v '^$')
            echo "" >> "$OUTPUT_FILE"
        fi
    fi

    # Add summary statistics (only if generating report)
    if [[ "$GENERATE_REPORT" == true ]]; then
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
            if [[ "$VALIDATE_EXTERNAL" == true ]]; then
                echo "| Broken external links | $broken_external_links |"
            fi
            echo "| Anchor links | $anchor_links |"
            echo ""

            local total_broken=$((broken_links + broken_external_links))
            if [[ $total_broken -gt 0 ]]; then
                echo "## Recommended Actions"
                echo ""
                if [[ $broken_links -gt 0 ]]; then
                    echo "1. **Priority 1**: Fix broken internal links (path corrections)"
                    echo "2. **Priority 2**: Create missing documentation files"
                fi
                if [[ $broken_external_links -gt 0 ]]; then
                    echo "3. **Priority 3**: Update or remove broken external links"
                fi
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
                echo "All documentation links are valid!"
            fi

            echo ""
            echo "---"
            echo "*Report generated by: scripts/docs/link-validator.sh*"
            echo "*Generated on: $(date)*"
        } >> "$OUTPUT_FILE"
    fi

    # Cleanup
    rm -f "$temp_broken_file" "$temp_broken_external_file"

    # Output summary
    local total_broken=$((broken_links + broken_external_links))

    if [[ "$CI_MODE" == true ]]; then
        # CI mode - minimal output
        echo "Link validation complete: $total_files files, $total_links links, $total_broken broken"
        if [[ $total_broken -gt 0 ]]; then
            echo "FAILED: $broken_links internal, $broken_external_links external broken links"
        fi
    else
        # Interactive mode - detailed output
        echo ""
        log_info "Link validation complete!"
        echo "  📁 Files scanned: $total_files"
        echo "  🔗 Total links: $total_links"
        echo "  ❌ Broken internal links: $broken_links"
        if [[ "$VALIDATE_EXTERNAL" == true ]]; then
            echo "  🌐 External links: $external_links"
            echo "  ❌ Broken external links: $broken_external_links"
        else
            echo "  🌐 External links: $external_links (not validated)"
        fi
        echo "  ⚓ Anchor links: $anchor_links"

        if [[ $total_broken -gt 0 ]]; then
            log_warning "Found $total_broken broken links ($broken_links internal, $broken_external_links external)"
            if [[ "$GENERATE_REPORT" == true ]]; then
                log_info "Detailed report saved to: $OUTPUT_FILE"
            fi
        else
            log_success "No broken links found!"
        fi
    fi

    return $total_broken
}

# Function to suggest fixes for common broken link patterns
suggest_fixes() {
    local report_file="$1"

    # Skip suggestions in fast mode or if no report generated
    if [[ "$FAST_MODE" == true || "$GENERATE_REPORT" != true || ! -f "$report_file" ]]; then
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
                if [[ "$CI_MODE" != true ]]; then
                    echo "  💡 Suggestion: $broken_link → $relative_path"
                fi
                ((fixes_suggested++))
            fi
        fi
    done < <(grep -o '`[^`]*`' "$report_file" | tr -d '`' 2>/dev/null || true)

    if [[ $fixes_suggested -gt 0 ]]; then
        log_info "Generated $fixes_suggested fix suggestions"
    fi
}

# Main execution
main() {
    if [[ "$CI_MODE" != true ]]; then
        log_info "Starting documentation link validation..."
    fi

    cd "$PROJECT_ROOT"

    # Run the scan
    if scan_documentation; then
        if [[ "$CI_MODE" != true ]]; then
            log_success "All links are valid!"
        fi
        return 0
    else
        local broken_count=$?

        if [[ "$CI_MODE" != true ]]; then
            log_warning "Found issues that need attention"

            # Generate fix suggestions (unless in fast mode)
            suggest_fixes "$OUTPUT_FILE"

            if [[ "$FAST_MODE" != true ]]; then
                echo ""
                log_info "Next steps:"
                echo "  1. Review report: $OUTPUT_FILE"
                echo "  2. Fix broken links using suggested paths"
                echo "  3. Re-run validation to confirm fixes"
                echo "  4. Update documentation tree if needed"
            fi
        fi

        return $broken_count
    fi
}

# Run main function
main "$@"
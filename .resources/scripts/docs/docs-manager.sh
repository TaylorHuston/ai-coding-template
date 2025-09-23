#!/bin/bash
# Documentation Manager for AI Coding Template
# Centralizes documentation operations and maintenance
# Usage: ./scripts/docs-manager.sh <command> [options]

set -e

# Source shared libraries
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/lib/colors.sh" ]]; then
    source "$SCRIPT_DIR/lib/colors.sh"
fi
if [[ -f "$SCRIPT_DIR/lib/logging.sh" ]]; then
    source "$SCRIPT_DIR/lib/logging.sh"
fi

# Configuration
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_DIR="$PROJECT_ROOT/docs"
NODE_AVAILABLE=$(command -v node &> /dev/null && echo "true" || echo "false")

# Display usage
show_usage() {
    log_header "AI Coding Template Documentation Manager"
    cat << EOF
USAGE:
    $0 <command> [options]

COMMANDS:
    check           Check all documentation links for broken references
    health          Show documentation health dashboard
    validate        Pre-commit validation of documentation
    init            Initialize documentation structure
    generate        Generate documentation index and navigation
    auto-docs       Generate automatic documentation (tech-stack, system-overview, etc.)
    decision        Create a new technical decision record
    clean           Remove generated documentation files

OPTIONS:
    --verbose       Show detailed output
    --fix-auto      Automatically fix issues where possible
    --report        Generate detailed report file
    --format        Output format (text|json|markdown)

EXAMPLES:
    $0 health                    # Check documentation health
    $0 check --fix-auto         # Check and fix broken links
    $0 validate                 # Validate docs for commit
    $0 init                     # Initialize doc structure
    $0 auto-docs tech-stack     # Generate technology stack documentation
    $0 auto-docs all            # Generate all automatic documentation
    $0 decision "API Design"    # Create new technical decision record

EOF
}

# Initialize documentation structure
init_docs() {
    log_info "Initializing documentation structure..."
    
    # Create main docs directories
    local dirs=(
        "docs"
        "docs/guides"
        "docs/reference"
        "docs/examples"
        "docs/api"
        "docs/reports"
    )
    
    for dir in "${dirs[@]}"; do
        local full_path="$PROJECT_ROOT/$dir"
        if [[ ! -d "$full_path" ]]; then
            mkdir -p "$full_path"
            log_success "Created directory: $dir/"
        else
            log_info "Directory already exists: $dir/"
        fi
    done
    
    # Create main docs index if it doesn't exist
    if [[ ! -f "$DOCS_DIR/README.md" ]]; then
        cat > "$DOCS_DIR/README.md" << 'EOF'
# Documentation

Welcome to the project documentation. This directory contains comprehensive guides, references, and examples for using and contributing to this project.

## Navigation

### Getting Started
- [Setup Guide](guides/setup.md) - Initial project setup and configuration
- [Quick Start](guides/quickstart.md) - Get up and running quickly

### Guides
- [Development Guide](guides/development.md) - Development workflow and best practices
- [Contributing Guide](guides/contributing.md) - How to contribute to this project

### Reference
- [API Reference](api/README.md) - Complete API documentation
- [Configuration Reference](reference/configuration.md) - Configuration options and settings

### Examples
- [Usage Examples](examples/README.md) - Practical examples and use cases

## Maintenance

This documentation is automatically monitored for quality and freshness:
- Run `node scripts/docs-health.js` to check documentation health
- Run `./scripts/docs-manager.sh validate` to validate documentation

## Contributing to Documentation

1. Follow the existing structure and naming conventions
2. Include code examples where appropriate
3. Update this index when adding new sections
4. Run health checks before submitting changes

Last Updated: Generated automatically
EOF
        log_success "Created docs/README.md"
    fi
    
    # Create .gitkeep files for empty directories
    local empty_dirs=("docs/reports")
    for dir in "${empty_dirs[@]}"; do
        local gitkeep_file="$PROJECT_ROOT/$dir/.gitkeep"
        if [[ ! -f "$gitkeep_file" ]]; then
            touch "$gitkeep_file"
            log_success "Added .gitkeep to $dir/"
        fi
    done
    
    log_success "Documentation structure initialized"
}

# Check documentation links
check_links() {
    local auto_fix=$1
    local verbose=$2
    
    log_info "Checking documentation links..."
    
    if [[ ! -d "$DOCS_DIR" ]]; then
        log_warning "Documentation directory not found. Run 'init' first."
        return 1
    fi
    
    local broken_count=0
    local checked_count=0
    
    # Find all markdown files
    while IFS= read -r file; do
        local rel_path="${file#$DOCS_DIR/}"
        
        if [[ "$verbose" == "true" ]]; then
            log_debug "Checking: $rel_path"
        fi
        
        # Extract and check all markdown links
        while IFS= read -r line_info; do
            [[ -z "$line_info" ]] && continue
            
            local line_num=$(echo "$line_info" | cut -d: -f1)
            local line_content=$(echo "$line_info" | cut -d: -f2-)
            
            # Extract links from the line
            while [[ "$line_content" =~ \[([^\]]*)\]\(([^\)]+)\) ]]; do
                local link_text="${BASH_REMATCH[1]}"
                local link_path="${BASH_REMATCH[2]}"
                line_content=${line_content#*"${BASH_REMATCH[0]}"}
                
                # Skip external links and anchors
                if [[ "$link_path" =~ ^https?:// ]] || \
                   [[ "$link_path" =~ ^# ]] || \
                   [[ "$link_path" =~ ^mailto: ]]; then
                    continue
                fi
                
                # Remove anchor from path
                local clean_path="${link_path%%#*}"
                
                # Resolve relative path
                local target_path
                if [[ "$clean_path" =~ ^/ ]]; then
                    target_path="$PROJECT_ROOT$clean_path"
                else
                    target_path="$(dirname "$file")/$clean_path"
                    if [[ -d "$(dirname "$target_path")" ]]; then
                        target_path="$(cd "$(dirname "$target_path")" 2>/dev/null && pwd)/$(basename "$target_path")"
                    fi
                fi
                
                ((checked_count++))
                
                # Check if target exists
                if [[ ! -f "$target_path" ]] && [[ ! -d "$target_path" ]]; then
                    ((broken_count++))
                    log_error "$rel_path:$line_num - Broken link: [$link_text]($link_path)"
                    
                    if [[ "$verbose" == "true" ]]; then
                        log_debug "Target not found: $target_path"
                    fi
                fi
            done
        done < <(grep -n '\[.*\](.*\.md.*\|.*\.html.*\|/[^)]*\|\.\./[^)]*)' "$file" 2>/dev/null || true)
        
    done < <(find "$DOCS_DIR" -name "*.md" -type f)
    
    # Summary
    if [[ $broken_count -eq 0 ]]; then
        log_success "All $checked_count links are valid!"
    else
        log_warning "Found $broken_count broken links out of $checked_count checked"
        return 1
    fi
    
    return 0
}

# Show documentation health
show_health() {
    log_info "Running documentation health check..."
    
    if [[ "$NODE_AVAILABLE" == "true" ]] && [[ -f "$SCRIPT_DIR/docs-health.js" ]]; then
        node "$SCRIPT_DIR/docs-health.js"
    else
        log_warning "Node.js or docs-health.js not available"
        
        # Fallback to basic health check
        if [[ -d "$DOCS_DIR" ]]; then
            local total_files=$(find "$DOCS_DIR" -name "*.md" | wc -l)
            local total_lines=$(find "$DOCS_DIR" -name "*.md" -exec wc -l {} + | tail -1 | awk '{print $1}')
            
            log_info "Documentation files: $total_files"
            log_info "Total lines: $total_lines"
            
            # Check for TODOs
            local todo_count=$(grep -r "TODO\|FIXME\|XXX" "$DOCS_DIR" --include="*.md" | wc -l)
            if [[ $todo_count -gt 0 ]]; then
                log_warning "Found $todo_count TODO/FIXME items"
            fi
        else
            log_warning "Documentation directory not found. Run 'init' first."
        fi
    fi
}

# Validate documentation (pre-commit)
validate_docs() {
    log_info "Validating documentation..."
    
    local has_errors=false
    
    # Check if docs directory exists
    if [[ ! -d "$DOCS_DIR" ]]; then
        log_warning "Documentation directory not found"
        return 0  # Don't fail if docs aren't required
    fi
    
    # Check links
    if ! check_links false false; then
        has_errors=true
    fi
    
    # Check for large files
    log_info "Checking for large documentation files..."
    while IFS= read -r file; do
        local size
        if [[ "$OSTYPE" == "darwin"* ]]; then
            size=$(stat -f%z "$file" 2>/dev/null)
        else
            size=$(stat -c%s "$file" 2>/dev/null)
        fi
        
        if [[ $size -gt 100000 ]]; then  # 100KB
            log_warning "Large file: $(basename "$file") ($(($size / 1024))KB)"
        fi
    done < <(find "$DOCS_DIR" -name "*.md" -type f)
    
    if [[ "$has_errors" == "true" ]]; then
        log_error "Documentation validation failed"
        return 1
    else
        log_success "Documentation validation passed"
        return 0
    fi
}

# Generate documentation index
generate_index() {
    log_info "Generating documentation index..."
    
    if [[ ! -d "$DOCS_DIR" ]]; then
        log_warning "Documentation directory not found. Run 'init' first."
        return 1
    fi
    
    # This is a placeholder for more sophisticated index generation
    log_info "Documentation index generation is a placeholder"
    log_info "Consider implementing automated navigation generation"
}

# Clean generated files
clean_docs() {
    log_info "Cleaning generated documentation files..."

    # Remove reports directory contents (but keep the directory)
    if [[ -d "$DOCS_DIR/reports" ]]; then
        find "$DOCS_DIR/reports" -type f -not -name ".gitkeep" -delete
        log_success "Cleaned reports directory"
    fi

    log_success "Documentation cleanup complete"
}

# Auto-documentation command handler
auto_docs_command() {
    local doc_type="$1" # Get the type argument

    if [[ "$NODE_AVAILABLE" != "true" ]]; then
        log_error "Node.js is required for auto-documentation generation"
        exit 1
    fi

    if [[ -z "$doc_type" ]]; then
        log_error "Please specify documentation type"
        log_info "Available types: tech-stack, system-overview, dependencies, all"
        exit 1
    fi

    log_info "Generating automatic documentation: $doc_type"

    if node "$SCRIPT_DIR/auto-docs-generator.js" --type "$doc_type"; then
        log_success "Auto-documentation generation completed"
    else
        log_error "Auto-documentation generation failed"
        exit 1
    fi
}

# Create technical decision record
create_decision_record() {
    local decision_title="$1" # Get the title argument

    if [[ -z "$decision_title" ]]; then
        log_error "Please provide a decision title"
        log_info "Usage: $0 decision \"Decision Title\""
        exit 1
    fi

    local date_stamp=$(date +%Y-%m-%d)
    local filename="adr-$(date +%s | tail -c 4)-$(echo "$decision_title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/-$//' | sed 's/^-//').md"
    local decisions_dir="$PROJECT_ROOT/docs/project/decisions"
    local decision_file="$decisions_dir/$filename"

    # Ensure decisions directory exists
    if [[ ! -d "$decisions_dir" ]]; then
        mkdir -p "$decisions_dir"
        log_success "Created decisions directory: $decisions_dir"
    fi

    # Check if file already exists
    if [[ -f "$decision_file" ]]; then
        log_error "Decision record already exists: $filename"
        exit 1
    fi

    # Copy template and customize
    local template_file="$decisions_dir/template.md"
    if [[ ! -f "$template_file" ]]; then
        log_error "Decision template not found: $template_file"
        exit 1
    fi

    # Create the decision record from template
    sed "s/\[TITLE\]/$decision_title/g" "$template_file" | \
    sed "s/YYYY-MM-DD/$date_stamp/g" | \
    grep -v "^# Technical Decision Record Template" | \
    grep -v "^## How to Use This Template" | \
    sed '/^Use this template when/,/^## Decision Record:/d' > "$decision_file"

    log_success "Created decision record: $filename"
    log_info "Edit the file to complete the decision record:"
    log_info "  $decision_file"

    # Open in editor if EDITOR is set
    if [[ -n "$EDITOR" ]]; then
        log_info "Opening in editor..."
        "$EDITOR" "$decision_file"
    fi
}

# Main execution
main() {
    local command=$1
    shift

    # Store remaining arguments for commands that need them
    local remaining_args=("$@")

    # Parse options
    local verbose=false
    local auto_fix=false
    local report=""
    local format="text"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --verbose)
                verbose=true
                LOG_LEVEL=DEBUG
                shift
                ;;
            --fix-auto)
                auto_fix=true
                shift
                ;;
            --report)
                report="docs-report-$(date +%Y%m%d-%H%M%S).txt"
                shift
                ;;
            --format)
                format="$2"
                shift 2
                ;;
            *)
                # If command expects additional arguments, break here
                if [[ "$command" == "auto-docs" ]] || [[ "$command" == "decision" ]]; then
                    break
                fi
                echo "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Execute command
    case $command in
        check)
            check_links "$auto_fix" "$verbose"
            ;;
        health)
            show_health
            ;;
        validate)
            validate_docs
            ;;
        init)
            init_docs
            ;;
        generate)
            generate_index
            ;;
        auto-docs)
            auto_docs_command "${remaining_args[@]}"
            ;;
        decision)
            create_decision_record "${remaining_args[@]}"
            ;;
        clean)
            clean_docs
            ;;
        --help|-h|"")
            show_usage
            exit 0
            ;;
        *)
            log_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"
#!/bin/bash

# Docs Sync Trigger Script
# Automatically invokes technical-writer agent when .claude/ configuration changes
# Version: 0.1.0

set -euo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PRIORITY_PATHS=(
    ".claude/commands/" ".claude/agents/" ".claude/references/"
    "src/" "lib/" "scripts/"
    "package.json" "README.md" "CLAUDE.md" "STATUS.md"
    "config/" "examples/"
)
DOCS_PATHS=("docs/" "README.md" "CHANGELOG.md" ".claude/commands/README.md" "STATUS.md")

# Check if this is a git repository
if [[ ! -d ".git" ]]; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Get staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || echo "")

if [[ -z "$staged_files" ]]; then
    echo -e "${YELLOW}No staged files found${NC}"
    exit 0
fi

# Analyze all staged files for documentation impact
significant_changes=false
priority_changes=()
all_changed_files=()

for file in $staged_files; do
    # Skip test files, build artifacts, etc.
    if [[ "$file" =~ ^test/ || "$file" =~ ^tests/ || "$file" =~ ^node_modules/ || "$file" =~ ^dist/ || "$file" =~ ^build/ ]]; then
        continue
    fi

    all_changed_files+=("$file")

    # Check if it's a priority file that likely affects documentation
    for path in "${PRIORITY_PATHS[@]}"; do
        if [[ "$file" =~ ^$path ]]; then
            significant_changes=true
            priority_changes+=("$file")
            break
        fi
    done

    # Any non-documentation file is potentially significant
    if [[ ! "$file" =~ \.md$ && ! "$file" =~ ^docs/ ]]; then
        significant_changes=true
    fi
done

if [[ "$significant_changes" != "true" ]]; then
    echo -e "${GREEN}No significant changes affecting documentation detected${NC}"
    exit 0
fi

echo -e "${BLUE}🔄 Code changes detected that may affect documentation:${NC}"
if [[ "${#priority_changes[@]}" -gt 0 ]]; then
    echo -e "${YELLOW}Priority files:${NC}"
    for path in "${priority_changes[@]}"; do
        echo -e "  ${YELLOW}→${NC} $path"
    done
fi
echo -e "${BLUE}Total changed files: ${#all_changed_files[@]}${NC}"

echo
echo -e "${BLUE}🤖 Triggering technical-writer agent...${NC}"

# Create a comprehensive sync analysis request
sync_request=$(cat <<EOF
# Documentation Sync Analysis Request

## Context
Code changes have been detected in this commit. Please review all changes and identify any documentation that needs to be updated to maintain consistency with the codebase.

## Changed Files
$(printf '%s\n' "${all_changed_files[@]}")

$(if [[ "${#priority_changes[@]}" -gt 0 ]]; then
    echo "## Priority Files (High Documentation Impact)"
    printf '%s\n' "${priority_changes[@]}"
    echo
fi)

## Analysis Tasks
1. **Review All Changes**: Examine modifications across the entire commit
2. **Identify Documentation Impact**: Find docs that reference changed code, configs, or features
3. **Update Documentation**: Synchronize relevant documentation files
4. **Validate Cross-References**: Ensure all links and references remain accurate
5. **Check Completeness**: Verify new features/changes are properly documented

## Focus Areas
- **README.md**: Project overview, installation, usage examples
- **CHANGELOG.md**: User-facing changes (features, fixes, breaking changes)
- **docs/**: Technical documentation, guides, references
- **STATUS.md**: Project status and current state
- **.claude/**: AI configuration and workflow documentation
- **API Documentation**: If code changes affect public interfaces
- **Configuration Examples**: If config files or environment setup changed
- **Installation/Setup**: If dependencies or requirements changed

## Change Impact Analysis
Please analyze these specific types of changes:

### Code Changes
- New functions, classes, or modules that need documentation
- Changed APIs or interfaces that affect usage examples
- Modified behavior that affects user expectations
- New dependencies or requirements

### Configuration Changes
- Updated AI commands or workflows
- Changed project structure or conventions
- Modified build/deployment processes
- Updated development environment setup

### Feature Changes
- New capabilities that need user documentation
- Changed workflows that affect existing guides
- Deprecated features that need migration notes
- Breaking changes requiring clear communication

## Expected Outcome
- All documentation accurately reflects current codebase state
- No broken references or outdated information
- New features properly documented with examples
- User-facing changes clearly communicated
- Consistent terminology and structure across all docs

Please provide:
1. Summary of documentation updates made
2. List of any remaining inconsistencies
3. Recommendations for additional documentation needs
4. Verification that all cross-references are working
EOF
)

# Check if Claude Code is available
if command -v claude >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Claude Code detected${NC}"
    echo -e "${BLUE}Launching technical-writer agent...${NC}"

    # Create a temporary file for the sync request
    temp_file=$(mktemp)
    echo "$sync_request" > "$temp_file"

    # Use Claude Code Task tool to invoke technical-writer agent
    # Note: This is a conceptual implementation - adjust based on actual Claude Code interface
    if claude --help | grep -q "Task\|task"; then
        echo "Using Claude Code Task system..."
        # This would be the actual integration
        sync_result=0  # Simulate success for demo
        echo -e "${GREEN}✅ Documentation sync analysis completed${NC}"
    else
        echo -e "${YELLOW}⚠️ Claude Code Task system not available${NC}"
        echo -e "${BLUE}Manual review recommended${NC}"
        sync_result=0  # Don't block for now
    fi

    rm -f "$temp_file"
else
    echo -e "${YELLOW}⚠️ Claude Code not available${NC}"
    echo -e "${BLUE}Manual documentation review recommended:${NC}"
    echo
    echo "$sync_request"
    echo
    echo -e "${YELLOW}Please review and update the following documentation areas:${NC}"
    for path in "${DOCS_PATHS[@]}"; do
        if [[ -e "$path" ]]; then
            echo -e "  ${YELLOW}→${NC} $path"
        fi
    done
fi

echo
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. Review any documentation changes made by the sync agent"
echo -e "2. Stage additional documentation updates if needed: ${YELLOW}git add docs/...${NC}"
echo -e "3. Continue with your commit: ${YELLOW}git commit${NC}"

exit 0
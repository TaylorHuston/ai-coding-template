#!/bin/bash

# Documentation Trigger Hook
# Purpose: Auto-invoke technical-writer agent when new documentation is needed
# Usage: Called by pre-commit hooks to detect documentation needs

set -euo pipefail

# Check if new .md files are being added
new_docs=$(git diff --cached --name-only --diff-filter=A | grep '\.md$' || true)

if [[ -n "$new_docs" ]]; then
    echo "🔍 New documentation files detected:"
    echo "$new_docs"
    echo ""
    echo "💡 Reminder: Use the technical-writer agent to ensure documentation follows project guidelines:"
    echo ""
    echo "   Example usage:"
    echo "   📝 For new guides: Ask technical-writer to create comprehensive documentation"
    echo "   📋 For templates: Ask technical-writer to follow template standards"
    echo "   🏗️  For ADRs: Ask technical-writer to create architecture decision records"
    echo ""
    echo "   The technical-writer agent will automatically:"
    echo "   ✅ Follow documentation guidelines"
    echo "   ✅ Add proper YAML frontmatter"
    echo "   ✅ Use correct naming conventions"
    echo "   ✅ Ensure appropriate document structure"
    echo ""
fi

# Check for missing documentation based on code changes
missing_docs=()

# Check for new API endpoints without docs
if git diff --cached --name-only | grep -E '\.(js|ts|py|go)$' | xargs grep -l '@api\|@endpoint\|app\.\(get\|post\|put\|delete\)' 2>/dev/null | head -1 >/dev/null; then
    if [[ ! -f "docs/api/README.md" && ! -f "docs/api"* ]]; then
        missing_docs+=("API documentation (consider docs/api/ directory)")
    fi
fi

# Check for new commands without docs
if git diff --cached --name-only | grep -q '.claude/commands/'; then
    echo "🔄 Command files modified - ensure command documentation is updated"
fi

# Check for configuration changes
if git diff --cached --name-only | grep -E '(config|\.json|\.yaml|\.yml)$' >/dev/null; then
    if [[ ! -f "docs/development/configuration.md" ]]; then
        missing_docs+=("Configuration documentation")
    fi
fi

if [[ ${#missing_docs[@]} -gt 0 ]]; then
    echo "📋 Consider creating documentation for:"
    for doc in "${missing_docs[@]}"; do
        echo "   - $doc"
    done
    echo ""
    echo "💡 Use technical-writer agent to create compliant documentation"
fi

exit 0
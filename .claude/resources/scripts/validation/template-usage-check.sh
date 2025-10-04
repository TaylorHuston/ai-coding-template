#!/bin/bash

# Template Usage Validation Script
# Validates that task files follow template patterns

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Validating template usage in workbench..."

# Check for task files in workbench
task_files=$(find workbench/ -name "TASK.md" -o -name "BUG.md" 2>/dev/null || true)

if [[ -z "$task_files" ]]; then
    echo -e "${GREEN}✅ No task files found to validate${NC}"
    exit 0
fi

validation_errors=0

for file in $task_files; do
    echo "Checking: $file"

    # Check for required checkbox format in Implementation Tasks
    if grep -q "## Implementation Tasks" "$file"; then
        # Look for checkbox patterns after Implementation Tasks section
        if ! sed -n '/## Implementation Tasks/,/## /p' "$file" | grep -q "^- \[ \]"; then
            echo -e "${RED}❌ $file: Missing checkboxes in Implementation Tasks section${NC}"
            echo -e "${YELLOW}   Expected format: - [ ] task description${NC}"
            ((validation_errors++))
        else
            echo -e "${GREEN}✅ $file: Contains proper checkboxes${NC}"
        fi
    fi

    # Check for required frontmatter
    if ! head -n 1 "$file" | grep -q "^---$"; then
        echo -e "${RED}❌ $file: Missing frontmatter${NC}"
        ((validation_errors++))
    fi

    # Check for Acceptance Criteria checkboxes
    if grep -q "## Acceptance Criteria" "$file"; then
        if ! sed -n '/## Acceptance Criteria/,/## /p' "$file" | grep -q "^- \[ \]"; then
            echo -e "${RED}❌ $file: Missing checkboxes in Acceptance Criteria${NC}"
            ((validation_errors++))
        fi
    fi
done

echo ""
if [[ $validation_errors -eq 0 ]]; then
    echo -e "${GREEN}🎉 All task files follow template patterns!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $validation_errors template validation errors${NC}"
    echo -e "${YELLOW}💡 Consider using .claude/resources/templates/workflow/epic/task.template.md${NC}"
    exit 1
fi
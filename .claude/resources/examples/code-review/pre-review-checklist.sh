#!/bin/bash
# Pre-review checklist script example

echo "🔍 Running pre-review checks..."

# Lint check
echo -n "Checking linting... "
if npm run lint --silent; then
    echo "✅ Lint check passed"
else
    echo "❌ Lint check failed"
    exit 1
fi

# Test check
echo -n "Running tests... "
test_output=$(npm test --silent 2>&1)
test_count=$(echo "$test_output" | grep -o '[0-9]* passing' | head -1 | grep -o '[0-9]*')
if [ $? -eq 0 ]; then
    echo "✅ Tests passed ($test_count/$test_count)"
else
    echo "❌ Tests failed"
    exit 1
fi

# Console.log check
echo -n "Checking for debug statements... "
if grep -r "console\." src/ --exclude-dir=node_modules; then
    echo "⚠️  Console.log statements found"
else
    echo "✅ No console.log statements found"
fi

# TODO check
echo -n "Checking for TODO comments... "
if grep -r "TODO\|FIXME" src/ --exclude-dir=node_modules; then
    echo "⚠️  TODO comments found in production code"
else
    echo "✅ No TODO comments in production code"
fi

# Documentation check
echo -n "Checking documentation... "
if git diff --name-only HEAD~1 | grep -q "README\|\.md$"; then
    echo "✅ Documentation updated"
else
    echo "⚠️  Consider updating documentation"
fi

# Large file check
echo -n "Checking file sizes... "
large_files=$(find src/ -name "*.js" -o -name "*.ts" | xargs wc -l | awk '$1 > 300 {print $2}')
if [ -n "$large_files" ]; then
    echo "⚠️  Large file detected: consider splitting"
    echo "$large_files"
else
    echo "✅ File sizes appropriate"
fi

echo "🎉 Pre-review checks complete!"
#!/bin/bash

# AI Coding Template - Git Hooks Installation Script
# Version: 0.2.0
# Installs improved git hooks with user-friendly setup

set -euo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

HOOKS_DIR=".githooks"
GIT_HOOKS_DIR=".git/hooks"

echo -e "${BLUE}🔧 AI Coding Template Git Hooks Installation${NC}"
echo

# Check if we're in a git repository
if [[ ! -d ".git" ]]; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    echo "Please run this script from the root of your git repository"
    exit 1
fi

# Check if hooks directory exists
if [[ ! -d "$HOOKS_DIR" ]]; then
    echo -e "${RED}❌ Error: .githooks directory not found${NC}"
    echo "Expected to find hooks in: $HOOKS_DIR"
    exit 1
fi

# Create git hooks directory if it doesn't exist
if [[ ! -d "$GIT_HOOKS_DIR" ]]; then
    echo -e "${YELLOW}⚠️ Creating git hooks directory: $GIT_HOOKS_DIR${NC}"
    mkdir -p "$GIT_HOOKS_DIR"
fi

# Install pre-commit hook
if [[ -f "$HOOKS_DIR/pre-commit" ]]; then
    echo -e "${BLUE}📋 Installing pre-commit hook...${NC}"

    # Backup existing hook if it exists
    if [[ -f "$GIT_HOOKS_DIR/pre-commit" ]]; then
        echo -e "${YELLOW}⚠️ Backing up existing pre-commit hook${NC}"
        mv "$GIT_HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-commit.backup.$(date +%Y%m%d-%H%M%S)"
    fi

    # Copy the new hook
    cp "$HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-commit"
    chmod +x "$GIT_HOOKS_DIR/pre-commit"

    echo -e "${GREEN}✅ Pre-commit hook installed successfully${NC}"
else
    echo -e "${YELLOW}⚠️ Pre-commit hook not found in $HOOKS_DIR${NC}"
fi

# Check for configuration file
echo
echo -e "${BLUE}🔍 Checking configuration...${NC}"

if [[ -f ".githooks.json" ]]; then
    echo -e "${GREEN}✅ Configuration file found: .githooks.json${NC}"

    # Check for jq
    if command -v jq >/dev/null 2>&1; then
        echo -e "${GREEN}✅ jq is available for configuration parsing${NC}"

        # Validate configuration
        if jq empty .githooks.json >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Configuration file is valid JSON${NC}"
        else
            echo -e "${RED}❌ Configuration file contains invalid JSON${NC}"
            echo "Please check your .githooks.json file"
        fi
    else
        echo -e "${YELLOW}⚠️ jq not found - hooks will use fallback configuration${NC}"
        echo "For full functionality, install jq: apt-get install jq (Linux) or brew install jq (macOS)"
    fi
else
    echo -e "${YELLOW}⚠️ Configuration file not found: .githooks.json${NC}"
    echo "Hooks will use minimal defaults"
fi

# Test the installation
echo
echo -e "${BLUE}🧪 Testing hook installation...${NC}"

# Create a test scenario
touch test-hook-install.tmp
git add test-hook-install.tmp

# Run the hook (but capture output so it doesn't interfere)
if "$GIT_HOOKS_DIR/pre-commit" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Pre-commit hook is working correctly${NC}"
else
    echo -e "${YELLOW}⚠️ Pre-commit hook test had warnings (this may be normal)${NC}"
fi

# Clean up test file
git reset HEAD test-hook-install.tmp >/dev/null 2>&1 || true
rm -f test-hook-install.tmp

# Summary
echo
echo -e "${BLUE}📊 Installation Summary:${NC}"
echo -e "  Hooks directory: ${GREEN}$HOOKS_DIR${NC}"
echo -e "  Git hooks directory: ${GREEN}$GIT_HOOKS_DIR${NC}"
echo -e "  Configuration: ${GREEN}.githooks.json${NC}"

if command -v jq >/dev/null 2>&1; then
    echo -e "  JSON parser: ${GREEN}jq available${NC}"
else
    echo -e "  JSON parser: ${YELLOW}jq not available (using fallbacks)${NC}"
fi

echo
echo -e "${GREEN}🎉 Git hooks installation complete!${NC}"
echo
echo -e "${BLUE}💡 Usage Tips:${NC}"
echo "  • Hooks run automatically on 'git commit'"
echo "  • Use 'git commit --no-verify' to bypass hooks if needed"
echo "  • Configure behavior in .githooks.json"
echo "  • Check .githooks/README.md for more information"

# Optional: Set up git config for hooks path (alternative approach)
# echo
# echo -e "${BLUE}🔧 Optional: Configure git to use .githooks directory directly?${NC}"
# echo "This allows git to automatically use hooks from .githooks/ without copying"
# echo -e "${YELLOW}Note: This affects the entire repository for all users${NC}"
# echo -n "Set git config core.hooksPath to .githooks? [y/N]: "
# read -r response
# if [[ "$response" =~ ^[Yy]$ ]]; then
#     git config core.hooksPath .githooks
#     echo -e "${GREEN}✅ Git configured to use .githooks directory${NC}"
# else
#     echo -e "${BLUE}ℹ️ Using traditional .git/hooks approach${NC}"
# fi

echo
echo -e "${GREEN}Ready to commit with improved hooks! 🚀${NC}"
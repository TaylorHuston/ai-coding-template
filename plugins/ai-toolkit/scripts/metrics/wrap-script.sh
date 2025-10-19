#!/bin/bash
# Script Wrapper with Metrics Collection
# Purpose: Automatically wrap any script execution with metrics collection
# Usage: ./wrap-script.sh <category> <script-path> [script-args...]

set -euo pipefail

# Source metrics collector
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/metrics-collector.sh"

# Check arguments
if [[ $# -lt 2 ]]; then
    echo "Usage: $0 <category> <script-path> [script-args...]" >&2
    echo "Categories: setup|workflow|quality|hooks|docs|status|release" >&2
    exit 1
fi

CATEGORY="$1"
SCRIPT_PATH="$2"
shift 2
SCRIPT_ARGS="$*"

# Validate category
case "$CATEGORY" in
    setup|workflow|quality|hooks|docs|status|release)
        ;;
    *)
        echo "Error: Invalid category '$CATEGORY'" >&2
        echo "Valid categories: setup|workflow|quality|hooks|docs|status|release" >&2
        exit 1
        ;;
esac

# Validate script exists
if [[ ! -f "$SCRIPT_PATH" ]]; then
    echo "Error: Script not found: $SCRIPT_PATH" >&2
    exit 1
fi

# Make script executable if needed
if [[ ! -x "$SCRIPT_PATH" ]]; then
    chmod +x "$SCRIPT_PATH"
fi

# Execute with metrics collection
execute_with_metrics "$SCRIPT_PATH" "$CATEGORY" "$@"
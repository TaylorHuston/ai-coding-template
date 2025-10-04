#!/bin/bash
# Metrics Collector - Core metrics collection functionality
# Purpose: Centralized metrics collection for commands, agents, and scripts
# Usage: source this script to use collect_metrics function

set -euo pipefail

# Configuration
METRICS_DIR="${METRICS_DIR:-.claude/metrics}"
CONFIG_FILE="$METRICS_DIR/config.yml"
SCHEMA_FILE="$METRICS_DIR/schema.json"

# Ensure metrics directory exists
mkdir -p "$METRICS_DIR"

# Generate session ID if not set
if [[ -z "${METRICS_SESSION_ID:-}" ]]; then
    export METRICS_SESSION_ID="sess_$(date +%s)_$$"
fi

# Check if metrics collection is enabled
is_metrics_enabled() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        return 1
    fi

    # Simple YAML parsing for enabled flag
    if grep -q "enabled: true" "$CONFIG_FILE" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Generate timestamp in ISO 8601 format
get_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%S.%3NZ"
}

# Get current context information
get_context() {
    local context="{}"

    # Detect project type from package.json, Cargo.toml, etc.
    if [[ -f "package.json" ]]; then
        context=$(echo "$context" | jq '.project_type = "node"')
    elif [[ -f "Cargo.toml" ]]; then
        context=$(echo "$context" | jq '.project_type = "rust"')
    elif [[ -f "pyproject.toml" ]] || [[ -f "setup.py" ]]; then
        context=$(echo "$context" | jq '.project_type = "python"')
    fi

    # Estimate codebase size
    local file_count=$(find . -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.rs" -o -name "*.go" 2>/dev/null | wc -l)
    local size="small"
    if [[ $file_count -gt 100 ]]; then
        size="medium"
    elif [[ $file_count -gt 500 ]]; then
        size="large"
    elif [[ $file_count -gt 2000 ]]; then
        size="enterprise"
    fi
    context=$(echo "$context" | jq --arg size "$size" '.codebase_size = $size')

    echo "$context"
}

# Main metrics collection function
collect_metrics() {
    # Skip if metrics disabled
    if ! is_metrics_enabled; then
        return 0
    fi

    local type="$1"           # command|agent|script
    local name="$2"           # entity name
    local duration_ms="$3"    # execution duration
    local status="$4"         # completed|failed|interrupted|timeout
    local extra_data="${5:-{}}" # Additional JSON data

    # Build metrics record
    local metrics_record
    metrics_record=$(jq -n \
        --arg timestamp "$(get_timestamp)" \
        --arg type "$type" \
        --arg name "$name" \
        --arg session_id "$METRICS_SESSION_ID" \
        --argjson duration_ms "$duration_ms" \
        --arg status "$status" \
        --argjson context "$(get_context)" \
        --argjson extra "$extra_data" \
        '{
            timestamp: $timestamp,
            type: $type,
            name: $name,
            session_id: $session_id,
            metrics: {
                duration_ms: $duration_ms,
                status: $status
            },
            context: $context
        } * $extra'
    )

    # Determine log file based on type
    local log_file="$METRICS_DIR/${type}s.jsonl"

    # Write metrics record (async if possible)
    if command -v flock >/dev/null 2>&1; then
        # Use file locking for concurrent writes
        (
            flock -x 200
            echo "$metrics_record" >> "$log_file"
        ) 200>"$log_file.lock"
    else
        # Fallback without locking
        echo "$metrics_record" >> "$log_file"
    fi
}

# Wrapper function for script execution with metrics
execute_with_metrics() {
    local script_name="$1"
    local category="${2:-unknown}"
    shift 2
    local args="$*"

    if ! is_metrics_enabled; then
        # Execute without metrics
        "$script_name" "$@"
        return $?
    fi

    local start_time
    local end_time
    local duration_ms
    local exit_code

    # Capture start time
    start_time=$(date +%s%N)

    # Execute script
    set +e
    "$script_name" "$@"
    exit_code=$?
    set -e

    # Capture end time
    end_time=$(date +%s%N)
    duration_ms=$(( (end_time - start_time) / 1000000 ))

    # Determine status
    local status="completed"
    if [[ $exit_code -ne 0 ]]; then
        status="failed"
    fi

    # Build extra data
    local extra_data
    extra_data=$(jq -n \
        --arg category "$category" \
        --argjson exit_code "$exit_code" \
        --arg args "$args" \
        '{
            category: $category,
            invocation_context: {
                triggered_by: "user",
                arguments: $args
            },
            metrics: {
                exit_code: $exit_code
            }
        }'
    )

    # Collect metrics
    collect_metrics "script" "$script_name" "$duration_ms" "$status" "$extra_data"

    return $exit_code
}

# Export functions for use in other scripts
export -f is_metrics_enabled
export -f get_timestamp
export -f get_context
export -f collect_metrics
export -f execute_with_metrics
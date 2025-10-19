#!/bin/bash
# Command Metrics Hook
# Purpose: Collect metrics for custom command executions
# Usage: Include this in command implementations or call directly

set -euo pipefail

# Source metrics collector
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/metrics-collector.sh"

# Function to track command start
track_command_start() {
    local command_name="$1"
    local arguments="${2:-}"

    # Export start time for end tracking
    export COMMAND_START_TIME=$(date +%s%N)
    export COMMAND_NAME="$command_name"
    export COMMAND_ARGS="$arguments"

    # Log command start if debug mode
    if is_metrics_enabled && grep -q "level: debug" "$CONFIG_FILE" 2>/dev/null; then
        echo "$(get_timestamp): Starting command $command_name" >> "$METRICS_DIR/debug.log"
    fi
}

# Function to track command completion
track_command_end() {
    local status="${1:-completed}"
    local model_used="${2:-none}"
    local agents_invoked="${3:-[]}"
    local tools_used="${4:-[]}"

    # Skip if no start time set
    if [[ -z "${COMMAND_START_TIME:-}" ]] || [[ -z "${COMMAND_NAME:-}" ]]; then
        return 0
    fi

    local end_time=$(date +%s%N)
    local duration_ms=$(( (end_time - COMMAND_START_TIME) / 1000000 ))

    # Build extra data
    local extra_data
    extra_data=$(jq -n \
        --arg model "$model_used" \
        --argjson agents "$agents_invoked" \
        --argjson tools "$tools_used" \
        --arg args "${COMMAND_ARGS:-}" \
        '{
            invocation_context: {
                triggered_by: "user",
                arguments: $args
            },
            metrics: {
                model_used: $model,
                tools_used: $tools
            },
            dependencies: {
                agents_invoked: $agents
            }
        }'
    )

    # Collect metrics
    collect_metrics "command" "$COMMAND_NAME" "$duration_ms" "$status" "$extra_data"

    # Clean up environment variables
    unset COMMAND_START_TIME COMMAND_NAME COMMAND_ARGS
}

# Function to track agent invocation from commands
track_agent_invocation() {
    local agent_name="$1"
    local task_description="${2:-}"
    local parent_command="${COMMAND_NAME:-unknown}"

    # Build extra data for agent tracking
    local extra_data
    extra_data=$(jq -n \
        --arg parent "$parent_command" \
        --arg task "$task_description" \
        '{
            invocation_context: {
                triggered_by: "command",
                parent_entity: $parent,
                task_description: $task
            }
        }'
    )

    # Note: Actual agent execution time will be tracked separately
    # This just logs the invocation request
    if is_metrics_enabled; then
        echo "$(get_timestamp): Command $parent_command invoking agent $agent_name" >> "$METRICS_DIR/agent-invocations.log"
    fi
}

# Export functions
export -f track_command_start
export -f track_command_end
export -f track_agent_invocation
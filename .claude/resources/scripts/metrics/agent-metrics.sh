#!/bin/bash
# Agent Metrics Hook
# Purpose: Collect metrics for agent executions via Task tool
# Usage: Include this in Task tool wrappers or agent execution contexts

set -euo pipefail

# Source metrics collector
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/metrics-collector.sh"

# Function to track agent execution start
track_agent_start() {
    local agent_name="$1"
    local task_description="${2:-}"
    local triggered_by="${3:-user}"
    local parent_entity="${4:-}"

    # Export start time for end tracking
    export AGENT_START_TIME=$(date +%s%N)
    export AGENT_NAME="$agent_name"
    export AGENT_TASK="$task_description"
    export AGENT_TRIGGERED_BY="$triggered_by"
    export AGENT_PARENT="$parent_entity"

    # Log agent start if debug mode
    if is_metrics_enabled && grep -q "level: debug" "$CONFIG_FILE" 2>/dev/null; then
        echo "$(get_timestamp): Starting agent $agent_name (triggered by $triggered_by)" >> "$METRICS_DIR/debug.log"
    fi
}

# Function to track agent completion
track_agent_end() {
    local status="${1:-completed}"
    local model_used="${2:-sonnet}"
    local tools_used="${3:-[]}"
    local tokens_consumed="${4:-0}"

    # Skip if no start time set
    if [[ -z "${AGENT_START_TIME:-}" ]] || [[ -z "${AGENT_NAME:-}" ]]; then
        return 0
    fi

    local end_time=$(date +%s%N)
    local duration_ms=$(( (end_time - AGENT_START_TIME) / 1000000 ))

    # Build extra data
    local extra_data
    extra_data=$(jq -n \
        --arg triggered_by "${AGENT_TRIGGERED_BY:-user}" \
        --arg parent "${AGENT_PARENT:-}" \
        --arg task "${AGENT_TASK:-}" \
        --arg model "$model_used" \
        --argjson tools "$tools_used" \
        --argjson tokens "$tokens_consumed" \
        '{
            invocation_context: {
                triggered_by: $triggered_by,
                parent_entity: $parent,
                task_description: $task
            },
            metrics: {
                model_used: $model,
                tools_used: $tools,
                tokens_consumed: $tokens
            }
        }'
    )

    # Collect metrics
    collect_metrics "agent" "$AGENT_NAME" "$duration_ms" "$status" "$extra_data"

    # Clean up environment variables
    unset AGENT_START_TIME AGENT_NAME AGENT_TASK AGENT_TRIGGERED_BY AGENT_PARENT
}

# Function to track tool usage within agents
track_tool_usage() {
    local tool_name="$1"
    local agent_name="${AGENT_NAME:-unknown}"
    local usage_context="${2:-}"

    if is_metrics_enabled; then
        local log_entry
        log_entry=$(jq -n \
            --arg timestamp "$(get_timestamp)" \
            --arg agent "$agent_name" \
            --arg tool "$tool_name" \
            --arg context "$usage_context" \
            '{
                timestamp: $timestamp,
                agent: $agent,
                tool: $tool,
                context: $context
            }'
        )
        echo "$log_entry" >> "$METRICS_DIR/tool-usage.jsonl"
    fi
}

# Function to simulate Task tool metrics collection
# This would ideally be integrated into the actual Task tool implementation
track_task_tool_invocation() {
    local subagent_type="$1"
    local task_description="${2:-}"
    local triggered_by_command="${3:-}"

    track_agent_start "$subagent_type" "$task_description" "command" "$triggered_by_command"

    # In real implementation, this would wrap the actual Task tool execution
    # For now, we'll just simulate the completion after a delay
    # track_agent_end "completed" "sonnet" '["Read", "Write", "Edit"]' 1500
}

# Export functions
export -f track_agent_start
export -f track_agent_end
export -f track_tool_usage
export -f track_task_tool_invocation
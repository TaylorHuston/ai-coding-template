#!/bin/bash
# Metrics Query Tool
# Purpose: Query specific metrics data with filters
# Usage: ./query-metrics.sh [OPTIONS]

set -euo pipefail

# Configuration
METRICS_DIR="${METRICS_DIR:-.claude/metrics}"

# Default values
ENTITY_TYPE=""    # command, agent, script, or empty for all
ENTITY_NAME=""    # specific entity name
TIME_RANGE="7d"   # 1d, 7d, 30d, 90d, all
STATUS=""         # completed, failed, interrupted, timeout
OUTPUT_FORMAT="table"  # table, json, csv
LIMIT=20          # number of results to show

# Usage function
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Query metrics data with flexible filtering options.

Options:
  --type TYPE           Entity type: command, agent, script (default: all)
  --name NAME           Specific entity name to filter by
  --range RANGE         Time range: 1d, 7d, 30d, 90d, all (default: 7d)
  --status STATUS       Status filter: completed, failed, interrupted, timeout
  --format FORMAT       Output format: table, json, csv (default: table)
  --limit LIMIT         Maximum number of results (default: 20)
  --stats               Show statistics instead of raw data
  --help               Show this help message

Examples:
  $0 --type command --range 30d --stats
  $0 --name "/architect" --format json
  $0 --type agent --name "code-architect" --range all
  $0 --status failed --limit 50
  $0 --stats --format csv
EOF
}

# Parse command line arguments
SHOW_STATS=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            ENTITY_TYPE="$2"
            shift 2
            ;;
        --name)
            ENTITY_NAME="$2"
            shift 2
            ;;
        --range)
            TIME_RANGE="$2"
            shift 2
            ;;
        --status)
            STATUS="$2"
            shift 2
            ;;
        --format)
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        --limit)
            LIMIT="$2"
            shift 2
            ;;
        --stats)
            SHOW_STATS=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            show_usage >&2
            exit 1
            ;;
    esac
done

# Validate inputs
if [[ -n "$ENTITY_TYPE" ]]; then
    case "$ENTITY_TYPE" in
        command|agent|script) ;;
        *) echo "Error: Invalid entity type '$ENTITY_TYPE'" >&2; exit 1 ;;
    esac
fi

case "$TIME_RANGE" in
    1d|7d|30d|90d|all) ;;
    *) echo "Error: Invalid time range '$TIME_RANGE'" >&2; exit 1 ;;
esac

case "$OUTPUT_FORMAT" in
    table|json|csv) ;;
    *) echo "Error: Invalid output format '$OUTPUT_FORMAT'" >&2; exit 1 ;;
esac

# Check if metrics directory exists
if [[ ! -d "$METRICS_DIR" ]]; then
    echo "Error: Metrics directory not found: $METRICS_DIR" >&2
    exit 1
fi

# Calculate date filter
get_date_filter() {
    case "$TIME_RANGE" in
        1d) date -d "1 day ago" -u +"%Y-%m-%dT%H:%M:%S" ;;
        7d) date -d "7 days ago" -u +"%Y-%m-%dT%H:%M:%S" ;;
        30d) date -d "30 days ago" -u +"%Y-%m-%dT%H:%M:%S" ;;
        90d) date -d "90 days ago" -u +"%Y-%m-%dT%H:%M:%S" ;;
        all) echo "1970-01-01T00:00:00" ;;
    esac
}

DATE_FILTER=$(get_date_filter)

# Build JQ filter
build_jq_filter() {
    local filters=()

    # Date filter
    filters+=("select(.timestamp >= \"$DATE_FILTER\")")

    # Entity type filter
    if [[ -n "$ENTITY_TYPE" ]]; then
        filters+=("select(.type == \"$ENTITY_TYPE\")")
    fi

    # Entity name filter
    if [[ -n "$ENTITY_NAME" ]]; then
        filters+=("select(.name == \"$ENTITY_NAME\")")
    fi

    # Status filter
    if [[ -n "$STATUS" ]]; then
        filters+=("select(.metrics.status == \"$STATUS\")")
    fi

    # Join filters with " | "
    local filter_string=""
    for filter in "${filters[@]}"; do
        if [[ -z "$filter_string" ]]; then
            filter_string="$filter"
        else
            filter_string="$filter_string | $filter"
        fi
    done

    echo "$filter_string"
}

# Get data files to query
get_data_files() {
    local files=()

    if [[ -n "$ENTITY_TYPE" ]]; then
        case "$ENTITY_TYPE" in
            command)
                if [[ -f "$METRICS_DIR/commands.jsonl" ]]; then
                    files+=("$METRICS_DIR/commands.jsonl")
                fi
                ;;
            agent)
                if [[ -f "$METRICS_DIR/agents.jsonl" ]]; then
                    files+=("$METRICS_DIR/agents.jsonl")
                fi
                ;;
            script)
                if [[ -f "$METRICS_DIR/scripts.jsonl" ]]; then
                    files+=("$METRICS_DIR/scripts.jsonl")
                fi
                ;;
        esac
    else
        # All files
        for file in "$METRICS_DIR"/*.jsonl; do
            if [[ -f "$file" ]]; then
                files+=("$file")
            fi
        done
    fi

    printf '%s\n' "${files[@]}"
}

# Query raw data
query_raw_data() {
    local jq_filter
    jq_filter=$(build_jq_filter)

    local files
    mapfile -t files < <(get_data_files)

    if [[ ${#files[@]} -eq 0 ]]; then
        echo "No data files found for query" >&2
        return 1
    fi

    # Combine all matching records
    local all_data="[]"
    for file in "${files[@]}"; do
        local file_data
        file_data=$(jq -s --arg filter "$jq_filter" "map($filter)" "$file" 2>/dev/null || echo "[]")
        all_data=$(echo "$all_data $file_data" | jq -s 'add')
    done

    # Sort by timestamp and limit
    echo "$all_data" | jq --argjson limit "$LIMIT" 'sort_by(.timestamp) | reverse | .[:$limit]'
}

# Generate statistics
generate_stats() {
    local raw_data
    raw_data=$(query_raw_data)

    # Calculate statistics using jq
    local stats
    stats=$(echo "$raw_data" | jq '{
        total_count: length,
        avg_duration_ms: (map(.metrics.duration_ms // 0) | add / length),
        success_rate: (map(select(.metrics.status == "completed")) | length) / length * 100,
        status_breakdown: group_by(.metrics.status) | map({status: .[0].metrics.status, count: length}),
        entity_breakdown: group_by(.name) | map({name: .[0].name, count: length}) | sort_by(.count) | reverse,
        duration_stats: {
            min: (map(.metrics.duration_ms // 0) | min),
            max: (map(.metrics.duration_ms // 0) | max),
            median: (map(.metrics.duration_ms // 0) | sort | .[length/2])
        }
    }')

    echo "$stats"
}

# Format output
format_output() {
    local data="$1"
    local is_stats="$2"

    case "$OUTPUT_FORMAT" in
        json)
            echo "$data" | jq .
            ;;
        csv)
            if [[ "$is_stats" == "true" ]]; then
                # CSV format for stats
                echo "metric,value"
                echo "$data" | jq -r '
                    "total_count,\(.total_count)",
                    "avg_duration_ms,\(.avg_duration_ms)",
                    "success_rate_percent,\(.success_rate)"
                '
            else
                # CSV format for raw data
                echo "timestamp,type,name,duration_ms,status"
                echo "$data" | jq -r '.[] | "\(.timestamp),\(.type),\(.name),\(.metrics.duration_ms // 0),\(.metrics.status)"'
            fi
            ;;
        table)
            if [[ "$is_stats" == "true" ]]; then
                # Table format for stats
                echo "=== Query Statistics ==="
                echo "Time Range: $TIME_RANGE"
                echo "Entity Type: ${ENTITY_TYPE:-all}"
                echo "Entity Name: ${ENTITY_NAME:-all}"
                echo "Status Filter: ${STATUS:-all}"
                echo ""

                local total_count avg_duration success_rate
                total_count=$(echo "$data" | jq -r '.total_count')
                avg_duration=$(echo "$data" | jq -r '.avg_duration_ms | floor')
                success_rate=$(echo "$data" | jq -r '.success_rate | floor')

                echo "Summary:"
                echo "  Total Records: $total_count"
                echo "  Average Duration: ${avg_duration}ms"
                echo "  Success Rate: ${success_rate}%"
                echo ""

                echo "Top Entities:"
                echo "$data" | jq -r '.entity_breakdown[:10][] | "  \(.name): \(.count) executions"'
            else
                # Table format for raw data
                printf "%-20s %-10s %-25s %-10s %-10s\n" "TIMESTAMP" "TYPE" "NAME" "DURATION" "STATUS"
                printf "%-20s %-10s %-25s %-10s %-10s\n" "--------------------" "----------" "-------------------------" "----------" "----------"
                echo "$data" | jq -r '.[] |
                    (.timestamp | split("T")[0]) + " " + (.timestamp | split("T")[1] | split(".")[0]) as $ts |
                    "\($ts) \(.type) \(.name) \(.metrics.duration_ms // 0)ms \(.metrics.status)"
                ' | while read -r line; do
                    printf "%-20s %-10s %-25s %-10s %-10s\n" $line
                done
            fi
            ;;
    esac
}

# Main execution
main() {
    if [[ "$SHOW_STATS" == "true" ]]; then
        local stats_data
        stats_data=$(generate_stats)
        format_output "$stats_data" "true"
    else
        local raw_data
        raw_data=$(query_raw_data)
        format_output "$raw_data" "false"
    fi
}

# Run main function
main
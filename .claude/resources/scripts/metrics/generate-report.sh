#!/bin/bash
# Metrics Report Generator
# Purpose: Generate analytics reports from collected metrics
# Usage: ./generate-report.sh [--period PERIOD] [--type TYPE] [--format FORMAT] [--output FILE]

set -euo pipefail

# Configuration
METRICS_DIR="${METRICS_DIR:-.claude/metrics}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Default values
PERIOD="7d"      # 1d, 7d, 30d, 90d, all
TYPE="summary"   # summary, detailed, commands, agents, scripts, workflows
FORMAT="text"    # text, json, csv, html
OUTPUT=""        # stdout if empty

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --period)
            PERIOD="$2"
            shift 2
            ;;
        --type)
            TYPE="$2"
            shift 2
            ;;
        --format)
            FORMAT="$2"
            shift 2
            ;;
        --output)
            OUTPUT="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [--period PERIOD] [--type TYPE] [--format FORMAT] [--output FILE]"
            echo ""
            echo "Options:"
            echo "  --period PERIOD   Time period: 1d, 7d, 30d, 90d, all (default: 7d)"
            echo "  --type TYPE       Report type: summary, detailed, commands, agents, scripts, workflows (default: summary)"
            echo "  --format FORMAT   Output format: text, json, csv, html (default: text)"
            echo "  --output FILE     Output file (default: stdout)"
            echo ""
            echo "Examples:"
            echo "  $0 --period 30d --type summary"
            echo "  $0 --type commands --format json --output commands-report.json"
            echo "  $0 --period all --type detailed --format html --output full-report.html"
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

# Validate inputs
case "$PERIOD" in
    1d|7d|30d|90d|all) ;;
    *) echo "Error: Invalid period '$PERIOD'" >&2; exit 1 ;;
esac

case "$TYPE" in
    summary|detailed|commands|agents|scripts|workflows) ;;
    *) echo "Error: Invalid type '$TYPE'" >&2; exit 1 ;;
esac

case "$FORMAT" in
    text|json|csv|html) ;;
    *) echo "Error: Invalid format '$FORMAT'" >&2; exit 1 ;;
esac

# Check if metrics directory exists
if [[ ! -d "$METRICS_DIR" ]]; then
    echo "Error: Metrics directory not found: $METRICS_DIR" >&2
    exit 1
fi

# Calculate date filter
get_date_filter() {
    case "$PERIOD" in
        1d) date -d "1 day ago" -u +"%Y-%m-%dT%H:%M:%S" ;;
        7d) date -d "7 days ago" -u +"%Y-%m-%dT%H:%M:%S" ;;
        30d) date -d "30 days ago" -u +"%Y-%m-%dT%H:%M:%S" ;;
        90d) date -d "90 days ago" -u +"%Y-%m-%dT%H:%M:%S" ;;
        all) echo "1970-01-01T00:00:00" ;;
    esac
}

DATE_FILTER=$(get_date_filter)

# Generate summary statistics
generate_summary() {
    local total_commands=0
    local total_agents=0
    local total_scripts=0
    local avg_duration=0
    local success_rate=0

    # Count entries and calculate stats
    if [[ -f "$METRICS_DIR/commands.jsonl" ]]; then
        total_commands=$(jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date) | .name' "$METRICS_DIR/commands.jsonl" 2>/dev/null | wc -l)
    fi

    if [[ -f "$METRICS_DIR/agents.jsonl" ]]; then
        total_agents=$(jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date) | .name' "$METRICS_DIR/agents.jsonl" 2>/dev/null | wc -l)
    fi

    if [[ -f "$METRICS_DIR/scripts.jsonl" ]]; then
        total_scripts=$(jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date) | .name' "$METRICS_DIR/scripts.jsonl" 2>/dev/null | wc -l)
    fi

    # Calculate average duration across all types
    local total_duration=0
    local total_entries=0
    for file in "$METRICS_DIR"/*.jsonl; do
        if [[ -f "$file" ]]; then
            local file_duration
            local file_entries
            file_duration=$(jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date) | .metrics.duration_ms // 0' "$file" 2>/dev/null | awk '{sum+=$1} END {print sum}')
            file_entries=$(jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date) | .metrics.duration_ms // 0' "$file" 2>/dev/null | wc -l)

            total_duration=$((total_duration + ${file_duration:-0}))
            total_entries=$((total_entries + ${file_entries:-0}))
        fi
    done

    if [[ $total_entries -gt 0 ]]; then
        avg_duration=$((total_duration / total_entries))
    fi

    # Calculate success rate
    local total_success=0
    local total_all=0
    for file in "$METRICS_DIR"/*.jsonl; do
        if [[ -f "$file" ]]; then
            local success_count
            local all_count
            success_count=$(jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date and .metrics.status == "completed")' "$file" 2>/dev/null | wc -l)
            all_count=$(jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date)' "$file" 2>/dev/null | wc -l)

            total_success=$((total_success + ${success_count:-0}))
            total_all=$((total_all + ${all_count:-0}))
        fi
    done

    if [[ $total_all -gt 0 ]]; then
        success_rate=$((total_success * 100 / total_all))
    fi

    case "$FORMAT" in
        text)
            echo "=== AI Coding Template Metrics Report ==="
            echo "Period: $PERIOD"
            echo "Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
            echo ""
            echo "Summary Statistics:"
            echo "  Commands executed: $total_commands"
            echo "  Agents invoked: $total_agents"
            echo "  Scripts run: $total_scripts"
            echo "  Average duration: ${avg_duration}ms"
            echo "  Success rate: ${success_rate}%"
            echo ""
            ;;
        json)
            jq -n \
                --arg period "$PERIOD" \
                --arg generated "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")" \
                --argjson commands "$total_commands" \
                --argjson agents "$total_agents" \
                --argjson scripts "$total_scripts" \
                --argjson avg_duration "$avg_duration" \
                --argjson success_rate "$success_rate" \
                '{
                    report_type: "summary",
                    period: $period,
                    generated: $generated,
                    summary: {
                        commands_executed: $commands,
                        agents_invoked: $agents,
                        scripts_run: $scripts,
                        average_duration_ms: $avg_duration,
                        success_rate_percent: $success_rate
                    }
                }'
            ;;
        csv)
            echo "metric,value"
            echo "commands_executed,$total_commands"
            echo "agents_invoked,$total_agents"
            echo "scripts_run,$total_scripts"
            echo "average_duration_ms,$avg_duration"
            echo "success_rate_percent,$success_rate"
            ;;
    esac
}

# Generate detailed analytics
generate_detailed() {
    case "$FORMAT" in
        text)
            echo "=== Detailed Analytics Report ==="
            echo "Period: $PERIOD"
            echo ""

            # Top commands
            echo "Top Commands:"
            if [[ -f "$METRICS_DIR/commands.jsonl" ]]; then
                jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date) | .name' "$METRICS_DIR/commands.jsonl" 2>/dev/null | \
                    sort | uniq -c | sort -nr | head -10 | \
                    awk '{printf "  %-20s %d executions\n", $2, $1}'
            fi
            echo ""

            # Top agents
            echo "Top Agents:"
            if [[ -f "$METRICS_DIR/agents.jsonl" ]]; then
                jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date) | .name' "$METRICS_DIR/agents.jsonl" 2>/dev/null | \
                    sort | uniq -c | sort -nr | head -10 | \
                    awk '{printf "  %-20s %d invocations\n", $2, $1}'
            fi
            echo ""

            # Top scripts
            echo "Top Scripts:"
            if [[ -f "$METRICS_DIR/scripts.jsonl" ]]; then
                jq -r --arg date "$DATE_FILTER" 'select(.timestamp >= $date) | .name' "$METRICS_DIR/scripts.jsonl" 2>/dev/null | \
                    sort | uniq -c | sort -nr | head -10 | \
                    awk '{printf "  %-30s %d executions\n", $2, $1}'
            fi
            ;;
        json)
            # Generate detailed JSON report
            local commands_data="[]"
            local agents_data="[]"
            local scripts_data="[]"

            if [[ -f "$METRICS_DIR/commands.jsonl" ]]; then
                commands_data=$(jq --arg date "$DATE_FILTER" '[.[] | select(.timestamp >= $date)]' "$METRICS_DIR/commands.jsonl" 2>/dev/null || echo "[]")
            fi

            if [[ -f "$METRICS_DIR/agents.jsonl" ]]; then
                agents_data=$(jq --arg date "$DATE_FILTER" '[.[] | select(.timestamp >= $date)]' "$METRICS_DIR/agents.jsonl" 2>/dev/null || echo "[]")
            fi

            if [[ -f "$METRICS_DIR/scripts.jsonl" ]]; then
                scripts_data=$(jq --arg date "$DATE_FILTER" '[.[] | select(.timestamp >= $date)]' "$METRICS_DIR/scripts.jsonl" 2>/dev/null || echo "[]")
            fi

            jq -n \
                --arg period "$PERIOD" \
                --arg generated "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")" \
                --argjson commands "$commands_data" \
                --argjson agents "$agents_data" \
                --argjson scripts "$scripts_data" \
                '{
                    report_type: "detailed",
                    period: $period,
                    generated: $generated,
                    data: {
                        commands: $commands,
                        agents: $agents,
                        scripts: $scripts
                    }
                }'
            ;;
    esac
}

# Main execution
main() {
    local output_content

    case "$TYPE" in
        summary)
            output_content=$(generate_summary)
            ;;
        detailed)
            output_content=$(generate_detailed)
            ;;
        commands|agents|scripts)
            # Specific entity type reports would go here
            echo "Specific $TYPE reports not yet implemented" >&2
            exit 1
            ;;
        workflows)
            # Workflow analysis would go here
            echo "Workflow reports not yet implemented" >&2
            exit 1
            ;;
    esac

    # Output to file or stdout
    if [[ -n "$OUTPUT" ]]; then
        echo "$output_content" > "$OUTPUT"
        echo "Report generated: $OUTPUT" >&2
    else
        echo "$output_content"
    fi
}

# Run main function
main
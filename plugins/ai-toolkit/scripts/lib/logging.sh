#!/bin/bash
# Logging Library for AI Coding Template Scripts
# Provides consistent logging functions across all scripts
# Usage: source scripts/lib/logging.sh

# Source colors if not already loaded
if [[ -z "$COLOR_SUPPORT" ]]; then
    # Use plugin root if available, otherwise fallback to script directory
    if [[ -n "${CLAUDE_PLUGIN_ROOT:-}" ]]; then
        source "${CLAUDE_PLUGIN_ROOT}/scripts/lib/colors.sh"
    else
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        source "$SCRIPT_DIR/colors.sh"
    fi
fi

# Logging configuration
LOG_LEVEL="${LOG_LEVEL:-INFO}"
LOG_FILE="${LOG_FILE:-}"
LOG_JSON="${LOG_JSON:-false}"
LOG_TIMESTAMP="${LOG_TIMESTAMP:-true}"

# Log levels
declare -A LOG_LEVELS=(
    ["DEBUG"]=0
    ["INFO"]=1
    ["WARNING"]=2
    ["ERROR"]=3
    ["CRITICAL"]=4
)

# Get numeric log level
get_log_level_num() {
    echo "${LOG_LEVELS[$1]:-1}"
}

# Check if should log based on level
should_log() {
    local msg_level="$1"
    local msg_level_num=$(get_log_level_num "$msg_level")
    local current_level_num=$(get_log_level_num "$LOG_LEVEL")
    [[ $msg_level_num -ge $current_level_num ]]
}

# Get timestamp
get_timestamp() {
    if [[ "$LOG_TIMESTAMP" == "true" ]]; then
        date '+%Y-%m-%d %H:%M:%S'
    fi
}

# Core logging function
log_message() {
    local level="$1"
    shift
    local message="$*"
    
    # Check if should log
    if ! should_log "$level"; then
        return
    fi
    
    local timestamp=$(get_timestamp)
    local output=""
    
    if [[ "$LOG_JSON" == "true" ]]; then
        # JSON output
        output=$(jq -n \
            --arg timestamp "$timestamp" \
            --arg level "$level" \
            --arg message "$message" \
            --arg script "${BASH_SOURCE[-1]}" \
            '{timestamp: $timestamp, level: $level, message: $message, script: $script}')
    else
        # Human-readable output
        case "$level" in
            "DEBUG")
                output="${DIM}[$(get_timestamp)] [DEBUG] $message${NC}"
                ;;
            "INFO")
                output="${BLUE}${EMOJI_INFO} $message${NC}"
                ;;
            "WARNING")
                output="${YELLOW}${EMOJI_WARNING} $message${NC}"
                ;;
            "ERROR")
                output="${RED}${EMOJI_ERROR} $message${NC}"
                ;;
            "CRITICAL")
                output="${BRIGHT_RED}${BG_RED}${EMOJI_FIRE} CRITICAL: $message${NC}"
                ;;
            *)
                output="$message"
                ;;
        esac
    fi
    
    # Output to console
    echo -e "$output"
    
    # Output to file if configured
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo -e "$output" | sed 's/\x1b\[[0-9;]*m//g' >> "${LOG_FILE}"  # Strip colors for file
    fi
}

# Convenience logging functions
log_debug() {
    log_message "DEBUG" "$@"
}

log_info() {
    log_message "INFO" "$@"
}

log_warning() {
    log_message "WARNING" "$@"
}

log_error() {
    log_message "ERROR" "$@"
}

log_critical() {
    log_message "CRITICAL" "$@"
}

# Status logging functions
log_success() {
    echo -e "${GREEN:-}${EMOJI_SUCCESS:-✅} $*${NC:-}"
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo "[SUCCESS] $*" >> "${LOG_FILE}"
    fi
}

log_failure() {
    echo -e "${RED:-}${EMOJI_ERROR:-❌} $*${NC:-}"
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo "[FAILURE] $*" >> "${LOG_FILE}"
    fi
}

log_skip() {
    echo -e "${YELLOW:-}${EMOJI_ARROW_RIGHT:-→} Skipped: $*${NC:-}"
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo "[SKIPPED] $*" >> "${LOG_FILE}"
    fi
}

# Progress logging
log_step() {
    local step="$1"
    local total="$2"
    local message="$3"
    echo -e "${CYAN}[${step}/${total}] $message${NC}"
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo "[STEP ${step}/${total}] $message" >> "${LOG_FILE}"
    fi
}

# Header logging
log_header() {
    local title="$1"
    local width=60
    local padding=$(( (width - ${#title} - 2) / 2 ))
    local line=$(printf '=%.0s' $(seq 1 $width))
    
    echo -e "${BOLD}${PURPLE}"
    echo "$line"
    printf "%*s %s %*s\\n" $padding "" "$title" $padding ""
    echo "$line"
    echo -e "${NC}"
    
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo "" >> "${LOG_FILE}"
        echo "$line" >> "${LOG_FILE}"
        echo " $title" >> "${LOG_FILE}"
        echo "$line" >> "${LOG_FILE}"
    fi
}

# Section logging
log_section() {
    echo -e "\\n${BOLD}${BLUE}=== $* ===${NC}\\n"
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo -e "\\n=== $* ===\\n" >> "${LOG_FILE}"
    fi
}

# Subsection logging
log_subsection() {
    echo -e "${CYAN}--- $* ---${NC}"
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo "--- $* ---" >> "${LOG_FILE}"
    fi
}

# Command execution logging
log_exec() {
    local command="$*"
    log_info "Executing: $command"
    if eval "$command"; then
        log_success "Command succeeded"
        return 0
    else
        local exit_code=$?
        log_error "Command failed with exit code $exit_code"
        return $exit_code
    fi
}

# Dry run logging
log_dry_run() {
    echo -e "${YELLOW}[DRY RUN] Would execute: $*${NC}"
    if [[ -n "${LOG_FILE:-}" ]]; then
        echo "[DRY RUN] $*" >> "${LOG_FILE}"
    fi
}

# Spinner for long operations
show_spinner() {
    local pid=$1
    local message="${2:-Processing...}"
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    
    while kill -0 $pid 2>/dev/null; do
        local temp=${spinstr#?}
        printf "\\r${CYAN}%c${NC} %s" "$spinstr" "$message"
        local spinstr=$temp${spinstr%"$temp"}
        sleep 0.1
    done
    printf "\\r"
}

# Progress bar
show_progress() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    local empty=$((width - filled))
    
    printf "\\r["
    printf "%${filled}s" | tr ' ' '='
    printf "%${empty}s" | tr ' ' '-'
    printf "] %3d%% (%d/%d)" $percentage $current $total
    
    if [[ $current -eq $total ]]; then
        echo ""
    fi
}

# Export all functions
export -f log_message
export -f log_debug
export -f log_info
export -f log_warning
export -f log_error
export -f log_critical
export -f log_success
export -f log_failure
export -f log_skip
export -f log_step
export -f log_header
export -f log_section
export -f log_subsection
export -f log_exec
export -f log_dry_run
export -f show_spinner
export -f show_progress
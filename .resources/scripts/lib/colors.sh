#!/bin/bash
# Color definitions for AI Coding Template Scripts
# Provides consistent color formatting across all scripts
# Usage: source scripts/lib/colors.sh

# Detect color support
if [[ -t 1 ]] && [[ "$(tput colors 2>/dev/null)" -ge 8 ]]; then
    # Terminal supports colors
    export COLOR_SUPPORT=true
    
    # Basic colors
    export RED='\033[0;31m'
    export GREEN='\033[0;32m'
    export YELLOW='\033[1;33m'
    export BLUE='\033[0;34m'
    export PURPLE='\033[0;35m'
    export CYAN='\033[0;36m'
    export WHITE='\033[0;37m'
    
    # Bright colors
    export BRIGHT_RED='\033[1;31m'
    export BRIGHT_GREEN='\033[1;32m'
    export BRIGHT_YELLOW='\033[1;33m'
    export BRIGHT_BLUE='\033[1;34m'
    export BRIGHT_PURPLE='\033[1;35m'
    export BRIGHT_CYAN='\033[1;36m'
    export BRIGHT_WHITE='\033[1;37m'
    
    # Background colors
    export BG_RED='\033[41m'
    export BG_GREEN='\033[42m'
    export BG_YELLOW='\033[43m'
    export BG_BLUE='\033[44m'
    export BG_PURPLE='\033[45m'
    export BG_CYAN='\033[46m'
    export BG_WHITE='\033[47m'
    
    # Formatting
    export BOLD='\033[1m'
    export DIM='\033[2m'
    export ITALIC='\033[3m'
    export UNDERLINE='\033[4m'
    export BLINK='\033[5m'
    export REVERSE='\033[7m'
    export HIDDEN='\033[8m'
    export STRIKETHROUGH='\033[9m'
    
    # Reset
    export NC='\033[0m' # No Color / Reset
    export RESET='\033[0m'
else
    # No color support - export empty strings
    export COLOR_SUPPORT=false
    export RED=''
    export GREEN=''
    export YELLOW=''
    export BLUE=''
    export PURPLE=''
    export CYAN=''
    export WHITE=''
    export BRIGHT_RED=''
    export BRIGHT_GREEN=''
    export BRIGHT_YELLOW=''
    export BRIGHT_BLUE=''
    export BRIGHT_PURPLE=''
    export BRIGHT_CYAN=''
    export BRIGHT_WHITE=''
    export BG_RED=''
    export BG_GREEN=''
    export BG_YELLOW=''
    export BG_BLUE=''
    export BG_PURPLE=''
    export BG_CYAN=''
    export BG_WHITE=''
    export BOLD=''
    export DIM=''
    export ITALIC=''
    export UNDERLINE=''
    export BLINK=''
    export REVERSE=''
    export HIDDEN=''
    export STRIKETHROUGH=''
    export NC=''
    export RESET=''
fi

# Emoji support detection
if [[ "$TERM_PROGRAM" == "vscode" ]] || [[ "$TERM" == "xterm-256color" ]] || [[ "$LC_ALL" == *"UTF-8"* ]] || [[ "$LANG" == *"UTF-8"* ]]; then
    export EMOJI_SUPPORT=true
    
    # Status emojis
    export EMOJI_SUCCESS="✅"
    export EMOJI_ERROR="❌"
    export EMOJI_WARNING="⚠️"
    export EMOJI_INFO="ℹ️"
    export EMOJI_ROCKET="🚀"
    export EMOJI_FIRE="🔥"
    export EMOJI_SPARKLES="✨"
    export EMOJI_BUG="🐛"
    export EMOJI_WRENCH="🔧"
    export EMOJI_PACKAGE="📦"
    export EMOJI_LOCK="🔒"
    export EMOJI_KEY="🔑"
    export EMOJI_SHIELD="🛡️"
    export EMOJI_ROBOT="🤖"
    export EMOJI_BRAIN="🧠"
    export EMOJI_CHART="📊"
    export EMOJI_CLOCK="⏰"
    export EMOJI_HOURGLASS="⏳"
    export EMOJI_CHECKMARK="✓"
    export EMOJI_CROSS="✗"
    export EMOJI_ARROW_RIGHT="→"
    export EMOJI_ARROW_LEFT="←"
    export EMOJI_ARROW_UP="↑"
    export EMOJI_ARROW_DOWN="↓"
    export EMOJI_FOLDER="📁"
    export EMOJI_FILE="📄"
    export EMOJI_SEARCH="🔍"
    export EMOJI_HAMMER="🔨"
    export EMOJI_GEAR="⚙️"
    export EMOJI_LIGHTBULB="💡"
else
    export EMOJI_SUPPORT=false
    
    # Fallback ASCII alternatives
    export EMOJI_SUCCESS="[OK]"
    export EMOJI_ERROR="[ERROR]"
    export EMOJI_WARNING="[WARN]"
    export EMOJI_INFO="[INFO]"
    export EMOJI_ROCKET="[START]"
    export EMOJI_FIRE="[HOT]"
    export EMOJI_SPARKLES="[NEW]"
    export EMOJI_BUG="[BUG]"
    export EMOJI_WRENCH="[FIX]"
    export EMOJI_PACKAGE="[PKG]"
    export EMOJI_LOCK="[LOCK]"
    export EMOJI_KEY="[KEY]"
    export EMOJI_SHIELD="[SEC]"
    export EMOJI_ROBOT="[AI]"
    export EMOJI_BRAIN="[THINK]"
    export EMOJI_CHART="[STAT]"
    export EMOJI_CLOCK="[TIME]"
    export EMOJI_HOURGLASS="[WAIT]"
    export EMOJI_CHECKMARK="[Y]"
    export EMOJI_CROSS="[N]"
    export EMOJI_ARROW_RIGHT="->"
    export EMOJI_ARROW_LEFT="<-"
    export EMOJI_ARROW_UP="^"
    export EMOJI_ARROW_DOWN="v"
    export EMOJI_FOLDER="[DIR]"
    export EMOJI_FILE="[FILE]"
    export EMOJI_SEARCH="[FIND]"
    export EMOJI_HAMMER="[BUILD]"
    export EMOJI_GEAR="[CONF]"
    export EMOJI_LIGHTBULB="[IDEA]"
fi

# Color printing functions
print_red() { echo -e "${RED}$*${NC}"; }
print_green() { echo -e "${GREEN}$*${NC}"; }
print_yellow() { echo -e "${YELLOW}$*${NC}"; }
print_blue() { echo -e "${BLUE}$*${NC}"; }
print_purple() { echo -e "${PURPLE}$*${NC}"; }
print_cyan() { echo -e "${CYAN}$*${NC}"; }
print_bold() { echo -e "${BOLD}$*${NC}"; }

# Color function for inline colored text
log_color() {
    local color="$1"
    shift
    case "$color" in
        "red") echo -ne "${RED}$*${NC}" ;;
        "green") echo -ne "${GREEN}$*${NC}" ;;
        "yellow") echo -ne "${YELLOW}$*${NC}" ;;
        "blue") echo -ne "${BLUE}$*${NC}" ;;
        "purple") echo -ne "${PURPLE}$*${NC}" ;;
        "cyan") echo -ne "${CYAN}$*${NC}" ;;
        "white") echo -ne "${WHITE}$*${NC}" ;;
        "bold") echo -ne "${BOLD}$*${NC}" ;;
        *) echo -ne "$*" ;;
    esac
}

# Export functions
export -f print_red
export -f print_green
export -f print_yellow
export -f print_blue
export -f print_purple
export -f print_cyan
export -f print_bold
export -f log_color
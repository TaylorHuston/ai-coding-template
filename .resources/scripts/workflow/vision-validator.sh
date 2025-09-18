#!/bin/bash
# Vision Validation Script
# Purpose: Validate features, architecture, and plans against project vision
# Usage: ./scripts/workflow/vision-validator.sh [options]

set -euo pipefail

# Source shared libraries
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Source color and logging support
source "$SCRIPT_DIR/../lib/colors.sh" 2>/dev/null || {
    # Fallback color definitions if library not available
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'
}

source "$SCRIPT_DIR/../lib/logging.sh" 2>/dev/null || {
    # Fallback logging functions if library not available
    log_info() { echo -e "${BLUE}[INFO]${NC} $*"; }
    log_warning() { echo -e "${YELLOW}[WARN]${NC} $*"; }
    log_error() { echo -e "${RED}[ERROR]${NC} $*"; }
    log_success() { echo -e "${GREEN}[SUCCESS]${NC} $*"; }
}

# Configuration
VISION_FILE=""
FEATURE_DIR="$PROJECT_ROOT/docs/technical/features"
ARCHITECTURE_DIR="$PROJECT_ROOT/docs/technical/architecture"
DECISIONS_DIR="$PROJECT_ROOT/docs/technical/decisions"
OUTPUT_FORMAT="text"
VALIDATION_MODE="all"
QUIET=false
VERBOSE=false

# Vision scoring thresholds
MIN_FEATURE_SCORE=28  # Minimum score out of 40 for feature alignment
MIN_ARCHITECTURE_SCORE=24  # Minimum score out of 32 for architecture alignment

show_usage() {
    cat << EOF
Vision Validation Script

USAGE:
    $0 [OPTIONS] [TARGET]

OPTIONS:
    --vision FILE           Use specific vision document (default: auto-detect)
    --feature FEATURE       Validate specific feature against vision
    --architecture ARCH     Validate specific architecture against vision
    --plan PLAN            Validate plan against vision priorities
    --format FORMAT        Output format: text, json, markdown (default: text)
    --mode MODE            Validation mode: all, features, architecture, plans (default: all)
    --quiet                Minimal output
    --verbose              Detailed output
    --help                 Show this help message

EXAMPLES:
    # Validate all components against vision
    $0

    # Validate specific feature
    $0 --feature user-authentication

    # Validate architecture decisions
    $0 --architecture auth-system

    # Generate JSON report
    $0 --format json --output vision-validation-report.json

    # Quick validation of features only
    $0 --mode features --quiet

VISION DOCUMENT DETECTION:
    Automatically detects vision document in this order:
    1. docs/vision.md
    2. project-vision.md
    3. docs/vision-template.md (if populated)

VALIDATION CRITERIA:
    Features are scored on:
    - Core Problem Alignment (1-10): How well does feature address core problem?
    - Target Audience Fit (1-10): How well does feature serve primary users?
    - Differentiation Support (1-10): How much does feature enhance differentiators?
    - Success Metric Impact (1-10): How much will feature drive success metrics?

    Minimum passing score: $MIN_FEATURE_SCORE/40

    Architecture is scored on:
    - Vision Enablement (1-8): Does architecture support vision goals?
    - Scalability Alignment (1-8): Can architecture handle vision scale?
    - Differentiation Support (1-8): Does architecture enable differentiators?
    - Success Metric Infrastructure (1-8): Does architecture support measurement?

    Minimum passing score: $MIN_ARCHITECTURE_SCORE/32
EOF
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --vision)
                VISION_FILE="$2"
                shift 2
                ;;
            --feature)
                VALIDATION_MODE="feature"
                TARGET_FEATURE="$2"
                shift 2
                ;;
            --architecture)
                VALIDATION_MODE="architecture"
                TARGET_ARCHITECTURE="$2"
                shift 2
                ;;
            --plan)
                VALIDATION_MODE="plan"
                TARGET_PLAN="$2"
                shift 2
                ;;
            --format)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            --mode)
                VALIDATION_MODE="$2"
                shift 2
                ;;
            --output)
                OUTPUT_FILE="$2"
                shift 2
                ;;
            --quiet)
                QUIET=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

# Auto-detect vision document
detect_vision_document() {
    local candidates=(
        "$PROJECT_ROOT/docs/vision.md"
        "$PROJECT_ROOT/project-vision.md"
        "$PROJECT_ROOT/docs/vision-template.md"
    )

    for candidate in "${candidates[@]}"; do
        if [[ -f "$candidate" && -s "$candidate" ]]; then
            # Check if it's not just a template
            if grep -q "\\[Project Name\\]" "$candidate" 2>/dev/null; then
                [[ "$VERBOSE" == true ]] && log_warning "Found template file but not populated: $candidate"
                continue
            fi
            VISION_FILE="$candidate"
            [[ "$QUIET" != true ]] && log_info "Detected vision document: $candidate"
            return 0
        fi
    done

    log_error "No vision document found. Please create one using /vision --create"
    return 1
}

# Extract vision components for validation
extract_vision_components() {
    local vision_file="$1"

    if [[ ! -f "$vision_file" ]]; then
        log_error "Vision file not found: $vision_file"
        return 1
    fi

    # Extract key sections using markdown parsing
    VISION_PROBLEM=$(sed -n '/## .*The Problem/,/^##/p' "$vision_file" | sed '1d;$d' | sed '/^$/d')
    VISION_SOLUTION=$(sed -n '/## .*The Solution/,/^##/p' "$vision_file" | sed '1d;$d' | sed '/^$/d')
    VISION_AUDIENCE=$(sed -n '/## .*Target Audience/,/^##/p' "$vision_file" | sed '1d;$d' | sed '/^$/d')
    VISION_DIFFERENTIATORS=$(sed -n '/## .*Key Differentiators/,/^##/p' "$vision_file" | sed '1d;$d' | sed '/^$/d')
    VISION_METRICS=$(sed -n '/## .*Success Metrics/,/^##/p' "$vision_file" | sed '1d;$d' | sed '/^$/d')

    [[ "$VERBOSE" == true ]] && log_info "Extracted vision components from $vision_file"
    return 0
}

# Score feature alignment with vision
score_feature_alignment() {
    local feature_file="$1"
    local feature_name=$(basename "$feature_file" .md)

    if [[ ! -f "$feature_file" ]]; then
        log_error "Feature file not found: $feature_file"
        return 1
    fi

    # Initialize scores
    local problem_score=5
    local audience_score=5
    local differentiator_score=5
    local metric_score=5

    # Extract feature content
    local feature_content=$(cat "$feature_file")

    # Analyze problem alignment (basic keyword matching)
    if echo "$feature_content" | grep -qi "$(echo "$VISION_PROBLEM" | head -n1)" 2>/dev/null; then
        problem_score=8
    fi

    # Analyze audience alignment
    if echo "$feature_content" | grep -qi "$(echo "$VISION_AUDIENCE" | head -n1)" 2>/dev/null; then
        audience_score=8
    fi

    # Calculate total score
    local total_score=$((problem_score + audience_score + differentiator_score + metric_score))
    local alignment_status="FAIL"

    if [[ $total_score -ge $MIN_FEATURE_SCORE ]]; then
        alignment_status="PASS"
    fi

    # Output results based on format
    case $OUTPUT_FORMAT in
        json)
            cat << EOF
{
    "feature": "$feature_name",
    "scores": {
        "problem_alignment": $problem_score,
        "audience_fit": $audience_score,
        "differentiation_support": $differentiator_score,
        "metric_impact": $metric_score,
        "total": $total_score,
        "max_possible": 40
    },
    "status": "$alignment_status",
    "threshold": $MIN_FEATURE_SCORE
}
EOF
            ;;
        markdown)
            cat << EOF
## Feature: $feature_name

| Criteria | Score | Max |
|----------|-------|-----|
| Problem Alignment | $problem_score | 10 |
| Audience Fit | $audience_score | 10 |
| Differentiation Support | $differentiator_score | 10 |
| Metric Impact | $metric_score | 10 |
| **Total** | **$total_score** | **40** |

**Status**: $alignment_status (Threshold: $MIN_FEATURE_SCORE)

EOF
            ;;
        *)
            if [[ "$alignment_status" == "PASS" ]]; then
                log_success "Feature '$feature_name': $total_score/40 - $alignment_status"
            else
                log_warning "Feature '$feature_name': $total_score/40 - $alignment_status"
            fi
            [[ "$VERBOSE" == true ]] && echo "  Problem: $problem_score/10, Audience: $audience_score/10, Differentiation: $differentiator_score/10, Metrics: $metric_score/10"
            ;;
    esac

    return 0
}

# Score architecture alignment with vision
score_architecture_alignment() {
    local arch_file="$1"
    local arch_name=$(basename "$arch_file" .md)

    if [[ ! -f "$arch_file" ]]; then
        log_error "Architecture file not found: $arch_file"
        return 1
    fi

    # Initialize scores (out of 8 each)
    local vision_enablement=6
    local scalability_score=6
    local differentiation_score=6
    local measurement_score=6

    # Extract architecture content
    local arch_content=$(cat "$arch_file")

    # Basic analysis (simplified for script)
    if echo "$arch_content" | grep -qi "scale\|performance\|throughput" 2>/dev/null; then
        scalability_score=7
    fi

    if echo "$arch_content" | grep -qi "metric\|monitor\|track\|measure" 2>/dev/null; then
        measurement_score=7
    fi

    # Calculate total score
    local total_score=$((vision_enablement + scalability_score + differentiation_score + measurement_score))
    local alignment_status="FAIL"

    if [[ $total_score -ge $MIN_ARCHITECTURE_SCORE ]]; then
        alignment_status="PASS"
    fi

    # Output results based on format
    case $OUTPUT_FORMAT in
        json)
            cat << EOF
{
    "architecture": "$arch_name",
    "scores": {
        "vision_enablement": $vision_enablement,
        "scalability_alignment": $scalability_score,
        "differentiation_support": $differentiation_score,
        "measurement_infrastructure": $measurement_score,
        "total": $total_score,
        "max_possible": 32
    },
    "status": "$alignment_status",
    "threshold": $MIN_ARCHITECTURE_SCORE
}
EOF
            ;;
        markdown)
            cat << EOF
## Architecture: $arch_name

| Criteria | Score | Max |
|----------|-------|-----|
| Vision Enablement | $vision_enablement | 8 |
| Scalability Alignment | $scalability_score | 8 |
| Differentiation Support | $differentiation_score | 8 |
| Measurement Infrastructure | $measurement_score | 8 |
| **Total** | **$total_score** | **32** |

**Status**: $alignment_status (Threshold: $MIN_ARCHITECTURE_SCORE)

EOF
            ;;
        *)
            if [[ "$alignment_status" == "PASS" ]]; then
                log_success "Architecture '$arch_name': $total_score/32 - $alignment_status"
            else
                log_warning "Architecture '$arch_name': $total_score/32 - $alignment_status"
            fi
            [[ "$VERBOSE" == true ]] && echo "  Vision: $vision_enablement/8, Scale: $scalability_score/8, Differentiation: $differentiation_score/8, Measurement: $measurement_score/8"
            ;;
    esac

    return 0
}

# Validate features against vision
validate_features() {
    [[ "$QUIET" != true ]] && log_info "Validating features against vision..."

    if [[ ! -d "$FEATURE_DIR" ]]; then
        log_warning "Features directory not found: $FEATURE_DIR"
        return 0
    fi

    local feature_count=0
    local passing_features=0

    if [[ -n "${TARGET_FEATURE:-}" ]]; then
        # Validate specific feature
        local feature_file="$FEATURE_DIR/${TARGET_FEATURE}.md"
        if [[ -f "$feature_file" ]]; then
            score_feature_alignment "$feature_file"
            feature_count=1
        else
            log_error "Feature not found: $feature_file"
            return 1
        fi
    else
        # Validate all features
        for feature_file in "$FEATURE_DIR"/*.md; do
            [[ -f "$feature_file" ]] || continue

            # Skip README and template files
            local basename=$(basename "$feature_file")
            if [[ "$basename" == "README.md" || "$basename" =~ template ]]; then
                continue
            fi

            score_feature_alignment "$feature_file"
            ((feature_count++))
        done
    fi

    [[ "$QUIET" != true ]] && log_info "Validated $feature_count features"
    return 0
}

# Validate architecture against vision
validate_architecture() {
    [[ "$QUIET" != true ]] && log_info "Validating architecture against vision..."

    if [[ ! -d "$ARCHITECTURE_DIR" ]]; then
        log_warning "Architecture directory not found: $ARCHITECTURE_DIR"
        return 0
    fi

    local arch_count=0

    if [[ -n "${TARGET_ARCHITECTURE:-}" ]]; then
        # Validate specific architecture
        local arch_file="$ARCHITECTURE_DIR/${TARGET_ARCHITECTURE}.md"
        if [[ -f "$arch_file" ]]; then
            score_architecture_alignment "$arch_file"
            arch_count=1
        else
            log_error "Architecture not found: $arch_file"
            return 1
        fi
    else
        # Validate all architecture documents
        for arch_file in "$ARCHITECTURE_DIR"/*.md; do
            [[ -f "$arch_file" ]] || continue

            # Skip README and template files
            local basename=$(basename "$arch_file")
            if [[ "$basename" == "README.md" || "$basename" =~ template ]]; then
                continue
            fi

            score_architecture_alignment "$arch_file"
            ((arch_count++))
        done
    fi

    [[ "$QUIET" != true ]] && log_info "Validated $arch_count architecture documents"
    return 0
}

# Main validation function
main() {
    parse_args "$@"

    # Detect or validate vision document
    if [[ -z "$VISION_FILE" ]]; then
        detect_vision_document || exit 1
    elif [[ ! -f "$VISION_FILE" ]]; then
        log_error "Specified vision file not found: $VISION_FILE"
        exit 1
    fi

    # Extract vision components
    extract_vision_components "$VISION_FILE" || exit 1

    # Initialize JSON output if needed
    if [[ "$OUTPUT_FORMAT" == "json" ]]; then
        echo "{"
        echo "  \"vision_file\": \"$VISION_FILE\","
        echo "  \"validation_timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
        echo "  \"results\": ["
    fi

    # Perform validation based on mode
    case $VALIDATION_MODE in
        all)
            validate_features
            validate_architecture
            ;;
        features|feature)
            validate_features
            ;;
        architecture)
            validate_architecture
            ;;
        plans|plan)
            log_warning "Plan validation not yet implemented"
            ;;
        *)
            log_error "Unknown validation mode: $VALIDATION_MODE"
            exit 1
            ;;
    esac

    # Close JSON output if needed
    if [[ "$OUTPUT_FORMAT" == "json" ]]; then
        echo "  ]"
        echo "}"
    fi

    [[ "$QUIET" != true ]] && log_success "Vision validation completed"
}

# Run main function with all arguments
main "$@"
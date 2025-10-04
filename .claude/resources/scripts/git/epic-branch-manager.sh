#!/bin/bash

# Epic Branch Manager
# Manages epic-driven branching workflow with hierarchical task structure
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validation functions
validate_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
}

validate_clean_working_tree() {
    if ! git diff-index --quiet HEAD --; then
        log_error "Working tree is not clean. Please commit or stash changes."
        exit 1
    fi
}

validate_branch_exists() {
    local branch_name="$1"
    if ! git show-ref --verify --quiet refs/heads/"$branch_name"; then
        log_error "Branch '$branch_name' does not exist"
        exit 1
    fi
}

validate_branch_not_exists() {
    local branch_name="$1"
    if git show-ref --verify --quiet refs/heads/"$branch_name"; then
        log_error "Branch '$branch_name' already exists"
        exit 1
    fi
}

# Get current epic from branch name
get_current_epic() {
    local current_branch=$(git branch --show-current)
    if [[ $current_branch =~ ^epic/(.+)$ ]]; then
        echo "${BASH_REMATCH[1]}"
    elif [[ $current_branch =~ ^task/[0-9]+-(.+)$ ]]; then
        # If on a task branch, try to find the epic
        local epic_branches=$(git branch --list "epic/*" | tr -d ' *')
        if [ $(echo "$epic_branches" | wc -l) -eq 1 ]; then
            echo "$epic_branches" | sed 's/epic\///'
        else
            echo ""
        fi
    else
        echo ""
    fi
}

# Check test coverage
check_test_coverage() {
    log_info "Checking test coverage..."

    # Try common test coverage commands
    if command -v npm &> /dev/null && [ -f "package.json" ]; then
        if npm run test:coverage --silent 2>/dev/null; then
            log_success "Test coverage check passed"
            return 0
        fi
    fi

    if command -v pytest &> /dev/null; then
        if pytest --cov=. --cov-report=term-missing --cov-fail-under=95 2>/dev/null; then
            log_success "Test coverage check passed"
            return 0
        fi
    fi

    log_warning "Could not verify test coverage automatically"
    read -p "Has test coverage been verified manually (95%+)? [y/N]: " response
    if [[ $response =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Update EPIC.md task status
update_epic_task_status() {
    local epic_name="$1"
    local task_number="$2"
    local status="$3"  # "completed" or "in_progress"

    local epic_file="epics/${epic_name}/EPIC.md"

    if [ -f "$epic_file" ]; then
        log_info "Updating EPIC.md task status..."

        if [ "$status" = "completed" ]; then
            # Mark task as completed
            sed -i "s/- \[ \] TASK-${task_number}:/- \[x\] TASK-${task_number}:/" "$epic_file"
            log_success "Marked TASK-${task_number} as completed in $epic_file"
        fi
    else
        log_warning "EPIC.md not found at $epic_file"
    fi
}

# Create epic branch
create_epic_branch() {
    local epic_name="$1"

    if [ -z "$epic_name" ]; then
        log_error "Epic name is required"
        echo "Usage: $0 create-epic-branch <epic-name>"
        exit 1
    fi

    validate_git_repo
    validate_clean_working_tree

    local branch_name="epic/${epic_name}"
    validate_branch_not_exists "$branch_name"

    log_info "Creating epic branch: $branch_name"

    # Ensure we're on develop and up to date
    git checkout develop
    git pull origin develop

    # Create epic branch
    git checkout -b "$branch_name"
    git push -u origin "$branch_name"

    log_success "Epic branch '$branch_name' created successfully"
    log_info "You can now create task branches with: $0 create-task-branch <task-number> <task-name>"
}

# Create task branch
create_task_branch() {
    local task_number="$1"
    local task_name="$2"
    local epic_name="$3"

    if [ -z "$task_number" ] || [ -z "$task_name" ]; then
        log_error "Task number and name are required"
        echo "Usage: $0 create-task-branch <task-number> <task-name> [epic-name]"
        exit 1
    fi

    validate_git_repo
    validate_clean_working_tree

    # If epic name not provided, try to detect from current context
    if [ -z "$epic_name" ]; then
        epic_name=$(get_current_epic)
        if [ -z "$epic_name" ]; then
            log_error "Could not determine epic. Please specify epic name or switch to an epic branch"
            exit 1
        fi
    fi

    local epic_branch="epic/${epic_name}"
    local task_branch="task/${task_number}-${task_name}"

    validate_branch_exists "$epic_branch"
    validate_branch_not_exists "$task_branch"

    log_info "Creating task branch: $task_branch from $epic_branch"

    # Switch to epic branch and update
    git checkout "$epic_branch"
    git pull origin "$epic_branch"

    # Create task branch
    git checkout -b "$task_branch"
    git push -u origin "$task_branch"

    log_success "Task branch '$task_branch' created successfully"
    log_info "Start development with test-first approach (TDD/BDD)"
    log_info "When complete, use: $0 merge-task $task_number"
}

# Merge task back to epic (using existing /merge-branch command)
merge_task() {
    local task_number="$1"
    local epic_name="$2"

    if [ -z "$task_number" ]; then
        log_error "Task number is required"
        echo "Usage: $0 merge-task <task-number> [epic-name]"
        exit 1
    fi

    validate_git_repo

    # If epic name not provided, try to detect from current context
    if [ -z "$epic_name" ]; then
        epic_name=$(get_current_epic)
        if [ -z "$epic_name" ]; then
            log_error "Could not determine epic. Please specify epic name"
            exit 1
        fi
    fi

    local task_pattern="task/${task_number}-"
    local epic_branch="epic/${epic_name}"

    # Find the actual task branch name
    local task_branch=$(git branch --list "${task_pattern}*" | tr -d ' *' | head -1)

    if [ -z "$task_branch" ]; then
        log_error "No task branch found matching pattern: ${task_pattern}*"
        exit 1
    fi

    validate_branch_exists "$epic_branch"
    validate_branch_exists "$task_branch"

    log_info "Merging task: $task_branch → $epic_branch"
    log_info "Using /merge-branch command for safe merge with quality gates..."

    # Switch to task branch for merge
    git checkout "$task_branch"

    # Use the existing /merge-branch command which handles:
    # - Pre-merge validation
    # - Quality gates (tests, linting, type checking)
    # - Safe merge execution
    # - Test coverage validation
    log_info "Executing: /merge-branch $epic_branch"
    echo "Please run: /merge-branch $epic_branch"
    echo "This will:"
    echo "  - Validate tests and coverage (95%+ required)"
    echo "  - Run quality gates (linting, type checking)"
    echo "  - Safely merge to $epic_branch"
    echo "  - Handle any conflicts"
    echo ""
    echo "After successful merge, run: $0 cleanup-task $task_number $epic_name"

    exit 0
}

# Complete epic and merge to develop (using existing /merge-branch command)
complete_epic() {
    local epic_name="$1"

    if [ -z "$epic_name" ]; then
        epic_name=$(get_current_epic)
        if [ -z "$epic_name" ]; then
            log_error "Epic name is required or switch to an epic branch"
            echo "Usage: $0 complete-epic [epic-name]"
            exit 1
        fi
    fi

    validate_git_repo

    local epic_branch="epic/${epic_name}"
    validate_branch_exists "$epic_branch"

    log_info "Completing epic: $epic_branch → develop"

    # Switch to epic branch
    git checkout "$epic_branch"

    # Verify all tasks are complete by checking for open task branches
    local open_tasks=$(git branch --list "task/*" | wc -l)
    if [ "$open_tasks" -gt 0 ]; then
        log_warning "There are still open task branches. Please complete all tasks before finishing epic."
        git branch --list "task/*"
        read -p "Continue anyway? [y/N]: " response
        if [[ ! $response =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    log_info "Using /merge-branch command for safe epic completion..."
    echo "Please run: /merge-branch develop"
    echo "This will:"
    echo "  - Run final test suite (95%+ coverage required)"
    echo "  - Execute comprehensive quality gates"
    echo "  - Safely merge epic to develop"
    echo "  - Handle any conflicts"
    echo ""
    echo "After successful merge, run: $0 cleanup-epic $epic_name"

    exit 0
}

# Cleanup task after successful merge
cleanup_task() {
    local task_number="$1"
    local epic_name="$2"

    if [ -z "$task_number" ] || [ -z "$epic_name" ]; then
        log_error "Task number and epic name are required"
        echo "Usage: $0 cleanup-task <task-number> <epic-name>"
        exit 1
    fi

    local task_pattern="task/${task_number}-"
    local task_branch=$(git branch --list "${task_pattern}*" | tr -d ' *' | head -1)

    if [ -n "$task_branch" ]; then
        # Delete local task branch
        git branch -d "$task_branch" 2>/dev/null || true
        log_success "Deleted local task branch: $task_branch"
    fi

    # Update EPIC.md task status
    update_epic_task_status "$epic_name" "$task_number" "completed"

    log_success "Task cleanup completed"
}

# Cleanup epic after successful merge
cleanup_epic() {
    local epic_name="$1"

    if [ -z "$epic_name" ]; then
        log_error "Epic name is required"
        echo "Usage: $0 cleanup-epic <epic-name>"
        exit 1
    fi

    local epic_branch="epic/${epic_name}"

    # Delete local epic branch
    git branch -d "$epic_branch" 2>/dev/null || true

    log_success "Epic '$epic_name' cleanup completed"
    log_info "Epic implementation is now part of develop branch"
}

# List epic status
list_epic_status() {
    validate_git_repo

    echo "=== Epic Branch Status ==="

    # List all epic branches
    local epic_branches=$(git branch -a --list "*epic/*" | sed 's/^[ *]*//' | sed 's/remotes\/origin\///' | sort -u)

    if [ -z "$epic_branches" ]; then
        log_info "No epic branches found"
        return
    fi

    for epic_branch in $epic_branches; do
        local epic_name=$(echo "$epic_branch" | sed 's/epic\///')
        echo ""
        echo "Epic: $epic_name"
        echo "Branch: $epic_branch"

        # List task branches for this epic
        local task_branches=$(git branch -a --list "*task/*" | sed 's/^[ *]*//' | sed 's/remotes\/origin\///' | sort -u)

        if [ -n "$task_branches" ]; then
            echo "Tasks:"
            for task_branch in $task_branches; do
                echo "  - $task_branch"
            done
        else
            echo "Tasks: None"
        fi

        # Check for EPIC.md
        local epic_file="epics/${epic_name}/EPIC.md"
        if [ -f "$epic_file" ]; then
            echo "Epic file: $epic_file (exists)"
        else
            echo "Epic file: $epic_file (missing)"
        fi
    done
}

# Help function
show_help() {
    echo "Epic Branch Manager - Hierarchical Git Workflow"
    echo ""
    echo "Usage: $0 <command> [arguments]"
    echo ""
    echo "Commands:"
    echo "  create-epic-branch <epic-name>           Create new epic branch from develop"
    echo "  create-task-branch <###> <name> [epic]   Create task branch from epic"
    echo "  merge-task <###> [epic]                  Setup for task merge (use /merge-branch after)"
    echo "  complete-epic [epic-name]                Setup for epic completion (use /merge-branch after)"
    echo "  cleanup-task <###> <epic>                Cleanup after successful task merge"
    echo "  cleanup-epic <epic-name>                 Cleanup after successful epic merge"
    echo "  status                                   Show status of all epics and tasks"
    echo "  help                                     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 create-epic-branch user-authentication"
    echo "  $0 create-task-branch 001 database-setup"
    echo "  $0 merge-task 001          # Then run: /merge-branch epic/user-authentication"
    echo "  $0 cleanup-task 001 user-authentication"
    echo "  $0 complete-epic           # Then run: /merge-branch develop"
    echo "  $0 cleanup-epic user-authentication"
    echo ""
    echo "Workflow Integration:"
    echo "  - This script manages epic/task branch creation and setup"
    echo "  - Use existing /merge-branch command for safe merging with quality gates"
    echo "  - /merge-branch enforces 95%+ test coverage and comprehensive validation"
}

# Main command handler
main() {
    case "${1:-}" in
        "create-epic-branch")
            create_epic_branch "$2"
            ;;
        "create-task-branch")
            create_task_branch "$2" "$3" "$4"
            ;;
        "merge-task")
            merge_task "$2" "$3"
            ;;
        "complete-epic")
            complete_epic "$2"
            ;;
        "cleanup-task")
            cleanup_task "$2" "$3"
            ;;
        "cleanup-epic")
            cleanup_epic "$2"
            ;;
        "status")
            list_epic_status
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
---
description: Enhanced project status with intelligent context analysis
argument-hint: [--format FORMAT] [--scope SCOPE] [--ai-format] [--detailed]
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, TodoWrite, Task
model: sonnet
---

# Project Status Command

Enhanced project status dashboard with intelligent analysis using context-analyzer agent and ai-status.sh integration.

## Usage

```bash
# Basic intelligent status report
/status

# AI-optimized format for assistants
/status --ai-format

# Enhanced with memory insights and personalization
/status --with-memory

# Detailed analysis with recommendations
/status --detailed

# Specific scope analysis
/status --scope git
/status --scope project
/status --scope environment

# JSON output for programmatic use
/status --format json
```

## Features

### Intelligent Context Analysis

Uses **context-analyzer** agent to provide deep insights beyond basic status:

- **Git Repository Analysis**: Branch strategy assessment, commit patterns, merge conflicts
- **Project Health Assessment**: Code quality trends, technical debt indicators
- **Workflow State Analysis**: Current workflow phase, task progress, blockers
- **Development Patterns**: Team productivity metrics, code review patterns
- **Environment Consistency**: Development environment validation, dependency issues

### Enhanced Status Dimensions

```yaml
status_dimensions:
  git_intelligence:
    basic: [branch, commits, status]
    enhanced: [branch_strategy_analysis, commit_pattern_insights, merge_conflict_prediction]
    agent: context-analyzer

  project_health:
    basic: [file_counts, directory_structure]
    enhanced: [code_quality_trends, technical_debt_assessment, architecture_health]
    agent: context-analyzer

  workflow_state:
    basic: [current_files, recent_changes]
    enhanced: [workflow_phase_analysis, task_progress_insights, blocker_identification]
    agent: context-analyzer

  environment_analysis:
    basic: [tools, dependencies]
    enhanced: [environment_consistency, dependency_vulnerability_assessment, toolchain_optimization]
    agent: context-analyzer

  development_insights:
    basic: [recent_activity]
    enhanced: [productivity_patterns, collaboration_insights, quality_trends]
    agent: context-analyzer
```

## Status Formats

### Standard Format (Human-Readable)
- Clean, colorized output with visual indicators
- Key metrics highlighted with emojis
- Actionable recommendations
- Priority issue flagging

### AI-Optimized Format
- Structured text format optimized for AI consumption
- Complete context preservation
- Machine-readable status indicators
- Integration-ready data structure

### Detailed Analysis Format
- Comprehensive analysis with trend data
- Historical context and patterns
- Detailed recommendations with rationale
- Risk assessment and mitigation suggestions

### JSON Format
- Complete programmatic access to all status data
- Integration with CI/CD pipelines
- API-ready data structure
- Historical data preservation

## Integration with ai-status.sh

Intelligently orchestrates the existing ai-status.sh script:

```yaml
script_integration:
  basic_data_collection:
    script: ai-status.sh
    purpose: "Gather raw project status data"

  intelligent_analysis:
    agent: context-analyzer
    purpose: "Analyze patterns and provide insights"

  enhanced_reporting:
    coordination: "Agent processes script output for intelligent insights"
    format_options: [human, ai-optimized, detailed, json]
```

## Status Categories

### 🏗️ Project Architecture Status
- Architecture health assessment
- Design pattern consistency analysis
- Technical debt identification
- Scalability risk assessment

### 🔧 Development Environment Status
- Tool compatibility analysis
- Dependency security assessment
- Environment consistency validation
- Performance optimization opportunities

### 📊 Workflow Efficiency Status
- Current workflow phase analysis
- Task completion rate trends
- Quality gate effectiveness
- Collaboration pattern insights

### 🚀 Deployment Readiness Status
- Code quality gate validation
- Security compliance assessment
- Performance benchmark status
- Documentation completeness check

## Examples

### Basic Intelligent Status
```bash
/status
# → context-analyzer processes ai-status.sh output
# → Provides intelligent insights on project health
# → Highlights priority issues and recommendations
# → Shows workflow state and next suggested actions
```

### AI Assistant Context Refresh
```bash
/status --ai-format
# → Optimized format for AI context understanding
# → Complete project state for session continuity
# → Integration-ready status information
# → Context preservation for workflow commands
```

### Memory-Enhanced Status
```bash
/status --with-memory
# → Includes user preferences and historical patterns
# → Agent effectiveness analytics for optimal selection
# → Cross-project insights and successful patterns
# → Personalized recommendations based on past outcomes
```

### Detailed Project Analysis
```bash
/status --detailed
# → Comprehensive analysis with historical trends
# → Risk assessment with mitigation strategies
# → Productivity insights and optimization suggestions
# → Quality trend analysis with predictions
```

### Scope-Specific Analysis
```bash
/status --scope git --detailed
# → Deep git repository analysis
# → Branch strategy assessment
# → Commit pattern insights
# → Merge conflict risk analysis
```

## Intelligent Insights

The context-analyzer agent provides enhanced insights:

### 🎯 Predictive Analysis
- Risk identification before issues occur
- Quality trend prediction
- Resource bottleneck forecasting
- Technical debt accumulation patterns

### 📈 Pattern Recognition
- Development velocity patterns
- Code quality correlation analysis
- Team collaboration effectiveness
- Workflow optimization opportunities

### 🛠️ Actionable Recommendations
- Priority-ranked improvement suggestions
- Automated fix opportunities identification
- Workflow optimization recommendations
- Tool and process enhancement suggestions

### 🔍 Context-Aware Insights
- Project phase-appropriate recommendations
- Team size and experience considerations
- Technology stack optimization suggestions
- Business impact assessment of technical issues

## Integration with Core Workflow

### During `/idea` Phase
- Architecture readiness assessment
- Technical feasibility insights
- Risk factor identification

### During `/plan` Phase
- Resource availability analysis
- Complexity assessment validation
- Implementation readiness check

### During `/iterate` Phase
- Progress tracking with velocity insights
- Quality gate effectiveness monitoring
- Blocker identification and resolution suggestions

## Status Report Structure

```yaml
report_structure:
  executive_summary:
    overall_health: [score, trend, key_issues]
    priority_actions: [immediate, short_term, long_term]

  technical_details:
    git_status: [branch_analysis, commit_insights, merge_readiness]
    project_health: [code_quality, architecture, dependencies]
    environment: [tools, consistency, optimization]

  insights_and_recommendations:
    patterns: [development_velocity, quality_trends, collaboration]
    predictions: [risk_assessment, trend_forecasting]
    actions: [automated_fixes, process_improvements, tool_optimization]

  workflow_context:
    current_phase: [active_tasks, completion_status, next_steps]
    context_preservation: [session_state, workflow_continuity]
```

## Benefits Over Basic Status

✅ **Intelligent Analysis**: Context-analyzer provides deep insights beyond raw data
✅ **Predictive Capabilities**: Identifies issues before they become problems
✅ **Actionable Recommendations**: Specific, prioritized improvement suggestions
✅ **Context Preservation**: Perfect integration with AI workflow commands
✅ **Pattern Recognition**: Identifies trends and optimization opportunities
✅ **Risk Assessment**: Proactive identification of potential blockers and issues
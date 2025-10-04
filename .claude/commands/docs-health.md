---
version: "1.0.0"
created: "2025-09-23"
last_updated: "2025-09-23"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["documentation", "health", "metrics", "dashboard"]
description: "Comprehensive documentation health analysis with metrics and visual dashboard"
argument-hint: "[\"natural language instruction\"]"
allowed-tools: ["Read", "Bash", "Grep", "Glob", "TodoWrite", "Task"]
model: claude-sonnet-4-5
---

# /docs-health Command

**Purpose**: Provide comprehensive documentation health analysis with detailed metrics, quality scoring, and visual dashboard reporting.

## Usage

```bash
/docs-health "complete documentation health analysis"
/docs-health "quick health check for project status"
/docs-health "detailed metrics and coverage analysis"
/docs-health "health dashboard for team review"
/docs-health "analyze documentation quality and completeness"
```

## Arguments

| Variable | Type | Description |
|----------|------|-------------|
| `$ARGUMENTS` | string | Natural language instruction describing health analysis scope and detail level |

## Prerequisites

- [ ] Documentation files accessible across project
- [ ] Health analysis scripts available (`docs-health.js`)
- [ ] Project structure for coverage analysis
- [ ] Git history for freshness metrics

## Agent Coordination

**Primary**: technical-writer _(health analysis coordination)_
**Supporting**: data-analyst _(metrics calculation)_, context-analyzer _(coverage analysis)_

## Context

- All documentation files: `docs/`, `.claude/`, `.claude/resources/`, project root
- Health analysis scripts: `docs-health.js`, `docs-manager.sh health`
- Documentation guidelines and quality standards
- Project structure for coverage calculation
- Git history for freshness and maintenance metrics

## Instructions

1. **Parse health analysis instruction**
   - Identify analysis scope (quick check, comprehensive, specific metrics)
   - Understand reporting requirements and audience
   - Determine detail level and dashboard format

2. **Execute health analysis scripts**
   - Run `docs-health.js` for comprehensive metrics
   - Execute `docs-manager.sh health` for structural analysis
   - Gather coverage and quality data

3. **Coordinate with technical-writer**
   - Analyze documentation quality and completeness
   - Generate health scores and recommendations
   - Create visual health dashboard

4. **Calculate comprehensive metrics**
   - Documentation coverage across project areas
   - Quality scores based on guidelines adherence
   - Freshness analysis using Git history
   - Link integrity and cross-reference health

5. **Generate health dashboard**
   - Visual representation of health metrics
   - Prioritized maintenance recommendations
   - Trend analysis and improvement tracking

## Output

**Health Dashboard**: Visual overview of documentation health with key metrics
**Quality Metrics**: Detailed scoring across coverage, freshness, and consistency
**Coverage Analysis**: Documentation completeness across project areas
**Maintenance Recommendations**: Prioritized list of improvements with impact assessment

**File Locations**:
- Health reports: Generated dashboard and detailed metrics
- Analysis data: Supporting data and trend information

**Related**: `/docs-validate` → **`/docs-health`** → `/docs-update`

### Usage Examples

**Natural Language Health Analysis Instructions**:
- `/docs-health "comprehensive health check for quarterly review"` → Full dashboard with trends and recommendations
- `/docs-health "quick status for team standup"` → Concise health summary with key metrics
- `/docs-health "detailed coverage analysis for missing documentation"` → Focus on completeness and gaps
- `/docs-health "health metrics before major release"` → Release-readiness assessment
- `/docs-health "visual dashboard for stakeholder presentation"` → Presentation-ready health overview

**Key Features**:
- **Natural language** parsing for flexible analysis scope
- **Comprehensive metrics** including coverage, quality, and freshness
- **Visual dashboard** for easy health status communication
- **Trend analysis** showing improvement over time
- **Actionable recommendations** prioritized by impact and effort
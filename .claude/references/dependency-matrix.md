---
title: "Dependency Matrix"
version: "0.2.1"
created: "2025-09-19"
last_updated: "2025-09-19"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "reference"
tags: ["dependencies", "agents", "commands", "scripts", "templates"]
---

# Dependency Matrix

This document maps the dependencies between agents, commands, scripts, and templates in the AI coding template system.

## Recent Updates (v0.2.0)

**Integration Enhancements:**
- **Complexity Analysis**: `smart-task-decomposition.sh` now integrated into `/plan` command for automatic task complexity assessment
- **Context Distillation**: Context filtering logic integrated into `/develop` command for domain-specific agent briefings
- **Seamless Workflow**: Scripts marked as "(integrated)" are automatically invoked by commands, requiring no manual execution

## Overview

- **Agents**: Specialized AI agents for different domains
- **Commands**: Slash commands available in Claude Code
- **Scripts**: Automation scripts in `.resources/scripts/`
- **Templates**: File templates in `.resources/templates/`

## Agent Dependencies

| Agent | Primary Scripts | Supporting Scripts | Commands Used | Templates Used |
| --- | --- | --- | --- | --- |
| **brief-strategist** | - | project-brief-validator.sh | /design | project-brief.template.md |
| **code-architect** | - | validate-quality-gates.sh | /architect | adr.template.md |
| **frontend-specialist** | validate-quality-gates.sh | - | /develop | - |
| **backend-specialist** | validate-quality-gates.sh | - | /develop | - |
| **database-specialist** | validate-quality-gates.sh | - | /develop | - |
| **test-engineer** | validate-quality-gates.sh, validate-agent-output.sh | remediation-advisor.sh, smart-task-decomposition.sh | /develop, /test-fix | testing-task.template.md |
| **ui-specialist** | - | smart-task-decomposition.sh | - | - |
| **integration-specialist** | - | smart-task-decomposition.sh | - | - |
| **qa-specialist** | - | remediation-advisor.sh | - | - |
| **infrastructure-specialist** | - | remediation-advisor.sh | - | - |
| **code-reviewer** | validate-quality-gates.sh, remediation-advisor.sh | validate-context.sh | /review | - |
| **security-auditor** | validate-quality-gates.sh | - | /security-audit | - |
| **performance-optimizer** | validate-quality-gates.sh | - | /develop | - |
| **devops-engineer** | validate-quality-gates.sh | setup-git-hooks.sh | /develop | - |
| **technical-writer** | docs-manager.sh, check-docs-links.js | docs-health.js, generate-doc.js | /docs | documentation templates |
| **context-analyzer** | - | - | /refresh | - |
| **project-manager** | - | validate-agent-output.sh | /status, /plan | epic.template.md, task.template.md |
| **api-designer** | validate-quality-gates.sh | - | /architect | - |
| **refactoring-specialist** | validate-quality-gates.sh | remediation-advisor.sh | /develop | - |
| **migration-specialist** | validate-quality-gates.sh | - | /develop | - |
| **data-analyst** | - | metrics scripts | /status | - |
| **ai-llm-expert** | - | - | /design, /architect | - |

## Command Dependencies

| Command | Required Scripts | Optional Scripts | Templates Used | Agents Invoked |
| --- | --- | --- | --- | --- |
| **/design** | - | project-brief-validator.sh | project-brief.template.md, epic.template.md, task.template.md | brief-strategist, project-manager |
| **/architect** | - | validate-quality-gates.sh | adr.template.md | code-architect, api-designer |
| **/plan** | smart-task-decomposition.sh (integrated) | - | task.template.md, handoff.template.yml | project-manager, context-analyzer |
| **/develop** | validate-quality-gates.sh | remediation-advisor.sh, smart-task-decomposition.sh (integrated) | - | domain specialists |
| **/quality** | validate-quality-gates.sh | validate-agent-output.sh, remediation-advisor.sh | - | code-reviewer, test-engineer |
| **/review** | validate-quality-gates.sh | remediation-advisor.sh | - | code-reviewer |
| **/security-audit** | validate-quality-gates.sh | - | - | security-auditor |
| **/test-fix** | validate-quality-gates.sh | - | testing-task.template.md | test-engineer |
| **/commit** | - | check-changelog.sh | - | - |
| **/merge-branch** | - | validate-quality-gates.sh | - | - |
| **/status** | ai-status.sh | metrics scripts | - | context-analyzer, data-analyst |
| **/docs** | docs-manager.sh, check-docs-links.js | docs-health.js, generate-doc.js, auto-docs-generator.js | documentation templates | technical-writer |
| **/refresh** | - | ai-status.sh | - | context-analyzer |

## Script Dependencies

### Core Infrastructure Scripts

| Script | Used By Agents | Used By Commands | Dependencies | Purpose |
| --- | --- | --- | --- | --- |
| **ai-status.sh** | context-analyzer, data-analyst | /status, /refresh | - | Project status reporting |
| **setup-manager.sh** | devops-engineer | - | - | Environment setup |
| **validate-quality-gates.sh** | all specialists | /develop, /quality, /review | - | Quality validation |

### Documentation Scripts

| Script | Used By Agents | Used By Commands | Dependencies | Purpose |
| --- | --- | --- | --- | --- |
| **docs-manager.sh** | technical-writer | /docs | check-docs-links.js | Documentation management |
| **check-docs-links.js** | technical-writer | /docs | - | Link validation |
| **docs-health.js** | technical-writer | /docs | - | Documentation health analysis |
| **docs-tool.js** | technical-writer | - | - | Documentation utilities |
| **docs-changelog.js** | technical-writer | - | - | Documentation change tracking |
| **generate-doc.js** | technical-writer | /docs | templates | Document generation |
| **auto-docs-generator.js** | technical-writer | /docs auto | templates | Automated documentation |

### Quality & Validation Scripts

| Script | Used By Agents | Used By Commands | Dependencies | Purpose |
| --- | --- | --- | --- | --- |
| **validate-agent-output.sh** | test-engineer, project-manager | /quality | - | Agent output validation |
| **validate-context.sh** | code-reviewer | - | - | Context file validation |
| **validate.js** | - | - | - | Generic validation utilities |
| **template-usage-check.sh** | - | - | - | Template usage validation |
| **validate-links-ci.sh** | - | - | check-docs-links.js | CI link validation |

### Workflow & Planning Scripts

| Script | Used By Agents | Used By Commands | Dependencies | Purpose |
| --- | --- | --- | --- | --- |
| **remediation-advisor.sh** | test-engineer, code-reviewer, refactoring-specialist | /quality, /develop | - | Issue resolution suggestions |
| **smart-task-decomposition.sh** | test-engineer, ui-specialist, integration-specialist | /plan (integrated), /develop (integrated) | - | Task complexity analysis and decomposition |
| **project-brief-validator.sh** | brief-strategist | /design | - | Project brief validation |

### Git & Release Scripts

| Script | Used By Agents | Used By Commands | Dependencies | Purpose |
| --- | --- | --- | --- | --- |
| **epic-branch-manager.sh** | project-manager | - | - | Epic-driven branch management |
| **setup-git-hooks.sh** | devops-engineer | - | hook scripts | Git hooks setup |
| **release.sh** | - | /commit | changelog scripts | Release management |
| **ai-update-changelog.sh** | - | /commit | - | Changelog management |
| **ai-changelog-audit.sh** | - | - | - | Changelog completeness audit |
| **check-changelog.sh** | - | /commit | - | Changelog validation |
| **changelog-tool.js** | - | - | - | Changelog manipulation utilities |

### Status & Metrics Scripts

| Script | Used By Agents | Used By Commands | Dependencies | Purpose |
| --- | --- | --- | --- | --- |
| **status-updater.sh** | - | - | - | Status updating utilities |
| **generate-report.sh** | data-analyst | /status | metrics-collector.sh | Metrics report generation |
| **query-metrics.sh** | data-analyst | /status | - | Metrics data querying |
| **metrics-collector.sh** | data-analyst | - | - | Core metrics collection |
| **agent-metrics.sh** | data-analyst | - | - | Agent performance metrics |
| **command-metrics.sh** | data-analyst | - | - | Command usage metrics |
| **wrap-script.sh** | - | - | - | Script execution tracking |

### Shared Utility Scripts

| Script | Used By Agents | Used By Commands | Dependencies | Purpose |
| --- | --- | --- | --- | --- |
| **colors.sh** | All (via other scripts) | - | - | Color output utilities |
| **logging.sh** | All (via other scripts) | - | colors.sh | Logging framework |
| **common.js** | - | - | - | Shared JavaScript utilities |

## Template Dependencies

### Core Workflow Templates

| Template | Used By Commands | Used By Agents | Location | Purpose |
| --- | --- | --- | --- | --- |
| **project-brief.template.md** | /design | brief-strategist | docs/project/ | Project brief structure |
| **epic.template.md** | /design | project-manager | workflow/epic/ | Epic overview structure |
| **task.template.md** | /design, /plan | project-manager | workflow/epic/ | Task/user story structure |
| **handoff.template.yml** | /plan | project-manager | workflow/epic/ | Task handoff metadata |
| **research.template.md** | /plan | context-analyzer | workflow/epic/ | Research documentation |
| **testing-task.template.md** | /test-fix | test-engineer | workflow/epic/ | Testing task structure |

### Architecture & Documentation Templates

| Template | Used By Commands | Used By Agents | Location | Purpose |
| --- | --- | --- | --- | --- |
| **adr.template.md** (epic) | /architect | code-architect | workflow/epic/ | Architecture decisions |
| **adr-detailed.template.md** | /architect | code-architect | architecture/ | Detailed architecture decisions |
| **adr-fast-track.template.md** | /architect | code-architect | architecture/ | Quick architecture decisions |
| **architecture.template.md** | /architect | code-architect | workflow/architecture/ | Architecture documentation |
| **api.template.md** | /docs | technical-writer | docs/api/ | API documentation |
| **api-reference.template.md** | /docs | technical-writer | docs/technical/ | API reference docs |

### Project Management Templates

| Template | Used By Commands | Used By Agents | Location | Purpose |
| --- | --- | --- | --- | --- |
| **CHANGELOG.template.md** | /commit | - | docs/project/ | Changelog structure |
| **deliverable.template.md** | /design | project-manager | workflow/deliverables/ | Deliverable planning |
| **bug.template.md** | - | test-engineer | workflow/bugs/ | Bug reporting structure |
| **handoff.template.yml** (bugs) | - | project-manager | workflow/bugs/ | Bug handoff metadata |

### Exploration & Research Templates

| Template | Used By Commands | Used By Agents | Location | Purpose |
| --- | --- | --- | --- | --- |
| **conversation.template.md** | - | context-analyzer | workflow/exploration/ | Conversation documentation |
| **notes.template.md** | - | context-analyzer | workflow/exploration/ | Research notes |
| **specialist-inputs.template.md** | - | all specialists | workflow/exploration/ | Expert input collection |
| **state.template.yml** | - | context-analyzer | workflow/exploration/ | State tracking |
| **context-management.template.md** | - | context-analyzer | workflow/ | Context management |
| **decision-ledger.template.yml** | - | code-architect | workflow/ | Decision tracking |

### Implementation & Development Templates

| Template | Used By Commands | Used By Agents | Location | Purpose |
| --- | --- | --- | --- | --- |
| **implementation-record.template.md** | /develop | all specialists | workflow/implementation/ | Implementation tracking |

### CI/CD & Configuration Templates

| Template | Used By Commands | Used By Agents | Location | Purpose |
| --- | --- | --- | --- | --- |
| **github-actions-link-validation.yml** | - | devops-engineer | ci-cd/ | GitHub Actions workflow |
| **gitlab-ci-link-validation.yml** | - | devops-engineer | ci-cd/ | GitLab CI configuration |
| **pre-commit-config.yaml** | - | devops-engineer | ci-cd/ | Pre-commit hooks config |

### Meta Templates

| Template | Used By Commands | Used By Agents | Location | Purpose |
| --- | --- | --- | --- | --- |
| **template-format-reference.md** | - | technical-writer | templates/ | Template creation guide |
| **yaml-frontmatter-schema.md** | - | technical-writer | docs/development/ | YAML frontmatter specification |

## Hook Dependencies

| Hook Script | Event | Purpose | Dependencies |
| --- | --- | --- | --- |
| **pre-task-validation.sh** | PreToolUse (Task) | Validate before agent execution | - |
| **post-agent-validation.sh** | PostToolUse (Task) | Validate agent output | validate-agent-output.sh |
| **pre-edit-validation.sh** | PreToolUse (Edit/Write) | TDD validation before edits | validate-quality-gates.sh |
| **pre-commit-link-validation.sh** | pre-commit | Link validation before commit | check-docs-links.js |
| **documentation-trigger.sh** | file changes | Auto-trigger documentation updates | docs-manager.sh |
| **docs-sync-trigger.sh** | documentation changes | Sync documentation | docs-manager.sh |

## Critical Dependencies

**Core Infrastructure Scripts** (required by multiple components):

- `validate-quality-gates.sh` - Used by 12+ agents and 6+ commands
- `ai-status.sh` - Core status reporting
- `docs-manager.sh` - Documentation system backbone

**Essential Templates** (used by core workflow):

- `project-brief.template.md` - Project initialization
- `epic.template.md` - Epic structure
- `task.template.md` - Task organization

**High-Impact Agents** (used by multiple commands):

- `code-reviewer` - Quality enforcement
- `project-manager` - Workflow coordination
- `technical-writer` - Documentation maintenance

## Notes

- Scripts in `lib/` (colors.sh, logging.sh, common.js) are shared utilities used by multiple scripts
- Metrics scripts are used by data-analyst agent and status commands
- Validation scripts form the quality gate system used throughout the workflow
- Template system enables consistent document structure across the project
- Hook scripts provide automatic quality enforcement during development

---

_Last updated: 2025-09-19 - After script cleanup and agent dependency verification_

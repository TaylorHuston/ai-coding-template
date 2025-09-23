---
version: "0.3.0"
created: "2025-09-17"
last_updated: "2025-09-22"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "context", "refresh", "efficiency"]
description: "Context-efficient project refresh using intelligent subagent delegation"
argument-hint: "[--analysis] [--focus AREA]"
allowed-tools: ["Bash", "Task"]
model: "claude-sonnet-4"
---

# /refresh Command

**Purpose**: Context-efficient project refresh using intelligent subagent delegation.

Provide context refresh focused on dynamic project state while preserving main conversation tokens. Assumes CLAUDE.md capabilities context already available.

## Execution Strategy

**Parse Arguments**:

- No arguments or default: Execute Lightning Mode
- `--analysis`: Execute Analysis Mode with context-analyzer subagent
- `--focus [area]`: Execute targeted analysis for specific domain

## Lightning Mode (Default)

Execute minimal dynamic state refresh:

1. **Refresh Capabilities**: Read CLAUDE.md for capabilities
2. **Get git status**: `git status --porcelain` (show modified files)
3. **Get current branch**: `git branch --show-current`
4. **Get recent commits**: `git log --oneline -3`
5. **Get current status**: Read STATUS.md and unstaged/uncommitted files
6. **Generate summary**: Format as structured output referencing CLAUDE.md for capabilities

**Target**: <500 tokens total

## Analysis Mode (--analysis)

Delegate dynamic state analysis to context-analyzer subagent:

1. **Quick git orientation**: Basic git status in main conversation
2. **Launch subagent**: Use Task tool with context-analyzer
3. **Subagent task**: "Analyze current project dynamic state by reading: (1) Current state: STATUS.md, CHANGELOG.md recent changes; (2) Active work: git status, recent commits, uncommitted changes; (3) Progress assessment: current development phase, active tasks, recent activity. Focus on what has changed since last session. Capabilities are already known from CLAUDE.md. Return structured summary with current focus, recent progress, and immediate next steps."
4. **Return summary**: Subagent provides optimized 2-3k token summary
5. **Generate summary**: Format as structured output referencing CLAUDE.md for capabilities

## Focus Mode (--focus [area])

Execute targeted dynamic analysis for specific domain:

**Areas**: status, git, progress, current

1. **Quick orientation**: Minimal git status
2. **Launch focused subagent**: Context-analyzer with domain-specific task
3. **Domain tasks**:
   - `status`: Read STATUS.md and assess current development state
   - `git`: Analyze git history, branches, and recent commits
   - `progress`: Review CHANGELOG.md and assess completion status
   - `current`: Focus on immediate active work and next steps

## Output Format

**Lightning Mode**: Concise 3-line summary:

- 🌟 Project: [Name] | Branch: [current] | Status: [focus]
- 📊 Progress: [%] | Modified: [files] | Recent: [commit]
- ⚡ Next: [recommended action] | Capabilities: See CLAUDE.md

**Analysis Mode**: Present subagent's dynamic state analysis unchanged

**Focus Mode**: Present subagent's domain-specific insights unchanged

## Agent Coordination

**Primary**: context-analyzer (for dynamic state analysis and pattern recognition)
**Mode**: Subagent delegation using Task tool for context efficiency

## Context Efficiency

- Lightning: ~300 tokens (0.15% context)
- Analysis: ~2-3k tokens (1.5% context)
- Focus: ~1-2k tokens (1% context)
- Previous approach: 58k tokens (29% context)

## Examples

**Quick refresh**: `/refresh` → Lightning mode → Basic status summary
**Deep analysis**: `/refresh --analysis` → context-analyzer subagent → Comprehensive insights
**Focused analysis**: `/refresh --focus git` → Targeted git analysis → Specific insights

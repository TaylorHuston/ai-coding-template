---
description: "[DEPRECATED] Use /idea → /plan → /iterate workflow instead"
argument-hint: --issue KEY --type TYPE --complexity LEVEL --testing APPROACH
allowed-tools: Read, Write, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task
model: opus
deprecated: true
redirect: "/idea → /plan → /iterate"
---

# ⚠️ DEPRECATED COMMAND

**This command has been deprecated in favor of the core workflow.**

## Use This Instead:

```bash
# Step 1: Explore the architectural decision
/idea --start "How should we implement [your feature]?"

# Step 2: Create comprehensive implementation plan
/plan --issue YOUR-ISSUE-KEY

# Step 3: Execute tasks with quality gates
/iterate
```

## Why This Change?

The `/feature-development` command duplicated the revolutionary `/idea → /plan → /iterate` workflow. The core workflow provides:

✅ **Better Architecture**: Interactive architectural exploration with specialist consultation
✅ **Superior Planning**: Sequential multi-agent analysis with context preservation
✅ **Quality Execution**: Agent orchestration with automatic quality gates
✅ **Context Preservation**: Perfect context across all phases

## Legacy Support

This command still works but will redirect you to use the core workflow:

**Old approach:**
```bash
/feature-development --issue AUTH-123 --type service --complexity moderate
```

**New approach (recommended):**
```bash
/idea --start "How should we implement user authentication service?"
/plan --issue AUTH-123
/iterate
```

The new approach is more thorough, provides better architectural decisions, and maintains perfect context throughout implementation.
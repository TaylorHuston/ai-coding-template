---
command: "/iterate"
description: Progressive iterative improvement workflow
category: "Quality & Enhancement"
purpose: "Systematic refinement through multiple improvement cycles"
wave-enabled: true
performance-profile: "standard"
argument-hint: --target TARGET --iterations N --threshold LEVEL --scope SCOPE
allowed-tools: Read, Edit, MultiEdit, Bash, Grep, Glob, TodoWrite, Task
model: sonnet
---

Iterative improvement workflow for progressive refinement:
1. Analyze current state and identify improvement opportunities
2. Prioritize improvements based on impact and effort
3. Implement incremental improvements in focused iterations
4. Validate improvements and measure progress
5. Continue iterating until quality targets are met

Process:
- Use context-analyzer to establish baseline state
- Use appropriate specialists to identify improvement areas
- Use project-manager to coordinate improvement iterations
- Implement improvements in small, focused batches
- Validate each iteration with quality checks
- Update progress tracking and metrics
- Continue until improvement goals are achieved

Parameters from $ARGUMENTS:
- --target: Specific improvement target (performance, quality, security)
- --iterations: Maximum number of iterations (default: 3)
- --threshold: Quality threshold to achieve
- --scope: Scope of improvements (file, module, project)
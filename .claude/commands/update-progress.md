---
command: "/update-progress"
description: Update project progress tracking and status files
category: "Project Management"
purpose: "Synchronize local status with project tracking systems"
wave-enabled: false
performance-profile: "standard"
argument-hint: Optional issue key or progress details
allowed-tools: Read, Write, Edit
model: haiku
---

Update project progress by:

1. Update the current PLAN.md file as needed
2. Update the STATUS.md as needed
3. Update the CHANGELOG.md as needed
4. Review latest progress and milestones
5. Generate progress summary for tracking systems

Process:

- Use context-analyzer to read current PLAN.md and STATUS.md files
- Use project-manager to analyze progress since last update
- Update local status files with current progress state
- Generate summary of accomplishments and next steps
- Coordinate with relevant domain agents for technical progress details
- Update project tracking documentation with current state

Issue key: $ARGUMENTS (optional, will detect from current context if available)
---
# === Metadata ===
template_type: "pm-template"
version: "1.0.0"
created: "2025-10-30"
last_updated: "2025-10-30"
status: "Active"
target_audience: ["AI Assistants", "Project Management"]
description: "Epic template for organizing related tasks with definition of done"

# === Template Configuration ===
type: epic
sections:
  - name: Name
    prompt: "What is the epic name? (concise, kebab-case friendly)"
    required: true
    format: text
  - name: Description
    prompt: "Describe the epic. What problem does it solve? What value does it provide?"
    required: true
    format: paragraph
    hint: "Write a clear paragraph explaining the purpose, context, and value of this epic."
  - name: Definition of Done
    prompt: "How will we know this epic is complete? What are the concrete completion criteria?"
    required: true
    format: flexible
    hint: "Can be prose paragraph or bulleted checklist. Make it concrete to prevent scope creep."
  - name: Dependencies
    prompt: "What must exist before this epic can be completed?"
    required: false
    format: list
    hint: "Include ADR references (ADR-001), other epics (EPIC-002), external factors (OAuth setup), etc."
  - name: Tasks
    prompt: "What tasks make up this epic?"
    required: true
    format: checklist
    hint: "Bulleted checkbox list with global IDs in creation order: [ ] TASK-001, [ ] BUG-003, etc."
---

# EPIC-{id}: {name}

## Description
{description}

## Definition of Done
{definition_of_done}

## Dependencies
{dependencies}

## Tasks
{tasks}

---
version: "1.0.0"
created: "2025-09-20"
last_updated: "2025-09-20"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["template", "improvement", "feedback", "publishing"]
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Bash", "Grep", "Glob", "TodoWrite", "WebSearch", "WebFetch"]
argument-hint: "[--feedback|--enhance|--publish|--monitor]"
description: "Improve the template based on user feedback and publish enhancements"
model: "claude-opus-4-1"
---

# /improve Command

**ALWAYS invoke template-maintainer agent** - Template improvement specialist.

## Command Modes

### `--feedback`
**Task**: Analyze user feedback and identify improvement opportunities
**Action**: Scan GitHub issues, detect user modification patterns, prioritize improvements

### `--enhance`
**Task**: Implement template improvements
**Action**: Create branch, update template files, test changes, update documentation

### `--publish`
**Task**: Publish improved template to NPM
**Action**: Version bump, generate CHANGELOG, publish package, verify distribution

### `--monitor`
**Task**: Track template performance and adoption
**Action**: Monitor downloads, success rates, user satisfaction, generate reports

## Agent Requirements

**Primary**: template-maintainer (mandatory for all modes)
**Supporting**: test-engineer (enhance), devops-engineer (publish), data-analyst (monitor)

## Critical Rules

1. **ALWAYS invoke template-maintainer first**
2. **Respect .template-manifest.json categorization**
3. **Maintain backward compatibility**
4. **Test thoroughly before publishing**
5. **Generate user-focused CHANGELOG**
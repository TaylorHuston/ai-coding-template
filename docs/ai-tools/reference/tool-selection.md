---
title: "Tool Selection Guide"
version: "0.1.0"
created: "2025-09-10"
last_updated: "2025-09-10"
status: "active"
target_audience: ["ai-assistants", "developers"]
tags: ["tool-selection", "quick-reference", "development-tools"]
category: "Reference"
description: "Quick reference for selecting the right tools for different development tasks."
---

# Tool Selection Guide

Quick reference for selecting the right tools for different development tasks.

## Core Tool Categories

### File Operations

**Reading Files**:
- `Read`: Always use before editing existing files
- `Glob`: Find files by pattern (e.g., `**/*.md`, `src/**/*.js`)
- `Grep`: Search file contents with regex patterns

**Writing/Editing Files**:
- `Edit`: Modify existing files (requires Read first)
- `MultiEdit`: Multiple edits to same file in one operation
- `Write`: Create new files only (requires Read first for existing files)

**Best Practices**:
- Always Read before Write/Edit operations
- Use absolute paths only
- Prefer editing existing files over creating new ones

### Search and Discovery

**Content Search**:
```bash
# Use Grep for specific patterns
Grep: pattern="function.*authenticate" type="js"

# Use Glob for file discovery
Glob: pattern="**/*.test.js"
```

**When to Use Each**:
- **Grep**: Search within file contents, specific code patterns
- **Glob**: Find files by name/path patterns, file discovery
- **Task tool**: Complex searches requiring multiple rounds

### Code Execution

**Running Commands**:
- `Bash`: Execute shell commands, run tests, build projects
- Use proper quoting for paths with spaces
- Avoid search commands (use Grep/Glob instead)

**Testing and Validation**:
```bash
# Preferred patterns
npm test
npm run lint
npm run build
```

### Task Management

**Progress Tracking**:
- `TodoWrite`: Track multi-step tasks and progress
- Use for complex operations (3+ steps)
- Update status in real-time

**Agent Delegation**:
- `Task`: Delegate to specialized agents for domain expertise
- Use when specific expertise needed

## Tool Selection Matrix

| Task Type | Primary Tool | Secondary Tool | Notes |
|-----------|--------------|----------------|-------|
| **File Discovery** | Glob | Grep | Use Glob for patterns, Grep for content |
| **Code Search** | Grep | Read | Grep for patterns, Read for specific files |
| **File Reading** | Read | - | Always before editing |
| **File Editing** | Edit/MultiEdit | Write | Prefer editing over creating |
| **Command Execution** | Bash | - | Proper quoting required |
| **Complex Tasks** | Task | TodoWrite | Domain expertise delegation |
| **Progress Tracking** | TodoWrite | - | Multi-step operations |

## Common Patterns

### Code Analysis Workflow
```yaml
1. Discover files: Glob (pattern="**/*.js")
2. Search content: Grep (pattern="authentication")
3. Read specific files: Read (targeted files)
4. Track progress: TodoWrite (if complex)
```

### File Modification Workflow
```yaml
1. Read existing file: Read
2. Make changes: Edit/MultiEdit
3. Validate changes: Bash (run tests)
4. Update progress: TodoWrite (if part of larger task)
```

### Research and Investigation
```yaml
1. Search codebase: Grep (multiple patterns)
2. Find related files: Glob (related patterns)
3. Deep dive: Read (specific files)
4. Delegate complex analysis: Task (specialized agents)
```

## Performance Considerations

### Efficient Tool Usage

**Batch Operations**:
- Use MultiEdit for multiple changes to same file
- Batch multiple tool calls in single response when possible
- Use Task tool for operations requiring multiple rounds

**Avoid Anti-Patterns**:
- Don't use Bash for file searches (use Grep/Glob)
- Don't use cat/head/tail commands (use Read)
- Don't assume files exist without checking

### Resource Management

**Token Efficiency**:
- Use Grep with appropriate output modes
- Read only necessary portions of large files
- Use Task tool for extensive operations

**Context Preservation**:
- Maintain context across operations
- Use TodoWrite for session continuity
- Reference files by path rather than content

## Error Handling

### Common Issues

**Permission Errors**:
```bash
# Fix script permissions
chmod +x scripts/*.sh
```

**Path Issues**:
- Always use absolute paths
- Quote paths with spaces properly
- Verify file existence before operations

**Tool Failures**:
- Read before Write/Edit operations
- Check tool availability
- Use fallback strategies

### Recovery Patterns

**File Operation Failures**:
1. Verify file exists and is readable
2. Check permissions
3. Use alternative approach
4. Document issues for future reference

**Search Failures**:
1. Try broader search patterns
2. Use alternative tools
3. Check file types and locations
4. Delegate to Task tool if needed

## Best Practices Summary

### Core Principles
1. **Read Before Write**: Always read existing files before modification
2. **Use Right Tool**: Match tool capabilities to task requirements
3. **Batch Operations**: Combine operations for efficiency
4. **Track Progress**: Use TodoWrite for complex multi-step tasks
5. **Handle Errors**: Implement proper error handling and recovery

### Tool-Specific Guidelines

**File Operations**:
- Prefer editing existing files over creating new ones
- Use absolute paths consistently
- Validate operations with tests

**Search Operations**:
- Use appropriate search scope and patterns
- Combine tools for comprehensive analysis
- Document search strategies for reuse

**Command Execution**:
- Use proper shell quoting
- Validate commands before execution
- Monitor resource usage

### Integration Patterns

**With Project Structure**:
- Follow established file organization patterns
- Respect project conventions and standards
- Integrate with existing tooling and workflows

**With AI Agents**:
- Use Task tool for specialized domain expertise
- Delegate complex analysis to appropriate agents
- Coordinate multi-agent workflows effectively

---

**Related Documentation**: [Development Commands](./development-commands.md) | [Troubleshooting Guide](./troubleshooting.md) | [Reference Hub](./README.md)
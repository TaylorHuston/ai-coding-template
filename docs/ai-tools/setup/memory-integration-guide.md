---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "guide"
priority: "medium"
tags: ["memory", "mcp", "integration", "workflow", "intelligence"]
---

# Memory-Bank Integration Guide

**Purpose**: Enhance AI-assisted development with persistent cross-session learning using memory-bank-mcp

## Overview

The memory-bank-mcp integration adds persistent memory capabilities to our `/idea → /plan → /iterate` workflow, enabling:

- **User Personalization**: Learn coding styles, architectural preferences, naming conventions
- **Cross-Project Intelligence**: Transfer successful patterns between implementations
- **Agent Optimization**: Track which agent combinations work best for specific scenarios
- **Workflow Learning**: Identify optimal sequences based on project types and outcomes

## Architecture

### Memory Categories

**Project-Level Storage** (`./project-memory/`):
- **User Preferences**: Coding styles, architectural patterns, naming conventions
- **Agent Analytics**: Historical effectiveness data for agent selection optimization
- **Pattern Library**: Successful architectural decisions and their contexts
- **Workflow Intelligence**: Optimal `/idea → /plan → /iterate` sequences by project type

### Clear Separation Strategy

**Existing Structured Context** (project-specific, session-bound):
- `STATUS.md` → Current project state and progress
- `HANDOFF.yml` → Agent coordination context within workflows
- `RESEARCH.md` → Accumulated project findings and decisions

**Memory-Bank Enhancement** (cross-session, learning-focused):
- User personalization and preference patterns
- Historical agent effectiveness and selection optimization
- Cross-project architectural insights and successful patterns
- Workflow optimization based on past project outcomes

## Integration Points

### Enhanced Workflow Commands

**Intelligent Status with Memory Insights**:
```bash
/status --with-memory    # Includes user preferences and historical patterns
```

**Memory-Informed Agent Selection**:
```bash
/plan --issue AUTH-123   # Considers past successful authentication implementations
# Agents selected based on historical effectiveness for similar issues
```

**Context-Aware Architectural Exploration**:
```bash
/idea --start "microservices vs monolith"
# Leverages past architectural decisions and their outcomes
# Suggests patterns that worked well in similar contexts
```

### Memory-Enhanced Agent Behavior

**Automatic Context Injection**:
- Agents receive relevant historical patterns for their domain
- User preferences automatically applied to generated code
- Successful past approaches suggested for similar problems

**Learning Feedback Loops**:
- Agent effectiveness tracked and used for future selection
- Successful patterns stored for reuse in similar contexts
- Failed approaches noted to avoid repetition

## Memory Schema

### User Preferences
```json
{
  "user_preferences": {
    "coding_style": {
      "naming_convention": "camelCase|snake_case|kebab-case",
      "architecture_preference": "microservices|monolith|hybrid",
      "testing_approach": "tdd|bdd|integration-first"
    },
    "agent_preferences": {
      "preferred_agents": ["backend-specialist", "security-auditor"],
      "workflow_style": "sequential|parallel|hybrid"
    }
  }
}
```

### Agent Analytics
```json
{
  "agent_analytics": {
    "backend-specialist": {
      "success_rate": 0.95,
      "effective_contexts": ["authentication", "api-design"],
      "avg_task_completion_time": "15min",
      "quality_score": 9.2
    }
  }
}
```

### Pattern Library
```json
{
  "successful_patterns": {
    "authentication": {
      "pattern": "JWT + refresh token with Redis",
      "context": "Medium-scale web application",
      "success_metrics": { "security": 9.5, "performance": 8.7 },
      "agent_sequence": ["security-auditor", "backend-specialist", "frontend-specialist"]
    }
  }
}
```

## Setup Instructions

### 1. MCP Configuration

The memory-bank server is already configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "memory-bank": {
      "command": "npx",
      "args": ["-y", "memory-bank-mcp"],
      "env": {
        "MEMORY_BANK_STORAGE_PATH": "./project-memory"
      }
    }
  }
}
```

### 2. Initialize Memory Storage

```bash
# Memory storage is automatically created when first accessed
# Located at: ./project-memory/

# Verify MCP server is working
claude-code --list-mcp-servers
```

### 3. Workflow Integration

**Memory-Enhanced Commands** (automatically enabled):
- `/status` - Now includes memory insights when available
- `/plan` - Uses historical agent effectiveness for selection
- `/idea` - Injects relevant past decisions and patterns
- `/iterate` - Learns from task execution outcomes

## Usage Patterns

### Initial Learning Phase

**First few sessions**: Memory-bank learns user preferences:
- Coding style patterns from edits and preferences
- Architectural decision patterns from `/idea` sessions
- Agent effectiveness from `/plan` and `/iterate` executions
- Successful workflow sequences and timing

### Intelligence Phase

**After 5-10 sessions**: System provides intelligent suggestions:
- Proactive agent selection based on historical effectiveness
- Architectural pattern suggestions based on similar past projects
- User preference application without explicit configuration
- Workflow optimization recommendations

### Optimization Phase

**Long-term usage**: System becomes highly personalized:
- Predictive workflow recommendations
- Automatic best practice application
- Cross-project pattern transfer
- Team-wide insight sharing (if configured)

## Memory Management

### Storage Location
- **Path**: `./project-memory/` (project-specific)
- **Format**: JSON files managed by memory-bank-mcp
- **Backup**: Included in project repository (optional, configurable)

### Data Privacy
- **Scope**: Project-level only, not shared across unrelated projects
- **Content**: Technical patterns and preferences, no personal data
- **Control**: Can be cleared/reset at any time

### Maintenance
```bash
# View memory contents (debugging)
cat project-memory/*.json

# Clear memory (fresh start)
rm -rf project-memory/

# Backup memory patterns
cp -r project-memory/ project-memory-backup/
```

## Integration with Existing Systems

### Complementary to Structured Context
- **STATUS.md**: Current state ↔ **Memory**: Historical patterns
- **HANDOFF.yml**: Session context ↔ **Memory**: Cross-session learning
- **RESEARCH.md**: Project findings ↔ **Memory**: Pattern recognition

### Enhanced Agent Coordination
- Agents receive both immediate context AND relevant historical insights
- Memory patterns guide agent selection in `/plan` phase
- Learning feedback improves future agent effectiveness

## Best Practices

### Memory Hygiene
1. **Regular Review**: Periodically review stored patterns for relevance
2. **Pattern Validation**: Ensure successful patterns are actually successful
3. **Context Boundaries**: Keep project-specific vs. general patterns separate
4. **Performance Monitoring**: Track memory system impact on workflow speed

### Optimal Usage
1. **Natural Integration**: Let memory enhance existing workflow, don't force it
2. **Gradual Learning**: Allow 5-10 sessions for meaningful pattern recognition
3. **Feedback Loops**: Note when memory suggestions are helpful vs. not
4. **Pattern Curation**: Manually review and refine critical patterns

## Troubleshooting

### Memory Not Working
```bash
# Check MCP server status
claude-code --mcp-status

# Verify memory-bank installation
npx memory-bank-mcp --version

# Check storage permissions
ls -la project-memory/
```

### Performance Issues
```bash
# Check memory storage size
du -sh project-memory/

# Clear old/irrelevant data if needed
# (Memory-bank provides data management commands)
```

### Integration Conflicts
- Memory suggestions override structured context: Review memory patterns
- Contradictory recommendations: Clear conflicting memory entries
- Agent selection issues: Reset agent analytics if needed

## Advanced Configuration

### Team Sharing (Optional)
```bash
# Include memory in version control (team patterns)
echo "project-memory/" >> .gitignore  # Remove this line to include memory

# Or use selective sharing
echo "project-memory/user_preferences.json" >> .gitignore  # Keep personal, share patterns
```

### Custom Memory Categories
Memory-bank-mcp supports custom categories - extend beyond defaults:
- **API Patterns**: Successful API designs and their contexts
- **Performance Solutions**: Optimization approaches that worked
- **Security Patterns**: Effective security implementations
- **Integration Patterns**: Successful third-party integrations

## Success Metrics

### Immediate Benefits (1-2 weeks)
- Reduced repetitive configuration through preference learning
- Faster agent selection through historical effectiveness data
- Improved architectural decisions through pattern suggestion

### Long-term Benefits (1-3 months)
- Significantly faster project setup through learned preferences
- Higher quality outcomes through optimized agent sequences
- Cross-project knowledge transfer through pattern library
- Predictive workflow optimization

---

**Related Documentation**: [Workflow Guide](../guides/workflow-guide.md) | [Agent System](../guides/using-agents.md) | [MCP Setup](./mcp-setup.md)
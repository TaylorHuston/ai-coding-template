---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants", "developers", "product-managers"]
document_type: "command"
tags: ["workflow", "features", "requirements"]
---

# /feature Command

**Purpose**: Create and manage feature context documents that define WHAT we're building and WHY, providing business and functional requirements that complement external project management tools.

## Command Usage

### Create New Feature Context
```bash
/feature --new "User Authentication"
# Creates docs/technical/features/user-authentication.md from template
```

### Update Existing Feature
```bash
/feature --update user-authentication
# Opens existing feature doc for editing and enhancement
```

### Link to External Issue
```bash
/feature --new "Payment Processing" --external JIRA-PAY-123
# Creates feature doc with external reference
```

### List Features
```bash
/feature --list
# Shows all feature documents and their status
```

## What This Command Does

### For New Features
1. **Interactive Exploration**: Guided conversation to understand the feature requirements
2. **Business Context**: Explores the problem, user needs, and success criteria
3. **Functional Requirements**: Defines what the feature must do
4. **Document Generation**: Creates feature context document in `docs/technical/features/`
5. **External Integration**: Links to Jira/Linear issues when available

### Conversation Flow
The AI will guide you through these phases:

#### 1. Problem Understanding
- What problem does this feature solve?
- Who are the users and what are their needs?
- What's the current pain point or gap?

#### 2. Solution Definition
- What is the high-level solution approach?
- What are the key capabilities required?
- What does success look like?

#### 3. Requirements Gathering
- What are the functional requirements?
- What are the user experience expectations?
- What are the performance and quality requirements?

#### 4. Context Documentation
- Dependencies on other features or systems
- Integration points and external requirements
- Technical constraints and considerations

## Integration with Workflow

### Position in Hierarchy
```
vision.md                    → Why the product exists
features/user-auth.md        → Why we need authentication (THIS COMMAND)
architecture/auth-design.md  → How we'll implement auth
decisions/ADR-001-jwt.md     → Why we chose JWT
implementations/2024-01-15-auth.md → What steps we took
```

### Relationship to Other Commands
- **Before `/architect`**: Define what you're building before deciding how
- **References external tools**: Links to Jira/Linear when available
- **Informs `/plan`**: Feature context guides implementation planning

## External Tool Integration

### Small Teams
- Creates comprehensive feature documentation locally
- Serves as single source of truth for requirements
- Can export to external tools if needed

### Teams with PM Tools
- Complements Jira epics and Linear initiatives
- Includes `external_ref` field linking to PM tools
- Focuses on technical context and implementation details
- Can sync status updates back to external tools

### Enterprise Teams
- Acts as lightweight summary of external requirements
- References authoritative specs in enterprise tools
- Focuses on local development context

## Agent Coordination

### Primary Agent
**business-analyst** or **product-designer** agent handles feature exploration:
- Specializes in requirements gathering
- Understands user needs and business context
- Can validate feature scope and priorities

### Supporting Agents
- **context-analyzer**: Reviews existing features and dependencies
- **technical-writer**: Helps document requirements clearly
- **project-manager**: Advises on scope and planning implications

## Output Artifacts

### Feature Context Document
```yaml
Location: docs/technical/features/[feature-name].md
Content:
  - Problem statement and user needs
  - Functional requirements
  - Success criteria and metrics
  - Technical approach (high-level)
  - Dependencies and integration points
  - External references (Jira/Linear links)
```

### Updated Feature Index
The command maintains an index of all features for easy discovery and status tracking.

## Best Practices

### When to Use `/feature`
- **New major capabilities**: User-facing features that add value
- **Complex functionality**: Features spanning multiple components
- **Cross-team work**: Features requiring coordination
- **External requirements**: Features driven by business needs

### When NOT to Use `/feature`
- Simple bug fixes or maintenance
- Internal refactoring without user impact
- Minor UI adjustments
- Development tool improvements

### Writing Quality Features
1. **Start with the user problem**: Why does this feature need to exist?
2. **Define success clearly**: How will we know it works?
3. **Keep scope focused**: One feature should solve one core problem
4. **Include external context**: Link to business requirements when available
5. **Think about integration**: How does this fit with existing features?

## Examples

### Solo Developer
```bash
/feature --new "Dark Mode Toggle"
# AI guides through understanding user needs, success criteria
# Creates comprehensive local documentation
# Ready to proceed to /architect for technical design
```

### Team with Jira
```bash
/feature --new "User Notifications" --external PROJ-456
# AI pulls context from Jira (if integration available)
# Focuses on technical and implementation context
# Links back to Jira for status updates
```

### Enterprise Context
```bash
/feature --update user-dashboard --external ENTERPRISE-789
# Updates local technical context
# References external enterprise requirements
# Maintains development team clarity
```

## Advanced Usage

### Feature Dependencies
```bash
/feature --dependencies user-authentication payment-processing
# Explores how features relate and depend on each other
# Helps plan implementation order and integration points
```

### Feature Analysis
```bash
/feature --analyze existing-features
# Reviews all feature docs for consistency and gaps
# Identifies opportunities for consolidation or enhancement
```

## Quality Gates

Before completing feature documentation:
- ✅ Problem statement is clear and specific
- ✅ Success criteria are measurable
- ✅ Functional requirements are complete
- ✅ Dependencies are identified
- ✅ External references are linked (if applicable)
- ✅ Technical approach is feasible (high-level validation)

## Related Commands

- **`/architect`**: Define HOW to implement the feature
- **`/plan`**: Break down implementation into tasks
- **`/develop`**: Execute the implementation
- **`/docs sync`**: Update related documentation

---

*The `/feature` command ensures every piece of code can be traced back to a clear business need and user problem.*
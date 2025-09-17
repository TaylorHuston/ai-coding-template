---
version: "0.3.0"
created: "2025-08-21"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "technical-writers", "ai-assistants"]
document_type: "guide"
tags: ["documentation", "standards", "workflow", "structure", "length-optimization"]
---

# Documentation Guidelines

This guide explains what documentation goes where in this AI coding template, following the "Docs as Code" philosophy with a minimal, developer-focused approach.

## Core Philosophy

- **Minimal**: Just enough documentation for developers and AI to work effectively
- **Practical**: Code examples over lengthy explanations
- **Separated**: Clear boundaries between planning and implementation
- **Not a Replacement**: This template complements, not replaces, project management tools (Jira/Linear) and documentation systems (Confluence/Notion)

## Repository Documentation Structure

```
project/
├── README.md                 # Project overview and quick start
├── CHANGELOG.md             # Version history (Keep a Changelog format)
├── CLAUDE.md                # AI assistant instructions
├── docs/                    # Project-wide documentation
│   ├── architecture/        # Technical architecture
│   │   └── system-design.md # Core architecture decisions
│   ├── api/                 # API specifications (when needed)
│   ├── guides/              # How-to guides
│   └── templates/           # Document templates
├── deliverables/            # Epic-level work packages
│   └── [DELIVERABLE]/
│       ├── README.md        # Deliverable overview
│       └── issues/          # Individual tasks
│           └── [ISSUE]/
│               ├── PLAN.md      # Task checklist (~50 lines)
│               └── README.md    # Implementation guide (~200 lines)
└── scripts/                 # Automation tools
```

## Documentation Types

### Technical Documentation (Developer-Focused)

- **Location**: `docs/architecture/` and issue-level README files
- **Purpose**: Implementation details, system design, code patterns
- **Audience**: Developers, AI assistants, technical contributors
- **Focus**: HOW to build and maintain the system

### Product Documentation (Business-Focused)

- **Location**: `deliverables/` directory
- **Purpose**: Business requirements, user impact, product specifications
- **Audience**: Product managers, stakeholders, business teams
- **Focus**: WHAT to build and WHY it matters

### C4 Architecture Documentation (Visual Architecture)

- **Location**: `docs/architecture/` directory with C4-specific organization
- **Purpose**: Visual system architecture using hierarchical C4 model levels
- **Audience**: Architects, developers, stakeholders (audience varies by C4 level)
- **Focus**: HOW the system is structured and WHY architectural decisions were made

#### C4 Documentation Structure
```
docs/architecture/
├── c4-overview.md              # C4 methodology guide
├── system-context.md           # Level 1: System boundaries and external actors
├── container-architecture.md   # Level 2: Technology choices and responsibilities
├── components/                 # Level 3: Component-level architecture
│   ├── agent-orchestration.md # Component details for complex containers
│   └── context-management.md  # Component details for complex containers
└── workflows/                  # Dynamic diagrams for key scenarios
    ├── project-setup.md        # Workflow-specific architecture views
    └── feature-development.md  # Multi-container interaction patterns
```

## What Goes Where

### Project Level

| File                  | Purpose             | What Goes Here                                       |
| --------------------- | ------------------- | ---------------------------------------------------- |
| `/README.md`          | Project entry point | Project description, quick start, setup instructions |
| `/CHANGELOG.md`       | Version history     | All changes following Keep a Changelog format        |
| `/CLAUDE.md`          | AI instructions     | Rules and context for AI assistants                  |
| `/docs/architecture/` | Technical design    | System architecture, technical decisions, C4 models |
| `/docs/api/`          | API specs           | API documentation when building APIs                 |

### Deliverable Level (Epic)

| File        | Purpose              | What Goes Here                           |
| ----------- | -------------------- | ---------------------------------------- |
| `README.md` | Deliverable overview | Goal, scope, issue list, success metrics |

### Issue Level (Task)

| File | Purpose | What Goes Here | What DOESN'T Go Here |
| --- | --- | --- | --- |
| **PLAN.md** | Task orchestration | • Task checklist<br>• Acceptance criteria<br>• Brief context (2-3 lines)<br>• Progress tracking | • Code examples<br>• Detailed explanations<br>• Implementation details |
| **README.md** | Implementation guide | • Code examples<br>• Configuration files<br>• Step-by-step instructions<br>• Troubleshooting | • Status tracking<br>• Project management<br>• Acceptance criteria |

## File Standards

### YAML Frontmatter Headers

Every documentation file MUST include YAML frontmatter with required metadata. This provides machine-readable metadata while preventing formatting issues with linters and code formatters.

#### Required Fields
```yaml
---
version: "X.Y.Z"            # Semantic version
created: "YYYY-MM-DD"       # Creation date (ISO 8601)
last_updated: "YYYY-MM-DD"  # Last modification date
status: "active"            # Document status
target_audience: ["array"]  # Intended audiences
---
```

#### Complete Schema Reference
See [YAML Frontmatter Schema](../templates/yaml-frontmatter-schema.md) for the complete specification including optional fields, valid values, and document type templates.

### Versioning System

- **Major (X.0.0)**: Breaking changes, complete rewrites
- **Minor (X.Y.0)**: New sections, significant additions
- **Patch (X.Y.Z)**: Corrections, clarifications, typos

### File Naming Conventions

- Use **lowercase-kebab-case** exclusively (e.g., `authentication-guide.md`)
- Be descriptive but concise
- No redundant suffixes (avoid `guide` in guides/ folder)
- **Always use README.md** for directory documentation
- Never use INDEX.md or other variations
- This ensures GitHub auto-rendering and developer familiarity

### Document Length and Optimization Guidelines

Proper document length is critical for effective AI-assisted development and human comprehension. These guidelines are based on practical experience with AI context management and documentation usability.

#### **Optimal Length Targets**

- **300-500 lines**: Ideal length for optimal AI context window processing
- **Sweet spot**: Documents that can be fully processed in a single AI context window
- **Benefits**: Manageable for human comprehension with single-topic focus

#### **Length Thresholds and Actions**

- **~1000 lines**: **Consider splitting** - Document is approaching the limit for effective processing
- **1400 lines**: **Split required** - Document exceeds optimal AI context management
- **2000+ lines**: **Critical threshold** - Severely impacts AI performance and human usability

#### **When to Split Documents**

Split a document when it:
- Exceeds 1000 lines and covers multiple distinct topics
- Shows AI context management issues during development
- Becomes difficult to navigate or find specific information
- Contains multiple logical sections that could stand alone

#### **Document Splitting Best Practices**

1. **Separate by Logical Concerns**
   - Split along natural topic boundaries (principles vs implementation)
   - Ensure each resulting document has a clear, focused purpose
   - Example: Split security guidelines into principles, authentication, and implementation

2. **Maintain Self-Contained Documents**
   - Each split document should be usable independently
   - Include necessary context and introductory material
   - Avoid creating documents that require reading others to understand

3. **Add Comprehensive Cross-References**
   - Link related split documents in "Related Guidelines" sections
   - Update navigation in parent directories
   - Ensure readers can easily find complementary information

4. **Archive Original Documents**
   - Move original long documents to `legacy/` directory
   - Create README.md in legacy directory explaining the split
   - Preserve historical versions for reference and audit purposes

#### **Examples from Recent Optimization**

**API Design Guidelines Split** (2,122 lines → 3 focused documents):
- `api-design-principles.md` (623 lines) - Core REST/GraphQL principles and patterns
- `api-documentation-standards.md` (776 lines) - OpenAPI specifications and documentation
- `api-implementation-patterns.md` (1,175 lines) - Practical implementation patterns

**Security Guidelines Split** (1,634 lines → 3 focused documents):
- `security-principles.md` (540 lines) - Core security concepts and governance
- `authentication-authorization.md` (700+ lines) - Identity management and access control
- `security-implementation.md` (1,390+ lines) - Practical security patterns and testing

#### **Document Type Length Guidelines**

Different document types have different optimal lengths:

- **Principles/Concepts**: 400-600 lines
- **Implementation Guides**: 800-1200 lines
- **API Specifications**: 600-900 lines
- **Quick References**: 100-300 lines
- **Index/Navigation**: 50-150 lines
- **PLAN.md files**: ~50 lines
- **README.md files**: ~200 lines

#### **Monitoring Document Length**

During maintenance reviews:
- Check line counts of modified documents
- Flag documents approaching 1000 lines for split consideration
- Track AI assistant performance issues that may indicate length problems
- Monitor user feedback about document navigability

## Templates

### PLAN.md Template (Task Tracking)

```markdown
---
version: "0.1.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "plan"
workflow_stage: "in-progress"
---

# [ISSUE-KEY]: [Brief Title]

## Goal

[1-2 sentences describing the objective]

## Tasks

- [ ] Task 1 - Brief description
- [ ] Task 2 - Brief description
- [x] Task 3 - ✅ Completed 2025-08-26

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Context

[Optional: 2-3 lines of critical context for AI agents]
```

**Target length**: ~50 lines

### README.md Template (Implementation)

````markdown
---
version: "0.1.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["developers"]
document_type: "guide"
tags: ["implementation", "setup"]
---

# [Title] Implementation Guide

## Quick Start

[Essential commands or setup steps]

## Implementation

### Configuration Example

```yaml
# Actual working configuration
```
````

### Code Example

```javascript
// Actual working code
```

## Testing

[How to validate the implementation]

## Troubleshooting

- **Issue**: [Common problem] **Solution**: [How to fix]

```

**Target length**: ~200 lines

## Best Practices

### Avoiding Conflicts

1. **Single Source of Truth**: Don't duplicate information - reference the authoritative source
2. **Cross-References**: Use links rather than copying content
3. **Update Together**: When implementation changes, update ALL related docs in the same commit
4. **Never Delete**: Mark as DEPRECATED with migration path instead

### Status Reporting

When documenting metrics or status:

1. **Verify First**: Check with actual code/test output
2. **Include Both States**: Current AND target state
   - Example: "Test Coverage: 85% | Target: 90%"
3. **Date Sensitive Info**: Include "as of YYYY-MM-DD"

### AI Assistant Guidelines

When AI assistants work with documentation:

1. **Read PLAN.md first** to understand current progress
2. **Update checklist** as tasks are completed
3. **Keep README.md practical** with working code examples
4. **Don't add bloat** - if it's not helpful for implementation, leave it out
5. **Use clear markers** for AI-completed tasks: `✅ Completed [date]`

#### C4 Architecture Guidelines for AI Assistants

When creating or updating C4 documentation:

1. **Start with System Context** to understand overall system boundaries
2. **Use consistent YAML frontmatter** with required C4 fields (`c4_level`, `diagram_type`, `related_diagrams`)
3. **Reference C4 overview** (`docs/architecture/c4-overview.md`) for project-specific conventions
4. **Maintain diagram relationships** by updating `related_diagrams` fields when creating new C4 docs
5. **Follow progressive disclosure** - don't create component diagrams for simple containers
6. **Use appropriate audiences** for each C4 level (context=all-stakeholders, container=technical, component=developers)

## Maintenance and Updates

For detailed documentation maintenance procedures, including link validation, health assessment, and automation tools, see the **[Documentation Maintenance Guide](./documentation-maintenance.md)**.

## What NOT to Include

### Don't Duplicate Project Management
These belong in Jira/Linear, not in the repo:
- Detailed user stories
- Extensive acceptance criteria
- Sprint planning information
- Time estimates
- Resource allocation

### Don't Over-Document
Avoid:
- Explaining standard patterns already in the codebase
- Documenting what the code clearly shows
- Writing extensive background that won't help implementation
- Creating documents "just in case"

## When to Create Documentation

### Create New Documents When
- Introducing a new architectural pattern
- Building a new API requiring specification
- Creating a reusable guide for repeated tasks
- Establishing new process or workflow
- **NOT** for every feature or small change

#### C4 Documentation Creation Guidelines
- **System Context**: For new projects or major system boundary changes
- **Container Architecture**: When adding new technology containers or changing architectural approach
- **Component Diagrams**: For complex containers with multiple interacting components
- **Dynamic Diagrams**: For complex workflows that span multiple containers
- **NOT**: For simple features, minor component changes, or straightforward implementations

## Success Indicators

Your documentation is working when:
- New team members can onboard quickly
- AI assistants can understand context immediately
- Developers find implementation examples easily
- No duplication or conflicts between docs
- Documentation updates are part of the development workflow

## Key Principles

1. **If it helps coding, include it**
2. **If it's project management, link to it**
3. **If it's obvious from the code, don't document it**
4. **If an AI needs context, put it in PLAN.md**
5. **If a developer needs examples, put it in README.md**

Remember: This template is for **getting work done**, not for managing projects. Keep documentation minimal, practical, and focused on helping developers and AI assistants complete tasks efficiently.

## Related Guidelines

- **[Documentation Maintenance](./documentation-maintenance.md)** - Systematic maintenance procedures and automation
- **[Visual Documentation](./visual-documentation.md)** - Progress bars and Mermaid diagrams
- **[Quality Standards](./quality-standards.md)** - Quality requirements and validation protocols
- **[Changelog Maintenance](./changelog-maintenance.md)** - Version history and change tracking

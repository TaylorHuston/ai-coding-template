---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants", "developers", "technical-writer"]
document_type: "reference"
priority: "high"
tags: ["templates", "examples", "reference", "navigation", "code-patterns"]
maintainer: "docs-sync-agent"
---

# Templates and Examples Tree Reference

**Purpose**: Comprehensive index of all templates and code examples in the repository for efficient development and documentation creation.

**Note**: This file is maintained by the docs-sync-agent. Do not edit manually.

## Root Level Template System

```text
templates/
├── README.md                           # Master template system overview and usage guide
├── TEMPLATE-FORMAT-REFERENCE.md       # Template formatting standards and variable syntax
└── [category directories]/             # Organized template collections by purpose
```

## Documentation Templates

### Project Documentation Templates

```text
templates/documentation/project/
├── api-service.template.md             # API service project README template
├── cli-tool.template.md                # Command-line tool project README template
├── enterprise.template.md              # Enterprise application README template
├── library.template.md                 # Library/package project README template
├── mobile-app.template.md              # Mobile application README template
├── project-readme.template.md          # Generic project README template
├── web-app.template.md                 # Web application README template
└── CHANGELOG.template.md               # Project changelog template following Keep a Changelog
```

### Technical Documentation Templates

```text
templates/documentation/technical/
├── api-reference.template.md           # API documentation template with OpenAPI structure
├── project-changelog.template.md       # Technical changelog template for releases
└── project-vision.template.md          # Project vision and strategy document template
```

## Workflow Templates

### Feature Development Templates

```text
templates/workflow/feature/
├── README.md                           # Feature template usage guide and selection criteria
├── feature-minimal.template.md         # Lightweight feature specification template
├── feature-standard.template.md        # Standard feature specification template
└── feature-comprehensive.template.md   # Comprehensive feature specification template
```

### Architecture Templates

```text
templates/workflow/architecture/
└── architecture.template.md            # Architecture decision and design template
```

### Planning and Coordination Templates

```text
templates/workflow/planning/
├── plan.template.md                    # Implementation plan template for /plan workflow
├── research.template.md                # Research document template for context gathering
└── handoff.template.yml                # Agent coordination handoff template
```

### Implementation Templates

```text
templates/workflow/implementation/
└── implementation-record.template.md   # Implementation record template for completed work
```

## Code Templates

### API Development Templates

```text
templates/code/api/
└── service.template.ts                 # TypeScript API service template with best practices
```

### Component Templates

```text
templates/code/components/
└── component.template.tsx              # React component template with TypeScript
```

## Legacy Development Templates

### Standard Development Templates

```text
docs/development/templates/standard/
├── feature.template.md                 # Legacy standard feature template
└── deliverable.template.md             # Legacy deliverable template
```

### Simple Development Templates

```text
docs/development/templates/simple/
├── feature-simple.template.md          # Legacy simple feature template
└── deliverable-simple.template.md      # Legacy simple deliverable template
```

### Development Template Resources

```text
docs/development/templates/
├── README.md                           # Development templates overview and migration guide
├── api.template.md                     # Legacy API documentation template
└── yaml-frontmatter-schema.md         # YAML frontmatter schema specification
```

## Exploration and Decision Templates

### Decision Exploration Templates

```text
docs/technical/decisions/explorations/templates/
├── conversation-template.md            # Template for recording exploration conversations
├── notes-template.md                   # Template for exploration notes and insights
└── specialist-inputs-template.md       # Template for specialist agent consultation inputs
```

### Architecture Example Templates

```text
docs/technical/architecture/examples/
├── README.md                           # Architecture examples overview and usage
└── architecture-template.md            # Architecture documentation example template
```

## Working Examples

### Root Examples System

```text
examples/
├── README.md                           # Examples system overview and navigation guide
└── [category directories]/             # Organized example collections by type
```

### Workflow Examples

```text
examples/workflow/
├── README.md                           # Workflow examples overview and usage patterns
├── complete-feature-workflow-example.md  # End-to-end feature development example
└── template-usage-guide.md            # Guide for using templates effectively
```

### Code Pattern Examples

```text
examples/code/patterns/
├── api-auth.example.js                 # Authentication implementation patterns
├── api-error-handling.example.js       # Error handling patterns and best practices
├── api-response.example.js             # API response format standardization
├── api-user-service.example.ts         # Complete user service implementation
├── api-validation.example.js           # Input validation patterns and middleware
├── component-user-card.example.tsx     # React component implementation example
└── test-user-service.example.test.ts   # Comprehensive testing patterns
```

### Configuration Examples

```text
examples/code/configs/
└── config-app-config.example.ts        # Application configuration patterns
```

## Configuration Templates

### AI Assistant Configuration

```text
.claude/
└── settings.template.json              # Claude Code settings template with MCP integration
```

## Template Categories by Purpose

### **Project Initialization** (Start New Projects)

```text
Project README Templates:
├── templates/documentation/project/api-service.template.md
├── templates/documentation/project/web-app.template.md
├── templates/documentation/project/cli-tool.template.md
├── templates/documentation/project/library.template.md
├── templates/documentation/project/mobile-app.template.md
├── templates/documentation/project/enterprise.template.md
└── templates/documentation/project/project-readme.template.md

Project Setup Templates:
├── templates/documentation/project/CHANGELOG.template.md
├── templates/documentation/technical/project-vision.template.md
└── .claude/settings.template.json
```

### **Feature Development** (Build New Features)

```text
Feature Specification:
├── templates/workflow/feature/feature-minimal.template.md
├── templates/workflow/feature/feature-standard.template.md
└── templates/workflow/feature/feature-comprehensive.template.md

Implementation Planning:
├── templates/workflow/planning/plan.template.md
├── templates/workflow/planning/research.template.md
└── templates/workflow/planning/handoff.template.yml

Code Implementation:
├── templates/code/api/service.template.ts
├── templates/code/components/component.template.tsx
└── examples/code/patterns/ (reference implementations)
```

### **Architecture and Design** (Make Technical Decisions)

```text
Architecture Documentation:
├── templates/workflow/architecture/architecture.template.md
├── docs/technical/architecture/examples/architecture-template.md
└── docs/technical/decisions/explorations/templates/ (decision exploration)

Decision Recording:
├── docs/technical/decisions/explorations/templates/conversation-template.md
├── docs/technical/decisions/explorations/templates/notes-template.md
└── docs/technical/decisions/explorations/templates/specialist-inputs-template.md
```

### **Documentation Creation** (Document Systems)

```text
API Documentation:
├── templates/documentation/technical/api-reference.template.md
└── examples/code/patterns/api-*.example.js (reference implementations)

Technical Writing:
├── templates/documentation/technical/project-changelog.template.md
├── templates/documentation/technical/project-vision.template.md
└── docs/development/templates/api.template.md (legacy)
```

### **Code Development** (Implement Solutions)

```text
Backend Development:
├── templates/code/api/service.template.ts
├── examples/code/patterns/api-user-service.example.ts
├── examples/code/patterns/api-auth.example.js
├── examples/code/patterns/api-validation.example.js
└── examples/code/patterns/api-error-handling.example.js

Frontend Development:
├── templates/code/components/component.template.tsx
├── examples/code/patterns/component-user-card.example.tsx
└── examples/code/configs/config-app-config.example.ts

Testing:
└── examples/code/patterns/test-user-service.example.test.ts
```

### **Workflow Management** (Coordinate Development)

```text
Implementation Records:
├── templates/workflow/implementation/implementation-record.template.md
└── examples/workflow/complete-feature-workflow-example.md

Process Documentation:
├── examples/workflow/template-usage-guide.md
└── templates/README.md (master guide)
```

## Template Usage Patterns

### **By Development Phase**

```yaml
Planning_Phase:
  - templates/workflow/feature/ (feature specifications)
  - templates/workflow/architecture/ (technical design)
  - templates/workflow/planning/ (implementation planning)

Development_Phase:
  - templates/code/ (code templates)
  - examples/code/patterns/ (reference implementations)
  - templates/workflow/planning/handoff.template.yml (coordination)

Documentation_Phase:
  - templates/documentation/ (all documentation types)
  - templates/workflow/implementation/ (implementation records)
  - examples/workflow/ (process examples)

Release_Phase:
  - templates/documentation/project/CHANGELOG.template.md
  - templates/documentation/technical/project-changelog.template.md
```

### **By Project Type**

```yaml
API_Projects:
  - templates/documentation/project/api-service.template.md
  - templates/code/api/service.template.ts
  - examples/code/patterns/api-*.example.js
  - templates/documentation/technical/api-reference.template.md

Web_Applications:
  - templates/documentation/project/web-app.template.md
  - templates/code/components/component.template.tsx
  - examples/code/patterns/component-*.example.tsx

CLI_Tools:
  - templates/documentation/project/cli-tool.template.md
  - examples/code/configs/config-*.example.ts

Libraries:
  - templates/documentation/project/library.template.md
  - templates/documentation/technical/api-reference.template.md

Enterprise_Applications:
  - templates/documentation/project/enterprise.template.md
  - templates/workflow/feature/feature-comprehensive.template.md
```

### **By User Type**

```yaml
Developers:
  - templates/code/ (implementation templates)
  - examples/code/patterns/ (reference code)
  - templates/workflow/planning/ (coordination)

Technical_Writers:
  - templates/documentation/ (all documentation templates)
  - docs/development/templates/ (legacy templates)
  - examples/workflow/template-usage-guide.md

Project_Managers:
  - templates/workflow/feature/ (feature specifications)
  - templates/workflow/implementation/ (progress tracking)
  - examples/workflow/complete-feature-workflow-example.md

Architects:
  - templates/workflow/architecture/ (design documentation)
  - docs/technical/decisions/explorations/templates/ (decision making)
  - docs/technical/architecture/examples/ (architecture patterns)
```

## Quick Reference Commands

### **Template Discovery**

```bash
# Find templates by category
find templates/ -name "*.template.*" | grep [category]

# List all available templates
cat templates/README.md

# Get template format reference
cat templates/TEMPLATE-FORMAT-REFERENCE.md
```

### **Example Usage**

```bash
# Browse code examples
cat examples/README.md

# View specific pattern examples
ls examples/code/patterns/

# Study workflow examples
cat examples/workflow/complete-feature-workflow-example.md
```

### **Template Selection**

```bash
# Feature development
ls templates/workflow/feature/

# Project initialization
ls templates/documentation/project/

# Code implementation
ls templates/code/ && ls examples/code/patterns/
```

## Maintenance Notes

**For docs-sync-agent**: This file should be updated whenever:
- New templates are added to any templates/ directory
- New examples are added to any examples/ directory
- Template files are moved, renamed, or restructured
- Template purposes or usage patterns change
- New template categories are introduced

**Update Process**:
1. Scan all templates/ and examples/ directories for changes
2. Update tree structure to reflect current organization
3. Verify all template and example descriptions are accurate
4. Maintain consistent categorization and usage patterns
5. Update quick reference commands if structure changes

**Quality Checks**:
- All templates should have clear, descriptive purposes
- Examples should demonstrate practical usage patterns
- Categories should help users find appropriate templates quickly
- No broken references to moved or deleted files
- Template format consistency across categories

---

**Last Updated**: 2025-09-17 by system scan
**Next Review**: When template/example structure changes
**Maintainer**: docs-sync-agent (automated updates)
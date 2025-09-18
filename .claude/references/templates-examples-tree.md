---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-18"
status: "active"
target_audience: ["ai-assistants", "developers", "technical-writer"]
document_type: "reference"
priority: "high"
tags: ["templates", "examples", "reference", "navigation", "code-patterns"]
maintainer: "technical-writer"
---

# Templates and Examples Tree Reference

**Purpose**: Comprehensive index of all templates and code examples in the repository for efficient development and documentation creation.

**Note**: This file is maintained by the technical-writer. Do not edit manually.

## Root Level Template System

```text
templates/
├── README.md                           # Master template system overview and usage guide
├── template-format-reference.md       # Template formatting standards and variable syntax
├── code/                              # Code implementation templates
├── docs/                              # Project and technical documentation templates
├── workflow/                          # Development workflow templates
├── generation/                        # Auto-documentation generation templates (.tmpl files)
└── config/                            # Configuration and settings templates
```

## Generation Templates

```text
templates/generation/
├── dependency-graph.md.tmpl            # Dependency graph generation template
├── system-overview.md.tmpl             # System overview generation template
├── tech-stack.md.tmpl                  # Technology stack generation template
├── tech-stack-simple.md.tmpl           # Simplified tech stack generation template
└── technical-decision.md.tmpl          # Technical decision generation template
```

## Documentation Templates

```text
templates/docs/
├── api/
│   └── api.template.md                 # API documentation template
├── decisions/
│   └── adr.template.md                 # Architecture Decision Record template
├── development/
│   ├── README.md                       # Development templates overview
│   └── yaml-frontmatter-schema.md     # YAML frontmatter schema specification
├── project/
│   ├── api-service.template.md         # API service project README template
│   ├── cli-tool.template.md            # Command-line tool project README template
│   ├── enterprise.template.md          # Enterprise application README template
│   ├── library.template.md             # Library/package project README template
│   ├── mobile-app.template.md          # Mobile application README template
│   ├── project-readme.template.md      # Generic project README template
│   ├── standard-readme.template.md     # Standard project README template
│   ├── web-app.template.md             # Web application README template
│   ├── vision.template.md              # Project vision template
│   └── CHANGELOG.template.md           # Project changelog template following Keep a Changelog
└── technical/
    ├── api-reference.template.md       # API documentation template with OpenAPI structure
    ├── project-changelog.template.md   # Technical changelog template for releases
    └── project-vision.template.md      # Project vision and strategy document template
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

### Exploration Templates

```text
templates/workflow/exploration/
├── conversation.template.md            # Decision exploration conversation template
├── notes.template.md                   # Exploration notes and insights template
├── specialist-inputs.template.md       # Specialist agent consultation inputs template
└── state.template.yml                  # Exploration state tracking template
```

### Deliverable Templates

```text
templates/workflow/deliverables/
├── deliverable.template.md             # Standard deliverable template
└── deliverable-simple.template.md      # Simple deliverable template
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

### Configuration Templates

```text
templates/code/configs/
└── [empty - reserved for configuration templates]
```

### Test Templates

```text
templates/code/tests/
└── [empty - reserved for test templates]
```

## Configuration Templates

```text
templates/config/
└── claude-settings.template.json       # Claude Code settings template with MCP integration
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
├── api-file-upload.example.js          # File upload handling patterns
├── api-filtering.example.js            # Data filtering and search patterns
├── api-pagination.example.js           # API pagination implementation patterns
├── api-rate-limiting.example.js        # Rate limiting and throttling patterns
├── api-response.example.js             # API response format standardization
├── api-user-service.example.ts         # Complete user service implementation
├── api-validation.example.js           # Input validation patterns and middleware
├── component-user-card.example.tsx     # React component implementation example
└── test-user-service.example.test.ts   # Comprehensive testing patterns
```

### Authentication Examples

```text
examples/code/auth/
├── abac-authorization.example.js       # Attribute-based access control implementation
├── jwt-security.example.js             # JWT token security and validation
├── mfa-implementation.example.js       # Multi-factor authentication patterns
├── password-security.example.js        # Password hashing and security
├── rate-limiting.example.js            # Authentication rate limiting
├── rbac-authorization.example.js       # Role-based access control implementation
└── session-management.example.js       # Session handling and management
```

### Security Examples

```text
examples/code/security/
├── ai-security.example.js              # AI-specific security patterns
├── api-security.example.js             # API security implementation
├── compliance-governance.example.js    # Compliance and governance patterns
├── data-encryption.example.js          # Data encryption and protection
├── encryption-data-protection.example.js # Advanced encryption patterns
├── file-upload-security.example.js     # Secure file upload handling
├── governance-principles.example.js    # Security governance principles
├── input-validation.example.js         # Input validation and sanitization
├── jwt-api-security.example.js         # JWT API security implementation
├── security-controls.example.js        # Security controls and measures
├── security-monitoring.example.js      # Security monitoring and logging
├── security-testing.example.test.js    # Security testing patterns
├── semantic-security-analysis.example.js # Semantic security analysis
├── session-management.example.js       # Secure session management
└── session-security.example.js         # Advanced session security
```

### Testing Examples

```text
examples/code/testing/
├── ai-testing.example.js               # AI system testing patterns
├── ci-cd-testing.example.yml           # CI/CD testing pipeline configuration
├── e2e-testing.example.js              # End-to-end testing patterns
├── integration-testing.example.js      # Integration testing strategies
├── performance-testing.example.js      # Performance testing implementation
├── test-patterns.example.js            # General testing patterns and utilities
└── unit-testing.example.js             # Unit testing best practices
```

### Configuration Examples

```text
examples/code/configs/
└── config-app-config.example.ts        # Application configuration patterns
```

### Integration Examples

```text
examples/code/integrations/
└── [empty - reserved for integration examples]
```

### Documentation Examples

```text
examples/docs/
├── completed/                          # Completed documentation examples
└── references/                        # Reference documentation examples

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
├── examples/code/patterns/ (API and component patterns)
├── examples/code/auth/ (authentication examples)
├── examples/code/security/ (security implementation examples)
└── examples/code/testing/ (testing strategy examples)
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
Auto-Documentation:
├── templates/auto-docs/ (auto-generation templates)
├── templates/generation/ (documentation generation templates)
└── /docs generate commands (intelligent documentation)

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
├── examples/code/patterns/api-*.example.js (comprehensive API patterns)
├── examples/code/auth/ (authentication and authorization)
└── examples/code/security/ (security implementation)

Frontend Development:
├── templates/code/components/component.template.tsx
├── examples/code/patterns/component-user-card.example.tsx
└── examples/code/configs/config-app-config.example.ts

Testing:
├── examples/code/patterns/test-user-service.example.test.ts
└── examples/code/testing/ (comprehensive testing strategies)
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
  - docs/technical/decisions/explorations/templates/ (decision exploration)

Development_Phase:
  - templates/code/ (code templates)
  - examples/code/patterns/ (API and component patterns)
  - examples/code/auth/ (authentication patterns)
  - examples/code/security/ (security implementations)
  - examples/code/testing/ (testing strategies)
  - templates/workflow/planning/handoff.template.yml (coordination)

Documentation_Phase:
  - templates/auto-docs/ (auto-generation templates)
  - templates/generation/ (documentation generation)
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
  - examples/code/auth/ (API authentication)
  - examples/code/security/api-security.example.js
  - templates/documentation/technical/api-reference.template.md

Web_Applications:
  - templates/documentation/project/web-app.template.md
  - templates/code/components/component.template.tsx
  - examples/code/patterns/component-*.example.tsx
  - examples/code/security/ (web security patterns)

CLI_Tools:
  - templates/documentation/project/cli-tool.template.md
  - examples/code/configs/config-*.example.ts

Libraries:
  - templates/documentation/project/library.template.md
  - templates/documentation/technical/api-reference.template.md
  - examples/code/testing/ (library testing patterns)

Enterprise_Applications:
  - templates/documentation/project/enterprise.template.md
  - templates/workflow/feature/feature-comprehensive.template.md
  - examples/code/security/ (enterprise security)
  - examples/code/testing/ (enterprise testing strategies)
```

### **By User Type**

```yaml
Developers:
  - templates/code/ (implementation templates)
  - examples/code/patterns/ (API and component patterns)
  - examples/code/auth/ (authentication implementations)
  - examples/code/security/ (security patterns)
  - examples/code/testing/ (testing strategies)
  - templates/workflow/planning/ (coordination)

Technical_Writers:
  - templates/auto-docs/ (auto-generation templates)
  - templates/generation/ (documentation generation)
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

Security_Engineers:
  - examples/code/security/ (security implementation patterns)
  - examples/code/auth/ (authentication and authorization)
  - templates/auto-docs/ (security documentation generation)

QA_Engineers:
  - examples/code/testing/ (comprehensive testing strategies)
  - examples/code/security/security-testing.example.test.js
```

## Quick Reference Commands

### **Template Discovery**

```bash
# Find templates by category
find templates/ -name "*.template.*" -o -name "*.tmpl" | grep [category]

# List all available templates
cat templates/README.md

# Get template format reference
cat templates/TEMPLATE-FORMAT-REFERENCE.md

# List auto-docs templates
ls templates/auto-docs/

# List generation templates
ls templates/generation/
```

### **Example Usage**

```bash
# Browse code examples
cat examples/README.md

# View API pattern examples
ls examples/code/patterns/

# View authentication examples
ls examples/code/auth/

# View security examples
ls examples/code/security/

# View testing examples
ls examples/code/testing/

# Study workflow examples
cat examples/workflow/complete-feature-workflow-example.md
```

### **Template Selection**

```bash
# Feature development
ls templates/workflow/feature/

# Auto-documentation
ls templates/auto-docs/

# Project initialization
ls templates/documentation/project/

# Code implementation
ls templates/code/ && ls examples/code/

# Security patterns
ls examples/code/security/

# Testing strategies
ls examples/code/testing/
```

## Maintenance Notes

**For technical-writer**: This file should be updated whenever:
- New templates are added to any templates/ directory (including auto-docs/ and generation/)
- New examples are added to any examples/ directory (including auth/, security/, testing/)
- Template files are moved, renamed, or restructured
- Template purposes or usage patterns change
- New template categories are introduced
- Auto-documentation templates are modified
- Security or testing example patterns are added

**Update Process**:
1. Scan all templates/ and examples/ directories for changes
2. Pay special attention to auto-docs/, generation/, auth/, security/, and testing/ directories
3. Update tree structure to reflect current organization
4. Verify all template and example descriptions are accurate
5. Maintain consistent categorization and usage patterns
6. Update quick reference commands if structure changes
7. Ensure new security and testing examples are properly categorized

**Quality Checks**:
- All templates should have clear, descriptive purposes
- Examples should demonstrate practical usage patterns
- Categories should help users find appropriate templates quickly
- No broken references to moved or deleted files
- Template format consistency across categories
- Auto-docs templates (.tmpl files) are properly documented
- Security examples cover comprehensive threat patterns
- Testing examples demonstrate various testing strategies
- Empty directories are noted as "reserved" rather than ignored

---

**Last Updated**: 2025-09-18 by template cleanup reorganization
**Next Review**: When template/example structure changes
**Maintainer**: technical-writer (automated updates)
**Key Changes**: Consolidated all templates under templates/ directory, standardized naming convention, removed duplicates, improved organization
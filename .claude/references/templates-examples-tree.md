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
.resources/templates/
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
.resources/templates/generation/
├── dependency-graph.md.tmpl            # Dependency graph generation template
├── system-overview.md.tmpl             # System overview generation template
├── tech-stack.md.tmpl                  # Technology stack generation template
├── tech-stack-simple.md.tmpl           # Simplified tech stack generation template
└── technical-decision.md.tmpl          # Technical decision generation template
```

## Documentation Templates

```text
.resources/templates/docs/
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
.resources/templates/workflow/feature/
├── README.md                           # Feature template usage guide and selection criteria
├── feature-minimal.template.md         # Lightweight feature specification template
├── feature-standard.template.md        # Standard feature specification template
└── feature-comprehensive.template.md   # Comprehensive feature specification template
```

### Architecture Templates

```text
.resources/templates/workflow/architecture/
└── architecture.template.md            # Architecture decision and design template
```

### Planning and Coordination Templates

```text
.resources/templates/workflow/planning/
├── plan.template.md                    # Implementation plan template for /plan workflow
├── research.template.md                # Research document template for context gathering
└── handoff.template.yml                # Agent coordination handoff template
```

### Exploration Templates

```text
.resources/templates/workflow/exploration/
├── conversation.template.md            # Decision exploration conversation template
├── notes.template.md                   # Exploration notes and insights template
├── specialist-inputs.template.md       # Specialist agent consultation inputs template
└── state.template.yml                  # Exploration state tracking template
```

### Deliverable Templates

```text
.resources/templates/workflow/deliverables/
├── deliverable.template.md             # Standard deliverable template
└── deliverable-simple.template.md      # Simple deliverable template
```

### Implementation Templates

```text
.resources/templates/workflow/implementation/
└── implementation-record.template.md   # Implementation record template for completed work
```

## Code Templates

### API Development Templates

```text
.resources/templates/code/api/
└── service.template.ts                 # TypeScript API service template with best practices
```

### Component Templates

```text
.resources/templates/code/components/
└── component.template.tsx              # React component template with TypeScript
```

### Configuration Templates

```text
.resources/templates/code/configs/
└── [empty - reserved for configuration templates]
```

### Test Templates

```text
.resources/templates/code/tests/
└── [empty - reserved for test templates]
```

## Configuration Templates

```text
.resources/templates/config/
└── claude-settings.template.json       # Claude Code settings template with MCP integration
```



## Working Examples

### Root Examples System

```text
.resources/examples/
├── README.md                           # Examples system overview and navigation guide
└── [category directories]/             # Organized example collections by type
```

### Workflow Examples

```text
.resources/examples/workflow/
├── README.md                           # Workflow examples overview and usage patterns
├── complete-feature-workflow-example.md  # End-to-end feature development example
└── template-usage-guide.md            # Guide for using templates effectively
```

### Code Pattern Examples

```text
.resources/examples/code/patterns/
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
.resources/examples/code/auth/
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
.resources/examples/code/security/
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
.resources/examples/code/testing/
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
.resources/examples/code/configs/
└── config-app-config.example.ts        # Application configuration patterns
```

### Integration Examples

```text
.resources/examples/code/integrations/
└── [empty - reserved for integration examples]
```

### Documentation Examples

```text
.resources/examples/docs/
├── completed/                          # Completed documentation examples
└── references/                        # Reference documentation examples

## Template Categories by Purpose

### **Project Initialization** (Start New Projects)

```text
Project README Templates:
├── .resources/templates/documentation/project/api-service.template.md
├── .resources/templates/documentation/project/web-app.template.md
├── .resources/templates/documentation/project/cli-tool.template.md
├── .resources/templates/documentation/project/library.template.md
├── .resources/templates/documentation/project/mobile-app.template.md
├── .resources/templates/documentation/project/enterprise.template.md
└── .resources/templates/documentation/project/project-readme.template.md

Project Setup Templates:
├── .resources/templates/documentation/project/CHANGELOG.template.md
├── .resources/templates/documentation/technical/project-vision.template.md
└── .claude/settings.template.json
```

### **Feature Development** (Build New Features)

```text
Feature Specification:
├── .resources/templates/workflow/feature/feature-minimal.template.md
├── .resources/templates/workflow/feature/feature-standard.template.md
└── .resources/templates/workflow/feature/feature-comprehensive.template.md

Implementation Planning:
├── .resources/templates/workflow/planning/plan.template.md
├── .resources/templates/workflow/planning/research.template.md
└── .resources/templates/workflow/planning/handoff.template.yml

Code Implementation:
├── .resources/templates/code/api/service.template.ts
├── .resources/templates/code/components/component.template.tsx
├── .resources/examples/code/patterns/ (API and component patterns)
├── .resources/examples/code/auth/ (authentication examples)
├── .resources/examples/code/security/ (security implementation examples)
└── .resources/examples/code/testing/ (testing strategy examples)
```

### **Architecture and Design** (Make Technical Decisions)

```text
Architecture Documentation:
├── .resources/templates/workflow/architecture/architecture.template.md
├── docs/technical/architecture/.resources/examples/architecture-template.md
└── docs/technical/decisions/explorations/.resources/templates/ (decision exploration)

Decision Recording:
├── docs/technical/decisions/explorations/.resources/templates/conversation-template.md
├── docs/technical/decisions/explorations/.resources/templates/notes-template.md
└── docs/technical/decisions/explorations/.resources/templates/specialist-inputs-template.md
```

### **Documentation Creation** (Document Systems)

```text
Auto-Documentation:
├── .resources/templates/auto-docs/ (auto-generation templates)
├── .resources/templates/generation/ (documentation generation templates)
└── /docs generate commands (intelligent documentation)

API Documentation:
├── .resources/templates/documentation/technical/api-reference.template.md
└── .resources/examples/code/patterns/api-*.example.js (reference implementations)

Technical Writing:
├── .resources/templates/documentation/technical/project-changelog.template.md
├── .resources/templates/documentation/technical/project-vision.template.md
└── docs/development/.resources/templates/api.template.md (legacy)
```

### **Code Development** (Implement Solutions)

```text
Backend Development:
├── .resources/templates/code/api/service.template.ts
├── .resources/examples/code/patterns/api-*.example.js (comprehensive API patterns)
├── .resources/examples/code/auth/ (authentication and authorization)
└── .resources/examples/code/security/ (security implementation)

Frontend Development:
├── .resources/templates/code/components/component.template.tsx
├── .resources/examples/code/patterns/component-user-card.example.tsx
└── .resources/examples/code/configs/config-app-config.example.ts

Testing:
├── .resources/examples/code/patterns/test-user-service.example.test.ts
└── .resources/examples/code/testing/ (comprehensive testing strategies)
```

### **Workflow Management** (Coordinate Development)

```text
Implementation Records:
├── .resources/templates/workflow/implementation/implementation-record.template.md
└── .resources/examples/workflow/complete-feature-workflow-example.md

Process Documentation:
├── .resources/examples/workflow/template-usage-guide.md
└── .resources/templates/README.md (master guide)
```

## Template Usage Patterns

### **By Development Phase**

```yaml
Planning_Phase:
  - .resources/templates/workflow/feature/ (feature specifications)
  - .resources/templates/workflow/architecture/ (technical design)
  - .resources/templates/workflow/planning/ (implementation planning)
  - docs/technical/decisions/explorations/.resources/templates/ (decision exploration)

Development_Phase:
  - .resources/templates/code/ (code templates)
  - .resources/examples/code/patterns/ (API and component patterns)
  - .resources/examples/code/auth/ (authentication patterns)
  - .resources/examples/code/security/ (security implementations)
  - .resources/examples/code/testing/ (testing strategies)
  - .resources/templates/workflow/planning/handoff.template.yml (coordination)

Documentation_Phase:
  - .resources/templates/auto-docs/ (auto-generation templates)
  - .resources/templates/generation/ (documentation generation)
  - .resources/templates/documentation/ (all documentation types)
  - .resources/templates/workflow/implementation/ (implementation records)
  - .resources/examples/workflow/ (process examples)

Release_Phase:
  - .resources/templates/documentation/project/CHANGELOG.template.md
  - .resources/templates/documentation/technical/project-changelog.template.md
```

### **By Project Type**

```yaml
API_Projects:
  - .resources/templates/documentation/project/api-service.template.md
  - .resources/templates/code/api/service.template.ts
  - .resources/examples/code/patterns/api-*.example.js
  - .resources/examples/code/auth/ (API authentication)
  - .resources/examples/code/security/api-security.example.js
  - .resources/templates/documentation/technical/api-reference.template.md

Web_Applications:
  - .resources/templates/documentation/project/web-app.template.md
  - .resources/templates/code/components/component.template.tsx
  - .resources/examples/code/patterns/component-*.example.tsx
  - .resources/examples/code/security/ (web security patterns)

CLI_Tools:
  - .resources/templates/documentation/project/cli-tool.template.md
  - .resources/examples/code/configs/config-*.example.ts

Libraries:
  - .resources/templates/documentation/project/library.template.md
  - .resources/templates/documentation/technical/api-reference.template.md
  - .resources/examples/code/testing/ (library testing patterns)

Enterprise_Applications:
  - .resources/templates/documentation/project/enterprise.template.md
  - .resources/templates/workflow/feature/feature-comprehensive.template.md
  - .resources/examples/code/security/ (enterprise security)
  - .resources/examples/code/testing/ (enterprise testing strategies)
```

### **By User Type**

```yaml
Developers:
  - .resources/templates/code/ (implementation templates)
  - .resources/examples/code/patterns/ (API and component patterns)
  - .resources/examples/code/auth/ (authentication implementations)
  - .resources/examples/code/security/ (security patterns)
  - .resources/examples/code/testing/ (testing strategies)
  - .resources/templates/workflow/planning/ (coordination)

Technical_Writers:
  - .resources/templates/auto-docs/ (auto-generation templates)
  - .resources/templates/generation/ (documentation generation)
  - .resources/templates/documentation/ (all documentation templates)
  - docs/development/.resources/templates/ (legacy templates)
  - .resources/examples/workflow/template-usage-guide.md

Project_Managers:
  - .resources/templates/workflow/feature/ (feature specifications)
  - .resources/templates/workflow/implementation/ (progress tracking)
  - .resources/examples/workflow/complete-feature-workflow-example.md

Architects:
  - .resources/templates/workflow/architecture/ (design documentation)
  - docs/technical/decisions/explorations/.resources/templates/ (decision making)
  - docs/technical/architecture/.resources/examples/ (architecture patterns)

Security_Engineers:
  - .resources/examples/code/security/ (security implementation patterns)
  - .resources/examples/code/auth/ (authentication and authorization)
  - .resources/templates/auto-docs/ (security documentation generation)

QA_Engineers:
  - .resources/examples/code/testing/ (comprehensive testing strategies)
  - .resources/examples/code/security/security-testing.example.test.js
```

## Quick Reference Commands

### **Template Discovery**

```bash
# Find templates by category
find .resources/templates/ -name "*.template.*" -o -name "*.tmpl" | grep [category]

# List all available templates
cat .resources/templates/README.md

# Get template format reference
cat .resources/templates/TEMPLATE-FORMAT-REFERENCE.md

# List auto-docs templates
ls .resources/templates/auto-docs/

# List generation templates
ls .resources/templates/generation/
```

### **Example Usage**

```bash
# Browse code examples
cat .resources/examples/README.md

# View API pattern examples
ls .resources/examples/code/patterns/

# View authentication examples
ls .resources/examples/code/auth/

# View security examples
ls .resources/examples/code/security/

# View testing examples
ls .resources/examples/code/testing/

# Study workflow examples
cat .resources/examples/workflow/complete-feature-workflow-example.md
```

### **Template Selection**

```bash
# Feature development
ls .resources/templates/workflow/feature/

# Auto-documentation
ls .resources/templates/auto-docs/

# Project initialization
ls .resources/templates/documentation/project/

# Code implementation
ls .resources/templates/code/ && ls .resources/examples/code/

# Security patterns
ls .resources/examples/code/security/

# Testing strategies
ls .resources/examples/code/testing/
```

## Maintenance Notes

**For technical-writer**: This file should be updated whenever:
- New templates are added to any .resources/templates/ directory (including auto-docs/ and generation/)
- New examples are added to any .resources/examples/ directory (including auth/, security/, testing/)
- Template files are moved, renamed, or restructured
- Template purposes or usage patterns change
- New template categories are introduced
- Auto-documentation templates are modified
- Security or testing example patterns are added

**Update Process**:
1. Scan all .resources/templates/ and .resources/examples/ directories for changes
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
**Key Changes**: Consolidated all templates under .resources/templates/ directory, standardized naming convention, removed duplicates, improved organization
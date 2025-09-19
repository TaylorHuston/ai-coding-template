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
└── config/                            # Configuration and settings templates
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
└── project/
    ├── project-brief.template.md       # Project brief template
    ├── library.template.md             # Library/package project README template
    ├── enterprise.template.md          # Enterprise application README template
    ├── mobile-app.template.md          # Mobile application README template
    ├── api-service.template.md         # API service project README template
    ├── cli-tool.template.md            # Command-line tool project README template
    ├── standard-readme.template.md     # Standard project README template
    ├── web-app.template.md             # Web application README template
    ├── project-readme.template.md      # Generic project README template
    └── CHANGELOG.template.md           # Project changelog template following Keep a Changelog
```

## Workflow Templates

### Epic Templates

```text
.resources/templates/workflow/epic/
├── adr.template.md                     # Architecture Decision Record template for epics
├── epic.template.md                    # Main epic planning document template
├── research.template.md                # Research document for epic-level tasks
├── task.template.md                    # Individual task template within an epic
└── testing-task.template.md          # Dedicated testing task template for epics
```

### Feature Development Templates

```text
.resources/templates/workflow/feature/
├── README.md                           # Feature template usage guide and selection criteria
├── feature-minimal.template.md         # Lightweight feature specification template
├── feature-standard.template.md        # Standard feature specification template
├── feature-comprehensive.template.md   # Comprehensive feature specification template
└── feature.template.md                 # Generic feature template
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
└── research.template.md                # Research document template for context gathering
```

### Exploration Templates

```text
.resources/templates/workflow/exploration/
├── conversation.template.md            # Decision exploration conversation template
├── notes.template.md                   # Exploration notes and insights template
└── specialist-inputs.template.md       # Specialist agent consultation inputs template
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

### Other Workflow Templates

```text
.resources/templates/workflow/
└── context-management.template.md      # Template for managing context across sessions
```

## Code Templates

```text
.resources/templates/code/
├── api/
│   └── service.template.ts                 # TypeScript API service template with best practices
└── components/
    └── component.template.tsx              # React component template with TypeScript
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

### Documentation Examples

```text
.resources/examples/docs/
├── completed/                          # Completed documentation examples
└── references/                        # Reference documentation examples
```
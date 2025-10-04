---
version: "0.2.1"
created: "2025-09-17"
last_updated: "2025-09-19"
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
.claude/resources/templates/
├── README.md                           # Master template system overview and usage guide
├── template-format-reference.md       # Template formatting standards and variable syntax
├── architecture/                      # Architecture decision templates
├── ci-cd/                             # CI/CD pipeline templates
├── code/                              # Code implementation templates
├── config/                            # Configuration and settings templates
├── docs/                              # Project and technical documentation templates
├── generation/                        # Auto-generation utility templates
└── workflow/                          # Development workflow templates
```

## Architecture Templates

```text
.claude/resources/templates/architecture/
├── adr-detailed.template.md            # Detailed Architecture Decision Record template
└── adr-fast-track.template.md          # Fast-track ADR template for quick decisions
```

## CI/CD Templates

```text
.claude/resources/templates/ci-cd/
├── github-actions-link-validation.yml  # GitHub Actions workflow for link validation
└── gitlab-ci-link-validation.yml       # GitLab CI pipeline for link validation
```

## Documentation Templates

```text
.claude/resources/templates/docs/
├── api/
│   └── api.template.md                 # API documentation template
├── decisions/
│   └── adr.template.md                 # Architecture Decision Record template
├── development/
│   ├── README.md                       # Development templates overview
│   └── yaml-frontmatter-schema.md     # YAML frontmatter schema specification
├── project/
│   ├── CHANGELOG.template.md           # Project changelog template following Keep a Changelog
│   └── project-brief.template.md       # Project brief template
└── technical/
    └── api-reference.template.md       # Technical API reference template
```

## Workflow Templates

### Epic Templates

```text
.claude/resources/templates/workflow/epic/
├── adr.template.md                     # Architecture Decision Record template for epics
├── epic.template.md                    # Main epic planning document template
├── handoff.template.yml                # Epic handoff configuration template
├── research.template.md                # Research document for epic-level tasks
├── task.template.md                    # Individual task template within an epic
└── testing-task.template.md           # Dedicated testing task template for epics
```

### Architecture Templates

```text
.claude/resources/templates/workflow/architecture/
└── architecture.template.md            # Architecture decision and design template
```

### Bug Templates

```text
.claude/resources/templates/workflow/bugs/
├── bug.template.md                     # Bug report and tracking template
└── handoff.template.yml               # Bug handoff configuration template
```

### Exploration Templates

```text
.claude/resources/templates/workflow/exploration/
├── conversation.template.md            # Decision exploration conversation template
├── notes.template.md                   # Exploration notes and insights template
├── specialist-inputs.template.md       # Specialist agent consultation inputs template
└── state.template.yml                 # Exploration state tracking template
```

### Deliverable Templates

```text
.claude/resources/templates/workflow/deliverables/
└── deliverable.template.md             # Standard deliverable template
```

### Implementation Templates

```text
.claude/resources/templates/workflow/implementation/
└── implementation-record.template.md   # Implementation record template for completed work
```

### Other Workflow Templates

```text
.claude/resources/templates/workflow/
├── context-management.template.md      # Template for managing context across sessions
└── decision-ledger.template.yml        # Decision tracking and ledger template
```

## Code Templates

```text
.claude/resources/templates/code/
├── api/
│   └── service.template.ts             # TypeScript API service template with best practices
├── components/
│   └── component.template.tsx          # React component template with TypeScript
├── configs/                           # Configuration code templates (empty)
└── tests/                             # Test code templates (empty)
```

## Configuration Templates

```text
.claude/resources/templates/config/
└── claude-settings.template.json       # Claude Code settings template with MCP integration
```

## Working Examples

### Root Examples System

```text
.claude/resources/examples/
├── README.md                           # Examples system overview and navigation guide
├── api/                               # API-specific examples and patterns
├── architecture/                      # Architectural pattern examples
├── code/                              # Code implementation examples
├── code-review/                       # Code review process examples
├── docs/                              # Documentation examples
└── workflow/                          # Workflow examples
```

### API Examples

```text
.claude/resources/examples/api/
├── deprecation-middleware.js           # API deprecation handling middleware
├── http-headers-versioning.md          # HTTP header versioning documentation
├── jwt-authentication.js              # JWT authentication implementation
├── rest-controller.js                  # REST API controller patterns
└── url-structure.md                   # API URL structure guidelines
```

### Architecture Examples

```text
.claude/resources/examples/architecture/
├── kiss-principle.js                   # KISS principle implementation example
├── principle-conflicts.js              # Handling architectural principle conflicts
└── solid-srp.ts                       # SOLID Single Responsibility Principle example
```

### Code Review Examples

```text
.claude/resources/examples/code-review/
├── ai-generated-code-example.js        # Example of AI-generated code for review
├── ai-review-feedback.md               # AI code review feedback template
├── ci-workflow.yml                     # CI workflow for automated code review
├── code-structure-examples.js          # Code structure examples for review
├── error-handling-examples.js          # Error handling review examples
├── feedback-templates.md               # Code review feedback templates
├── input-validation-examples.js        # Input validation review examples
├── performance-review-template.md      # Performance review template
├── response-template.md                # Code review response template
├── review-metrics.js                   # Code review metrics tracking
├── review-retrospective.md             # Review process retrospective template
├── security-review-template.md         # Security review template
└── testing-examples.js                # Testing review examples
```

### Workflow Examples

```text
.claude/resources/examples/workflow/
├── README.md                           # Workflow examples overview and usage patterns
├── complete-feature-workflow-example.md  # End-to-end feature development example
└── template-usage-guide.md            # Guide for using templates effectively
```

### Code Pattern Examples

```text
.claude/resources/examples/code/patterns/
├── advanced-testing.example.js         # Advanced testing techniques and patterns
├── ai-ml-integration.example.js        # AI/ML integration patterns
├── api-auth.example.js                 # Authentication implementation patterns
├── api-error-handling.example.js       # Error handling patterns and best practices
├── api-file-upload.example.js          # File upload handling patterns
├── api-filtering.example.js            # Data filtering and search patterns
├── api-pagination.example.js           # API pagination implementation patterns
├── api-rate-limiting.example.js        # Rate limiting and throttling patterns
├── api-response.example.js             # API response format standardization
├── api-user-service.example.ts         # Complete user service implementation
├── api-validation.example.js           # Input validation patterns and middleware
├── api-versioning.example.js           # API versioning implementation patterns
├── caching-strategies.example.js       # Caching implementation strategies
├── circuit-breaker.example.js          # Circuit breaker pattern implementation
├── class-naming.ts                     # Class naming conventions and patterns
├── cloud-native.example.js             # Cloud-native development patterns
├── comments-documentation.js           # Code commenting and documentation patterns
├── component-user-card.example.tsx     # React component implementation example
├── error-handling.js                   # General error handling patterns
├── event-sourcing.example.js           # Event sourcing implementation patterns
├── file-organization.js                # File organization and structure patterns
├── function-organization.js            # Function organization patterns
├── graphql-api.example.js              # GraphQL API implementation patterns
├── logging-standards.js                # Logging standards and patterns
├── message-queue.example.js            # Message queue implementation patterns
├── monitoring-observability.example.js # Monitoring and observability patterns
├── naming-conventions.js               # General naming convention patterns
├── performance-optimization.example.js # Performance optimization techniques
├── performance-patterns.js             # Performance-focused coding patterns
├── security-standards.js               # Security coding standards
├── test-user-service.example.test.ts   # Comprehensive testing patterns
└── testable-code.js                    # Writing testable code patterns
```

### Authentication Examples

```text
.claude/resources/examples/code/auth/
├── abac-authorization.example.js       # Attribute-based access control implementation
├── jwt-security.example.js             # JWT token security and validation
├── mfa-implementation.example.js       # Multi-factor authentication patterns
├── oauth2-flows.example.js             # OAuth2 flow implementations
├── password-security.example.js        # Password hashing and security
├── rate-limiting.example.js            # Authentication rate limiting
├── rbac-authorization.example.js       # Role-based access control implementation
└── session-management.example.js       # Session handling and management
```

### Security Examples

```text
.claude/resources/examples/code/security/
├── ai-security.example.js              # AI-specific security patterns
├── api-security.example.js             # API security implementation
├── compliance-governance.example.js    # Compliance and governance patterns
├── data-encryption.example.js          # Data encryption and protection
├── file-upload-security.example.js     # Secure file upload handling
├── governance-principles.example.js    # Security governance principles
├── input-validation.example.js         # Input validation and sanitization
├── policy/                             # Security policy implementations
│   ├── attack-surface-analysis.js      # Attack surface analysis implementation
│   ├── compliance-monitoring.js        # Compliance monitoring systems
│   ├── detective-controls.js           # Detective security controls
│   ├── preventive-controls.js          # Preventive security controls
│   ├── responsive-controls.js          # Responsive security controls
│   ├── risk-management.js              # Risk management implementation
│   ├── security-metrics.js             # Security metrics and monitoring
│   └── threat-modeling.js              # Threat modeling implementation
├── security-controls.example.js        # Security controls and measures
├── security-monitoring.example.js      # Security monitoring and logging
├── security-testing.example.test.js    # Security testing patterns
└── semantic-security-analysis.example.js # Semantic security analysis
```

### Testing Examples

```text
.claude/resources/examples/code/testing/
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
.claude/resources/examples/code/configs/
└── config-app-config.example.ts        # Application configuration patterns
```

### Documentation Examples

```text
.claude/resources/examples/docs/
├── completed/                          # Completed documentation examples (empty)
├── references/                        # Reference documentation examples (empty)
├── document-length-guidelines.md       # Guidelines for document length and structure
├── file-structure.md                   # Documentation file structure guidelines
├── plan-template.md                    # Planning document template example
├── readme-template.md                  # README file template example
└── yaml-frontmatter.md                # YAML frontmatter usage examples
```
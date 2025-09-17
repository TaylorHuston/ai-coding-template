---
version: "1.0.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["ai-assistants", "docs-sync-agent"]
document_type: "reference"
priority: "high"
tags: ["documentation", "reference", "navigation", "index"]
maintainer: "docs-sync-agent"
---

# Documentation Tree Reference

**Purpose**: Comprehensive index of all documentation files in the repository for efficient navigation and updates.

**Note**: This file is maintained by the docs-sync-agent. Do not edit manually.

## Root Level Documentation

```
/
├── README.md                           # Main project introduction and quick start guide
├── START-HERE.md                       # New user guided introduction and entry point
├── STATUS.md                           # Current project state and context for AI assistants
└── CLAUDE.md                           # AI assistant instructions and workflow specifications
```

## Core AI Framework Documentation

```
.claude/
├── agent-best-practices.md             # Guidelines for effective AI agent usage patterns
├── integration.md                      # AI system integration patterns and procedures
├── mcp-integration-guide.md            # MCP server setup and configuration guide
├── precedence.md                       # AI instruction precedence and conflict resolution
├── agents/
│   ├── README.md                       # Complete agent catalog and selection guide
│   ├── ai-llm-expert.md               # AI/LLM architecture and implementation specialist
│   ├── api-designer.md                # API design and service contract specialist
│   ├── backend-specialist.md          # Server-side implementation and business logic expert
│   ├── code-architect.md              # System design and architectural decision specialist
│   ├── code-reviewer.md               # Code quality assessment and review specialist
│   ├── context-analyzer.md            # Project investigation and analysis specialist
│   ├── data-analyst.md                # Data processing and analytics specialist
│   ├── database-specialist.md         # Database design and optimization specialist
│   ├── devops-engineer.md             # Infrastructure and deployment automation specialist
│   ├── docs-sync-agent.md             # Documentation synchronization and maintenance agent
│   ├── frontend-specialist.md         # UI/UX development and optimization specialist
│   ├── migration-specialist.md        # Framework upgrades and system migration specialist
│   ├── performance-optimizer.md       # Performance analysis and optimization specialist
│   ├── project-manager.md             # Multi-agent coordination and project orchestration
│   ├── refactoring-specialist.md      # Code improvement and technical debt reduction
│   ├── security-auditor.md            # Security assessment and compliance specialist
│   ├── technical-writer.md            # Technical documentation creation specialist
│   └── test-engineer.md               # Testing strategy and quality assurance specialist
└── working/                            # Active development workspace and coordination files
    ├── README.md                       # Working directory usage and structure guide
    └── [issue-directories]/            # Issue-specific PLAN.md, RESEARCH.md, HANDOFF.yml files
```

## Main Documentation Hub

```
docs/
├── README.md                           # Documentation overview and navigation guide
├── vision-template.md                  # Project vision document template for new projects
└── reports/
    └── documentation-health.md         # Automated documentation health status report
```

## AI Tools Documentation

```
docs/ai-tools/
├── README.md                           # AI tools and workflow system overview
├── system-context.md                  # System-wide context and integration patterns
├── guides/
│   ├── ai-agents-guide.md             # Comprehensive agent usage and coordination guide
│   ├── ai-collaboration-guide.md      # AI-human collaboration patterns and best practices
│   ├── multi-model-consultation-guide.md  # Multi-model AI consultation and cross-validation
│   └── using-agents.md                # Practical agent selection and orchestration guide
├── reference/
│   ├── README.md                      # Reference documentation index and navigation
│   ├── ai-assistant-guide.md          # General AI assistant usage guidelines
│   ├── commands.md                    # Complete command reference and usage guide
│   ├── development-commands.md        # Development-specific command documentation
│   ├── setup-manager.md               # Setup manager script comprehensive reference
│   ├── tool-selection.md              # Tool selection criteria and decision matrix
│   └── troubleshooting.md             # Comprehensive troubleshooting guide
└── setup/
    ├── claude-code-hooks-setup.md     # Claude Code hooks configuration and integration
    ├── integration-guide.md           # Adding AI workflow to existing projects
    ├── mcp-setup.md                   # MCP server configuration and enhanced capabilities
    ├── memory-integration-guide.md    # Memory-bank integration and persistent learning
    ├── project-management-integration.md  # External project management tool integration
    ├── quick-start.md                 # Complete setup and configuration guide
    └── rag-setup.md                   # RAG implementation and knowledge base setup
```

## Development Guidelines

```
docs/development/
├── README.md                           # Development documentation overview and standards
├── guidelines/
│   ├── README.md                      # Development guidelines index and navigation
│   ├── api-design-principles.md       # Core API design philosophy and standards
│   ├── api-documentation-standards.md # OpenAPI specifications and documentation requirements
│   ├── api-implementation-patterns.md # Practical API implementation patterns and best practices
│   ├── architectural-principles.md    # System architecture design principles
│   ├── authentication-authorization.md # Auth implementation patterns and security
│   ├── changelog-maintenance.md       # Version history and change tracking guidelines
│   ├── code-review-guidelines.md      # Code review process and quality standards
│   ├── coding-standards.md            # Language-specific coding conventions
│   ├── documentation-guidelines.md    # Documentation standards and maintenance procedures
│   ├── documentation-maintenance.md   # Documentation lifecycle and update procedures
│   ├── git-workflow.md                # Git branching strategy and commit conventions
│   ├── quality-standards.md           # Comprehensive quality requirements and validation
│   ├── security-implementation.md     # Security implementation patterns and procedures
│   ├── security-principles.md         # Security design principles and threat modeling
│   ├── testing-guidelines.md          # Testing strategies and coverage requirements
│   ├── visual-documentation.md        # Diagram and visual documentation standards
│   └── legacy/
│       ├── README.md                  # Legacy guidelines archive index
│       ├── api-design-guidelines.md   # Archived API design guidelines
│       └── security-guidelines.md     # Archived security guidelines
├── setup/
│   └── environment-setup.md           # Development environment configuration guide
└── workflows/
    ├── README.md                      # Development workflows overview
    ├── benchmarking.md                # Performance measurement and validation workflows
    ├── deployment-guide.md            # Deployment processes and quality gates
    └── deployment-patterns.md         # Deployment strategy patterns and best practices
```

## Technical Documentation

```
docs/technical/
├── README.md                           # Technical documentation overview and organization
├── api/
│   └── README.md                      # API documentation index and standards
├── architecture/
│   ├── README.md                      # Architecture documentation overview
│   ├── c4-overview.md                 # C4 model architectural documentation
│   └── auto-generated/
│       ├── README.md                  # Auto-generated documentation index
│       ├── dependency-graph.md        # Project dependency analysis and visualization
│       ├── system-overview.md         # Automated system architecture overview
│       └── tech-stack.md              # Technology stack documentation
├── database/
│   └── README.md                      # Database design and schema documentation
├── decisions/
│   ├── README.md                      # Architecture Decision Records index
│   ├── template.md                    # ADR template for consistent decision documentation
│   ├── adr-001-adopt-automatic-documentation-generation.md  # ADR: Documentation automation
│   └── explorations/
│       ├── README.md                  # Decision exploration sessions index
│       └── 20250116-103045-graphql-migration/
│           ├── conversation.md        # Exploration conversation log
│           ├── notes.md               # Decision exploration notes
│           └── specialist-inputs.md   # Specialist agent consultation inputs
├── features/
│   ├── README.md                      # Feature documentation index and standards
│   └── sample-user-authentication.md # Example feature specification document
└── implementations/
    └── README.md                      # Implementation records index and archive
```

## Archived Documentation

```
docs/archived/
├── README.md                           # Archived documentation index and migration notes
└── ai-collaboration/
    ├── README.md                      # Archived AI collaboration documentation index
    ├── ai-architecture-patterns.md    # Legacy AI architecture patterns
    ├── ai-branching-strategy.md       # Legacy AI branching strategy documentation
    ├── context-engineering.md         # Legacy context engineering techniques
    └── prompting.md                   # Legacy prompting strategies and techniques
```

## Memory Bank Documentation

```
memory-bank/
├── activeContext.md                    # Current active project context and state
├── productContext.md                  # Product vision and business context
├── progress.md                        # Project progress tracking and milestones
├── projectbrief.md                    # Project overview and objectives
├── systemPatterns.md                  # Learned system patterns and best practices
├── techContext.md                     # Technical context and stack information
└── features/
    └── sample-feature.md              # Example feature memory structure
```

## Infrastructure Documentation

```
scripts/
└── README.md                          # Complete scripts reference and automation guide

.githooks/
└── README.md                          # Git hooks setup and configuration guide
```

## Documentation Categories

### **Core Navigation** (Start Here)
- `README.md` - Project introduction
- `START-HERE.md` - New user guide
- `docs/README.md` - Documentation hub

### **AI Framework** (Essential for AI Development)
- `.claude/agents/README.md` - Agent catalog
- `docs/ai-tools/guides/using-agents.md` - Agent usage guide
- `docs/ai-tools/reference/commands.md` - Command reference
- `CLAUDE.md` - AI instructions

### **Development Standards** (Quality & Process)
- `docs/development/guidelines/README.md` - Guidelines index
- `docs/development/guidelines/quality-standards.md` - Quality requirements
- `docs/development/guidelines/coding-standards.md` - Code conventions
- `docs/development/workflows/README.md` - Development workflows

### **Technical Reference** (Architecture & Decisions)
- `docs/technical/README.md` - Technical docs overview
- `docs/technical/decisions/README.md` - ADR index
- `docs/technical/architecture/README.md` - Architecture docs
- `STATUS.md` - Current project state

### **Setup & Integration** (Getting Started)
- `docs/ai-tools/setup/quick-start.md` - Complete setup guide
- `docs/ai-tools/setup/integration-guide.md` - Existing project integration
- `scripts/README.md` - Automation scripts reference

## Maintenance Notes

**For docs-sync-agent**: This file should be updated whenever:
- New documentation files are added
- Documentation files are moved or renamed
- Documentation structure changes
- File purposes or descriptions change

**Update Process**:
1. Scan repository for new/changed .md files (excluding templates/examples)
2. Update tree structure to reflect current organization
3. Verify all file descriptions are accurate and helpful
4. Maintain consistent formatting and categorization

**Quality Checks**:
- All documentation files should have clear, one-line descriptions
- Tree structure should match actual repository organization
- Categories should help users find relevant documentation quickly
- No broken internal references or missing files

---

**Last Updated**: 2025-09-17 by system scan
**Next Review**: When documentation structure changes
**Maintainer**: docs-sync-agent (automated updates)
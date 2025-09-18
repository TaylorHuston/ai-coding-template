---
version: "0.1.0"
created: "2025-09-18"
last_updated: "2025-09-18"
status: "active"
target_audience: ["ai-assistants"]
document_type: "command"
tags: ["workflow", "scaffolding", "foundation", "tech-stack"]
---

# /scaffold Command

**Purpose**: Establish foundational technology stack and development environment for new projects through collaborative technology selection and infrastructure setup.

## Usage

```bash
/scaffold --new                 # Create complete project foundation
/scaffold --tech-stack          # Focus on technology selection only
/scaffold --environment         # Focus on development environment setup
/scaffold --update stack-area   # Update specific technology area
```

## Objectives

**Primary Goal**: Bridge the gap between vision and feature definition by establishing the technical foundation that enables meaningful feature planning.

**Core Outcomes**:
1. **Technology Stack Selection**: Frameworks, databases, languages, and core libraries
2. **Development Environment**: Local setup, build tools, Docker configuration
3. **Project Structure**: Directory layout, naming conventions, basic boilerplate
4. **Infrastructure Foundation**: Deployment targets, CI/CD basics, environment configuration
5. **Foundational ADRs**: Document technology decisions with rationale

## Approach

**Collaborative technology exploration** with focus on project requirements and team context:
- Present 2-3 viable technology options with clear trade-offs
- Consider team skills, project scale, and long-term maintenance
- Establish working development environment with validation
- Create foundational project structure and conventions
- Document decisions for future reference and onboarding

**Key principle**: Choose technologies that support the vision goals while matching team capabilities and project constraints.

## Conversation Flow

**Start with context**: What does the vision tell us about technical requirements?
**Explore constraints**: Team skills, timeline, scale, integration requirements?
**Present options**: 2-3 viable technology stacks with pros/cons
**Make decisions**: Choose based on vision alignment and practical constraints
**Validate setup**: Ensure working development environment
**Document foundations**: Create ADRs and setup documentation

## Agent Coordination

**Primary Agents**:
- **devops-engineer**: Development environment, containerization, CI/CD foundation
- **database-specialist**: Data storage technology selection and setup
- **code-architect**: Project structure, patterns, and foundational architecture

**Supporting Agents**:
- **backend-specialist**: Backend framework and API technology selection
- **frontend-specialist**: Frontend framework and tooling selection (for full-stack projects)
- **security-auditor**: Security considerations in technology selection

## Key Decision Areas

### Technology Stack
- **Backend**: Framework, language, API approach (REST/GraphQL/tRPC)
- **Frontend**: Framework, build tools, styling approach (if applicable)
- **Database**: Primary database, caching, data access patterns
- **Infrastructure**: Deployment target, containerization, monitoring basics

### Development Environment
- **Local Setup**: Package managers, version managers, environment variables
- **Build Tools**: Bundlers, compilers, task runners, hot reload
- **Quality Tools**: Linting, formatting, testing frameworks, pre-commit hooks
- **Container Setup**: Docker development environment, service orchestration

### Project Structure
- **Directory Layout**: Source organization, configuration placement, asset management
- **Naming Conventions**: Files, functions, APIs, database entities
- **Code Patterns**: Error handling, logging, configuration management
- **Documentation Standards**: README structure, inline documentation approach

## Outputs

**Working Development Environment**:
- Complete local development setup with validation
- Docker configuration for consistent environments
- Build and development scripts with documentation

**Project Foundation**:
- Directory structure with initial boilerplate
- Configuration files with sensible defaults
- Basic quality tools setup (linting, formatting, testing)

**Architecture Decision Records** in `docs/technical/decisions/`:
- Technology stack selection with alternatives considered
- Development environment approach and tooling choices
- Project structure and patterns with rationale
- Infrastructure and deployment foundation decisions

**Setup Documentation** in project README:
- Quick start instructions for new developers
- Environment setup and validation steps
- Development workflow and available commands

## Integration with Workflow

**Position**: After `/vision`, before `/feature`

**Workflow Bridge**:
- Vision requirements → technology foundation → feature capabilities
- Establishes technical context needed for meaningful feature definition
- Provides working environment for feature prototyping and validation

**Relationship to Other Commands**:
- **After /vision**: Use vision goals to guide technology selection
- **Before /feature**: Enable feature planning with known technical capabilities
- **Enables /architect**: Provides foundation for feature-specific architecture decisions
- **Supports /plan**: Implementation planning with established tools and patterns

## Success Criteria

**Effective Technology Foundation**:
- Development environment works consistently across team
- Technology choices align with vision goals and team capabilities
- Project structure supports anticipated features and scale
- Quality tools catch issues early in development
- New team members can start contributing quickly

**Quality Indicators**:
- All developers can run the project locally without issues
- Build and test processes work reliably
- Technology decisions have clear rationale documented
- Project structure feels natural for the chosen technologies
- Security and quality foundations are established from day one

## Validation Steps

**Technical Validation**:
- Development environment setup completes successfully
- Basic application runs and hot reload works
- Test suite executes and reports correctly
- Build process produces working artifacts
- Docker environment matches local development

**Documentation Validation**:
- New developer can follow setup instructions successfully
- ADRs capture decision rationale and alternatives considered
- Technology choices align with documented vision goals
- Quality tools and patterns are documented clearly
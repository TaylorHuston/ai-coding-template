---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-15"
status: "active"
target_audience: ["architects", "senior-developers", "ai-assistants"]
document_type: "architecture"
category: "architecture"
c4_level: "container"
diagram_type: "container"
related_diagrams: ["system-context.md", "components/agent-orchestration.md", "components/context-management.md"]
external_tools: ["draw.io"]
tags: ["c4", "containers", "architecture", "technology-choices"]
---

# Container Architecture: AI Coding Template

**Purpose**: Shows the high-level technology choices and container responsibilities within the AI Coding Template system.

## Container Overview

The AI Coding Template system is decomposed into six major containers, each with distinct responsibilities and technology choices. This architecture enables clear separation of concerns, independent evolution, and effective coordination between different aspects of AI-assisted development.

## Container Architecture Principles

### Design Philosophy
- **Separation of Concerns**: Each container has a clear, focused responsibility
- **Technology Appropriateness**: Technology choices match container requirements
- **Loose Coupling**: Containers interact through well-defined interfaces
- **High Cohesion**: Related functionality is grouped within containers

### Communication Patterns
- **File-based Interfaces**: Primary communication through structured files (Markdown, YAML)
- **Event-driven Updates**: Changes in one container trigger updates in dependent containers
- **Shared Context**: STATUS.md and project metadata provide shared state
- **API Contracts**: Clear interfaces for agent coordination and external integration

## Core Containers

### 1. Agent Orchestration System

#### Technology Stack
- **Primary**: Markdown-based agent specifications with YAML metadata
- **Coordination**: File-based task routing and agent selection logic
- **Model Management**: Multi-tier AI model usage (Haiku → Sonnet → Opus)
- **Tools Integration**: MCP (Model Context Protocol) for tool access

#### Responsibilities
- **Agent Registry**: Maintain catalog of 17 specialized agents with capabilities and constraints
- **Task Routing**: Match incoming tasks to appropriate agents based on domain and complexity
- **Workflow Coordination**: Orchestrate multi-agent workflows and handoff procedures
- **Performance Monitoring**: Track agent effectiveness and optimize selection patterns

#### Key Interfaces
- **Agent Specifications**: `.claude/agents/*.md` files defining agent capabilities
- **Task Classification**: Logic for determining appropriate agent and model complexity
- **Coordination Protocols**: Handoff procedures and quality gates between agents

#### Data Storage
- **Agent Definitions**: Structured markdown files with YAML frontmatter
- **Usage Patterns**: Agent selection history and performance metrics
- **Workflow Templates**: Predefined coordination patterns for common tasks

#### Technology Rationale
- **Markdown + YAML**: Human-readable, version-controllable, easily maintainable
- **File-based**: Simple deployment, no database dependencies, git-friendly
- **Hierarchical Models**: Cost-effective AI usage matching complexity to capability needs

### 2. Context Management System

#### Technology Stack
- **Primary**: YAML-structured metadata with Markdown content
- **State Persistence**: STATUS.md as centralized project memory
- **Session Continuity**: File-based context restoration mechanisms
- **Integration**: Git-aware context tracking and branch-specific state

#### Responsibilities
- **State Preservation**: Maintain project state across AI sessions and context limits
- **Context Restoration**: Enable AI agents to quickly restore relevant project context
- **Memory Management**: Prioritize and organize information for effective context utilization
- **Session Coordination**: Support multi-session and multi-user development workflows

#### Key Interfaces
- **STATUS.md**: Central project memory with structured progress and context
- **Context Queries**: APIs for agents to access relevant project information
- **State Updates**: Mechanisms for updating project state after significant changes
- **Branch Coordination**: Context management across Git branches and merges

#### Data Storage
- **Project State**: STATUS.md with comprehensive project context
- **Session History**: Development session summaries and key decisions
- **Context Metadata**: Structured information about project components and relationships

#### Technology Rationale
- **Structured Text**: Human-readable, AI-parseable, version-controlled
- **Centralized State**: Single source of truth for project context
- **Git Integration**: Natural alignment with development workflow

### 3. Documentation Framework

#### Technology Stack
- **Primary**: Markdown with standardized YAML frontmatter
- **Templates**: Mustache/Handlebars-style template engine
- **Validation**: YAML schema validation and content consistency checks
- **Generation**: Node.js-based documentation generation and maintenance tools

#### Responsibilities
- **Standardization**: Enforce consistent documentation patterns and metadata
- **Template Management**: Provide reusable templates for all documentation types
- **Content Organization**: Maintain hierarchical documentation structure
- **Quality Assurance**: Validate documentation quality and consistency

#### Key Interfaces
- **Template System**: `docs/templates/*.template.md` for consistent document creation
- **YAML Schema**: Standardized metadata structure across all documentation
- **Content Validation**: Automated checks for documentation quality and consistency
- **Link Management**: Cross-reference validation and broken link detection

#### Data Storage
- **Documentation Templates**: Reusable templates with variable substitution
- **Metadata Standards**: YAML schemas and validation rules
- **Content Guidelines**: Documentation standards and quality criteria

#### Technology Rationale
- **Markdown**: Universal format, tool-agnostic, excellent AI compatibility
- **YAML Frontmatter**: Machine-readable metadata enabling automation
- **Template Engine**: Consistency without duplication

### 4. Work Organization System

#### Technology Stack
- **Primary**: Hierarchical file structure with Markdown documentation
- **Organization**: deliverables/ directory with nested issue tracking
- **Integration**: External project management system connectivity
- **Progress Tracking**: File-based progress indicators and status management

#### Responsibilities
- **Work Structuring**: Organize development work into logical deliverables and issues
- **Progress Tracking**: Monitor and report progress across multiple work streams
- **Issue Management**: Integrate with external issue tracking while maintaining internal organization
- **Deliverable Coordination**: Coordinate work across multiple agents and team members

#### Key Interfaces
- **Deliverable Structure**: `deliverables/[DELIVERABLE]/` hierarchy for work organization
- **Issue Tracking**: Integration with external systems (Jira, Linear, GitHub Issues)
- **Progress APIs**: Interfaces for updating and querying work progress
- **Coordination Protocols**: Multi-agent work coordination patterns

#### Data Storage
- **Work Hierarchy**: Nested directory structure reflecting project organization
- **Progress State**: File-based progress tracking and status indicators
- **Integration Mappings**: Connections to external project management systems

#### Technology Rationale
- **File Hierarchy**: Clear organization, version-controllable, tool-agnostic
- **External Integration**: Leverage existing project management investments
- **Flexible Structure**: Adapts to different project management approaches

### 5. Automation Toolkit

#### Technology Stack
- **Shell Scripts**: Bash scripts for system integration and automation
- **Node.js Utilities**: JavaScript tools for complex processing and validation
- **Git Integration**: Deep integration with Git workflows and operations
- **CI/CD Support**: Integration with continuous integration and deployment pipelines

#### Responsibilities
- **Setup Automation**: Automate project initialization and environment configuration
- **Quality Validation**: Automated checks for code quality, documentation, and standards
- **Maintenance Tasks**: Regular maintenance, health checks, and system updates
- **Integration Support**: Bridge between template system and external development tools

#### Key Interfaces
- **Setup Scripts**: `scripts/setup-manager.sh` for project initialization
- **Validation Tools**: Quality checking and standards enforcement
- **Status Reporting**: `scripts/ai-status.sh` for comprehensive project status
- **Integration APIs**: Interfaces to external development tools and services

#### Data Storage
- **Configuration**: Environment and setup configuration management
- **Validation Rules**: Quality standards and checking criteria
- **Tool Metadata**: Information about available tools and their capabilities

#### Technology Rationale
- **Shell Scripts**: Universal availability, excellent system integration
- **Node.js**: Rich ecosystem for complex processing tasks
- **Modular Design**: Independent tools that can be used separately

### 6. Quality Assurance System

#### Technology Stack
- **Standards Definition**: YAML-based quality criteria and validation rules
- **Automated Checking**: Integration with linting, testing, and validation tools
- **Pattern Enforcement**: Template-based consistency checking
- **Reporting**: Quality metrics collection and dashboard generation

#### Responsibilities
- **Standards Enforcement**: Apply and validate adherence to quality standards
- **Pattern Consistency**: Ensure consistent implementation patterns across the project
- **Automated Validation**: Integrate quality checks into development workflow
- **Quality Metrics**: Track and report quality improvements over time

#### Key Interfaces
- **Quality Standards**: `docs/quality-standards.md` defining requirements
- **Validation APIs**: Interfaces for checking code and documentation quality
- **Reporting Systems**: Quality dashboards and improvement recommendations
- **Integration Points**: Hooks into CI/CD and development workflows

#### Data Storage
- **Quality Criteria**: Defined standards and validation rules
- **Metrics History**: Quality trend tracking and improvement measurement
- **Pattern Libraries**: Examples of correct patterns and anti-patterns

#### Technology Rationale
- **Standards-based**: Clear, documented quality requirements
- **Tool Integration**: Leverage existing quality tools and practices
- **Automated Enforcement**: Reduce manual quality checking overhead

## Inter-Container Communication

### Primary Communication Patterns

#### File-based Coordination
```
Agent Orchestration ←→ Context Management
- Agents read context from STATUS.md and related files
- Agents update context after significant work completion
- Context changes trigger agent re-evaluation of approaches

Documentation Framework ←→ Quality Assurance
- Templates enforce quality standards automatically
- Quality checks validate documentation compliance
- Standards updates propagate to template improvements
```

#### Event-driven Updates
```
Work Organization → Context Management → Agent Orchestration
- Work progress updates project context
- Context changes inform agent coordination decisions
- Agent coordination updates work organization status

Quality Assurance ← All Containers → Automation Toolkit
- All containers subject to quality validation
- Automation tools enforce quality standards
- Quality results fed back to container improvements
```

#### Shared State Management
```
All Containers ←→ Context Management (STATUS.md)
- Centralized project state accessible to all containers
- Changes in any container reflected in shared context
- Context serves as integration bus for container coordination
```

### Data Flow Patterns

#### Inbound Data Processing
1. **User Input** → Work Organization System → Context Management
2. **External Changes** → Automation Toolkit → Context Management
3. **AI Agent Results** → Agent Orchestration → Context + Documentation

#### Cross-Container Processing
1. **Task Request** → Agent Orchestration → Context Management (context) → Agent Orchestration (execution)
2. **Quality Check** → Quality Assurance → Documentation Framework (standards) → Quality Assurance (validation)
3. **Progress Update** → Work Organization → Context Management → Agent Orchestration (re-planning)

#### Outbound Data Generation
1. **Documentation Output** → Documentation Framework → Quality Assurance → External Systems
2. **Status Reports** → Context Management → Automation Toolkit → External Dashboards
3. **Work Artifacts** → Agent Orchestration → Quality Assurance → External Systems

## Container Deployment Patterns

### Development Environment
```
Local File System
├── Agent Orchestration (/.claude/agents/)
├── Context Management (/STATUS.md, project files)
├── Documentation Framework (/docs/, templates)
├── Work Organization (/deliverables/)
├── Automation Toolkit (/scripts/)
└── Quality Assurance (integrated throughout)
```

### Team Environment
- **Shared Repository**: All containers version-controlled together
- **Distributed Context**: Context management works across team members
- **Coordinated Automation**: Shared scripts and quality standards
- **Integrated Workflows**: Container coordination supports team workflows

### Enterprise Environment
- **Template Distribution**: Container patterns deployed across multiple projects
- **Centralized Standards**: Quality and documentation standards shared
- **Integration Points**: Enterprise tool integration through automation toolkit
- **Scalable Context**: Context management patterns scale to large teams

## Container Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Coding Template System                    │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  │     Agent       │    │    Context      │    │  Documentation  │
│  │  Orchestration  │    │   Management    │    │   Framework     │
│  │                 │    │                 │    │                 │
│  │ • 17 Agents     │◄──►│ • STATUS.md     │◄──►│ • Templates     │
│  │ • Task Routing  │    │ • Session State │    │ • YAML Schema   │
│  │ • Coordination  │    │ • Git Awareness │    │ • Content Rules │
│  │                 │    │                 │    │                 │
│  │ Tech: MD+YAML   │    │ Tech: YAML+MD   │    │ Tech: MD+YAML   │
│  └─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
│            │                      │                      │
│            │              ┌───────▼───────┐              │
│            │              │     Shared    │              │
│            │              │   Context     │              │
│            │              │  (STATUS.md)  │              │
│            │              └───────┬───────┘              │
│            │                      │                      │
│  ┌─────────▼───────┐    ┌─────────▼───────┐    ┌─────────▼───────┐
│  │      Work       │    │   Automation    │    │    Quality      │
│  │   Organization  │    │    Toolkit      │    │   Assurance     │
│  │                 │    │                 │    │                 │
│  │ • Deliverables  │◄──►│ • Setup Scripts │◄──►│ • Standards     │
│  │ • Issue Tracking│    │ • Validation    │    │ • Validation    │
│  │ • Progress      │    │ • Status Tools  │    │ • Metrics       │
│  │                 │    │                 │    │                 │
│  │ Tech: File Tree │    │ Tech: Bash+Node │    │ Tech: YAML+Tools│
│  └─────────────────┘    └─────────────────┘    └─────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         ▲                                 ▲                ▲
         │                                 │                │
   ┌─────▼─────┐                    ┌─────▼─────┐    ┌─────▼─────┐
   │    Git    │                    │    IDE    │    │   CI/CD   │
   │Repository │                    │Integration│    │ Pipeline  │
   └───────────┘                    └───────────┘    └───────────┘
```

## Technology Decision Rationale

### File-based Architecture
**Decision**: Use file-based storage and communication
**Rationale**:
- Version control friendly - all state tracked in Git
- Tool agnostic - works with any development environment
- Human readable - developers can understand and modify directly
- Simple deployment - no database or service dependencies

### Markdown + YAML Strategy
**Decision**: Standardize on Markdown with YAML frontmatter
**Rationale**:
- Universal tool support - readable by humans and AI
- Structured metadata - enables automation while maintaining readability
- Template friendly - easy to generate consistent content
- Future proof - format unlikely to become obsolete

### Multi-tier AI Model Usage
**Decision**: Hierarchical model usage (Haiku → Sonnet → Opus)
**Rationale**:
- Cost optimization - use simpler models for simpler tasks
- Performance balance - faster execution for routine tasks
- Quality assurance - complex models for critical decisions
- Scalability - sustainable AI usage across large projects

### Distributed Container Pattern
**Decision**: Containers deployed together, not as separate services
**Rationale**:
- Simplicity - no service orchestration complexity
- Reliability - no network dependencies between containers
- Performance - local file access faster than network calls
- Development - easier local development and testing

## Success Metrics

### Container Performance
- **Agent Orchestration**: >95% task routing accuracy, <5s agent selection time
- **Context Management**: >90% context restoration accuracy, <10s session startup
- **Documentation**: >99% template consistency, <2s template generation
- **Work Organization**: 100% external system integration, <1s status updates
- **Automation**: >95% script success rate, <30s full validation
- **Quality Assurance**: >90% automated quality detection, <5% false positives

### Integration Effectiveness
- **Cross-container Communication**: <1s file-based coordination
- **Shared State Management**: 100% consistency across containers
- **External System Integration**: >95% successful external API calls
- **Development Workflow**: <5min from change to full validation

---

*This container architecture provides the foundation for specialized AI assistance through clear separation of concerns and appropriate technology choices.*
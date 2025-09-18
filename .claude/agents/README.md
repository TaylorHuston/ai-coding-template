# AI Agent Index and Directory

**Created**: 2025-08-21 **Last Updated**: 2025-09-17 **Status**: Active - Enhanced with Vision Integration **Target Audience**: AI Assistants, Development Teams **Total Agents**: 19 | **Coverage**: Complete development workflow

Comprehensive catalog of specialized AI agents optimized for modern development workflows.

## Agent Classification System

### By Domain Expertise

#### **Architecture & Planning**

- **[vision-strategist](./vision-strategist.md)** - Product vision and strategic planning

  - _Capabilities_: Vision creation, strategic analysis, business model design, success metrics
  - _Best For_: Product vision development, strategic decisions, market positioning
  - _Model_: opus | _Color_: purple | _Auto-Invoked_: Vision and strategic planning tasks

- **[code-architect](./code-architect.md)** - System design and long-term architecture

  - _Capabilities_: System architecture, feature-level design patterns, API design
  - _Best For_: Feature architecture decisions, implementation patterns, technical design
  - _Model_: opus | _Color_: purple | _Auto-Invoked_: Feature architectural tasks

- **[project-manager](./project-manager.md)** - Project coordination and orchestration

  - _Capabilities_: Multi-agent coordination, task orchestration, resource allocation
  - _Best For_: Complex project coordination, multi-phase implementations, team coordination
  - _Model_: opus | _Color_: blue | _Auto-Invoked_: Multi-domain tasks

- **[context-analyzer](./context-analyzer.md)** - Project context analysis and investigation
  - _Capabilities_: Root cause analysis, systematic investigation, evidence-based reasoning
  - _Best For_: Bug investigation, system analysis, problem diagnosis
  - _Model_: sonnet | _Color_: yellow | _Auto-Invoked_: Investigation tasks

- **[ai-llm-expert](./ai-llm-expert.md)** - AI/LLM architecture, implementation, and optimization
  - _Capabilities_: LLM architecture design, prompt engineering, context management, AI integration patterns
  - _Best For_: AI/ML decision analysis, LLM implementation guidance, AI architecture optimization
  - _Model_: opus | _Color_: green | _Auto-Invoked_: AI/ML architecture decisions

#### **Development & Implementation**

- **[frontend-specialist](./frontend-specialist.md)** - UI/UX focused development

  - _Capabilities_: React/Vue/Angular, responsive design, accessibility, Core Web Vitals
  - _Best For_: Component development, user interface optimization, performance
  - _Model_: sonnet | _Color_: blue | _Auto-Invoked_: UI/UX development tasks

- **[backend-specialist](./backend-specialist.md)** - Server-side implementation and business logic

  - _Capabilities_: Server frameworks, business logic, authentication, real-time features
  - _Best For_: API implementation, business logic, authentication, background processing
  - _Model_: sonnet | _Color_: green | _Auto-Invoked_: Server-side implementation tasks

- **[database-specialist](./database-specialist.md)** - Database design and optimization

  - _Capabilities_: Schema design, query optimization, performance tuning, migrations
  - _Best For_: Database architecture, query performance, data modeling
  - _Model_: sonnet | _Color_: magenta | _Auto-Invoked_: All database work

- **[api-designer](./api-designer.md)** - API design and endpoint architecture
  - _Capabilities_: REST/GraphQL design, API contracts, data validation, error handling
  - _Best For_: API architecture, endpoint design, service contracts
  - _Model_: sonnet | _Color_: orange | _Auto-Invoked_: API development tasks

- **[data-analyst](./data-analyst.md)** - Data processing, analysis, and reporting
  - _Capabilities_: Data transformation, statistical analysis, visualization, business intelligence
  - _Best For_: Data insights, reporting systems, analytics workflows
  - _Model_: sonnet | _Color_: cyan | _Auto-Invoked_: On-demand

#### **Quality & Testing**

- **[test-engineer](./test-engineer.md)** - Comprehensive test creation and strategy

  - _Capabilities_: TDD/BDD workflows, unit/integration/E2E tests, test automation
  - _Best For_: Test strategy development, test creation, quality assurance
  - _Model_: sonnet | _Color_: green | _Auto-Invoked_: Test creation requests

- **[code-reviewer](./code-reviewer.md)** - Code quality assessment and reviews

  - _Capabilities_: Quality analysis, best practices, maintainability assessment
  - _Best For_: Post-implementation reviews, refactoring guidance, quality improvement
  - _Model_: sonnet | _Color_: yellow | _Auto-Invoked_: After code implementation

- **[security-auditor](./security-auditor.md)** - Security assessment and compliance
  - _Capabilities_: Vulnerability detection, OWASP compliance, threat modeling
  - _Best For_: Security reviews, compliance validation, vulnerability assessment
  - _Model_: opus | _Color_: red | _Auto-Invoked_: Security-critical changes

- **[refactoring-specialist](./refactoring-specialist.md)** - Code improvement and technical debt reduction
  - _Capabilities_: Code quality improvement, technical debt management, pattern refactoring
  - _Best For_: Code cleanup, maintainability improvement, complexity reduction
  - _Model_: sonnet | _Color_: yellow | _Auto-Invoked_: On-demand

#### **Operations & Performance**

- **[devops-engineer](./devops-engineer.md)** - Infrastructure and deployment automation

  - _Capabilities_: CI/CD, containerization, cloud platforms, monitoring
  - _Best For_: Deployment automation, infrastructure setup, environment management
  - _Model_: sonnet | _Color_: cyan | _Auto-Invoked_: Infrastructure tasks

- **[performance-optimizer](./performance-optimizer.md)** - Performance analysis and optimization
  - _Capabilities_: Bottleneck identification, optimization strategies, monitoring
  - _Best For_: Performance audits, optimization recommendations, scalability planning
  - _Model_: sonnet | _Color_: orange | _Auto-Invoked_: Performance issues

- **[migration-specialist](./migration-specialist.md)** - Version upgrades and framework migrations
  - _Capabilities_: Safe migrations, compatibility assessment, incremental modernization
  - _Best For_: Framework upgrades, dependency updates, legacy modernization
  - _Model_: sonnet | _Color_: purple | _Auto-Invoked_: On-demand

#### **Documentation & Communication**

- **[technical-writer](./technical-writer.md)** - Documentation synchronization and maintenance

  - _Capabilities_: Documentation updates, consistency maintenance, link validation
  - _Best For_: Keeping docs current with code changes, maintaining accuracy
  - _Model_: haiku | _Color_: blue | _Auto-Invoked_: After code changes

- **[technical-writer](./technical-writer.md)** - New documentation creation
  - _Capabilities_: Technical writing, API docs, user guides, tutorials
  - _Best For_: Creating new documentation, comprehensive guides, content strategy
  - _Model_: opus | _Color_: teal | _Auto-Invoked_: Documentation creation requests

## Agent Usage Patterns

### **Automatic Invocation Agents** (8 agents)

These agents activate automatically based on context and task requirements:

1. **project-manager** - Complex/multi-domain tasks requiring coordination
2. **context-analyzer** - Investigation and root cause analysis tasks
3. **frontend-specialist** - UI/UX development and component work
4. **backend-specialist** - Server-side implementation and business logic
5. **database-specialist** - All database-related operations
6. **test-engineer** - Test creation and strategy development
7. **code-reviewer** - Post-implementation quality reviews
8. **technical-writer** - After code changes affecting documentation

### **On-Demand Specialists** (10 agents)

These are invoked for specific domains or specialized work:

1. **code-architect** - Architectural decisions and system design
2. **ai-llm-expert** - AI/LLM architecture and implementation guidance
3. **api-designer** - API architecture and endpoint design
4. **security-auditor** - Security audits and compliance validation
5. **devops-engineer** - Infrastructure and deployment automation
6. **performance-optimizer** - Performance analysis and optimization
7. **technical-writer** - New documentation creation
8. **refactoring-specialist** - Code improvement and technical debt reduction
9. **migration-specialist** - Version upgrades and framework migrations
10. **data-analyst** - Data processing, analysis, and reporting

### By Task Complexity

#### **High Complexity (Opus Model)**

- **code-architect** - System architecture and technology decisions
- **ai-llm-expert** - AI/LLM architecture and implementation optimization
- **project-manager** - Multi-agent orchestration and complex coordination
- **security-auditor** - Critical security analysis and compliance
- **technical-writer** - Content creation and technical writing

#### **Medium Complexity (Sonnet Model)**

- **frontend-specialist** - Modern frontend development and optimization
- **backend-specialist** - Server-side implementation and business logic
- **database-specialist** - Database design and performance optimization
- **api-designer** - API architecture and service design
- **test-engineer** - Comprehensive testing strategies
- **code-reviewer** - Quality analysis and best practices
- **context-analyzer** - Systematic investigation and analysis
- **devops-engineer** - Infrastructure automation and deployment
- **performance-optimizer** - Performance analysis and optimization
- **refactoring-specialist** - Code improvement and technical debt reduction
- **migration-specialist** - Version upgrades and framework migrations
- **data-analyst** - Data processing, analysis, and reporting

#### **Low Complexity (Haiku Model)**

- **technical-writer** - Documentation maintenance and synchronization

### By Usage Frequency

#### **Core Development Agents** (Daily use)

1. **frontend-specialist** - UI development and user experience
2. **backend-specialist** - Server-side implementation and business logic
3. **database-specialist** - Data modeling and query optimization
4. **code-reviewer** - Quality assurance and best practices
5. **technical-writer** - Documentation maintenance

#### **Strategic Agents** (Weekly/project milestones)

1. **code-architect** - System design and architectural decisions
2. **security-auditor** - Security reviews and compliance
3. **performance-optimizer** - Performance analysis and optimization
4. **devops-engineer** - Infrastructure and deployment automation

#### **Specialized Agents** (As-needed basis)

1. **project-manager** - Complex multi-domain coordination
2. **context-analyzer** - Investigation and troubleshooting
3. **api-designer** - API architecture and design
4. **test-engineer** - Test strategy and comprehensive testing
5. **technical-writer** - New documentation creation
6. **refactoring-specialist** - Code quality improvement and technical debt
7. **migration-specialist** - Framework upgrades and system modernization
8. **data-analyst** - Data processing and business intelligence

## Agent Selection Guidelines

### Decision Matrix

```yaml
task_type_mapping:
  feature_development:
    frontend_work: [frontend-specialist]
    backend_work: [backend-specialist, database-specialist]
    api_development: [api-designer, backend-specialist]
    full_stack: [frontend-specialist + backend-specialist + database-specialist]
    complex_features: [project-manager → coordinates specialists]

  bug_fixing:
    ui_bugs: [frontend-specialist]
    backend_bugs: [backend-specialist, database-specialist]
    api_bugs: [api-designer, backend-specialist]
    performance_bugs: [performance-optimizer]
    security_bugs: [security-auditor]
    investigation_needed: [context-analyzer]

  code_quality:
    post_implementation: [code-reviewer]
    architecture_review: [code-architect]
    refactoring: [code-reviewer + relevant specialists]
    optimization: [performance-optimizer]

  infrastructure:
    deployment: [devops-engineer]
    ci_cd_setup: [devops-engineer]
    monitoring: [devops-engineer, performance-optimizer]
    security_hardening: [security-auditor, devops-engineer]

  documentation:
    sync_with_code: [technical-writer] # auto-invoked
    new_documentation: [technical-writer]
    api_docs: [technical-writer, api-designer]
    architecture_docs: [technical-writer, code-architect]

  data_management:
    schema_design: [database-specialist]
    query_optimization: [database-specialist, performance-optimizer]
    migrations: [database-specialist]
    performance_tuning: [performance-optimizer, database-specialist]

  testing:
    test_strategy: [test-engineer]
    test_creation: [test-engineer]
    test_automation: [test-engineer, devops-engineer]
```

### Selection Criteria

#### **By Project Phase**

- **Vision**: vision-strategist, project-manager
- **Scaffold**: devops-engineer, database-specialist, code-architect (foundation focus)
- **Feature**: business-analyst patterns through feature-focused conversations
- **Architecture**: code-architect, api-designer, security-auditor (feature implementation focus)
- **Planning**: project-manager, context-analyzer
- **Development**: frontend-specialist, backend-specialist, database-specialist
- **Quality Assurance**: code-reviewer, test-engineer, security-auditor
- **Deployment**: devops-engineer
- **Maintenance**: performance-optimizer, technical-writer, security-auditor

#### **By Team Size**

- **Solo Developer**: Use 3-4 core agents (frontend-specialist, database-specialist, code-reviewer, technical-writer)
- **Small Team (2-5)**: Add specialists as needed (devops-engineer, security-auditor, performance-optimizer)
- **Large Team (5+)**: Full agent suite with project-manager for coordination

#### **By Risk Profile**

- **High Risk**: security-auditor, code-architect, project-manager (coordination)
- **Medium Risk**: code-reviewer, performance-optimizer, test-engineer
- **Low Risk**: Domain specialists with standard quality review

## Multi-Agent Coordination Patterns

### Sequential Workflows

#### **Development Pipeline**

1. project-manager (planning)
2. frontend-specialist + backend-specialist (implementation)
3. code-reviewer (quality check)
4. security-auditor (security review)
5. devops-engineer (deployment)

#### **Quality Assurance Pipeline**

1. code-reviewer (static analysis)
2. security-auditor (security scan)
3. performance-optimizer (performance test)
4. technical-writer (documentation review)

### Parallel Workflows

#### **Comprehensive Analysis**

- security-auditor (security assessment)
- performance-optimizer (performance analysis)
- code-reviewer (quality analysis)
- database-specialist (data analysis)

#### **Feature Development**

- frontend-specialist (UI components)
- backend-engineer (API endpoints)
- database-specialist (data models)
- technical-writer (documentation)

## Agent Communication Protocols

### Handoff Procedures

```yaml
agent_handoff:
  context_preservation:
    - current_state_summary
    - completed_tasks_list
    - pending_issues_log
    - relevant_file_changes

  quality_gates:
    - deliverable_validation
    - documentation_completeness
    - test_coverage_verification
    - security_compliance_check

  next_agent_briefing:
    - task_objectives
    - context_summary
    - expected_deliverables
    - success_criteria
```

### Coordination Mechanisms

#### **Shared Context**

- Centralized task tracking
- Shared documentation
- Common code standards
- Unified quality metrics

#### **Communication Channels**

- Status updates in shared documents
- Code comments for technical coordination
- Documentation for knowledge transfer
- Test results for quality validation

## Usage Examples

### Example 1: Feature Development

```yaml
scenario: "Implement user authentication system"
agent_sequence:
  1. project-manager: "Break down requirements and create task plan"
  2. security-auditor: "Define security requirements and threat model"
  3. database-specialist: "Design user data schema"
  4. backend-engineer: "Implement authentication API"
  5. frontend-specialist: "Create login/signup UI components"
  6. code-reviewer: "Review implementation quality"
  7. technical-writer: "Document authentication flow"
```

### Example 2: Performance Optimization

```yaml
scenario: "Optimize application performance"
agent_sequence:
  1. performance-optimizer: "Identify bottlenecks and performance issues"
  2. database-specialist: "Optimize database queries and indexing"
  3. backend-engineer: "Implement caching and API optimizations"
  4. frontend-specialist: "Optimize bundle size and rendering"
  5. devops-engineer: "Configure production performance monitoring"
  6. code-reviewer: "Validate optimization implementations"
```

### Example 3: Security Audit

```yaml
scenario: "Comprehensive security assessment"
agent_parallel:
  - security-auditor: "Vulnerability assessment and threat modeling"
  - code-reviewer: "Static analysis for security patterns"
  - devops-engineer: "Infrastructure security configuration"
  - database-specialist: "Data security and access controls"
agent_coordination:
  - project-manager: "Aggregate findings and prioritize remediation"
  - technical-writer: "Document security procedures and guidelines"
```

## Agent Performance Metrics

### Quality Indicators

```yaml
performance_metrics:
  task_completion_rate:
    excellent: ">95%"
    good: "90-95%"
    needs_improvement: "<90%"

  code_quality_score:
    excellent: ">9.0/10"
    good: "8.0-9.0/10"
    needs_improvement: "<8.0/10"

  documentation_completeness:
    excellent: ">90%"
    good: "80-90%"
    needs_improvement: "<80%"

  security_compliance:
    excellent: "100% compliance"
    good: "95-99% compliance"
    needs_improvement: "<95% compliance"
```

### Optimization Opportunities

#### **Agent Specialization**

- Monitor task success rates by agent type
- Identify optimization opportunities for specific domains
- Adjust agent selection based on performance data

#### **Workflow Efficiency**

- Measure handoff effectiveness between agents
- Identify bottlenecks in multi-agent workflows
- Optimize coordination patterns based on results

## Agent Capability Matrix

### File Type Handling by Agent

| Agent | JavaScript/TS | Python | Database | Config | Docs | Tests | Infrastructure |
|-------|-------------|---------|----------|--------|------|-------|----------------|
| **frontend-specialist** | ✅ Primary | ❌ | ❌ | ⚠️ Frontend | ⚠️ Component | ✅ Frontend | ❌ |
| **backend-specialist** | ✅ Node.js | ✅ Primary | ⚠️ Integration | ✅ Server | ⚠️ API | ✅ Backend | ⚠️ App |
| **database-specialist** | ⚠️ Queries | ⚠️ Queries | ✅ Primary | ✅ DB Config | ⚠️ Schema | ✅ DB Tests | ⚠️ DB |
| **api-designer** | ✅ Contracts | ✅ Contracts | ❌ | ✅ API | ✅ API Docs | ⚠️ API Tests | ❌ |
| **test-engineer** | ✅ Tests | ✅ Tests | ⚠️ Test Data | ✅ Test Config | ⚠️ Test Docs | ✅ Primary | ⚠️ Test Env |
| **code-reviewer** | ✅ All | ✅ All | ✅ All | ✅ All | ⚠️ Review | ✅ All | ✅ All |
| **security-auditor** | ✅ Security | ✅ Security | ✅ Security | ✅ Security | ⚠️ Security | ⚠️ Security | ✅ Security |
| **devops-engineer** | ⚠️ Build | ⚠️ Build | ❌ | ✅ Primary | ⚠️ Ops | ⚠️ E2E | ✅ Primary |
| **performance-optimizer** | ✅ Perf | ✅ Perf | ✅ Queries | ⚠️ Perf | ❌ | ✅ Perf Tests | ⚠️ Perf |
| **technical-writer** | ❌ | ❌ | ❌ | ❌ | ✅ Primary | ❌ | ❌ |
| **technical-writer** | ❌ | ❌ | ❌ | ❌ | ✅ Primary | ❌ | ❌ |
| **refactoring-specialist** | ✅ Refactor | ✅ Refactor | ⚠️ Schema | ⚠️ Config | ❌ | ⚠️ Test Refactor | ❌ |
| **migration-specialist** | ✅ Migrations | ✅ Migrations | ✅ Migrations | ✅ Migrations | ⚠️ Migration | ⚠️ Migration | ✅ Migrations |
| **data-analyst** | ⚠️ Analytics | ✅ Analytics | ✅ Queries | ⚠️ Analytics | ⚠️ Reports | ❌ | ❌ |

**Legend**: ✅ Primary expertise | ⚠️ Secondary/Supporting | ❌ Not applicable

### Domain Expertise Matrix

| Domain | Primary Agents | Supporting Agents | Typical Workflow |
|--------|----------------|-------------------|------------------|
| **Frontend Development** | frontend-specialist | api-designer, test-engineer, code-reviewer | frontend → api-designer → test-engineer → code-reviewer |
| **Backend Development** | backend-specialist | database-specialist, api-designer, security-auditor | backend → database → api-designer → security-auditor |
| **Database Management** | database-specialist | backend-specialist, performance-optimizer, migration-specialist | database → backend → performance → migration |
| **API Development** | api-designer | backend-specialist, frontend-specialist, test-engineer | api-designer → backend → frontend → test-engineer |
| **Quality Assurance** | test-engineer, code-reviewer | security-auditor, performance-optimizer | test-engineer → code-reviewer → security → performance |
| **Infrastructure** | devops-engineer | security-auditor, performance-optimizer, migration-specialist | devops → security → performance → migration |
| **Documentation** | technical-writer, technical-writer | All domain specialists | docs-sync → technical-writer → domain-specialist |
| **Code Quality** | refactoring-specialist, code-reviewer | performance-optimizer, security-auditor | code-reviewer → refactoring → performance → security |
| **System Migration** | migration-specialist | code-architect, devops-engineer, database-specialist | migration → architect → devops → database |
| **Data & Analytics** | data-analyst | database-specialist, backend-specialist | data-analyst → database → backend |

### Tool Usage Patterns

| Tool Category | Primary Users | Secondary Users | Use Cases |
|---------------|---------------|----------------|-----------|
| **Read/Write/Edit** | All agents | - | Core file operations |
| **Bash** | devops-engineer, migration-specialist | backend-specialist, test-engineer | Infrastructure, testing, migration scripts |
| **Grep/Glob** | All agents | - | Code search and file discovery |
| **TodoWrite** | All agents | - | Task tracking and coordination |
| **MultiEdit** | refactoring-specialist, migration-specialist | backend-specialist, frontend-specialist | Bulk code changes |
| **MCP Context7** | frontend-specialist, backend-specialist, api-designer, database-specialist | code-reviewer, code-architect, security-auditor, performance-optimizer | Framework documentation lookup, library research |
| **MCP Sequential Thinking** | project-manager, code-reviewer, code-architect, security-auditor, performance-optimizer | - | Complex analysis and systematic reasoning |

### Model Usage Justification

| Model | Agents | Justification |
|-------|--------|---------------|
| **Opus** | code-architect, project-manager, security-auditor, technical-writer | Complex reasoning, strategic decisions, security analysis, content creation |
| **Sonnet** | Most specialists | Balanced performance for technical implementation tasks |
| **Haiku** | technical-writer, context-analyzer | Fast, lightweight tasks with clear objectives |

## Best Practices for Agent Management

### Selection Guidelines

1. **Match Expertise to Task**: Choose agents with domain-specific knowledge
2. **Consider Complexity**: Use appropriate model (haiku/sonnet/opus) for task complexity
3. **Plan Coordination**: Design handoff procedures for multi-agent workflows
4. **Monitor Performance**: Track agent effectiveness and optimize selection

### Quality Assurance

1. **Clear Objectives**: Define specific, measurable outcomes for each agent
2. **Quality Gates**: Implement checkpoints between agent handoffs
3. **Documentation**: Maintain comprehensive records of agent activities
4. **Continuous Improvement**: Regularly evaluate and improve agent performance

### Resource Optimization

1. **Cost Management**: Balance model selection with task requirements
2. **Time Efficiency**: Optimize agent coordination to minimize delays
3. **Context Preservation**: Maintain continuity across agent handoffs
4. **Parallel Processing**: Leverage parallel workflows when possible

---

_This agent index provides comprehensive guidance for selecting, coordinating, and optimizing AI agent usage across development projects._

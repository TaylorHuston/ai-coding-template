# AI Agent Index and Directory

**Created**: 2025-08-21
**Last Updated**: 2025-08-21
**Status**: Active
**Target Audience**: AI Assistants, Development Team

Comprehensive catalog of available AI agents, their capabilities, and usage patterns.

## Agent Classification System

### By Domain Expertise

#### **Development & Implementation**
- **[full-stack-developer](./full-stack-developer.md)** - Complete application development
  - *Capabilities*: Frontend, backend, database, API integration
  - *Best For*: Feature implementation, bug fixes, architecture decisions
  - *Model*: opus | *Color*: purple

- **[frontend-specialist](./frontend-specialist.md)** - UI/UX focused development
  - *Capabilities*: React/Vue/Angular, responsive design, accessibility
  - *Best For*: Component development, user interface optimization
  - *Model*: sonnet | *Color*: blue

- **[backend-engineer](./backend-engineer.md)** - Server-side development
  - *Capabilities*: APIs, databases, microservices, performance optimization
  - *Best For*: Server logic, data modeling, API design
  - *Model*: sonnet | *Color*: green

#### **Quality & Analysis**
- **[security-auditor](./security-auditor.md)** - Security assessment and hardening
  - *Capabilities*: Vulnerability scanning, OWASP compliance, threat modeling
  - *Best For*: Security reviews, penetration testing, compliance audits
  - *Model*: opus | *Color*: red

- **[code-reviewer](./code-reviewer.md)** - Code quality assessment
  - *Capabilities*: Static analysis, best practices, pattern recognition
  - *Best For*: Code reviews, quality improvement, refactoring guidance
  - *Model*: sonnet | *Color*: yellow

- **[performance-optimizer](./performance-optimizer.md)** - Performance analysis and tuning
  - *Capabilities*: Profiling, bottleneck identification, optimization strategies
  - *Best For*: Performance audits, load testing, optimization recommendations
  - *Model*: sonnet | *Color*: orange

#### **Infrastructure & DevOps**
- **[devops-engineer](./devops-engineer.md)** - Infrastructure and deployment
  - *Capabilities*: CI/CD, containerization, cloud platforms, monitoring
  - *Best For*: Deployment automation, infrastructure setup, monitoring
  - *Model*: sonnet | *Color*: cyan

- **[database-specialist](./database-specialist.md)** - Data management and optimization
  - *Capabilities*: Schema design, query optimization, data migration
  - *Best For*: Database design, performance tuning, data analysis
  - *Model*: sonnet | *Color*: magenta

#### **Documentation & Communication**
- **[technical-writer](./technical-writer.md)** - Documentation and communication
  - *Capabilities*: Technical writing, API docs, user guides, tutorials
  - *Best For*: Documentation creation, knowledge transfer, content strategy
  - *Model*: haiku | *Color*: teal

#### **Project Management**
- **[project-manager](./project-manager.md)** - Project coordination and planning
  - *Capabilities*: Task orchestration, resource allocation, timeline management
  - *Best For*: Complex project coordination, multi-agent task distribution
  - *Model*: opus | *Color*: blue

### By Task Complexity

#### **High Complexity (Opus Model)**
- project-manager - Multi-agent orchestration
- security-auditor - Critical security analysis
- full-stack-developer - Complex system architecture

#### **Medium Complexity (Sonnet Model)**
- frontend-specialist - Component development
- backend-engineer - API implementation
- code-reviewer - Quality analysis
- performance-optimizer - Performance tuning
- devops-engineer - Infrastructure automation
- database-specialist - Data optimization

#### **Low Complexity (Haiku Model)**
- technical-writer - Documentation tasks

### By Usage Frequency

#### **Primary Agents** (Most commonly used)
1. full-stack-developer - General development tasks
2. code-reviewer - Code quality assurance
3. technical-writer - Documentation needs
4. security-auditor - Security requirements

#### **Specialist Agents** (Domain-specific needs)
1. frontend-specialist - UI/UX focused projects
2. backend-engineer - Server-side heavy projects
3. performance-optimizer - Performance-critical applications
4. database-specialist - Data-intensive applications

#### **Orchestration Agents** (Complex coordination)
1. project-manager - Multi-phase projects
2. devops-engineer - Infrastructure projects

## Agent Selection Guidelines

### Decision Matrix

```yaml
task_type_mapping:
  feature_development:
    simple: [frontend-specialist, backend-engineer]
    complex: [full-stack-developer]
    
  bug_fixing:
    ui_bugs: [frontend-specialist]
    logic_bugs: [backend-engineer, full-stack-developer]
    performance_bugs: [performance-optimizer]
    security_bugs: [security-auditor]
    
  code_quality:
    review: [code-reviewer]
    refactoring: [code-reviewer, full-stack-developer]
    optimization: [performance-optimizer]
    
  infrastructure:
    deployment: [devops-engineer]
    monitoring: [devops-engineer, performance-optimizer]
    security: [security-auditor, devops-engineer]
    
  documentation:
    api_docs: [technical-writer, backend-engineer]
    user_guides: [technical-writer]
    technical_specs: [technical-writer, full-stack-developer]
    
  data_management:
    schema_design: [database-specialist]
    query_optimization: [database-specialist, performance-optimizer]
    migration: [database-specialist, backend-engineer]
```

### Selection Criteria

#### **By Project Phase**
- **Planning**: project-manager, full-stack-developer
- **Development**: domain-specific specialists
- **Testing**: code-reviewer, security-auditor
- **Deployment**: devops-engineer
- **Maintenance**: performance-optimizer, security-auditor

#### **By Team Size**
- **Solo Developer**: full-stack-developer, technical-writer
- **Small Team**: specialists + code-reviewer
- **Large Team**: project-manager + domain specialists

#### **By Risk Profile**
- **High Risk**: security-auditor, project-manager
- **Medium Risk**: code-reviewer, performance-optimizer
- **Low Risk**: domain specialists

## Multi-Agent Coordination Patterns

### Sequential Workflows

#### **Development Pipeline**
1. project-manager (planning)
2. full-stack-developer (implementation)
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

*This agent index provides comprehensive guidance for selecting, coordinating, and optimizing AI agent usage across development projects.*
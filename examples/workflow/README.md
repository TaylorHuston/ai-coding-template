---
version: "0.1.0"
created: "2025-09-17"
purpose: "Workflow examples demonstrating the AI-assisted development process"
target_audience: ["developers", "ai-assistants", "team-leads"]
document_type: "guide"
tags: ["workflow-examples", "ai-workflow", "best-practices", "development-process"]
---

# Workflow Examples

This directory contains comprehensive examples demonstrating the AI-assisted development workflow using the `/vision → /feature → /architect → /plan → /develop` process.

## 🎯 Purpose

These examples show how the template system and AI workflow commands work together to create:

- **Consistent Documentation**: All artifacts follow established templates and patterns
- **Quality Validation**: Built-in gates ensure standards compliance at every phase
- **Context Preservation**: Complete handoff context across long development sessions
- **Agent Coordination**: Specialized AI agents working together with perfect synchronization

## 📚 Available Examples

### Complete Feature Workflow Example

**File**: [complete-feature-workflow-example.md](./complete-feature-workflow-example.md)

**Demonstrates**:
- Full `/vision → /feature → /architect → /plan → /develop` workflow
- User authentication system implementation
- All five workflow phases with realistic output
- Agent coordination and context passing
- Quality gates and validation checkpoints

**Complexity**: Comprehensive
**Estimated Reading Time**: 15-20 minutes
**Project Type**: Web Application (React + Node.js)

### Quick Reference Examples

Coming soon:
- **Simple Feature Example**: Minimal workflow for small features
- **API-Only Example**: Backend service development workflow
- **Frontend Component Example**: UI component development process
- **Bug Fix Example**: Issue resolution with context preservation

## 🚀 How to Use These Examples

### For Learning the Workflow

1. **Start with Complete Example**: Read through the full authentication system example
2. **Study Phase Transitions**: Notice how each phase builds on the previous
3. **Examine Context Passing**: See how HANDOFF.yml preserves context across agents
4. **Review Quality Gates**: Understand validation checkpoints and standards

### For Your Own Implementation

1. **Copy the Pattern**: Use the structure as a template for your features
2. **Adapt Templates**: Modify templates to match your project specifics
3. **Follow Phase Sequence**: Always progress through /vision → /feature → /architect → /plan → /develop
4. **Maintain Documentation**: Keep artifacts updated as implementation progresses

### For Team Onboarding

1. **Workflow Training**: Use examples to train team members on AI-assisted development
2. **Standards Reference**: Point to examples as the "right way" to document and implement
3. **Quality Baseline**: Establish examples as minimum quality expectations
4. **Process Documentation**: Use as reference for team development processes

## 🎯 Key Workflow Patterns Demonstrated

### Context Management

**Pattern**: Complete context preservation across phases
**Example**: HANDOFF.yml maintains agent history and findings
**Benefit**: No context loss during long development sessions

### Quality Gates

**Pattern**: Validation checkpoints between phases
**Example**: Security review after P1.3.0, performance testing in P3.3.0
**Benefit**: Prevents progression without meeting quality standards

### Agent Specialization

**Pattern**: Right agent for the right task
**Example**: database-specialist for schema, security-auditor for auth middleware
**Benefit**: Domain expertise applied automatically

### Template Integration

**Pattern**: Consistent structure across all artifacts
**Example**: All documentation follows established templates
**Benefit**: Predictable, professional output every time

## 📊 Complexity Levels Shown

### Feature Complexity
- **Minimal**: Simple requirements, basic implementation (not yet shown)
- **Standard**: Balanced complexity with business context ✅ **Demonstrated**
- **Comprehensive**: Full specification with detailed analysis ✅ **Demonstrated**

### Implementation Scope
- **Single Component**: Frontend or backend only (coming soon)
- **Full Feature**: End-to-end implementation ✅ **Demonstrated**
- **System Integration**: Multi-service coordination (coming soon)

### Team Size
- **Solo Developer**: Individual workflow optimization ✅ **Demonstrated**
- **Small Team**: 2-5 developers with coordination (coming soon)
- **Large Team**: Enterprise workflow with governance (coming soon)

## 🔄 Workflow Phase Examples

### Phase 0: `/vision` - Strategic Foundation
**Demonstrated**: Product vision and strategic planning
**Shows**: Problem definition, solution approach, success metrics
**Templates Used**: vision.template.md

### Phase 1: `/feature` - Requirements Definition
**Demonstrated**: User authentication system requirements
**Shows**: Business context, success criteria, technical considerations
**Templates Used**: feature-standard.template.md

### Phase 2: `/architect` - Technical Design
**Demonstrated**: JWT authentication architecture
**Shows**: Component design, security architecture, ADR creation
**Templates Used**: architecture.template.md, decision templates

### Phase 3: `/plan` - Implementation Planning
**Demonstrated**: Phased implementation with agent coordination
**Shows**: P1.X.X → P2.X.X → P3.X.X progression, quality gates
**Templates Used**: plan.template.md, handoff.template.yml, research.template.md

### Phase 4: `/develop` - Code Implementation
**Demonstrated**: Database schema and model implementation (P1.1.0)
**Shows**: Agent execution, context passing, deliverable creation
**Templates Used**: Code patterns and validation

## 🛠️ Template System Integration

### Template Usage Patterns
- **Progressive Complexity**: Templates scale from minimal to comprehensive
- **Consistent Structure**: All artifacts follow predictable patterns
- **Context Awareness**: Templates adapt to project type and requirements

### Command Integration
- **`/vision`**: Strategic foundation and product vision creation
- **`/feature`**: Intelligent template selection based on complexity
- **`/architect`**: Automatic ADR and design document generation
- **`/plan`**: Comprehensive planning with agent coordination
- **`/develop`**: Context-aware implementation with quality validation

## 📈 Success Metrics

### Quality Indicators
- **Documentation Completeness**: All phases fully documented
- **Context Preservation**: No information loss across handoffs
- **Template Consistency**: All artifacts follow established patterns
- **Quality Gate Compliance**: Validation checkpoints enforced

### Efficiency Gains
- **Reduced Context Switching**: Complete context in every handoff
- **Faster Onboarding**: New team members can follow established patterns
- **Consistent Output**: Predictable quality regardless of developer
- **Automated Validation**: Quality gates prevent common mistakes

## 🔗 Related Resources

### Template Documentation
- [Template System Guide](../../templates/README.md)
- [Template Format Reference](../../templates/TEMPLATE-FORMAT-REFERENCE.md)
- [Templates Master Index](../../TEMPLATES-EXAMPLES-INDEX.md)

### AI Workflow Documentation
- [AI Collaboration Guide](../../docs/ai-tools/guides/ai-collaboration-guide.md)
- [Using Agents Guide](../../docs/ai-tools/guides/using-agents.md)
- [Command Reference](../../docs/ai-tools/reference/commands.md)

### Development Guidelines
- [Quality Standards](../../docs/development/guidelines/quality-standards.md)
- [Documentation Guidelines](../../docs/development/guidelines/documentation-guidelines.md)
- [Code Review Guidelines](../../docs/development/guidelines/code-review-guidelines.md)

---

**💡 Pro Tip**: Start with the complete feature workflow example to understand the full process, then adapt the patterns to your specific project needs. The template system is designed to scale with your complexity requirements while maintaining consistency and quality.
---
version: "1.0.0"
created: "2025-09-15"
last_updated: "2025-09-22"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "guide"
priority: "critical"
tags: ["ai-template", "usage-guide", "workflow", "getting-started"]
---

# AI Coding Template - Complete Usage Guide

**Transform this template into your intelligent development environment**

This guide provides comprehensive instructions for using the AI Coding Template system, from initial setup through advanced workflow patterns. Whether you're starting a new project or integrating AI workflows into existing codebases, this guide will help you maximize the template's capabilities.

## 🎯 **Choose Your Path** (Pick One)

### 🏃‍♂️ **Path 1: Quick Demo** (2 minutes)
*"Just show me what this does"*

```bash
# Use GitHub Template and see it in action
# 1. Click "Use this template" → Create repository → Clone
git clone https://github.com/YOUR_USERNAME/my-project.git && cd my-project

# 2. Or use degit for instant local setup
npx degit TaylorHuston/ai-coding-template my-project && cd my-project
```

### 🛠️ **Path 2: Create Your Project** (10 minutes)
*"I want to transform this template into MY project"*

```bash
# Option 1: Use GitHub Template (Recommended)
# 1. Click "Use this template" button → Create your repository
# 2. Clone your new repository
git clone https://github.com/YOUR_USERNAME/my-awesome-project.git
cd my-awesome-project

# Option 2: Use degit
npx degit TaylorHuston/ai-coding-template my-awesome-project
cd my-awesome-project
git init

# Then customize for your project
rm -rf src/*  # Clear example application code
./.claude/resources/scripts/setup/setup-manager.sh init-project
```

**🧠 What happens during setup:**
1. **Claude Code Verification** - Ensures AI tools are ready
2. **Project Discovery** - Understands your project type (web-app, API, CLI, etc.)
3. **Business Context** - B2B SaaS, consumer, internal, open-source
4. **External Integrations** - Connects Jira, Linear, Confluence, Notion
5. **Professional README** - Industry-standard docs tailored to your project
6. **Template Preservation** - All guidance moved to `docs/ai-toolkit/`

### 🚀 **Path 3: Try the AI Workflow** (15 minutes)
*"I want to experience the /design → /architect → /plan → /develop epic-driven workflow"*

```bash
# After project setup, try your first complete AI workflow
/design --epic "user-authentication"
# → Define epic structure, user stories, and acceptance criteria

/architect user-authentication
# → Explore approaches, select patterns/tech, capture ADR

/plan --issue AUTH-123
# → Create comprehensive implementation plan with task breakdown

/develop
# → Execute tasks with test-first enforcement and quality gates
```

### 📚 **Path 4: Learn the System** (30 minutes)
*"I want to understand how this works"*

→ **Continue reading this guide for complete system understanding**

---

## 🤔 **What Problem Does This Solve?**

### **Before: Traditional AI Coding**
- ❌ AI forgets context between conversations
- ❌ Architectural decisions made in isolation
- ❌ Inconsistent patterns across the codebase
- ❌ No memory of why decisions were made

### **After: AI Architectural Partnership**
- ✅ Perfect context preservation across long projects
- ✅ Guided architectural exploration with expert consultation
- ✅ Systematic planning with specialist agents
- ✅ Quality-validated execution with automatic documentation

## 🔄 **Intelligent Template → Project Transformation**

**🚀 Revolutionary Feature**: AI-powered project initialization that understands YOUR needs!

```bash
# Traditional templates: One-size-fits-all nightmare
git clone template → manually replace README → guess configuration → lose context

# AI Coding Template: Intelligent transformation
./.claude/resources/scripts/setup/setup-manager.sh init-project
```

**🎯 Intelligence Features:**
- **🔍 Smart Discovery**: Detects if you're building a web app, API, CLI tool, library, mobile app, or enterprise solution
- **🏢 Business Awareness**: Understands B2B SaaS vs consumer vs internal tools vs open-source
- **👥 Team Integration**: Adapts to solo developer vs small team vs enterprise
- **🔗 Tool Connection**: Integrates with Jira, Linear, GitHub Issues, Confluence, Notion
- **📋 Professional Docs**: Generates industry-standard README tailored to your exact project type
- **🧠 Preserved Knowledge**: Template docs safely moved to `docs/ai-toolkit/` for reference

## 📋 **The Magic: 4-Phase Epic-Driven Workflow**

Instead of "AI, write me some code," you get a structured, context-preserving epic-driven flow:

### 1. 📝 **Design** (`/design`)
- Define epic structure with user stories and acceptance criteria
- Create task directories with BDD scenarios
- Establish business context and feature requirements

### 2. 🏗️ **Architect** (`/architect`)
- Quick Mode (5-10 min) or Deep Mode (20+ min) technical decisions
- Explore alternatives and select patterns/tech
- Document trade-offs with Fast Track or comprehensive ADRs

### 3. 📋 **Plan** (`/plan`)
- Multi-agent epic planning with X.Y.Z task numbering
- Progressive task discovery across all phases
- Create TASK.md, HANDOFF.yml, RESEARCH.md for each task

### 4. ⚡ **Develop** (`/develop`)
- Execute tasks with test-first enforcement
- Hierarchical epic/task branch management
- Quality gates and comprehensive testing integration

---

## 🎪 **See It In Action** (30 seconds)

Here's what a real workflow looks like:

```bash
# 1. DESIGN: Define epic structure and user stories
/design --epic "user-authentication"
# → Creates epic structure with user stories and acceptance criteria

# 2. ARCHITECT: Quick Mode technical decisions
/architect user-authentication
# → Explore JWT vs sessions, security, data model → Fast Track ADR

# 3. PLAN: Multi-agent epic planning and task breakdown
/plan --issue AUTH-123
# → Multi-agent analysis (security, backend, frontend, DB, testing)
# → X.Y.Z task numbering with progressive discovery

# 4. DEVELOP: Execute with test-first enforcement
/develop
# → TASK-001:1.2.3 ✅ → TASK-002:1.2.4 ✅ → TASK-003:1.2.5 ✅
# → Hierarchical epic/task branching with quality gates
# → 95%+ test coverage and comprehensive testing integration
# Result: Production-ready epic with full documentation and testing
```

**Total time: 30 minutes of guided work vs. 3 hours of back-and-forth**

---

## 🤖 **18 Specialized AI Agents**

### **Architecture & Planning**
- **code-architect** - System design and technical decisions
- **project-manager** - Epic planning and coordination
- **context-analyzer** - Requirements analysis and clarification

### **Development Specialists**
- **frontend-specialist** - UI/UX and client-side development
- **backend-specialist** - Server-side logic and APIs
- **database-specialist** - Data modeling and optimization
- **api-designer** - API design and documentation

### **Quality & Operations**
- **test-engineer** - Testing strategy and implementation
- **code-reviewer** - Code quality and best practices
- **security-auditor** - Security analysis and compliance
- **performance-optimizer** - Performance analysis and optimization
- **devops-engineer** - Deployment and infrastructure

### **Documentation & Analysis**
- **technical-writer** - Documentation creation and maintenance
- **data-analyst** - Data analysis and reporting
- **migration-specialist** - Legacy system migration
- **refactoring-specialist** - Code improvement and refactoring

### **Strategy & Innovation**
- **brief-strategist** - Business requirements and strategy
- **ai-llm-expert** - AI/ML integration and optimization

## 🔧 **Smart Context Management**

### **Context Preservation Features**
- Preserve project knowledge across AI sessions
- Structured approach to AI-human collaboration
- Advanced memory management for long-term continuity
- Automatic context loading based on current work

### **Automated Quality Gates**
- Pre-commit hooks for quality validation
- Automated testing and linting integration
- Security scanning and compliance checks
- Performance monitoring and optimization

### **Performance Analytics & Optimization**
- Comprehensive metrics collection for commands, agents, and scripts
- Usage pattern analysis and workflow optimization insights
- Privacy-first local analytics with configurable data collection

## 📚 **Template Integration Options**

### **For New Projects**
1. Read this complete usage guide
2. Follow the intelligent setup process
3. Configure MCP tools for enhanced capabilities
4. Start with the 4-phase workflow

### **For Existing Projects**
1. Start with [Integration Guide](./setup/integration-guide.md)
2. Choose gradual adoption strategy
3. Configure only the agents and features you need
4. Migrate existing documentation gradually

## 🧭 **Navigation Help**

### **Essential Files to Know**
- **[📋 Reference Tree](../../.claude/references/documentation-tree.md)** - Complete documentation navigation
- **[⚙️ Setup Guide](./setup/quick-start.md)** - Detailed installation
- **[🔧 Commands Reference](./reference/commands.md)** - All available commands
- **[🤖 Agent Guide](./guides/comprehensive-agent-guide.md)** - Complete agent system guide

### **Key Directories**
- **`.claude/resources/templates/`** - Fill-in-the-blank starting points for any task
- **`.claude/resources/examples/`** - Working code examples to study and adapt
- **`.claude/agents/`** - 18 specialist agents for every domain
- **`.claude/resources/scripts/`** - 20+ automation scripts for development workflow

### **Quick Commands**
```bash
# Project status and health
./.claude/resources/scripts/status/ai-status.sh

# Find the right template or example
cat .claude/references/templates-examples-tree.md

# Generate documentation automatically
/docs generate --type all

# Validate code quality
/quality assess

# Get comprehensive project status
/status --detailed
```

## 🎓 **Advanced Workflows**

### **Agent Coordination Patterns**
- Use project-manager for complex multi-domain tasks
- Coordinate frontend-specialist + backend-specialist for full-stack features
- Follow code-reviewer → security-auditor → performance-optimizer for quality assurance

### **Context Preservation Strategies**
- Always read STATUS.md first to understand current project state
- Update STATUS.md after significant progress or decisions
- Use deliverables/ directory for organized issue tracking

### **Quality Assurance Workflows**
- Use systematic quality workflows from commands reference
- Follow automated quality gates for consistent standards
- Apply patterns from AI collaboration guide

## 🔧 **Tool Integration**

### **MCP Servers**
- **context7** - Official library documentation access
- **sequential-thinking** - Multi-step reasoning for complex problems
- **gemini-cli** - Second opinions and massive context analysis
- **playwright** - Browser automation and testing

### **Development Tools**
- Git hooks for automated quality checks
- Scripts for project health monitoring
- Documentation generation and maintenance
- Automated changelog management

### **AI Platforms**
- Optimized for Claude Code but adaptable to other assistants
- Works with VS Code, Cursor, and other IDEs
- Integration patterns for team collaboration

## 🆘 **Need Help?**

### **Quick Answers**
- **"What commands are available?"** → [Commands Reference](./reference/commands.md)
- **"How do I start a new epic?"** → `/design --epic "epic-name"`
- **"Where are the templates?"** → [Templates Reference](../../.claude/references/templates-examples-tree.md)
- **"Something's broken?"** → [Troubleshooting Guide](./reference/troubleshooting.md)

### **Common First Steps**
1. **For new epics**: Start with `/design`, then `/architect`
2. **For existing code**: Use `/quality assess` to understand current state
3. **For documentation**: Check templates reference for the right template
4. **For bugs**: Use `/plan --issue BUG-001` to systematically approach fixes

### **Troubleshooting**
- **Agent not responding**: Check [Troubleshooting Guide](./reference/troubleshooting.md)
- **MCP connection issues**: See [MCP Setup Guide](./setup/mcp-setup.md)
- **Integration problems**: Reference [Integration Guide](./setup/integration-guide.md)
- **Generic AI responses**: Review [Agent Usage Guide](./guides/comprehensive-agent-guide.md)

## 🎯 **Template Philosophy**

This template is designed to:
- **Augment, not replace** human developers
- **Scale AI assistance** across development teams
- **Maintain code quality** while increasing development velocity
- **Preserve context** across long development sessions
- **Support both new and existing** project integration

The system works by providing AI assistants with the structure, context, and specialized knowledge they need to be true architectural partners rather than simple code generators.

---

## 🎯 **Ready to Start?**

Pick your path from the top of this guide and dive in! The system is designed to guide you through every step.

**Remember**: This isn't about replacing your thinking - it's about giving AI the context and structure to be a true architectural partner.

---

**Related Documentation**:
- [Project Documentation](../project/README.md)
- [Development Documentation](../development/README.md)
- [Root Project README](../../README.md)
- [Complete System Guide](./guides/workflow-guide.md)
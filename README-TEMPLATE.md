# 🚀 Start Here - Your First 5 Minutes

**New to this template? You're in the right place!**

This template transforms AI from a simple code generator into your intelligent architectural partner. Instead of forgetting context and making isolated decisions, AI will remember everything and help you build better software.

## 🎯 **Choose Your Path** (Pick One)

### 🏃‍♂️ **Path 1: Quick Demo** (2 minutes)
*"Just show me what this does"*

```bash
# Copy this template and see it in action
git clone https://github.com/yourusername/ai-coding-template.git my-project && cd my-project
npm run demo
```

### 🛠️ **Path 2: Create Your Project** (10 minutes)
*"I want to transform this template into MY project"*

```bash
# Transform template into your real project
git clone https://github.com/yourusername/ai-coding-template.git my-awesome-project
cd my-awesome-project
rm -rf src/*  # Clear example application code
./.resources/scripts/setup-manager.sh init-project
```

**🧠 What happens during setup:**
1. **Claude Code Verification** - Ensures AI tools are ready
2. **Project Discovery** - Understands your project type (web-app, API, CLI, etc.)
3. **Business Context** - B2B SaaS, consumer, internal, open-source
4. **External Integrations** - Connects Jira, Linear, Confluence, Notion
5. **Professional README** - Industry-standard docs tailored to your project
6. **Template Preservation** - All guidance moved to `docs/ai-tools/`

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

→ **[Complete System Guide](./docs/ai-tools/guides/workflow-guide.md)**

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
./.resources/scripts/setup-manager.sh init-project
```

**🎯 Intelligence Features:**
- **🔍 Smart Discovery**: Detects if you're building a web app, API, CLI tool, library, mobile app, or enterprise solution
- **🏢 Business Awareness**: Understands B2B SaaS vs consumer vs internal tools vs open-source
- **👥 Team Integration**: Adapts to solo developer vs small team vs enterprise
- **🔗 Tool Connection**: Integrates with Jira, Linear, GitHub Issues, Confluence, Notion
- **📋 Professional Docs**: Generates industry-standard README tailored to your exact project type
- **🧠 Preserved Knowledge**: Template docs safely moved to `docs/ai-tools/` for reference

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

## 🧭 **Navigation Help**

### **Essential Files to Know**
- **[📋 Reference Tree](./.claude/references/documentation-tree.md)** - Complete documentation navigation
- **[📖 Complete README](./README.md)** - Full system documentation
- **[⚙️ Setup Guide](./docs/ai-tools/setup/quick-start.md)** - Detailed installation
- **[🔧 Commands Reference](./docs/ai-tools/reference/commands.md)** - All available commands

### **Key Directories**
- **`.resources/templates/`** - Fill-in-the-blank starting points for any task
- **`.resources/examples/`** - Working code examples to study and adapt
- **`.claude/agents/`** - 18 specialist agents for every domain
- **`.resources/scripts/`** - 20+ automation scripts for development workflow

### **Quick Commands**
```bash
# Project status and health
./.resources/scripts/ai-status.sh

# Find the right template or example
cat .claude/references/templates-examples-tree.md

# Generate documentation automatically
/docs generate --type all

# Validate code quality
/quality assess

# Get comprehensive project status
/status --detailed
```

---

## 🆘 **Need Help?**

### **Quick Answers**
- **"What commands are available?"** → `./docs/ai-tools/reference/commands.md`
- **"How do I start a new epic?"** → `/design --epic "epic-name"`
- **"Where are the templates?"** → `.claude/references/templates-examples-tree.md`
- **"Something's broken?"** → `./docs/ai-tools/reference/troubleshooting.md`

### **Common First Steps**
1. **For new epics**: Start with `/design`, then `/architect`
2. **For existing code**: Use `/quality assess` to understand current state
3. **For documentation**: Check `.claude/references/templates-examples-tree.md` for the right template
4. **For bugs**: Use `/plan --issue BUG-001` to systematically approach fixes

---

## 🎯 **Ready to Start?**

Pick your path above and dive in! The system is designed to guide you through every step.

**Remember**: This isn't about replacing your thinking - it's about giving AI the context and structure to be a true architectural partner.

---

*Next: Depending on your chosen path, either run the demo, try the workflow, or dive into the complete documentation.*

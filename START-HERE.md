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
./scripts/setup-manager.sh init-project
```

**🧠 What happens during setup:**
1. **Claude Code Verification** - Ensures AI tools are ready
2. **Project Discovery** - Understands your project type (web-app, API, CLI, etc.)
3. **Business Context** - B2B SaaS, consumer, internal, open-source
4. **External Integrations** - Connects Jira, Linear, Confluence, Notion
5. **Professional README** - Industry-standard docs tailored to your project
6. **Template Preservation** - All guidance moved to `docs/ai-tools/`

### 🚀 **Path 3: Try the AI Workflow** (15 minutes)
*"I want to experience the /vision → /feature → /architect → /plan → /develop flow"*

```bash
# After project setup, try your first complete AI workflow
/vision --create
# → Define product vision, problem, solution, and success metrics

/feature --new "User Authentication"
# → Captures business context, requirements, success criteria

/architect user-authentication
# → Explore approaches, select patterns/tech, capture ADR
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
./scripts/setup-manager.sh init-project
```

**🎯 Intelligence Features:**
- **🔍 Smart Discovery**: Detects if you're building a web app, API, CLI tool, library, mobile app, or enterprise solution
- **🏢 Business Awareness**: Understands B2B SaaS vs consumer vs internal tools vs open-source
- **👥 Team Integration**: Adapts to solo developer vs small team vs enterprise
- **🔗 Tool Connection**: Integrates with Jira, Linear, GitHub Issues, Confluence, Notion
- **📋 Professional Docs**: Generates industry-standard README tailored to your exact project type
- **🧠 Preserved Knowledge**: Template docs safely moved to `docs/ai-tools/` for reference

## 📋 **The Magic: 5-Phase Workflow**

Instead of "AI, write me some code," you get a structured, context-preserving flow:

### 0. 🎯 **Vision** (`/vision`)
- Define WHY you're building and WHAT success looks like
- Problem validation and solution strategy
- Success framework with measurable metrics

### 1. 💡 **Feature** (`/feature`)
- Define what and why (business context, users, requirements)
- Identify dependencies and success criteria
- Link to external issue trackers when available

### 2. 🏗️ **Architect** (`/architect`)
- Explore alternatives and select patterns/tech
- Document trade-offs with ADRs
- Align with constraints and non-functionals

### 3. 📋 **Plan** (`/plan`)
- Sequential multi-agent planning by specialists
- Phased roadmap (P1 → P2 → P3) with dependencies
- Coordination files: PLAN.md, HANDOFF.yml, RESEARCH.md

### 4. ⚡ **Develop** (`/develop`)
- Execute tasks with the right specialist agents
- Enforce quality gates between phases
- Preserve and update context and documentation

---

## 🎪 **See It In Action** (30 seconds)

Here's what a real workflow looks like:

```bash
# 0. VISION: Define why the product exists
/vision --create
# → Establishes product vision, problem statement, success metrics

# 1. FEATURE: Define what and why
/feature --new "User Authentication"
# → Captures business context, requirements, success criteria (aligned with vision)

# 2. ARCHITECT: Decide how
/architect user-authentication
# → Explore JWT vs sessions, security, data model → ADR (supports vision)

# 3. PLAN: Expert analysis and task breakdown
/plan --issue AUTH-123
# → Specialists analyze (security, backend, frontend, DB, testing)
# → 12 tasks across 3 phases with quality gates

# 4. DEVELOP: Execute with quality and memory
/develop
# → P1.1.0 ✅ → P1.2.0 ✅ → P1.3.0 ✅ (Phase 1 complete)
# → P2.1.0 ✅ → P2.2.0 ✅ → P2.3.0 ✅ (Phase 2 complete)
# → P3.1.0 ✅ → P3.2.0 ✅ → P3.3.0 ✅ (Phase 3 complete)
# Result: Production-ready feature with full documentation and vision alignment
```

**Total time: 30 minutes of guided work vs. 3 hours of back-and-forth**

---

## 🧭 **Navigation Help**

### **Essential Files to Know**
- **[📋 Quick Reference Index](./TEMPLATES-EXAMPLES-INDEX.md)** - Find any template or example
- **[📖 Complete README](./README.md)** - Full system documentation
- **[⚙️ Setup Guide](./docs/ai-tools/setup/quick-start.md)** - Detailed installation
- **[🔧 Commands Reference](./docs/ai-tools/reference/commands.md)** - All available commands

### **Key Directories**
- **`templates/`** - Fill-in-the-blank starting points for any task
- **`examples/`** - Working code examples to study and adapt
- **`.claude/agents/`** - 18 specialist agents for every domain
- **`scripts/`** - 20+ automation scripts for development workflow

### **Quick Commands**
```bash
# Project status and health
./scripts/ai-status.sh

# Find the right template or example
cat TEMPLATES-EXAMPLES-INDEX.md

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
- **"How do I start a new feature?"** → `/feature --new "Describe your feature"`
- **"Where are the templates?"** → `TEMPLATES-EXAMPLES-INDEX.md`
- **"Something's broken?"** → `./docs/ai-tools/reference/troubleshooting.md`

### **Common First Steps**
1. **For new features**: Start with `/feature`, then `/architect`
2. **For existing code**: Use `/quality assess` to understand current state
3. **For documentation**: Check `TEMPLATES-EXAMPLES-INDEX.md` for the right template
4. **For bugs**: Use `/plan --issue BUG-001` to systematically approach fixes

---

## 🎯 **Ready to Start?**

Pick your path above and dive in! The system is designed to guide you through every step.

**Remember**: This isn't about replacing your thinking - it's about giving AI the context and structure to be a true architectural partner.

---

*Next: Depending on your chosen path, either run the demo, try the workflow, or dive into the complete documentation.*

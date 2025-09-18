# AI Coding Template

## Intro

This is an attempt to add structure and guidance around ai-assisted coding. It is very much in an alpha phase at the moment and I greatly appreciate any feedback on it. This is an experiment, I'm still figuring out the best way to give the AI tools all of the context and guide rails they need to work effectively without being too restrictive or trying to basically replicated Jira in your repo.

**Project Structure**: This template includes both the AI workflow framework (in the root) and example application code (in `src/`) that is being used to test this out and try out different commands, workflows and iterations.

## Transform AI into Your Architectural Partner

From simple code generator to intelligent development partner through the a streamlined /design → /architect → /plan → /develop workflow.

---

## 🚀 **New Here? Start Smart**

### **🎯 Choose Your Entry Point**

- **[👋 START HERE](./START-HERE.md)** - New user? Your 5-minute guided introduction
- **[🤖 AI Workflow Commands](./docs/ai-tools/reference/commands.md)** - Let AI handle everything automatically
- **[⚡ 2-Minute Demo](#quick-demo)** - See the value immediately

### **📚 Essential Navigation**

- **[🔧 All Commands](./docs/ai-tools/reference/commands.md)** - Complete command reference
- **[🤖 17 Specialist Agents](./docs/ai-tools/guides/comprehensive-agent-guide.md)** - Your expert team
- **[🏗️ Complete Setup](./docs/ai-tools/setup/quick-start.md)** - Full configuration guide

### **🚀 Getting Started**

1. **[👋 START HERE](./START-HERE.md)** - 5-minute guided introduction
2. **[⚡ Quick Demo](#quick-demo)** - See the workflow in action
3. **[🏗️ Setup Guide](./docs/ai-tools/setup/quick-start.md)** - Complete configuration
4. **[🤖 Agent System](./docs/ai-tools/guides/comprehensive-agent-guide.md)** - 17 specialist team
5. **[🤖 AI Commands](./docs/ai-tools/reference/commands.md)** - Start your AI-assisted workflow

---

## 🤔 Why This Matters: The AI Coding Problem

**Traditional AI development suffers from critical issues:**

- ❌ **Context Amnesia**: AI forgets decisions and repeats questions
- ❌ **Architectural Blindness**: No understanding of how pieces fit together
- ❌ **Pattern Inconsistency**: Each request generates different approaches
- ❌ **Quality Gaps**: No systematic validation between iterations

**Result**: Hours of repetitive explanations and inconsistent architectural decisions.

### **The Solution: AI as Architectural Partner**

**Transform AI from reactive code generator to proactive architectural partner:**

```mermaid
graph LR
    D[📝 /design] --> A[🏗️ /architect] --> P[📋 /plan] --> V[⚡ /develop]

    D --> D1[Vision & Strategy]
    D --> D2[Feature Requirements]
    D --> D3[User Stories]

    A --> A1[Technology Stack]
    A --> A2[Architecture Decisions]
    A --> A3[Implementation Patterns]

    P --> P1[Multi-Agent Analysis]
    P --> P2[Task Breakdown]
    P --> P3[Context Coordination]

    V --> V1[Agent Orchestration]
    V --> V2[Quality Gates]
    V --> V3[Context Preservation]
```

#### 1. 📝 `/design` - Vision, Features, and Requirements

Define all non-technical aspects - from product vision to detailed user stories:

- **Vision Documents**: Problem definition, solution strategy, and success metrics
- **Feature Specifications**: Detailed feature requirements and user workflows
- **User Stories**: Specific use cases with acceptance criteria
- **Business Context**: Target audience and value propositions

#### 2. 🏗️ `/architect` - Technical Architecture and Infrastructure

Make comprehensive technical decisions through collaborative exploration:

- **Technology Foundation**: Framework, database, and infrastructure choices
- **Architecture Patterns**: Component design, API structure, and integration approaches
- **Development Environment**: Containerization, build tools, and deployment architecture
- **Decision Documentation**: Create ADRs with rationale and alternatives considered

#### 3. 📋 `/plan` - Implementation Planning

Break down architecture into executable tasks with context preservation:

- **Context Integration**: Builds on design and architecture documentation
- **Task Decomposition**: Generates P1.X.X, P2.X.X, P3.X.X phased tasks
- **Agent Selection**: Intelligent assignment based on task requirements

#### 4. ⚡ `/develop` - Development Execution

Execute implementation tasks with AI agent orchestration:

- **Orchestrator Model**: Main Claude coordinates specialized agents
- **Context Preservation**: Complete handoff context across all tasks
- **Quality Gates**: Validation between phases with smart recovery

### Why This Workflow Matters

**🎯 Architectural Quality**: Decisions are thoroughly explored before any code is written **🧠 Perfect Memory**: Context is preserved across sessions, agents, and phases **👥 Multi-Expert Coordination**: 17 specialized agents work together seamlessly **⚡ Quality Assurance**: Built-in gates ensure standards are maintained throughout **📈 Scalable Complexity**: Works for simple features to complex system redesigns

### Key Innovation: Agent-First Architecture

**🚀 Intelligence Over Automation**: Scripts serve agents, not users directly

- Agents make context-aware decisions about which scripts to invoke
- Intelligent orchestration replaces manual script coordination
- Scripts become tools that agents use intelligently

**🔗 Unified Interface**: Complex operations simplified through intelligent commands

- `/docs` replaces 5+ manual documentation scripts
- `/quality` coordinates multiple validation tools automatically
- `/status` provides intelligent analysis, not just raw data

**🧠 Context-Aware Execution**: Every script invocation includes project context

- Agents understand project state and requirements
- Scripts receive relevant context for optimal execution
- Results are interpreted and integrated intelligently

## Quick Demo

**See the value in 2 minutes before diving deeper:**

```bash
# Clone and run the interactive demo
git clone [your-repo] my-project && cd my-project
npm run demo
```

This simulation shows you exactly how the template transforms AI from reactive coding to proactive architectural partnership.

## 🔄 **Intelligent Project Setup**

**AI-powered initialization** that understands your project type, business context, and team needs:

```bash
git clone ai-coding-template.git my-project
cd my-project
./.resources/scripts/setup-manager.sh init-project
```

- **Smart Discovery**: Automatically detects project type and business context
- **Tool Integration**: Connects with Jira, Linear, Confluence, Notion
- **Custom Configuration**: Generates tailored README and AI instructions

**[Complete Setup Guide →](./docs/ai-tools/setup/quick-start.md)**

## Quick Start: Your First Workflow (5 Minutes)

### Prerequisites

**Required:**

- Git (2.25+)
- VS Code or preferred editor
- AI assistant account (Claude Code, Claude, etc.)
- **[uv](https://github.com/astral-sh/uv)** - Python package manager for semantic code analysis
  ```bash
  # Install uv (required for Serena semantic tools)
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```

**Optional (Enhanced Multi-Model Intelligence):**

- **[Gemini CLI](https://github.com/google-gemini/gemini-cli)** - Enables cross-validation and second opinions from Google's Gemini

  ```bash
  # Install via npm
  npm install -g @google/gemini-cli

  # Or using your package manager
  # See: https://github.com/google-gemini/gemini-cli#installation
  ```

### 1. Intelligent Project Setup

```bash
# Clone the template
git clone https://github.com/yourusername/ai-coding-template.git my-project
cd my-project

# 🚀 INTELLIGENT INITIALIZATION (Recommended for new projects)
./.resources/scripts/setup-manager.sh init-project
# → Guided setup: project type, business context, external tools
# → Professional README generation
# → Template docs preserved in docs/ai-tools/

# OR: Quick setup (keeps template as-is)
./.resources/scripts/setup-manager.sh quick

# Verify everything is ready
./.resources/scripts/setup-manager.sh check
```

**🎯 What `init-project` does:**

1. **Verifies Claude Code** is installed and ready
2. **Discovers your project** through guided questions
3. **Integrates external tools** (Jira, Confluence, etc.)
4. **Generates professional docs** tailored to your project type
5. **Preserves template knowledge** in `docs/ai-tools/`

### 2. Experience the Workflow

**Try the complete workflow with a simple feature:**

```bash
# FEATURE: Define what and why
/feature --new "User Data Validation"

# ARCHITECT: Decide how
/architect data-validation

# PLAN: Create implementation plan
/plan --issue VALIDATION-001

# DEVELOP: Run through the tasks
/develop
```

**This 15-minute experience will show you:**

- How AI-guided exploration improves decisions
- How multi-agent planning creates better implementations
- How context preservation eliminates the "forgetting" problem

### 3. Learn the System

**→ [Commands Reference](./docs/ai-tools/reference/commands.md)** - Master the four phases **→ [Agent System](./docs/ai-tools/guides/comprehensive-agent-guide.md)** - Understand your 17 specialists **→ [AI Collaboration Guide](./docs/ai-tools/guides/ai-collaboration-guide.md)** - Advanced AI patterns **→ [Complete Setup](./docs/ai-tools/setup/quick-start.md)** - Full configuration options

## How the Template Supports the Workflow

### Workflow-Optimized Project Structure

```
my-project/
├── .claude/                    # Workflow Orchestration System
│   ├── commands/               # /feature, /architect, /plan, /develop implementations
│   └── agents/                # 17 specialized experts for each workflow phase
├── deliverables/              # /plan Output: Organized implementation tracking
│   └── [feature]/issues/      # PLAN.md, HANDOFF.yml, RESEARCH.md per issue
├── docs/                      # Workflow Documentation Integration
│   ├── technical/decisions/   # /architect Output: ADRs and technical decisions
│   ├── technical/architecture/ # Auto-generated from implementations
│   └── ai-tools/              # Workflow guides and references
├── .resources/scripts/                   # Workflow Automation Support
│   ├── docs-manager.sh        # ADR generation, auto-documentation
│   └── quality-gates.sh       # /develop quality validation
├── CLAUDE.md                  # AI instructions centered on workflow
└── STATUS.md                  # Cross-session context preservation
```

### 17 AI Specialist Agents

Expert AI agents automatically coordinate throughout the workflow:

- **Foundation**: context-analyzer, code-architect, project-manager
- **Development**: frontend-specialist, backend-specialist, database-specialist, api-designer
- **Quality**: test-engineer, code-reviewer, security-auditor, performance-optimizer
- **Operations**: devops-engineer, technical-writer, migration-specialist, refactoring-specialist, data-analyst, technical-writer

**[Complete Agent Guide →](./docs/ai-tools/guides/comprehensive-agent-guide.md)**

### Workflow Automation Infrastructure

Everything is designed to enhance the core workflow:

**Intelligent Command System**:

- `/feature` - Feature definition and requirements
- `/architect` - Technical architecture design and ADRs
- `/plan` - Sequential multi-agent planning with intelligent agent selection
- `/develop` - Orchestrated task execution with automatic script integration via agents
- `/docs` - Unified documentation coordination (replaces manual script usage)
- `/quality` - Comprehensive quality assessment with multi-agent script orchestration
- `/status` - Enhanced project intelligence (powered by `context-analyzer` + `ai-status.sh`)

### Available Commands

The template provides **11 intelligently integrated commands** that orchestrate agents and scripts seamlessly:

**🌟 Core Workflow Commands:**

- **`/feature`** - Feature definition and requirements
- **`/architect`** - Technical architecture design and ADRs
- **`/plan`** - Sequential multi-agent planning with intelligent agent selection
- **`/develop`** - Orchestrated task execution with automatic script integration via agents

**🔧 Unified Intelligence Commands:**

- **`/docs`** - Unified documentation management with intelligent agent coordination
- **`/quality`** - Comprehensive quality assessment with multi-agent coordination
- **`/status`** - Enhanced project status with intelligent context analysis

**📋 Development Support Commands:**

- **`/commit`** - Git commit with quality checks and conventional messages
- **`/review`** - Comprehensive code review with multi-dimensional analysis
- **`/security-audit`** - OWASP-compliant security assessment with remediation
- **`/test-fix`** - Automatic test failure detection, analysis, and resolution
- **`/merge-branch`** - Safe branch merging with deployment validation

**Enhanced Workflow Examples:**

```bash
# Quality-focused development with intelligent coordination
/feature --new "Secure File Uploads"
/architect secure-uploads
/plan --issue UPLOAD-123
/develop                          # Execute core tasks with automatic script integration
/quality audit --focus security   # Multi-agent security assessment
/docs sync                        # Intelligent documentation updates
/commit                          # Quality commit

# Daily development workflow with unified commands
/status --ai-format              # Intelligent context analysis
/quality validate --scope current-phase  # Automated quality gates
/docs validate                   # Documentation health check
/develop                         # Continue current work
```

**→ [Complete Commands Reference](./docs/ai-tools/reference/commands.md)** - Detailed usage guide for all integrated commands

**Context Management**:

- `HANDOFF.yml` - Perfect agent-to-agent context passing
- `RESEARCH.md` - Accumulated knowledge from all workflow phases
- `STATUS.md` - Cross-session workflow state preservation

**Quality Assurance**:

- Automatic quality gates between workflow phases
- Built-in validation preventing progression without standards
- Smart recovery and remediation suggestions

**Documentation Integration**:

- ADR generation from `/architect` technical design
- Technical decision tracking linked to implementation
- Auto-generated architecture docs from `/develop` execution
- **Automatic documentation**: Run `./.resources/scripts/docs-manager.sh auto-docs all` to generate:
  - Technology stack documentation
  - System overview diagrams
  - Dependency graphs
  - Architecture documentation

## Development Scripts

Essential scripts for workflow automation:

- **Setup**: `./.resources/scripts/setup-manager.sh quick` - Environment setup
- **Documentation**: `./.resources/scripts/docs-manager.sh auto-docs all` - Generate documentation
- **Status**: `./.resources/scripts/ai-status.sh` - Project health dashboard
- **Quality**: `./.resources/scripts/validate-quality-gates.sh` - Validate between phases

**[Complete Scripts Reference →](./.resources/scripts/README.md)**

## Add to Existing Projects

Integrate the workflow progressively into your existing codebase:

```bash
# Quick integration
curl -O [template-url]/workflow-integration.tar.gz && tar -xzf workflow-integration.tar.gz
```

**[Complete Integration Guide →](./docs/ai-tools/setup/integration-guide.md)**

## Why Teams Choose This Intelligent Integration

### Before: Manual Script Management

```bash
# Manual script coordination
"Run ./.resources/scripts/docs-manager.sh auto-docs all"
"Run ./.resources/scripts/validate-quality-gates.sh"
"Run ./.resources/scripts/check-docs-links.js"

# ❌ No intelligent coordination
# ❌ Manual script selection
# ❌ No context-aware execution
# ❌ Fragmented workflow
```

### After: Intelligent Agent-Script Integration

```bash
# Unified intelligent commands
/docs generate --type all
# → technical-writer coordinates auto-docs-generator.js
# → Intelligent content creation with codebase analysis

/quality assess --depth deep
# → Multi-agent coordination (code-reviewer, security-auditor, test-engineer)
# → Automatic script orchestration based on context

/status --detailed
# → context-analyzer processes ai-status.sh output
# → Intelligent insights and recommendations
```

**Result**: Intelligent script orchestration, context-aware execution, and unified workflow integration.

## 📚 Templates & Examples System

### Accelerate Development with Standardized Resources

The template system provides **fill-in-the-blank starting points** and **working reference implementations** to accelerate your development:

**🔍 Quick Discovery**:

- **Need to create a feature?** → [Feature Templates](./.resources/templates/docs/features/)
- **Building a React component?** → [Component Template](./.resources/templates/code/components/) + [Component Example](./.resources/examples/code/patterns/)
- **Creating an API service?** → [Service Template](./.resources/templates/code/api/) + [Service Example](./.resources/examples/code/patterns/)
- **Writing tests?** → [Test Examples](./.resources/examples/code/patterns/)
- **Documenting an API?** → [API Template](./.resources/templates/docs/api/)

**📋 Two Resource Types**:

- **Templates** (`/.resources/templates/`) - Fill-in-the-blank starting points with placeholders
- **Examples** (`/.resources/examples/`) - Working reference implementations to study and adapt

**🚀 Get Started**:

```bash
# Start the AI workflow - no templates needed
/feature "your feature description"

# Copy a template to start fresh
cp .resources/templates/docs/features/feature.template.md docs/my-feature.md

# Study working examples for patterns
cat .resources/examples/code/patterns/api-user-service.example.ts
```

**[📖 Complete AI Workflow Guide →](./docs/ai-tools/reference/commands.md)**

## Contributing to the Workflow

Help improve the /feature → /architect → /plan → /develop workflow for everyone:

### Workflow Improvements

- 🎯 **Enhance Commands**: Improve `/feature`, `/architect`, `/plan`, or `/develop` functionality
- 🤖 **Agent Optimization**: Make agents more effective at their specializations
- 📋 **Planning Templates**: Create better task generation patterns
- 🔍 **Quality Gates**: Add validation that prevents common issues

### Community

**[Issues](https://github.com/yourusername/ai-coding-template/issues)** • **[Discussions](https://github.com/yourusername/ai-coding-template/discussions)** • **[Contributing](./docs/development/guidelines/contributing.md)**

---

## References

**Methodologies**: [C4 Model](https://c4model.com) • [12Factor](https://12factor.net) • [ADR Process](https://adr.github.io/)

**Related Projects**: [AB Method](https://github.com/ayoubben18/ab-method) • [GitHub Spec Kit](https://github.com/github/spec-kit) • [Claude Studio](https://github.com/arnaldo-delisio/claude-code-studio)

---

Built with ❤️ by developers who believe AI should be an architectural partner, not just a code generator.

-

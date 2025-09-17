---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
purpose: "Master index for all templates and examples in the system"
when_to_use: "When looking for the right template or example to use"
target_audience: ["developers", "technical-writers", "ai-assistants"]
document_type: "index"
tags: ["templates", "examples", "index", "discovery"]
---

# Templates & Examples Master Index

## 🔍 Quick Discovery

### "I need to..." → Find Your Resource

| **I need to...** | **Type** | **Resource** | **Location** |
|-------------------|----------|-------------|--------------|
| **Create a new feature** | Template | Feature Template (Minimal/Standard/Comprehensive) | [templates/workflow/feature/](./templates/workflow/feature/) |
| **Build a React component** | Template | React Component Template | [templates/code/components/](./templates/code/components/) |
| **See component examples** | Example | React Component Example | [examples/code/patterns/](./examples/code/patterns/) |
| **Create an API service** | Template | Service Template | [templates/code/api/](./templates/code/api/) |
| **See service examples** | Example | API Service Example | [examples/code/patterns/](./examples/code/patterns/) |
| **Write unit tests** | Example | Test Examples | [examples/code/patterns/](./examples/code/patterns/) |
| **Document an API** | Template | API Documentation Template | [templates/documentation/technical/](./templates/documentation/technical/) |
| **Make a technical decision** | Template | Architecture Template | [templates/workflow/architecture/](./templates/workflow/architecture/) |
| **Create a project README** | Template | **Intelligent Project Templates** | [templates/documentation/project/](./templates/documentation/project/) |
| **Build a web application** | Template | Web App Project Template | [templates/documentation/project/web-app.template.md](./templates/documentation/project/web-app.template.md) |
| **Build an API service** | Template | API Service Project Template | [templates/documentation/project/api-service.template.md](./templates/documentation/project/api-service.template.md) |
| **Build a CLI tool** | Template | CLI Tool Project Template | [templates/documentation/project/cli-tool.template.md](./templates/documentation/project/cli-tool.template.md) |
| **Build a library/package** | Template | Library Project Template | [templates/documentation/project/library.template.md](./templates/documentation/project/library.template.md) |
| **Build a mobile app** | Template | Mobile App Project Template | [templates/documentation/project/mobile-app.template.md](./templates/documentation/project/mobile-app.template.md) |
| **Build enterprise software** | Template | Enterprise Project Template | [templates/documentation/project/enterprise.template.md](./templates/documentation/project/enterprise.template.md) |
| **Initialize any project** | System | **Intelligent Setup Manager** | `./scripts/setup-manager.sh init-project` |
| **Plan a deliverable** | Template | Implementation Planning Templates | [templates/workflow/planning/](./templates/workflow/planning/) |
| **Create architecture docs** | Template | Architecture Template | [templates/workflow/architecture/](./templates/workflow/architecture/) |
| **Configure the app** | Example | Configuration Example | [examples/code/configs/](./examples/code/configs/) |

## 📁 Directory Structure Overview

### 📝 Templates (`/templates/`) - Fill-in-the-Blank Starting Points

```
templates/
├── README.md                          # Template system guide
├── TEMPLATE-FORMAT-REFERENCE.md       # Format specification
├── code/                              # Code generation templates
│   ├── components/
│   │   └── component.template.tsx     # React component template
│   ├── api/
│   │   └── service.template.ts        # API service template
│   ├── tests/                         # Test templates
│   └── configs/                       # Configuration templates
├── documentation/                     # Documentation templates
│   ├── project/                       # **Intelligent Project Templates**
│   │   ├── project-readme.template.md     # Generic project README
│   │   ├── web-app.template.md             # Web application README
│   │   ├── api-service.template.md         # API service README
│   │   ├── cli-tool.template.md            # CLI tool README
│   │   ├── library.template.md             # Library/package README
│   │   ├── mobile-app.template.md          # Mobile app README
│   │   ├── enterprise.template.md          # Enterprise app README
│   │   └── CHANGELOG.template.md           # Changelog template
│   └── technical/
│       ├── project-vision.template.md     # Vision document
│       ├── project-changelog.template.md  # Technical changelog
│       └── api-reference.template.md      # API documentation
├── workflow/                          # AI Workflow templates
│   ├── feature/                       # Feature context templates
│   │   ├── feature-minimal.template.md    # Basic feature docs (<50 lines)
│   │   ├── feature-standard.template.md   # Standard feature docs (50-150 lines)
│   │   └── feature-comprehensive.template.md # Advanced feature docs (150+ lines)
│   ├── architecture/
│   │   └── architecture.template.md       # Technical architecture docs
│   ├── planning/                      # Implementation planning templates
│   │   ├── plan.template.md               # Implementation plan (P1.X.X format)
│   │   ├── handoff.template.yml           # Agent coordination file
│   │   └── research.template.md           # Research and findings
│   └── implementation/
│       └── implementation-record.template.md # Completed work documentation
└── generation/                        # Auto-generation templates (.tmpl files)
    ├── tech-stack.tmpl
    ├── system-overview.tmpl
    ├── dependency-graph.tmpl
    └── technical-decision.tmpl
```

### 📚 Examples (`/examples/`) - Working Reference Implementations

```
examples/
├── README.md                          # Examples system guide
├── code/                              # Working code examples
│   ├── patterns/
│   │   ├── api-user-service.example.ts      # Service implementation
│   │   ├── component-user-card.example.tsx  # React component
│   │   └── test-user-service.example.test.ts # Unit tests
│   ├── configs/
│   │   └── config-app-config.example.ts     # Configuration
│   └── integrations/                  # Integration examples
├── docs/                              # Documentation examples
│   ├── completed/                     # Real completed docs
│   └── references/                    # Reference documentation
└── workflow/                          # Workflow examples
    └── [completed workflow artifacts]
```

## 🎯 When to Use Templates vs Examples

### Use **Templates** when you need:
- ✅ A starting point to fill in
- ✅ Consistent structure and format
- ✅ Guidance on what to include
- ✅ Placeholders to replace with your content

### Use **Examples** when you need:
- ✅ To understand implementation patterns
- ✅ Working code you can study and adapt
- ✅ Best practices demonstration
- ✅ Reference implementations to learn from

## 🧠 NEW: Intelligent Project Initialization

**Revolutionary Feature**: The template now includes AI-powered project setup that generates the perfect README for YOUR specific project type.

### How It Works

```bash
# Clone template
git clone https://github.com/yourusername/ai-coding-template.git my-project
cd my-project

# Intelligent setup
./scripts/setup-manager.sh init-project
```

**🎯 What makes it intelligent:**

1. **Smart Discovery**: Understands if you're building a web app, API, CLI tool, library, mobile app, or enterprise system
2. **Business Context**: Adapts to B2B SaaS, consumer, internal tools, open-source, educational, or research projects
3. **External Integration**: Connects with Jira, Linear, GitHub Issues, Confluence, Notion, GitBook
4. **Professional Output**: Generates industry-standard README with sections relevant to YOUR project type

### Project Templates Available

| **Project Type** | **Perfect For** | **Template** |
|------------------|-----------------|--------------|
| **Web App** | React/Vue frontends, dashboards, e-commerce | [web-app.template.md](./templates/documentation/project/web-app.template.md) |
| **API Service** | REST APIs, microservices, backends | [api-service.template.md](./templates/documentation/project/api-service.template.md) |
| **CLI Tool** | Command-line utilities, dev tools | [cli-tool.template.md](./templates/documentation/project/cli-tool.template.md) |
| **Library** | NPM packages, shared utilities | [library.template.md](./templates/documentation/project/library.template.md) |
| **Mobile App** | React Native, Flutter apps | [mobile-app.template.md](./templates/documentation/project/mobile-app.template.md) |
| **Enterprise** | Large-scale, compliance-ready systems | [enterprise.template.md](./templates/documentation/project/enterprise.template.md) |

### The Result

**Before**: Generic template README
**After**: Professional project documentation with:
- ✅ Project-specific sections (API docs for APIs, app store links for mobile apps)
- ✅ Business-context features (multi-tenant for B2B SaaS, social features for consumer)
- ✅ External tool integration (Jira links, Confluence docs)
- ✅ Template knowledge preserved in `docs/ai-tools/`

See **[Setup Manager Documentation](./docs/ai-tools/reference/setup-manager.md)** for complete details.

## 🚀 Getting Started Workflows

### 1. Creating a New Feature

**NEW: AI-Enhanced Workflow** (Recommended):

```bash
# Use /feature command for intelligent workflow
/feature --minimal "user authentication"      # Quick, focused features
/feature --standard "user dashboard"          # Balanced complexity
/feature --comprehensive "payment system"     # Full specification
```

**Manual Template Approach**:

```bash
# Minimal: Basic feature docs (<50 lines)
cp templates/workflow/feature/feature-minimal.template.md docs/technical/features/my-feature.md

# Standard: Balanced feature docs (50-150 lines)
cp templates/workflow/feature/feature-standard.template.md docs/technical/features/my-feature.md

# Comprehensive: Advanced feature docs (150+ lines)
cp templates/workflow/feature/feature-comprehensive.template.md docs/technical/features/my-feature.md
```

### 2. Building Components

**Template-First Approach**:
```bash
# Start with template
cp templates/code/components/component.template.tsx src/components/MyComponent.tsx

# Reference example patterns
cat examples/code/patterns/component-user-card.example.tsx
```

**Example-First Approach**:
```bash
# Study the example first
cat examples/code/patterns/component-user-card.example.tsx

# Then create your own based on patterns learned
```

### 3. Creating API Services

```bash
# Use service template
cp templates/code/api/service.template.ts src/services/MyService.ts

# Study service example
cat examples/code/patterns/api-user-service.example.ts

# Study test patterns
cat examples/code/patterns/test-user-service.example.test.ts
```

## 🔧 NEW: Template Categories by Complexity

### 🚀 AI Workflow Templates (Recommended)

**Feature Templates** - Three complexity levels:
- **Minimal** (<50 lines): Quick feature contexts for simple requirements
- **Standard** (50-150 lines): Balanced feature documentation with business context
- **Comprehensive** (150+ lines): Full feature specifications with detailed analysis

**Workflow Phase Templates**:
- **Architecture**: Technical design and decision documentation
- **Planning**: Implementation planning with P1.X.X task structure
- **Implementation**: Historical records of completed work

### 📄 Documentation Templates

**Project Templates** - Intelligent README generation:
- **Web App**: Frontend applications, dashboards, e-commerce
- **API Service**: REST APIs, microservices, backend systems
- **CLI Tool**: Command-line utilities and developer tools
- **Library**: NPM packages, shared utilities, frameworks
- **Mobile App**: React Native, Flutter mobile applications
- **Enterprise**: Large-scale, compliance-ready systems

**Technical Templates**:
- **API Reference**: REST API documentation with examples
- **Project Vision**: Strategic direction and goals
- **Project Changelog**: Version history and updates

### 💻 Code Templates

**Component Templates**:
- **React Component**: TypeScript React components with props and styling
- **API Service**: Backend service templates with error handling

**Configuration Templates**:
- **App Config**: Application configuration patterns

## 📊 Quality Levels

### Examples Quality Indicators
- 🟢 **Production Ready**: Complete, tested, documented
- 🟡 **Learning Reference**: Good patterns, may need adaptation
- 🔴 **Proof of Concept**: Basic structure, needs enhancement

### Template Completeness
- ✅ **Complete**: All placeholders documented, examples provided
- ⚠️ **Basic**: Core structure present, some documentation needed
- ❌ **Draft**: Initial structure, needs completion

## 🔗 Cross-References

### Template → Example Relationships
| Template | Related Example | Purpose |
|----------|----------------|---------|
| `component.template.tsx` | `component-user-card.example.tsx` | React component patterns |
| `service.template.ts` | `api-user-service.example.ts` | Service layer architecture |
| `feature.template.md` | Completed feature docs | Documentation structure |

### Learning Paths
1. **Frontend Developer**: Component example → Component template → Feature template
2. **Backend Developer**: Service example → Service template → API template
3. **Full Stack**: Configuration example → Service example → Component example
4. **Technical Writer**: Example docs → Documentation templates → Decision templates

## 🛠️ Maintenance and Updates

### Template Versioning
- All templates include version numbers in frontmatter
- Breaking changes increment major version
- New features increment minor version
- Bug fixes increment patch version

### Update Process
1. **Template Changes**: Update template → Update examples → Update documentation
2. **Example Updates**: Enhance examples → Document new patterns → Update related templates
3. **Cross-Reference Maintenance**: Verify all links and references remain valid

## 📞 Getting Help

### Can't Find What You Need?
1. **Check the decision tree** in individual README files
2. **Browse by category** in the directory structure
3. **Search by tags** in frontmatter metadata
4. **Create an issue** requesting the missing template/example

### Contributing New Templates/Examples
1. **Follow the format specification**: [TEMPLATE-FORMAT-REFERENCE.md](./templates/TEMPLATE-FORMAT-REFERENCE.md)
2. **Use consistent naming**: Follow established conventions
3. **Document thoroughly**: Include comprehensive metadata
4. **Update indexes**: Add to this master index
5. **Test with real content**: Verify templates work in practice

---

**Quick Navigation**:
- [Templates Directory](./templates/) | [Examples Directory](./examples/)
- [Template Format Guide](./templates/TEMPLATE-FORMAT-REFERENCE.md)
- [Examples Guide](./examples/README.md) | [Templates Guide](./templates/README.md)
---
version: "1.0.0"
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
| **Create a new feature** | Template | Feature Template (Simple/Comprehensive) | [templates/docs/features/](./templates/docs/features/) |
| **Build a React component** | Template | React Component Template | [templates/code/components/](./templates/code/components/) |
| **See component examples** | Example | React Component Example | [examples/code/patterns/](./examples/code/patterns/) |
| **Create an API service** | Template | Service Template | [templates/code/api/](./templates/code/api/) |
| **See service examples** | Example | API Service Example | [examples/code/patterns/](./examples/code/patterns/) |
| **Write unit tests** | Example | Test Examples | [examples/code/patterns/](./examples/code/patterns/) |
| **Document an API** | Template | API Documentation Template | [templates/docs/api/](./templates/docs/api/) |
| **Make a technical decision** | Template | Decision Record Template | [templates/docs/decisions/](./templates/docs/decisions/) |
| **Create a project README** | Template | **Intelligent Project Templates** | [templates/docs/project/](./templates/docs/project/) |
| **Build a web application** | Template | Web App Project Template | [templates/docs/project/web-app-template.md](./templates/docs/project/web-app-template.md) |
| **Build an API service** | Template | API Service Project Template | [templates/docs/project/api-service-template.md](./templates/docs/project/api-service-template.md) |
| **Build a CLI tool** | Template | CLI Tool Project Template | [templates/docs/project/cli-tool-template.md](./templates/docs/project/cli-tool-template.md) |
| **Build a library/package** | Template | Library Project Template | [templates/docs/project/library-template.md](./templates/docs/project/library-template.md) |
| **Build a mobile app** | Template | Mobile App Project Template | [templates/docs/project/mobile-app-template.md](./templates/docs/project/mobile-app-template.md) |
| **Build enterprise software** | Template | Enterprise Project Template | [templates/docs/project/enterprise-template.md](./templates/docs/project/enterprise-template.md) |
| **Initialize any project** | System | **Intelligent Setup Manager** | `./scripts/setup-manager.sh init-project` |
| **Plan a deliverable** | Template | Deliverable Template | [templates/workflow/deliverables/](./templates/workflow/deliverables/) |
| **Explore architecture** | Template | Exploration Templates | [templates/workflow/explorations/](./templates/workflow/explorations/) |
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
├── docs/                              # Documentation templates
│   ├── features/
│   │   ├── feature.template.md        # Comprehensive feature docs
│   │   ├── feature-simple.template.md # Simple feature docs
│   │   └── feature-comprehensive.template.md # Advanced feature docs
│   ├── project/                       # **NEW: Intelligent Project Templates**
│   │   ├── project-readme-template.md      # Generic project README
│   │   ├── web-app-template.md            # Web application README
│   │   ├── api-service-template.md        # API service README
│   │   ├── cli-tool-template.md           # CLI tool README
│   │   ├── library-template.md            # Library/package README
│   │   ├── mobile-app-template.md         # Mobile app README
│   │   └── enterprise-template.md         # Enterprise app README
│   ├── api/
│   │   └── api.template.md            # API documentation
│   ├── decisions/
│   │   └── decision.template.md       # Architecture Decision Records
│   └── technical/
│       ├── vision.template.md         # Vision document
│       └── changelog.template.md      # Changelog
├── workflow/                          # Workflow templates
│   ├── deliverables/
│   │   ├── deliverable-simple.template.md
│   │   └── deliverable-comprehensive.template.md
│   ├── issues/                        # Issue templates (PLAN.md, HANDOFF.yml, etc.)
│   └── explorations/                  # Architectural exploration templates
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
| **Web App** | React/Vue frontends, dashboards, e-commerce | [web-app-template.md](./templates/docs/project/web-app-template.md) |
| **API Service** | REST APIs, microservices, backends | [api-service-template.md](./templates/docs/project/api-service-template.md) |
| **CLI Tool** | Command-line utilities, dev tools | [cli-tool-template.md](./templates/docs/project/cli-tool-template.md) |
| **Library** | NPM packages, shared utilities | [library-template.md](./templates/docs/project/library-template.md) |
| **Mobile App** | React Native, Flutter apps | [mobile-app-template.md](./templates/docs/project/mobile-app-template.md) |
| **Enterprise** | Large-scale, compliance-ready systems | [enterprise-template.md](./templates/docs/project/enterprise-template.md) |

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

**Quick Start**: Simple feature documentation
```bash
# Copy template
cp templates/docs/features/feature-simple.template.md docs/features/my-feature.md

# Study examples
cat examples/code/patterns/api-user-service.example.ts
cat examples/code/patterns/component-user-card.example.tsx
```

**Comprehensive**: Full feature documentation
```bash
# Copy template
cp templates/docs/features/feature-comprehensive.template.md docs/features/my-feature.md

# Study comprehensive patterns
cat examples/code/patterns/test-user-service.example.test.ts
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

## 🔧 Template Categories by Complexity

### Simple Templates (Quick Start)
- **Feature Simple**: Basic feature documentation
- **Deliverable Simple**: Basic deliverable planning
- **Component Basic**: Standard React component

### Comprehensive Templates (Full Featured)
- **Feature Comprehensive**: Complete feature specification
- **Deliverable Comprehensive**: Full project deliverable
- **Service Advanced**: Complete service with error handling

### Specialized Templates (Domain Specific)
- **API Documentation**: REST API documentation
- **Decision Records**: Architecture decisions
- **Vision Document**: Project vision and strategy

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
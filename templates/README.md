---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
status: "active"
target_audience: ["developers", "technical-writers", "ai-assistants"]
document_type: "index"
tags: ["templates", "standardization", "development"]
---

# Templates Directory

## 🎯 Purpose

This directory contains all **fill-in-the-blank templates** for generating consistent content across the project. Templates use standardized placeholder syntax and include comprehensive metadata for discovery and usage guidance.

## 📁 Organization

### Code Templates (`/code/`)
Generate consistent code patterns and structures:

- **`/components/`** - UI component templates
- **`/api/`** - API endpoint and service templates
- **`/tests/`** - Test file templates
- **`/configs/`** - Configuration file templates

### Documentation Templates (`/docs/`)
Create standardized documentation:

- **`/technical/`** - Architecture, design, and technical docs
- **`/decisions/`** - ADR and decision documentation templates
- **`/api/`** - API documentation templates
- **`/features/`** - Feature specification templates

### Workflow Templates (`/workflow/`)
Structure development workflows:

- **`/deliverables/`** - Project deliverable templates
- **`/issues/`** - Issue tracking templates
- **`/explorations/`** - Architectural exploration templates

### Generation Templates (`/generation/`)
Auto-generation and script templates:

- **Auto-docs templates** (`.tmpl` files for script processing)
- **Dynamic content templates**

## 🏷️ Naming Convention

**Standard Templates:** `{name}.template.{ext}`
- `feature.template.md`
- `component.template.tsx`
- `test.template.js`

**Generation Templates:** `{name}.tmpl`
- `tech-stack.tmpl`
- `api-docs.tmpl`

## 📝 Template Format

All templates follow this structure:

```yaml
---
version: "0.1.0"
created: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
purpose: "Brief description of template purpose"
when_to_use: "Specific scenarios for using this template"
target_audience: ["developers", "technical-writers"]
document_type: "template"
tags: ["tag1", "tag2"]
placeholders:
  - name: "PROJECT_NAME"
    description: "Name of the project"
    example: "user-authentication-service"
  - name: "AUTHOR_NAME"
    description: "Name of the author"
    example: "John Smith"
---

# Template Content

Use {{PLACEHOLDER_NAME}} syntax for replaceable content.

## Section Example

This is a {{PROJECT_NAME}} implementation by {{AUTHOR_NAME}}.
```

## 🔍 Discovery Guide

### Quick Reference

| Need | Template | Location |
|------|----------|----------|
| **New Feature** | `feature.template.md` | `/docs/features/` |
| **API Endpoint** | `endpoint.template.ts` | `/code/api/` |
| **React Component** | `component.template.tsx` | `/code/components/` |
| **Test File** | `test.template.js` | `/code/tests/` |
| **Architecture Doc** | `architecture.template.md` | `/docs/technical/` |
| **ADR** | `decision.template.md` | `/docs/decisions/` |
| **Deliverable** | `deliverable.template.md` | `/workflow/deliverables/` |

### Decision Tree: "Which Template Should I Use?"

```
📝 Creating Documentation?
├── 📊 Technical/Architecture → `/docs/technical/`
├── 🎯 Feature Specification → `/docs/features/`
├── 🛡️ Decision Record → `/docs/decisions/`
└── 🔌 API Documentation → `/docs/api/`

💻 Writing Code?
├── ⚛️ UI Component → `/code/components/`
├── 🔌 API/Service → `/code/api/`
├── 🧪 Test File → `/code/tests/`
└── ⚙️ Configuration → `/code/configs/`

🔄 Setting Up Workflow?
├── 📦 Project Deliverable → `/workflow/deliverables/`
├── 🐛 Issue Template → `/workflow/issues/`
└── 🔍 Exploration → `/workflow/explorations/`
```

## 🛠️ Usage Instructions

### 1. Find the Right Template
Use the decision tree above or browse by category.

### 2. Copy Template
```bash
cp templates/docs/features/feature.template.md my-new-feature.md
```

### 3. Replace Placeholders
Find all `{{PLACEHOLDER_NAME}}` instances and replace with actual values.

### 4. Customize Content
Modify the template content to fit your specific needs.

### 5. Update Metadata
Update the frontmatter with current information.

## 🔗 Related Resources

- **[Examples Directory](/examples/)** - Reference implementations and working examples
- **[CLAUDE.md](/CLAUDE.md)** - AI assistant instructions for using templates
- **[Development Guidelines](/docs/development/)** - Team standards and conventions

## 🤝 Contributing

When adding new templates:

1. Follow the naming convention
2. Include complete YAML frontmatter
3. Use `{{PLACEHOLDER}}` syntax consistently
4. Add to this README index
5. Test template with real content
6. Document placeholders clearly

---

**Templates vs Examples**: Templates are fill-in-the-blank starting points. For working reference implementations, see the [Examples Directory](/examples/).
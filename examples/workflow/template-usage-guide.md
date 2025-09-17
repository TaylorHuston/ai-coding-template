---
version: "0.1.0"
created: "2025-09-17"
purpose: "Practical guide for using the consolidated template system"
complexity: "beginner-friendly"
estimated_time: "10 minutes"
tags: ["template-usage", "getting-started", "best-practices", "workflow"]
---

# Template Usage Guide

A practical guide to using the consolidated template system for efficient, consistent development.

## 🎯 Quick Start: Template Selection Decision Tree

### 1. What Are You Creating?

```
📋 Feature Documentation?
├── Simple requirement (< 2 pages) → feature-minimal.template.md
├── Standard feature (2-4 pages) → feature-standard.template.md
└── Complex system (4+ pages) → feature-comprehensive.template.md

🏗️ Technical Architecture?
└── System design needed → architecture.template.md

📝 Project Documentation?
├── Web Application → web-app.template.md
├── API Service → api-service.template.md
├── CLI Tool → cli-tool.template.md
├── Library/Package → library.template.md
├── Mobile App → mobile-app.template.md
└── Enterprise System → enterprise.template.md

💻 Code Implementation?
├── React Component → component.template.tsx
└── API Service → service.template.ts

📋 Implementation Planning?
├── Task Breakdown → plan.template.md
├── Agent Coordination → handoff.template.yml
└── Research Context → research.template.md
```

## 🚀 Template Usage Patterns

### Pattern 1: Feature Development (Recommended)

**Scenario**: Adding user authentication to your app

```bash
# Step 1: Define the feature
/feature --standard "user authentication system"
# Creates: docs/technical/features/user-authentication-system.md

# Step 2: Design the architecture
/architect user-authentication-system
# Creates: docs/technical/architecture/user-authentication-architecture.md
# Creates: docs/technical/decisions/ADR-001-authentication-strategy.md

# Step 3: Plan implementation
/plan --issue AUTH-123
# Creates: .claude/working/AUTH-123/PLAN.md
# Creates: .claude/working/AUTH-123/HANDOFF.yml
# Creates: .claude/working/AUTH-123/RESEARCH.md

# Step 4: Execute with AI agents
/develop
# Executes tasks with appropriate specialized agents
```

### Pattern 2: Manual Template Usage

**Scenario**: Quick documentation without full workflow

```bash
# Copy template
cp templates/workflow/feature/feature-minimal.template.md docs/technical/features/quick-feature.md

# Fill in placeholders
# {{FEATURE_NAME}} → User Profile Management
# {{BUSINESS_CONTEXT}} → Users need to manage their profile information
# etc.

# Result: Consistent documentation following established patterns
```

### Pattern 3: Project Initialization

**Scenario**: Starting a new web application project

```bash
# Option A: Intelligent setup (recommended)
./scripts/setup-manager.sh init-project
# Asks questions and generates appropriate README

# Option B: Manual template usage
cp templates/documentation/project/web-app.template.md README.md
# Fill in all {{PLACEHOLDER}} values manually
```

## 📋 Template Complexity Guide

### When to Choose Each Complexity Level

#### Minimal Templates (< 50 lines)
**Use for**:
- ✅ Quick feature definitions
- ✅ Simple bug fixes
- ✅ Internal tools and utilities
- ✅ Proof-of-concept features

**Example**: "Add dark mode toggle to settings page"

#### Standard Templates (50-150 lines)
**Use for**:
- ✅ Most production features
- ✅ User-facing functionality
- ✅ API endpoints and services
- ✅ Component libraries

**Example**: "User authentication system with login/register"

#### Comprehensive Templates (150+ lines)
**Use for**:
- ✅ Complex business features
- ✅ Multi-system integrations
- ✅ Security-critical implementations
- ✅ Performance-sensitive features

**Example**: "Payment processing system with multiple providers"

## 🎨 Template Customization Examples

### Example 1: Customizing Feature Template

**Before** (template placeholder):
```markdown
## Business Context

**Problem Statement**: {{PROBLEM_DESCRIPTION}}

**Target Users**: {{USER_PERSONAS}}

**Success Criteria**: {{SUCCESS_METRICS}}
```

**After** (filled in for your project):
```markdown
## Business Context

**Problem Statement**: Users struggle to find relevant content in our large product catalog, leading to poor conversion rates and user frustration.

**Target Users**:
- Primary: E-commerce shoppers looking for specific products
- Secondary: Browse users exploring product categories

**Success Criteria**:
- Search result relevance score > 85%
- Search-to-purchase conversion rate > 12%
- Average time to find product < 30 seconds
```

### Example 2: Adapting Architecture Template

**Template Structure**:
```markdown
## Component Architecture

### {{SYSTEM_TYPE}} Components
```
{{COMPONENT_DESCRIPTION}}
```

### {{INTEGRATION_TYPE}} Integration
```
{{INTEGRATION_DETAILS}}
```
```

**Customized for Your Stack**:
```markdown
## Component Architecture

### React Frontend Components
```
src/
├── components/
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   └── SearchFilters.tsx
│   └── common/
│       └── LoadingSpinner.tsx
```

### ElasticSearch Integration
```
- Index: products_v1 with custom analyzers
- Query DSL: Multi-match with field boosting
- Aggregations: Category and price range facets
- Performance: < 100ms response time
```
```

## ⚡ Efficiency Tips

### Template Shortcuts

```bash
# Create aliases for common templates
alias new-feature="cp templates/workflow/feature/feature-standard.template.md"
alias new-component="cp templates/code/components/component.template.tsx"
alias new-service="cp templates/code/api/service.template.ts"

# Usage
new-feature docs/technical/features/my-feature.md
new-component src/components/MyComponent.tsx
```

### Placeholder Management

**Find all placeholders in a template**:
```bash
grep -o '{{[^}]*}}' template-file.md | sort | uniq
```

**Quick placeholder replacement**:
```bash
# Replace all instances of a placeholder
sed -i 's/{{PROJECT_NAME}}/MyAwesomeApp/g' README.md
sed -i 's/{{AUTHOR_NAME}}/John Developer/g' README.md
```

### Template Validation

**Check if all placeholders are filled**:
```bash
# Should return no results if all placeholders are replaced
grep -n '{{.*}}' your-document.md
```

## 🔧 Integration with Development Tools

### VS Code Snippets

Create `.vscode/snippets.json`:
```json
{
  "Feature Template": {
    "prefix": "feat-template",
    "body": [
      "# Feature: ${1:Feature Name}",
      "",
      "## Business Context",
      "**Problem Statement**: ${2:problem description}",
      "**Success Criteria**: ${3:success metrics}",
      "",
      "## Functional Requirements",
      "${4:requirements list}"
    ],
    "description": "Insert feature template structure"
  }
}
```

### Git Hooks for Template Validation

`.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Check for unfilled template placeholders
if grep -r '{{.*}}' docs/ 2>/dev/null; then
    echo "Error: Unfilled template placeholders found in documentation"
    echo "Please fill in all {{PLACEHOLDER}} values before committing"
    exit 1
fi
```

## 📊 Quality Checklist

### Before Using a Template

- [ ] **Choose Right Complexity**: Minimal/Standard/Comprehensive based on scope
- [ ] **Check Dependencies**: Does this template require other templates?
- [ ] **Verify Location**: File going in the correct directory?
- [ ] **Naming Convention**: Following {name}.template.{ext} pattern?

### After Filling Template

- [ ] **All Placeholders Filled**: No {{PLACEHOLDER}} values remain
- [ ] **Content Accurate**: Information matches your specific implementation
- [ ] **Links Valid**: All references and links work correctly
- [ ] **Formatting Consistent**: Follows project style guidelines
- [ ] **Examples Relevant**: Any example code matches your tech stack

### Quality Standards Met

- [ ] **Documentation Complete**: All required sections filled
- [ ] **Technical Accuracy**: Architecture and code examples correct
- [ ] **Business Alignment**: Features align with business goals
- [ ] **Maintainability**: Documentation easy to update and extend

## 🔗 Template Relationships

### Workflow Dependencies

```
Feature Template
    ↓ (informs)
Architecture Template
    ↓ (guides)
Planning Templates
    ↓ (executes)
Code Templates
    ↓ (creates)
Implementation Record
```

### Documentation Hierarchy

```
Project README (project templates)
    ├── Feature Docs (feature templates)
    ├── Architecture Docs (architecture templates)
    ├── API Docs (technical templates)
    └── Decision Records (generated from architecture)
```

## 🚀 Next Steps

1. **Choose Your Starting Point**: Select template based on what you're building
2. **Follow the Workflow**: Use `/feature → /architect → /plan → /develop` for complex features
3. **Customize as Needed**: Adapt templates to your project specifics
4. **Maintain Consistency**: Keep using templates for all similar work
5. **Share with Team**: Establish templates as team standards

## 💡 Pro Tips

- **Start Simple**: Use minimal templates first, upgrade to comprehensive as needed
- **Version Control**: Keep template versions in sync with project evolution
- **Team Standards**: Establish which templates to use for which scenarios
- **Automation**: Consider automating template selection based on keywords
- **Feedback Loop**: Improve templates based on actual usage patterns

---

Remember: Templates are starting points, not rigid requirements. Adapt them to serve your project's specific needs while maintaining consistency and quality.
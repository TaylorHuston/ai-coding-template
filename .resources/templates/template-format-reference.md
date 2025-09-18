---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
purpose: "Define standardized template format for all templates in the system"
when_to_use: "Reference when creating new templates or updating existing ones"
target_audience: ["template-creators", "developers", "technical-writers"]
document_type: "specification"
tags: ["templates", "standards", "format", "reference"]
---

# Template Format Reference

## 📋 Overview

This document defines the standardized format for all templates in the `/templates/` directory. Following this format ensures consistency, discoverability, and proper tooling support.

## 🏗️ Template Structure

### 1. YAML Frontmatter (Required)

Every template MUST start with YAML frontmatter containing standardized metadata:

```yaml
---
version: "0.1.0"
created: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
purpose: "Brief description of template purpose"
when_to_use: "Specific scenarios for using this template"
target_audience: ["audience1", "audience2"]
document_type: "template"
tags: ["tag1", "tag2", "tag3"]
placeholders:
  - name: "PLACEHOLDER_NAME"
    description: "What this placeholder represents"
    example: "Example value"
  - name: "ANOTHER_PLACEHOLDER"
    description: "Another placeholder description"
    example: "Another example"
---
```

### 2. Placeholder Syntax (Required)

**Standard Format**: `{{PLACEHOLDER_NAME}}`

**Rules**:
- Use UPPER_SNAKE_CASE for placeholder names
- Wrap in double curly braces: `{{LIKE_THIS}}`
- No spaces inside braces: ❌ `{{ WRONG }}` ✅ `{{CORRECT}}`
- Descriptive names that indicate the content type

**Common Placeholders**:
```yaml
# Identity placeholders
{{COMPONENT_NAME}}      # PascalCase component names
{{SERVICE_NAME}}        # PascalCase service names
{{FEATURE_NAME}}        # Human-readable feature names
{{AUTHOR_NAME}}         # Person's name
{{CREATED_DATE}}        # YYYY-MM-DD format
{{LAST_UPDATED_DATE}}   # YYYY-MM-DD format

# Content placeholders
{{DESCRIPTION}}         # Brief descriptions
{{PURPOSE}}             # Purpose statements
{{BUSINESS_VALUE}}      # Business justification
{{IMPLEMENTATION}}      # Implementation details

# Technical placeholders
{{PROP_TYPE}}          # TypeScript types
{{IMPORT_PATH}}        # Import paths
{{CLASS_NAME}}         # CSS class names
{{API_ENDPOINT}}       # API endpoints
```

### 3. Documentation Sections (Recommended)

Include helpful sections in your template:

```markdown
## Template Usage
Brief instructions on how to use this template.

## Placeholder Guide
| Placeholder | Description | Example |
|-------------|-------------|---------|
| {{NAME}} | What it is | Example value |

## Example Output
Show what the template looks like when filled out.
```

## 📝 Frontmatter Field Reference

### Required Fields

```yaml
version: "0.1.0"                    # Semantic version of template
created: "YYYY-MM-DD"               # ISO date when created
last_updated: "YYYY-MM-DD"          # ISO date of last update
purpose: "Brief purpose statement"   # One-sentence purpose
when_to_use: "Usage scenarios"      # When to use this template
target_audience: ["audience"]       # Who should use this
document_type: "template"           # Always "template"
tags: ["tag1", "tag2"]             # Searchable tags
```

### Optional Fields

```yaml
complexity: "simple|medium|complex"     # Complexity level
estimated_time: "5 minutes"            # Time to complete
dependencies: ["dep1", "dep2"]         # Required dependencies
related_templates: ["path1", "path2"]  # Related templates
examples: ["example1", "example2"]     # Example implementations
placeholders:                          # Placeholder documentation
  - name: "NAME"
    description: "Description"
    example: "Example"
    required: true
    type: "string|number|boolean"
```

## 🎯 Template Categories

### Documentation Templates (`/docs/`)

**Structure**:
```yaml
# Required sections
- Summary/Overview
- Requirements/Specifications
- Implementation details
- Usage examples
- References

# Common placeholders
{{FEATURE_NAME}}
{{DESCRIPTION}}
{{REQUIREMENTS}}
{{IMPLEMENTATION_APPROACH}}
```

### Code Templates (`/code/`)

**Structure**:
```typescript
/**
 * @template Template Name
 * Purpose: {{PURPOSE}}
 * Generated from: templates/path/to/template
 */

// Imports
import { {{IMPORTS}} } from '{{IMPORT_PATHS}}';

// Type definitions
interface {{INTERFACE_NAME}} {
  {{PROPERTY}}: {{TYPE}};
}

// Implementation
export class {{CLASS_NAME}} {
  // Template implementation
}
```

### Workflow Templates (`/workflow/`)

**Structure**:
```yaml
# Project metadata
- Title and identification
- Status and progress tracking
- Stakeholder information
- Timeline and milestones

# Common placeholders
{{PROJECT_NAME}}
{{STAKEHOLDER}}
{{TIMELINE}}
{{DELIVERABLES}}
```

## ✅ Quality Standards

### Template Quality Checklist

- [ ] **Valid YAML frontmatter** with all required fields
- [ ] **Consistent placeholder syntax** using `{{PLACEHOLDER}}`
- [ ] **Documented placeholders** in frontmatter with examples
- [ ] **Clear usage instructions** in template body
- [ ] **Working example** showing filled template
- [ ] **Proper file naming** following `{name}.template.{ext}` convention
- [ ] **Appropriate categorization** in correct directory
- [ ] **Version tracking** with semantic versioning

### Testing Templates

1. **Placeholder Validation**: Ensure all placeholders are documented
2. **Syntax Check**: Verify YAML frontmatter parses correctly
3. **Example Generation**: Test with real values to ensure output works
4. **Link Validation**: Check that any links in template are valid
5. **Tool Compatibility**: Ensure template works with generation scripts

## 🔧 Generation Script Integration

Templates with `.tmpl` extension are processed by generation scripts:

```yaml
# For auto-generation templates
file_extension: ".tmpl"
script_compatible: true
generation_context:
  - "Available variables from script"
  - "Processing instructions"
  - "Output format expectations"
```

## 📚 Examples

### Minimal Template

```yaml
---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
purpose: "Simple example template"
when_to_use: "When you need a basic example"
target_audience: ["developers"]
document_type: "template"
tags: ["example", "minimal"]
placeholders:
  - name: "TITLE"
    description: "Document title"
    example: "My Document"
---

# {{TITLE}}

This is a minimal template example.
```

### Comprehensive Template

```yaml
---
version: "0.1.0"
created: "2025-09-17"
last_updated: "2025-09-17"
purpose: "Comprehensive template with all features"
when_to_use: "When you need full template capabilities"
target_audience: ["developers", "technical-writers"]
document_type: "template"
tags: ["comprehensive", "full-featured"]
complexity: "medium"
estimated_time: "15 minutes"
dependencies: ["existing-component"]
related_templates: ["simple.template.md"]
placeholders:
  - name: "COMPONENT_NAME"
    description: "Name of the component in PascalCase"
    example: "UserProfile"
    required: true
    type: "string"
  - name: "DESCRIPTION"
    description: "Component description"
    example: "Displays user profile information"
    required: true
    type: "string"
  - name: "PROPS"
    description: "Component props definition"
    example: "{ userId: string; showEmail?: boolean }"
    required: false
    type: "string"
---

# {{COMPONENT_NAME}} Component

## Description
{{DESCRIPTION}}

## Props
```typescript
interface {{COMPONENT_NAME}}Props {{PROPS}}
```

## Usage Example
```tsx
<{{COMPONENT_NAME}} userId="123" showEmail={true} />
```
```

## 🚀 Best Practices

1. **Keep placeholders semantic**: Use names that describe the content, not the format
2. **Provide clear examples**: Every placeholder should have a realistic example
3. **Document complex placeholders**: Explain format requirements and constraints
4. **Test your templates**: Generate actual content to verify templates work
5. **Version your changes**: Update version and last_updated when modifying
6. **Use consistent terminology**: Align with project vocabulary and conventions
7. **Consider the user journey**: Templates should guide users through the process
8. **Link related resources**: Reference examples, documentation, and related templates

## 🔄 Template Lifecycle

1. **Creation**: Follow this specification when creating new templates
2. **Testing**: Validate with real content before committing
3. **Documentation**: Update relevant index files and documentation
4. **Maintenance**: Regular review and updates to keep templates current
5. **Retirement**: Mark deprecated templates and provide migration paths

---

**Template for Templates**: Use this document as the reference when creating any new template in the system.
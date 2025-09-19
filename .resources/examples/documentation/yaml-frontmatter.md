# YAML Frontmatter Examples

## Basic Required Fields

```yaml
---
version: "1.0.0"
created: "2025-09-18"
last_updated: "2025-09-18"
status: "active"
target_audience: ["developers", "ai-assistants"]
---
```

## Complete Example with Optional Fields

```yaml
---
version: "2.1.0"
created: "2025-08-21"
last_updated: "2025-09-18"
status: "active"
target_audience: ["developers", "technical-writers", "ai-assistants"]
document_type: "guide"
priority: "high"
tags: ["documentation", "standards", "workflow", "structure"]
---
```

## Document Type Examples

### Technical Guide

```yaml
---
version: "1.0.0"
created: "2025-09-18"
last_updated: "2025-09-18"
status: "active"
target_audience: ["developers", "ai-assistants"]
document_type: "guide"
tags: ["api", "implementation", "patterns"]
---
```

### Specification Document

```yaml
---
version: "0.2.0"
created: "2025-09-17"
last_updated: "2025-09-18"
status: "draft"
target_audience: ["architects", "developers"]
document_type: "specification"
tags: ["security", "requirements", "compliance"]
---
```

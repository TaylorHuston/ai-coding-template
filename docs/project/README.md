---
version: "0.1.0"
created: "2025-09-15"
status: "active"
target_audience: ["developers", "project-teams"]
document_type: "placeholder"
priority: "high"
tags: ["project-docs", "placeholder"]
---

# Technical Documentation

**This directory is for YOUR project's technical documentation.**

This is where you should place technical documentation that's specific to your actual project, not the AI tools themselves.

## What Goes Here

### `/architecture/`
- System architecture diagrams (C4 model)
- Component designs and relationships
- Technology decision records (ADRs)
- System context and container views

### `/api/`
- API documentation and specifications
- OpenAPI/Swagger definitions
- Endpoint documentation
- Authentication and authorization docs

### `/database/`
- Database schema documentation
- Entity relationship diagrams (ERDs)
- Migration documentation
- Data modeling decisions

### `/decisions/`
- Architecture Decision Records (ADRs)
- Technical decisions and rationale
- Trade-off analyses
- Historical decision context

## Getting Started

1. **Architecture**: Start with `architecture/README.md` to document your system overview
2. **API**: Add API specifications to `api/` as your endpoints are developed
3. **Database**: Document your data model in `database/`
4. **Decisions**: Record major technical decisions in `decisions/` using the ADR template

## Templates Available

- ADR template in `decisions/template.md`
- C4 model examples in `architecture/examples/`
- API documentation template in `api/template.md`

## AI Assistant Integration

When working with AI assistants on your project:
- Keep this documentation updated as your project evolves
- Reference these docs when asking for architectural guidance
- Use the templates to maintain consistency

---

**Note**: This documentation is separate from the AI tools documentation (found in `../ai-toolkit/`) and development process documentation (found in `../development/`).
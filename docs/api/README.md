---
title: "API Documentation"
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-08-21"
status: "Active"
target_audience: ["Developers", "API Consumers"]
tags: ["api-documentation", "rest-api", "directory-overview"]
category: "Reference"
description: "Directory overview for API specifications and documentation."
---

# API Documentation

This directory is for API specifications and documentation when your project includes APIs.

## Structure

```
api/
├── README.md           # This file
├── rest-api.md         # REST API endpoints
├── graphql-schema.md   # GraphQL schema (if applicable)
├── websocket-api.md    # WebSocket events (if applicable)
└── schemas/            # JSON/OpenAPI schemas
```

## When to Add API Documentation

Add API documentation here when:
- Building REST APIs
- Creating GraphQL endpoints
- Implementing WebSocket communications
- Defining external service contracts
- Documenting webhook payloads

## Template

For new API documentation, follow this structure:

```markdown
# [API Name] API

**Version**: 1.0.0
**Base URL**: `/api/v1`

## Authentication
[Authentication method details]

## Endpoints

### GET /resource
[Endpoint documentation]

## Error Responses
[Common error formats]
```

## Best Practices

1. Keep API docs synchronized with implementation
2. Include example requests and responses
3. Document all error states
4. Version your APIs clearly
5. Use OpenAPI/Swagger when appropriate
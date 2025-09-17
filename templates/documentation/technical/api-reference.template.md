---
title: "{{API_NAME}} API Documentation"
version: "{{API_VERSION}}"
created: "{{CREATED}}"
last_updated: "{{LAST_UPDATED}}"
status: "Template"
target_audience: "{{TARGET_AUDIENCE}}"
tags: ["api-documentation", "rest-api", "template"]
category: "Templates"
description: "Template for API documentation."
api_status: "{{STATUS}}"
api_version: "{{API_VERSION}}"
---

# {{API_NAME}} API Documentation

## Overview

{{API_NAME}} API provides functionality for {{API_PURPOSE}}. This RESTful API follows standard HTTP conventions and returns JSON responses.

## Base URL

```
{{BASE_URL}}
```

## Authentication

### Authentication Method
- **Type**: {{AUTH_TYPE}}
- **Header**: `Authorization: {{AUTH_HEADER}}`
- **Token Location**: {{TOKEN_LOCATION}}

### Getting Access
1. Step 1: How to register or get credentials
2. Step 2: How to authenticate
3. Step 3: How to use the token

### Example Authentication
```bash
curl -X GET "{{BASE_URL}}/{{ENDPOINT}}" \
  -H "Authorization: {{AUTH_EXAMPLE}}" \
  -H "Content-Type: application/json"
```

## Common Patterns

### Request Format
```json
{
  "data": {
    // Request payload
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "2023-01-01T00:00:00Z"
  }
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "2023-01-01T00:00:00Z"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details
    }
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "2023-01-01T00:00:00Z"
  }
}
```

## Endpoints

### {{RESOURCE_NAME}} Management

#### List {{RESOURCE_NAME}}s
```http
GET {{BASE_URL}}/{{RESOURCE_PATH}}
```

**Query Parameters:**
- `page` (integer, optional): Page number for pagination (default: 1)
- `limit` (integer, optional): Number of items per page (default: 20, max: 100)
- `filter` (string, optional): Filter criteria
- `sort` (string, optional): Sort field and direction (e.g., "name:asc")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "{{RESOURCE_ID}}",
      "name": "{{RESOURCE_NAME}}",
      "status": "active",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ],
  "metadata": {
    "requestId": "req-123",
    "timestamp": "2023-01-01T00:00:00Z"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### Get {{RESOURCE_NAME}} by ID
```http
GET {{BASE_URL}}/{{RESOURCE_PATH}}/{id}
```

**Path Parameters:**
- `id` (string, required): Unique identifier for the {{RESOURCE_NAME}}

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "{{RESOURCE_ID}}",
    "name": "{{RESOURCE_NAME}}",
    "status": "active",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Create {{RESOURCE_NAME}}
```http
POST {{BASE_URL}}/{{RESOURCE_PATH}}
```

**Request Body:**
```json
{
  "data": {
    "name": "{{RESOURCE_NAME}}",
    "description": "{{RESOURCE_DESCRIPTION}}",
    "status": "active"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "{{RESOURCE_ID}}",
    "name": "{{RESOURCE_NAME}}",
    "description": "{{RESOURCE_DESCRIPTION}}",
    "status": "active",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Update {{RESOURCE_NAME}}
```http
PUT {{BASE_URL}}/{{RESOURCE_PATH}}/{id}
```

**Path Parameters:**
- `id` (string, required): Unique identifier for the {{RESOURCE_NAME}}

**Request Body:**
```json
{
  "data": {
    "name": "Updated {{RESOURCE_NAME}}",
    "description": "Updated description",
    "status": "inactive"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "{{RESOURCE_ID}}",
    "name": "Updated {{RESOURCE_NAME}}",
    "description": "Updated description",
    "status": "inactive",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Delete {{RESOURCE_NAME}}
```http
DELETE {{BASE_URL}}/{{RESOURCE_PATH}}/{id}
```

**Path Parameters:**
- `id` (string, required): Unique identifier for the {{RESOURCE_NAME}}

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "{{RESOURCE_NAME}} deleted successfully"
  }
}
```

## Data Models

### {{RESOURCE_NAME}} Model
```typescript
interface {{RESOURCE_NAME}} {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description?: string;          // Optional description
  status: 'active' | 'inactive' | 'pending';  // Current status
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
}
```

### Validation Rules
- `name`: Required, 1-255 characters, alphanumeric and spaces allowed
- `description`: Optional, max 1000 characters
- `status`: Required, must be one of: 'active', 'inactive', 'pending'

## Status Codes

| Code | Description | When to Expect |
|------|-------------|----------------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists or conflict |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

## Error Codes

| Error Code | Description | Resolution |
|------------|-------------|------------|
| INVALID_REQUEST | Request format is invalid | Check request structure and content-type |
| MISSING_FIELD | Required field is missing | Include all required fields |
| VALIDATION_ERROR | Field validation failed | Check field format and constraints |
| NOT_FOUND | Resource not found | Verify resource ID exists |
| PERMISSION_DENIED | Insufficient permissions | Check authentication and authorization |
| RATE_LIMIT_EXCEEDED | Too many requests | Wait before retrying |

## Rate Limiting

- **Rate Limit**: 1000 requests per hour per API key
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

## Pagination

All list endpoints support pagination with the following parameters:

- `page`: Page number (starts from 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Filtering and Sorting

### Filtering
Use the `filter` query parameter with the following format:
```
?filter=field:operator:value
```

**Supported Operators:**
- `eq`: Equals
- `ne`: Not equals
- `gt`: Greater than
- `lt`: Less than
- `contains`: Contains substring
- `starts`: Starts with

**Examples:**
```
?filter=status:eq:active
?filter=name:contains:test
?filter=createdAt:gt:2023-01-01
```

### Sorting
Use the `sort` query parameter:
```
?sort=field:direction
```

**Directions:**
- `asc`: Ascending
- `desc`: Descending

**Examples:**
```
?sort=name:asc
?sort=createdAt:desc
```

## Code Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: '{{BASE_URL}}',
  headers: {
    'Authorization': '{{AUTH_EXAMPLE}}',
    'Content-Type': 'application/json'
  }
});

// Get all {{RESOURCE_NAME}}s
async function get{{RESOURCE_NAME}}s() {
  try {
    const response = await client.get('/{{RESOURCE_PATH}}');
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Create new {{RESOURCE_NAME}}
async function create{{RESOURCE_NAME}}(data) {
  try {
    const response = await client.post('/{{RESOURCE_PATH}}', { data });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}
```

### Python
```python
import requests

class {{API_NAME}}Client:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'{{AUTH_EXAMPLE}}',
            'Content-Type': 'application/json'
        }
    
    def get_{{RESOURCE_NAME}}s(self, page=1, limit=20):
        """Get paginated list of {{RESOURCE_NAME}}s"""
        params = {'page': page, 'limit': limit}
        response = requests.get(
            f'{self.base_url}/{{RESOURCE_PATH}}',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()
    
    def create_{{RESOURCE_NAME}}(self, data):
        """Create new {{RESOURCE_NAME}}"""
        payload = {'data': data}
        response = requests.post(
            f'{self.base_url}/{{RESOURCE_PATH}}',
            headers=self.headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()
```

### cURL Examples
```bash
# List all {{RESOURCE_NAME}}s
curl -X GET "{{BASE_URL}}/{{RESOURCE_PATH}}" \
  -H "Authorization: {{AUTH_EXAMPLE}}" \
  -H "Content-Type: application/json"

# Create new {{RESOURCE_NAME}}
curl -X POST "{{BASE_URL}}/{{RESOURCE_PATH}}" \
  -H "Authorization: {{AUTH_EXAMPLE}}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Test {{RESOURCE_NAME}}",
      "description": "Test description",
      "status": "active"
    }
  }'

# Get specific {{RESOURCE_NAME}}
curl -X GET "{{BASE_URL}}/{{RESOURCE_PATH}}/123" \
  -H "Authorization: {{AUTH_EXAMPLE}}" \
  -H "Content-Type: application/json"
```

## Testing

### Test Environment
- **Base URL**: {{TEST_BASE_URL}}
- **Test API Key**: Contact support for test credentials

### Postman Collection
[Download Postman Collection]({{POSTMAN_COLLECTION_URL}})

## Support

### Getting Help
- **Documentation**: [API Documentation]({{DOCS_URL}})
- **Support Email**: {{SUPPORT_EMAIL}}
- **Status Page**: {{STATUS_PAGE_URL}}

### Common Issues
1. **Authentication Errors**: Ensure API key is valid and included in headers
2. **Rate Limiting**: Implement exponential backoff for retries
3. **Validation Errors**: Check request format against data models

## Changelog

### Version {{API_VERSION}}
- Added new {{RESOURCE_NAME}} endpoints
- Improved error handling and response format
- Added pagination support

### Previous Versions
- [Version History]({{VERSION_HISTORY_URL}})

---

*Last reviewed: {{LAST_UPDATED}}*
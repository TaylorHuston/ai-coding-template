# API Versioning Examples

## Header-Based Versioning

```http
# Request with version header
GET /api/users
Accept: application/vnd.api+json;version=2
API-Version: 2

# Response indicates version
HTTP/1.1 200 OK
API-Version: 2
Content-Type: application/vnd.api+json;version=2
```

## Version Lifecycle Management

```yaml
# API version lifecycle
api_versions:
  v1:
    status: deprecated
    sunset_date: "2025-12-31"
    migration_guide: "/docs/migration/v1-to-v2"

  v2:
    status: current
    release_date: "2025-06-01"
    features: ["enhanced-filtering", "batch-operations"]

  v3:
    status: beta
    release_date: "2025-09-01"
    features: ["graphql-support", "real-time-updates"]
```

## Benefits

### URL Path Versioning
- Easy to understand and debug
- Clear separation between versions
- Simple routing and caching
- Browser-friendly for direct testing

### Header-Based Versioning
- Cleaner URLs
- More flexible versioning options
- Supports content negotiation
- RESTful purist approach
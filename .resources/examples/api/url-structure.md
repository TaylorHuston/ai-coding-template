# REST API URL Structure Examples

## Good: Resource-oriented, hierarchical URLs

```
GET    /api/v1/users                    # Get all users
GET    /api/v1/users/{id}               # Get specific user
POST   /api/v1/users                    # Create new user
PUT    /api/v1/users/{id}               # Update entire user
PATCH  /api/v1/users/{id}               # Partial user update
DELETE /api/v1/users/{id}               # Delete user

# Nested resources
GET    /api/v1/users/{id}/orders        # Get user's orders
POST   /api/v1/users/{id}/orders        # Create order for user
GET    /api/v1/users/{id}/orders/{order_id}  # Get specific order

# Collection operations
GET    /api/v1/users?status=active      # Filter active users
GET    /api/v1/users?page=2&limit=20    # Pagination
GET    /api/v1/users?sort=created_at:desc  # Sorting
```

## Bad: Non-resource oriented URLs

```
POST   /api/v1/getUserById              # Use GET /api/v1/users/{id}
GET    /api/v1/user_list                # Use GET /api/v1/users
POST   /api/v1/createUser               # Use POST /api/v1/users
```

## Resource Naming Rules

- Use **plural nouns** for collections (`/users`, `/orders`, `/products`)
- Use **lowercase** with **hyphens** for multi-word resources (`/order-items`, `/user-preferences`)
- Avoid **verbs** in URLs (use HTTP methods instead)
- Use **consistent** naming patterns across the API
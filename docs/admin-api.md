# Admin API Documentation

This document explains how to use the admin API endpoint to view feedback submissions.

## Endpoint

```
POST /api/admin
```

## Authentication

The admin API requires authentication with the following hardcoded credentials:

- **Email**: `admin@connectruas.com`
- **Password**: `admin@123456`

## Request Format

Send a POST request with the following JSON payload:

```json
{
  "email": "admin@connectruas.com",
  "password": "admin@123456"
}
```

## Response Format

On successful authentication, the API returns all feedback submissions:

```json
{
  "success": true,
  "feedback": [
    {
      "id": "99da3572-80bd-4b55-84b6-f7b71495a626",
      "feedbackType": "bug",
      "rating": 1,
      "message": "Its not working",
      "email": "user@example.com",
      "status": "new",
      "createdAt": "2025-10-20T07:43:40.951Z",
      "user": {
        "id": "user_34D3OluAw1hwgWGJdkCCw5Maqyl",
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
  ]
}
```

## Error Responses

If authentication fails, the API returns:

```json
{
  "error": "Invalid credentials"
}
```

If there's a server error, the API returns:

```json
{
  "error": "Failed to fetch feedback",
  "details": "Error message"
}
```

## Testing

You can test the admin API using the provided test script:

```bash
npm run test:admin-api
```

Or using curl:

```bash
curl -X POST http://localhost:3000/api/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@connectruas.com",
    "password": "admin@123456"
  }'
```
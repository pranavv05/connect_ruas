# Health Check Endpoint

## Overview

The health check endpoint provides a simple way to verify that the application is running correctly in production. It checks the database connection and returns the status of the application.

## Endpoint

```
GET /api/health
```

## Response

### Success Response

```json
{
  "status": "ok",
  "timestamp": "2023-10-20T10:30:00.000Z",
  "database": "connected"
}
```

### Error Response

```json
{
  "status": "error",
  "timestamp": "2023-10-20T10:30:00.000Z",
  "database": "disconnected",
  "error": "Error message"
}
```

## Usage

This endpoint can be used by:
- Monitoring services to check application health
- Load balancers to determine if the application is healthy
- Deployment scripts to verify successful deployment
- Manual health checks during troubleshooting

## Monitoring

It's recommended to set up monitoring that periodically calls this endpoint and alerts if:
- The status is not "ok"
- The response time exceeds a threshold
- The endpoint is unreachable
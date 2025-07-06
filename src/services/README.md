# API Service Layer

This directory contains the centralized API service layer for communicating with the FastAPI backend.

## Overview

The API service layer provides:
- **Type-safe API calls** using auto-generated TypeScript types from the OpenAPI spec
- **Global error handling** with custom error messages for different HTTP status codes
- **Request/response interceptors** for authentication, logging, and notifications
- **Timeout handling** with a default 30-second timeout
- **Retry mechanism** with exponential backoff for failed requests
- **Global notification system** integration

## Files

- `api.ts` - Main API service with typed functions for all endpoints
- `api.example.ts` - Example usage of the API service
- `../types/api.ts` - Auto-generated TypeScript types from OpenAPI spec

## Usage

### Basic API Calls

```typescript
import { postChat, getHealth, getPerformance } from '@/services/api';

// Send a chat message
const response = await postChat({
  message: "What's the project status?",
  session_id: "session-123",
  user_id: "user-123",
  enable_profiling: false
});

// Check API health
const health = await getHealth();

// Get performance stats
const stats = await getPerformance();
```

### Error Handling

The API service automatically handles errors and provides meaningful error messages:

```typescript
import { ApiError } from '@/services/api';

try {
  const response = await postChat({ message: "Hello" });
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
    console.error('Status Code:', error.status);
    console.error('Response Data:', error.data);
  }
}
```

### Global Notifications

Set up a notification handler to automatically show errors/warnings to users:

```typescript
import { setNotificationHandler } from '@/services/api';
import { toast } from 'react-toastify'; // or your preferred toast library

// Set up once in your app initialization
setNotificationHandler((type, message) => {
  toast[type](message);
});
```

### Retry Failed Requests

Use the retry utility for critical operations:

```typescript
import { retryRequest, getPerformance } from '@/services/api';

// Retry up to 3 times with exponential backoff
const stats = await retryRequest(
  () => getPerformance(),
  3,     // max retries
  1000   // initial delay in ms
);
```

## Configuration

The API base URL is configured through environment variables:

```env
VITE_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`.

## Type Generation

To regenerate TypeScript types when the backend API changes:

```bash
npm run generate-types
```

This command fetches the latest OpenAPI spec from the backend and regenerates the types in `src/types/api.ts`.

## Available Endpoints

All endpoints are exposed as typed functions:

- `postChat(data: ChatRequest)` - Send a chat message
- `getHealth()` - Get API health status
- `getPerformance()` - Get performance statistics
- `startProfiling()` - Start performance profiling
- `stopProfiling()` - Stop profiling and get results
- `monitorChatBurst(duration?)` - Monitor high-load performance
- `getP6Status()` - Get P6 database status
- `getRoot()` - Get API root information

## Advanced Usage

### Custom Request Configuration

For advanced use cases, you can access the axios instance directly:

```typescript
import { axiosInstance } from '@/services/api';

const response = await axiosInstance.request({
  method: 'POST',
  url: '/custom-endpoint',
  data: { custom: 'data' },
  headers: { 'X-Custom-Header': 'value' }
});
```

### Adding New Endpoints

1. Update the FastAPI backend with new endpoints
2. Run `npm run generate-types` to update TypeScript types
3. Add new typed functions to `api.ts` following the existing pattern

## Best Practices

1. Always use the typed functions instead of making raw axios calls
2. Handle `ApiError` specifically to access status codes and response data
3. Use the retry mechanism for critical operations that might fail temporarily
4. Set up the global notification handler early in your app initialization
5. Keep the types up-to-date by running `generate-types` when the API changes

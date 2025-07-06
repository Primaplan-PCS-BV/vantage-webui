# Authentication Module

This module provides authentication and user management functionality for the Vantage AI platform.

## Features

- **Context-based Authentication**: Uses React Context API to manage auth state globally
- **Protected Routes**: `ProtectedRoute` component to guard authenticated pages
- **User Preferences**: Persistent user preferences stored in localStorage
- **Theme Management**: Light/Dark/System theme switching
- **Placeholder Implementation**: Mock authentication for development

## Components

### AuthContext
The main authentication context that provides:
- `user`: Current user object with id, email, name, and roles
- `token`: Authentication token (JWT placeholder)
- `preferences`: User preferences for theme, profiling, and notifications
- `login()`: Mock login function
- `logout()`: Clear auth state
- `updatePreferences()`: Update and persist user preferences

### ProtectedRoute
Wrapper component that:
- Shows loading state while checking authentication
- Redirects to login if not authenticated
- Checks role-based access if roles are specified
- Shows access denied for insufficient permissions

### LoginPage
Login form with:
- Email/password fields (any credentials work in demo mode)
- Loading states
- Error handling
- Placeholder for OIDC buttons (Azure AD, Keycloak)

### UserPreferences
Settings page for managing:
- Theme selection (Light/Dark/System)
- Default profiling settings
- Notification preferences

## Usage

```tsx
// Wrap your app with AuthProvider
import { AuthProvider } from '@/auth';

<AuthProvider>
  <App />
</AuthProvider>

// Protect routes
import { ProtectedRoute } from '@/auth';

<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>

// With role requirements
<ProtectedRoute roles={['admin', 'manager']}>
  <AdminComponent />
</ProtectedRoute>

// Use auth in components
import { useAuth } from '@/auth';

const Component = () => {
  const { user, logout, updatePreferences } = useAuth();
  // ...
};
```

## TODO: OIDC Integration

The auth module is prepared for OIDC integration with the following providers:

### Keycloak
```typescript
// Future implementation in AuthContext
const loginWithKeycloak = async () => {
  window.location.href = '/api/auth/oidc/keycloak/login';
};
```

### Azure AD
```typescript
// Future implementation in AuthContext
const loginWithAzureAD = async () => {
  window.location.href = '/api/auth/oidc/azure/login';
};
```

### Backend Integration Points
- `POST /api/auth/login` - Traditional login
- `POST /api/auth/logout` - Logout endpoint
- `GET /api/auth/user` - Get current user
- `PUT /api/users/:id/preferences` - Update user preferences
- `GET /api/auth/oidc/:provider/login` - OIDC login redirect
- `GET /api/auth/oidc/:provider/callback` - OIDC callback handler

## Local Storage Keys

- `auth_token`: JWT token
- `auth_user`: User object
- `user_preferences`: User preferences object

## Security Notes

- Current implementation is for development only
- Production should use secure HTTP-only cookies for tokens
- Implement proper CSRF protection
- Add rate limiting on login endpoints
- Use proper password hashing (bcrypt, argon2)
- Implement refresh token rotation

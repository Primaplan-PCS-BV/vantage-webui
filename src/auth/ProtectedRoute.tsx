import React from 'react';
import type { ReactElement } from 'react';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactElement;
  fallback?: ReactElement;
  roles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  roles 
}) => {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return fallback || <LoginPrompt />;
  }

  // Check role-based access if roles are specified
  if (roles && roles.length > 0) {
    const hasRequiredRole = user.roles?.some(role => roles.includes(role));
    if (!hasRequiredRole) {
      return <AccessDenied />;
    }
  }

  // User is authenticated and has required roles
  return children;
};

// Default login prompt component
const LoginPrompt: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Authentication Required</h2>
          <p className="mt-2 text-gray-600">
            Please log in to access this page.
          </p>
        </div>
        <button
          onClick={() => window.location.hash = '#login'}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

// Access denied component for insufficient permissions
const AccessDenied: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        <button
          onClick={() => window.location.hash = '#'}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

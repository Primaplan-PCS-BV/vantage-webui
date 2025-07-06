import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Types for our auth system
export interface User {
  id: string;
  email: string;
  name: string;
  roles?: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultProfiling?: {
    enabled: boolean;
    level: 'basic' | 'detailed' | 'full';
  };
  notifications?: {
    email: boolean;
    inApp: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  // TODO: Add OIDC methods once integrated
  // loginWithOIDC: (provider: 'keycloak' | 'azure') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'light',
  defaultProfiling: {
    enabled: true,
    level: 'basic'
  },
  notifications: {
    email: true,
    inApp: true
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load auth state and preferences from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        const storedPreferences = localStorage.getItem('user_preferences');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        }
      } catch (err) {
        console.error('Failed to load auth state:', err);
        setError('Failed to restore session');
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Apply theme preference
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      if (preferences.theme === 'dark') {
        root.classList.add('dark');
      } else if (preferences.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();
  }, [preferences.theme]);

  const login = async (email: string, _password: string) => {
    // _password parameter will be used once backend authentication is implemented
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call once backend endpoints exist
      // Placeholder implementation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock successful login
      const mockUser: User = {
        id: '123',
        email: email,
        name: email.split('@')[0],
        roles: ['user']
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      setUser(mockUser);
      setToken(mockToken);
      
      // Persist to localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      // TODO: Sync preferences with backend once endpoints exist
      // await api.syncPreferences(preferences);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // TODO: Call backend logout endpoint once it exists
      // await api.logout();
      
      // Clear local state
      setUser(null);
      setToken(null);
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Reset preferences to defaults but keep them in localStorage
      // User preferences persist across sessions
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    
    // Persist to localStorage
    localStorage.setItem('user_preferences', JSON.stringify(updated));
    
    // TODO: Sync with backend once endpoints exist
    // if (user) {
    //   api.updateUserPreferences(user.id, updated).catch(console.error);
    // }
  };

  // TODO: Implement OIDC login methods
  // const loginWithOIDC = async (provider: 'keycloak' | 'azure') => {
  //   setLoading(true);
  //   setError(null);
  //   
  //   try {
  //     // Redirect to OIDC provider
  //     const authUrl = provider === 'keycloak' 
  //       ? '/api/auth/oidc/keycloak/login'
  //       : '/api/auth/oidc/azure/login';
  //     
  //     window.location.href = authUrl;
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'OIDC login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const value: AuthContextType = {
    user,
    token,
    preferences,
    loading,
    error,
    login,
    logout,
    updatePreferences
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { User } from '@/lib/api';
import Cookies from 'js-cookie';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if the user is authenticated by validating token and fetching user data
  const checkAuthStatus = async () => {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const response = await api.get<{ user: User }>('/user');
        setUser(response.data.user);
      } catch (err) {
        console.error('Failed to fetch user data', err);
        setUser(null); // Set user to null if data fetching fails
      }
    }
    setLoading(false);
  };

  // Handle user login
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.login(username, password);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred during login'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.logout();
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred during logout'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle user registration
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.register(username, email, password);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred during registration'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.updatePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while updating password'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Provide authentication context to children components
  const value: AuthContextValue = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to access the AuthContext
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

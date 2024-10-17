import React, { createContext, ReactNode, FC, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import api, { User } from '../lib/api';

// Define AuthContext value
interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Create AuthContext
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Define AuthProviderProps
interface AuthProviderProps {
  children: ReactNode;
}

// Define the AuthProvider component
const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.login(username, password);
      const { user } = response.data;
      setUser(user);
      Cookies.set('accessToken', response.data.access_token); // Set accessToken
      Cookies.set('refreshToken', response.data.refresh_token); // Set refreshToken
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    } catch (error) {
      console.error('Logout failed', error);
      throw new Error('Logout failed. Please try again.');
    }
  };

  const refreshToken = async () => {
    try {
      const newAccessToken = await api.refreshToken();
      Cookies.set('accessToken', newAccessToken);
    } catch (error) {
      console.error('Refresh token failed', error);
      setUser(null);
      throw new Error('Session expired. Please login again.');
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.updatePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Password update failed', error);
      throw new Error('Password update failed. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };





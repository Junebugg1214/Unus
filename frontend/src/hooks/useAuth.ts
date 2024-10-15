import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const setSuccessMessage = useCallback((message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000); // Clear the success message after 5 seconds
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      const accessToken = Cookies.get('accessToken');
      if (accessToken) {
        try {
          const response = await api.get('/validate-token');
          if (isMounted) setUser(response.data.user);
        } catch (error) {
          if (isMounted) {
            setError('Session expired. Please login again.');
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
          }
        }
      }
      if (isMounted) setLoading(false);
    };
    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.login(username, password);
      const { access_token, refresh_token, user } = response.data;
      Cookies.set('accessToken', access_token, { expires: 1, secure: true, sameSite: 'strict' });
      Cookies.set('refreshToken', refresh_token, { expires: 7, secure: true, sameSite: 'strict' });
      setUser(user);
      setSuccessMessage('Logged in successfully');
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setSuccessMessage]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await api.logout();
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setSuccessMessage('Logged out successfully');
    } catch (error) {
      setError('Logout failed. Please try again.');
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  }, [setSuccessMessage]);

  const refreshToken = useCallback(async () => {
    try {
      const refresh_token = Cookies.get('refreshToken');
      if (refresh_token) {
        const response = await api.refreshToken(refresh_token);
        const { access_token } = response.data;
        Cookies.set('accessToken', access_token, { expires: 1, secure: true, sameSite: 'strict' });
      } else {
        throw new Error('No refresh token available');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setError('Session expired. Please login again.');
    }
  }, []);

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await api.updatePassword(currentPassword, newPassword);
      setSuccessMessage('Password updated successfully.');
    } catch (error) {
      setError('Password update failed. Please try again.');
      console.error('Password update failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setSuccessMessage]);

  return {
    user,
    loading,
    error,
    success,
    login,
    logout,
    updatePassword,
    refreshToken
  };
}

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

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = Cookies.get('accessToken');
      if (accessToken) {
        try {
          const response = await api.get('/validate-token');
          setUser(response.data.user);
        } catch (error) {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
        }
      }
      setLoading(false);
    };
    initAuth();
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
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await api.logout();
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    } catch (error) {
      setError('Logout failed. Please try again.');
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await api.updatePassword(currentPassword, newPassword);
    } catch (error) {
      setError('Password update failed. Please try again.');
      console.error('Password update failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    updatePassword
  };
}
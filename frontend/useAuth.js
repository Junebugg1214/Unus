import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import api from '../lib/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      // Validate token and set user
      api.get('/validate-token')
        .then(response => setUser(response.data.user))
        .catch(() => {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.login(username, password);
      const { access_token, refresh_token } = response.data;
      Cookies.set('accessToken', access_token, { expires: 1 });
      Cookies.set('refreshToken', refresh_token, { expires: 7 });
      setUser(username);
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

  // ... rest of the hook (updatePassword, etc.)

  return { user, loading, error, login, logout, updatePassword };
};

import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import api from '../lib/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showAlert = useCallback((message) => {
    // Assuming 'showAlert' is a function to show alerts to the user
    alert(message); // Replace this with your own alert system
  }, []);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      // Validate token and set user
      api.get('/validate-token')
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          showAlert('Session expired. Please login again.'); // Example usage
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [showAlert]);

  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.login(username, password);
      const { access_token, refresh_token } = response.data;

      Cookies.set('accessToken', access_token, { expires: 1 });
      Cookies.set('refreshToken', refresh_token, { expires: 7 });
      setUser(username);
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      showAlert('Login failed. Please try again.'); // Example usage
      console.error('Login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await api.logout();
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    } catch (err) {
      setError('Logout failed. Please try again.');
      showAlert('Logout failed. Please try again.'); // Example usage
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const updatePassword = useCallback(async (newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await api.updatePassword(newPassword);
      showAlert('Password updated successfully!'); // Example usage
    } catch (err) {
      setError('Password update failed. Please try again.');
      showAlert('Password update failed. Please try again.'); // Example usage
      console.error('Password update failed:', err);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  return { user, loading, error, login, logout, updatePassword };
};


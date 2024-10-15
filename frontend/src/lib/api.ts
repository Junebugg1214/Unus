import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT, 10) || 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function for setting tokens in cookies
const setAccessToken = (accessToken) => {
  Cookies.set('accessToken', accessToken, {
    expires: parseInt(process.env.REACT_APP_TOKEN_EXPIRY_DAYS, 10) || 1,
    secure: true,
    sameSite: 'strict',
  });
};

// Request interceptor to add token to request headers
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token function to keep API logic modular
const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await api.post('/refresh-token', { refreshToken });
  const { accessToken } = response.data;
  setAccessToken(accessToken);
  return accessToken;
};

// Response interceptor for handling errors and refreshing token when needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors and other issues
    if (error.message === 'Network Error') {
      alert('Network error. Please check your connection and try again.');
    } else if (error.response?.status >= 500) {
      alert('Server error. Please try again later.');
    } else {
      alert('An unexpected error occurred. Please try again.');
    }

    if (process.env.REACT_APP_ENV !== 'production') {
      console.error('API Error:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const login = (username, password) => api.post('/login', { username, password });
export const logout = () => api.post('/logout');
export const refreshToken = (refreshToken) => api.post('/refresh-token', { refreshToken });
export const getClonedRepos = () => api.get('/cloned-repos');
export const cloneRepository = (repoUrl) => api.post('/clone', { repoUrl });
export const runInference = (repoName, inputText, inputFile) => {
  const formData = new FormData();
  formData.append('repoName', repoName);
  formData.append('inputText', inputText);
  if (inputFile) formData.append('inputFile', inputFile);
  return api.post('/run-inference', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;

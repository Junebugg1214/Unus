import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT, 10) || 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        const response = await api.post('/refresh-token', { refreshToken });
        const { accessToken } = response.data;
        Cookies.set('accessToken', accessToken, { 
          expires: parseInt(process.env.REACT_APP_TOKEN_EXPIRY_DAYS, 10) || 1, 
          secure: true, 
          sameSite: 'strict' 
        });
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
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
    // Handle other errors
    if (process.env.REACT_APP_ENV !== 'production') {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

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
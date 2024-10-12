import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        const response = await api.post('/refresh-token', { refreshToken });
        const { token } = response.data;
        Cookies.set('token', token);
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = (username, password) => api.post('/login', { username, password });
export const logout = () => api.post('/logout');
export const updatePassword = (currentPassword, newPassword) => api.post('/update-password', { currentPassword, newPassword });
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

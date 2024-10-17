import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Define a custom User interface
export interface User {
  id: string;
  username: string;
  email: string;
  // other user properties if needed
}

// Define a custom API interface extending AxiosInstance
interface CustomApiInstance extends AxiosInstance {
  runInference: (formData: FormData) => Promise<{ taskId: string }>;
  getTaskStatus: (taskId: string) => Promise<{ state: string; result?: string }>;
  login: (username: string, password: string) => Promise<{ user: User }>;
  register: (username: string, email: string, password: string) => Promise<{ user: User }>;
}

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '5000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomApiInstance;

// Utility function for setting tokens in cookies
const setAccessToken = (accessToken: string): void => {
  Cookies.set('accessToken', accessToken, {
    expires: parseInt(process.env.REACT_APP_TOKEN_EXPIRY_DAYS || '1', 10),
    secure: true,
    sameSite: 'strict',
  });
};

// Request interceptor to add token to request headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Refresh token function to keep API logic modular
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await api.post<{ accessToken: string }>('/refresh-token', { refreshToken });
  const { accessToken } = response.data;
  setAccessToken(accessToken);
  return accessToken;
};

// Response interceptor for handling errors and refreshing token when needed
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: any) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
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

    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

// Add custom methods to the API instance
api.runInference = async (formData: FormData) => {
  const response = await api.post<{ taskId: string }>('/run-inference', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

api.getTaskStatus = async (taskId: string) => {
  const response = await api.get<{ state: string; result?: string }>(`/inference/status/${taskId}`);
  return response.data;
};

// Add login method to the API instance
api.login = async (username: string, password: string) => {
  const { data } = await api.post<{ user: User }>('/login', { username, password });
  return data;
};

// Add register method to the API instance
api.register = async (username: string, email: string, password: string) => {
  const { data } = await api.post<{ user: User }>('/register', { username, email, password });
  return data;
};

export default api;





import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Type declaration for js-cookie
declare module 'js-cookie' {
  interface CookiesStatic {
    set(name: string, value: string, options?: Cookies.CookieAttributes): void;
    get(name: string): string | undefined;
    remove(name: string, options?: Cookies.CookieAttributes): void;
  }
  const Cookies: CookiesStatic;
  export default Cookies;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '5000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// API endpoints
interface LoginResponse {
  user: any;
  accessToken: string;
}

export const login = (username: string, password: string) => 
  api.post<LoginResponse>('/login', { username, password });

export const logout = () => api.post('/logout');

export const refreshToken = (refreshToken: string) => 
  api.post<{ accessToken: string }>('/refresh-token', { refreshToken });

export const getClonedRepos = () => api.get<string[]>('/cloned-repos');

export const cloneRepository = (repoUrl: string) => api.post<void>('/clone', { repoUrl });

export const runInference = (repoName: string, inputText: string, inputFile?: File) => {
  const formData = new FormData();
  formData.append('repoName', repoName);
  formData.append('inputText', inputText);
  if (inputFile) formData.append('inputFile', inputFile);
  return api.post<any>('/run-inference', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
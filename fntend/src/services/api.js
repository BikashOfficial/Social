import axios from 'axios';
import { logAuth, getTokenInfo } from '../utils/debug';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    const tokenInfo = getTokenInfo();
    
    // If token exists, add it to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      logAuth(`Request to ${config.url}`, { 
        url: config.url,
        method: config.method,
        tokenInfo
      });
    } else {
      logAuth(`Request without token to ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    logAuth('Request error', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    logAuth(`Response from ${response.config.url}`, { 
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method
    });
    return response;
  },
  (error) => {
    // Handle 401 errors globally
    if (error.response && error.response.status === 401) {
      logAuth(`Auth error (401) from ${error.config.url}`, {
        tokenInfo: getTokenInfo(),
        error: error.response.data
      });
      
      // If you want to automatically handle auth errors:
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    } else {
      logAuth(`Error from ${error.config?.url || 'unknown'}`, {
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

export default api; 
import axios from 'axios';
import { logAuth, getTokenInfo, dumpAuthDebugInfo } from '../utils/debug';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Track retries to prevent infinite loops
const requestsInProgress = new Map();

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    const tokenInfo = getTokenInfo();
    
    // Set origin header to help with CORS debugging
    config.headers['Origin'] = window.location.origin;
    
    // Always include credentials
    config.withCredentials = true;
    
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

    // Create a unique request ID for tracking
    const requestId = `${config.method}:${config.url}:${Date.now()}`;
    if (!config.metadata) {
      config.metadata = { requestId, retryCount: 0 };
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
    const requestId = response.config.metadata?.requestId;
    if (requestId) {
      requestsInProgress.delete(requestId);
    }
    
    logAuth(`Response from ${response.config.url}`, { 
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method
    });
    return response;
  },
  async (error) => {
    // Get request metadata
    const config = error.config || {};
    const requestId = config.metadata?.requestId;
    const retryCount = config.metadata?.retryCount || 0;
    
    // Handle 401 errors globally
    if (error.response && error.response.status === 401) {
      logAuth(`Auth error (401) from ${config.url}`, {
        tokenInfo: getTokenInfo(),
        error: error.response.data,
        retryCount
      });
      
      // Attempt to retry the request if we haven't tried too many times already
      if (retryCount < 2 && config) {
        // Increment retry count
        config.metadata = { ...config.metadata, retryCount: retryCount + 1 };
        
        // Wait a moment to make sure we're not hammering the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if token exists
        const token = localStorage.getItem('token');
        if (token) {
          logAuth(`Retrying request to ${config.url} after 401 error`, { retryCount: retryCount + 1 });
          
          // Ensure token is in headers for retry
          config.headers['Authorization'] = `Bearer ${token}`;
          
          // Force credentials on retry
          config.withCredentials = true;
          
          return api(config);
        }
      } else {
        // If we've retried already or have no config, log the auth state
        dumpAuthDebugInfo();
      }
    } else {
      logAuth(`Error from ${config?.url || 'unknown'}`, {
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    // Clean up the request tracking
    if (requestId) {
      requestsInProgress.delete(requestId);
    }
    
    return Promise.reject(error);
  }
);

export default api; 
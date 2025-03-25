import api from '../services/api';
import { logAuth, dumpAuthDebugInfo } from './debug';

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get the current token
 * @returns {string|null} The token or null if not authenticated
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check authentication status and refresh if needed
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const checkAuthentication = async () => {
  const token = getToken();
  if (!token) {
    logAuth('No token found');
    return false;
  }

  try {
    logAuth('Checking authentication status');
    await api.get('/user/profile');
    logAuth('Authentication confirmed');
    return true;
  } catch (error) {
    logAuth('Authentication check failed', { error: error.response?.data });
    dumpAuthDebugInfo();
    
    // If we got a 401, the token is invalid
    if (error.response && error.response.status === 401) {
      return false;
    }
    
    // For other errors (network, etc.), assume we're still authenticated
    return true;
  }
};

/**
 * Force refresh authentication
 * This will make a request to verify the current token
 * @returns {Promise<boolean>} True if authentication is refreshed, false otherwise
 */
export const refreshAuthentication = async () => {
  try {
    logAuth('Forcing authentication refresh');
    await api.get('/user/profile');
    logAuth('Authentication refreshed successfully');
    return true;
  } catch (error) {
    logAuth('Authentication refresh failed', { error: error.response?.data });
    return false;
  }
}; 
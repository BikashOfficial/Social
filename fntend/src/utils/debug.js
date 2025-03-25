/**
 * Debug utility for authentication issues
 */

// Flag to enable/disable debug logging
const DEBUG_ENABLED = true;

/**
 * Log authentication-related information
 * @param {string} message - Message to log
 * @param {any} data - Data to log (optional)
 */
export const logAuth = (message, data = null) => {
  if (!DEBUG_ENABLED) return;
  
  const timestamp = new Date().toISOString();
  console.log(`[AUTH ${timestamp}] ${message}`);
  
  if (data) {
    console.log('Data:', data);
  }
};

/**
 * Get token information for debugging
 * @returns {Object} Token information
 */
export const getTokenInfo = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return { exists: false };
  }
  
  try {
    // Split the JWT token to get the payload
    const payload = token.split('.')[1];
    // Decode the base64 payload
    const decodedPayload = JSON.parse(atob(payload));
    
    // Calculate expiration time in minutes
    const expiresIn = decodedPayload.exp ? 
      Math.floor((decodedPayload.exp * 1000 - Date.now()) / 60000) :
      'unknown';
    
    return {
      exists: true,
      issuedAt: new Date(decodedPayload.iat * 1000).toISOString(),
      expiresAt: decodedPayload.exp ? new Date(decodedPayload.exp * 1000).toISOString() : 'unknown',
      expiresInMinutes: expiresIn,
      userId: decodedPayload._id,
      previewToken: `${token.substring(0, 15)}...${token.substring(token.length - 10)}`
    };
  } catch (error) {
    return {
      exists: true,
      error: 'Failed to decode token',
      previewToken: `${token.substring(0, 15)}...${token.substring(token.length - 10)}`
    };
  }
};

/**
 * Log all authentication information
 */
export const dumpAuthDebugInfo = () => {
  const tokenInfo = getTokenInfo();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  logAuth('=== AUTH DEBUG INFO ===');
  logAuth('Token:', tokenInfo);
  logAuth('User:', user);
  logAuth('API URL:', import.meta.env.VITE_BASE_URL);
  logAuth('Environment:', import.meta.env.MODE);
  logAuth('========================');
}; 
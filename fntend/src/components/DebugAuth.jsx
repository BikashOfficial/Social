import React, { useState, useEffect } from 'react';
import { getTokenInfo } from '../utils/debug';

/**
 * A debug component to display authentication status
 * Only visible in development mode
 */
const DebugAuth = () => {
  const [tokenInfo, setTokenInfo] = useState(getTokenInfo());
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [apiErrors, setApiErrors] = useState([]);

  // Update token info every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenInfo(getTokenInfo());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Track API errors from console
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if this is an API error
      if (args[0] && typeof args[0] === 'string' && 
          (args[0].includes('API Error') || args[0].includes('Error from') || 
           args[0].includes('Auth error'))) {
        setApiErrors(prev => {
          const newErrors = [...prev, {
            message: args[0],
            timestamp: new Date().toISOString(),
            details: args[1] || {}
          }];
          // Keep only last 5 errors
          return newErrors.slice(-5);
        });
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  if (import.meta.env.PROD && !window.location.search.includes('debug=true')) {
    return null;
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <button 
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg z-50 w-10 h-10 flex items-center justify-center"
      >
        {isVisible ? 'X' : '🔒'}
      </button>
      
      {isVisible && (
        <div className="fixed bottom-16 right-4 bg-black/90 text-white p-3 rounded shadow-lg z-50 max-w-xs text-xs font-mono">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Auth Debug</h3>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="bg-gray-700 px-2 rounded"
            >
              {expanded ? 'Less' : 'More'}
            </button>
          </div>
          
          <div className="mb-1">
            <span className="font-bold mr-1">Status:</span>
            <span className={tokenInfo.exists ? 'text-green-400' : 'text-red-400'}>
              {tokenInfo.exists ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
          
          {tokenInfo.exists && (
            <>
              <div className="mb-1">
                <span className="font-bold mr-1">Expires:</span>
                <span className={tokenInfo.expiresInMinutes > 10 ? 'text-green-400' : 'text-red-400'}>
                  {typeof tokenInfo.expiresInMinutes === 'number' 
                    ? `${tokenInfo.expiresInMinutes} min` 
                    : tokenInfo.expiresInMinutes}
                </span>
              </div>
              
              {expanded && (
                <>
                  <div className="mb-1 overflow-hidden text-ellipsis">
                    <span className="font-bold mr-1">Token:</span>
                    <span className="text-gray-400">{tokenInfo.previewToken}</span>
                  </div>
                  
                  <div className="mb-1">
                    <span className="font-bold mr-1">User ID:</span>
                    <span className="text-gray-400">{tokenInfo.userId || 'Unknown'}</span>
                  </div>
                  
                  <div className="mb-1">
                    <span className="font-bold mr-1">Issued:</span>
                    <span className="text-gray-400">{tokenInfo.issuedAt}</span>
                  </div>
                  
                  <div className="mb-1">
                    <span className="font-bold mr-1">Expires:</span>
                    <span className="text-gray-400">{tokenInfo.expiresAt}</span>
                  </div>
                  
                  <div className="mb-1">
                    <span className="font-bold mr-1">API URL:</span>
                    <span className="text-gray-400">{import.meta.env.VITE_BASE_URL}</span>
                  </div>
                  
                  {apiErrors.length > 0 && (
                    <div className="mt-2 border-t border-gray-700 pt-2">
                      <div className="font-bold mb-1">Recent API Errors:</div>
                      {apiErrors.map((error, idx) => (
                        <div key={idx} className="text-red-400 text-xs mb-1 overflow-hidden text-ellipsis">
                          {error.message.substring(0, 40)}...
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
          
          <div className="mt-2 flex justify-between">
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setTokenInfo(getTokenInfo());
              }}
              className="bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              Clear Auth
            </button>
            
            <button 
              onClick={() => {
                setTokenInfo(getTokenInfo());
              }}
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DebugAuth; 
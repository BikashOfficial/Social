// import React, { useContext } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { UserDataContext } from "../context/UserContext";

// const ProtectedRoute = () => {
//   const { user } = useContext(UserDataContext);
//   // Assume a user is logged in if their email exists
//   return user && user.email ? <Outlet /> : <Navigate to="/start" replace />;
// };

// export default ProtectedRoute;

import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { UserDataContext } from "./UserContext";
import { checkAuthentication, refreshAuthentication } from "../utils/auth";
import { dumpAuthDebugInfo, logAuth } from "../utils/debug";

// Set this to a reasonable time (in minutes) to avoid frequent re-verifications
const VERIFICATION_WINDOW = 30; // minutes

const ProtectedRoute = () => {
  const { user, logout } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Dump all auth information when the protected route is loaded
    dumpAuthDebugInfo();
    
    const verifyAuth = async () => {
      setIsVerifying(true);
      
      // Check if recently verified to avoid unnecessary verification
      const lastVerified = sessionStorage.getItem('auth_verified_at');
      const currentTime = new Date().getTime();
      
      if (lastVerified) {
        const elapsed = (currentTime - parseInt(lastVerified)) / (60 * 1000); // minutes
        if (elapsed < VERIFICATION_WINDOW) {
          logAuth(`Skipping verification - last verified ${elapsed.toFixed(1)} minutes ago`);
          setIsVerifying(false);
          return;
        }
      }
      
      try {
        // First, check authentication
        const isAuth = await checkAuthentication();
        
        if (!isAuth) {
          // If not authenticated, try one more time with refresh
          logAuth('Initial authentication check failed, attempting refresh');
          const isRefreshed = await refreshAuthentication();
          
          if (!isRefreshed) {
            logAuth('Authentication refresh failed, logging out');
            logout();
            sessionStorage.removeItem('auth_verified_at');
            navigate('/start');
            return;
          }
        }
        
        // Save successful verification timestamp
        sessionStorage.setItem('auth_verified_at', currentTime.toString());
        logAuth('Authentication verified successfully');
      } catch (error) {
        logAuth('Authentication verification error', error);
        logout();
        sessionStorage.removeItem('auth_verified_at');
        navigate('/start');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [navigate, logout]);

  if (isVerifying) {
    // Show loading while verifying authentication
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying login...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.email) {
    logAuth('User not authenticated', { user });
    return <Navigate to="/start" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
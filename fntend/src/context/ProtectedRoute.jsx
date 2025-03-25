// import React, { useContext } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { UserDataContext } from "../context/UserContext";

// const ProtectedRoute = () => {
//   const { user } = useContext(UserDataContext);
//   // Assume a user is logged in if their email exists
//   return user && user.email ? <Outlet /> : <Navigate to="/start" replace />;
// };

// export default ProtectedRoute;

import React, { useContext, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { UserDataContext } from "./UserContext";
import api from "../services/api";
import { dumpAuthDebugInfo, logAuth } from "../utils/debug";

const ProtectedRoute = () => {
  const { user, logout } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Dump all auth information when the protected route is loaded
    dumpAuthDebugInfo();
    
    const checkAuth = async () => {
      try {
        logAuth('Checking authentication status');
        await api.get('/user/profile');
        logAuth('Authentication check successful');
      } catch (error) {
        logAuth('Authentication check failed', error.response?.data);
        logout();
        navigate('/start');
      }
    };

    checkAuth();
  }, [navigate, logout]);

  if (!user || !user.email) {
    logAuth('User not authenticated', { user });
    return <Navigate to="/start" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
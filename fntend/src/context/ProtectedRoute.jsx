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

const ProtectedRoute = () => {
  const { user, logout } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth with token:', localStorage.getItem('token'));
        await api.get('/user/profile');
        console.log('Auth check successful');
      } catch (error) {
        console.error('Auth check failed:', error.response?.data);
        logout();
        navigate('/start');
      }
    };

    checkAuth();
  }, [navigate, logout]);

  if (!user || !user.email) {
    return <Navigate to="/start" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
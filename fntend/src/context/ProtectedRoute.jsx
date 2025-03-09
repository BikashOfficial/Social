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
import axios from "axios";

const ProtectedRoute = () => {
  const { user, logout } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (error) {
        if (error.response?.data?.redirect) {
          logout();
          navigate('/start');
        }
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
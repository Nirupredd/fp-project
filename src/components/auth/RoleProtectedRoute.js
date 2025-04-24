import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  // Check if user is logged in
  const userInfoString = localStorage.getItem('userInfo');
  const location = useLocation();

  if (!userInfoString) {
    // If not logged in, redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Parse user info
  const userInfo = JSON.parse(userInfoString);
  
  // Check if user role is allowed
  if (!allowedRoles.includes(userInfo.role)) {
    // If role is not allowed, redirect to home page
    return <Navigate to="/" replace />;
  }

  // If logged in and role is allowed, render the protected component
  return children;
};

export default RoleProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in
  const userInfo = localStorage.getItem('userInfo');
  const location = useLocation();

  if (!userInfo) {
    // If not logged in, redirect to login page with the current location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If logged in, render the protected component
  return children;
};

export default ProtectedRoute;

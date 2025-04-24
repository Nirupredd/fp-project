import React, { useState, useEffect } from 'react';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';
import { Outlet, useLocation } from 'react-router-dom';

function RootLayout() {
  const [authState, setAuthState] = useState(localStorage.getItem('userInfo'));
  const location = useLocation();

  // Update auth state when localStorage changes or location changes
  useEffect(() => {
    const checkAuthState = () => {
      const currentAuthState = localStorage.getItem('userInfo');
      setAuthState(currentAuthState);
    };

    // Check auth state initially and when location changes
    checkAuthState();

    // Add event listeners for storage changes and custom auth events
    window.addEventListener('storage', checkAuthState);
    window.addEventListener('userLogin', checkAuthState);
    window.addEventListener('userLogout', checkAuthState);

    return () => {
      window.removeEventListener('storage', checkAuthState);
      window.removeEventListener('userLogin', checkAuthState);
      window.removeEventListener('userLogout', checkAuthState);
    };
  }, [location]);

  return (
    <div className="app-container">
      <Navbar key={authState ? 'authenticated' : 'unauthenticated'} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
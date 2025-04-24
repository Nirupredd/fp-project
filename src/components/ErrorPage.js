import React, { useContext } from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import './ErrorBoundary.css';

function ErrorPage() {
  const error = useRouteError();
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`error-boundary-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="error-boundary-content">
        <h2>Oops! Something went wrong</h2>
        <p>We're sorry, but there was an error loading this page.</p>
        
        {error && (
          <div className="alert alert-danger mt-3">
            {error.statusText || error.message}
          </div>
        )}
        
        <div className="mt-4">
          <Link to="/" className="btn btn-primary me-2">
            Go to Home Page
          </Link>
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;

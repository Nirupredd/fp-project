import React from 'react';
import './LoadingSpinner.css';

/**
 * A responsive loading spinner component
 * 
 * @param {Object} props
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 * @param {string} props.text - Optional loading text
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactNode}
 */
const LoadingSpinner = ({ size = 'md', text, className = '' }) => {
  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`loading-spinner loading-spinner-${size}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

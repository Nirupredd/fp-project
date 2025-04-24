import React, { useState, useEffect } from 'react';

/**
 * A component that renders different content based on screen size
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.mobile - Content to show on mobile screens (< 576px)
 * @param {React.ReactNode} props.tablet - Content to show on tablet screens (576px - 991px)
 * @param {React.ReactNode} props.desktop - Content to show on desktop screens (≥ 992px)
 * @param {React.ReactNode} props.fallback - Fallback content to show while measuring screen
 * @returns {React.ReactNode}
 */
const ResponsiveWrapper = ({ mobile, tablet, desktop, fallback = null }) => {
  // Define breakpoints
  const MOBILE_BREAKPOINT = 576;
  const TABLET_BREAKPOINT = 992;
  
  // State to track current screen size
  const [screenSize, setScreenSize] = useState(null);
  
  // Effect to measure and update screen size
  useEffect(() => {
    // Function to update screen size
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setScreenSize('mobile');
      } else if (width < TABLET_BREAKPOINT) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    // Initial measurement
    updateScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', updateScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);
  
  // Render appropriate content based on screen size
  if (screenSize === 'mobile') {
    return mobile || tablet || desktop || fallback;
  } else if (screenSize === 'tablet') {
    return tablet || desktop || mobile || fallback;
  } else if (screenSize === 'desktop') {
    return desktop || tablet || mobile || fallback;
  }
  
  // Return fallback while measuring
  return fallback;
};

export default ResponsiveWrapper;

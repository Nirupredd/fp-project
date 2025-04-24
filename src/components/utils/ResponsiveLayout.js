import React from 'react';
import './responsive.css';

/**
 * A responsive layout component that provides consistent page structure
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to render
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Optional page subtitle
 * @param {boolean} props.fluid - Whether to use a fluid container (full width)
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.headerContent - Optional additional content for the header
 * @param {React.ReactNode} props.footerContent - Optional footer content
 * @returns {React.ReactNode}
 */
const ResponsiveLayout = ({
  children,
  title,
  subtitle,
  fluid = false,
  className = '',
  headerContent,
  footerContent
}) => {
  return (
    <div className={`responsive-layout ${className}`}>
      <div className={fluid ? 'container-fluid' : 'container'}>
        {(title || subtitle || headerContent) && (
          <header className="responsive-layout-header responsive-padding">
            {title && <h1 className="responsive-title">{title}</h1>}
            {subtitle && <p className="responsive-subtitle">{subtitle}</p>}
            {headerContent}
          </header>
        )}
        
        <main className="responsive-layout-content responsive-padding">
          {children}
        </main>
        
        {footerContent && (
          <footer className="responsive-layout-footer responsive-padding">
            {footerContent}
          </footer>
        )}
      </div>
    </div>
  );
};

export default ResponsiveLayout;

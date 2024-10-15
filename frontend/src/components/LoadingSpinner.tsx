import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  colorScheme?: 'light' | 'dark' | 'custom';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  colorScheme = 'dark',
  className = ''
}) => {
  const sizeClass = `spinner-${size}`;
  const colorClass = `spinner-${colorScheme}`;

  return (
    <div className={`loading-spinner ${className}`} aria-hidden="true">
      <div className={`spinner ${sizeClass} ${colorClass}`}></div>
    </div>
  );
};

export default LoadingSpinner;


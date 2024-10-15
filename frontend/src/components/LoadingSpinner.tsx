import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = '40px', borderSize = '4px', borderTopColor = '#000', borderColor = 'rgba(0, 0, 0, 0.1)' }) => {
  const spinnerStyle = {
    '--spinner-size': size,
    '--spinner-border-size': borderSize,
    '--spinner-border-top-color': borderTopColor,
    '--spinner-border-color': borderColor,
  };

  return (
    <div className="loading-spinner" aria-hidden="true">
      <div className="spinner" style={spinnerStyle}></div>
    </div>
  );
};

export default LoadingSpinner;


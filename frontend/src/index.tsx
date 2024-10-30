import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

import './styles/globals.css';
import './env';  // Assuming this correctly sets up window.env

// Create environment variable types
declare global {
  interface Window {
    env: {
      REACT_APP_ENV: string;
      REACT_APP_API_URL: string;
    };
  }
}

// Log environment information only in non-production
if (window.env?.REACT_APP_ENV !== 'production') {
  console.log(`Running in ${window.env.REACT_APP_ENV} environment`);
  console.log(`API URL: ${window.env.REACT_APP_API_URL}`);
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

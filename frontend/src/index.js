import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Importing a global stylesheet if any
import './env';

// Log environment information
console.log(`Running in ${process.env.REACT_APP_ENV} environment`);
console.log(`API URL: ${process.env.REACT_APP_API_URL}`);

// Error handling for runtime errors
const handleError = (error, errorInfo) => {
  console.error('Uncaught error:', error, errorInfo);
  // You can add additional error reporting logic here, e.g., sending to a monitoring service
};

// Root element ID must match the ID in your public/index.html (e.g., 'root')
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <React.ErrorBoundary fallback={<h1>Something went wrong. Please refresh the page.</h1>} onError={handleError}>
      <App />
    </React.ErrorBoundary>
  </React.StrictMode>
);

// If you're using a service worker, you can register it here
// import * as serviceWorker from './serviceWorker';
// serviceWorker.register();

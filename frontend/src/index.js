import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary'; // Ensure to use the custom ErrorBoundary
import './index.css'; // Importing a global stylesheet if needed
import './env'; // Importing environment variables

// Log environment information only in non-production
if (process.env.REACT_APP_ENV !== 'production') {
  console.log(`Running in ${process.env.REACT_APP_ENV} environment`);
  console.log(`API URL: ${process.env.REACT_APP_API_URL}`);
}

// Root element ID must match the ID in your public/index.html (e.g., 'root')
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Optional: If you're using a service worker, you can register it here
// import * as serviceWorker from './serviceWorker';
// serviceWorker.register();


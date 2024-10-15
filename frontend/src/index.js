import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css'; // Update this line to import the new CSS file
import './env';

// Log environment information only in non-production
if (process.env.REACT_APP_ENV !== 'production') {
  console.log(`Running in ${process.env.REACT_APP_ENV} environment`);
  console.log(`API URL: ${process.env.REACT_APP_API_URL}`);
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);


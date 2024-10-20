import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';
import './env';

// Log environment information only in non-production
if (process.env['REACT_APP_ENV'] !== 'production') {
  // eslint-disable-next-line no-console
  console.log(`Running in ${process.env['REACT_APP_ENV']} environment`);
  // eslint-disable-next-line no-console
  console.log(`API URL: ${process.env['REACT_APP_API_URL']}`);
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);




import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Importing a global stylesheet if any

// Root element ID must match the ID in your public/index.html (e.g., 'root')
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

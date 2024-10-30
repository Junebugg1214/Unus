import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import UnusApp from './components/UnusApp';
import { Button } from '@/components/ui/button';
import './styles/globals.css';

// Define the User interface
interface User {
  username: string;
  email: string;
}

const App: React.FC = () => {
  // Add user state
  const [user, setUser] = useState<User | null>({
    username: 'JohnDoe',
    email: 'john.doe@example.com'
  });

  // Error handling function to log errors
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Error caught:', error, errorInfo);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main App Error Boundary */}
      <ErrorBoundary logError={handleError}>
        <BrowserRouter>
          <UnusApp user={user} />
        </BrowserRouter>
      </ErrorBoundary>

      {/* Optional: Additional Error Boundaries for specific features */}
      <ErrorBoundary logError={handleError}>
        <div className="container mx-auto px-4 py-8">
          {/* Additional components can be added here */}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default App;

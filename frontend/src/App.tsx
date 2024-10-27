import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import UnusApp from './components/UnusApp';
import { Button } from '@/components/ui/button';

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

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Error caught:', error, errorInfo);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main App Error Boundary */}
      <ErrorBoundary logError={handleError}>
        <UnusApp user={user} />
      </ErrorBoundary>

      {/* Optional: Additional Error Boundaries for specific features */}
      <ErrorBoundary logError={handleError}>
        <div className="container mx-auto px-4 py-8">
          {/* Your additional components here */}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default App;





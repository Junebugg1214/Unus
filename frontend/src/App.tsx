import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import UserDashboard from './components/UserDashboard';  // Corrected import
import NotificationsPanel from './components/NotificationsPanel';  // Corrected import

// Define the User interface
interface User {
  username: string;
  email: string;
}

// Properly type `user` to ensure TypeScript can infer its properties
const user: User | null = {
  username: 'JohnDoe',
  email: 'john.doe@example.com',
};

function App() {
  return (
    <div>
      {/* Error boundary for the Account Settings area */}
      <ErrorBoundary>
        {user ? (
          <div>
            <h1>Account Settings for {user.username}</h1>
            {/* Add your AccountSettings component here */}
          </div>
        ) : (
          <div>User not found. Please login.</div>
        )}
      </ErrorBoundary>

      {/* Error boundary for the User Dashboard */}
      <ErrorBoundary>
        <UserDashboard />
      </ErrorBoundary>

      {/* Error boundary for the Notifications Panel */}
      <ErrorBoundary>
        <NotificationsPanel />
      </ErrorBoundary>
    </div>
  );
}

export default App;






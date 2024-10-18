import React, { FC, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import AccountSettings from '@/components/AccountSettings';
import ErrorBoundary from '@/components/ErrorBoundary';
// Remove the import for AppContent if it doesn't exist
// import AppContent from '@/components/AppContent';

// Create a simple Dashboard component as a placeholder
const Dashboard: FC = () => <div>Dashboard Content</div>;

const App: FC = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </AuthProvider>
  );
};

const AppRouter: FC = () => {
  const { user, login, logout, register, updatePassword } = useAuth();

  if (!user) {
    return (
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route 
              path="/login" 
              element={
                <LoginForm 
                  // Update the onLogin prop to match the expected function signature
                  onLogin={(username: string, password: string) => login(username, password)} 
                />
              } 
            />
            <Route 
              path="/register" 
              element={
                <RegisterForm 
                  // Add the onRegister prop
                  onRegister={(username: string, email: string, password: string) => 
                    register(username, email, password)
                  } 
                />
              } 
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Router>
    );
  }

  return (
    <Router>
      <Header onLogout={logout} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Replace AppContent with Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/account-settings"
            element={<AccountSettings onUpdatePassword={updatePassword} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
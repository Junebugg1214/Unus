import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import { Alert, AlertDescription } from './components/ui/alert';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const LoginForm = lazy(() => import('./components/LoginForm'));
const RegisterForm = lazy(() => import('./components/RegisterForm'));
const UnusApp = lazy(() => import('./components/UnusApp'));
const AccountSettings = lazy(() => import('./components/AccountSettings'));
const ExampleForm = lazy(() => import('./components/ExampleForm'));

// Higher Order Component for Protected Routes
const ProtectedRoute = ({ element, user }) => {
  return user ? element : <Navigate to="/login" />;
};

function AppContent() {
  const { user, loading, error, login, logout, updatePassword, register } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="app">
      <Header user={user} onLogout={logout} />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginForm onLogin={login} />} />
          <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterForm onRegister={register} />} />
          <Route path="/home" element={<ProtectedRoute user={user} element={<UnusApp user={user} />} />} />
          <Route path="/account" element={<ProtectedRoute user={user} element={<AccountSettings user={user} onUpdatePassword={updatePassword} />} />} />
          <Route path="/example-form" element={<ProtectedRoute user={user} element={<ExampleForm />} />} />
          <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Log environment information
console.log(`Running in ${process.env.REACT_APP_ENV} environment`);
console.log(`API URL: ${process.env.REACT_APP_API_URL}`);

export default App;

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const LoginForm = lazy(() => import('./components/LoginForm'));
const RegisterForm = lazy(() => import('./components/RegisterForm'));
const UnusApp = lazy(() => import('./components/UnusApp'));
const AccountSettings = lazy(() => import('./components/AccountSettings'));
const ExampleForm = lazy(() => import('./components/ExampleForm'));

function App() {
  const { user, loading, error, login, logout, updatePassword, register } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="app">
        <Header user={user} onLogout={logout} />
        {error && <div className="error-message">{error}</div>}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginForm onLogin={login} />} />
            <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterForm onRegister={register} />} />
            <Route path="/home" element={user ? <UnusApp user={user} /> : <Navigate to="/login" />} />
            <Route path="/account" element={user ? <AccountSettings user={user} onUpdatePassword={updatePassword} /> : <Navigate to="/login" />} />
            <Route path="/example-form" element={user ? <ExampleForm /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;

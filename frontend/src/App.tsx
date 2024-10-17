import React, { FC, useContext, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider, AuthContextValue } from '@/context/AuthProvider'; // Ensure AuthContext is properly exported
import AppContent from '@/components/AppContent'; // Ensure correct path and case
import Alert, { AlertDescription } from '@/components/Alert';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import AccountSettings from '@/components/AccountSettings';
import ErrorBoundary from '@/components/ErrorBoundary';

const App: FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is not available");
    }

    const { user, loading, error, register, updatePassword } = authContext;

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <Alert variant="danger">
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }

    return (
        <AuthProvider>
            <ErrorBoundary>
                <Router>
                    <Header onLogout={() => console.log('Logged out')} />
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            <Route path="/login" element={<LoginForm onLogin={() => console.log('Logged in')} />} />
                            <Route path="/register" element={<RegisterForm onRegister={() => register()} />} />
                            {user && (
                                <>
                                    <Route
                                        path="/account-settings"
                                        element={
                                            <AccountSettings onUpdatePassword={() => updatePassword()} />
                                        }
                                    />
                                    <Route path="/" element={<AppContent />} />
                                </>
                            )}
                            <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
                        </Routes>
                    </Suspense>
                </Router>
            </ErrorBoundary>
        </AuthProvider>
    );
};

export default App;


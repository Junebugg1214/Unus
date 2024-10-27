import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';

const HomePage = lazy(() => import('@/components/HomePage'));
const ManageReposPage = lazy(() => import('@/components/ManageReposPage'));
const InferencePage = lazy(() => import('@/components/InferencePage'));

const UnusApp = ({ user }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [clonedRepos, setClonedRepos] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'default', timeoutId: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const showAlert = useCallback((message, type = 'default', duration = 3000) => {
    if (alert.timeoutId) {
      clearTimeout(alert.timeoutId);
    }
    const timeoutId = setTimeout(() => setAlert({ show: false, message: '', type: 'default', timeoutId: null }), duration);
    setAlert({ show: true, message, type, timeoutId });
  }, [alert]);

  const fetchClonedRepos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getClonedRepos();
      setClonedRepos(response.data);
    } catch (error) {
      showAlert('Failed to fetch cloned repositories', 'destructive');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    if (user) {
      fetchClonedRepos();
    } else {
      navigate('/login');
    }
  }, [user, fetchClonedRepos, navigate]);

  const handleAsyncAction = useCallback(async (action, successMessage, failureMessage) => {
    try {
      setLoading(true);
      await action();
      showAlert(successMessage, 'default');
    } catch (error) {
      showAlert(failureMessage, 'destructive');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const handleCloneRepo = (githubUrl) => handleAsyncAction(
    () => api.cloneRepository(githubUrl),
    'Repository cloned successfully',
    'Failed to clone repository'
  );

  const handleDeleteRepo = (repoName) => handleAsyncAction(
    () => api.deleteRepo(repoName),
    'Repository deleted successfully',
    'Failed to delete repository'
  );

  const renderedContent = useMemo(() => {
    if (loading) {
      return <div>Loading...</div>;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage user={user} onCloneRepo={handleCloneRepo} />;
      case 'manage-repos':
        return <ManageReposPage repos={clonedRepos} onDeleteRepo={handleDeleteRepo} />;
      case 'inference':
        return <InferencePage repos={clonedRepos} showAlert={showAlert} />;
      default:
        return null;
    }
  }, [currentPage, user, loading, clonedRepos, handleCloneRepo, handleDeleteRepo, showAlert]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onChangePage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        <Suspense fallback={<div>Loading page...</div>}>
          {renderedContent}
        </Suspense>
      </main>
    </div>
  );
};

export default UnusApp;

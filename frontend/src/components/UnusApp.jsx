import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HomePage from '../components/HomePage';
import ManageReposPage from '../components/ManageReposPage';
import InferencePage from '../components/InferencePage';
import { Alert, AlertDescription } from './ui/alert';
import api from '../lib/api';

const UnusApp = ({ user }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [clonedRepos, setClonedRepos] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'default' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const showAlert = useCallback((message, type = 'default') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'default' }), 3000);
  }, []);

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

  const handleCloneRepo = useCallback(async (githubUrl) => {
    try {
      setLoading(true);
      await api.cloneRepository(githubUrl);
      await fetchClonedRepos();
      showAlert('Repository cloned successfully', 'default');
    } catch (error) {
      showAlert('Failed to clone repository', 'destructive');
    } finally {
      setLoading(false);
    }
  }, [fetchClonedRepos, showAlert]);

  const handleDeleteRepo = useCallback(async (repoName) => {
    try {
      setLoading(true);
      await api.deleteRepo(repoName);
      await fetchClonedRepos();
      showAlert('Repository deleted successfully', 'default');
    } catch (error) {
      showAlert('Failed to delete repository', 'destructive');
    } finally {
      setLoading(false);
    }
  }, [fetchClonedRepos, showAlert]);

  const renderContent = () => {
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
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onChangePage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default UnusApp;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../components/Header';
import HomePage from '../components/HomePage';
import ManageReposPage from '../components/ManageReposPage';
import InferencePage from '../components/InferencePage';
import { Alert, AlertDescription } from '../components/ui/alert';
import api from '../lib/api';

const UnusApp = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [clonedRepos, setClonedRepos] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'default' });
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchClonedRepos = useCallback(async () => {
    try {
      const repos = await api.getClonedRepos();
      setClonedRepos(repos);
      Cookies.set('clonedRepos', JSON.stringify(repos), { secure: true, sameSite: 'Strict' });
    } catch (error) {
      showAlert('Failed to fetch cloned repositories', 'destructive');
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      fetchClonedRepos();
    }
  }, [user, fetchClonedRepos]);

  const showAlert = useCallback((message, type = 'default') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'default' }), 3000);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await api.logout();
      setUser(null);
      Cookies.remove('user');
      Cookies.remove('clonedRepos');
      setCurrentPage('home');
      navigate('/login');
      showAlert('Logged out successfully', 'default');
    } catch (error) {
      showAlert('Failed to logout', 'destructive');
    }
  }, [navigate, showAlert]);

  const handleCloneRepo = useCallback(async (githubUrl) => {
    try {
      await api.cloneRepository(githubUrl);
      await fetchClonedRepos();
      showAlert('Repository cloned successfully', 'default');
    } catch (error) {
      showAlert('Failed to clone repository', 'destructive');
    }
  }, [showAlert, fetchClonedRepos]);

  const handleDeleteRepo = useCallback(async (repoName) => {
    try {
      await api.deleteRepo(repoName);
      await fetchClonedRepos();
      showAlert('Repository deleted successfully', 'default');
    } catch (error) {
      showAlert('Failed to delete repository', 'destructive');
    }
  }, [showAlert, fetchClonedRepos]);

  const renderContent = () => {
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
      <Header user={user} onLogout={handleLogout} onChangePage={setCurrentPage} />
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

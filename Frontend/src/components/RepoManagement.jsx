import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2 } from 'lucide-react';
import { validateRepoUrl } from '../utils/validation';
import api from '../services/api';

const RepoManagement = () => {
  const [repos, setRepos] = useState([]);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const response = await api.getRepos();
      setRepos(response.data.repos);
    } catch (err) {
      setError('Failed to fetch repositories');
    }
  };

  const handleClone = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const urlError = validateRepoUrl(newRepoUrl);
    if (urlError) {
      setError(urlError);
      return;
    }

    try {
      await api.cloneRepository(newRepoUrl);
      setSuccess('Repository cloned successfully');
      setNewRepoUrl('');
      fetchRepos();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clone repository');
    }
  };

  const handleDelete = async (repoName) => {
    setError('');
    setSuccess('');

    try {
      await api.deleteRepo(repoName);
      setSuccess('Repository deleted successfully');
      fetchRepos();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete repository');
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold">Manage Repositories</h2>
      <form onSubmit={handleClone} className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="GitHub Repository URL"
          value={newRepoUrl}
          onChange={(e) => setNewRepoUrl(e.target.value)}
          required
        />
        <Button type="submit">Clone Repository</Button>
      </form>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <ul className="space-y-2">
        {repos.map((repo) => (
          <li key={repo} className="flex justify-between items-center p-2 bg-gray-100 rounded">
            <span>{repo}</span>
            <Button variant="outline" size="sm" onClick={() => handleDelete(repo)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoManagement;

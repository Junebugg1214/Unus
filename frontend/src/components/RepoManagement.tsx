import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Trash2 } from 'lucide-react';
import { validateRepoUrl } from '../utils/validation';
import api from '../services/api';

const RepoManagement = () => {
  const [repos, setRepos] = useState([]);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    setFetching(true);
    setError('');
    try {
      const response = await api.getRepos();
      setRepos(response.data.repos);
    } catch (err) {
      setError('Failed to fetch repositories');
    } finally {
      setFetching(false);
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

    setLoading(true);
    try {
      await api.cloneRepository(newRepoUrl);
      setSuccess('Repository cloned successfully');
      setNewRepoUrl('');
      fetchRepos();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clone repository');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000); // Clear messages after 5 seconds
    }
  };

  const handleDelete = async (repoName) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.deleteRepo(repoName);
      setSuccess('Repository deleted successfully');
      fetchRepos();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete repository');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000); // Clear messages after 5 seconds
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
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Cloning...' : 'Clone Repository'}
        </Button>
      </form>
      {error && (
        <Alert variant="destructive" aria-live="assertive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success" aria-live="polite">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {fetching ? (
        <p>Loading repositories...</p>
      ) : (
        <ul className="space-y-2">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <li key={repo} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span>{repo}</span>
                <Button variant="outline" size="sm" onClick={() => handleDelete(repo)} disabled={loading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))
          ) : (
            <p>No repositories cloned yet.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default RepoManagement;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2 } from 'lucide-react';
import { validateRepoUrl } from '@/utils/validation';
import axios from '@/lib/api';

// Define the API methods
const api = {
  getRepos: () => axios.get('/repos'),
  cloneRepository: (url: string) => axios.post('/clone', { repo_url: url }),
  deleteRepo: (name: string) => axios.post('/delete_repo', { repo_name: name }),
};

const RepoManagement: React.FC = () => {
  const [repos, setRepos] = useState<string[]>([]);
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

  const handleClone = async (e: React.FormEvent<HTMLFormElement>) => {
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
      setError(err instanceof Error ? err.message : 'Failed to clone repository');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000); // Clear messages after 5 seconds
    }
  };

  const handleDelete = async (repoName: string) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.deleteRepo(repoName);
      setSuccess('Repository deleted successfully');
      fetchRepos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete repository');
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
          placeholder="GitHub Repository URL"
          value={newRepoUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRepoUrl(e.target.value)}
          required
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Cloning...' : 'Clone Repository'}
        </Button>
      </form>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(repo)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))
          ) : (
            <li className="p-2">No repositories cloned yet.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default RepoManagement;
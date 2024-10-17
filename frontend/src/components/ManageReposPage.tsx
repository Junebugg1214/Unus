import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; // Adjusted path for common alias usage
import { Button } from '@/components/ui/button'; // Adjusted path for common alias usage
import { Alert, AlertDescription } from '@/components/ui/alert'; // Adding alerts to provide feedback to users

interface Repo {
  name: string;
}

interface ManageReposPageProps {
  repos: Repo[];
  onDeleteRepo: (repoName: string) => Promise<void>;
}

const ManageReposPage: React.FC<ManageReposPageProps> = ({ repos, onDeleteRepo }) => {
  const [loadingRepo, setLoadingRepo] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ show: boolean; message: string; type: 'default' | 'success' | 'destructive' }>({
    show: false,
    message: '',
    type: 'default',
  });

  const handleDeleteRepo = async (repoName: string) => {
    setLoadingRepo(repoName);
    try {
      await onDeleteRepo(repoName);
      setAlert({
        show: true,
        message: 'Repository deleted successfully.',
        type: 'success',
      });
    } catch (error) {
      setAlert({
        show: true,
        message: 'Failed to delete repository. Please try again.',
        type: 'destructive',
      });
    } finally {
      setLoadingRepo(null);
      setTimeout(() => setAlert({ show: false, message: '', type: 'default' }), 3000);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Manage Repositories</h2>
      </CardHeader>
      <CardContent>
        {alert.show && (
          <Alert variant={alert.type}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        {repos.length > 0 ? (
          <ul className="space-y-2">
            {repos.map((repo: Repo) => (
              <li
                key={repo.name}
                className="flex justify-between items-center p-2 bg-gray-100 rounded"
              >
                <span>{repo.name}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteRepo(repo.name)}
                  disabled={loadingRepo === repo.name}
                >
                  {loadingRepo === repo.name ? 'Deleting...' : 'Delete'}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No repositories cloned yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageReposPage;

import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import Button from '../ui/button';

const ManageReposPage = ({ repos, onDeleteRepo }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Manage Repositories</h2>
      </CardHeader>
      <CardContent>
        {repos.length > 0 ? (
          <ul className="space-y-2">
            {repos.map((repo) => (
              <li key={repo} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span>{repo}</span>
                <Button variant="destructive" size="sm" onClick={() => onDeleteRepo(repo)}>
                  Delete
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
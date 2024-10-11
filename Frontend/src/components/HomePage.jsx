import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import Button from '../ui/button';
import Input from '../ui/input';
import { validateRepoUrl } from '../../utils/validation';

const HomePage = ({ user, onCloneRepo }) => {
  const [githubUrl, setGithubUrl] = useState('');

  const handleClone = () => {
    const urlError = validateRepoUrl(githubUrl);
    if (urlError) {
      // You might want to add a way to show errors here, perhaps by passing a showAlert function from the parent
      return;
    }
    onCloneRepo(githubUrl);
    setGithubUrl('');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Welcome to Unus</h2>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Unus is an AI Agent Management Platform. Clone repositories, manage them, and run inferences with ease.</p>
        {user ? (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Paste Agent GitHub URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <Button onClick={handleClone}>Clone Repository</Button>
          </div>
        ) : (
          <p>Please log in or register to start using Unus.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default HomePage;
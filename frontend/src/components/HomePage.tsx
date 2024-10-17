import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; // Adjusted path to match common alias usage
import { Button } from '@/components/ui/button'; // Adjusted path to match common alias usage
import { Input } from '@/components/ui/input'; // Adjusted path to match common alias usage
import { validateRepoUrl } from '@/utils/validation'; // Adjusted path to match common alias usage

// Define types for props
interface HomePageProps {
  user?: {
    username: string;
    email: string;
  };
  onCloneRepo: (url: string) => void;
  showAlert?: (message: string, type: 'destructive' | 'default') => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, onCloneRepo, showAlert }) => {
  const [githubUrl, setGithubUrl] = useState('');

  const handleClone = () => {
    const urlError = validateRepoUrl(githubUrl);
    if (urlError) {
      if (showAlert) {
        showAlert(urlError, 'destructive');
      } else {
        console.warn("Alert function not provided: " + urlError);
      }
      return;
    }
    if (onCloneRepo) {
      onCloneRepo(githubUrl);
      setGithubUrl('');
    } else {
      console.warn("Clone handler function is not provided.");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Welcome to Unus</h2>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Unus is an AI Agent Management Platform. Clone repositories, manage them, and run inferences with ease.
        </p>
        {user ? (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Paste Agent GitHub URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <Button onClick={handleClone} disabled={!githubUrl.trim()}>
              Clone Repository
            </Button>
          </div>
        ) : (
          <p>Please log in or register to start using Unus.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default HomePage;

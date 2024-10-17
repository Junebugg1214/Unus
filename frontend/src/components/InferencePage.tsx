import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { validateInferenceText } from '@/utils/validation';
import api from '@/lib/api';

interface Repo {
  name: string;
}

interface InferencePageProps {
  repos: Repo[];
  showAlert: (message: string, type: 'default' | 'destructive' | 'success' | 'warning') => void;
}

const InferencePage: React.FC<InferencePageProps> = ({ repos, showAlert }) => {
  const [selectedRepo, setSelectedRepo] = useState('');
  const [inferenceText, setInferenceText] = useState('');
  const [inferenceFile, setInferenceFile] = useState<File | null>(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunInference = async () => {
    if (!selectedRepo) {
      showAlert('Please select a repository', 'destructive');
      return;
    }
    if (!inferenceText.trim() && !inferenceFile) {
      showAlert('Please enter text or upload a file for inference', 'destructive');
      return;
    }

    const textError = validateInferenceText(inferenceText);
    if (textError) {
      showAlert(textError, 'destructive');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('selectedRepo', selectedRepo);
      formData.append('inferenceText', inferenceText);
      if (inferenceFile) {
        formData.append('inferenceFile', inferenceFile);
      }

      const { taskId } = await api.runInference(formData);
      showAlert('Inference task started', 'default');
      await checkTaskStatus(taskId);
    } catch (error) {
      console.error("Error starting inference:", error);
      showAlert('Failed to start inference', 'destructive');
    } finally {
      setLoading(false);
    }
  };

  const checkTaskStatus = async (taskId: string) => {
    try {
      const result = await api.getTaskStatus(taskId);
      if (result.state === 'PENDING' || result.state === 'RUNNING') {
        setTimeout(() => checkTaskStatus(taskId), 2000);
      } else if (result.state === 'SUCCESS') {
        setOutput(result.result || 'No result available');
      } else {
        showAlert('Inference task failed', 'destructive');
      }
    } catch (error) {
      console.error("Error checking task status:", error);
      showAlert('Error checking task status', 'destructive');
    }
  };

  const handleRepoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRepo(e.target.value || '');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Run Inference</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <label htmlFor="repo-select" className="block text-sm font-medium text-gray-700">
            Select a repository
          </label>
          <select
            id="repo-select"
            value={selectedRepo}
            onChange={handleRepoChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a repository</option>
            {repos.map((repo) => (
              <option key={repo.name} value={repo.name}>
                {repo.name}
              </option>
            ))}
          </select>
          <Textarea
            placeholder="Enter text for inference"
            value={inferenceText}
            onChange={(e) => setInferenceText(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              onChange={(e) => setInferenceFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" size="icon">
                Upload File
              </Button>
            </label>
            <span>{inferenceFile ? inferenceFile.name : 'No file chosen'}</span>
          </div>
          <Button onClick={handleRunInference} disabled={loading}>
            {loading ? 'Running Inference...' : 'Run Inference'}
          </Button>
        </div>
      </CardContent>
      {output && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Output:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">{output}</pre>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default InferencePage;



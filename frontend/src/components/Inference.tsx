import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { validateNotEmpty, validateInference } from '@/utils/validation';
import api from '@/lib/api'; // Correct default import syntax


interface Repo {
  name: string;
}

interface InferenceProps {
  repos: Repo[];
  showAlert: (message: string, type: 'default' | 'destructive' | 'success' | 'warning') => void;
}

const Inference: React.FC<InferenceProps> = ({ repos, showAlert }) => {
  const [selectedRepo, setSelectedRepo] = useState('');
  const [inferenceText, setInferenceText] = useState('');
  const [inferenceFile, setInferenceFile] = useState<File | null>(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunInference = async () => {
    const repoError = validateNotEmpty(selectedRepo);
    if (repoError) {
      showAlert(repoError, 'destructive');
      return;
    }
    const inferenceError = validateInference(inferenceText, inferenceFile);
    if (inferenceError) {
      showAlert(inferenceError, 'destructive');
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
        showAlert('Inference completed successfully', 'success');
      } else {
        showAlert('Inference task failed', 'destructive');
      }
    } catch (error) {
      console.error("Error checking task status:", error);
      showAlert('Error checking task status', 'destructive');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInferenceFile(e.target.files?.[0] || null);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Run Inference</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="repo-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select a repository
            </label>
            <select
              id="repo-select"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full p-2 border rounded"
              aria-label="Select a repository"
            >
              <option value="">Select a repository</option>
              {repos.map((repo) => (
                <option key={repo.name} value={repo.name}>
                  {repo.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="inference-text" className="block text-sm font-medium text-gray-700 mb-1">
              Inference Text
            </label>
            <Textarea
              id="inference-text"
              placeholder="Enter text for inference"
              value={inferenceText}
              onChange={(e) => setInferenceText(e.target.value)}
              aria-label="Enter text for inference"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              aria-label="Upload file for inference"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" size="sm">Upload File</Button>
            </label>
            <span className="text-sm text-gray-500">
              {inferenceFile ? inferenceFile.name : 'No file chosen'}
            </span>
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
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-h-60">{output}</pre>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Inference;



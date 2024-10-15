import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload } from 'lucide-react';
import api from '../../lib/api';
import { validateInferenceText } from '../../utils/validation';

interface Repo {
  name: string;
}

interface InferenceProps {
  repos: Repo[];
}

const Inference: React.FC<InferenceProps> = ({ repos }) => {
  const [selectedRepo, setSelectedRepo] = useState('');
  const [inferenceText, setInferenceText] = useState('');
  const [inferenceFile, setInferenceFile] = useState<File | null>(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunInference = async () => {
    if (!selectedRepo) {
      setError('Please select a repository');
      return;
    }

    if (!validateInferenceText(inferenceText)) {
      setError('Please enter valid inference text');
      return;
    }

    setError('');
    setOutput('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('selectedRepo', selectedRepo);
      formData.append('inferenceText', inferenceText);
      if (inferenceFile) {
        formData.append('inferenceFile', inferenceFile);
      }

      const { taskId } = await api.runInference(formData);
      pollTaskStatus(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start inference');
      setLoading(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    let retries = 0;
    const maxRetries = 30;

    const interval = setInterval(async () => {
      try {
        const status = await api.getTaskStatus(taskId);
        retries += 1;

        if (status.state === 'SUCCESS') {
          clearInterval(interval);
          setOutput(status.result);
          setLoading(false);
        } else if (status.state === 'FAILURE' || retries >= maxRetries) {
          clearInterval(interval);
          setError(retries >= maxRetries ? 'Inference timed out' : 'Inference failed');
          setLoading(false);
        }
      } catch (err) {
        clearInterval(interval);
        setError('Error polling task status');
        setLoading(false);
      }
    }, 2000);
  };

  const handleRepoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRepo(e.target.value);
    setError('');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInferenceText(e.target.value);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit');
    } else {
      setInferenceFile(file || null);
      setError('');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Run Inference</h2>
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
          <option key={repo.name} value={repo.name}>{repo.name}</option>
        ))}
      </select>

      <Input
        type="text"
        placeholder="Enter text for inference"
        value={inferenceText}
        onChange={handleTextChange}
      />

      <div className="flex items-center space-x-2">
        <Input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        </label>
        <span>{inferenceFile ? inferenceFile.name : 'No file chosen'}</span>
      </div>

      <Button onClick={handleRunInference} disabled={loading}>
        {loading ? 'Running Inference...' : 'Run Inference'}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {output && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Output:</h3>
          <pre className="bg-gray-100 p-4 rounded">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default Inference;


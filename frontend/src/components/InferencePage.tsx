import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'; // Adjusted path for common alias usage
import { Button } from '@/components/ui/button'; // Adjusted path for common alias usage
import { Input } from '@/components/ui/input'; // Adjusted path for common alias usage
import { Textarea } from '@/components/ui/textarea'; // Adjusted path for common alias usage
import { validateInferenceText } from '@/utils/validation'; // Adjusted path for common alias usage
import api from '@/lib/api'; // Adjusted path for common alias usage

const InferencePage = ({ repos, showAlert }) => {
  const [selectedRepo, setSelectedRepo] = useState('');
  const [inferenceText, setInferenceText] = useState('');
  const [inferenceFile, setInferenceFile] = useState(null);
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
      const taskId = await api.runInference(selectedRepo, inferenceText, inferenceFile);
      showAlert('Inference task started', 'default');
      await checkTaskStatus(taskId);
    } catch (error) {
      console.error("Error starting inference:", error);
      showAlert('Failed to start inference', 'destructive');
    } finally {
      setLoading(false);
    }
  };

  const checkTaskStatus = async (taskId) => {
    try {
      const result = await api.getTaskStatus(taskId);
      if (result.state === 'PENDING' || result.state === 'STARTED') {
        setTimeout(() => checkTaskStatus(taskId), 2000);
      } else if (result.state === 'SUCCESS') {
        setOutput(result.result);
        showAlert('Inference completed', 'default');
      } else if (result.state === 'FAILURE') {
        showAlert('Inference failed', 'destructive');
      }
    } catch (error) {
      console.error("Error checking task status:", error);
      showAlert('Error checking task status', 'destructive');
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Run Inference</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <select
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
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
              onChange={(e) => setInferenceFile(e.target.files[0])}
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

InferencePage.propTypes = {
  repos: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  showAlert: PropTypes.func.isRequired,
};

export default InferencePage;


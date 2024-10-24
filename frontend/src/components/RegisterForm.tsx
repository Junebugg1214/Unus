import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import api from '../lib/api';

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError(''); // Clear previous errors when user starts typing
  };

  const validateForm = () => {
    if (formData.username.length < 3 || formData.username.length > 25) {
      setError('Username must be between 3 and 25 characters');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      await api.register(formData.username, formData.email, formData.password);
      await onRegister(formData.username, formData.email, formData.password);
      setSuccess('Registration successful!');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during registration');
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Register for {process.env['REACT_APP_NAME']}</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
            disabled={isLoading}
            aria-describedby={error ? "register-error" : undefined}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            disabled={isLoading}
            aria-describedby={error ? "register-error" : undefined}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            disabled={isLoading}
            aria-describedby={error ? "register-error" : undefined}
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            disabled={isLoading}
            aria-describedby={error ? "register-error" : undefined}
          />
          {error && (
            <div id="register-error">
              <Alert variant="destructive" aria-live="assertive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          {success && (
            <Alert variant="default" aria-live="polite">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;



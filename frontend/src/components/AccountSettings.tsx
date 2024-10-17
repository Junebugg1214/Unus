import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

// Define types for props
interface User {
  username?: string;
  email?: string;
}

interface AccountSettingsProps {
  user?: User;
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onUpdatePassword }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage({ text: "New passwords don't match", type: 'error' });
      return false;
    }
    if (formData.newPassword.length < 8) {
      setMessage({ text: "New password must be at least 8 characters long", type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onUpdatePassword(formData.currentPassword, formData.newPassword);
      setMessage({ text: 'Password updated successfully', type: 'success' });
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ text: error.message || 'Failed to update password. Please try again.', type: 'error' });
      } else {
        setMessage({ text: 'Failed to update password. Please try again.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Account Settings</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <p className="text-sm text-gray-600">{user?.email || 'N/A'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        {message.text && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default AccountSettings;

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ExampleForm = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  const handleCancel = () => {
    // Handle cancel action (e.g., clearing the form or navigating away)
    console.log('Form canceled');
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your information to create an account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </label>
              <Input id="name" placeholder="Name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input id="email" placeholder="Email" type="email" />
            </div>
          </div>
          <CardFooter className="flex justify-between mt-4">
            <Button variant="outline" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExampleForm;



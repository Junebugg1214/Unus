import React, { ReactNode } from 'react';
import { Button } from './ui/button';  // Assume this is a styled button component used across your app

interface ErrorBoundaryProps {
  children: ReactNode;
  logError?: (error: Error, errorInfo: React.ErrorInfo) => void;  // Optional logging function
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state to show fallback UI on next render
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service or console
    console.error('Uncaught error:', error, errorInfo);

    // Optionally log to a remote service if in production and logError function is provided
    if (process.env['REACT_APP_ENV'] === 'production' && this.props.logError) {
      this.props.logError(error, errorInfo);
    }
  }

  handleRetry = () => {
    // Reset error state to attempt rendering the children components again
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Oops! Something went wrong.</h1>
          <p className="mb-4">Please try refreshing the page, or contact support if the problem persists.</p>
          <Button onClick={this.handleRetry} variant="outline">
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

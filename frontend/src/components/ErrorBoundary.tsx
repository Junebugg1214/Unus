import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';  // Adjusted import path for Vite alias compatibility

// Define the props and state interfaces for ErrorBoundary
interface ErrorBoundaryProps {
  children: ReactNode;
  logError?: (error: Error, errorInfo: React.ErrorInfo) => void;
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
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    if (process.env.NODE_ENV === 'production' && this.props.logError) {
      this.props.logError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
    window.location.reload(); // Ensures a fresh state
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold text-destructive">
              Oops! Something went wrong.
            </h1>
            <p className="text-muted-foreground">
              Please try refreshing the page, or contact support if the problem persists.
            </p>
            <Button
              onClick={this.handleRetry}
              variant="outline"
              className="min-w-[120px]"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

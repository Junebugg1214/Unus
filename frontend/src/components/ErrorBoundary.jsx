import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    if (process.env.REACT_APP_ENV === 'production' && typeof this.props.logError === 'function') {
      this.props.logError(error, errorInfo);
    }
  }

  handleRetry = () => {
    // Reset the error boundary state to re-attempt rendering the children components
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

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  logError: PropTypes.func,
};

export default ErrorBoundary;

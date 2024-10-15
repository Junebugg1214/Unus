import React from 'react';
import PropTypes from 'prop-types';
import { Info, AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

type AlertVariant = 'default' | 'destructive' | 'success' | 'warning';

type AlertProps = {
  children: React.ReactNode;
  variant?: AlertVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
};

export const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default', 
  dismissible = false, 
  onDismiss 
}) => {
  const variantClasses: Record<AlertVariant, string> = {
    default: 'bg-blue-100 border-blue-500 text-blue-700',
    destructive: 'bg-red-100 border-red-500 text-red-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  };

  const iconComponents: Record<AlertVariant, JSX.Element> = {
    default: <Info className="w-5 h-5 mr-2 text-blue-500" />,
    destructive: <AlertCircle className="w-5 h-5 mr-2 text-red-500" />,
    success: <CheckCircle className="w-5 h-5 mr-2 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />,
  };

  return (
    <div
      className={`flex items-center border-l-4 p-4 ${variantClasses[variant]} rounded-md shadow-sm`}
      role="alert"
      aria-live="assertive"
      aria-label={`${variant} alert`}
    >
      {iconComponents[variant]}
      <div className="flex-grow">{children}</div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

type AlertDescriptionProps = {
  children: React.ReactNode;
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => {
  return <p className="text-sm">{children}</p>;
};

// Adding prop types for better type checking
Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'destructive', 'success', 'warning']),
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
};

AlertDescription.propTypes = {
  children: PropTypes.node.isRequired,
};


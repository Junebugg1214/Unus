// src/components/ui/alert.js
import React from 'react';
import { Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'; // Assuming you are using lucide icons

export const Alert = ({ children, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-blue-100 border-blue-500 text-blue-700',
    destructive: 'bg-red-100 border-red-500 text-red-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  };

  const iconComponents = {
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
    >
      {iconComponents[variant]}
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => {
  return <p className="text-sm">{children}</p>;
};

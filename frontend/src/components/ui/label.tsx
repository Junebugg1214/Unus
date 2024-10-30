import React from 'react';

// Define the props interface for the Label component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor = '', className = '', ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={className}
      {...props}
    >
      {children}
    </label>
  );
};

Label.displayName = "Label";

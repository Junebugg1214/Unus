import React from 'react';
import { cn } from '../../lib/utils';  // Adjust this path if necessary

// Define the props interface for the Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', value = '', onChange, placeholder = '', ...props }, ref) => (
    <textarea
      className={cn(
        "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
        className
      )}
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={props['aria-label'] || placeholder}
      {...props}
    />
  )
);

Textarea.displayName = 'Textarea';

export { Textarea };



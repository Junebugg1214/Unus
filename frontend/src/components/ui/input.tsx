import * as React from "react";
import { cn } from "../../lib/utils"; // Adjust this path if necessary

// Define the props interface for the Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  ariaLabel?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ariaLabel, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        aria-label={ariaLabel || props.placeholder || ''}
        aria-labelledby={props['aria-labelledby']}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

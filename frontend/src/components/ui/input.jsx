import * as React from "react";
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';  // Adjust this path if necessary

const Input = React.forwardRef(({ className, type = 'text', ariaLabel, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      aria-label={ariaLabel || props.placeholder || ''}
      aria-labelledby={props['aria-labelledby']}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Define prop types for better type safety and clarity.
Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  'aria-labelledby': PropTypes.string,
};

// Define default props to ensure these values are available even if not explicitly provided.
Input.defaultProps = {
  className: '',
  type: 'text',
};

export { Input };

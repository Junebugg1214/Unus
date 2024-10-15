import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';  // Adjust this path if necessary

const Textarea = React.forwardRef(({ className, value, onChange, placeholder = '', ...props }, ref) => (
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
));

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

Textarea.defaultProps = {
  className: '',
  value: '',
  placeholder: '',
};

export { Textarea };


import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';  // Adjust this path if necessary

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
      className
    )}
    ref={ref}
    {...props}
  />
));

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export { Textarea };

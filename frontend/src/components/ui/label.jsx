import React from 'react';
import PropTypes from 'prop-types';

export function Label({ children, htmlFor, className = '', ...props }) {
  return (
    <label htmlFor={htmlFor} className={className} {...props}>
      {children}
    </label>
  );
}

Label.propTypes = {
  children: PropTypes.node.isRequired,
  htmlFor: PropTypes.string,
  className: PropTypes.string,
};

Label.defaultProps = {
  htmlFor: '',
  className: '',
};

import * as React from "react";
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

// Utility function for creating components with forwardRef
const createForwardRefComponent = (name, baseClassName) => {
  const Component = React.forwardRef(({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(baseClassName, className)}
      {...props}
    >
      {children}
    </div>
  ));
  Component.displayName = name;
  Component.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  };
  Component.defaultProps = {
    className: '',
  };
  return Component;
};

// Creating components using the utility function
const Card = createForwardRefComponent("Card", "rounded-lg border bg-card text-card-foreground shadow-sm");
const CardHeader = createForwardRefComponent("CardHeader", "flex flex-col space-y-1.5 p-6");
const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";
CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
CardTitle.defaultProps = {
  className: '',
};

const CardDescription = createForwardRefComponent("CardDescription", "text-sm text-muted-foreground");
const CardContent = createForwardRefComponent("CardContent", "p-6 pt-0");
const CardFooter = createForwardRefComponent("CardFooter", "flex items-center p-6 pt-0");

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };


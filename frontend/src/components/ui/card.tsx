import * as React from "react";
import { cn } from "../../lib/utils";

// Define types for component props
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

// Utility function for creating components with forwardRef
const createForwardRefComponent = (
  name: string,
  baseClassName: string
) => {
  const Component = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
      <div ref={ref} className={cn(baseClassName, className)} {...props}>
        {children}
      </div>
    )
  );
  Component.displayName = name;
  return Component;
};

// Creating components using the utility function
const Card = createForwardRefComponent(
  "Card",
  "rounded-lg border bg-card text-card-foreground shadow-sm"
);
const CardHeader = createForwardRefComponent(
  "CardHeader",
  "flex flex-col space-y-1.5 p-6"
);

// Define props interface for CardTitle
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: React.ReactNode;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = createForwardRefComponent(
  "CardDescription",
  "text-sm text-muted-foreground"
);
const CardContent = createForwardRefComponent(
  "CardContent",
  "p-6 pt-0"
);
const CardFooter = createForwardRefComponent(
  "CardFooter",
  "flex items-center p-6 pt-0"
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };



import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils"; // Adjust path if necessary

// Define the props interface for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

// Class Variance Authority (CVA) for conditional button styling
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-500 text-white hover:bg-green-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Spinner color variants for the loading state
const spinnerColorClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: "text-primary",
  destructive: "text-red-500",
  outline: "text-gray-500",
  secondary: "text-secondary",
  ghost: "text-accent",
  link: "text-primary",
  success: "text-green-500",
  danger: "text-red-500",
};

// LoadingSpinner Component
const LoadingSpinner: React.FC<{ variant?: ButtonProps['variant'] }> = ({ variant = 'default' }) => (
  <svg
    className={`animate-spin h-5 w-5 mr-2 ${spinnerColorClasses[variant ?? 'default']}`} // Ensures spinner color is always valid
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    ></path>
  </svg>
);

// Button Component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  isLoading = false,
  children,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button"; // Render as a different element if `asChild` is true

  return (
    <Comp
      ref={ref}
      className={cn(
        buttonVariants({ variant, size }),
        isLoading && "cursor-wait",
        className
      )}
      disabled={props.disabled || isLoading} // Disable button if loading or disabled
      aria-busy={isLoading} // Accessibility for loading state
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center" aria-live="polite">
          <LoadingSpinner variant={variant} />
          Loading...
        </span>
      ) : (
        children
      )}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };


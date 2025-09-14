import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidGlassCardVariants = cva(
  "rounded-2xl backdrop-blur-md transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card-glass border border-border-glass shadow-glass hover:shadow-elegant",
        elevated: "bg-card-glass border border-border-glass shadow-elegant hover:shadow-glow hover:scale-[1.02]",
        outline: "border-2 border-primary/20 bg-glass-bg backdrop-blur-md shadow-soft hover:border-primary/40 hover:shadow-medium",
        solid: "bg-card border border-border shadow-soft hover:shadow-medium",
        glass: "bg-glass-bg backdrop-blur-md border border-border-glass shadow-glass hover:shadow-elegant",
        divine: "bg-gradient-glass border border-border-glass shadow-divine hover:shadow-glow",
        premium: "bg-gradient-divine border border-secondary/30 shadow-divine hover:shadow-glow hover:scale-[1.01]",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface LiquidGlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liquidGlassCardVariants> {}

const LiquidGlassCard = React.forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(liquidGlassCardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
LiquidGlassCard.displayName = "LiquidGlassCard";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { 
  LiquidGlassCard, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  liquidGlassCardVariants 
};
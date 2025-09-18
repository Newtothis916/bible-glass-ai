import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidGlassCardVariants = cva(
  "rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.045] shadow-xl",
  {
    variants: {
      variant: {
        default: "bg-card hover:shadow-xl hover:shadow-primary/10",
        elevated: "bg-card shadow-elegant hover:shadow-glow",
        outline: "bg-card hover:shadow-xl hover:shadow-primary/10",
        solid: "bg-card hover:shadow-xl hover:shadow-primary/5",
        glass: "bg-white/10 backdrop-blur-md hover:shadow-xl hover:shadow-white/5",
        divine: "bg-gradient-glass shadow-divine hover:shadow-glow",
        premium: "bg-gradient-divine shadow-divine hover:shadow-glow",
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
    className={cn("font-serif font-normal leading-none tracking-tighter", className)}
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
    className={cn("text-sm font-serif tracking-tighter text-muted-foreground", className)}
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
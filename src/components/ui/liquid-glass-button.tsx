import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidGlassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-elegant hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark shadow-soft hover:shadow-divine hover:scale-[1.02] active:scale-[0.98]",
        outline: "border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-md shadow-soft hover:shadow-elegant",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-md",
        glass: "bg-glass-bg backdrop-blur-md border border-glass-border text-foreground hover:bg-glass-bg/80 shadow-glass hover:shadow-elegant hover:scale-[1.02] active:scale-[0.98]",
        divine: "bg-gradient-divine text-primary-foreground hover:shadow-glow border border-accent/30 hover:scale-[1.02] active:scale-[0.98]",
        sacred: "bg-gradient-primary text-primary-foreground hover:shadow-divine border border-primary-glow/20 hover:scale-[1.02] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground shadow-elegant hover:bg-destructive/90 hover:scale-[1.02] active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline bg-transparent shadow-none",
      },
      size: {
        sm: "h-8 rounded-lg px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidGlassButtonVariants> {
  asChild?: boolean;
}

const LiquidGlassButton = React.forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(liquidGlassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
LiquidGlassButton.displayName = "LiquidGlassButton";

export { LiquidGlassButton, liquidGlassButtonVariants };
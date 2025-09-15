import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidGlassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-serif font-normal tracking-tighter transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.045] active:scale-[0.955] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border border-primary shadow-xl hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground border border-secondary shadow-xl hover:bg-secondary-dark hover:shadow-xl hover:shadow-secondary/20",
        outline: "bg-background border-2 border-primary text-primary shadow-xl hover:bg-muted hover:text-muted-foreground hover:shadow-xl hover:shadow-primary/10",
        ghost: "bg-transparent text-foreground hover:bg-muted hover:text-muted-foreground",
        glass: "bg-glass-bg backdrop-blur-md border border-glass-border text-foreground hover:bg-muted shadow-xl hover:shadow-xl",
        divine: "bg-gradient-divine text-primary-foreground hover:shadow-glow border border-accent/30 shadow-xl",
        sacred: "bg-gradient-primary text-primary-foreground hover:shadow-divine border border-primary-glow/20 shadow-xl",
        destructive: "bg-destructive text-destructive-foreground border border-destructive shadow-xl hover:bg-destructive/90 hover:shadow-xl hover:shadow-destructive/30",
        link: "bg-transparent text-primary underline-offset-4 hover:underline hover:bg-muted/50",
      },
      size: {
        sm: "h-9 rounded-xl px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 rounded-2xl px-6 text-base",
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
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidGlassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 backdrop-blur-md border border-border-glass",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-gradient-secondary text-secondary-foreground shadow-elegant hover:shadow-divine hover:scale-[1.02] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground shadow-elegant hover:bg-destructive/90 hover:scale-[1.02] active:scale-[0.98]",
        outline: "border-2 border-primary/20 bg-glass-bg backdrop-blur-md text-primary hover:bg-primary/10 hover:border-primary/40 shadow-glass hover:shadow-elegant",
        ghost: "bg-transparent hover:bg-glass-bg hover:text-primary backdrop-blur-sm shadow-none hover:shadow-soft",
        link: "text-primary underline-offset-4 hover:underline bg-transparent shadow-none",
        glass: "bg-glass-bg backdrop-blur-md border-glass-border text-foreground shadow-glass hover:bg-glass-bg/80 hover:shadow-elegant hover:scale-[1.02] active:scale-[0.98]",
        divine: "bg-gradient-divine text-primary-foreground shadow-elegant hover:shadow-glow hover:shadow-divine hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-12 w-12",
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
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-serif font-normal tracking-tighter transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.045] active:scale-[0.955] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border border-primary shadow-xl hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground border border-secondary shadow-xl hover:bg-secondary-dark hover:shadow-xl hover:shadow-secondary/20",
        outline: "bg-background border-2 border-primary text-primary shadow-xl hover:bg-muted hover:text-muted-foreground hover:shadow-xl hover:shadow-primary/10",
        ghost: "bg-transparent text-foreground hover:bg-muted hover:text-muted-foreground",
        link: "bg-transparent text-primary underline-offset-4 hover:underline hover:bg-muted/50",
        destructive: "bg-destructive text-destructive-foreground border border-destructive shadow-xl hover:bg-destructive/90 hover:shadow-xl hover:shadow-destructive/30",
        sacred: "bg-gradient-divine text-primary-foreground hover:shadow-glow border border-primary-glow/20 shadow-xl",
        glass: "bg-glass-bg backdrop-blur-md border border-glass-border text-foreground hover:bg-muted shadow-xl hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-2xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

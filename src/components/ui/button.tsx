import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-inter font-normal tracking-tighter transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground shadow-xl hover:bg-primary/30 hover:shadow-2xl hover:shadow-primary/20",
        secondary: "bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary-foreground shadow-xl hover:bg-secondary/30 hover:shadow-2xl hover:shadow-secondary/20",
        outline: "bg-transparent backdrop-blur-md border-2 border-primary/40 text-primary shadow-xl hover:bg-primary/10 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10",
        ghost: "bg-transparent backdrop-blur-sm text-foreground hover:bg-white/10 hover:backdrop-blur-md",
        link: "bg-transparent text-primary underline-offset-4 hover:underline hover:bg-white/5",
        destructive: "bg-destructive/20 backdrop-blur-md border border-destructive/40 text-destructive shadow-xl hover:bg-destructive/30 hover:shadow-2xl hover:shadow-destructive/30",
        sacred: "bg-gradient-divine text-primary-foreground hover:shadow-glow border border-primary-glow/20 shadow-xl",
        glass: "bg-glass-bg backdrop-blur-md border border-glass-border text-foreground hover:bg-glass-bg/80 shadow-xl hover:shadow-2xl hover:shadow-white/5",
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

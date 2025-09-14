import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-2xl border px-2.5 py-0.5 text-xs font-inter font-normal tracking-tighter transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/20 backdrop-blur-md text-primary-foreground hover:bg-primary/30 hover:shadow-lg hover:shadow-primary/20",
        secondary: "border-secondary/30 bg-secondary/20 backdrop-blur-md text-secondary-foreground hover:bg-secondary/30 hover:shadow-lg hover:shadow-secondary/20",
        destructive: "border-destructive/40 bg-destructive/20 backdrop-blur-md text-destructive hover:bg-destructive/30 hover:shadow-lg hover:shadow-destructive/30",
        outline: "border-2 border-white/40 bg-transparent backdrop-blur-md text-foreground hover:bg-white/10 hover:border-white/60 hover:shadow-lg hover:shadow-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

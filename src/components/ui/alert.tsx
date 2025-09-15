import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl backdrop-blur-md p-4 shadow-xl transition-all duration-300 hover:scale-[1.045] [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "border border-white/30 bg-white/10 text-foreground hover:shadow-xl hover:shadow-primary/10 [&>svg]:text-foreground",
        destructive: "border border-destructive/50 bg-destructive/20 text-destructive hover:shadow-xl hover:shadow-destructive/20 [&>svg]:text-destructive",
        success: "border border-success/50 bg-success/20 text-success hover:shadow-xl hover:shadow-success/20 [&>svg]:text-success",
        warning: "border border-warning/50 bg-warning/20 text-warning hover:shadow-xl hover:shadow-warning/20 [&>svg]:text-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-serif font-normal leading-none tracking-tighter", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm font-serif tracking-tighter [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

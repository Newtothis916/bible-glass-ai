import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
}

export function ResponsiveGrid({ 
  children, 
  className, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "gap-4" 
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid",
    gap,
    // Mobile columns
    columns.mobile === 1 && "grid-cols-1",
    columns.mobile === 2 && "grid-cols-2",
    columns.mobile === 3 && "grid-cols-3",
    // Tablet columns
    columns.tablet === 1 && "md:grid-cols-1",
    columns.tablet === 2 && "md:grid-cols-2", 
    columns.tablet === 3 && "md:grid-cols-3",
    columns.tablet === 4 && "md:grid-cols-4",
    // Desktop columns
    columns.desktop === 1 && "lg:grid-cols-1",
    columns.desktop === 2 && "lg:grid-cols-2",
    columns.desktop === 3 && "lg:grid-cols-3",
    columns.desktop === 4 && "lg:grid-cols-4",
    columns.desktop === 5 && "lg:grid-cols-5",
    columns.desktop === 6 && "lg:grid-cols-6",
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}
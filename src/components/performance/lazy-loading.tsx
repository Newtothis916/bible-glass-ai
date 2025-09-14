import { lazy, Suspense, ComponentType, useState, useEffect } from 'react';
import { LiquidGlassCard, CardContent } from "@/components/ui/liquid-glass-card";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components for better performance
export const LazyBibleReader = lazy(() => 
  import('@/components/bible/bible-reader').then(module => ({ default: module.BibleReader }))
);

export const LazyAIAssistant = lazy(() => 
  import('@/components/ai/ai-assistant').then(module => ({ default: module.AIAssistant }))
);

export const LazyAudioPlayer = lazy(() => 
  import('@/components/audio/audio-player').then(module => ({ default: module.AudioPlayer }))
);

export const LazyPrayerJournal = lazy(() => 
  import('@/components/prayer/prayer-journal').then(module => ({ default: module.PrayerJournal }))
);

export const LazyGroupsPage = lazy(() => 
  import('@/components/groups/groups-page').then(module => ({ default: module.GroupsPage }))
);

// Loading skeleton components
export function BibleReaderSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-12 w-full" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export function AIAssistantSkeleton() {
  return (
    <LiquidGlassCard>
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-24" />
      </CardContent>
    </LiquidGlassCard>
  );
}

export function AudioPlayerSkeleton() {
  return (
    <LiquidGlassCard>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-2 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </LiquidGlassCard>
  );
}

// Higher-order component for lazy loading with suspense
export function withLazyLoading<P extends object>(
  LazyComponent: ComponentType<P>,
  LoadingSkeleton: ComponentType
) {
  return function WrappedComponent(props: P) {
    return (
      <Suspense fallback={<LoadingSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Optimized image loading component
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  priority = false 
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`transition-opacity duration-300 ${className}`}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      onLoad={(e) => {
        (e.target as HTMLImageElement).style.opacity = '1';
      }}
      style={{ opacity: '0' }}
    />
  );
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}
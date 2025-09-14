// Performance optimization utilities

// Debounce function for search and API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  };
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Lazy loading utility for dynamic imports
export function lazyLoad<T>(importFunc: () => Promise<{ default: T }>) {
  let cached: T | null = null;
  let loading: Promise<T> | null = null;

  return async (): Promise<T> => {
    if (cached) return cached;
    if (loading) return loading;

    loading = importFunc().then(module => {
      cached = module.default;
      loading = null;
      return cached!;
    });

    return loading;
  };
}

// Virtual scrolling helper
export interface VirtualScrollItem {
  id: string;
  height: number;
  data: any;
}

export class VirtualScroller {
  private container: HTMLElement;
  private items: VirtualScrollItem[];
  private visibleRange: { start: number; end: number } = { start: 0, end: 0 };
  private itemHeight: number;
  private containerHeight: number;

  constructor(
    container: HTMLElement,
    items: VirtualScrollItem[],
    itemHeight: number = 50
  ) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.containerHeight = container.clientHeight;
    this.updateVisibleRange();
  }

  private updateVisibleRange() {
    const scrollTop = this.container.scrollTop;
    const start = Math.floor(scrollTop / this.itemHeight);
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const end = Math.min(start + visibleCount + 5, this.items.length); // 5 buffer items

    this.visibleRange = { start: Math.max(0, start - 5), end };
  }

  getVisibleItems(): VirtualScrollItem[] {
    return this.items.slice(this.visibleRange.start, this.visibleRange.end);
  }

  getTotalHeight(): number {
    return this.items.length * this.itemHeight;
  }

  getOffsetTop(): number {
    return this.visibleRange.start * this.itemHeight;
  }

  onScroll() {
    this.updateVisibleRange();
  }
}

// Image optimization
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

export function getOptimalImageSize(containerWidth: number): number {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const targetWidth = containerWidth * devicePixelRatio;
  
  // Common responsive breakpoints
  const sizes = [320, 640, 768, 1024, 1280, 1536, 1920];
  
  return sizes.find(size => size >= targetWidth) || sizes[sizes.length - 1];
}

// Bundle splitting helper
export function preloadRoute(routeImport: () => Promise<any>) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => routeImport());
  } else {
    setTimeout(() => routeImport(), 100);
  }
}

// Performance metrics
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  startTimer(name: string): void {
    this.metrics.set(`${name}_start`, performance.now());
  }

  endTimer(name: string): number {
    const start = this.metrics.get(`${name}_start`);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    this.metrics.set(name, duration);
    this.metrics.delete(`${name}_start`);
    
    return duration;
  }

  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  logToConsole(): void {
    console.table(this.getAllMetrics());
  }
}

export const performanceMonitor = new PerformanceMonitor();
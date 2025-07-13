import React from 'react';

// Enhanced component preloader with priority support
class ComponentPreloader {
  private static instance: ComponentPreloader;
  private loadedComponents = new Map<string, React.ComponentType<unknown>>();
  private loadingComponents = new Map<string, Promise<{ default: React.ComponentType<unknown> }>>();
  
  public static getInstance(): ComponentPreloader {
    if (!ComponentPreloader.instance) {
      ComponentPreloader.instance = new ComponentPreloader();
    }
    return ComponentPreloader.instance;
  }

  async preloadComponent<T extends React.ComponentType<unknown>>(
    importFn: () => Promise<{ default: T }>,
    componentId: string,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<T> {
    // Return if already loaded
    if (this.loadedComponents.has(componentId)) {
      return this.loadedComponents.get(componentId) as T;
    }

    // Return existing promise if already loading
    if (this.loadingComponents.has(componentId)) {
      const result = await this.loadingComponents.get(componentId);
      return result!.default as T;
    }

    // Start loading
    const loadPromise = this.loadWithPriority(importFn, priority);
    this.loadingComponents.set(componentId, loadPromise);

    try {
      const result = await loadPromise;
      this.loadedComponents.set(componentId, result.default);
      this.loadingComponents.delete(componentId);
      return result.default as T;
    } catch (error) {
      this.loadingComponents.delete(componentId);
      throw error;
    }
  }

  private async loadWithPriority<T extends React.ComponentType<unknown>>(
    importFn: () => Promise<{ default: T }>,
    priority: 'high' | 'normal' | 'low'
  ): Promise<{ default: T }> {
    // Delay based on priority
    const delay = priority === 'high' ? 0 : priority === 'normal' ? 16 : 100;
    
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return importFn();
  }

  getLoadedComponent(componentId: string): React.ComponentType<unknown> | null {
    return this.loadedComponents.get(componentId) || null;
  }

  isLoading(componentId: string): boolean {
    return this.loadingComponents.has(componentId);
  }

  clearCache(): void {
    this.loadedComponents.clear();
    this.loadingComponents.clear();
  }
}

const preloader = ComponentPreloader.getInstance();

// Retry mechanism for failed imports
export async function retryImport<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  retryAttempts: number,
  componentName: string,
  fallback?: React.ComponentType
): Promise<{ default: T }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryAttempts; attempt++) {
    try {
      return await importFn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Failed to load ${componentName} (attempt ${attempt + 1}/${retryAttempts + 1}):`, error);
      
      if (attempt < retryAttempts) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Return fallback component if available
  if (fallback) {
    return { default: fallback as T };
  }

  // Throw error for JSX component creation in .tsx file
  throw new Error(`Failed to load ${componentName}: ${lastError?.message}`);
}

// Enhanced lazy component factory with better error handling and caching
export function createAdvancedLazyComponent<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string,
  options: {
    preload?: boolean;
    priority?: 'high' | 'normal' | 'low';
    fallback?: React.ComponentType;
    retryAttempts?: number;
  } = {}
): React.LazyExoticComponent<T> {
  const {
    preload = false,
    priority = 'normal',
    fallback,
    retryAttempts = 3
  } = options;

  // Preload if requested
  if (preload) {
    preloader.preloadComponent(importFn, componentName, priority);
  }

  const LazyComponent = React.lazy(() => 
    retryImport(importFn, retryAttempts, componentName, fallback)
  );

  return LazyComponent;
}

// Advanced preloading utilities
export function createPreloadingHooks() {
  return {
    preloadOnHover: <T extends React.ComponentType<unknown>>(
      importFn: () => Promise<{ default: T }>,
      componentId: string,
      priority: 'high' | 'normal' | 'low' = 'normal'
    ) => {
      return () => {
        preloader.preloadComponent(importFn, componentId, priority);
      };
    },

    preloadOnVisible: <T extends React.ComponentType<unknown>>(
      importFn: () => Promise<{ default: T }>,
      componentId: string,
      element: HTMLElement | null,
      options: IntersectionObserverInit = {}
    ) => {
      if (!element) return () => {};

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            preloader.preloadComponent(importFn, componentId);
            observer.disconnect();
          }
        },
        { threshold: 0.1, ...options }
      );

      observer.observe(element);
      return () => observer.disconnect();
    },

    preloadComponent: preloader.preloadComponent.bind(preloader),
    isLoading: preloader.isLoading.bind(preloader),
    clearCache: preloader.clearCache.bind(preloader)
  };
}

// Bundle analyzer utilities
export const bundleUtils = {
  analyzeChunks: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle analysis would run here in production');
    }
  },
  
  getChunkInfo: (chunkName: string) => {
    // Mock implementation - in real app, this would integrate with build tools
    console.log(`Analyzing chunk: ${chunkName}`);
    return {
      size: Math.random() * 1000,
      isLoaded: Math.random() > 0.5,
      dependencies: ['react', 'react-dom']
    };
  }
};

// Memory management utilities
export const memoryUtils = {
  cleanupUnusedComponents: () => {
    preloader.clearCache();
  },
  
  measureMemoryUsage: () => {
    if ('memory' in performance) {
      const perfWithMemory = performance as {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };
      
      if (perfWithMemory.memory) {
        return {
          used: perfWithMemory.memory.usedJSHeapSize / 1048576, // MB
          total: perfWithMemory.memory.totalJSHeapSize / 1048576,
          limit: perfWithMemory.memory.jsHeapSizeLimit / 1048576
        };
      }
    }
    return null;
  }
};

// Performance timing utilities
export const timingUtils = {
  measureAsyncOperation: async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  throttle: <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }
};

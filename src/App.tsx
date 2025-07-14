import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeProvider';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { PerformanceMonitorProvider } from './contexts/PerformanceMonitorContext';
import Layout from './components/Layout';
import { ConditionalPerformanceOverlay } from './components/ConditionalPerformanceOverlay';
import { LoadingFallback } from './shared';
import { createAdvancedLazyComponent, createPreloadingHooks, useAdvancedPerformance } from './features/performance';
import { mockWebSocketServer } from './lib/mockWebSocketServer';

// Get preloading utilities
const preloadingUtils = createPreloadingHooks();

// Lazy load page components for better performance with advanced features
const Dashboard = createAdvancedLazyComponent(
  () => import('./pages/Dashboard'),
  'Dashboard',
  { priority: 'high', preload: true }
);

const Users = createAdvancedLazyComponent(
  () => import('./pages/Users'),
  'Users',
  { priority: 'normal' }
);

const Forms = createAdvancedLazyComponent(
  () => import('./pages/Forms'),
  'Forms',
  { priority: 'normal' }
);

const Analytics = createAdvancedLazyComponent(
  () => import('./pages/Analytics'),
  'Analytics',
  { priority: 'low' }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error && 
            typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Initialize performance monitoring
  useAdvancedPerformance({
    trackMemory: true,
    trackNetwork: true,
    trackRender: true,
    onMetricsUpdate: (metrics) => {
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance metrics:', metrics);
      }
    }
  });

  // Start mock WebSocket server in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      mockWebSocketServer.start();
      return () => {
        mockWebSocketServer.stop();
      };
    }
  }, []);

  // Preload components when user hovers over navigation
  const handleNavigationHover = (page: string) => {
    switch (page) {
      case 'users':
        preloadingUtils.preloadComponent(
          () => import('./pages/Users'), 
          'Users', 
          'normal'
        );
        break;
      case 'forms':
        preloadingUtils.preloadComponent(
          () => import('./pages/Forms'), 
          'Forms', 
          'normal'
        );
        break;
      case 'analytics':
        preloadingUtils.preloadComponent(
          () => import('./pages/Analytics'), 
          'Analytics', 
          'low'
        );
        break;
      default:
        break;
    }
  };

  const renderPage = () => {
    return (
      <Suspense fallback={<LoadingFallback message="Loading page..." />}>
        {(() => {
          switch (currentPage) {
            case 'users':
              return <Users />;
            case 'forms':
              return <Forms />;
            case 'analytics':
              return <Analytics />;
            case 'dashboard':
            default:
              return <Dashboard />;
          }
        })()}
      </Suspense>
    );
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'users':
        return 'Users';
      case 'forms':
        return 'Forms';
      case 'analytics':
        return 'Analytics';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  return (
    <ThemeProvider>
      <PerformanceMonitorProvider>
        <QueryClientProvider client={queryClient}>
          <WebSocketProvider url="ws://localhost:8080" enabled={true}>
            <Layout 
              title={getPageTitle()} 
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              onNavigationHover={handleNavigationHover}
            >
              {renderPage()}
            </Layout>
            <ConditionalPerformanceOverlay />
          </WebSocketProvider>
        </QueryClientProvider>
      </PerformanceMonitorProvider>
    </ThemeProvider>
  );
}

export default App;

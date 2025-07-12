import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeProvider';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Forms from './pages/Forms';
import { mockWebSocketServer } from './lib/mockWebSocketServer';
import { cn } from './lib/utils';
import { tw } from './design-system/utilities/tailwind';

const queryClient = new QueryClient();

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Start mock WebSocket server in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      mockWebSocketServer.start();
      return () => {
        mockWebSocketServer.stop();
      };
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'users':
        return <Users />;
      case 'forms':
        return <Forms />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'users':
        return 'Users';
      case 'forms':
        return 'Forms';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider url="ws://localhost:8080" enabled={true}>
          <Layout title={getPageTitle()}>
            <div className="mb-6">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    currentPage === 'dashboard'
                      ? tw.interactive.primary
                      : cn(tw.bg.gray[200], tw.text.secondary, 'hover:bg-gray-300 dark:hover:bg-gray-600')
                  )}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('users')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    currentPage === 'users'
                      ? tw.interactive.primary
                      : cn(tw.bg.gray[200], tw.text.secondary, 'hover:bg-gray-300 dark:hover:bg-gray-600')
                  )}
                >
                  Users
                </button>
                <button
                  onClick={() => setCurrentPage('forms')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    currentPage === 'forms'
                      ? tw.interactive.primary
                      : cn(tw.bg.gray[200], tw.text.secondary, 'hover:bg-gray-300 dark:hover:bg-gray-600')
                  )}
                >
                  Forms
                </button>
              </nav>
            </div>
            {renderPage()}
          </Layout>
        </WebSocketProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

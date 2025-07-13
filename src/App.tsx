import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeProvider';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Forms from './pages/Forms';
import Analytics from './pages/Analytics';
import { mockWebSocketServer } from './lib/mockWebSocketServer';

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
      case 'analytics':
        return <Analytics />;
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
      case 'analytics':
        return 'Analytics';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider url="ws://localhost:8080" enabled={true}>
          <Layout 
            title={getPageTitle()} 
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          >
            {renderPage()}
          </Layout>
        </WebSocketProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

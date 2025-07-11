import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeProvider';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';

const queryClient = new QueryClient();

function App() {
  const [currentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'users':
        return <Users />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Layout title={currentPage === 'users' ? 'Users' : 'Dashboard'}>
          {renderPage()}
        </Layout>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

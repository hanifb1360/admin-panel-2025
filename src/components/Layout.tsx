import { useState } from 'react';
import { cn } from '../lib/utils';
import { designSystem } from '../lib/designSystem';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onNavigationHover?: (page: string) => void;
}

export default function Layout({ 
  children, 
  title = 'Dashboard', 
  currentPage, 
  onNavigate,
  onNavigationHover 
}: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={cn('flex h-screen', designSystem.colors.bg.secondary)}>
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onNavigationHover={onNavigationHover}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

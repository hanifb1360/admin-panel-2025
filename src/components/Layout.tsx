import { useState, useEffect } from 'react';
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
  // Sidebar is collapsed on mobile by default
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth >= 1024);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
        setSidebarVisible(false);
      } else {
        setSidebarCollapsed(false);
        setSidebarVisible(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHamburger = () => {
    setSidebarVisible((v) => !v);
  };

  return (
    <div className={cn('flex h-screen', designSystem.colors.bg.secondary)}>
      {/* Sidebar overlays content on mobile, inline on desktop */}
      {sidebarVisible && (
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentPage={currentPage}
          onNavigate={onNavigate}
          onNavigationHover={onNavigationHover}
          onCloseSidebar={() => setSidebarVisible(false)}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} onHamburger={handleHamburger} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

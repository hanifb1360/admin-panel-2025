//
import { Search, User, Activity, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { componentVariants, designSystem } from '../lib/designSystem';
import ThemeToggle from './ThemeToggle';
import ConnectionStatus from './ConnectionStatus';
import RealTimeNotifications from './RealTimeNotifications';
import { usePerformanceMonitor } from '../contexts/usePerformanceMonitor';

interface HeaderProps {
  title: string;
  onHamburger?: () => void;
}

export default function Header({ title, onHamburger }: HeaderProps) {
  const { isVisible, toggle } = usePerformanceMonitor();

  return (
    <header
      className={cn(
        designSystem.colors.bg.white,
        designSystem.colors.border.default,
        'border-b px-4 sm:px-6 py-3 sm:py-4'
      )}
    >
      <div className="flex items-center justify-between gap-2 w-full">
        {/* Left: Title and subtitle */}
        <div className="flex flex-col min-w-0">
          <h1 className={cn(
            designSystem.typography.heading.xl,
            designSystem.colors.text.primary,
            'truncate'
          )}>
            {title}
          </h1>
          <p className={cn(
            designSystem.typography.body.sm,
            designSystem.colors.text.secondary,
            'truncate hidden sm:block'
          )}>
            Welcome back, manage your dashboard
          </p>
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {/* Search */}
          <div className="relative">
            <Search className={cn(
              'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4',
              designSystem.colors.text.muted
            )} />
            <input
              type="text"
              placeholder="Search..."
              className={componentVariants.input.search}
            />
          </div>
          <ThemeToggle />
          <button
            onClick={toggle}
            className={cn(
              componentVariants.iconContainer.small,
              'transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700',
              isVisible
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            )}
            title={isVisible ? 'Hide Performance Monitor' : 'Show Performance Monitor'}
          >
            <Activity className="w-4 h-4" />
          </button>
          <ConnectionStatus />
          <RealTimeNotifications />
          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className={cn(
              componentVariants.iconContainer.small,
              designSystem.colors.bg.gray[300]
            )}>
              <User className={cn('w-4 h-4', designSystem.colors.text.secondary)} />
            </div>
            <div className={designSystem.typography.body.sm}>
              <p className={cn(designSystem.typography.weight.medium, designSystem.colors.text.primary)}>
                John Doe
              </p>
              <p className={designSystem.colors.text.secondary}>Admin</p>
            </div>
          </div>
        </div>

        {/* Mobile: Hamburger menu */}
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
          <button
            className={cn(
              componentVariants.iconContainer.small,
              'lg:hidden',
              'transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
            aria-label="Open menu"
            onClick={onHamburger}
          >
            <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
        </div>
      </div>

//
    </header>
  );
}

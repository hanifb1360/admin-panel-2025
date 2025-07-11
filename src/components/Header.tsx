import { Search, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { componentVariants, designSystem } from '../lib/designSystem';
import ThemeToggle from './ThemeToggle';
import ConnectionStatus from './ConnectionStatus';
import RealTimeNotifications from './RealTimeNotifications';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className={cn(
      designSystem.colors.bg.white,
      designSystem.colors.border.default,
      'border-b px-6 py-4'
    )}>
      <div className={designSystem.layout.flex.between}>
        <div>
          <h1 className={cn(designSystem.typography.heading.xl, designSystem.colors.text.primary)}>
            {title}
          </h1>
          <p className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary)}>
            Welcome back, manage your dashboard
          </p>
        </div>
        
        <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.md)}>
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
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Connection Status */}
          <ConnectionStatus />
          
          {/* Real-time Notifications */}
          <RealTimeNotifications />
          
          {/* User Profile */}
          <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.md)}>
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
      </div>
    </header>
  );
}

import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { componentVariants, designSystem } from '../lib/designSystem';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onNavigationHover?: (page: string) => void;
  onCloseSidebar?: () => void;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { name: 'Users', icon: Users, page: 'users' },
  { name: 'Forms', icon: FileText, page: 'forms' },
  { name: 'Orders', icon: ShoppingCart, page: 'orders' },
  { name: 'Products', icon: Package, page: 'products' },
  { name: 'Analytics', icon: BarChart3, page: 'analytics' },
  { name: 'Settings', icon: Settings, page: 'settings' },
];

export default function Sidebar({ 
  isCollapsed, 
  onToggle, 
  currentPage, 
  onNavigate, 
  onNavigationHover, 
  onCloseSidebar
}: SidebarProps) {
  // Overlay close button for mobile
  return (
    <div className={cn(
      componentVariants.sidebar.container,
      isCollapsed ? "w-16" : "w-64",
      'fixed z-40 top-0 left-0 h-full lg:static',
      'transition-all duration-200',
      'bg-white dark:bg-gray-900',
    )}>
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-2">
        <button onClick={onCloseSidebar} aria-label="Close sidebar" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      {/* Header */}
      <div className={cn(
        componentVariants.sidebar.header,
        isCollapsed && designSystem.layout.flex.center
      )}>
        <div className={cn(
          designSystem.layout.flex.start,
          designSystem.spacing.gap.sm,
          isCollapsed && designSystem.layout.flex.center
        )}>
          <div className={cn(
            componentVariants.iconContainer.small,
            designSystem.colors.primary[600]
          )}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className={cn(designSystem.typography.heading.lg)}>Admin Panel</span>
          )}
        </div>
        <button
          onClick={onToggle}
          className={cn(
            'p-1',
            designSystem.effects.rounded.lg,
            designSystem.states.hover.bg.gray800,
            designSystem.effects.transition.colors
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={componentVariants.sidebar.nav}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.name}
              onClick={() => onNavigate?.(item.page)}
              onMouseEnter={() => onNavigationHover?.(item.page)}
              className={cn(
                designSystem.layout.flex.start,
                designSystem.spacing.gap.md,
                'px-3 py-2 w-full',
                designSystem.effects.rounded.lg,
                designSystem.effects.transition.colors,
                isActive
                  ? cn(
                      // Active state: Use primary-600 for consistent branding
                      // Both light and dark modes use the same primary-600 for accessibility
                      'bg-primary-600 text-white shadow-sm',
                      'dark:bg-primary-600 dark:text-white',
                      'hover:bg-primary-700 dark:hover:bg-primary-700'
                    )
                  : cn(
                      'text-gray-300',
                      designSystem.states.hover.bg.gray800,
                      designSystem.states.hover.text.white
                    ),
                isCollapsed && cn(designSystem.layout.flex.center, 'px-2')
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={componentVariants.sidebar.footer}>
        <button
          className={cn(
            designSystem.layout.flex.start,
            designSystem.spacing.gap.md,
            'w-full px-3 py-2',
            designSystem.effects.rounded.lg,
            'text-gray-300',
            designSystem.states.hover.bg.gray800,
            designSystem.states.hover.text.white,
            designSystem.effects.transition.colors,
            isCollapsed && cn(designSystem.layout.flex.center, 'px-2')
          )}
          title={isCollapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}

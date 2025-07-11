import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { componentVariants, designSystem } from '../lib/designSystem';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/', current: true },
  { name: 'Users', icon: Users, href: '/users', current: false },
  { name: 'Orders', icon: ShoppingCart, href: '/orders', current: false },
  { name: 'Products', icon: Package, href: '/products', current: false },
  { name: 'Analytics', icon: BarChart3, href: '/analytics', current: false },
  { name: 'Settings', icon: Settings, href: '/settings', current: false },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <div className={cn(
      componentVariants.sidebar.container,
      isCollapsed ? "w-16" : "w-64"
    )}>
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
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                designSystem.layout.flex.start,
                designSystem.spacing.gap.md,
                'px-3 py-2',
                designSystem.effects.rounded.lg,
                designSystem.effects.transition.colors,
                item.current
                  ? cn(designSystem.colors.primary[600], designSystem.colors.text.white)
                  : cn('text-gray-300', designSystem.states.hover.bg.gray800, designSystem.states.hover.text.white),
                isCollapsed && cn(designSystem.layout.flex.center, 'px-2')
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </a>
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

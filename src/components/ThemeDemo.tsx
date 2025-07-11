import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import { designSystem } from '../lib/designSystem';

export default function ThemeDemo() {
  const { theme, effectiveTheme } = useTheme();

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      designSystem.colors.bg.secondary,
      designSystem.colors.border.default,
      'mb-6'
    )}>
      <h3 className={cn(
        designSystem.typography.heading.md,
        designSystem.colors.text.primary,
        'mb-2'
      )}>
        🎨 Theme System Demo
      </h3>
      <div className={cn(
        designSystem.layout.flex.start,
        designSystem.spacing.gap.md,
        'flex-wrap'
      )}>
        <div className={cn(
          'px-3 py-1 rounded-full text-sm',
          designSystem.colors.bg.primary,
          designSystem.colors.text.secondary,
          designSystem.colors.border.default,
          'border'
        )}>
          Selected: {theme}
        </div>
        <div className={cn(
          'px-3 py-1 rounded-full text-sm',
          designSystem.colors.bg.tertiary,
          designSystem.colors.text.secondary,
          designSystem.colors.border.default,
          'border'
        )}>
          Active: {effectiveTheme}
        </div>
      </div>
      <p className={cn(
        designSystem.typography.body.sm,
        designSystem.colors.text.secondary,
        'mt-2'
      )}>
        Click the theme toggle in the header to switch between light, dark, and system themes.
      </p>
    </div>
  );
}

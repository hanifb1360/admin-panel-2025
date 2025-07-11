import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import { designSystem } from '../lib/designSystem';

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = themeIcons[theme];

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative p-2',
        designSystem.effects.rounded.lg,
        designSystem.states.hover.bg.gray100,
        designSystem.effects.transition.colors,
        designSystem.states.focus.ring,
        'group'
      )}
      title={`Current theme: ${themeLabels[theme]}`}
    >
      <Icon className={cn('w-5 h-5', designSystem.colors.text.secondary)} />
      
      {/* Tooltip */}
      <div className={cn(
        'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        'px-2 py-1 text-xs rounded',
        designSystem.colors.bg.gray[900],
        designSystem.colors.text.white,
        'opacity-0 group-hover:opacity-100',
        designSystem.effects.transition.all,
        'pointer-events-none whitespace-nowrap'
      )}>
        {themeLabels[theme]} theme
      </div>
    </button>
  );
}

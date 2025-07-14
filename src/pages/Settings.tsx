import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { designSystem } from '../lib/designSystem';
import { Switch } from '../components/ui/Switch';
import { Card } from '../components/ui/Card';
import { Settings as SettingsIcon } from 'lucide-react';

const settingsOptions = [
  {
    key: 'darkMode',
    label: 'Dark Mode',
    description: 'Enable dark theme for the dashboard UI.',
    advanced: false,
  },
  {
    key: 'performanceOverlay',
    label: 'Performance Overlay',
    description: 'Show real-time performance metrics overlay.',
    advanced: false,
  },
  {
    key: 'reduceMotion',
    label: 'Reduce Motion',
    description: 'Minimize UI animations for accessibility.',
    advanced: true,
  },
  {
    key: 'experimentalFeatures',
    label: 'Experimental Features',
    description: 'Enable access to experimental dashboard features.',
    advanced: true,
  },
  {
    key: 'devTools',
    label: 'Developer Tools',
    description: 'Show developer tools and debug panels.',
    advanced: true,
  },
];


type SettingsState = {
  darkMode: boolean;
  performanceOverlay: boolean;
  reduceMotion: boolean;
  experimentalFeatures: boolean;
  devTools: boolean;
};

const defaultSettings: SettingsState = {
  darkMode: false,
  performanceOverlay: false,
  reduceMotion: false,
  experimentalFeatures: false,
  devTools: false,
};

export default function Settings() {
  const [settings, setSettings] = React.useState<SettingsState>(() => {
    const stored = localStorage.getItem('dashboard-settings');
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  React.useEffect(() => {
    localStorage.setItem('dashboard-settings', JSON.stringify(settings));
  }, [settings]);

  const handleToggle = (key: keyof SettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto py-12 space-y-10"
    >
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-800 via-indigo-800 to-purple-900 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900" />
        <div className="relative z-10 flex items-center gap-4 p-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 dark:bg-gray-900/30 shadow-lg">
            <SettingsIcon className="w-10 h-10 text-white dark:text-blue-200" />
          </div>
          <div>
            <h1 className={cn(
              designSystem.typography.display.lg,
              'text-white dark:text-blue-100 drop-shadow font-bold tracking-tight'
            )}>
              Settings
            </h1>
            <p className={cn(
              designSystem.typography.body.lg,
              'text-blue-100/95 dark:text-blue-200/80 mt-1'
            )}>
              Customize your dashboard experience. Advanced options are marked accordingly.
            </p>
          </div>
        </div>
      </div>

      {/* Settings grid*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {settingsOptions.map(option => (
          <Card
            key={option.key}
            className={cn(
              'flex items-center justify-between p-6 group transition-shadow duration-200',
              'bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700',
              'hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-500',
              option.advanced && 'ring-2 ring-blue-100 dark:ring-blue-900/30'
            )}
          >
            <div>
              <div className={cn(
                designSystem.typography.heading.md,
                'flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold'
              )}>
                {option.label}
                {option.advanced && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    Advanced
                  </span>
                )}
              </div>
              <div className={cn(
                designSystem.typography.body.sm,
                'text-gray-500 dark:text-gray-400 mt-1'
              )}>
                {option.description}
              </div>
            </div>
            <Switch
              checked={!!settings[option.key as keyof SettingsState]}
              onCheckedChange={() => handleToggle(option.key as keyof SettingsState)}
              ariaLabel={option.label}
            />
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

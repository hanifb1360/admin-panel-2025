import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { designSystem } from '../lib/designSystem';
import { Switch } from '../components/ui/Switch';
import { Card } from '../components/ui/Card';

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
      className="max-w-2xl mx-auto py-10 space-y-8"
    >
      <h1 className={cn(designSystem.typography.display.lg, designSystem.colors.text.primary)}>
        Settings
      </h1>
      <p className={cn(designSystem.typography.body.lg, designSystem.colors.text.secondary, 'mb-6')}>
        Customize your dashboard experience. Advanced options are marked accordingly.
      </p>
      <div className="space-y-6">
        {settingsOptions.map(option => (
          <Card key={option.key} className="flex items-center justify-between p-5">
            <div>
              <div className={cn(designSystem.typography.heading.md, 'flex items-center gap-2')}>
                {option.label}
                {option.advanced && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    Advanced
                  </span>
                )}
              </div>
              <div className={cn(designSystem.typography.body.sm, 'text-gray-500 dark:text-gray-400 mt-1')}>
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

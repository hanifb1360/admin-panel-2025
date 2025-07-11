import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { designSystem } from '../lib/designSystem';
import { useWebSocketContext } from '../hooks/useWebSocketContext';
import { type RealTimeUpdate } from '../contexts/WebSocketContext';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export default function RealTimeNotifications() {
  const { subscribeToUpdates } = useWebSocketContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToUpdates((update: RealTimeUpdate) => {
      // Convert real-time updates to notifications
      const notification: Notification = {
        id: update.id,
        type: getNotificationType(update.type),
        title: getNotificationTitle(update.type),
        message: getNotificationMessage(update),
        timestamp: update.timestamp,
        read: false,
      };

      setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep last 20
    });

    return unsubscribe;
  }, [subscribeToUpdates]);

  const getNotificationType = (updateType: RealTimeUpdate['type']): Notification['type'] => {
    switch (updateType) {
      case 'stats':
        return 'info';
      case 'activity':
        return 'success';
      case 'user':
        return 'info';
      case 'notification':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getNotificationTitle = (updateType: RealTimeUpdate['type']): string => {
    switch (updateType) {
      case 'stats':
        return 'Statistics Updated';
      case 'activity':
        return 'New Activity';
      case 'user':
        return 'User Update';
      case 'notification':
        return 'System Notification';
      default:
        return 'Update Received';
    }
  };

  const getNotificationMessage = (update: RealTimeUpdate): string => {
    try {
      const data = update.data as Record<string, unknown>;
      switch (update.type) {
        case 'stats':
          return `Dashboard statistics have been updated`;
        case 'activity':
          return `New ${data?.type || 'activity'} from ${data?.user || 'user'}`;
        case 'user':
          return `User ${data?.name || 'profile'} has been updated`;
        case 'notification':
          return (data?.message as string) || 'New system notification';
        default:
          return 'Real-time update received';
      }
    } catch {
      return 'Real-time update received';
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return designSystem.colors.text.success;
      case 'error':
        return designSystem.colors.text.error;
      case 'warning':
        return designSystem.colors.text.warning;
      default:
        return designSystem.colors.text.info;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2',
          designSystem.effects.rounded.lg,
          designSystem.states.hover.bg.gray100,
          designSystem.effects.transition.colors
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className={cn(
            'absolute -top-1 -right-1 w-5 h-5',
            'bg-red-500 text-white text-xs',
            designSystem.effects.rounded.full,
            designSystem.layout.flex.center,
            'font-medium'
          )}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className={cn(
          'absolute right-0 top-full mt-2 w-80 z-50',
          designSystem.colors.bg.white,
          designSystem.effects.rounded.lg,
          designSystem.effects.shadow.lg,
          'border border-gray-200 dark:border-gray-700',
          'max-h-96 overflow-hidden'
        )}>
          {/* Header */}
          <div className={cn(
            designSystem.layout.flex.between,
            'px-4 py-3 border-b border-gray-200 dark:border-gray-700'
          )}>
            <h3 className={cn(designSystem.typography.heading.sm)}>
              Notifications
            </h3>
            <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.sm)}>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className={cn(
                    designSystem.typography.body.sm,
                    designSystem.colors.text.link,
                    designSystem.states.hover.text.primary700
                  )}
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  'p-1',
                  designSystem.effects.rounded.md,
                  designSystem.states.hover.bg.gray100
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={cn(
                designSystem.layout.flex.center,
                'py-8',
                designSystem.colors.text.muted
              )}>
                <div className={cn(designSystem.layout.flex.col, 'items-center', designSystem.spacing.gap.sm)}>
                  <Bell className="w-8 h-8 opacity-50" />
                  <span className={designSystem.typography.body.sm}>
                    No notifications yet
                  </span>
                </div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    'px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0',
                    'cursor-pointer',
                    designSystem.states.hover.bg.gray50,
                    !notification.read && 'bg-primary-50 dark:bg-primary-900/10'
                  )}
                >
                  <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.sm)}>
                    <span className={cn(getNotificationColor(notification.type), 'mt-0.5')}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        designSystem.layout.flex.between,
                        designSystem.spacing.gap.sm,
                        'items-start'
                      )}>
                        <h4 className={cn(
                          designSystem.typography.body.sm,
                          designSystem.typography.weight.medium,
                          designSystem.colors.text.primary
                        )}>
                          {notification.title}
                        </h4>
                        <span className={cn(
                          designSystem.typography.body.xs,
                          designSystem.colors.text.muted,
                          'whitespace-nowrap'
                        )}>
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={cn(
                        designSystem.typography.body.sm,
                        designSystem.colors.text.secondary,
                        'mt-1'
                      )}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

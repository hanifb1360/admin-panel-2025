import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketContext } from './useWebSocketContext';
import { type RealTimeUpdate } from '../contexts/WebSocketContext';

export function useRealTimeUpdates() {
  const queryClient = useQueryClient();
  const { subscribeToUpdates } = useWebSocketContext();
  const isUpdating = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToUpdates((update: RealTimeUpdate) => {
      // Debounce updates to prevent excessive API calls
      if (isUpdating.current) return;
      
      isUpdating.current = true;
      
      // Handle different types of updates
      switch (update.type) {
        case 'stats':
          // Update dashboard stats
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          break;
          
        case 'activity':
          // Update activities list
          queryClient.invalidateQueries({ queryKey: ['activities'] });
          break;
          
        case 'user':
          // Update users list
          queryClient.invalidateQueries({ queryKey: ['users'] });
          break;
          
        case 'notification':
          // Notifications are handled by the notification component
          break;
          
        default:
          // For unknown types, invalidate all queries
          queryClient.invalidateQueries();
      }
      
      // Reset debounce flag after a short delay
      setTimeout(() => {
        isUpdating.current = false;
      }, 1000);
    });

    return unsubscribe;
  }, [subscribeToUpdates, queryClient]);

  return {
    // Could expose additional methods here if needed
    invalidateQueries: (queryKey: string[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}

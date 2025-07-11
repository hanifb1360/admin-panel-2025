import React, { createContext, useCallback, useEffect, useState, useMemo } from 'react';
import { useWebSocket, type WebSocketMessage } from '../hooks/useWebSocket';
import { mockWebSocketServer } from '../lib/mockWebSocketServer';

interface RealTimeUpdate {
  id: string;
  type: 'stats' | 'activity' | 'user' | 'notification';
  data: unknown;
  timestamp: number;
}

interface WebSocketContextType {
  connectionStatus: 'Connecting' | 'Connected' | 'Disconnected' | 'Error';
  lastUpdate: RealTimeUpdate | null;
  updates: RealTimeUpdate[];
  sendMessage: (message: unknown) => void;
  connect: () => void;
  disconnect: () => void;
  clearUpdates: () => void;
  subscribeToUpdates: (callback: (update: RealTimeUpdate) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export { WebSocketContext };

interface WebSocketProviderProps {
  children: React.ReactNode;
  url?: string;
  enabled?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  url = 'ws://localhost:8080',
  enabled = true 
}) => {
  const [lastUpdate, setLastUpdate] = useState<RealTimeUpdate | null>(null);
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [subscribers, setSubscribers] = useState<Set<(update: RealTimeUpdate) => void>>(new Set());
  const [useMockServer, setUseMockServer] = useState(false);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    // Transform WebSocket message to RealTimeUpdate
    const update: RealTimeUpdate = {
      id: `${Date.now()}-${Math.random()}`,
      type: message.type as RealTimeUpdate['type'],
      data: message.data,
      timestamp: message.timestamp || Date.now(),
    };

    setLastUpdate(update);
    setUpdates(prev => [...prev.slice(-99), update]); // Keep last 100 updates

    // Notify all subscribers
    subscribers.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in update subscriber:', error);
      }
    });
  }, [subscribers]);

  const handleMockUpdate = useCallback((update: RealTimeUpdate) => {
    setLastUpdate(update);
    setUpdates(prev => [...prev.slice(-99), update]); // Keep last 100 updates

    // Notify all subscribers
    subscribers.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in update subscriber:', error);
      }
    });
  }, [subscribers]);

  const {
    connectionStatus: wsConnectionStatus,
    sendMessage: wsSendMessage,
    connect: wsConnect,
    disconnect: wsDisconnect,
  } = useWebSocket({
    url,
    onMessage: handleMessage,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    onOpen: () => {
      console.log('WebSocket connected');
      setUseMockServer(false);
    },
    onClose: () => {
      console.log('WebSocket disconnected');
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
      // Fallback to mock server in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock server...');
        setUseMockServer(true);
      }
    },
  });

  // Mock server integration
  useEffect(() => {
    if (useMockServer || (process.env.NODE_ENV === 'development' && wsConnectionStatus === 'Disconnected')) {
      const unsubscribe = mockWebSocketServer.subscribe(handleMockUpdate);
      return unsubscribe;
    }
  }, [useMockServer, wsConnectionStatus, handleMockUpdate]);

  const connectionStatus = useMockServer ? 'Connected' : wsConnectionStatus;
  const sendMessage = useMockServer ? () => {} : wsSendMessage; // Mock server doesn't need to send messages
  const connect = useMemo(() => useMockServer ? () => {} : wsConnect, [useMockServer, wsConnect]);
  const disconnect = useMemo(() => useMockServer ? () => setUseMockServer(false) : wsDisconnect, [useMockServer, wsDisconnect]);

  const subscribeToUpdates = useCallback((callback: (update: RealTimeUpdate) => void) => {
    setSubscribers(prev => new Set([...prev, callback]));
    
    return () => {
      setSubscribers(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  }, []);

  const clearUpdates = useCallback(() => {
    setUpdates([]);
    setLastUpdate(null);
  }, []);

  // Auto-connect when enabled
  useEffect(() => {
    if (enabled && connectionStatus === 'Disconnected') {
      connect();
    }
  }, [enabled, connectionStatus, connect]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value: WebSocketContextType = {
    connectionStatus,
    lastUpdate,
    updates,
    sendMessage,
    connect,
    disconnect,
    clearUpdates,
    subscribeToUpdates,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export type { RealTimeUpdate };

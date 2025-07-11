// Mock WebSocket server simulator for development
// This simulates real-time updates when no actual WebSocket server is available

import { type RealTimeUpdate } from '../contexts/WebSocketContext';

export class MockWebSocketServer {
  private static instance: MockWebSocketServer;
  private intervals: NodeJS.Timeout[] = [];
  private callbacks: Set<(data: RealTimeUpdate) => void> = new Set();

  static getInstance(): MockWebSocketServer {
    if (!MockWebSocketServer.instance) {
      MockWebSocketServer.instance = new MockWebSocketServer();
    }
    return MockWebSocketServer.instance;
  }

  start() {
    // Simulate periodic stats updates
    this.intervals.push(
      setInterval(() => {
        this.broadcast({
          id: `stats-${Date.now()}`,
          type: 'stats',
          data: {
            totalUsers: Math.floor(Math.random() * 1000) + 5000,
            activeUsers: Math.floor(Math.random() * 500) + 2000,
            totalRevenue: Math.floor(Math.random() * 10000) + 50000,
          },
          timestamp: Date.now(),
        });
      }, 15000) // Every 15 seconds
    );

    // Simulate random activities
    this.intervals.push(
      setInterval(() => {
        const activities = ['login', 'order', 'signup', 'payment'];
        const users = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'];
        
        this.broadcast({
          id: `activity-${Date.now()}`,
          type: 'activity',
          data: {
            type: activities[Math.floor(Math.random() * activities.length)],
            user: users[Math.floor(Math.random() * users.length)],
            description: 'User performed an action',
            timestamp: Date.now(),
          },
          timestamp: Date.now(),
        });
      }, 8000) // Every 8 seconds
    );

    // Simulate user updates
    this.intervals.push(
      setInterval(() => {
        const users = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'];
        
        this.broadcast({
          id: `user-${Date.now()}`,
          type: 'user',
          data: {
            name: users[Math.floor(Math.random() * users.length)],
            action: 'updated profile',
          },
          timestamp: Date.now(),
        });
      }, 20000) // Every 20 seconds
    );

    // Simulate notifications
    this.intervals.push(
      setInterval(() => {
        const notifications = [
          'System maintenance scheduled for tonight',
          'New feature deployed successfully',
          'Weekly report is ready',
          'Security update completed',
        ];
        
        this.broadcast({
          id: `notification-${Date.now()}`,
          type: 'notification',
          data: {
            message: notifications[Math.floor(Math.random() * notifications.length)],
            severity: 'info',
          },
          timestamp: Date.now(),
        });
      }, 30000) // Every 30 seconds
    );

    console.log('Mock WebSocket server started');
  }

  stop() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.callbacks.clear();
    console.log('Mock WebSocket server stopped');
  }

  subscribe(callback: (data: RealTimeUpdate) => void) {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  private broadcast(data: RealTimeUpdate) {
    this.callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in mock server callback:', error);
      }
    });
  }
}

// Export singleton instance
export const mockWebSocketServer = MockWebSocketServer.getInstance();

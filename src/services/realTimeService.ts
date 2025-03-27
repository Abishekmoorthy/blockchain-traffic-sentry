
import { useState, useEffect, useCallback } from 'react';
import { awsConfig } from '../aws-config';
import { toast } from 'sonner';

// WebSocket connection status
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Custom hook for real-time traffic updates via WebSockets
export function useRealTimeUpdates<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      setStatus('connecting');
      const newSocket = new WebSocket(awsConfig.sockets.trafficUpdates);
      
      newSocket.onopen = () => {
        setStatus('connected');
        toast.success('Real-time connection established', { 
          description: 'You are now receiving live traffic updates.'
        });
      };

      newSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setData(prevData => ({ ...prevData, ...message }));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('error');
        toast.error('Connection error', {
          description: 'Failed to establish real-time connection. Using cached data.'
        });
      };

      newSocket.onclose = () => {
        setStatus('disconnected');
        toast.info('Real-time connection closed', {
          description: 'You are no longer receiving live updates.'
        });
        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      };

      setSocket(newSocket);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setStatus('error');
    }
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setStatus('disconnected');
    }
  }, [socket]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Send message to WebSocket
  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      toast.error('Cannot send update', {
        description: 'Real-time connection is not available.'
      });
    }
  }, [socket]);

  return { data, status, sendMessage, connect, disconnect };
}

// Mock WebSocket implementation for development and testing
// This simulates real-time data for local development
export function setupMockWebSocket() {
  // Create a mock implementation if WebSocket endpoint is not configured
  if (!awsConfig.sockets.trafficUpdates.includes('xxxx')) {
    return;
  }
  
  // Simulate real-time data updates for testing
  console.log('Setting up mock WebSocket for development');
  
  // Mock implementation of window.WebSocket
  const originalWebSocket = window.WebSocket;
  
  class MockWebSocket {
    onopen: ((this: WebSocket, ev: Event) => any) | null = null;
    onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
    onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
    onerror: ((this: WebSocket, ev: Event) => any) | null = null;
    readyState = WebSocket.CONNECTING;
    url: string;
    private mockDataInterval: number | null = null;
    
    constructor(url: string) {
      this.url = url;
      
      // Simulate connecting
      setTimeout(() => {
        this.readyState = WebSocket.OPEN;
        if (this.onopen) this.onopen(new Event('open'));
        
        // Start sending mock data
        this.mockDataInterval = window.setInterval(() => {
          if (this.onmessage) {
            const lane1Count = Math.floor(Math.random() * 10) + 15;
            const lane2Count = Math.floor(Math.random() * 10) + 10;
            const mockData = {
              lane1: { count: lane1Count, secure: Math.random() > 0.1 },
              lane2: { count: lane2Count, secure: Math.random() > 0.2 },
              timestamp: new Date().toISOString()
            };
            
            const mockEvent = {
              data: JSON.stringify(mockData)
            } as MessageEvent;
            
            this.onmessage(mockEvent);
          }
        }, 5000); // Update every 5 seconds
      }, 1000);
    }
    
    send(data: string) {
      console.log('Mock WebSocket send:', data);
    }
    
    close() {
      if (this.mockDataInterval) {
        clearInterval(this.mockDataInterval);
      }
      this.readyState = WebSocket.CLOSED;
      if (this.onclose) this.onclose(new CloseEvent('close'));
    }
  }
  
  // Replace WebSocket with mock for development
  window.WebSocket = MockWebSocket as any;
  
  // Clean up function to restore original WebSocket
  return () => {
    window.WebSocket = originalWebSocket;
  };
}

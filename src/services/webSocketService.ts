
import { toast } from "sonner";

export interface VehicleUpdate {
  lane: string;
  count: number;
}

interface WebSocketListeners {
  onVehicleUpdate?: (update: VehicleUpdate) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
  onAttackDetected?: (category: string, description: string) => void;
}

class TrafficWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private connected = false;
  private listeners: WebSocketListeners = {};
  private url: string = "";
  
  constructor() {
    // In a real app, you would get this from environment config
    this.url = "ws://localhost:8080"; // Replace with your actual WebSocket server URL
  }
  
  public connect(): void {
    if (this.ws) {
      this.disconnect();
    }
    
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.scheduleReconnect();
    }
  }
  
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  
  public isConnected(): boolean {
    return this.connected;
  }
  
  public addListener(listeners: WebSocketListeners): void {
    this.listeners = { ...this.listeners, ...listeners };
  }
  
  private handleOpen(): void {
    console.log("WebSocket connected successfully");
    this.connected = true;
    this.listeners.onConnectionStatusChange?.(true);
    toast.success("Real-time connection established");
  }
  
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === "vehicle_count") {
        const update: VehicleUpdate = {
          lane: data.lane,
          count: data.vehicle_count
        };
        this.listeners.onVehicleUpdate?.(update);
      }
      else if (data.type === "attack") {
        this.listeners.onAttackDetected?.(data.category, data.description);
        toast.warning(`Security Alert: ${data.category}`, {
          description: data.description,
        });
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  }
  
  private handleClose(): void {
    console.log("WebSocket connection closed");
    this.connected = false;
    this.ws = null;
    this.listeners.onConnectionStatusChange?.(false);
    this.scheduleReconnect();
  }
  
  private handleError(error: Event): void {
    console.error("WebSocket error:", error);
    toast.error("Connection error, attempting to reconnect...");
  }
  
  private scheduleReconnect(): void {
    if (this.reconnectTimer === null) {
      // Attempt to reconnect after 5 seconds
      this.reconnectTimer = window.setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, 5000);
    }
  }
}

// Create a mock WebSocket for local development
class MockWebSocketService extends TrafficWebSocketService {
  private mockInterval: number | null = null;
  
  public connect(): void {
    console.log("Connecting to mock WebSocket service");
    this.startMockMessages();
    
    // Simulate connection delay
    setTimeout(() => {
      this.handleOpen();
    }, 1000);
  }
  
  public disconnect(): void {
    if (this.mockInterval !== null) {
      window.clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }
  
  private handleOpen(): void {
    super.handleOpen();
  }
  
  private startMockMessages(): void {
    // Send mock vehicle count updates every 3 seconds
    this.mockInterval = window.setInterval(() => {
      const lane1Count = Math.floor(Math.random() * 20) + 5;
      const lane2Count = Math.floor(Math.random() * 20) + 5;
      
      const lane1Update = {
        type: "vehicle_count",
        lane: "Lane 1",
        vehicle_count: lane1Count
      };
      
      const lane2Update = {
        type: "vehicle_count",
        lane: "Lane 2", 
        vehicle_count: lane2Count
      };
      
      this.handleMessage({ data: JSON.stringify(lane1Update) } as MessageEvent);
      
      // Send lane 2 update slightly later
      setTimeout(() => {
        this.handleMessage({ data: JSON.stringify(lane2Update) } as MessageEvent);
      }, 500);
      
      // Occasionally send attack alerts
      if (Math.random() < 0.2) {
        const attackTypes = ["DoS", "Malformed Packet", "Spoofing"];
        const randomType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        const attackDetails = {
          type: "attack",
          category: randomType,
          description: `Simulated ${randomType} attack detected`
        };
        
        this.handleMessage({ data: JSON.stringify(attackDetails) } as MessageEvent);
      }
    }, 5000);
  }
}

// Use mock service for local development, real service for production
const webSocketService = process.env.NODE_ENV === "production" 
  ? new TrafficWebSocketService() 
  : new MockWebSocketService();

export default webSocketService;

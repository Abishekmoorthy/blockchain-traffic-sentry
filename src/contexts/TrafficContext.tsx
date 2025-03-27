
import React, { createContext, useContext, useState, useEffect } from "react";
import webSocketService, { VehicleUpdate } from "@/services/webSocketService";
import { fetchLatestSensorData, fetchAttackLogs, transformSensorDataForCharts, transformAttackDataForCharts } from "@/services/firebaseService";
import { useQuery } from "@tanstack/react-query";

interface TrafficLightState {
  laneId: string;
  vehicleCount: number;
  secured: boolean;
  lightState: 'red' | 'yellow' | 'green';
}

interface TrafficContextType {
  connected: boolean;
  lane1: TrafficLightState;
  lane2: TrafficLightState;
  lastAttack: { category: string; description: string; timestamp: string } | null;
  trafficData: { timestamp: string; lane1: number; lane2: number }[];
  securityData: { name: string; value: number; color: string }[];
  loading: boolean;
  refreshData: () => void;
}

const initialLaneState: TrafficLightState = {
  laneId: "",
  vehicleCount: 0,
  secured: true,
  lightState: 'red'
};

const TrafficContext = createContext<TrafficContextType>({
  connected: false,
  lane1: { ...initialLaneState, laneId: "Lane 1" },
  lane2: { ...initialLaneState, laneId: "Lane 2" },
  lastAttack: null,
  trafficData: [],
  securityData: [],
  loading: true,
  refreshData: () => {}
});

export const useTraffic = () => useContext(TrafficContext);

export const TrafficProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState(false);
  const [lane1, setLane1] = useState<TrafficLightState>({ 
    ...initialLaneState, 
    laneId: "Lane 1" 
  });
  const [lane2, setLane2] = useState<TrafficLightState>({ 
    ...initialLaneState, 
    laneId: "Lane 2" 
  });
  const [lastAttack, setLastAttack] = useState<{ 
    category: string; 
    description: string; 
    timestamp: string 
  } | null>(null);
  
  // Fetch data from Firebase
  const { 
    data: sensorData,
    isLoading: sensorLoading,
    refetch: refetchSensorData
  } = useQuery({
    queryKey: ['sensorData'],
    queryFn: fetchLatestSensorData,
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  const {
    data: attackData,
    isLoading: attackLoading,
    refetch: refetchAttackData
  } = useQuery({
    queryKey: ['attackData'],
    queryFn: fetchAttackLogs,
    refetchInterval: 30000
  });
  
  // Derived state for chart data
  const trafficData = sensorData ? transformSensorDataForCharts(sensorData) : [];
  const securityData = attackData ? transformAttackDataForCharts(attackData) : [];
  
  // The logic for updating traffic light state based on vehicle counts
  const updateTrafficLights = (lane1Count: number, lane2Count: number) => {
    // Traffic light color logic
    const getTrafficLightState = (count: number): 'red' | 'yellow' | 'green' => {
      if (count < 10) return 'green';
      if (count < 20) return 'yellow';
      return 'red';
    };
    
    // Get the base light states based on individual counts
    const lane1LightState = getTrafficLightState(lane1Count);
    const lane2LightState = getTrafficLightState(lane2Count);
    
    // Actual light logic: If lane1 > lane2, green light on lane1 and vice versa
    const lane1IsBusier = lane1Count > lane2Count;
    
    setLane1(prev => ({
      ...prev,
      vehicleCount: lane1Count,
      lightState: lane1IsBusier ? 'green' : 'red'
    }));
    
    setLane2(prev => ({
      ...prev,
      vehicleCount: lane2Count,
      lightState: lane1IsBusier ? 'red' : 'green'
    }));
  };
  
  // Refresh all data
  const refreshData = () => {
    refetchSensorData();
    refetchAttackData();
  };
  
  // Setup WebSocket listeners
  useEffect(() => {
    webSocketService.addListener({
      onConnectionStatusChange: (status) => {
        setConnected(status);
      },
      onVehicleUpdate: (update) => {
        if (update.lane === "Lane 1") {
          setLane1(prev => ({ 
            ...prev, 
            vehicleCount: update.count
          }));
        } else if (update.lane === "Lane 2") {
          setLane2(prev => ({ 
            ...prev, 
            vehicleCount: update.count
          }));
        }
        
        // Update traffic lights based on the latest vehicle counts
        if (update.lane === "Lane 1") {
          updateTrafficLights(update.count, lane2.vehicleCount);
        } else if (update.lane === "Lane 2") {
          updateTrafficLights(lane1.vehicleCount, update.count);
        }
      },
      onAttackDetected: (category, description) => {
        setLastAttack({
          category,
          description,
          timestamp: new Date().toLocaleString()
        });
        
        // If it's an attack on Lane 2, mark it as unsecured
        if (description.includes("Lane 2")) {
          setLane2(prev => ({ ...prev, secured: false }));
        }
      }
    });
    
    // Connect to WebSocket
    webSocketService.connect();
    
    // Update traffic lights initially if we have data
    if (sensorData) {
      const lane1Data = Object.values(sensorData['Lane_1'] || {});
      const lane2Data = Object.values(sensorData['Lane_2'] || {});
      
      if (lane1Data.length && lane2Data.length) {
        // Get the latest readings
        const latestLane1 = lane1Data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        
        const latestLane2 = lane2Data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        
        updateTrafficLights(
          latestLane1?.vehicle_count || 0,
          latestLane2?.vehicle_count || 0
        );
      }
    }
    
    return () => {
      webSocketService.disconnect();
    };
  }, [sensorData]);
  
  const value = {
    connected,
    lane1,
    lane2,
    lastAttack,
    trafficData,
    securityData,
    loading: sensorLoading || attackLoading,
    refreshData
  };
  
  return (
    <TrafficContext.Provider value={value}>
      {children}
    </TrafficContext.Provider>
  );
};

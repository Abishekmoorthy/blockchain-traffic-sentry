
import { toast } from "sonner";

const FIREBASE_RTD_URL = "https://iotsecurity-30d1a-default-rtdb.firebaseio.com";
const SENSOR_DATA_PATH = `${FIREBASE_RTD_URL}/sensors`;
const ATTACK_LOG_PATH = `${FIREBASE_RTD_URL}/attacks`;

export interface SensorData {
  lane: string;
  vehicle_count: number;
  timestamp: string;
}

export interface AttackData {
  category: string;
  description: string;
  timestamp: string;
}

/**
 * Fetches the latest vehicle count data for all lanes
 */
export const fetchLatestSensorData = async (): Promise<Record<string, SensorData[]>> => {
  try {
    const response = await fetch(`${SENSOR_DATA_PATH}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sensor data: ${response.statusText}`);
    }
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    toast.error("Failed to fetch sensor data");
    return {};
  }
};

/**
 * Fetches the latest attack logs
 */
export const fetchAttackLogs = async (): Promise<Record<string, AttackData>> => {
  try {
    const response = await fetch(`${ATTACK_LOG_PATH}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch attack logs: ${response.statusText}`);
    }
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error("Error fetching attack logs:", error);
    toast.error("Failed to fetch attack logs");
    return {};
  }
};

/**
 * Transforms the raw sensor data into a format suitable for charts
 */
export const transformSensorDataForCharts = (
  sensorData: Record<string, SensorData[]>
): { timestamp: string; lane1: number; lane2: number }[] => {
  const chartData: { timestamp: string; lane1: number; lane2: number }[] = [];
  
  // Extract and combine data from each lane
  const lane1Data = Object.values(sensorData['Lane_1'] || {});
  const lane2Data = Object.values(sensorData['Lane_2'] || {});
  
  // Sort data by timestamp (newest first)
  const sortedLane1 = lane1Data.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const sortedLane2 = lane2Data.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Take the last 24 entries (or however many are available)
  const last24Lane1 = sortedLane1.slice(0, 24).reverse();
  const last24Lane2 = sortedLane2.slice(0, 24).reverse();
  
  // Create chart data points pairing timestamps
  for (let i = 0; i < Math.max(last24Lane1.length, last24Lane2.length); i++) {
    const lane1 = last24Lane1[i]?.vehicle_count || 0;
    const lane2 = last24Lane2[i]?.vehicle_count || 0;
    const timestamp = last24Lane1[i]?.timestamp || last24Lane2[i]?.timestamp || "";
    
    if (timestamp) {
      // Format the timestamp to just show hour:minute
      const time = new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      
      chartData.push({
        timestamp: time,
        lane1,
        lane2,
      });
    }
  }
  
  return chartData;
};

/**
 * Transforms attack logs into chart data format
 */
export const transformAttackDataForCharts = (
  attackData: Record<string, AttackData>
): { name: string; value: number; color: string }[] => {
  const categories = new Map<string, number>();
  
  // Count occurrences of each attack category
  Object.values(attackData).forEach((attack) => {
    const current = categories.get(attack.category) || 0;
    categories.set(attack.category, current + 1);
  });
  
  // Define colors for different attack types
  const categoryColors: Record<string, string> = {
    "DoS": "#f87171", // red
    "Malformed Packet": "#facc15", // yellow
    "Spoofing": "#4ade80", // green
    "Unknown": "#94a3b8"  // gray
  };
  
  return Array.from(categories.entries()).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || categoryColors.Unknown,
  }));
};

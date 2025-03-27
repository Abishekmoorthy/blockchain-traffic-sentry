import { useEffect, useState } from "react";
import { Shield, Activity, AlertTriangle, Blocks, MapPin, WifiOff } from "lucide-react";
import StatCard from "@/components/cards/StatCard";
import SecurityChart from "@/components/charts/SecurityChart";
import TrafficLightCard from "@/components/cards/TrafficLightCard";
import GeolocationMap from "@/components/maps/GeolocationMap";
import BlockchainStatusCard from "@/components/blockchain/BlockchainStatus";
import LineChart from "@/components/charts/LineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRealTimeUpdates } from "@/services/realTimeService";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  stats: {
    devices: { value: number, trend: number };
    alerts: { value: number, trend: number };
    trafficFlow: { value: number, trend: number };
    blockchainHealth: { value: string, trend: number };
  };
  lane1: {
    count: number;
    secure: boolean;
  };
  lane2: {
    count: number;
    secure: boolean;
  };
  securityAlertData: Array<{ name: string; value: number; color: string }>;
  trafficData: Array<any>;
  blockchainBlocks: Array<any>;
  locationData: Array<any>;
}

const Dashboard = () => {
  const initialDashboardData: DashboardData = {
    stats: {
      devices: { value: 12, trend: 2 },
      alerts: { value: 7, trend: 5 },
      trafficFlow: { value: 345, trend: 12 },
      blockchainHealth: { value: "98%", trend: 1 },
    },
    lane1: {
      count: 22,
      secure: true,
    },
    lane2: {
      count: 18,
      secure: false,
    },
    securityAlertData: [
      { name: "Low", value: 25, color: "#4ade80" },
      { name: "Medium", value: 55, color: "#facc15" },
      { name: "High", value: 20, color: "#f87171" },
    ],
    trafficData: [
      { timestamp: "00:00", lane1: 12, lane2: 8 },
      { timestamp: "01:00", lane1: 10, lane2: 5 },
      { timestamp: "02:00", lane1: 8, lane2: 3 },
      { timestamp: "03:00", lane1: 5, lane2: 2 },
      { timestamp: "04:00", lane1: 7, lane2: 4 },
      { timestamp: "05:00", lane1: 10, lane2: 7 },
      { timestamp: "06:00", lane1: 15, lane2: 12 },
      { timestamp: "07:00", lane1: 22, lane2: 18 },
      { timestamp: "08:00", lane1: 28, lane2: 24 },
      { timestamp: "09:00", lane1: 25, lane2: 20 },
      { timestamp: "10:00", lane1: 22, lane2: 18 },
      { timestamp: "11:00", lane1: 20, lane2: 15 },
    ],
    blockchainBlocks: [
      { id: "1032", timestamp: "10:45:23", transactions: 5, hash: "0x8f24b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd58", previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000", nonce: 2834 },
      { id: "1031", timestamp: "10:30:12", transactions: 3, hash: "0x7a24b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd45", previousHash: "0x6124b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd12", nonce: 1482 },
      { id: "1030", timestamp: "10:15:45", transactions: 2, hash: "0x6124b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd12", previousHash: "0x5a24b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd78", nonce: 945 },
    ],
    locationData: [
      { id: "1", name: "Junction A", type: "Traffic", status: "active" },
      { id: "2", name: "Junction B", type: "Traffic", status: "active" },
      { id: "3", name: "Control Room", type: "Admin", status: "active" },
      { id: "4", name: "Junction C", type: "Traffic", status: "warning" },
    ],
  };

  const { data, status, sendMessage } = useRealTimeUpdates<DashboardData>(initialDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const times = Array.from({ length: 12 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const trafficData = times.map((time, index) => {
      const hour = parseInt(time.split(':')[0]);
      let lane1 = 10 + Math.floor(Math.random() * 15);
      let lane2 = 8 + Math.floor(Math.random() * 12);
      
      return {
        timestamp: time,
        lane1,
        lane2,
      };
    });
    
    sendMessage({ type: 'getDashboardData' });
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success("Dashboard loaded successfully", {
        description: `All IoT devices connected and blockchain verified. ${status === 'connected' ? 'Live data enabled.' : 'Using cached data.'}`,
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [status, sendMessage]);

  const trafficLines = [
    { dataKey: "lane1", color: "#60a5fa", name: "Lane 1" },
    { dataKey: "lane2", color: "#c084fc", name: "Lane 2" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-primary/70 animate-spin-slow" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-4 rounded-full border-b-2 border-primary/50 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-medium text-primary">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          {status === 'connected' ? (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              <Activity className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              <WifiOff className="h-3 w-3 mr-1" />
              Cached Data
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Monitored Devices" 
          value={data.stats.devices.value.toString()} 
          description="IoT devices active and monitored"
          icon={Activity}
          variant="primary"
          trend={{ value: data.stats.devices.trend, label: "from last week", isPositive: true }}
        />
        <StatCard 
          title="Security Alerts" 
          value={data.stats.alerts.value.toString()} 
          description="Active security alerts"
          icon={Shield}
          variant="danger"
          trend={{ value: data.stats.alerts.trend, label: "from yesterday", isPositive: false }}
        />
        <StatCard 
          title="Traffic Flow" 
          value={data.stats.trafficFlow.value.toString()} 
          description="Vehicles per hour"
          icon={Activity}
          variant="warning"
          trend={{ value: data.stats.trafficFlow.trend, label: "from yesterday", isPositive: true }}
        />
        <StatCard 
          title="Blockchain Health" 
          value={data.stats.blockchainHealth.value} 
          description="Network consensus"
          icon={Blocks}
          variant="success"
          trend={{ value: data.stats.blockchainHealth.trend, label: "from yesterday", isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <TrafficLightCard 
          id="lane1" 
          title="Lane 1 Traffic Light" 
          vehicleCount={data.lane1.count} 
          secure={data.lane1.secure}
          className="lg:col-span-1"
        />
        <TrafficLightCard 
          id="lane2" 
          title="Lane 2 Traffic Light" 
          vehicleCount={data.lane2.count} 
          secure={data.lane2.secure}
          className="lg:col-span-1"
        />
        <Tabs defaultValue="traffic" className="lg:col-span-2">
          <TabsList className="w-full">
            <TabsTrigger value="traffic" className="flex-1">Traffic Flow</TabsTrigger>
            <TabsTrigger value="security" className="flex-1">Security Alerts</TabsTrigger>
          </TabsList>
          <TabsContent value="traffic" className="mt-0 pt-4">
            <Card className="glass-card border-0">
              <CardContent className="p-0">
                <LineChart 
                  data={data.trafficData}
                  lines={trafficLines}
                  title="Hourly Traffic Flow"
                  description="Vehicle count by lane"
                  xAxisDataKey="timestamp"
                  yAxisLabel="Vehicles"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="mt-0 pt-4">
            <Card className="glass-card border-0">
              <CardContent className="p-0">
                <SecurityChart 
                  data={data.securityAlertData}
                  title="Alert Severity"
                  description="Distribution of alerts by severity level"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GeolocationMap 
          title="System Deployment"
          description="Geographic distribution of IoT devices"
          locations={data.locationData}
        />
        <BlockchainStatusCard 
          title="Blockchain Status"
          description="Latest blocks and verification status"
          blocks={data.blockchainBlocks}
          consensusLevel={98}
          verificationStatus="warning"
        />
      </div>
    </div>
  );
};

export default Dashboard;

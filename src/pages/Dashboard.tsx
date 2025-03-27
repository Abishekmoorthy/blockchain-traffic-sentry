
import { useEffect } from "react";
import { Shield, Activity, AlertTriangle, Blocks, MapPin } from "lucide-react";
import StatCard from "@/components/cards/StatCard";
import SecurityChart from "@/components/charts/SecurityChart";
import TrafficLightCard from "@/components/cards/TrafficLightCard";
import GeolocationMap from "@/components/maps/GeolocationMap";
import BlockchainStatusCard from "@/components/blockchain/BlockchainStatus";
import LineChart from "@/components/charts/LineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useTraffic } from "@/contexts/TrafficContext";

const Dashboard = () => {
  const { 
    connected, 
    lane1, 
    lane2, 
    trafficData, 
    securityData, 
    loading, 
    lastAttack 
  } = useTraffic();
  
  useEffect(() => {
    // Notify on dashboard load
    if (!loading) {
      toast.success("Dashboard loaded successfully", {
        description: `${connected ? "Real-time connection active" : "Using cached data"}.`,
      });
    }
  }, [loading, connected]);
  
  // Blockchain blocks data (static for now)
  const blockchainBlocks = [
    { id: "1032", timestamp: "10:45:23", transactions: 5, hash: "0x8f24b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd58", previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000", nonce: 2834 },
    { id: "1031", timestamp: "10:30:12", transactions: 3, hash: "0x7a24b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd45", previousHash: "0x6124b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd12", nonce: 1482 },
    { id: "1030", timestamp: "10:15:45", transactions: 2, hash: "0x6124b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd12", previousHash: "0x5a24b7e99a7968a2d3a72e24635378c454a091282aaf5d4e3b4d4d4c4d57cd78", nonce: 945 },
  ];
  
  // Location data with proper typing
  const locationData = [
    { id: "1", name: "Junction A", type: "Traffic", status: "active" },
    { id: "2", name: "Junction B", type: "Traffic", status: "active" },
    { id: "3", name: "Control Room", type: "Admin", status: "active" },
    { id: "4", name: "Junction C", type: "Traffic", status: lane2.secured ? "active" : "warning" },
  ];

  const trafficLines = [
    { dataKey: "lane1", color: "#60a5fa", name: "Lane 1" },
    { dataKey: "lane2", color: "#c084fc", name: "Lane 2" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className={`flex h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></span>
          <span className="text-sm">{connected ? "Real-time Connected" : "Offline Mode"}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Monitored Devices" 
          value="12" 
          description="IoT devices active and monitored"
          icon={Activity}
          variant="primary"
          trend={{ value: 2, label: "from last week", isPositive: true }}
        />
        <StatCard 
          title="Security Alerts" 
          value={securityData.reduce((total, item) => total + item.value, 0).toString()} 
          description={lastAttack ? `Last: ${lastAttack.category}` : "No recent alerts"}
          icon={Shield}
          variant="danger"
          trend={{ value: 5, label: "from yesterday", isPositive: false }}
        />
        <StatCard 
          title="Traffic Flow" 
          value={`${lane1.vehicleCount + lane2.vehicleCount}`} 
          description="Total vehicles detected"
          icon={Activity}
          variant="warning"
          trend={{ value: 12, label: "from yesterday", isPositive: true }}
        />
        <StatCard 
          title="Blockchain Health" 
          value="98%" 
          description="Network consensus"
          icon={Blocks}
          variant="success"
          trend={{ value: 1, label: "from yesterday", isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <TrafficLightCard 
          id="lane1" 
          title="Lane 1 Traffic Light" 
          vehicleCount={lane1.vehicleCount} 
          secure={lane1.secured}
          lightState={lane1.lightState}
          className="lg:col-span-1"
        />
        <TrafficLightCard 
          id="lane2" 
          title="Lane 2 Traffic Light" 
          vehicleCount={lane2.vehicleCount} 
          secure={lane2.secured}
          lightState={lane2.lightState}
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
                  data={trafficData}
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
                  data={securityData.length > 0 ? securityData : [
                    { name: "Low", value: 0, color: "#4ade80" },
                    { name: "Medium", value: 0, color: "#facc15" },
                    { name: "High", value: 0, color: "#f87171" },
                  ]}
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
          locations={locationData}
        />
        <BlockchainStatusCard 
          title="Blockchain Status"
          description="Latest blocks and verification status"
          blocks={blockchainBlocks}
          consensusLevel={98}
          verificationStatus={lane2.secured ? "secure" : "warning"}
        />
      </div>
    </div>
  );
};

export default Dashboard;

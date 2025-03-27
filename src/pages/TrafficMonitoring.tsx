
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Car, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import TrafficLightCard from "@/components/cards/TrafficLightCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTraffic } from "@/contexts/TrafficContext";

const TrafficMonitoring = () => {
  const { 
    lane1, 
    lane2, 
    trafficData, 
    lastAttack, 
    connected, 
    refreshData
  } = useTraffic();
  
  // Simulate an attack (for demo purposes)
  const simulateAttack = () => {
    // This is just for demo purposes - actually attacks would be detected by the system
    toast.warning("Security Alert", {
      description: "Simulated attack on Lane 2 traffic sensor.",
      action: {
        label: "View Details",
        onClick: () => console.log("Viewing tamper details"),
      },
    });
  };

  const trafficLines = [
    { dataKey: "lane1", color: "#60a5fa", name: "Lane 1" },
    { dataKey: "lane2", color: "#c084fc", name: "Lane 2" },
    { dataKey: "total", color: "#94a3b8", name: "Total" }
  ];
  
  // Create derived hourly/daily/weekly data
  const dailyData = trafficData
    .filter((_, i) => i % 3 === 0)
    .map((item, idx) => ({
      ...item,
      timestamp: `Day ${idx + 1}`
    }));
    
  const weeklyData = trafficData
    .filter((_, i) => i % 6 === 0)
    .map((item, idx) => ({
      ...item,
      timestamp: `Week ${idx + 1}`
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Traffic Monitoring</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant={lane2.secured ? "destructive" : "default"} 
            onClick={simulateAttack}
            className="flex items-center gap-2"
          >
            {lane2.secured ? (
              <>
                <AlertTriangle className="h-4 w-4" /> 
                Simulate Attack
              </>
            ) : (
              <>
                <Activity className="h-4 w-4" /> 
                Restore Security
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={refreshData}
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 ml-2">
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></span>
            <span className="text-sm">{connected ? "Live" : "Offline"}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrafficLightCard 
          id="lane1-detailed" 
          title="Lane 1 Traffic Light" 
          vehicleCount={lane1.vehicleCount} 
          secure={lane1.secured}
          lightState={lane1.lightState}
          className="h-full"
        />
        <TrafficLightCard 
          id="lane2-detailed" 
          title="Lane 2 Traffic Light" 
          vehicleCount={lane2.vehicleCount} 
          secure={lane2.secured}
          lightState={lane2.lightState}
          className="h-full"
        />
      </div>
      
      <Tabs defaultValue="hourly">
        <TabsList className="w-full max-w-[400px] mx-auto">
          <TabsTrigger value="hourly" className="flex-1">Hourly</TabsTrigger>
          <TabsTrigger value="daily" className="flex-1">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
        </TabsList>
        <TabsContent value="hourly" className="mt-4">
          <LineChart 
            data={trafficData}
            lines={trafficLines}
            title="Today's Traffic Flow"
            description="Vehicle count by lane per hour"
            xAxisDataKey="timestamp"
            yAxisLabel="Vehicles"
          />
        </TabsContent>
        <TabsContent value="daily" className="mt-4">
          <LineChart 
            data={dailyData}
            lines={trafficLines}
            title="Daily Traffic Flow"
            description="Average vehicle count by lane per day"
            xAxisDataKey="timestamp"
            yAxisLabel="Avg. Vehicles"
          />
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          <LineChart 
            data={weeklyData}
            lines={trafficLines}
            title="Weekly Traffic Flow"
            description="Average vehicle count by lane per week"
            xAxisDataKey="timestamp"
            yAxisLabel="Avg. Vehicles"
          />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Traffic Light Logic
            </CardTitle>
            <CardDescription>
              How traffic lights change based on vehicle count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
                <div className="light-green active w-10 h-10"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Green Light</div>
                  <div className="text-xs text-muted-foreground">Activated on lane with fewer vehicles</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
                <div className="light-red active w-10 h-10"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Red Light</div>
                  <div className="text-xs text-muted-foreground">Activated on lane with more vehicles</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg mt-4">
                <div className="text-sm font-medium">Current Traffic Rule</div>
                <div className="text-xs mt-1">
                  If Lane 1 ({lane1.vehicleCount} vehicles) has more traffic than Lane 2 ({lane2.vehicleCount} vehicles), 
                  Lane 1 gets the green light and Lane 2 gets the red light, and vice versa.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Potential Security Threats
            </CardTitle>
            <CardDescription>
              Common attack vectors on traffic management systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-secondary/30 rounded-lg">
                <div className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-500 p-1 rounded">1</span>
                  Spoofing Sensor Data
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Attackers can spoof IoT sensor data to manipulate traffic light decisions.
                </div>
              </div>
              
              <div className="p-3 bg-secondary/30 rounded-lg">
                <div className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-500 p-1 rounded">2</span>
                  Man-in-the-Middle Attack
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Intercepting communications between IoT devices and control systems.
                </div>
              </div>
              
              <div className="p-3 bg-secondary/30 rounded-lg">
                <div className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-500 p-1 rounded">3</span>
                  Denial of Service
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Flooding the system with traffic to prevent legitimate sensor data from being processed.
                </div>
              </div>
              
              {lastAttack && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mt-2">
                  <div className="text-sm font-medium text-red-500">Latest Attack Detected</div>
                  <div className="text-xs mt-1">
                    <span className="font-medium">{lastAttack.category}:</span> {lastAttack.description}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {lastAttack.timestamp}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrafficMonitoring;


import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Car, AlertTriangle, ArrowRight } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import TrafficLightCard from "@/components/cards/TrafficLightCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TrafficMonitoring = () => {
  const [lane1Data, setLane1Data] = useState({
    count: 22,
    secure: true,
    history: [15, 18, 22, 25, 22, 20, 22]
  });
  
  const [lane2Data, setLane2Data] = useState({
    count: 18,
    secure: false,
    history: [10, 15, 12, 18, 20, 18, 18]
  });
  
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate historical data
    const times = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const data = times.map((time, index) => {
      const hour = parseInt(time.split(':')[0]);
      let lane1;
      let lane2;
      
      // Create realistic traffic patterns (higher during rush hours)
      if (hour >= 7 && hour <= 9) {
        // Morning rush
        lane1 = 20 + Math.floor(Math.random() * 10);
        lane2 = 15 + Math.floor(Math.random() * 10);
      } else if (hour >= 16 && hour <= 18) {
        // Evening rush
        lane1 = 18 + Math.floor(Math.random() * 12);
        lane2 = 16 + Math.floor(Math.random() * 8);
      } else if (hour >= 22 || hour <= 5) {
        // Late night/early morning
        lane1 = 3 + Math.floor(Math.random() * 7);
        lane2 = 2 + Math.floor(Math.random() * 5);
      } else {
        // Regular day hours
        lane1 = 10 + Math.floor(Math.random() * 8);
        lane2 = 8 + Math.floor(Math.random() * 7);
      }
      
      return {
        timestamp: time,
        lane1,
        lane2,
        total: lane1 + lane2
      };
    });
    
    setHistoricalData(data);
    
    // Simulate lane 2 tampering alert after delay
    const timer = setTimeout(() => {
      if (!lane2Data.secure) {
        toast.warning("Security Alert", {
          description: "Tampering detected in Lane 2 vehicle count. Blockchain verification failed.",
          action: {
            label: "View Details",
            onClick: () => console.log("Viewing tamper details"),
          },
        });
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate an attack (for demo purposes)
  const simulateAttack = () => {
    // Toggle lane 2 security status
    setLane2Data(prev => ({
      ...prev,
      secure: !prev.secure
    }));
    
    if (lane2Data.secure) {
      toast.error("Lane 2 under attack", {
        description: "Unauthorized modification of vehicle count detected.",
        action: {
          label: "Verify Blockchain",
          onClick: () => console.log("Verifying blockchain"),
        },
      });
    } else {
      toast.success("Lane 2 secured", {
        description: "Blockchain verification restored and vehicle count validated.",
      });
    }
  };

  const trafficLines = [
    { dataKey: "lane1", color: "#60a5fa", name: "Lane 1" },
    { dataKey: "lane2", color: "#c084fc", name: "Lane 2" },
    { dataKey: "total", color: "#94a3b8", name: "Total" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Traffic Monitoring</h1>
        <Button 
          variant={lane2Data.secure ? "destructive" : "default"} 
          onClick={simulateAttack}
          className="flex items-center gap-2"
        >
          {lane2Data.secure ? (
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrafficLightCard 
          id="lane1-detailed" 
          title="Lane 1 Traffic Light" 
          vehicleCount={lane1Data.count} 
          secure={lane1Data.secure}
          className="h-full"
        />
        <TrafficLightCard 
          id="lane2-detailed" 
          title="Lane 2 Traffic Light" 
          vehicleCount={lane2Data.count} 
          secure={lane2Data.secure}
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
            data={historicalData}
            lines={trafficLines}
            title="Today's Traffic Flow"
            description="Vehicle count by lane per hour"
            xAxisDataKey="timestamp"
            yAxisLabel="Vehicles"
          />
        </TabsContent>
        <TabsContent value="daily" className="mt-4">
          <LineChart 
            data={historicalData.filter((_, i) => i % 3 === 0).map(item => ({
              ...item,
              timestamp: `Day ${Math.floor(Math.random() * 30) + 1}`
            }))}
            lines={trafficLines}
            title="Daily Traffic Flow"
            description="Average vehicle count by lane per day"
            xAxisDataKey="timestamp"
            yAxisLabel="Avg. Vehicles"
          />
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          <LineChart 
            data={historicalData.filter((_, i) => i % 6 === 0).map(item => ({
              ...item,
              timestamp: `Week ${Math.floor(Math.random() * 4) + 1}`
            }))}
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
                  <div className="text-xs text-muted-foreground">Activated when vehicle count &lt; 10</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
                <div className="light-yellow active w-10 h-10"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Yellow Light</div>
                  <div className="text-xs text-muted-foreground">Activated when 10 ≤ vehicle count &lt; 20</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
                <div className="light-red active w-10 h-10"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Red Light</div>
                  <div className="text-xs text-muted-foreground">Activated when vehicle count ≥ 20</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrafficMonitoring;

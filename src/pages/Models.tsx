
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, AlertTriangle, Clock, Calendar, BarChart2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LineChart from "@/components/charts/LineChart";
import { toast } from "sonner";

const Models = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("hourly");
  const [isLoading, setIsLoading] = useState(false);
  const [trafficData, setTrafficData] = useState(() => generateMockTrafficData());
  const [attackData, setAttackData] = useState(() => generateMockAttackData());
  
  // Function to generate mock traffic data
  function generateMockTrafficData() {
    if (selectedTimeframe === "hourly") {
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0') + ":00";
        return {
          timestamp: hour,
          lane1: 5 + Math.floor(Math.random() * 25),
          lane2: 4 + Math.floor(Math.random() * 20)
        };
      });
    } else if (selectedTimeframe === "daily") {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return days.map(day => ({
        timestamp: day,
        lane1: 100 + Math.floor(Math.random() * 200),
        lane2: 80 + Math.floor(Math.random() * 180)
      }));
    } else {
      return Array.from({ length: 4 }, (_, i) => ({
        timestamp: `Week ${i + 1}`,
        lane1: 700 + Math.floor(Math.random() * 500),
        lane2: 600 + Math.floor(Math.random() * 450)
      }));
    }
  }
  
  // Function to generate mock attack probability data
  function generateMockAttackData() {
    if (selectedTimeframe === "hourly") {
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0') + ":00";
        // Higher probability during unusual hours (night)
        const probability = (i >= 22 || i <= 5) ? 
          0.3 + Math.random() * 0.4 : 
          0.05 + Math.random() * 0.15;
        return {
          timestamp: hour,
          probability: parseFloat(probability.toFixed(2))
        };
      });
    } else if (selectedTimeframe === "daily") {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return days.map(day => ({
        timestamp: day,
        // Higher probability on weekends
        probability: parseFloat((day === "Saturday" || day === "Sunday" ? 
          0.2 + Math.random() * 0.3 : 
          0.1 + Math.random() * 0.15).toFixed(2))
      }));
    } else {
      return Array.from({ length: 4 }, (_, i) => ({
        timestamp: `Week ${i + 1}`,
        probability: parseFloat((0.1 + Math.random() * 0.2).toFixed(2))
      }));
    }
  }
  
  const refreshPredictions = () => {
    setIsLoading(true);
    toast.info("Fetching new predictions...");
    
    // Simulate API call to ML models
    setTimeout(() => {
      setTrafficData(generateMockTrafficData());
      setAttackData(generateMockAttackData());
      setIsLoading(false);
      toast.success("Predictions updated with latest data");
    }, 1500);
  };
  
  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
    setIsLoading(true);
    
    // Simulate loading new data
    setTimeout(() => {
      setTrafficData(generateMockTrafficData());
      setAttackData(generateMockAttackData());
      setIsLoading(false);
    }, 800);
  };
  
  // Chart configuration
  const trafficLines = [
    { dataKey: "lane1", color: "#60a5fa", name: "Lane 1" },
    { dataKey: "lane2", color: "#c084fc", name: "Lane 2" }
  ];
  
  const attackLines = [
    { dataKey: "probability", color: "#f87171", name: "Attack Probability" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Predictive Models</h1>
        <Button 
          onClick={refreshPredictions} 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Predictions
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          <span className="font-medium">Time Period:</span>
        </div>
        <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Hourly</span>
            </SelectItem>
            <SelectItem value="daily" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Daily</span>
            </SelectItem>
            <SelectItem value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Weekly</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          Predictions based on ML models trained with historical data
        </div>
      </div>
      
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="traffic" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Traffic Prediction
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Attack Prediction
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="traffic" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Vehicle Count Prediction</CardTitle>
              <CardDescription>
                Predicted vehicle counts for Lane 1 and Lane 2 using XGBoost model
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin-slow"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-primary/70 animate-spin-slow" style={{ animationDuration: '2s' }}></div>
                  </div>
                </div>
              ) : (
                <>
                  <LineChart 
                    data={trafficData}
                    lines={trafficLines}
                    title={`${selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)} Traffic Prediction`}
                    description={`Predicted vehicle count by lane per ${selectedTimeframe.slice(0, -2)}`}
                    xAxisDataKey="timestamp"
                    yAxisLabel="Predicted Vehicles"
                  />
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                      <div className="text-sm font-medium text-blue-500">Model Details</div>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Algorithm:</span>
                          <span className="text-xs font-medium">XGBoost</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Features:</span>
                          <span className="text-xs font-medium">Hour, Day, Minute, Lane</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Accuracy:</span>
                          <span className="text-xs font-medium">92.7%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                      <div className="text-sm font-medium">Insights</div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <ul className="space-y-2">
                          <li>• Higher traffic expected during morning (7-9 AM) and evening (4-6 PM) rush hours</li>
                          <li>• Lane 1 consistently busier than Lane 2</li>
                          <li>• Weekday peaks higher than weekend peaks</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Attack Probability Prediction</CardTitle>
              <CardDescription>
                Predicted probability of security attacks using ML model
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin-slow"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-primary/70 animate-spin-slow" style={{ animationDuration: '2s' }}></div>
                  </div>
                </div>
              ) : (
                <>
                  <LineChart 
                    data={attackData}
                    lines={attackLines}
                    title={`${selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)} Attack Prediction`}
                    description={`Predicted probability of attacks per ${selectedTimeframe.slice(0, -2)}`}
                    xAxisDataKey="timestamp"
                    yAxisLabel="Probability"
                  />
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
                      <div className="text-sm font-medium text-red-500">Model Details</div>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Algorithm:</span>
                          <span className="text-xs font-medium">XGBoost (Binary Classification)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Features:</span>
                          <span className="text-xs font-medium">Hour, Day, Minute</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">AUC Score:</span>
                          <span className="text-xs font-medium">0.89</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                      <div className="text-sm font-medium">Security Insights</div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <ul className="space-y-2">
                          <li>• Higher attack probability during night hours (10 PM - 6 AM)</li>
                          <li>• Weekends show elevated risk profiles</li>
                          <li>• Periodic patterns suggest automated attack attempts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">High-Risk Period Detected</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Model predicts elevated attack risk during late night hours. Increased monitoring and security measures recommended.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>AWS Deployment Information</CardTitle>
          <CardDescription>
            Information about the machine learning models deployed in AWS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                <div className="font-medium">Traffic Prediction Model</div>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span>AWS SageMaker</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model Type:</span>
                    <span>XGBoost Regressor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Endpoint:</span>
                    <span className="font-mono text-xs">traffic-prediction-endpoint</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                <div className="font-medium">Attack Prediction Model</div>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span>AWS SageMaker</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model Type:</span>
                    <span>XGBoost Classifier</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Endpoint:</span>
                    <span className="font-mono text-xs">attack-prediction-endpoint</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Note: The actual models are deployed in AWS SageMaker and accessed via REST API endpoints. This interface provides a visualization of the prediction results.</p>
              <p className="mt-1">In a production environment, this would connect to the AWS endpoints to fetch real-time predictions.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Models;


import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Search, Share, Download, ShieldAlert, RefreshCw } from "lucide-react";
import LogsTable from "@/components/tables/LogsTable";
import SecurityChart from "@/components/charts/SecurityChart";
import { toast } from "sonner";

interface Log {
  id: string;
  timestamp: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
}

const SecurityLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const refreshLogs = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    toast.info("Refreshing security logs...");
  };
  
  useEffect(() => {
    // Simulate fetching logs from the API
    const generateLogs = () => {
      const sources = ["ESP32 Lane 1", "ESP32 Lane 2", "Blockchain Node", "Central System"];
      const criticalMessages = [
        "Unauthorized access attempt detected",
        "Vehicle count tampered",
        "Blockchain verification failed",
        "Sensor data manipulation detected",
        "Critical IoT device firmware tampering"
      ];
      const warningMessages = [
        "Unusual traffic pattern detected",
        "Network latency spike detected",
        "Multiple authentication attempts",
        "IoT device restarted unexpectedly",
        "Slow blockchain verification"
      ];
      const infoMessages = [
        "System health check completed",
        "Blockchain verification successful",
        "Traffic light state changed",
        "Daily backup completed",
        "Software update available"
      ];
      
      // Generate random timestamp for the last 24 hours
      const getRandomTimestamp = () => {
        const now = new Date();
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        const seconds = Math.floor(Math.random() * 60);
        now.setHours(now.getHours() - hours);
        now.setMinutes(minutes);
        now.setSeconds(seconds);
        return now.toISOString().replace('T', ' ').substr(0, 19);
      };
      
      // Generate random logs
      const newLogs: Log[] = [];
      
      // Add 5 critical logs
      for (let i = 0; i < 5; i++) {
        newLogs.push({
          id: `c-${i}`,
          timestamp: getRandomTimestamp(),
          message: criticalMessages[Math.floor(Math.random() * criticalMessages.length)],
          severity: 'critical',
          source: sources[Math.floor(Math.random() * sources.length)]
        });
      }
      
      // Add 8 warning logs
      for (let i = 0; i < 8; i++) {
        newLogs.push({
          id: `w-${i}`,
          timestamp: getRandomTimestamp(),
          message: warningMessages[Math.floor(Math.random() * warningMessages.length)],
          severity: 'warning',
          source: sources[Math.floor(Math.random() * sources.length)]
        });
      }
      
      // Add 10 info logs
      for (let i = 0; i < 10; i++) {
        newLogs.push({
          id: `i-${i}`,
          timestamp: getRandomTimestamp(),
          message: infoMessages[Math.floor(Math.random() * infoMessages.length)],
          severity: 'info',
          source: sources[Math.floor(Math.random() * sources.length)]
        });
      }
      
      // Sort logs by timestamp (newest first)
      newLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return newLogs;
    };
    
    // Simulate API request
    setTimeout(() => {
      const newLogs = generateLogs();
      setLogs(newLogs);
      setFilteredLogs(newLogs);
      setIsLoading(false);
      
      // Simulate a new security alert after a delay
      setTimeout(() => {
        const newCriticalLog: Log = {
          id: `c-new-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
          message: "New security breach attempt detected on Lane 2",
          severity: 'critical',
          source: "ESP32 Lane 2"
        };
        
        setLogs(prev => [newCriticalLog, ...prev]);
        setFilteredLogs(prev => [newCriticalLog, ...prev]);
        
        toast.error("Security Alert", {
          description: "New security breach attempt detected on Lane 2",
          action: {
            label: "View",
            onClick: () => console.log("Viewing alert details"),
          },
        });
      }, 10000);
    }, 1500);
  }, [refreshKey]);
  
  useEffect(() => {
    // Filter logs based on search query and severity filters
    let filtered = logs;
    
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterSeverity.length > 0) {
      filtered = filtered.filter(log => filterSeverity.includes(log.severity));
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchQuery, filterSeverity]);
  
  // Calculate security data for pie chart
  const securityData = [
    { name: "Critical", value: logs.filter(log => log.severity === 'critical').length, color: "#f87171" },
    { name: "Warning", value: logs.filter(log => log.severity === 'warning').length, color: "#facc15" },
    { name: "Info", value: logs.filter(log => log.severity === 'info').length, color: "#60a5fa" },
  ];
  
  // Calculate source data for pie chart
  const sourceData = logs.reduce((acc, log) => {
    const sourceIndex = acc.findIndex(item => item.name === log.source);
    if (sourceIndex >= 0) {
      acc[sourceIndex].value += 1;
    } else {
      const colors = ["#60a5fa", "#c084fc", "#4ade80", "#f97316"];
      acc.push({
        name: log.source,
        value: 1,
        color: colors[acc.length % colors.length]
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Security Logs</h1>
        <Button onClick={refreshLogs} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SecurityChart 
          data={securityData}
          title="Security Alerts by Severity"
          description="Distribution of security alerts by severity level"
        />
        <SecurityChart 
          data={sourceData}
          title="Security Alerts by Source"
          description="Distribution of security alerts by source"
        />
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                Security Event Logs
              </CardTitle>
              <CardDescription>
                Complete history of security events and alerts
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filterSeverity.includes('critical')}
                  onCheckedChange={(checked) => {
                    setFilterSeverity(prev => 
                      checked 
                        ? [...prev, 'critical'] 
                        : prev.filter(s => s !== 'critical')
                    );
                  }}
                >
                  Critical
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterSeverity.includes('warning')}
                  onCheckedChange={(checked) => {
                    setFilterSeverity(prev => 
                      checked 
                        ? [...prev, 'warning'] 
                        : prev.filter(s => s !== 'warning')
                    );
                  }}
                >
                  Warning
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterSeverity.includes('info')}
                  onCheckedChange={(checked) => {
                    setFilterSeverity(prev => 
                      checked 
                        ? [...prev, 'info'] 
                        : prev.filter(s => s !== 'info')
                    );
                  }}
                >
                  Info
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterSeverity([])}>
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin-slow"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-primary/70 animate-spin-slow" style={{ animationDuration: '2s' }}></div>
              </div>
            </div>
          ) : (
            <LogsTable 
              logs={filteredLogs}
              title=""
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityLogs;

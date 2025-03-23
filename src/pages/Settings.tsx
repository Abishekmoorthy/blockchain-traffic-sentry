
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Bell, Shield, Network, Save, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoDetectionEnabled, setAutoDetectionEnabled] = useState(true);
  const [blockchainEnabled, setBlockchainEnabled] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  
  const saveSettings = () => {
    toast.success("Settings saved successfully", {
      description: "Your configuration changes have been applied.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your IoT blockchain security system
          </p>
        </div>
      </div>
      
      <Alert className="glass">
        <Shield className="h-4 w-4" />
        <AlertTitle>Security recommendation</AlertTitle>
        <AlertDescription>
          We recommend keeping blockchain verification and attack detection enabled for maximum security.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              System Configuration
            </CardTitle>
            <CardDescription>
              Configure the core settings for your IoT security system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">ESP32 Devices</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lane1-ip">Lane 1 IP Address</Label>
                    <Input id="lane1-ip" placeholder="192.168.1.101" defaultValue="192.168.1.101" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lane1-port">Lane 1 Port</Label>
                    <Input id="lane1-port" placeholder="8080" defaultValue="8080" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lane2-ip">Lane 2 IP Address</Label>
                    <Input id="lane2-ip" placeholder="192.168.1.102" defaultValue="192.168.1.102" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lane2-port">Lane 2 Port</Label>
                    <Input id="lane2-port" placeholder="8080" defaultValue="8080" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Blockchain Network</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="node-count">Node Count</Label>
                    <Input id="node-count" placeholder="4" defaultValue="4" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consensus-threshold">Consensus Threshold (%)</Label>
                    <Input id="consensus-threshold" placeholder="75" defaultValue="75" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-time">Target Block Time (s)</Label>
                    <Input id="block-time" placeholder="2.5" defaultValue="2.5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="verification-interval">Verification Interval (s)</Label>
                    <Input id="verification-interval" placeholder="10" defaultValue="10" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Traffic Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="green-threshold">Green Light Threshold</Label>
                    <Input id="green-threshold" placeholder="10" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yellow-threshold">Yellow Light Threshold</Label>
                    <Input id="yellow-threshold" placeholder="20" defaultValue="20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sensor-interval">Sensor Update Interval (s)</Label>
                    <Input id="sensor-interval" placeholder="5" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="light-duration">Light Change Duration (s)</Label>
                    <Input id="light-duration" placeholder="30" defaultValue="30" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={saveSettings} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive alerts for security events
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Send critical alerts via email
                  </p>
                </div>
                <Switch id="email-alerts" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-alerts">SMS Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Send critical alerts via SMS
                  </p>
                </div>
                <Switch id="sms-alerts" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
              <CardDescription>
                Configure security and monitoring settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-detection">Auto Attack Detection</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically detect security breaches
                  </p>
                </div>
                <Switch
                  id="auto-detection"
                  checked={autoDetectionEnabled}
                  onCheckedChange={setAutoDetectionEnabled}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="blockchain-verify">Blockchain Verification</Label>
                  <p className="text-xs text-muted-foreground">
                    Use blockchain to verify data integrity
                  </p>
                </div>
                <Switch
                  id="blockchain-verify"
                  checked={blockchainEnabled}
                  onCheckedChange={setBlockchainEnabled}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto Refresh Data</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically refresh dashboard data
                  </p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={autoRefreshEnabled}
                  onCheckedChange={setAutoRefreshEnabled}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                Network
              </CardTitle>
              <CardDescription>
                Configure network and connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input id="api-endpoint" placeholder="https://api.example.com" defaultValue="https://api.blockchain-traffic.io" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Data Refresh Interval (s)</Label>
                <Input id="refresh-interval" placeholder="30" defaultValue="30" />
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="ssl-enabled">SSL Encryption</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable secure connection with SSL
                  </p>
                </div>
                <Switch id="ssl-enabled" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

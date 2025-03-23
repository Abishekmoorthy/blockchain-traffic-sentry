import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Blocks, CheckCircle2, XCircle, ArrowRight, Shield, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import BlockchainStatusCard from "@/components/blockchain/BlockchainStatus";
import LineChart from "@/components/charts/LineChart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BlockData {
  id: string;
  timestamp: string;
  transactions: number;
  hash: string;
  previousHash: string;
  nonce: number;
}

const BlockchainStatus = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [consensusLevel, setConsensusLevel] = useState(98);
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'warning' | 'error'>('verified');
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const refreshData = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    toast.info("Refreshing blockchain data...");
  };
  
  useEffect(() => {
    // Generate blockchain historical data
    const timestamps = Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - 23 + i);
      return date.toISOString().substr(11, 5);
    });
    
    const data = timestamps.map(timestamp => ({
      timestamp,
      consensus: 95 + Math.random() * 5,
      blockTime: 2 + Math.random() * 2,
      transactions: Math.floor(10 + Math.random() * 40)
    }));
    
    setNetworkData(data);
    
    // Generate blockchain blocks
    const generateBlocks = (): BlockData[] => {
      const blocks: BlockData[] = [];
      
      for (let i = 10; i > 0; i--) {
        const date = new Date();
        date.setMinutes(date.getMinutes() - i);
        
        const prevHash = i === 10 
          ? "0000000000000000000000000000000000000000000000000000000000000000" 
          : blocks[blocks.length - 1].hash;
        
        const hash = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        blocks.push({
          id: (1032 - 10 + i).toString(),
          timestamp: date.toISOString().replace('T', ' ').substr(0, 19),
          transactions: Math.floor(Math.random() * 5) + 1,
          hash,
          previousHash: prevHash,
          nonce: Math.floor(Math.random() * 10000)
        });
      }
      
      return blocks;
    };
    
    // Simulate blockchain data loading
    setTimeout(() => {
      setBlocks(generateBlocks());
      setIsLoading(false);
      
      // Simulate blockchain warning event after 5 seconds
      setTimeout(() => {
        setVerificationStatus('warning');
        setConsensusLevel(87);
        
        toast.warning("Blockchain Verification Warning", {
          description: "Possible tampering detected. Blockchain consensus dropped to 87%.",
          action: {
            label: "Investigate",
            onClick: () => console.log("Investigating blockchain alert"),
          },
        });
      }, 5000);
    }, 1500);
  }, [refreshKey]);
  
  const chartLines = [
    { dataKey: "consensus", color: "#60a5fa", name: "Consensus %" },
  ];
  
  const blockTimeLines = [
    { dataKey: "blockTime", color: "#c084fc", name: "Block Time (s)" },
  ];
  
  const transactionLines = [
    { dataKey: "transactions", color: "#4ade80", name: "Transactions" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blockchain Status</h1>
        <Button onClick={refreshData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network Consensus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">{consensusLevel}%</div>
              <Progress 
                value={consensusLevel} 
                className={cn(
                  "h-2 mt-2 w-full",
                  verificationStatus === "verified" ? "bg-green-500/20" : 
                  verificationStatus === "warning" ? "bg-yellow-500/20" : "bg-red-500/20"
                )}
              />
              <div className="mt-4">
                <Badge 
                  variant={verificationStatus === "verified" ? "default" : verificationStatus === "warning" ? "outline" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {verificationStatus === "verified" ? <CheckCircle2 className="h-3 w-3" /> : 
                   verificationStatus === "warning" ? <Shield className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  <span>{
                    verificationStatus === "verified" ? "Blockchain Verified" : 
                    verificationStatus === "warning" ? "Verification Warning" : "Verification Failed"
                  }</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">4</div>
              <div className="flex gap-2 mt-4">
                <div className="w-full h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium border border-primary/30">
                  Node 1
                </div>
                <div className="w-full h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium border border-primary/30">
                  Node 2
                </div>
                <div className="w-full h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium border border-primary/30">
                  Node 3
                </div>
                <div className="w-full h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium border border-primary/30">
                  Node 4
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest Block Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">2.4s</div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                <ArrowRight className="h-3 w-3" />
                <span>3.1% faster than average</span>
              </div>
              <div className="mt-4 w-full">
                <div className="text-xs text-muted-foreground mb-1">Block time history</div>
                <div className="h-8 bg-secondary/30 rounded-md flex items-end p-1 gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary/70 rounded-sm" 
                      style={{ height: `${30 + Math.random() * 70}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BlockchainStatusCard 
          title="Block Explorer"
          description="Explore the latest blocks in the blockchain"
          blocks={blocks}
          consensusLevel={consensusLevel}
          verificationStatus={verificationStatus}
        />
        
        <Tabs defaultValue="consensus">
          <TabsList className="w-full">
            <TabsTrigger value="consensus" className="flex-1">Consensus</TabsTrigger>
            <TabsTrigger value="blockTime" className="flex-1">Block Time</TabsTrigger>
            <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="consensus" className="mt-0 pt-4">
            <Card className="glass-card border-0">
              <CardContent className="p-0">
                <LineChart 
                  data={networkData}
                  lines={chartLines}
                  title="Network Consensus"
                  description="Blockchain network consensus over time"
                  xAxisDataKey="timestamp"
                  yAxisLabel="%"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="blockTime" className="mt-0 pt-4">
            <Card className="glass-card border-0">
              <CardContent className="p-0">
                <LineChart 
                  data={networkData}
                  lines={blockTimeLines}
                  title="Block Time"
                  description="Average time to create a block"
                  xAxisDataKey="timestamp"
                  yAxisLabel="Seconds"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="transactions" className="mt-0 pt-4">
            <Card className="glass-card border-0">
              <CardContent className="p-0">
                <LineChart 
                  data={networkData}
                  lines={transactionLines}
                  title="Transactions"
                  description="Number of transactions per block"
                  xAxisDataKey="timestamp"
                  yAxisLabel="Count"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5 text-primary" />
            Blockchain Security Features
          </CardTitle>
          <CardDescription>
            How blockchain secures IoT data in traffic management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Immutable Ledger</h3>
                <p className="text-xs text-muted-foreground">
                  Once data is recorded in the blockchain, it cannot be altered without consensus, preventing tampering with traffic counts.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-medium">Consensus Mechanism</h3>
                <p className="text-xs text-muted-foreground">
                  Multiple nodes validate each transaction, ensuring that only legitimate traffic data is added to the blockchain.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Blocks className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-medium">Cryptographic Verification</h3>
                <p className="text-xs text-muted-foreground">
                  Each block is cryptographically linked to previous blocks, making it impossible to modify historical traffic data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainStatus;

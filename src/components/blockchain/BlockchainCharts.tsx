
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import LineChart from "@/components/charts/LineChart";

interface BlockchainChartsProps {
  networkData: Array<{
    timestamp: string;
    consensus: number;
    blockTime: number;
    transactions: number;
  }>;
}

const BlockchainCharts = ({ networkData }: BlockchainChartsProps) => {
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
  );
};

export default BlockchainCharts;

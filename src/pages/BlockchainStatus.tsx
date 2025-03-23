
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import BlockchainStatusCard from "@/components/blockchain/BlockchainStatus";
import NetworkStatusCards from "@/components/blockchain/NetworkStatusCards";
import BlockchainCharts from "@/components/blockchain/BlockchainCharts";
import SecurityFeatures from "@/components/blockchain/SecurityFeatures";
import { useBlockchainData } from "@/hooks/useBlockchainData";

const BlockchainStatus = () => {
  const { 
    blocks, 
    isLoading, 
    consensusLevel, 
    verificationStatus, 
    networkData, 
    refreshData 
  } = useBlockchainData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blockchain Status</h1>
        <Button onClick={refreshData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <NetworkStatusCards 
        consensusLevel={consensusLevel}
        verificationStatus={verificationStatus}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BlockchainStatusCard 
          title="Block Explorer"
          description="Explore the latest blocks in the blockchain"
          blocks={blocks}
          consensusLevel={consensusLevel}
          verificationStatus={verificationStatus}
        />
        
        <BlockchainCharts networkData={networkData} />
      </div>
      
      <SecurityFeatures />
    </div>
  );
};

export default BlockchainStatus;

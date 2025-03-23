
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface BlockData {
  id: string;
  timestamp: string;
  transactions: number;
  hash: string;
  previousHash: string;
  nonce: number;
}

export interface NetworkData {
  timestamp: string;
  consensus: number;
  blockTime: number;
  transactions: number;
}

export const useBlockchainData = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [consensusLevel, setConsensusLevel] = useState(98);
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'warning' | 'error'>('verified');
  const [networkData, setNetworkData] = useState<NetworkData[]>([]);
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

  return {
    blocks,
    isLoading,
    consensusLevel,
    verificationStatus,
    networkData,
    refreshData
  };
};

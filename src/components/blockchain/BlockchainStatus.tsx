
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Blocks, CheckCircle2, Database, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface BlockData {
  id: string;
  timestamp: string;
  transactions: number;
  hash: string;
  previousHash: string;
  nonce: number;
}

interface BlockchainStatusProps {
  title: string;
  description?: string;
  className?: string;
  blocks?: BlockData[];
  consensusLevel?: number;
  verificationStatus?: 'verified' | 'warning' | 'error';
}

const BlockchainStatus = ({
  title,
  description,
  className,
  blocks = [],
  consensusLevel = 98,
  verificationStatus = 'verified',
}: BlockchainStatusProps) => {
  const [animatedConsensus, setAnimatedConsensus] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConsensus(consensusLevel);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [consensusLevel]);

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verified':
        return "bg-green-500";
      case 'warning':
        return "bg-yellow-500";
      case 'error':
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const getStatusText = () => {
    switch (verificationStatus) {
      case 'verified':
        return "Blockchain Verified";
      case 'warning':
        return "Verification Warning";
      case 'error':
        return "Verification Failed";
      default:
        return "Blockchain Verified";
    }
  };

  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Blocks className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Badge 
            variant={verificationStatus === "verified" ? "default" : verificationStatus === "warning" ? "outline" : "destructive"}
            className="flex items-center gap-1"
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Network Consensus</span>
            <span className="text-sm">{animatedConsensus}%</span>
          </div>
          <Progress 
            value={animatedConsensus} 
            className="h-2" 
            indicatorClassName={verificationStatus === "verified" ? "bg-green-500" : verificationStatus === "warning" ? "bg-yellow-500" : "bg-red-500"}
          />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            Latest Blocks
          </h3>
          <div className="space-y-2 mt-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
            {blocks.map((block, index) => (
              <div 
                key={block.id}
                className="p-2 bg-secondary/30 border border-white/10 rounded-md text-xs animate-slideIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between">
                  <span className="font-medium">Block #{block.id}</span>
                  <span className="text-muted-foreground">{block.timestamp}</span>
                </div>
                <div className="mt-1 text-muted-foreground truncate">
                  Hash: {block.hash.substring(0, 20)}...
                </div>
                <div className="flex justify-between mt-1">
                  <span>Tx: {block.transactions}</span>
                  <span className="flex items-center gap-1">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      getStatusColor()
                    )}></span>
                    Verified
                  </span>
                </div>
              </div>
            ))}
            {blocks.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No blocks available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainStatus;

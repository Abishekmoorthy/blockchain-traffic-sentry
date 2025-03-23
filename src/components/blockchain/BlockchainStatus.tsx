
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Blocks, ArrowRightToLine, ChevronsRight, Shield, CheckCircle2, Info, XCircle } from "lucide-react";

interface BlockchainStatusCardProps {
  title: string;
  description: string;
  blocks: {
    id: string;
    timestamp: string;
    transactions: number;
    hash: string;
    previousHash: string;
    nonce: number;
  }[];
  consensusLevel: number;
  verificationStatus: 'verified' | 'warning' | 'error';
}

const BlockchainStatusCard = ({
  title,
  description,
  blocks,
  consensusLevel,
  verificationStatus
}: BlockchainStatusCardProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Blocks className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
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
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Consensus:</span>
            <Progress 
              value={consensusLevel} 
              className={cn(
                "h-2 w-20",
                verificationStatus === "verified" ? "bg-green-500/20" : 
                verificationStatus === "warning" ? "bg-yellow-500/20" : "bg-red-500/20"
              )}
            />
            <span className="text-xs font-medium">{consensusLevel}%</span>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[80px] text-center">Tx</TableHead>
                <TableHead className="hidden md:table-cell">Hash</TableHead>
                <TableHead className="text-right w-[70px]">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block, index) => (
                <TableRow key={block.id}>
                  <TableCell className="font-mono text-xs">{block.id}</TableCell>
                  <TableCell className="text-xs">{block.timestamp}</TableCell>
                  <TableCell className="text-center">{block.transactions}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="font-mono text-xs truncate max-w-[200px]">
                      {block.hash}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainStatusCard;

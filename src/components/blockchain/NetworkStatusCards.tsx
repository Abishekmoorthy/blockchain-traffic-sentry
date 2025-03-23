
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface NetworkStatusCardsProps {
  consensusLevel: number;
  verificationStatus: 'verified' | 'warning' | 'error';
}

const NetworkStatusCards = ({ consensusLevel, verificationStatus }: NetworkStatusCardsProps) => {
  return (
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
  );
};

export default NetworkStatusCards;

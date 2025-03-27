
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lock, Unlock, ShieldAlert, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface TrafficLightCardProps {
  id: string;
  title: string;
  vehicleCount: number;
  secure: boolean;
  lightState: 'red' | 'yellow' | 'green';
  className?: string;
}

const TrafficLightCard = ({
  id,
  title,
  vehicleCount,
  secure,
  lightState,
  className,
}: TrafficLightCardProps) => {
  return (
    <Card className={cn("glass-card border overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant={secure ? "default" : "destructive"}
            className="flex items-center gap-1 px-2 py-1"
          >
            {secure 
              ? <Lock className="h-3 w-3" /> 
              : <AlertCircle className="h-3 w-3" />
            }
            <span>{secure ? "Secure" : "Alert"}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center mt-4">
          <div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-md">
            <div className="flex flex-col gap-2">
              <div className={cn("light-red", lightState === 'red' && "active")}></div>
              <div className={cn("light-yellow", lightState === 'yellow' && "active")}></div>
              <div className={cn("light-green", lightState === 'green' && "active")}></div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col items-center">
            <div className="text-lg font-bold">{vehicleCount}</div>
            <p className="text-xs text-muted-foreground">Vehicles Detected</p>
          </div>
          
          <div className="mt-2 text-xs text-center">
            {secure ? (
              <span className="text-green-500 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> Blockchain Verified
              </span>
            ) : (
              <span className="text-red-500 flex items-center justify-center gap-1">
                <Unlock className="h-3 w-3" /> Tamper Detected
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficLightCard;

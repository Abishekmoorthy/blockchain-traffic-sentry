
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lock, Unlock, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";

interface TrafficLightCardProps {
  id: string;
  title: string;
  vehicleCount: number;
  secure: boolean;
  className?: string;
}

const TrafficLightCard = ({
  id,
  title,
  vehicleCount,
  secure,
  className,
}: TrafficLightCardProps) => {
  const [lightState, setLightState] = useState<'red' | 'yellow' | 'green'>();

  useEffect(() => {
    // Logic to determine traffic light color based on vehicle count
    if (vehicleCount < 10) {
      setLightState('green');
    } else if (vehicleCount < 20) {
      setLightState('yellow');
    } else {
      setLightState('red');
    }
  }, [vehicleCount]);

  return (
    <Card className={cn("glass-card border overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          "p-1.5 rounded-full flex items-center",
          secure 
            ? "bg-green-500/10 text-green-500 border border-green-500/30" 
            : "bg-red-500/10 text-red-500 border border-red-500/30"
        )}>
          {secure 
            ? <Lock className="h-3.5 w-3.5" /> 
            : <ShieldAlert className="h-3.5 w-3.5" />
          }
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
